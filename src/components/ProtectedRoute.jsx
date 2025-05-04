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

  // 1. Show loading indicator until auth is fully initialized
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // helper: which roles use the staff-login flow
  const staffRoles = ["worker", "manager", "מנהל", "admin"];

  // 2. If not authenticated at all → redirect to appropriate login
  if (!user) {
    // if this route is protected for any staff role → staff-login
    const needsStaffLogin = roles
      .map(r => r.toLowerCase())
      .some(r => staffRoles.includes(r));

    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. Role-based authorization
  if (roles.length > 0) {
    const normalizedRoles = roles.map(r => r.toLowerCase());
    const normalizedUserRole = (user.role || "").toLowerCase();

    if (!normalizedRoles.includes(normalizedUserRole)) {
      return <Unauthorized />;
    }
  }

  // 4. Subscription-based access
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. Business-onboarding flow
  const normalizedUserRole = (user.role || "").toLowerCase();
  if (
    roles.map(r => r.toLowerCase()).includes("business") &&
    normalizedUserRole === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. Authorized → render protected content
  return children;
}
