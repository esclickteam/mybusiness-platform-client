import React, { useEffect, useState } from "react";
import { fetchPartnerPricebook, updatePricebookItem } from "../../lib/partnerApi";
import { formatIls, quotePreviewLine } from "../../lib/partnerMoney";
import type { PartnerPriceLine } from "../../types/partner";
import PartnerMarkupBreakdown from "../../components/partner/PartnerMarkupBreakdown";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";

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
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="תמחור"
        title="מחירון פרטנר"
        subtitle="אפשר לערוך את העמלה הנוספת ואת ההצגה בעמוד המכירה. המחיר הסופי ללקוח = מחיר סיטונאי + תוספת. הלקוח רואה רק את המחיר הסופי."
      />
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <div className="space-y-4">
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
  const quoted = quotePreviewLine({ ...item, markup });

  return (
    <article className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{item.nameHe || item.sku}</h3>
          <p className="text-xs font-bold text-slate-400">{item.sku}</p>
          <p className="mt-2 text-sm font-black text-slate-900">
            מחיר סופי ללקוח: {formatIls(quoted.customerFinalPrice)}
          </p>
          {item.category === "human_service" ? (
            <p className="mt-1 text-xs font-black text-amber-700">
              שירות אנושי – אינו מפעיל מודול אוטומטית.
            </p>
          ) : null}
        </div>
        <label className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm font-bold">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="accent-violet-700"
          />
          הצג בעמוד המכירה
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr]">
        <label className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm font-black text-violet-900">
          עמלה נוספת
          <input
            type="number"
            min={0}
            value={markup}
            onChange={(e) => setMarkup(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-lg font-black text-slate-900"
          />
          <span className="mt-2 block text-[11px] font-bold text-violet-700">
            התוספת מעל {formatIls(item.partnerWholesalePrice)}
          </span>
        </label>
        <PartnerMarkupBreakdown
          showTitle={false}
          compact
          line={{ ...item, ...quoted, markup }}
        />
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(item, markup, enabled)}
        className="mt-4 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"
      >
        {saving ? "שומר..." : "שמירת עמלה נוספת"}
      </button>
    </article>
  );
}
