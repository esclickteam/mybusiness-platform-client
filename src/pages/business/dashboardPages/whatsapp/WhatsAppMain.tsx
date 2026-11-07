import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import { toast } from "react-toastify";
import {
  Activity,
  BarChart3,
  Calculator,
  CalendarClock,
  Clock,
  Code2,
  LineChart,
  Inbox,
  Loader2,
  MessageCircle,
  MessagesSquare,
  PlugZap,
  RefreshCw,
  Settings2,
  Shield,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  getWhatsAppStatus,
  syncWhatsAppAccountHealth,
  type WhatsAppConnection,
} from "../../../../api/whatsappApi";
import GuidedDemoSandboxButton from "../../../../guidedDemo/GuidedDemoSandboxButton";
import { btnSecondary } from "../../../../styles/bizuplyUi";
import { connectionUxEquals } from "./connectionUx";
import {
  connectionReadyLabel,
  formatMessagingLimit,
  formatNameStatus,
  formatQualityRating,
  nameStatusBadgeClass,
  qualityBadgeClass,
  toneBadgeClass,
} from "./hubFormat";
import {
  isWhatsAppHubAllowedWhenDisconnected,
  pathSegmentsAfterWhatsapp,
  resolveWhatsAppHubRedirect,
  whatsappBasePath,
} from "./hubNavigation";
import WhatsAppTabSuspenseFallback from "./WhatsAppTabSuspenseFallback";
import { isWhatsAppApiPortalUser } from "../../../../utils/whatsappApiPortal";
import { isInvistimoAdminBusiness } from "../../../../utils/invistimoAdmin";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";
import "../bizModuleDesign.css";

type WhatsAppTab = {
  path: string;
  /** Where the tab NavLink should navigate (may differ from path for nested defaults). */
  to: string;
  labelKey: string;
  icon: React.ElementType;
  end?: boolean;
};

const MAIN_TABS: WhatsAppTab[] = [
  { path: "overview", to: "overview", labelKey: "whatsapp.nav.overview", icon: Activity },
  { path: "profile", to: "profile", labelKey: "whatsapp.nav.profile", icon: UserRound },
  {
    path: "templates",
    to: "templates",
    labelKey: "whatsapp.nav.templates",
    icon: MessageCircle,
  },
  // Link straight to the default child so we skip /messages → /messages/compose hop.
  {
    path: "messages",
    to: "messages/compose",
    labelKey: "whatsapp.nav.messages",
    icon: MessagesSquare,
  },
  {
    path: "performance",
    to: "performance/overview",
    labelKey: "whatsapp.nav.performance",
    icon: LineChart,
  },
  { path: "inbox", to: "inbox", labelKey: "whatsapp.nav.inbox", icon: Inbox },
  { path: "insights", to: "insights", labelKey: "whatsapp.nav.insights", icon: BarChart3 },
  {
    path: "developers",
    to: "developers",
    labelKey: "whatsapp.nav.developers",
    icon: Code2,
  },
  { path: "billing", to: "billing", labelKey: "whatsapp.nav.billing", icon: Wallet },
  {
    path: "meta-costs",
    to: "meta-costs",
    labelKey: "whatsapp.nav.metaCosts",
    icon: Calculator,
  },
];

const INVISTIMO_ONLY_TABS: WhatsAppTab[] = [
  {
    path: "automations",
    to: "automations",
    labelKey: "whatsapp.nav.automations",
    icon: CalendarClock,
  },
  {
    path: "contacts",
    to: "contacts",
    labelKey: "whatsapp.nav.contacts",
    icon: Users,
  },
  {
    path: "agents",
    to: "agents",
    labelKey: "whatsapp.nav.agents",
    icon: Shield,
  },
  {
    path: "scheduled",
    to: "scheduled",
    labelKey: "whatsapp.nav.scheduled",
    icon: Clock,
  },
];

function readWaBillingFlag(searchParams: URLSearchParams) {
  return (
    searchParams.get("waBilling") ||
    searchParams.get("whatsappBilling") ||
    null
  );
}

export type WhatsAppHubOutletContext = {
  businessId: string | null;
  connection: WhatsAppConnection | null;
  connectionLoading: boolean;
  refreshConnection: () => Promise<void>;
  syncWithMeta: () => Promise<void>;
  syncing: boolean;
};

