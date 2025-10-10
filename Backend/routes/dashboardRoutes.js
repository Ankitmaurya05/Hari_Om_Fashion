import express from "express";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Order from "../models/Order.js"; // For payment stats

const router = express.Router();

// -------------------- Dashboard Counts --------------------
router.get("/counts", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({ totalProducts, totalReviews, totalUsers });
  } catch (err) {
    console.error("❌ Dashboard counts error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard counts", error: err.message });
  }
});

// -------------------- Payment Stats --------------------
router.get("/payments",async (req, res) => {
  try {
    // Count payments by type
    const cod = await Order.countDocuments({ paymentMethod: "COD" });
    const card = await Order.countDocuments({ paymentMethod: "CARD", isPaid: true });
    const upi = await Order.countDocuments({ paymentMethod: "UPI", isPaid: true });
    const pending = await Order.countDocuments({ isPaid: false });

    res.json({ cod, card, upi, pending });
  } catch (err) {
    console.error("❌ Dashboard payment stats error:", err);
    res.status(500).json({ message: "Failed to fetch payment stats", error: err.message });
  }
});

// -------------------- Users List --------------------
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("name email createdAt orders") // only select needed fields
      .sort({ createdAt: -1 }); // latest users first

    const totalUsers = users.length;

    res.json({ totalUsers, users });
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

export default router;
