import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Load variables from .env into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Adds security-related HTTP headers
app.use(helmet());

// Only allow our React app to call this API from a browser
app.use(cors({ origin: process.env.CLIENT_URL }));

// Parse JSON request bodies into req.body
app.use(express.json());

// Health check: confirms the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AttireHub API is running" });
});

// Catch-all for URLs that don't exist
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});