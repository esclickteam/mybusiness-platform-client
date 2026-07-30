import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Loader2,
  PlugZap,
  RefreshCw,
  ShieldAlert,
  Unplug,
} from "lucide-react";
import {
  completeWhatsAppEmbeddedSignup,
  disconnectWhatsApp,
  getWhatsAppEmbeddedSignupConfig,
  getWhatsAppStatus,
  listWhatsAppTemplates,
  sendWhatsAppTest,
  type WhatsAppConnection,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { loadFacebookSdk } from "../../../../utils/loadFacebookSdk";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

type SessionAssets = {
  phoneNumberId: string;
  wabaId: string;
  metaBusinessId?: string;
};

export default function WhatsAppSettingsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [approvedTemplates, setApprovedTemplates] = useState<WhatsAppTemplate[]>(
    []
  );
  const [testPhone, setTestPhone] = useState("");
  const [testTemplateId, setTestTemplateId] = useState("");
  const [testConsent, setTestConsent] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionInfo, setActionInfo] = useState("");
  const sessionRef = useRef<SessionAssets | null>(null);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const status = await getWhatsAppStatus(businessId);
      setConnection(status);
      if (status.connected) {
        const templates = await listWhatsAppTemplates(businessId, {
          approvedOnly: true,
        });
        setApprovedTemplates(templates);
        if (templates[0]?._id) setTestTemplateId(templates[0]._id);
      } else {
        setApprovedTemplates([]);
        setTestTemplateId("");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadSettings")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type !== "WA_EMBEDDED_SIGNUP") return;

        if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA") {
          const phoneNumberId = String(data?.data?.phone_number_id || "").trim();
          const wabaId = String(data?.data?.waba_id || "").trim();
          const metaBusinessId = String(data?.data?.business_id || "").trim();
          if (phoneNumberId && wabaId) {
            sessionRef.current = { phoneNumberId, wabaId, metaBusinessId };
          }
        }
      } catch {
        // Ignore non-JSON postMessages from the popup.
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleConnect = async () => {
    setActionError("");
    setActionInfo("Starting WhatsApp Embedded Signup…");
    console.info("[whatsapp] Connect clicked", { businessId });

    if (!businessId) {
      const msg = "Missing business id. Refresh the page and try again.";
      setActionError(msg);
      setActionInfo("");
      toast.error(msg);
      return;
    }

    try {
      setConnecting(true);

      // Fresh config from server — clearer than relying on cached status only.
      const signup = await getWhatsAppEmbeddedSignupConfig(businessId);
      console.info("[whatsapp] Embedded Signup config", {
        ready: signup.ready,
        hasAppId: Boolean(signup.appId),
        hasConfigId: Boolean(signup.configId),
        encryptionReady: signup.encryptionReady,
        graphVersion: signup.graphVersion,
      });

      if (!signup.appId) {
        throw new Error(
          "META_APP_ID is missing on the server. Add it in Railway."
        );
      }
      if (!signup.configId) {
        throw new Error(
          "WHATSAPP_EMBEDDED_SIGNUP_CONFIG_ID is missing on the server. Add the Configuration ID in Railway."
        );
      }
      if (!signup.encryptionReady) {
        throw new Error(t("whatsapp.settings.encryptionMissing"));
      }
      if (!signup.ready) {
        throw new Error(t("whatsapp.settings.configMissing"));
      }

      setActionInfo("Loading Meta SDK…");
      sessionRef.current = null;
      const FB = await loadFacebookSdk(
        signup.appId,
        signup.graphVersion || "v21.0"
      );
      console.info("[whatsapp] Facebook SDK ready");

      setActionInfo("Opening Meta login popup…");
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const settleReject = (error: Error) => {
          if (settled) return;
          settled = true;
          reject(error);
        };
        const settleResolve = () => {
          if (settled) return;
          settled = true;
          resolve();
        };

        try {
          // Facebook SDK rejects async callbacks ("Expression is of type asyncfunction").
          FB.login(
            (response) => {
              console.info("[whatsapp] FB.login response", {
                hasCode: Boolean(response?.authResponse?.code),
                status: response?.status,
              });

              void (async () => {
                try {
                  const code = response?.authResponse?.code;
                  if (!code) {
                    settleReject(
                      new Error(t("whatsapp.settings.connectCancelled"))
                    );
                    return;
                  }

                  setActionInfo("Completing connection on server…");
                  // Allow session postMessage to arrive.
                  await new Promise((r) => setTimeout(r, 600));
                  const assets = sessionRef.current;
                  if (!assets?.phoneNumberId || !assets?.wabaId) {
                    settleReject(
                      new Error(t("whatsapp.settings.missingSessionAssets"))
                    );
                    return;
                  }

                  const status = await completeWhatsAppEmbeddedSignup(
                    businessId,
                    {
                      code,
                      phoneNumberId: assets.phoneNumberId,
                      wabaId: assets.wabaId,
                      metaBusinessId: assets.metaBusinessId,
                    }
                  );

                  if (!status.connected) {
                    settleReject(
                      new Error(
                        status.lastError || t("whatsapp.settings.connectFailed")
                      )
                    );
                    return;
                  }

                  setConnection(status);
                  setActionInfo("");
                  toast.success(t("whatsapp.settings.connectedSuccess"));
                  await load();
                  settleResolve();
                } catch (error: any) {
                  settleReject(
                    error instanceof Error
                      ? error
                      : new Error(
                          error?.response?.data?.error ||
                            error?.message ||
                            t("whatsapp.errors.connectFailed")
                        )
                  );
                }
              })();
            },
            {
              config_id: signup.configId,
              response_type: "code",
              override_default_response_type: true,
              extras: {
                setup: {},
                featureType: "",
                sessionInfoVersion: "3",
              },
            }
          );
        } catch (error: any) {
          settleReject(
            error instanceof Error
              ? error
              : new Error(error?.message || t("whatsapp.errors.connectFailed"))
          );
        }
      });
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        t("whatsapp.errors.connectFailed");
      console.error("[whatsapp] Connect failed", error);
      setActionError(msg);
      setActionInfo("");
      toast.error(msg);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.settings.confirmDisconnect"))) return;
    try {
      setSaving(true);
      const status = await disconnectWhatsApp(businessId);
      setConnection(status);
      setApprovedTemplates([]);
      toast.success(t("whatsapp.settings.disconnected"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.disconnect")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!businessId || !testPhone.trim()) {
      toast.error(t("whatsapp.settings.testPhoneRequired"));
      return;
    }
    if (!testTemplateId) {
      toast.error(t("whatsapp.settings.testTemplateRequired"));
      return;
    }
    if (!testConsent) {
      toast.error(t("whatsapp.settings.consentRequired"));
      return;
    }
    try {
      setTesting(true);
      const result = await sendWhatsAppTest(businessId, {
        phone: testPhone.trim(),
        name: t("whatsapp.settings.testName"),
        templateId: testTemplateId,
        consentConfirmed: true,
        variables: { "1": t("whatsapp.settings.testName") },
      });
      toast.success(
        t("whatsapp.settings.testSent", {
          id: result?.providerMessageId || "",
        })
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.testFailed")
      );
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  const connected = Boolean(connection?.connected);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.settings.title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("whatsapp.settings.subtitle")}
        </p>

        {!connected ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-slate-600">
              {t("whatsapp.settings.connectIntro")}
            </p>
            <button
              type="button"
              className={btnPrimary}
              disabled={connecting}
              onClick={() => {
                void handleConnect();
              }}
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlugZap className="h-4 w-4" />
              )}
              {connecting
                ? t("whatsapp.settings.connecting")
                : t("whatsapp.settings.connectCta")}
            </button>
            {actionInfo && (
              <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800">
                {actionInfo}
              </p>
            )}
            {actionError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {actionError}
              </p>
            )}
            {!connection?.embeddedSignup?.ready && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                {t("whatsapp.settings.configMissing")}
              </p>
            )}
            {connection?.embeddedSignup?.ready &&
              !connection?.embeddedSignup?.encryptionReady && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  {t("whatsapp.settings.encryptionMissing")}
                </p>
              )}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-black text-emerald-800">
                  {t("whatsapp.settings.connected")}
                </p>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-semibold text-slate-500">
                    {t("whatsapp.settings.accountName")}
                  </dt>
                  <dd className="font-bold text-slate-900">
                    {connection?.verifiedName ||
                      connection?.wabaName ||
                      "—"}
                  </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-semibold text-slate-500">
                    {t("whatsapp.settings.displayPhone")}
                  </dt>
                  <dd className="font-bold text-slate-900" dir="ltr">
                    {connection?.displayPhoneNumber || "—"}
                  </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-semibold text-slate-500">WABA ID</dt>
                  <dd className="font-mono text-xs font-bold text-slate-800" dir="ltr">
                    {connection?.wabaId || "—"}
                  </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-semibold text-slate-500">
                    Phone Number ID
                  </dt>
                  <dd className="font-mono text-xs font-bold text-slate-800" dir="ltr">
                    {connection?.phoneNumberId || "—"}
                  </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-semibold text-slate-500">
                    {t("whatsapp.settings.connectedAt")}
                  </dt>
                  <dd className="font-bold text-slate-900">
                    {connection?.connectedAt
                      ? new Date(connection.connectedAt).toLocaleString()
                      : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnPrimary}
                disabled={connecting}
                onClick={handleConnect}
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {t("whatsapp.settings.reconnect")}
              </button>
              <button
                type="button"
                className={btnSecondary}
                disabled={saving}
                onClick={handleDisconnect}
              >
                <Unplug className="h-4 w-4" />
                {t("whatsapp.settings.disconnect")}
              </button>
            </div>
          </div>
        )}

        {connection?.lastError && (
          <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {connection.lastError}
          </p>
        )}
      </section>

      <div className="space-y-4">
        <section className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center gap-2">
            {connected ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            )}
            <h3 className="text-base font-black text-slate-900">
              {connected
                ? t("whatsapp.settings.connected")
                : t("whatsapp.settings.disconnectedStatus")}
            </h3>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {connected
              ? t("whatsapp.settings.connectedHint")
              : t("whatsapp.settings.disconnectedHint")}
          </p>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h3 className="text-base font-black text-slate-900">
            {t("whatsapp.settings.testTitle")}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.settings.testSubtitle")}
          </p>
          <select
            className={`${inputBase} mt-3`}
            value={testTemplateId}
            disabled={!connected}
            onChange={(e) => setTestTemplateId(e.target.value)}
          >
            {approvedTemplates.length === 0 && (
              <option value="">
                {t("whatsapp.settings.noApprovedTemplates")}
              </option>
            )}
            {approvedTemplates.map((tpl) => (
              <option key={tpl._id} value={tpl._id}>
                {tpl.name} ({tpl.language}) · {tpl.metaStatus}
              </option>
            ))}
          </select>
          <input
            className={`${inputBase} mt-3`}
            value={testPhone}
            disabled={!connected}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="050-0000000"
          />
          <label className="mt-3 flex items-start gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 accent-emerald-600"
              checked={testConsent}
              disabled={!connected}
              onChange={(e) => setTestConsent(e.target.checked)}
            />
            <span>{t("whatsapp.settings.consentLabel")}</span>
          </label>
          <button
            type="button"
            className={`${btnPrimary} mt-3 w-full`}
            disabled={
              testing ||
              !connected ||
              !testTemplateId ||
              !testConsent ||
              !testPhone.trim()
            }
            onClick={handleTest}
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlugZap className="h-4 w-4" />
            )}
            {t("whatsapp.settings.sendTest")}
          </button>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h3 className="text-base font-black text-slate-900">
            {t("whatsapp.settings.helpTitle")}
          </h3>
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm font-medium text-slate-600">
            <li>{t("whatsapp.settings.help1")}</li>
            <li>{t("whatsapp.settings.help2")}</li>
            <li>{t("whatsapp.settings.help3")}</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
