import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginIcon } from "../../../data/sitePluginNav";

type SitePluginStoreProps = {
  catalog: SitePluginDefinition[];
  enabledPlugins: string[];
  detectedFromSite?: string[];
  saving?: boolean;
  onToggle: (pluginKey: string, enabled: boolean) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  commerce: "מסחר",
  scheduling: "תזמון",
  finance: "כספים",
  marketing: "שיווק",
  engagement: "מעורבות",
};

export default function SitePluginStore({
  catalog,
  enabledPlugins,
  detectedFromSite = [],
  saving = false,
  onToggle,
}: SitePluginStoreProps) {
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(catalog.map((item) => item.category));
    return ["all", ...Array.from(set)];
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    if (filter === "all") return catalog;
    return catalog.filter((item) => item.category === filter);
  }, [catalog, filter]);

  const enabledSet = useMemo(() => new Set(enabledPlugins), [enabledPlugins]);
  const detectedSet = useMemo(
    () => new Set(detectedFromSite),
    [detectedFromSite]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-violet-100 bg-gradient-to-l from-violet-50 via-white to-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">חנות תוספים</h2>
            <p className="mt-1 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              התקינו תוספים לאתר הזה בלבד. כל אתר יכול להפעיל חנות, יומן,
              סליקה ועוד — בנפרד מאתרים אחרים.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`inline-flex h-10 items-center rounded-2xl px-4 text-xs font-black transition ${
              filter === category
                ? "bg-slate-950 text-white shadow-lg"
                : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
            }`}
          >
            {category === "all"
              ? "הכל"
              : CATEGORY_LABELS[category] || category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCatalog.map((plugin) => {
          const Icon = getPluginIcon(plugin.key);
          const isEnabled = enabledSet.has(plugin.key);
          const wasDetected = detectedSet.has(plugin.key);

          return (
            <article
              key={plugin.key}
              className={`relative overflow-hidden rounded-[28px] border p-5 transition ${
                isEnabled
                  ? "border-violet-200 bg-violet-50/40 shadow-[0_18px_50px_rgba(124,58,237,0.08)]"
                  : "border-slate-200 bg-white shadow-sm hover:border-violet-100"
              }`}
            >
              {wasDetected && !isEnabled ? (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700 ring-1 ring-amber-100">
                  <Sparkles size={11} />
                  זוהה באתר
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      isEnabled
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {plugin.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {CATEGORY_LABELS[plugin.category] || plugin.category}
                    </p>
                  </div>
                </div>

                {isEnabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 size={12} />
                    פעיל
                  </span>
                ) : null}
              </div>

              <p className="mt-4 min-h-[72px] text-sm font-bold leading-7 text-slate-500">
                {plugin.description}
              </p>

              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(plugin.key, !isEnabled)}
                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition disabled:opacity-60 ${
                  isEnabled
                    ? "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                    : "bg-slate-950 text-white hover:bg-violet-700"
                }`}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isEnabled ? (
                  <>
                    <Trash2 size={16} />
                    הסרת תוסף
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    התקנת תוסף
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
