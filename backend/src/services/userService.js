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

/**
 * Transactionally wipes all application domain data for the specified user ID.
 * Leaves the user account and credentials intact.
 */
async function resetUserData(userId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Tasks
    await conn.query("DELETE FROM tasks WHERE user_id = ?", [userId]);

    // 2. Habits and habit completions
    await conn.query(
      "DELETE FROM habit_completions WHERE habit_id IN (SELECT id FROM habits WHERE user_id = ?)",
      [userId]
    );
    await conn.query("DELETE FROM habits WHERE user_id = ?", [userId]);

    // 3. Goals and milestones
    await conn.query(
      "DELETE FROM goal_milestones WHERE goal_id IN (SELECT id FROM goals WHERE user_id = ?)",
      [userId]
    );
    await conn.query("DELETE FROM goals WHERE user_id = ?", [userId]);

    // 4. Notes and tags
    await conn.query(
      "DELETE FROM note_tags WHERE note_id IN (SELECT id FROM notes WHERE user_id = ?)",
      [userId]
    );
    await conn.query("DELETE FROM notes WHERE user_id = ?", [userId]);

    // 5. Projects and subtasks
    await conn.query(
      "DELETE FROM project_subtasks WHERE project_id IN (SELECT id FROM projects WHERE user_id = ?)",
      [userId]
    );
    await conn.query("DELETE FROM projects WHERE user_id = ?", [userId]);

    // 6. Journals
    await conn.query("DELETE FROM journals WHERE user_id = ?", [userId]);

    // 7. Memories, tags, comments, reactions
    await conn.query(
      "DELETE FROM memory_tags WHERE memory_id IN (SELECT id FROM memories WHERE user_id = ?)",
      [userId]
    );
    await conn.query(
      "DELETE FROM memory_comments WHERE user_id = ? OR memory_id IN (SELECT id FROM memories WHERE user_id = ?)",
      [userId, userId]
    );
    await conn.query(
      "DELETE FROM memory_reactions WHERE user_id = ? OR memory_id IN (SELECT id FROM memories WHERE user_id = ?)",
      [userId, userId]
    );
    await conn.query("DELETE FROM memories WHERE user_id = ?", [userId]);

    // 8. Books
    await conn.query("DELETE FROM books WHERE user_id = ?", [userId]);

    // 9. Messages sent by user & conversation participations
    await conn.query("DELETE FROM messages WHERE sender_id = ?", [userId]);
    await conn.query("DELETE FROM conversation_participants WHERE user_id = ?", [userId]);

    // 10. Focus Sessions
    await conn.query("DELETE FROM focus_sessions WHERE user_id = ?", [userId]);

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  resetUserData,
};