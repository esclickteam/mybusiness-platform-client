import React, { useEffect, useState } from "react";
import { fetchPartnerPricebook, updatePricebookItem } from "../../lib/partnerApi";
import type { PartnerPriceLine } from "../../types/partner";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerPricing() {
  const [items, setItems] = useState<PartnerPriceLine[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string>("");

  useEffect(() => {
    fetchPartnerPricebook()
      .then(setItems)
      .catch((err) => setError(err.response?.data?.error || "שגיאה בטעינת מחירון"));
  }, []);

  async function save(item: PartnerPriceLine, markupIls: number, enabled: boolean) {
    setSaving(item.sku);
    setError("");
    try {
      const updated = await updatePricebookItem(item.sku, {
        markupIls,
        enabledInStorefront: enabled,
      });
      setItems((prev) => prev.map((row) => (row.sku === item.sku ? { ...row, ...updated } : row)));
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה בשמירה");
    } finally {
      setSaving("");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black">מחירון פרטנר</h2>
        <p className="text-sm font-bold text-slate-500">
          אפשר לערוך רק העמלה והצגה בחנות. מחיר סיטונאי מחושב בשרת לפי המסלול.
        </p>
      </div>
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <div className="space-y-3">
        {items.map((item) => (
          <PriceRow key={item.sku} item={item} saving={saving === item.sku} onSave={save} />
        ))}
      </div>
    </div>
  );
}

function PriceRow({
  item,
  saving,
  onSave,
}: {
  item: PartnerPriceLine;
  saving: boolean;
  onSave: (item: PartnerPriceLine, markupIls: number, enabled: boolean) => void;
}) {
  const [markup, setMarkup] = useState(Number(item.markup || item.markupIls || 0));
  const [enabled, setEnabled] = useState(Boolean(item.enabledInStorefront));
  const wholesale = Number(item.partnerWholesalePrice || 0);
  const finalPrice = wholesale + Number(markup || 0);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{item.nameHe || item.sku}</h3>
          <p className="text-xs font-bold text-slate-500">{item.sku}</p>
        </div>
        <label className="text-sm font-bold">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          הצג בחנות
        </label>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <p>Retail להשוואה: {ils(item.retailIls || item.retailPrice)}</p>
        <p>מחיר Bizuply לפרטנר: {ils(wholesale)}</p>
        <label>
          העמלה שהפרטנר מוסיף
          <input
            type="number"
            min={0}
            value={markup}
            onChange={(e) => setMarkup(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1"
          />
        </label>
        <p className="font-black">המחיר הסופי ללקוח: {ils(finalPrice)}</p>
        <p>חלק הפרטנר מהעמלה: {ils(item.partnerMarkupShare)}</p>
        <p>חלק Bizuply מהעמלה: {ils(item.bizuplyMarkupShare)}</p>
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(item, markup, enabled)}
        className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
      >
        שמור
      </button>
    </article>
  );
}
