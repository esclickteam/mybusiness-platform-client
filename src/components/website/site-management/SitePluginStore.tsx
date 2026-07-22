import React, { useMemo, useState } from "react";
import {
  Check,
  Download,
  HelpCircle,
  Package,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import SitePluginHelpModal from "./SitePluginHelpModal";
import {
  btnGhost,
  btnPrimary,
  btnSecondary,
  panelHero,
  panelSection,
  pillActive,
  pillInactive,
} from "./siteManagementUi";

type SitePluginStoreProps = {
  catalog: SitePluginDefinition[];
  enabledPlugins: string[];
  detectedFromSite?: string[];
  saving?: boolean;
  onToggle: (pluginKey: string, enabled: boolean) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "הכל",
  commerce: "מסחר",
  scheduling: "תזמון",
  finance: "כספים",
  marketing: "שיווק",
  engagement: "מעורבות",
  analytics: "אנליטיקה",
  conversion: "המרות",
  ai: "AI",
  accessibility: "נגישות",
};

function formatPrice(plugin: SitePluginDefinition) {
  if (plugin.displayPriceLabel) return plugin.displayPriceLabel;
  if (plugin.priceLabel) return plugin.priceLabel;
  if (plugin.priceMonthly == null) return "כלול בחבילה";
  if (plugin.priceMax && plugin.priceMax > (plugin.priceMonthly || 0)) {
    return `₪${plugin.priceMonthly}–${plugin.priceMax}/חודש`;
  }
  return `₪${plugin.priceMonthly}/חודש`;
}

export default function SitePluginStore({
  catalog,
  enabledPlugins,
  detectedFromSite = [],
  saving = false,
  onToggle,
}: SitePluginStoreProps) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [helpPlugin, setHelpPlugin] = useState<SitePluginDefinition | null>(null);

  const categories = useMemo(() => {
    const set = new Set(catalog.map((item) => item.category));
    return ["all", ...Array.from(set)];
  }, [catalog]);

  const enabledSet = useMemo(() => new Set(enabledPlugins), [enabledPlugins]);
  const detectedSet = useMemo(
    () => new Set(detectedFromSite),
    [detectedFromSite]
  );

  const installed = useMemo(
    () => catalog.filter((plugin) => enabledSet.has(plugin.key)),
    [catalog, enabledSet]
  );

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((plugin) => {
      const categoryOk = filter === "all" || plugin.category === filter;
      if (!categoryOk) return false;
      if (!q) return true;
      return (
        plugin.name.toLowerCase().includes(q) ||
        plugin.description.toLowerCase().includes(q)
      );
    });
  }, [catalog, filter, query]);

  const monthlyTotal = useMemo(() => {
    return installed.reduce((sum, plugin) => {
      if (typeof plugin.priceMonthly === "number") {
        return sum + plugin.priceMonthly;
      }
      return sum;
    }, 0);
  }, [installed]);

  return (
    <div className="space-y-5">
      <div className={`${panelHero} p-6 md:p-7`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-violet-100/80 bg-white/70 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
              <Package size={14} />
              BizUply App Store
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              חנות תוספים
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
              הרחיבו את האתר עם כלים לחנות, תורים, סליקה, שיווק ו-AI — התקנה
              בלחיצה אחת. {catalog.length} תוספים זמינים.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-md border border-violet-100/80 bg-white/75 px-4 py-2 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-slate-500">מותקנים</p>
                <p className="text-lg font-bold text-slate-900">{installed.length}</p>
              </div>
              {monthlyTotal > 0 ? (
                <div className="rounded-md border border-violet-100/80 bg-white/75 px-4 py-2 backdrop-blur-sm">
                  <p className="text-[11px] font-medium text-slate-500">
                    עלות חודשית
                  </p>
                  <p className="text-lg font-bold text-slate-900">~₪{monthlyTotal}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sky-500/70"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש תוסף..."
              className="h-12 w-full rounded-md border border-violet-100/80 bg-white pr-11 pl-4 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-100/80"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-violet-200/80 bg-violet-50/40 px-4 py-3 text-sm text-violet-900">
        כל התוספים גלויים וניתנים להתקנה <strong>בחינם</strong> בשלב הבנייה.
        המחירים המוצגים הם לתצוגה בלבד — אין חסימה ואין חיוב כרגע.
      </div>

      {installed.length > 0 ? (
        <section className={panelSection}>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            מותקנים באתר ({installed.length})
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {installed.map((plugin) => {
              const Icon = getPluginIcon(plugin.key);
              const accent = getPluginAccent(plugin.key, plugin.accent);
              return (
                <div
                  key={plugin.key}
                  className="flex min-w-[140px] shrink-0 items-center gap-3 rounded-md border border-violet-100/70 bg-white/90 px-3 py-2.5 shadow-[0_2px_10px_rgba(99,102,241,0.05)]"
                >
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-white shadow-sm"
                    style={{ background: accent }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {plugin.name}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      פעיל
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-md px-4 py-2 text-xs font-semibold transition ${
              filter === category ? pillActive : pillInactive
            }`}
          >
            {CATEGORY_LABELS[category] || category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCatalog.map((plugin) => {
          const Icon = getPluginIcon(plugin.key);
          const accent = getPluginAccent(plugin.key, plugin.accent);
          const isEnabled = enabledSet.has(plugin.key);
          const wasDetected = detectedSet.has(plugin.key);
          const isPaid = typeof plugin.priceMonthly === "number";

          return (
            <article
              key={plugin.key}
              className={`group relative flex flex-col rounded-md border p-4 transition duration-200 ${
                isEnabled
                  ? "border-violet-200/70 bg-gradient-to-b from-violet-50/70 via-sky-50/40 to-white shadow-[0_6px_20px_rgba(99,102,241,0.08)]"
                  : "border-slate-200/80 bg-white/90 hover:-translate-y-0.5 hover:border-violet-200/70 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)]"
              }`}
            >
              {wasDetected && !isEnabled ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Sparkles size={10} />
                  חדש
                </span>
              ) : null}

              {isEnabled ? (
                <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md bg-emerald-500 text-white shadow-sm">
                  <Check size={13} strokeWidth={3} />
                </span>
              ) : null}

              <div className="flex items-start gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-md text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
                >
                  <Icon size={26} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h3 className="text-sm font-bold leading-snug text-slate-900">
                      {plugin.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setHelpPlugin(plugin)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 transition hover:bg-violet-50 hover:text-violet-800"
                    >
                      <HelpCircle size={11} />
                      מה זה אומר?
                    </button>
                  </div>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      isPaid && !plugin.displayPriceLabel?.includes("חינם")
                        ? "text-violet-700"
                        : "text-emerald-600"
                    }`}
                  >
                    {formatPrice(plugin)}
                  </p>
                  {plugin.futurePriceLabel ? (
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      מחיר עתידי: {plugin.futurePriceLabel}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
                {plugin.description}
              </p>

              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(plugin.key, !isEnabled)}
                className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition disabled:opacity-60 ${
                  isEnabled
                    ? btnGhost + " hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    : btnPrimary
                }`}
              >
                {saving ? (
                  <BizuplyLoader size="xs" compact />
                ) : isEnabled ? (
                  <>
                    <X size={14} />
                    הסרת תוסף
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    התקנה
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>

      {filteredCatalog.length === 0 ? (
        <div className="rounded-md border border-dashed border-violet-200/80 bg-gradient-to-b from-violet-50/40 to-white py-16 text-center">
          <Package size={32} className="mx-auto text-sky-400/70" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            לא נמצאו תוספים לחיפוש הזה
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className={`mt-4 ${btnSecondary}`}
          >
            ניקוי סינון
          </button>
        </div>
      ) : null}

      <SitePluginHelpModal
        plugin={helpPlugin}
        open={Boolean(helpPlugin)}
        onClose={() => setHelpPlugin(null)}
      />
    </div>
  );
}
