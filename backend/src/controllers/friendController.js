const { readDB, writeDB } = require("../services/store");

function getFriendFeed(req, res) {
  const db = readDB();
  // Shared memories from all users
  const sharedMemories = db.memories.filter((m) => m.isShared);
  res.json({ feed: sharedMemories });
}

function reactToMemory(req, res) {
  const { id } = req.params;
  const { reactionType } = req.body; // "heart" | "sparkle" | "fire"

  const db = readDB();
  const memory = db.memories.find((m) => m.id === id);

  if (!memory) {
    return res.status(404).json({ error: "Memory not found" });
  }

  if (!memory.reactions) {
    memory.reactions = { heart: 0, sparkle: 0, fire: 0 };
  }

  if (reactionType && memory.reactions[reactionType] !== undefined) {
    memory.reactions[reactionType] += 1;
  } else {
    memory.reactions.heart = (memory.reactions.heart || 0) + 1;
  }

  writeDB(db);
  res.json({ message: "Reaction added", memory });
}

function commentOnMemory(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  const author = req.user?.name || "Shru";

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const db = readDB();
  const memory = db.memories.find((m) => m.id === id);

  if (!memory) {
    return res.status(404).json({ error: "Memory not found" });
  }

  if (!memory.comments) {
    memory.comments = [];
  }

  const newComment = {
    id: "c-" + Date.now(),
    author,
    text,
    time: "Just now",
  };

  memory.comments.push(newComment);
  writeDB(db);
  res.status(201).json({ message: "Comment posted", comment: newComment });
}

module.exports = {
  getFriendFeed,
  reactToMemory,
  commentOnMemory,
};
