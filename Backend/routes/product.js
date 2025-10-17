import express from "express";
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

// =============================
// 🔹 Helper to parse comma-separated lists
// =============================
const parseList = (val) =>
  typeof val === "string"
    ? val.split(",").map((v) => v.trim()).filter(Boolean)
    : Array.isArray(val)
    ? val
    : [];

// =============================
// 🆕 CREATE PRODUCT
// =============================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      description,
      fabric,
      careInstructions,
      sizes,
      colors,
      isTrending,
      images,
    } = req.body;

    // 🔸 Validation
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    // 🔸 Upload images to Cloudinary
    let imageUrls = [];
    if (images && images.length > 0) {
      for (const img of images) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "hari-om-fashion",
        });
        imageUrls.push(uploadRes.secure_url);
      }
    }

    // 🔸 Create new product
    const product = new Product({
      name,
      price,
      originalPrice,
      category,
      description,
      fabric,
      careInstructions,
      sizes: parseList(sizes),
      colors: parseList(colors),
      isTrending:
        typeof isTrending === "string"
          ? isTrending === "true"
          : Boolean(isTrending),
      images: imageUrls,
      mainImage: imageUrls[0] || "",
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Create Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// ✏️ UPDATE PRODUCT
// =============================
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      description,
      fabric,
      careInstructions,
      sizes,
      colors,
      isTrending,
      images,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🔸 Update images if new ones are provided
    let imageUrls = product.images;
    if (images && images.length > 0) {
      imageUrls = [];
      for (const img of images) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "hari-om-fashion",
        });
        imageUrls.push(uploadRes.secure_url);
      }
    }

    // 🔸 Update fields
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.originalPrice = originalPrice ?? product.originalPrice;
    product.category = category ?? product.category;
    product.description = description ?? product.description;
    product.fabric = fabric ?? product.fabric;
    product.careInstructions = careInstructions ?? product.careInstructions;
    product.sizes = sizes ? parseList(sizes) : product.sizes;
    product.colors = colors ? parseList(colors) : product.colors;
    product.isTrending =
      typeof isTrending === "string"
        ? isTrending === "true"
        : isTrending ?? product.isTrending;
    product.images = imageUrls;
    product.mainImage = imageUrls[0] || product.mainImage;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// ❌ DELETE PRODUCT
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// 📦 GET ALL PRODUCTS
// =============================
router.get("/", async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Get All Products Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// 🏷️ GET PRODUCTS BY CATEGORY
// =============================
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Get Products By Category Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// 🔍 GET SINGLE PRODUCT
// =============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Get Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
