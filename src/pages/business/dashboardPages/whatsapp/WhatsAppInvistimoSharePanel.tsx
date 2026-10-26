import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  completeWhatsAppEmbeddedSignup,
  getInvistimoShareReadiness,
  getWhatsAppEmbeddedSignupConfig,
  runInvistimoTemplateMigrationDryRun,
} from "../../../../api/whatsappApi";
import { btnPrimary, btnSecondary } from "../../../../styles/bizuplyUi";
import { loadFacebookSdk } from "../../../../utils/loadFacebookSdk";
import { getApiErrorMessage } from "../../../../utils/apiErrorMessage";
import {
  extractEmbeddedSignupSessionAssets,
} from "./embeddedSignupSessionAssets";
import {
  INVISTIMO_SHARE_CONFIRM_PHRASE,
  INVISTIMO_SHARE_SCREENS,
  assertInvistimoShareAssets,
  buildInvistimoAccountShareExtras,
  evaluateInvistimoShareEvent,
} from "./invistimoAccountSharePolicy";

type Props = {
  businessId: string;
};

export default function WhatsAppInvistimoSharePanel({ businessId }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<"templates" | "readiness" | "share" | null>(
    null
  );
  const [summary, setSummary] = useState("");
  const [shareAllowed, setShareAllowed] = useState(false);
  const sessionRef = useRef<{
    phoneNumberId: string;
    wabaId: string;
    metaBusinessId?: string;
    event?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getWhatsAppEmbeddedSignupConfig(businessId)
      .then((config) => {
        if (cancelled) return;
        setShareAllowed(Boolean(config.invistimoAccountShare?.shareExecutionAllowed));
      })
      .catch(() => {
        if (!cancelled) setShareAllowed(false);
      });
    return () => {
      cancelled = true;
    };
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
        const verdict = evaluateInvistimoShareEvent(
          typeof data.event === "string" ? data.event : ""
        );
        if (verdict.abort) {
          sessionRef.current = null;
          if (data.event && data.event !== "CANCEL") {
            toast.error(t("whatsapp.settings.invistimoShareMetaAbort"));
          }
          return;
        }
        const assets = extractEmbeddedSignupSessionAssets(data);
        if (assets?.phoneNumberId && assets?.wabaId) {
          sessionRef.current = {
            phoneNumberId: assets.phoneNumberId,
            wabaId: assets.wabaId,
            metaBusinessId: assets.metaBusinessId,
            event: assets.event,
          };
        }
      } catch {
        // Ignore non-JSON postMessages from the popup.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [t]);

  const handleTemplateDryRun = async () => {
    try {
      setBusy("templates");
      const data = await runInvistimoTemplateMigrationDryRun(businessId);
      setSummary(
        t("whatsapp.settings.invistimoShareTemplatesResult", {
          mapped: data.mappedCount ?? 0,
          eligible: data.eligibleCount ?? 0,
          ineligible: data.ineligibleCount ?? 0,
        })
      );
      toast.success(t("whatsapp.settings.invistimoShareTemplatesOk"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          t("whatsapp.settings.invistimoShareTemplatesFailed")
      );
    } finally {
      setBusy(null);
    }
  };

  const handleReadiness = async () => {
    try {
      setBusy("readiness");
      const data = await getInvistimoShareReadiness(businessId);
      const blocked = (data.summary?.BLOCKED || []).join(", ") || "none";
      const unverified = (data.summary?.NOT_VERIFIED || []).join(", ") || "none";
      setSummary(
        t("whatsapp.settings.invistimoShareReadinessResult", {
          blocked,
          unverified,
        })
      );
      toast.success(t("whatsapp.settings.invistimoShareReadinessOk"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          t("whatsapp.settings.invistimoShareReadinessFailed")
      );
    } finally {
      setBusy(null);
    }
  };

  const handleStartShare = async () => {
    if (!shareAllowed) {
      toast.error(t("whatsapp.settings.invistimoShareStartBlocked"));
      return;
    }
    try {
      setBusy("share");
      sessionRef.current = null;
      const signup = await getWhatsAppEmbeddedSignupConfig(businessId);
      if (!signup.ready || !signup.appId || !signup.configId) {
        throw new Error(t("whatsapp.settings.configMissing"));
      }
      if (!signup.invistimoAccountShare?.shareExecutionAllowed) {
        throw new Error(t("whatsapp.settings.invistimoShareStartBlocked"));
      }
      const FB = await loadFacebookSdk(
        signup.appId,
        signup.graphVersion || "v21.0"
      );
      await new Promise<void>((resolve, reject) => {
        FB.login(
          (response) => {
            void (async () => {
              try {
                const code = response?.authResponse?.code;
                if (!code) {
                  reject(new Error(t("whatsapp.settings.connectCancelled")));
                  return;
                }
                const assets = sessionRef.current;
                if (!assets?.phoneNumberId || !assets?.wabaId) {
                  reject(new Error(t("whatsapp.settings.missingSessionAssets")));
                  return;
                }
                const eventCheck = evaluateInvistimoShareEvent(assets.event || "FINISH");
                if (!eventCheck.allowComplete) {
                  reject(new Error(t("whatsapp.settings.invistimoShareMetaAbort")));
                  return;
                }
                const assetCheck = assertInvistimoShareAssets(assets);
                if (!assetCheck.ok) {
                  reject(new Error(t("whatsapp.settings.invistimoShareMetaAbort")));
                  return;
                }
                const status = await completeWhatsAppEmbeddedSignup(businessId, {
                  code,
                  phoneNumberId: assets.phoneNumberId,
                  wabaId: assets.wabaId,
                  metaBusinessId: assets.metaBusinessId,
                  metaEventType: assets.event || "FINISH",
                  confirmInvistimoAccountShare: INVISTIMO_SHARE_CONFIRM_PHRASE,
                });
                if (!status.staged || status.liveUnchanged === false) {
                  reject(new Error(t("whatsapp.settings.invistimoShareMetaAbort")));
                  return;
                }
                setSummary(
                  t("whatsapp.settings.invistimoShareStartedOk", {
                    waba: assets.wabaId,
                  })
                );
                toast.success(t("whatsapp.settings.invistimoShareStartedOkToast"));
                resolve();
              } catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
              }
            })();
          },
          {
            config_id: signup.configId,
            response_type: "code",
            override_default_response_type: true,
            extras:
              signup.invistimoAccountShare?.extras ||
              signup.extras ||
              buildInvistimoAccountShareExtras(),
          }
        );
      });
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, t("whatsapp.settings.invistimoShareStartFailed"))
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
      <p className="font-semibold">
        {t("whatsapp.settings.invistimoShareTitle")}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-600">
        {t("whatsapp.settings.invistimoShareBody")}
      </p>
      <ol className="mt-3 list-decimal space-y-1 ps-5 text-xs font-medium text-slate-700">
        <li>{t("whatsapp.settings.invistimoShareStep1")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep2")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep3")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep4")}</li>
      </ol>
      <p className="mt-3 text-xs font-semibold text-slate-900">
        {t("whatsapp.settings.invistimoShareScreensTitle")}
      </p>
      <ol className="mt-2 list-decimal space-y-2 ps-5 text-xs font-medium text-slate-700">
        {INVISTIMO_SHARE_SCREENS.map((screen) => (
          <li key={screen.id}>
            <span className="font-semibold">{t(screen.titleKey)}</span>
            <span className="mt-0.5 block">{t(screen.meaningKey)}</span>
            <span className="mt-0.5 block font-semibold text-amber-800">
              {t(screen.abortKey)}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs font-semibold text-amber-800">
        {t("whatsapp.settings.invistimoShareAbortHow")}
      </p>
      <p className="mt-2 text-xs font-semibold text-slate-800">
        {t(
          shareAllowed
            ? "whatsapp.settings.invistimoShareGoShareOnly"
            : "whatsapp.settings.invistimoShareGoNoGo"
        )}
      </p>
      <p className="mt-2 text-xs font-semibold text-amber-800">
        {t("whatsapp.settings.invistimoShareFrozen")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={shareAllowed ? btnPrimary : btnSecondary}
          disabled={!shareAllowed || busy !== null}
          onClick={() => {
            void handleStartShare();
          }}
        >
          {busy === "share"
            ? t("whatsapp.settings.invistimoShareStarting")
            : shareAllowed
              ? t("whatsapp.settings.invistimoShareStart")
              : t("whatsapp.settings.invistimoShareStartBlocked")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={busy !== null}
          onClick={() => {
            void handleTemplateDryRun();
          }}
        >
          {busy === "templates"
            ? t("whatsapp.settings.invistimoShareTemplatesRunning")
            : t("whatsapp.settings.invistimoShareTemplates")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={busy !== null}
          onClick={() => {
            void handleReadiness();
          }}
        >
          {busy === "readiness"
            ? t("whatsapp.settings.invistimoShareReadinessRunning")
            : t("whatsapp.settings.invistimoShareReadiness")}
        </button>
      </div>
      {summary ? (
        <p className="mt-2 text-xs font-medium text-slate-600" dir="ltr">
          {summary}
        </p>
      ) : null}
    </div>
  );
}
