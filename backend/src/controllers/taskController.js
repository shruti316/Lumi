const { readDB, writeDB } = require("../services/store");

function getTasks(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userTasks = db.tasks.filter((t) => t.userId === userId || !t.userId);
  res.json({ tasks: userTasks });
}

function createTask(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, priority, dueDate, category, time } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: "t-" + Date.now(),
    userId,
    title,
    priority: priority || "medium",
    completed: false,
    dueDate: dueDate || "Today",
    category: category || "General",
    time: time || "",
    createdAt: new Date().toISOString(),
  };

  db.tasks.unshift(newTask);
  writeDB(db);

  res.status(201).json({ message: "Task created", task: newTask });
}

function updateTask(req, res) {
  const { id } = req.params;
  const db = readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.tasks[taskIndex] = {
    ...db.tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Task updated", task: db.tasks[taskIndex] });
}

function deleteTask(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.tasks = db.tasks.filter((t) => t.id !== id);
  writeDB(db);
  res.json({ message: "Task deleted" });
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
