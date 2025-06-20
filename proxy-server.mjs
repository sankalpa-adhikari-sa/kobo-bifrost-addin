import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import getRawBody from "raw-body";

const app = express();
const PORT = 5000;

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

    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];

    let body;
    if (req.method === "GET" || req.method === "HEAD") {
      body = undefined;
    } else {
      try {
        body = await getRawBody(req, {
          length: req.headers["content-length"],
          limit: "50mb",
          encoding: null,
        });
      } catch (error) {
        console.error("Error reading request body:", error);
        return res.status(400).json({ error: "Failed to read request body" });
      }
    }

    const fetchOptions = {
      method: req.method,
      headers,
      body,
    };

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

// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";
// import getRawBody from "raw-body";

// const app = express();
// const PORT = 5000;

// app.use(
//   cors({
//     origin: "https://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Authorization", "Content-Type"],
//   })
// );

// app.options(/^\/api\/v2\/.*/, (req, res) => {
//   res.sendStatus(200);
// });

// app.all(/^\/api\/v2\/.*/, async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const serverUrl = req.query.server;

//     if (!authHeader) {
//       return res.status(400).json({ error: "Missing Authorization header" });
//     }

//     if (!serverUrl) {
//       return res.status(400).json({ error: "Missing server URL parameter" });
//     }

//     const apiPath = req.path;

//     const filteredQuery = new URLSearchParams(req.query);
//     filteredQuery.delete("server");
//     const finalQueryString = filteredQuery.toString();

//     const targetUrl = `${serverUrl}${apiPath}${finalQueryString ? `?${finalQueryString}` : ""}`;

//     console.log(`Proxying ${req.method} request to: ${targetUrl}`);

//     const headers = { ...req.headers };
//     delete headers.host;
//     delete headers["content-length"];

//     let body;
//     if (req.method === "GET" || req.method === "HEAD") {
//       body = undefined;
//     } else {
//       try {
//         body = await getRawBody(req, {
//           length: req.headers["content-length"],
//           limit: "50mb",
//           encoding: null,
//         });
//       } catch (error) {
//         console.error("Error reading request body:", error);
//         return res.status(400).json({ error: "Failed to read request body" });
//       }
//     }

//     const fetchOptions = {
//       method: req.method,
//       headers,
//       body,
//     };

//     const response = await fetch(targetUrl, fetchOptions);
//     const contentType = response.headers.get("content-type");

//     // Fix: Handle binary/blob responses properly
//     const isDownloadRequest = apiPath.includes(".xls") || apiPath.includes(".xml");

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`${req.method} error response:`, errorText);
//       return res.status(response.status).send(errorText);
//     }

//     // Fix: Handle different response types correctly
//     if (
//       isDownloadRequest ||
//       (contentType &&
//         (contentType.includes("application/octet-stream") ||
//           contentType.includes("application/vnd.ms-excel") ||
//           contentType.includes("application/xml") ||
//           contentType.includes("text/xml")))
//     ) {
//       // Handle binary/file downloads
//       const buffer = await response.buffer();

//       // Set appropriate headers for file download
//       if (contentType) {
//         res.set("Content-Type", contentType);
//       }

//       // Copy other relevant headers
//       const contentDisposition = response.headers.get("content-disposition");
//       if (contentDisposition) {
//         res.set("Content-Disposition", contentDisposition);
//       }

//       const contentLength = response.headers.get("content-length");
//       if (contentLength) {
//         res.set("Content-Length", contentLength);
//       }

//       console.log(`${req.method} binary response: ${buffer.length} bytes`);
//       res.send(buffer);
//     } else if (contentType && contentType.includes("application/json")) {
//       // Handle JSON responses
//       const text = await response.text();
//       console.log(
//         `${req.method} JSON response:`,
//         text.substring(0, 200) + (text.length > 200 ? "..." : "")
//       );

//       try {
//         const data = JSON.parse(text);
//         res.json(data);
//       } catch (parseError) {
//         console.error("JSON parse error:", parseError);
//         res.status(500).json({
//           error: "Failed to parse JSON response",
//           raw: text,
//         });
//       }
//     } else {
//       // Handle text responses
//       const text = await response.text();
//       console.log(
//         `${req.method} text response:`,
//         text.substring(0, 200) + (text.length > 200 ? "..." : "")
//       );

//       res.set("Content-Type", contentType || "text/plain");
//       res.send(text);
//     }
//   } catch (err) {
//     console.error("Proxy fetch error:", err);
//     res.status(500).json({
//       error: "Proxy fetch failed",
//       details: err.message,
//       stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Proxy running on http://localhost:${PORT}`);
// });
