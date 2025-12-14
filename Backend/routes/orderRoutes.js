import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const router = express.Router();

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------- Create Order ----------------
router.post("/", authMiddleware, async (req, res) => {
  const { items, shippingFee = 49, paymentMethod } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0)
    return res.status(400).json({ message: "Items are required" });
  if (!["COD", "UPI", "CARD"].includes(paymentMethod))
    return res.status(400).json({ message: "Invalid payment method" });

  try {
    // Validate products
    const products = await Product.find({
      _id: { $in: items.map((i) => i.productId) },
    });
    if (products.length !== items.length)
      return res.status(400).json({ message: "Some products not found" });

    // Prepare order items
    const orderItems = items.map((i) => {
      const product = products.find((p) => p._id.toString() === i.productId);
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
        mainImage: product.mainImage || product.images?.[0] || "",
      };
    });

    const totalProducts = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = totalProducts + shippingFee;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.phone || !user.address?.line || !user.address?.pincode)
      return res.status(400).json({ message: "Please fill phone and address" });

    // Create order
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      total,
      shippingFee,
      paymentMethod,
      status: paymentMethod === "COD" ? "Pending" : "Created",
      isPaid: paymentMethod === "COD" ? false : true,
    });

    // Update user order count
    user.orders = (user.orders || 0) + 1;
    await user.save();

    // ---------------- Create Payment Record ----------------
    await Payment.create({
      order: newOrder._id,
      user: userId,
      method: paymentMethod,
      amount: total,
      status: paymentMethod === "COD" ? "Pending" : "Paid",
    });

    // ---------------- Razorpay Flow ----------------
    let paymentSession = null;
    if (paymentMethod === "CARD" || paymentMethod === "UPI") {
      const razorOrder = await razorpay.orders.create({
        amount: total * 100, // in paise
        currency: "INR",
        receipt: newOrder._id.toString(),
      });

      paymentSession = {
        type: "razorpay",
        order_id: razorOrder.id,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      };
    }

    res.json({
      message: "Order created successfully",
      orderId: newOrder._id,
      paymentSession,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

// ---------------- Verify Razorpay Payment ----------------
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      req.body;

    if (!razorpay_signature)
      return res.status(400).json({ message: "Missing payment verification data" });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid payment signature" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "Paid",
      details: { razorpay_order_id, razorpay_signature },
    };
    await order.save();

    // Update Payment record
    const payment = await Payment.findOne({ order: orderId });
    if (payment) {
      payment.status = "Paid";
      payment.method = order.paymentMethod;
      await payment.save();
    }

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
});

// ---------------- COD Payment ----------------
router.post("/:id/pay", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";
    order.paymentResult = {
      id: `manual_${Date.now()}`,
      status: "COD Paid",
    };
    await order.save();

    // Update Payment record
    const payment = await Payment.findOne({ order: id });
    if (payment) {
      payment.status = "Paid";
      payment.method = "COD";
      await payment.save();
    }

    res.json({ message: "COD Payment marked as paid" });
  } catch (err) {
    res.status(500).json({ message: "Error updating COD payment", error: err.message });
  }
});

// ---------------- Get Latest Order ----------------
router.get("/latest", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.user._id })
      .populate("user", "name email phone address")
      .populate("items.product", "name mainImage price category")
      .sort({ createdAt: -1 });

    if (!order) return res.status(404).json({ message: "No orders found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch latest order", error: err.message });
  }
});

export default router;
