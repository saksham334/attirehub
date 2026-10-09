import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists, nothing to do");
  } else {
    await User.create({ name: "AttireHub Admin", email, password, role: "ADMIN" });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(`Failed: ${error.message}`);
  process.exit(1);
});