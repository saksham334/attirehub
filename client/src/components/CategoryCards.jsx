import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const CATEGORIES = [
  { name: "Men", bg: "6C63FF" },
  { name: "Women", bg: "FF6584" },
  { name: "Kids", bg: "FFD166" },
  { name: "Shoes", bg: "252525" },
  { name: "Accessories", bg: "00C2A8" },
];

function CategoryCards() {
  return (
    <Container className="py-4">
      <h2 className="h3 mb-4">Shop by category</h2>
      <div className="category-grid">
        {CATEGORIES.map((c) => (
          <Link key={c.name} to={`/shop?category=${c.name}`} className="category-card">
            <img
              src={`https://placehold.co/400x500/${c.bg}/FFFFFF?text=${encodeURIComponent(c.name)}`}
              alt="" loading="lazy"
            />
            <span className="category-card__label">{c.name}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default CategoryCards;