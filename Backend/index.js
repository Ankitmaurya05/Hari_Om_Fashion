import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ----------------- Load Environment Variables -----------------
dotenv.config();

// ----------------- Fix __dirname for ES Modules -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------- Initialize App -----------------
const app = express();

// ----------------- Ensure Uploads Folder Exists -----------------
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Created uploads folder at:", uploadsPath);
}

// ----------------- CORS Setup -----------------
// Add the frontends you use (dev and prod). Add more if you host elsewhere.
const allowedOrigins = [
  "https://hariomfashion.onrender.com", // prod frontend (https)
  "https://hari-om-fashion.onrender.com", // if you have this domain
  "http://localhost:5173", // Vite dev (http)
  "http://localhost:3000", // CRA dev (if any)
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("Blocked CORS request from:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ----------------- Webhook Route FIRST (needs raw body) -----------------
import paymentWebhook from "./routes/paymentWebhook.js";
app.use("/api/webhook/razorpay", express.raw({ type: "application/json" }), paymentWebhook);

// ----------------- Regular Middleware -----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- Serve Uploaded Images with open CORS for images -----------------
// For static uploads, set Access-Control-Allow-Origin: * so images can be embedded cross-origin
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
}, express.static(uploadsPath));

// ----------------- Route Imports -----------------
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

// ----------------- Security Headers Fix (if required) -----------------
app.use((req, res, next) => {
  // remove header only if set upstream; harmless otherwise
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

// ----------------- API Routes -----------------
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
app.get("/", (req, res) => res.send("🚀 API is running successfully..."));

// ----------------- MongoDB Connection -----------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ----------------- 404 Handler -----------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------- Global Error Handler -----------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message || err);
  // if CORS error, send 403 so it's clearer in logs
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
