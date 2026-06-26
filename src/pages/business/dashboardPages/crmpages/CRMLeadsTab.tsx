import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flame,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  Webhook,
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
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  converted: "Converted",
  lost: "Lost",
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
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function formatDate(value?: string) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function getLeadName(lead: Lead) {
  return lead.name || lead.fullName || "Unknown lead";
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

  return lead.source || lead.provider || "Manual";
}

function getLeadFormName(lead: Lead) {
  return (
    lead.facebook?.formName ||
    lead.externalFormId ||
    lead.source ||
    "Webhook lead"
  );
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
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLeads();
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
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-700 shadow-sm">
                <Flame className="h-4 w-4" />
                CRM Leads
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Manage every incoming lead
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
                Leads from Make webhooks will appear here automatically. Track
                status, contact details, source, and follow up from one clean
                CRM workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchLeads}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
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
        <div className="rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Total leads
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Flame className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                New
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {stats.new}
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Contacted
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {stats.contacted}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Make leads
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {stats.make}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <Webhook className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100 lg:min-w-[380px]">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, phone, email or source..."
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
                      "rounded-full px-3.5 py-2 text-xs font-black capitalize transition",
                      statusFilter === status
                        ? "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                        : "bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-800",
                    ].join(" ")}
                  >
                    {status === "all" ? "All" : statusLabels[status]}
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
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm">
                <Webhook className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-black text-slate-950">
                No leads yet
              </h3>

              <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
                New leads sent from Make will appear here automatically after
                the webhook sends them to Bizuply.
              </p>

              <button
                type="button"
                onClick={fetchLeads}
                disabled={loading}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh leads
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-100">
              <div className="hidden bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-400 lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_150px]">
                <span>Lead</span>
                <span>Contact</span>
                <span>Source</span>
                <span>Status</span>
                <span>Created</span>
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
                            {lead.message || formName || "No message"}
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
                            No contact
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
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
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
                              title="Open WhatsApp"
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

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Integration
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  Make Webhook
                </h3>
              </div>

              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Settings2 className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                <Webhook className="h-5 w-5" />
              </div>

              <p className="text-sm font-bold leading-6 text-slate-500">
                Leads are received through Make. Once your scenario sends a POST
                request to Bizuply, every new lead will appear in this CRM list.
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Make flow
                </p>

                <p className="mt-2 text-sm font-black text-slate-950">
                  Facebook Lead Ads → HTTP POST → Bizuply CRM
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-[0_18px_50px_rgba(14,165,233,0.08)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            <h3 className="text-base font-black text-slate-950">
              Next step
            </h3>

            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              In Make, keep only the Facebook Lead Ads module and one HTTP
              module. The HTTP module should send the lead data to your Bizuply
              endpoint.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-base font-black">Ready for Make</h3>
            </div>

            <p className="text-sm font-bold leading-6 text-slate-500">
              No Facebook approval is required inside Bizuply anymore. Make
              connects to the lead source, and Bizuply only receives the final
              lead through API.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}