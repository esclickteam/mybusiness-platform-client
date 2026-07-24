import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forceSetup, setForceSetup] = useState(false);

  const [connectedPage, setConnectedPage] = useState<ConnectedPage | null>(null);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaLeadForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SelectedForm | null>(null);
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
        purgedHistorical?: number;
      }>("/meta-leads/status", {
        params: tenantParams,
      });

      const nextConnectedPage = data.connectedPage || null;

      setConnectedPage(nextConnectedPage);
      setPages(data.pages || []);
      setForms(nextConnectedPage?.pageId ? data.forms || [] : []);
      setSelectedForm(nextConnectedPage?.pageId ? data.selectedForm || null : null);

      if (nextConnectedPage?.pageId) {
        setSelectedPageId(nextConnectedPage.pageId);
      } else {
        setSelectedPageId("");
      }

      if ((data.purgedHistorical || 0) > 0) {
        window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
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

  // Return from Facebook OAuth → stay in wizard on page/form step.
  useEffect(() => {
    const metaConnected = searchParams.get("meta_connected") === "1";
    const metaError = searchParams.get("meta_error");

    if (!metaConnected && !metaError) return;

    if (metaConnected) {
      setForceSetup(true);
      setSuccess(t(`${T}.wizard.accountConnected`));
      void loadStatus();
    }

    if (metaError) {
      setError(metaError);
      setForceSetup(true);
    }

    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    next.delete("meta_connected");
    next.delete("meta_error");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, t]);

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

  const stepItems = [
    { id: 1 as const, label: t(`${T}.wizard.step1Label`) },
    { id: 2 as const, label: t(`${T}.wizard.step2Label`) },
    { id: 3 as const, label: t(`${T}.wizard.step3Label`) },
  ];

  return (
    <div dir={dir} className="w-full min-w-0 overflow-x-hidden bg-[#F4F5F8] p-2 text-slate-900 sm:p-3">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 bg-white p-4 sm:p-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-white"
              >
                <ArrowRight className="h-4 w-4" />
                {t(`${T}.wizard.backToLeads`)}
              </button>
            )}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
              <Facebook className="h-4 w-4" />
              {t(`${T}.badge`)}
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t(`${T}.title`)}
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              {t(`${T}.subtitle`)}
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {stepItems.map((item) => {
                const active = wizardStep === item.id;
                const done = wizardStep > item.id;

                return (
                  <div
                    key={item.id}
                    className={[
                      "rounded-xl border px-4 py-3 text-xs font-black",
                      active
                        ? "border-violet-200 bg-violet-600 text-white"
                        : done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-400",
                    ].join(" ")}
                  >
                    {done ? "✓ " : `${item.id}. `}
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F4F5F8] p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <BizuplyLoader size="sm" compact />
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{success}</p>
                  </div>
                )}

                {wizardStep === 1 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
                    <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                      {t(`${T}.wizard.step1Title`)}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                      {t(`${T}.wizard.step1Desc`)}
                    </p>

                    <button
                      type="button"
                      onClick={connectFacebook}
                      disabled={busy}
                      className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-black text-white transition hover:bg-violet-500 disabled:opacity-60"
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
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
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
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-white disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.wizard.reconnectAccount`)}
                        </button>
                      </div>

                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t(`${T}.wizard.accountConnected`)}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-[#F4F5F8] p-4">
                        <p className="text-sm font-black text-slate-900">
                          {t(`${T}.wizard.step2PageTitle`)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {t(`${T}.step2Desc`)}
                        </p>

                        <div className="mt-4 grid gap-3">
                          <select
                            value={selectedPageId}
                            onChange={(event) =>
                              setSelectedPageId(event.target.value)
                            }
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white transition hover:bg-violet-500 disabled:opacity-60 sm:w-auto"
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

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">
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
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-white disabled:opacity-60"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(`${T}.refreshForms`)}
                        </button>
                      </div>

                      {!isConnected ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-[#F4F5F8] p-8 text-center text-sm font-bold text-slate-500">
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
                                    ? "border-violet-200 bg-violet-50"
                                    : "border-slate-200 bg-[#F4F5F8]",
                                ].join(" ")}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <div
                                    className={[
                                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black",
                                      isActive
                                        ? "bg-violet-600 text-white"
                                        : "bg-violet-100 text-violet-700",
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
                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                      {t(`${T}.formId`, { id: form.id })}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => selectForm(form)}
                                  disabled={busy || isActive}
                                  className={[
                                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-xs font-black transition disabled:opacity-70",
                                    isActive
                                      ? "border border-violet-200 bg-white text-violet-700"
                                      : "bg-violet-600 text-white hover:bg-violet-500",
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
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-[#F4F5F8] p-8 text-center text-sm font-bold text-slate-500">
                          {t(`${T}.noFormsYet`)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t(`${T}.connected`)}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">
                          {t(`${T}.wizard.readyTitle`)}
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {t(`${T}.wizard.readyDesc`)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setForceSetup(true)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          {t(`${T}.wizard.changeSetup`)}
                        </button>
                        <button
                          type="button"
                          onClick={disconnect}
                          disabled={busy}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-black text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <Unplug className="h-4 w-4" />
                          {t(`${T}.disconnect`)}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          {t(`${T}.status`)}
                        </p>
                        <p className="mt-1 text-lg font-black text-emerald-700">
                          {t(`${T}.connected`)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-[#F4F5F8] p-4">
                        <p className="text-xs font-bold text-slate-500">
                          {t(`${T}.selectedPage`)}
                        </p>
                        <p className="mt-1 truncate text-lg font-black text-slate-900">
                          {connectedPage?.pageName || emDash}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-[#F4F5F8] p-4">
                        <p className="text-xs font-bold text-slate-500">
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
                        onClick={loadStatus}
                        disabled={busy}
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t(`${T}.refresh`)}
                      </button>
                      {onBack && (
                        <button
                          type="button"
                          onClick={onBack}
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          <ArrowRight className="h-4 w-4" />
                          {t(`${T}.wizard.backToLeads`)}
                        </button>
                      )}
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
