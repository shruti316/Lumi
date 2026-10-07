const habitService = require("../services/habitService");

/**
 * Retrieves all habits for the authenticated user.
 */
async function getHabits(req, res) {
  try {
    const userId = req.user.id;
    const habits = await habitService.getHabitsByUserId(userId);
    res.json({ habits });
  } catch (err) {
    console.error("Get habits error:", err);
    res.status(500).json({ error: "Internal server error retrieving habits" });
  }
}

/**
 * Creates a new habit for the authenticated user.
 */
async function createHabit(req, res) {
  try {
    const userId = req.user.id;
    const { name, category, icon, emoji, color, targetDaysPerWeek } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Habit name is required" });
    }

    const newHabit = await habitService.createHabit({
      userId,
      name,
      category,
      icon: icon || emoji || "🌱",
      color,
      targetDaysPerWeek,
    });

    res.status(201).json({ message: "Habit created", habit: newHabit });
  } catch (err) {
    console.error("Create habit error:", err);
    res.status(500).json({ error: "Internal server error creating habit" });
  }
}

/**
 * Toggles habit completion on a given date for the authenticated user.
 */
async function toggleHabit(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const userId = req.user.id;

    const updatedHabit = await habitService.toggleHabit(id, userId, date);

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit toggled", habit: updatedHabit });
  } catch (err) {
    console.error("Toggle habit error:", err);
    res.status(500).json({ error: "Internal server error toggling habit" });
  }
}

/**
 * Deletes a habit for the authenticated user.
 */
async function deleteHabit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await habitService.deleteHabit(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("Delete habit error:", err);
    res.status(500).json({ error: "Internal server error deleting habit" });
  }
}

module.exports = {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
};
