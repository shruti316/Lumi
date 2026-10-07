const crypto = require("crypto");
const pool = require("../config/db");

/**
 * Normalizes a focus session database row into a standard camelCase object.
 */
function formatSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id || null,
    taskTitle: row.task_title || null,
    mode: row.mode || "focus",
    durationMinutes: Number(row.duration_minutes) || 0,
    tag: row.tag || "Deep Work",
    notes: row.notes || null,
    completedAt: row.completed_at,
  };
}

/**
 * Records a completed focus or break session into MySQL.
 */
async function recordSession({
  userId,
  taskId = null,
  mode = "focus",
  durationMinutes = 25,
  tag = "Deep Work",
  notes = null,
}) {
  const sessionId = crypto.randomUUID();
  const validDuration = Math.max(1, parseInt(durationMinutes, 10) || 25);
  const validMode = ["focus", "short_break", "long_break"].includes(mode)
    ? mode
    : "focus";

  // If taskId provided, ensure task exists and belongs to user
  let validTaskId = null;
  if (taskId) {
    const [taskRows] = await pool.query(
      "SELECT id FROM tasks WHERE id = ? AND user_id = ? LIMIT 1",
      [taskId, userId]
    );
    if (taskRows.length > 0) {
      validTaskId = taskId;
    }
  }

  await pool.query(
    `INSERT INTO focus_sessions (id, user_id, task_id, mode, duration_minutes, tag, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      userId,
      validTaskId,
      validMode,
      validDuration,
      tag || "Deep Work",
      notes || null,
    ]
  );

  const [rows] = await pool.query(
    `SELECT fs.*, t.title AS task_title
     FROM focus_sessions fs
     LEFT JOIN tasks t ON fs.task_id = t.id
     WHERE fs.id = ? AND fs.user_id = ?
     LIMIT 1`,
    [sessionId, userId]
  );

  return formatSession(rows[0]);
}

/**
 * Retrieves the history of focus sessions for the authenticated user.
 */
async function getSessions(userId, limit = 50) {
  const [rows] = await pool.query(
    `SELECT fs.*, t.title AS task_title
     FROM focus_sessions fs
     LEFT JOIN tasks t ON fs.task_id = t.id
     WHERE fs.user_id = ?
     ORDER BY fs.completed_at DESC
     LIMIT ?`,
    [userId, parseInt(limit, 10) || 50]
  );

  return rows.map(formatSession);
}

/**
 * Aggregates statistics for the user (today's focus minutes, today's sessions, lifetime metrics).
 */
async function getStats(userId) {
  // 1. Today's focus metrics (completed today in focus mode)
  const [todayRows] = await pool.query(
    `SELECT 
       COALESCE(SUM(duration_minutes), 0) AS today_minutes,
       COUNT(id) AS today_sessions
     FROM focus_sessions
     WHERE user_id = ? 
       AND mode = 'focus'
       AND DATE(completed_at) = CURRENT_DATE()`,
    [userId]
  );

  // 2. Lifetime focus metrics
  const [lifetimeRows] = await pool.query(
    `SELECT 
       COALESCE(SUM(duration_minutes), 0) AS total_minutes,
       COUNT(id) AS total_sessions
     FROM focus_sessions
     WHERE user_id = ? 
       AND mode = 'focus'`,
    [userId]
  );

  // 3. Tag breakdown
  const [tagRows] = await pool.query(
    `SELECT 
       tag,
       COUNT(id) AS session_count,
       COALESCE(SUM(duration_minutes), 0) AS total_minutes
     FROM focus_sessions
     WHERE user_id = ? AND mode = 'focus'
     GROUP BY tag
     ORDER BY total_minutes DESC
     LIMIT 10`,
    [userId]
  );

  // 4. Last 10 sessions
  const [recentRows] = await pool.query(
    `SELECT fs.*, t.title AS task_title
     FROM focus_sessions fs
     LEFT JOIN tasks t ON fs.task_id = t.id
     WHERE fs.user_id = ?
     ORDER BY fs.completed_at DESC
     LIMIT 10`,
    [userId]
  );

  return {
    todayMinutes: Number(todayRows[0]?.today_minutes) || 0,
    todaySessions: Number(todayRows[0]?.today_sessions) || 0,
    totalMinutes: Number(lifetimeRows[0]?.total_minutes) || 0,
    totalSessions: Number(lifetimeRows[0]?.total_sessions) || 0,
    tagBreakdown: tagRows.map((r) => ({
      tag: r.tag,
      sessionCount: Number(r.session_count) || 0,
      totalMinutes: Number(r.total_minutes) || 0,
    })),
    recentSessions: recentRows.map(formatSession),
  };
}

module.exports = {
  recordSession,
  getSessions,
  getStats,
};
