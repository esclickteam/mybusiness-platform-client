import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Facebook,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type MetaPage = {
  id: string;
  name: string;
  perms?: string[];
};

type MetaForm = {
  id: string;
  name: string;
  status?: string;
  created_time?: string;
  locale?: string;
};

type PagesResponse = {
  success: boolean;
  pages: MetaPage[];
  message?: string;
};

type FormsResponse = {
  success: boolean;
  forms: MetaForm[];
  message?: string;
};

type ConnectResponse = {
  success: boolean;
  message?: string;
  integration?: {
    id: string;
    businessId: string;
    pageId: string;
    pageName: string;
    formId: string;
    formName: string;
    status: string;
  };
};

const RAW_API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

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
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export default function MetaCallbackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const sessionId = searchParams.get("sessionId");
  const callbackError = searchParams.get("error");

  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaForm[]>([]);

  const [selectedPage, setSelectedPage] = useState<MetaPage | null>(null);
  const [selectedForm, setSelectedForm] = useState<MetaForm | null>(null);

  const [pageSearch, setPageSearch] = useState("");
  const [formSearch, setFormSearch] = useState("");

  const [loadingPages, setLoadingPages] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const businessId = user?.businessId;

  const filteredPages = useMemo(() => {
    const q = pageSearch.trim().toLowerCase();

    if (!q) return pages;

    return pages.filter((page) => page.name.toLowerCase().includes(q));
  }, [pages, pageSearch]);

  const filteredForms = useMemo(() => {
    const q = formSearch.trim().toLowerCase();

    if (!q) return forms;

    return forms.filter((form) => form.name.toLowerCase().includes(q));
  }, [forms, formSearch]);

  const loadPages = async () => {
    if (!sessionId) {
      setError("Missing Meta session. Please reconnect Facebook.");
      return;
    }

    try {
      setLoadingPages(true);
      setError("");

      const data = await apiRequest<PagesResponse>(
        `/api/integrations/meta/sessions/${sessionId}/pages`
      );

      setPages(Array.isArray(data.pages) ? data.pages : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Facebook pages"
      );
    } finally {
      setLoadingPages(false);
    }
  };

  const loadForms = async (page: MetaPage) => {
    if (!sessionId) {
      setError("Missing Meta session. Please reconnect Facebook.");
      return;
    }

    try {
      setSelectedPage(page);
      setSelectedForm(null);
      setForms([]);
      setLoadingForms(true);
      setError("");

      const data = await apiRequest<FormsResponse>(
        `/api/integrations/meta/pages/${page.id}/forms?sessionId=${encodeURIComponent(
          sessionId
        )}`
      );

      setForms(Array.isArray(data.forms) ? data.forms : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Facebook lead forms"
      );
    } finally {
      setLoadingForms(false);
    }
  };

  const handleConnectForm = async () => {
    if (!sessionId || !selectedPage || !selectedForm) {
      setError("Please choose a Facebook page and a lead form.");
      return;
    }

    try {
      setConnecting(true);
      setError("");

      const data = await apiRequest<ConnectResponse>(
        "/api/integrations/meta/connect-form",
        {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            pageId: selectedPage.id,
            pageName: selectedPage.name,
            formId: selectedForm.id,
            formName: selectedForm.name,
          }),
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to connect form");
      }

      setConnected(true);

      setTimeout(() => {
        if (businessId) {
          navigate(`/business/${businessId}/dashboard/crm/leads`, {
            replace: true,
          });
        } else {
          navigate("/", { replace: true });
        }
      }, 1300);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect Facebook form"
      );
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (success === "0") {
      setError(
        callbackError ||
          "Facebook connection failed. Please try connecting again."
      );
      return;
    }

    if (success === "1" && sessionId) {
      loadPages();
    }
  }, [success, sessionId]);

  const goBackToLeads = () => {
    if (businessId) {
      navigate(`/business/${businessId}/dashboard/crm/leads`);
      return;
    }

    navigate("/");
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,#eef6ff_0%,#f8fbff_38%,#ffffff_100%)] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={goBackToLeads}
          className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </button>

        <section className="overflow-hidden rounded-[2.3rem] border border-white/80 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.09)] backdrop-blur-xl">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                  <Facebook className="h-4 w-4" />
                  Facebook Lead Forms
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                  Choose the page and lead form
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
                  Select which Facebook page and lead form should send leads
                  automatically into Bizuply CRM.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-100">
                      Status
                    </p>
                    <p className="text-sm font-black text-white">
                      {connected
                        ? "Connected"
                        : sessionId
                        ? "Facebook authorized"
                        : "Waiting for Facebook"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700 sm:m-6">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {connected ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <h2 className="text-2xl font-black text-slate-950">
                Facebook form connected successfully
              </h2>

              <p className="mt-3 max-w-md text-sm font-bold leading-6 text-slate-500">
                Every new lead from this form will now appear inside your
                Bizuply CRM Leads page.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
              <section className="rounded-[2rem] border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Step 1
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      Select Facebook Page
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                    <Facebook className="h-5 w-5" />
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <Search className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    value={pageSearch}
                    onChange={(event) => setPageSearch(event.target.value)}
                    placeholder="Search Facebook pages..."
                    className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                {loadingPages ? (
                  <div className="flex min-h-[260px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-700" />
                  </div>
                ) : filteredPages.length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
                    <AlertCircle className="mb-3 h-8 w-8 text-slate-300" />
                    <h3 className="text-sm font-black text-slate-900">
                      No pages found
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      Make sure your Facebook account has admin access to a page.
                    </p>

                    <button
                      type="button"
                      onClick={loadPages}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-sky-950"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
                    {filteredPages.map((page) => {
                      const isActive = selectedPage?.id === page.id;

                      return (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => loadForms(page)}
                          className={[
                            "w-full rounded-2xl border p-4 text-left transition",
                            isActive
                              ? "border-sky-200 bg-white shadow-[0_16px_40px_rgba(14,165,233,0.12)]"
                              : "border-slate-100 bg-white hover:border-sky-100 hover:bg-sky-50/50",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-950">
                                {page.name}
                              </p>
                              <p className="mt-1 truncate text-xs font-bold text-slate-400">
                                Page ID: {page.id}
                              </p>
                            </div>

                            {isActive ? (
                              <BadgeCheck className="h-5 w-5 shrink-0 text-sky-700" />
                            ) : (
                              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Step 2
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      Select Lead Form
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                {!selectedPage ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <Facebook className="mb-3 h-9 w-9 text-slate-300" />
                    <h3 className="text-sm font-black text-slate-900">
                      Choose a page first
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      After selecting a Facebook page, its lead forms will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 rounded-2xl bg-sky-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
                        Selected page
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-950">
                        {selectedPage.name}
                      </p>
                    </div>

                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <Search className="h-5 w-5 shrink-0 text-slate-400" />
                      <input
                        value={formSearch}
                        onChange={(event) => setFormSearch(event.target.value)}
                        placeholder="Search lead forms..."
                        className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {loadingForms ? (
                      <div className="flex min-h-[260px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-700" />
                      </div>
                    ) : filteredForms.length === 0 ? (
                      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <AlertCircle className="mb-3 h-8 w-8 text-slate-300" />
                        <h3 className="text-sm font-black text-slate-900">
                          No lead forms found
                        </h3>
                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                          This page may not have Facebook Lead Ads forms yet.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[330px] space-y-3 overflow-y-auto pr-1">
                        {filteredForms.map((form) => {
                          const isActive = selectedForm?.id === form.id;

                          return (
                            <button
                              key={form.id}
                              type="button"
                              onClick={() => setSelectedForm(form)}
                              className={[
                                "w-full rounded-2xl border p-4 text-left transition",
                                isActive
                                  ? "border-sky-200 bg-sky-50 shadow-[0_16px_40px_rgba(14,165,233,0.12)]"
                                  : "border-slate-100 bg-white hover:border-sky-100 hover:bg-sky-50/50",
                              ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-slate-950">
                                    {form.name}
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-slate-400">
                                    Created: {formatDate(form.created_time)}
                                  </p>

                                  {form.status && (
                                    <span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
                                      {form.status}
                                    </span>
                                  )}
                                </div>

                                {isActive && (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-700" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConnectForm}
                      disabled={!selectedForm || connecting}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BadgeCheck className="h-4 w-4" />
                      )}
                      {connecting ? "Connecting form..." : "Connect selected form"}
                    </button>
                  </>
                )}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}