const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const apiRouter = require("./routes/api");

const app = express();

// Enable CORS for frontend clients
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[LUMI API] ${req.method} ${req.url}`);
  next();
});

// Root welcome route
app.get("/", (req, res) => {
  res.send("✧ LUMI Life OS API is running 🌙");
});

// Health check route with safe database connectivity test
app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";

  try {
    await pool.query("SELECT 1");
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "disconnected";
  }

  res.json({
    status: "ok",
    app: "LUMI Life OS",
    version: "1.0.0",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount all modular application routes
app.use("/api", apiRouter);

// Global 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "An unexpected server error occurred",
  });
});

module.exports = app;