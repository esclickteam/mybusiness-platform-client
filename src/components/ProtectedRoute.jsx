import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

/**
 * A generic guard for protected routes.
 *
 * @param {React.ReactNode} children   JSX children to render when access is granted.
 * @param {string[]}        roles      Allowed roles (case‑insensitive). Empty → any logged‑in user.
 * @param {string|null}     requiredPackage  Limit access to a specific subscription plan (e.g. "daily").
 */
export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // ──────────────────────────────────────────────────────────────────────────────
  // Normalisation helpers – keep tiny pure functions to stay readable
  // ──────────────────────────────────────────────────────────────────────────────
  const isPaid = useMemo(() => {
    const paidValues = [true, "true", 1];
    const approved = user?.paymentStatus === "approved";
    return paidValues.includes(user?.hasPaid) && approved;
  }, [user?.hasPaid, user?.paymentStatus]);

  const isBusiness = useMemo(() => (user?.role || "").toLowerCase() === "business", [user?.role]);
  const isAffiliate = useMemo(() => (user?.role || "").toLowerCase() === "affiliate", [user?.role]);

  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true; // only business users require an active subscription

    const end = user?.subscriptionEnd ? new Date(user.subscriptionEnd) : null;
    const now = new Date();

    console.log("🔍 ProtectedRoute logs:");
    console.log("user.subscriptionEnd:", user?.subscriptionEnd);
    console.log("now:", now.toISOString());
    console.log("isPaid:", isPaid);
    console.log("subscription end date:", end ? end.toISOString() : null);
    console.log("subscription valid:", !!(isPaid && (!end || now <= end)));

    return !!(isPaid && (!end || now <= end));
  }, [isBusiness, user?.subscriptionEnd, isPaid]);

  const normalizedRoles = useMemo(() => roles.map((r) => r.toLowerCase()), [roles]);

  // ──────────────────────────────────────────────────────────────────────────────
  // Early returns – keep render tree flat & predictable
  // ──────────────────────────────────────────────────────────────────────────────
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }} role="status" aria-live="polite">
        🔄 טוען נתונים...
      </div>
    );
  }

  // 1. Not authenticated → redirect to proper login (staff / regular)
  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = normalizedRoles.some((r) => staffRoles.includes(r));
    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 2. Role mismatch → show Unauthorized component (403)
  // Allow affiliate role if roles includes it or no roles specified
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  // 3. Business subscription checks with enhanced logic
  if (isBusiness && !isSubscriptionValid) {
    const now = new Date();
    const subscriptionEndDate = user?.subscriptionEnd ? new Date(user.subscriptionEnd) : null;

    console.log("Redirect check:");
    console.log("now > subscriptionEndDate?", subscriptionEndDate ? now > subscriptionEndDate : false);

    if (subscriptionEndDate && now > subscriptionEndDate) {
      return <Navigate to="/plans" replace />;
    } else {
      return <Unauthorized message="המנוי שלך אינו פעיל כרגע." />;
    }
  }

  // 4. Package‑specific guard
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. Business without businessId must create their entity
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. All good → render protected children
  return <>{children}</>;
}
