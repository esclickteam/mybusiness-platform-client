import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Facebook,
  FileText,
  Filter,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
  Webhook,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { TFunction } from "i18next";

import MetaLeadAdsIntegration from "./MetaLeadAdsIntegration";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import API from "@api";
import {
  isAdminUser,
  setAdminActiveBusinessId,
} from "../../../../utils/adminTenant";
import { useAuth } from "../../../../context/AuthContext";

type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "converted"
  | "lost";

type LeadDetail = {
  label: string;
  value: string;
};

type RawFieldItem = {
  name?: string;
  label?: string;
  key?: string;
  question?: string;
  value?: string | string[] | unknown;
  values?: string[] | unknown[];
  answer?: string | string[] | unknown;
};

type LeadActivityType = "note" | "call" | "whatsapp" | "status" | "task";

type LeadActivity = {
  _id?: string;
  id?: string;
  type?: LeadActivityType;
  text: string;
  createdBy?: string;
  createdAt?: string;

  taskDueAt?: string | null;
  taskDone?: boolean;
  taskCompletedAt?: string | null;
  taskCompletedBy?: string;
  notificationShownAt?: string | null;
};

type Lead = {
  _id: string;

  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  message?: string;

  source?: string;
  provider?: string;
  status?: LeadStatus;

  externalLeadId?: string;
  externalPageId?: string;
  externalFormId?: string;

  createdAt?: string;

  guestCount?: string;
  interestedService?: string;
  eventDate?: string;
  eventType?: string;

  details?: {
    label?: string;
    value?: string | string[] | unknown;
  }[];

  rawFieldData?: RawFieldItem[] | Record<string, unknown> | string;
  fieldData?: RawFieldItem[] | Record<string, unknown> | string;
  rawPayload?: any;
  rawData?: any;

  activities?: LeadActivity[];

  detail1Label?: string;
  detail1Value?: string;
  detail2Label?: string;
  detail2Value?: string;
  detail3Label?: string;
  detail3Value?: string;
  detail4Label?: string;
  detail4Value?: string;
  detail5Label?: string;
  detail5Value?: string;
  detail6Label?: string;
  detail6Value?: string;
  detail7Label?: string;
  detail7Value?: string;
  detail8Label?: string;
  detail8Value?: string;
  detail9Label?: string;
  detail9Value?: string;
  detail10Label?: string;
  detail10Value?: string;

  facebook?: {
    leadId?: string;
    formId?: string;
    formName?: string;
    pageId?: string;
    pageName?: string;
    createdTime?: string;
  };
};

type CRMLeadsTabProps = {
  businessId?: string;
};

type OpenLeadNotificationDetail = {
  leadId?: string;
  activityId?: string;
  kind?: "regular" | "task_due" | "new_lead";
};

function getStatusLabel(status: LeadStatus, t: TFunction) {
  return t(`crm.leads.statuses.${status}`);
}

const statusBadgeClasses: Record<LeadStatus, string> = {
  new: "border-sky-400 bg-sky-600 text-white",
  contacted: "border-slate-500 bg-slate-800 text-white",
  interested: "border-amber-400 bg-amber-500 text-slate-950",
  converted: "border-cyan-500 bg-cyan-700 text-white",
  lost: "border-rose-400 bg-rose-600 text-white",
};

const statusDotClasses: Record<LeadStatus, string> = {
  new: "bg-sky-200",
  contacted: "bg-slate-300",
  interested: "bg-amber-100",
  converted: "bg-cyan-200",
  lost: "bg-rose-200",
};

function getCurrentUserName(t: TFunction) {
  const fallback = t("crm.common.systemUser");
  if (typeof window === "undefined") return fallback;

  const directName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    localStorage.getItem("businessName") ||
    "";

  if (directName.trim()) return directName.trim();

  const rawUser =
    localStorage.getItem("user") ||
    localStorage.getItem("currentUser") ||
    localStorage.getItem("authUser") ||
    "";

  if (!rawUser) return fallback;

  try {
    const user = JSON.parse(rawUser);
    return (
      user?.name ||
      user?.fullName ||
      user?.businessName ||
      user?.email ||
      fallback
    );
  } catch {
    return fallback;
  }
}

function cleanText(value?: unknown) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function joinFieldValues(value: unknown) {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => cleanText(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const obj = value as any;

    if (Array.isArray(obj.values)) {
      return joinFieldValues(obj.values);
    }

    if (Array.isArray(obj.value)) {
      return joinFieldValues(obj.value);
    }

    if (Array.isArray(obj.answer)) {
      return joinFieldValues(obj.answer);
    }

    return cleanText(
      obj.value ||
        obj.answer ||
        obj.text ||
        obj.label ||
        obj.name ||
        ""
    );
  }

  return cleanText(value);
}

function safeJsonParse(value: unknown) {
  if (typeof value !== "string") return value;

  const str = value.trim();
  if (!str) return value;

  try {
    return JSON.parse(str);
  } catch {
    return value;
  }
}

function formatDate(value?: string | null, locale = "en-US", emDash = "—") {
  if (!value) return emDash;

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return emDash;
  }
}

function formatShortDate(value?: string, locale = "en-US", emDash = "—") {
  if (!value) return emDash;

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return emDash;
  }
}

function getLeadName(lead: Lead, t: TFunction) {
  return lead.name || lead.fullName || t("crm.leads.unnamedLead");
}

function getInitials(name?: string) {
  if (!name) return "L";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "L";
}

function normalizePhoneForWhatsApp(phone?: string) {
  if (!phone) return "";

  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned.replace("+", "");
  }

  if (cleaned.startsWith("0")) {
    return `972${cleaned.slice(1)}`;
  }

  return cleaned;
}

