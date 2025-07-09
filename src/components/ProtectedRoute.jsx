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

  console.log("ProtectedRoute: user =", user);
  console.log("ProtectedRoute: loading =", loading, "initialized =", initialized);
  console.log("ProtectedRoute: required roles =", roles);

  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = roles
      .map((r) => r.toLowerCase())
      .some((r) => staffRoles.includes(r));

    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    console.log("ProtectedRoute: no user, redirect to", loginPath);
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // נרמול hasPaid
  const normalizedHasPaid =
    user.hasPaid === true || user.hasPaid === "true" || user.hasPaid === 1;

  if (roles.length > 0) {
    const normalizedRoles = roles.map((r) => r.toLowerCase());
    const userRole = (user.role || "").toLowerCase();
    if (!normalizedRoles.includes(userRole)) {
      console.log(
        `ProtectedRoute: user role (${userRole}) not in required roles (${normalizedRoles}), showing Unauthorized`
      );
      return <Unauthorized />;
    }
  }

  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business"
  ) {
    const now = new Date();
    const subscriptionEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : null;

    console.log("Now:", now);
    console.log("SubscriptionEnd:", subscriptionEnd);
    console.log("HasPaid (normalized):", normalizedHasPaid);
    console.log("PaymentStatus:", user.paymentStatus);

    const isSubscriptionValid =
      subscriptionEnd &&
      now <= subscriptionEnd &&
      normalizedHasPaid &&
      user.paymentStatus === "approved";

    console.log("Is subscription valid?", isSubscriptionValid);

    if (!isSubscriptionValid) {
      console.log("ProtectedRoute: subscription expired or not valid, redirect to /plans");
      return <Navigate to="/plans" replace />;
    }
  }

  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    console.log(
      `ProtectedRoute: user subscription (${user.subscriptionPlan}) does not match required package (${requiredPackage}), redirect to /plans`
    );
    return <Navigate to="/plans" replace />;
  }

  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business" &&
    !user.businessId
  ) {
    console.log("ProtectedRoute: business user has no businessId, redirect to /create-business");
    return <Navigate to="/create-business" replace />;
  }

  console.log("ProtectedRoute: access granted");
  return <>{children}</>;
}
