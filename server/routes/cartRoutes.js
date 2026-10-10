import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCart, saveCart, mergeCart } from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.put("/", saveCart);
router.post("/merge", mergeCart);

export default router;