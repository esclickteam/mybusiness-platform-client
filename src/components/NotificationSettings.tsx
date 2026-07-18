import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "@api";
import {
  Bell,
  BellRing,
  Calendar,
  Check,
  Download,
  Handshake,
  ListChecks,
  Loader2,
  MessageCircle,
  Settings,
  Share,
  Smartphone,
  Star,
  UserPlus,
  X,
} from "lucide-react";
import {
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
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
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    key: "lead",
    label: "לידים חדשים",
    description: "לידים חדשים שנכנסים למערכת",
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    key: "collaboration",
    label: "שיתופי פעולה",
    description: "הצעות, בקשות והסכמי שיתוף פעולה",
    icon: <Handshake className="h-5 w-5" />,
  },
  {
    key: "message",
    label: "הודעות",
    description: "הודעות חדשות מלקוחות ומשותפים עסקיים",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    key: "review",
    label: "ביקורות",
    description: "ביקורות חדשות שהתקבלו על העסק",
    icon: <Star className="h-5 w-5" />,
  },
  {
    key: "task",
    label: "משימות ותזכורות",
    description: "משימות חדשות ותזכורות לטיפול",
    icon: <ListChecks className="h-5 w-5" />,
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
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus:outline-none",
        disabled ? "opacity-40" : "",
        checked
          ? "bg-gradient-to-r from-amber-400 to-red-500"
          : "bg-slate-200",
      ].join(" ")}
    >
      <motion.span
        className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] =
    useState<NotificationSettingsState>(DEFAULT_SETTINGS);

  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<PushPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
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
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setSupported(isPushSupported());
        setPermission(getPermission());

        const [subscribedNow, res] = await Promise.all([
          isSubscribed(),
          API.get("/business/my/notification-settings"),
        ]);

        if (cancelled) return;

        setSubscribed(subscribedNow);

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
  }, [open]);

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
      // Turn OFF push
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

    // Turn ON push
    setBusy(true);
    try {
      const result = await subscribeToPush();
      setPermission(getPermission());

      if (result.ok) {
        setSubscribed(true);
        const next = { ...settings, master: true };
        setSettings(next);
        await persist(next);
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="הגדרות התראות"
        title="הגדרות התראות"
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md"
      >
        <Settings className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[9998] cursor-default bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              dir="rtl"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="fixed left-1/2 top-1/2 z-[9999] flex max-h-[calc(100dvh-3rem)] w-[480px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(15,23,42,0.18)]"
            >
              <div className="relative border-b border-slate-100 p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-500" />

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
                      <BellRing className="h-5 w-5" />
                    </span>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        התראות למכשיר
                      </h3>
                      <p className="mt-0.5 text-xs font-bold text-slate-500">
                        קבל/י התראות ישירות לטלפון ולמחשב — גם כשהמערכת סגורה
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  {!supported && (
                    <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                      הדפדפן הנוכחי לא תומך בהתראות Push. נסה/י דפדפן Chrome / Edge
                      / Firefox מעודכן.
                    </div>
                  )}

                  {supported && permission === "denied" && (
                    <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      התראות חסומות בדפדפן. כדי להפעיל: לחצ/י על אייקון המנעול 🔒
                      שליד כתובת האתר → התראות → אפשר/י, ואז נסה/י שוב.
                    </div>
                  )}

                  {/* Master switch */}
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/70 to-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                        {busy ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          התראות Push על המכשיר הזה
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          {pushOn
                            ? "מופעל — תקבל/י התראות גם כשהמערכת סגורה"
                            : "כבוי — הפעל/י כדי לקבל התראות למכשיר"}
                        </p>
                      </div>
                    </div>

                    <Toggle
                      checked={pushOn}
                      disabled={busy || !supported || permission === "denied"}
                      onChange={handleMasterToggle}
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <div
                        key={category.key}
                        className={[
                          "flex items-center justify-between gap-3 rounded-2xl border p-4 transition",
                          pushOn
                            ? "border-slate-100 bg-white"
                            : "border-slate-100 bg-slate-50/60",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={[
                              "flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition",
                              pushOn && settings[category.key]
                                ? "bg-amber-50 text-red-500 ring-amber-100"
                                : "bg-slate-100 text-slate-400 ring-slate-100",
                            ].join(" ")}
                          >
                            {category.icon}
                          </span>

                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {category.label}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">
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

                  {/* How to install on phone */}
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={() => setShowGuide((value) => !value)}
                      className="flex w-full items-center justify-between gap-3"
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
                          <div className="mt-3 space-y-3 text-xs font-semibold leading-6 text-slate-600">
                            <div>
                              <p className="mb-1 font-black text-slate-800">
                                📱 אייפון (iPhone)
                              </p>
                              <ol className="list-inside list-decimal space-y-1">
                                <li>
                                  פתח/י את bizuply.com בדפדפן Safari.
                                </li>
                                <li>
                                  לחצ/י על כפתור השיתוף{" "}
                                  <Share className="inline h-3.5 w-3.5" /> בתחתית
                                  המסך.
                                </li>
                                <li>בחר/י "הוסף למסך הבית".</li>
                                <li>
                                  פתח/י את BizUply מהאייקון החדש, וחזר/י לכאן
                                  להפעיל התראות.
                                </li>
                              </ol>
                              <p className="mt-1 text-[11px] text-slate-400">
                                * באייפון התראות עובדות רק מהאפליקציה המותקנת
                                (iOS 16.4 ומעלה).
                              </p>
                            </div>

                            <div>
                              <p className="mb-1 font-black text-slate-800">
                                🤖 אנדרואיד (Android)
                              </p>
                              <ol className="list-inside list-decimal space-y-1">
                                <li>פתח/י את bizuply.com בדפדפן Chrome.</li>
                                <li>
                                  לחצ/י על "התקן אפליקציה" למטה (או בתפריט ⋮ →
                                  "התקנת אפליקציה").
                                </li>
                                <li>
                                  הפעל/י כאן את מתג "התראות Push" ואשר/י את
                                  הבקשה.
                                </li>
                              </ol>
                            </div>

                            <div>
                              <p className="mb-1 font-black text-slate-800">
                                💻 מחשב
                              </p>
                              <p>
                                פשוט הפעל/י את מתג "התראות Push" למעלה ואשר/י את
                                הבקשה מהדפדפן.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {(installEvent || iosNeedsInstall) && (
                      <button
                        type="button"
                        onClick={handleInstall}
                        className="mt-3 inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        <Download className="h-4 w-4" />
                        {installEvent ? "התקן אפליקציה" : "איך מתקינים באייפון"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400">
                  התראות בתוך המערכת ימשיכו להופיע תמיד
                </p>

                <span
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-2xl px-4 text-sm font-black transition",
                    saved
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-transparent",
                  ].join(" ")}
                >
                  {saved && <Check className="h-4 w-4" />}
                  {saved ? "נשמר" : ""}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
