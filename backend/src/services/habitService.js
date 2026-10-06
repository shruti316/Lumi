const crypto = require("crypto");
const pool = require("../config/db");

/**
 * Normalizes a habit database row with its completed dates list.
 */
function formatHabit(row, completedDates = []) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category || "Daily",
    icon: row.icon || "Sparkles",
    color: row.color || "#9E96D8",
    targetDaysPerWeek: row.target_days_per_week || 7,
    completedDates,
    createdAt: row.created_at,
  };
}

/**
 * Retrieves all habits for a specific user along with completion dates.
 */
async function getHabitsByUserId(userId) {
  const [habitRows] = await pool.query(
    "SELECT id, user_id, name, category, icon, color, target_days_per_week, created_at FROM habits WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  if (habitRows.length === 0) {
    return [];
  }

  const habitIds = habitRows.map((h) => h.id);
  const [completionRows] = await pool.query(
    "SELECT habit_id, completed_date FROM habit_completions WHERE habit_id IN (?) ORDER BY completed_date ASC",
    [habitIds]
  );

  const completionsMap = {};
  for (const c of completionRows) {
    if (!completionsMap[c.habit_id]) {
      completionsMap[c.habit_id] = [];
    }
    completionsMap[c.habit_id].push(c.completed_date);
  }

  return habitRows.map((h) => formatHabit(h, completionsMap[h.id] || []));
}

/**
 * Retrieves a single habit by ID and user ID.
 */
async function getHabitById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, name, category, icon, color, target_days_per_week, created_at FROM habits WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );

  if (rows.length === 0) return null;

  const [completionRows] = await pool.query(
    "SELECT completed_date FROM habit_completions WHERE habit_id = ? ORDER BY completed_date ASC",
    [id]
  );

  return formatHabit(rows[0], completionRows.map((c) => c.completed_date));
}

/**
 * Creates a new habit for a user.
 */
async function createHabit({ id, userId, name, category, icon, color, targetDaysPerWeek }) {
  const habitId = id || crypto.randomUUID();
  const habitCategory = category || "Daily";
  const habitIcon = icon || "Sparkles";
  const habitColor = color || "#9E96D8";
  const targetDays = Number(targetDaysPerWeek) || 7;

  await pool.query(
    "INSERT INTO habits (id, user_id, name, category, icon, color, target_days_per_week) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [habitId, userId, name.trim(), habitCategory, habitIcon, habitColor, targetDays]
  );

  return getHabitById(habitId, userId);
}

/**
 * Toggles a habit completion for a specific date (adds if missing, removes if present).
 */
async function toggleHabit(id, userId, date) {
  const habit = await getHabitById(id, userId);
  if (!habit) return null;

  const dateStr = date || new Date().toISOString().split("T")[0];

  const [existing] = await pool.query(
    "SELECT id FROM habit_completions WHERE habit_id = ? AND completed_date = ? LIMIT 1",
    [id, dateStr]
  );

  if (existing.length > 0) {
    await pool.query("DELETE FROM habit_completions WHERE habit_id = ? AND completed_date = ?", [id, dateStr]);
  } else {
    await pool.query("INSERT INTO habit_completions (habit_id, completed_date) VALUES (?, ?)", [id, dateStr]);
  }

  return getHabitById(id, userId);
}

/**
 * Deletes a habit and its completions for an authenticated user.
 */
async function deleteHabit(id, userId) {
  const [result] = await pool.query("DELETE FROM habits WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getHabitsByUserId,
  getHabitById,
  createHabit,
  toggleHabit,
  deleteHabit,
};
