import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(
  cors({
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.options(/^\/api\/v2\/.*/, (req, res) => {
  res.sendStatus(200);
});

app.all(/^\/api\/v2\/.*/, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const serverUrl = req.query.server;

    if (!authHeader) {
      return res.status(400).json({ error: "Missing Authorization header" });
    }

    if (!serverUrl) {
      return res.status(400).json({ error: "Missing server URL parameter" });
    }

    const apiPath = req.path;

    const filteredQuery = new URLSearchParams(req.query);
    filteredQuery.delete("server");
    const finalQueryString = filteredQuery.toString();

    const targetUrl = `${serverUrl}${apiPath}${finalQueryString ? `?${finalQueryString}` : ""}`;

    console.log(`Proxying ${req.method} request to: ${targetUrl}`);

    const fetchOptions = {
      method: req.method,
      headers: {
        Authorization: authHeader,
      },
    };

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      fetchOptions.headers["Content-Type"] = "application/json";
      if (req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    console.log(
      `${req.method} response:`,
      text.substring(0, 200) + (text.length > 200 ? "..." : "")
    );

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    if (contentType && contentType.includes("application/json")) {
      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        res.status(500).json({
          error: "Failed to parse JSON response",
          raw: text,
        });
      }
    } else {
      res.set("Content-Type", contentType || "text/plain");
      res.send(text);
    }
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Proxy fetch failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
