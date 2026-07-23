import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "@api";
import {
  ArrowRight,
  Bell,
  BellRing,
  Calendar,
  Check,
  Download,
  Handshake,
  ListChecks,
  Loader2,
  MessageCircle,
  Share,
  Smartphone,
  Star,
  UserPlus,
} from "lucide-react";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import {
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  ensurePushSubscription,
  type PushPermission,
} from "../utils/push";

type NotificationSettingsState = {
  master: boolean;
  appointment: boolean;
  collaboration: boolean;
  review: boolean;
  message: boolean;
  lead: boolean;
  task: boolean;
};

type CategoryKey = keyof Omit<NotificationSettingsState, "master">;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DEFAULT_SETTINGS: NotificationSettingsState = {
  master: true,
  appointment: true,
  collaboration: true,
  review: true,
  message: true,
  lead: true,
  task: true,
};

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "appointment",
    label: "פגישות",
    description: "פגישות ותורים חדשים שנקבעו",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    key: "lead",
    label: "לידים חדשים",
    description: "לידים חדשים שנכנסים למערכת",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    key: "collaboration",
    label: "שיתופי פעולה",
    description: "הצעות, בקשות והסכמי שיתוף פעולה",
    icon: <Handshake className="h-4 w-4" />,
  },
  {
    key: "message",
    label: "הודעות",
    description: "הודעות חדשות מלקוחות ומשותפים עסקיים",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    key: "review",
    label: "ביקורות",
    description: "ביקורות חדשות שהתקבלו על העסק",
    icon: <Star className="h-4 w-4" />,
  },
  {
    key: "task",
    label: "משימות ותזכורות",
    description: "משימות חדשות ותזכורות לטיפול",
    icon: <ListChecks className="h-4 w-4" />,
  },
];

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
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

type NotificationSettingsPanelProps = {
  active: boolean;
  onBack: () => void;
};

