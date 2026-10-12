import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { forgotPasswordRequest } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const data = await forgotPasswordRequest(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 460 }}>
      <div className="card-attire p-4">
        <h1 className="h3 mb-2 text-center">Forgot password?</h1>
        <p className="text-muted small text-center">Enter your email and we'll create a reset link.</p>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
        {message && (
          <div className="alert alert-success py-2" role="status">
            {message}
            <div className="small mt-1">Demo store: the link appears in the server terminal.</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="fp-email" className="form-label">Email</label>
            <input id="fp-email" type="email" className="form-control" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-attire w-100" disabled={submitting}>
            {submitting ? "Sending..." : "Create reset link"}
          </button>
        </form>

        <p className="text-center small mt-4 mb-0"><Link to="/login">Back to log in</Link></p>
      </div>
    </Container>
  );
}

export default ForgotPassword;