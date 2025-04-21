// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredPackage = "any" }) => {
  const { user, loading } = useAuth();
  const devMode = import.meta.env.DEV; // משתמשים ב־Vite ENV במקום hardcoded

  console.log("🔐 ProtectedRoute → user:", user, "loading:", loading, "devMode:", devMode);

  // בפיתוח מאשרים תמיד
  if (devMode) {
    return children;
  }

  // עדיין טוען — אפשר להחליף בספינר
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: "center", padding: "2rem" }}>
        ⏳ טוען נתונים...
      </div>
    );
  }

  // אין משתמש — מפנים ל־Login
  if (!user || !user.email) {
    console.warn("⚠️ אין משתמש מחובר – מפנה לדף התחברות");
    return <Navigate to="/login" replace />;
  }

  // בדיקת חבילת מנוי אם נדרש
  if (
    requiredPackage !== "any" &&
    (!user.subscriptionPlan || user.subscriptionPlan !== requiredPackage)
  ) {
    console.warn(`🚫 אין למשתמש גישה לחבילת ${requiredPackage}`);
    return <Navigate to="/plans" replace />;
  }

  // אם כל הבדיקות עברו — מציגים את ה־children
  return children;
};

export default ProtectedRoute;