/** Settings body meant to live inside the notifications dropdown panel. */
export function NotificationSettingsPanel({
  active,
  onBack,
}: NotificationSettingsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] =
    useState<NotificationSettingsState>(DEFAULT_SETTINGS);

  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<PushPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [testMessage, setTestMessage] = useState("");
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setSupported(isPushSupported());
        setPermission(getPermission());
        setTestMessage("");

        // Re-bind this device to the current business before reading status.
        if (getPermission() === "granted") {
          await ensurePushSubscription();
        }

        const [subscribedNow, res, statusRes] = await Promise.all([
          isSubscribed(),
          API.get("/business/my/notification-settings"),
          API.get("/push/status").catch(() => null),
        ]);

        if (cancelled) return;

        setSubscribed(subscribedNow);
        setServerReady(Boolean(statusRes?.data?.ready));
        setDeviceCount(Number(statusRes?.data?.deviceCount || 0));

        if (res.data?.ok && res.data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings });
        }
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

  const pushOn = subscribed && settings.master;

  async function persist(next: NotificationSettingsState) {
    try {
      const res = await API.put("/business/my/notification-settings", {
        settings: next,
      });

      if (res.data?.ok && res.data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    }
  }

  async function handleMasterToggle() {
    if (busy) return;

    if (pushOn) {
      setBusy(true);
      try {
        const next = { ...settings, master: false };
        setSettings(next);
        await unsubscribeFromPush();
        setSubscribed(false);
        await persist(next);
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(true);
    try {
      const result = await subscribeToPush();
      setPermission(getPermission());

      if (result.ok) {
        setSubscribed(true);
        const next = { ...settings, master: true };
        setSettings(next);
        await persist(next);

        const statusRes = await API.get("/push/status").catch(() => null);
        setServerReady(Boolean(statusRes?.data?.ready));
        setDeviceCount(Number(statusRes?.data?.deviceCount || 0));
      } else if (result.reason === "unsupported") {
        setSupported(false);
      }
    } finally {
      setBusy(false);
    }
  }

  function handleCategoryToggle(key: CategoryKey) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    persist(next);
  }

  async function handleTestPush() {
    if (busy) return;
    setBusy(true);
    setTestMessage("");

    try {
      await ensurePushSubscription();
      const res = await API.post("/push/test");
      setServerReady(Boolean(res.data?.ok || res.data?.sent > 0));
      setDeviceCount(Number(res.data?.devices || deviceCount));
      setTestMessage(res.data?.message || "נשלחה התראת בדיקה");
    } catch (err) {
      setTestMessage(
        err instanceof Error ? err.message : "שליחת בדיקה נכשלה"
      );
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

  return (
    <div dir="rtl" className="flex min-h-0 flex-1 flex-col text-right">
      <div className="relative shrink-0 border-b border-slate-100 bg-white p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-500" />

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="חזרה להתראות"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
              <BellRing className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-900">
                הגדרות התראות
              </h3>
              <p className="truncate text-[11px] font-bold text-slate-500">
                Push למכשיר — גם כשהמערכת סגורה
              </p>
            </div>
          </div>

          {saved && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-600">
              <Check className="h-3 w-3" />
              נשמר
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
          {!supported && (
            <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              הדפדפן לא תומך בהתראות Push. נסה/י Chrome / Edge / Firefox מעודכן.
            </div>
          )}

          {supported && permission === "denied" && (
            <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              התראות חסומות. לחצ/י 🔒 ליד כתובת האתר → התראות → אפשר/י.
            </div>
          )}

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
                  התראות Push במכשיר
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {pushOn
                    ? serverReady
                      ? `מופעל · ${deviceCount} מכשיר רשום`
                      : "מופעל במכשיר, אבל עדיין לא רשום בשרת — לחץ בדיקה"
                    : "כבוי — לחץ להפעלה לקבלת התראות לטלפון"}
                </p>
              </div>
            </div>

            <Toggle
              checked={pushOn}
              disabled={busy || !supported || permission === "denied"}
              onChange={handleMasterToggle}
            />
          </div>

          {pushOn && (
            <div className="mb-2 rounded-2xl border border-sky-100 bg-sky-50 p-3">
              <button
                type="button"
                onClick={handleTestPush}
                disabled={busy}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-black text-sky-800 ring-1 ring-sky-100 transition hover:bg-sky-100 disabled:opacity-60"
              >
                <Smartphone className="h-4 w-4" />
                שלח התראת בדיקה לטלפון
              </button>
              {testMessage && (
                <p className="mt-2 text-[11px] font-bold text-sky-800">
                  {testMessage}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            {CATEGORIES.map((category) => (
              <div
                key={category.key}
                className={[
                  "flex items-center justify-between gap-2 rounded-2xl border p-3 transition",
                  pushOn
                    ? "border-slate-100 bg-white"
                    : "border-slate-100 bg-slate-50/60",
                ].join(" ")}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                      pushOn && settings[category.key]
                        ? "bg-amber-50 text-red-500 ring-amber-100"
                        : "bg-slate-100 text-slate-400 ring-slate-100",
                    ].join(" ")}
                  >
                    {category.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800">
                      {category.label}
                    </p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={pushOn && settings[category.key]}
                  disabled={!pushOn}
                  onChange={() => handleCategoryToggle(category.key)}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={() => setShowGuide((value) => !value)}
              className="flex w-full items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 text-sm font-black text-slate-800">
                <Smartphone className="h-4 w-4 text-amber-600" />
                איך מקבלים התראות בטלפון?
              </span>
              <span className="text-xs font-black text-amber-600">
                {showGuide ? "הסתר" : "הצג"}
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
                        📱 אייפון
                      </p>
                      <ol className="list-inside list-decimal space-y-0.5">
                        <li>Safari → bizuply.com</li>
                        <li>
                          שיתוף <Share className="inline h-3 w-3" /> → הוסף
                          למסך הבית
                        </li>
                        <li>פתח/י מהאייקון → הפעל/י Push כאן</li>
                      </ol>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        * iOS 16.4+ מהאפליקציה המותקנת בלבד
                      </p>
                    </div>
                    <div>
                      <p className="mb-0.5 font-black text-slate-800">
                        🤖 אנדרואיד
                      </p>
                      <ol className="list-inside list-decimal space-y-0.5">
                        <li>Chrome → התקן אפליקציה</li>
                        <li>הפעל/י Push כאן ואשר/י</li>
                      </ol>
                    </div>
                    <div>
                      <p className="mb-0.5 font-black text-slate-800">💻 מחשב</p>
                      <p>הפעל/י Push כאן ואשר/י בדפדפן.</p>
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
                {installEvent ? "התקן אפליקציה" : "איך מתקינים באייפון"}
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[10px] font-bold text-slate-400">
            התראות בתוך המערכת ימשיכו להופיע תמיד
          </p>
        </div>
      )}
    </div>
  );
}