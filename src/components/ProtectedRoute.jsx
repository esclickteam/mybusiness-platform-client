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
  const isAdmin = (user?.role || "").toLowerCase() === "admin";


  /* ===========================
     🟣 סוג משתמש
  =========================== */
  const isBusiness = (user?.role || "").toLowerCase() === "business";
  const isAffiliate = (user?.role || "").toLowerCase() === "affiliate";

  /* ===========================
     💳 תוקף מנוי
  =========================== */
  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true;
    if (user?.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date();
    }
    return false;
  }, [isBusiness, user?.subscriptionEnd]);

  /* ===========================
     🕓 ניסיון חינם שפג
  =========================== */
  const isTrialExpired = useMemo(() => {
    return (
      user?.subscriptionPlan === "trial" &&
      user?.subscriptionEnd &&
      new Date(user.subscriptionEnd) < new Date()
    );
  }, [user?.subscriptionPlan, user?.subscriptionEnd]);

  /* ===========================
     🧠 בדיקה לאחר טעינה
  =========================== */
  useEffect(() => {
    if (!initialized || !user) return;

    const path = location.pathname;
    const isDashboardArea = /^\/business\/[A-Za-z0-9]+\/dashboard/.test(path);

    // ✅ מציגים מודאל רק אם זה עסק, הניסיון נגמר, והוא בתוך הדשבורד
    if (isBusiness && isTrialExpired && isDashboardArea) {
      console.log("🎯 ניסיון נגמר – מציג מודאל בלבד (ללא הפניה)");
      setShowTrialModal(true);
    } else {
      setShowTrialModal(false);
    }

    setCheckedTrial(true);
  }, [initialized, user, isBusiness, isTrialExpired, location.pathname]);

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
   👑 Admin – bypass מלא
=========================== */
if (isAdmin) {
  return <>{children}</>;
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
     ⚠️ ניסיון חינם הסתיים – הצגת מודאל בלבד
  =========================== */
  if (showTrialModal) {
    console.log("💜 TrialExpiredModal מוצג לפני טעינת הדשבורד!");
    return (
      <div style={{ position: "relative", zIndex: 9999 }}>
        <TrialExpiredModal />
      </div>
    );
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
