// src/components/ProtectedRoute.jsx
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

  // 1. Show loading indicator while auth state is initializing
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. If not authenticated and initialization still pending → redirect to login
  if (!user && !initialized) {
    const loginPath = roles.map(r => r.toLowerCase()).includes("worker")
      ? "/staff-login"
      : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. If not authenticated after initialization → show Unauthorized
  if (!user && initialized) {
    return <Unauthorized />;
  }

  // DEBUG: print roles and returned user.role
  console.log("🔒 ProtectedRoute:", {
    allowedRoles: roles,
    userRole: user.role
  });

  // Normalize to lowercase to avoid case-sensitivity issues
  const normalizedRoles = roles.map(r => r.toLowerCase());
  const normalizedUserRole = (user.role || "").toLowerCase();

  // 4. If roles are specified and user's role isn't allowed → show Unauthorized
  if (normalizedRoles.length > 0 && !normalizedRoles.includes(normalizedUserRole)) {
    return <Unauthorized />;
  }

  // 5. If a subscription package is required but user doesn't have it → redirect to plans
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 6. If business role but missing businessId → redirect to create-business
  if (
    normalizedRoles.includes("business") &&
    normalizedUserRole === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 7. Authorized → render children
  return children;
}
