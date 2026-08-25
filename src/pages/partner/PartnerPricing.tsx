import React, { useEffect, useState } from "react";
import { fetchPartnerPricebook, updatePricebookItem } from "../../lib/partnerApi";
import { formatIls, quotePreviewComponents, recurringIntervalLabel, catalogBillingLabel, skuAllowsRecurringMarkup } from "../../lib/partnerMoney";
import type { PartnerPriceLine } from "../../types/partner";
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

  async function save(
    item: PartnerPriceLine,
    payload: {
      oneTimeMarkupEnabled: boolean;
      oneTimeMarkupAmount: number;
      recurringMarkupEnabled: boolean;
      recurringMarkupAmount: number;
      enabled: boolean;
    }
  ) {
    setSaving(item.sku);
    setError("");
    try {
      const body: {
        oneTimeMarkupEnabled: boolean;
        oneTimeMarkupAmount: number;
        recurringMarkupEnabled?: boolean;
        recurringMarkupAmount?: number;
        enabledInStorefront: boolean;
      } = {
        oneTimeMarkupEnabled: payload.oneTimeMarkupEnabled,
        oneTimeMarkupAmount: payload.oneTimeMarkupAmount,
        enabledInStorefront: payload.enabled,
      };
      if (skuAllowsRecurringMarkup(item.billing)) {
        body.recurringMarkupEnabled = payload.recurringMarkupEnabled;
        body.recurringMarkupAmount = payload.recurringMarkupAmount;
      }
      const updated = await updatePricebookItem(item.sku, body);
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
        eyebrow="מוצרים וחבילות"
        title="מוצרים וחבילות"
        subtitle="מחיר Bizuply לקריאה בלבד. עמלה מתחדשת אפשרית רק על מוצר עם חיוב מתחדש, באותו מחזור של המוצר."
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
        {!items.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-400">
            אין כרגע מוצרים פעילים למכירת פרטנר.
          </p>
        ) : null}
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
  onSave: (
    item: PartnerPriceLine,
    payload: {
      oneTimeMarkupEnabled: boolean;
      oneTimeMarkupAmount: number;
      recurringMarkupEnabled: boolean;
      recurringMarkupAmount: number;
      enabled: boolean;
    }
  ) => void;
}) {
  const [oneTimeEnabled, setOneTimeEnabled] = useState(Boolean(item.oneTimeMarkupEnabled));
  const [oneTimeAmount, setOneTimeAmount] = useState(Number(item.oneTimeMarkupAmount || 0));
  const [recurringEnabled, setRecurringEnabled] = useState(Boolean(item.recurringMarkupEnabled));
  const [recurringAmount, setRecurringAmount] = useState(Number(item.recurringMarkupAmount || 0));
  const [enabled, setEnabled] = useState(Boolean(item.enabledInStorefront));
  const quoted = quotePreviewComponents({
    ...item,
    oneTimeMarkupEnabled: oneTimeEnabled,
    oneTimeMarkupAmount: oneTimeAmount,
    recurringMarkupEnabled: recurringEnabled,
    recurringMarkupAmount: recurringAmount,
  });
  const intervalLabel = recurringIntervalLabel(item.billing);
  const allowsRecurring = skuAllowsRecurringMarkup(item.billing);
  const bizuplyAmount =
    item.billing === "one_time"
      ? Number(item.amountIls ?? quoted.oneTimeBase) || 0
      : Number(item.amountIls ?? quoted.recurringBase) || 0;
  const recurringToggleLabel =
    item.billing === "recurring_year" ? "הוסף עמלה שנתית מתחדשת" : "הוסף עמלה חודשית מתחדשת";
  const recurringAmountLabel =
    item.billing === "recurring_year" ? "עמלה שנתית: ₪" : "עמלה חודשית: ₪";

  return (
    <article className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{item.nameHe || item.sku}</h3>
          {item.descriptionHe ? (
            <p className="mt-1 max-w-2xl text-sm font-bold text-slate-500">{item.descriptionHe}</p>
          ) : null}
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
          הצג בעמוד האישי
        </label>
      </div>

      <p className="mt-4 text-sm font-black text-slate-800">
        מחיר Bizuply: {formatIls(bizuplyAmount)} {catalogBillingLabel(item.billing)}
      </p>

      <div className={`mt-4 grid gap-4 ${allowsRecurring ? "md:grid-cols-2" : ""}`}>
        <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <label className="flex items-center gap-2 text-sm font-black text-violet-900">
            <input
              type="checkbox"
              checked={oneTimeEnabled}
              onChange={(e) => setOneTimeEnabled(e.target.checked)}
              className="accent-violet-700"
            />
            הוסף עמלה חד-פעמית
          </label>
          {oneTimeEnabled ? (
            <label className="mt-3 block text-sm font-black text-violet-900">
              סכום העמלה: ₪
              <input
                type="number"
                min={0}
                value={oneTimeAmount}
                onChange={(e) => setOneTimeAmount(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-lg font-black text-slate-900"
              />
            </label>
          ) : null}
          <dl className="mt-3 space-y-1 text-sm font-bold text-slate-700">
            <div className="flex justify-between gap-3">
              <dt>מחיר בסיס</dt>
              <dd>{formatIls(quoted.oneTimeBase)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>העמלה שלך</dt>
              <dd>{formatIls(quoted.oneTimeMarkup)}</dd>
            </div>
            <div className="flex justify-between gap-3 font-black text-slate-900">
              <dt>מחיר ללקוח</dt>
              <dd>{formatIls(quoted.customerOneTimeAmount)}</dd>
            </div>
          </dl>
        </section>

        {allowsRecurring ? (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <label className="flex items-center gap-2 text-sm font-black text-sky-900">
            <input
              type="checkbox"
              checked={recurringEnabled}
              onChange={(e) => setRecurringEnabled(e.target.checked)}
              className="accent-sky-700"
            />
            {recurringToggleLabel}
          </label>
          {recurringEnabled ? (
            <label className="mt-3 block text-sm font-black text-sky-900">
              {recurringAmountLabel}
              <input
                type="number"
                min={0}
                value={recurringAmount}
                onChange={(e) => setRecurringAmount(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-lg font-black text-slate-900"
              />
              <span className="mt-1 block text-[11px] font-bold text-sky-700">{intervalLabel}</span>
            </label>
          ) : null}
          <dl className="mt-3 space-y-1 text-sm font-bold text-slate-700">
            <div className="flex justify-between gap-3">
              <dt>מחיר בסיס</dt>
              <dd>
                {formatIls(quoted.recurringBase)} {intervalLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>העמלה שלך</dt>
              <dd>
                {formatIls(quoted.recurringMarkup)} {intervalLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-3 font-black text-slate-900">
              <dt>מחיר ללקוח</dt>
              <dd>
                {formatIls(quoted.customerRecurringAmount)} {intervalLabel}
              </dd>
            </div>
          </dl>
        </section>
        ) : null}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() =>
          onSave(item, {
            oneTimeMarkupEnabled: oneTimeEnabled,
            oneTimeMarkupAmount: oneTimeAmount,
            recurringMarkupEnabled: allowsRecurring ? recurringEnabled : false,
            recurringMarkupAmount: allowsRecurring ? recurringAmount : 0,
            enabled,
          })
        }
        className="mt-4 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"
      >
        {saving ? "שומר..." : "שמירת עמלות"}
      </button>
    </article>
  );
}
