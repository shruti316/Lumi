const pool = require("../config/db");

/**
 * Normalizes a database row into a standard user object.
 * Maps snake_case column names to camelCase and optionally includes the password hash.
 */
function formatUser(row, includePassword = false) {
  if (!row) return null;

  const user = {
    id: row.id,
    email: row.email,
    name: row.name,
    bio: row.bio,
    theme: row.theme,
    createdAt: row.created_at,
  };

  if (includePassword) {
    user.passwordHash = row.password_hash;
  }

  return user;
}

/**
 * Finds a user by email address.
 * Returns user with passwordHash for internal authentication verification.
 */
async function findUserByEmail(email) {
  if (!email) return null;

  const [rows] = await pool.query(
    "SELECT id, email, password_hash, name, bio, theme, created_at FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [email.trim()]
  );

  if (rows.length === 0) {
    return null;
  }

  return formatUser(rows[0], true);
}

/**
 * Finds a user by unique ID.
 * Returns user without password hash.
 */
async function findUserById(id) {
  if (!id) return null;

  const [rows] = await pool.query(
    "SELECT id, email, name, bio, theme, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return formatUser(rows[0], false);
}

/**
 * Inserts a new user into MySQL.
 */
async function createUser({ id, email, passwordHash, name, bio, theme }) {
  const userId = id || `u-${Date.now()}`;
  const userBio = bio || "Crafting beautiful days with LUMI ✨";
  const userTheme = theme || "light";

  await pool.query(
    "INSERT INTO users (id, email, password_hash, name, bio, theme) VALUES (?, ?, ?, ?, ?, ?)",
    [
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      name || email.split("@")[0],
      userBio,
      userTheme,
    ]
  );

  return findUserById(userId);
}

/**
 * Updates profile fields (name, bio, theme) for an existing user in MySQL.
 */
async function updateUser(id, updates = {}) {
  const allowedFields = ["name", "bio", "theme"];
  const setClauses = [];
  const values = [];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      values.push(updates[field]);
    }
  }

  if (setClauses.length === 0) {
    return findUserById(id);
  }

  values.push(id);
  const sql = `UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`;

  await pool.query(sql, values);

  return findUserById(id);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};