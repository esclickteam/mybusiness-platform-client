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

  // Debug log — חשוב לראות מה מגיע מה־AuthContext
  console.log("🔍 ProtectedRoute user object:", user);

  // בדיקה אם המשתמש הוא עסק
  const isBusiness = useMemo(
    () => (user?.role || "").toLowerCase() === "business",
    [user?.role]
  );

  // בדיקה אם המשתמש הוא שותף
  const isAffiliate = useMemo(
    () => (user?.role || "").toLowerCase() === "affiliate",
    [user?.role]
  );

  // הסתמכות על הערך שמגיע מהשרת
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true; // רק עסקים צריכים מנוי פעיל
    return !!user?.isSubscriptionValid; // מגיע ישירות מהשרת
  }, [isBusiness, user?.isSubscriptionValid]);

  // Debug log — לראות מה יוצא אחרי החישוב
  console.log("📊 isBusiness:", isBusiness);
  console.log("📊 isSubscriptionValid (from server or computed):", isSubscriptionValid);

  const normalizedRoles = useMemo(
    () => roles.map((r) => r.toLowerCase()),
    [roles]
  );

  // ──────────────────────────────────────────────────────────────────────────────
  // טעינה
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }} role="status" aria-live="polite">
        🔄 טוען נתונים...
      </div>
    );
  }

  // לא מחובר → מעבר לעמוד התחברות מתאים
  if (!user) {
    console.warn("⚠️ ProtectedRoute: no user found, redirecting to login");
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
    console.warn("⛔ ProtectedRoute: role not authorized");
    return <Unauthorized />;
  }

  // בדיקת מנוי עסק
  if (isBusiness && !isSubscriptionValid) {
    console.warn("⛔ ProtectedRoute: subscription invalid for business");
    return <Unauthorized message="המנוי שלך אינו פעיל כרגע." />;
  }

  // דרישת חבילה ספציפית
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    console.warn("⛔ ProtectedRoute: requiredPackage mismatch");
    return <Navigate to="/plans" replace />;
  }

  // עסק ללא businessId → יצירת עסק חדש
  if (isBusiness && !user.businessId) {
    console.warn("⛔ ProtectedRoute: no businessId for business user");
    return <Navigate to="/create-business" replace />;
  }

  // הכל תקין → הצגת התוכן המוגן
  return <>{children}</>;
}
