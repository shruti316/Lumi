const { readDB, writeDB } = require("../services/store");

// NOTES
function getNotes(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userNotes = db.notes.filter((n) => n.userId === userId || !n.userId);
  res.json({ notes: userNotes });
}

function createNote(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, category, tags, content } = req.body;

  const newNote = {
    id: "n-" + Date.now(),
    userId,
    title: title || "Untitled Note",
    category: category || "General",
    tags: Array.isArray(tags) ? tags : [],
    content: content || "",
    updatedAt: new Date().toISOString(),
  };

  db.notes.unshift(newNote);
  writeDB(db);
  res.status(201).json({ message: "Note created", note: newNote });
}

function updateNote(req, res) {
  const { id } = req.params;
  const db = readDB();
  const noteIndex = db.notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  db.notes[noteIndex] = {
    ...db.notes[noteIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Note updated", note: db.notes[noteIndex] });
}

function deleteNote(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.notes = db.notes.filter((n) => n.id !== id);
  writeDB(db);
  res.json({ message: "Note deleted" });
}

// PROJECTS
function getProjects(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userProjects = db.projects.filter((p) => p.userId === userId || !p.userId);
  res.json({ projects: userProjects });
}

function createProject(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { name, description, deadline, status, tasks } = req.body;

  const newProject = {
    id: "p-" + Date.now(),
    userId,
    name: name || "New Project",
    description: description || "",
    deadline: deadline || "",
    status: status || "in-progress",
    progress: 0,
    tasks: Array.isArray(tasks) ? tasks : [],
    updatedAt: new Date().toISOString(),
  };

  db.projects.unshift(newProject);
  writeDB(db);
  res.status(201).json({ message: "Project created", project: newProject });
}

function updateProject(req, res) {
  const { id } = req.params;
  const db = readDB();
  const projectIndex = db.projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  db.projects[projectIndex] = {
    ...db.projects[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Project updated", project: db.projects[projectIndex] });
}

function deleteProject(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.projects = db.projects.filter((p) => p.id !== id);
  writeDB(db);
  res.json({ message: "Project deleted" });
}

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
