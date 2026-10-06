const app = require("./src/app");
const { initDatabase } = require("./src/config/initDb");

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`LUMI backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    app.listen(PORT, () => {
      console.log(`LUMI backend running on http://localhost:${PORT} (Database pending)`);
    });
  });