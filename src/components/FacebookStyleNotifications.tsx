import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "@api";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  CheckCheck,
  Clock3,
  Flame,
  ListChecks,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

type NotificationTab = "all" | "unread";

type NotificationKind = "regular" | "task_due" | "new_lead";

type SystemNotification = {
  id?: string;
  _id?: string;
  notificationId?: string;

  title?: string;
  text?: string;
  message?: string;

  timestamp?: string;
  createdAt?: string;
  read?: boolean;

  leadId?: string;
  activityId?: string;
  kind?: NotificationKind;

  targetUrl?: string;
  conversationId?: string;
  threadId?: string;
  type?: string;

  agreementId?: string;
  proposalId?: string;
  collaborationId?: string;
  partnershipAgreementId?: string;
};

type LeadReminder = {
  leadId: string;
  activityId: string;
  leadName: string;
  phone?: string;
  text: string;
  taskDueAt: string;
  createdBy?: string;
  createdAt?: string;
};

type Lead = {
  _id: string;
  name?: string;
  fullName?: string;
  phone?: string;
  createdAt?: string;
};

type UnifiedNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  text: string;
  timestamp: string;
  read: boolean;

  leadId?: string;
  activityId?: string;
  leadName?: string;
  phone?: string;
  taskDueAt?: string;

  targetUrl?: string;
  conversationId?: string;
  threadId?: string;
  type?: string;

  agreementId?: string;
  proposalId?: string;
  collaborationId?: string;
  partnershipAgreementId?: string;

  raw?: unknown;
};

type OpenLeadPayload = {
  leadId: string;
  activityId?: string;
  kind?: NotificationKind;
};

