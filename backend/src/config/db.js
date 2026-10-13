
const path = require("path");
const fs = require("fs");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const mysql = require("mysql2/promise");

const isProduction = process.env.NODE_ENV === "production";

let ssl;

if (isProduction) {
  const caPath = path.resolve(__dirname, "../../certs/ca.pem");

  if (!fs.existsSync(caPath)) {
    throw new Error(`Aiven CA certificate not found: ${caPath}`);
  }

  ssl = {
    ca: fs.readFileSync(caPath, "utf8"),
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lumi",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(ssl ? { ssl } : {}),
});

module.exports = pool;

