const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth");

// Controllers
const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const habitController = require("../controllers/habitController");
const workspaceController = require("../controllers/workspaceController");
const journalController = require("../controllers/journalController");
const goalController = require("../controllers/goalController");
const memoryController = require("../controllers/memoryController");
const readingController = require("../controllers/readingController");
const friendController = require("../controllers/friendController");
const messageController = require("../controllers/messageController");

// ==========================================
// 1. AUTHENTICATION & PROFILE ROUTES
// ==========================================
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.get("/auth/me", authenticateToken, authController.getMe);
router.put("/auth/me", authenticateToken, authController.updateMe);
router.delete("/auth/reset-data", authenticateToken, authController.resetData);
router.delete("/user/data", authenticateToken, authController.resetData);

// ==========================================
// 2. TASKS & PLANNER ROUTES
// ==========================================
router.get("/tasks", authenticateToken, taskController.getTasks);
router.post("/tasks", authenticateToken, taskController.createTask);
router.put("/tasks/:id", authenticateToken, taskController.updateTask);
router.delete("/tasks/:id", authenticateToken, taskController.deleteTask);

// ==========================================
// 3. HABITS ROUTES
// ==========================================
router.get("/habits", authenticateToken, habitController.getHabits);
router.post("/habits", authenticateToken, habitController.createHabit);
router.post("/habits/:id/toggle", authenticateToken, habitController.toggleHabit);
router.delete("/habits/:id", authenticateToken, habitController.deleteHabit);

// ==========================================
// 4. WORKSPACE (NOTES & PROJECTS) ROUTES
// ==========================================
router.get("/notes", authenticateToken, workspaceController.getNotes);
router.post("/notes", authenticateToken, workspaceController.createNote);
router.put("/notes/:id", authenticateToken, workspaceController.updateNote);
router.delete("/notes/:id", authenticateToken, workspaceController.deleteNote);

router.get("/projects", authenticateToken, workspaceController.getProjects);
router.post("/projects", authenticateToken, workspaceController.createProject);
router.put("/projects/:id", authenticateToken, workspaceController.updateProject);
router.delete("/projects/:id", authenticateToken, workspaceController.deleteProject);

// ==========================================
// 5. GOALS ROUTES
// ==========================================
router.get("/goals", authenticateToken, goalController.getGoals);
router.post("/goals", authenticateToken, goalController.createGoal);
router.put("/goals/:id", authenticateToken, goalController.updateGoal);
router.delete("/goals/:id", authenticateToken, goalController.deleteGoal);

// ==========================================
// 6. JOURNAL (DIARY & REFLECTION) ROUTES
// ==========================================
router.get("/journals", authenticateToken, journalController.getJournals);
router.post("/journals", authenticateToken, journalController.createJournal);
router.delete("/journals/:id", authenticateToken, journalController.deleteJournal);

// ==========================================
// 7. MEMORIES ROUTES
// ==========================================
router.get("/memories", authenticateToken, memoryController.getMemories);
router.post("/memories", authenticateToken, memoryController.createMemory);
router.delete("/memories/:id", authenticateToken, memoryController.deleteMemory);

// ==========================================
// 8. READING / BOOKS ROUTES
// ==========================================
router.get("/books", authenticateToken, readingController.getBooks);
router.post("/books", authenticateToken, readingController.createBook);
router.put("/books/:id", authenticateToken, readingController.updateBook);
router.delete("/books/:id", authenticateToken, readingController.deleteBook);

// ==========================================
// 9. FRIENDS & SOCIAL LAYER ROUTES
// ==========================================
router.get("/friends/feed", authenticateToken, friendController.getFriendFeed);
router.post("/friends/memories/:id/react", authenticateToken, friendController.reactToMemory);
router.post("/friends/memories/:id/comment", authenticateToken, friendController.commentOnMemory);

// ==========================================
// 10. 1-TO-1 MESSAGING & CHAT ROUTES
// ==========================================
router.get("/messages/conversations", authenticateToken, messageController.getConversations);
router.get("/messages/conversations/:conversationId", authenticateToken, messageController.getMessages);
router.post("/messages/conversations/:conversationId/send", authenticateToken, messageController.sendMessage);
router.post("/messages/conversations/start", authenticateToken, messageController.startConversation);

module.exports = router;
