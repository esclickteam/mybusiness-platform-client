import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Unplug,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/i18n";
import API from "@api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { getApiErrorMessage as getSharedApiErrorMessage } from "../../../../utils/apiErrorMessage";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";

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
  connectedOn?: string | null;
  lastActivity?: string | null;
  integrationStatus?: string;
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
  createdAt?: string;
  google?: {
    formName?: string;
    campaignName?: string;
    campaignId?: string;
    createdTime?: string;
    isTest?: boolean;
  };
};

type GoogleAdsLeadIntegrationProps = {
  businessId?: string;
  onBack?: () => void;
};

function getApiErrorMessage(err: unknown): string {
  return getSharedApiErrorMessage(
    err,
    i18n.t("crm.googleAds.failed")
  );
}

function mapGoogleAdsError(raw: string, fallback: string): string {
  const msg = String(raw || "");
  if (/authorization has expired|AUTH_EXPIRED|invalid_grant/i.test(msg)) {
    return i18n.t("crm.googleAds.authExpired");
  }
  if (/revoked|ACCESS_REVOKED/i.test(msg)) {
    return i18n.t("crm.googleAds.accessRevoked");
  }
  if (/CUSTOMER_NOT_ENABLED|no longer has access|Account access/i.test(msg)) {
    return i18n.t("crm.googleAds.noAccess");
  }
  if (/USER_PERMISSION_DENIED|PERMISSION_DENIED|AUTHORIZATION_ERROR/i.test(msg)) {
    return i18n.t("crm.googleAds.noAccess");
  }
  if (/temporarily unavailable|UNAVAILABLE|503|429/i.test(msg)) {
    return i18n.t("crm.googleAds.temporarilyUnavailable");
  }
  if (/DEVELOPER_TOKEN/i.test(msg)) {
    return i18n.t("crm.googleAds.configIncomplete");
  }
  if (msg.length > 180 || /[A-Z_]{6,}:/.test(msg)) {
    return fallback;
  }
  return msg || fallback;
}

