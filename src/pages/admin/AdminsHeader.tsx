import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || user?.email || "מנהל";

  function isActive(path: string) {
    if (path === "/admin/dashboard") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      );
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  function navClass(path: string) {
    return `rounded-2xl px-4 py-3 text-sm font-black transition ${
      isActive(path)
        ? "bg-white text-purple-950 shadow-xl shadow-black/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#160825]/95 px-4 py-4 text-right text-white backdrop-blur-xl md:px-8"
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center justify-start gap-3 text-right"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xl shadow-xl shadow-purple-950/40">
            👑
          </span>

          <span>
            <strong className="block text-lg font-black">פאנל ניהול</strong>
            <small className="block text-xs font-bold text-black/50">
              Bizuply Admin
            </small>
          </span>
        </button>

        <nav className="flex gap-2 overflow-x-auto rounded-[24px] border border-white/10 bg-white/5 p-2">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className={navClass("/admin/dashboard")}
          >
            דשבורד
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/early-access")}
            className={navClass("/admin/early-access")}
          >
            הרשמה מוקדמת
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className={navClass("/admin/users")}
          >
            משתמשים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/businesses")}
            className={navClass("/admin/businesses")}
          >
            עסקים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/affiliates")}
            className={navClass("/admin/affiliates")}
          >
            שותפים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/withdrawals")}
            className={navClass("/admin/withdrawals")}
          >
            משיכות
          </button>
        </nav>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="text-right">
            <span className="block text-sm font-black text-black">
              שלום, {displayName}
            </span>
            <small className="block text-xs font-bold text-black/45">
              מנהל מערכת
            </small>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-gradient-to-l from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-black text-black shadow-xl shadow-purple-950/40 transition hover:-translate-y-0.5"
          >
            התנתקות
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;