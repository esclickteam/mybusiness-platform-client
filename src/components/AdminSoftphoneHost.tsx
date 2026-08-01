import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AdminSoftphone from "./AdminSoftphone";

/**
 * Long-lived softphone host — survives admin route changes and business
 * impersonation so an active call is never torn down by page navigation.
 */
export default function AdminSoftphoneHost() {
  const { user, isImpersonating } = useAuth() as {
    user: { role?: string; impersonatorRole?: string } | null;
    isImpersonating?: boolean;
  };
  const location = useLocation();

  const allowed = useMemo(() => {
    if (user?.role === "admin") return true;

    const impersonating =
      Boolean(isImpersonating) ||
      Boolean(
        typeof window !== "undefined" &&
          localStorage.getItem("impersonatedBy")
      );
    if (!impersonating) return false;

    const impersonatorRole =
      user?.impersonatorRole ||
      (typeof window !== "undefined"
        ? localStorage.getItem("impersonatorRole")
        : null) ||
      "admin";

    return impersonatorRole === "admin";
  }, [user, isImpersonating]);

  if (!allowed) return null;

  const inAdminShell = location.pathname.startsWith("/admin");

  return (
    <div
      className={
        inAdminShell
          ? "contents"
          : "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-4 z-[9997] sm:end-6"
      }
      data-softphone-host="true"
    >
      {/* In admin shell the header launcher opens the panel; elsewhere show FAB */}
      <AdminSoftphone launcher={inAdminShell ? "hidden" : "fab"} />
    </div>
  );
}
