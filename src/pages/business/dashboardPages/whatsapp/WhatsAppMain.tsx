import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { toast } from "react-toastify";
import {
  Activity,
  BarChart3,
  Code2,
  History,
  Inbox,
  ListChecks,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
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

type WhatsAppTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: WhatsAppTab[] = [
  { path: "overview", labelKey: "whatsapp.nav.overview", icon: Activity },
  { path: "profile", labelKey: "whatsapp.nav.profile", icon: UserRound },
  { path: "templates", labelKey: "whatsapp.nav.templates", icon: MessageCircle },
  { path: "compose", labelKey: "whatsapp.nav.compose", icon: Send },
  { path: "lists", labelKey: "whatsapp.nav.lists", icon: ListChecks },
  { path: "inbox", labelKey: "whatsapp.nav.inbox", icon: Inbox },
  { path: "history", labelKey: "whatsapp.nav.history", icon: History },
  { path: "insights", labelKey: "whatsapp.nav.insights", icon: BarChart3 },
  { path: "developers", labelKey: "whatsapp.nav.developers", icon: Code2 },
  { path: "billing", labelKey: "whatsapp.nav.billing", icon: Wallet },
  { path: "connection", labelKey: "whatsapp.nav.connection", icon: Settings2 },
];

const LEGACY_TAB_REDIRECT: Record<string, string> = {
  automations: "overview",
  health: "insights",
  settings: "connection",
};

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

  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupModalMode, setSetupModalMode] = useState<"setup" | "manage">(
    "setup"
  );
  const [checkoutProcessingOpen, setCheckoutProcessingOpen] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const {
    usage: billingUsage,
    loading: billingLoading,
    error: billingError,
    refresh: refreshBilling,
    setUsage: setBillingUsage,
  } = useWhatsAppBilling(businessId);

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "overview";
  }, [location.pathname]);

  const isKnownTab = useMemo(
    () => tabs.some((tab) => tab.path === currentTab),
    [currentTab]
  );

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const isRoot = lastPart === "whatsapp";
    const legacyTarget = LEGACY_TAB_REDIRECT[lastPart];

    if (legacyTarget) {
      const basePath = cleanPath.replace(new RegExp(`/${lastPart}$`), "");
      navigate(`${basePath}/${legacyTarget}`, { replace: true });
      return;
    }

    if (!isRoot && isKnownTab) return;

    const basePath = isRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/overview`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, navigate]);

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
    if (!businessId) {
      setConnection(null);
      setConnectionLoading(false);
      return;
    }
    setConnectionLoading(true);
    try {
      const status = await getWhatsAppStatus(businessId);
      setConnection(status);
    } catch {
      setConnection(null);
    } finally {
      setConnectionLoading(false);
    }
  }, [businessId]);

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

  const openSetupModal = (mode: "setup" | "manage") => {
    setSetupModalMode(mode);
    setSetupModalOpen(true);
  };

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

  const outletContext: WhatsAppHubOutletContext = {
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
  };

  return (
    <section
      dir={getTextDirection(i18n.language)}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="relative overflow-hidden border-b border-slate-100">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-emerald-50/70 via-sky-50/40 to-white"
            />
            <div className="relative flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    {t("whatsapp.hub.product")}
                  </p>
                  <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {t("whatsapp.hub.title")}
                  </h1>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-600" dir="ltr">
                    {connectionLoading
                      ? "…"
                      : connection?.displayPhoneNumber ||
                        t("whatsapp.hub.noPhone")}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${toneBadgeClass(
                        connection?.connected ? "ok" : "neutral"
                      )}`}
                    >
                      {connection?.connected
                        ? t("whatsapp.hub.connected")
                        : t("whatsapp.hub.disconnected")}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${toneBadgeClass(
                        ready.tone
                      )}`}
                    >
                      {ready.tone === "ok"
                        ? t("whatsapp.hub.ready")
                        : ready.tone === "neutral"
                          ? t("whatsapp.hub.disconnected")
                          : t("whatsapp.hub.issue")}
                    </span>
                    {connection?.verifiedName ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        {t("whatsapp.hub.displayName")}: {displayName}
                        {nameStatusLabel ? (
                          <span
                            className={`ms-1 rounded-full border px-1.5 py-0 text-[10px] ${nameStatusBadgeClass(
                              connection.nameStatus
                            )}`}
                          >
                            {nameStatusLabel}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    {qualityLabel ? (
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${qualityBadgeClass(
                          connection?.qualityRating
                        )}`}
                      >
                        {t("whatsapp.hub.quality")}: {qualityLabel}
                      </span>
                    ) : null}
                    {limitLabel ? (
                      <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                        {t("whatsapp.hub.messagingLimit")}: {limitLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <GuidedDemoSandboxButton
                  target="whatsapp-demo-send"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-900"
                >
                  {t(
                    "whatsapp.shell.demoSend",
                    "Send a demo message — not sent to a real customer"
                  )}
                </GuidedDemoSandboxButton>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={!businessId || syncing || !connection?.connected}
                  onClick={() => void syncWithMeta()}
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {t("whatsapp.hub.syncWithMeta")}
                </button>
              </div>
            </div>
          </div>

          <nav
            aria-label={t("whatsapp.hub.title")}
            className="px-2 sm:px-3"
          >
            <div
              className={[
                "flex items-stretch gap-0.5 overflow-x-auto",
                "[scrollbar-width:none] [-ms-overflow-style:none]",
                "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent",
              ].join(" ")}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-black transition-colors",
                        "focus:outline-none focus-visible:bg-emerald-50",
                        isActive
                          ? "text-emerald-700"
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
                              ? "text-emerald-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          ].join(" ")}
                        />
                        <span className="whitespace-nowrap">
                          {t(tab.labelKey)}
                        </span>
                        <span
                          className={[
                            "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
                            isActive
                              ? "bg-emerald-500 opacity-100"
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
          <Outlet context={outletContext} />
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
