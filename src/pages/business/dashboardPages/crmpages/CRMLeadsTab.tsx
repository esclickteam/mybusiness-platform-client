import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Flame,
  Globe2,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Plug,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
  Webhook,
  Zap,
} from "lucide-react";

type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "converted"
  | "lost";

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
  new: "bg-sky-50 text-sky-700 ring-sky-100",
  contacted: "bg-violet-50 text-violet-700 ring-violet-100",
  interested: "bg-amber-50 text-amber-700 ring-amber-100",
  converted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  lost: "bg-rose-50 text-rose-700 ring-rose-100",
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

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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
    lead.source ||
    "Webhook lead"
  );
}

function shortWebhookUrl(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const token = parsed.searchParams.get("token") || "";

    if (!token) return url;

    const maskedToken =
      token.length > 18
        ? `${token.slice(0, 14)}...${token.slice(-8)}`
        : token;

    parsed.searchParams.set("token", maskedToken);
    return parsed.toString();
  } catch {
    return url;
  }
}

export default function CRMLeadsTab({ businessId }: CRMLeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");

  const [loading, setLoading] = useState(true);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const fetchWebhookUrl = async () => {
    try {
      setWebhookLoading(true);
      setError("");

      const data = await apiRequest<{
        success: boolean;
        webhookUrl: string;
      }>("/api/integrations/facebook-leads/webhook-url");

      setWebhookUrl(data.webhookUrl || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "טעינת קישור Make נכשלה"
      );
    } finally {
      setWebhookLoading(false);
    }
  };

  const copyWebhookUrl = async () => {
    try {
      let urlToCopy = webhookUrl;

      if (!urlToCopy) {
        const data = await apiRequest<{
          success: boolean;
          webhookUrl: string;
        }>("/api/integrations/facebook-leads/webhook-url");

        urlToCopy = data.webhookUrl || "";
        setWebhookUrl(urlToCopy);
      }

      if (!urlToCopy) {
        throw new Error("לא נמצא קישור להעתקה");
      }

      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      setError("לא הצלחנו להעתיק את הקישור. אפשר להעתיק ידנית מהשדה.");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchWebhookUrl();
  }, [businessId]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const leadName = getLeadName(lead).toLowerCase();
      const sourceLabel = getLeadSourceLabel(lead).toLowerCase();
      const formName = getLeadFormName(lead).toLowerCase();

      const matchesSearch =
        !q ||
        leadName.includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.message?.toLowerCase().includes(q) ||
        lead.source?.toLowerCase().includes(q) ||
        sourceLabel.includes(q) ||
        formName.includes(q);

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
      <section className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-700 shadow-sm backdrop-blur">
                <Flame className="h-4 w-4" />
                Smart CRM Leads
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                כל הלידים שלך במקום אחד
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-500 sm:text-base">
                Bizuply מקבלת לידים אוטומטית דרך Make, מסדרת אותם ב־CRM,
                ומאפשרת לך לחזור לכל לקוח במהירות — בלי חיבור ישיר לפייסבוק
                ובלי אישורים מ־Meta.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[430px]">
              <button
                type="button"
                onClick={copyWebhookUrl}
                disabled={webhookLoading}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-[0_22px_60px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copied ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5 transition group-hover:scale-110" />
                )}
                {copied ? "הקישור הועתק" : "העתקת קישור ל־Make"}
              </button>

              <button
                type="button"
                onClick={fetchLeads}
                disabled={loading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
                רענון לידים
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="group overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                סך הכול לידים
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 transition group-hover:scale-110">
              <Flame className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                חדשים
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {stats.new}
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700 transition group-hover:scale-110">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                נוצר קשר
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {stats.contacted}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 transition group-hover:scale-110">
              <Phone className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                לידים מ־Make
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {stats.make}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 transition group-hover:scale-110">
              <Webhook className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-200/55 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-violet-100/70 blur-3xl" />

            <div className="relative p-5">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    חיבור אוטומטי
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    קישור ל־Make
                  </h3>
                </div>

                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 shadow-sm ring-1 ring-sky-100">
                  <Plug className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-sky-50/50 p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white p-3 text-sky-700 shadow-sm ring-1 ring-sky-100">
                    <Link2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      הקישור האישי שלך
                    </p>
                    <p className="text-xs font-bold text-slate-400">
                      להדבקה בשדה URL במודול HTTP
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-sky-400 via-violet-400 to-emerald-300" />

                  <div
                    className="max-h-[118px] overflow-auto break-all p-4 pt-5 text-left text-[13px] font-bold leading-6 text-slate-600"
                    dir="ltr"
                  >
                    {webhookLoading
                      ? "Loading..."
                      : webhookUrl
                        ? shortWebhookUrl(webhookUrl)
                        : "לא נטען קישור"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyWebhookUrl}
                  disabled={webhookLoading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.20)] transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copied ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                  {copied ? "הקישור הועתק בהצלחה" : "העתקת קישור ל־Make"}
                </button>

                <a
                  href="https://www.make.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  פתיחת Make
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-[0_18px_60px_rgba(14,165,233,0.10)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">
                  Setup guide
                </p>
                <h3 className="text-lg font-black text-slate-950">
                  איך להגדיר ב־Make?
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="group rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xs font-black text-sky-700">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      מודול ראשון
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                      בחרי Facebook Lead Ads או כל מקור לידים אחר בתוך Make.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xs font-black text-violet-700">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      מודול HTTP
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                      הוסיפי HTTP → Make a request ובחרי Method מסוג POST.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      הדבקת הקישור
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                      הדביקי את הקישור שהעתקת בשדה URL ושלחי Body בפורמט JSON.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

        <div className="rounded-[2.2rem] border border-white/80 bg-white p-4 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100 lg:min-w-[390px]">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="חיפוש לפי שם, טלפון, אימייל או מקור..."
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
                      "rounded-full px-3.5 py-2 text-xs font-black transition",
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

          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-slate-50"
                />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 via-white to-sky-50/40 p-8 text-center">
              <div className="pointer-events-none absolute -top-20 h-52 w-52 rounded-full bg-sky-100 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-12 h-52 w-52 rounded-full bg-violet-100 blur-3xl" />

              <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-sky-700 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-slate-100">
                <Webhook className="h-10 w-10" />
              </div>

              <h3 className="relative text-3xl font-black text-slate-950">
                אין לידים עדיין
              </h3>

              <p className="relative mt-3 max-w-xl text-base font-semibold leading-8 text-slate-500">
                ברגע ש־Make ישלח ליד חדש ל־Bizuply, הוא יופיע כאן אוטומטית
                עם שם, טלפון, אימייל, מקור וסטטוס.
              </p>

              <div className="relative mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <Send className="mx-auto h-5 w-5 text-sky-700" />
                  <p className="mt-2 text-xs font-black text-slate-700">
                    ליד נכנס
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <Code2 className="mx-auto h-5 w-5 text-violet-700" />
                  <p className="mt-2 text-xs font-black text-slate-700">
                    Make שולח API
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-700" />
                  <p className="mt-2 text-xs font-black text-slate-700">
                    מופיע ב־CRM
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyWebhookUrl}
                disabled={webhookLoading}
                className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.20)] transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:opacity-60"
              >
                {copied ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                {copied ? "הקישור הועתק" : "העתקת קישור ל־Make"}
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.7rem] border border-slate-100">
              <div className="hidden bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-400 lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_150px]">
                <span>ליד</span>
                <span>פרטי קשר</span>
                <span>מקור</span>
                <span>סטטוס</span>
                <span>נוצר בתאריך</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const status = lead.status || "new";
                  const whatsAppPhone = normalizePhoneForWhatsApp(lead.phone);
                  const leadName = getLeadName(lead);
                  const sourceLabel = getLeadSourceLabel(lead);
                  const formName = getLeadFormName(lead);

                  return (
                    <div
                      key={lead._id}
                      className="grid gap-4 px-4 py-4 transition hover:bg-slate-50/70 lg:grid-cols-[1.5fr_1fr_1fr_1fr_150px] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-sm">
                          {getInitials(leadName)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">
                            {leadName}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-bold text-slate-400">
                            {lead.message || formName || "אין הודעה"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-500">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-2 hover:text-sky-700"
                          >
                            <Phone className="h-4 w-4" />
                            {lead.phone}
                          </a>
                        )}

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 hover:text-sky-700"
                          >
                            <Mail className="h-4 w-4" />
                            {lead.email}
                          </a>
                        )}

                        {!lead.phone && !lead.email && (
                          <span className="flex items-center gap-2 text-slate-400">
                            <UserRound className="h-4 w-4" />
                            אין פרטי קשר
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black capitalize text-slate-600 ring-1 ring-slate-100">
                          {sourceLabel === "Make" ? (
                            <Webhook className="h-3.5 w-3.5 text-sky-700" />
                          ) : (
                            <Globe2 className="h-3.5 w-3.5 text-slate-500" />
                          )}
                          {sourceLabel}
                        </span>

                        {formName && (
                          <p className="mt-1 truncate text-[11px] font-bold text-slate-400">
                            {formName}
                          </p>
                        )}
                      </div>

                      <div>
                        <select
                          value={status}
                          onChange={(event) =>
                            handleStatusChange(
                              lead._id,
                              event.target.value as LeadStatus
                            )
                          }
                          className={[
                            "rounded-full border-0 px-3 py-2 text-xs font-black outline-none ring-1",
                            statusClasses[status],
                          ].join(" ")}
                        >
                          <option value="new">חדש</option>
                          <option value="contacted">נוצר קשר</option>
                          <option value="interested">מתעניין</option>
                          <option value="converted">נסגר</option>
                          <option value="lost">אבד</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between gap-3 lg:block">
                        <p className="text-xs font-bold text-slate-400">
                          {formatDate(lead.createdAt)}
                        </p>

                        <div className="mt-0 flex gap-2 lg:mt-2">
                          {whatsAppPhone && (
                            <a
                              href={`https://wa.me/${whatsAppPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              title="פתיחה בוואטסאפ"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          )}

                          {lead.externalLeadId && (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700"
                              title="External lead"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}