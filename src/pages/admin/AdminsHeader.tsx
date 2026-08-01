import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown, LogOut, Settings } from "lucide-react";

import AdminNotifications from "../../components/AdminNotifications";
import AdminSoftphoneLauncher from "../../components/AdminSoftphoneLauncher";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "דשבורד" },
  { path: "/admin/customers", label: "לקוחות" },
  { path: "/admin/early-access", label: "הרשמה מוקדמת" },
  { path: "/admin/users", label: "משתמשים" },
  { path: "/admin/create-user", label: "יצירת משתמש" },
  { path: "/admin/businesses", label: "עסקים" },
  { path: "/admin/affiliates", label: "שותפים" },
  { path: "/admin/marketers", label: "משווקים" },
  { path: "/admin/withdrawals", label: "משיכות" },
  { path: "/admin/support-chat", label: "צ'אט תמיכה" },
] as const;

function AdminHeader() {
  const { user, logout, socket } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout: () => void;
    socket: any;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [supportBadge, setSupportBadge] = useState(0);

  const displayName = user?.name || user?.email || "מנהל";
  const initials = String(displayName)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "A";

  useEffect(() => {
    if (!socket) return;

    const bump = () => setSupportBadge((n) => n + 1);

    socket.emit("joinRoom", "admin-support");
    socket.on("support:notify", bump);
    socket.on("support:waiting", bump);
    socket.on("support:newMessage", (payload: any) => {
      if (payload?.message?.senderType === "visitor") bump();
    });

    return () => {
      socket.off("support:notify", bump);
      socket.off("support:waiting", bump);
      socket.off("support:newMessage");
    };
  }, [socket]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/support-chat")) {
      setSupportBadge(0);
    }
  }, [location.pathname]);

  function isActive(path: string) {
    if (path === "/admin/dashboard") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      );
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function renderNav(mobile: boolean) {
    return NAV_ITEMS.map((item) => {
      const active = isActive(item.path);
      const isSupport = item.path === "/admin/support-chat";

      return (
        <button
          key={`${mobile ? "m" : "d"}-${item.path}`}
          type="button"
          onClick={() => navigate(item.path)}
          className={[
            "relative shrink-0 whitespace-nowrap text-sm font-bold transition",
            mobile
              ? "inline-flex min-h-11 items-center rounded-2xl px-3.5"
              : "px-2.5 py-2 md:px-3.5",
            active
              ? mobile
                ? "bg-[#F3EEFF] text-[#7C4DFF]"
                : "text-[#7C4DFF]"
              : mobile
                ? "bg-slate-50 text-slate-600"
                : "text-slate-500 hover:text-slate-800",
          ].join(" ")}
        >
          {item.label}
          {isSupport && supportBadge > 0 && (
            <span className="absolute left-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
              {supportBadge > 9 ? "9+" : supportBadge}
            </span>
          )}
          {!mobile && active ? (
            <span className="absolute inset-x-2.5 -bottom-0.5 h-[3px] rounded-full bg-[#7C4DFF]" />
          ) : null}
        </button>
      );
    });
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 text-right text-slate-800 shadow-[0_2px_16px_rgba(124,77,255,0.06)] backdrop-blur-xl sm:px-4 md:px-8"
      style={{ fontFamily: '"Assistant", "Inter", "Rubik", sans-serif' }}
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex min-w-0 items-center justify-start gap-2.5 text-right sm:gap-3"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30">
              <Crown className="h-5 w-5" strokeWidth={2.4} />
            </span>

            <span className="min-w-0">
              <strong className="block truncate text-base font-black text-slate-900 md:text-lg">
                פאנל ניהול
              </strong>
              <small className="hidden text-xs font-bold text-slate-400 xs:block sm:block">
                Bizuply Admin
              </small>
            </span>
          </button>

          <div
            dir="ltr"
            className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-3"
          >
            <div className="hidden items-center gap-3 sm:flex" dir="rtl">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#A78BFA] text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25">
                {initials}
              </span>
              <div className="hidden text-right md:block">
                <span className="block text-sm font-black text-slate-900">
                  {displayName}
                </span>
                <small className="block text-xs font-bold text-slate-400">
                  מנהל מערכת
                </small>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/settings")}
              aria-label="הגדרות"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-[#7C4DFF] hover:shadow-md sm:h-12 sm:w-12"
            >
              <Settings className="h-5 w-5" strokeWidth={2.2} />
            </button>

            <AdminSoftphoneLauncher />

            <AdminNotifications />

            <button
              type="button"
              onClick={handleLogout}
              aria-label="התנתקות"
              className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 hover:bg-[#6B3FE0] sm:h-12 sm:px-4"
            >
              <LogOut className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">התנתקות</span>
            </button>
          </div>
        </div>

        {/* Mobile: horizontal scroll chips */}
        <nav
          className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] sm:-mx-4 sm:px-4 md:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="ניווט אדמין"
        >
          {renderNav(true)}
        </nav>

        {/* Desktop: classic underlined nav */}
        <nav className="hidden flex-wrap items-center justify-start gap-x-1 gap-y-1 md:flex">
          {renderNav(false)}
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;
