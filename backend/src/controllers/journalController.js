const { readDB, writeDB } = require("../services/store");

function getJournals(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userJournals = db.journals.filter((j) => j.userId === userId || !j.userId);
  res.json({ journals: userJournals });
}

function createJournal(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, template, mood, entry, gratitude, tags, date } = req.body;

  const newJournal = {
    id: "j-" + Date.now(),
    userId,
    title: title || "Personal Reflection",
    date: date || new Date().toISOString().split("T")[0],
    template: template || "daily",
    mood: mood || "calm",
    entry: entry || "",
    gratitude: gratitude || "",
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };

  db.journals.unshift(newJournal);
  writeDB(db);
  res.status(201).json({ message: "Journal entry saved", journal: newJournal });
}

function deleteJournal(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.journals = db.journals.filter((j) => j.id !== id);
  writeDB(db);
  res.json({ message: "Journal entry deleted" });
}

module.exports = {
  getJournals,
  createJournal,
  deleteJournal,
};
