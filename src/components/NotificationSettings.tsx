import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import API from "@api";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BellRing,
  Calendar,
  Check,
  Download,
  Handshake,
  ListChecks,
  Lock,
  Loader2,
  MessageCircle,
  Smartphone,
  Star,
  Sparkles,
  UserPlus,
} from "lucide-react";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import {
  cancelPushBilling,
  createPushBillingCheckout,
  getPushBillingStatus,
  normalizePushPlan,
  pushPlanAmountIls,
  reactivatePushBilling,
  type PushBillingPlan,
  type PushBillingStatus,
} from "../api/pushBillingApi";
import {
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  bindExistingPushSubscription,
  getCurrentPushSubscription,
  ensurePushSubscription,
  type PushPermission,
} from "../utils/push";
import { resolvePushToggleCopy } from "../utils/pushToggleState";
import { resolvePushSupportBanner } from "../utils/pushSupportBanner";
import { getTextDirection } from "../i18n/localeUtils";
import {
  buildNotificationSettingsWrite,
  isPushEnabledPreference,
  persistPushEnabledPreference,
  rememberPushEnabledPreference,
  resolvePushToggleChecked,
  shouldRecoverDeviceSubscription,
} from "../utils/pushPreference";

type NotificationSettingsState = {
  master: boolean;
  pushEnabled?: boolean;
  appointment: boolean;
  collaboration: boolean;
  review: boolean;
  message: boolean;
  lead: boolean;
  task: boolean;
  aiCampaign: boolean;
};

type CategoryKey = keyof Omit<NotificationSettingsState, "master" | "pushEnabled">;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DEFAULT_SETTINGS: NotificationSettingsState = {
  master: true,
  pushEnabled: true,
  appointment: true,
  collaboration: true,
  review: true,
  message: true,
  lead: true,
  task: true,
  aiCampaign: true,
};

const CATEGORIES: {
  key: CategoryKey;
  icon: React.ReactNode;
}[] = [
  { key: "appointment", icon: <Calendar className="h-4 w-4" /> },
  { key: "lead", icon: <UserPlus className="h-4 w-4" /> },
  { key: "collaboration", icon: <Handshake className="h-4 w-4" /> },
  { key: "message", icon: <MessageCircle className="h-4 w-4" /> },
  { key: "review", icon: <Star className="h-4 w-4" /> },
  { key: "task", icon: <ListChecks className="h-4 w-4" /> },
  { key: "aiCampaign", icon: <Sparkles className="h-4 w-4" /> },
];

function Toggle({
  checked,
  onChange,
  disabled = false,
  testId,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
      data-testid={testId}
      disabled={disabled}
      onClick={onChange}
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none",
        disabled ? "opacity-40" : "",
        checked
          ? "bg-gradient-to-r from-amber-400 to-red-500"
          : "bg-slate-200",
      ].join(" ")}
    >
      <motion.span
        className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

