// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredPackage = "any" }) => {
  const { user, loading } = useAuth();
  const devMode = import.meta.env.DEV;

  console.log("🔐 ProtectedRoute → user:", user, "loading:", loading, "devMode:", devMode);

  // ✅ מצב פיתוח תמיד מאשר גישה
  if (devMode) return children;

  // ⏳ בזמן טעינה – מציג מסך טוען (אפשר לשים Spinner אמיתי)
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: "center", padding: "2rem" }}>
        ⏳ טוען נתונים...
      </div>
    );
  }

  // ❌ אין משתמש מחובר – מפנה ל־Login
  if (!user || !user.email) {
    console.warn("⚠️ אין משתמש מחובר – מפנה לדף התחברות");
    return <Navigate to="/login" replace />;
  }

  // 🚫 אין גישה לפי סוג מנוי
  if (
    requiredPackage !== "any" &&
    (!user.subscriptionPlan || user.subscriptionPlan !== requiredPackage)
  ) {
    console.warn(`🚫 אין למשתמש גישה לחבילת ${requiredPackage}`);
    return <Navigate to="/plans" replace />;
  }

  // ✅ הכל תקין – מציג את הרכיב
  return children;
};

export default ProtectedRoute;
