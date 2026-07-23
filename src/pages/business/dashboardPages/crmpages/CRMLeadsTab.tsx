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
  LayoutGrid,
  LayoutList,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
  Webhook,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { TFunction } from "i18next";

import MetaLeadAdsIntegration from "./MetaLeadAdsIntegration";
import GoogleAdsLeadIntegration from "./GoogleAdsLeadIntegration";
import AdNetworkPickerModal, {
  type AdNetworkId,
} from "./AdNetworkPickerModal";
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

  google?: {
    leadId?: string;
    formId?: string;
    formName?: string;
    campaignId?: string;
    adgroupId?: string;
    gclId?: string;
    createdTime?: string;
    isTest?: boolean;
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
  new: "border-sky-200 bg-sky-100 text-sky-700",
  contacted: "border-amber-200 bg-amber-100 text-amber-800",
  interested: "border-violet-200 bg-violet-100 text-violet-700",
  converted: "border-emerald-200 bg-emerald-100 text-emerald-700",
  lost: "border-rose-200 bg-rose-100 text-rose-700",
};

const statusDotClasses: Record<LeadStatus, string> = {
  new: "bg-sky-500",
  contacted: "bg-amber-500",
  interested: "bg-violet-500",
  converted: "bg-emerald-500",
  lost: "bg-rose-500",
};

const AVATAR_TONES = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
] as const;

function getAvatarTone(seed?: string) {
  const text = String(seed || "lead");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i) * (i + 1)) % AVATAR_TONES.length;
  }
  return AVATAR_TONES[hash];
}

function formatDaySeparatorLabel(value?: string, locale = "he-IL", fallback = "—") {
  if (!value) return fallback;

  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return fallback;
  }
}

const LEADS_PER_PAGE = 50;

function getObjectIdTime(lead: Lead) {
  const id = String(lead._id || "");
  if (/^[a-f\d]{24}$/i.test(id)) {
    return parseInt(id.slice(0, 8), 16) * 1000;
  }
  return 0;
}

function parseLeadTime(raw?: string) {
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isFinite(time) && time > 0 ? time : 0;
}

function getLeadCreatedTime(lead: Lead) {
  // Prefer provider lead time so date groups match the real lead day,
  // then CRM createdAt, then Mongo ObjectId creation time.
  return (
    parseLeadTime(lead.google?.createdTime) ||
    parseLeadTime(lead.facebook?.createdTime) ||
    parseLeadTime(lead.createdAt) ||
    getObjectIdTime(lead) ||
    0
  );
}

function compareLeadsNewestFirst(a: Lead, b: Lead) {
  const timeDiff = getLeadCreatedTime(b) - getLeadCreatedTime(a);
  if (timeDiff !== 0) return timeDiff;

  // Same calendar/source time: prefer the lead that entered CRM later.
  const createdDiff =
    parseLeadTime(b.createdAt) - parseLeadTime(a.createdAt);
  if (createdDiff !== 0) return createdDiff;

  return String(b._id || "").localeCompare(String(a._id || ""));
}

