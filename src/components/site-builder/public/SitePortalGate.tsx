import React, { useEffect, useMemo } from "react";
import SitePortalLoginView from "./SitePortalLoginView";
import SitePortalAcceptInviteView from "./SitePortalAcceptInviteView";
import SitePortalAccountView from "./SitePortalAccountView";
import SitePortalPasswordView from "./SitePortalPasswordView";
import {
  hasRenderableDesignedPortalPage,
  resolvePortalPaths,
} from "./portalSitePaths";
import SitePortalRegisterView from "./SitePortalRegisterView";

type PortalGateInfo = {
  pluginEnabled?: boolean;
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

function PortalRedirect({ to }: { to: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(to);
    }
  }, [to]);

  return null;
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
    if (path === "/portal/register") return "register";
    if (path === "/portal/account") return "account";
    if (path === "/portal/accept-invite") return "accept-invite";
    if (path === "/portal/forgot-password") return "forgot-password";
    if (path === "/portal/reset-password") return "reset-password";
    /*
      Empty library stubs at /login|/register|/account have no visual, so the
      public renderer paints Home. Treat those aliases as portal routes unless
      the merchant actually designed a portal widget on that page.
    */
    if (
      (path === "/login" || path === "/signin") &&
      !hasRenderableDesignedPortalPage(site, path)
    ) {
      return "login";
    }
    if (
      (path === "/register" || path === "/signup") &&
      !hasRenderableDesignedPortalPage(site, path)
    ) {
      return "register";
    }
    if (
      (path === "/account" || path === "/my-account") &&
      !hasRenderableDesignedPortalPage(site, path)
    ) {
      return "account";
    }
    return null;
  }, [pathname, site]);

  const pluginEnabled =
    portalGate.pluginEnabled !== false &&
    (Array.isArray(site?.enabledPlugins)
      ? site.enabledPlugins.includes("client-portal")
      : portalGate.pluginEnabled === true);

  /*
    Designed portal pages are numbered by the library (login-02, account-03),
    so resolve them by the widget they host instead of by a guessed slug.
  */
  const portalPaths = useMemo(() => resolvePortalPaths(site), [site]);

  const hasDesignedPage = (path: string) =>
    hasRenderableDesignedPortalPage(site, path);

  if (portalRoute && !pluginEnabled) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white px-4"
      >
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-black text-slate-900">
            {portalGate.reason === "billing_inactive"
              ? "האזור האישי אינו פעיל"
              : "אין אזור אישי"}
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500">
            {portalGate.reason === "billing_inactive"
              ? "התוסף «אזור אישי» קיים באתר, אך המנוי אינו פעיל כרגע."
              : "באתר זה לא מותקן התוסף «אזור אישי», ולכן אין התחברות ללקוחות."}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
          >
            חזרה לאתר
          </a>
        </div>
      </div>
    );
  }

  const currentPath = String(pathname || "/").replace(/\/+$/, "") || "/";

  if (portalRoute === "login") {
    // Legacy route: use the designed page inside the published site chrome.
    if (
      hasDesignedPage(portalPaths.login) &&
      portalPaths.login !== currentPath
    ) {
      const search =
        typeof window !== "undefined" ? window.location.search || "" : "";
      return <PortalRedirect to={`${portalPaths.login}${search}`} />;
    }

    const returnPath =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("return") ||
          "/portal/account"
        : "/portal/account";

    return (
      <SitePortalLoginView
        siteName={siteName}
        siteId={siteId}
        returnPath={returnPath}
        onSuccess={() => onPortalAuthChange?.()}
      />
    );
  }

  if (portalRoute === "register") {
    if (
      hasDesignedPage(portalPaths.register) &&
      portalPaths.register !== currentPath
    ) {
      const search =
        typeof window !== "undefined" ? window.location.search || "" : "";
      return <PortalRedirect to={`${portalPaths.register}${search}`} />;
    }

    return (
      <SitePortalRegisterView
        siteName={siteName}
        siteId={siteId}
        returnPath={portalPaths.account || "/portal/account"}
        onSuccess={() => onPortalAuthChange?.()}
      />
    );
  }

  /*
    Password recovery lives on the site's own designed pages. Keep the query
    string so the reset token from the email survives the redirect.
  */
  if (portalRoute === "forgot-password" || portalRoute === "reset-password") {
    const designedPath =
      portalRoute === "forgot-password"
        ? portalPaths.forgotPassword
        : portalPaths.resetPassword;

    if (hasDesignedPage(designedPath)) {
      const search =
        typeof window !== "undefined" ? window.location.search || "" : "";
      return <PortalRedirect to={`${designedPath}${search}`} />;
    }

    return (
      <SitePortalPasswordView
        mode={portalRoute === "forgot-password" ? "forgot" : "reset"}
        siteName={siteName}
        siteId={siteId}
        loginPath={portalPaths.login}
        accountPath={portalPaths.account}
        resetPath={portalPaths.resetPassword}
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
    // Legacy route: use the designed account page when it exists.
    if (
      hasDesignedPage(portalPaths.account) &&
      portalPaths.account !== currentPath
    ) {
      return <PortalRedirect to={portalPaths.account} />;
    }

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
      const packagesPath = hasDesignedPage(portalPaths.packages)
        ? portalPaths.packages
        : "/packages";
      const accountPath = hasDesignedPage(portalPaths.account)
        ? portalPaths.account
        : "/portal/account";

      return (
        <div
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-white px-4"
        >
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900">נדרש תשלום</h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              העמוד הזה פתוח ללקוחות משלמים. בחרו חבילה והשלימו תשלום בסליקה כדי
              לפתוח גישה.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <a
                href={packagesPath}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
              >
                לחבילות ותשלום
              </a>
              <a
                href={accountPath}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                החשבון שלי
              </a>
            </div>
          </div>
        </div>
      );
    }

    const designedLoginPath = hasDesignedPage(portalPaths.login)
      ? portalPaths.login
      : "";

    if (designedLoginPath) {
      const separator = designedLoginPath.includes("?") ? "&" : "?";
      return (
        <PortalRedirect
          to={`${designedLoginPath}${separator}return=${encodeURIComponent(
            returnPath,
          )}`}
        />
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
