import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  loadStoredAlerts,
  notifyAdminSupportEvent,
  persistAlerts,
  type AdminSupportAlert,
} from "../../utils/adminSupportAlerts";
import {
  ensurePushSubscription,
  getPermission,
  isSubscribed,
  subscribeToPush,
  type PushPermission,
} from "../../utils/push";

function formatAlertTime(at: number) {
  try {
    return new Intl.DateTimeFormat("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(at));
  } catch {
    return "";
  }
}

function AdminHeader() {
  const { user, logout, socket } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout: () => void;
    socket: any;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [supportBadge, setSupportBadge] = useState(0);
  const [alerts, setAlerts] = useState<AdminSupportAlert[]>(() =>
    loadStoredAlerts()
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushPermission>(getPermission());
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushHint, setPushHint] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  const displayName = user?.name || user?.email || "מנהל";

  const refreshPushState = useCallback(async () => {
    setPushStatus(getPermission());
    try {
      setPushSubscribed(await isSubscribed());
    } catch {
      setPushSubscribed(false);
    }
  }, []);

  const pushAlert = useCallback((alert: AdminSupportAlert) => {
    setAlerts((prev) => {
      const next = [alert, ...prev].slice(0, 30);
      persistAlerts(next);
      return next;
    });
    setSupportBadge((n) => n + 1);
  }, []);

  useEffect(() => {
    void ensurePushSubscription().then(() => {
      void refreshPushState();
    });
  }, [refreshPushState]);

  useEffect(() => {
    if (!socket) return;

    // On the support-chat page, AdminSupportChat owns toast/OS alerts to avoid duplicates.
    const onSupportPage = () =>
      window.location.pathname.startsWith("/admin/support-chat");

    const onVisitorMessage = (payload: any) => {
      if (payload?.message?.senderType !== "visitor") return;
      if (onSupportPage()) {
        setSupportBadge((n) => n + 1);
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
        setSupportBadge((n) => n + 1);
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
        setSupportBadge((n) => n + 1);
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
        const next = [detail, ...prev].slice(0, 30);
        persistAlerts(next);
        return next;
      });
      if (!location.pathname.startsWith("/admin/support-chat")) {
        setSupportBadge((n) => n + 1);
      }
    };
    window.addEventListener("bizuply:adminSupportAlert", onCustom);
    return () =>
      window.removeEventListener("bizuply:adminSupportAlert", onCustom);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/support-chat")) {
      setSupportBadge(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!panelOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [panelOpen]);

  function isActive(path: string) {
    if (path === "/admin/dashboard") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      );
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  function navClass(path: string) {
    return `rounded-2xl px-4 py-3 text-sm font-black transition ${
      isActive(path)
        ? "bg-white text-purple-950 shadow-xl shadow-black/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  async function enablePush() {
    setPushBusy(true);
    setPushHint("");
    try {
      const result = await subscribeToPush();
      await refreshPushState();
      if (!result.ok) {
        setPushHint(
          result.reason === "ios-install"
            ? "באייפון: התקינו למסך הבית (PWA) ואז הפעילו שוב"
            : result.reason === "denied"
              ? "התראות חסומות — אשרו בהגדרות הדפדפן"
              : "לא הצלחנו להפעיל התראות"
        );
        return;
      }
      setPushHint("התראות PWA פעילות");
      await notifyAdminSupportEvent({
        title: "התראות הופעלו",
        body: "תקבלו התראה בזמן אמת על שיחות מלקוחות",
        skipOsNotification: false,
      });
    } finally {
      setPushBusy(false);
    }
  }

  function openAlert(alert: AdminSupportAlert) {
    setPanelOpen(false);
    setSupportBadge(0);
    if (alert.conversationId) {
      navigate(`/admin/support-chat?c=${alert.conversationId}`);
    } else {
      navigate("/admin/support-chat");
    }
  }

  const pushReady = pushStatus === "granted" && pushSubscribed;

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#160825]/95 px-4 py-4 text-right text-white backdrop-blur-xl md:px-8"
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center justify-start gap-3 text-right"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xl shadow-xl shadow-purple-950/40">
            👑
          </span>

          <span>
            <strong className="block text-lg font-black">פאנל ניהול</strong>
            <small className="block text-xs font-bold text-black/50">
              Bizuply Admin
            </small>
          </span>
        </button>

        <nav className="flex gap-2 overflow-x-auto rounded-[24px] border border-white/10 bg-white/5 p-2">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className={navClass("/admin/dashboard")}
          >
            דשבורד
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/early-access")}
            className={navClass("/admin/early-access")}
          >
            הרשמה מוקדמת
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className={navClass("/admin/users")}
          >
            משתמשים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/businesses")}
            className={navClass("/admin/businesses")}
          >
            עסקים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/affiliates")}
            className={navClass("/admin/affiliates")}
          >
            שותפים
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/withdrawals")}
            className={navClass("/admin/withdrawals")}
          >
            משיכות
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/support-chat")}
            className={`${navClass("/admin/support-chat")} relative`}
          >
            צ׳אט תמיכה
            {supportBadge > 0 && (
              <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                {supportBadge > 9 ? "9+" : supportBadge}
              </span>
            )}
          </button>
        </nav>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              onClick={() => {
                setPanelOpen((v) => !v);
                if (!panelOpen) setSupportBadge(0);
              }}
              className="relative inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
              aria-label="התראות תמיכה"
            >
              <Bell size={16} />
              התראות
              {supportBadge > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black">
                  {supportBadge > 9 ? "9+" : supportBadge}
                </span>
              )}
            </button>

            {panelOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-[60] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-violet-100 bg-white text-slate-900 shadow-2xl">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-black">התראות תמיכה</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      בזמן אמת · דפדפן · PWA
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={pushBusy}
                    onClick={() => void enablePush()}
                    className={`rounded-xl px-3 py-1.5 text-[11px] font-bold disabled:opacity-50 ${
                      pushReady
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-violet-700 text-white"
                    }`}
                  >
                    {pushBusy
                      ? "מפעיל..."
                      : pushReady
                        ? "PWA פעיל"
                        : "הפעל PWA"}
                  </button>
                </div>

                {pushHint && (
                  <p className="border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-violet-800">
                    {pushHint}
                  </p>
                )}

                <div className="max-h-80 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs font-medium text-slate-500">
                      אין התראות עדיין. כשלקוח יכתוב — תופיע כאן.
                    </p>
                  ) : (
                    alerts.map((alert) => (
                      <button
                        key={alert.id}
                        type="button"
                        onClick={() => openAlert(alert)}
                        className="block w-full border-b border-slate-50 px-4 py-3 text-right transition hover:bg-violet-50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-black text-slate-900">
                            {alert.title}
                          </p>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {formatAlertTime(alert.at)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] font-medium text-slate-600">
                          {alert.body}
                        </p>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex gap-2 border-t border-slate-100 p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAlerts([]);
                      persistAlerts([]);
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600"
                  >
                    נקה
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPanelOpen(false);
                      navigate("/admin/support-chat");
                    }}
                    className="flex-1 rounded-xl bg-violet-700 px-3 py-2 text-[11px] font-bold text-white"
                  >
                    לצ׳אט תמיכה
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="block text-sm font-black text-black">
              שלום, {displayName}
            </span>
            <small className="block text-xs font-bold text-black/45">
              מנהל מערכת
            </small>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-gradient-to-l from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-black text-black shadow-xl shadow-purple-950/40 transition hover:-translate-y-0.5"
          >
            התנתקות
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
