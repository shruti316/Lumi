const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "lumi_secret_jwt_signature_key_2026";

/**
 * Authentication middleware to verify JWT bearer tokens.
 * Enforces authentication on protected routes:
 * - 401 Unauthorized if no Bearer token is provided
 * - 403 Forbidden if token is invalid or expired
 * - populates req.user with decoded token payload upon success
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Authentication token is required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
};
