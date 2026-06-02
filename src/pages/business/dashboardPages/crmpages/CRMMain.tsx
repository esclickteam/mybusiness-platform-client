import React, { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  Clock,
  ContactRound,
  CreditCard,
  Flame,
  KanbanSquare,
  Settings,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react";

type CrmTab = {
  path: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
};

const crmTabs: CrmTab[] = [
  {
    path: "overview",
    label: "CRM Overview",
    description: "Business snapshot",
    icon: BarChart3,
  },
  {
    path: "leads",
    label: "Leads",
    description: "New opportunities",
    icon: Flame,
      },
  {
    path: "clients",
    label: "Clients",
    description: "Customer database",
    icon: UsersRound,
  },
  {
    path: "appointments",
    label: "Appointments",
    description: "Bookings & schedule",
    icon: CalendarDays,
  },
  {
    path: "calendar",
    label: "Calendar",
    description: "Monthly planning",
    icon: Clock,
  },
  {
    path: "services",
    label: "Services",
    description: "Prices & duration",
    icon: Wrench,
  },
  {
    path: "work-hours",
    label: "Work Hours",
    description: "Availability rules",
    icon: Clock,
  },
  {
    path: "follow-ups",
    label: "Follow-ups",
    description: "Tasks & reminders",
    icon: ContactRound,
  },
  {
    path: "payments",
    label: "Payments",
    description: "Revenue tracking",
    icon: CreditCard,
  },
  {
    path: "automations",
    label: "Automations",
    description: "Smart workflows",
    icon: Zap,
  },
  {
    path: "settings",
    label: "Settings",
    description: "CRM preferences",
    icon: Settings,
  },
];

async function fetchAppointments() {
  const res = await fetch("/api/appointments/all-with-services", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return res.json();
}

async function fetchClients() {
  const res = await fetch("/api/crm-clients", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch clients");
  }

  return res.json();
}

async function fetchServices() {
  const res = await fetch("/api/business/my/services", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
}

async function fetchWorkHours() {
  const res = await fetch("/api/appointments/get-work-hours", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch work hours");
  }

  return res.json();
}

export default function CRMMain() {
  const queryClient = useQueryClient();
  const location = useLocation();

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "overview";
  }, [location.pathname]);

  const activeTabData = useMemo(() => {
    return crmTabs.find((tab) => tab.path === currentTab) || crmTabs[0];
  }, [currentTab]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["appointments"],
      queryFn: fetchAppointments,
    });

    queryClient.prefetchQuery({
      queryKey: ["clients"],
      queryFn: fetchClients,
    });

    queryClient.prefetchQuery({
      queryKey: ["services"],
      queryFn: fetchServices,
    });

    queryClient.prefetchQuery({
      queryKey: ["work-hours"],
      queryFn: fetchWorkHours,
    });
  }, [queryClient]);

  const ActiveIcon = activeTabData.icon;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,#eef6ff_0%,#f7fafc_32%,#fbfcff_62%,#ffffff_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1540px]">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_26px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-6">
            <div className="mb-5 flex items-center gap-3 px-2 pt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.22)]">
                <KanbanSquare className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[15px] font-black tracking-tight text-slate-950">
                  CRM Menu
                </p>
                <p className="text-xs font-bold text-slate-400">
                  Manage every workflow
                </p>
              </div>
            </div>

            <nav className="grid gap-2">
              {crmTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex items-center justify-between gap-3 rounded-[1.35rem] px-4 py-3.5 transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2",
                        isActive
                          ? "bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white shadow-[0_18px_42px_rgba(15,23,42,0.28)]"
                          : "bg-transparent text-slate-600 hover:bg-sky-50/90 hover:text-sky-900",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-200",
                              isActive
                                ? "bg-white/15 text-white"
                                : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-sky-900 group-hover:shadow-sm",
                            ].join(" ")}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-black leading-5 tracking-tight">
                              {tab.label}
                            </p>
                            <p
                              className={[
                                "truncate text-[12px] font-bold leading-4",
                                isActive ? "text-sky-100" : "text-slate-400",
                              ].join(" ")}
                            >
                              {tab.description}
                            </p>
                          </div>
                        </div>

                        {tab.badge && (
                          <span
                            className={[
                              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
                              isActive
                                ? "bg-white text-slate-950"
                                : "bg-sky-50 text-sky-800",
                            ].join(" ")}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-5 rounded-[1.5rem] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ActiveIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
                    Active
                  </p>
                  <p className="text-sm font-black text-slate-950">
                    {activeTabData.label}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="rounded-[2.2rem] border border-white/80 bg-white/90 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}