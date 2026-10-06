const goalService = require("../services/goalService");

/**
 * Retrieves all goals for the authenticated user.
 */
async function getGoals(req, res) {
  try {
    const userId = req.user.id;
    const goals = await goalService.getGoalsByUserId(userId);
    res.json({ goals });
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ error: "Internal server error retrieving goals" });
  }
}

/**
 * Creates a new goal for the authenticated user.
 */
async function createGoal(req, res) {
  try {
    const userId = req.user.id;
    const { title, description, category, targetDate, whyItMatters, milestones } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Goal title is required" });
    }

    const newGoal = await goalService.createGoal({
      userId,
      title,
      description,
      category,
      targetDate,
      whyItMatters,
      milestones,
    });

    res.status(201).json({ message: "Goal created", goal: newGoal });
  } catch (err) {
    console.error("Create goal error:", err);
    res.status(500).json({ error: "Internal server error creating goal" });
  }
}

/**
 * Updates a goal for the authenticated user.
 */
async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedGoal = await goalService.updateGoal(id, userId, req.body);

    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal updated", goal: updatedGoal });
  } catch (err) {
    console.error("Update goal error:", err);
    res.status(500).json({ error: "Internal server error updating goal" });
  }
}

/**
 * Deletes a goal for the authenticated user.
 */
async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await goalService.deleteGoal(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ error: "Internal server error deleting goal" });
  }
}

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
