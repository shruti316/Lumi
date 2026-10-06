const taskService = require("../services/taskService");

/**
 * Retrieves all tasks for the authenticated user.
 */
async function getTasks(req, res) {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasksByUserId(userId);
    res.json({ tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Internal server error retrieving tasks" });
  }
}

/**
 * Creates a new task for the authenticated user.
 */
async function createTask(req, res) {
  try {
    const userId = req.user.id;
    const { title, priority, dueDate, category, time } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = await taskService.createTask({
      userId,
      title,
      priority,
      dueDate,
      category,
      time,
      completed: false,
    });

    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Internal server error creating task" });
  }
}

/**
 * Updates an existing task belonging to the authenticated user.
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedTask = await taskService.updateTask(id, userId, req.body);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Internal server error updating task" });
  }
}

/**
 * Deletes a task belonging to the authenticated user.
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await taskService.deleteTask(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Internal server error deleting task" });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
