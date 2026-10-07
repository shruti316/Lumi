const crypto = require("crypto");
const pool = require("../config/db");

function formatMemory(row, tags = [], reactions = { heart: 0, sparkle: 0, fire: 0 }, comments = []) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name || "LUMI Friend",
    authorHandle: row.author_email ? `@${row.author_email.split("@")[0]}` : "@lumi_friend",
    authorAvatar: row.author_avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`,
    title: row.title,
    caption: row.caption || "",
    date: row.date || "",
    location: row.location || "",
    imageUrl: row.image_url || "",
    isShared: Boolean(row.is_shared),
    tags,
    reactions,
    comments,
    createdAt: row.created_at,
  };
}

async function getPopulatedMemories(whereClause = "", params = []) {
  const [rows] = await pool.query(
    `SELECT m.id, m.user_id, m.title, m.caption, m.date, m.location, m.image_url, m.is_shared, m.created_at, u.name AS author_name, u.email AS author_email 
     FROM memories m 
     LEFT JOIN users u ON m.user_id = u.id 
     ${whereClause} 
     ORDER BY m.created_at DESC`,
    params
  );

  if (rows.length === 0) return [];

  const memoryIds = rows.map((m) => m.id);

  const [tagRows] = await pool.query(
    "SELECT memory_id, tag FROM memory_tags WHERE memory_id IN (?)",
    [memoryIds]
  );
  const tagsMap = {};
  for (const t of tagRows) {
    if (!tagsMap[t.memory_id]) tagsMap[t.memory_id] = [];
    tagsMap[t.memory_id].push(t.tag);
  }

  const [reactionRows] = await pool.query(
    "SELECT memory_id, reaction_type, COUNT(*) as count FROM memory_reactions WHERE memory_id IN (?) GROUP BY memory_id, reaction_type",
    [memoryIds]
  );
  const reactionsMap = {};
  for (const r of reactionRows) {
    if (!reactionsMap[r.memory_id]) {
      reactionsMap[r.memory_id] = { heart: 0, sparkle: 0, fire: 0 };
    }
    reactionsMap[r.memory_id][r.reaction_type] = Number(r.count);
  }

  const [commentRows] = await pool.query(
    "SELECT id, memory_id, user_id, author_name, text, created_at FROM memory_comments WHERE memory_id IN (?) ORDER BY created_at ASC",
    [memoryIds]
  );
  const commentsMap = {};
  for (const c of commentRows) {
    if (!commentsMap[c.memory_id]) commentsMap[c.memory_id] = [];
    commentsMap[c.memory_id].push({
      id: c.id,
      author: c.author_name,
      text: c.text,
      time: "Recent",
      createdAt: c.created_at,
    });
  }

  return rows.map((m) =>
    formatMemory(
      m,
      tagsMap[m.id] || [],
      reactionsMap[m.id] || { heart: 0, sparkle: 0, fire: 0 },
      commentsMap[m.id] || []
    )
  );
}

async function getMemoriesByUserId(userId) {
  return getPopulatedMemories("WHERE user_id = ?", [userId]);
}

async function getMemoryById(id, userId = null) {
  const where = userId
    ? "WHERE m.id = ? AND m.user_id = ?"
    : "WHERE m.id = ?";

  const params = userId
    ? [id, userId]
    : [id];

  const list = await getPopulatedMemories(where, params);

  return list.length > 0 ? list[0] : null;
}

async function createMemory({ id, userId, title, caption, date, location, imageUrl, isShared, tags = [] }) {
  const memoryId = id || crypto.randomUUID();
  const memTitle = title || "New Moment";
  const memCaption = caption || "";
  const memDate = date || new Date().toISOString().split("T")[0];
  const memLocation = location || "";
  const memImageUrl = imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
  const memShared = isShared ? 1 : 0;

  await pool.query(
    "INSERT INTO memories (id, user_id, title, caption, date, location, image_url, is_shared) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [memoryId, userId, memTitle, memCaption, memDate, memLocation, memImageUrl, memShared]
  );

  if (Array.isArray(tags) && tags.length > 0) {
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        await pool.query("INSERT INTO memory_tags (memory_id, tag) VALUES (?, ?)", [memoryId, tag.trim()]);
      }
    }
  }

  return getMemoryById(memoryId, userId);
}

async function deleteMemory(id, userId) {
  const [result] = await pool.query("DELETE FROM memories WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

// Social feed & interaction methods
async function getSharedFeed() {
  return getPopulatedMemories("WHERE is_shared = 1", []);
}

async function reactToMemory(memoryId, userId, reactionType = "heart") {
  const allowed = ["heart", "sparkle", "fire"];
  const type = allowed.includes(reactionType) ? reactionType : "heart";

  await pool.query(
    "INSERT IGNORE INTO memory_reactions (memory_id, user_id, reaction_type) VALUES (?, ?, ?)",
    [memoryId, userId, type]
  );

  return getMemoryById(memoryId);
}

async function commentOnMemory(memoryId, userId, authorName, text) {
  const commentId = crypto.randomUUID();
  await pool.query(
    "INSERT INTO memory_comments (id, memory_id, user_id, author_name, text) VALUES (?, ?, ?, ?, ?)",
    [commentId, memoryId, userId, authorName || "LUMI Friend", text.trim()]
  );

  return {
    id: commentId,
    author: authorName || "LUMI Friend",
    text: text.trim(),
    time: "Just now",
  };
}

module.exports = {
  getMemoriesByUserId,
  getMemoryById,
  createMemory,
  deleteMemory,
  getSharedFeed,
  reactToMemory,
  commentOnMemory,
};
