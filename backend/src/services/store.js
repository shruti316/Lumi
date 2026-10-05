const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "lumi_db.json");

// Default initial state
const DEFAULT_DATA = {
  users: [
    {
      id: "u-demo",
      email: "shru@lumi.app",
      passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
      name: "Shru",
      bio: "Designing my best days with LUMI ✨",
      theme: "light",
      createdAt: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: "t-1",
      userId: "u-demo",
      title: "Complete DSA Assignment",
      priority: "high",
      completed: false,
      dueDate: "Today",
      category: "Academic",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t-2",
      userId: "u-demo",
      title: "Review ML Paper Notes",
      priority: "medium",
      completed: false,
      dueDate: "Tomorrow",
      category: "Research",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t-3",
      userId: "u-demo",
      title: "Water indoor plants & herbal tea",
      priority: "low",
      completed: true,
      dueDate: "Today",
      category: "Personal",
      createdAt: new Date().toISOString(),
    },
  ],
  habits: [
    {
      id: "h-1",
      userId: "u-demo",
      name: "Daily Reading (20 mins)",
      category: "Mind",
      icon: "BookOpen",
      color: "#9E96D8",
      targetDaysPerWeek: 7,
      completedDates: [
        new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
        new Date(Date.now() - 86400000).toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: "h-2",
      userId: "u-demo",
      name: "Morning Sunlight & Stretch",
      category: "Body",
      icon: "Sun",
      color: "#F1D2C9",
      targetDaysPerWeek: 5,
      completedDates: [
        new Date(Date.now() - 86400000).toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  notes: [
    {
      id: "n-1",
      userId: "u-demo",
      title: "Transformer Architecture Ideas",
      category: "Research",
      tags: ["AI", "Architecture", "Attention"],
      content: "Exploring multi-head latent attention mechanism for fast streaming generation.",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "n-2",
      userId: "u-demo",
      title: "Weekly Grocery & Meal Prep",
      category: "Personal",
      tags: ["Health", "Food"],
      content: "Matcha powder, oat milk, avocados, berries, and sourdough bread.",
      updatedAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: "p-1",
      userId: "u-demo",
      name: "AI Life OS Application",
      description: "Building the modern, aesthetic personal operating system for mindful achievers.",
      status: "in-progress",
      deadline: "2026-11-15",
      progress: 85,
      tasks: ["Design System", "Universal Create", "Backend API Sync"],
      updatedAt: new Date().toISOString(),
    },
  ],
  goals: [
    {
      id: "g-1",
      userId: "u-demo",
      title: "Build my AI/ML Portfolio",
      category: "Career",
      targetDate: "Dec 2026",
      progress: 75,
      milestones: ["LUMI Frontend Release", "Cloud Persistence", "Deployment"],
      whyItMatters: "Establish my career in AI and product craftsmanship.",
    },
  ],
  journals: [
    {
      id: "j-1",
      userId: "u-demo",
      title: "Morning Clarity & Fresh Intentions",
      date: new Date().toISOString().split("T")[0],
      template: "daily",
      mood: "peaceful",
      entry: "Woke up feeling refreshed. Ready to build with focus and calm energy today.",
      gratitude: "Grateful for cozy mornings, clear vision, and good music.",
    },
  ],
  memories: [
    {
      id: "m-1",
      userId: "u-demo",
      title: "Golden Hour Walk",
      caption: "Soft sunset hues by the bay 🌅",
      date: new Date().toISOString().split("T")[0],
      location: "San Francisco Pier",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      isShared: true,
      tags: ["Sunset", "Walk", "Golden Hour"],
      reactions: { heart: 4, sparkle: 2, fire: 1 },
      comments: [
        { id: "c-1", author: "Maya", text: "Such a magical sky! ✨", time: "2h ago" },
      ],
    },
  ],
  books: [
    {
      id: "b-1",
      userId: "u-demo",
      title: "Atomic Habits",
      author: "James Clear",
      status: "reading",
      currentPage: 142,
      totalPages: 320,
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    },
  ],
};

// Ensure data directory exists
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf8");
  }
}

// Read database
function readDB() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, resetting to default:", err);
    return DEFAULT_DATA;
  }
}

// Write database
function writeDB(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  readDB,
  writeDB,
};
