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
  BarChart3,
} from "lucide-react";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { workHoursQueryKey } from "../../../../hooks/useBusinessWorkHours";
import { isFeatureAccessible } from "../../../../utils/entitlementAccess";
import {
  SHOW_BUSINESS_MINI_SAAS,
  SHOW_CRM_PAYMENTS,
} from "./crmFeatureFlags";
import "./crmUi.css";
import "./crmDesign.css";

type CrmTab = {
  path: string;
  labelKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  badgeKey?: string;
  hidden?: boolean;
  requiresFeature?: string;
};

const removedTabPaths = new Set([
  "overview",
  "calendar",
  "follow-ups",
  "automations",
]);

/** Deep-link routes that exist under CRM but are not primary nav tabs. */
const allowedNonNavTabPaths = new Set(["work-hours"]);

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
    requiresFeature: "appointments",
  },
  {
    path: "services",
    labelKey: "crm.nav.services",
    descriptionKey: "crm.nav.servicesDesc",
    icon: Wrench,
    requiresFeature: "appointments",
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
    path: "reports",
    labelKey: "crm.nav.reports",
    descriptionKey: "crm.nav.reportsDesc",
    icon: BarChart3,
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
  const entitlements = user?.entitlements ?? null;
  const canAppointments = isFeatureAccessible(entitlements, "appointments");

  const visibleTabs = useMemo(
    () =>
      crmTabs.filter((tab) => {
        if (tab.hidden) return false;
        if (tab.requiresFeature === "appointments" && !canAppointments) {
          return false;
        }
        return true;
      }),
    [canAppointments]
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
      (tab) =>
        tab.path === currentTab &&
        (tab.hidden ||
          (tab.requiresFeature === "appointments" && !canAppointments))
    );
    const isUnknownTab =
      !isKnownVisibleTab && !allowedNonNavTabPaths.has(currentTab);

    if (!isCrmRoot && !isRemovedTab && !isHiddenTab && !isUnknownTab) return;

    const basePath = isCrmRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/leads`, { replace: true });
  }, [canAppointments, currentTab, isKnownVisibleTab, location.pathname, navigate]);

  useEffect(() => {
    if (!businessId) return;

    if (canAppointments) {
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
    }

    queryClient.prefetchQuery({
      queryKey: ["crmClients", businessId],
      queryFn: async () =>
        (await API.get(`/crm-clients/${businessId}`)).data,
    });
  }, [queryClient, businessId, canAppointments]);

  return (
    <section
      dir={dir}
      className="crm-surface crm-app min-h-[calc(100vh-72px)] px-3 py-3 text-start sm:px-5 sm:py-4 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="crm-shell">
          <div className="crm-shell-top">
            <div className="min-w-0">
              <p className="crm-kicker">{t("crm.shell.badge")}</p>
              <h1 className="crm-shell-title">{t("crm.shell.title")}</h1>
              <p className="crm-shell-sub">{t("crm.shell.subtitle")}</p>
            </div>

            <div className="crm-live">
              <span className="crm-live-dot" />
              <span>{t("crm.shell.crmActive")}</span>
            </div>
          </div>

          <nav aria-label={t("crm.shell.title")} className="crm-tabs">
            <div className="crm-tabs-row">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    data-demo-target={`crm-nav-${tab.path}`}
                    className={({ isActive }) =>
                      `crm-tab${isActive ? " is-active" : ""}`
                    }
                  >
                    <Icon />
                    <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
                    {tab.badgeKey && (
                      <span className="crm-tab-badge">{t(tab.badgeKey)}</span>
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
