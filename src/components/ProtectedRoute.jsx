// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

export default function ProtectedRoute({
  children,
  roles = [],
  requiredPackage = null,
}) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // 1. Loading state
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. Redirect if not authenticated
  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = roles
      .map((r) => r.toLowerCase())
      .some((r) => staffRoles.includes(r));

    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. Role-based authorization
  if (roles.length > 0) {
    const normalizedRoles = roles.map((r) => r.toLowerCase());
    const userRole = (user.role || "").toLowerCase();
    if (!normalizedRoles.includes(userRole)) {
      return <Unauthorized />;
    }
  }

  // 4. Subscription-based access
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. Business onboarding
  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    user.role.toLowerCase() === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. Authorized: render children
  return <React.Fragment>{children}</React.Fragment>;
}
