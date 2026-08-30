import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CircleUserRound,
  Handshake,
  Sparkles,
  PencilLine,
  UserRound,
  CreditCard,
  HelpCircle,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  Workflow,
} from "lucide-react";
import { getTextDirection } from "../i18n/localeUtils";
import { useAuth } from "../context/AuthContext";
import {
  isModuleEnabled,
  normalizeEnabledModules,
} from "../utils/moduleAccess";
import { normalizeBusinessId } from "../utils/notificationNavigation";

/* =========================
   Types
========================= */

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type BusinessWorkspaceNavProps = {
  onNavigate?: () => void;
  t?: TFunction;
  collapsed?: boolean;
};

type NavItemProps = {
  label: string;
  to: string;
  icon: React.ElementType;
  exact?: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
  demoTarget?: string | null;
};

type NavItemConfig = {
  labelKey: string;
  fallback: string;
  to: string;
  icon: React.ElementType;
  exact?: boolean;
  moduleKey?: string | null;
  demoTarget?: string | null;
};

/* =========================
   Restricted Nav Allowlist
========================= */

/**
 * Nav entries limited to the businesses listed below.
 * These are Business `_id` values, matched against the resolved `user.businessId`.
 *
 * - 6a452720016d081ad1d6e328 — Managed-host / early WhatsApp pilot
 * - 6a1c7b9c17abeea4a444f6fa — bdika (private WhatsApp Embedded Signup enabled)
 * - 6a8df4e95c704a03773a9966 — Invistimo Support workspace (regular business, full product)
 */
const RESTRICTED_NAV_ALLOWED_BUSINESS_IDS = new Set([
  "6a452720016d081ad1d6e328",
  "6a1c7b9c17abeea4a444f6fa",
  "6a8df4e95c704a03773a9966",
]);

/** Allowlist only: an unresolved or unlisted business never sees the entries. */
function canSeeRestrictedNav(businessId: unknown): boolean {
  const normalized = normalizeBusinessId(businessId);
  if (!normalized) return false;
  return RESTRICTED_NAV_ALLOWED_BUSINESS_IDS.has(normalized);
}

/* =========================
   Fallback Translation
========================= */

