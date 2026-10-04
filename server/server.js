const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("LUMI backend is running 🌙");
});

app.listen(PORT, () => {
  console.log(`LUMI backend running on http://localhost:${PORT}`);
});