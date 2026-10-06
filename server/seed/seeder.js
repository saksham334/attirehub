import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { products } from "./productData.js";

dotenv.config();

const seedProducts = async () => {
  await connectDB();

  // Wipe old products so running the seed twice never creates duplicates
  await Product.deleteMany();
  const created = await Product.insertMany(products);
  console.log(`Seeded ${created.length} products`);

  // The script is not a server, so close the connection and exit
  await mongoose.connection.close();
  process.exit(0);
};

seedProducts().catch((error) => {
  console.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});