import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

// Refuse to start with missing or weak secrets, instead of failing later in odd ways
const secret = process.env.JWT_SECRET || "";
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}
if (secret.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters. Generate one with:");
  console.error(`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();