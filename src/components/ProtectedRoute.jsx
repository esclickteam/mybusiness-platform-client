import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

export default function ProtectedRoute({
  children,
  roles = [],
  requiredPackage = null
}) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // 1. Show loading indicator until auth is fully initialized
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. If not authenticated at all → redirect to login
  if (!user) {
    const loginPath = roles
      .map(r => r.toLowerCase())
      .includes("worker")
      ? "/staff-login"
      : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. Check role-based access
  const normalizedRoles = roles.map(r => r.toLowerCase());
  const normalizedUserRole = (user.role || "").toLowerCase();

  if (normalizedRoles.length > 0 && !normalizedRoles.includes(normalizedUserRole)) {
    return <Unauthorized />;
  }

  // 4. Subscription-based access
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. Business-onboarding flow
  if (
    normalizedRoles.includes("business") &&
    normalizedUserRole === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. Authorized → render protected content
  return children;
}
