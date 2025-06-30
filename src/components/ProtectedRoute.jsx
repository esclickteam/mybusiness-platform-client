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

  // 1. Loading - מחכים לטעינת המשתמש
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. אם לא מחובר, הפנה לדף ההתחברות המתאים (עובדים/לקוחות)
  if (!user) {
    const staffRoles = ["worker", "manager", "מנהל", "admin"];
    const needsStaffLogin = roles
      .map((r) => r.toLowerCase())
      .some((r) => staffRoles.includes(r));

    const loginPath = needsStaffLogin ? "/staff-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. בדיקת הרשאות תפקיד - האם יש למשתמש את התפקיד הנדרש?
  if (roles.length > 0) {
    const normalizedRoles = roles.map((r) => r.toLowerCase());
    const userRole = (user.role || "").toLowerCase();
    if (!normalizedRoles.includes(userRole)) {
      // אם אין הרשאה, הצג דף ללא הרשאה
      return <Unauthorized />;
    }
  }

  // 3.5. בדיקה שעסק ששילם בלבד יוכל לגשת לדפים מוגנים
  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business"
  ) {
    const hasPaid = user.hasPaid === true || user.hasPaid === "true";
    if (!hasPaid) {
      return <Navigate to="/plans" replace />;
    }
  }

  // 4. בדיקת חבילת מנוי נדרשת (אם צוין)
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // 5. במידה והמשתמש הוא בעל עסק ללא פרופיל עסק קיים, הפנה ליצירת עסק
  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business" &&
    !user.businessId
  ) {
    return <Navigate to="/create-business" replace />;
  }

  // 6. הכול תקין - הצג את הילדים (הרכיבים המוגנים)
  return <>{children}</>;
}
