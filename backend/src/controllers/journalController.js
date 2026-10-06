const journalService = require("../services/journalService");

/**
 * Retrieves all journal entries for the authenticated user.
 */
async function getJournals(req, res) {
  try {
    const userId = req.user.id;
    const journals = await journalService.getJournalsByUserId(userId);
    res.json({ journals });
  } catch (err) {
    console.error("Get journals error:", err);
    res.status(500).json({ error: "Internal server error retrieving journal entries" });
  }
}

/**
 * Creates a new journal entry for the authenticated user.
 */
async function createJournal(req, res) {
  try {
    const userId = req.user.id;
    const { title, template, mood, entry, gratitude, date } = req.body;

    const newJournal = await journalService.createJournal({
      userId,
      title,
      date,
      template,
      mood,
      entry,
      gratitude,
    });

    res.status(201).json({ message: "Journal entry saved", journal: newJournal });
  } catch (err) {
    console.error("Create journal error:", err);
    res.status(500).json({ error: "Internal server error saving journal entry" });
  }
}

/**
 * Deletes a journal entry for the authenticated user.
 */
async function deleteJournal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await journalService.deleteJournal(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json({ message: "Journal entry deleted" });
  } catch (err) {
    console.error("Delete journal error:", err);
    res.status(500).json({ error: "Internal server error deleting journal entry" });
  }
}

module.exports = {
  getJournals,
  createJournal,
  deleteJournal,
};
