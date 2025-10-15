import React, { useMemo, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal"; // ✅ מודאל סיום ניסיון

/**
 * 💜 ProtectedRoute – Access guard for BizUply routes
 * Includes 14-day trial logic for business users only.
 */
export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [checkedTrial, setCheckedTrial] = useState(false); // ✅ נוודא שהבדיקה הסתיימה לפני redirect

  /* ===========================
     🟣 זיהוי סוג המשתמש
  =========================== */
  const isBusiness = (user?.role || "").toLowerCase() === "business";
  const isAffiliate = (user?.role || "").toLowerCase() === "affiliate";

  /* ===========================
     💼 בדיקת תוקף מנוי קיים
  =========================== */
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true;
    if (typeof user?.isSubscriptionValid === "boolean") return user.isSubscriptionValid;
    if (user?.subscriptionStart && user?.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date();
    }
    return false;
  }, [isBusiness, user?.isSubscriptionValid, user?.subscriptionStart, user?.subscriptionEnd]);

  /* ===========================
     🕓 בדיקת ניסיון חינם (14 ימים)
  =========================== */
  const isTrialActive = useMemo(() => {
    if (!user?.createdAt) return false;
    const trialDays = 14;
    const created = new Date(user.createdAt);
    const expires = new Date(created);
    expires.setDate(created.getDate() + trialDays);
    return new Date() < expires;
  }, [user?.createdAt]);

  /* ===========================
     🧠 בדיקה לאחר טעינה
  =========================== */
  useEffect(() => {
    if (isBusiness && !isTrialActive && location.pathname.startsWith("/business")) {
      console.log("🎯 ניסיון חינם נגמר – מציג מודאל");
      setShowTrialModal(true);
    }
    setCheckedTrial(true); // ✅ רק אחרי שהבדיקה רצה נסמן שהכול מוכן
  }, [isBusiness, isTrialActive, location.pathname]);

  /* ===========================
     ⏳ מצב טעינה
  =========================== */
  if (loading || !initialized || !checkedTrial) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>🔄 Loading data...</div>
    );
  }

  /* ===========================
     🚫 לא מחובר
  =========================== */
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* ===========================
     🔐 הרשאות לפי תפקיד
  =========================== */
  const normalizedRoles = roles.map((r) => r.toLowerCase());
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  /* ===========================
     ⚠️ סיום ניסיון – הצגת מודאל
     (💜 מקבל עדיפות לפני כל הפניה אחרת)
  =========================== */
  if (showTrialModal) {
    console.log("💜 TrialExpiredModal מוצג!");
    return <TrialExpiredModal />;
  }

  /* ===========================
     💳 מנוי שפג (לא ניסיון חינם)
  =========================== */
  if (
    isBusiness &&
    !isSubscriptionValid &&
    !isTrialActive &&
    !showTrialModal &&
    !location.pathname.startsWith("/business")
  ) {
    console.log("🚀 מנוי לא פעיל – הפניה לעמוד pricing");
    return <Navigate to="/pricing" replace />;
  }

  /* ===========================
     📦 דרישת חבילה ספציפית
  =========================== */
  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/pricing" replace />;
  }

  /* ===========================
     🏗️ עסק ללא businessId
  =========================== */
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  /* ===========================
     ✅ גישה מאושרת
  =========================== */
  return <>{children}</>;
}
