import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Banknote, BadgePercent, Bell, CalendarCheck, Handshake, LayoutDashboard, LogOut, Menu, Settings, Store, UserPlus, Users, Wallet, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { PARTNER_FONT } from "../../components/partner/partnerUi";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { getTextDirection } from "../../i18n/localeUtils";
import { exitPartnerManagedContext } from "../../lib/partnerApi";
import {
  clearManagedBusinessContext,
  getManagedBusinessId,
} from "../../lib/partnerManagedContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { localizePartnerDemoName } from "../../i18n/partnerDemoCopy";

type NavItem = {
  to: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const SIDEBAR: NavItem[] = [
  { to: "/partner/dashboard", labelKey: "partnerNav.overview", icon: LayoutDashboard, end: true },
  { to: "/partner/dashboard/crm", labelKey: "partnerNav.customers", icon: Users },
  { to: "/partner/dashboard/clients/new", labelKey: "partnerNav.newClient", icon: UserPlus },
  { to: "/partner/dashboard/reminders", labelKey: "partnerNav.reminders", icon: Bell },
  { to: "/partner/dashboard/tasks", labelKey: "partnerNav.tasks", icon: CalendarCheck },
  { to: "/partner/dashboard/transactions", labelKey: "partnerNav.deals", icon: Handshake },
  { to: "/partner/dashboard/withdrawals", labelKey: "partnerNav.commissions", icon: Banknote },
  { to: "/partner/dashboard/pricing", labelKey: "partnerNav.products", icon: BadgePercent },
  { to: "/partner/dashboard/page", labelKey: "partnerNav.myPage", icon: Store },
  { to: "/partner/dashboard/referrals", labelKey: "partnerNav.referPartner", icon: Handshake },
  { to: "/partner/dashboard/team", labelKey: "partnerNav.team", icon: Users },
  { to: "/partner/dashboard/revenue", labelKey: "partnerNav.reports", icon: Wallet },
  { to: "/partner/dashboard/settings", labelKey: "partnerNav.settings", icon: Settings },
];

const PILLS: NavItem[] = [
  { to: "/partner/dashboard", labelKey: "partnerNav.overview", icon: LayoutDashboard, end: true },
  { to: "/partner/dashboard/crm", labelKey: "partnerNav.customers", icon: Users },
  { to: "/partner/dashboard/transactions", labelKey: "partnerNav.deals", icon: Handshake },
  { to: "/partner/dashboard/withdrawals", labelKey: "partnerNav.commissionsShort", icon: Banknote },
  { to: "/partner/dashboard/pricing", labelKey: "partnerNav.productsShort", icon: BadgePercent },
  { to: "/partner/dashboard/page", labelKey: "partnerNav.myPage", icon: Store },
  { to: "/partner/dashboard/referrals", labelKey: "partnerNav.referPartner", icon: Handshake },
  { to: "/partner/dashboard/team", labelKey: "partnerNav.team", icon: Users },
  { to: "/partner/dashboard/settings", labelKey: "partnerNav.settings", icon: Settings },
];

const TITLES: Array<{ test: (path: string) => boolean; titleKey: string }> = [
  { test: (path) => path.endsWith("/clients/new"), titleKey: "partnerNav.newClient" },
  { test: (path) => /\/crm\/[^/]+$/.test(path), titleKey: "partnerNav.clientFile" },
  { test: (path) => path.includes("/crm"), titleKey: "partnerNav.customers" },
  { test: (path) => path.includes("/reminders"), titleKey: "partnerNav.reminders" },
  { test: (path) => path.includes("/tasks"), titleKey: "partnerNav.tasks" },
  { test: (path) => path.includes("/transactions"), titleKey: "partnerNav.deals" },
  { test: (path) => path.includes("/pricing"), titleKey: "partnerNav.products" },
  { test: (path) => path.includes("/storefront") || path.includes("/page"), titleKey: "partnerNav.myPage" },
  { test: (path) => path.includes("/referrals"), titleKey: "partnerNav.referPartner" },
  { test: (path) => path.includes("/withdrawals"), titleKey: "partnerNav.commissions" },
  { test: (path) => path.includes("/revenue"), titleKey: "partnerNav.reports" },
  { test: (path) => path.includes("/team"), titleKey: "partnerNav.team" },
  { test: (path) => path.includes("/settings"), titleKey: "partnerNav.settings" },
  { test: (path) => path.includes("/deals/"), titleKey: "partnerNav.dealSummary" },
  { test: () => true, titleKey: "partnerNav.dashboard" },
];

function navClass(isActive: boolean, variant: "side" | "pill") {
  if (variant === "side") {
    return [
      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black transition",
      isActive
        ? "bg-[#6D28D9] text-white shadow-[0_8px_18px_rgba(109,40,217,0.28)]"
        : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
    ].join(" ");
  }
  return [
    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
    isActive
      ? "bg-[#6D28D9] text-white shadow-[0_8px_18px_rgba(109,40,217,0.22)]"
      : "bg-white text-slate-600 shadow-sm hover:text-slate-900",
  ].join(" ");
}

export default function PartnerLayout() {
  const { t, i18n } = useTranslation();
  const layoutDir = getTextDirection(i18n.language);
  const { user, logout, loginWithToken } = useAuth() as {
    user: {
      name?: string;
      email?: string;
      role?: string;
      managedBusinessId?: string | null;
    } | null;
    logout: () => void;
    loginWithToken?: (
      nextUser: unknown,
      token: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [workspaceReady, setWorkspaceReady] = useState(() => !getManagedBusinessId());

  useEffect(() => {
    const leftoverManagedId =
      getManagedBusinessId() ||
      (user?.role === "partner" ? String(user.managedBusinessId || "").trim() : "");
    if (!leftoverManagedId) {
      setWorkspaceReady(true);
      return;
    }
    if (!user) return;
    setWorkspaceReady(false);
    let cancelled = false;
    (async () => {
      try {
        const data = await exitPartnerManagedContext();
        if (cancelled) return;
        loginWithToken?.(data.user, data.token, { skipRedirect: true });
      } catch {
        // Drop the leftover client-management session even if exit fails,
        // so partner CRM can load instead of showing a context mismatch.
      } finally {
        if (!cancelled) {
          clearManagedBusinessContext();
          setWorkspaceReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loginWithToken]);

  const title = useMemo(
    () => t(TITLES.find((item) => item.test(location.pathname))?.titleKey || "partnerNav.dashboard"),
    [location.pathname, t]
  );
  const rawDisplayName = user?.name || user?.email || t("partnerNav.partnerFallback");
  const displayName = user?.name
    ? localizePartnerDemoName(t, user.name)
    : rawDisplayName;
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  function signOut() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-6 pt-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6D28D9] text-sm font-black text-white">
          BP
        </span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">
            Bizuply Partner
          </p>
          <p className="text-sm font-black text-slate-900">{t("partnerNav.dashboard")}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {SIDEBAR.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => navClass(isActive, "side")}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-slate-500 hover:bg-white/70 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4" />
          {t("partnerNav.signOut")}
        </button>
      </div>
    </div>
  );

  return (
    <div
      dir={layoutDir}
      className="min-h-screen bg-[#F7F8FA] text-slate-800"
      style={{ fontFamily: PARTNER_FONT }}
    >
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 overflow-y-auto bg-[#F1ECFB] lg:block">
          {sidebar}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label={t("common.closeMenu")}
              className="absolute inset-0 bg-slate-900/30"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 inset-inline-end-0 w-[248px] bg-[#F1ECFB] shadow-2xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute left-3 top-4 rounded-xl p-2 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/80 bg-[#F7F8FA]/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">
                    BIZUPLY PARTNER
                  </p>
                  <h1 className="truncate text-xl font-black text-slate-900 md:text-2xl">
                    {title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <NavLink
                  to="/partner/dashboard/settings"
                  className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm"
                >
                  <Settings className="h-4 w-4" />
                </NavLink>
                <div className="flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 shadow-sm">
                  <span className="hidden text-sm font-black text-slate-700 sm:block">
                    {displayName}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6D28D9] text-xs font-black text-white">
                    {initials || "BP"}
                  </span>
                </div>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {PILLS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => navClass(isActive, "pill")}
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
          </header>
          <main className="px-4 py-6 md:px-6 lg:px-8">
            {workspaceReady ? <Outlet /> : <BizuplyLoader label={t("partner.returningToWorkspace")} />}
          </main>
        </div>
      </div>
    </div>
  );
}
