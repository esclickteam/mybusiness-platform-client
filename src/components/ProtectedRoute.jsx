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
     🟣 זיהוי סוג המשתמש
  =========================== */
  const isBusiness = (user?.role || "").toLowerCase() === "business";
  const isAffiliate = (user?.role || "").toLowerCase() === "affiliate";

  /* ===========================
     💳 תוקף מנוי
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
     🕓 בדיקת ניסיון חינם (14 יום)
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
    const timeout = setTimeout(() => {
      const path = location.pathname;

      // ✅ נציג מודאל רק אם:
      // 1️⃣ המשתמש עסק
      // 2️⃣ הניסיון נגמר
      // 3️⃣ הנתיב תואם בדיוק למבנה /business/:id/dashboard
      const isDashboardArea = /^\/business\/[A-Za-z0-9]+\/dashboard/.test(path);

      if (isBusiness && !isTrialActive && isDashboardArea) {
        console.log("🎯 ניסיון חינם נגמר – מציג מודאל רק בדשבורד");
        setShowTrialModal(true);
      }

      setCheckedTrial(true);
    }, 150); // עיכוב קל למניעת התנגשויות עם redirect

    return () => clearTimeout(timeout);
  }, [isBusiness, isTrialActive, location.pathname]);

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
     ⚠️ סיום ניסיון – הצגת מודאל
  =========================== */
  if (showTrialModal) {
    console.log("💜 TrialExpiredModal מוצג!");
    return <TrialExpiredModal />;
  }

  /* ===========================
     💳 מנוי שפג (לא ניסיון)
  =========================== */
  if (
    isBusiness &&
    !isSubscriptionValid &&
    !isTrialActive &&
    !showTrialModal &&
    !location.pathname.includes("/business/")
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
