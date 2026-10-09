import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Limits repeated attempts from one IP (slows down password guessing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

const registerRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("email").isString().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").isString().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

const loginRules = [
  body("email").isString().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

router.post("/register", authLimiter, registerRules, validate, registerUser);
router.post("/login", authLimiter, loginRules, validate, loginUser);
router.get("/me", protect, getMe);

// TEMPORARY route to prove role protection works. We remove it later.
router.get("/admin-check", protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome, admin ${req.user.name}` });
});

export default router;