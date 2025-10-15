import React, { useMemo, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal"; // נוסיף רכיב חדש

export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  const [showTrialModal, setShowTrialModal] = useState(false);

  const isBusiness = useMemo(
    () => (user?.role || "").toLowerCase() === "business",
    [user?.role]
  );

  const isAffiliate = useMemo(
    () => (user?.role || "").toLowerCase() === "affiliate",
    [user?.role]
  );

  // ✅ בדיקת תוקף מנוי
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true;
    if (typeof user?.isSubscriptionValid === "boolean") return user.isSubscriptionValid;
    if (user?.subscriptionStart && user?.subscriptionEnd) {
      const now = new Date();
      return new Date(user.subscriptionEnd) > now;
    }
    return false;
  }, [isBusiness, user?.isSubscriptionValid, user?.subscriptionStart, user?.subscriptionEnd]);

  // ✅ בדיקת ניסיון פעיל (14 ימים)
  const isTrialActive = useMemo(() => {
    if (!user?.createdAt) return false;
    const trialDays = 14;
    const created = new Date(user.createdAt);
    const expires = new Date(created);
    expires.setDate(created.getDate() + trialDays);
    return new Date() < expires;
  }, [user?.createdAt]);

  useEffect(() => {
    // אם עברו 14 יום והמשתמש בעסק
    if (isBusiness && !isTrialActive && location.pathname.startsWith("/business")) {
      setShowTrialModal(true);
    }
  }, [isBusiness, isTrialActive, location.pathname]);

  // מצב טעינה
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>🔄 Loading data...</div>
    );
  }

  // לא מחובר
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // בדיקת הרשאות
  const normalizedRoles = roles.map((r) => r.toLowerCase());
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  // ✅ אם הניסיון נגמר – הצג מודאל וחסום גישה לדשבורד
  if (showTrialModal) {
    return <TrialExpiredModal />;
  }

  // ✅ אם אין מנוי פעיל אחרי ניסיון
  if (isBusiness && !isSubscriptionValid && !isTrialActive) {
    return <Navigate to="/pricing" replace />;
  }

  // דרישת חבילה ספציפית
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/pricing" replace />;
  }

  // עסק ללא businessId
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  return <>{children}</>;
}
