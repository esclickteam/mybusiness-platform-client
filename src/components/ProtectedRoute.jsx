// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. מחכים לטעינה של ה-auth
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 טוען נתונים...
      </div>
    );
  }

  // 2. אם לא מחובר בכלל → לפניך לדף התחברות המתאים
  if (!user) {
    const loginPath = roles.includes("worker") ? "/staff-login" : "/login";
    console.log("ProtectedRoute: no user, redirecting to", loginPath);
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 3. אם הוגדרו roles אך התפקיד של המשתמש לא נמצא ביניהם → הצג Unauthorized
  if (roles.length > 0 && !roles.includes(user.role)) {
    console.log("ProtectedRoute: user role", user.role, "not in", roles);
    return <Unauthorized />;
  }

  // 4. בדיקת requiredPackage (אם רלוונטי)
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    console.log("ProtectedRoute: missing package", requiredPackage);
    return <Navigate to="/plans" replace />;
  }

  // 5. בדיקת businessId עבור בעלי תפקיד business
  if (roles.includes("business") && user.role === "business" && !user.businessId) {
    console.log("ProtectedRoute: business without ID");
    return <Navigate to="/create-business" replace />;
  }

  // 6. מורשה → מציגים את התוכן
  console.log("ProtectedRoute: access granted to", user.role);
  return children;
}
