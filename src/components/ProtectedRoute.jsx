// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {ReactNode} children - התוכן להציג אם האבטחה עברה
 * @param {string|null} role - תפקיד נדרש ("admin", "manager", "worker", "business", "customer")
 * @param {string|null} requiredPackage - שם החבילה הנדרשת ("free", "standard", "premium" וכדומה)
 */
const ProtectedRoute = ({ children, role = null, requiredPackage = null }) => {
  const { user, loading } = useAuth();
  const devMode = import.meta.env.DEV;

  // במצב פיתוח תמיד מאשר גישה
  if (devMode) return children;

  // בזמן טעינה – תצוגת "טוען"
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

  // אין משתמש מחובר – הפניה לעמוד login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // אם נדרש תפקיד ואין התאמה – הפניה לעמוד הבית
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // אם נדרשת חבילה מסוימת ואין התאמה – הפניה לעמוד חבילות
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/plans" replace />;
  }

  // אם נדרשת גישה לבעל עסק אך עדיין אין לו עמוד עסקי – הפניה ליצירת עמוד עסק
  if (role === "business" && user.role === "business" && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  // הכל תקין – מציג את התוכן המוגן
  return children;
};

export default ProtectedRoute;
