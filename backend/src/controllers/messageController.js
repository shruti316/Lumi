const { readDB, writeDB } = require("../services/store");

function getConversations(req, res) {
  const db = readDB();
  const userId = req.user.id;

  if (!db.conversations) {
    db.conversations = [];
    writeDB(db);
  }

  // Filter conversations where the current user is a participant
  const userConversations = db.conversations.filter((c) =>
    c.participants.includes(userId)
  );

  res.json({ conversations: userConversations });
}

function getMessages(req, res) {
  const { conversationId } = req.params;
  const db = readDB();
  const userId = req.user.id;

  if (!db.messages) {
    db.messages = [];
  }

  const conversation = (db.conversations || []).find(
    (c) => c.id === conversationId && c.participants.includes(userId)
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found or unauthorized" });
  }

  const messages = db.messages.filter((m) => m.conversationId === conversationId);
  res.json({ messages });
}

function sendMessage(req, res) {
  const { conversationId } = req.params;
  const { text, mediaUrl } = req.body;
  const userId = req.user.id;

  if (!text && !mediaUrl) {
    return res.status(400).json({ error: "Message text or media is required" });
  }

  const db = readDB();
  if (!db.conversations) db.conversations = [];
  if (!db.messages) db.messages = [];

  const conversation = db.conversations.find(
    (c) => c.id === conversationId && c.participants.includes(userId)
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found or unauthorized" });
  }

  const newMessage = {
    id: "msg-" + Date.now(),
    conversationId,
    senderId: userId,
    text: text || "",
    mediaUrl: mediaUrl || null,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    read: false,
    createdAt: new Date().toISOString(),
  };

  db.messages.push(newMessage);

  // Update last message preview
  conversation.lastMessage = text || "Shared media";
  conversation.lastTimestamp = "Just now";
  conversation.updatedAt = new Date().toISOString();

  writeDB(db);
  res.status(201).json({ message: "Message sent", data: newMessage });
}

function startConversation(req, res) {
  const { friendId, initialMessage } = req.body;
  const userId = req.user.id;

  if (!friendId) {
    return res.status(400).json({ error: "friendId is required" });
  }

  const db = readDB();
  if (!db.conversations) db.conversations = [];
  if (!db.messages) db.messages = [];

  // Check if conversation already exists
  let conversation = db.conversations.find(
    (c) => c.participants.includes(userId) && c.participants.includes(friendId)
  );

  if (!conversation) {
    conversation = {
      id: "conv-" + Date.now(),
      participants: [userId, friendId],
      lastMessage: initialMessage || "Started conversation",
      lastTimestamp: "Just now",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.conversations.unshift(conversation);

    if (initialMessage) {
      db.messages.push({
        id: "msg-" + Date.now(),
        conversationId: conversation.id,
        senderId: userId,
        text: initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    writeDB(db);
  }

  res.status(201).json({ conversation });
}

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
};
