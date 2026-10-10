import { useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

// Heart toggle used on product cards and the product page
function WishlistButton({ productId, className = "" }) {
  const { isInWishlist, toggle } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const active = isInWishlist(productId);

  const handleClick = async (event) => {
    event.preventDefault(); // in case it sits inside a link
    const ok = await toggle(productId);
    if (!ok) navigate("/login", { state: { from: location.pathname + location.search } });
  };

  return (
    <button
      type="button"
      className={`wishlist-btn ${active ? "wishlist-btn--active" : ""} ${className}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i className={`bi ${active ? "bi-heart-fill" : "bi-heart"}`} aria-hidden="true"></i>
    </button>
  );
}

export default WishlistButton;