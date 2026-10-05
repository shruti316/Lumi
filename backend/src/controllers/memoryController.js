const { readDB, writeDB } = require("../services/store");

function getMemories(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userMemories = db.memories.filter((m) => m.userId === userId || !m.userId);
  res.json({ memories: userMemories });
}

function createMemory(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, caption, date, location, imageUrl, isShared, tags } = req.body;

  const newMemory = {
    id: "m-" + Date.now(),
    userId,
    title: title || "New Moment",
    caption: caption || "",
    date: date || new Date().toISOString().split("T")[0],
    location: location || "",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    isShared: Boolean(isShared),
    tags: Array.isArray(tags) ? tags : [],
    reactions: { heart: 0, sparkle: 0, fire: 0 },
    comments: [],
    createdAt: new Date().toISOString(),
  };

  db.memories.unshift(newMemory);
  writeDB(db);
  res.status(201).json({ message: "Memory saved", memory: newMemory });
}

function deleteMemory(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.memories = db.memories.filter((m) => m.id !== id);
  writeDB(db);
  res.json({ message: "Memory deleted" });
}

module.exports = {
  getMemories,
  createMemory,
  deleteMemory,
};
