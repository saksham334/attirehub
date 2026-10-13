import { Container } from "react-bootstrap";

// Sample content for the demo: not real customers
const SAMPLES = [
  { name: "Sample customer A", text: "Soft fabric and the colors look just like the photos." },
  { name: "Sample customer B", text: "Fast to browse, easy to filter, and checkout was simple." },
  { name: "Sample customer C", text: "Great fit. I'd happily order the hoodie in another color." },
];

function Testimonials() {
  return (
    <Container className="py-4">
      <h2 className="h3 mb-1">What shoppers say</h2>
      <p className="small text-muted mb-4">Sample feedback for this demo store.</p>
      <div className="row g-4">
        {SAMPLES.map((s) => (
          <div key={s.name} className="col-md-4">
            <figure className="testimonial card-attire h-100">
              <div className="rating mb-2" aria-label="5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((n) => <i key={n} className="bi bi-star-fill" aria-hidden="true"></i>)}
              </div>
              <blockquote className="mb-3">{s.text}</blockquote>
              <figcaption className="small text-muted">{s.name}</figcaption>
            </figure>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Testimonials;