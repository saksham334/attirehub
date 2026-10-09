import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Check in the browser first for fast feedback (the server checks again)
    if (!form.name.trim()) return setError("Please enter your name.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 460 }}>
      <div className="card-attire p-4">
        <h1 className="h3 mb-4 text-center">Create your account</h1>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full name</label>
            <input id="name" name="name" className="form-control" autoComplete="name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input id="reg-email" name="email" type="email" className="form-control" autoComplete="email"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input id="reg-password" name="password" type="password" className="form-control"
              autoComplete="new-password" aria-describedby="pw-help"
              value={form.password} onChange={handleChange} required />
            <div id="pw-help" className="form-text">At least 8 characters.</div>
          </div>
          <div className="mb-4">
            <label htmlFor="confirm" className="form-label">Confirm password</label>
            <input id="confirm" name="confirm" type="password" className="form-control"
              autoComplete="new-password" value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-attire w-100" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center small mt-4 mb-0">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </Container>
  );
}

export default Register;