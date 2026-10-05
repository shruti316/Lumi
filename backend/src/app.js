require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");

const app = express();

// Enable CORS for frontend clients
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "LUMI Life OS",
    version: "1.0.0",
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
  res.status(500).json({ error: "An unexpected server error occurred" });
});

module.exports = app;