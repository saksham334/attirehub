import express from "express";
import {
  getProducts,
  getProductById,
  getFilterOptions,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
// Must come BEFORE "/:id", otherwise "filters" would be treated as an id
router.get("/filters", getFilterOptions);
router.get("/:id", getProductById);

export default router;