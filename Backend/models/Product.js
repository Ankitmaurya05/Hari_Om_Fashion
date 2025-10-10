import mongoose from "mongoose";

const allowedCategories = ["jeans", "kurtis", "gowns", "lehenga", "salwar"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0, min: 0 },
    mainImage: { type: String, required: true, default: "" },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: {
        values: allowedCategories,
        message: `Category must be one of: ${allowedCategories.join(", ")}`,
      },
    },
    description: { type: String, trim: true, default: "" },
    fabric: { type: String, trim: true, default: "N/A" },
    careInstructions: { type: String, trim: true, default: "N/A" },
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL", "XXL"] },
    colors: { type: [String], default: [] },
    isTrending: { type: Boolean, default: false },

    // Ratings summary
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Optional: set mainImage automatically if missing
productSchema.pre("save", function (next) {
  if (!this.mainImage && this.images.length > 0) {
    this.mainImage = this.images[0];
  }
  next();
});

export default mongoose.model("Product", productSchema);
