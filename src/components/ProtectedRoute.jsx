import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Get the default redirect path based on user role
 */
function getDefaultRedirect(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "owner":
      return "/owner/dashboard";
    case "user":
    default:
      return "/dashboard";
  }
}

/**
 * Get the login path based on the route being accessed
 */
function getLoginPath(pathname) {
  if (pathname.startsWith("/admin")) {
    return "/admin/login";
  }
  if (pathname.startsWith("/owner")) {
    return "/login/owner";
  }
  return "/login/user";
}

/**
 * ProtectedRoute - Protects routes that require authentication
 *
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @param {React.ReactNode} children - Optional children to render instead of Outlet
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
    const loginPath = getLoginPath(location.pathname);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If allowedRoles specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      // Redirect to their role-appropriate dashboard
      return <Navigate to={getDefaultRedirect(role)} replace />;
    }

    // Special check for owners - must be approved
    if (role === "owner" && user?.approved === false) {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has correct role
  return children ? children : <Outlet />;
}

export { getDefaultRedirect };
