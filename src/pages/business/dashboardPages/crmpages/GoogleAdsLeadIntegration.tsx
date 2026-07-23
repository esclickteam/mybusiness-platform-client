import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Unplug,
} from "lucide-react";
import API from "@api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

type GoogleCustomer = {
  customerId: string;
  descriptiveName?: string;
};

type GoogleLeadForm = {
  assetId: string;
  resourceName: string;
  name: string;
  businessName?: string;
  headline?: string;
};

type GoogleConnection = {
  enabled: boolean;
  oauthConnected: boolean;
  googleAccountEmail?: string;
  customers: GoogleCustomer[];
  connectedCustomer: GoogleCustomer | null;
  selectedForm: {
    assetId: string;
    name: string;
    webhookConfigured?: boolean;
  } | null;
  lastWebhookAt?: string | null;
  lastSyncAt?: string | null;
  platformReady?: boolean;
  missingEnv?: string[];
};

type GoogleRecentLead = {
  _id: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  status?: string;
  google?: { formName?: string; isTest?: boolean };
};

type GoogleAdsLeadIntegrationProps = {
  businessId?: string;
  onBack?: () => void;
};

const T = "crm.leads.googleIntegration";

export default function GoogleAdsLeadIntegration({
  businessId,
  onBack,
}: GoogleAdsLeadIntegrationProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forceSetup, setForceSetup] = useState(false);
  const [forms, setForms] = useState<GoogleLeadForm[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [connection, setConnection] = useState<GoogleConnection>({
    enabled: false,
    oauthConnected: false,
    customers: [],
    connectedCustomer: null,
    selectedForm: null,
  });
  const [recentLeads, setRecentLeads] = useState<GoogleRecentLead[]>([]);
  const [googleLeadCount, setGoogleLeadCount] = useState(0);

  const tenantParams = businessId ? { businessId } : undefined;

  const wizardStep = useMemo(() => {
    if (!connection.oauthConnected) return 1;
    if (!connection.enabled || !connection.selectedForm?.assetId || forceSetup) {
      return 2;
    }
    return 3;
  }, [connection, forceSetup]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get<{
        success: boolean;
        connection: GoogleConnection;
        recentLeads?: GoogleRecentLead[];
        googleLeadCount?: number;
      }>("/google-ads-leads/status", { params: tenantParams });

      const next = data.connection || {
        enabled: false,
        oauthConnected: false,
        customers: [],
        connectedCustomer: null,
        selectedForm: null,
      };
      setConnection(next);
      setRecentLeads(Array.isArray(data.recentLeads) ? data.recentLeads : []);
      setGoogleLeadCount(Number(data.googleLeadCount || 0));
      setSelectedCustomerId(
        next.connectedCustomer?.customerId ||
          next.customers?.[0]?.customerId ||
          ""
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.loadStatus`)
      );
    } finally {
      setLoading(false);
    }
  };

  const loadForms = async (customerId: string) => {
    if (!customerId) {
      setForms([]);
      return;
    }
    try {
      setBusy(true);
      setError("");
      const { data } = await API.get<{ success: boolean; forms: GoogleLeadForm[] }>(
        "/google-ads-leads/forms",
        { params: { ...tenantParams, customerId } }
      );
      setForms(Array.isArray(data.forms) ? data.forms : []);
    } catch (err) {
      setForms([]);
      setError(err instanceof Error ? err.message : t(`${T}.errors.loadForms`));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    const connected = searchParams.get("google_connected") === "1";
    const googleError = searchParams.get("google_error");
    if (!connected && !googleError) return;

    if (googleError) setError(googleError);
    if (connected) {
      setSuccess(t(`${T}.successOauth`));
      setForceSetup(true);
    }

    const next = new URLSearchParams(searchParams);
    next.delete("google_connected");
    next.delete("google_error");
    next.set("googleSetup", "1");
    setSearchParams(next, { replace: true });
    void loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wizardStep === 2 && selectedCustomerId) {
      void loadForms(selectedCustomerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep, selectedCustomerId]);

  const startOAuth = async () => {
    try {
      setBusy(true);
      setError("");
      const { data } = await API.get<{ success: boolean; url: string }>(
        "/google-ads-leads/auth-url",
        { params: tenantParams }
      );
      if (!data.url) throw new Error(t(`${T}.errors.authUrl`));
      window.location.href = data.url;
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : t(`${T}.errors.authUrl`));
    }
  };

  const connectForm = async (form: GoogleLeadForm) => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");
      const customer =
        connection.customers.find((item) => item.customerId === selectedCustomerId) ||
        null;
      const { data } = await API.post<{
        success: boolean;
        connection: GoogleConnection;
      }>(
        "/google-ads-leads/connect-form",
        {
          customerId: selectedCustomerId,
          descriptiveName: customer?.descriptiveName || selectedCustomerId,
          assetId: form.assetId,
          resourceName: form.resourceName,
          name: form.name,
          businessName: form.businessName,
        },
        { params: tenantParams }
      );
      setConnection(data.connection);
      setForceSetup(false);
      setSuccess(t(`${T}.successFormConnected`, { name: form.name }));
      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.connectForm`)
      );
    } finally {
      setBusy(false);
    }
  };

  const syncLeads = async () => {
    try {
      setBusy(true);
      setError("");
      const { data } = await API.post<{
        success: boolean;
        created?: number;
        synced?: number;
      }>("/google-ads-leads/sync-leads", {}, { params: tenantParams });
      setSuccess(
        t(`${T}.successSynced`, {
          created: data.created || 0,
          synced: data.synced || 0,
        })
      );
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`${T}.errors.syncFailed`));
    } finally {
      setBusy(false);
    }
  };

  const sendTestLead = async () => {
    try {
      setBusy(true);
      setError("");
      await API.post("/google-ads-leads/send-test", {}, { params: tenantParams });
      setSuccess(t(`${T}.successTestLead`));
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`${T}.errors.actionFailed`));
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    try {
      setBusy(true);
      setError("");
      const { data } = await API.post<{
        success: boolean;
        connection: GoogleConnection;
      }>("/google-ads-leads/disconnect", {}, { params: tenantParams });
      setConnection(data.connection);
      setForms([]);
      setForceSetup(false);
      setSuccess(t(`${T}.successDisconnected`));
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`${T}.errors.actionFailed`));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl overflow-x-hidden px-2 sm:px-0" dir={dir}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 bg-[#0F766E] px-5 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-100">
              {t(`${T}.badge`)}
            </p>
            <h2 className="mt-1 text-xl font-black">{t(`${T}.title`)}</h2>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/15 px-3 text-sm font-black text-white transition hover:bg-white/25"
            >
              <ArrowRight className="h-4 w-4" />
              {t("crm.common.back")}
            </button>
          )}
        </div>

        <div className="space-y-5 p-5">
          <p className="text-sm font-semibold leading-6 text-slate-600">
            {t(`${T}.oauthSubtitle`)}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={[
                  "rounded-xl px-3 py-2 text-center text-xs font-black",
                  wizardStep === step
                    ? "bg-[#0F766E] text-white"
                    : wizardStep > step
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {t(`${T}.wizard.step${step}Label`)}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <BizuplyLoader size="sm" />
            </div>
          ) : connection.platformReady === false ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">
              <p className="font-black">{t(`${T}.platformNotReadyTitle`)}</p>
              <p className="mt-2">{t(`${T}.platformNotReadyDesc`)}</p>
              {!!connection.missingEnv?.length && (
                <p className="mt-3 font-mono text-xs" dir="ltr">
                  {connection.missingEnv.join(", ")}
                </p>
              )}
            </div>
          ) : wizardStep === 1 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-black text-slate-900">
                {t(`${T}.wizard.step1Title`)}
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {t(`${T}.wizard.step1Desc`)}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void startOAuth()}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-black text-white disabled:opacity-60"
              >
                {busy ? <BizuplyLoader size="xs" compact /> : null}
                {t(`${T}.wizard.step1Cta`)}
              </button>
            </div>
          ) : wizardStep === 2 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {t(`${T}.wizard.step2Title`)}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {t(`${T}.wizard.step2Desc`)}
                </p>
                {connection.googleAccountEmail && (
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {t(`${T}.connectedAs`, {
                      email: connection.googleAccountEmail,
                    })}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  {t(`${T}.wizard.selectAccount`)}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(connection.customers || []).map((customer) => {
                    const active = selectedCustomerId === customer.customerId;
                    return (
                      <button
                        key={customer.customerId}
                        type="button"
                        onClick={() => setSelectedCustomerId(customer.customerId)}
                        className={[
                          "rounded-xl border px-3 py-3 text-start transition",
                          active
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 bg-white hover:border-teal-200",
                        ].join(" ")}
                      >
                        <p className="text-sm font-black text-slate-800">
                          {customer.descriptiveName || customer.customerId}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500" dir="ltr">
                          {customer.customerId}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  {t(`${T}.wizard.selectForm`)}
                </p>
                {busy && forms.length === 0 ? (
                  <div className="flex justify-center py-6">
                    <BizuplyLoader size="sm" />
                  </div>
                ) : forms.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
                    {t(`${T}.wizard.noForms`)}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {forms.map((form) => (
                      <button
                        key={form.assetId}
                        type="button"
                        disabled={busy}
                        onClick={() => void connectForm(form)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-start transition hover:border-teal-300 disabled:opacity-60"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-800">{form.name}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {form.businessName || form.headline || form.assetId}
                          </p>
                        </div>
                        <span className="text-xs font-black text-teal-700">
                          {t(`${T}.wizard.connectForm`)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => void disconnect()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700"
              >
                <Unplug className="h-3.5 w-3.5" />
                {t(`${T}.disconnect`)}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t(`${T}.readyBadge`)}
                </div>
                <h3 className="mt-3 text-2xl font-black text-slate-900">
                  {t(`${T}.readyTitle`)}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {t(`${T}.readyDescOauth`)}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <p className="text-xs font-bold text-slate-500">{t(`${T}.status`)}</p>
                    <p className="mt-1 text-lg font-black text-emerald-700">
                      {t(`${T}.connected`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold text-slate-500">
                      {t(`${T}.wizard.activeAccount`)}
                    </p>
                    <p className="mt-1 truncate text-sm font-black text-slate-900">
                      {connection.connectedCustomer?.descriptiveName ||
                        connection.connectedCustomer?.customerId}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold text-slate-500">
                      {t(`${T}.wizard.activeForm`)}
                    </p>
                    <p className="mt-1 truncate text-sm font-black text-slate-900">
                      {connection.selectedForm?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-black text-white"
                  >
                    {t(`${T}.backToCrm`)}
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void syncLeads()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t(`${T}.syncLeads`)}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void sendTestLead()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  {t(`${T}.sendTestLead`)}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setForceSetup(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  {t(`${T}.wizard.changeSetup`)}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void disconnect()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  {t(`${T}.disconnect`)}
                </button>
              </div>

              <section className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800">
                    {t(`${T}.recentTitle`)}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {googleLeadCount}
                  </span>
                </div>
                {recentLeads.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
                    {t(`${T}.noLeadsYet`)}
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentLeads.map((lead) => (
                      <div
                        key={lead._id}
                        className="flex items-center justify-between gap-2 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-800">
                            {lead.fullName || lead.name || t(`${T}.unnamedLead`)}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                            {[lead.phone, lead.email].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        {lead.google?.isTest && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                            {t(`${T}.testBadge`)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
