import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "@api";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BizuplyLoader from "./ui/BizuplyLoader";
import { useAuth } from "../context/AuthContext";
import { useLocaleDir } from "../hooks/useLocaleDir";
import i18n from "../i18n/i18n";
import { getIntlLocale, getTextDirection } from "../i18n/localeUtils";
import {
  buildReviewNotificationPath,
  getReviewIdFromNotification,
  normalizeBusinessId,
  pickNotificationText,
  rewriteDashboardTargetForBusiness,
  stashPendingNotificationUrl,
  toDisplayString,
} from "../utils/notificationNavigation";
import {
  Bell,
  CheckCheck,
  Clock3,
  Flame,
  ListChecks,
  RefreshCw,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { NotificationSettingsPanel } from "./NotificationSettings";

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
  reviewId?: string;
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

  reviewId?: string;

  raw?: unknown;
};

type OpenLeadPayload = {
  leadId: string;
  activityId?: string;
  kind?: NotificationKind;
};

type NotificationPanelBoundaryProps = {
  children: React.ReactNode;
};

type NotificationPanelBoundaryState = {
  hasError: boolean;
};

class NotificationPanelErrorBoundary extends React.Component<
  NotificationPanelBoundaryProps,
  NotificationPanelBoundaryState
> {
  state: NotificationPanelBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Notifications panel crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      const dir = getTextDirection(i18n.language);

      return (
        <div
          dir={dir}
          className={[
            "fixed top-20 z-[9999] w-[320px] max-w-[calc(100vw-24px)] rounded-2xl border border-rose-100 bg-white p-4 text-start shadow-xl",
            dir === "rtl" ? "left-4 sm:left-6" : "right-4 sm:right-6",
          ].join(" ")}
        >
          <p className="text-sm font-black text-slate-900">
            {i18n.t("notifications.errorTitle")}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {i18n.t("notifications.errorSubtitle")}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 inline-flex h-9 items-center rounded-xl bg-sky-50 px-3 text-xs font-black text-sky-700"
          >
            {i18n.t("notifications.tryAgain")}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function FacebookStyleNotifications() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const isRtl = dir === "rtl";
  const sideDockClass = isRtl
    ? "left-4 sm:left-6"
    : "right-4 sm:right-6";
  const toastEnterX = isRtl ? -90 : 90;
  const dateLocale = getIntlLocale(i18n.language);
  const { user, socket } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [panelView, setPanelView] = useState<"list" | "settings">("list");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<UnifiedNotification[]>([]);

  const toastTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const notificationsRef = useRef<UnifiedNotification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const businessId = normalizeBusinessId(user?.businessId);

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
  }, [businessId, i18n.language]);

  /* ============================
     Real-time notifications (Facebook style)
     ============================ */
  function ingestRealtimeNotification(data?: SystemNotification | null) {
    if (!data || typeof data !== "object") return;

    const unified = sanitizeUnifiedNotification(mapSystemNotification(data));

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

    if (
      unified.kind === "new_lead" ||
      unified.type === "new_lead" ||
      Boolean(unified.leadId)
    ) {
      // Refresh CRM list once. Phone alert comes only from Web Push (server).
      window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));

      if (shouldToast && unified.leadId && businessId) {
        const alertedKey = `bizuply_alerted_lead_ids_${businessId}`;
        const alertedIds = getStoredArray(alertedKey);
        if (!alertedIds.includes(unified.leadId)) {
          setStoredArray(alertedKey, [...alertedIds, unified.leadId]);
        }
      }
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
    socket.on("crmLeadCreated", () => {
      // List refresh only — avoid re-fetching notifications in a socket loop.
      window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
    });
    socket.on("crm-lead-created", () => {
      window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("newNotification", handleNewNotification);
      socket.off("crmLeadCreated");
      socket.off("crm-lead-created");
    };
  }, [businessId, socket]);

  useEffect(() => {
    const timers = toastTimersRef.current;

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function showToast(notification: UnifiedNotification) {
    // Short haptic buzz on phones when a notification pops (no-op on desktop).
    try {
      navigator.vibrate?.([120, 60, 120]);
    } catch {
      /* ignore */
    }

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
    return lead?.name || lead?.fullName || t("notifications.unnamedLead");
  }

  function isValidMongoId(value?: string) {
    return /^[0-9a-fA-F]{24}$/.test(String(value || ""));
  }

  function flattenSystemNotification(
    item: SystemNotification
  ): SystemNotification {
    if (!item || typeof item !== "object") return item;

    const nestedRaw = (item as SystemNotification & { notification?: unknown })
      .notification;

    if (!nestedRaw || typeof nestedRaw !== "object") {
      return {
        ...item,
        title: toDisplayString(item.title, t("notifications.defaultTitle")),
        text: pickNotificationText(item.text, item.message),
        message: pickNotificationText(item.message, item.text),
      };
    }

    const nested =
      typeof (nestedRaw as { toObject?: () => SystemNotification }).toObject ===
      "function"
        ? (nestedRaw as { toObject: () => SystemNotification }).toObject()
        : (nestedRaw as SystemNotification);

    return {
      ...nested,
      ...item,
      id:
        item.id ||
        item._id ||
        nested.id ||
        nested._id ||
        item.notificationId ||
        nested.notificationId,
      _id: item._id || nested._id,
      title: toDisplayString(item.title || nested.title, t("notifications.defaultTitle")),
      text: pickNotificationText(item.text, nested.text, nested.message, item.message),
      message: pickNotificationText(nested.message, item.message, nested.text, item.text),
      read: item.read ?? nested.read,
      timestamp:
        item.timestamp ||
        item.createdAt ||
        nested.timestamp ||
        nested.createdAt,
      conversationId:
        item.conversationId ||
        nested.conversationId ||
        item.threadId ||
        nested.threadId,
      threadId: item.threadId || nested.threadId || item.conversationId,
      targetUrl: item.targetUrl || nested.targetUrl,
      type: item.type || nested.type,
      reviewId:
        getReviewIdFromNotification(item) ||
        getReviewIdFromNotification(nested),
    };
  }

  function getNotificationId(notification: SystemNotification) {
    const candidate =
      notification?.id ||
      notification?._id ||
      notification?.notificationId ||
      "";

    if (isValidMongoId(String(candidate))) {
      return String(candidate);
    }

    const conversationId =
      notification?.conversationId || notification?.threadId || "";

    if (notification?.type === "message" && isValidMongoId(conversationId)) {
      return `message-${conversationId}`;
    }

    if (notification?.timestamp || notification?.createdAt) {
      return `notification-${notification.timestamp || notification.createdAt}`;
    }

    return `notification-${crypto.randomUUID()}`;
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
    if (notification.type === "message") return false;

    const targetUrl = notification.targetUrl || "";
    const text = `${toDisplayString(notification.title)} ${toDisplayString(
      notification.text
    )}`.toLowerCase();

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
      text.includes("שיתוף פעולה") ||
      text.includes("בקשת שיתוף") ||
      text.includes("partnership agreement") ||
      text.includes("collab request")
    );
  }

  function isReviewNotification(notification: UnifiedNotification) {
    const targetUrl = notification.targetUrl || "";

    return (
      notification.type === "review" ||
      Boolean(notification.reviewId) ||
      targetUrl.includes("tab=reviews") ||
      targetUrl.includes("reviewId=") ||
      targetUrl.includes("/reviews") ||
      (targetUrl.includes("/build") && targetUrl.includes("reviewId="))
    );
  }

  function getReviewIdFromUnifiedNotification(
    notification: UnifiedNotification
  ) {
    if (notification.reviewId) return notification.reviewId;

    const raw =
      notification.raw && typeof notification.raw === "object"
        ? (notification.raw as SystemNotification)
        : null;

    if (raw) {
      return getReviewIdFromNotification(raw);
    }

    try {
      const queryString = notification.targetUrl?.includes("?")
        ? notification.targetUrl.split("?")[1]
        : "";

      return new URLSearchParams(queryString).get("reviewId") || "";
    } catch {
      return "";
    }
  }

  function getReviewsPath(reviewId?: string) {
    return buildReviewNotificationPath(businessId, reviewId);
  }

  function openReviewFromNotification(notification: UnifiedNotification) {
    const reviewId = getReviewIdFromUnifiedNotification(notification);
    const targetPath = getReviewsPath(reviewId || undefined);

    stashPendingNotificationUrl(targetPath);

    window.dispatchEvent(
      new CustomEvent("bizuply:open-review", {
        detail: {
          reviewId,
          targetPath,
        },
      })
    );

    navigate(targetPath, {
      state: {
        reviewId,
        highlightReviewId: reviewId,
      },
    });
  }

  function isBusinessChatNotification(notification: UnifiedNotification) {
    const targetUrl = notification.targetUrl || "";
    const text = `${toDisplayString(notification.title)} ${toDisplayString(
      notification.text
    )}`;

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

  function resolveNotificationPath(targetUrl?: string, conversationId?: string) {
    if (conversationId) {
      return getCollabMessagesPath(conversationId);
    }

    if (!targetUrl) return "";

    return rewriteDashboardTargetForBusiness(targetUrl, businessId);
  }

  function openB2bChatFromNotification(notification: UnifiedNotification) {
    const conversationId = getConversationIdFromNotification(notification);
    const targetPath = resolveNotificationPath(notification.targetUrl, conversationId);

    if (!targetPath) return;

    const detail = {
      conversationId,
      targetPath,
    };

    stashPendingNotificationUrl(targetPath);
    sessionStorage.setItem("bizuply_open_b2b_chat", JSON.stringify(detail));

    window.dispatchEvent(
      new CustomEvent("bizuply:open-b2b-chat", {
        detail,
      })
    );

    navigate(targetPath, {
      state: {
        conversationId,
      },
    });
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

    navigate(
      `${getDashboardCrmPath()}?leadId=${encodeURIComponent(payload.leadId)}`
    );
  }

  function sanitizeUnifiedNotification(
    notification: UnifiedNotification
  ): UnifiedNotification {
    const conversationId = toDisplayString(
      notification.conversationId || notification.threadId
    );

    return {
      ...notification,
      id: toDisplayString(notification.id, `notification-${crypto.randomUUID()}`),
      title: toDisplayString(notification.title, t("notifications.defaultTitle")),
      text: toDisplayString(
        pickNotificationText(notification.text, notification.title),
        t("notifications.defaultText")
      ),
      timestamp: toDisplayString(notification.timestamp, new Date().toISOString()),
      leadId: toDisplayString(notification.leadId),
      activityId: toDisplayString(notification.activityId),
      leadName: toDisplayString(notification.leadName),
      phone: toDisplayString(notification.phone),
      targetUrl: toDisplayString(notification.targetUrl),
      conversationId,
      threadId: toDisplayString(notification.threadId || conversationId),
      type: toDisplayString(notification.type),
      agreementId: toDisplayString(notification.agreementId),
      proposalId: toDisplayString(notification.proposalId),
      collaborationId: toDisplayString(notification.collaborationId),
      partnershipAgreementId: toDisplayString(
        notification.partnershipAgreementId
      ),
      reviewId: toDisplayString(notification.reviewId),
    };
  }

  function mapSystemNotification(item: SystemNotification): UnifiedNotification {
    const source = flattenSystemNotification(item);

    const kind: NotificationKind =
      item.kind === "task_due" ||
      item.kind === "new_lead" ||
      item.kind === "regular"
        ? item.kind
        : "regular";

    const conversationId = String(
      source.conversationId || source.threadId || ""
    );

    return sanitizeUnifiedNotification({
      id: getNotificationId(source),
      kind,
      title: toDisplayString(source.title, t("notifications.defaultTitle")),
      text: pickNotificationText(source.text, source.message),
      timestamp: normalizeDate(source.timestamp || source.createdAt),
      read: Boolean(source.read),

      leadId: source.leadId || "",
      activityId: source.activityId || "",

      targetUrl: source.targetUrl || "",
      conversationId,
      threadId: source.threadId || conversationId,
      type: source.type || "",

      agreementId: source.agreementId || "",
      proposalId: source.proposalId || "",
      collaborationId: source.collaborationId || "",
      partnershipAgreementId: source.partnershipAgreementId || "",
      reviewId:
        getReviewIdFromNotification(source) ||
        getReviewIdFromNotification(item),

      raw: source,
    });
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
          title: t("notifications.taskTitle", {
            name: item.leadName || t("notifications.unnamedLead"),
          }),
          text: item.text || t("notifications.taskDefaultText"),
          timestamp: normalizeDate(item.taskDueAt || item.createdAt),
          read: readLocal.includes(id),
          leadId: item.leadId,
          activityId: item.activityId,
          leadName: item.leadName || t("notifications.unnamedLead"),
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
      const alertedKey = businessId
        ? `bizuply_alerted_lead_ids_${businessId}`
        : "bizuply_alerted_lead_ids";
      const alertedIds = getStoredArray(alertedKey);

      const newLeads = leads.filter(
        (lead) => lead?._id && !seenIds.includes(lead._id)
      );

      // Alert each lead only once — never re-trigger push/refresh loops.
      const leadsToAlert = newLeads.filter(
        (lead) => lead?._id && !alertedIds.includes(lead._id)
      );

      if (leadsToAlert.length > 0) {
        const nextAlerted = [
          ...alertedIds,
          ...leadsToAlert.map((lead) => lead._id).filter(Boolean),
        ];
        setStoredArray(alertedKey, nextAlerted);

        // Refresh CRM list only. Phone push is sent by the server on insert —
        // never re-request it from polling (that caused a second alert ~1 min later).
        window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
      }

      return newLeads.map((lead) => ({
        id: `lead-${lead._id}`,
        kind: "new_lead",
        title: t("notifications.newLeadTitle", { name: getLeadName(lead) }),
        text: t("notifications.newLeadText"),
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
        // One Meta/CRM lead = one notification row.
        const key =
          (item.kind === "new_lead" || item.type === "new_lead") && item.leadId
            ? `lead-${item.leadId}`
            : item.id;

        if (!key || map.has(key)) return;
        map.set(key, { ...item, id: key });
      });

      const merged = Array.from(map.values())
        .map(sanitizeUnifiedNotification)
        .sort(
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
      if (
        notification.kind === "regular" &&
        isValidMongoId(notification.id)
      ) {
        await API.put(`/business/my/notifications/${notification.id}/read`);
      } else if (
        notification.kind === "regular" &&
        notification.type === "message"
      ) {
        const conversationId = getConversationIdFromNotification(notification);

        if (isValidMongoId(conversationId)) {
          const res = await API.get("/business/my/notifications");

          if (res.data?.ok || res.data?.success) {
            const list: SystemNotification[] = Array.isArray(
              res.data.notifications
            )
              ? res.data.notifications
              : [];

            const persisted = list.find(
              (item) =>
                item.type === "message" &&
                (item.threadId === conversationId ||
                  item.conversationId === conversationId)
            );

            if (persisted && isValidMongoId(getNotificationId(persisted))) {
              await API.put(
                `/business/my/notifications/${getNotificationId(persisted)}/read`
              );
            }
          }
        }
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
    closePanel();

    if (isReviewNotification(notification)) {
      openReviewFromNotification(notification);
      void markAsRead(notification);
      return;
    }

    if (isBusinessChatNotification(notification)) {
      openB2bChatFromNotification(notification);
      void markAsRead(notification);
      return;
    }

    if (isCollaborationAgreementNotification(notification)) {
      const agreementId = getAgreementIdFromNotification(notification);

      navigate(getCollabAgreementsPath(notification), {
        state: {
          openAgreement: true,
          agreementId,
        },
      });

      void markAsRead(notification);
      return;
    }

    if (notification.leadId) {
      openLeadFromAnywhere({
        leadId: notification.leadId,
        activityId: notification.activityId || "",
        kind: notification.kind,
      });

      void markAsRead(notification);
      return;
    }

    if (notification.targetUrl) {
      const targetPath = rewriteDashboardTargetForBusiness(
        notification.targetUrl,
        businessId
      );

      if (isReviewNotification({ ...notification, targetUrl: targetPath })) {
        openReviewFromNotification({ ...notification, targetUrl: targetPath });
        void markAsRead(notification);
        return;
      }

      stashPendingNotificationUrl(targetPath);
      navigate(targetPath);
      void markAsRead(notification);
      return;
    }

    if (notification.kind === "regular") {
      navigate(`/business/${businessId}/dashboard`);
      void markAsRead(notification);
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

    if (diff < 60) return t("notifications.now");
    if (diff < 3600) {
      return t("notifications.minutesAgo", { count: Math.floor(diff / 60) });
    }
    if (diff < 86400) {
      return t("notifications.hoursAgo", { count: Math.floor(diff / 3600) });
    }

    return new Date(timestamp).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatDateTime(value?: string) {
    if (!value) return "";

    return new Date(value).toLocaleString(dateLocale, {
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

  function getTypeLabel(
    kind: NotificationKind,
    notification?: UnifiedNotification
  ) {
    if (notification && isReviewNotification(notification)) {
      return t("notifications.typeReview");
    }
    if (kind === "task_due") return t("notifications.typeTask");
    if (kind === "new_lead") return t("notifications.typeNewLead");
    return t("notifications.typeDefault");
  }

  function closePanel() {
    setOpen(false);
    setPanelView("list");
  }

  function toggleOpen() {
    setOpen((value) => {
      if (value) setPanelView("list");
      return !value;
    });
  }

  if (!businessId) return null;

  return (
    <NotificationPanelErrorBoundary>
      <div className="inline-flex">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={t("notifications.ariaLabel")}
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
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1.5 text-[11px] font-black text-black shadow-sm ring-2 ring-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          </>
        )}
      </button>

      {toasts.length > 0 && (
        <div
          className={[
            "fixed top-20 z-[10000] flex w-[360px] max-w-[calc(100vw-24px)] flex-col gap-3",
            sideDockClass,
          ].join(" ")}
        >
          <AnimatePresence initial={false}>
            {toasts.map((toast) => {
              const isClickable =
                Boolean(toast.leadId) ||
                isReviewNotification(toast) ||
                isCollaborationAgreementNotification(toast) ||
                isBusinessChatNotification(toast) ||
                Boolean(toast.targetUrl);

              return (
                <motion.div
                  key={toast.id}
                  dir={dir}
                  layout
                  initial={{ opacity: 0, x: toastEnterX, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: toastEnterX, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  onClick={() => {
                    if (isClickable) {
                      openNotificationTarget(toast);
                    }
                    dismissToast(toast.id);
                  }}
                  className={[
                    "group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-amber-100 bg-white p-4 text-start shadow-[0_18px_50px_rgba(15,23,42,0.16)]",
                    isClickable ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <span className="pointer-events-none absolute inset-y-0 end-0 w-1 bg-gradient-to-b from-amber-400 to-red-500" />

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-red-500 ring-1 ring-amber-100">
                    {getIcon(toast.kind)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-slate-800">
                      {toDisplayString(toast.title, t("notifications.defaultTitle"))}
                    </span>

                    <span className="mt-0.5 block text-sm font-semibold leading-5 text-slate-600 line-clamp-2">
                      {toDisplayString(toast.text, t("notifications.defaultText"))}
                    </span>

                    <span className="mt-1 block text-[11px] font-black text-amber-600">
                      {t("notifications.now")}
                    </span>
                  </span>

                  <button
                    type="button"
                    aria-label={t("common.close")}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      dismissToast(toast.id);
                    }}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <motion.span
                    className="pointer-events-none absolute bottom-0 start-0 h-0.5 bg-gradient-to-r from-amber-400 to-red-500"
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
              onClick={closePanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              dir={dir}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className={[
                "fixed top-20 z-[9999]",
                "flex max-h-[min(680px,calc(100dvh-5.5rem))] w-[440px] max-w-[calc(100vw-24px)]",
                "flex-col overflow-hidden rounded-[1.7rem] border border-slate-200",
                "bg-white shadow-[0_26px_90px_rgba(15,23,42,0.14)]",
                sideDockClass,
              ].join(" ")}
            >
              {panelView === "settings" ? (
                <NotificationSettingsPanel
                  active={open && panelView === "settings"}
                  onBack={() => setPanelView("list")}
                />
              ) : (
                <>
                  <div className="relative shrink-0 border-b border-slate-100 bg-white p-5 text-slate-900">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-sky-500 via-blue-400 to-cyan-300" />

                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                          <Sparkles className="h-3.5 w-3.5" />
                          {t("notifications.centerBadge")}
                        </div>

                        <h3 className="text-xl font-black">{t("notifications.title")}</h3>

                        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                          {t("notifications.subtitle")}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPanelView("settings")}
                          aria-label={t("notifications.settingsAria")}
                          title={t("notifications.settingsAria")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Settings className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={closePanel}
                          aria-label={t("notifications.closePanelAria")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
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
                  {t("notifications.tabAll")}
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
                  {t("notifications.tabUnread")}
                </button>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {t("notifications.recentTitle")}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {unreadCount > 0
                      ? t("notifications.unreadCount", { count: unreadCount })
                      : t("notifications.noUnread")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchAllNotifications}
                    disabled={loading}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                    title={t("notifications.refresh")}
                  >
                    {loading ? (
                      <BizuplyLoader size="xs" compact />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </button>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                    >
                      <CheckCheck className="h-4 w-4" />
                      {t("notifications.markAll")}
                    </button>
                  )}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                {filtered.length === 0 ? (
                  <div className="flex min-h-[230px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-10 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">
                      <ListChecks className="h-7 w-7" />
                    </div>

                    <p className="text-base font-black text-slate-800">
                      {t("notifications.emptyTitle")}
                    </p>

                    <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-400">
                      {t("notifications.emptySubtitle")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((notification) => {
                      const kindClasses = getKindClasses(notification.kind);

                      const isClickable =
                        Boolean(notification.leadId) ||
                        isReviewNotification(notification) ||
                        isCollaborationAgreementNotification(notification) ||
                        isBusinessChatNotification(notification) ||
                        Boolean(notification.targetUrl);

                      return (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() => openNotificationTarget(notification)}
                          className={[
                            "group relative flex w-full items-start gap-3 rounded-3xl border p-4 text-start transition",
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
                                {getTypeLabel(notification.kind, notification)}
                              </span>

                              <span className="shrink-0 text-[11px] font-black text-slate-400">
                                {timeAgo(notification.timestamp)}
                              </span>
                            </span>

                            <span className="block truncate text-sm font-black text-slate-800">
                              {toDisplayString(
                                notification.title,
                                t("notifications.defaultTitle")
                              )}
                            </span>

                            <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                              {toDisplayString(
                                notification.text,
                                t("notifications.defaultText")
                              )}
                            </span>

                            {notification.leadName && (
                              <span className="mt-2 block text-xs font-bold text-slate-500">
                                {t("notifications.leadLabel")}{" "}
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
                                  {t("notifications.dueTime")}{" "}
                                  {formatDateTime(notification.taskDueAt)}
                                </span>
                              )}
                          </span>

                          {!notification.read && (
                            <span className="absolute end-4 top-5 h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.16)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </NotificationPanelErrorBoundary>
  );
}