import mongoose from "mongoose";

// Opens the connection to MongoDB using the URI from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Without a database the API is useless, so stop the process
    process.exit(1);
  }
};

export default connectDB;