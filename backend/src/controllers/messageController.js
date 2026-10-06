const messageService = require("../services/messageService");

/**
 * Retrieves conversations for the authenticated user.
 */
async function getConversations(req, res) {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getConversationsByUserId(userId);
    res.json({ conversations });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ error: "Internal server error retrieving conversations" });
  }
}

/**
 * Retrieves messages for a specific conversation.
 */
async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await messageService.getMessages(conversationId, userId);

    if (messages === null) {
      return res.status(404).json({ error: "Conversation not found or unauthorized" });
    }

    res.json({ messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Internal server error retrieving messages" });
  }
}

/**
 * Sends a message in a conversation.
 */
async function sendMessage(req, res) {
  try {
    const { conversationId } = req.params;
    const { text, mediaUrl } = req.body;
    const userId = req.user.id;

    if (!text && !mediaUrl) {
      return res.status(400).json({ error: "Message text or media is required" });
    }

    const message = await messageService.sendMessage({
      conversationId,
      senderId: userId,
      text,
      mediaUrl,
    });

    if (!message) {
      return res.status(404).json({ error: "Conversation not found or unauthorized" });
    }

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Internal server error sending message" });
  }
}

/**
 * Starts a conversation with a friend.
 */
async function startConversation(req, res) {
  try {
    const { friendId, initialMessage } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res.status(400).json({ error: "friendId is required" });
    }

    const conversation = await messageService.startConversation(userId, friendId, initialMessage);

    res.status(201).json({ conversation });
  } catch (err) {
    console.error("Start conversation error:", err);
    res.status(500).json({ error: "Internal server error starting conversation" });
  }
}

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
};
