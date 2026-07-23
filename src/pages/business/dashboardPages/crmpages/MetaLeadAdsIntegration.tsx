import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Facebook,
  FileText,
  Plug,
  RefreshCw,
  Unplug,
  Webhook,
} from "lucide-react";
import API from "@api";
import {
  isAdminUser,
  setAdminActiveBusinessId,
} from "../../../../utils/adminTenant";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { getIntlLocale } from "../../../../i18n/localeUtils";

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

type MetaLeadAdsIntegrationProps = {
  businessId?: string;
  onBack?: () => void;
};

type WizardStep = 1 | 2 | 3;

const T = "crm.leads.metaIntegration";

export default function MetaLeadAdsIntegration({
  businessId,
  onBack,
}: MetaLeadAdsIntegrationProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = getIntlLocale(i18n.language);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forceSetup, setForceSetup] = useState(false);

  const [connectedPage, setConnectedPage] = useState<ConnectedPage | null>(null);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaLeadForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SelectedForm | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");

  const isConnected = Boolean(connectedPage?.pageId);
  const hasAccount = pages.length > 0 || isConnected;
  const hasForm = Boolean(selectedForm?.formId);
  const tenantParams = businessId ? { businessId } : undefined;
  const emDash = t(`${T}.emDash`);

  const wizardStep: WizardStep = !hasAccount
    ? 1
    : !isConnected || !hasForm || forceSetup
      ? 2
      : 3;

  const formatDate = (value?: string) => {
    if (!value) return emDash;

    try {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch {
      return emDash;
    }
  };

  const leadDisplayName = (lead: RecentLead) =>
    lead.name || lead.fullName || t(`${T}.unnamedLead`);

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

      const { data } = await API.get<{
        success: boolean;
        connectedPage: ConnectedPage | null;
        pages?: MetaPage[];
        forms?: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
        recentLeads?: RecentLead[];
      }>("/meta-leads/status", {
        params: tenantParams,
      });

      const nextConnectedPage = data.connectedPage || null;

      setConnectedPage(nextConnectedPage);
      setPages(data.pages || []);
      setForms(nextConnectedPage?.pageId ? data.forms || [] : []);
      setSelectedForm(nextConnectedPage?.pageId ? data.selectedForm || null : null);
      setRecentLeads(data.recentLeads || []);

      if (nextConnectedPage?.pageId) {
        setSelectedPageId(nextConnectedPage.pageId);
        if (data.selectedForm?.formId) {
          setForceSetup(false);
        }
      } else {
        setSelectedPageId("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.loadStatus`)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId && isAdminUser()) {
      setAdminActiveBusinessId(businessId);
    }
    loadStatus();
  }, [businessId]);

  const connectFacebook = async () => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const { data } = await API.get<{ success: boolean; url: string }>(
        "/meta-leads/auth-url",
        { params: tenantParams }
      );

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.startLogin`)
      );
      setBusy(false);
    }
  };

  const connectPage = async () => {
    if (!selectedPageId) {
      setError(t(`${T}.errors.selectPageFirst`));
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const { data } = await API.post<{
        success: boolean;
        connectedPage: ConnectedPage;
        forms: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
      }>(
        "/meta-leads/connect-page",
        { pageId: selectedPageId },
        { params: tenantParams }
      );

      setConnectedPage(data.connectedPage);
      setForms(data.forms || []);
      setSelectedForm(data.selectedForm || null);
      setSuccess(t(`${T}.successPageConnected`));
      setForceSetup(true);

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.connectPage`)
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

      await API.post("/meta-leads/disconnect", {}, { params: tenantParams });

      setConnectedPage(null);
      setForms([]);
      setSelectedForm(null);
      setRecentLeads([]);
      setSelectedPageId("");
      setForceSetup(true);
      setSuccess(t(`${T}.successDisconnected`));

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.disconnect`)
      );
    } finally {
      setBusy(false);
    }
  };

  const refreshForms = async () => {
    try {
      setBusy(true);
      setError("");

      const { data } = await API.get<{
        success: boolean;
        forms: MetaLeadForm[];
        selectedForm?: SelectedForm | null;
      }>("/meta-leads/forms", {
        params: tenantParams,
      });

      setForms(data.forms || []);
      if ("selectedForm" in data) {
        setSelectedForm(data.selectedForm || null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.refreshForms`)
      );
    } finally {
      setBusy(false);
    }
  };

  const selectForm = async (form: MetaLeadForm) => {
    if (!isConnected) {
      setError(t(`${T}.errors.connectBeforeForm`));
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const { data } = await API.post<{
        success: boolean;
        selectedForm: SelectedForm;
      }>(
        "/meta-leads/select-form",
        { formId: form.id },
        { params: tenantParams }
      );

      setSelectedForm(data.selectedForm);
      setForceSetup(false);
      setSuccess(
        t(`${T}.successFormSelected`, {
          name: data.selectedForm.formName || form.name,
        })
      );

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.selectForm`)
      );
    } finally {
      setBusy(false);
    }
  };

  const syncLeadsFromMeta = async () => {
    if (!isConnected) {
      setError(t(`${T}.errors.connectBeforeSync`));
      return;
    }

    if (!selectedForm?.formId && !activeForm?.id) {
      setError(t(`${T}.errors.selectFormBeforeSync`));
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      const { data } = await API.post<{
        success: boolean;
        imported?: number;
        message?: string;
        recentLeads?: RecentLead[];
      }>(
        "/meta-leads/sync-leads",
        {
          formId: selectedForm?.formId || activeForm?.id,
        },
        { params: tenantParams }
      );

      if (Array.isArray(data.recentLeads)) {
        setRecentLeads(data.recentLeads);
      }

      setSuccess(
        data.message ||
          t(`${T}.successSynced`, { count: data.imported || 0 })
      );

      window.dispatchEvent(new CustomEvent("bizuply:leads-synced"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.syncFailed`)
      );
    } finally {
      setBusy(false);
    }
  };

  const stepItems = [
    { id: 1 as const, label: t(`${T}.wizard.step1Label`) },
    { id: 2 as const, label: t(`${T}.wizard.step2Label`) },
    { id: 3 as const, label: t(`${T}.wizard.step3Label`) },
  ];

  return (
    <div
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[linear-gradient(165deg,#dbe7f3_0%,#e8eef5_35%,#d5dee8_100%)] p-3 text-slate-900 sm:p-4"
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="overflow-hidden rounded-[1.75rem] border border-slate-300/90 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
          <div className="relative overflow-hidden border-b border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_55%,#0369a1_100%)] p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.22),transparent_38%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                >
                  <ArrowRight className="h-4 w-4" />
                  {t(`${T}.wizard.backToLeads`)}
                </button>
              )}

              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-sky-300/40 bg-sky-500/20 px-3 py-1.5 text-xs font-black text-sky-100">
                <Facebook className="h-4 w-4" />
                {t(`${T}.badge`)}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {t(`${T}.title`)}
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-sky-100/90">
                {t(`${T}.subtitle`)}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {stepItems.map((item) => {
                  const active = wizardStep === item.id;
                  const done = wizardStep > item.id;

                  return (
                    <div
                      key={item.id}
                      className={[
                        "rounded-xl border px-4 py-3",
                        active
                          ? "border-sky-300 bg-sky-400 text-slate-950"
                          : done
                            ? "border-emerald-300/50 bg-emerald-500/25 text-emerald-50"
                            : "border-white/20 bg-white/10 text-sky-100/80",
                      ].join(" ")}
                    >
                      <p className="text-xs font-black">
                        {done ? "✓ " : `${item.id}. `}
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-100/70 p-4 sm:p-6">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-300 bg-white">
                <BizuplyLoader size="sm" compact />
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-100 p-4 text-sm font-bold text-rose-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-100 p-4 text-sm font-bold text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{success}</p>
                  </div>
                )}

                {wizardStep === 1 && (
                  <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-black text-slate-900">
                      {t(`${T}.wizard.step1Title`)}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-600">
                      {t(`${T}.wizard.step1Desc`)}
                    </p>

                    <button
                      type="button"
                      onClick={connectFacebook}
                      disabled={busy}
                      className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 text-sm font-black text-white transition hover:bg-sky-500 disabled:opacity-60"
                    >
                      {busy ? (
                        <BizuplyLoader size="xs" compact />
                      ) : (
                        <Plug className="h-4 w-4" />
                      )}
                      {t(`${T}.wizard.step1Cta`)}
                    </button>

                    <p className="mt-3 text-xs font-bold text-slate-500">
                      {t(`${T}.wizard.step1Hint`)}
                    </p>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900">
                            {t(`${T}.wizard.step2Title`)}
                          </h2>
                          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-600">
                            {t(`${T}.wizard.step2Desc`)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={connectFacebook}
                          disabled={busy}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 text-xs font-black text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.wizard.reconnectAccount`)}
                        </button>
                      </div>

                      <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-900">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t(`${T}.wizard.accountConnected`)}
                      </div>

                      <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-900">
                          {t(`${T}.wizard.step2PageTitle`)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-600">
                          {t(`${T}.step2Desc`)}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                          <select
                            value={selectedPageId}
                            onChange={(event) =>
                              setSelectedPageId(event.target.value)
                            }
                            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200"
                          >
                            <option value="">{t(`${T}.selectPage`)}</option>
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
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
                          >
                            <Webhook className="h-4 w-4" />
                            {t(`${T}.connectPage`)}
                          </button>
                        </div>

                        {isConnected && (
                          <p className="mt-3 text-xs font-bold text-emerald-800">
                            {t(`${T}.pageConnectedSuccess`)} ·{" "}
                            {connectedPage?.pageName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">
                            {t(`${T}.wizard.step2FormTitle`)}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-600">
                            {isConnected
                              ? t(`${T}.leadFormsDesc`)
                              : t(`${T}.wizard.step2FormLocked`)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={refreshForms}
                          disabled={busy || !isConnected}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 text-xs font-black text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.refreshForms`)}
                        </button>
                      </div>

                      {!isConnected ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-bold text-slate-600">
                          {t(`${T}.wizard.step2FormLocked`)}
                        </div>
                      ) : forms.length > 0 ? (
                        <div className="space-y-3">
                          {forms.map((form) => {
                            const isActive = selectedForm?.formId === form.id;

                            return (
                              <div
                                key={form.id}
                                className={[
                                  "flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between",
                                  isActive
                                    ? "border-sky-400 bg-sky-50"
                                    : "border-slate-300 bg-slate-50",
                                ].join(" ")}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <div
                                    className={[
                                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                      isActive
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-900 text-sky-300",
                                    ].join(" ")}
                                  >
                                    {isActive ? (
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
                                      {t(`${T}.formId`, { id: form.id })}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => selectForm(form)}
                                  disabled={busy || isActive}
                                  className={[
                                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black transition disabled:opacity-70",
                                    isActive
                                      ? "border border-sky-300 bg-sky-100 text-sky-900"
                                      : "bg-slate-900 text-white hover:bg-slate-800",
                                  ].join(" ")}
                                >
                                  {busy ? (
                                    <BizuplyLoader size="xs" compact />
                                  ) : isActive ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <FileText className="h-4 w-4" />
                                  )}
                                  {isActive
                                    ? t(`${T}.selectedForm`)
                                    : t(`${T}.selectForm`)}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-bold text-slate-600">
                          {t(`${T}.noFormsYet`)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-400 bg-[linear-gradient(160deg,#ecfdf5_0%,#d1fae5_100%)] p-5 shadow-sm sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900">
                            {t(`${T}.wizard.readyTitle`)}
                          </h2>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {t(`${T}.wizard.readyDesc`)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setForceSetup(true)}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-black text-slate-800 transition hover:bg-slate-50"
                          >
                            {t(`${T}.wizard.changeSetup`)}
                          </button>
                          <button
                            type="button"
                            onClick={disconnect}
                            disabled={busy}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-300 bg-rose-100 px-4 text-xs font-black text-rose-800 transition hover:bg-rose-200 disabled:opacity-60"
                          >
                            <Unplug className="h-4 w-4" />
                            {t(`${T}.disconnect`)}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                            {t(`${T}.status`)}
                          </p>
                          <p className="mt-1 text-lg font-black text-emerald-700">
                            {t(`${T}.connected`)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                            {t(`${T}.selectedPage`)}
                          </p>
                          <p className="mt-1 truncate text-lg font-black text-slate-900">
                            {connectedPage?.pageName || emDash}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                            {t(`${T}.activeForm`)}
                          </p>
                          <p className="mt-1 truncate text-lg font-black text-slate-900">
                            {selectedForm?.formName || emDash}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={syncLeadsFromMeta}
                          disabled={busy}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 text-xs font-black text-white transition hover:bg-sky-500 disabled:opacity-60"
                        >
                          <Webhook className="h-4 w-4" />
                          {t(`${T}.syncLeads`)}
                        </button>
                        <button
                          type="button"
                          onClick={loadStatus}
                          disabled={busy}
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-black text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.refresh`)}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">
                            {t(`${T}.recentLeads`)}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-600">
                            {t(`${T}.recentLeadsDesc`)}
                          </p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="space-y-3">
                        {recentLeads.length > 0 ? (
                          recentLeads.map((lead, index) => (
                            <div
                              key={lead._id || lead.externalLeadId || index}
                              className="rounded-2xl border border-slate-300 bg-slate-50 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-slate-900">
                                    {leadDisplayName(lead)}
                                  </p>
                                  <p className="mt-1 text-xs font-bold text-slate-600">
                                    {lead.phone || t(`${T}.noPhone`)}
                                    {lead.email ? ` · ${lead.email}` : ""}
                                  </p>
                                </div>
                                <span className="rounded-md border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-black text-sky-900">
                                  {t(`${T}.metaLeadAds`)}
                                </span>
                              </div>
                              <p className="mt-3 text-xs font-bold text-slate-500">
                                {t(`${T}.received`, {
                                  date: formatDate(lead.createdAt),
                                })}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-bold text-slate-600">
                            {t(`${T}.noLeadsYet`)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
