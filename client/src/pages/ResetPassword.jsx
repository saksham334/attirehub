import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { resetPasswordRequest } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      await resetPasswordRequest(token, password);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 460 }}>
        <i className="bi bi-check-circle-fill display-3" style={{ color: "var(--ah-accent)" }} aria-hidden="true"></i>
        <h1 className="h3 mt-2">Password updated</h1>
        <Link to="/login" className="btn-attire d-inline-block text-decoration-none mt-3">Log in</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 460 }}>
      <div className="card-attire p-4">
        <h1 className="h3 mb-4 text-center">Set a new password</h1>
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
            <div className="small mt-1"><Link to="/forgot-password">Request a new link</Link></div>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="rp-password" className="form-label">New password</label>
            <input id="rp-password" type="password" className="form-control" autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label htmlFor="rp-confirm" className="form-label">Confirm password</label>
            <input id="rp-confirm" type="password" className="form-control" autoComplete="new-password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className="btn-attire w-100" disabled={submitting}>
            {submitting ? "Saving..." : "Update password"}
          </button>
        </form>
      </div>
    </Container>
  );
}

export default ResetPassword;