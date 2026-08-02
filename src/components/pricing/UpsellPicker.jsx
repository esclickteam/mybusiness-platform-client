import React, { useMemo } from "react";

/**
 * Multi-select catalog upsells.
 * Admin can override each selected price (ILS) — that amount is sent to Stripe.
 */
export default function UpsellPicker({
  upsells = [],
  selectedSkus = [],
  amountsBySku = {},
  onToggle,
  onAmountChange,
  allowCustomPrice = false,
  packageSku = "monthly",
  title = "אפסיילים ושירותים נוספים",
  hint = "סמנו שירותים להוספה לרכישה",
}) {
  const visibleUpsells = useMemo(() => {
    return (upsells || []).filter((item) => {
      if (!item || item.active === false) return false;
      if (packageSku === "website_only" && item.sku === "website_addon") {
        return false;
      }
      return item.kind === "upsell" || !item.kind;
    });
  }, [upsells, packageSku]);

  const selectedSet = useMemo(() => new Set(selectedSkus || []), [selectedSkus]);

  const selectedTotal = useMemo(() => {
    return visibleUpsells.reduce((sum, item) => {
      if (!selectedSet.has(item.sku)) return sum;
      const amount =
        amountsBySku?.[item.sku] != null &&
        Number.isFinite(Number(amountsBySku[item.sku]))
          ? Number(amountsBySku[item.sku])
          : Number(item.amountIls || 0);
      return sum + amount;
    }, 0);
  }, [visibleUpsells, selectedSet, amountsBySku]);

  if (!visibleUpsells.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-500">
        אין אפסיילים פעילים בקטלוג
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs font-bold text-slate-500">{hint}</p>
        </div>
        {selectedSet.size > 0 ? (
          <p className="text-xs font-black text-emerald-700">
            נבחרו {selectedSet.size} · ₪{selectedTotal.toLocaleString("he-IL")}
          </p>
        ) : null}
      </div>

      <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {visibleUpsells.map((item) => {
          const checked = selectedSet.has(item.sku);
          const amountValue =
            amountsBySku?.[item.sku] != null
              ? String(amountsBySku[item.sku])
              : String(item.amountIls ?? "");

          return (
            <div
              key={item.sku}
              className={`rounded-xl border px-3 py-3 text-sm transition ${
                checked
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => onToggle?.(item.sku)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-black text-slate-900">
                    {item.nameHe || item.sku}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold text-slate-500">
                    {item.billing === "recurring_month"
                      ? "חודשי"
                      : item.billing === "recurring_year"
                        ? "שנתי"
                        : "חד־פעמי"}{" "}
                    · קטלוג ₪{item.amountIls}
                  </span>
                  {item.descriptionHe ? (
                    <span className="mt-1 block text-[11px] font-semibold leading-4 text-slate-500">
                      {item.descriptionHe}
                    </span>
                  ) : null}
                </span>
              </label>

              {allowCustomPrice && checked ? (
                <label className="mt-2 block text-[11px] font-bold text-slate-600">
                  מחיר לתשלום (₪)
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={amountValue}
                    onChange={(event) =>
                      onAmountChange?.(item.sku, event.target.value)
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm font-black text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
