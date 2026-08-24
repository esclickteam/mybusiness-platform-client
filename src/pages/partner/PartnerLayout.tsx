import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Banknote, BadgePercent, Bell, CalendarCheck, Handshake, LayoutDashboard, LogOut, Menu, Settings, Store, UserPlus, Users, Wallet, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PARTNER_FONT } from "../../components/partner/partnerUi";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const SIDEBAR: NavItem[] = [
  { to: "/partner/dashboard", label: "לוח פרטנר", icon: LayoutDashboard, end: true },
  { to: "/partner/dashboard/crm", label: "לקוחות", icon: Users },
  { to: "/partner/dashboard/clients/new", label: "לקוח חדש", icon: UserPlus },
  { to: "/partner/dashboard/reminders", label: "תזכורות", icon: Bell },
  { to: "/partner/dashboard/tasks", label: "משימות", icon: CalendarCheck },
  { to: "/partner/dashboard/transactions", label: "עסקאות", icon: Handshake },
  { to: "/partner/dashboard/withdrawals", label: "משיכת עמלה", icon: Banknote },
  { to: "/partner/dashboard/pricing", label: "מוצרים ושירותים", icon: BadgePercent },
  { to: "/partner/dashboard/revenue", label: "דוחות", icon: Wallet },
  { to: "/partner/dashboard/settings", label: "הגדרות", icon: Settings },
];

const PILLS: NavItem[] = [
  { to: "/partner/dashboard", label: "סקירה", icon: LayoutDashboard, end: true },
  { to: "/partner/dashboard/crm", label: "לקוחות", icon: Users },
  { to: "/partner/dashboard/clients/new", label: "לקוח חדש", icon: UserPlus },
  { to: "/partner/dashboard/tasks", label: "משימות", icon: CalendarCheck },
  { to: "/partner/dashboard/transactions", label: "עסקאות", icon: Handshake },
  { to: "/partner/dashboard/withdrawals", label: "משיכת עמלה", icon: Banknote },
  { to: "/partner/dashboard/pricing", label: "מוצרים ושירותים", icon: BadgePercent },
  { to: "/partner/dashboard/revenue", label: "דוחות", icon: Wallet },
  { to: "/partner/dashboard/settings", label: "הגדרות", icon: Settings },
];

const TOOLS = [
  { to: "/partner/dashboard/storefront", label: "חנות" },
  { to: "/partner/dashboard/team", label: "צוות" },
];

const TITLES: Array<{ test: (path: string) => boolean; title: string }> = [
  { test: (path) => path.endsWith("/clients/new"), title: "לקוח חדש" },
  { test: (path) => /\/crm\/[^/]+$/.test(path), title: "תיק לקוח" },
  { test: (path) => path.includes("/crm"), title: "לקוחות" },
  { test: (path) => path.includes("/reminders"), title: "תזכורות" },
  { test: (path) => path.includes("/tasks"), title: "משימות" },
  { test: (path) => path.includes("/transactions"), title: "עסקאות" },
  { test: (path) => path.includes("/pricing"), title: "מוצרים ושירותים" },
  { test: (path) => path.includes("/storefront"), title: "חנות" },
  { test: (path) => path.includes("/withdrawals"), title: "משיכת עמלות" },
  { test: (path) => path.includes("/revenue"), title: "דוחות" },
  { test: (path) => path.includes("/team"), title: "צוות" },
  { test: (path) => path.includes("/settings"), title: "הגדרות" },
  { test: (path) => path.includes("/deals/"), title: "סיכום עסקה" },
  { test: () => true, title: "לוח פרטנר" },
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
  const { user, logout } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout: () => void;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const title = useMemo(
    () => TITLES.find((item) => item.test(location.pathname))?.title || "לוח פרטנר",
    [location.pathname]
  );
  const displayName = user?.name || user?.email || "פרטנר";
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
          <p className="text-sm font-black text-slate-900">פרטנר דשבורד</p>
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
              {item.label}
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
          יציאה
        </button>
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
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
              aria-label="סגירה"
              className="absolute inset-0 bg-slate-900/30"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 right-0 w-[248px] bg-[#F1ECFB] shadow-2xl">
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
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setToolsOpen((value) => !value)}
                    className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 shadow-sm sm:inline-flex"
                  >
                    <Store className="h-4 w-4" />
                    כלים
                  </button>
                  {toolsOpen ? (
                    <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
                      {TOOLS.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setToolsOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-violet-50"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
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
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>
          <main className="px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
