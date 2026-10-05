const { readDB, writeDB } = require("../services/store");

function getHabits(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userHabits = db.habits.filter((h) => h.userId === userId || !h.userId);
  res.json({ habits: userHabits });
}

function createHabit(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { name, category, icon, color, targetDaysPerWeek } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Habit name is required" });
  }

  const newHabit = {
    id: "h-" + Date.now(),
    userId,
    name,
    category: category || "Daily",
    icon: icon || "Sparkles",
    color: color || "#9E96D8",
    targetDaysPerWeek: targetDaysPerWeek || 7,
    completedDates: [],
    createdAt: new Date().toISOString(),
  };

  db.habits.unshift(newHabit);
  writeDB(db);

  res.status(201).json({ message: "Habit created", habit: newHabit });
}

function toggleHabit(req, res) {
  const { id } = req.params;
  const { date } = req.body;
  const dateStr = date || new Date().toISOString().split("T")[0];

  const db = readDB();
  const habit = db.habits.find((h) => h.id === id);

  if (!habit) {
    return res.status(404).json({ error: "Habit not found" });
  }

  const index = habit.completedDates.indexOf(dateStr);
  if (index > -1) {
    habit.completedDates.splice(index, 1);
  } else {
    habit.completedDates.push(dateStr);
  }

  writeDB(db);
  res.json({ message: "Habit toggled", habit });
}

function deleteHabit(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.habits = db.habits.filter((h) => h.id !== id);
  writeDB(db);
  res.json({ message: "Habit deleted" });
}

module.exports = {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
};