export default function FacebookStyleNotifications() {
  const { user, socket } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<UnifiedNotification[]>([]);

  const toastTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const notificationsRef = useRef<UnifiedNotification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const businessId = user?.businessId || "";

  const seenLeadsKey = businessId
    ? `bizuply_seen_lead_ids_${businessId}`
    : "bizuply_seen_lead_ids";

  const readLocalNotificationsKey = businessId
    ? `bizuply_read_local_notifications_${businessId}`
    : "bizuply_read_local_notifications";

  useEffect(() => {
    if (!businessId) return;

    fetchAllNotifications();

    const interval = window.setInterval(fetchAllNotifications, 60 * 1000);

    return () => window.clearInterval(interval);
  }, [businessId]);

  /* ============================
     Real-time notifications (Facebook style)
     ============================ */
  function ingestRealtimeNotification(data?: SystemNotification | null) {
    if (!data || typeof data !== "object") return;

    const unified = mapSystemNotification(data);

    if (!unified.id) return;

    /*
      Decide whether to pop a toast BEFORE calling setState.
      Using a ref keeps this synchronous and reliable (functional
      setState updaters are not guaranteed to run synchronously).

      Some notifications are upserted server-side (e.g. business-to-business
      chat reuses the same notification id per conversation), so a repeated
      unread message must still toast even though the id already exists.
    */
    const existing = notificationsRef.current.find(
      (item) => item.id === unified.id
    );

    const isNewer = existing
      ? new Date(unified.timestamp).getTime() >
        new Date(existing.timestamp).getTime()
      : false;

    const becameUnread = existing ? existing.read && !unified.read : false;

    const shouldToast =
      !unified.read && (!existing || isNewer || becameUnread);

    setNotifications((prev) => {
      const found = prev.find((item) => item.id === unified.id);

      const next = found
        ? prev.map((item) =>
            item.id === unified.id ? { ...item, ...unified } : item
          )
        : [unified, ...prev];

      return next.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    if (shouldToast) {
      showToast(unified);
    }
  }

  /* Channel 1: Redis-relayed events forwarded by src/socket.js */
  useEffect(() => {
    if (!businessId) return;

    const handleBusinessUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail;

      if (!detail || typeof detail !== "object") return;

      const { type, data } = detail as {
        type?: string;
        data?: SystemNotification;
      };

      if (type !== "newNotification") return;

      ingestRealtimeNotification(data);
    };

    window.addEventListener("biz:businessUpdates", handleBusinessUpdate);

    return () => {
      window.removeEventListener("biz:businessUpdates", handleBusinessUpdate);
    };
  }, [businessId]);

  /* Channel 2: direct socket events (e.g. appointments emit "newNotification") */
  useEffect(() => {
    if (!businessId || !socket) return;

    const handleNewNotification = (data: SystemNotification) => {
      ingestRealtimeNotification(data);
    };

    const joinRoom = () => {
      socket.emit("joinBusinessRoom", businessId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("newNotification", handleNewNotification);
    };
  }, [businessId, socket]);

  useEffect(() => {
    const timers = toastTimersRef.current;

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function showToast(notification: UnifiedNotification) {
    setToasts((prev) => {
      const others = prev.filter((item) => item.id !== notification.id);
      return [notification, ...others].slice(0, 4);
    });

    if (toastTimersRef.current[notification.id]) {
      clearTimeout(toastTimersRef.current[notification.id]);
    }

    toastTimersRef.current[notification.id] = setTimeout(() => {
      dismissToast(notification.id);
    }, 5200);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((item) => item.id !== id));

    if (toastTimersRef.current[id]) {
      clearTimeout(toastTimersRef.current[id]);
      delete toastTimersRef.current[id];
    }
  }

  function getStoredArray(key: string) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setStoredArray(key: string, value: string[]) {
    localStorage.setItem(key, JSON.stringify(Array.from(new Set(value))));
  }

  function normalizeDate(value?: string) {
    if (!value) return new Date().toISOString();

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return new Date().toISOString();
    }

    return date.toISOString();
  }

  function getLeadName(lead: Lead) {
    return lead?.name || lead?.fullName || "ליד ללא שם";
  }

  function getNotificationId(notification: SystemNotification) {
    return (
      notification?.id ||
      notification?._id ||
      notification?.notificationId ||
      `notification-${
        notification?.timestamp ||
        notification?.createdAt ||
        crypto.randomUUID()
      }`
    );
  }

  function getDashboardCrmPath() {
    return `/business/${businessId}/dashboard/crm/leads`;
  }

  function getCollabMessagesPath(conversationId?: string) {
    const base = `/business/${businessId}/dashboard/collab/messages?tab=chat`;

    if (!conversationId) return base;

    return `${base}&conversationId=${conversationId}`;
  }

  function getConversationIdFromTargetUrl(targetUrl?: string) {
    if (!targetUrl) return "";

    try {
      const queryString = targetUrl.includes("?")
        ? targetUrl.split("?")[1]
        : "";

      const params = new URLSearchParams(queryString);

      return params.get("conversationId") || "";
    } catch {
      return "";
    }
  }

  function getAgreementIdFromTargetUrl(targetUrl?: string) {
    if (!targetUrl) return "";

    try {
      const queryString = targetUrl.includes("?")
        ? targetUrl.split("?")[1]
        : "";

      const params = new URLSearchParams(queryString);

      return (
        params.get("agreementId") ||
        params.get("partnershipAgreementId") ||
        params.get("proposalId") ||
        params.get("collaborationId") ||
        ""
      );
    } catch {
      return "";
    }
  }

  function getAgreementIdFromNotification(notification?: UnifiedNotification) {
    if (!notification) return "";

    return (
      notification.agreementId ||
      notification.partnershipAgreementId ||
      getAgreementIdFromTargetUrl(notification.targetUrl) ||
      ""
    );
  }

  function getCollabAgreementsPath(notification?: UnifiedNotification) {
    const params = new URLSearchParams();

    params.set("tab", "received");

    const agreementId = getAgreementIdFromNotification(notification);

    if (agreementId) {
      params.set("agreementId", agreementId);
    }

    return `/business/${businessId}/dashboard/collab/messages?${params.toString()}`;
  }

  function isCollaborationAgreementNotification(
    notification: UnifiedNotification
  ) {
    const targetUrl = notification.targetUrl || "";
    const text = `${notification.title || ""} ${
      notification.text || ""
    }`.toLowerCase();

    const hasAgreementTarget =
      targetUrl.includes("/dashboard/collab/messages") &&
      (targetUrl.includes("tab=agreements") ||
        targetUrl.includes("tab=received") ||
        targetUrl.includes("tab=accepted") ||
        targetUrl.includes("agreementId") ||
        targetUrl.includes("partnershipAgreementId") ||
        targetUrl.includes("proposalId") ||
        targetUrl.includes("collaborationId"));

    return (
      notification.type === "agreement" ||
      notification.type === "proposal" ||
      notification.type === "collaboration" ||
      Boolean(notification.agreementId) ||
      Boolean(notification.partnershipAgreementId) ||
      Boolean(getAgreementIdFromTargetUrl(notification.targetUrl)) ||
      hasAgreementTarget ||
      text.includes("agreement") ||
      text.includes("partnership") ||
      text.includes("collaboration request") ||
      text.includes("collaboration agreement") ||
      text.includes("new collaboration request") ||
      text.includes("new collaboration request from") ||
      text.includes("הסכם") ||
      text.includes("שיתוף פעולה")
    );
  }

  function isBusinessChatNotification(notification: UnifiedNotification) {
    const targetUrl = notification.targetUrl || "";
    const text = `${notification.title || ""} ${notification.text || ""}`;

    return (
      notification.type === "message" ||
      Boolean(notification.conversationId) ||
      Boolean(notification.threadId) ||
      targetUrl.includes("/dashboard/collab/messages") ||
      targetUrl.includes("/conversations/") ||
      text.includes("שותף עסקי") ||
      text.toLowerCase().includes("business partner") ||
      text.toLowerCase().includes("new message from a business partner")
    );
  }

  function getConversationIdFromNotification(notification: UnifiedNotification) {
    return (
      notification.conversationId ||
      notification.threadId ||
      getConversationIdFromTargetUrl(notification.targetUrl) ||
      ""
    );
  }

  function openLeadFromAnywhere(payload: OpenLeadPayload) {
    if (!payload.leadId) return;

    const detail = {
      leadId: payload.leadId,
      activityId: payload.activityId || "",
      kind: payload.kind || "regular",
    };

    sessionStorage.setItem(
      "bizuply_open_lead_request",
      JSON.stringify(detail)
    );

    window.dispatchEvent(
      new CustomEvent("bizuply:open-lead", {
        detail,
      })
    );

    navigate(getDashboardCrmPath());
  }

  function mapSystemNotification(item: SystemNotification): UnifiedNotification {
    const kind: NotificationKind =
      item.kind === "task_due" ||
      item.kind === "new_lead" ||
      item.kind === "regular"
        ? item.kind
        : "regular";

    return {
      id: getNotificationId(item),
      kind,
      title: item.title || "התראה",
      text: item.text || item.message || "התראה חדשה",
      timestamp: normalizeDate(item.timestamp || item.createdAt),
      read: Boolean(item.read),

      leadId: item.leadId || "",
      activityId: item.activityId || "",

      targetUrl: item.targetUrl || "",
      conversationId: item.conversationId || "",
      threadId: item.threadId || "",
      type: item.type || "",

      agreementId: item.agreementId || "",
      proposalId: item.proposalId || "",
      collaborationId: item.collaborationId || "",
      partnershipAgreementId: item.partnershipAgreementId || "",

      raw: item,
    };
  }

  async function fetchRegularNotifications(): Promise<UnifiedNotification[]> {
    try {
      const res = await API.get("/business/my/notifications");

      if (!res.data?.ok && !res.data?.success) return [];

      const list: SystemNotification[] = Array.isArray(res.data.notifications)
        ? res.data.notifications
        : [];

      return list.map((item) => mapSystemNotification(item));
    } catch (err) {
      console.error("Error fetching regular notifications:", err);
      return [];
    }
  }

  async function fetchDueTaskNotifications(): Promise<UnifiedNotification[]> {
    try {
      const res = await API.get("/crm/leads/reminders/due");

      if (!res.data?.success) return [];

      const reminders: LeadReminder[] = Array.isArray(res.data.reminders)
        ? res.data.reminders
        : [];

      const readLocal = getStoredArray(readLocalNotificationsKey);

      return reminders.map((item) => {
        const id = `task-${item.leadId}-${item.activityId}`;

        return {
          id,
          kind: "task_due",
          title: `משימה ללקוח: ${item.leadName || "ליד ללא שם"}`,
          text: item.text || "יש משימה שהגיע זמן הטיפול שלה",
          timestamp: normalizeDate(item.taskDueAt || item.createdAt),
          read: readLocal.includes(id),
          leadId: item.leadId,
          activityId: item.activityId,
          leadName: item.leadName || "ליד ללא שם",
          phone: item.phone || "",
          taskDueAt: item.taskDueAt,
          raw: item,
        };
      });
    } catch (err) {
      console.error("Error fetching due task reminders:", err);
      return [];
    }
  }

  async function fetchNewLeadNotifications(): Promise<UnifiedNotification[]> {
    try {
      const res = await API.get("/crm/leads/my");

      if (!res.data?.success) return [];

      const leads: Lead[] = Array.isArray(res.data.leads) ? res.data.leads : [];
      const leadIds = leads.map((lead) => lead._id).filter(Boolean);

      const storageExists = localStorage.getItem(seenLeadsKey);

      if (!storageExists) {
        setStoredArray(seenLeadsKey, leadIds);
        return [];
      }

      const seenIds = getStoredArray(seenLeadsKey);

      const newLeads = leads.filter(
        (lead) => lead?._id && !seenIds.includes(lead._id)
      );

      return newLeads.map((lead) => ({
        id: `lead-${lead._id}`,
        kind: "new_lead",
        title: `ליד חדש: ${getLeadName(lead)}`,
        text: "נכנס ליד חדש למערכת",
        timestamp: normalizeDate(lead.createdAt),
        read: false,
        leadId: lead._id,
        leadName: getLeadName(lead),
        phone: lead.phone || "",
        raw: lead,
      }));
    } catch (err) {
      console.error("Error fetching new lead notifications:", err);
      return [];
    }
  }

  async function fetchAllNotifications() {
    try {
      setLoading(true);

      const [regular, dueTasks, newLeads] = await Promise.all([
        fetchRegularNotifications(),
        fetchDueTaskNotifications(),
        fetchNewLeadNotifications(),
      ]);

      const map = new Map<string, UnifiedNotification>();

      [...newLeads, ...dueTasks, ...regular].forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });

      const merged = Array.from(map.values()).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(merged);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notification: UnifiedNotification) {
    try {
      if (notification.kind === "regular") {
        await API.put(`/business/my/notifications/${notification.id}/read`);
      }

      if (
        notification.kind === "task_due" &&
        notification.leadId &&
        notification.activityId
      ) {
        await API.patch(
          `/crm/leads/${notification.leadId}/activities/${notification.activityId}/notification-shown`
        );

        const readLocal = getStoredArray(readLocalNotificationsKey);
        setStoredArray(readLocalNotificationsKey, [
          ...readLocal,
          notification.id,
        ]);
      }

      if (notification.kind === "new_lead" && notification.leadId) {
        const seenIds = getStoredArray(seenLeadsKey);
        setStoredArray(seenLeadsKey, [...seenIds, notification.leadId]);
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }

  async function openNotificationTarget(notification: UnifiedNotification) {
    await markAsRead(notification);

    setOpen(false);

    if (isCollaborationAgreementNotification(notification)) {
      const agreementId = getAgreementIdFromNotification(notification);

      navigate(getCollabAgreementsPath(notification), {
        state: {
          openAgreement: true,
          agreementId,
        },
      });

      return;
    }

    if (isBusinessChatNotification(notification)) {
      const conversationId = getConversationIdFromNotification(notification);
      const targetPath = getCollabMessagesPath(conversationId);

      navigate(targetPath, {
        state: {
          conversationId,
        },
      });

      return;
    }

    if (notification.leadId) {
      openLeadFromAnywhere({
        leadId: notification.leadId,
        activityId: notification.activityId || "",
        kind: notification.kind,
      });

      return;
    }

    if (notification.targetUrl) {
      navigate(notification.targetUrl);
      return;
    }

    if (notification.kind === "regular") {
      navigate(`/business/${businessId}/dashboard`);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((item) => !item.read);

    for (const item of unread) {
      await markAsRead(item);
    }
  }

  const filtered = useMemo(() => {
    if (tab === "unread") {
      return notifications.filter((n) => !n.read);
    }

    return notifications;
  }, [tab, notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  function timeAgo(timestamp: string) {
    const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;

    if (diff < 60) return "עכשיו";
    if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק׳`;
    if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שעות`;

    return new Date(timestamp).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatDateTime(value?: string) {
    if (!value) return "";

    return new Date(value).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getIcon(kind: NotificationKind) {
    if (kind === "task_due") return <Clock3 className="h-5 w-5" />;
    if (kind === "new_lead") return <Flame className="h-5 w-5" />;
    return <Bell className="h-5 w-5" />;
  }

  function getKindClasses(kind: NotificationKind) {
    if (kind === "task_due") {
      return {
        icon: "bg-sky-50 text-sky-700 ring-sky-100",
        badge: "bg-sky-50 text-sky-700 ring-sky-100",
      };
    }

    if (kind === "new_lead") {
      return {
        icon: "bg-sky-50 text-sky-700 ring-sky-100",
        badge: "bg-sky-50 text-sky-700 ring-sky-100",
      };
    }

    return {
      icon: "bg-sky-50 text-sky-700 ring-sky-100",
      badge: "bg-sky-50 text-sky-700 ring-sky-100",
    };
  }

  function getTypeLabel(kind: NotificationKind) {
    if (kind === "task_due") return "משימה ללקוח";
    if (kind === "new_lead") return "ליד חדש";
    return "התראה";
  }

  function toggleOpen() {
    setOpen((value) => !value);
  }

  if (!businessId) return null;

  return (
    <div className="inline-flex">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="התראות"
        className={[
          "relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
          unreadCount > 0
            ? "border-amber-200 from-amber-50 to-white hover:border-amber-300"
            : "border-slate-200 from-white to-white hover:border-amber-200 hover:from-amber-50",
        ].join(" ")}
      >
        <motion.span
          className="inline-flex"
          style={{ transformOrigin: "50% 4px" }}
          animate={
            unreadCount > 0
              ? { rotate: [0, -16, 13, -11, 9, -6, 4, 0] }
              : { rotate: 0 }
          }
          transition={
            unreadCount > 0
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

        {unreadCount > 0 && (
          <>
            <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-red-400/50 animate-ping" />

            <motion.span
              key={unreadCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [1.6, 1], opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1.5 text-[11px] font-black text-white shadow-sm ring-2 ring-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          </>
        )}
      </button>

      {toasts.length > 0 && (
        <div className="fixed right-4 top-20 z-[10000] flex w-[360px] max-w-[calc(100vw-24px)] flex-col gap-3 sm:right-6">
          <AnimatePresence initial={false}>
            {toasts.map((toast) => {
              const isClickable =
                Boolean(toast.leadId) ||
                isCollaborationAgreementNotification(toast) ||
                isBusinessChatNotification(toast) ||
                Boolean(toast.targetUrl);

              return (
                <motion.div
                  key={toast.id}
                  dir="rtl"
                  layout
                  initial={{ opacity: 0, x: 90, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 90, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  onClick={() => {
                    if (isClickable) {
                      openNotificationTarget(toast);
                    }
                    dismissToast(toast.id);
                  }}
                  className={[
                    "group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-amber-100 bg-white p-4 text-right shadow-[0_18px_50px_rgba(15,23,42,0.16)]",
                    isClickable ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <span className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 to-red-500" />

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
                    {getIcon(toast.kind)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-slate-800">
                      {toast.title}
                    </span>

                    <span className="mt-0.5 block text-sm font-semibold leading-5 text-slate-600 line-clamp-2">
                      {toast.text}
                    </span>

                    <span className="mt-1 block text-[11px] font-black text-amber-600">
                      עכשיו
                    </span>
                  </span>

                  <button
                    type="button"
                    aria-label="סגור"
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      dismissToast(toast.id);
                    }}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <motion.span
                    className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-red-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[9998] cursor-default bg-transparent"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
  dir="rtl"
  initial={{ opacity: 0, y: -10, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.98 }}
  transition={{ duration: 0.16 }}
  className="
    fixed right-4 top-20 z-[9999]
    w-[440px] max-w-[calc(100vw-24px)]
    overflow-hidden rounded-[1.7rem] border border-slate-200
    bg-white/95 shadow-[0_26px_90px_rgba(15,23,42,0.14)]
    backdrop-blur-2xl
    sm:right-6
  "
>

              <div className="relative border-b border-slate-100 bg-white p-5 text-slate-900">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-sky-500 via-blue-400 to-cyan-300" />

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      מרכז התראות
                    </div>

                    <h3 className="text-xl font-black">התראות</h3>

                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                      לידים חדשים, משימות לטיפול ועדכונים מהמערכת
                    </p>
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

              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 bg-white p-3">
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

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-sm font-black text-slate-800">
                    התראות אחרונות
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {unreadCount > 0
                      ? `${unreadCount} התראות שלא נקראו`
                      : "אין התראות שלא נקראו"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchAllNotifications}
                    disabled={loading}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                    title="רענון"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                    >
                      <CheckCheck className="h-4 w-4" />
                      סמן הכל
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto p-3">
                {filtered.length === 0 ? (
                  <div className="flex min-h-[230px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-10 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">
                      <ListChecks className="h-7 w-7" />
                    </div>

                    <p className="text-base font-black text-slate-800">
                      אין התראות חדשות
                    </p>

                    <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-400">
                      כשייכנס ליד חדש או כשיגיע זמן טיפול במשימה, זה יופיע כאן.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((notification) => {
                      const kindClasses = getKindClasses(notification.kind);

                      const isClickable =
                        Boolean(notification.leadId) ||
                        isCollaborationAgreementNotification(notification) ||
                        isBusinessChatNotification(notification) ||
                        Boolean(notification.targetUrl);

                      return (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() => openNotificationTarget(notification)}
                          className={[
                            "group relative flex w-full items-start gap-3 rounded-3xl border p-4 text-right transition",
                            isClickable ? "cursor-pointer" : "cursor-default",
                            notification.read
                              ? "border-slate-100 bg-white opacity-75 hover:bg-slate-50"
                              : "border-sky-100 bg-gradient-to-l from-sky-50/80 via-white to-white shadow-sm hover:shadow-md",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
                              kindClasses.icon,
                            ].join(" ")}
                          >
                            {getIcon(notification.kind)}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="mb-2 flex items-center justify-between gap-2">
                              <span
                                className={[
                                  "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-black ring-1",
                                  kindClasses.badge,
                                ].join(" ")}
                              >
                                {getTypeLabel(notification.kind)}
                              </span>

                              <span className="shrink-0 text-[11px] font-black text-slate-400">
                                {timeAgo(notification.timestamp)}
                              </span>
                            </span>

                            <span className="block truncate text-sm font-black text-slate-800">
                              {notification.title}
                            </span>

                            <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                              {notification.text}
                            </span>

                            {notification.leadName && (
                              <span className="mt-2 block text-xs font-bold text-slate-500">
                                ליד:{" "}
                                <strong className="text-slate-800">
                                  {notification.leadName}
                                </strong>
                                {notification.phone
                                  ? ` · ${notification.phone}`
                                  : ""}
                              </span>
                            )}

                            {notification.kind === "task_due" &&
                              notification.taskDueAt && (
                                <span className="mt-2 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                                  זמן טיפול:{" "}
                                  {formatDateTime(notification.taskDueAt)}
                                </span>
                              )}
                          </span>

                          {!notification.read && (
                            <span className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.16)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}