import React, { useMemo, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal";

export default function ProtectedRoute({
  children,
  roles = [],
  requiredPackage = null,
}) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  const [showTrialModal, setShowTrialModal] = useState(false);
  const [checkedTrial, setCheckedTrial] = useState(false);

  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isBusiness = role === "business";

  /* ===========================
     ⏳ טעינה ראשונית
  =========================== */
  if (loading || !initialized) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 Loading data...
      </div>
    );
  }

  /* ===========================
     🚫 לא מחובר
  =========================== */
  if (!initialized) {
  return null; // או loader
}

if (!user) {
  return <Navigate to="/login" replace state={{ from: location }} />;
}

  /* ===========================
     👑 Admin – BYPASS מוחלט
     ❗ שום בדיקה אחרת לא רצה
  =========================== */
  if (isAdmin) {
    return <>{children}</>;
  }

  /* ===========================
     💳 תוקף מנוי (רק לעסק)
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
      isBusiness &&
      user?.subscriptionPlan === "trial" &&
      user?.subscriptionEnd &&
      new Date(user.subscriptionEnd) < new Date()
    );
  }, [isBusiness, user?.subscriptionPlan, user?.subscriptionEnd]);

  /* ===========================
     🧠 בדיקת Trial רק בדשבורד
  =========================== */
  useEffect(() => {
    const isDashboardArea = /^\/business\/[^/]+\/dashboard/.test(
      location.pathname
    );

    if (isBusiness && isTrialExpired && isDashboardArea) {
      setShowTrialModal(true);
    } else {
      setShowTrialModal(false);
    }

    setCheckedTrial(true);
  }, [isBusiness, isTrialExpired, location.pathname]);

  if (!checkedTrial) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 Loading data...
      </div>
    );
  }

  /* ===========================
     🔐 בדיקת roles (לא אדמין)
  =========================== */
  const normalizedRoles = roles.map((r) => r.toLowerCase());

  if (normalizedRoles.length && !normalizedRoles.includes(role)) {
    return <Unauthorized />;
  }

  /* ===========================
     ⚠️ Trial הסתיים – מודאל בלבד
  =========================== */
  if (showTrialModal) {
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
