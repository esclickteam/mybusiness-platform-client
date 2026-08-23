import React, { useMemo, useState } from "react";
import { Check, Minus, Plus, Search, X } from "lucide-react";
import { formatIls } from "../../lib/partnerMoney";
import { billingLabel, computeDealPreview, isMainPackageSku } from "../../lib/partnerDealMath";
import type { PartnerPriceLine, PartnerWizardCatalog } from "../../types/partner";

const BILLING_FILTERS = [
  { id: "all", label: "הכול" },
  { id: "recurring_month", label: "חודשי" },
  { id: "recurring_year", label: "שנתי" },
  { id: "one_time", label: "חד-פעמי" },
];

type Props = {
  items: PartnerPriceLine[];
  wizard: PartnerWizardCatalog;
  selectedSkus: string[];
  onChange: (skus: string[]) => void;
  additionalMarkup: number;
  partnerShareRate: number;
  onContinue?: () => void;
  continueLabel?: string;
  mode?: "all" | "packages" | "addons";
};

function hasWebsite(skus: string[]) {
  return skus.some(
    (sku) =>
      sku === "website_addon" ||
      sku === "website_only" ||
      sku === "expert_website_build_1490_ils"
  );
}

export default function PartnerCatalogPicker({
  items,
  wizard,
  selectedSkus,
  onChange,
  additionalMarkup,
  partnerShareRate,
  onContinue,
  continueLabel = "המשך לסיכום העסקה",
  mode = "all",
}: Props) {
  const [query, setQuery] = useState("");
  const [billingFilter, setBillingFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selected = new Set(selectedSkus);
  const packageSku = selectedSkus.find((sku) => isMainPackageSku(sku)) || "";
  const covered = wizard.coveredByPackage?.[packageSku] || [];
  const preview = computeDealPreview(items, selectedSkus, additionalMarkup, partnerShareRate);

  const businessGroup = (wizard.packages || []).filter(
    (item) => item.packageGroup === "bizuply_business"
  );
  const otherPackages = (wizard.packages || []).filter(
    (item) => item.packageGroup !== "bizuply_business"
  );

  function toggleSku(sku: string, exclusiveGroup?: string[]) {
    if (selected.has(sku)) {
      onChange(selectedSkus.filter((item) => item !== sku));
      return;
    }
    let next = selectedSkus;
    if (exclusiveGroup?.length) {
      next = next.filter((item) => !exclusiveGroup.includes(item));
    }
    if (isMainPackageSku(sku)) {
      next = next.filter((item) => !isMainPackageSku(item));
    }
    onChange([...next, sku]);
  }

  function isCovered(sku: string) {
    return covered.includes(sku);
  }

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (wizard.categories || [])
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          if (billingFilter !== "all" && item.billing !== billingFilter) return false;
          if (!q) return true;
          const hay = `${item.displayNameHe || ""} ${item.nameHe || ""} ${item.taglineHe || ""}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((category) => category.items.length);
  }, [wizard.categories, query, billingFilter]);

  const summary = (
    <DealStickySummary
      packageSku={packageSku}
      items={items}
      selectedSkus={selectedSkus}
      preview={preview}
      onContinue={onContinue}
      continueLabel={continueLabel}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        {mode !== "addons" ? (
        <section>
          <h3 className="mb-1 text-xl font-black">חבילה ראשית</h3>
          <p className="mb-4 text-sm font-bold text-slate-500">
            בחרו חבילה אחת. חיוב חודשי ושנתי מוצגים כאותה חבילה.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {businessGroup.length ? (
              <PackageCard
                items={businessGroup}
                selectedSku={packageSku}
                onSelect={(sku) =>
                  toggleSku(
                    sku,
                    wizard.packages.map((item) => item.sku)
                  )
                }
              />
            ) : null}
            {otherPackages.map((item) => (
              <PackageCard
                key={item.sku}
                items={[item]}
                selectedSku={packageSku}
                onSelect={(sku) =>
                  toggleSku(
                    sku,
                    wizard.packages.map((row) => row.sku)
                  )
                }
              />
            ))}
          </div>
        </section>
        ) : null}

        {mode !== "packages" ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-black">שירותים ותוספות</h3>
            <p className="text-sm font-bold text-slate-500">
              מוסיפים רק מה שלא כלול בחבילה. המחיר בכרטיס הוא מחיר Bizuply עבורכם לפני עמלה נוספת.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש שירות או תוסף"
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-sm font-bold outline-none focus:border-violet-400"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {BILLING_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBillingFilter(item.id)}
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-black",
                    billingFilter === item.id
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-[0.14em] text-violet-700">
                {category.labelHe}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.items.map((item) => {
                  const included = isCovered(item.sku);
                  const added = selected.has(item.sku);
                  const missingWebsite =
                    Boolean(item.websiteRequired) && !hasWebsite(selectedSkus) && !included;
                  return (
                    <article
                      key={item.sku}
                      className={[
                        "rounded-3xl border bg-white p-4 shadow-sm",
                        added ? "border-violet-300 ring-2 ring-violet-100" : "border-slate-200",
                        included ? "opacity-80" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="font-black text-slate-900">
                            {item.displayNameHe || item.nameHe}
                          </h5>
                          <p className="mt-1 text-sm font-bold leading-5 text-slate-500">
                            {item.taglineHe || item.descriptionHe || billingLabel(item.billing)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
                          {billingLabel(item.billing)}
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-black">{formatIls(item.partnerWholesalePrice)}</p>
                      {included ? (
                        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                          כלול בחבילה
                        </p>
                      ) : missingWebsite ? (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-bold text-amber-700">
                            נדרש אתר כדי להפעיל תוסף זה
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleSku("website_addon")}
                            className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800"
                          >
                            הוספת אתר
                          </button>
                        </div>
                      ) : added ? (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-sm font-black text-emerald-700">
                            <Check className="h-4 w-4" />
                            נוסף לעסקה
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSku(item.sku)}
                            className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600"
                          >
                            הסרה
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleSku(item.sku)}
                          className="mt-3 inline-flex items-center gap-1 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white"
                        >
                          <Plus className="h-4 w-4" />
                          הוספה
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
        ) : null}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-6">{summary}</div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
        >
          <span>
            סיכום · {selectedSkus.length} פריטים · {formatIls(preview.totals.customerNow)}
          </span>
          <span>פתיחה</span>
        </button>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="סגירה"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-black">סיכום העסקה</h4>
              <button type="button" onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {summary}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PackageCard({
  items,
  selectedSku,
  onSelect,
}: {
  items: PartnerPriceLine[];
  selectedSku: string;
  onSelect: (sku: string) => void;
}) {
  const [intervalSku, setIntervalSku] = useState(
    items.find((item) => item.sku === selectedSku)?.sku || items[0]?.sku || ""
  );
  const current = items.find((item) => item.sku === intervalSku) || items[0];
  if (!current) return null;
  const selected = items.some((item) => item.sku === selectedSku);
  return (
    <article
      className={[
        "rounded-[28px] border bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]",
        selected ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200",
      ].join(" ")}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {current.packageInterval === "month" || current.packageInterval === "year" ? (
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-black text-violet-700">
            חבילה עסקית
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
            חבילה ייעודית
          </span>
        )}
      </div>
      <h4 className="text-2xl font-black">{current.displayNameHe || current.nameHe}</h4>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{current.taglineHe}</p>
      {items.length > 1 ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {items.map((item) => (
            <button
              key={item.sku}
              type="button"
              onClick={() => setIntervalSku(item.sku)}
              className={[
                "rounded-2xl px-3 py-2 text-sm font-black",
                intervalSku === item.sku
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-600",
              ].join(" ")}
            >
              {item.packageInterval === "year" ? "שנתי" : "חודשי"}
              <span className="mt-1 block text-xs opacity-80">
                {formatIls(item.partnerWholesalePrice)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm font-black text-slate-500">{billingLabel(current.billing)}</p>
      )}
      <ul className="mt-4 space-y-1.5 text-sm font-bold text-slate-600">
        {(current.includedHe || []).map((row) => (
          <li key={row} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            {row}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-3xl font-black">{formatIls(current.partnerWholesalePrice)}</p>
      <button
        type="button"
        onClick={() => onSelect(current.sku)}
        className={[
          "mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black",
          selected && selectedSku === current.sku
            ? "bg-emerald-600 text-white"
            : "bg-slate-900 text-white",
        ].join(" ")}
      >
        {selected && selectedSku === current.sku ? "נבחרה" : "בחר חבילה"}
      </button>
    </article>
  );
}

function DealStickySummary({
  packageSku,
  items,
  selectedSkus,
  preview,
  onContinue,
  continueLabel,
}: {
  packageSku: string;
  items: PartnerPriceLine[];
  selectedSkus: string[];
  preview: ReturnType<typeof computeDealPreview>;
  onContinue?: () => void;
  continueLabel: string;
}) {
  const pkg = items.find((item) => item.sku === packageSku);
  const addons = selectedSkus
    .filter((sku) => sku !== packageSku)
    .map((sku) => items.find((item) => item.sku === sku))
    .filter(Boolean) as PartnerPriceLine[];
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <h4 className="text-lg font-black">סיכום העסקה</h4>
      <p className="mt-3 text-sm font-bold text-slate-500">חבילה</p>
      <p className="font-black">{pkg?.displayNameHe || pkg?.nameHe || "לא נבחרה"}</p>
      {addons.length ? (
        <>
          <p className="mt-3 text-sm font-bold text-slate-500">תוספות</p>
          <ul className="space-y-1 text-sm font-black text-slate-800">
            {addons.map((item) => (
              <li key={item.sku}>{item.displayNameHe || item.nameHe}</li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm font-black">
        <Row label="חד-פעמי" value={formatIls(preview.totals.oneTime)} />
        <Row label="חודשי" value={formatIls(preview.totals.monthly)} />
        {preview.totals.annual ? (
          <Row label="שנתי" value={formatIls(preview.totals.annual)} />
        ) : null}
        <Row label="מחיר סופי ללקוח כעת" value={formatIls(preview.totals.customerNow)} strong />
      </div>
      {onContinue ? (
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full rounded-2xl bg-violet-700 px-4 py-3 text-sm font-black text-white"
        >
          {continueLabel}
        </button>
      ) : null}
    </section>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? "text-lg text-slate-900" : "text-slate-900"}>{value}</span>
    </div>
  );
}

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-2 py-1">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-black">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
