import Product from "../models/Product.js";

// GET /api/products: return all products, newest first
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load products" });
  }
};

// GET /api/products/:id: return one product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    // CastError means the id in the URL isn't a valid MongoDB id
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Could not load product" });
  }
};