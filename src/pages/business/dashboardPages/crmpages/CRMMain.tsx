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
  Sparkles,
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
    badge: "New",
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
    <section className="min-h-[calc(100vh-92px)] bg-[radial-gradient(circle_at_top_left,#f4edff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(88,28,135,0.10)] backdrop-blur md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
          <div className="pointer-events-none absolute left-40 top-20 h-56 w-56 rounded-full bg-fuchsia-100/70 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                <Sparkles className="h-4 w-4" />
                Smart CRM Workspace
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Manage leads, clients and bookings in one place
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                A premium CRM hub for appointments, leads, customers, services,
                work hours, payments, follow-ups and automations.
              </p>
            </div>

            <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-500">
                  Active section
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {activeTabData.label}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {activeTabData.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                  CRM Health
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-700">
                  Active
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                  Smart mode
                </p>
                <p className="mt-2 text-2xl font-black text-amber-700">Ready</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[310px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white/90 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mb-3 flex items-center gap-3 px-3 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <KanbanSquare className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">CRM Menu</p>
                <p className="text-xs font-semibold text-slate-400">
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
                        "group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition",
                        isActive
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                          : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                              isActive
                                ? "bg-white/15 text-white"
                                : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-violet-700",
                            ].join(" ")}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                              {tab.label}
                            </p>
                            <p
                              className={[
                                "truncate text-xs font-semibold",
                                isActive ? "text-violet-100" : "text-slate-400",
                              ].join(" ")}
                            >
                              {tab.description}
                            </p>
                          </div>
                        </div>

                        {tab.badge && (
                          <span
                            className={[
                              "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
                              isActive
                                ? "bg-white text-violet-700"
                                : "bg-violet-50 text-violet-700",
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
          </aside>

          <main className="min-w-0 rounded-[2rem] border border-slate-100 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </section>
  );
}