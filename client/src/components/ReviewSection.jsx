import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Rating from "./Rating";
import { useAuth } from "../context/AuthContext";
import { submitReview } from "../services/productService";
import { formatDate } from "../utils/formatDate";

// reviews: current list. onAdded(product): called with the updated product.
function ReviewSection({ productId, reviews, rating, numReviews, onAdded }) {
  const { user } = useAuth();
  const location = useLocation();
  const [stars, setStars] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed = user && reviews.some((r) => String(r.user) === String(user._id));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (comment.trim().length < 3) return setError("Please write at least a few words.");

    setSubmitting(true);
    try {
      const updated = await submitReview(productId, Number(stars), comment.trim());
      setComment("");
      onAdded(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="review-section">
    {reviews.length === 0 ? (
      <p className="text-muted">
        Rated {rating} out of 5 by {numReviews} customers. Be the first to write a review below.
      </p>
    ) : (
      reviews.map((r) => (
        <article key={r._id} className="review-item">
          <div className="review-item__head">
            <strong className="review-item__name">{r.name}</strong>
            <Rating value={r.rating} />
            <span className="review-item__date">{formatDate(r.createdAt)}</span>
          </div>
          <p className="review-item__text">{r.comment}</p>
        </article>
      ))
    )}

    <h3 className="h6 mt-4">Write a review</h3>
    {!user ? (
      <p className="small">
        <Link to="/login" state={{ from: location.pathname }} className="review-link">
          Log in
        </Link>{" "}
        to write a review.
      </p>
    ) : alreadyReviewed ? (
      <p className="small text-muted">You have already reviewed this product. Thank you!</p>
    ) : (
      <form onSubmit={handleSubmit} noValidate className="review-form">
        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
        <div className="mb-3">
          <label htmlFor="review-stars" className="form-label">Rating</label>
          <select id="review-stars" className="form-select" value={stars} onChange={(e) => setStars(e.target.value)}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="review-comment" className="form-label">Your review</label>
          <textarea id="review-comment" rows="3" maxLength="1000" className="form-control"
            value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit" className="btn-attire" disabled={submitting}>
          {submitting ? "Posting..." : "Post review"}
        </button>
      </form>
    )}
  </div>
);
}

export default ReviewSection;