import React, { useEffect } from "react";
import { HelpCircle, Sparkles, X } from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import { btnPrimary } from "./siteManagementUi";

type SitePluginHelpModalProps = {
  plugin: SitePluginDefinition | null;
  open: boolean;
  onClose: () => void;
};

function formatPrice(plugin: SitePluginDefinition) {
  if (plugin.futurePriceLabel) return plugin.futurePriceLabel;
  if (plugin.priceLabel) return plugin.priceLabel;
  if (plugin.priceMonthly == null) return "כלול בחבילה";
  if (plugin.priceMax && plugin.priceMax > (plugin.priceMonthly || 0)) {
    return `₪${plugin.priceMonthly}–${plugin.priceMax}/חודש`;
  }
  return `₪${plugin.priceMonthly}/חודש`;
}

export default function SitePluginHelpModal({
  plugin,
  open,
  onClose,
}: SitePluginHelpModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !plugin) return null;

  const Icon = getPluginIcon(plugin.key);
  const accent = getPluginAccent(plugin.key, plugin.accent);
  const examples = plugin.helpExamples?.length
    ? plugin.helpExamples
    : [];
  const helpText =
    plugin.helpText ||
    plugin.description ||
    "תוסף זה מרחיב את יכולות האתר. לאחר ההתקנה ניתן להגדיר אותו בפאנל הניהול.";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plugin-help-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-violet-100/80 bg-white shadow-[0_20px_60px_rgba(99,102,241,0.18)]"
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
          }}
        />

        <div className="p-5">
          <div className="flex items-start gap-3">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
              }}
            >
              <Icon size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                    מה זה אומר?
                  </p>
                  <h3
                    id="plugin-help-title"
                    className="mt-0.5 text-lg font-bold text-slate-900"
                  >
                    {plugin.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200/80 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  aria-label="סגירה"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700">{helpText}</p>

          {examples.length > 0 ? (
            <div className="mt-4 rounded-lg border border-violet-100/70 bg-violet-50/40 px-4 py-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                <Sparkles size={13} />
                לדוגמה
              </p>
              <ul className="space-y-1.5">
                {examples.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <HelpCircle size={14} />
              מחיר עתידי
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {plugin.displayPriceLabel?.includes("חינם")
                ? `${plugin.displayPriceLabel} · ${formatPrice(plugin)}`
                : formatPrice(plugin)}
            </span>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            בשלב הבנייה ההתקנה חינמית. לאחר ההתקנה — הגדרות בפאנל הניהול והוספה
            לעמודים דרך עורך האתר.
          </p>

          <button type="button" onClick={onClose} className={`mt-4 w-full ${btnPrimary}`}>
            הבנתי
          </button>
        </div>
      </div>
    </div>
  );
}
