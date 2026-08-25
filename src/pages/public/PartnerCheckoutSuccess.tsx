import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  fetchPublicCheckoutStatus,
  fetchPublicPartnerBranding,
  partnerApiError,
} from "../../lib/partnerApi";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { partnerDisplayName, partnerFacingName, type PublicPartnerBranding } from "../../lib/partnerBranding";

function checkoutSettled(payload: { paid?: boolean; activationStatus?: string } | null) {
  if (!payload?.paid) return false;
  const activation = payload.activationStatus;
  return activation === "active" || activation === "requires_action" || activation === "failed";
}

export default function PartnerCheckoutSuccess() {
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
      setError("הזמנה לא נמצאה");
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
        if (!cancelled) setError(partnerApiError(err, "לא ניתן לטעון את סטטוס ההזמנה"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, sessionId, awaitingHostSlug]);

  const activation = data?.activationStatus;
  const paid = Boolean(data?.paid);
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const brandName =
    partnerFacingName(data?.branding || hostBranding, host) ||
    partnerDisplayName(data?.branding || hostBranding);
  const supportLabel = brandName || "הצוות";

  return (
    <PublicPartnerShell branding={data?.branding || hostBranding} title="הרכישה התקבלה" noIndex>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {!error && (awaitingHostSlug || !data) ? (
        <p className="font-bold text-slate-500">בודקים את ההזמנה...</p>
      ) : null}
      {data ? (
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          {paid && activation === "active" && data.welcomeEmailSent ? (
            <>
              <h1 className="text-2xl font-black">החשבון שלך מוכן. פרטי הכניסה נשלחו אליך.</h1>
              <p className="font-bold text-slate-600">עסקה {data.dealNumber}</p>
              <a href="/login" className="inline-block font-black text-[#7C4DFF]">
                התחברות לחשבון
              </a>
            </>
          ) : paid && activation === "active" ? (
            <>
              <h1 className="text-2xl font-black">החשבון שלך מוכן.</h1>
              <p className="font-bold text-slate-600">
                אם לא קיבלת מייל עם פרטי כניסה, פנו ל{supportLabel}. עסקה {data.dealNumber}
              </p>
              <a href="/login" className="inline-block font-black text-[#7C4DFF]">
                התחברות לחשבון
              </a>
            </>
          ) : paid && (activation === "pending" || activation === "processing") ? (
            <>
              <h1 className="text-2xl font-black">התשלום התקבל והחשבון שלך נמצא בהקמה.</h1>
              <p className="font-bold text-slate-600">נעדכן ברגע שהחשבון יהיה מוכן.</p>
            </>
          ) : paid ? (
            <>
              <h1 className="text-2xl font-black">התשלום התקבל.</h1>
              <p className="font-bold text-amber-800">
                החשבון עדיין דורש טיפול: {partnerStatusLabel(activation)}. {brandName ? `${brandName} יטפל בהפעלה.` : "נטפל בהפעלה."}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-black">ממתינים לאישור התשלום.</h1>
          )}
        </div>
      ) : null}
    </PublicPartnerShell>
  );
}
