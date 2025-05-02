import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component
 * Wraps routes that require authentication and authorization.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component(s) to render if access is granted.
 * @param {string[]} [props.roles] - Optional list of roles allowed to access this route.
 * @param {string|null} [props.requiredPackage] - Optional subscription plan required to access this route.
 */
function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Show loading indicator while auth state is initializing
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. If not authenticated, redirect to login page, preserving the attempted URL
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. If roles are specified and user role is not in list, redirect to home
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. If a specific subscription package is required but user doesn't have it, redirect to plans
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. If user is a business role but has no businessId, redirect to create business page
  if (
    roles.includes("business") &&
    user.role === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. Otherwise, grant access and render children
  return children;
}

export default ProtectedRoute;
