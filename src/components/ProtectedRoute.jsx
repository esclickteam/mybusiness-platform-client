import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredPackage = "any" }) => {
  const { user, loading } = useAuth();

  console.log("🔐 ProtectedRoute → user:", user, "loading:", loading);

  // ✅ ביטול בדיקות זמנית – מצב פיתוח
  const devMode = true;

  if (devMode) {
    return children;
  }

  // עדיין טוען נתונים
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: "center", padding: "3rem" }}>
        ⏳ טוען נתונים...
      </div>
    );
  }

  // אין משתמש מחובר
  if (!user || !user.email) {
    console.warn("⚠️ אין משתמש מחובר – מפנה לדף התחברות");
    return <Navigate to="/login" replace />;
  }

  // בדיקת גישת חבילה
  if (
    requiredPackage !== "any" &&
    (!user.subscriptionPlan || user.subscriptionPlan !== requiredPackage)
  ) {
    console.warn("🚫 למשתמש אין גישה לחבילה:", requiredPackage);
    return <Navigate to="/plans" replace />;
  }

  return children;
};

export default ProtectedRoute;
