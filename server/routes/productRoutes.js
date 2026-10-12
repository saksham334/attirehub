import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  getFilterOptions,
  getRelatedProducts,
  addReview,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const reviewRules = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1 to 5"),
  body("comment").isString().trim().isLength({ min: 3, max: 1000 })
    .withMessage("Review must be 3 to 1000 characters"),
];

router.get("/", getProducts);
router.get("/filters", getFilterOptions); // before "/:id"
router.get("/:id/related", getRelatedProducts);
router.post("/:id/reviews", protect, reviewRules, validate, addReview);
router.get("/:id", getProductById);

export default router;