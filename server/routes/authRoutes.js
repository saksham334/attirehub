import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import {
  registerUser, loginUser, getMe, updateProfile, changePassword,forgotPassword, resetPassword
} from "../controllers/authController.js";
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

const shortText = (field) => body(field).optional().isString().trim().isLength({ max: 100 });

const profileRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name is too long"),
  body("address").optional().isObject().withMessage("Invalid address"),
  shortText("address.street"),
  shortText("address.city"),
  shortText("address.state"),
  shortText("address.postalCode"),
  shortText("address.country"),
];

const passwordRules = [
  body("currentPassword").isString().notEmpty().withMessage("Current password is required"),
  // bcrypt only uses the first 72 bytes, so we cap the length
  body("newPassword").isString().isLength({ min: 8, max: 72 })
    .withMessage("New password must be 8 to 72 characters"),
];

const forgotRules = [
  body("email").isString().isEmail().withMessage("Enter a valid email").normalizeEmail(),
];

const resetRules = [
  body("password").isString().isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8 to 72 characters"),
];

router.post("/register", authLimiter, registerRules, validate, registerUser);
router.post("/login", authLimiter, loginRules, validate, loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, profileRules, validate, updateProfile);
router.put("/password", authLimiter, protect, passwordRules, validate, changePassword);
router.post("/forgot-password", authLimiter, forgotRules, validate, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetRules, validate, resetPassword);

// TEMPORARY route to prove role protection works. We remove it later.
router.get("/admin-check", protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome, admin ${req.user.name}` });
});

export default router;