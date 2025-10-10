import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * 🪝 Razorpay Webhook Handler
 * This route is called by Razorpay after a payment event (e.g., payment.captured)
 */
router.post("/razorpay", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET || "";
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body; // raw buffer provided by express.raw()

    // ✅ Compute expected signature
    const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    if (signature !== expectedSignature) {
      console.warn("❌ Razorpay Webhook Signature Mismatch");
      return res.status(400).send("Invalid signature");
    }

    // ✅ Parse the payload
    const payload = JSON.parse(rawBody.toString());

    if (payload.event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const receipt = payment.notes?.orderId || payment.receipt; // whichever you used

      if (receipt) {
        const order = await Order.findById(receipt);
        if (order) {
          order.isPaid = true;
          order.status = "Processing";
          order.paymentResult = {
            id: payment.id,
            status: "Captured",
            details: payment,
          };
          order.paidAt = new Date();
          await order.save();
          console.log(`✅ Order ${receipt} marked as PAID`);
        } else {
          console.warn(`⚠️ No order found for receipt ${receipt}`);
        }
      } else {
        console.warn("⚠️ Webhook received with no receipt/orderId");
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.status(500).send("Server error");
  }
});

export default router;
