import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// 🟢 CREATE REVIEW
router.post("/:productId", async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const { productId } = req.params;

    if (!user || !rating || !comment)
      return res.status(400).json({ message: "User, rating, and comment are required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    const review = new Review({
      product: productId,
      user: user.trim(),
      rating: parsedRating,
      comment: comment.trim(),
    });

    await review.save();

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error("❌ Create Review Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟢 GET ALL REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("product", "name").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Fetch All Reviews Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟢 GET REVIEWS FOR A PRODUCT
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Fetch Product Reviews Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔴 DELETE REVIEW (Admin Only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Review Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