function formatDdMmYyyy(iso: string | Date | null | undefined): string | null {
  if (!iso) return null;
  const date = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function daysRemaining(iso: string | Date | null | undefined): number | null {
  if (!iso) return null;
  const end = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(end.getTime())) return null;
  const ms = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

type NotificationSettingsPanelProps = {
  active: boolean;
  onBack: () => void;
};

/** Settings body meant to live inside the notifications dropdown panel. */
export function NotificationSettingsPanel({
  active,
  onBack,
}: NotificationSettingsPanelProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [billingBusy, setBillingBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] =
    useState<NotificationSettingsState>(DEFAULT_SETTINGS);

  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<PushPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [thisDeviceRegistered, setThisDeviceRegistered] = useState<
    boolean | null
  >(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [testMessage, setTestMessage] = useState("");
  const [billingMessage, setBillingMessage] = useState("");
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const [billingStatus, setBillingStatus] = useState<PushBillingStatus | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<PushBillingPlan>("annual");

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function refreshBillingStatus() {
    try {
      const status = await getPushBillingStatus();
      setBillingStatus(status);
      return status;
    } catch (err) {
      console.error("Failed to load push billing status:", err);
      return null;
    }
  }

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setSupported(isPushSupported());
        setPermission(getPermission());
        setTestMessage("");
        setBillingMessage("");

        const [res, billing] = await Promise.all([
          API.get("/business/my/notification-settings"),
          getPushBillingStatus().catch(() => null),
        ]);

        if (cancelled) return;

        const loadedSettings =
          res.data?.ok && res.data.settings
            ? { ...DEFAULT_SETTINGS, ...res.data.settings }
            : DEFAULT_SETTINGS;
        setSettings(loadedSettings);
        rememberPushEnabledPreference(isPushEnabledPreference(loadedSettings));
        if (billing) {
          setBillingStatus(billing);
        }

        const billingOn = Boolean(billing?.billingEnabled);
        const entitledNow = Boolean(billing?.entitled);
        const entitledOkNow = !billingOn || entitledNow;
        const pushEnabled = isPushEnabledPreference(loadedSettings);

        if (
          shouldRecoverDeviceSubscription({
            pushEnabled,
            entitled: entitledOkNow,
            permission: getPermission(),
            supported: isPushSupported(),
          })
        ) {
          const recover = await ensurePushSubscription();
          if (recover.reason === "entitlement-required") {
            setBillingMessage(t("notificationSettings.needPushSub"));
          }
        } else {
          const localSub = await getCurrentPushSubscription();
          if (localSub && pushEnabled) {
            const bind = await bindExistingPushSubscription();
            if (bind.reason === "entitlement-required") {
              setBillingMessage(t("notificationSettings.needPushSub"));
            }
          }
        }

        if (cancelled) return;

        const localSub = await getCurrentPushSubscription();
        const endpoint = localSub?.endpoint || "";
        const [subscribedNow, statusRes] = await Promise.all([
          isSubscribed(),
          API.get("/push/status", {
            params: endpoint ? { endpoint } : undefined,
          }).catch(() => null),
        ]);

        if (cancelled) return;

        setSubscribed(subscribedNow);
        setServerReady(Boolean(statusRes?.data?.ready));
        setThisDeviceRegistered(
          typeof statusRes?.data?.thisDeviceRegistered === "boolean"
            ? statusRes.data.thisDeviceRegistered
            : null
        );
        setDeviceCount(Number(statusRes?.data?.deviceCount || 0));
      } catch (err) {
        console.error("Failed to load notification settings:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const refreshLocal = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      setPermission(getPermission());
      void isSubscribed().then(setSubscribed);
    };

    document.addEventListener("visibilitychange", refreshLocal);
    window.addEventListener("pageshow", refreshLocal);
    return () => {
      document.removeEventListener("visibilitychange", refreshLocal);
      window.removeEventListener("pageshow", refreshLocal);
    };
  }, [active]);

  const billingEnabled = Boolean(billingStatus?.billingEnabled);
  const entitled = Boolean(billingStatus?.entitled);
  const subscription = billingStatus?.subscription || null;
  const plan = normalizePushPlan(subscription?.planKey);
  const subStatus = String(subscription?.status || "").toLowerCase();
  const cancelAtPeriodEnd = Boolean(subscription?.cancelAtPeriodEnd);
  const periodEndLabel = formatDdMmYyyy(subscription?.currentPeriodEnd);
  const trialDaysLeft = daysRemaining(subscription?.currentPeriodEnd);
  const firstChargeAmount = pushPlanAmountIls(plan);

  const showPaywall = billingEnabled && !entitled;
  const showSubscriberPanel = billingEnabled && entitled;
  const showFreePushToggle = !billingEnabled;
  const categoriesLocked = showPaywall;

  const entitledOk = !billingEnabled || entitled;
  const pushEnabled = isPushEnabledPreference(settings);
  const pushOn = resolvePushToggleChecked({
    pushEnabled,
    entitled: entitledOk,
  });
  const toggleCopy = resolvePushToggleCopy({
    pushOn,
    serverReady,
    thisDeviceRegistered,
    permission,
    subscribed,
    deviceCount,
    ios: isIos(),
    t,
  });
  const supportBanner = resolvePushSupportBanner({
    supported,
    ios: isIos(),
    standalone: isStandalone(),
    deviceCount,
  });

  async function persistCategories(next: NotificationSettingsState) {
    try {
      const res = await API.put(
        "/business/my/notification-settings",
        buildNotificationSettingsWrite({ settings: next })
      );

      if (res.data?.ok && res.data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    }
  }

  async function persistMaster(enabled: boolean, current: NotificationSettingsState) {
    try {
      const savedSettings = await persistPushEnabledPreference(enabled, current);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save push preference:", err);
    }
  }

  async function refreshDeviceStatus() {
    const localSub = await getCurrentPushSubscription();
    const statusRes = await API.get("/push/status", {
      params: localSub?.endpoint ? { endpoint: localSub.endpoint } : undefined,
    }).catch(() => null);
    setSubscribed(Boolean(localSub));
    setServerReady(Boolean(statusRes?.data?.ready));
    setThisDeviceRegistered(
      typeof statusRes?.data?.thisDeviceRegistered === "boolean"
        ? statusRes.data.thisDeviceRegistered
        : null
    );
    setDeviceCount(Number(statusRes?.data?.deviceCount || 0));
  }

  async function handleMasterToggle() {
    if (busy) return;

    if (billingEnabled && !entitled) {
      setBillingMessage(t("notificationSettings.needPushSub"));
      return;
    }

    if (pushEnabled) {
      setBusy(true);
      try {
        const next = { ...settings, master: false, pushEnabled: false };
        setSettings(next);
        await persistMaster(false, next);
        await unsubscribeFromPush();
        setSubscribed(false);
        setServerReady(false);
        setThisDeviceRegistered(false);
        setDeviceCount(0);
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(true);
    try {
      const next = { ...settings, master: true, pushEnabled: true };
      setSettings(next);
      await persistMaster(true, next);

      const result = await subscribeToPush();
      setPermission(getPermission());

      if (result.ok) {
        setSubscribed(true);
        await refreshDeviceStatus();
      } else if (result.reason === "entitlement-required") {
        setBillingMessage(t("notificationSettings.needPushSub"));
        await refreshBillingStatus();
      } else if (result.reason === "unsupported") {
        setSupported(false);
      } else if (result.reason === "ios-install") {
        setShowGuide(true);
      } else {
        await refreshDeviceStatus();
      }
    } finally {
      setBusy(false);
    }
  }

  function handleCategoryToggle(key: CategoryKey) {
    if (categoriesLocked) {
      setBillingMessage(t("notificationSettings.availableAfterTrialShort"));
      return;
    }
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    persistCategories(next);
  }

  async function handleCheckout() {
    if (billingBusy) return;
    setBillingBusy(true);
    setBillingMessage("");
    try {
      const result = await createPushBillingCheckout(selectedPlan);
      if (!result?.url) {
        setBillingMessage(t("notificationSettings.checkoutFailed"));
        return;
      }
      window.location.assign(result.url);
    } catch (err) {
      setBillingMessage(
        err instanceof Error ? err.message : t("notificationSettings.checkoutFailedGeneric")
      );
    } finally {
      setBillingBusy(false);
    }
  }

  async function handleCancelSubscription() {
    if (billingBusy) return;
    setBillingBusy(true);
    setBillingMessage("");
    try {
      const result = await cancelPushBilling();
      await refreshBillingStatus();
      if (result.canceledImmediately) {
        setBillingMessage(t("notificationSettings.canceledStopped"));
      } else {
        const end = formatDdMmYyyy(result.currentPeriodEnd) || periodEndLabel;
        setBillingMessage(
          end
            ? t("notificationSettings.canceledUntil", { date: end })
            : t("notificationSettings.canceledUntilEnd")
        );
      }
    } catch (err) {
      setBillingMessage(
        err instanceof Error ? err.message : t("notificationSettings.cancelFailed")
      );
    } finally {
      setBillingBusy(false);
    }
  }

  async function handleReactivateSubscription() {
    if (billingBusy) return;
    setBillingBusy(true);
    setBillingMessage("");
    try {
      await reactivatePushBilling();
      await refreshBillingStatus();
      setBillingMessage(t("notificationSettings.renewed"));
    } catch (err) {
      setBillingMessage(
        err instanceof Error ? err.message : t("notificationSettings.renewFailed")
      );
    } finally {
      setBillingBusy(false);
    }
  }

  async function handleTestPush() {
    if (busy) return;
    setBusy(true);
    setTestMessage("");

    try {
      if (billingEnabled && !entitled) {
        setTestMessage(t("notificationSettings.needPushForTest"));
        return;
      }

      const ensure = await ensurePushSubscription();
      if (ensure.reason === "entitlement-required") {
        setTestMessage(t("notificationSettings.needPushForTest"));
        await refreshBillingStatus();
        return;
      }
      if (!ensure.ok && ensure.reason === "ios-install") {
        setShowGuide(true);
        setTestMessage(
          t("notificationSettings.iphoneStandalone")
        );
        return;
      }

      const res = await API.post("/push/test");
      setServerReady(Boolean(res.data?.ok || res.data?.sent > 0));
      setDeviceCount(
        Number(res.data?.deviceCount || res.data?.sent || deviceCount)
      );
      setTestMessage(res.data?.message || t("notificationSettings.testSent"));
    } catch (err) {
      const anyErr = err as { status?: number; code?: string; message?: string };
      if (
        anyErr.status === 402 ||
        anyErr.code === "PUSH_ENTITLEMENT_REQUIRED"
      ) {
        setTestMessage(t("notificationSettings.needPushForTest"));
        await refreshBillingStatus();
      } else {
        setTestMessage(
          err instanceof Error ? err.message : t("notificationSettings.testFailed")
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleInstall() {
    if (!installEvent) {
      setShowGuide(true);
      return;
    }

    try {
      await installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
    } catch (err) {
      console.error("install prompt failed:", err);
    }
  }

  const iosNeedsInstall = isIos() && !isStandalone();

  const paywallDisclaimerExtra = useMemo(() => {
    if (selectedPlan === "annual") {
      return t("notificationSettings.trialDisclaimerAnnual");
    }
    return t("notificationSettings.trialDisclaimerMonthly");
  }, [selectedPlan, t]);


  return (
    <div dir={pageDir} className="flex min-h-0 flex-1 flex-col">
      <div className="relative shrink-0 border-b border-slate-100 bg-white p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-500" />

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            aria-label={t("notificationSettings.backAria")}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {pageDir === "rtl" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
              <BellRing className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-900">
                {t("notificationSettings.title")}
              </h3>
              <p className="truncate text-[11px] font-bold text-slate-500">
                {t("notificationSettings.subtitle")}
              </p>
            </div>
          </div>

          {saved && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-600">
              <Check className="h-3 w-3" />
              {t("notificationSettings.saved")}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[200px] flex-1 items-center justify-center">
          <BizuplyLoader size="sm" compact />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
          {supportBanner ? (
            <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              {supportBanner.text}
            </div>
          ) : null}

          {supported && permission === "denied" && (
            <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              {t("notificationSettings.blockedHint")}
            </div>
          )}

          {showPaywall && (
            <div className="mb-2 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/80 to-white p-3">
              <div className="mb-3 flex items-start gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    {t("notificationSettings.pushTitle")}
                  </p>
                  <p className="text-[11px] font-semibold leading-4 text-slate-500">
                    {t("notificationSettings.pushText")}
                  </p>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("monthly")}
                  className={[
                    "rounded-2xl border p-2.5 text-right transition",
                    selectedPlan === "monthly"
                      ? "border-amber-300 bg-white ring-2 ring-amber-200"
                      : "border-slate-200 bg-slate-50/80 hover:bg-white",
                  ].join(" ")}
                >
                  <p className="text-[11px] font-black text-slate-800">{t("notificationSettings.monthly")}</p>
                  <p className="mt-0.5 text-sm font-black text-slate-900">
                    29 ₪{" "}
                    <span className="text-[10px] font-bold text-slate-500">
                      {t("notificationSettings.perMonth")}
                    </span>
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">
                    {t("notificationSettings.sevenDaysFree")}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan("annual")}
                  className={[
                    "relative rounded-2xl border p-2.5 text-right transition",
                    selectedPlan === "annual"
                      ? "border-amber-300 bg-white ring-2 ring-amber-200"
                      : "border-slate-200 bg-slate-50/80 hover:bg-white",
                  ].join(" ")}
                >
                  <span className="absolute -top-2 left-2 rounded-full bg-gradient-to-l from-amber-400 to-red-500 px-2 py-0.5 text-[9px] font-black text-white">
                    {t("notificationSettings.recommended")}
                  </span>
                  <p className="text-[11px] font-black text-slate-800">{t("notificationSettings.annual")}</p>
                  <p className="mt-0.5 text-sm font-black text-slate-900">
                    19 ₪{" "}
                    <span className="text-[10px] font-bold text-slate-500">
                      {t("notificationSettings.perMonth")}
                    </span>
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {t("notificationSettings.annualCharge")}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">
                    {t("notificationSettings.sevenDaysFree")}
                  </p>
                  <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                    {t("notificationSettings.annualSave")}
                  </p>
                </button>
              </div>

              <button
                type="button"
                onClick={() => void handleCheckout()}
                disabled={billingBusy}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-red-500 px-3 text-xs font-black text-white shadow-sm transition hover:brightness-105 disabled:opacity-60"
              >
                {billingBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {t("notificationSettings.startTrial")}
              </button>

              <p className="mt-2 text-[10px] font-semibold leading-4 text-slate-500">
                {t("notificationSettings.trialDisclaimer")}
              </p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">
                {paywallDisclaimerExtra}
              </p>
              {billingMessage ? (
                <p className="mt-2 text-[11px] font-bold text-amber-800">
                  {billingMessage}
                </p>
              ) : null}
            </div>
          )}

          {showSubscriberPanel && (
            <div className="mb-2 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/70 to-white p-3">
              {subStatus === "past_due" ? (
                <div className="mb-2 rounded-xl border border-red-200 bg-red-50 p-2.5">
                  <p className="text-xs font-black text-red-700">
                    {t("notificationSettings.paymentFailed")}
                  </p>
                  <Link
                    to="/contact"
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-xl bg-white px-3 text-[11px] font-black text-red-700 ring-1 ring-red-100 transition hover:bg-red-100"
                  >
                    {t("notificationSettings.contactBilling")}
                  </Link>
                </div>
              ) : null}

              {subStatus === "trialing" ? (
                <div className="mb-2">
                  <p className="text-sm font-black text-slate-900">
                    {t("notificationSettings.trialActive")}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {trialDaysLeft != null
                      ? t("notificationSettings.trialDaysLeft", { count: trialDaysLeft })
                      : t("notificationSettings.trialActiveShort")}
                    {periodEndLabel && firstChargeAmount != null
                      ? t("notificationSettings.firstCharge", { date: periodEndLabel, amount: firstChargeAmount })
                      : periodEndLabel
                        ? t("notificationSettings.firstChargeDate", { date: periodEndLabel })
                        : ""}
                  </p>
                </div>
              ) : (
                <div className="mb-2">
                  <p className="text-sm font-black text-slate-900">
                    {t("notificationSettings.planActive", {
                      plan:
                        plan === "monthly"
                          ? t("notificationSettings.monthly")
                          : plan === "annual"
                            ? t("notificationSettings.annual")
                            : t("notificationSettings.planGeneric"),
                    })}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {plan === "annual"
                      ? t("notificationSettings.planAnnualPrice")
                      : plan === "monthly"
                        ? t("notificationSettings.planMonthlyPrice")
                        : t("notificationSettings.planGeneric")}
                    {periodEndLabel && !cancelAtPeriodEnd
                      ? t("notificationSettings.nextRenewal", { date: periodEndLabel })
                      : ""}
                  </p>
                </div>
              )}

              {cancelAtPeriodEnd && periodEndLabel ? (
                <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] font-bold text-amber-800">
                  {t("notificationSettings.canceledUntil", { date: periodEndLabel })}
                </div>
              ) : null}

              <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-white/80 bg-white/80 p-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-red-500 ring-1 ring-amber-100">
                    {busy ? (
                      <BizuplyLoader size="xs" compact />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900">
                      {t("notificationSettings.devicePush")}
                    </p>
                    <p
                      className="text-[10px] font-semibold text-slate-500"
                      data-testid="push-device-status"
                    >
                      {toggleCopy.text}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={pushOn}
                  testId="push-master-toggle"
                  disabled={
                    busy ||
                    (!pushEnabled && (!supported || permission === "denied"))
                  }
                  onChange={handleMasterToggle}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {cancelAtPeriodEnd ? (
                  <button
                    type="button"
                    onClick={() => void handleReactivateSubscription()}
                    disabled={billingBusy}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-white px-3 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-50 disabled:opacity-60"
                  >
                    {billingBusy ? (
                      <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {t("notificationSettings.renew")}
                  </button>
                ) : subStatus !== "past_due" ? (
                  <button
                    type="button"
                    onClick={() => void handleCancelSubscription()}
                    disabled={billingBusy}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-white px-3 text-[11px] font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    {billingBusy ? (
                      <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {t("notificationSettings.cancelSub")}
                  </button>
                ) : null}
              </div>

              {billingMessage ? (
                <p className="mt-2 text-[11px] font-bold text-slate-600">
                  {billingMessage}
                </p>
              ) : null}
            </div>
          )}

          {showFreePushToggle && (
            <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/70 to-white p-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                  {busy ? (
                    <BizuplyLoader size="xs" compact />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    {t("notificationSettings.devicePush")}
                  </p>
                    <p
                      className="text-[11px] font-semibold text-slate-500"
                      data-testid="push-device-status"
                    >
                      {toggleCopy.text}
                    </p>
                </div>
              </div>

              <Toggle
                checked={pushOn}
                testId="push-master-toggle"
                disabled={
                  busy ||
                  (!pushEnabled && (!supported || permission === "denied"))
                }
                onChange={handleMasterToggle}
              />
            </div>
          )}

          {pushOn && (
            <div className="mb-2 rounded-2xl border border-sky-100 bg-sky-50 p-3">
              <button
                type="button"
                onClick={handleTestPush}
                disabled={busy}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-black text-sky-800 ring-1 ring-sky-100 transition hover:bg-sky-100 disabled:opacity-60"
              >
                <Smartphone className="h-4 w-4" />
                {t("notificationSettings.sendTest")}
              </button>
              {testMessage ? (
                <p className="mt-2 text-[11px] font-bold text-sky-800">
                  {testMessage}
                </p>
              ) : null}
            </div>
          )}

          <div className="space-y-1.5">
            {categoriesLocked ? (
              <div className="mb-1 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                <p className="text-[11px] font-bold leading-4 text-slate-600">
                  {t("notificationSettings.categoriesPreview")}
                </p>
              </div>
            ) : null}
            {CATEGORIES.map((category) => {
              const categoryOn = categoriesLocked
                ? false
                : Boolean(settings[category.key]);
              return (
                <div
                  key={category.key}
                  className={[
                    "flex items-center justify-between gap-2 rounded-2xl border p-3 transition",
                    categoriesLocked
                      ? "border-slate-100 bg-slate-50/70"
                      : "border-slate-100 bg-white",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                        categoryOn
                          ? "bg-amber-50 text-red-500 ring-amber-100"
                          : "bg-slate-100 text-slate-400 ring-slate-100",
                      ].join(" ")}
                    >
                      {category.icon}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={[
                          "truncate text-sm font-black",
                          categoriesLocked ? "text-slate-500" : "text-slate-800",
                        ].join(" ")}
                      >
                        {t(`notificationSettings.categories.${category.key}.label`)}
                      </p>
                      <p className="truncate text-[11px] font-semibold text-slate-500">
                        {categoriesLocked
                          ? t("notificationSettings.availableAfterTrial")
                          : t(`notificationSettings.categories.${category.key}.description`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {categoriesLocked ? (
                      <Lock
                        className="h-3.5 w-3.5 text-slate-400"
                        aria-hidden
                      />
                    ) : null}
                    <Toggle
                      checked={categoryOn}
                      disabled={categoriesLocked}
                      onChange={() => handleCategoryToggle(category.key)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={() => setShowGuide((value) => !value)}
              className="flex w-full items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 text-sm font-black text-slate-800">
                <Smartphone className="h-4 w-4 text-amber-600" />
                {t("notificationSettings.howPhone")}
              </span>
              <span className="text-xs font-black text-amber-600">
                {showGuide ? t("notificationSettings.hide") : t("notificationSettings.show")}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {showGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2 text-[11px] font-semibold leading-5 text-slate-600">
                    <div>
                      <p className="mb-0.5 font-black text-slate-800">
                        📱 {t("notificationSettings.iphone")}
                      </p>
                      <ol className="list-inside list-decimal space-y-0.5">
                        <li>Safari → bizuply.com</li>
                        <li>
                          {t("notificationSettings.iphoneShare")}
                        </li>
                        <li>{t("notificationSettings.iphoneOpen")}</li>
                      </ol>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {t("notificationSettings.iphoneNote")}
                      </p>
                    </div>
                    <div>
                      <p className="mb-0.5 font-black text-slate-800">
                        🤖 {t("notificationSettings.android")}
                      </p>
                      <ol className="list-inside list-decimal space-y-0.5">
                        <li>{t("notificationSettings.androidChrome")}</li>
                        <li>{t("notificationSettings.androidEnable")}</li>
                      </ol>
                    </div>
                    <div>
                      <p className="mb-0.5 font-black text-slate-800">💻 {t("notificationSettings.desktop")}</p>
                      <p>{t("notificationSettings.desktopEnable")}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(installEvent || iosNeedsInstall) && (
              <button
                type="button"
                onClick={handleInstall}
                className="mt-2 inline-flex h-9 items-center gap-2 rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-3 text-[11px] font-black text-black transition hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50"
              >
                <Download className="h-3.5 w-3.5" />
                {installEvent ? t("notificationSettings.installApp") : t("notificationSettings.howIphone")}
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[10px] font-bold text-slate-400">
            {t("notificationSettings.inAppAlways")}
          </p>
        </div>
      )}
    </div>
  );
}