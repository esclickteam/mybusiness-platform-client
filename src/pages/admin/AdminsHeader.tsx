import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown, Settings } from "lucide-react";

import AdminNotifications from "../../components/AdminNotifications";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "דשבורד" },
  { path: "/admin/early-access", label: "הרשמה מוקדמת" },
  { path: "/admin/users", label: "משתמשים" },
  { path: "/admin/businesses", label: "עסקים" },
  { path: "/admin/affiliates", label: "שותפים" },
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

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-4 py-3 text-right text-slate-800 shadow-[0_2px_16px_rgba(124,77,255,0.06)] backdrop-blur-xl md:px-8"
      style={{ fontFamily: '"Heebo", "Assistant", "Rubik", sans-serif' }}
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center justify-start gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30">
            <Crown className="h-5 w-5" strokeWidth={2.4} />
          </span>

          <span>
            <strong className="block text-base font-black text-slate-900 md:text-lg">
              פאנל ניהול
            </strong>
            <small className="block text-xs font-bold text-slate-400">
              Bizuply Admin
            </small>
          </span>
        </button>

        <nav className="flex gap-1 overflow-x-auto pb-1 xl:pb-0">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const isSupport = item.path === "/admin/support-chat";

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative whitespace-nowrap px-3 py-2.5 text-sm font-bold transition md:px-4 ${
                  active
                    ? "text-[#7C4DFF]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}
                {isSupport && supportBadge > 0 && (
                  <span className="absolute left-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                    {supportBadge > 9 ? "9+" : supportBadge}
                  </span>
                )}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-[#7C4DFF]" />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div
          dir="ltr"
          className="flex items-center justify-end gap-2 sm:gap-3"
        >
          <div className="flex items-center gap-3" dir="rtl">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#A78BFA] text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25">
              {initials}
            </span>
            <div className="hidden text-right sm:block">
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
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-[#7C4DFF] hover:shadow-md"
          >
            <Settings className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <AdminNotifications />

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-[#7C4DFF] px-4 py-2.5 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 hover:bg-[#6B3FE0]"
          >
            התנתקות
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
