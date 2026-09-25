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
  Code2,
  Inbox,
  Loader2,
  MessageCircle,
  MessagesSquare,
  PlugZap,
  RefreshCw,
  Settings2,
  UserRound,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  getWhatsAppStatus,
  syncWhatsAppAccountHealth,
  type WhatsAppConnection,
} from "../../../../api/whatsappApi";
import { useWhatsAppBilling } from "./billing/useWhatsAppBilling";
import WhatsAppBillingSetupModal from "./billing/WhatsAppBillingSetupModal";
import WhatsAppCheckoutProcessing from "./billing/WhatsAppCheckoutProcessing";
import GuidedDemoSandboxButton from "../../../../guidedDemo/GuidedDemoSandboxButton";
import { btnSecondary } from "../../../../styles/bizuplyUi";
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
  pathSegmentsAfterWhatsapp,
  resolveWhatsAppHubRedirect,
  whatsappBasePath,
} from "./hubNavigation";
import WhatsAppTabSuspenseFallback from "./WhatsAppTabSuspenseFallback";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";

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
  { path: "inbox", to: "inbox", labelKey: "whatsapp.nav.inbox", icon: Inbox },
  { path: "insights", to: "insights", labelKey: "whatsapp.nav.insights", icon: BarChart3 },
  {
    path: "developers",
    to: "developers",
    labelKey: "whatsapp.nav.developers",
    icon: Code2,
  },
  { path: "billing", to: "billing", labelKey: "whatsapp.nav.billing", icon: Wallet },
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
  openBillingSetup: (mode: "setup" | "manage") => void;
  billingUsage: ReturnType<typeof useWhatsAppBilling>["usage"];
  billingLoading: boolean;
  billingError: string | null;
  refreshBilling: () => Promise<void>;
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
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupModalMode, setSetupModalMode] = useState<"setup" | "manage">(
    "setup"
  );
  const [checkoutProcessingOpen, setCheckoutProcessingOpen] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(
    visualQa?.connection || null
  );
  const [connectionLoading, setConnectionLoading] = useState(!visualQa);
  const [syncing, setSyncing] = useState(false);

  const {
    usage: billingUsage,
    loading: billingLoading,
    error: billingError,
    refresh: refreshBilling,
    setUsage: setBillingUsage,
  } = useWhatsAppBilling(businessId);

  const pathAfterWhatsapp = useMemo(
    () => pathSegmentsAfterWhatsapp(location.pathname),
    [location.pathname]
  );

  const topSegment = pathAfterWhatsapp[0] || "overview";
  const isConnected = Boolean(connection?.connected);
  const hasLoadedConnectionRef = useRef(Boolean(visualQa?.connection));

  const visibleTabs = useMemo(() => {
    if (connectionLoading) return MAIN_TABS;
    if (!isConnected) {
      return [
        ...MAIN_TABS,
        {
          path: "connection",
          to: "connection",
          labelKey: "whatsapp.nav.connection",
          icon: Settings2,
        },
      ];
    }
    return MAIN_TABS;
  }, [connectionLoading, isConnected]);

  useEffect(() => {
    const target = resolveWhatsAppHubRedirect(location.pathname);
    if (target && target !== location.pathname.replace(/\/+$/, "")) {
      navigate(target, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (visualQa) return;
    if (connectionLoading) return;
    // Funds / billing (and developers) must stay reachable without a connected
    // WABA — prepaid wallet and API keys are independent of Meta connection.
    const allowWhenDisconnected = new Set(["connection", "billing", "developers"]);
    if (!isConnected && !allowWhenDisconnected.has(topSegment)) {
      navigate(`${whatsappBasePath(location.pathname)}/connection`, {
        replace: true,
      });
    }
  }, [
    visualQa,
    connectionLoading,
    isConnected,
    topSegment,
    location.pathname,
    navigate,
  ]);

  useEffect(() => {
    const flag = readWaBillingFlag(searchParams);
    if (!flag) return;
    if (flag === "processing") {
      setCheckoutProcessingOpen(true);
      toast.info(t("automations.toasts.waCheckoutProcessing"));
    } else if (flag === "cancel") {
      toast.info(t("automations.toasts.waCheckoutCancel"));
    }
    const next = new URLSearchParams(searchParams);
    next.delete("waBilling");
    next.delete("whatsappBilling");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, t]);

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
      const status = await getWhatsAppStatus(businessId);
      setConnection(status);
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

  const openSetupModal = useCallback((mode: "setup" | "manage") => {
    setSetupModalMode(mode);
    setSetupModalOpen(true);
  }, []);

  const ready = connectionReadyLabel(
    Boolean(connection?.connected),
    connection?.readyToSend,
    connection?.readiness
  );
  const qualityLabel = formatQualityRating(connection?.qualityRating);
  const nameStatusLabel = formatNameStatus(connection?.nameStatus);
  const limitLabel = formatMessagingLimit(connection?.messagingLimitTier);
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
      openBillingSetup: openSetupModal,
      billingUsage,
      billingLoading,
      billingError,
      refreshBilling,
    }),
    [
      businessId,
      connection,
      connectionLoading,
      refreshConnection,
      syncWithMeta,
      syncing,
      openSetupModal,
      billingUsage,
      billingLoading,
      billingError,
      refreshBilling,
    ]
  );

  return (
    <section
      dir={getTextDirection(i18n.language)}
      className="min-h-[calc(100vh-72px)] bg-[#F5F7FB] px-3 py-3 text-start text-slate-900 sm:px-4 sm:py-4 lg:px-5"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="mb-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-2.5 border-b border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg">
                    {showConnectionPlaceholder ? "…" : displayName}
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
                          connection?.nameStatus
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

          <nav aria-label={t("whatsapp.hub.title")} className="px-1.5 sm:px-2">
            <div className="flex flex-wrap items-stretch gap-0.5">
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
                    className={[
                      "group relative flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-[13px] font-bold transition-colors",
                      active
                        ? "text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-3.5 w-3.5 shrink-0",
                        active ? "text-emerald-600" : "text-slate-400",
                      ].join(" ")}
                    />
                    <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
                    <span
                      className={[
                        "absolute inset-x-2 bottom-0 h-0.5 rounded-full",
                        active ? "bg-emerald-500 opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </header>

        <main className="w-full min-w-0">
          {/* Nested Suspense keeps hub chrome mounted while lazy tab chunks load. */}
          <Suspense fallback={<WhatsAppTabSuspenseFallback />}>
            <Outlet context={outletContext} />
          </Suspense>
        </main>
      </div>

      {businessId ? (
        <>
          <WhatsAppBillingSetupModal
            open={setupModalOpen}
            businessId={businessId}
            usage={billingUsage}
            initialMode={setupModalMode}
            onClose={() => setSetupModalOpen(false)}
            onUsageUpdated={async () => {
              await refreshBilling();
            }}
          />
          <WhatsAppCheckoutProcessing
            open={checkoutProcessingOpen}
            businessId={businessId}
            onDone={(usage) => {
              setBillingUsage(usage);
              setCheckoutProcessingOpen(false);
              void refreshBilling();
            }}
            onClose={() => setCheckoutProcessingOpen(false)}
          />
        </>
      ) : null}
    </section>
  );
}
