import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

// ===================== Multer Memory Storage =====================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: parse comma-separated list
const parseList = (val) =>
  typeof val === "string"
    ? val.split(",").map((v) => v.trim()).filter(Boolean)
    : val;

// Helper: Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hari-om-fashion" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// ===================== CREATE PRODUCT =====================
router.post("/", upload.array("images", 6), async (req, res) => {
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
    } = req.body;

    if (!name || !price)
      return res.status(400).json({ message: "Name and price are required" });

    if (!category)
      return res.status(400).json({ message: "Category is required" });

    // Upload images to Cloudinary
    const images = [];
    for (const file of req.files) {
      const imageUrl = await uploadToCloudinary(file.buffer);
      images.push(imageUrl);
    }

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
      isTrending: isTrending === "true",
      images,
      mainImage: images[0] || "",
      rating: 0,
      reviewCount: 0,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Create Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== UPDATE PRODUCT =====================
router.put("/:id", upload.array("images", 6), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        images.push(imageUrl);
      }
      updates.images = images;
      updates.mainImage = images[0];
    }

    if (updates.sizes) updates.sizes = parseList(updates.sizes);
    if (updates.colors) updates.colors = parseList(updates.colors);
    if (updates.isTrending)
      updates.isTrending = updates.isTrending === "true";

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== DELETE PRODUCT =====================
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

// ===================== GET ALL PRODUCTS =====================
router.get("/", async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Get All Products Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== GET PRODUCTS BY CATEGORY =====================
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

// ===================== GET SINGLE PRODUCT =====================
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
