import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Headphones,
  ListChecks,
  Loader2,
  Settings,
  Smartphone,
  X,
} from "lucide-react";

import API from "../api";
import { useAuth } from "../context/AuthContext";
import {
  ADMIN_FLOATING_PANEL_COMPACT_CLASS,
  ADMIN_MOBILE_BACKDROP_CLASS,
} from "../utils/adminResponsive";
import {
  loadStoredAlerts,
  notifyAdminSupportEvent,
  persistAlerts,
  type AdminSupportAlert,
} from "../utils/adminSupportAlerts";
import {
  ensurePushSubscription,
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  type PushPermission,
} from "../utils/push";

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

function timeAgo(at: number) {
  const diff = (Date.now() - at) / 1000;
  if (diff < 60) return "עכשיו";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע׳`;
  try {
    return new Date(at).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return "";
  }
}

function AdminPushSettings({
  active,
  onBack,
}: {
  active: boolean;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<PushPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [testMessage, setTestMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setSupported(isPushSupported());
        setPermission(getPermission());
        setTestMessage("");

        if (getPermission() === "granted") {
          await ensurePushSubscription();
        }

        const [subscribedNow, statusRes] = await Promise.all([
          isSubscribed(),
          API.get("/push/status").catch(() => null),
        ]);

        if (cancelled) return;
        setSubscribed(subscribedNow);
        setServerReady(Boolean(statusRes?.data?.ready));
        setDeviceCount(
          Number(
            statusRes?.data?.myDeviceCount ||
              statusRes?.data?.deviceCount ||
              0
          )
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active]);

  const pushOn = subscribed && permission === "granted";
  const iosNeedsInstall = isIos() && !isStandalone();

  async function handleMasterToggle() {
    if (busy) return;

    if (pushOn) {
      setBusy(true);
      try {
        await unsubscribeFromPush();
        setSubscribed(false);
        setServerReady(false);
        setDeviceCount(0);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1600);
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(true);
    try {
      if (iosNeedsInstall) {
        setShowIosGuide(true);
        return;
      }
      const result = await subscribeToPush();
      setPermission(getPermission());
      if (!result.ok) {
        if (result.reason === "ios-install") setShowIosGuide(true);
        if (result.reason === "unsupported") setSupported(false);
        setTestMessage(
          result.reason === "denied"
            ? "התראות חסומות בדפדפן — אשרו בהגדרות האתר"
            : "לא הצלחנו להפעיל התראות Push"
        );
        return;
      }
      setSubscribed(true);
      const statusRes = await API.get("/push/status").catch(() => null);
      setServerReady(Boolean(statusRes?.data?.ready));
      setDeviceCount(
        Number(
          statusRes?.data?.myDeviceCount || statusRes?.data?.deviceCount || 1
        )
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
      setTestMessage("התראות PWA הופעלו — תקבלו Push על הודעות מלקוחות");
    } finally {
      setBusy(false);
    }
  }

  async function handleTestPush() {
    if (busy) return;
    setBusy(true);
    setTestMessage("");
    try {
      const ensure = await ensurePushSubscription();
      if (!ensure.ok) {
        if (ensure.reason === "ios-install") setShowIosGuide(true);
        setTestMessage("צריך להפעיל קודם את התראות ה-Push");
        return;
      }
      const res = await API.post("/push/test-admin");
      setServerReady(Boolean(res.data?.ok || res.data?.pushed > 0));
      setDeviceCount(Number(res.data?.pushed || deviceCount));
      setTestMessage(res.data?.message || "נשלחה התראת בדיקה");
    } catch (err: any) {
      setTestMessage(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "שליחת בדיקה נכשלה"
      );
    } finally {
      setBusy(false);
    }
  }

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
                הגדרות התראות אדמין
              </h3>
              <p className="truncate text-[11px] font-bold text-slate-500">
                Push / PWA — רק צ׳אט תמיכה מלקוחות
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
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
          {!supported && (
            <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              הדפדפן לא תומך בהתראות Push.
            </div>
          )}
          {supported && permission === "denied" && (
            <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              התראות חסומות. אשרו בהגדרות האתר (🔒 ליד הכתובת).
            </div>
          )}
          {(iosNeedsInstall || showIosGuide) && (
            <div className="mb-2 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-xs font-bold text-orange-800">
              באייפון: Safari → שיתוף → הוסף למסך הבית, ואז פתחו מהאייקון
              והפעילו התראות.
            </div>
          )}

          <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50/70 to-white p-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                      ? `מופעל · ${deviceCount || 1} מכשיר רשום`
                      : "מופעל במכשיר — לחצו בדיקה לרישום בשרת"
                    : "כבוי — הפעילו לקבלת הודעות מלקוחות בטלפון"}
                </p>
              </div>
            </div>
            <Toggle
              checked={pushOn}
              disabled={busy || !supported || permission === "denied"}
              onChange={() => void handleMasterToggle()}
            />
          </div>

          {pushOn && (
            <div className="mb-2 rounded-2xl border border-sky-100 bg-sky-50 p-3">
              <button
                type="button"
                onClick={() => void handleTestPush()}
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

          <div className="rounded-2xl border border-slate-100 bg-white p-3">
            <div className="flex items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-red-500 ring-1 ring-amber-100">
                <Headphones className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-black text-slate-900">
                  צ׳אט תמיכה מלקוחות
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500">
                  תקבלו התראה כשלקוח מבקש נציג או שולח הודעה בשיחת תמיכה חיה.
                </p>
              </div>
              <Toggle checked disabled onChange={() => {}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Admin notifications bell — same chrome as business customer notifications,
 * but only support-chat alerts + admin PWA push.
 */
export default function AdminNotifications() {
  const { socket } = useAuth() as { socket: any };
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [panelView, setPanelView] = useState<"list" | "settings">("list");
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [alerts, setAlerts] = useState<AdminSupportAlert[]>(() =>
    loadStoredAlerts()
  );
  const [badge, setBadge] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts]
  );

  const filtered = useMemo(() => {
    if (tab === "unread") return alerts.filter((a) => !a.read);
    return alerts;
  }, [alerts, tab]);

  const pushAlert = useCallback((alert: AdminSupportAlert) => {
    setAlerts((prev) => {
      if (prev.some((a) => a.id === alert.id)) return prev;
      const next = [alert, ...prev].slice(0, 40);
      persistAlerts(next);
      return next;
    });
    setBadge((n) => n + 1);
  }, []);

  useEffect(() => {
    void ensurePushSubscription().catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onSupportPage = () =>
      window.location.pathname.startsWith("/admin/support-chat");

    const onVisitorMessage = (payload: any) => {
      if (payload?.message?.senderType !== "visitor") return;
      if (onSupportPage()) {
        setBadge((n) => n + 1);
        return;
      }
      const conversationId = payload?.conversation?._id
        ? String(payload.conversation._id)
        : null;
      const name = payload?.conversation?.name || "לקוח";
      const body = payload?.message?.text || "הודעה חדשה";
      void notifyAdminSupportEvent({
        title: "הודעה חדשה מלקוח",
        body: `${name}: ${body}`,
        conversationId,
        skipOsNotification: false,
      }).then((alert) => {
        if (alert) pushAlert(alert);
      });
    };

    const onNotify = (payload: any) => {
      if (onSupportPage()) {
        setBadge((n) => n + 1);
        return;
      }
      const conversationId =
        payload?.conversationId || payload?.conversation?._id || null;
      void notifyAdminSupportEvent({
        title: payload?.title || "פניית תמיכה",
        body: payload?.body || "יש פנייה חדשה מלקוח",
        conversationId,
        skipOsNotification: false,
      }).then((alert) => {
        if (alert) pushAlert(alert);
      });
    };

    const onWaiting = (payload: any) => {
      if (onSupportPage()) {
        setBadge((n) => n + 1);
        return;
      }
      const conversation = payload?.conversation;
      void notifyAdminSupportEvent({
        title: "לקוח ממתין לנציג",
        body: `${conversation?.name || "אורח"} מבקש נציג אנושי`,
        conversationId: conversation?._id,
        skipOsNotification: false,
      }).then((alert) => {
        if (alert) pushAlert(alert);
      });
    };

    socket.emit("joinRoom", "admin-support");
    socket.on("support:notify", onNotify);
    socket.on("support:waiting", onWaiting);
    socket.on("support:newMessage", onVisitorMessage);

    return () => {
      socket.off("support:notify", onNotify);
      socket.off("support:waiting", onWaiting);
      socket.off("support:newMessage", onVisitorMessage);
    };
  }, [socket, pushAlert]);

  useEffect(() => {
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<AdminSupportAlert>).detail;
      if (!detail?.id) return;
      setAlerts((prev) => {
        if (prev.some((a) => a.id === detail.id)) return prev;
        const next = [{ ...detail, read: detail.read ?? false }, ...prev].slice(
          0,
          40
        );
        persistAlerts(next);
        return next;
      });
      if (!location.pathname.startsWith("/admin/support-chat")) {
        setBadge((n) => n + 1);
      }
    };
    window.addEventListener("bizuply:adminSupportAlert", onCustom);
    return () =>
      window.removeEventListener("bizuply:adminSupportAlert", onCustom);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/support-chat")) {
      setBadge(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setPanelView("list");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function closePanel() {
    setOpen(false);
    setPanelView("list");
  }

  function markAllRead() {
    setAlerts((prev) => {
      const next = prev.map((a) => ({ ...a, read: true }));
      persistAlerts(next);
      return next;
    });
    setBadge(0);
  }

  function openAlert(alert: AdminSupportAlert) {
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alert.id ? { ...a, read: true } : a
      );
      persistAlerts(next);
      return next;
    });
    closePanel();
    setBadge(0);
    if (alert.conversationId) {
      navigate(`/admin/support-chat?c=${alert.conversationId}`);
    } else {
      navigate("/admin/support-chat");
    }
  }

  const displayBadge = Math.max(badge, unreadCount);

  return (
    <div className="inline-flex" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => {
            if (v) setPanelView("list");
            else setBadge(0);
            return !v;
          });
        }}
        aria-label="התראות תמיכה"
        className={[
          "relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-12 sm:w-12",
          displayBadge > 0
            ? "border-amber-200 from-amber-50 to-white hover:border-amber-300"
            : "border-slate-200 from-white to-white hover:border-amber-200 hover:from-amber-50",
        ].join(" ")}
      >
        <motion.span
          className="inline-flex"
          style={{ transformOrigin: "50% 4px" }}
          animate={
            displayBadge > 0
              ? { rotate: [0, -16, 13, -11, 9, -6, 4, 0] }
              : { rotate: 0 }
          }
          transition={
            displayBadge > 0
              ? {
                  duration: 1.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }
              : { duration: 0.2 }
          }
        >
          <Bell
            className="h-6 w-6 fill-amber-400 text-red-500 drop-shadow-[0_1px_1px_rgba(220,38,38,0.35)]"
            strokeWidth={2.2}
          />
        </motion.span>

        {displayBadge > 0 && (
          <>
            <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-5 w-5 animate-ping rounded-full bg-red-400/50" />
            <motion.span
              key={displayBadge}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [1.6, 1], opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1.5 text-[11px] font-black text-white shadow-sm ring-2 ring-white"
            >
              {displayBadge > 99 ? "99+" : displayBadge}
            </motion.span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.button
            key="admin-notifications-backdrop"
            type="button"
            aria-label="סגור התראות"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={ADMIN_MOBILE_BACKDROP_CLASS}
            onClick={closePanel}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.18 }}
            className={ADMIN_FLOATING_PANEL_COMPACT_CLASS}
            dir="rtl"
          >
            <div className="mx-auto mb-1 mt-2 h-1.5 w-12 shrink-0 rounded-full bg-slate-200 sm:hidden" />
            {panelView === "settings" ? (
              <AdminPushSettings
                active={panelView === "settings"}
                onBack={() => setPanelView("list")}
              />
            ) : (
              <>
                <div className="relative shrink-0 border-b border-slate-100 bg-white p-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-500" />
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
                        <Bell className="h-5 w-5 fill-amber-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-slate-900">
                          התראות
                        </p>
                        <p className="truncate text-[11px] font-bold text-slate-500">
                          צ׳אט תמיכה · הודעות מלקוחות
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPanelView("settings")}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        aria-label="הגדרות התראות"
                        title="הגדרות התראות"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={closePanel}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        aria-label="סגור"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-2 border-b border-slate-100 bg-white p-3">
                  <button
                    type="button"
                    onClick={() => setTab("all")}
                    className={[
                      "h-11 rounded-2xl text-sm font-black transition",
                      tab === "all"
                        ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    ].join(" ")}
                  >
                    הכל
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("unread")}
                    className={[
                      "h-11 rounded-2xl text-sm font-black transition",
                      tab === "unread"
                        ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    ].join(" ")}
                  >
                    לא נקראו
                  </button>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      עדכונים אחרונים
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {unreadCount > 0
                        ? `${unreadCount} לא נקראו`
                        : "אין לא נקראו"}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                    >
                      <CheckCheck className="h-4 w-4" />
                      סמן הכל
                    </button>
                  )}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                  {filtered.length === 0 ? (
                    <div className="flex min-h-[230px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-10 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">
                        <ListChecks className="h-7 w-7" />
                      </div>
                      <p className="text-base font-black text-slate-800">
                        אין התראות עדיין
                      </p>
                      <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-400">
                        כשלקוח ישלח הודעה בצ׳אט התמיכה — תופיע כאן ותישלח גם
                        ב־PWA.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filtered.map((alert) => (
                        <button
                          type="button"
                          key={alert.id}
                          onClick={() => openAlert(alert)}
                          className={[
                            "group relative flex w-full items-start gap-3 rounded-3xl border p-4 text-start transition",
                            alert.read
                              ? "border-slate-100 bg-white opacity-75 hover:bg-slate-50"
                              : "border-sky-100 bg-gradient-to-l from-sky-50/80 via-white to-white shadow-sm hover:shadow-md",
                          ].join(" ")}
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                            <Headphones className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="mb-2 flex items-center justify-between gap-2">
                              <span className="inline-flex shrink-0 items-center rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-black text-sky-700 ring-1 ring-sky-100">
                                צ׳אט תמיכה
                              </span>
                              <span className="shrink-0 text-[11px] font-black text-slate-400">
                                {timeAgo(alert.at)}
                              </span>
                            </span>
                            <span className="block truncate text-sm font-black text-slate-800">
                              {alert.title}
                            </span>
                            <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                              {alert.body}
                            </span>
                          </span>
                          {!alert.read && (
                            <span className="absolute end-4 top-5 h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.16)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-slate-100 p-3">
                  <button
                    type="button"
                    onClick={() => {
                      closePanel();
                      navigate("/admin/support-chat");
                    }}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-amber-400 to-red-500 text-sm font-black text-white shadow-sm"
                  >
                    <Headphones className="h-4 w-4" />
                    לצ׳אט תמיכה
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
