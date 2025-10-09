import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

/**
 * A generic guard for protected routes.
 *
 * @param {React.ReactNode} children   JSX children to render when access is granted.
 * @param {string[]}        roles      Allowed roles (case-insensitive). Empty → any logged-in user.
 * @param {string|null}     requiredPackage  Restrict access to a specific subscription plan (e.g., "daily").
 */
export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  console.log("🔍 ProtectedRoute user object:", user);

  const isBusiness = useMemo(
    () => (user?.role || "").toLowerCase() === "business",
    [user?.role]
  );

  const isAffiliate = useMemo(
    () => (user?.role || "").toLowerCase() === "affiliate",
    [user?.role]
  );

  // Calculate business subscription validity — supports trial logic as well
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true; // Only businesses require a subscription
    if (typeof user?.isSubscriptionValid === "boolean") return user.isSubscriptionValid;

    // Client-side calculation by dates if not returned by the server
    if (user?.subscriptionStart && user?.subscriptionEnd) {
      const now = new Date();
      const end = new Date(user.subscriptionEnd);
      return end > now;
    }
    return false;
  }, [isBusiness, user?.isSubscriptionValid, user?.subscriptionStart, user?.subscriptionEnd]);

  console.log("📊 isBusiness:", isBusiness);
  console.log("📊 isSubscriptionValid (computed):", isSubscriptionValid);

  const normalizedRoles = useMemo(
    () => roles.map((r) => r.toLowerCase()),
    [roles]
  );

  // Loading
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }} role="status" aria-live="polite">
        🔄 Loading data...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = normalizedRoles.some((r) => staffRoles.includes(r));
    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Role authorization
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  // Business subscription check — redirect to packages if not valid and not in active trial
  const isTrialActive =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date();

  if (isBusiness && !isSubscriptionValid && !isTrialActive) {
    const reason =
      user?.subscriptionPlan === "trial" ? "trial_expired" : "plan_expired";
    return <Navigate to={`/packages?reason=${reason}`} replace />;
  }

  // Specific package requirement
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/packages" replace />;
  }

  // Business without businessId
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  return <>{children}</>;
}
