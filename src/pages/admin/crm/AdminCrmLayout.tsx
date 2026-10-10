import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AdminPageHeader from "../shell/AdminPageHeader";

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
    <div className={isWhatsApp ? "biz-admin-fill" : undefined}>
      <div className={isWhatsApp ? "shrink-0 px-4 pt-3" : undefined}>
        <div className={isWhatsApp ? "hidden lg:block" : undefined}>
          <AdminPageHeader
            title="CRM"
            description="לידים ולקוחות של Bizuply, בנפרד מה-CRM של העסק."
          />
        </div>
        <nav className="mb-3 flex shrink-0 gap-1 overflow-x-auto border-b border-[#e6e8ee] pb-0">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                [
                  "shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "border-[#6d4aff] text-[#5b3de6]"
                    : "border-transparent text-[#667085] hover:text-[#1c1f27]",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <main
        className={
          isWhatsApp
            ? "mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 pb-4"
            : "mx-auto max-w-[1480px]"
        }
      >
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
