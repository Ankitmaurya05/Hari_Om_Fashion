import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ----------------- Load Environment Variables -----------------
dotenv.config();

// ----------------- Initialize App -----------------
const app = express();

// ----------------- Webhook Raw Body (MUST come before express.json) -----------------
import paymentWebhook from "./routes/paymentWebhook.js";
app.use(
  "/api/webhook/razorpay",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

// ----------------- CORS Setup -----------------
const allowedOrigins = [
  "https://hari-om-fashion.onrender.com",
  "https://hariomfashion.onrender.com",
  "https://hari-om-fashion-admin.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("🚫 Blocked CORS request from:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ----------------- Middleware -----------------
// Increase body limits to handle large Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Disable COOP/COEP headers for embedding
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

// ----------------- Import Routes -----------------
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrdersRoute from "./routes/adminOrders.js";
import adminPaymentRoute from "./routes/adminPaymentRoutes.js";

// ----------------- Mount API Routes -----------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrdersRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/payments", adminPaymentRoute);

// ----------------- Health Check -----------------
app.get("/", (req, res) => {
  res.send("🚀 Hari-Om Fashion API is running successfully...");
});

// ----------------- MongoDB Connection -----------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ----------------- 404 + Error Handling -----------------
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  if (err.message.includes("CORS"))
    return res.status(403).json({ message: "CORS blocked this request" });
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
