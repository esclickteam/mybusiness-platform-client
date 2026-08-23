import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BadgePercent,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Store,
  Users,
  UserPlus,
  Receipt,
  Wallet,
  Banknote,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/partner/dashboard", label: "סקירה", icon: LayoutDashboard, end: true },
  { to: "/partner/dashboard/crm", label: "לקוחות", icon: Users },
  { to: "/partner/dashboard/clients/new", label: "לקוח חדש", icon: UserPlus },
  { to: "/partner/dashboard/pricing", label: "תמחור", icon: BadgePercent },
  { to: "/partner/dashboard/storefront", label: "חנות", icon: Store },
  { to: "/partner/dashboard/transactions", label: "עסקאות ועמלות", icon: Receipt },
  { to: "/partner/dashboard/withdrawals", label: "משיכת עמלות", icon: Banknote },
  { to: "/partner/dashboard/revenue", label: "המנוי שלי", icon: Wallet },
  { to: "/partner/dashboard/team", label: "צוות", icon: Building2 },
  { to: "/partner/dashboard/settings", label: "הגדרות", icon: Settings },
];

export default function PartnerLayout() {
  const { user, logout } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout: () => void;
  };
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,#ece4ff,transparent_34%),radial-gradient(circle_at_bottom_left,#e8f4ff,transparent_42%),#f6f7fb] text-slate-800"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <header className="border-b border-white/70 bg-white/80 px-4 py-4 shadow-[0_10px_40px_rgba(88,28,135,0.06)] backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#4C1D95] text-sm font-black text-white shadow-lg shadow-violet-500/30">
              BP
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7C4DFF]">
                Bizuply Partner
              </p>
              <h1 className="text-lg font-black text-slate-900 md:text-xl">לוח פרטנר</h1>
              <p className="text-xs font-bold text-slate-500">
                {user?.name || user?.email || "פרטנר"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:border-slate-300"
          >
            <LogOut className="h-4 w-4" />
            התנתקות
          </button>
        </div>
        <nav className="mx-auto mt-4 flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "inline-flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-bold transition",
                    isActive
                      ? "bg-gradient-to-l from-[#7C4DFF] to-[#5B21B6] text-white shadow-md shadow-violet-500/20"
                      : "bg-white text-slate-600 shadow-sm hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
