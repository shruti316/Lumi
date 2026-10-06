const memoryService = require("../services/memoryService");

/**
 * Retrieves public shared memories across all users for the friend feed.
 */
async function getFriendFeed(req, res) {
  try {
    const feed = await memoryService.getSharedFeed();
    res.json({ feed });
  } catch (err) {
    console.error("Get friend feed error:", err);
    res.status(500).json({ error: "Internal server error retrieving friend feed" });
  }
}

/**
 * Adds a reaction to a shared memory.
 */
async function reactToMemory(req, res) {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    const memory = await memoryService.reactToMemory(id, userId, reactionType);

    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ message: "Reaction added", memory });
  } catch (err) {
    console.error("React to memory error:", err);
    res.status(500).json({ error: "Internal server error adding reaction" });
  }
}

/**
 * Posts a comment on a shared memory.
 */
async function commentOnMemory(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const author = req.user.name || "LUMI Friend";

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = await memoryService.commentOnMemory(id, userId, author, text);

    res.status(201).json({ message: "Comment posted", comment });
  } catch (err) {
    console.error("Comment on memory error:", err);
    res.status(500).json({ error: "Internal server error posting comment" });
  }
}

module.exports = {
  getFriendFeed,
  reactToMemory,
  commentOnMemory,
};
