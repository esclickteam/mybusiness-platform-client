import React, { useEffect, useState } from "react";
import { fetchPartnerMe, updatePartnerStorefront } from "../../lib/partnerApi";
import type { PartnerMe } from "../../types/partner";

export default function PartnerSettings() {
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetchPartnerMe()
      .then((data) => {
        setPartner(data);
        setName(data.name);
      })
      .catch((err) => setError(err.response?.data?.error || "שגיאה בטעינת הגדרות"));
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-black">הגדרות פרטנר</h2>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
      <p className="text-sm font-bold text-slate-500">
        מסלול: {partner?.plan?.nameHe || partner?.planKey} · סטטוס: {partner?.status}
      </p>
      <p className="text-sm">
        זכאות לדומיין מותאם: {partner?.plan?.customDomainEligible ? "כן (Phase 1B)" : "לא"}
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await updatePartnerStorefront({ slug: partner?.slug });
            setSaved("ההגדרות נשמרו");
          } catch (err: any) {
            setError(err.response?.data?.error || "שגיאה בשמירה");
          }
        }}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
      >
        שמור
      </button>
    </div>
  );
}
