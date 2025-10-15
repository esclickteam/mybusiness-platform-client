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

  const isBusiness = (user?.role || "").toLowerCase() === "business";
  const isAffiliate = (user?.role || "").toLowerCase() === "affiliate";

  const isSubscriptionValid = useMemo(() => {
    if (!isBusiness) return true;
    if (typeof user?.isSubscriptionValid === "boolean") return user.isSubscriptionValid;
    if (user?.subscriptionStart && user?.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date();
    }
    return false;
  }, [isBusiness, user?.isSubscriptionValid, user?.subscriptionStart, user?.subscriptionEnd]);

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
      if (isBusiness && !isTrialActive && location.pathname.includes("business")) {
        console.log("🎯 ניסיון חינם נגמר – מציג מודאל");
        setShowTrialModal(true);
      }
      setCheckedTrial(true);
    }, 150); // עיכוב קל למניעת התנגשויות עם redirect
    return () => clearTimeout(timeout);
  }, [isBusiness, isTrialActive, location.pathname]);

  if (loading || !initialized || !checkedTrial) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>🔄 Loading data...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const normalizedRoles = roles.map((r) => r.toLowerCase());
  if (
    normalizedRoles.length &&
    !normalizedRoles.includes((user.role || "").toLowerCase()) &&
    !(isAffiliate && normalizedRoles.includes("affiliate"))
  ) {
    return <Unauthorized />;
  }

  /* ✅ סיום ניסיון – הצגת מודאל */
  if (showTrialModal) {
    console.log("💜 TrialExpiredModal מוצג!");
    return <TrialExpiredModal />;
  }

  /* ✅ מנוי שפג (לא ניסיון) */
  if (
    isBusiness &&
    !isSubscriptionValid &&
    !isTrialActive &&
    !showTrialModal &&
    !location.pathname.includes("business")
  ) {
    console.log("🚀 מנוי לא פעיל – הפניה לעמוד pricing");
    return <Navigate to="/pricing" replace />;
  }

  if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
    return <Navigate to="/pricing" replace />;
  }

  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  return <>{children}</>;
}
