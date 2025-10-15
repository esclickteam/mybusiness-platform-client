import React, { useMemo, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal";

export default function ProtectedRoute({ children, roles = [], requiredPackage = null }) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [checkedTrial, setCheckedTrial] = useState(false);

  /* ===========================
     🟣 סוג משתמש
  =========================== */
  const isBusiness = (user?.role || "").toLowerCase() === "business";
  const isAffiliate = (user?.role || "").toLowerCase() === "affiliate";

  /* ===========================
     💳 תוקף מנוי
     נחשב תקף אם התאריך ב־subscriptionEnd עדיין לא עבר
  =========================== */
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true;
    if (user?.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date();
    }
    return false;
  }, [isBusiness, user?.subscriptionEnd]);

  /* ===========================
     🕓 ניסיון חינם (trial) לפי subscriptionPlan
     אם התוכנית היא trial והתוקף עבר — הניסיון הסתיים
  =========================== */
  const isTrialActive = useMemo(() => {
    if (user?.subscriptionPlan !== "trial") return false;
    if (!user?.subscriptionEnd) return false;
    return new Date(user.subscriptionEnd) > new Date();
  }, [user?.subscriptionPlan, user?.subscriptionEnd]);

  /* ===========================
     🧠 בדיקה לאחר טעינה
  =========================== */
  useEffect(() => {
    if (!initialized || !user) return;

    const timeout = setTimeout(() => {
      const path = location.pathname;
      const isDashboardArea = /^\/business\/[A-Za-z0-9]+\/dashboard/.test(path);

      // ✅ מציגים מודאל רק אם מדובר בעסק, ניסיון נגמר, והנתיב הוא דשבורד
      if (isBusiness && user?.subscriptionPlan === "trial" && !isTrialActive && isDashboardArea) {
        console.log("🎯 ניסיון נגמר – מציג מודאל לפני טעינת הדשבורד");
        setShowTrialModal(true);
      } else {
        setShowTrialModal(false);
      }

      setCheckedTrial(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [initialized, user, isBusiness, isTrialActive, location.pathname]);

  /* ===========================
     ⏳ טעינה
  =========================== */
  if (loading || !initialized || !checkedTrial) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 Loading data...
      </div>
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
     ⚠️ ניסיון חינם הסתיים – הצגת מודאל לפני הדשבורד
  =========================== */
  if (showTrialModal) {
    console.log("💜 TrialExpiredModal מוצג לפני טעינת הדשבורד!");
    return <TrialExpiredModal />;
  }

  /* ===========================
     💳 מנוי בתשלום שפג תוקף
     (כלומר זה לא ניסיון אלא תוכנית אמיתית)
  =========================== */
  if (
    isBusiness &&
    !isSubscriptionValid &&
    user?.subscriptionPlan !== "trial" &&
    !showTrialModal
  ) {
    console.log("🚀 מנוי בתשלום לא פעיל – הפניה לעמוד pricing");
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
