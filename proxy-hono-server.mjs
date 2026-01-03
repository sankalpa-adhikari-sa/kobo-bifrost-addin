import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

const app = new Hono();
const PORT = 5000;

app.use(
  "*",
  cors({
    origin: "https://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
  })
);

const proxyHandler = async (c) => {
  try {
    const authHeader = c.req.header("authorization");
    const serverUrl = c.req.query("server");

    if (!authHeader) {
      return c.json({ error: "Missing Authorization header" }, 400);
    }

    if (!serverUrl) {
      return c.json({ error: "Missing server URL parameter" }, 400);
    }


    const currentUrl = new URL(c.req.url);
    currentUrl.searchParams.delete("server"); 
        const targetUrl = `${serverUrl}${c.req.path}${currentUrl.search}`;

    console.log(`Proxying ${c.req.method} request to: ${targetUrl}`);

    const headers = new Headers(c.req.raw.headers);
    headers.delete("host");
    headers.delete("content-length");


    let body;
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      try {
        body = await c.req.arrayBuffer();
      } catch (error) {
        console.error("Error reading request body:", error);
        return c.json({ error: "Failed to read request body" }, 400);
      }
    }

    const fetchOptions = {
      method: c.req.method,
      headers: headers,
      body: body,
    };

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get("content-type");

    const isBinaryFile =
      contentType &&
      (contentType.includes("application/vnd.openxmlformats-officedocument") ||
        contentType.includes("application/vnd.ms-excel") ||
        contentType.includes("application/pdf") ||
        contentType.includes("application/zip") ||
        contentType.includes("application/octet-stream") ||
        contentType.includes("image/") ||
        contentType.includes("video/") ||
        contentType.includes("audio/"));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(
        `${c.req.method} error response:`,
        errorText.substring(0, 200) + (errorText.length > 200 ? "..." : "")
      );
      return c.text(errorText, response.status);
    }


    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!["content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    if (isBinaryFile) {
      console.log(`${c.req.method} binary file response - Content-Type: ${contentType}`);
      const buffer = await response.arrayBuffer();
      return c.body(buffer, response.status, responseHeaders);
    } else if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      console.log(
        `${c.req.method} JSON response:`,
        text.substring(0, 200) + (text.length > 200 ? "..." : "")
      );
      try {
        const data = JSON.parse(text);
            return c.json(data, response.status, Object.fromEntries(responseHeaders));
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return c.json(
          { error: "Failed to parse JSON response", raw: text },
          500
        );
      }
    } else {
      const text = await response.text();
      console.log(
        `${c.req.method} text response:`,
        text.substring(0, 200) + (text.length > 200 ? "..." : "")
      );
      return c.body(text, response.status, responseHeaders);
    }
  } catch (err) {
    console.error("Proxy fetch error:", err);
    return c.json({ error: "Proxy fetch failed", details: err.message }, 500);
  }
};

app.all("/api/v2/*", proxyHandler);
app.all("/me", proxyHandler);
app.all("/me/", proxyHandler);
console.log(`Proxy running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});