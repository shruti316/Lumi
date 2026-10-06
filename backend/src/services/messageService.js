const crypto = require("crypto");
const pool = require("../config/db");

async function getConversationsByUserId(userId) {
  const [convRows] = await pool.query(
    `SELECT c.id, c.last_message, c.last_timestamp, c.created_at, c.updated_at
     FROM conversations c
     JOIN conversation_participants cp ON c.id = cp.conversation_id
     WHERE cp.user_id = ?
     ORDER BY c.updated_at DESC`,
    [userId]
  );

  if (convRows.length === 0) return [];

  const convIds = convRows.map((c) => c.id);
  const [partRows] = await pool.query(
    "SELECT conversation_id, user_id FROM conversation_participants WHERE conversation_id IN (?)",
    [convIds]
  );

  const participantsMap = {};
  for (const p of partRows) {
    if (!participantsMap[p.conversation_id]) participantsMap[p.conversation_id] = [];
    participantsMap[p.conversation_id].push(p.user_id);
  }

  return convRows.map((c) => ({
    id: c.id,
    participants: participantsMap[c.id] || [],
    lastMessage: c.last_message || "",
    lastTimestamp: c.last_timestamp || "Just now",
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

async function verifyParticipant(conversationId, userId) {
  const [rows] = await pool.query(
    "SELECT id FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1",
    [conversationId, userId]
  );
  return rows.length > 0;
}

async function getMessages(conversationId, userId) {
  const isMember = await verifyParticipant(conversationId, userId);
  if (!isMember) return null;

  const [rows] = await pool.query(
    "SELECT id, conversation_id, sender_id, text, media_url, timestamp, read_status, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
    [conversationId]
  );

  return rows.map((m) => ({
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    text: m.text || "",
    mediaUrl: m.media_url,
    timestamp: m.timestamp || new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    read: Boolean(m.read_status),
    createdAt: m.created_at,
  }));
}

async function sendMessage({ conversationId, senderId, text, mediaUrl }) {
  const isMember = await verifyParticipant(conversationId, senderId);
  if (!isMember) return null;

  const msgId = crypto.randomUUID();
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  await pool.query(
    "INSERT INTO messages (id, conversation_id, sender_id, text, media_url, timestamp, read_status) VALUES (?, ?, ?, ?, ?, ?, 0)",
    [msgId, conversationId, senderId, text || "", mediaUrl || null, timeStr]
  );

  await pool.query(
    "UPDATE conversations SET last_message = ?, last_timestamp = 'Just now', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [text || "Shared media", conversationId]
  );

  return {
    id: msgId,
    conversationId,
    senderId,
    text: text || "",
    mediaUrl: mediaUrl || null,
    timestamp: timeStr,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

async function startConversation(userId, friendId, initialMessage = "") {
  // Check if existing conversation has both participants
  const [common] = await pool.query(
    `SELECT cp1.conversation_id
     FROM conversation_participants cp1
     JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
     WHERE cp1.user_id = ? AND cp2.user_id = ?
     LIMIT 1`,
    [userId, friendId]
  );

  let convId = "";
  if (common.length > 0) {
    convId = common[0].conversation_id;
  } else {
    convId = crypto.randomUUID();
    await pool.query(
      "INSERT INTO conversations (id, last_message, last_timestamp) VALUES (?, ?, 'Just now')",
      [convId, initialMessage || "Started conversation"]
    );
    await pool.query(
      "INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)",
      [convId, userId, convId, friendId]
    );
  }

  if (initialMessage && initialMessage.trim()) {
    await sendMessage({
      conversationId: convId,
      senderId: userId,
      text: initialMessage.trim(),
    });
  }

  const convs = await getConversationsByUserId(userId);
  return convs.find((c) => c.id === convId) || { id: convId, participants: [userId, friendId] };
}

module.exports = {
  getConversationsByUserId,
  getMessages,
  sendMessage,
  startConversation,
};
