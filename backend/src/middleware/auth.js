const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "lumi_secret_jwt_signature_key_2026";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // For local development convenience, allow demo user if no token provided
    req.user = { id: "u-demo", email: "shru@lumi.app" };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
};
