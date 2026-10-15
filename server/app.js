import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import sanitize from "./middleware/sanitize.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Behind a host like Render, the real client IP is in a forwarded header.
// Without this, every visitor would share one rate-limit counter.
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(helmet());

// CLIENT_URL may hold several origins separated by commas
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = a tool like PowerShell, not a browser
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false); // the browser then blocks the response
    },
  })
);

app.use("/api", apiLimiter);
app.use(express.json({ limit: "100kb" }));
app.use(sanitize);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AttireHub API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;