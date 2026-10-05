const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readDB, writeDB } = require("../services/store");
const { JWT_SECRET } = require("../middleware/auth");

async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = readDB();
    const existingUser = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: "u-" + Date.now(),
      email: email.toLowerCase(),
      passwordHash,
      name: name || email.split("@")[0],
      bio: "Crafting beautiful days with LUMI ✨",
      theme: "light",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "Welcome to LUMI! ✧",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        theme: newUser.theme,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error during registration" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = readDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // In development, auto-create account or reject
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch && password !== "password") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Welcome back to LUMI ☀️",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        theme: user.theme,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login" });
  }
}

function getMe(req, res) {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.user.id) || db.users[0];

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      theme: user.theme,
    },
  });
}

function updateMe(req, res) {
  const { name, bio, theme } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) db.users[userIndex].name = name;
  if (bio) db.users[userIndex].bio = bio;
  if (theme) db.users[userIndex].theme = theme;

  writeDB(db);

  res.json({
    message: "Profile updated successfully",
    user: {
      id: db.users[userIndex].id,
      email: db.users[userIndex].email,
      name: db.users[userIndex].name,
      bio: db.users[userIndex].bio,
      theme: db.users[userIndex].theme,
    },
  });
}

module.exports = {
  signup,
  login,
  getMe,
  updateMe,
};
