import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activatePartnerClient,
  createPartnerClient,
  fetchPartnerCatalog,
  submitPartnerClient,
  updatePartnerClient,
} from "../../lib/partnerApi";
import type { ManagementMode, PartnerPriceLine } from "../../types/partner";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerClientWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [catalog, setCatalog] = useState<PartnerPriceLine[]>([]);
  const [clientId, setClientId] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [contact, setContact] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [managementMode, setManagementMode] = useState<ManagementMode>("shared");

  useEffect(() => {
    fetchPartnerCatalog()
      .then(setCatalog)
      .catch(() => setError("לא ניתן לטעון קטלוג"));
  }, []);

  const lines = useMemo(
    () =>
      Object.entries(selected).map(([sku, markupIls]) => ({ sku, markupIls })),
    [selected]
  );

  const preview = useMemo(() => {
    return lines
      .map((line) => {
        const item = catalog.find((row) => row.sku === line.sku);
        if (!item) return null;
        const wholesale = Number(item.partnerWholesalePrice || 0);
        const markup = Number(line.markupIls || 0);
        const share = Number(item.partnerMarkupShare || 0) && item.markup
          ? Number(item.partnerMarkupShare) / Number(item.markup || 1)
          : 0.75;
        const partnerShare = Math.round(markup * (item.sku ? share || 0.75 : 0.75));
        return {
          ...item,
          markup,
          customerFinalPrice: wholesale + markup,
          partnerMarkupShare: partnerShare,
          bizuplyMarkupShare: markup - partnerShare,
        };
      })
      .filter(Boolean) as Array<PartnerPriceLine & { markup: number }>;
  }, [lines, catalog]);

  const partnerCost = preview.reduce(
    (sum, item) => sum + Number(item.partnerWholesalePrice) + Number(item.bizuplyMarkupShare),
    0
  );

  async function createDraft() {
    setSaving(true);
    setError("");
    try {
      const data = await createPartnerClient({
        contact,
        lines,
        managementMode,
      });
      setClientId(data.client._id);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה ביצירת לקוח");
    } finally {
      setSaving(false);
    }
  }

  async function finish(activate: boolean) {
    if (!clientId) return;
    setSaving(true);
    setError("");
    try {
      await updatePartnerClient(clientId, { lines, managementMode });
      await submitPartnerClient(clientId);
      if (activate) {
        const data = await activatePartnerClient(clientId);
        setTempPassword(data.temporaryPassword || "");
        setStep(4);
        return;
      }
      navigate("/partner/dashboard/crm");
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black">אשף יצירת לקוח</h2>
        <p className="text-sm font-bold text-slate-500">
          יצירה → מוצרים והעמלה → הרשאות → עלות פרטנר → תשלום/הפעלה → הקמת עסק
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5">
          {["businessName", "contactName", "email", "phone"].map((key) => (
            <input
              key={key}
              value={(contact as any)[key]}
              onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
              placeholder={
                key === "businessName"
                  ? "שם העסק"
                  : key === "contactName"
                    ? "איש קשר"
                    : key === "email"
                      ? "אימייל"
                      : "טלפון"
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          ))}
          <textarea
            value={contact.notes}
            onChange={(e) => setContact({ ...contact, notes: e.target.value })}
            placeholder="הערות"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={saving}
            onClick={createDraft}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
          >
            המשך לבחירת מוצרים
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-3">
          {catalog.map((item) => {
            const checked = Object.prototype.hasOwnProperty.call(selected, item.sku);
            return (
              <label
                key={item.sku}
                className="block rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = { ...selected };
                        if (e.target.checked) next[item.sku] = 0;
                        else delete next[item.sku];
                        setSelected(next);
                      }}
                    />
                    <span className="mr-2 font-black">{item.nameHe || item.sku}</span>
                    <p className="text-xs text-slate-500">
                      Retail להשוואה: {ils(item.retailIls)} · מחיר Bizuply לפרטנר:{" "}
                      {ils(item.partnerWholesalePrice)}
                    </p>
                  </div>
                  {checked ? (
                    <input
                      type="number"
                      min={0}
                      value={selected[item.sku]}
                      onChange={(e) =>
                        setSelected({ ...selected, [item.sku]: Number(e.target.value) || 0 })
                      }
                      className="w-28 rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      placeholder="העמלה"
                    />
                  ) : null}
                </div>
              </label>
            );
          })}
          <button
            type="button"
            onClick={() => setStep(3)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
          >
            המשך לסיכום והרשאות
          </button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-bold">
            מצב ניהול
            <select
              value={managementMode}
              onChange={(e) => setManagementMode(e.target.value as ManagementMode)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              <option value="partner">הפרטנר מנהל</option>
              <option value="customer">הלקוח מנהל</option>
              <option value="shared">משותף</option>
            </select>
          </label>
          {preview.map((line) => (
            <div key={line.sku} className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-black">{line.nameHe}</p>
              <p>מחיר Bizuply לפרטנר: {ils(line.partnerWholesalePrice)}</p>
              <p>העמלה שהפרטנר מוסיף: {ils(line.markup)}</p>
              <p>המחיר הסופי ללקוח: {ils(line.customerFinalPrice)}</p>
              <p>חלק הפרטנר מהעמלה: {ils(line.partnerMarkupShare)}</p>
              <p>חלק Bizuply מהעמלה: {ils(line.bizuplyMarkupShare)}</p>
            </div>
          ))}
          <p className="text-lg font-black">עלות הפרטנר ל-Bizuply: {ils(partnerCost)}</p>
          <p className="text-xs font-bold text-slate-500">
            הלקוח משלם לך ישירות. Bizuply לא מחזיקה כספים ולא מבצעת payout ב-Phase 1.
            Paid entitlements יופעלו רק אחרי הפעלה.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => finish(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black"
            >
              שמור כממתין לתשלום
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => finish(true)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
            >
              הפעלה ורישום חוב ל-Bizuply
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="font-black">הלקוח הופעל</h3>
          {tempPassword ? (
            <p className="mt-2 text-sm">
              סיסמה זמנית: <strong>{tempPassword}</strong>
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => navigate("/partner/dashboard/crm")}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
          >
            חזרה ל-CRM
          </button>
        </section>
      ) : null}
    </div>
  );
}
