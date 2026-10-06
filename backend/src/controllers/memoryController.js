const memoryService = require("../services/memoryService");

/**
 * Retrieves all memories for the authenticated user.
 */
async function getMemories(req, res) {
  try {
    const userId = req.user.id;
    const memories = await memoryService.getMemoriesByUserId(userId);
    res.json({ memories });
  } catch (err) {
    console.error("Get memories error:", err);
    res.status(500).json({ error: "Internal server error retrieving memories" });
  }
}

/**
 * Creates a new memory for the authenticated user.
 */
async function createMemory(req, res) {
  try {
    const userId = req.user.id;
    const { title, caption, date, location, imageUrl, isShared, tags } = req.body;

    const newMemory = await memoryService.createMemory({
      userId,
      title,
      caption,
      date,
      location,
      imageUrl,
      isShared,
      tags,
    });

    res.status(201).json({ message: "Memory saved", memory: newMemory });
  } catch (err) {
    console.error("Create memory error:", err);
    res.status(500).json({ error: "Internal server error saving memory" });
  }
}

/**
 * Deletes a memory belonging to the authenticated user.
 */
async function deleteMemory(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await memoryService.deleteMemory(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ message: "Memory deleted" });
  } catch (err) {
    console.error("Delete memory error:", err);
    res.status(500).json({ error: "Internal server error deleting memory" });
  }
}

module.exports = {
  getMemories,
  createMemory,
  deleteMemory,
};
