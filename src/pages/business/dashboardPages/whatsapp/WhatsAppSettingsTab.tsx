import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Loader2,
  PhoneCall,
  PlugZap,
  RefreshCw,
  ShieldAlert,
  Unplug,
} from "lucide-react";
import {
  completeWhatsAppEmbeddedSignup,
  consumeWhatsAppVoiceOtp,
  getWhatsAppVoiceVerificationStatus,
  disconnectWhatsApp,
  getWhatsAppEmbeddedSignupConfig,
  getWhatsAppStatus,
  listWhatsAppTemplates,
  registerWhatsAppPhone,
  requestWhatsAppVoiceVerificationCode,
  sendWhatsAppTest,
  startWhatsAppVoiceVerification,
  submitWhatsAppVoiceVerificationCode,
  type WhatsAppConnection,
  type WhatsAppTemplate,
  type WhatsAppVoiceVerificationSession,
} from "../../../../api/whatsappApi";
import {
  getMetaCampaignsStatus,
  type MetaAdAccountBillingHealth,
} from "../../../../api/metaCampaignsApi";
import MetaBillingAccountCards from "../../../../components/meta/MetaBillingAccountCards";
import { loadFacebookSdk } from "../../../../utils/loadFacebookSdk";
import { getApiErrorMessage } from "../../../../utils/apiErrorMessage";
import {
  shouldAbortEmbeddedSignupForVoiceError,
  voiceVerificationErrorCode,
} from "./embeddedSignupVoiceGate";
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

function voiceSessionStatusLabel(
  session: WhatsAppVoiceVerificationSession | null
): string {
  if (!session) return "";
  switch (session.status) {
    case "waiting_for_call":
      return "Waiting for Meta to call your verification number…";
    case "call_received":
      return "Call received";
    case "answered":
      return "Call answered";
    case "capturing":
      return "Listening for verification code…";
    case "otp_captured":
      if (session.metaVerifyStatus === "verified") {
        return "Verification code submitted to Meta successfully";
      }
      if (session.metaVerifyStatus === "failed") {
        return "Auto-submit to Meta failed — enter the code manually in Meta if needed";
      }
      if (session.metaVerifyStatus === "submitted") {
        return "Submitting verification code to Meta…";
      }
      if (session.metaVerifyStatus === "skipped_missing_credentials") {
        return "Code captured — connect WhatsApp credentials to auto-submit, or enter it in Meta";
      }
      return "Verification code captured";
    case "ambiguous":
      return "Could not hear a clear code — retry the voice call from Meta";
    case "failed":
      return "Voice verification failed — start capture again and retry from Meta";
    case "expired":
      return "Voice verification expired — start capture again";
    case "consumed":
      return session.metaVerifyStatus === "verified"
        ? "Verification complete"
        : "Verification code used";
    default:
      return session.status.replace(/_/g, " ");
  }
}

function readinessTone(connection: WhatsAppConnection | null) {
  if (!connection?.connected) {
    return {
      box: "border-amber-200 bg-amber-50/70",
      icon: "text-amber-600",
      title: "text-amber-900",
    };
  }
  if (connection.readyToSend) {
    return {
      box: "border-emerald-200 bg-emerald-50/70",
      icon: "text-emerald-600",
      title: "text-emerald-800",
    };
  }
  if (connection.registrationStatus === "failed") {
    return {
      box: "border-rose-200 bg-rose-50/70",
      icon: "text-rose-600",
      title: "text-rose-800",
    };
  }
  return {
    box: "border-amber-200 bg-amber-50/70",
    icon: "text-amber-600",
    title: "text-amber-900",
  };
}

