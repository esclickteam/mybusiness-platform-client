import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchPublicCheckoutStatus,
  fetchPublicPartnerBranding,
  partnerApiError,
} from "../../lib/partnerApi";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";

function checkoutSettled(payload: { paid?: boolean; activationStatus?: string } | null) {
  if (!payload?.paid) return false;
  const activation = payload.activationStatus;
  return activation === "active" || activation === "requires_action" || activation === "failed";
}

export default function PartnerCheckoutSuccess() {
  const { t } = useTranslation();
  const { slug: slugParam } = useParams();
  const [params] = useSearchParams();
  const slugFromQuery = (params.get("slug") || "").trim();
  const sessionId = params.get("session_id") || "";
  const [hostSlug, setHostSlug] = useState<string | null>(null);
  const [hostBranding, setHostBranding] = useState<PublicPartnerBranding | null>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const slug = slugParam || slugFromQuery || hostSlug || "";
  const awaitingHostSlug = !slugParam && !slugFromQuery && hostSlug === null;

  useEffect(() => {
    if (slugParam || slugFromQuery) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const branding = await fetchPublicPartnerBranding({ host: window.location.host });
        if (!cancelled) {
          setHostSlug(String(branding?.slug || "").trim());
          setHostBranding(branding || null);
        }
      } catch {
        if (!cancelled) setHostSlug("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slugParam, slugFromQuery]);

  useEffect(() => {
    if (awaitingHostSlug) return;
    if (!slug || !sessionId) {
      setError(t("partner.errors.orderNotFound"));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setError("");
        let payload = await fetchPublicCheckoutStatus(slug, sessionId);
        if (cancelled) return;
        setData(payload);
        for (let attempt = 0; attempt < 12 && !cancelled && !checkoutSettled(payload); attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          payload = await fetchPublicCheckoutStatus(slug, sessionId);
          if (cancelled) return;
          setData(payload);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(partnerApiError(err, t("partner.errors.orderStatus")));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, sessionId, awaitingHostSlug, t]);

  const activation = data?.activationStatus;
  const paid = Boolean(data?.paid);

  return (
    <PublicPartnerShell branding={data?.branding || hostBranding} title={t("partner.public.purchaseReceived")} noIndex>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {!error && (awaitingHostSlug || !data) ? (
        <p className="font-bold text-slate-500">{t("partner.public.checkingOrder")}</p>
      ) : null}
      {data ? (
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          {paid && activation === "active" && data.welcomeEmailSent ? (
            <>
              <h1 className="text-2xl font-black">{t("partner.public.accountReadySent")}</h1>
              <p className="font-bold text-slate-600">{t("partner.public.dealNumber", { number: data.dealNumber })}</p>
              <a href="/login" className="inline-block font-black text-[#7C4DFF]">
                {t("partner.public.loginAccount")}
              </a>
            </>
          ) : paid && activation === "active" ? (
            <>
              <h1 className="text-2xl font-black">{t("partner.public.accountReady")}</h1>
              <p className="font-bold text-slate-600">
                {t("partner.public.noWelcomeEmail", { number: data.dealNumber })}
              </p>
              <a href="/login" className="inline-block font-black text-[#7C4DFF]">
                {t("partner.public.loginAccount")}
              </a>
            </>
          ) : paid && (activation === "pending" || activation === "processing") ? (
            <>
              <h1 className="text-2xl font-black">{t("partner.public.provisioning")}</h1>
              <p className="font-bold text-slate-600">{t("partner.public.weWillUpdate")}</p>
            </>
          ) : paid ? (
            <>
              <h1 className="text-2xl font-black">{t("partner.public.paymentReceived")}</h1>
              <p className="font-bold text-amber-800">
                {t("partner.public.needsAttention", { status: partnerStatusLabel(activation, t) })}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-black">{t("partner.public.waitingPaymentConfirm")}</h1>
          )}
        </div>
      ) : null}
    </PublicPartnerShell>
  );
}
