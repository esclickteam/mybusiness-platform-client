import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

/**
 * A generic guard for protected routes.
 *
 * @param {React.ReactNode} children   JSX children to render when access is granted.
 * @param {string[]}        roles      Allowed roles (case-insensitive). Empty → any logged-in user.
 * @param {string|null}     requiredPackage  Limit access to a specific subscription plan (e.g. "daily").
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

  // חישוב תקפות מנוי עסק — כולל תמיכה בלוגיקת ניסיון
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true; // רק עסקים דורשים מנוי
    if (typeof user?.isSubscriptionValid === "boolean") return user.isSubscriptionValid;

    // חישוב בצד לקוח לפי תאריכים אם השרת לא מחזיר
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

  // טעינה
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }} role="status" aria-live="polite">
        🔄 טוען נתונים...
      </div>
    );
  }

  // לא מחובר
  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = normalizedRoles.some((r) => staffRoles.includes(r));
    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // הרשאות תפקיד
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  // בדיקת מנוי עסק — הפניה לחבילות רק אם לא בתוקף וגם לא ניסיון פעיל
  const isTrialActive =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date();

  if (isBusiness && !isSubscriptionValid && !isTrialActive) {
    const reason =
      user?.subscriptionPlan === "trial" ? "trial_expired" : "plan_expired";
    return <Navigate to={`/packages?reason=${reason}`} replace />;
  }

  // דרישת חבילה ספציפית
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/packages" replace />;
  }

  // עסק ללא businessId
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  return <>{children}</>;
}
