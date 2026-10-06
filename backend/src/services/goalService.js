const crypto = require("crypto");
const pool = require("../config/db");

/**
 * Normalizes a goal row and its milestones.
 */
function formatGoal(row, milestones = []) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || "",
    category: row.category || "Personal",
    targetDate: row.target_date || "",
    whyItMatters: row.why_it_matters || "",
    progress: Number(row.progress) || 0,
    status: row.status || "In Progress",
    milestones,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Retrieves all goals for a user.
 */
async function getGoalsByUserId(userId) {
  const [goalRows] = await pool.query(
    "SELECT id, user_id, title, description, category, target_date, why_it_matters, progress, status, created_at, updated_at FROM goals WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  if (goalRows.length === 0) return [];

  const goalIds = goalRows.map((g) => g.id);
  const [milestoneRows] = await pool.query(
    "SELECT id, goal_id, title, completed FROM goal_milestones WHERE goal_id IN (?) ORDER BY created_at ASC",
    [goalIds]
  );

  const milestonesMap = {};
  for (const m of milestoneRows) {
    if (!milestonesMap[m.goal_id]) milestonesMap[m.goal_id] = [];
    milestonesMap[m.goal_id].push(m.title); // existing frontend uses string array or objects
  }

  return goalRows.map((g) => formatGoal(g, milestonesMap[g.id] || []));
}

/**
 * Retrieves a single goal by ID and user ID.
 */
async function getGoalById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, description, category, target_date, why_it_matters, progress, status, created_at, updated_at FROM goals WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );

  if (rows.length === 0) return null;

  const [milestoneRows] = await pool.query(
    "SELECT id, goal_id, title, completed FROM goal_milestones WHERE goal_id = ? ORDER BY created_at ASC",
    [id]
  );

  return formatGoal(rows[0], milestoneRows.map((m) => m.title));
}

/**
 * Creates a new goal.
 */
async function createGoal({ id, userId, title, description, category, targetDate, whyItMatters, milestones = [] }) {
  const goalId = id || crypto.randomUUID();
  const goalDesc = description || "";
  const goalCat = category || "Personal";
  const goalTarget = targetDate || "";
  const goalWhy = whyItMatters || "";

  await pool.query(
    "INSERT INTO goals (id, user_id, title, description, category, target_date, why_it_matters, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'In Progress')",
    [goalId, userId, title.trim(), goalDesc, goalCat, goalTarget, goalWhy]
  );

  if (Array.isArray(milestones) && milestones.length > 0) {
    for (const item of milestones) {
      const milestoneTitle = typeof item === "string" ? item : item?.title;
      if (milestoneTitle && milestoneTitle.trim()) {
        await pool.query(
          "INSERT INTO goal_milestones (id, goal_id, title, completed) VALUES (?, ?, ?, 0)",
          [crypto.randomUUID(), goalId, milestoneTitle.trim()]
        );
      }
    }
  }

  return getGoalById(goalId, userId);
}

/**
 * Updates a goal and optionally resets milestones.
 */
async function updateGoal(id, userId, updates = {}) {
  const fieldMap = {
    title: "title",
    description: "description",
    category: "category",
    targetDate: "target_date",
    whyItMatters: "why_it_matters",
    progress: "progress",
    status: "status",
  };

  const setClauses = [];
  const values = [];

  for (const [key, col] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      setClauses.push(`${col} = ?`);
      values.push(updates[key]);
    }
  }

  if (setClauses.length > 0) {
    values.push(id, userId);
    const sql = `UPDATE goals SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return null;
  }

  if (Array.isArray(updates.milestones)) {
    await pool.query("DELETE FROM goal_milestones WHERE goal_id = ?", [id]);
    for (const item of updates.milestones) {
      const milestoneTitle = typeof item === "string" ? item : item?.title;
      if (milestoneTitle && milestoneTitle.trim()) {
        await pool.query(
          "INSERT INTO goal_milestones (id, goal_id, title, completed) VALUES (?, ?, ?, ?)",
          [crypto.randomUUID(), id, milestoneTitle.trim(), item?.completed ? 1 : 0]
        );
      }
    }
  }

  return getGoalById(id, userId);
}

/**
 * Deletes a goal.
 */
async function deleteGoal(id, userId) {
  const [result] = await pool.query("DELETE FROM goals WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getGoalsByUserId,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
};
