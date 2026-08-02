import React, { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CreditCard,
  Flame,
  History,
  Settings,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { workHoursQueryKey } from "../../../../hooks/useBusinessWorkHours";
import {
  SHOW_BUSINESS_MINI_SAAS,
  SHOW_CRM_PAYMENTS,
} from "./crmFeatureFlags";

type CrmTab = {
  path: string;
  labelKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  badgeKey?: string;
  hidden?: boolean;
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
    path: "old-leads",
    labelKey: "crm.nav.oldLeads",
    descriptionKey: "crm.nav.oldLeadsDesc",
    icon: History,
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
    // Keep Payments in the catalog; hide from business UI for now.
    hidden: !SHOW_CRM_PAYMENTS,
  },
  {
    path: "mini-saas",
    labelKey: "crm.nav.miniSaas",
    descriptionKey: "crm.nav.miniSaasDesc",
    icon: Sparkles,
    badgeKey: "crm.nav.newBadge",
    // Keep Mini SaaS in the catalog; hide from business UI for now.
    hidden: !SHOW_BUSINESS_MINI_SAAS,
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

  const visibleTabs = useMemo(
    () => crmTabs.filter((tab) => !tab.hidden),
    []
  );

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "leads";
  }, [location.pathname]);

  const isKnownVisibleTab = useMemo(() => {
    return visibleTabs.some((tab) => tab.path === currentTab);
  }, [currentTab, visibleTabs]);

  const activeTabData = useMemo(() => {
    return (
      visibleTabs.find((tab) => tab.path === currentTab) || visibleTabs[0]
    );
  }, [currentTab, visibleTabs]);

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];

    const isCrmRoot = lastPart === "crm";
    const isRemovedTab = removedTabPaths.has(currentTab);
    const isHiddenTab = crmTabs.some(
      (tab) => tab.path === currentTab && tab.hidden
    );
    const isUnknownTab = !isKnownVisibleTab;

    if (!isCrmRoot && !isRemovedTab && !isHiddenTab && !isUnknownTab) return;

    const basePath = isCrmRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/leads`, { replace: true });
  }, [currentTab, isKnownVisibleTab, location.pathname, navigate]);

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

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6D28D9]">
                {t("crm.shell.badge")}
              </p>
              <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {t("crm.shell.title")}
              </h1>
              <p className="mt-0.5 hidden text-sm font-semibold text-slate-500 sm:block">
                {t("crm.shell.subtitle")}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-emerald-700">
                {t("crm.shell.crmActive")}
              </span>
            </div>
          </div>

          <nav
            aria-label={t("crm.shell.title")}
            className="border-t border-slate-100 px-2 sm:px-3"
          >
            <div
              className={[
                "flex items-stretch gap-0.5 overflow-x-auto",
                "[scrollbar-width:none] [-ms-overflow-style:none]",
                "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent",
              ].join(" ")}
            >
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-black transition-colors",
                        "focus:outline-none focus-visible:bg-violet-50",
                        isActive
                          ? "text-[#6D28D9]"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={[
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-[#6D28D9]"
                              : "text-slate-400 group-hover:text-slate-600",
                          ].join(" ")}
                        />
                        <span className="whitespace-nowrap">
                          {t(tab.labelKey)}
                        </span>
                        {tab.badgeKey && (
                          <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#6D28D9]">
                            {t(tab.badgeKey)}
                          </span>
                        )}
                        <span
                          className={[
                            "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
                            isActive
                              ? "bg-[#6D28D9] opacity-100"
                              : "opacity-0",
                          ].join(" ")}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </header>

        <main className="w-full min-w-0">
          <Outlet context={{ activeTab: activeTabData }} />
        </main>
      </div>
    </section>
  );
}
