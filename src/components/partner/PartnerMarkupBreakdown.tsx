import React from "react";
import { formatIls, formatPct, quotePreviewLine } from "../../lib/partnerMoney";

export type MarkupLineInput = {
  sku?: string;
  nameHe?: string;
  nameEn?: string;
  partnerWholesalePrice?: number;
  markup?: number;
  markupIls?: number;
  customerFinalPrice?: number;
  partnerMarkupShare?: number;
  bizuplyMarkupShare?: number;
  partnerShareRate?: number;
  bizuplyShareRate?: number;
  retailPrice?: number;
  retailIls?: number;
  category?: string;
  partnerCostToBizuply?: number;
};

type Props = {
  line: MarkupLineInput;
  compact?: boolean;
  showTitle?: boolean;
};

export default function PartnerMarkupBreakdown({
  line,
  compact = false,
  showTitle = true,
}: Props) {
  const preview = quotePreviewLine(line);
  const partnerShare = Number(line.partnerMarkupShare ?? preview.partnerMarkupShare);
  const bizuplyShare = Number(line.bizuplyMarkupShare ?? preview.bizuplyMarkupShare);
  const partnerRate = Number(line.partnerShareRate ?? preview.partnerShareRate);
  const bizuplyRate = Number(line.bizuplyShareRate ?? preview.bizuplyShareRate);
  const wholesale = Number(line.partnerWholesalePrice ?? preview.wholesale);
  const markup = Number(line.markup ?? line.markupIls ?? preview.markup);
  const finalPrice = Number(line.customerFinalPrice ?? preview.customerFinalPrice);
  const partnerCost = Number(line.partnerCostToBizuply ?? preview.partnerCostToBizuply);
  const partnerBar = markup > 0 ? Math.max(8, Math.round(partnerRate * 100)) : 0;
  const bizuplyBar = markup > 0 ? 100 - partnerBar : 0;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {showTitle && (line.nameHe || line.nameEn || line.sku) ? (
        <div>
          <h3 className="text-base font-black text-slate-900">
            {line.nameHe || line.nameEn || line.sku}
          </h3>
          {line.sku ? (
            <p className="text-[11px] font-bold tracking-wide text-slate-400">{line.sku}</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3">
        <Metric
          label="מחיר Bizuply לפרטנר"
          value={formatIls(wholesale)}
          hint="עלות סיטונאית לפי המסלול"
        />
        <Metric
          label="עמלה נוספת"
          value={formatIls(markup)}
          hint="התוספת שאתם מוסיפים למחיר הלקוח"
          accent
        />
        <Metric
          label="מחיר סופי ללקוח"
          value={formatIls(finalPrice)}
          hint="סיטונאות + עמלה נוספת"
          strong
        />
      </div>

      <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-[#f7f3ff] via-white to-[#eef6ff] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-black text-violet-800">פיצול העמלה הנוספת</p>
          <p className="text-[11px] font-bold text-slate-500">
            {markup > 0
              ? `${formatPct(partnerRate)} לפרטנר · ${formatPct(bizuplyRate)} ל-Bizuply`
              : "אין עמלה נוספת על המוצר הזה"}
          </p>
        </div>
        <div className="mb-3 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
          {markup > 0 ? (
            <>
              <span className="bg-[#6D28D9]" style={{ width: `${partnerBar}%` }} />
              <span className="bg-[#0F766E]" style={{ width: `${bizuplyBar}%` }} />
            </>
          ) : (
            <span className="w-full bg-slate-200" />
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SplitRow
            tone="partner"
            title="נשאר לפרטנר"
            percent={formatPct(partnerRate)}
            amount={formatIls(partnerShare)}
            detail="החלק שלכם מהעמלה הנוספת"
          />
          <SplitRow
            tone="bizuply"
            title="חלק Bizuply"
            percent={formatPct(bizuplyRate)}
            amount={formatIls(bizuplyShare)}
            detail="הסכום מתוך העמלה הנוספת שעובר ל-Bizuply"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
        <span className="font-bold text-slate-500">עלות הפרטנר ל-Bizuply למוצר זה</span>
        <span className="font-black text-slate-900">{formatIls(partnerCost)}</span>
      </div>
      {line.retailPrice || line.retailIls ? (
        <p className="text-[11px] font-bold text-slate-400">
          מחיר רגיל להשוואה בלבד: {formatIls(line.retailPrice ?? line.retailIls)} — לא נכנס לחישוב
        </p>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  accent,
  strong,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3",
        accent
          ? "border-violet-200 bg-violet-50"
          : strong
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <p className={["text-[11px] font-black", strong ? "text-white/70" : "text-slate-500"].join(" ")}>
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
      <p className={["mt-1 text-[11px] font-bold", strong ? "text-white/55" : "text-slate-400"].join(" ")}>
        {hint}
      </p>
    </div>
  );
}

function SplitRow({
  tone,
  title,
  percent,
  amount,
  detail,
}: {
  tone: "partner" | "bizuply";
  title: string;
  percent: string;
  amount: string;
  detail: string;
}) {
  const partner = tone === "partner";
  return (
    <div className="rounded-xl bg-white/80 px-3 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-black text-slate-800">
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              partner ? "bg-[#6D28D9]" : "bg-[#0F766E]",
            ].join(" ")}
          />
          {title}
        </span>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[11px] font-black",
            partner ? "bg-violet-100 text-violet-800" : "bg-teal-100 text-teal-800",
          ].join(" ")}
        >
          {percent}
        </span>
      </div>
      <p className="mt-2 text-xl font-black text-slate-900">{amount}</p>
      <p className="text-[11px] font-bold text-slate-500">{detail}</p>
    </div>
  );
}
