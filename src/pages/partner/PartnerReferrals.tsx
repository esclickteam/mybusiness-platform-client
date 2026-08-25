import React, { useEffect, useState } from "react";
import {
  fetchPartnerReferrals,
  partnerApiError,
  submitPartnerReferral,
} from "../../lib/partnerApi";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { formatIls } from "../../lib/partnerMoney";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
  PartnerTextarea,
} from "../../components/partner/partnerUi";

export default function PartnerReferrals() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    referredName: "",
    referredBusinessName: "",
    referredPhone: "",
    referredEmail: "",
    referredIndustry: "",
    notes: "",
  });

  function load() {
    fetchPartnerReferrals()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת הפניות")));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved("");
    try {
      await submitPartnerReferral(form);
      setForm({
        referredName: "",
        referredBusinessName: "",
        referredPhone: "",
        referredEmail: "",
        referredIndustry: "",
        notes: "",
      });
      setSaved("ההפניה נשלחה. עצם מילוי הטופס לא מזכה בעמלה.");
      load();
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן לשלוח הפניה"));
    } finally {
      setSaving(false);
    }
  }

  const qualifying = items.filter(
    (row) => row.rewardStatus === "pending" && row.qualificationStartDate
  );

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="צירוף פרטנר"
        title="צירוף פרטנר"
        subtitle="מכירים בעל עסק או נותן שירות שמתאים למסלול הפרטנרים של Bizuply?"
      />
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <PartnerCard className="space-y-3 p-6 text-sm font-bold leading-6 text-slate-600">
        <p>הפנו אותו אלינו, ואם הוא מצטרף ונשאר פרטנר פעיל מעל 40 ימים – תקבלו עמלה חד-פעמית של ₪500.</p>
        <ul className="list-disc pr-5">
          <li>התגמול חד-פעמי.</li>
          <li>הוא משולם רק לאחר שהפרטנר המצורף פעיל מעל 40 ימים.</li>
          <li>עצם מילוי הטופס לא מזכה בעמלה.</li>
          <li>ההצטרפות כפופה לאישור Bizuply.</li>
          <li>אין עמלה אם ההצטרפות בוטלה/הושעתה לפני מועד הזכאות.</li>
        </ul>
      </PartnerCard>

      {qualifying.length ? (
        <PartnerCard className="space-y-3 border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-800">
            מעקב 40 יום – ₪500
          </p>
          <ul className="space-y-2">
            {qualifying.map((row) => (
              <li key={row._id} className="text-sm font-black text-slate-800">
                {row.referredName || "פרטנר שהופנה"} — יום {row.daysActive ?? 0} מתוך{" "}
                {row.qualificationDays || 40}
              </li>
            ))}
          </ul>
        </PartnerCard>
      ) : null}

      <PartnerCard className="overflow-x-auto">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-lg font-black">מעקב הפניות</h2>
          <p className="text-xs font-bold text-slate-500">סטטוס 40 ימי הפעילות והתגמול החד-פעמי.</p>
        </div>
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">פרטנר שהופנה</th>
              <th className="px-3 py-3">תאריך</th>
              <th className="px-3 py-3">סטטוס</th>
              <th className="px-3 py-3">תגמול</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="px-3 py-3 font-bold">
                  {row.referredName}
                  <span className="block text-xs text-slate-500">{row.referredBusinessName}</span>
                </td>
                <td className="px-3 py-3">
                  {row.createdAt ? new Date(row.createdAt).toLocaleDateString("he-IL") : "—"}
                </td>
                <td className="px-3 py-3">
                  {partnerStatusLabel(row.status)}
                  {row.qualificationStartDate && row.rewardStatus === "pending" ? (
                    <span className="block text-xs text-slate-500">
                      פעיל – יום {row.daysActive} מתוך {row.qualificationDays || 40}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  {row.rewardStatus === "cancelled" || row.status === "rejected"
                    ? "—"
                    : row.rewardStatus === "eligible" || row.rewardStatus === "approved" || row.rewardStatus === "paid"
                      ? formatIls(row.rewardAmount || 500)
                      : "ממתינה לזכאות"}
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                  אין הפניות עדיין
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PartnerCard>

      <form onSubmit={submit}>
        <PartnerCard className="space-y-4 p-6">
          <h2 className="text-lg font-black">טופס צירוף</h2>
          {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-black">
              שם מלא
              <PartnerInput
                required
                className="mt-1"
                value={form.referredName}
                onChange={(e) => setForm({ ...form, referredName: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              שם העסק
              <PartnerInput
                required
                className="mt-1"
                value={form.referredBusinessName}
                onChange={(e) => setForm({ ...form, referredBusinessName: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              טלפון
              <PartnerInput
                className="mt-1"
                value={form.referredPhone}
                onChange={(e) => setForm({ ...form, referredPhone: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              אימייל
              <PartnerInput
                required
                type="email"
                className="mt-1"
                value={form.referredEmail}
                onChange={(e) => setForm({ ...form, referredEmail: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-sm font-black">
            תחום פעילות
            <PartnerInput
              className="mt-1"
              value={form.referredIndustry}
              onChange={(e) => setForm({ ...form, referredIndustry: e.target.value })}
            />
          </label>
          <label className="block text-sm font-black">
            הערה (אופציונלי)
            <PartnerTextarea
              className="mt-1"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <PartnerPrimaryButton type="submit" disabled={saving}>
            {saving ? "שולח..." : "שליחת הפניה"}
          </PartnerPrimaryButton>
        </PartnerCard>
      </form>
    </div>
  );
}
