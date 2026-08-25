import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ADMIN_PAGE_SHELL_CLASS } from "../../../utils/adminResponsive";
import AdminHeader from "../AdminsHeader";

const TABS = [
  { to: "/admin/crm", label: "סקירה", end: true },
  { to: "/admin/crm/customers", label: "לקוחות ולידים" },
  { to: "/admin/crm/pipeline", label: "Pipeline" },
  { to: "/admin/crm/tasks", label: "משימות" },
  { to: "/admin/crm/follow-ups", label: "מעקבים" },
  { to: "/admin/crm/whatsapp", label: "WhatsApp" },
  { to: "/admin/crm/activities", label: "פעילות" },
];

export default function AdminCrmLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWhatsApp = location.pathname.startsWith("/admin/crm/whatsapp");
  const { user, socket } = useAuth() as {
    user: { role?: string } | null;
    socket?: { emit?: (event: string, ...args: any[]) => void; on?: Function; off?: Function; connected?: boolean } | null;
  };

  React.useEffect(() => {
    if (user && user.role !== "admin") navigate("/", { replace: true });
  }, [user, navigate]);

  React.useEffect(() => {
    if (!socket?.emit) return;
    const join = () => socket.emit?.("joinRoom", "admin-crm");
    join();
    socket.on?.("connect", join);
    return () => {
      socket.off?.("connect", join);
    };
  }, [socket]);

  return (
    <div
      className={
        isWhatsApp
          ? "flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f6f2fb] px-3 py-3 text-right text-slate-800 sm:px-4 sm:py-4 md:px-8"
          : ADMIN_PAGE_SHELL_CLASS
      }
      dir="rtl"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <div className="shrink-0">
        <AdminHeader />
      </div>
      <main
        className={
          isWhatsApp
            ? "mx-auto mt-3 flex min-h-0 w-full flex-1 flex-col overflow-hidden"
            : "mx-auto mt-5 max-w-[1480px]"
        }
      >
        <div className="mb-3 flex shrink-0 flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">פאנל ניהול</p>
            <h1 className="text-2xl font-black text-purple-950 sm:text-3xl">CRM וניהול לקוחות</h1>
            <p className="mt-1 text-sm font-bold text-slate-500">
              ניהול לידים ולקוחות BizUply לכל אורך מחזור החיים. נפרד לחלוטין מ-CRM של העסק.
            </p>
          </div>
        </div>
        <nav className="mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1 sm:mb-5">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                [
                  "min-h-11 shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition",
                  isActive
                    ? "bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/25"
                    : "bg-white text-slate-600 border border-purple-100 hover:text-[#7C4DFF]",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        {isWhatsApp ? (
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
