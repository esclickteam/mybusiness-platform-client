import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Unplug,
} from "lucide-react";
import API from "@api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";

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
  if (err && typeof err === "object") {
    const anyErr = err as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };
    return (
      anyErr.response?.data?.message ||
      anyErr.response?.data?.error ||
      anyErr.message ||
      ""
    );
  }
  if (err instanceof Error && err.message) return err.message;
  return "";
}

function mapGoogleAdsError(raw: string, fallback: string): string {
  const msg = String(raw || "");
  if (/authorization has expired|AUTH_EXPIRED|invalid_grant/i.test(msg)) {
    return "Your Google authorization has expired. Reconnect Google Ads to continue importing leads.";
  }
  if (/revoked|ACCESS_REVOKED/i.test(msg)) {
    return "Access to Google Ads was revoked. Please reconnect your account.";
  }
  if (/CUSTOMER_NOT_ENABLED|no longer has access|Account access/i.test(msg)) {
    return "Bizuply no longer has access to the selected Google Ads account.";
  }
  if (/USER_PERMISSION_DENIED|PERMISSION_DENIED|AUTHORIZATION_ERROR/i.test(msg)) {
    return "Bizuply no longer has access to the selected Google Ads account.";
  }
  if (/temporarily unavailable|UNAVAILABLE|503|429/i.test(msg)) {
    return "Google Ads is temporarily unavailable. We will retry automatically.";
  }
  if (/DEVELOPER_TOKEN/i.test(msg)) {
    return "Google Ads platform configuration is incomplete. Please contact Bizuply support.";
  }
  if (msg.length > 180 || /[A-Z_]{6,}:/.test(msg)) {
    return fallback;
  }
  return msg || fallback;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
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
          "We could not connect your Google Ads account. Please try again."
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
          "Bizuply no longer has access to the selected Google Ads account."
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
          "We could not connect your Google Ads account. Please try again."
        )
      );
    }
    if (connected) {
      setSuccess("Google Ads account connected successfully.");
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
          "We could not connect your Google Ads account. Please try again."
        );
      }
      window.location.href = data.url;
    } catch (err) {
      setBusy(false);
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          "We could not connect your Google Ads account. Please try again."
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
      setError("Select a Google Ads account");
      return;
    }
    if (!form) {
      setError(
        "No accessible Google Ads lead forms were found for this account. Create a Lead Form in Google Ads, then try again."
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
            "Google Ads is temporarily unavailable. We will retry automatically."
          )
        );
      }
      setSuccess("Google Ads account connected successfully.");
      await loadStatus();
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          "We could not connect your Google Ads account. Please try again."
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
      setSuccess("Google Ads test lead created successfully.");
      await loadStatus();
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          "We could not create the Google Ads test lead. Please try again."
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
      setSuccess("Google Ads has been disconnected successfully.");
    } catch (err) {
      setError(
        mapGoogleAdsError(
          getApiErrorMessage(err),
          "We could not disconnect Google Ads. Please try again."
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
      ? "Connected"
      : connection.oauthConnected
        ? "Action Required"
        : "Disconnected");

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl overflow-x-hidden px-2 sm:px-0" dir="ltr">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 bg-[#0F766E] px-5 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-100">
              Google Ads Lead Forms
            </p>
            <h2 className="mt-1 text-xl font-black">Google Ads Integration</h2>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/15 px-3 text-sm font-black text-white transition hover:bg-white/25"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back
            </button>
          )}
        </div>

        <div className="space-y-5 p-5">
          <p className="text-sm font-semibold leading-6 text-slate-600">
            Connect your Google Ads account to import lead form submissions
            directly into your Bizuply CRM.
          </p>

          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  How Bizuply Uses Google Ads Access
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Bizuply uses Google Ads access to connect the advertising
                  account selected by the user and import Google Ads lead form
                  submissions into the Bizuply CRM.
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Bizuply does not modify or delete campaigns, ads, budgets, or
                  account settings. The only write action is configuring the
                  webhook delivery method on the lead form selected by the user
                  so new submissions can be delivered to Bizuply.
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Only the Google Ads account selected by the user is connected
                  to this Bizuply workspace.
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
              <p className="font-black">Google Ads platform is not ready</p>
              <p className="mt-2">
                Bizuply still needs Google Ads API credentials on the server
                before connections can start.
              </p>
            </div>
          ) : wizardStep === 1 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-black text-slate-900">
                Connect Google Ads
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Authorize Bizuply to access your Google Ads accounts, then
                choose the Customer ID and lead form to import into CRM.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void startOAuth()}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-black text-white disabled:opacity-60"
              >
                {busy ? <BizuplyLoader size="xs" compact /> : null}
                {busy ? "Connecting to Google Ads..." : "Connect Google Ads"}
              </button>
            </div>
          ) : wizardStep === 2 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Google Ads Connected
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Your Google Ads account is connected successfully. Select the
                  advertising account you want to use with Bizuply.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  Google Ads Account
                </label>
                {(connection.customers || []).length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
                    No accessible Google Ads accounts were found for this Google
                    account.
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
                            Customer ID: {customer.customerId}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  Lead Form
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
                    <option>Select a Google Ads account</option>
                  </select>
                ) : (
                  <select
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                  >
                    <option value="">Select a Google Ads account</option>
                    {forms.map((form) => (
                      <option key={form.assetId} value={form.assetId}>
                        {form.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Bizuply configures webhook delivery on the selected lead form
                  so new submissions appear in CRM.
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
                  {busy ? "Saving..." : "Save Google Ads Account"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startOAuth()}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
                >
                  Reconnect Google Ads
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-700"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect Google Ads
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Google Ads Connected
                </div>
                <h3 className="mt-3 text-2xl font-black text-slate-900">
                  Google Ads Connected
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Your Google Ads account is connected successfully. New lead
                  form submissions are imported into your Bizuply CRM.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <SummaryRow label="Status" value={statusLabel} />
                  <SummaryRow
                    label="Google Account"
                    value={connection.googleAccountEmail || "Authorized Google account"}
                  />
                  <SummaryRow
                    label="Google Ads Account"
                    value={
                      connection.connectedCustomer?.descriptiveName ||
                      connection.connectedCustomer?.customerId ||
                      "—"
                    }
                  />
                  <SummaryRow
                    label="Customer ID"
                    value={connection.connectedCustomer?.customerId || "—"}
                  />
                  <SummaryRow
                    label="Connected On"
                    value={formatDate(connection.connectedOn)}
                  />
                  <SummaryRow
                    label="Last Activity"
                    value={formatDate(connection.lastActivity)}
                  />
                  <SummaryRow label="Integration Status" value={statusLabel} />
                  <SummaryRow
                    label="Lead Form"
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
                    Back to CRM
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void sendTestLead()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-black text-amber-800"
                >
                  {busy ? "Sending..." : "Send test lead"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setForceSetup(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  Change account
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startOAuth()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                >
                  Reconnect Google Ads
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect Google Ads
                </button>
              </div>

              <section className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800">
                    Recent Google Ads Leads
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {googleLeadCount}
                  </span>
                </div>
                <p className="mb-3 text-xs font-semibold text-slate-500">
                  The latest lead form submissions imported from your connected
                  Google Ads account.
                </p>
                {recentLeads.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-3 py-5">
                    <p className="text-sm font-black text-slate-700">
                      No Google Ads leads received yet
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Once a customer submits a connected Google Ads lead form,
                      the lead will appear here and in your CRM.
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
                              {lead.fullName || lead.name || "Unnamed lead"}
                            </p>
                            {lead.google?.isTest && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                                Test
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                            {[lead.email, lead.phone].filter(Boolean).join(" · ") ||
                              "No contact details"}
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
                          View Lead
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
              Disconnect Google Ads?
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Bizuply will stop importing new Google Ads leads from this
              account. Existing CRM leads will not be deleted.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDisconnect(false)}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void disconnect()}
                className="inline-flex h-10 items-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white disabled:opacity-60"
              >
                {busy ? "Saving..." : "Disconnect"}
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
