import mongoose from "mongoose";

// =============================
// 📦 Allowed Categories
// =============================
const allowedCategories = ["jeans", "kurtis", "gowns", "lehenga", "salwar"];

// =============================
// ⭐ Review Schema
// =============================
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

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
    // Ratings & Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// =============================
// 🧮 Auto Calculate Rating + Review Count
// =============================
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const avg =
      this.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      this.reviews.length;
    this.rating = Math.round(avg * 10) / 10;
    this.reviewCount = this.reviews.length;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }

  // Ensure mainImage exists
  if (!this.mainImage && this.images.length > 0) {
    this.mainImage = this.images[0];
  }

  next();
});

export default mongoose.model("Product", productSchema);
