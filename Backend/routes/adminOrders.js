// routes/adminOrders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ---------------- Get All Orders (Admin Dashboard) ---------------- */
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone address")
      .populate("items.product", "name mainImage price category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

/* ---------------- Update Order Status ---------------- */
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["Pending", "Shipped", "Delivered", "Completed", "Cancelled"];
  if (!validStatus.includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

export default router;
