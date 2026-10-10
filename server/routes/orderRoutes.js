import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createOrder, getOrderById } from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);

// Required text field, max 100 characters. isString blocks injected objects.
const text = (field, label) =>
  body(field).isString().trim().notEmpty().withMessage(`${label} is required`)
    .isLength({ max: 100 }).withMessage(`${label} is too long`);

const orderRules = [
  text("shippingAddress.fullName", "Full name"),
  text("shippingAddress.street", "Street address"),
  text("shippingAddress.city", "City"),
  text("shippingAddress.state", "Province or state"),
  text("shippingAddress.postalCode", "Postal code"),
  text("shippingAddress.country", "Country"),
  body("shippingAddress.phone").optional({ values: "falsy" }).isString().isLength({ max: 30 })
    .withMessage("Phone number is too long"),
  body("paymentMethod").isIn(["CARD_DEMO", "PAYPAL_DEMO", "COD"])
    .withMessage("Choose a payment method"),
];

router.post("/", orderRules, validate, createOrder);
router.get("/:id", getOrderById);

export default router;