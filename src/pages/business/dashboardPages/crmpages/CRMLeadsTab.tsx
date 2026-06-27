import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
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
  value?: string | string[];
  values?: string[];
  answer?: string;
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
    value?: string;
  }[];

  rawFieldData?: RawFieldItem[] | string;
  fieldData?: RawFieldItem[] | string;
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


const RAW_API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const statusLabels: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  interested: "מתעניין",
  converted: "נסגר",
  lost: "אבד",
};

const statusBadgeClasses: Record<LeadStatus, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-700",
  contacted: "border-violet-200 bg-violet-50 text-violet-700",
  interested: "border-amber-200 bg-amber-50 text-amber-700",
  converted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lost: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusDotClasses: Record<LeadStatus, string> = {
  new: "bg-sky-500",
  contacted: "bg-violet-500",
  interested: "bg-amber-500",
  converted: "bg-emerald-500",
  lost: "bg-rose-500",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getCurrentUserName() {
  if (typeof window === "undefined") return "משתמש מערכת";

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

  if (!rawUser) return "משתמש מערכת";

  try {
    const user = JSON.parse(rawUser);
    return (
      user?.name ||
      user?.fullName ||
      user?.businessName ||
      user?.email ||
      "משתמש מערכת"
    );
  } catch {
    return "משתמש מערכת";
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "הבקשה נכשלה");
  }

  return data as T;
}

