import Product from "../models/Product.js";

// GET /api/products
// Query params: search, category, filter (new|sale), minPrice, maxPrice,
//               size, color, rating, sort, page, limit
export const getProducts = async (req, res) => {
  try {
    const {
      search, category, filter, minPrice, maxPrice,
      size, color, rating, sort = "newest",
    } = req.query;

    // Page and limit must be positive whole numbers; fall back to safe defaults
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 48);

    // Build the MongoDB filter object piece by piece
    const query = {};

    // Escape regex symbols so user input can never act as a pattern (injection safety)
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (search && typeof search === "string") {
      // Every word must match somewhere in name, category, subcategory or colors
      const wordConditions = search
        .trim()
        .split(/\s+/)
        .slice(0, 6) // cap the number of words
        .map((word) => {
          const pattern = new RegExp(escapeRegex(word), "i");
          return {
            $or: [
              { name: pattern },
              { category: pattern },
              { subcategory: pattern },
              { colors: pattern },
            ],
          };
        });
      query.$and = wordConditions;
    }

    // typeof checks reject objects like ?category[$ne]=x (NoSQL injection)
    if (category && typeof category === "string") query.category = category;
    if (filter === "new") query.isNewArrival = true;
    if (filter === "sale") query.discountPrice = { $gt: 0 };
    if (size && typeof size === "string") query.sizes = size;
    if (color && typeof color === "string") {
      query.colors = new RegExp(`^${escapeRegex(color)}$`, "i");
    }
    if (rating) query.rating = { $gte: Number(rating) || 0 };

    // Price filter uses the price the customer actually pays.
    // $expr lets us compare using a calculated value inside the query.
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice || maxPrice) {
      const effectivePrice = {
        $cond: [{ $gt: ["$discountPrice", 0] }, "$discountPrice", "$price"],
      };
      const conditions = [];
      if (minPrice && !Number.isNaN(min)) conditions.push({ $gte: [effectivePrice, min] });
      if (maxPrice && !Number.isNaN(max)) conditions.push({ $lte: [effectivePrice, max] });
      if (conditions.length) query.$expr = { $and: conditions };
    }

    // Map the sort option to a MongoDB sort object
    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { soldCount: -1 },
      rating: { rating: -1, numReviews: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    // Run the count and the page fetch at the same time
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
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

// GET /api/products/filters: values used to build the filter sidebar
export const getFilterOptions = async (req, res) => {
  try {
    const [categories, sizes, colors] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("sizes"),
      Product.distinct("colors"),
    ]);
    res.json({ categories, sizes: sizes.sort(), colors: colors.sort() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load filter options" });
  }
};

// GET /api/products/:id/related: up to 4 popular products from the same category
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // exclude the product being viewed
    })
      .sort({ soldCount: -1 })
      .limit(4);

    res.json(related);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Could not load related products" });
  }
};