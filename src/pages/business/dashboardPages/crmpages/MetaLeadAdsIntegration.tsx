import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  canNavigateToMetaLeadWizardStep,
  deriveMetaLeadWizardStep,
  isMetaLeadSetupComplete,
  persistedMetaLeadWizardStep,
  type MetaLeadWizardSnapshot,
  type MetaLeadWizardStep,
} from "./metaLeadAdsWizard";
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
  pageId?: string;
  pageName?: string;
};

type AdminMetaSyncSummary = {
  found?: number;
  created?: number;
  imported?: number;
  skippedExisting?: number;
  duplicate?: number;
  failed?: number;
};

type MetaLeadAdsIntegrationProps = {
  businessId?: string;
  onBack?: () => void;
  destination?: "business" | "admin_crm";
  onLeadsSynced?: (summary: AdminMetaSyncSummary) => void;
};

type StatusPayload = {
  success: boolean;
  connectedPage: ConnectedPage | null;
  pages?: MetaPage[];
  forms?: MetaLeadForm[];
  selectedForm?: SelectedForm | null;
  selectedForms?: SelectedForm[];
  purgedHistorical?: number;
  metaAccountConnected?: boolean;
  connectedPageId?: string | null;
  selectedLeadFormId?: string | null;
  connectionHealthy?: boolean;
  reconnectRequired?: boolean;
  healthReasons?: string[];
  lastError?: string;
};

const T = "crm.leads.metaIntegration";

function normalizeSyncSummary(raw?: AdminMetaSyncSummary | null): AdminMetaSyncSummary | null {
  if (!raw || typeof raw !== "object") return null;
  return {
    found: Number(raw.found || 0),
    created: Number(raw.created ?? raw.imported ?? 0),
    skippedExisting: Number(raw.skippedExisting ?? raw.duplicate ?? 0),
    failed: Number(raw.failed || 0),
  };
}