function cleanText(value?: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
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

function formatDate(value?: string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function formatShortDate(value?: string) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function getLeadName(lead: Lead) {
  return lead.name || lead.fullName || "ליד ללא שם";
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

function getLeadSourceLabel(lead: Lead) {
  const source = String(lead.source || lead.provider || "").toLowerCase();

  if (source.includes("make")) return "Make";
  if (source.includes("facebook")) return "Facebook";
  if (source.includes("meta")) return "Meta";
  if (source.includes("webhook")) return "Webhook";
  if (lead.externalLeadId || lead.facebook?.leadId) return "Make";

  return lead.source || lead.provider || "ידני";
}

function getLeadFormName(lead: Lead) {
  return (
    lead.facebook?.formName ||
    lead.externalFormId ||
    lead.facebook?.formId ||
    lead.source ||
    "Webhook lead"
  );
}

function getRawFieldValue(field: RawFieldItem) {
  if (Array.isArray(field.values)) {
    return cleanText(field.values[0]);
  }

  if (Array.isArray(field.value)) {
    return cleanText(field.value[0]);
  }

  return cleanText(field.value || field.answer || "");
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
    return parsed;
  }

  return [];
}

function getLeadDetails(lead: Lead): LeadDetail[] {
  const details: LeadDetail[] = [];

  const pushDetail = (label?: unknown, value?: unknown) => {
    const cleanLabel = cleanText(label);
    const cleanValue = cleanText(value);

    if (!cleanLabel || !cleanValue) return;

    const exists = details.some(
      (item) =>
        item.label.trim() === cleanLabel &&
        item.value.trim() === cleanValue
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

  pushDetail("כמות מוזמנים", lead.guestCount);
  pushDetail("שירות מעניין", lead.interestedService);
  pushDetail("תאריך אירוע", lead.eventDate);
  pushDetail("סוג אירוע", lead.eventType);

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

function getLeadSearchText(lead: Lead) {
  const detailsText = getLeadDetails(lead)
    .map((detail) => `${detail.label} ${detail.value}`)
    .join(" ");

  return [
    getLeadName(lead),
    lead.phone,
    lead.email,
    lead.message,
    lead.source,
    lead.provider,
    getLeadSourceLabel(lead),
    getLeadFormName(lead),
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

function getActivityTypeLabel(type?: LeadActivityType) {
  switch (type) {
    case "call":
      return "שיחה";
    case "whatsapp":
      return "וואטסאפ";
    case "status":
      return "סטטוס";
    case "task":
      return "משימה";
    case "note":
    default:
      return "הערה";
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
  const cleanValue = cleanText(value);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-black text-slate-400">{label}</p>

        {copyable && cleanValue && (
          <button
            type="button"
            onClick={() => copyText(cleanValue)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-sky-50 hover:text-sky-700"
            title="העתקה"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p
        className={[
          "break-words text-sm font-black text-slate-900",
          cleanValue ? "" : "text-slate-300",
        ].join(" ")}
        dir={/[A-Za-z0-9@+]/.test(cleanValue) ? "ltr" : "rtl"}
      >
        {cleanValue || "—"}
      </p>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black",
        statusBadgeClasses[status],
      ].join(" ")}
    >
      <span className={`h-2 w-2 rounded-full ${statusDotClasses[status]}`} />
      {statusLabels[status]}
    </span>
  );
}

function SourceBadge({ lead }: { lead: Lead }) {
  const sourceLabel = getLeadSourceLabel(lead);

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
        {sourceLabel.toLowerCase().includes("make") ? (
          <Webhook className="h-3.5 w-3.5 shrink-0 text-sky-700" />
        ) : (
          <Globe2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        )}

        <span className="truncate">{sourceLabel}</span>
      </span>

      <span className="max-w-full truncate text-xs font-bold text-slate-400">
        {getLeadFormName(lead)}
      </span>
    </div>
  );
}

export default function CRMLeadsTab({ businessId }: CRMLeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<{ success: boolean; leads: Lead[] }>(
        "/api/crm/leads/my"
      );

      const nextLeads = Array.isArray(data.leads) ? data.leads : [];
      setLeads(nextLeads);

      setSelectedLead((current) => {
        if (!current) return null;
        return nextLeads.find((lead) => lead._id === current._id) || current;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "טעינת הלידים נכשלה");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchLeads();
  }, [businessId]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch = !q || getLeadSearchText(lead).includes(q);

      const matchesStatus =
        statusFilter === "all" || (lead.status || "new") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new" || !lead.status).length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      interested: leads.filter((lead) => lead.status === "interested").length,
      converted: leads.filter((lead) => lead.status === "converted").length,
      integration: leads.filter((lead) => {
        const label = getLeadSourceLabel(lead).toLowerCase();
        return (
          label.includes("make") ||
          label.includes("facebook") ||
          label.includes("meta") ||
          label.includes("webhook")
        );
      }).length,
    };
  }, [leads]);

  const selectedDetails = selectedLead ? getLeadDetails(selectedLead) : [];
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
      const saved = await apiRequest<{
        success: boolean;
        lead?: Lead;
        activity?: LeadActivity;
      }>(`/api/crm/leads/${leadId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
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
      setLeads(previousLeads);
      setSelectedLead(
        previousLeads.find((lead) => lead._id === leadId) || selectedLead
      );
      setError(err instanceof Error ? err.message : "עדכון הסטטוס נכשל");
    }
  };

  const handleAddActivity = async () => {
  if (!selectedLead || !newActivityText.trim()) return;

  if (newActivityType === "task" && !newTaskDueAt) {
    setError("כדי לשמור משימה צריך לבחור תאריך ושעה לטיפול.");
    return;
  }

  const leadId = selectedLead._id;

  /*
    חשוב:
    datetime-local מחזיר שעה מקומית בלי timezone.
    new Date(newTaskDueAt).toISOString() ממיר אותה ל־UTC תקין לשמירה בשרת.
    ככה אם בחרת 16:43 בישראל, זה יישמר נכון כ־13:43Z,
    ובתצוגה בישראל יוצג שוב 16:43.
  */
  const taskDueAtIso =
    newActivityType === "task" && newTaskDueAt
      ? new Date(newTaskDueAt).toISOString()
      : null;

  const tempActivity: LeadActivity = {
    id: crypto.randomUUID(),
    type: newActivityType,
    text: newActivityText.trim(),
    createdBy: getCurrentUserName(),
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
    const saved = await apiRequest<{
      success: boolean;
      activity?: LeadActivity;
      lead?: Lead;
    }>(`/api/crm/leads/${leadId}/activities`, {
      method: "POST",
      body: JSON.stringify({
        type: tempActivity.type,
        text: tempActivity.text,
        taskDueAt:
          tempActivity.type === "task" ? tempActivity.taskDueAt : null,
      }),
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
        : "שמירת התיעוד נכשלה. בדקי שה־API של activities מעודכן."
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
                  taskCompletedBy: nextDone ? getCurrentUserName() : "",
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
                taskCompletedBy: nextDone ? getCurrentUserName() : "",
              }
            : item
        ),
      };
    });

    try {
      const saved = await apiRequest<{ success: boolean; lead?: Lead }>(
        `/api/crm/leads/${leadId}/activities/${activityId}/done`,
        {
          method: "PATCH",
          body: JSON.stringify({ done: nextDone }),
        }
      );

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
        err instanceof Error ? err.message : "עדכון המשימה נכשל"
      );
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 bg-slate-50/60" dir="rtl">


      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(20,184,166,0.10)]">
        <div className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-l from-teal-50 via-white to-sky-50 p-6 text-slate-800 sm:p-7">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-700 ring-1 ring-teal-100 shadow-sm">
                <Sparkles className="h-4 w-4" />
                CRM חכם
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                ניהול לידים
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-500 sm:text-base">
                טבלת לידים מקצועית, תיק לקוח מלא, תיעודים ומשימות כחלק
                מהטיימליין, כולל התראות באתר לפי זמן טיפול.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-black text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
              רענון לידים
            </button>
          </div>
        </div>

        <div className="grid gap-4 bg-white p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black text-slate-400">סך הכול</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {stats.total}
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
            <p className="text-xs font-black text-sky-600">חדשים</p>
            <p className="mt-2 text-3xl font-black text-sky-800">
              {stats.new}
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
            <p className="text-xs font-black text-violet-600">נוצר קשר</p>
            <p className="mt-2 text-3xl font-black text-violet-800">
              {stats.contacted}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-xs font-black text-emerald-600">נסגרו</p>
            <p className="mt-2 text-3xl font-black text-emerald-800">
              {stats.converted}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-xs font-black text-amber-600">משימות פתוחות</p>
            <p className="mt-2 text-3xl font-black text-amber-800">
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
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="w-full min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(20,184,166,0.08)]">
        <div className="border-b border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="חיפוש לפי שם, טלפון, אימייל, מקור או פרטי ליד..."
                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-500">
                <Filter className="h-4 w-4" />
                סינון
              </div>

              {(["all", "new", "contacted", "interested", "converted", "lost"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "rounded-2xl px-4 py-2 text-xs font-black transition",
                      statusFilter === status
                        ? "bg-teal-600 text-white shadow-[0_12px_30px_rgba(20,184,166,0.14)]"
                        : "bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-800",
                    ].join(" ")}
                  >
                    {status === "all" ? "הכול" : statusLabels[status]}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-slate-50"
              />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <Webhook className="h-9 w-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-800">
              אין לידים להצגה
            </h3>

            <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-500">
              ברגע שייכנס ליד חדש, הוא יופיע כאן עם כל השדות מהטופס.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="hidden border-b border-slate-200 bg-slate-50 px-4 py-4 text-xs font-black uppercase tracking-[0.08em] text-slate-400 xl:grid xl:grid-cols-[1.25fr_1.05fr_0.75fr_1.45fr_0.7fr_0.8fr_1fr] xl:gap-4">
              <div>ליד</div>
              <div>פרטי קשר</div>
              <div>מקור</div>
              <div>נתונים עיקריים</div>
              <div>סטטוס</div>
              <div>תאריך יצירה</div>
              <div>פעולות</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const status = lead.status || "new";
                const leadName = getLeadName(lead);
                const details = getLeadDetails(lead);
                const whatsAppPhone = normalizePhoneForWhatsApp(lead.phone);
                const mainDetails = details.slice(0, 3);

                return (
                  <article
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className={[
                      "cursor-pointer px-4 py-4 transition hover:bg-sky-50/40",
                      selectedLead?._id === lead._id ? "bg-sky-50/70" : "",
                      "grid gap-4 xl:grid-cols-[1.25fr_1.05fr_0.75fr_1.45fr_0.7fr_0.8fr_1fr] xl:items-center",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-sm font-black text-white shadow-sm">
                        {getInitials(leadName)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-800">
                          {leadName}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-400">
                          {lead.email || lead.phone || "אין פרטי קשר"}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-black text-slate-400 xl:hidden">
                        פרטי קשר
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
                          אין טלפון
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
                        נתונים עיקריים
                      </p>

                      {mainDetails.length > 0 ? (
                        <div className="flex min-w-0 flex-wrap gap-2">
                          {mainDetails.map((detail, index) => (
                            <span
                              key={`${lead._id}-main-${detail.label}-${index}`}
                              className="max-w-full truncate rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600 ring-1 ring-slate-100 xl:max-w-[145px]"
                              title={`${detail.label}: ${detail.value}`}
                            >
                              {detail.label}: {detail.value}
                            </span>
                          ))}

                          {details.length > 3 && (
                            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                              +{details.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-300">
                          אין נתונים נוספים
                        </span>
                      )}
                    </div>

                    <div>
                      <LeadStatusBadge status={status} />
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="leading-5">
                        {formatShortDate(lead.createdAt)}
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
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                          title="וואטסאפ"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
                          title="חיוג"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl bg-teal-600 px-4 text-xs font-black text-white transition hover:bg-teal-700"
                      >
                        פתיחה
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
          className="fixed inset-0 z-[90] bg-teal-600/45 backdrop-blur-sm"
          dir="rtl"
        >
          <div
            className="absolute inset-0"
            onClick={() => setSelectedLead(null)}
          />

          <section className="absolute inset-4 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-[0_30px_120px_rgba(20,184,166,0.18)]">
            <div className="flex h-full flex-col">
              <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                    title="סגירה"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white shadow-sm">
                    {getInitials(getLeadName(selectedLead))}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black text-slate-800">
                      {getLeadName(selectedLead)}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                      <span>{selectedLead.phone || "אין טלפון"}</span>
                      <span>•</span>
                      <span>{getLeadSourceLabel(selectedLead)}</span>
                      <span>•</span>
                      <span>{formatDate(selectedLead.createdAt)}</span>
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
                    רענון
                  </button>
                </div>
              </header>

              <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_360px] overflow-hidden">
                <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white">
                  <div className="p-5">
                    <div className="mb-5 flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-teal-600 text-2xl font-black text-white shadow-lg">
                        {getInitials(getLeadName(selectedLead))}
                      </div>

                      <h3 className="mt-4 max-w-full truncate text-2xl font-black text-slate-800">
                        {getLeadName(selectedLead)}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-slate-400">
                        {getLeadFormName(selectedLead)}
                      </p>
                    </div>

                    <div className="mb-5 grid grid-cols-4 gap-2">
                      {selectedWhatsAppPhone && (
                        <a
                          href={`https://wa.me/${selectedWhatsAppPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-emerald-50 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                          title="וואטסאפ"
                        >
                          <MessageCircle className="mb-1 h-5 w-5" />
                          וואטסאפ
                        </a>
                      )}

                      {selectedLead.phone && (
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-sky-50 text-xs font-black text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
                          title="חיוג"
                        >
                          <Phone className="mb-1 h-5 w-5" />
                          חיוג
                        </a>
                      )}

                      {selectedLead.email && (
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-slate-50 text-xs font-black text-slate-700 ring-1 ring-slate-100 transition hover:bg-slate-100"
                          title="מייל"
                        >
                          <Mail className="mb-1 h-5 w-5" />
                          מייל
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            selectedLead.phone ||
                              selectedLead.email ||
                              getLeadName(selectedLead)
                          )
                        }
                        className="flex h-14 flex-col items-center justify-center rounded-2xl bg-slate-50 text-xs font-black text-slate-700 ring-1 ring-slate-100 transition hover:bg-slate-100"
                        title="העתקה"
                      >
                        <Copy className="mb-1 h-5 w-5" />
                        העתקה
                      </button>
                    </div>

                    <section className="mb-5 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          פרטי הליד
                        </h4>
                        <UserRound className="h-5 w-5 text-slate-300" />
                      </div>

                      <div className="space-y-3">
                        <DetailRow
                          label="שם"
                          value={getLeadName(selectedLead)}
                          copyable
                        />
                        <DetailRow
                          label="טלפון"
                          value={selectedLead.phone}
                          copyable
                        />
                        <DetailRow
                          label="אימייל"
                          value={selectedLead.email}
                          copyable
                        />
                        <DetailRow
                          label="סטטוס"
                          value={statusLabels[selectedStatus]}
                        />
                        <DetailRow
                          label="תאריך יצירה"
                          value={formatDate(selectedLead.createdAt)}
                        />
                      </div>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          עדכון סטטוס
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
                        <option value="new">חדש</option>
                        <option value="contacted">נוצר קשר</option>
                        <option value="interested">מתעניין</option>
                        <option value="converted">נסגר</option>
                        <option value="lost">אבד</option>
                      </select>
                    </section>
                  </div>
                </aside>

                <main className="min-h-0 overflow-y-auto bg-slate-50">
                  <div className="space-y-5 p-6">
                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">
                          סיכום נתונים
                        </h3>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            תאריך יצירה
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {formatDate(selectedLead.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            שלב לקוח
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            ליד
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-400">
                            סטטוס ליד
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {statusLabels[selectedStatus]}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">
                          כל נתוני הטופס
                        </h3>

                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                          {selectedDetails.length} שדות
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
                            אין נתוני טופס נוספים לליד הזה
                          </p>
                        </div>
                      )}
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-800">
                            תיעוד, הערות ומשימות
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            משימה היא תיעוד מסוג משימה, עם תאריך ושעה לטיפול.
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
                            <option value="note">הערה</option>
                            <option value="call">שיחה</option>
                            <option value="whatsapp">וואטסאפ</option>
                            <option value="task">משימה</option>
                          </select>

                          <textarea
                            value={newActivityText}
                            onChange={(event) =>
                              setNewActivityText(event.target.value)
                            }
                            placeholder={
                              newActivityType === "task"
                                ? "כתוב את המשימה לביצוע..."
                                : "כתוב כאן תיעוד, הערה, שיחה, עדכון מול הלקוח..."
                            }
                            className="min-h-[96px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold leading-7 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100"
                          />
                        </div>

                        {newActivityType === "task" && (
                          <div className="mb-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                            <div className="flex h-12 items-center gap-2 rounded-2xl bg-amber-50 px-4 text-sm font-black text-amber-700 ring-1 ring-amber-100">
                              <Bell className="h-4 w-4" />
                              זמן טיפול
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
                            יתועד על שם:{" "}
                            <span className="font-black text-slate-700">
                              {getCurrentUserName()}
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
                            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                            {newActivityType === "task"
                              ? "שמירת משימה"
                              : "שמירת תיעוד"}
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
                                className={[
                                  "relative rounded-2xl border p-4",
                                  isTask
                                    ? activity.taskDone
                                      ? "border-emerald-200 bg-emerald-50/60"
                                      : "border-amber-200 bg-amber-50/60"
                                    : "border-slate-200 bg-slate-50",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "absolute -right-[27px] top-4 h-4 w-4 rounded-full ring-4 ring-white",
                                    isTask
                                      ? activity.taskDone
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
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
                                            ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                                            : "border-amber-300 bg-white text-transparent hover:text-amber-600",
                                        ].join(" ")}
                                        title={
                                          activity.taskDone
                                            ? "פתח משימה מחדש"
                                            : "סמן כבוצע"
                                        }
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </button>
                                    )}

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                                      {getActivityTypeLabel(activity.type)}
                                    </span>

                                    {isTask && (
                                      <span
                                        className={[
                                          "rounded-full px-3 py-1 text-xs font-black ring-1",
                                          activity.taskDone
                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                            : "bg-amber-50 text-amber-700 ring-amber-100",
                                        ].join(" ")}
                                      >
                                        {activity.taskDone
                                          ? "בוצעה"
                                          : "פתוחה"}
                                      </span>
                                    )}

                                    <span className="text-xs font-black text-slate-500">
                                      {activity.createdBy || "משתמש מערכת"}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {formatDate(activity.createdAt)}
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
                                      זמן טיפול: {formatDate(activity.taskDueAt)}
                                    </span>

                                    {activity.taskCompletedAt && (
                                      <span className="rounded-full bg-white px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">
                                        בוצע על ידי{" "}
                                        {activity.taskCompletedBy ||
                                          "משתמש מערכת"}{" "}
                                        · {formatDate(activity.taskCompletedAt)}
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
                            עדיין אין תיעודים לליד הזה
                          </p>
                        </div>
                      )}
                    </section>

                    {selectedLead.message && (
                      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-lg font-black text-slate-800">
                          הערה מהטופס
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
                          סיכום תיק
                        </h4>
                        <Sparkles className="h-5 w-5 text-pink-500" />
                      </div>

                      <p className="text-sm font-semibold leading-6 text-slate-500">
                        כל התיעודים והמשימות מופיעים במרכז התיק לפי סדר זמן.
                      </p>
                    </section>

                    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-800">
                          פרטי מקור
                        </h4>
                        <Webhook className="h-5 w-5 text-sky-600" />
                      </div>

                      <div className="space-y-3">
                        <DetailRow
                          label="מקור"
                          value={getLeadSourceLabel(selectedLead)}
                        />
                        <DetailRow
                          label="טופס"
                          value={getLeadFormName(selectedLead)}
                          copyable
                        />
                        <DetailRow
                          label="Lead ID"
                          value={
                            selectedLead.externalLeadId ||
                            selectedLead.facebook?.leadId
                          }
                          copyable
                        />
                        <DetailRow
                          label="Form ID"
                          value={
                            selectedLead.externalFormId ||
                            selectedLead.facebook?.formId
                          }
                          copyable
                        />
                        <DetailRow
                          label="Page ID"
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
                          מצב טיפול
                        </h4>
                        <UsersRound className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            תיעודים
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {selectedActivities.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            משימות פתוחות
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {openTaskActivitiesCount}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-xs font-black text-slate-400">
                            סטטוס
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {statusLabels[selectedStatus]}
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