import express from "express";
import { body } from "express-validator";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  getStats, getInventory, updateStock, getAllOrders, getOrderForAdmin,
  updateOrderStatus, getUsers, updateUserRole,
} from "../controllers/adminController.js";

const router = express.Router();

// Every route below needs a valid login AND the ADMIN role
router.use(protect, adminOnly);

router.get("/stats", getStats);

router.get("/inventory", getInventory);
router.patch(
  "/inventory/:id",
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a whole number, 0 or more").toInt(),
  validate,
  updateStock
);

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderForAdmin);
router.put(
  "/orders/:id",
  body("status").isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status"),
  validate,
  updateOrderStatus
);

router.get("/users", getUsers);
router.put(
  "/users/:id/role",
  body("role").isIn(["USER", "ADMIN"]).withMessage("Role must be USER or ADMIN"),
  validate,
  updateUserRole
);

export default router;