function getLeadDateKey(lead: Lead) {
  const time = getLeadCreatedTime(lead);
  if (!time) return "unknown";
  const date = new Date(time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateKeyLabel(key: string, locale = "he-IL", fallback = "—") {
  if (key === "unknown") return fallback;
  // Noon avoids timezone shifting the calendar day.
  return formatDaySeparatorLabel(`${key}T12:00:00`, locale, fallback);
}

function getNextOpenTask(lead: Lead) {
  const tasks = (lead.activities || []).filter(
    (activity) => activity.type === "task" && !activity.taskDone
  );

  if (!tasks.length) return null;

  return [...tasks].sort((a, b) => {
    const aTime = new Date(a.taskDueAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.taskDueAt || b.createdAt || 0).getTime();
    return aTime - bTime;
  })[0];
}

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

function isGoogleLead(lead: Lead) {
  const source = String(lead.source || lead.provider || "").toLowerCase();
  return (
    source.includes("google") ||
    Boolean(lead.google?.leadId) ||
    Boolean(lead.google?.formId)
  );
}

function isMetaLead(lead: Lead) {
  if (isGoogleLead(lead)) return false;

  const source = String(lead.source || lead.provider || "").toLowerCase();

  return (
    source.includes("meta") ||
    source.includes("facebook") ||
    source.includes("leadgen") ||
    Boolean(lead.facebook?.leadId) ||
    Boolean(lead.facebook?.formId) ||
    Boolean(lead.facebook?.pageId)
  );
}

function getLeadSourceLabel(lead: Lead, t: TFunction) {
  if (isGoogleLead(lead)) return t("crm.leads.sources.googleAds");
  if (isMetaLead(lead)) return t("crm.leads.sources.metaLeadAds");

  return lead.source || lead.provider || t("crm.leads.sources.manual");
}

function getLeadFormName(lead: Lead, t: TFunction) {
  return (
    lead.google?.formName ||
    lead.facebook?.formName ||
    lead.externalFormId ||
    lead.google?.formId ||
    lead.facebook?.formId ||
    (isGoogleLead(lead)
      ? t("crm.leads.sources.googleForm")
      : isMetaLead(lead)
        ? t("crm.leads.sources.metaForm")
        : lead.source) ||
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
    lead.google?.leadId,
    lead.google?.formId,
    lead.google?.formName,
    lead.google?.campaignId,
    lead.google?.gclId,
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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black",
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
  const google = isGoogleLead(lead);
  const meta = isMetaLead(lead);

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm">
        {google ? (
          <Globe2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        ) : meta ? (
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

  const showMetaSetup =
    searchParams.get("metaSetup") === "1" ||
    searchParams.get("meta_connected") === "1" ||
    Boolean(searchParams.get("meta_error"));
  const showGoogleSetup = searchParams.get("googleSetup") === "1";
  const deepLinkLeadId = searchParams.get("leadId") || "";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [highlightedActivityId, setHighlightedActivityId] = useState("");
  const [showAdNetworkPicker, setShowAdNetworkPicker] = useState(false);
  const [metaConnected, setMetaConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<
    "all" | "meta" | "google" | "other"
  >("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [currentPage, setCurrentPage] = useState(1);

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
  const leadsScrollRef = useRef<HTMLDivElement | null>(null);

  // After Meta OAuth callback, keep the wizard open on step 2 (page/form).
  useEffect(() => {
    const metaConnected = searchParams.get("meta_connected") === "1";
    const metaError = searchParams.get("meta_error");
    if (!metaConnected && !metaError) return;
    if (searchParams.get("metaSetup") === "1") return;

    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    next.delete("googleSetup");
    next.delete("leadId");
    setSearchParams(next, { replace: false });
  };

  const openGoogleSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.set("googleSetup", "1");
    next.delete("metaSetup");
    next.delete("leadId");
    setSearchParams(next, { replace: false });
  };

  const closeMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("metaSetup");
    setSearchParams(next, { replace: false });
  };

  const closeGoogleSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("googleSetup");
    setSearchParams(next, { replace: false });
  };

  const handleAdNetworkSelect = (network: AdNetworkId) => {
    setShowAdNetworkPicker(false);
    if (network === "meta") openMetaSetup();
    if (network === "google") openGoogleSetup();
  };

  useEffect(() => {
    let cancelled = false;

    const loadConnectionBadges = async () => {
      try {
        const tenantParams = businessId ? { businessId } : undefined;
        const [metaRes, googleRes] = await Promise.all([
          API.get<{ success?: boolean; connectedPage?: { pageId?: string } | null }>(
            "/meta-leads/status",
            { params: tenantParams }
          ).catch(() => null),
          API.get<{
            success?: boolean;
            connection?: { enabled?: boolean };
          }>("/google-ads-leads/status", { params: tenantParams }).catch(
            () => null
          ),
        ]);

        if (cancelled) return;
        setMetaConnected(Boolean(metaRes?.data?.connectedPage?.pageId));
        setGoogleConnected(Boolean(googleRes?.data?.connection?.enabled));
      } catch {
        if (!cancelled) {
          setMetaConnected(false);
          setGoogleConnected(false);
        }
      }
    };

    void loadConnectionBadges();
    return () => {
      cancelled = true;
    };
  }, [businessId, showMetaSetup, showGoogleSetup]);

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

  const fetchLeadsSilentRef = useRef<number | null>(null);

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
    if (!deepLinkLeadId || showMetaSetup || showGoogleSetup) return;

    void (async () => {
      await openLeadFromNotification({ leadId: deepLinkLeadId });

      // Keep the lead open, but strip the query so refresh doesn't loop the drawer.
      const next = new URLSearchParams(searchParams);
      if (next.has("leadId")) {
        next.delete("leadId");
        setSearchParams(next, { replace: true });
      }
    })();
  }, [deepLinkLeadId, showMetaSetup, showGoogleSetup, leads.length]);

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

    return leads
      .filter((lead) => {
        const matchesSearch = !q || getLeadSearchText(lead, t).includes(q);

        const matchesStatus =
          statusFilter === "all" || (lead.status || "new") === statusFilter;

        const meta = isMetaLead(lead);
        const google = isGoogleLead(lead);
        const matchesSource =
          sourceFilter === "all" ||
          (sourceFilter === "meta" && meta) ||
          (sourceFilter === "google" && google) ||
          (sourceFilter === "other" && !meta && !google);

        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort(compareLeadsNewestFirst);
  }, [leads, search, statusFilter, sourceFilter, t]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / LEADS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sourceFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * LEADS_PER_PAGE;
    return filteredLeads.slice(start, start + LEADS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const leadDateGroups = useMemo(() => {
    const groups: Array<{ key: string; label: string; leads: Lead[] }> = [];

    // Build groups in already-sorted newest-first order so each distinct
    // calendar day gets its own gray separator row.
    for (const lead of paginatedLeads) {
      const key = getLeadDateKey(lead);
      const last = groups[groups.length - 1];

      if (last && last.key === key) {
        last.leads.push(lead);
        continue;
      }

      groups.push({
        key,
        label: formatDateKeyLabel(key, locale, emDash),
        leads: [lead],
      });
    }

    return groups.map((group) => ({
      ...group,
      leads: [...group.leads].sort(compareLeadsNewestFirst),
    }));
  }, [paginatedLeads, locale, emDash]);

  const stats = useMemo(() => {
    const openTasks = leads.reduce(
      (sum, lead) =>
        sum +
        (lead.activities || []).filter(
          (activity) => activity.type === "task" && !activity.taskDone
        ).length,
      0
    );

    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new" || !lead.status).length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      interested: leads.filter((lead) => lead.status === "interested").length,
      converted: leads.filter((lead) => lead.status === "converted").length,
      openTasks,
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
    <div className="w-full min-w-0 bg-[#F7F8FC] p-3 sm:p-5" dir={dir}>
      {showMetaSetup ? (
        <MetaLeadAdsIntegration
          businessId={businessId}
          onBack={closeMetaSetup}
        />
      ) : showGoogleSetup ? (
        <GoogleAdsLeadIntegration
          businessId={businessId}
          onBack={closeGoogleSetup}
        />
      ) : (
                <div className="flex h-[calc(100vh-7.5rem)] min-h-[720px] flex-col gap-4">
          <div className="shrink-0 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {t("crm.leads.title")}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                  {t("crm.leads.subtitle")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={[
                      "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-black transition",
                      viewMode === "list"
                        ? "bg-[#6D28D9] text-white"
                        : "text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                    {t("crm.leads.listView")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("board")}
                    className={[
                      "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-black transition",
                      viewMode === "board"
                        ? "bg-[#6D28D9] text-white"
                        : "text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    {t("crm.leads.boardView")}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-transparent bg-gradient-to-br from-[#6D28D9] to-[#2563EB] p-4 text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white/80">
                      {t("crm.leads.stats.total")}
                    </p>
                    <p className="mt-2 text-3xl font-black tracking-tight">
                      {stats.total}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <UsersRound className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {[
                {
                  key: "new",
                  label: t("crm.leads.stats.new"),
                  value: stats.new,
                  icon: UserRound,
                  iconWrap: "bg-sky-100 text-sky-600",
                },
                {
                  key: "contacted",
                  label: t("crm.leads.stats.contacted"),
                  value: stats.contacted,
                  icon: Clock3,
                  iconWrap: "bg-amber-100 text-amber-600",
                },
                {
                  key: "converted",
                  label: t("crm.leads.stats.converted"),
                  value: stats.converted,
                  icon: Trophy,
                  iconWrap: "bg-emerald-100 text-emerald-600",
                },
                {
                  key: "openTasks",
                  label: t("crm.leads.stats.openTasks"),
                  value: stats.openTasks,
                  icon: Sparkles,
                  iconWrap: "bg-rose-100 text-rose-600",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                          {item.value}
                        </p>
                      </div>
                      <div
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-xl",
                          item.iconWrap,
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex shrink-0 items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="shrink-0 space-y-3 border-b border-slate-100 p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("crm.leads.searchPlaceholder")}
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={sourceFilter}
                    onChange={(event) =>
                      setSourceFilter(
                        event.target.value as "all" | "meta" | "google" | "other"
                      )
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none"
                  >
                    <option value="all">{t("crm.leads.filters.allSources")}</option>
                    <option value="meta">{t("crm.leads.filters.metaOnly")}</option>
                    <option value="google">{t("crm.leads.filters.googleOnly")}</option>
                    <option value="other">{t("crm.leads.filters.otherSources")}</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as "all" | LeadStatus
                      )
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none"
                  >
                    <option value="all">{t("crm.common.all")}</option>
                    <option value="new">{t("crm.leads.statuses.new")}</option>
                    <option value="contacted">{t("crm.leads.statuses.contacted")}</option>
                    <option value="interested">{t("crm.leads.statuses.interested")}</option>
                    <option value="converted">{t("crm.leads.statuses.converted")}</option>
                    <option value="lost">{t("crm.leads.statuses.lost")}</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAdNetworkPicker(true)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                  >
                    <Facebook className="h-3.5 w-3.5 text-[#6D28D9]" />
                    {t("crm.leads.connectAdNetwork")}
                  </button>

                  {(metaConnected || googleConnected) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {metaConnected && (
                        <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-black text-sky-700 ring-1 ring-sky-100">
                          Meta
                        </span>
                      )}
                      {googleConnected && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100">
                          Google
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fetchLeads()}
                    disabled={loading}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <BizuplyLoader size="xs" compact />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {t("crm.leads.refreshLeads")}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-500">
                  <Filter className="h-3.5 w-3.5" />
                  {t("crm.common.filter")}
                </div>

                {(
                  [
                    { id: "all", dot: "bg-slate-800" },
                    { id: "new", dot: "bg-sky-500" },
                    { id: "contacted", dot: "bg-amber-400" },
                    { id: "interested", dot: "bg-violet-500" },
                    { id: "converted", dot: "bg-emerald-500" },
                    { id: "lost", dot: "bg-rose-500" },
                  ] as const
                ).map((item) => {
                  const active = statusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatusFilter(item.id)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black transition",
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200",
                      ].join(" ")}
                    >
                      <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                      {item.id === "all"
                        ? t("crm.common.all")
                        : getStatusLabel(item.id, t)}
                    </button>
                  );
                })}
              </div>
            </div>

            {viewMode === "board" ? (
              <div className="flex min-h-0 flex-1 items-center justify-center p-10 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-[#6D28D9]">
                    <LayoutGrid className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-black text-slate-700">
                    {t("crm.leads.boardSoon")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden shrink-0 border-b border-slate-100 bg-[#F8FAFC] px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-slate-400 xl:grid xl:grid-cols-[1.35fr_1.15fr_0.9fr_0.8fr_1.15fr_0.85fr_0.95fr] xl:gap-3">
                  <div>{t("crm.leads.table.lead")}</div>
                  <div>{t("crm.leads.table.contactDetails")}</div>
                  <div>{t("crm.leads.table.source")}</div>
                  <div>{t("crm.leads.table.status")}</div>
                  <div>{t("crm.leads.table.nextTask")}</div>
                  <div>{t("crm.leads.table.agent")}</div>
                  <div>{t("crm.leads.table.actions")}</div>
                </div>

                <div
                  ref={(node) => {
                    leadsScrollRef.current = node;
                    // RTL overflow containers often start scrolled to the bottom.
                    if (node) node.scrollTop = 0;
                  }}
                  data-leads-scroll
                  className="min-h-0 flex-1 overflow-y-auto"
                  style={{ direction: "ltr" }}
                >
                  <div dir={dir}>
                  {loading ? (
                    <div className="space-y-3 p-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-16 animate-pulse rounded-xl bg-slate-100"
                        />
                      ))}
                    </div>
                  ) : paginatedLeads.length === 0 ? (
                    <div className="flex min-h-full flex-col items-center justify-center p-10 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-[#6D28D9]">
                        <Webhook className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800">
                        {t("crm.leads.emptyTitle")}
                      </h3>
                      <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                        {t("crm.leads.emptyDescription")}
                      </p>
                    </div>
                  ) : (
                    leadDateGroups.map((group, groupIndex) => (
                      <div key={`${group.key}-${groupIndex}`}>
                        <div className="sticky top-0 z-10 border-y border-slate-200/80 bg-[#EEF0F5] px-4 py-2">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                            <CalendarDays className="h-3.5 w-3.5 text-[#6D28D9]" />
                            <span className="capitalize">{group.label}</span>
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 ring-1 ring-slate-200">
                              {group.leads.length}
                            </span>
                          </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {group.leads.map((lead) => {
                            const status = lead.status || "new";
                            const leadName = getLeadName(lead, t);
                            const whatsAppPhone = normalizePhoneForWhatsApp(
                              lead.phone
                            );
                            const nextTask = getNextOpenTask(lead);

                            return (
                              <article
                                key={lead._id}
                                onClick={() => setSelectedLead(lead)}
                                className={[
                                  "cursor-pointer px-4 py-3.5 transition hover:bg-violet-50/40",
                                  selectedLead?._id === lead._id
                                    ? "bg-violet-50/70"
                                    : "bg-white",
                                  "grid gap-3 xl:grid-cols-[1.35fr_1.15fr_0.9fr_0.8fr_1.15fr_0.85fr_0.95fr] xl:items-center",
                                ].join(" ")}
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <div
                                    className={[
                                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black",
                                      getAvatarTone(leadName),
                                    ].join(" ")}
                                  >
                                    {getInitials(leadName)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-slate-800">
                                      {leadName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                                      {getLeadFormName(lead, t)}
                                    </p>
                                  </div>
                                </div>

                                <div className="min-w-0 space-y-1">
                                  {lead.phone ? (
                                    <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-700">
                                      <Phone className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                                      <span className="truncate" dir="ltr">
                                        {lead.phone}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="text-sm font-semibold text-slate-300">
                                      {t("crm.common.noPhone")}
                                    </p>
                                  )}
                                  {lead.email && (
                                    <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500">
                                      <Mail className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                                      <span className="truncate" dir="ltr">
                                        {lead.email}
                                      </span>
                                    </p>
                                  )}
                                </div>

                                <SourceBadge lead={lead} />

                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <LeadStatusBadge status={status} />
                                    {isGoogleLead(lead) && lead.google?.isTest && (
                                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                                        {t("crm.leads.googleIntegration.testBadge")}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="min-w-0">
                                  {nextTask ? (
                                    <div>
                                      <p className="truncate text-xs font-black text-slate-700">
                                        {nextTask.text}
                                      </p>
                                      <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                        <CalendarDays className="h-3 w-3" />
                                        {formatShortDate(
                                          nextTask.taskDueAt ||
                                            nextTask.createdAt ||
                                            undefined,
                                          locale,
                                          emDash
                                        )}
                                      </p>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-300">
                                      {t("crm.leads.noNextTask")}
                                    </span>
                                  )}
                                </div>

                                <div className="flex min-w-0 items-center gap-2">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <UserRound className="h-4 w-4" />
                                  </div>
                                  <span className="truncate text-xs font-bold text-slate-500">
                                    {t("crm.leads.unassignedAgent")}
                                  </span>
                                </div>

                                <div
                                  className="flex items-center gap-1.5"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {whatsAppPhone && (
                                    <a
                                      href={"https://wa.me/" + whatsAppPhone}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-emerald-600 transition hover:bg-emerald-50"
                                      title={t("crm.common.whatsapp")}
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                    </a>
                                  )}
                                  {lead.phone && (
                                    <a
                                      href={"tel:" + lead.phone}
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 transition hover:bg-sky-50"
                                      title={t("crm.common.call")}
                                    >
                                      <Phone className="h-4 w-4" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLead(lead)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 text-xs font-black text-white transition hover:bg-[#5B21B6]"
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
                    ))
                  )}
                  </div>
                </div>

                {filteredLeads.length > 0 && (
                  <div
                    className="flex shrink-0 items-center justify-start gap-1 border-t border-slate-100 bg-white px-4 py-3"
                    dir="ltr"
                  >
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      const active = page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            if (leadsScrollRef.current) {
                              leadsScrollRef.current.scrollTop = 0;
                            }
                          }}
                          className={[
                            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-black transition",
                            active
                              ? "bg-[#6D28D9] text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                          ].join(" ")}
                          aria-label={t("crm.leads.pageNumber", { page })}
                          aria-current={active ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      <AdNetworkPickerModal
        open={showAdNetworkPicker}
        onClose={() => setShowAdNetworkPicker(false)}
        onSelect={handleAdNetworkSelect}
      />

      {selectedLead && (
        <div
          className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm"
          dir={dir}
        >
          <div
            className="absolute inset-0"
            onClick={() => setSelectedLead(null)}
          />

          <section className="absolute inset-4 overflow-hidden rounded-2xl border border-slate-200 bg-[#F4F5F8] shadow-[0_30px_100px_rgba(15,23,42,0.25)]">
            <div className="flex h-full flex-col">
              <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                    title={t("crm.common.close")}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div
                    className={[
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-black",
                      getAvatarTone(getLeadName(selectedLead, t)),
                    ].join(" ")}
                  >
                    {getInitials(getLeadName(selectedLead, t))}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black text-slate-800">
                      {getLeadName(selectedLead, t)}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                      <span>{selectedLead.phone || t("crm.common.noPhone")}</span>
                      <span>•</span>
                      <span>{getLeadSourceLabel(selectedLead, t)}</span>
                      {isGoogleLead(selectedLead) && selectedLead.google?.isTest && (
                        <>
                          <span>•</span>
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                            {t("crm.leads.googleIntegration.testBadge")}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>
                        {formatDate(
                          selectedLead.google?.createdTime ||
                            selectedLead.facebook?.createdTime ||
                            selectedLead.createdAt,
                          locale,
                          emDash
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <LeadStatusBadge status={selectedStatus} />

                  <button
                    type="button"
                    onClick={() => {
                      void fetchLeads();
                    }}
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
                            selectedLead.google?.leadId ||
                            selectedLead.facebook?.leadId
                          }
                          copyable
                        />
                        <DetailRow
                          label={t("crm.leads.drawer.formId")}
                          value={
                            selectedLead.externalFormId ||
                            selectedLead.google?.formId ||
                            selectedLead.facebook?.formId
                          }
                          copyable
                        />
                        {isGoogleLead(selectedLead) ? (
                          <>
                            <DetailRow
                              label={t("crm.leads.drawer.campaignId")}
                              value={selectedLead.google?.campaignId}
                              copyable
                            />
                            <DetailRow
                              label={t("crm.leads.drawer.gclid")}
                              value={selectedLead.google?.gclId}
                              copyable
                            />
                          </>
                        ) : (
                          <DetailRow
                            label={t("crm.leads.drawer.pageId")}
                            value={
                              selectedLead.externalPageId ||
                              selectedLead.facebook?.pageId
                            }
                            copyable
                          />
                        )}
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
    </div>
  );
}