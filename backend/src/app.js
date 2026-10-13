
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const apiRouter = require("./routes/api");

const app = express();

// CORS configuration for local development and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as health checks
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsing (support media uploads up to 50 MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[LUMI API] ${req.method} ${req.url}`);
  next();
});

// Root welcome route
app.get("/", (req, res) => {
  res.send("LUMI Life OS API is running");
});

// Health check with database connectivity test
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      app: "LUMI Life OS",
      version: "1.0.0",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[LUMI DB] Health check failed:", err.message);

    res.status(503).json({
      status: "error",
      app: "LUMI Life OS",
      version: "1.0.0",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// Application API routes
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[LUMI API] Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.message === "Origin not allowed by CORS" ? 403 : 500;

  res.status(status).json({
    error:
      status === 403
        ? "Origin not allowed"
        : "An unexpected server error occurred",
  });
});

module.exports = app;
