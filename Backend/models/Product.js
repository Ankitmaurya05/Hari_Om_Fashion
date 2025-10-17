import mongoose from "mongoose";

// =============================
// 📦 Allowed Categories
// =============================
const allowedCategories = ["jeans", "kurtis", "gowns", "lehenga", "salwar"];

// =============================
// 🛍 Product Schema
// =============================
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, "Original price cannot be negative"],
    },
    mainImage: {
      type: String,
      default: "",
      required: [true, "Main image is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: allowedCategories,
        message: (props) =>
          `Category must be one of: ${allowedCategories.join(", ")}`,
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    fabric: {
      type: String,
      trim: true,
      default: "N/A",
    },
    careInstructions: {
      type: String,
      trim: true,
      default: "N/A",
    },
    sizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    colors: {
      type: [String],
      default: [],
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// =============================
// 🧮 Ensure mainImage exists
// =============================
productSchema.pre("save", function (next) {
  if (!this.mainImage && this.images.length > 0) {
    this.mainImage = this.images[0];
  }
  next();
});

export default mongoose.model("Product", productSchema);