function formatDate(value?: string | null, locale?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(getIntlLocale(locale || i18n.language), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GoogleAdsLeadIntegration({
  businessId,
  onBack,
}: GoogleAdsLeadIntegrationProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forceSetup, setForceSetup] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [forms, setForms] = useState<GoogleLeadForm[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedFormId, setSelectedFormId] = useState("");
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
      setSelectedFormId(next.selectedForm?.assetId || "");
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.connectFailed")
        )
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
      const nextForms = Array.isArray(data.forms) ? data.forms : [];
      setForms(nextForms);
      if (
        nextForms.length &&
        !nextForms.some((form) => form.assetId === selectedFormId)
      ) {
        setSelectedFormId(nextForms[0].assetId);
      }
    } catch (err) {
      setForms([]);
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.noAccess")
        )
      );
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

    if (googleError) {
      setError(
        mapGoogleAdsError(
          decodeURIComponent(googleError),
          t("crm.googleAds.connectFailed")
        )
      );
    }
    if (connected) {
      setSuccess(t("crm.googleAds.connectedSuccess"));
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
      if (!data.url) {
        throw new Error(
          t("crm.googleAds.connectFailed")
        );
      }
      window.location.href = data.url;
    } catch (err) {
      setBusy(false);
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.connectFailed")
        )
      );
    }
  };

  const saveAccount = async () => {
    const form = forms.find((item) => item.assetId === selectedFormId);
    const customer =
      connection.customers.find((item) => item.customerId === selectedCustomerId) ||
      null;

    if (!selectedCustomerId) {
      setError(t("crm.googleAds.selectAccount"));
      return;
    }
    if (!form) {
      setError(
        t("crm.googleAds.noForms")
      );
      return;
    }

    try {
      setBusy(true);
      setError("");
      setSuccess("");
      const { data } = await API.post<{
        success: boolean;
        connection: GoogleConnection;
        webhookConfigured?: boolean;
        warning?: string;
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
      if (data.webhookConfigured === false) {
        setError(
          mapGoogleAdsError(
            data.warning || "",
            t("crm.googleAds.temporarilyUnavailable")
          )
        );
      }
      setSuccess(t("crm.googleAds.connectedSuccess"));
      await loadStatus();
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.connectFailed")
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const sendTestLead = async () => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");
      await API.post("/google-ads-leads/send-test", {}, { params: tenantParams });
      setSuccess(t("crm.googleAds.testLeadSuccess"));
      await loadStatus();
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.testLeadFailed")
        )
      );
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
      setConfirmDisconnect(false);
      setSuccess(t("crm.googleAds.disconnectSuccess"));
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          t("crm.googleAds.disconnectFailed")
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const openLead = (leadId: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("googleSetup");
    next.set("leadId", leadId);
    setSearchParams(next, { replace: false });
  };

  const statusLabel =
    connection.integrationStatus ||
    (connection.enabled
      ? t("crm.googleAds.statusConnected")
      : connection.oauthConnected
        ? t("crm.googleAds.statusActionRequired")
        : t("crm.googleAds.statusDisconnected"));

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-4xl overflow-x-hidden px-2 sm:px-0"
      dir={getTextDirection(i18nInstance.language)}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 bg-[#0F766E] px-5 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-100">
              {t("crm.googleAds.eyebrow")}
            </p>
            <h2 className="mt-1 text-xl font-black">{t("crm.googleAds.title")}</h2>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/15 px-3 text-sm font-black text-white transition hover:bg-white/25"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              {t("crm.googleAds.back")}
            </button>
          )}
        </div>

        <div className="space-y-5 p-5">
          <p className="text-sm font-semibold leading-6 text-slate-600">
            {t("crm.googleAds.intro")}
          </p>

          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {t("crm.googleAds.howTitle")}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {t("crm.googleAds.howP1")}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {t("crm.googleAds.howP2")}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  {t("crm.googleAds.howP3")}
                </p>
              </div>
            </div>
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
              <p className="font-black">{t("crm.googleAds.platformNotReady")}</p>
              <p className="mt-2">
                {t("crm.googleAds.platformNotReadyHint")}
              </p>
            </div>
          ) : wizardStep === 1 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-black text-slate-900">
                {t("crm.googleAds.connectTitle")}
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {t("crm.googleAds.connectHint")}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void startOAuth()}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-black text-white disabled:opacity-60"
              >
                {busy ? <BizuplyLoader size="xs" compact /> : null}
                {busy ? t("crm.googleAds.connecting") : t("crm.googleAds.connectCta")}
              </button>
            </div>
          ) : wizardStep === 2 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {t("crm.googleAds.connectedTitle")}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {t("crm.googleAds.connectedHint")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  {t("crm.googleAds.accountLabel")}
                </label>
                {(connection.customers || []).length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
                    {t("crm.googleAds.noAccounts")}
                  </p>
                ) : (
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
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {t("crm.googleAds.customerId", { id: customer.customerId })}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  {t("crm.googleAds.leadFormLabel")}
                </label>
                {busy && forms.length === 0 ? (
                  <div className="flex justify-center py-6">
                    <BizuplyLoader size="sm" />
                  </div>
                ) : forms.length === 0 ? (
                  <select
                    disabled
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                  >
                    <option>{t("crm.googleAds.selectAccount")}</option>
                  </select>
                ) : (
                  <select
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                  >
                    <option value="">{t("crm.googleAds.selectAccount")}</option>
                    {forms.map((form) => (
                      <option key={form.assetId} value={form.assetId}>
                        {form.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {t("crm.googleAds.deliveryHint")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy || !selectedCustomerId || !selectedFormId}
                  onClick={() => void saveAccount()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-black text-white disabled:opacity-60"
                >
                  {busy ? <BizuplyLoader size="xs" compact /> : null}
                  {busy ? t("crm.googleAds.saving") : t("crm.googleAds.saveAccount")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startOAuth()}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
                >
                  {t("crm.googleAds.reconnect")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-700"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  {t("crm.googleAds.disconnect")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t("crm.googleAds.connectedTitle")}
                </div>
                <h3 className="mt-3 text-2xl font-black text-slate-900">
                  {t("crm.googleAds.connectedTitle")}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {t("crm.googleAds.connectedSuccessBody")}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <SummaryRow label={t("crm.googleAds.labelStatus")} value={statusLabel} />
                  <SummaryRow
                    label={t("crm.googleAds.labelGoogleAccount")}
                    value={connection.googleAccountEmail || t("crm.googleAds.authorizedAccount")}
                  />
                  <SummaryRow
                    label={t("crm.googleAds.labelAdsAccount")}
                    value={
                      connection.connectedCustomer?.descriptiveName ||
                      connection.connectedCustomer?.customerId ||
                      "—"
                    }
                  />
                  <SummaryRow
                    label={t("crm.googleAds.labelCustomerId")}
                    value={connection.connectedCustomer?.customerId || "—"}
                  />
                  <SummaryRow
                    label={t("crm.googleAds.labelConnectedOn")}
                    value={formatDate(connection.connectedOn)}
                  />
                  <SummaryRow
                    label={t("crm.googleAds.labelLastActivity")}
                    value={formatDate(connection.lastActivity)}
                  />
                  <SummaryRow label={t("crm.googleAds.labelIntegrationStatus")} value={statusLabel} />
                  <SummaryRow
                    label={t("crm.googleAds.labelLeadForm")}
                    value={connection.selectedForm?.name || "—"}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0F766E] px-4 text-xs font-black text-white"
                  >
                    {t("crm.googleAds.backToCrm")}
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void sendTestLead()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-black text-amber-800"
                >
                  {busy ? t("crm.googleAds.sending") : t("crm.googleAds.sendTestLead")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setForceSetup(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  {t("crm.googleAds.changeAccount")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startOAuth()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  {t("crm.googleAds.reconnect")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  {t("crm.googleAds.disconnect")}
                </button>
              </div>

              <section className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800">
                    {t("crm.googleAds.recentTitle")}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {googleLeadCount}
                  </span>
                </div>
                <p className="mb-3 text-xs font-semibold text-slate-500">
                  {t("crm.googleAds.recentHint")}
                </p>
                {recentLeads.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-3 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {t("crm.googleAds.noLeadsTitle")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {t("crm.googleAds.noLeadsHint")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentLeads.map((lead) => (
                      <div
                        key={lead._id}
                        className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-800">
                              {lead.fullName || lead.name || t("crm.googleAds.unnamedLead")}
                            </p>
                            {lead.google?.isTest && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                                {t("crm.googleAds.testBadge")}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                            {[lead.email, lead.phone].filter(Boolean).join(" · ") ||
                              t("crm.googleAds.noContact")}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                            {[
                              lead.google?.campaignName ||
                                lead.google?.formName ||
                                lead.google?.campaignId,
                              formatDate(
                                lead.google?.createdTime || lead.createdAt
                              ),
                              lead.status,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openLead(lead._id)}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                        >
                          {t("crm.googleAds.viewLead")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      {confirmDisconnect && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {t("crm.googleAds.disconnectTitle")}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {t("crm.googleAds.disconnectBody")}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDisconnect(false)}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
              >
                {t("crm.googleAds.cancel")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void disconnect()}
                className="inline-flex h-10 items-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white disabled:opacity-60"
              >
                {busy ? t("crm.googleAds.saving") : t("crm.googleAds.disconnectConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
