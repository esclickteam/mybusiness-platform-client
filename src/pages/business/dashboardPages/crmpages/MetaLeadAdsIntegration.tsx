import React, { useEffect, useMemo, useState } from "react";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Facebook,
  FileText,
  Loader2,
  Plug,
  RefreshCw,
  ShieldCheck,
  Unplug,
  Webhook,
} from "lucide-react";

type ConnectedPage = {
  pageId: string;
  pageName: string;
  connectedAt?: string;
  webhookSubscribed?: boolean;
};

type MetaPage = {
  id: string;
  name: string;
  category?: string;
  tasks?: string[];
};

type MetaLeadForm = {
  id: string;
  name: string;
  status?: string;
  leads_count?: number;
};

type SelectedForm = {
  formId: string;
  formName: string;
  selectedAt?: string;
};

type RecentLead = {
  _id?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  source?: string;
  provider?: string;
  createdAt?: string;
  externalLeadId?: string;
  facebook?: {
    pageName?: string;
    formName?: string;
    leadId?: string;
  };
};

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
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

function leadName(lead: RecentLead) {
  return lead.name || lead.fullName || "Test Lead";
}

export default function MetaLeadAdsIntegration() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [connectedPage, setConnectedPage] = useState<ConnectedPage | null>(null);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaLeadForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SelectedForm | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");

  const isConnected = Boolean(connectedPage?.pageId);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId),
    [pages, selectedPageId]
  );

  const activeForm = useMemo(
    () =>
      selectedForm?.formId
        ? forms.find((form) => String(form.id) === String(selectedForm.formId)) ||
          null
        : null,
    [forms, selectedForm]
  );

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<{
        success: boolean;
        connectedPage: ConnectedPage | null;
        pages?: MetaPage[];
        forms?: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
        recentLeads?: RecentLead[];
      }>("/api/meta-leads/status");

      const nextConnectedPage = data.connectedPage || null;

      setConnectedPage(nextConnectedPage);
      setPages(data.pages || []);
      setForms(nextConnectedPage?.pageId ? data.forms || [] : []);
      setSelectedForm(nextConnectedPage?.pageId ? data.selectedForm || null : null);
      setRecentLeads(data.recentLeads || []);

      if (nextConnectedPage?.pageId) {
        setSelectedPageId(nextConnectedPage.pageId);
      } else {
        setSelectedPageId("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load Meta status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const connectFacebook = async () => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const data = await apiRequest<{ success: boolean; url: string }>(
        "/api/meta-leads/auth-url"
      );

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not start Facebook Login"
      );
      setBusy(false);
    }
  };

  const connectPage = async () => {
    if (!selectedPageId) {
      setError("Please select a Facebook Page first.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const data = await apiRequest<{
        success: boolean;
        connectedPage: ConnectedPage;
        forms: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
      }>("/api/meta-leads/connect-page", {
        method: "POST",
        body: JSON.stringify({ pageId: selectedPageId }),
      });

      setConnectedPage(data.connectedPage);
      setForms(data.forms || []);
      setSelectedForm(data.selectedForm || null);
      setSuccess(
        "Facebook Page connected. Bizuply is now listening for Meta Lead Ads leads."
      );

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect the selected Page"
      );
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");

      await apiRequest<{ success: boolean }>("/api/meta-leads/disconnect", {
        method: "POST",
      });

      setConnectedPage(null);
      setPages([]);
      setForms([]);
      setSelectedForm(null);
      setRecentLeads([]);
      setSelectedPageId("");
      setSuccess("Meta Lead Ads integration disconnected.");

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not disconnect Meta integration"
      );
    } finally {
      setBusy(false);
    }
  };

  const refreshForms = async () => {
    try {
      setBusy(true);
      setError("");

      const data = await apiRequest<{
        success: boolean;
        forms: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
      }>("/api/meta-leads/forms");

      setForms(data.forms || []);
      if ("selectedForm" in data) {
        setSelectedForm(data.selectedForm || null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not refresh lead forms"
      );
    } finally {
      setBusy(false);
    }
  };

  const selectForm = async (form: MetaLeadForm) => {
    if (!isConnected) {
      setError("Please connect a Facebook Page before selecting a form.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const data = await apiRequest<{
        success: boolean;
        selectedForm: SelectedForm;
      }>("/api/meta-leads/select-form", {
        method: "POST",
        body: JSON.stringify({ formId: form.id }),
      });

      setSelectedForm(data.selectedForm);
      setSuccess(
        `Active form selected: ${data.selectedForm.formName || form.name}. Only leads from this form will be added to the CRM.`
      );

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not select this lead form"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      dir="ltr"
      className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 text-left text-slate-900 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-700 ring-1 ring-sky-100">
                  <Facebook className="h-4 w-4" />
                  Meta Lead Ads Integration
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
                  Connect Facebook Leads to Bizuply
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-500 sm:text-base">
                  Businesses connect their own Facebook Page, allow Bizuply to
                  subscribe to leadgen webhooks, and receive Meta Lead Ads
                  directly inside their CRM dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={loadStatus}
                disabled={loading || busy}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {loading ? (
                  <BizuplyLoader size="xs" compact />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Status
              </p>

              <p className="mt-2 text-xl font-black text-slate-900">
                {isConnected ? "Connected" : "Not connected"}
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-sky-600">
                Selected Page
              </p>

              <p className="mt-2 truncate text-xl font-black text-sky-900">
                {connectedPage?.pageName || selectedPage?.name || "—"}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
                Lead Forms
              </p>

              <p className="mt-2 text-xl font-black text-emerald-900">
                {forms.length}
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-violet-600">
                Active Form
              </p>

              <p className="mt-2 truncate text-xl font-black text-violet-900">
                {selectedForm?.formName || activeForm?.name || "Not selected"}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Connection setup
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  This is the exact end-to-end user experience shown to Meta
                  reviewers: connect Facebook, select a managed Page, subscribe
                  to leadgen webhooks, then display forms and leads.
                </p>
              </div>

              <ShieldCheck className="h-7 w-7 text-sky-600" />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      1. Connect Facebook
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Uses public_profile, pages_show_list,
                      pages_read_engagement, pages_manage_ads and
                      leads_retrieval during Facebook Login.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={connectFacebook}
                    disabled={busy}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-sky-200/80 bg-gradient-to-l from-sky-100 via-cyan-100 to-white px-4 text-sm font-black text-black transition hover:from-sky-200/80 hover:via-cyan-100 hover:to-white disabled:opacity-60"
                  >
                    {busy ? (
                      <BizuplyLoader size="xs" compact />
                    ) : (
                      <Plug className="h-4 w-4" />
                    )}
                    Connect Facebook
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-black text-slate-900">
                  2. Select a Facebook Page
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  The business user can only choose Pages returned by Meta for
                  their own account.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <select
                    value={selectedPageId}
                    onChange={(event) => setSelectedPageId(event.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
                  >
                    <option value="">Select Page</option>

                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={connectPage}
                    disabled={busy || !selectedPageId}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50 disabled:opacity-60"
                  >
                    <Webhook className="h-4 w-4" />
                    Connect Page
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      3. Webhook subscription
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Bizuply subscribes the selected Page to the leadgen
                      webhook using pages_manage_metadata.
                    </p>
                  </div>

                  <span
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-black",
                      connectedPage?.webhookSubscribed
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {connectedPage?.webhookSubscribed
                      ? "Listening for new leads"
                      : "Not subscribed"}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900">
                      4. Active lead form
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Select one Lead Ads form. Bizuply will add CRM leads only
                      from the selected form ID.
                    </p>
                  </div>

                  <span
                    className={[
                      "max-w-[240px] truncate rounded-full px-3 py-1.5 text-xs font-black",
                      selectedForm?.formId
                        ? "bg-white text-violet-700 ring-1 ring-violet-100"
                        : "bg-white/70 text-slate-500 ring-1 ring-slate-200",
                    ].join(" ")}
                    title={selectedForm?.formName || "No form selected"}
                  >
                    {selectedForm?.formName || "No form selected"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Connected Page
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  The data belongs only to the connected business account.
                </p>
              </div>

              {isConnected && (
                <button
                  type="button"
                  onClick={disconnect}
                  disabled={busy}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 text-xs font-black text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                >
                  <Unplug className="h-4 w-4" />
                  Disconnect
                </button>
              )}
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-sky-600">
                    Page
                  </p>

                  <p className="mt-1 text-lg font-black text-sky-950">
                    {connectedPage?.pageName}
                  </p>

                  <p className="mt-1 text-xs font-bold text-sky-700">
                    Page ID: {connectedPage?.pageId}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
                    Connection
                  </p>

                  <p className="mt-1 text-sm font-black text-emerald-900">
                    Page connected successfully
                  </p>

                  <p className="mt-1 text-xs font-bold text-emerald-700">
                    Connected at: {formatDate(connectedPage?.connectedAt)}
                  </p>
                </div>

                <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-violet-600">
                    Active Lead Form
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    {selectedForm?.formName || "No form selected yet"}
                  </p>

                  <p className="mt-1 text-xs font-bold text-violet-700">
                    {selectedForm?.formId
                      ? `Form ID: ${selectedForm.formId}`
                      : "Choose one form below to start accepting CRM leads."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <Plug className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 text-lg font-black text-slate-700">
                  No Facebook Page connected yet
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Connect Facebook and select a managed Page to continue.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Lead Forms
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Choose one active Lead Ads form. Only leads from the selected
                  form will be added to the CRM.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshForms}
                disabled={busy || !isConnected}
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh forms
              </button>
            </div>

            <div className="mb-4 rounded-3xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800">
                    {selectedForm?.formName
                      ? `Active form: ${selectedForm.formName}`
                      : "No active form selected"}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-violet-700">
                    {selectedForm?.formId
                      ? `Only new leads from Form ID ${selectedForm.formId} will be saved in Bizuply.`
                      : forms.length === 1
                        ? "One form is available. Select it to make the behavior explicit for this business."
                        : "Select one form so Bizuply ignores leads from other forms on the same Page."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {forms.length > 0 ? (
                forms.map((form) => (
                  <div
                    key={form.id}
                    className={[
                      "flex flex-col gap-4 rounded-3xl border p-4 transition sm:flex-row sm:items-center sm:justify-between",
                      selectedForm?.formId === form.id
                        ? "border-violet-200 bg-violet-50 shadow-[0_12px_35px_rgba(124,58,237,0.08)]"
                        : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={[
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                          selectedForm?.formId === form.id
                            ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                            : "bg-white text-sky-600 ring-1 ring-slate-200",
                        ].join(" ")}
                      >
                        {selectedForm?.formId === form.id ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {form.name}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Form ID: {form.id}
                        </p>

                        {selectedForm?.formId === form.id && (
                          <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                            Selected active form
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectForm(form)}
                      disabled={busy || !isConnected || selectedForm?.formId === form.id}
                      className={[
                        "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-70",
                        selectedForm?.formId === form.id
                          ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                          : "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50",
                      ].join(" ")}
                    >
                      {busy ? (
                        <BizuplyLoader size="xs" compact />
                      ) : selectedForm?.formId === form.id ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      {selectedForm?.formId === form.id
                        ? "Selected form"
                        : "Select form"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    No lead forms found yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Recent Leads
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Leads received from Meta Lead Ads webhooks.
                </p>
              </div>

              <ExternalLink className="h-5 w-5 text-slate-300" />
            </div>

            <div className="space-y-3">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead, index) => (
                  <div
                    key={lead._id || lead.externalLeadId || index}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {leadName(lead)}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {lead.phone || "No phone"}{" "}
                          {lead.email ? `• ${lead.email}` : ""}
                        </p>
                      </div>

                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                        Meta Lead Ads
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-bold text-slate-400">
                      Received: {formatDate(lead.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Webhook className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-4 text-sm font-bold text-slate-500">
                    No leads yet. New Meta Lead Ads leads will appear here
                    automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}