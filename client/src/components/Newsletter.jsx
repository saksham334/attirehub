import { useState } from "react";
import { Container } from "react-bootstrap";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) return setStatus({ type: "danger", text: "Please enter a valid email address." });

    // Demo: nothing is stored or sent. A real version would call an API here.
    setStatus({ type: "success", text: "Thanks for subscribing! (Demo: your email was not saved.)" });
    setEmail("");
  };

  return (
    <Container className="py-4">
      <section className="newsletter" aria-labelledby="news-heading">
        <h2 id="news-heading" className="h3 text-white">Get 10% off your first order</h2>
        <p className="text-white mb-4">Join the AttireHub list for new drops and sales.</p>
        <form onSubmit={handleSubmit} noValidate className="newsletter__form">
          <label htmlFor="news-email" className="visually-hidden">Email address</label>
          <input id="news-email" type="email" className="form-control" placeholder="you@example.com"
            autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-dark rounded-pill px-4">Subscribe</button>
        </form>
        {status.text && (
          <div className={`alert alert-${status.type} py-2 mt-3 mb-0`} role="status">{status.text}</div>
        )}
      </section>
    </Container>
  );
}

export default Newsletter;