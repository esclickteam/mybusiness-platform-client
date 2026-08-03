import React, { useMemo } from "react";
import SitePortalLoginView from "./SitePortalLoginView";
import SitePortalAcceptInviteView from "./SitePortalAcceptInviteView";
import SitePortalAccountView from "./SitePortalAccountView";

type PortalGateInfo = {
  requiresLogin?: boolean;
  allowed?: boolean;
  authenticated?: boolean;
  reason?: string;
  loginPath?: string;
};

type Props = {
  site: any;
  pathname: string;
  children: React.ReactNode;
  onPortalAuthChange?: () => void;
};

function getSiteId(site: any): string {
  return String(site?._id || site?.id || "").trim();
}

export default function SitePortalGate({
  site,
  pathname,
  children,
  onPortalAuthChange,
}: Props) {
  const siteId = getSiteId(site);
  const siteName = String(site?.name || site?.brand?.name || "").trim();
  const portalGate = (site?.portalGate || {}) as PortalGateInfo;

  const portalRoute = useMemo(() => {
    const path = String(pathname || "/").replace(/\/+$/, "") || "/";
    if (path === "/portal/login") return "login";
    if (path === "/portal/account") return "account";
    if (path === "/portal/accept-invite") return "accept-invite";
    return null;
  }, [pathname]);

  if (portalRoute === "login") {
    const returnPath =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("return") || "/"
        : "/";

    return (
      <SitePortalLoginView
        siteName={siteName}
        siteId={siteId}
        returnPath={returnPath}
        onSuccess={() => onPortalAuthChange?.()}
      />
    );
  }

  if (portalRoute === "accept-invite") {
    return (
      <SitePortalAcceptInviteView
        siteName={siteName}
        onSuccess={() => onPortalAuthChange?.()}
      />
    );
  }

  if (portalRoute === "account") {
    if (!siteId) {
      return (
        <SitePortalLoginView
          siteName={siteName}
          returnPath="/portal/account"
          onSuccess={() => onPortalAuthChange?.()}
        />
      );
    }

    return <SitePortalAccountView siteId={siteId} siteName={siteName} />;
  }

  if (portalGate.requiresLogin && !portalGate.allowed) {
    const returnPath =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search || ""}`
        : pathname || "/";

    if (portalGate.authenticated && portalGate.reason === "forbidden") {
      return (
        <div
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-white px-4"
        >
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900">אין הרשאה</h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              החשבון שלכם באזור האישי אינו מורשה לצפות בעמוד זה.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <a
                href="/"
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                חזרה לדף הבית
              </a>
              <a
                href="/portal/account"
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
              >
                החשבון שלי
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <SitePortalLoginView
        siteName={siteName}
        siteId={siteId}
        returnPath={returnPath}
        onSuccess={() => onPortalAuthChange?.()}
      />
    );
  }

  return <>{children}</>;
}
