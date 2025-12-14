// routes/adminOrders.js
import express from "express";
import Order from "../models/Order.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Protect all routes with admin authentication
router.use(adminAuth);

/* =====================================================
   GET ALL ORDERS (ADMIN)
   ===================================================== */
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone address")
      .populate("items.product", "name mainImage price category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Fetch all orders error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/* =====================================================
   UPDATE ORDER STATUS
   ===================================================== */
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const VALID_STATUS = ["Pending", "Shipped", "Delivered", "Completed", "Cancelled"];

  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Update order status error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});

export default router;
