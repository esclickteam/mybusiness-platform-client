import React, { useEffect, useState } from "react";
import { fetchPartnerMe, updatePartnerStorefront } from "../../lib/partnerApi";
import type { PartnerMe } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
} from "../../components/partner/partnerUi";

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
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="הגדרות"
        title="הגדרות פרטנר"
        subtitle="פרטי המסלול, הסטטוס והשם שמוצגים בלוח."
      />
      <PartnerCard className="space-y-4 p-6">
        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
        {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
        <p className="text-sm font-bold text-slate-500">
          מסלול: {partner?.plan?.nameHe || partner?.planKey} · סטטוס: {partner?.status}
        </p>
        <p className="text-sm font-bold text-slate-500">
          זכאות לדומיין מותאם: {partner?.plan?.customDomainEligible ? "כן (Phase 1B)" : "לא"}
        </p>
        <PartnerInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם פרטנר"
        />
        <PartnerPrimaryButton
          type="button"
          onClick={async () => {
            try {
              await updatePartnerStorefront({ slug: partner?.slug });
              setSaved("ההגדרות נשמרו");
            } catch (err: any) {
              setError(err.response?.data?.error || "שגיאה בשמירה");
            }
          }}
        >
          שמור
        </PartnerPrimaryButton>
      </PartnerCard>
    </div>
  );
}
