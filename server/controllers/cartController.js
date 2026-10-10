import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Turns the saved cart into the shape the React cart uses.
// Prices come from the Product collection, never from the client.
const buildResponse = async (cart) => {
  if (!cart) return [];
  await cart.populate("items.product");

  return cart.items
    .filter((i) => i.product) // skip products deleted since
    .map((i) => {
      const p = i.product;
      return {
        lineId: `${p._id}-${i.selectedSize}-${i.selectedColor}`,
        _id: p._id,
        name: p.name,
        image: p.images[0],
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        size: i.selectedSize,
        color: i.selectedColor,
        quantity: Math.min(i.quantity, p.stock, 10),
      };
    });
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(await buildResponse(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load cart" });
  }
};

// Validates raw items from the client and merges duplicates (same product+size+color)
const cleanItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length > 50) return null;

  const merged = new Map();
  for (const raw of rawItems) {
    const { productId, size, color } = raw || {};
    const quantity = Number(raw?.quantity);
    if (
      typeof productId !== "string" || !mongoose.isValidObjectId(productId) ||
      typeof size !== "string" || typeof color !== "string" ||
      !Number.isInteger(quantity) || quantity < 1
    ) continue; // ignore malformed lines

    const key = `${productId}-${size}-${color}`;
    const existing = merged.get(key);
    merged.set(key, { productId, size, color, quantity: (existing?.quantity || 0) + quantity });
  }

  // Check each line against the real product
  const result = [];
  for (const line of merged.values()) {
    const product = await Product.findById(line.productId);
    if (!product || product.stock < 1) continue;
    if (!product.sizes.includes(line.size) || !product.colors.includes(line.color)) continue;
    result.push({
      product: product._id,
      selectedSize: line.size,
      selectedColor: line.color,
      quantity: Math.min(line.quantity, product.stock, 10),
    });
  }
  return result;
};

// PUT /api/cart  body: { items: [{ productId, size, color, quantity }] }
// Replaces the saved cart with the validated version
export const saveCart = async (req, res) => {
  try {
    const items = await cleanItems(req.body.items);
    if (items === null) return res.status(400).json({ message: "Invalid cart" });

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, returnDocument: "after" }
    );
    res.json(await buildResponse(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save cart" });
  }
};

// POST /api/cart/merge  body: { items } (the guest cart)
// Adds guest items on top of the saved cart, then returns the combined cart
export const mergeCart = async (req, res) => {
  try {
    const guestItems = await cleanItems(req.body.items);
    if (guestItems === null) return res.status(400).json({ message: "Invalid cart" });

    const existing = await Cart.findOne({ user: req.user._id });
    const saved = (existing?.items || []).map((i) => ({
      productId: String(i.product),
      size: i.selectedSize,
      color: i.selectedColor,
      quantity: i.quantity,
    }));
    const guest = guestItems.map((i) => ({
      productId: String(i.product),
      size: i.selectedSize,
      color: i.selectedColor,
      quantity: i.quantity,
    }));

    const combined = await cleanItems([...saved, ...guest]);
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: combined },
      { upsert: true, returnDocument: "after" }
    );
    res.json(await buildResponse(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not merge cart" });
  }
};