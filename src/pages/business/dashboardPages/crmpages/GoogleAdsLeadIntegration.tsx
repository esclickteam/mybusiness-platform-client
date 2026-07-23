import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  KeyRound,
  Link2,
  RefreshCw,
  Unplug,
} from "lucide-react";
import API from "@api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

type GoogleConnection = {
  enabled: boolean;
  webhookUrl: string;
  googleKey: string;
  lastWebhookAt?: string | null;
  lastLeadId?: string;
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
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState<"url" | "key" | "">("");
  const [connection, setConnection] = useState<GoogleConnection>({
    enabled: false,
    webhookUrl: "",
    googleKey: "",
  });

  const tenantParams = businessId ? { businessId } : undefined;

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get<{
        success: boolean;
        connection: GoogleConnection;
      }>("/google-ads-leads/status", { params: tenantParams });
      setConnection(
        data.connection || {
          enabled: false,
          webhookUrl: "",
          googleKey: "",
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(`${T}.errors.loadStatus`)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const runAction = async (
    path: "/google-ads-leads/enable" | "/google-ads-leads/rotate-key" | "/google-ads-leads/disconnect",
    successKey: string
  ) => {
    try {
      setBusy(true);
      setError("");
      setSuccess("");
      const { data } = await API.post<{
        success: boolean;
        connection: GoogleConnection;
      }>(path, {}, { params: tenantParams });
      setConnection(
        data.connection || {
          enabled: false,
          webhookUrl: "",
          googleKey: "",
        }
      );
      setSuccess(t(successKey));
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`${T}.errors.actionFailed`));
    } finally {
      setBusy(false);
    }
  };

  const copyValue = async (value: string, kind: "url" | "key") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setError(t(`${T}.errors.copyFailed`));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl" dir={dir}>
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
            {t(`${T}.subtitle`)}
          </p>

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
          ) : !connection.enabled ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-600">
                {t(`${T}.enableHint`)}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("/google-ads-leads/enable", `${T}.successEnabled`)}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-black text-white transition hover:bg-[#0D9488] disabled:opacity-60"
              >
                {busy ? <BizuplyLoader size="xs" compact /> : <Link2 className="h-4 w-4" />}
                {t(`${T}.enable`)}
              </button>
            </div>
          ) : (
            <>
              <ol className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm font-semibold text-slate-700">
                <li>1. {t(`${T}.steps.openAds`)}</li>
                <li>2. {t(`${T}.steps.openForm`)}</li>
                <li>3. {t(`${T}.steps.pasteWebhook`)}</li>
                <li>4. {t(`${T}.steps.pasteKey`)}</li>
                <li>5. {t(`${T}.steps.sendTest`)}</li>
              </ol>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                    <Link2 className="h-3.5 w-3.5" />
                    {t(`${T}.webhookUrl`)}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <code
                      className="min-w-0 flex-1 break-all rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                      dir="ltr"
                    >
                      {connection.webhookUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => void copyValue(connection.webhookUrl, "url")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied === "url" ? t(`${T}.copied`) : t(`${T}.copy`)}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                    <KeyRound className="h-3.5 w-3.5" />
                    {t(`${T}.googleKey`)}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <code
                      className="min-w-0 flex-1 break-all rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                      dir="ltr"
                    >
                      {connection.googleKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => void copyValue(connection.googleKey, "key")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied === "key" ? t(`${T}.copied`) : t(`${T}.copy`)}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void runAction("/google-ads-leads/rotate-key", `${T}.successRotated`)
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 disabled:opacity-60"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t(`${T}.rotateKey`)}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void runAction("/google-ads-leads/disconnect", `${T}.successDisconnected`)
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700 disabled:opacity-60"
                >
                  <Unplug className="h-3.5 w-3.5" />
                  {t(`${T}.disconnect`)}
                </button>
              </div>

              {connection.lastWebhookAt && (
                <p className="text-xs font-semibold text-slate-500">
                  {t(`${T}.lastWebhook`, {
                    date: new Date(connection.lastWebhookAt).toLocaleString(),
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
