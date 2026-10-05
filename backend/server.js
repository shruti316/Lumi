const app = require("./src/app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`LUMI backend running on http://localhost:${PORT}`);
});