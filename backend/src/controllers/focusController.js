const focusService = require("../services/focusService");

/**
 * Controller for Focus & Pomodoro session endpoints.
 */
const focusController = {
  /**
   * POST /api/focus/sessions
   * Records a completed focus/break sprint into MySQL.
   */
  async recordSession(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { taskId, mode, durationMinutes, tag, notes } = req.body;

      if (!durationMinutes || Number(durationMinutes) <= 0) {
        return res.status(400).json({ error: "Valid durationMinutes is required" });
      }

      const session = await focusService.recordSession({
        userId,
        taskId,
        mode: mode || "focus",
        durationMinutes,
        tag: tag || "Deep Work",
        notes,
      });

      return res.status(201).json({ session });
    } catch (err) {
      console.error("[focusController.recordSession] Error:", err);
      return res.status(500).json({ error: "Failed to record focus session" });
    }
  },

  /**
   * GET /api/focus/sessions
   * Retrieves focus session history for the current user.
   */
  async getSessions(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const limit = parseInt(req.query.limit, 10) || 50;
      const sessions = await focusService.getSessions(userId, limit);

      return res.json({ sessions });
    } catch (err) {
      console.error("[focusController.getSessions] Error:", err);
      return res.status(500).json({ error: "Failed to fetch focus sessions" });
    }
  },

  /**
   * GET /api/focus/stats
   * Retrieves aggregated focus metrics for the current user.
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const stats = await focusService.getStats(userId);
      return res.json({ stats });
    } catch (err) {
      console.error("[focusController.getStats] Error:", err);
      return res.status(500).json({ error: "Failed to fetch focus stats" });
    }
  },
};

module.exports = focusController;
