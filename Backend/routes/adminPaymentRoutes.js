import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// 🔹 Get payment summary for admin dashboard
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "name email");

    const stats = {
      card: 0,
      upi: 0,
      cod: 0,
      pending: 0,
      totalAmount: 0,
    };

    payments.forEach((p) => {
      stats.totalAmount += p.amount || 0;

      if (p.status === "Pending") stats.pending += 1;
      else {
        if (p.method === "CARD") stats.card += 1;
        else if (p.method === "UPI") stats.upi += 1;
        else if (p.method === "COD") stats.cod += 1;
      }
    });

    res.json({ stats, payments });
  } catch (err) {
    console.error("Payment stats error:", err);
    res.status(500).json({ message: "Failed to fetch payment stats", error: err.message });
  }
});

export default router;
