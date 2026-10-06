const crypto = require("crypto");
const pool = require("../config/db");

/**
 * Normalizes a database row into a standard task object.
 */
function formatTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    priority: row.priority || "medium",
    completed: Boolean(row.completed),
    dueDate: row.due_date || "Today",
    category: row.category || "General",
    time: row.time || "",
    createdAt: row.created_at,
  };
}

/**
 * Retrieves all tasks belonging to a specific user.
 */
async function getTasksByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, priority, completed, due_date, category, time, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows.map(formatTask);
}

/**
 * Retrieves a single task by ID and user ID.
 */
async function getTaskById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, priority, completed, due_date, category, time, created_at FROM tasks WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  if (rows.length === 0) return null;
  return formatTask(rows[0]);
}

/**
 * Creates a new task for a user.
 */
async function createTask({ id, userId, title, priority, completed, dueDate, category, time }) {
  const taskId = id || crypto.randomUUID();
  const taskPriority = priority || "medium";
  const isCompleted = completed ? 1 : 0;
  const taskDueDate = dueDate || "Today";
  const taskCategory = category || "General";
  const taskTime = time || "";

  await pool.query(
    "INSERT INTO tasks (id, user_id, title, priority, completed, due_date, category, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [taskId, userId, title.trim(), taskPriority, isCompleted, taskDueDate, taskCategory, taskTime]
  );

  return getTaskById(taskId, userId);
}

/**
 * Updates a task ensuring user ownership.
 */
async function updateTask(id, userId, updates = {}) {
  const fieldMap = {
    title: "title",
    priority: "priority",
    completed: "completed",
    dueDate: "due_date",
    category: "category",
    time: "time",
  };

  const setClauses = [];
  const values = [];

  for (const [key, col] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      setClauses.push(`${col} = ?`);
      if (key === "completed") {
        values.push(updates[key] ? 1 : 0);
      } else {
        values.push(updates[key]);
      }
    }
  }

  if (setClauses.length === 0) {
    return getTaskById(id, userId);
  }

  values.push(id, userId);
  const sql = `UPDATE tasks SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`;

  const [result] = await pool.query(sql, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return getTaskById(id, userId);
}

/**
 * Deletes a task ensuring user ownership.
 */
async function deleteTask(id, userId) {
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getTasksByUserId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
