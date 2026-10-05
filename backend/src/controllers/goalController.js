const { readDB, writeDB } = require("../services/store");

function getGoals(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userGoals = db.goals.filter((g) => g.userId === userId || !g.userId);
  res.json({ goals: userGoals });
}

function createGoal(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, category, targetDate, whyItMatters, milestones } = req.body;

  const newGoal = {
    id: "g-" + Date.now(),
    userId,
    title: title || "New Goal",
    category: category || "Personal",
    targetDate: targetDate || "",
    whyItMatters: whyItMatters || "",
    progress: 0,
    milestones: Array.isArray(milestones) ? milestones : [],
    createdAt: new Date().toISOString(),
  };

  db.goals.unshift(newGoal);
  writeDB(db);
  res.status(201).json({ message: "Goal created", goal: newGoal });
}

function updateGoal(req, res) {
  const { id } = req.params;
  const db = readDB();
  const goalIndex = db.goals.findIndex((g) => g.id === id);

  if (goalIndex === -1) {
    return res.status(404).json({ error: "Goal not found" });
  }

  db.goals[goalIndex] = {
    ...db.goals[goalIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Goal updated", goal: db.goals[goalIndex] });
}

function deleteGoal(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.goals = db.goals.filter((g) => g.id !== id);
  writeDB(db);
  res.json({ message: "Goal deleted" });
}

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
