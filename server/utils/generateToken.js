import jwt from "jsonwebtoken";

// Creates a signed token that expires in 7 days
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export default generateToken;