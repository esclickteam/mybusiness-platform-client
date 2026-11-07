import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CircleUserRound,
  Handshake,
  Globe2,
  Sparkles,
  PencilLine,
  UserRound,
  CreditCard,
  HelpCircle,
  LayoutTemplate,
  AppWindow,
  Megaphone,
  MessageCircle,
  Workflow,
  PlugZap,
  Code2,
  LineChart,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { getTextDirection } from "../i18n/localeUtils";
import { useAuth } from "../context/AuthContext";
import {
  isAutomationsAccessible,
  isModuleEnabled,
  isWhatsappOnlyPackage,
  normalizeEnabledModules,
  SHOW_GLOBAL_BUSINESS_CLUB_NAV,
} from "../utils/moduleAccess";
import {
  hasWhatsAppApiProduct,
  homePathForProduct,
  isWhatsAppApiPortalUser,
  WHATSAPP_API_DOCS_URL,
  WHATSAPP_API_HELP_URL,
} from "../utils/whatsappApiPortal";
import { normalizeBusinessId } from "../utils/notificationNavigation";

const PRODUCT_LABELS: Record<string, { labelKey: string; fallback: string }> = {
  business: { labelKey: "businessNav.products.business", fallback: "Business" },
  crm: { labelKey: "businessNav.products.crm", fallback: "CRM" },
  website: { labelKey: "businessNav.products.website", fallback: "Website" },
  whatsapp_api: {
    labelKey: "businessNav.products.whatsappApi",
    fallback: "WhatsApp API",
  },
};

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
  href?: string;
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
  /** External destination opened in a new tab instead of `to`. */
  href?: string;
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
export function canSeeRestrictedNav(businessId: unknown): boolean {
  const normalized = normalizeBusinessId(businessId);
  if (!normalized) return false;
  return RESTRICTED_NAV_ALLOWED_BUSINESS_IDS.has(normalized);
}

