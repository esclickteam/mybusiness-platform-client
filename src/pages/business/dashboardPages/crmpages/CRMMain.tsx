import React, { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CreditCard,
  Flame,
  KanbanSquare,
  Settings,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { workHoursQueryKey } from "../../../../hooks/useBusinessWorkHours";

type CrmTab = {
  path: string;
  labelKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  badgeKey?: string;
};

const removedTabPaths = new Set([
  "overview",
  "calendar",
  "follow-ups",
  "automations",
]);

const crmTabs: CrmTab[] = [
  {
    path: "leads",
    labelKey: "crm.nav.leads",
    descriptionKey: "crm.nav.leadsDesc",
    icon: Flame,
  },
  {
    path: "clients",
    labelKey: "crm.nav.clients",
    descriptionKey: "crm.nav.clientsDesc",
    icon: UsersRound,
  },
  {
    path: "appointments",
    labelKey: "crm.nav.appointments",
    descriptionKey: "crm.nav.appointmentsDesc",
    icon: CalendarDays,
  },
  {
    path: "services",
    labelKey: "crm.nav.services",
    descriptionKey: "crm.nav.servicesDesc",
    icon: Wrench,
  },
  {
    path: "payments",
    labelKey: "crm.nav.payments",
    descriptionKey: "crm.nav.paymentsDesc",
    icon: CreditCard,
  },
  {
    path: "mini-saas",
    labelKey: "crm.nav.miniSaas",
    descriptionKey: "crm.nav.miniSaasDesc",
    icon: Sparkles,
    badgeKey: "crm.nav.newBadge",
  },
  {
    path: "settings",
    labelKey: "crm.nav.settings",
    descriptionKey: "crm.nav.settingsDesc",
    icon: Settings,
  },
];

export default function CRMMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const businessId = user?.businessId || null;

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "leads";
  }, [location.pathname]);

  const isKnownTab = useMemo(() => {
    return crmTabs.some((tab) => tab.path === currentTab);
  }, [currentTab]);

  const activeTabData = useMemo(() => {
    return crmTabs.find((tab) => tab.path === currentTab) || crmTabs[0];
  }, [currentTab]);

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];

    const isCrmRoot = lastPart === "crm";
    const isRemovedTab = removedTabPaths.has(currentTab);
    const isUnknownTab = !isKnownTab;

    if (!isCrmRoot && !isRemovedTab && !isUnknownTab) return;

    const basePath = isCrmRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/leads`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, navigate]);

  useEffect(() => {
    if (!businessId) return;

    queryClient.prefetchQuery({
      queryKey: ["businessAppointments", businessId],
      queryFn: async () =>
        (
          await API.get("/appointments/all-with-services", {
            params: { businessId },
          })
        ).data,
    });

    queryClient.prefetchQuery({
      queryKey: ["crmClients", businessId],
      queryFn: async () =>
        (await API.get(`/crm-clients/${businessId}`)).data,
    });

    queryClient.prefetchQuery({
      queryKey: ["businessServices", businessId],
      queryFn: async () => (await API.get("/business/my/services")).data,
    });

    queryClient.prefetchQuery({
      queryKey: workHoursQueryKey(businessId),
      queryFn: async () =>
        (
          await API.get("/appointments/get-work-hours", {
            params: { businessId },
          })
        ).data,
    });
  }, [queryClient, businessId]);

  const ActiveIcon = activeTabData.icon;

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7FAFC] px-4 py-6 text-start text-slate-900 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 right-[-120px] h-[360px] w-[360px] rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute left-[-160px] top-28 h-[420px] w-[420px] rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[18%] h-[420px] w-[420px] rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1920px]">
        <header className="mb-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_22px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
          <div className="relative px-5 py-5 sm:px-7 lg:px-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300" />

            <div className="flex min-w-0 items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 via-white to-violet-100 text-sky-700 shadow-[0_16px_38px_rgba(14,165,233,0.16)] ring-1 ring-white">
                  <KanbanSquare className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 rounded-full bg-emerald-400 ring-4 ring-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
                    {t("crm.shell.badge")}
                  </p>

                  <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                    {t("crm.shell.title")}
                  </h1>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {t("crm.shell.subtitle")}
                  </p>
                </div>
              </div>
            </div>

          <nav className="border-t border-slate-100/80 bg-white/90 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {crmTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex min-w-[190px] items-center gap-3 rounded-3xl border px-4 py-3 text-start transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2",
                        isActive
                          ? "border-sky-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 text-slate-800 shadow-[0_14px_34px_rgba(14,165,233,0.13)]"
                          : "border-slate-100 bg-slate-50/70 text-slate-600 hover:border-sky-100 hover:bg-sky-50/70 hover:text-slate-800",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={[
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200",
                            isActive
                              ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                              : "bg-white text-slate-500 group-hover:text-sky-700",
                          ].join(" ")}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <p
                              className={[
                                "truncate text-sm font-black leading-5 tracking-tight",
                                isActive
                                  ? "text-slate-800"
                                  : "text-slate-700",
                              ].join(" ")}
                            >
                              {t(tab.labelKey)}
                            </p>

                            {tab.badgeKey && (
                              <span
                                className={[
                                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
                                  isActive
                                    ? "bg-violet-100 text-violet-700"
                                    : "bg-violet-50 text-violet-700",
                                ].join(" ")}
                              >
                                {t(tab.badgeKey)}
                              </span>
                            )}
                          </div>

                          <p
                            className={[
                              "mt-0.5 truncate text-xs font-bold leading-4",
                              isActive ? "text-sky-600" : "text-slate-400",
                            ].join(" ")}
                          >
                            {t(tab.descriptionKey)}
                          </p>
                        </div>

                        {isActive && (
                          <span className="absolute inset-x-6 -bottom-[17px] h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </header>

        <main className="w-full min-w-0">
          <div className="overflow-visible rounded-[2.2rem] border border-white/80 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-white via-sky-50/40 to-violet-50/40 px-5 py-4 sm:px-6 lg:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                    <ActiveIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black tracking-tight text-slate-800">
                      {t(activeTabData.labelKey)}
                    </h2>

                    <p className="truncate text-sm font-semibold text-slate-500">
                      {t(activeTabData.descriptionKey)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-black text-emerald-700">
                    {t("crm.shell.crmActive")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 lg:p-7">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
