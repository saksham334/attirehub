// Shows 0-5 stars using Bootstrap Icons, plus the review count
function Rating({ value = 0, count = 0 }) {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    let icon = "bi-star";
    if (value >= n) icon = "bi-star-fill";
    else if (value >= n - 0.5) icon = "bi-star-half";
    return <i key={n} className={`bi ${icon}`} aria-hidden="true"></i>;
  });

  return (
    <div className="rating" aria-label={`Rated ${value} out of 5 from ${count} reviews`}>
      {stars}
      <span className="ms-1 small text-muted">({count})</span>
    </div>
  );
}

export default Rating;