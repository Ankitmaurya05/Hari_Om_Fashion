import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  mainImage: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    shippingFee: { type: Number, default: 49 },
    paymentMethod: { type: String, enum: ["COD", "UPI", "CARD"], required: true },
    status: { type: String, default: "Pending" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentResult: {
      id: String,
      status: String,
      details: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
