const crypto = require("crypto");
const pool = require("../config/db");

// ==========================================
// NOTES
// ==========================================

function formatNote(row, tags = []) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category || "General",
    content: row.content || "",
    tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getNotesByUserId(userId) {
  const [noteRows] = await pool.query(
    "SELECT id, user_id, title, category, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );

  if (noteRows.length === 0) return [];

  const noteIds = noteRows.map((n) => n.id);
  const [tagRows] = await pool.query(
    "SELECT note_id, tag FROM note_tags WHERE note_id IN (?)",
    [noteIds]
  );

  const tagsMap = {};
  for (const t of tagRows) {
    if (!tagsMap[t.note_id]) tagsMap[t.note_id] = [];
    tagsMap[t.note_id].push(t.tag);
  }

  return noteRows.map((n) => formatNote(n, tagsMap[n.id] || []));
}

async function getNoteById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, category, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );

  if (rows.length === 0) return null;

  const [tagRows] = await pool.query("SELECT tag FROM note_tags WHERE note_id = ?", [id]);
  return formatNote(rows[0], tagRows.map((t) => t.tag));
}

async function createNote({ id, userId, title, category, tags = [], content }) {
  const noteId = id || crypto.randomUUID();
  const noteTitle = title || "Untitled Note";
  const noteCategory = category || "General";
  const noteContent = content || "";

  await pool.query(
    "INSERT INTO notes (id, user_id, title, category, content) VALUES (?, ?, ?, ?, ?)",
    [noteId, userId, noteTitle, noteCategory, noteContent]
  );

  if (Array.isArray(tags) && tags.length > 0) {
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        await pool.query("INSERT IGNORE INTO note_tags (note_id, tag) VALUES (?, ?)", [noteId, tag.trim()]);
      }
    }
  }

  return getNoteById(noteId, userId);
}

async function updateNote(id, userId, updates = {}) {
  const fieldMap = {
    title: "title",
    category: "category",
    content: "content",
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
    const sql = `UPDATE notes SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return null;
  }

  if (Array.isArray(updates.tags)) {
    await pool.query("DELETE FROM note_tags WHERE note_id = ?", [id]);
    for (const tag of updates.tags) {
      if (typeof tag === "string" && tag.trim()) {
        await pool.query("INSERT IGNORE INTO note_tags (note_id, tag) VALUES (?, ?)", [id, tag.trim()]);
      }
    }
  }

  return getNoteById(id, userId);
}

async function deleteNote(id, userId) {
  const [result] = await pool.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

// ==========================================
// PROJECTS
// ==========================================

function formatProject(row, tasks = []) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || "",
    status: row.status || "in-progress",
    deadline: row.deadline || "",
    progress: Number(row.progress) || 0,
    notes: row.notes || "",
    tasks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getProjectsByUserId(userId) {
  const [projectRows] = await pool.query(
    "SELECT id, user_id, name, description, status, deadline, progress, notes, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );

  if (projectRows.length === 0) return [];

  const projectIds = projectRows.map((p) => p.id);
  const [taskRows] = await pool.query(
    "SELECT id, project_id, title, completed FROM project_subtasks WHERE project_id IN (?) ORDER BY created_at ASC",
    [projectIds]
  );

  const subtasksMap = {};
  for (const t of taskRows) {
    if (!subtasksMap[t.project_id]) subtasksMap[t.project_id] = [];
    subtasksMap[t.project_id].push(t.title);
  }

  return projectRows.map((p) => formatProject(p, subtasksMap[p.id] || []));
}

async function getProjectById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, name, description, status, deadline, progress, notes, created_at, updated_at FROM projects WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );

  if (rows.length === 0) return null;

  const [taskRows] = await pool.query(
    "SELECT title FROM project_subtasks WHERE project_id = ? ORDER BY created_at ASC",
    [id]
  );

  return formatProject(rows[0], taskRows.map((t) => t.title));
}

async function createProject({ id, userId, name, description, deadline, status, progress, notes, tasks = [] }) {
  const projectId = id || crypto.randomUUID();
  const projName = name || "New Project";
  const projDesc = description || "";
  const projDeadline = deadline || "";
  const projStatus = status || "in-progress";
  const projProgress = Number(progress) || 0;
  const projNotes = notes || "";

  await pool.query(
    "INSERT INTO projects (id, user_id, name, description, status, deadline, progress, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [projectId, userId, projName, projDesc, projStatus, projDeadline, projProgress, projNotes]
  );

  if (Array.isArray(tasks) && tasks.length > 0) {
    for (const item of tasks) {
      const taskTitle = typeof item === "string" ? item : item?.title;
      if (taskTitle && taskTitle.trim()) {
        await pool.query(
          "INSERT INTO project_subtasks (id, project_id, title, completed) VALUES (?, ?, ?, 0)",
          [crypto.randomUUID(), projectId, taskTitle.trim()]
        );
      }
    }
  }

  return getProjectById(projectId, userId);
}

async function updateProject(id, userId, updates = {}) {
  const fieldMap = {
    name: "name",
    description: "description",
    status: "status",
    deadline: "deadline",
    progress: "progress",
    notes: "notes",
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
    const sql = `UPDATE projects SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return null;
  }

  if (Array.isArray(updates.tasks)) {
    await pool.query("DELETE FROM project_subtasks WHERE project_id = ?", [id]);
    for (const item of updates.tasks) {
      const taskTitle = typeof item === "string" ? item : item?.title;
      if (taskTitle && taskTitle.trim()) {
        await pool.query(
          "INSERT INTO project_subtasks (id, project_id, title, completed) VALUES (?, ?, ?, ?)",
          [crypto.randomUUID(), id, taskTitle.trim(), item?.completed ? 1 : 0]
        );
      }
    }
  }

  return getProjectById(id, userId);
}

async function deleteProject(id, userId) {
  const [result] = await pool.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getNotesByUserId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getProjectsByUserId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
