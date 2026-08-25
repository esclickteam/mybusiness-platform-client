import React, { useEffect, useState } from "react";
import {
  fetchPartnerMe,
  partnerApiError,
  updatePartnerCompliance,
  uploadPartnerComplianceDocument,
} from "../../lib/partnerApi";
import type { PartnerCompliance, PartnerMe } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
  PartnerBadge,
} from "../../components/partner/partnerUi";

const DOCUMENTS = [
  {
    kind: "accountManagementAuth",
    label: "אישור ניהול חשבון",
    hint: "מסמך הרשאה לניהול חשבון / ייפוי כוח",
  },
  {
    kind: "dealerCertificate",
    label: "תעודת עוסק",
    hint: "תעודת עוסק מורשה / פטור",
  },
  {
    kind: "idPhoto",
    label: "צילום תעודה מזהה",
    hint: "צילום ת״ז ברור משני הצדדים אם אפשר",
  },
] as const;

const STATUS_HE: Record<string, string> = {
  incomplete: "חסרים פרטים",
  submitted: "ממתין לבדיקת אדמין",
  approved: "אושר",
  rejected: "נדחה — יש לתקן ולשלוח שוב",
};

const emptyCompliance = (): PartnerCompliance => ({
  accountHolderName: "",
  idNumber: "",
  taxNumber: "",
  phone: "",
  bankName: "",
  branch: "",
  account: "",
  documents: {
    accountManagementAuth: null,
    dealerCertificate: null,
    idPhoto: null,
  },
  reviewStatus: "incomplete",
});

export default function PartnerSettings() {
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [name, setName] = useState("");
  const [form, setForm] = useState<PartnerCompliance>(emptyCompliance());
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  function applyCompliance(next: PartnerCompliance | undefined, displayName?: string) {
    const merged = { ...emptyCompliance(), ...(next || {}) };
    merged.documents = {
      ...emptyCompliance().documents,
      ...(next?.documents || {}),
    };
    setForm(merged);
    if (displayName) setName(displayName);
  }

  useEffect(() => {
    fetchPartnerMe()
      .then((data) => {
        setPartner(data);
        applyCompliance(data.compliance, data.name);
      })
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת הגדרות")));
  }, []);

  function setField<K extends keyof PartnerCompliance>(key: K, value: PartnerCompliance[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveDetails() {
    setSaving(true);
    setError("");
    setSaved("");
    try {
      const compliance = await updatePartnerCompliance({
        name,
        resubmit: true,
        accountHolderName: form.accountHolderName,
        idNumber: form.idNumber,
        taxNumber: form.taxNumber,
        phone: form.phone,
        bankName: form.bankName,
        branch: form.branch,
        account: form.account,
      });
      applyCompliance(compliance, name);
      setSaved("פרטי החשבון נשמרו והועברו לאדמין");
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה בשמירה"));
    } finally {
      setSaving(false);
    }
  }

  async function uploadDoc(kind: string, file?: File) {
    if (!file) return;
    setUploading(kind);
    setError("");
    try {
      const compliance = await uploadPartnerComplianceDocument(kind, file);
      applyCompliance(compliance, name);
      setSaved("המסמך הועלה");
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה בהעלאת מסמך"));
    } finally {
      setUploading("");
    }
  }

  const status = form.reviewStatus || "incomplete";

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="הגדרות"
        title="הגדרות פרטנר"
        subtitle="פרטי חשבון, ת״ז, תעודת עוסק ואישור ניהול חשבון — הכול מועבר לאדמין כולל חשבון הבנק."
      />
      {partner?.billingCheckoutAvailable === false ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
          החיוב מנוהל כרגע על ידי Bizuply. אין אפשרות לתשלום מנוי עצמאי מהמערכת.
        </p>
      ) : null}

      <PartnerCard className="space-y-4 p-6">
        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
        {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <PartnerBadge
            tone={
              status === "approved"
                ? "emerald"
                : status === "rejected"
                  ? "rose"
                  : status === "submitted"
                    ? "sky"
                    : "amber"
            }
          >
            {STATUS_HE[status] || status}
          </PartnerBadge>
          <p className="text-sm font-bold text-slate-500">
            מסלול: {partner?.plan?.nameHe || partner?.planKey}
          </p>
        </div>
        {form.adminFeedback ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
            משוב אדמין: {form.adminFeedback}
          </p>
        ) : null}
      </PartnerCard>

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">פרטי חשבון</h2>
        <label className="block text-sm font-black text-slate-600">
          שם פרטנר
          <PartnerInput value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-600">
            שם בעל החשבון
            <PartnerInput
              value={form.accountHolderName}
              onChange={(e) => setField("accountHolderName", e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="text-sm font-black text-slate-600">
            ת״ז
            <PartnerInput
              value={form.idNumber}
              onChange={(e) => setField("idNumber", e.target.value)}
              className="mt-1"
              inputMode="numeric"
            />
          </label>
          <label className="text-sm font-black text-slate-600">
            ח.פ / עוסק
            <PartnerInput
              value={form.taxNumber}
              onChange={(e) => setField("taxNumber", e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="text-sm font-black text-slate-600">
            טלפון
            <PartnerInput
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="mt-1"
            />
          </label>
        </div>
      </PartnerCard>

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">פרטי חשבון בנק</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-black text-slate-600">
            בנק
            <PartnerInput
              value={form.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="text-sm font-black text-slate-600">
            סניף
            <PartnerInput
              value={form.branch}
              onChange={(e) => setField("branch", e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="text-sm font-black text-slate-600">
            מספר חשבון
            <PartnerInput
              value={form.account}
              onChange={(e) => setField("account", e.target.value)}
              className="mt-1"
              inputMode="numeric"
            />
          </label>
        </div>
      </PartnerCard>

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">מסמכים</h2>
        <p className="text-sm font-bold text-slate-500">PDF, JPG או PNG עד 8MB. המסמכים מופיעים במלואם לאדמין.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {DOCUMENTS.map((item) => {
            const current = form.documents?.[item.kind];
            return (
              <label key={item.kind} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-black text-slate-900">{item.label}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-500">{item.hint}</p>
                {current?.url ? (
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-black text-violet-700"
                  >
                    {current.originalName || "מסמך הועלה"}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-bold text-amber-700">טרם הועלה</p>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="mt-3 w-full text-sm"
                  disabled={uploading === item.kind}
                  onChange={(e) => uploadDoc(item.kind, e.target.files?.[0])}
                />
                {uploading === item.kind ? (
                  <p className="mt-2 text-xs font-bold text-slate-500">מעלה...</p>
                ) : null}
              </label>
            );
          })}
        </div>
      </PartnerCard>

      <PartnerPrimaryButton type="button" disabled={saving} onClick={saveDetails}>
        {saving ? "שומר..." : "שמירת פרטים ושליחה לאדמין"}
      </PartnerPrimaryButton>
    </div>
  );
}
