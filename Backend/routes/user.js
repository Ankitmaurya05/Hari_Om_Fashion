import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 📋 Get all users — (Admin only in future)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("name email orders createdAt");
    res.json(users);
  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * 👤 Get current user details
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // ✅ Ensure req.user is attached by authMiddleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized. Invalid token." });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Get user error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/**
 * ✏️ Update current user (phone + address)
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized. Invalid token." });
    }

    const { phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (phone) user.phone = phone;
    if (address) {
      user.address = {
        line: address.line || user.address.line || "",
        city: address.city || user.address.city || "",
        state: address.state || user.address.state || "",
        pincode: address.pincode || user.address.pincode || "",
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

export default router;
