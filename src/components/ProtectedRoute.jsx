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

  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isBusiness = role === "business";

  /* ===========================
     ⏳ Wait for auth to fully settle
     (CRITICAL – no redirects before this)
  =========================== */
  if (!initialized || loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        🔄 Loading data...
      </div>
    );
  }

  /* ===========================
     🚫 Not authenticated
  =========================== */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* ===========================
     👑 Admin – full bypass
  =========================== */
  if (isAdmin) {
    return <>{children}</>;
  }

  /* ===========================
     🔐 Role validation
  =========================== */
  const normalizedRoles = roles.map((r) => r.toLowerCase());
  if (normalizedRoles.length && !normalizedRoles.includes(role)) {
    return <Unauthorized />;
  }

  /* ===========================
     🏗️ Business without businessId
  =========================== */
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }


  /* ===========================
     🕓 Trial expired
  =========================== */
  const isTrialExpired = useMemo(() => {
  return (
    isBusiness &&
    user?.subscriptionPlan === "trial" &&
    user?.trialEndsAt &&
    new Date(user.trialEndsAt) < new Date()
  );
}, [isBusiness, user?.subscriptionPlan, user?.trialEndsAt]);

  /* ===========================
     🧠 Show trial modal ONLY inside dashboard
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
  }, [isBusiness, isTrialExpired, location.pathname]);

  /* ===========================
     ⚠️ Trial expired – modal only (no redirect)
  =========================== */
  if (showTrialModal) {
  return <TrialExpiredModal />;
}

  /* ===========================
     ✅ Access granted
  =========================== */
  return <>{children}</>;
}
