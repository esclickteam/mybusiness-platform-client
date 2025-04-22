import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role = null, plan = null }) => {
  const { user, loading } = useAuth();
  const devMode = import.meta.env.DEV;

  // מצב פיתוח תמיד מאשר גישה
  if (devMode) return children;

  // בזמן טעינה – טוען
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // אין משתמש מחובר – הפניה לכניסה
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // אם נדרש תפקיד ואין התאמה – הפניה
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // אם נדרשת חבילה ואין התאמה – הפניה
  if (plan && user.subscriptionPlan !== plan) {
    return <Navigate to="/plans" replace />;
  }

  // הכל תקין – מציג את הרכיב
  return children;
};

export default ProtectedRoute;
