import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchPublicCheckoutStatus, partnerApiError } from "../../lib/partnerApi";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { partnerStatusLabel } from "../../lib/partnerLabels";

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
    fetchPublicCheckoutStatus(slug, sessionId)
      .then(setData)
      .catch((err) => setError(partnerApiError(err, "לא ניתן לטעון את סטטוס ההזמנה")));
  }, [slug, sessionId]);

  const activation = data?.activationStatus;
  const paid = Boolean(data?.paid);

  return (
    <PublicPartnerShell branding={data?.branding} title="הרכישה התקבלה" noIndex>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {!error && !data ? <p className="font-bold text-slate-500">בודקים את ההזמנה...</p> : null}
      {data ? (
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          {paid && activation === "active" ? (
            <>
              <h1 className="text-2xl font-black">החשבון שלך מוכן. פרטי הכניסה נשלחו אליך.</h1>
              <p className="font-bold text-slate-600">עסקה {data.dealNumber}</p>
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
