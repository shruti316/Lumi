const crypto = require("crypto");
const pool = require("../config/db");

function formatJournal(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    date: row.date,
    template: row.template || "daily",
    mood: row.mood || "calm",
    entry: row.entry || "",
    gratitude: row.gratitude || "",
    createdAt: row.created_at,
  };
}

async function getJournalsByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, date, template, mood, entry, gratitude, created_at FROM journals WHERE user_id = ? ORDER BY date DESC, created_at DESC",
    [userId]
  );
  return rows.map(formatJournal);
}

async function getJournalById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, date, template, mood, entry, gratitude, created_at FROM journals WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  if (rows.length === 0) return null;
  return formatJournal(rows[0]);
}

async function createJournal({ id, userId, title, date, template, mood, entry, gratitude }) {
  const journalId = id || crypto.randomUUID();
  const journalTitle = title || "Personal Reflection";
  const journalDate = date || new Date().toISOString().split("T")[0];
  const journalTemplate = template || "daily";
  const journalMood = mood || "calm";
  const journalEntry = entry || "";
  const journalGratitude = gratitude || "";

  await pool.query(
    "INSERT INTO journals (id, user_id, title, date, template, mood, entry, gratitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [journalId, userId, journalTitle, journalDate, journalTemplate, journalMood, journalEntry, journalGratitude]
  );

  return getJournalById(journalId, userId);
}

async function deleteJournal(id, userId) {
  const [result] = await pool.query("DELETE FROM journals WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getJournalsByUserId,
  getJournalById,
  createJournal,
  deleteJournal,
};