export default function WhatsAppSettingsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [startingVoiceVerification, setStartingVoiceVerification] =
    useState(false);
  const [voiceSession, setVoiceSession] =
    useState<WhatsAppVoiceVerificationSession | null>(null);
  const [testing, setTesting] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [adAccountBilling, setAdAccountBilling] =
    useState<MetaAdAccountBillingHealth | null>(null);
  const [approvedTemplates, setApprovedTemplates] = useState<WhatsAppTemplate[]>(
    []
  );
  const [testPhone, setTestPhone] = useState("");
  const [testTemplateId, setTestTemplateId] = useState("");
  const [testConsent, setTestConsent] = useState(false);
  const [registerPin, setRegisterPin] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionInfo, setActionInfo] = useState("");
  const sessionRef = useRef<SessionAssets | null>(null);

  const keepEmbeddedSignupVoiceSession = useCallback(async () => {
    if (!businessId) return null;
    const result = await startWhatsAppVoiceVerification(businessId, {
      source: "embedded_signup",
      wabaId: sessionRef.current?.wabaId,
      phoneNumberId: sessionRef.current?.phoneNumberId,
      metaBusinessId: sessionRef.current?.metaBusinessId,
    });
    setVoiceSession(result.session);
    return result;
  }, [businessId]);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [status, metaStatus] = await Promise.all([
        getWhatsAppStatus(businessId, { enrichPayment: true }),
        getMetaCampaignsStatus(businessId).catch(() => null),
      ]);
      setConnection(status);
      setAdAccountBilling(metaStatus?.adAccountBillingHealth || null);
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
    if (!businessId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const result = await getWhatsAppVoiceVerificationStatus(businessId);
        if (cancelled) return;
        setVoiceSession(result.session);
        const status = result.session?.status;
        const metaStatus = result.session?.metaVerifyStatus;
        const keepPolling =
          result.session &&
          (["waiting_for_call", "call_received", "answered", "capturing"].includes(
            status || ""
          ) ||
            (status === "otp_captured" &&
              ["pending", "submitted", ""].includes(metaStatus || "")));
        if (keepPolling) {
          timer = setTimeout(poll, 2500);
        }
      } catch {
        // The main settings load reports connectivity errors.
      }
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [businessId, voiceSession?.status, voiceSession?.metaVerifyStatus]);

  useEffect(() => {
    if (!businessId || !voiceSession?.sessionId) return;
    if (voiceSession.metaVerifyStatus !== "verified") return;
    if (voiceSession.status === "consumed") return;
    let cancelled = false;
    void (async () => {
      try {
        const result = await consumeWhatsAppVoiceOtp(
          businessId,
          voiceSession.sessionId
        );
        if (!cancelled && result.session) {
          setVoiceSession(result.session);
        }
      } catch {
        // Already consumed server-side after auto-verify is fine.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    businessId,
    voiceSession?.sessionId,
    voiceSession?.metaVerifyStatus,
    voiceSession?.status,
  ]);

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

        // Meta voice OTP happens inside the popup before FINISH and does not
        // always emit PHONE_NUMBER_VERIFICATION. Keep the DID session alive
        // on any Embedded Signup event except cancel.
        if (businessId && data.event !== "CANCEL") {
          void keepEmbeddedSignupVoiceSession().catch(() => {});
        }
      } catch {
        // Ignore non-JSON postMessages from the popup.
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [businessId, keepEmbeddedSignupVoiceSession]);

  const handleConnect = async () => {
    setActionError("");
    setActionInfo(t("whatsapp.settings.connecting"));
    console.info("[whatsapp] Connect clicked", { businessId });

    if (!businessId) {
      const msg = t("whatsapp.settings.missingBusiness");
      setActionError(msg);
      setActionInfo("");
      toast.error(msg);
      return;
    }

    if (connection?.canConnectOwnNumber === false || connection?.isPlatformManagedConnection) {
      const msg = t("whatsapp.settings.managedHostNoConnectOwn");
      setActionError(msg);
      setActionInfo("");
      toast.error(msg);
      return;
    }

    let voiceKeepAlive: ReturnType<typeof setInterval> | undefined;
    try {
      setConnecting(true);

      const signup = await getWhatsAppEmbeddedSignupConfig(businessId);
      console.info("[whatsapp] Embedded Signup config", {
        ready: signup.ready,
        hasAppId: Boolean(signup.appId),
        hasConfigId: Boolean(signup.configId),
        encryptionReady: signup.encryptionReady,
        graphVersion: signup.graphVersion,
      });

      if (!signup.appId) {
        throw new Error(t("whatsapp.settings.configMissing"));
      }
      if (!signup.configId) {
        throw new Error(t("whatsapp.settings.configMissing"));
      }
      if (!signup.encryptionReady) {
        throw new Error(t("whatsapp.settings.encryptionMissing"));
      }
      if (!signup.ready) {
        throw new Error(t("whatsapp.settings.configMissing"));
      }

      // Create waiting_for_call session BEFORE Meta popup can place a voice OTP call.
      // Keep it alive until FB.login returns — Meta "send code again" does not
      // re-enter handleConnect, and phone_number_id is not available yet.
      try {
        setActionInfo("Preparing voice verification…");
        const voice = await keepEmbeddedSignupVoiceSession();
        console.info("[whatsapp] Voice verification session ready", {
          sessionId: voice?.session?.sessionId,
          created: voice?.created,
          status: voice?.session?.status,
          telnyxDid: voice?.session?.telnyxDid,
        });
        voiceKeepAlive = window.setInterval(() => {
          void keepEmbeddedSignupVoiceSession().catch(() => {});
        }, 20000);
      } catch (voiceError: any) {
        const code = voiceVerificationErrorCode(voiceError);
        console.warn("[whatsapp] Voice session start before ES failed", {
          code,
          message: voiceError?.response?.data?.error || voiceError?.message,
        });
        if (shouldAbortEmbeddedSignupForVoiceError(code)) {
          const msg = t("whatsapp.settings.verificationDidMissing");
          setActionError(msg);
          setActionInfo("");
          toast.error(msg);
          return;
        }
        toast.warning(
          getApiErrorMessage(
            voiceError,
            "Voice verification session could not be prepared. SMS may still work."
          )
        );
      }

      setActionInfo(t("whatsapp.settings.connecting"));
      sessionRef.current = null;
      const FB = await loadFacebookSdk(
        signup.appId,
        signup.graphVersion || "v21.0"
      );
      console.info("[whatsapp] Facebook SDK ready");

      setActionInfo(t("whatsapp.settings.openingMeta"));
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

                  setActionInfo(t("whatsapp.settings.completingConnection"));
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
                  setRegisterPin("");
                  setActionInfo("");
                  if (status.readyToSend) {
                    toast.success(t("whatsapp.settings.connectedSuccess"));
                  } else {
                    toast.info(t("whatsapp.settings.registrationRequiredToast"));
                  }
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
      const msg = getApiErrorMessage(
        error,
        t("whatsapp.errors.connectFailed")
      );
      console.error("[whatsapp] Connect failed", error);
      setActionError(msg);
      setActionInfo("");
      toast.error(msg);
    } finally {
      if (voiceKeepAlive) {
        window.clearInterval(voiceKeepAlive);
      }
      setConnecting(false);
    }
  };

  const handleRegister = async () => {
    if (!businessId) return;
    const pin = registerPin.replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(pin)) {
      toast.error(t("whatsapp.settings.pinRequired"));
      return;
    }
    try {
      setRegistering(true);
      setActionError("");
      const status = await registerWhatsAppPhone(businessId, pin);
      setRegisterPin("");
      setConnection(status);
      if (status.readyToSend) {
        toast.success(t("whatsapp.settings.registrationSuccess"));
      } else {
        toast.error(
          status.registrationLastError || t("whatsapp.errors.registerFailed")
        );
      }
      await load();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || t("whatsapp.errors.registerFailed");
      setActionError(msg);
      toast.error(msg);
      await load();
    } finally {
      setRegistering(false);
    }
  };

  const handleStartVoiceVerification = async () => {
    if (!businessId) return;
    try {
      setStartingVoiceVerification(true);
      const result = await startWhatsAppVoiceVerification(businessId, {
        source: "manual",
      });
      setVoiceSession(result.session);
      try {
        await requestWhatsAppVoiceVerificationCode(businessId);
        toast.info(
          "Voice verification is ready. Meta should call your verification number."
        );
      } catch {
        toast.info(
          "Voice verification is ready. Request a voice call from Meta."
        );
      }
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, "Could not start voice verification")
      );
    } finally {
      setStartingVoiceVerification(false);
    }
  };

  const handleCopyVoiceOtp = async () => {
    if (!businessId || !voiceSession?.otpCode || !voiceSession.sessionId) return;
    try {
      await navigator.clipboard.writeText(voiceSession.otpCode);
      toast.success("Verification code copied");
      try {
        const result = await consumeWhatsAppVoiceOtp(
          businessId,
          voiceSession.sessionId
        );
        setVoiceSession(result.session);
      } catch {
        // Keep showing code if consume races with auto-verify.
      }
    } catch {
      toast.error("Could not copy verification code");
    }
  };

  const handleRetryMetaVerify = async () => {
    if (!businessId || !voiceSession?.sessionId) return;
    try {
      const result = await submitWhatsAppVoiceVerificationCode(
        businessId,
        voiceSession.sessionId
      );
      if (result.session) setVoiceSession(result.session);
      toast.success("Submitted verification code to Meta");
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, "Could not submit verification code to Meta")
      );
      try {
        const status = await getWhatsAppVoiceVerificationStatus(businessId);
        setVoiceSession(status.session);
      } catch {
        // ignore refresh failure
      }
    }
  };

  const handleDisconnect = async () => {
    if (!businessId) return;
    if (connection?.canDisconnect === false || connection?.isPlatformManagedConnection) {
      toast.error(t("whatsapp.settings.managedHostNoDisconnect"));
      return;
    }
    if (!window.confirm(t("whatsapp.settings.confirmDisconnect"))) return;
    try {
      setSaving(true);
      const status = await disconnectWhatsApp(businessId);
      setConnection(status);
      setApprovedTemplates([]);
      setRegisterPin("");
      toast.success(t("whatsapp.settings.disconnected"));
    } catch (error: any) {
      const code = error?.response?.data?.code;
      toast.error(
        code === "PLATFORM_MANAGED_CONNECTION_PROTECTED"
          ? t("whatsapp.settings.managedHostNoDisconnect")
          : error?.response?.data?.error || t("whatsapp.errors.disconnect")
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
    if (!connection?.readyToSend) {
      toast.error(t("whatsapp.settings.registrationRequired"));
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

  const linked = Boolean(connection?.connected);
  const isPlatformManaged = Boolean(connection?.isPlatformManagedConnection);
  const canDisconnect = connection?.canDisconnect !== false && !isPlatformManaged;
  const canConnectOwn = connection?.canConnectOwnNumber !== false && !isPlatformManaged;
  const usingManagedWithoutPrivate = Boolean(connection?.usingManagedWithoutPrivate);
  const readyToSend = Boolean(connection?.readyToSend);
  const needsRegistration =
    linked &&
    !readyToSend &&
    (connection?.registrationStatus === "required" ||
      connection?.registrationStatus === "pending" ||
      connection?.registrationStatus === "failed" ||
      connection?.registrationStatus === "" ||
      !connection?.phoneRegistered);
  const tone = readinessTone(connection);
  const statusTitle = readyToSend
    ? t("whatsapp.settings.readyToSend")
    : connection?.registrationStatus === "failed"
      ? t("whatsapp.settings.registrationFailed")
      : linked
        ? t("whatsapp.settings.registrationRequired")
        : t("whatsapp.settings.disconnectedStatus");
  const statusHint = readyToSend
    ? t("whatsapp.settings.connectedHint")
    : connection?.registrationStatus === "failed"
      ? t("whatsapp.settings.registrationFailedHint")
      : linked
        ? t("whatsapp.settings.registrationRequiredHint")
        : t("whatsapp.settings.disconnectedHint");

  return (
    <div className="space-y-4">
      <MetaBillingAccountCards
        adAccountBilling={adAccountBilling}
        wabaBilling={connection?.wabaBillingHealth || null}
        adsSettingsPath="../meta-campaigns/settings"
        onOpenWhatsAppSettings={() => {
          document
            .getElementById("whatsapp-connection-settings")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section
        id="whatsapp-connection-settings"
        className={`${cardBase} p-4 sm:p-5`}
      >
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.settings.title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("whatsapp.settings.subtitle")}
        </p>

        {!linked ? (
          <div className="mt-6 space-y-4">
            {usingManagedWithoutPrivate ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-900">
                <p className="font-black">
                  {t("whatsapp.settings.usingManagedTitle")}
                </p>
                <p className="mt-1 text-emerald-800">
                  {t("whatsapp.settings.usingManagedBody")}
                </p>
              </div>
            ) : null}
            <p className="text-sm font-medium text-slate-600">
              {usingManagedWithoutPrivate
                ? t("whatsapp.settings.connectOwnIntro")
                : t("whatsapp.settings.connectIntro")}
            </p>
            {canConnectOwn ? (
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
                  : usingManagedWithoutPrivate
                    ? t("whatsapp.settings.connectOwnCta")
                    : t("whatsapp.settings.connectCta")}
              </button>
            ) : (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {t("whatsapp.settings.managedHostNoConnectOwn")}
              </p>
            )}
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
            {isPlatformManaged ? (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-950">
                <p className="font-black">
                  {t("whatsapp.settings.managedHostTitle")}
                </p>
                <p className="mt-1 text-sky-900">
                  {t("whatsapp.settings.managedHostBody")}
                </p>
              </div>
            ) : null}
            <div className={`rounded-xl border px-4 py-3 ${tone.box}`}>
              <div className="flex items-center gap-2">
                {readyToSend ? (
                  <CheckCircle2 className={`h-5 w-5 ${tone.icon}`} />
                ) : (
                  <ShieldAlert className={`h-5 w-5 ${tone.icon}`} />
                )}
                <p className={`text-sm font-black ${tone.title}`}>
                  {connection?.readinessLabel || statusTitle}
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
                {connection?.phonePlatformStatus ? (
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="font-semibold text-slate-500">
                      {t("whatsapp.settings.phoneStatus")}
                    </dt>
                    <dd className="font-bold text-slate-900" dir="ltr">
                      {connection.phonePlatformStatus}
                    </dd>
                  </div>
                ) : null}
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

            {needsRegistration && (
              <>
              <div className="rounded-xl border border-amber-200 bg-white px-4 py-3">
                <label className="block text-sm font-black text-slate-900">
                  {t("whatsapp.settings.pinLabel")}
                </label>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {t("whatsapp.settings.pinHint")}
                </p>
                <input
                  className={`${inputBase} mt-3 tracking-[0.35em]`}
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={registerPin}
                  onChange={(e) =>
                    setRegisterPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  className={`${btnPrimary} mt-3`}
                  disabled={registering || registerPin.replace(/\D/g, "").length !== 6}
                  onClick={() => {
                    void handleRegister();
                  }}
                >
                  {registering ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  {registering
                    ? t("whatsapp.settings.registering")
                    : t("whatsapp.settings.registerCta")}
                </button>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-sky-700" />
                  <p className="text-sm font-black text-slate-900">
                    Voice verification code
                  </p>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  Start listening, then ask Meta to call your verification number.
                </p>
                {voiceSession?.otpAvailable && voiceSession.otpCode ? (
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      className="w-full rounded-lg bg-white px-3 py-2 text-center font-mono text-2xl font-black tracking-[0.3em] text-slate-900"
                      dir="ltr"
                      aria-label="Captured voice verification code — click to copy"
                      onClick={() => {
                        void handleCopyVoiceOtp();
                      }}
                    >
                      {voiceSession.otpCode}
                    </button>
                    {voiceSession.metaVerifyStatus === "verified" ? (
                      <p className="text-xs font-bold text-emerald-800">
                        Submitted to Meta successfully
                      </p>
                    ) : null}
                    {voiceSession.metaVerifyStatus === "failed" ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-rose-700">
                          {voiceSession.metaVerifyError ||
                            "Auto-submit failed — enter this code in Meta, or retry"}
                        </p>
                        <button
                          type="button"
                          className={btnSecondary}
                          onClick={() => {
                            void handleRetryMetaVerify();
                          }}
                        >
                          Retry Meta submit
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : voiceSession ? (
                  <p className="mt-3 text-xs font-bold text-sky-800">
                    {voiceSessionStatusLabel(voiceSession)}
                  </p>
                ) : null}
                {voiceSession?.metaVerifyStatus ? (
                  <p className="mt-2 text-[11px] font-semibold text-slate-500" dir="ltr">
                    Meta verify: {voiceSession.metaVerifyStatus}
                    {voiceSession.metaVerifyError
                      ? ` — ${voiceSession.metaVerifyError}`
                      : ""}
                  </p>
                ) : null}
                <button
                  type="button"
                  className={`${btnSecondary} mt-3`}
                  disabled={
                    startingVoiceVerification ||
                    Boolean(
                      voiceSession &&
                        ["waiting_for_call", "call_received", "answered", "capturing"].includes(
                          voiceSession.status
                        )
                    )
                  }
                  onClick={() => {
                    void handleStartVoiceVerification();
                  }}
                >
                  {startingVoiceVerification ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PhoneCall className="h-4 w-4" />
                  )}
                  Start voice capture
                </button>
              </div>
              </>
            )}

            <div className="flex flex-wrap gap-2">
              {canConnectOwn ? (
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
              ) : null}
              {canDisconnect ? (
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={saving}
                  onClick={handleDisconnect}
                >
                  <Unplug className="h-4 w-4" />
                  {t("whatsapp.settings.disconnect")}
                </button>
              ) : isPlatformManaged ? (
                <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                  {t("whatsapp.settings.managedHostNoDisconnect")}
                </p>
              ) : null}
            </div>
          </div>
        )}

        {(actionError ||
          connection?.registrationLastError ||
          (!readyToSend && connection?.lastError)) && (
          <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {actionError ||
              connection?.registrationLastError ||
              connection?.lastError}
          </p>
        )}
      </section>

      <div className="space-y-4">
        <section className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center gap-2">
            {readyToSend ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            )}
            <h3 className="text-base font-black text-slate-900">
              {statusTitle}
            </h3>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">{statusHint}</p>
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
            disabled={!readyToSend}
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
            disabled={!readyToSend}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="050-0000000"
          />
          <label className="mt-3 flex items-start gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 accent-emerald-600"
              checked={testConsent}
              disabled={!readyToSend}
              onChange={(e) => setTestConsent(e.target.checked)}
            />
            <span>{t("whatsapp.settings.consentLabel")}</span>
          </label>
          <button
            type="button"
            className={`${btnPrimary} mt-3 w-full`}
            disabled={
              testing ||
              !readyToSend ||
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
    </div>
  );
}
