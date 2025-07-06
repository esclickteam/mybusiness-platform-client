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

  // לוגים לניטור
  console.log("ProtectedRoute: user =", user);
  console.log("ProtectedRoute: loading =", loading, "initialized =", initialized);
  console.log("ProtectedRoute: required roles =", roles);

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
    console.log("ProtectedRoute: no user, redirect to", loginPath);
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. בדיקת הרשאות תפקיד - האם יש למשתמש את התפקיד הנדרש?
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

  // 3.5. בדיקה שעסק ששילם בלבד יוכל לגשת לדפים מוגנים
  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business"
  ) {
    const hasPaid = user.hasPaid === true || user.hasPaid === "true";
    if (!hasPaid) {
      console.log("ProtectedRoute: business user has not paid, redirect to /plans");
      return <Navigate to="/plans" replace />;
    }
  }

  // 4. בדיקת חבילת מנוי נדרשת (אם צוין)
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    console.log(
      `ProtectedRoute: user subscription (${user.subscriptionPlan}) does not match required package (${requiredPackage}), redirect to /plans`
    );
    return <Navigate to="/plans" replace />;
  }

  // 5. במידה והמשתמש הוא בעל עסק ללא פרופיל עסק קיים, הפנה ליצירת עסק
  if (
    roles.map((r) => r.toLowerCase()).includes("business") &&
    (user.role || "").toLowerCase() === "business" &&
    !user.businessId
  ) {
    console.log("ProtectedRoute: business user has no businessId, redirect to /create-business");
    return <Navigate to="/create-business" replace />;
  }

  // 6. הכול תקין - הצג את הילדים (הרכיבים המוגנים)
  console.log("ProtectedRoute: access granted");
  return <>{children}</>;
}
