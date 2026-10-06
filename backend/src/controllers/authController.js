const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const { JWT_SECRET } = require("../middleware/auth");

/**
 * Handles new user registration.
 */
async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userService.createUser({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name: name?.trim() || email.split("@")[0],
    });

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

/**
 * Handles user login with email and password.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
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

/**
 * Retrieves profile of the currently authenticated user.
 */
async function getMe(req, res) {
  try {
    const user = await userService.findUserById(req.user.id);
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
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Internal server error retrieving user profile" });
  }
}

/**
 * Updates profile fields for the currently authenticated user.
 */
async function updateMe(req, res) {
  try {
    const { name, bio, theme } = req.body;

    const updatedUser = await userService.updateUser(req.user.id, {
      name,
      bio,
      theme,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio,
        theme: updatedUser.theme,
      },
    });
  } catch (err) {
    console.error("UpdateMe error:", err);
    res.status(500).json({ error: "Internal server error updating profile" });
  }
}

module.exports = {
  signup,
  login,
  getMe,
  updateMe,
};
