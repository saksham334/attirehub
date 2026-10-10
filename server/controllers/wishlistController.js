import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// GET /api/wishlist: full product objects (populate swaps ids for documents)
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json(wishlist ? wishlist.products : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load wishlist" });
  }
};

// POST /api/wishlist  body: { productId }
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (typeof productId !== "string" || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!(await Product.exists({ _id: productId }))) {
      return res.status(404).json({ message: "Product not found" });
    }

    // $addToSet adds only if missing, so duplicates are impossible
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { upsert: true }
    );
    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update wishlist" });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    await Wishlist.updateOne(
      { user: req.user._id },
      { $pull: { products: req.params.productId } }
    );
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update wishlist" });
  }
};