import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  getFilterOptions,
  getRelatedProducts,
  addReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const reviewRules = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1 to 5"),
  body("comment").isString().trim().isLength({ min: 3, max: 1000 })
    .withMessage("Review must be 3 to 1000 characters"),
];

// An image is a full web address or a path on our own site
const isImagePath = (value) =>
  typeof value === "string" && (/^https?:\/\//.test(value) || value.startsWith("/"));

const productRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required").isLength({ max: 120 }),
  body("description").isString().trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be 0 or more").toFloat(),
  body("discountPrice").optional().isFloat({ min: 0 }).withMessage("Sale price must be 0 or more").toFloat()
    .custom((value, { req }) => value === 0 || value < Number(req.body.price))
    .withMessage("Sale price must be lower than the regular price (or 0 for no sale)"),
  body("category").isIn(["Men", "Women", "Kids", "Shoes", "Accessories"]).withMessage("Choose a valid category"),
  body("subcategory").optional().isString().trim().isLength({ max: 60 }),
  body("brand").optional().isString().trim().isLength({ max: 60 }),
  body("materials").optional().isString().trim().isLength({ max: 200 }),
  body("sku").isString().trim().notEmpty().withMessage("SKU is required").isLength({ max: 40 }),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a whole number, 0 or more").toInt(),
  body("sizes").isArray({ min: 1, max: 20 }).withMessage("Add at least one size"),
  body("sizes.*").isString().trim().notEmpty().withMessage("Sizes cannot be empty"),
  body("colors").isArray({ min: 1, max: 20 }).withMessage("Add at least one color"),
  body("colors.*").isString().trim().notEmpty().withMessage("Colors cannot be empty"),
  body("images").isArray({ min: 1, max: 10 }).withMessage("Add at least one image"),
  body("images.*").custom(isImagePath).withMessage("Each image must be a web address or start with /"),
  body("featured").optional().isBoolean().toBoolean(),
  body("isNewArrival").optional().isBoolean().toBoolean(),
];

// Public
router.get("/", getProducts);
router.get("/filters", getFilterOptions); // before "/:id"
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);

// Logged-in users
router.post("/:id/reviews", protect, reviewRules, validate, addReview);

// Admin only
router.post("/", protect, adminOnly, productRules, validate, createProduct);
router.put("/:id", protect, adminOnly, productRules, validate, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;