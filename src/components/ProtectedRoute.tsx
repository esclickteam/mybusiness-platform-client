import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";
import TrialExpiredModal from "./TrialExpiredModal";
import BizuplyLoader from "./ui/BizuplyLoader";
import { rememberPostLoginRedirect } from "../utils/safeInternalRedirect";
import { isAllowedPluginBillingReturn } from "../utils/pluginBillingReturn";

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
  hasAccess?: boolean;
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
  const isPartnerManaged =
    role === "partner" &&
    Boolean(
      user?.managedBusinessId ||
        (typeof window !== "undefined" &&
          window.localStorage.getItem("managedBusinessId"))
    );

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
    const from = `${location.pathname}${location.search || ""}${
      location.hash || ""
    }`;
    rememberPostLoginRedirect(from);
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from,
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
    if (isPartnerManaged && normalizedRoles.includes("business")) {
      // Partner stays role=partner while operating a managed business.
    } else if (role === "partner") {
      return <Navigate to="/partner/dashboard" replace />;
    } else {
      return <Unauthorized />;
    }
  }

  /* ===========================
     🔑 One-time password — Partner customers (business role only)
  =========================== */
  if (
    isBusiness &&
    (user?.mustChangePassword || user?.isTempPassword) &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  /* ===========================
     🏗️ Business without businessId
  =========================== */
  if (isBusiness && !user.businessId && location.pathname !== "/change-password") {
    return <Navigate to="/create-business" replace />;
  }

  /* ===========================
     💳 Unpaid business – finish checkout first
     Exception: Stripe plugin/portal billing return only (query or same-tab
     marker). Manual /website manage URLs must still hit /pricing.
  =========================== */
  const isImpersonating =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem("impersonatedBy"));

  const isBillingReturn = isAllowedPluginBillingReturn({
    pathname: location.pathname,
    search: location.search,
  });

  if (isBusiness && !user.hasAccess && !isImpersonating && !isBillingReturn && location.pathname !== "/change-password") {
    return <Navigate to="/pricing" replace />;
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