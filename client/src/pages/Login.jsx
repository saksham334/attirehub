import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in: no need to see this page
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 460 }}>
      <div className="card-attire p-4">
        <h1 className="h3 mb-4 text-center">Welcome back</h1>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" className="form-control" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-control" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-attire w-100" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center small mt-4 mb-0">
          New to AttireHub? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </Container>
  );
}

export default Login;