import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const LOW_STOCK_LIMIT = 10;
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const round = (n) => Math.round(n * 100) / 100;

// GET /api/admin/stats: everything the dashboard needs in one request
export const getStats = async (req, res) => {
  try {
    const [sales, byStatus, totalOrders, totalUsers, totalProducts, lowStock, recentOrders] =
      await Promise.all([
        // Cancelled orders don't count as sales
        Order.aggregate([
          { $match: { status: { $ne: "Cancelled" } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Product.find({ stock: { $lte: LOW_STOCK_LIMIT } })
          .select("name sku stock images")
          .sort({ stock: 1 })
          .limit(10),
        Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email"),
      ]);

    const ordersByStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]));
    byStatus.forEach((row) => { ordersByStatus[row._id] = row.count; });

    res.json({
      totalSales: round(sales[0]?.total || 0),
      totalOrders,
      totalUsers,
      totalProducts,
      ordersByStatus,
      lowStockLimit: LOW_STOCK_LIMIT,
      lowStock,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load dashboard stats" });
  }
};

// GET /api/admin/inventory: every product with a stock status, lowest stock first
export const getInventory = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name sku category stock images")
      .sort({ stock: 1, name: 1 })
      .lean();

    const inventory = products.map((p) => ({
      ...p,
      status: p.stock === 0 ? "Out of stock" : p.stock <= LOW_STOCK_LIMIT ? "Low stock" : "In stock",
    }));
    res.json({ lowStockLimit: LOW_STOCK_LIMIT, inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load inventory" });
  }
};

// PATCH /api/admin/inventory/:id  body: { stock }: quick stock update
export const updateStock = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { returnDocument: "after", runValidators: true }
    ).select("name sku category stock images");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update stock" });
  }
};

// GET /api/admin/orders?status=Pending
export const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    // Only accept a known status string (blocks injected objects)
    if (typeof req.query.status === "string" && ORDER_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load orders" });
  }
};

// GET /api/admin/orders/:id: one order with the customer
export const getOrderForAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load order" });
  }
};

// PUT /api/admin/orders/:id  body: { status }
export const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const next = req.body.status;
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "A cancelled order cannot be changed" });
    }
    if (next === "Cancelled" && order.status === "Delivered") {
      return res.status(400).json({ message: "A delivered order cannot be cancelled" });
    }

    // Cancelling puts the items back in stock
    if (next === "Cancelled") {
      for (const item of order.orderItems) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity, soldCount: -item.quantity } }
        );
      }
    }

    order.status = next;
    await order.save();
    await order.populate("user", "name email");
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update order" });
  }
};

// GET /api/admin/users (passwords are never returned: select:false in the model)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load users" });
  }
};

// PUT /api/admin/users/:id/role  body: { role }
export const updateUserRole = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "User not found" });
    }
    // Stops an admin removing their own access by accident
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { returnDocument: "after", runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update user" });
  }
};