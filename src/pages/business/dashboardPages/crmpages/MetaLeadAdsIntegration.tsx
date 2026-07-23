import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Facebook,
  FileText,
  Plug,
  RefreshCw,
  ShieldCheck,
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
};

const T = "crm.leads.metaIntegration";

export default function MetaLeadAdsIntegration({
  businessId,
}: MetaLeadAdsIntegrationProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = getIntlLocale(i18n.language);

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
  const tenantParams = businessId ? { businessId } : undefined;
  const emDash = t(`${T}.emDash`);

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
      setPages([]);
      setForms([]);
      setSelectedForm(null);
      setRecentLeads([]);
      setSelectedPageId("");
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
        fetched?: number;
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

  return (
    <div
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-sky-700 ring-1 ring-sky-100">
                  <Facebook className="h-4 w-4" />
                  {t(`${T}.badge`)}
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
                  {t(`${T}.title`)}
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-500 sm:text-base">
                  {t(`${T}.subtitle`)}
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
                {t(`${T}.refresh`)}
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black tracking-wide text-slate-400">
                {t(`${T}.status`)}
              </p>

              <p className="mt-2 text-xl font-black text-slate-900">
                {isConnected ? t(`${T}.connected`) : t(`${T}.notConnected`)}
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
              <p className="text-xs font-black tracking-wide text-sky-600">
                {t(`${T}.selectedPage`)}
              </p>

              <p className="mt-2 truncate text-xl font-black text-sky-900">
                {connectedPage?.pageName || selectedPage?.name || emDash}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-xs font-black tracking-wide text-emerald-600">
                {t(`${T}.leadForms`)}
              </p>

              <p className="mt-2 text-xl font-black text-emerald-900">
                {forms.length}
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
              <p className="text-xs font-black tracking-wide text-violet-600">
                {t(`${T}.activeForm`)}
              </p>

              <p className="mt-2 truncate text-xl font-black text-violet-900">
                {selectedForm?.formName ||
                  activeForm?.name ||
                  t(`${T}.notSelected`)}
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
                  {t(`${T}.connectionSetup`)}
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {t(`${T}.connectionSetupDesc`)}
                </p>
              </div>

              <ShieldCheck className="h-7 w-7 text-sky-600" />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {t(`${T}.step1Title`)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {t(`${T}.step1Desc`)}
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
                    {t(`${T}.connectFacebook`)}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-black text-slate-900">
                  {t(`${T}.step2Title`)}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {t(`${T}.step2Desc`)}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <select
                    value={selectedPageId}
                    onChange={(event) => setSelectedPageId(event.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-100"
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
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-4 text-slate-800 transition hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50 disabled:opacity-60"
                  >
                    <Webhook className="h-4 w-4" />
                    {t(`${T}.connectPage`)}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {t(`${T}.step3Title`)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {t(`${T}.step3Desc`)}
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
                      ? t(`${T}.listening`)
                      : t(`${T}.notSubscribed`)}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900">
                      {t(`${T}.step4Title`)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {t(`${T}.step4Desc`)}
                    </p>
                  </div>

                  <span
                    className={[
                      "max-w-[240px] truncate rounded-full px-3 py-1.5 text-xs font-black",
                      selectedForm?.formId
                        ? "bg-white text-violet-700 ring-1 ring-violet-100"
                        : "bg-white/70 text-slate-500 ring-1 ring-slate-200",
                    ].join(" ")}
                    title={selectedForm?.formName || t(`${T}.noFormSelected`)}
                  >
                    {selectedForm?.formName || t(`${T}.noFormSelected`)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  {t(`${T}.connectedPage`)}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {t(`${T}.connectedPageDesc`)}
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
                  {t(`${T}.disconnect`)}
                </button>
              )}
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
                  <p className="text-xs font-black tracking-wide text-sky-600">
                    {t(`${T}.page`)}
                  </p>

                  <p className="mt-1 text-lg font-black text-sky-950">
                    {connectedPage?.pageName}
                  </p>

                  <p className="mt-1 text-xs font-bold text-sky-700">
                    {t(`${T}.pageId`, { id: connectedPage?.pageId })}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-black tracking-wide text-emerald-600">
                    {t(`${T}.connection`)}
                  </p>

                  <p className="mt-1 text-sm font-black text-emerald-900">
                    {t(`${T}.pageConnectedSuccess`)}
                  </p>

                  <p className="mt-1 text-xs font-bold text-emerald-700">
                    {t(`${T}.connectedAt`, {
                      date: formatDate(connectedPage?.connectedAt),
                    })}
                  </p>
                </div>

                <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                  <p className="text-xs font-black tracking-wide text-violet-600">
                    {t(`${T}.activeLeadForm`)}
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    {selectedForm?.formName || t(`${T}.noFormSelectedYet`)}
                  </p>

                  <p className="mt-1 text-xs font-bold text-violet-700">
                    {selectedForm?.formId
                      ? t(`${T}.formIdLabel`, { id: selectedForm.formId })
                      : t(`${T}.chooseFormBelow`)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <Plug className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 text-lg font-black text-slate-700">
                  {t(`${T}.noPageYet`)}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {t(`${T}.noPageYetDesc`)}
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
                  {t(`${T}.leadFormsTitle`)}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {t(`${T}.leadFormsDesc`)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={refreshForms}
                  disabled={busy || !isConnected}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t(`${T}.refreshForms`)}
                </button>

                <button
                  type="button"
                  onClick={syncLeadsFromMeta}
                  disabled={
                    busy ||
                    !isConnected ||
                    !(selectedForm?.formId || activeForm?.id)
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-xs font-black text-sky-800 transition hover:bg-sky-100 disabled:opacity-60"
                >
                  <Webhook className="h-4 w-4" />
                  {t(`${T}.syncLeads`)}
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-3xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800">
                    {selectedForm?.formName
                      ? t(`${T}.activeFormName`, { name: selectedForm.formName })
                      : t(`${T}.noActiveForm`)}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-violet-700">
                    {selectedForm?.formId
                      ? t(`${T}.onlyFormId`, { id: selectedForm.formId })
                      : forms.length === 1
                        ? t(`${T}.oneFormHint`)
                        : t(`${T}.selectOneFormHint`)}
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
                            ? "border border-violet-200/70 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
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
                          {t(`${T}.formId`, { id: form.id })}
                        </p>

                        {selectedForm?.formId === form.id && (
                          <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                            {t(`${T}.selectedActiveForm`)}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectForm(form)}
                      disabled={
                        busy || !isConnected || selectedForm?.formId === form.id
                      }
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
                        ? t(`${T}.selectedForm`)
                        : t(`${T}.selectForm`)}
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    {t(`${T}.noFormsYet`)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  {t(`${T}.recentLeads`)}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
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
                          {lead.phone || t(`${T}.noPhone`)}{" "}
                          {lead.email ? `• ${lead.email}` : ""}
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
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Webhook className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-4 text-sm font-bold text-slate-500">
                    {t(`${T}.noLeadsYet`)}
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
