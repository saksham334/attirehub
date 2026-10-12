import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { calculateTotals } from "../utils/calculateTotals.js";

// An error we want to show the customer as a 400 (not a generic 500)
class OrderError extends Error {}

// POST /api/orders  body: { shippingAddress, paymentMethod }
export const createOrder = async (req, res) => {
  const reserved = []; // stock we have already taken, so we can give it back on failure

  try {
    const { shippingAddress: a, paymentMethod } = req.body;

    // 1. Read the cart from the DATABASE, with real product data
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      throw new OrderError("Your cart is empty");
    }

    // 2. Build the items using database prices, never client prices
    const orderItems = cart.items.map((item) => {
      const p = item.product;
      if (!p) throw new OrderError("An item in your cart is no longer available");
      if (p.stock < item.quantity) {
        throw new OrderError(`Not enough stock for ${p.name} (only ${p.stock} left)`);
      }
      return {
        product: p._id,
        name: p.name,
        image: p.images[0] || "",
        price: p.discountPrice > 0 ? p.discountPrice : p.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      };
    });

    // 3. Calculate totals on the server
    const totals = calculateTotals(orderItems);

    // 4. Reserve stock. The $gte condition makes this safe if two people buy at once.
    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } }
      );
      if (result.modifiedCount === 0) {
        throw new OrderError(`${item.name} just sold out`);
      }
      reserved.push(item);
    }

    // 5. Save the order. We pick the address fields one by one (no extra fields get in).
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: {
        fullName: a.fullName,
        phone: a.phone || "",
        street: a.street,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country,
      },
      paymentMethod,
      // Demo payments are marked paid; cash on delivery stays pending
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID_DEMO",
      ...totals,
    });

    // 6. Empty the saved cart
    await Cart.updateOne({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    // Give back any stock we reserved before the failure
    for (const item of reserved) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity, soldCount: -item.quantity } }
      ).catch((err) => console.error("Stock rollback failed", err));
    }

    if (error instanceof OrderError) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Could not place your order" });
  }
};

// GET /api/orders/:id  (owner or admin only)
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id);

    // Same 404 for "doesn't exist" and "not yours", so ids can't be probed
    const isOwner = order && String(order.user) === String(req.user._id);
    if (!order || (!isOwner && req.user.role !== "ADMIN")) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load order" });
  }
};

// GET /api/orders: the logged-in user's orders, newest first
export const getMyOrders = async (req, res) => {
  try {
    // Filtering by req.user._id means nobody can list someone else's orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load orders" });
  }
};