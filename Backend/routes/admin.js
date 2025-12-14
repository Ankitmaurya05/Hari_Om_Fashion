import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "hariom";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@hariom";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Admin login route
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Admin login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
