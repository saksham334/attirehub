import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchRelatedProducts } from "../services/productService";

function RelatedProducts({ productId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetchRelatedProducts(productId)
      .then((data) => { if (!ignore) setItems(data); })
      .catch((err) => console.error(err)); // related items are optional, fail quietly
    return () => { ignore = true; };
  }, [productId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-5" aria-labelledby="related-heading">
      <h2 id="related-heading" className="h4 mb-4">You may also like</h2>
      <div className="row g-4">
        {items.map((p) => (
          <div key={p._id} className="col-6 col-md-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;