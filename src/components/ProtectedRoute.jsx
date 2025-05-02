import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {ReactNode} children - התוכן להציג אם האבטחה עברה
 * @param {string[]} roles - מערך תפקידים מותרים ("admin", "manager", "worker", "business", "customer")
 * @param {string|null} requiredPackage - שם החבילה הנדרשת ("free", "standard", "premium" וכו')
 */
const ProtectedRoute = ({ children, roles = [], requiredPackage = null }) => {
  const { user, loading } = useAuth();

  // 1. בזמן טעינה – תצוגת "טוען"
  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. אין משתמש מחובר – הפנייה ל־Homepage
  if (!user) {
    console.log("No user found. Redirecting to home.");
    return <Navigate to="/" replace />;
  }

  // 3. בדיקת תפקידים
  if (roles.length > 0 && !roles.includes(user.role)) {
    const redirectMap = {
      customer: `/client/dashboard`,
      business: `/business/${user.businessId}/dashboard`,
      worker:   `/staff/dashboard`,
      manager:  `/manager/dashboard`,
      admin:    `/admin/dashboard`,
    };
    const target = redirectMap[user.role] || "/";
    console.log(`User with role "${user.role}" is not allowed here, redirecting to ${target}`);
    return <Navigate to={target} replace />;
  }

  // 4. בדיקת חבילה
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    console.log(`User subscriptionPlan="${user.subscriptionPlan}" needs "${requiredPackage}", redirecting to /plans`);
    return <Navigate to="/plans" replace />;
  }

  // 5. אם בעל עסק ללא עמוד עסקי – להפנות ליצירת עמוד
  if (
    roles.includes("business") &&
    user.role === "business" &&
    !user.businessId
  ) {
    console.log("Business user missing businessId, redirecting to /create-business");
    return <Navigate to="/create-business" replace />;
  }

  // 6. הכל תקין – מציג את התוכן המוגן
  return children;
};

export default ProtectedRoute;
