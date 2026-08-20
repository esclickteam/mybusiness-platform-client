import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ADMIN_PAGE_SHELL_CLASS } from "../../../utils/adminResponsive";
import AdminHeader from "../AdminsHeader";

const TABS = [
  { to: "/admin/crm", label: "סקירה", end: true },
  { to: "/admin/crm/customers", label: "לקוחות" },
  { to: "/admin/crm/pipeline", label: "פייפליין" },
  { to: "/admin/crm/tasks", label: "משימות" },
  { to: "/admin/crm/activities", label: "פעילויות" },
  { to: "/admin/crm/whatsapp", label: "WhatsApp" },
];

export default function AdminCrmLayout() {
  const navigate = useNavigate();
  const { user } = useAuth() as { user: { role?: string } | null };

  React.useEffect(() => {
    if (user && user.role !== "admin") navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl" style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}>
      <AdminHeader />
      <main className="mx-auto mt-5 max-w-[1480px]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">Admin · CRM</p>
            <h1 className="text-2xl font-black text-purple-950 sm:text-3xl">CRM לקוחות BizUply</h1>
            <p className="mt-1 text-sm font-bold text-slate-500">
              ניהול לידים ולקוחות הפלטפורמה. נפרד לחלוטין מ-CRM של העסק.
            </p>
          </div>
        </div>
        <nav className="mb-5 flex gap-2 overflow-x-auto pb-1">
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
        <Outlet />
      </main>
    </div>
  );
}
