import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { getDefaultRedirect } from "./ProtectedRoute";

/**
 * PublicOnlyRoute - For routes that should only be accessible when NOT authenticated
 * (e.g., login, signup, forgot password)
 *
 * If the user is already authenticated, redirects them to their role-based dashboard.
 */
export default function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated, role } = useAuth();

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // If authenticated, redirect to role-based dashboard
  if (isAuthenticated) {
    return <Navigate to={getDefaultRedirect(role)} replace />;
  }

  // Not authenticated, show public content
  return children ? children : <Outlet />;
}
