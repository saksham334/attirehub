import jwt from "jsonwebtoken";
import User from "../models/User.js";

// protect: only logged-in users may continue
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized: please log in" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized: user no longer exists" });
    }

    req.user = user; // later code can read req.user
    next();
  } catch {
    res.status(401).json({ message: "Not authorized: invalid or expired token" });
  }
};

// adminOnly: must run AFTER protect
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: admins only" });
  }
  next();
};