import Rating from "./Rating";
import { formatPrice } from "../utils/formatPrice";

// A product is on sale when discountPrice is above 0
function ProductCard({ product }) {
  const onSale = product.discountPrice > 0;
  const percentOff = onSale
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <article className="product-card card-attire h-100">
      <div className="product-card__image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="product-card__image"
        />
        {onSale && <span className="badge-sale">-{percentOff}%</span>}
        {product.isNewArrival && !onSale && <span className="badge-new">New</span>}
      </div>

      <div className="p-3">
        <p className="small text-muted mb-1">{product.category}</p>
        <h3 className="h6 mb-2">{product.name}</h3>
        <Rating value={product.rating} count={product.numReviews} />

        <div className="mt-2">
          {onSale ? (
            <>
              <span className="fw-bold me-2" style={{ color: "var(--ah-secondary)" }}>
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-muted text-decoration-line-through small">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="fw-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;