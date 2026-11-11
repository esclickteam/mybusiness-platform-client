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
  isUnsetQualityRating,
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

function chipTone(className: string) {
  if (className.includes("emerald")) return "is-ok";
  if (className.includes("rose")) return "is-bad";
  if (className.includes("amber")) return "is-warn";
  return "is-neutral";
}

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
  const rawQuality = String(connection?.qualityRating || "").trim();
  const qualityUnset =
    isUnsetQualityRating(rawQuality) &&
    (Boolean(rawQuality) || Boolean(connection?.connected));
  const qualityLabel = qualityUnset
    ? ""
    : formatQualityRating(connection?.qualityRating, t);
  const nameTone = nameStatusBadgeClass(
    connection?.nameStatusDisplay || connection?.nameStatus
  );
  const qualityTone = qualityBadgeClass(connection?.qualityRating);
  const nameStatusLabel = formatNameStatus(
    connection?.nameStatusDisplay || connection?.nameStatus,
    t
  );
  const limitLabel = formatMessagingLimit(connection?.messagingLimitTier, t);
  const accountName =
    connection?.wabaName ||
    connection?.verifiedName ||
    t("whatsapp.hub.unnamed");
  const verifiedDisplayName = connection?.verifiedName || "";
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
            <div className="wa-account">
              <div className="wa-account-top">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="biz-mark">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="wa-kicker">WhatsApp API</p>
                    <h1 className="wa-title">
                      {showConnectionPlaceholder
                        ? "…"
                        : connection?.connected
                          ? accountName
                          : t("whatsapp.viaMeta.title")}
                    </h1>
                  </div>
                </div>
                <div className="wa-actions">
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

              <div className="wa-facts">
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.accountName")}</p>
                  <p className="wa-fact-value">
                    {showConnectionPlaceholder ? "…" : accountName}
                  </p>
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.phone")}</p>
                  <p className="wa-fact-value" dir="ltr">
                    {showConnectionPlaceholder
                      ? "…"
                      : connection?.displayPhoneNumber || t("whatsapp.hub.noPhone")}
                  </p>
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.connectionStatus")}</p>
                  <p className="wa-fact-value">
                    <span className={`wa-badge ${connection?.connected ? "is-ok" : "is-neutral"}`}>
                      {connection?.connected
                        ? t("whatsapp.hub.connected")
                        : t("whatsapp.hub.disconnected")}
                    </span>
                  </p>
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.readinessStatus")}</p>
                  <p className="wa-fact-value">
                    {connection?.connected ? (
                      <span className={`wa-badge ${ready.tone === "ok" ? "is-ok" : ready.tone === "bad" ? "is-bad" : "is-warn"}`}>
                        {ready.status}
                      </span>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>

              <div className="wa-facts">
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.displayName")}</p>
                  <p className="wa-fact-value">
                    {showConnectionPlaceholder ? "…" : verifiedDisplayName || "—"}
                  </p>
                  {nameStatusLabel ? (
                    <p className="wa-fact-meta">
                      <span>{t("whatsapp.hub.displayNameStatus")}</span>
                      <span className={`wa-badge ${chipTone(nameTone)}`}>
                        {nameStatusLabel}
                      </span>
                    </p>
                  ) : null}
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.numberQuality")}</p>
                  <p className="wa-fact-value">
                    {showConnectionPlaceholder ? (
                      "…"
                    ) : qualityUnset ? (
                      t("whatsapp.hub.qualityUnset")
                    ) : qualityLabel ? (
                      <span className={`wa-badge ${chipTone(qualityTone)}`}>
                        {qualityLabel}
                      </span>
                    ) : (
                      "—"
                    )}
                  </p>
                  {qualityUnset && !showConnectionPlaceholder ? (
                    <p className="wa-fact-hint">{t("whatsapp.hub.qualityUnsetHint")}</p>
                  ) : null}
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.sendLimit24")}</p>
                  <p className="wa-fact-value" dir="ltr">
                    {showConnectionPlaceholder ? "…" : limitLabel || "—"}
                  </p>
                </div>
                <div className="wa-fact">
                  <p className="wa-fact-label">{t("whatsapp.hub.cards.lastSync")}</p>
                  <p className="wa-fact-value">
                    {showConnectionPlaceholder
                      ? "…"
                      : lastSync || t("whatsapp.hub.neverSynced")}
                  </p>
                </div>
              </div>
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
