import React, { useEffect, useState } from "react";
import {
  fetchPartnerWithdrawals,
  partnerApiError,
  submitPartnerWithdrawal,
} from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";

const STATUS_HE: Record<string, string> = {
  submitted: "נשלחה",
  under_review: "בבדיקה",
  approved: "מאושרת",
  rejected: "נדחתה",
  paid: "שולמה",
  cancelled: "בוטלה",
};

export default function PartnerWithdrawals() {
  const [items, setItems] = useState<any[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [cycle, setCycle] = useState<any>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptAmount, setReceiptAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const data = await fetchPartnerWithdrawals();
    setItems(data.items || []);
    setBalances(data.balances);
    setCycle(data.cycle);
    if (!amount && data.balances?.eligible) setAmount(String(data.balances.eligible));
  }

  useEffect(() => {
    refresh().catch((err) => setError(partnerApiError(err, "שגיאה בטעינת משיכות")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    if (!file) {
      setError("יש לצרף קבלה");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      form.append("amount", amount);
      form.append("receiptNumber", receiptNumber);
      form.append("receiptAmount", receiptAmount || amount);
      form.append("receipt", file);
      await submitPartnerWithdrawal(form);
      setFile(null);
      setReceiptNumber("");
      await refresh();
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן לשלוח בקשה"));
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = Boolean(file && receiptNumber.trim() && Number(amount) > 0);

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="משיכת עמלות"
        title="בקשת משיכה"
        subtitle="ניתן לשלוח בקשת משיכה עד ה-20 לכל חודש. העמלה תיכנס עד ה-1 לכל חודש. כל בקשה לאחר ה-20 תיכנס לחודש העוקב."
      />
      {cycle?.copy ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-800">
          {cycle.copy}
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-3">
        <Kpi label="בקשות עד" value="ה-20 בחודש" />
        <Kpi label="העמלה נכנסת עד" value="ה-1 בחודש" />
        <Kpi label="אחרי ה-20" value="עובר לחודש הבא" />
      </section>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="יתרה זמינה למשיכה" value={formatIls(balances?.eligible)} />
        <Kpi label="עמלה ממתינה" value={formatIls(balances?.pending)} />
        <Kpi label="בבקשות משיכה" value={formatIls(balances?.requested)} />
        <Kpi label="שולמה" value={formatIls(balances?.paid)} />
      </section>

      <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h3 className="mb-4 font-black">בקשת משיכה</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-black">
            סכום
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            מספר קבלה
            <input
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            סכום בקבלה
            <input
              type="number"
              value={receiptAmount}
              onChange={(e) => setReceiptAmount(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            קבלה (PDF / JPG / PNG)
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!canSubmit || saving}
          onClick={submit}
          className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
        >
          {saving ? "שולח..." : "בקשת משיכה"}
        </button>
      </section>

      <section className="overflow-x-auto rounded-[16px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">מספר בקשה</th>
              <th className="px-3 py-3">תאריך</th>
              <th className="px-3 py-3">סכום</th>
              <th className="px-3 py-3">קבלה</th>
              <th className="px-3 py-3">תשלום צפוי</th>
              <th className="px-3 py-3">סטטוס</th>
              <th className="px-3 py-3">משוב</th>
              <th className="px-3 py-3">תאריך תשלום</th>
              <th className="px-3 py-3">אסמכתא</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="px-3 py-3 font-black">{row.requestNumber}</td>
                <td className="px-3 py-3">
                  {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString("he-IL") : "—"}
                </td>
                <td className="px-3 py-3">{formatIls(row.amount)}</td>
                <td className="px-3 py-3">{row.receiptNumber}</td>
                <td className="px-3 py-3">
                  {row.expectedPaymentBy
                    ? new Date(row.expectedPaymentBy).toLocaleDateString("he-IL")
                    : "—"}
                </td>
                <td className="px-3 py-3">{STATUS_HE[row.status] || row.status}</td>
                <td className="px-3 py-3">{row.adminFeedback || "—"}</td>
                <td className="px-3 py-3">
                  {row.paidAt ? new Date(row.paidAt).toLocaleDateString("he-IL") : "—"}
                </td>
                <td className="px-3 py-3">{row.paymentReference || "—"}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center font-bold text-slate-400">
                  אין עדיין בקשות משיכה
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
