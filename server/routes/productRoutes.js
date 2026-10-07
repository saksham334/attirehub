import express from "express";
import {
  getProducts,
  getProductById,
  getFilterOptions,
  getRelatedProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/filters", getFilterOptions); // before "/:id"
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);

export default router;