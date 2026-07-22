import React, { useMemo, useState } from "react";
import {
  Check,
  Download,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

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
  if (plugin.priceMonthly == null) return "כלול";
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
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-600">
            App Store
          </p>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            חנות תוספים
          </h2>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {installed.length} מותקנים
            {monthlyTotal > 0 ? ` · ~₪${monthlyTotal}/חודש` : ""}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש תוסף..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-sm font-bold text-slate-700 outline-none ring-violet-200 focus:ring-2"
          />
        </div>
      </div>

      {installed.length > 0 ? (
        <section>
          <h3 className="mb-2 px-1 text-xs font-black text-slate-500">
            מותקנים באתר
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {installed.map((plugin) => {
              const Icon = getPluginIcon(plugin.key);
              const accent = getPluginAccent(plugin.key, plugin.accent);
              return (
                <div
                  key={plugin.key}
                  className="flex min-w-[132px] shrink-0 flex-col items-center rounded-2xl border border-violet-100 bg-violet-50/50 px-3 py-3"
                >
                  <div
                    className="grid h-11 w-11 place-items-center rounded-[14px] text-white shadow-sm"
                    style={{ background: accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-center text-[11px] font-black leading-4 text-slate-800">
                    {plugin.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
              filter === category
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-violet-700"
            }`}
          >
            {CATEGORY_LABELS[category] || category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredCatalog.map((plugin) => {
          const Icon = getPluginIcon(plugin.key);
          const accent = getPluginAccent(plugin.key, plugin.accent);
          const isEnabled = enabledSet.has(plugin.key);
          const wasDetected = detectedSet.has(plugin.key);
          const isPaid = typeof plugin.priceMonthly === "number";

          return (
            <article
              key={plugin.key}
              className={`group relative flex flex-col rounded-[18px] border p-2.5 transition ${
                isEnabled
                  ? "border-violet-200 bg-violet-50/60"
                  : "border-slate-200/80 bg-white hover:border-violet-200 hover:shadow-sm"
              }`}
            >
              {wasDetected && !isEnabled ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800">
                  <Sparkles size={9} />
                  חדש
                </span>
              ) : null}

              <div className="flex flex-col items-center text-center">
                <div
                  className="grid h-12 w-12 place-items-center rounded-[15px] text-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
                  style={{ background: accent }}
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-2 line-clamp-2 min-h-[2rem] text-[11px] font-black leading-4 text-slate-900">
                  {plugin.name}
                </h3>

                <p className="mt-1 line-clamp-2 min-h-[1.75rem] text-[10px] font-bold leading-4 text-slate-400">
                  {plugin.description}
                </p>

                <p
                  className={`mt-2 text-[10px] font-black ${
                    isPaid ? "text-violet-700" : "text-emerald-600"
                  }`}
                >
                  {formatPrice(plugin)}
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(plugin.key, !isEnabled)}
                className={`mt-2.5 inline-flex h-8 w-full items-center justify-center gap-1 rounded-xl text-[10px] font-black transition disabled:opacity-60 ${
                  isEnabled
                    ? "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-rose-50 hover:text-rose-600"
                    : "bg-slate-950 text-white hover:bg-violet-700"
                }`}
              >
                {saving ? (
                  <BizuplyLoader size="xs" compact />
                ) : isEnabled ? (
                  <>
                    <X size={12} />
                    הסר
                  </>
                ) : (
                  <>
                    <Download size={12} />
                    התקן
                  </>
                )}
              </button>

              {isEnabled ? (
                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              ) : null}
            </article>
          );
        })}
      </div>

      {filteredCatalog.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm font-bold text-slate-500">
          לא נמצאו תוספים לחיפוש הזה
        </div>
      ) : null}
    </div>
  );
}