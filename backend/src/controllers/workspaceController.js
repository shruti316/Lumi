const workspaceService = require("../services/workspaceService");

// ==========================================
// NOTES
// ==========================================

async function getNotes(req, res) {
  try {
    const userId = req.user.id;
    const notes = await workspaceService.getNotesByUserId(userId);
    res.json({ notes });
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ error: "Internal server error retrieving notes" });
  }
}

async function createNote(req, res) {
  try {
    const userId = req.user.id;
    const { title, category, tags, content } = req.body;

    const newNote = await workspaceService.createNote({
      userId,
      title,
      category,
      tags,
      content,
    });

    res.status(201).json({ message: "Note created", note: newNote });
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Internal server error creating note" });
  }
}

async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedNote = await workspaceService.updateNote(id, userId, req.body);

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ error: "Internal server error updating note" });
  }
}

async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await workspaceService.deleteNote(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Internal server error deleting note" });
  }
}

// ==========================================
// PROJECTS
// ==========================================

async function getProjects(req, res) {
  try {
    const userId = req.user.id;
    const projects = await workspaceService.getProjectsByUserId(userId);
    res.json({ projects });
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Internal server error retrieving projects" });
  }
}

async function createProject(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, deadline, status, progress, notes, tasks } = req.body;

    const newProject = await workspaceService.createProject({
      userId,
      name,
      description,
      deadline,
      status,
      progress,
      notes,
      tasks,
    });

    res.status(201).json({ message: "Project created", project: newProject });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Internal server error creating project" });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedProject = await workspaceService.updateProject(id, userId, req.body);

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project updated", project: updatedProject });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ error: "Internal server error updating project" });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await workspaceService.deleteProject(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Internal server error deleting project" });
  }
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
