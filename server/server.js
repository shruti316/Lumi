const express = require("express");

const app = express();
const PORT = 5000;

// -------------------------
// Middleware
// -------------------------

// Allows Express to read JSON request bodies
app.use(express.json());

// -------------------------
// Basic Route
// -------------------------

app.get("/", (req, res) => {
  res.send("LUMI backend is running 🌙");
});

// -------------------------
// Health Check API
// -------------------------

app.get("/api/health", (req, res) => {
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  res.json({
    status: "ok",
    message: "LUMI backend is healthy",
  });
});

// -------------------------
// Route Parameters Demo
// -------------------------

app.get("/api/tasks/:id", (req, res) => {
  console.log("Params:", req.params);

  res.json({
    message: "Task received",
    taskId: req.params.id,
  });
});

// -------------------------
// Query Parameters Demo
// -------------------------

app.get("/api/search", (req, res) => {
  console.log("Query:", req.query);

  res.json({
    message: "Query received",
    query: req.query,
  });
});

// -------------------------
// POST Request Demo
// -------------------------

app.post("/api/tasks", (req, res) => {
  console.log("Body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);

  res.status(201).json({
    message: "Task received",
    task: req.body,
  });
});

// -------------------------
// Start Server
// -------------------------

app.listen(PORT, () => {
  console.log(`LUMI backend running on http://localhost:${PORT}`);
});