function isMetaLead(lead: Lead) {
  const source = String(lead.source || lead.provider || "").toLowerCase();

  return (
    source.includes("meta") ||
    source.includes("facebook") ||
    source.includes("leadgen") ||
    source.includes("lead_ads") ||
    source.includes("webhook") ||
    Boolean(lead.facebook?.leadId) ||
    Boolean(lead.facebook?.formId) ||
    Boolean(lead.facebook?.pageId) ||
    Boolean(lead.externalLeadId) ||
    Boolean(lead.externalPageId) ||
    Boolean(lead.externalFormId)
  );
}

function getLeadSourceLabel(lead: Lead, t: TFunction) {
  if (isMetaLead(lead)) return t("crm.leads.sources.metaLeadAds");

  return lead.source || lead.provider || t("crm.leads.sources.manual");
}

function getLeadFormName(lead: Lead, t: TFunction) {
  return (
    lead.facebook?.formName ||
    lead.externalFormId ||
    lead.facebook?.formId ||
    (isMetaLead(lead) ? t("crm.leads.sources.metaForm") : lead.source) ||
    t("crm.leads.sources.manualLead")
  );
}

function getRawFieldValue(field: RawFieldItem) {
  if (!field) return "";

  if (Array.isArray(field.values)) {
    return joinFieldValues(field.values);
  }

  if (Array.isArray(field.value)) {
    return joinFieldValues(field.value);
  }

  if (Array.isArray(field.answer)) {
    return joinFieldValues(field.answer);
  }

  return joinFieldValues(field.value || field.answer || "");
}

function normalizeRawObjectToFields(value: Record<string, unknown>): RawFieldItem[] {
  return Object.entries(value)
    .map(([key, fieldValue]) => {
      const name = cleanText(key);
      const normalizedValue = joinFieldValues(fieldValue);

      if (!name || !normalizedValue) return null;

      return {
        name,
        values: [normalizedValue],
      };
    })
    .filter(Boolean) as RawFieldItem[];
}

function extractRawFieldData(lead: Lead): RawFieldItem[] {
  const direct =
    lead.rawFieldData ||
    lead.fieldData ||
    lead.rawPayload?.fieldData ||
    lead.rawPayload?.field_data ||
    lead.rawData?.fieldData ||
    lead.rawData?.field_data ||
    [];

  const parsed = safeJsonParse(direct);

  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const field = item as RawFieldItem;

        return {
          ...field,
          name: cleanText(
            field.name || field.label || field.key || field.question || ""
          ),
          values: [getRawFieldValue(field)].filter(Boolean),
        };
      })
      .filter(Boolean) as RawFieldItem[];
  }

  if (parsed && typeof parsed === "object") {
    return normalizeRawObjectToFields(parsed as Record<string, unknown>);
  }

  return [];
}

function getLeadDetails(lead: Lead, t: TFunction): LeadDetail[] {
  const details: LeadDetail[] = [];

  const pushDetail = (label?: unknown, value?: unknown) => {
    const cleanLabel = cleanText(label);
    const cleanValue = joinFieldValues(value);

    if (!cleanLabel || !cleanValue) return;

    const exists = details.some(
      (item) =>
        cleanText(item.label) === cleanLabel &&
        cleanText(item.value) === cleanValue
    );

    if (!exists) {
      details.push({
        label: cleanLabel,
        value: cleanValue,
      });
    }
  };

  if (Array.isArray(lead.details)) {
    lead.details.forEach((detail) => {
      pushDetail(detail.label, detail.value);
    });
  }

  const rawFields = extractRawFieldData(lead);

  rawFields.forEach((field) => {
    pushDetail(
      field.label || field.name || field.key || field.question,
      getRawFieldValue(field)
    );
  });

  pushDetail(t("crm.leads.detailLabels.guestCount"), lead.guestCount);
  pushDetail(t("crm.leads.detailLabels.interestedService"), lead.interestedService);
  pushDetail(t("crm.leads.detailLabels.eventDate"), lead.eventDate);
  pushDetail(t("crm.leads.detailLabels.eventType"), lead.eventType);

  pushDetail(lead.detail1Label, lead.detail1Value);
  pushDetail(lead.detail2Label, lead.detail2Value);
  pushDetail(lead.detail3Label, lead.detail3Value);
  pushDetail(lead.detail4Label, lead.detail4Value);
  pushDetail(lead.detail5Label, lead.detail5Value);
  pushDetail(lead.detail6Label, lead.detail6Value);
  pushDetail(lead.detail7Label, lead.detail7Value);
  pushDetail(lead.detail8Label, lead.detail8Value);
  pushDetail(lead.detail9Label, lead.detail9Value);
  pushDetail(lead.detail10Label, lead.detail10Value);

  return details;
}

