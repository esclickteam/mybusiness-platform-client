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

  // 2. אין משתמש מחובר – הפנייה לדף הבית
  if (!user) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ אין משתמש – הפנייה לדף הבית");
    }
    return <Navigate to="/" replace />;
  }

  // 3. אין תפקיד כלל – גם אם roles ריק
  if (!user.role) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ למשתמש אין תפקיד מוגדר – הפנייה לדף הבית");
    }
    return <Navigate to="/" replace />;
  }

  // 4. בדיקת תפקידים אם נדרש
  if (roles.length > 0 && !roles.includes(user.role)) {
    const redirectMap = {
      customer: `/client/dashboard`,
      business: `/business/${user.businessId}/dashboard`,
      worker:   `/staff/dashboard`,
      manager:  `/manager/dashboard`,
      admin:    `/admin/dashboard`,
    };

    const target = redirectMap[user.role];
    if (!target) {
      if (process.env.NODE_ENV !== "production") {
        console.error(`⛔ תפקיד לא חוקי: "${user.role}" – הפנייה לדף הבית`);
      }
      return <Navigate to="/" replace />;
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `⛔ משתמש עם תפקיד "${user.role}" לא מורשה כאן – מפנה אל ${target}`
      );
    }
    return <Navigate to={target} replace />;
  }

  // 5. בדיקת חבילת שימוש אם נדרשת
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `⛔ למשתמש יש חבילה "${user.subscriptionPlan}" במקום "${requiredPackage}" – הפנייה למסך חבילות`
      );
    }
    return <Navigate to="/plans" replace />;
  }

  // 6. אם בעל עסק אך אין businessId – להפנות ליצירת עסק
  if (
    roles.includes("business") &&
    user.role === "business" &&
    !user.businessId
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ משתמש עסקי ללא businessId – הפנייה ליצירת עסק");
    }
    return <Navigate to="/create-business" replace />;
  }

  // 7. הכל תקין – מציג את התוכן המוגן
  return children;
};

export default ProtectedRoute;
