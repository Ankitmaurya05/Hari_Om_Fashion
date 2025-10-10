import express from "express";
import Wishlist from "../models/Wishlist.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// GET user wishlist
router.get("/", async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products.product");
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Fetch wishlist error:", err);
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
});

// ADD to wishlist
router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const exists = wishlist.products.some(item => item.product.toString() === productId);
    if (!exists) wishlist.products.push({ product: productId });

    await wishlist.save();
    await wishlist.populate("products.product");
    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
});

// REMOVE from wishlist
router.delete("/remove/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(item => item.product.toString() !== productId);
    await wishlist.save();
    await wishlist.populate("products.product");
    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ message: "Failed to remove from wishlist", error: err.message });
  }
});

export default router;