function getLeadSearchText(lead: Lead, t: TFunction) {
  const detailsText = getLeadDetails(lead, t)
    .map((detail) => `${detail.label} ${detail.value}`)
    .join(" ");

  return [
    getLeadName(lead, t),
    lead.phone,
    lead.email,
    lead.message,
    lead.source,
    lead.provider,
    getLeadSourceLabel(lead, t),
    getLeadFormName(lead, t),
    lead.externalLeadId,
    lead.externalPageId,
    lead.externalFormId,
    lead.facebook?.leadId,
    lead.facebook?.formId,
    lead.facebook?.pageId,
    detailsText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

async function copyText(value?: string) {
  const text = cleanText(value);
  if (!text || typeof navigator === "undefined") return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

function sortByNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

function getActivityTypeLabel(type: LeadActivityType | undefined, t: TFunction) {
  switch (type) {
    case "call":
      return t("crm.leads.activityTypes.call");
    case "whatsapp":
      return t("crm.leads.activityTypes.whatsapp");
    case "status":
      return t("crm.leads.activityTypes.status");
    case "task":
      return t("crm.leads.activityTypes.task");
    case "note":
    default:
      return t("crm.leads.activityTypes.note");
  }
}

function DetailRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value?: string;
  copyable?: boolean;
}) {
  const { t } = useTranslation();
  const cleanValue = cleanText(value);
  const emDash = t("crm.common.emDash");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-black text-slate-400">{label}</p>

        {copyable && cleanValue && (
          <button
            type="button"
            onClick={() => copyText(cleanValue)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-sky-50 hover:text-sky-700"
            title={t("crm.common.copy")}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p
        className={[
          "whitespace-pre-wrap break-words text-sm font-black text-slate-900",
          cleanValue ? "" : "text-slate-300",
        ].join(" ")}
        dir={/[A-Za-z0-9@+]/.test(cleanValue) ? "ltr" : undefined}
      >
        {cleanValue || emDash}
      </p>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { t } = useTranslation();

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-black",
        statusBadgeClasses[status],
      ].join(" ")}
    >
      <span className={`h-2 w-2 rounded-full ${statusDotClasses[status]}`} />
      {getStatusLabel(status, t)}
    </span>
  );
}

function SourceBadge({ lead }: { lead: Lead }) {
  const { t } = useTranslation();
  const sourceLabel = getLeadSourceLabel(lead, t);

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm">
        {isMetaLead(lead) ? (
          <Webhook className="h-3.5 w-3.5 shrink-0 text-sky-700" />
        ) : (
          <Globe2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        )}

        <span className="truncate">{sourceLabel}</span>
      </span>

      <span className="max-w-full truncate text-xs font-bold text-slate-500">
        {getLeadFormName(lead, t)}
      </span>
    </div>
  );
}