function workspaceGroup(moduleKey?: string | null) {
  if (!moduleKey || moduleKey === "dashboard") return "overview";
  if (moduleKey === "crm" || moduleKey === "automations" || moduleKey === "integrations") {
    return "crm";
  }
  if (moduleKey === "whatsapp" || moduleKey === "meta-campaigns") return "channels";
  if (moduleKey === "billing" || moduleKey === "help-center") return "account";
  return "work";
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
  href,
  icon: Icon,
  exact = false,
  onNavigate,
  collapsed = false,
  demoTarget = null,
}: NavItemProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        aria-label={label}
        className={`
          group relative flex items-center rounded-none border border-transparent transition-all duration-200
          ${collapsed ? "mx-auto h-11 w-11 justify-center" : "h-11 gap-3 px-3"}
          text-[13.5px] font-medium tracking-[-0.01em] text-white/80
          hover:border-white/15 hover:bg-white/10 hover:text-white
        `}
      >
        <Icon
          size={19}
          strokeWidth={2}
          className="shrink-0 text-white/70 transition-colors group-hover:text-white"
        />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-start">{label}</span>
            <ExternalLink size={13} className="shrink-0 text-slate-300" aria-hidden />
          </>
        )}
      </a>
    );
  }

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
          group relative flex items-center rounded-none transition-all duration-200
          ${
            collapsed
              ? "mx-auto h-10 w-10 justify-center"
              : "h-10 gap-2.5 px-2.5"
          }
          text-[13.5px] font-medium tracking-[-0.01em]
          ${
            isActive
              ? `
                  border border-white bg-white
                  text-[#21172F]
                `
              : `
                  border border-transparent text-white/80
                  hover:border-white/15 hover:bg-white/10 hover:text-white
                `
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={19}
            strokeWidth={isActive ? 2.25 : 2}
            className={`
              shrink-0 transition-colors
              ${
                isActive
                  ? "text-[#5B21B6]"
                  : "text-white/70 group-hover:text-white"
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
      automationsAccessible?: boolean;
      email?: string | null;
      _id?: string | null;
      id?: string | null;
      userId?: string | null;
      businessId?: string | null;
      isGuidedDemo?: boolean;
      isShowcaseDemo?: boolean;
      role?: string | null;
      accountKind?: string | null;
      subscriptionPlan?: string | null;
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
  // A limited package that explicitly includes WhatsApp (or campaigns) must
  // see that entry even when the business is outside the pilot allowlist.
  const explicitlyEnabled = (moduleKey: string) =>
    Boolean(enabledModules) && isModuleEnabled(enabledModules, moduleKey);
  const hideGlobalClub = isWhatsappOnlyPackage(enabledModules);
  const accountKind = user?.accountKind || "bizuply";

  const items: NavItemConfig[] = [
    {
      labelKey: "businessNav.mySaas",
      fallback: "המערכות שלי — My SaaS Systems",
      to: `${basePath}/dashboard/saas`,
      icon: AppWindow,
      moduleKey: accountKind === "bizuply" ? "__hidden__" : "saas",
      demoTarget: "nav-saas",
    },
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
      exact: true,
      demoTarget: "nav-automations",
    },
    {
      labelKey: hasWhatsAppApiProduct(user)
        ? "whatsappApiPortal.nav.overview"
        : "businessNav.whatsapp",
      fallback: hasWhatsAppApiProduct(user) ? "WhatsApp API" : "WhatsApp Messages",
      to: hasWhatsAppApiProduct(user)
        ? `${basePath}/dashboard/whatsapp/overview`
        : `${basePath}/dashboard/whatsapp`,
      icon: MessageCircle,
      moduleKey:
        showRestrictedNav ||
        user?.isGuidedDemo ||
        explicitlyEnabled("whatsapp") ||
        hasWhatsAppApiProduct(user)
          ? "whatsapp"
          : "__hidden__",
      demoTarget: "nav-whatsapp",
    },
    {
      labelKey: "businessNav.metaCampaigns",
      fallback: "Meta Campaigns",
      to: `${basePath}/dashboard/meta-campaigns`,
      icon: Megaphone,
      moduleKey:
        showRestrictedNav ||
        user?.isGuidedDemo ||
        explicitlyEnabled("meta-campaigns")
          ? "meta-campaigns"
          : "__hidden__",
      demoTarget: "nav-meta-campaigns",
    },
    {
      labelKey: "businessNav.saasBridge",
      fallback: "SaaS systems",
      to: `${basePath}/dashboard/saas-bridge`,
      icon: Workflow,
      moduleKey: "saas",
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
      labelKey: "businessNav.globalBusinessClub",
      fallback: "Global Business Club",
      to: `${basePath}/dashboard/global-club`,
      icon: Globe2,
      moduleKey:
        SHOW_GLOBAL_BUSINESS_CLUB_NAV && !hideGlobalClub ? null : "__hidden__",
      demoTarget: "nav-global-club",
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
      labelKey: "businessNav.aiStudio",
      fallback: "AI Studio",
      to: `${basePath}/dashboard/ai-studio`,
      icon: AppWindow,
      moduleKey: "ai-studio",
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

  const whatsappBase = `${basePath}/dashboard/whatsapp`;
  const apiPortalItems: NavItemConfig[] = [
    {
      labelKey: "whatsappApiPortal.nav.overview",
      fallback: "Overview & setup",
      to: `${whatsappBase}/overview`,
      icon: LayoutDashboard,
    },
    {
      labelKey: "whatsappApiPortal.nav.connection",
      fallback: "Connection",
      to: `${whatsappBase}/connection`,
      icon: PlugZap,
    },
    {
      labelKey: "whatsappApiPortal.nav.developers",
      fallback: "API & webhooks",
      to: `${whatsappBase}/developers`,
      icon: Code2,
    },
    {
      labelKey: "whatsappApiPortal.nav.templates",
      fallback: "Templates",
      to: `${whatsappBase}/templates`,
      icon: MessageCircle,
    },
    {
      labelKey: "whatsappApiPortal.nav.analytics",
      fallback: "Analytics",
      to: `${whatsappBase}/performance`,
      icon: LineChart,
    },
    {
      labelKey: "whatsappApiPortal.nav.billing",
      fallback: "Billing & subscription",
      to: `${whatsappBase}/billing`,
      icon: CreditCard,
    },
    {
      labelKey: "businessNav.helpCenter",
      fallback: "Help Center",
      to: `${basePath}/dashboard/help-center`,
      icon: HelpCircle,
    },
    {
      labelKey: "whatsappApiPortal.nav.docs",
      fallback: "Documentation",
      to: WHATSAPP_API_DOCS_URL,
      href: WHATSAPP_API_DOCS_URL,
      icon: BookOpen,
    },
    {
      labelKey: "whatsappApiPortal.nav.support",
      fallback: "Help & support",
      to: WHATSAPP_API_HELP_URL,
      href: WHATSAPP_API_HELP_URL,
      icon: HelpCircle,
    },
  ];

  const activeProducts = Array.isArray(user?.activeProducts)
    ? user.activeProducts
        .map((p: { key?: string } | string) =>
          p && typeof p === "object" ? String(p.key || "") : String(p || "")
        )
        .filter(Boolean)
    : [];
  const showProductSwitcher = !isWhatsAppApiPortalUser(user) && activeProducts.length > 1;

  const visibleItems = isWhatsAppApiPortalUser(user) ? apiPortalItems : items.filter((item) => {
    if (accountKind === "saas_only") {
      return item.moduleKey === "saas" || item.labelKey === "businessNav.helpCenter";
    }
    if (item.moduleKey === "saas") {
      return accountKind === "bizuply_saas";
    }
    if (!item.moduleKey) {
      if (
        user?.isGuidedDemo &&
        (item.labelKey === "businessNav.globalBusinessClub" ||
          item.labelKey === "businessNav.viewPublicProfile")
      ) {
        return false;
      }
      return true;
    }
    if (item.moduleKey === "__hidden__") return false;
    if (item.moduleKey === "billing" && user?.isGuidedDemo) return false;
    if (
      user?.isGuidedDemo &&
      (item.moduleKey === "whatsapp" || item.moduleKey === "meta-campaigns")
    ) {
      return isModuleEnabled(enabledModules, item.moduleKey);
    }
    if (
      (item.moduleKey === "automations" || item.moduleKey === "integrations") &&
      !isAutomationsAccessible(enabledModules, user?.automationsAccessible)
    ) {
      return false;
    }
    if (item.moduleKey === "website" && showWebsiteUpsell && !user?.isGuidedDemo) return true;
    if (item.moduleKey === "ai-studio") {
      return isModuleEnabled(enabledModules, "website")
        || isModuleEnabled(enabledModules, "crm")
        || isModuleEnabled(enabledModules, "automations");
    }
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
      {showProductSwitcher && businessId ? (
        <div
          className={`border-b border-white/10 ${collapsed ? "px-1.5 py-2" : "px-2 py-2"}`}
        >
          {!collapsed ? (
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-white/45">
              {translate(t, "businessNav.products.title", "Your products")}
            </p>
          ) : null}
          <div className="space-y-0.5">
            {activeProducts.map((key) => {
              const meta = PRODUCT_LABELS[key] || {
                labelKey: `businessNav.products.${key}`,
                fallback: key,
              };
              return (
                <NavItem
                  key={`product-${key}`}
                  label={translate(t, meta.labelKey, meta.fallback)}
                  to={homePathForProduct(businessId, key)}
                  icon={key === "whatsapp_api" ? MessageCircle : LayoutDashboard}
                  exact={false}
                  onNavigate={onNavigate}
                  collapsed={collapsed}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      <div
        className={`space-y-0.5 overflow-hidden ${collapsed ? "px-1.5 py-1" : "px-2 py-1"}`}
      >
        {visibleItems.map((item, index) => {
          const group = workspaceGroup(item.moduleKey);
          const previous = index > 0 ? workspaceGroup(visibleItems[index - 1].moduleKey) : "";
          const showGroup = !collapsed && group !== previous;
          return (
            <React.Fragment key={item.to || item.href || item.labelKey}>
              {showGroup ? (
                <p className="px-2.5 pb-0.5 pt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/55">
                  {translate(t, `businessNav.groups.${group}`, group)}
                </p>
              ) : null}
              <NavItem
                label={translate(t, item.labelKey, item.fallback)}
                to={item.to}
                href={item.href}
                icon={item.icon}
                exact={item.exact}
                onNavigate={onNavigate}
                collapsed={collapsed}
                demoTarget={item.demoTarget || null}
              />
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