function translate(t: TFunction, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

/* =========================
   Nav Item
========================= */

function NavItem({
  label,
  to,
  icon: Icon,
  exact = false,
  onNavigate,
  collapsed = false,
  demoTarget = null,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-label={label}
      data-demo-target={demoTarget || undefined}
      className={({ isActive }) =>
        `
          group relative flex items-center rounded-md transition-all duration-200
          ${
            collapsed
              ? "mx-auto h-11 w-11 justify-center"
              : "h-11 gap-3 px-3"
          }
          text-[13.5px] font-medium tracking-[-0.01em]
          ${
            isActive
              ? `
                  border border-violet-200/70 bg-gradient-to-r
                  from-violet-100/90 via-sky-100/80 to-cyan-100/70
                  text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_14px_rgba(99,102,241,0.08)]
                `
              : `
                  border border-transparent text-slate-600
                  hover:border-violet-100/80 hover:bg-white/55 hover:text-slate-800
                `
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span
              aria-hidden
              className="
                absolute inset-y-1.5 start-0 w-[3px] rounded-full
                bg-gradient-to-b from-violet-400 via-sky-400 to-cyan-400
              "
            />
          )}

          <Icon
            size={19}
            strokeWidth={isActive ? 2.25 : 2}
            className={`
              shrink-0 transition-colors
              ${
                isActive
                  ? "text-violet-600"
                  : "text-slate-400 group-hover:text-sky-600"
              }
            `}
          />

          {!collapsed && (
            <span className="min-w-0 flex-1 truncate text-start">{label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* =========================
   Component
========================= */

export default function BusinessWorkspaceNav({
  onNavigate,
  t: tProp,
  collapsed = false,
}: BusinessWorkspaceNavProps) {
  const { businessId } = useParams<{ businessId: string }>();
  const { t: tI18n, i18n } = useTranslation();
  const { user } = useAuth() as {
    user?: {
      enabledModules?: string[] | null;
      email?: string | null;
      _id?: string | null;
      id?: string | null;
      userId?: string | null;
      businessId?: string | null;
      isGuidedDemo?: boolean;
    } | null;
  };
  const t = tProp || ((key: string) => tI18n(key));
  const dir = getTextDirection(i18n.language);
  const enabledModules = normalizeEnabledModules(user?.enabledModules);
  // Full business-system surface (monthly/yearly/etc.) — not CRM-only.
  // CRM alone must not unlock website upsell or public-profile chrome.
  const hasFullBusinessSurface =
    !enabledModules ||
    isModuleEnabled(enabledModules, "automations") ||
    isModuleEnabled(enabledModules, "collab") ||
    isModuleEnabled(enabledModules, "BizUply") ||
    isModuleEnabled(enabledModules, "build") ||
    isModuleEnabled(enabledModules, "website");
  // Website Builder upsell: business-plan users without the website module.
  const showWebsiteUpsell =
    Boolean(enabledModules) &&
    hasFullBusinessSurface &&
    (isModuleEnabled(enabledModules, "automations") ||
      isModuleEnabled(enabledModules, "collab") ||
      isModuleEnabled(enabledModules, "BizUply") ||
      isModuleEnabled(enabledModules, "build")) &&
    !isModuleEnabled(enabledModules, "website");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  // The signed-in business wins over the URL so a tenant cannot reveal the entry
  // by visiting another business path; the URL is only a fallback for admins,
  // who carry no businessId of their own.
  const showRestrictedNav =
    (canSeeRestrictedNav(user?.businessId || businessId) ||
      Boolean(user?.isShowcaseDemo)) &&
    !Boolean(user?.isGuidedDemo);

  const items: NavItemConfig[] = [
    {
      labelKey: "businessNav.dashboard",
      fallback: "Dashboard",
      to: `${basePath}/dashboard/dashboard`,
      icon: LayoutDashboard,
      moduleKey: "dashboard",
      demoTarget: "nav-dashboard",
    },
    {
      labelKey: "businessNav.crmSystem",
      fallback: "CRM System",
      to: `${basePath}/dashboard/crm`,
      icon: CircleUserRound,
      moduleKey: "crm",
      demoTarget: "nav-crm",
    },
    {
      labelKey: "businessNav.automations",
      fallback: "Automations",
      to: `${basePath}/dashboard/automations`,
      icon: Workflow,
      moduleKey: "automations",
      demoTarget: "nav-automations",
    },
    {
      labelKey: "businessNav.whatsapp",
      fallback: "WhatsApp Messages",
      to: `${basePath}/dashboard/whatsapp`,
      icon: MessageCircle,
      moduleKey: showRestrictedNav ? "whatsapp" : "__hidden__",
      demoTarget: "nav-whatsapp",
    },
    {
      labelKey: "businessNav.metaCampaigns",
      fallback: "Meta Campaigns",
      to: `${basePath}/dashboard/meta-campaigns`,
      icon: Megaphone,
      moduleKey: showRestrictedNav ? "meta-campaigns" : "__hidden__",
    },
    {
      labelKey: "businessNav.collaborations",
      fallback: "Collaborations",
      to: `${basePath}/dashboard/collab`,
      icon: Handshake,
      moduleKey: "collab",
      demoTarget: "nav-collab",
    },
    {
      labelKey: "businessNav.bizuplyAdvisor",
      fallback: "Business Advisor",
      to: `${basePath}/dashboard/BizUply`,
      icon: Sparkles,
      moduleKey: "BizUply",
      demoTarget: "nav-advisor",
    },
    {
      labelKey: "businessNav.editBusinessPage",
      fallback: "Edit Business Page",
      to: `${basePath}/dashboard/build`,
      icon: PencilLine,
      moduleKey: "build",
      demoTarget: "nav-build",
    },
    {
      labelKey: "businessNav.viewPublicProfile",
      fallback: "View Public Profile",
      to: basePath,
      icon: UserRound,
      exact: true,
      // Hide for CRM-only / marketer ACL without website or business profile surface.
      moduleKey:
        enabledModules && !hasFullBusinessSurface ? "__hidden__" : null,
    },
    {
      labelKey: "businessNav.buildWebsite",
      fallback: "Build Website",
      to: `${basePath}/dashboard/website`,
      icon: LayoutTemplate,
      moduleKey: "website",
      demoTarget: "nav-website",
    },
    {
      labelKey: "businessNav.billing",
      fallback: "Billing & Subscription",
      to: `${basePath}/dashboard/billing`,
      icon: CreditCard,
      moduleKey: "billing",
    },
    {
      labelKey: "businessNav.helpCenter",
      fallback: "Help Center",
      to: `${basePath}/dashboard/help-center`,
      icon: HelpCircle,
      moduleKey: null,
    },
  ];

  const visibleItems = items.filter((item) => {
    if (!item.moduleKey) return true;
    if (item.moduleKey === "__hidden__") return false;
    if (item.moduleKey === "billing" && user?.isGuidedDemo) return false;
    if (item.labelKey === "businessNav.viewPublicProfile" && user?.isGuidedDemo) {
      return false;
    }
    if (
      user?.isGuidedDemo &&
      (item.moduleKey === "whatsapp" || item.moduleKey === "meta-campaigns")
    ) {
      return false;
    }
    if (item.moduleKey === "website" && showWebsiteUpsell) return true;
    if (
      user?.isShowcaseDemo &&
      (item.moduleKey === "whatsapp" || item.moduleKey === "meta-campaigns")
    ) {
      return true;
    }
    return isModuleEnabled(enabledModules, item.moduleKey);
  });

  return (
    <nav
      dir={dir}
      aria-label={translate(
        t,
        "businessNav.ariaLabel",
        "Business workspace navigation"
      )}
      className="flex flex-col overflow-hidden text-start"
    >
      <div
        className={`space-y-0.5 overflow-hidden ${collapsed ? "px-1.5 py-1" : "px-2 py-1"}`}
      >
        {visibleItems.map((item) => (
          <NavItem
            key={item.to}
            label={translate(t, item.labelKey, item.fallback)}
            to={item.to}
            icon={item.icon}
            exact={item.exact}
            onNavigate={onNavigate}
            collapsed={collapsed}
            demoTarget={item.demoTarget || null}
          />
        ))}
      </div>
    </nav>
  );
}
