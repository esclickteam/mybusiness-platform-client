import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "@api";
import {
  Bell,
  Calendar,
  Check,
  Handshake,
  ListChecks,
  Loader2,
  Mail,
  MessageCircle,
  Settings,
  Star,
  UserPlus,
  X,
} from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] =
    useState<NotificationSettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await API.get("/business/my/notification-settings");

        if (!cancelled && res.data?.ok && res.data.settings) {
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

  function toggle(key: keyof NotificationSettingsState) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      const res = await API.put("/business/my/notification-settings", {
        settings,
      });

      if (res.data?.ok && res.data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    } finally {
      setSaving(false);
    }
  }

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
              className="fixed left-1/2 top-1/2 z-[9999] flex max-h-[calc(100dvh-3rem)] w-[460px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(15,23,42,0.18)]"
            >
              <div className="relative border-b border-slate-100 p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-500" />

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
                      <Mail className="h-5 w-5" />
                    </span>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        התראות במייל
                      </h3>
                      <p className="mt-0.5 text-xs font-bold text-slate-500">
                        בחר/י על אילו התראות לקבל עדכון למייל
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
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/70 to-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                        <Bell className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          קבלת התראות במייל
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          מתג ראשי לכל התראות המייל
                        </p>
                      </div>
                    </div>

                    <Toggle
                      checked={settings.master}
                      onChange={() => toggle("master")}
                    />
                  </div>

                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <div
                        key={category.key}
                        className={[
                          "flex items-center justify-between gap-3 rounded-2xl border p-4 transition",
                          settings.master
                            ? "border-slate-100 bg-white"
                            : "border-slate-100 bg-slate-50/60",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={[
                              "flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition",
                              settings.master && settings[category.key]
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
                          checked={settings.master && settings[category.key]}
                          disabled={!settings.master}
                          onChange={() => toggle(category.key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400">
                  התראות בתוך המערכת ימשיכו להופיע תמיד
                </p>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || loading}
                  className={[
                    "inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-black text-white shadow-sm transition disabled:opacity-60",
                    saved
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-amber-500 to-red-500 hover:brightness-105",
                  ].join(" ")}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : saved ? (
                    <Check className="h-4 w-4" />
                  ) : null}
                  {saved ? "נשמר" : "שמירה"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
