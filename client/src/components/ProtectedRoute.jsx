import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// adminOnly: also require role ADMIN
function ProtectedRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner text="Checking your session..." />;

  // Not logged in: go to login, remembering where they wanted to go
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  // Logged in but not an admin
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ProtectedRoute;