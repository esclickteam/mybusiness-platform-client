import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Flame,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  Webhook,
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

const statusClasses: Record<LeadStatus, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-700",
  contacted: "border-violet-200 bg-violet-50 text-violet-700",
  interested: "border-amber-200 bg-amber-50 text-amber-700",
  converted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lost: "border-rose-200 bg-rose-50 text-rose-700",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
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

function formatDate(value?: string) {
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
  if (source.includes("facebook")) return "Make";
  if (source.includes("meta")) return "Make";
  if (source.includes("webhook")) return "Make";
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

export default function CRMLeadsTab({ businessId }: CRMLeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<{ success: boolean; leads: Lead[] }>(
        "/api/crm/leads/my"
      );

      setLeads(Array.isArray(data.leads) ? data.leads : []);
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
      make: leads.filter((lead) => {
        const label = getLeadSourceLabel(lead).toLowerCase();
        return label.includes("make");
      }).length,
    };
  }, [leads]);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead._id === leadId ? { ...lead, status } : lead
      )
    );

    try {
      await apiRequest(`/api/crm/leads/${leadId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      setLeads(previousLeads);
      setError(err instanceof Error ? err.message : "עדכון הסטטוס נכשל");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-100 bg-gradient-to-l from-slate-950 via-slate-900 to-sky-900 p-6 text-white sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-100 ring-1 ring-white/15">
                <Flame className="h-4 w-4" />
                Smart CRM Leads
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                ניהול לידים
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-200 sm:text-base">
                כל הלידים מסודרים במקום אחד, עם פרטי קשר, נתוני הטופס, מקור,
                סטטוס ופעולות מהירות.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-black text-white shadow-lg shadow-sky-950/20 transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
              רענון לידים
            </button>
          </div>
        </div>

        <div className="grid gap-4 bg-slate-50/70 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black text-slate-400">סך הכול</p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {stats.total}
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm">
            <p className="text-xs font-black text-sky-600">חדשים</p>
            <p className="mt-2 text-3xl font-black text-sky-800">
              {stats.new}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
            <p className="text-xs font-black text-amber-600">מתעניינים</p>
            <p className="mt-2 text-3xl font-black text-amber-800">
              {stats.interested}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
            <p className="text-xs font-black text-emerald-600">נסגרו</p>
            <p className="mt-2 text-3xl font-black text-emerald-800">
              {stats.converted}
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
            <p className="text-xs font-black text-violet-600">Make</p>
            <p className="mt-2 text-3xl font-black text-violet-800">
              {stats.make}
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

      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-4 sm:p-5">
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

            <div className="flex flex-wrap gap-2">
              {(["all", "new", "contacted", "interested", "converted", "lost"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-black transition",
                      statusFilter === status
                        ? "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
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
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-3xl bg-slate-50"
              />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <Webhook className="h-9 w-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              אין לידים להצגה
            </h3>

            <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-500">
              ברגע שייכנס ליד חדש, הוא יופיע כאן עם כל השדות מהטופס.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => {
              const status = lead.status || "new";
              const whatsAppPhone = normalizePhoneForWhatsApp(lead.phone);
              const leadName = getLeadName(lead);
              const sourceLabel = getLeadSourceLabel(lead);
              const formName = getLeadFormName(lead);
              const details = getLeadDetails(lead);

              return (
                <article
                  key={lead._id}
                  className="grid gap-5 p-4 transition hover:bg-slate-50/80 sm:p-5 xl:grid-cols-[minmax(240px,1.15fr)_minmax(220px,0.9fr)_minmax(340px,1.5fr)_190px]"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-sm">
                      {getInitials(leadName)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-lg font-black text-slate-950">
                        {leadName}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          {sourceLabel === "Make" ? (
                            <Webhook className="h-3.5 w-3.5 text-sky-700" />
                          ) : (
                            <Globe2 className="h-3.5 w-3.5 text-slate-500" />
                          )}
                          {sourceLabel}
                        </span>

                        {formName && (
                          <span className="max-w-[180px] truncate rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 ring-1 ring-slate-100">
                            {formName}
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="mt-3 line-clamp-2 text-xs font-bold leading-6 text-slate-500">
                          {lead.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      פרטי קשר
                    </p>

                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                      >
                        <Phone className="h-4 w-4" />
                        <span dir="ltr">{lead.phone}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-400">
                        <UserRound className="h-4 w-4" />
                        אין טלפון
                      </div>
                    )}

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="truncate" dir="ltr">
                          {lead.email}
                        </span>
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      נתוני ליד
                    </p>

                    {details.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {details.map((detail, index) => (
                          <div
                            key={`${lead._id}-${detail.label}-${index}`}
                            className="min-w-[150px] max-w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                          >
                            <p className="text-[11px] font-black text-slate-400">
                              {detail.label}
                            </p>
                            <p className="mt-1 break-words text-sm font-black leading-5 text-slate-900">
                              {detail.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-bold text-slate-400">
                        אין נתונים נוספים
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                        סטטוס
                      </p>

                      <select
                        value={status}
                        onChange={(event) =>
                          handleStatusChange(
                            lead._id,
                            event.target.value as LeadStatus
                          )
                        }
                        className={[
                          "w-full rounded-2xl border px-3 py-2.5 text-sm font-black outline-none transition focus:ring-4 focus:ring-sky-100",
                          statusClasses[status],
                        ].join(" ")}
                      >
                        <option value="new">חדש</option>
                        <option value="contacted">נוצר קשר</option>
                        <option value="interested">מתעניין</option>
                        <option value="converted">נסגר</option>
                        <option value="lost">אבד</option>
                      </select>

                      <p className="mt-3 text-xs font-bold text-slate-400">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {whatsAppPhone && (
                        <a
                          href={`https://wa.me/${whatsAppPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                          title="פתיחה בוואטסאפ"
                        >
                          <MessageCircle className="h-4 w-4" />
                          וואטסאפ
                        </a>
                      )}

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
                          title="חיוג"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}

                      {lead.externalLeadId && (
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-100"
                          title="External lead"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}