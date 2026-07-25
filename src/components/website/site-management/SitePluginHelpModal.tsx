import React, { useEffect } from "react";
import {
  Check,
  ChevronLeft,
  Download,
  ExternalLink,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import PluginCoverImage from "./PluginCoverImage";
import {
  CATEGORY_LABELS,
  formatPluginPrice,
  getPluginRating,
} from "./pluginStoreUtils";

type SitePluginHelpModalProps = {
  plugin: SitePluginDefinition | null;
  open: boolean;
  isEnabled?: boolean;
  saving?: boolean;
  onClose: () => void;
  onToggle?: () => void;
};

export default function SitePluginHelpModal({
  plugin,
  open,
  isEnabled = false,
  saving = false,
  onClose,
  onToggle,
}: SitePluginHelpModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !plugin) return null;

  const Icon = getPluginIcon(plugin.key);
  const accent = getPluginAccent(plugin.key, plugin.accent);
  const rating = getPluginRating(plugin.key);
  const examples = plugin.helpExamples?.length ? plugin.helpExamples : [];
  const helpText =
    plugin.helpText ||
    plugin.description ||
    "תוסף זה מרחיב את יכולות האתר. לאחר ההתקנה ניתן להגדיר אותו בפאנל הניהול.";

  return (
    <div dir="rtl" className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onMouseDown={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plugin-detail-title"
        className="absolute inset-y-0 left-0 flex w-full max-w-xl flex-col border-r border-slate-200 bg-white shadow-[-8px_0_40px_rgba(15,23,42,0.12)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
            aria-label="סגירה"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-slate-500">חזרה לחנות</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div
            className="relative px-6 pb-6 pt-8"
            style={{
              background: `linear-gradient(180deg, ${accent}12 0%, white 100%)`,
            }}
          >
            <div className="flex items-start gap-5">
              <PluginCoverImage
                pluginKey={plugin.key}
                pluginName={plugin.name}
                accent={accent}
                Icon={Icon}
                className="h-24 w-24 shrink-0 rounded-2xl shadow-lg"
                variant="hero"
              />

              <div className="min-w-0 flex-1 pt-1">
                <h1
                  id="plugin-detail-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {plugin.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400">·</span>
                  <span className="text-sm text-slate-600">
                    {CATEGORY_LABELS[plugin.category] || plugin.category}
                  </span>
                  {isEnabled ? (
                    <>
                      <span className="text-sm text-slate-400">·</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                        <Check size={14} />
                        מותקן
                      </span>
                    </>
                  ) : null}
                </div>

                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  {formatPluginPrice(plugin)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving || !onToggle}
                onClick={onToggle}
                className={`inline-flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition disabled:opacity-60 ${
                  isEnabled
                    ? "border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saving ? (
                  <BizuplyLoader size="xs" compact />
                ) : isEnabled ? (
                  <>
                    <X size={16} />
                    הסרת תוסף
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    התקנה
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cover preview */}
          <div className="mx-6 mb-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <PluginCoverImage
              pluginKey={plugin.key}
              pluginName={plugin.name}
              accent={accent}
              Icon={Icon}
              className="aspect-video w-full"
              variant="detail"
            />
          </div>

          {/* Description */}
          <div className="space-y-6 px-6 pb-8">
            <section>
              <h2 className="text-base font-bold text-slate-900">על התוסף</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {helpText}
              </p>
            </section>

            {examples.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Sparkles size={16} className="text-violet-500" />
                  דוגמאות שימוש
                </h2>
                <ul className="mt-3 space-y-2">
                  {examples.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="text-base font-bold text-slate-900">פרטים</h2>
              <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-500">קטגוריה</dt>
                  <dd className="text-sm font-medium text-slate-800">
                    {CATEGORY_LABELS[plugin.category] || plugin.category}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-500">מחיר</dt>
                  <dd className="text-sm font-medium text-slate-800">
                    {formatPluginPrice(plugin)}
                  </dd>
                </div>
                {plugin.futurePriceLabel ? (
                  <div className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500">מחיר עתידי</dt>
                    <dd className="text-sm font-medium text-slate-800">
                      {plugin.futurePriceLabel}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <ExternalLink size={14} className="mt-0.5 shrink-0" />
                לאחר ההתקנה — הגדרות בלשונית הניהול של התוסף, והוספה לעמודים
                דרך עורך האתר → תוספים.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
