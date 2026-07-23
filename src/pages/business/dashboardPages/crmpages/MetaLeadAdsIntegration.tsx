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
      className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 p-6 sm:p-8">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-4 inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowRight className="h-4 w-4" />
                {t(`${T}.wizard.backToLeads`)}
              </button>
            )}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-sky-700 ring-1 ring-sky-100">
              <Facebook className="h-4 w-4" />
              {t(`${T}.badge`)}
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t(`${T}.title`)}
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
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
                      "rounded-2xl border px-4 py-3",
                      active
                        ? "border-sky-200 bg-sky-50"
                        : done
                          ? "border-emerald-100 bg-emerald-50"
                          : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "text-xs font-black",
                        active
                          ? "text-sky-700"
                          : done
                            ? "text-emerald-700"
                            : "text-slate-400",
                      ].join(" ")}
                    >
                      {done ? "✓ " : `${item.id}. `}
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <BizuplyLoader size="sm" compact />
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{success}</p>
                  </div>
                )}

                {wizardStep === 1 && (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
                    <h2 className="text-2xl font-black text-slate-800">
                      {t(`${T}.wizard.step1Title`)}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                      {t(`${T}.wizard.step1Desc`)}
                    </p>

                    <button
                      type="button"
                      onClick={connectFacebook}
                      disabled={busy}
                      className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-gradient-to-l from-sky-100 via-cyan-100 to-white px-6 text-sm font-black text-slate-900 transition hover:from-sky-200/80 disabled:opacity-60"
                    >
                      {busy ? (
                        <BizuplyLoader size="xs" compact />
                      ) : (
                        <Plug className="h-4 w-4" />
                      )}
                      {t(`${T}.wizard.step1Cta`)}
                    </button>

                    <p className="mt-3 text-xs font-bold text-slate-400">
                      {t(`${T}.wizard.step1Hint`)}
                    </p>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800">
                            {t(`${T}.wizard.step2Title`)}
                          </h2>
                          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                            {t(`${T}.wizard.step2Desc`)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={connectFacebook}
                          disabled={busy}
                          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.wizard.reconnectAccount`)}
                        </button>
                      </div>

                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t(`${T}.wizard.accountConnected`)}
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-900">
                          {t(`${T}.wizard.step2PageTitle`)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {t(`${T}.step2Desc`)}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                          <select
                            value={selectedPageId}
                            onChange={(event) =>
                              setSelectedPageId(event.target.value)
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
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
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-4 text-sm font-black text-slate-800 transition disabled:opacity-60"
                          >
                            <Webhook className="h-4 w-4" />
                            {t(`${T}.connectPage`)}
                          </button>
                        </div>

                        {isConnected && (
                          <p className="mt-3 text-xs font-bold text-emerald-700">
                            {t(`${T}.pageConnectedSuccess`)} ·{" "}
                            {connectedPage?.pageName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-800">
                            {t(`${T}.wizard.step2FormTitle`)}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {isConnected
                              ? t(`${T}.leadFormsDesc`)
                              : t(`${T}.wizard.step2FormLocked`)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={refreshForms}
                          disabled={busy || !isConnected}
                          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.refreshForms`)}
                        </button>
                      </div>

                      {!isConnected ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
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
                                  "flex flex-col gap-4 rounded-3xl border p-4 transition sm:flex-row sm:items-center sm:justify-between",
                                  isActive
                                    ? "border-violet-200 bg-violet-50"
                                    : "border-slate-200 bg-slate-50",
                                ].join(" ")}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <div
                                    className={[
                                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                                      isActive
                                        ? "bg-white text-violet-700 ring-1 ring-violet-100"
                                        : "bg-white text-sky-600 ring-1 ring-slate-200",
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
                                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition disabled:opacity-70",
                                    isActive
                                      ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                                      : "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800",
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
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
                          {t(`${T}.noFormsYet`)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-5">
                    <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800">
                            {t(`${T}.wizard.readyTitle`)}
                          </h2>
                          <p className="mt-2 text-sm font-semibold text-slate-600">
                            {t(`${T}.wizard.readyDesc`)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setForceSetup(true)}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                          >
                            {t(`${T}.wizard.changeSetup`)}
                          </button>
                          <button
                            type="button"
                            onClick={disconnect}
                            disabled={busy}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 text-xs font-black text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                          >
                            <Unplug className="h-4 w-4" />
                            {t(`${T}.disconnect`)}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white bg-white p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t(`${T}.status`)}
                          </p>
                          <p className="mt-1 text-lg font-black text-emerald-700">
                            {t(`${T}.connected`)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white bg-white p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t(`${T}.selectedPage`)}
                          </p>
                          <p className="mt-1 truncate text-lg font-black text-slate-800">
                            {connectedPage?.pageName || emDash}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white bg-white p-4">
                          <p className="text-xs font-black text-slate-400">
                            {t(`${T}.activeForm`)}
                          </p>
                          <p className="mt-1 truncate text-lg font-black text-slate-800">
                            {selectedForm?.formName || emDash}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={syncLeadsFromMeta}
                          disabled={busy}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-xs font-black text-sky-800 transition hover:bg-sky-100 disabled:opacity-60"
                        >
                          <Webhook className="h-4 w-4" />
                          {t(`${T}.syncLeads`)}
                        </button>
                        <button
                          type="button"
                          onClick={loadStatus}
                          disabled={busy}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.refresh`)}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-800">
                            {t(`${T}.recentLeads`)}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {t(`${T}.recentLeadsDesc`)}
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
                                    {leadDisplayName(lead)}
                                  </p>
                                  <p className="mt-1 text-xs font-bold text-slate-500">
                                    {lead.phone || t(`${T}.noPhone`)}
                                    {lead.email ? ` · ${lead.email}` : ""}
                                  </p>
                                </div>
                                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                                  {t(`${T}.metaLeadAds`)}
                                </span>
                              </div>
                              <p className="mt-3 text-xs font-bold text-slate-400">
                                {t(`${T}.received`, {
                                  date: formatDate(lead.createdAt),
                                })}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
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
