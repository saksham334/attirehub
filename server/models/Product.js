import mongoose from "mongoose";

// Reviews live INSIDE each product document (embedded), because they are
// always read together with the product and each product has a limited number
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    // 0 means "not on sale"; anything above 0 is the sale price
    discountPrice: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Shoes", "Accessories"],
    },
    subcategory: { type: String, default: "" },
    brand: { type: String, default: "AttireHub" },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    materials: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 }, // used for "Popularity" sorting
  },
  // timestamps: true adds createdAt and updatedAt automatically
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;