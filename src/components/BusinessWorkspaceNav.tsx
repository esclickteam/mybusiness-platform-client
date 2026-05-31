import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  CircleUserRound,
  Handshake,
  Sparkles,
  PencilLine,
  UserRound,
  CreditCard,
  HelpCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

/* =========================
   Types
========================= */

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type BusinessWorkspaceNavProps = {
  messagesCount?: number;
  onNavigate?: () => void;
  t?: TFunction;
  workspaceName?: string;
};

type NavItemProps = {
  label: string;
  to: string;
  icon: React.ElementType;
  badge?: number;
  exact?: boolean;
  onNavigate?: () => void;
};

type NavItemConfig = {
  labelKey: string;
  fallback: string;
  to: string;
  icon: React.ElementType;
  badge?: number;
  exact?: boolean;
};

/* =========================
   Fallback Translation
========================= */

const fallbackT: TFunction = (key) => {
  const dictionary: Record<string, string> = {
    "businessNav.dashboard": "Dashboard",
    "businessNav.customerMessages": "Customer Messages",
    "businessNav.crmSystem": "CRM System",
    "businessNav.collaborations": "Collaborations",
    "businessNav.bizuplyAdvisor": "BizUply Advisor",
    "businessNav.editBusinessPage": "Edit Business Page",
    "businessNav.viewPublicProfile": "View Public Profile",
    "businessNav.billing": "Billing & Subscription",
    "businessNav.helpCenter": "Help Center",

    "businessNav.upgradeTitle": "Upgrade to Bizuply Pro",
    "businessNav.upgradeText": "Unlock advanced analytics, AI automations and more.",
    "businessNav.upgradeButton": "Upgrade Now",

    "businessNav.workspaceLabel": "Workspace",
  };

  return dictionary[key] || key;
};

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
  badge = 0,
  exact = false,
  onNavigate,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onNavigate}
      className={({ isActive }) =>
        `
          group relative flex h-11 items-center gap-3 rounded-xl px-3
          text-[14px] font-bold transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)]"
              : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={2}
            className={`
              shrink-0 transition
              ${
                isActive
                  ? "text-white"
                  : "text-slate-500 group-hover:text-violet-700"
              }
            `}
          />

          <span className="min-w-0 flex-1 truncate">{label}</span>

          {badge > 0 && (
            <span
              className={`
                flex h-6 min-w-[24px] shrink-0 items-center justify-center
                rounded-full px-2 text-xs font-black
                ${
                  isActive
                    ? "bg-white text-violet-700"
                    : "bg-violet-600 text-white"
                }
              `}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* =========================
   Upgrade Card
========================= */

function UpgradeCard({ t }: { t: TFunction }) {
  return (
    <div
      className="
        relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br
        from-violet-500 via-purple-500 to-violet-600 p-4 text-white
        shadow-[0_18px_40px_rgba(124,58,237,0.24)]
      "
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-xl" />
      <div className="pointer-events-none absolute -bottom-10 left-4 h-28 w-28 rounded-full bg-white/10 blur-xl" />

      <div className="relative z-10">
        <h3 className="text-sm font-black">
          {translate(t, "businessNav.upgradeTitle", "Upgrade to Bizuply Pro")}
        </h3>

        <p className="mt-2 text-xs leading-5 text-white/85">
          {translate(
            t,
            "businessNav.upgradeText",
            "Unlock advanced analytics, AI automations and more."
          )}
        </p>

        <button
          type="button"
          className="
            mt-4 inline-flex w-full items-center justify-center gap-2
            rounded-xl bg-white px-4 py-3 text-sm font-black text-violet-700
            shadow-sm transition hover:bg-violet-50
          "
        >
          {translate(t, "businessNav.upgradeButton", "Upgrade Now")}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* =========================
   Workspace Card
========================= */

function WorkspaceCard({
  t,
  workspaceName,
}: {
  t: TFunction;
  workspaceName?: string;
}) {
  return (
    <div
      className="
        mt-6 flex items-center gap-3 rounded-2xl border border-slate-200
        bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <Sparkles size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-900">
          {workspaceName || "Bizuply"}
        </p>

        <p className="truncate text-xs font-medium text-slate-500">
          {translate(t, "businessNav.workspaceLabel", "Workspace")}
        </p>
      </div>

      <ChevronDown size={16} className="shrink-0 text-slate-400" />
    </div>
  );
}

/* =========================
   Component
========================= */

export default function BusinessWorkspaceNav({
  messagesCount = 0,
  onNavigate,
  t = fallbackT,
  workspaceName,
}: BusinessWorkspaceNavProps) {
  const { businessId } = useParams<{ businessId: string }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const items: NavItemConfig[] = [
    {
      labelKey: "businessNav.dashboard",
      fallback: "Dashboard",
      to: `${basePath}/dashboard/dashboard`,
      icon: LayoutDashboard,
    },
    {
      labelKey: "businessNav.customerMessages",
      fallback: "Customer Messages",
      to: `${basePath}/dashboard/messages`,
      icon: MessageSquare,
      badge: messagesCount,
    },
    {
      labelKey: "businessNav.crmSystem",
      fallback: "CRM System",
      to: `${basePath}/dashboard/crm`,
      icon: CircleUserRound,
    },
    {
      labelKey: "businessNav.collaborations",
      fallback: "Collaborations",
      to: `${basePath}/dashboard/collab`,
      icon: Handshake,
    },
    {
      labelKey: "businessNav.bizuplyAdvisor",
      fallback: "BizUply Advisor",
      to: `${basePath}/dashboard/BizUply`,
      icon: Sparkles,
    },
    {
      labelKey: "businessNav.editBusinessPage",
      fallback: "Edit Business Page",
      to: `${basePath}/dashboard/build`,
      icon: PencilLine,
    },
    {
      labelKey: "businessNav.viewPublicProfile",
      fallback: "View Public Profile",
      to: basePath,
      icon: UserRound,
      exact: true,
    },
    {
      labelKey: "businessNav.billing",
      fallback: "Billing & Subscription",
      to: `${basePath}/dashboard/billing`,
      icon: CreditCard,
    },
    {
      labelKey: "businessNav.helpCenter",
      fallback: "Help Center",
      to: `${basePath}/dashboard/help-center`,
      icon: HelpCircle,
    },
  ];

  return (
    <nav
      aria-label="Business workspace navigation"
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-1 pb-3">
        {items.map((item) => (
          <NavItem
            key={item.to}
            label={translate(t, item.labelKey, item.fallback)}
            to={item.to}
            icon={item.icon}
            badge={item.badge}
            exact={item.exact}
            onNavigate={onNavigate}
          />
        ))}

        <UpgradeCard t={t} />
      </div>

      <WorkspaceCard t={t} workspaceName={workspaceName} />
    </nav>
  );
}