export default function CRMLeadsTab({ businessId }: CRMLeadsTabProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = i18n.language || "en";
  const emDash = t("crm.common.emDash");
  const { socket } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const showMetaSetup = searchParams.get("metaSetup") === "1";
  const deepLinkLeadId = searchParams.get("leadId") || "";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [highlightedActivityId, setHighlightedActivityId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");

  const [localActivitiesByLead, setLocalActivitiesByLead] = useState<
    Record<string, LeadActivity[]>
  >({});

  const [newActivityText, setNewActivityText] = useState("");
  const [newActivityType, setNewActivityType] =
    useState<LeadActivityType>("note");
  const [newTaskDueAt, setNewTaskDueAt] = useState("");

  const [savingActivity, setSavingActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    next.delete("leadId");
    setSearchParams(next, { replace: false });
  };

  const closeMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("metaSetup");
    setSearchParams(next, { replace: false });
  };

  const fetchLeads = async (options: { silent?: boolean } = {}) => {
    try {
      if (!options.silent) {
        setLoading(true);
      }
      setError("");

      const { data } = await API.get<{ success: boolean; leads: Lead[] }>(
        "/crm/leads/my",
        {
          params: businessId ? { businessId } : undefined,
        }
      );

      const nextLeads = Array.isArray(data.leads) ? data.leads : [];
      setLeads(nextLeads);

      setSelectedLead((current) => {
        if (!current) return null;
        return nextLeads.find((lead) => lead._id === current._id) || current;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("crm.leads.errors.loadFailed")
      );
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  };

  const fetchLeadsSilentRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const scheduleSilentLeadsRefresh = () => {
    if (fetchLeadsSilentRef.current) {
      window.clearTimeout(fetchLeadsSilentRef.current);
    }
    fetchLeadsSilentRef.current = window.setTimeout(() => {
      void fetchLeads({ silent: true });
    }, 400);
  };

  const scrollToActivity = (activityId?: string) => {
    if (!activityId) return;

    window.setTimeout(() => {
      const element = document.querySelector(
        `[data-activity-id="${activityId}"]`
      );
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  };

  const openLeadFromNotification = async (detail: OpenLeadNotificationDetail) => {
    const leadId = detail.leadId || "";
    const activityId = detail.activityId || "";

    if (!leadId) return;

    setHighlightedActivityId(activityId);

    const existingLead = leads.find((lead) => lead._id === leadId);

    if (existingLead) {
      setSelectedLead(existingLead);
      scrollToActivity(activityId);
      return;
    }

    try {
      const { data } = await API.get<{ success: boolean; leads: Lead[] }>(
        "/crm/leads/my",
        {
          params: businessId ? { businessId } : undefined,
        }
      );

      const nextLeads = Array.isArray(data.leads) ? data.leads : [];
      setLeads(nextLeads);

      const targetLead = nextLeads.find((lead) => lead._id === leadId);

      if (targetLead) {
        setSelectedLead(targetLead);
        scrollToActivity(activityId);
      } else {
        setError(t("crm.leads.errors.leadNotFound"));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("crm.leads.errors.openFromNotificationFailed")
      );
    }
  };

  useEffect(() => {
    const handleOpenLead = (event: Event) => {
      const detail =
        (event as CustomEvent<OpenLeadNotificationDetail>).detail || {};
      openLeadFromNotification(detail);
    };

    window.addEventListener("bizuply:open-lead", handleOpenLead);

    const storedRequest = sessionStorage.getItem("bizuply_open_lead_request");

    if (storedRequest) {
      sessionStorage.removeItem("bizuply_open_lead_request");

      try {
        openLeadFromNotification(JSON.parse(storedRequest));
      } catch {
        // ignore invalid storage value
      }
    }

    return () => {
      window.removeEventListener("bizuply:open-lead", handleOpenLead);
    };
  }, [leads]);

  useEffect(() => {
    if (!deepLinkLeadId || showMetaSetup) return;

    void (async () => {
      await openLeadFromNotification({ leadId: deepLinkLeadId });

      // Keep the lead open, but strip the query so refresh doesn't loop the drawer.
      const next = new URLSearchParams(searchParams);
      if (next.has("leadId")) {
        next.delete("leadId");
        setSearchParams(next, { replace: true });
      }
    })();
  }, [deepLinkLeadId, showMetaSetup, leads.length]);

  useEffect(() => {
    if (businessId && isAdminUser()) {
      setAdminActiveBusinessId(businessId);
    }
  }, [businessId]);

  useEffect(() => {
    fetchLeads();
  }, [businessId]);

  useEffect(() => {
    const handleLeadsSynced = () => {
      scheduleSilentLeadsRefresh();
    };

    window.addEventListener("bizuply:leads-synced", handleLeadsSynced);
    window.addEventListener("bizuply:leads-updated", handleLeadsSynced);
    return () => {
      window.removeEventListener("bizuply:leads-synced", handleLeadsSynced);
      window.removeEventListener("bizuply:leads-updated", handleLeadsSynced);
      if (fetchLeadsSilentRef.current) {
        window.clearTimeout(fetchLeadsSilentRef.current);
      }
    };
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !socket) return;

    const refreshFromSocket = () => {
      scheduleSilentLeadsRefresh();
    };

    const handleNewNotification = (data: {
      kind?: string;
      type?: string;
      leadId?: string;
    }) => {
      if (
        data?.kind === "new_lead" ||
        data?.type === "new_lead" ||
        Boolean(data?.leadId)
      ) {
        refreshFromSocket();
      }
    };

    const joinRoom = () => {
      socket.emit("joinBusinessRoom", businessId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);
    socket.on("crmLeadCreated", refreshFromSocket);
    socket.on("crm-lead-created", refreshFromSocket);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("crmLeadCreated", refreshFromSocket);
      socket.off("crm-lead-created", refreshFromSocket);
      socket.off("newNotification", handleNewNotification);
    };
  }, [businessId, socket]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch = !q || getLeadSearchText(lead, t).includes(q);

      const matchesStatus =
        statusFilter === "all" || (lead.status || "new") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter, t]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new" || !lead.status).length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      interested: leads.filter((lead) => lead.status === "interested").length,
      converted: leads.filter((lead) => lead.status === "converted").length,
      integration: leads.filter((lead) => {
        const label = getLeadSourceLabel(lead, t).toLowerCase();
        return (
          label.includes("meta lead ads") ||
          label.includes("facebook") ||
          label.includes("meta") ||
          label.includes("webhook")
        );
      }).length,
    };
  }, [leads, t]);

  const selectedDetails = selectedLead ? getLeadDetails(selectedLead, t) : [];
  const selectedStatus = selectedLead?.status || "new";
  const selectedWhatsAppPhone = normalizePhoneForWhatsApp(selectedLead?.phone);

  const selectedActivities = useMemo(() => {
    if (!selectedLead) return [];

    return sortByNewest([
      ...(selectedLead.activities || []),
      ...(localActivitiesByLead[selectedLead._id] || []),
    ]);
  }, [selectedLead, localActivitiesByLead]);

  const openTaskActivitiesCount = selectedActivities.filter(
    (activity) => activity.type === "task" && !activity.taskDone
  ).length;

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead._id === leadId ? { ...lead, status } : lead
      )
    );

    setSelectedLead((current) =>
      current && current._id === leadId ? { ...current, status } : current
    );

    try {
      const { data: saved } = await API.patch<{
        success: boolean;
        lead?: Lead;
        activity?: LeadActivity;
      }>(`/crm/leads/${leadId}/status`, { status });

      if (saved.lead) {
        setLeads((current) =>
          current.map((lead) => (lead._id === leadId ? saved.lead! : lead))
        );

        setSelectedLead((current) =>
          current && current._id === leadId ? saved.lead! : current
        );
      }
    } catch (err) {
      setLeads(previousLeads);
      setSelectedLead(
        previousLeads.find((lead) => lead._id === leadId) || selectedLead
      );
      setError(
        err instanceof Error ? err.message : t("crm.leads.errors.updateStatusFailed")
      );
    }
  };

  const handleAddActivity = async () => {
    if (!selectedLead || !newActivityText.trim()) return;

    if (newActivityType === "task" && !newTaskDueAt) {
      setError(t("crm.leads.errors.taskDueRequired"));
      return;
    }

    const leadId = selectedLead._id;

    const taskDueAtIso =
      newActivityType === "task" && newTaskDueAt
        ? new Date(newTaskDueAt).toISOString()
        : null;

    const tempActivity: LeadActivity = {
      id: crypto.randomUUID(),
      type: newActivityType,
      text: newActivityText.trim(),
      createdBy: getCurrentUserName(t),
      createdAt: new Date().toISOString(),
      taskDueAt: taskDueAtIso,
      taskDone: false,
      taskCompletedAt: null,
      taskCompletedBy: "",
      notificationShownAt: null,
    };

    setSavingActivity(true);
    setNewActivityText("");
    setNewTaskDueAt("");

    setLocalActivitiesByLead((current) => ({
      ...current,
      [leadId]: [tempActivity, ...(current[leadId] || [])],
    }));

    try {
      const { data: saved } = await API.post<{
        success: boolean;
        activity?: LeadActivity;
        lead?: Lead;
      }>(`/crm/leads/${leadId}/activities`, {
        type: tempActivity.type,
        text: tempActivity.text,
        taskDueAt:
          tempActivity.type === "task" ? tempActivity.taskDueAt : null,
      });

      if (saved.lead) {
        setLeads((current) =>
          current.map((lead) => (lead._id === leadId ? saved.lead! : lead))
        );

        setSelectedLead((current) =>
          current && current._id === leadId ? saved.lead! : current
        );

        setLocalActivitiesByLead((current) => ({
          ...current,
          [leadId]: [],
        }));
      } else if (saved.activity) {
        setLocalActivitiesByLead((current) => ({
          ...current,
          [leadId]: (current[leadId] || []).map((item) =>
            item.id === tempActivity.id ? saved.activity! : item
          ),
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("crm.leads.errors.saveActivityFailed")
      );
    } finally {
      setSavingActivity(false);
    }
  };

  const handleToggleTaskActivity = async (activity: LeadActivity) => {
    if (!selectedLead) return;

    const activityId = activity._id || activity.id;

    if (!activityId) return;

    const nextDone = !activity.taskDone;
    const leadId = selectedLead._id;

    setLeads((current) =>
      current.map((lead) => {
        if (lead._id !== leadId) return lead;

        return {
          ...lead,
          activities: (lead.activities || []).map((item) =>
            (item._id || item.id) === activityId
              ? {
                  ...item,
                  taskDone: nextDone,
                  taskCompletedAt: nextDone ? new Date().toISOString() : null,
                  taskCompletedBy: nextDone ? getCurrentUserName(t) : "",
                }
              : item
          ),
        };
      })
    );

    setSelectedLead((current) => {
      if (!current || current._id !== leadId) return current;

      return {
        ...current,
        activities: (current.activities || []).map((item) =>
          (item._id || item.id) === activityId
            ? {
                ...item,
                taskDone: nextDone,
                taskCompletedAt: nextDone ? new Date().toISOString() : null,
                taskCompletedBy: nextDone ? getCurrentUserName(t) : "",
              }
            : item
        ),
      };
    });

    try {
      const { data: saved } = await API.patch<{
        success: boolean;
        lead?: Lead;
      }>(`/crm/leads/${leadId}/activities/${activityId}/done`, {
        done: nextDone,
      });

      if (saved.lead) {
        setLeads((current) =>
          current.map((lead) => (lead._id === leadId ? saved.lead! : lead))
        );

        setSelectedLead((current) =>
          current && current._id === leadId ? saved.lead! : current
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("crm.leads.errors.updateTaskFailed")
      );
    }
  };

  return (
    <div
      className="w-full min-w-0 space-y-6 bg-[linear-gradient(165deg,#dbe7f3_0%,#e8eef5_35%,#d5dee8_100%)] p-3 sm:p-4"
      dir={dir}
    >
      {showMetaSetup ? (
        <MetaLeadAdsIntegration
          businessId={businessId}
          onBack={closeMetaSetup}
        />
      ) : (
        <>
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-300/90 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
        <div className="relative overflow-hidden border-b border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_55%,#0369a1_100%)] p-6 text-white sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.22),transparent_38%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-sky-300/40 bg-sky-500/20 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                <Sparkles className="h-4 w-4" />
                {t("crm.leads.badge")}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                {t("crm.leads.title")}
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-sky-100/90 sm:text-base">
                {t("crm.leads.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openMetaSetup}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/20"
              >
                <Facebook className="h-5 w-5" />
                {t("crm.leads.connectMeta")}
              </button>

              <button
                type="button"
                onClick={() => fetchLeads()}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-400 px-5 text-sm font-black text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <BizuplyLoader size="xs" compact />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                {t("crm.leads.refreshLeads")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-slate-100/80 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{t("crm.leads.stats.total")}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-300 bg-sky-600 p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-sky-100">{t("crm.leads.stats.new")}</p>
            <p className="mt-2 text-3xl font-black">
              {stats.new}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-slate-800 p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-300">{t("crm.leads.stats.contacted")}</p>
            <p className="mt-2 text-3xl font-black">
              {stats.contacted}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300 bg-cyan-700 p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-100">{t("crm.leads.stats.converted")}</p>
            <p className="mt-2 text-3xl font-black">
              {stats.converted}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{t("crm.leads.stats.openTasks")}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {leads.reduce(
                (sum, lead) =>
                  sum +
                  (lead.activities || []).filter(
                    (activity) =>
                      activity.type === "task" && !activity.taskDone
                  ).length,
                0
              )}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-100 p-4 text-sm font-bold text-rose-800 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-300/90 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-200">
              <Search className="h-5 w-5 shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("crm.leads.searchPlaceholder")}
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm">
                <Filter className="h-4 w-4" />
                {t("crm.common.filter")}
              </div>

              {(["all", "new", "contacted", "interested", "converted", "lost"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "rounded-xl px-4 py-2 text-xs font-black transition",
                      statusFilter === status
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-300 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-800",
                    ].join(" ")}
                  >
                    {status === "all" ? t("crm.common.all") : getStatusLabel(status, t)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 bg-slate-100/50 p-4 sm:p-5">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-sky-300 shadow-lg">
              <Webhook className="h-9 w-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              {t("crm.leads.emptyTitle")}
            </h3>

            <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-600">
              {t("crm.leads.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="hidden border-b border-slate-300 bg-slate-200/80 px-4 py-4 text-xs font-black uppercase tracking-[0.08em] text-slate-600 xl:grid xl:grid-cols-[1.25fr_1.05fr_0.75fr_1.45fr_0.7fr_0.8fr_1fr] xl:gap-4">
              <div>{t("crm.leads.table.lead")}</div>
              <div>{t("crm.leads.table.contactDetails")}</div>
              <div>{t("crm.leads.table.source")}</div>
              <div>{t("crm.leads.table.mainDetails")}</div>
              <div>{t("crm.leads.table.status")}</div>
              <div>{t("crm.leads.table.createdDate")}</div>
              <div>{t("crm.leads.table.actions")}</div>
            </div>

            <div className="divide-y divide-slate-200 bg-white">
              {filteredLeads.map((lead) => {
                const status = lead.status || "new";
                const leadName = getLeadName(lead, t);
                const details = getLeadDetails(lead, t);
                const whatsAppPhone = normalizePhoneForWhatsApp(lead.phone);
                const mainDetails = details.slice(0, 3);

                return (
                  <article
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className={[
                      "cursor-pointer px-4 py-4 transition hover:bg-sky-50",
                      selectedLead?._id === lead._id ? "bg-sky-100" : "",
                      "grid gap-4 xl:grid-cols-[1.25fr_1.05fr_0.75fr_1.45fr_0.7fr_0.8fr_1fr] xl:items-center",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-sky-300 shadow-sm">
                        {getInitials(leadName)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-800">
                          {leadName}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-400">
                          {lead.email || lead.phone || t("crm.leads.noContactDetails")}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-black text-slate-400 xl:hidden">
                        {t("crm.leads.table.contactDetails")}
                      </p>

                      {lead.phone ? (
                        <p className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
                          <Phone className="h-4 w-4 shrink-0 text-sky-600" />
                          <span className="truncate" dir="ltr">
                            {lead.phone}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-slate-300">
                          {t("crm.common.noPhone")}
                        </p>
                      )}

                      {lead.email && (
                        <p className="flex min-w-0 items-center gap-2 text-xs font-bold text-slate-500">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate" dir="ltr">
                            {lead.email}
                          </span>
                        </p>
                      )}
                    </div>

                    <SourceBadge lead={lead} />

                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-black text-slate-400 xl:hidden">
                        {t("crm.leads.table.mainDetails")}
                      </p>

                      {mainDetails.length > 0 ? (
                        <div className="flex min-w-0 flex-wrap gap-2">
                          {mainDetails.map((detail, index) => (
                            <span
                              key={`${lead._id}-main-${detail.label}-${index}`}
                              className="max-w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 xl:max-w-[180px]"
                              title={`${detail.label}: ${detail.value}`}
                            >
                              <span className="line-clamp-2 break-words">
                                {detail.label}: {detail.value}
                              </span>
                            </span>
                          ))}

                          {details.length > 3 && (
                            <span className="rounded-md border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-black text-sky-800">
                              +{details.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-300">
                          {t("crm.leads.noAdditionalData")}
                        </span>
                      )}
                    </div>

                    <div>
                      <LeadStatusBadge status={status} />
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="leading-5">
                        {formatShortDate(lead.createdAt, locale, emDash)}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {whatsAppPhone && (
                        <a
                          href={`https://wa.me/${whatsAppPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800"
                          title={t("crm.common.whatsapp")}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800"
                          title={t("crm.common.call")}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        {t("crm.common.open")}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {selectedLead && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/55 backdrop-blur-sm"
          dir={dir}
        >
          <div
            className="absolute inset-0"
            onClick={() => setSelectedLead(null)}
          />

          <section className="absolute inset-4 overflow-hidden rounded-[1.75rem] border border-slate-300 bg-slate-100 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
            <div className="flex h-full flex-col">
              <header className="flex shrink-0 items-center justify-between border-b border-slate-300 bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_100%)] px-5 py-4 text-white">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                    title={t("crm.common.close")}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-400 text-lg font-black text-slate-950 shadow-sm">
                    {getInitials(getLeadName(selectedLead, t))}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black text-white">
                      {getLeadName(selectedLead, t)}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-sky-100/90">
                      <span>{selectedLead.phone || t("crm.common.noPhone")}</span>
                      <span>•</span>
                      <span>{getLeadSourceLabel(selectedLead, t)}</span>
                      <span>•</span>
                      <span>{formatDate(selectedLead.createdAt, locale, emDash)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <LeadStatusBadge status={selectedStatus} />

                  <button
                    type="button"
                    onClick={fetchLeads}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("crm.common.refresh")}
                  </button>
                </div>
              </header>

              <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_360px] overflow-hidden">
                <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white">
                  <div className="p-5">
                    <div className="mb-5 flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-sky-600 text-2xl font-black text-black shadow-lg">
                        {getInitials(getLeadName(selectedLead, t))}
                      </div>

                      <h3 className="mt-4 max-w-full truncate text-2xl font-black text-slate-800">
                        {getLeadName(selectedLead, t)}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-slate-400">
                        {getLeadFormName(selectedLead, t)}
                      </p>
                    </div>

                    <div className="mb-5 grid grid-cols-4 gap-2">
                      {selectedWhatsAppPhone && (
                        <a
                          href={`https://wa.me/${selectedWhatsAppPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-sky-50 text-xs font-black text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
                          title={t("crm.common.whatsapp")}
                        >
                          <MessageCircle className="mb-1 h-5 w-5" />
                          {t("crm.common.whatsapp")}
                        </a>
                      )}

                      {selectedLead.phone && (
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-sky-50 text-xs font-black text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
                          title={t("crm.common.call")}
                        >
                          <Phone className="mb-1 h-5 w-5" />
                          {t("crm.common.call")}
                        </a>
                      )}

                      {selectedLead.email && (
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-slate-50 text-xs font-black text-slate-700 ring-1 ring-slate-100 transition hover:bg-slate-100"
                          title={t("crm.common.email")}
                        >
                          <Mail className="mb-1 h-5 w-5" />
                          {t("crm.common.email")}
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            selectedLead.phone ||
                              selectedLead.email ||
                              getLeadName(selectedLead, t)
                          )
                        }
                        className="flex h-14 flex-col items-center justify-center rounded-2xl bg-slate-50 text-xs font-black text-slate-700 ring-1 ring-slate-100 transition hover:bg-slate-100"
                        title={t("crm.common.copy")}
                      >
                        <Copy className="mb-1 h-5 w-5" />
                        {t("crm.common.copy")}
                      </button>
                    </div>

                    <section className="mb-5 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          {t("crm.leads.drawer.leadDetails")}
                        </h4>
                        <UserRound className="h-5 w-5 text-slate-300" />
                      </div>

                      <div className="space-y-3">
                        <DetailRow
                          label={t("crm.common.name")}
                          value={getLeadName(selectedLead, t)}
                          copyable
                        />
                        <DetailRow
                          label={t("crm.common.phone")}
                          value={selectedLead.phone}
                          copyable
                        />
                        <DetailRow
                          label={t("crm.common.email")}
                          value={selectedLead.email}
                          copyable
                        />
                        <DetailRow
                          label={t("crm.common.status")}
                          value={getStatusLabel(selectedStatus, t)}
                        />
                        <DetailRow
                          label={t("crm.common.createdDate")}
                          value={formatDate(selectedLead.createdAt, locale, emDash)}
                        />
                      </div>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          {t("crm.leads.drawer.updateStatus")}
                        </h4>
                        <ChevronDown className="h-5 w-5 text-slate-300" />
                      </div>

                      <select
                        value={selectedStatus}
                        onChange={(event) =>
                          handleStatusChange(
                            selectedLead._id,
                            event.target.value as LeadStatus
                          )
                        }
                        className={[
                          "h-12 w-full rounded-2xl border px-4 text-sm font-black outline-none transition focus:ring-4 focus:ring-sky-100",
                          statusBadgeClasses[selectedStatus],
                        ].join(" ")}
                      >
                        <option value="new">{t("crm.leads.statuses.new")}</option>
                        <option value="contacted">{t("crm.leads.statuses.contacted")}</option>
                        <option value="interested">{t("crm.leads.statuses.interested")}</option>
                        <option value="converted">{t("crm.leads.statuses.converted")}</option>
                        <option value="lost">{t("crm.leads.statuses.lost")}</option>
                      </select>
                    </section>
                  </div>
                </aside>

                <main className="min-h-0 overflow-y-auto bg-slate-50">
                  <div className="space-y-5 p-6">
                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">
                          {t("crm.leads.drawer.dataSummary")}
                        </h3>
                        <CheckCircle2 className="h-5 w-5 text-sky-500" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.common.createdDate")}
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {formatDate(selectedLead.createdAt, locale, emDash)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.leads.drawer.clientStage")}
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {t("crm.leads.drawer.clientStageLead")}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.leads.drawer.leadStatus")}
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {getStatusLabel(selectedStatus, t)}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">
                          {t("crm.leads.drawer.allFormData")}
                        </h3>

                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                          {t("crm.leads.drawer.fieldsCount", { count: selectedDetails.length })}
                        </span>
                      </div>

                      {selectedDetails.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {selectedDetails.map((detail, index) => (
                            <DetailRow
                              key={`${selectedLead._id}-record-${detail.label}-${index}`}
                              label={detail.label}
                              value={detail.value}
                              copyable
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                          <p className="text-sm font-bold text-slate-400">
                            {t("crm.leads.drawer.noFormData")}
                          </p>
                        </div>
                      )}
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-800">
                            {t("crm.leads.drawer.documentationTitle")}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            {t("crm.leads.drawer.documentationSubtitle")}
                          </p>
                        </div>

                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="mb-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                          <select
                            value={newActivityType}
                            onChange={(event) =>
                              setNewActivityType(
                                event.target.value as LeadActivityType
                              )
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
                          >
                            <option value="note">{t("crm.common.note")}</option>
                            <option value="call">{t("crm.common.call")}</option>
                            <option value="whatsapp">{t("crm.common.whatsapp")}</option>
                            <option value="task">{t("crm.common.task")}</option>
                          </select>

                          <textarea
                            value={newActivityText}
                            onChange={(event) =>
                              setNewActivityText(event.target.value)
                            }
                            placeholder={
                              newActivityType === "task"
                                ? t("crm.leads.drawer.taskPlaceholder")
                                : t("crm.leads.drawer.notePlaceholder")
                            }
                            className="min-h-[96px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold leading-7 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100"
                          />
                        </div>

                        {newActivityType === "task" && (
                          <div className="mb-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                            <div className="flex h-12 items-center gap-2 rounded-2xl bg-amber-50 px-4 text-sm font-black text-amber-700 ring-1 ring-amber-100">
                              <Bell className="h-4 w-4" />
                              {t("crm.leads.drawer.dueTime")}
                            </div>

                            <input
                              type="datetime-local"
                              value={newTaskDueAt}
                              onChange={(event) =>
                                setNewTaskDueAt(event.target.value)
                              }
                              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs font-bold text-slate-400">
                            {t("crm.leads.drawer.recordedBy")}{" "}
                            <span className="font-black text-slate-700">
                              {getCurrentUserName(t)}
                            </span>
                          </p>

                          <button
                            type="button"
                            onClick={handleAddActivity}
                            disabled={
                              savingActivity ||
                              !newActivityText.trim() ||
                              (newActivityType === "task" && !newTaskDueAt)
                            }
                            className="inline-flex h-11 items-center gap-2 rounded-md border border-sky-200/80 bg-gradient-to-l from-sky-100 via-cyan-100 to-white px-5 text-sm font-black text-black transition hover:from-sky-200/80 hover:via-cyan-100 hover:to-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                            {newActivityType === "task"
                              ? t("crm.leads.drawer.savingTask")
                              : t("crm.leads.drawer.savingActivity")}
                          </button>
                        </div>
                      </div>

                      {selectedActivities.length > 0 ? (
                        <div className="relative space-y-3 pr-6">
                          <span className="absolute right-2 top-2 h-[calc(100%-16px)] w-px bg-slate-200" />

                          {selectedActivities.map((activity) => {
                            const isTask = activity.type === "task";

                            return (
                              <div
                                key={activity._id || activity.id}
                                data-activity-id={activity._id || activity.id}
                                className={[
                                  "relative rounded-2xl border p-4 transition",
                                  highlightedActivityId &&
                                  highlightedActivityId ===
                                    (activity._id || activity.id)
                                    ? "border-sky-300 bg-sky-50 shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
                                    : isTask
                                      ? activity.taskDone
                                        ? "border-sky-200 bg-sky-50/60"
                                        : "border-blue-200 bg-blue-50/60"
                                      : "border-slate-200 bg-slate-50",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "absolute -right-[27px] top-4 h-4 w-4 rounded-full ring-4 ring-white",
                                    isTask
                                      ? activity.taskDone
                                        ? "bg-sky-500"
                                        : "bg-blue-500"
                                      : "bg-sky-500",
                                  ].join(" ")}
                                />

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {isTask && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleToggleTaskActivity(activity)
                                        }
                                        className={[
                                          "flex h-7 w-7 items-center justify-center rounded-lg border transition",
                                          activity.taskDone
                                            ? "border-sky-400 bg-sky-100 text-sky-700"
                                            : "border-blue-300 bg-white text-transparent hover:text-blue-600",
                                        ].join(" ")}
                                        title={
                                          activity.taskDone
                                            ? t("crm.leads.drawer.reopenTask")
                                            : t("crm.leads.drawer.markDone")
                                        }
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </button>
                                    )}

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                                      {getActivityTypeLabel(activity.type, t)}
                                    </span>

                                    {isTask && (
                                      <span
                                        className={[
                                          "rounded-full px-3 py-1 text-xs font-black ring-1",
                                          activity.taskDone
                                            ? "bg-sky-50 text-sky-700 ring-sky-100"
                                            : "bg-blue-50 text-blue-700 ring-blue-100",
                                        ].join(" ")}
                                      >
                                        {activity.taskDone ? t("crm.leads.drawer.completed") : t("crm.leads.drawer.open")}
                                      </span>
                                    )}

                                    <span className="text-xs font-black text-slate-500">
                                      {activity.createdBy || t("crm.common.systemUser")}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {formatDate(activity.createdAt, locale, emDash)}
                                  </div>
                                </div>

                                <p
                                  className={[
                                    "mt-3 whitespace-pre-wrap text-sm font-semibold leading-7",
                                    activity.taskDone
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700",
                                  ].join(" ")}
                                >
                                  {activity.text}
                                </p>

                                {isTask && (
                                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black">
                                    <span className="rounded-full bg-white px-3 py-1 text-amber-700 ring-1 ring-amber-100">
                                      {t("crm.leads.drawer.dueTimeLabel", {
                                        time: formatDate(activity.taskDueAt, locale, emDash),
                                      })}
                                    </span>

                                    {activity.taskCompletedAt && (
                                      <span className="rounded-full bg-white px-3 py-1 text-sky-700 ring-1 ring-sky-100">
                                        {t("crm.leads.drawer.completedBy", {
                                          name:
                                            activity.taskCompletedBy ||
                                            t("crm.common.systemUser"),
                                          time: formatDate(
                                            activity.taskCompletedAt,
                                            locale,
                                            emDash
                                          ),
                                        })}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                          <p className="text-sm font-bold text-slate-400">
                            {t("crm.leads.drawer.noActivities")}
                          </p>
                        </div>
                      )}
                    </section>

                    {selectedLead.message && (
                      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-lg font-black text-slate-800">
                          {t("crm.leads.drawer.formNote")}
                        </h3>

                        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-600">
                          {selectedLead.message}
                        </p>
                      </section>
                    )}
                  </div>
                </main>

                <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white">
                  <div className="space-y-4 p-5">
                    <section className="rounded-[1.7rem] border border-pink-100 bg-pink-50/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          {t("crm.leads.drawer.profileSummary")}
                        </h4>
                        <Sparkles className="h-5 w-5 text-pink-500" />
                      </div>

                      <p className="text-sm font-semibold leading-6 text-slate-500">
                        {t("crm.leads.drawer.profileSummaryText")}
                      </p>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          {t("crm.leads.drawer.sourceDetails")}
                        </h4>
                        <Webhook className="h-5 w-5 text-sky-600" />
                      </div>

                      <div className="space-y-3">
                        <DetailRow
                          label={t("crm.leads.drawer.source")}
                          value={getLeadSourceLabel(selectedLead, t)}
                        />
                        <DetailRow
                          label={t("crm.leads.drawer.form")}
                          value={getLeadFormName(selectedLead, t)}
                          copyable
                        />
                        <DetailRow
                          label={t("crm.leads.drawer.leadId")}
                          value={
                            selectedLead.externalLeadId ||
                            selectedLead.facebook?.leadId
                          }
                          copyable
                        />
                        <DetailRow
                          label={t("crm.leads.drawer.formId")}
                          value={
                            selectedLead.externalFormId ||
                            selectedLead.facebook?.formId
                          }
                          copyable
                        />
                        <DetailRow
                          label={t("crm.leads.drawer.pageId")}
                          value={
                            selectedLead.externalPageId ||
                            selectedLead.facebook?.pageId
                          }
                          copyable
                        />
                      </div>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          {t("crm.leads.drawer.handlingStatus")}
                        </h4>
                        <UsersRound className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.leads.drawer.activities")}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {selectedActivities.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.leads.drawer.openTasks")}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {openTaskActivitiesCount}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            {t("crm.common.status")}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {getStatusLabel(selectedStatus, t)}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </div>
      )}
        </>
      )}
    </div>
  );
}