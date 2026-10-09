import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Tabs, Tab } from "react-bootstrap";
import useProduct from "../hooks/useProduct";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Rating from "../components/Rating";
import RelatedProducts from "../components/RelatedProducts";
import { formatPrice } from "../utils/formatPrice";
import { getColorStyle } from "../utils/colorMap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Outer component: loads the data and handles loading / error / not found
function ProductDetails() {
  const { id } = useParams(); // reads :id from /product/:id
  const { product, loading, error, notFound, retry } = useProduct(id);

  if (loading) return <Container className="py-5"><LoadingSpinner text="Loading product..." /></Container>;
  if (error) return <Container className="py-5"><ErrorMessage message={error} onRetry={retry} /></Container>;

  if (notFound) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h2">Product not found</h1>
        <p className="text-muted">It may have been removed or the link is wrong.</p>
        <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Back to shop</Link>
      </Container>
    );
  }

  // key={product._id} resets the user's choices when they open another product
  return <ProductView key={product._id} product={product} />;
}

// Inner component: only runs once we definitely have a product
function ProductView({ product }) {
  const { addItem, openDrawer } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const onSale = product.discountPrice > 0;
  const currentPrice = onSale ? product.discountPrice : product.price;
  const percentOff = onSale
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const outOfStock = product.stock === 0;
  const maxQty = Math.min(product.stock, 10);

  // Shared check for Add to cart and Buy now
  const validateSelection = () => {
    if (!size) {
      setNotice({ type: "warning", text: "Please select a size." });
      return false;
    }
    if (!color) {
      setNotice({ type: "warning", text: "Please select a color." });
      return false;
    }
    return true;
  };

  // TEMPORARY: Step 12 replaces these with real cart logic
  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addItem(product, size, color, quantity);
    setNotice({ type: "", text: "" });
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    addItem(product, size, color, quantity);
  navigate("/cart");
  };

  const handleWishlist = () => {
    setNotice({ type: "info", text: "Wishlist saving needs login. It's built in a later step." });
  };

  return (
    <Container className="py-4">
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* ---------- Gallery ---------- */}
        <div className="col-md-6">
          <div className="gallery-main card-attire">
            <img src={product.images[activeImage]} alt={`${product.name}, view ${activeImage + 1}`} />
            {onSale && <span className="badge-sale">-{percentOff}%</span>}
          </div>
          <div className="d-flex gap-2 mt-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`gallery-thumb ${i === activeImage ? "gallery-thumb--active" : ""}`}
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === activeImage}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div className="col-md-6">
          <p className="text-muted small mb-1">{product.brand} &middot; SKU {product.sku}</p>
          <h1 className="h2 mb-2">{product.name}</h1>
          <Rating value={product.rating} count={product.numReviews} />

          <div className="my-3 d-flex align-items-baseline gap-3">
            <span className="display-6 fw-bold" style={{ color: onSale ? "var(--ah-secondary)" : "inherit" }}>
              {formatPrice(currentPrice)}
            </span>
            {onSale && (
              <>
                <span className="text-muted text-decoration-line-through">{formatPrice(product.price)}</span>
                <span className="badge rounded-pill" style={{ background: "var(--ah-highlight)", color: "var(--ah-text)" }}>
                  Save {percentOff}%
                </span>
              </>
            )}
          </div>

          <p>{product.description}</p>

          {/* Color swatches */}
          <fieldset className="mb-3">
            <legend className="h6 fs-6">
              Color: <span className="fw-normal">{color || "choose one"}</span>
            </legend>
            <div className="d-flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch ${color === c ? "swatch--active" : ""}`}
                  style={getColorStyle(c)}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  aria-pressed={color === c}
                  title={c}
                />
              ))}
            </div>
          </fieldset>

          {/* Size chips */}
          <fieldset className="mb-3">
            <legend className="h6 fs-6">
              Size: <span className="fw-normal">{size || "choose one"}</span>
            </legend>
            <div className="d-flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip chip--lg ${size === s ? "chip--active" : ""}`}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Stock status */}
          <p className="small fw-semibold mb-3" style={{ color: outOfStock ? "var(--ah-secondary)" : "#0a8f7c" }}>
            {outOfStock
              ? "Out of stock"
              : product.stock <= 10
              ? `Only ${product.stock} left`
              : "In stock"}
          </p>

          {/* Quantity */}
          {!outOfStock && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <span id="qty-label" className="h6 fs-6 mb-0">Quantity</span>
              <div className="qty-control" role="group" aria-labelledby="qty-label">
                <button
                  type="button" aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="bi bi-dash" aria-hidden="true"></i>
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button" aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                >
                  <i className="bi bi-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button className="btn-attire" onClick={handleAddToCart} disabled={outOfStock}>
              <i className="bi bi-bag-plus me-2" aria-hidden="true"></i>Add to cart
            </button>
            <button className="btn btn-outline-dark rounded-pill px-4" onClick={handleBuyNow} disabled={outOfStock}>
              Buy now
            </button>
            <button className="btn btn-outline-secondary rounded-circle" onClick={handleWishlist} aria-label="Add to wishlist">
              <i className="bi bi-heart" aria-hidden="true"></i>
            </button>
          </div>

          {notice.text && (
            <div className={`alert alert-${notice.type} py-2 small`} role="status">{notice.text}</div>
          )}
        </div>
      </div>

      {/* ---------- Tabs ---------- */}
      <Tabs defaultActiveKey="description" className="mt-5 product-tabs">
        <Tab eventKey="description" title="Description" className="pt-3">
          <p>{product.description}</p>
        </Tab>
        <Tab eventKey="materials" title="Materials" className="pt-3">
          <p>{product.materials || "No material information available."}</p>
        </Tab>
        <Tab eventKey="shipping" title="Shipping & returns" className="pt-3">
          <ul>
            <li>Free standard shipping on orders over $75.</li>
            <li>Standard delivery in 3 to 7 business days.</li>
            <li>30-day returns on unworn items with tags.</li>
          </ul>
          <p className="small text-muted">Demo store: no real orders are shipped.</p>
        </Tab>
        <Tab eventKey="reviews" title={`Reviews (${product.numReviews})`} className="pt-3">
          {product.reviews.length === 0 ? (
            <p className="text-muted">
              Rated {product.rating} out of 5 by {product.numReviews} customers.
              Written reviews and a review form are added in a later step.
            </p>
          ) : (
            product.reviews.map((r) => (
              <div key={r._id} className="mb-3">
                <strong>{r.name}</strong> <Rating value={r.rating} />
                <p className="mb-0">{r.comment}</p>
              </div>
            ))
          )}
        </Tab>
      </Tabs>

      <RelatedProducts productId={product._id} />
    </Container>
  );
}

export default ProductDetails;