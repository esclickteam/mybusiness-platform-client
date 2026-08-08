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
  Plug,
} from "lucide-react";
import { getTextDirection } from "../i18n/localeUtils";
import { useAuth } from "../context/AuthContext";
import { isBizuplyTestUser } from "../utils/bizuplyTestUser";
import {
  isModuleEnabled,
  resolveDashboardModules,
} from "../utils/moduleAccess";

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
};

type NavItemConfig = {
  labelKey: string;
  fallback: string;
  to: string;
  icon: React.ElementType;
  exact?: boolean;
  moduleKey?: string | null;
};

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
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-label={label}
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
      entitlements?: Record<string, unknown> | null;
      planLimited?: boolean;
      email?: string | null;
      _id?: string | null;
      id?: string | null;
      userId?: string | null;
    } | null;
  };
  const t = tProp || ((key: string) => tI18n(key));
  const dir = getTextDirection(i18n.language);
  const enabledModules = resolveDashboardModules(user);
  const showWhatsappAndMeta = isBizuplyTestUser(user);

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const items: NavItemConfig[] = [
    {
      labelKey: "businessNav.dashboard",
      fallback: "Dashboard",
      to: `${basePath}/dashboard/dashboard`,
      icon: LayoutDashboard,
      moduleKey: "dashboard",
    },
    {
      labelKey: "businessNav.crmSystem",
      fallback: "CRM System",
      to: `${basePath}/dashboard/crm`,
      icon: CircleUserRound,
      moduleKey: "crm",
    },
    {
      labelKey: "businessNav.automations",
      fallback: "Automations",
      to: `${basePath}/dashboard/automations`,
      icon: Workflow,
      moduleKey: "automations",
    },
    {
      labelKey: "businessNav.integrations",
      fallback: "אינטגרציות",
      to: `${basePath}/dashboard/integrations`,
      icon: Plug,
      moduleKey: "automations",
    },
    ...(showWhatsappAndMeta
      ? ([
          {
            labelKey: "businessNav.whatsapp",
            fallback: "WhatsApp Messages",
            to: `${basePath}/dashboard/whatsapp`,
            icon: MessageCircle,
            moduleKey: "whatsapp",
          },
          {
            labelKey: "businessNav.metaCampaigns",
            fallback: "Meta Campaigns",
            to: `${basePath}/dashboard/meta-campaigns`,
            icon: Megaphone,
            moduleKey: "meta-campaigns",
          },
        ] as NavItemConfig[])
      : []),
    {
      labelKey: "businessNav.collaborations",
      fallback: "Collaborations",
      to: `${basePath}/dashboard/collab`,
      icon: Handshake,
      moduleKey: "collab",
    },
    {
      labelKey: "businessNav.bizuplyAdvisor",
      fallback: "Business Advisor",
      to: `${basePath}/dashboard/BizUply`,
      icon: Sparkles,
      moduleKey: "BizUply",
    },
    {
      labelKey: "businessNav.editBusinessPage",
      fallback: "Edit Business Page",
      to: `${basePath}/dashboard/build`,
      icon: PencilLine,
      moduleKey: "build",
    },
    {
      labelKey: "businessNav.viewPublicProfile",
      fallback: "View Public Profile",
      to: basePath,
      icon: UserRound,
      exact: true,
      // Hide public profile for limited marketer-client accounts
      moduleKey: enabledModules ? "__hidden__" : null,
    },
    {
      labelKey: "businessNav.buildWebsite",
      fallback: "Build Website",
      to: `${basePath}/dashboard/website`,
      icon: LayoutTemplate,
      moduleKey: "website",
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
      moduleKey: enabledModules ? "__hidden__" : null,
    },
  ];

  const visibleItems = items.filter((item) => {
    if (!item.moduleKey) return true;
    if (item.moduleKey === "__hidden__") return false;
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
          />
        ))}
      </div>
    </nav>
  );
}
