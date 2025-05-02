import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  // 2. אין משתמש – הפנייה לדף הבית
  if (!user) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ ProtectedRoute: אין user בכלל – נשלח ל־/");
    }
    return <Navigate to="/" replace />;
  }

  // 3. אין תפקיד כלל
  if (!user.role) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ ProtectedRoute: יש user אבל אין role – נשלח ל־/");
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

    const target = redirectMap[user.role] || "/";
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `⛔ ProtectedRoute: תפקיד "${user.role}" לא מורשה כאן – מפנה אל ${target}`
      );
    }
    return <Navigate to={target} replace />;
  }

  // 5. בדיקת חבילה אם נדרשת
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `⛔ ProtectedRoute: נדרשת חבילה "${requiredPackage}", אך למשתמש יש "${user.subscriptionPlan}" – הפנייה ל־/plans`
      );
    }
    return <Navigate to="/plans" replace />;
  }

  // 6. אם בעל עסק ללא businessId
  if (
    roles.includes("business") &&
    user.role === "business" &&
    !user.businessId
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⛔ ProtectedRoute: משתמש עסקי ללא businessId – הפנייה ל־/create-business");
    }
    return <Navigate to="/create-business" replace />;
  }

  // 7. הכל תקין – מציג את התוכן
  return children;
};

export default ProtectedRoute;