export default function MetaLeadAdsIntegration({
  businessId,
  onBack,
  destination = "business",
  onLeadsSynced,
}: MetaLeadAdsIntegrationProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewingStep, setViewingStep] = useState<MetaLeadWizardStep | null>(
    null
  );

  const [connectedPage, setConnectedPage] = useState<ConnectedPage | null>(null);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaLeadForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SelectedForm | null>(null);
  const [selectedForms, setSelectedForms] = useState<SelectedForm[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<AdminMetaSyncSummary | null>(null);
  const [statusSnapshot, setStatusSnapshot] = useState<MetaLeadWizardSnapshot>({});

  const isAdminCrm = destination === "admin_crm";
  const reconnectRequired = Boolean(statusSnapshot.reconnectRequired);
  const isConnected =
    Boolean(connectedPage?.pageId) &&
    !reconnectRequired &&
    statusSnapshot.connectionHealthy !== false;
  const hasForm = Boolean(selectedForm?.formId) || selectedForms.length > 0;
  const pageAlreadyConnected =
    isConnected &&
    Boolean(connectedPage?.pageId) &&
    selectedPageId === connectedPage?.pageId;
  const tenantParams = isAdminCrm
    ? { destination: "admin_crm" }
    : businessId
      ? { businessId }
      : undefined;
  const emDash = t(`${T}.emDash`);

  const wizardSnapshot = useMemo<MetaLeadWizardSnapshot>(
    () => ({
      metaAccountConnected: statusSnapshot.metaAccountConnected,
      connectedPageId: statusSnapshot.connectedPageId || connectedPage?.pageId || "",
      selectedLeadFormId:
        statusSnapshot.selectedLeadFormId ||
        selectedForm?.formId ||
        selectedForms[0]?.formId ||
        "",
      pagesCount: pages.length,
      connectedPage,
      selectedForm,
      selectedForms,
      reconnectRequired: statusSnapshot.reconnectRequired,
      connectionHealthy: statusSnapshot.connectionHealthy,
    }),
    [
      statusSnapshot,
      connectedPage,
      selectedForm,
      selectedForms,
      pages.length,
    ]
  );

  const persistedStep = persistedMetaLeadWizardStep(wizardSnapshot);
  const wizardStep: MetaLeadWizardStep = deriveMetaLeadWizardStep(
    wizardSnapshot,
    { viewingStep }
  );
  const setupComplete = isMetaLeadSetupComplete(wizardSnapshot);

  const openWizardStep = (step: MetaLeadWizardStep) => {
    if (!canNavigateToMetaLeadWizardStep(wizardSnapshot, step)) return;
    setError("");
    if (step === persistedStep) {
      setViewingStep(null);
      return;
    }
    setViewingStep(step);
    if (step === 2 && isConnected) {
      void refreshForms();
    }
  };

  const applyStatusPayload = (data: StatusPayload) => {
    const nextConnectedPage = data.connectedPage || null;
    const nextForms = nextConnectedPage?.pageId ? data.forms || [] : [];
    const nextSelectedForm = nextConnectedPage?.pageId
      ? data.selectedForm || null
      : null;
    const nextSelectedForms = nextConnectedPage?.pageId
      ? data.selectedForms || (data.selectedForm ? [data.selectedForm] : [])
      : [];

    setConnectedPage(nextConnectedPage);
    setPages(data.pages || []);
    setForms(nextForms);
    setSelectedForm(nextSelectedForm);
    setSelectedForms(nextSelectedForms);
    setSelectedPageId(nextConnectedPage?.pageId || "");
    setStatusSnapshot({
      metaAccountConnected:
        data.metaAccountConnected ??
        Boolean((data.pages || []).length || nextConnectedPage?.pageId),
      connectedPageId: data.connectedPageId || nextConnectedPage?.pageId || "",
      selectedLeadFormId:
        data.selectedLeadFormId ||
        nextSelectedForm?.formId ||
        nextSelectedForms[0]?.formId ||
        "",
      pagesCount: (data.pages || []).length,
      connectedPage: nextConnectedPage,
      selectedForm: nextSelectedForm,
      selectedForms: nextSelectedForms,
      reconnectRequired: Boolean(data.reconnectRequired),
      connectionHealthy: data.connectionHealthy,
    });

    return isMetaLeadSetupComplete({
      metaAccountConnected:
        data.metaAccountConnected ??
        Boolean((data.pages || []).length || nextConnectedPage?.pageId),
      connectedPageId: data.connectedPageId || nextConnectedPage?.pageId || "",
      selectedLeadFormId:
        data.selectedLeadFormId ||
        nextSelectedForm?.formId ||
        nextSelectedForms[0]?.formId ||
        "",
      reconnectRequired: Boolean(data.reconnectRequired),
      connectionHealthy: data.connectionHealthy,
    });
  };

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get<StatusPayload>("/meta-leads/status", {
        params: tenantParams,
      });

      const complete = applyStatusPayload(data);
      if (data.reconnectRequired) {
        setViewingStep(1);
      } else if (complete) {
        setViewingStep(null);
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
    if (businessId && isAdminUser() && !isAdminCrm) {
      setAdminActiveBusinessId(businessId);
    }
    loadStatus();
  }, [businessId, isAdminCrm]);

  // Return from Facebook OAuth → stay in wizard on page/form step.
  useEffect(() => {
    const metaConnected = searchParams.get("meta_connected") === "1";
    const metaError = searchParams.get("meta_error");

    if (!metaConnected && !metaError) return;

    if (metaConnected) {
      setViewingStep(2);
      setSuccess(t(`${T}.wizard.accountConnected`));
      void loadStatus();
    }

    if (metaError) {
      setError(metaError);
      setViewingStep(1);
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
        selectedForms?: SelectedForm[];
      }>(
        "/meta-leads/connect-page",
        { pageId: selectedPageId },
        { params: tenantParams }
      );

      setConnectedPage(data.connectedPage);
      setForms(data.forms || []);
      setSelectedForm(data.selectedForm || null);
      if (Array.isArray(data.selectedForms)) {
        setSelectedForms(data.selectedForms);
      }
      setSuccess(t(`${T}.successPageConnected`));
      setViewingStep(2);

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

      const { data } = await API.post<{
        success?: boolean;
        purgedHistorical?: number;
      }>("/meta-leads/disconnect", {}, { params: tenantParams });

      setConnectedPage(null);
      setForms([]);
      setSelectedForm(null);
      setSelectedForms([]);
      setSelectedPageId("");
      setViewingStep(null);
      setSuccess(t(`${T}.successDisconnected`));

      if ((data?.purgedHistorical || 0) > 0) {
        window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
      }

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.disconnect`)
      );
    } finally {
      setBusy(false);
    }
  };

  const disconnectForm = async (form: SelectedForm) => {
    if (!isAdminCrm) return;
    try {
      setBusy(true);
      setError("");
      setSuccess("");
      const { data } = await API.post<{
        success?: boolean;
        selectedForm?: SelectedForm | null;
        selectedForms?: SelectedForm[];
      }>(
        "/meta-leads/disconnect-form",
        { formId: form.formId },
        { params: tenantParams }
      );
      setSelectedForm(data.selectedForm || null);
      setSelectedForms(data.selectedForms || []);
      setSuccess(
        t(`${T}.successFormRemoved`, { name: form.formName || form.formId })
      );
      if (!(data.selectedForms || []).length) {
        setViewingStep(2);
      }
      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.disconnectForm`)
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
        selectedForms?: SelectedForm[];
      }>("/meta-leads/forms", {
        params: tenantParams,
      });

      setForms(data.forms || []);
      if ("selectedForm" in data) {
        setSelectedForm(data.selectedForm || null);
      }
      if ("selectedForms" in data) {
        setSelectedForms(data.selectedForms || []);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.refreshForms`)
      );
    } finally {
      setBusy(false);
    }
  };

  const formatSyncDone = (summary: AdminMetaSyncSummary) => {
    const created = Number(summary.created || 0);
    const duplicate = Number(summary.skippedExisting || 0);
    const failed = Number(summary.failed || 0);
    const found = Number(summary.found || 0);
    if (failed > 0) {
      return t(`${T}.syncDoneWithFailed`, { created, duplicate, failed });
    }
    if (found === 0 && created === 0) {
      return t(`${T}.syncDoneNone`);
    }
    return t(`${T}.syncDone`, { created, duplicate });
  };

  const applySyncResult = (raw?: AdminMetaSyncSummary | null) => {
    const summary = normalizeSyncSummary(raw);
    if (!summary) return null;
    setSyncSummary(summary);
    setSuccess(formatSyncDone(summary));
    window.dispatchEvent(
      new CustomEvent("bizuply:leads-updated", { detail: summary })
    );
    onLeadsSynced?.(summary);
    return summary;
  };

  const syncLeads = async () => {
    if (!isAdminCrm) return;
    if (!hasForm) {
      setError(t(`${T}.errors.selectFormBeforeSync`));
      return;
    }

    try {
      setBusy(true);
      setSyncing(true);
      setError("");
      setSuccess("");
      setSyncSummary({ found: 0, created: 0, skippedExisting: 0, failed: 0 });

      const { data } = await API.post<{
        success?: boolean;
        sync?: AdminMetaSyncSummary;
        found?: number;
        created?: number;
        imported?: number;
        skippedExisting?: number;
        failed?: number;
      }>("/meta-leads/sync-leads", {}, { params: tenantParams, timeout: 180000 });

      applySyncResult(data.sync || data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.syncFailed`)
      );
    } finally {
      setBusy(false);
      setSyncing(false);
    }
  };

  const selectForm = async (form: MetaLeadForm) => {
    if (!isConnected) {
      setError(t(`${T}.errors.connectBeforeForm`));
      return;
    }

    try {
      setBusy(true);
      if (isAdminCrm) setSyncing(true);
      setError("");
      setSuccess("");

      const { data } = await API.post<{
        success: boolean;
        selectedForm: SelectedForm;
        selectedForms?: SelectedForm[];
        sync?: AdminMetaSyncSummary;
      }>(
        "/meta-leads/select-form",
        { formId: form.id },
        { params: tenantParams, timeout: isAdminCrm ? 180000 : undefined }
      );

      setSelectedForm(data.selectedForm);
      setSelectedForms(data.selectedForms || (data.selectedForm ? [data.selectedForm] : []));
      setViewingStep(null);
      if (isAdminCrm) {
        const synced = applySyncResult(data.sync);
        if (!synced) {
          setSuccess(
            t(`${T}.successFormAdded`, {
              name: data.selectedForm?.formName || form.name,
            })
          );
        }
      } else {
        setSuccess(
          t(`${T}.successFormSelected`, {
            name: data.selectedForm.formName || form.name,
          })
        );
      }

      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.selectForm`)
      );
    } finally {
      setBusy(false);
      setSyncing(false);
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
                const persistedDone =
                  persistedStep > item.id || (item.id === 3 && setupComplete);
                const done = persistedDone && !active;
                const clickable = canNavigateToMetaLeadWizardStep(
                  wizardSnapshot,
                  item.id
                );
                const className = [
                  "rounded-xl border px-4 py-3 text-start text-xs font-black",
                  active
                    ? "border-violet-200 bg-violet-600 text-white"
                    : done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-400",
                  clickable
                    ? "cursor-pointer transition hover:brightness-95"
                    : "cursor-default",
                ].join(" ");
                const label = `${done ? "✓ " : `${item.id}. `}${item.label}`;

                if (!clickable) {
                  return (
                    <div key={item.id} className={className}>
                      {label}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={className}
                    aria-current={active ? "step" : undefined}
                    onClick={() => openWizardStep(item.id)}
                  >
                    {label}
                  </button>
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

                {reconnectRequired ? (
                  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-black text-amber-800">
                      {t(`${T}.reconnectRequired`)}
                    </p>
                    <p className="mt-1 text-xs font-bold leading-5 text-amber-700">
                      {t(`${T}.reconnectRequiredDesc`)}
                    </p>
                    <button
                      type="button"
                      onClick={connectFacebook}
                      disabled={busy}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-xs font-black text-white transition hover:bg-amber-500 disabled:opacity-60"
                    >
                      <Plug className="h-4 w-4" />
                      {t(`${T}.wizard.reconnectAccount`)}
                    </button>
                  </div>
                ) : null}

                {isAdminCrm && (syncing || syncSummary) ? (
                  <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                    <p className="text-sm font-black text-violet-800">
                      {syncing
                        ? t(`${T}.syncingLeads`)
                        : formatSyncDone(syncSummary || {})}
                    </p>
                    {syncSummary ? (
                      <p className="mt-1 text-xs font-bold text-violet-700">
                        {t(`${T}.syncProgress`, {
                          found: syncSummary.found || 0,
                          created: syncSummary.created || 0,
                          duplicate: syncSummary.skippedExisting || 0,
                          failedPart:
                            Number(syncSummary.failed || 0) > 0
                              ? t(`${T}.syncProgressFailed`, {
                                  failed: syncSummary.failed,
                                })
                              : "",
                        })}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {wizardStep === 1 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
                    <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                      {t(`${T}.wizard.step1Title`)}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                      {reconnectRequired
                        ? t(`${T}.reconnectRequiredDesc`)
                        : persistedStep > 1
                        ? t(`${T}.wizard.step1ConnectedDesc`)
                        : t(`${T}.wizard.step1Desc`)}
                    </p>

                    {persistedStep > 1 && !reconnectRequired && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t(`${T}.wizard.accountConnected`)}
                      </div>
                    )}

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
                      {reconnectRequired || persistedStep > 1
                        ? t(`${T}.wizard.step1CtaReconnect`)
                        : t(`${T}.wizard.step1Cta`)}
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
                            {isAdminCrm
                              ? t(`${T}.wizard.step2DescAdmin`)
                              : t(`${T}.wizard.step2Desc`)}
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

                      <div
                        className={[
                          "mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black",
                          reconnectRequired
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700",
                        ].join(" ")}
                      >
                        {reconnectRequired ? (
                          <AlertCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {reconnectRequired
                          ? t(`${T}.reconnectRequired`)
                          : t(`${T}.wizard.accountConnected`)}
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

                          {pageAlreadyConnected ? (
                            <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700 sm:w-auto">
                              <CheckCircle2 className="h-4 w-4" />
                              {t(`${T}.pageConnectedSuccess`)}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={connectPage}
                              disabled={busy || !selectedPageId}
                              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white transition hover:bg-violet-500 disabled:opacity-60 sm:w-auto"
                            >
                              <Webhook className="h-4 w-4" />
                              {t(`${T}.connectPage`)}
                            </button>
                          )}
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
                              ? isAdminCrm
                                ? t(`${T}.leadFormsDescAdmin`)
                                : t(`${T}.leadFormsDesc`)
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
                            const isActive =
                              selectedForm?.formId === form.id ||
                              selectedForms.some((item) => item.formId === form.id);

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
                                    : isAdminCrm
                                      ? t(`${T}.addForm`)
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
                          {isAdminCrm
                            ? t(`${T}.wizard.readyDescAdmin`)
                            : t(`${T}.wizard.readyDesc`)}
                        </p>
                        <p className="mt-2 text-sm font-black text-emerald-700">
                          {t(`${T}.wizard.readyListening`, {
                            form:
                              selectedForm?.formName ||
                              selectedForms[0]?.formName ||
                              emDash,
                          })}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openWizardStep(2)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          {isAdminCrm
                            ? t(`${T}.addAnotherForm`)
                            : t(`${T}.wizard.changeSetup`)}
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
                          {isAdminCrm ? t(`${T}.connectedFormsTitle`) : t(`${T}.activeForm`)}
                        </p>
                        <p className="mt-1 truncate text-lg font-black text-slate-900">
                          {isAdminCrm
                            ? t(`${T}.connectedFormsCount`, {
                                count: selectedForms.length,
                              })
                            : selectedForm?.formName || emDash}
                        </p>
                      </div>
                    </div>

                    {isAdminCrm ? (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-black text-slate-900">
                          {t(`${T}.connectedFormsTitle`)}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          {t(`${T}.connectedFormsDesc`)}
                        </p>
                        {selectedForms.map((form) => (
                          <div
                            key={form.formId}
                            className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-900">
                                {form.formName}
                              </p>
                              <p className="mt-1 text-xs font-bold text-slate-500">
                                {form.pageName ? `${form.pageName} · ` : ""}
                                {t(`${T}.formId`, { id: form.formId })}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => disconnectForm(form)}
                              disabled={busy}
                              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 text-xs font-black text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                            >
                              <Unplug className="h-4 w-4" />
                              {t(`${T}.disconnectForm`)}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {isAdminCrm ? (
                        <button
                          type="button"
                          onClick={syncLeads}
                          disabled={busy || !hasForm}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white transition hover:bg-violet-500 disabled:opacity-60"
                        >
                          {syncing ? (
                            <BizuplyLoader size="xs" compact />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          {syncing
                            ? t(`${T}.syncingLeads`)
                            : t(`${T}.syncLeadsAdmin`)}
                        </button>
                      ) : null}
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
