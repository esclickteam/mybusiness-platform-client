import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal";
import BizuplyLoader from "./ui/BizuplyLoader";

type UserRole =
  | "admin"
  | "business"
  | "customer"
  | "worker"
  | "manager"
  | "affiliate"
  | string;

type AuthUser = {
  role?: UserRole;
  businessId?: string | null;
  hasPaid?: boolean;
  trialEndsAt?: string | Date | null;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
};

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: UserRole[];
  requiredPackage?: string | null;
};

export default function ProtectedRoute({
  children,
  roles = [],
  requiredPackage = null,
}: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth() as AuthContextValue;
  const location = useLocation();

  const [showTrialModal, setShowTrialModal] = useState<boolean>(false);

  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isBusiness = role === "business";

  const normalizedRoles = useMemo(
    () => roles.map((item) => item.toLowerCase()),
    [roles]
  );

  const hasActiveSubscription = Boolean(user?.hasPaid === true);

  const isTrialExpired = useMemo(() => {
    if (!isBusiness || hasActiveSubscription || !user?.trialEndsAt) {
      return false;
    }

    return new Date(user.trialEndsAt) < new Date();
  }, [isBusiness, hasActiveSubscription, user?.trialEndsAt]);

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

  if (!requiredPackage) {
    // Currently unused, kept for future package-based access logic.
  }

  /* ===========================
     ⏳ Wait for auth to fully settle
  =========================== */
  if (!initialized || loading) {
    return <BizuplyLoader fullScreen label="Loading data..." />;
  }

  /* ===========================
     🚫 Not authenticated
  =========================== */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /* ===========================
     👑 Admin – send to admin panel, never client/business dashboards
  =========================== */
  if (isAdmin) {
    const path = location.pathname || "";
    const isAlreadyOnAdmin = path.startsWith("/admin");
    const isWrongDashboard =
      path.startsWith("/client/dashboard") ||
      path === "/dashboard" ||
      path.startsWith("/dashboard/");

    if (!isAlreadyOnAdmin && isWrongDashboard) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
  }

  /* ===========================
     🔐 Role validation
  =========================== */
  if (normalizedRoles.length > 0 && !normalizedRoles.includes(role)) {
    return <Unauthorized />;
  }

  /* ===========================
     🏗️ Business without businessId
  =========================== */
  if (isBusiness && !user.businessId) {
    return <Navigate to="/create-business" replace />;
  }

  /* ===========================
     ⚠️ Trial expired – modal only
  =========================== */
  if (showTrialModal) {
    return <TrialExpiredModal />;
  }

  /* ===========================
     ✅ Access granted
  =========================== */
  return <>{children}</>;
}