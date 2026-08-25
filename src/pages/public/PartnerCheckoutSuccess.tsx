import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchPublicCheckoutStatus, partnerApiError } from "../../lib/partnerApi";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { partnerStatusLabel } from "../../lib/partnerLabels";

function checkoutSettled(payload: { paid?: boolean; activationStatus?: string } | null) {
  if (!payload?.paid) return false;
  const activation = payload.activationStatus;
  return activation === "active" || activation === "requires_action" || activation === "failed";
}

export default function PartnerCheckoutSuccess() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || !sessionId) {
      setError("הזמנה לא נמצאה");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
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
  }, [slug, sessionId]);

  const activation = data?.activationStatus;
  const paid = Boolean(data?.paid);

  return (
    <PublicPartnerShell branding={data?.branding} title="הרכישה התקבלה" noIndex>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {!error && !data ? <p className="font-bold text-slate-500">בודקים את ההזמנה...</p> : null}
      {data ? (
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          {paid && activation === "active" && data.welcomeEmailSent ? (
            <>
              <h1 className="text-2xl font-black">החשבון שלך מוכן. פרטי הכניסה נשלחו אליך.</h1>
              <p className="font-bold text-slate-600">עסקה {data.dealNumber}</p>
            </>
          ) : paid && activation === "active" ? (
            <>
              <h1 className="text-2xl font-black">החשבון שלך מוכן.</h1>
              <p className="font-bold text-slate-600">
                אם לא קיבלת מייל עם פרטי כניסה, פנו לפרטנר. עסקה {data.dealNumber}
              </p>
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
                החשבון עדיין דורש טיפול: {partnerStatusLabel(activation)}. צוות הפרטנר יטפל בהפעלה.
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
