import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || user?.email || "מנהל";

  function isActive(path: string) {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
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
      className="sticky top-0 z-50 border-b border-purple-200/60 bg-[#f8f3ff]/90 px-4 py-3 backdrop-blur-xl md:px-6"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="flex items-center justify-center gap-3 rounded-2xl text-right text-xl font-black text-purple-950 lg:justify-start"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-purple-900/10">
            👑
          </span>
          <span>פאנל ניהול</span>
        </button>

        <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white/60 p-2 shadow-sm shadow-purple-950/5">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
              isActive("/admin")
                ? "bg-purple-700 text-white shadow-lg shadow-purple-700/25"
                : "text-purple-950 hover:bg-white"
            }`}
          >
            דשבורד
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
              isActive("/admin/users")
                ? "bg-purple-700 text-white shadow-lg shadow-purple-700/25"
                : "text-purple-950 hover:bg-white"
            }`}
          >
            משתמשים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/early-access")}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
              isActive("/admin/early-access")
                ? "bg-purple-700 text-white shadow-lg shadow-purple-700/25"
                : "text-purple-950 hover:bg-white"
            }`}
          >
            הרשמה מוקדמת
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/affiliates")}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
              isActive("/admin/affiliates")
                ? "bg-purple-700 text-white shadow-lg shadow-purple-700/25"
                : "text-purple-950 hover:bg-white"
            }`}
          >
            שותפים
          </button>
        </nav>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <span className="text-sm font-bold text-purple-950">
            שלום, {displayName}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-purple-700 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-purple-700/25 transition hover:-translate-y-0.5 hover:bg-purple-800"
          >
            התנתקות
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;