export default function WhatsAppMain() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;
  const locale = getIntlLocale(i18n.language);

  const visualQa = useWhatsAppVisualQaOverride();
  const [connection, setConnection] = useState<WhatsAppConnection | null>(
    visualQa?.connection || null
  );
  const [connectionLoading, setConnectionLoading] = useState(!visualQa);
  const [syncing, setSyncing] = useState(false);
  const guidedDemo = Boolean(user?.isGuidedDemo);
  const apiPortal = isWhatsAppApiPortalUser(user);
  const invistimoHub = isInvistimoAdminBusiness(businessId);

  const pathAfterWhatsapp = useMemo(
    () => pathSegmentsAfterWhatsapp(location.pathname),
    [location.pathname]
  );

  const topSegment = pathAfterWhatsapp[0] || "overview";
  const isConnected = Boolean(connection?.connected);
  const hasLoadedConnectionRef = useRef(Boolean(visualQa?.connection));

  const visibleTabs = useMemo(() => {
    const base = guidedDemo
      ? MAIN_TABS.filter((tab) => tab.path !== "billing")
      : MAIN_TABS;
    const withInvistimo = invistimoHub
      ? [...base, ...INVISTIMO_ONLY_TABS]
      : base;
    if (connectionLoading) return withInvistimo;
    if (!isConnected) {
      return [
        ...withInvistimo,
        {
          path: "connection",
          to: "connection",
          labelKey: "whatsapp.nav.connection",
          icon: Settings2,
        },
      ];
    }
    return withInvistimo;
  }, [connectionLoading, isConnected, guidedDemo, invistimoHub]);

  useEffect(() => {
    const target = resolveWhatsAppHubRedirect(location.pathname, {
      invistimoHub,
    });
    if (target && target !== location.pathname.replace(/\/+$/, "")) {
      navigate(target, { replace: true });
    }
  }, [location.pathname, navigate, invistimoHub]);

  useEffect(() => {
    if (visualQa) return;
    if (connectionLoading) return;
    // Billing tab stays reachable disconnected so customers can open Meta
    // account settings before Embedded Signup finishes.
    if (guidedDemo && topSegment === "billing") {
      navigate(`${whatsappBasePath(location.pathname)}/overview`, {
        replace: true,
      });
      return;
    }
    if (
      !isConnected &&
      !isWhatsAppHubAllowedWhenDisconnected(topSegment, {
        invistimoHub,
        apiPortal,
      })
    ) {
      navigate(`${whatsappBasePath(location.pathname)}/connection${location.search}`, {
        replace: true,
      });
    }
  }, [
    visualQa,
    connectionLoading,
    isConnected,
    topSegment,
    location.pathname,
    location.search,
    navigate,
    guidedDemo,
    apiPortal,
    invistimoHub,
  ]);

  useEffect(() => {
    const flag = readWaBillingFlag(searchParams);
    if (!flag) return;
    const next = new URLSearchParams(searchParams);
    next.delete("waBilling");
    next.delete("whatsappBilling");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const refreshConnection = useCallback(async () => {
    if (visualQa?.connection) {
      setConnection(visualQa.connection);
      setConnectionLoading(false);
      hasLoadedConnectionRef.current = true;
      return;
    }
    if (!businessId) {
      setConnection(null);
      setConnectionLoading(false);
      return;
    }
    // Keep hub chrome mounted with existing data; only skeleton on first load.
    if (!hasLoadedConnectionRef.current) {
      setConnectionLoading(true);
    }
    try {
      if (!hasLoadedConnectionRef.current) {
        const cached = await getWhatsAppStatus(businessId, { cached: true });
        setConnection(cached);
        hasLoadedConnectionRef.current = true;
        setConnectionLoading(false);
      }
      const status = await getWhatsAppStatus(businessId);
      setConnection((prev) =>
        connectionUxEquals(prev, status) ? prev : status
      );
      hasLoadedConnectionRef.current = true;
    } catch {
      if (!hasLoadedConnectionRef.current) setConnection(null);
    } finally {
      setConnectionLoading(false);
    }
  }, [businessId, visualQa]);

  useEffect(() => {
    void refreshConnection();
  }, [refreshConnection]);

  const syncWithMeta = useCallback(async () => {
    if (!businessId) return;
    setSyncing(true);
    try {
      const result = await syncWhatsAppAccountHealth(businessId);
      if (result?.connection) setConnection(result.connection);
      else await refreshConnection();
      toast.success(t("whatsapp.hub.syncSuccess"));
    } catch {
      toast.error(t("whatsapp.hub.syncError"));
    } finally {
      setSyncing(false);
    }
  }, [businessId, refreshConnection, t]);

  const ready = connectionReadyLabel(
    Boolean(connection?.connected),
    connection?.readyToSend,
    connection?.readiness,
    t
  );
  const qualityLabel = formatQualityRating(connection?.qualityRating, t);
  const nameStatusLabel = formatNameStatus(
    connection?.nameStatusDisplay || connection?.nameStatus,
    t
  );
  const limitLabel = formatMessagingLimit(connection?.messagingLimitTier, t);
  const displayName =
    connection?.verifiedName ||
    connection?.wabaName ||
    t("whatsapp.hub.unnamed");
  const lastSync = connection?.lastMetaSyncAt
    ? new Date(connection.lastMetaSyncAt).toLocaleString(locale)
    : null;
  const showConnectionPlaceholder = connectionLoading && !connection;

  const outletContext = useMemo<WhatsAppHubOutletContext>(
    () => ({
      businessId,
      connection,
      connectionLoading,
      refreshConnection,
      syncWithMeta,
      syncing,
    }),
    [
      businessId,
      connection,
      connectionLoading,
      refreshConnection,
      syncWithMeta,
      syncing,
    ]
  );

  return (
    <section
      dir={getTextDirection(i18n.language)}
      className="biz-module min-h-[calc(100vh-72px)] px-3 py-3 text-start sm:px-4 sm:py-4 lg:px-5"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="biz-shell">
          <div className="biz-shell-top">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="biz-mark">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg">
                    {showConnectionPlaceholder
                      ? "…"
                      : connection?.connected
                        ? displayName
                        : t("whatsapp.viaMeta.title")}
                  </h1>
                  <span
                    className="truncate text-sm font-semibold text-slate-500"
                    dir="ltr"
                  >
                    {showConnectionPlaceholder
                      ? ""
                      : connection?.displayPhoneNumber ||
                        t("whatsapp.hub.noPhone")}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${toneBadgeClass(
                      connection?.connected ? "ok" : "neutral"
                    )}`}
                  >
                    {connection?.connected
                      ? t("whatsapp.hub.connected")
                      : t("whatsapp.hub.disconnected")}
                  </span>
                  {connection?.connected ? (
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${toneBadgeClass(
                        ready.tone
                      )}`}
                    >
                      {ready.tone === "ok"
                        ? t("whatsapp.hub.ready")
                        : t("whatsapp.hub.issue")}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-semibold text-slate-500">
                  {qualityLabel ? (
                    <span className="inline-flex items-center gap-1">
                      {t("whatsapp.hub.quality")}:
                      <span
                        className={`rounded border px-1.5 py-0 text-[10px] font-bold ${qualityBadgeClass(
                          connection?.qualityRating
                        )}`}
                      >
                        {qualityLabel}
                      </span>
                    </span>
                  ) : null}
                  {limitLabel ? (
                    <span>
                      {t("whatsapp.hub.messagingLimit")}:{" "}
                      <span className="text-slate-700">{limitLabel}</span>
                    </span>
                  ) : null}
                  {nameStatusLabel ? (
                    <span className="inline-flex items-center gap-1">
                      {t("whatsapp.hub.displayName")}:
                      <span
                        className={`rounded border px-1.5 py-0 text-[10px] font-bold ${nameStatusBadgeClass(
                          connection?.nameStatusDisplay || connection?.nameStatus
                        )}`}
                      >
                        {nameStatusLabel}
                      </span>
                    </span>
                  ) : null}
                  <span>
                    {t("whatsapp.hub.cards.lastSync")}:{" "}
                    <span className="text-slate-700">
                      {lastSync || t("whatsapp.hub.neverSynced")}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
              <GuidedDemoSandboxButton
                target="whatsapp-demo-send"
                className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-black text-amber-900"
              >
                {t("whatsapp.shell.demoSend", "Demo")}
              </GuidedDemoSandboxButton>
              {isConnected ? (
                <NavLink
                  to="connection"
                  className={`${btnSecondary} !px-2.5 !py-1.5 text-[11px]`}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  {t("whatsapp.hub.manageConnection")}
                </NavLink>
              ) : (
                <NavLink
                  to="connection"
                  className={`${btnSecondary} !px-2.5 !py-1.5 text-[11px]`}
                >
                  <PlugZap className="h-3.5 w-3.5" />
                  {t("whatsapp.hub.connectCta")}
                </NavLink>
              )}
              <button
                type="button"
                className={`${btnSecondary} !px-2.5 !py-1.5 text-[11px]`}
                disabled={!businessId || syncing || !isConnected}
                onClick={() => void syncWithMeta()}
              >
                {syncing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {t("whatsapp.hub.syncWithMeta")}
              </button>
            </div>
          </div>

          {apiPortal ? null : (
          <nav aria-label={t("whatsapp.hub.title")} className="biz-tabs">
            <div className="biz-tabs-row">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const active =
                  tab.path === "messages"
                    ? topSegment === "messages"
                    : topSegment === tab.path;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.to}
                    className={["biz-tab", active ? "is-active" : ""].join(" ")}
                  >
                    <Icon />
                    <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
          )}
        </header>

        <main className="w-full min-w-0">
          {/* Nested Suspense keeps hub chrome mounted while lazy tab chunks load. */}
          <Suspense fallback={<WhatsAppTabSuspenseFallback />}>
            <Outlet context={outletContext} />
          </Suspense>
        </main>
      </div>
    </section>
  );
}
