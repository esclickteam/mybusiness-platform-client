import React, { useMemo, useState } from "react";
import {
  Check,
  Download,
  Package,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import {
  btnGhost,
  btnPrimary,
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
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-l from-violet-600 via-violet-600 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200/40 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Package size={14} />
              BizUply App Store
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">חנות תוספים</h2>
            <p className="mt-2 max-w-lg text-sm text-violet-100">
              הרחיבו את האתר עם כלים לחנות, תורים, סליקה, שיווק ו-AI — התקנה
              בלחיצה אחת.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                <p className="text-[11px] text-violet-200">מותקנים</p>
                <p className="text-lg font-bold">{installed.length}</p>
              </div>
              {monthlyTotal > 0 ? (
                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                  <p className="text-[11px] text-violet-200">עלות חודשית</p>
                  <p className="text-lg font-bold">~₪{monthlyTotal}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש תוסף..."
              className="h-12 w-full rounded-xl border-0 bg-white/95 pr-11 pl-4 text-sm text-slate-800 shadow-inner outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {installed.length > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
          <h3 className="mb-3 text-sm font-semibold text-violet-800">
            מותקנים באתר ({installed.length})
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {installed.map((plugin) => {
              const Icon = getPluginIcon(plugin.key);
              const accent = getPluginAccent(plugin.key, plugin.accent);
              return (
                <div
                  key={plugin.key}
                  className="flex min-w-[140px] shrink-0 items-center gap-3 rounded-xl border border-white bg-white px-3 py-2.5 shadow-sm"
                >
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
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
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
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
              className={`group relative flex flex-col rounded-2xl border p-4 transition duration-200 ${
                isEnabled
                  ? "border-violet-200 bg-gradient-to-b from-violet-50/80 to-white shadow-md shadow-violet-100/50"
                  : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40"
              }`}
            >
              {wasDetected && !isEnabled ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Sparkles size={10} />
                  חדש
                </span>
              ) : null}

              {isEnabled ? (
                <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Check size={13} strokeWidth={3} />
                </span>
              ) : null}

              <div className="flex items-start gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
                >
                  <Icon size={26} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-sm font-bold leading-snug text-slate-900">
                    {plugin.name}
                  </h3>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      isPaid ? "text-violet-600" : "text-emerald-600"
                    }`}
                  >
                    {formatPrice(plugin)}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500">
                {plugin.description}
              </p>

              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(plugin.key, !isEnabled)}
                className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-60 ${
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
        <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 py-16 text-center">
          <Package size={32} className="mx-auto text-violet-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">
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
    </div>
  );
}
