import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import { getTextDirection } from "../../../i18n/localeUtils";
import SitePluginHelpModal from "./SitePluginHelpModal";
import PluginCoverImage from "./PluginCoverImage";
import {
  CATEGORY_GROUP_KEYS,
  CATEGORY_GROUPS,
  CATEGORY_LABEL_KEYS,
  CATEGORY_LABELS,
  filterAndSortPlugins,
  getPluginRating,
  type InstallFilter,
  type SortOption,
} from "./pluginStoreUtils";

type SitePluginStoreProps = {
  catalog: SitePluginDefinition[];
  enabledPlugins: string[];
  detectedFromSite?: string[];
  saving?: boolean;
  savingKey?: string | null;
  containedHelp?: boolean;
  onToggle: (pluginKey: string, enabled: boolean) => void;
  onUpgrade?: (pluginKey: string) => void;
};

function PluginStoreCard({
  plugin,
  isEnabled,
  wasDetected,
  saving,
  onOpen,
  onToggle,
  onUpgrade,
}: {
  plugin: SitePluginDefinition;
  isEnabled: boolean;
  wasDetected: boolean;
  saving: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onUpgrade?: () => void;
}) {
  const { t } = useTranslation();
  const Icon = getPluginIcon(plugin.key);
  const accent = getPluginAccent(plugin.key, plugin.accent);
  const rating = getPluginRating(plugin.key);

  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:border-slate-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]"
      data-plugin-help-trigger={plugin.key}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative">
        <PluginCoverImage
          pluginKey={plugin.key}
          pluginName={plugin.name}
          accent={accent}
          Icon={Icon}
          className="aspect-[16/10] w-full"
          variant="card"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {wasDetected && !isEnabled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 shadow-sm">
              <Sparkles size={11} />
              {t("sites.plugins.newBadge")}
            </span>
          ) : (
            <span />
          )}

          {isEnabled && plugin.entitled === true ? (
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              {plugin.statusLabel || t("sites.plugins.activeSub")}
            </span>
          ) : plugin.statusLabel ? (
            <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              {plugin.statusLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3
          className="truncate text-sm font-bold text-slate-900"
          data-plugin-help-trigger={plugin.key}
        >
          {plugin.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-600">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-400">·</span>
          <span className="truncate text-[11px] font-medium text-slate-500">
            {t(CATEGORY_LABEL_KEYS[plugin.category] || "", {
              defaultValue: CATEGORY_LABELS[plugin.category] || plugin.category,
            })}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
          {plugin.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <button
            type="button"
            data-plugin-help-trigger={plugin.key}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="text-xs font-semibold text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            {t("sites.plugins.help")}
          </button>
          <span className="text-xs font-semibold text-emerald-600">
            {plugin.displayPriceLabel ||
              plugin.priceLabel ||
              (plugin.priceMonthly == null
                ? t("sites.plugins.included")
                : plugin.priceMax && plugin.priceMax > (plugin.priceMonthly || 0)
                  ? t("sites.plugins.priceRange", {
                      min: plugin.priceMonthly,
                      max: plugin.priceMax,
                    })
                  : t("sites.plugins.priceMonth", { price: plugin.priceMonthly }))}
          </span>
          {plugin.secondaryCtaLabel && onUpgrade ? (
            <button
              type="button"
              data-plugin-upgrade={plugin.key}
              disabled={saving}
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade();
              }}
              className="shrink-0 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
            >
              {plugin.secondaryCtaLabel}
            </button>
          ) : null}
          <button
            type="button"
            data-plugin-cta={plugin.key}
            data-plugin-purchase-tier={
              plugin.billingEnabled && plugin.entitled !== true
                ? plugin.purchaseTier || "pro"
                : undefined
            }
            disabled={saving}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-60 ${
              isEnabled && plugin.entitled === true
                ? "border border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <BizuplyLoader size="xs" compact />
            ) : isEnabled && plugin.entitled === true ? (
              t("sites.plugins.remove")
            ) : plugin.ctaLabel ? (
              plugin.ctaLabel
            ) : (
              t("sites.plugins.install")
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SitePluginStore({
  catalog,
  enabledPlugins,
  detectedFromSite = [],
  saving = false,
  savingKey = null,
  containedHelp = false,
  onToggle,
  onUpgrade,
}: SitePluginStoreProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("relevant");
  const [installFilter, setInstallFilter] = useState<InstallFilter>("all");
  const [detailPlugin, setDetailPlugin] = useState<SitePluginDefinition | null>(
    null
  );

  const enabledSet = useMemo(() => new Set(enabledPlugins), [enabledPlugins]);
  const detectedSet = useMemo(
    () => new Set(detectedFromSite),
    [detectedFromSite]
  );

  const installedCount = enabledPlugins.length;

  const filteredCatalog = useMemo(
    () =>
      filterAndSortPlugins(catalog, {
        category,
        query,
        sort,
        installFilter,
        enabledSet,
      }),
    [catalog, category, query, sort, installFilter, enabledSet]
  );

  const sectionTitle =
    category === "all"
      ? t("sites.plugins.allPlugins")
      : t(CATEGORY_LABEL_KEYS[category] || "", {
          defaultValue: CATEGORY_LABELS[category] || category,
        });

  const availableCategories = useMemo(() => {
    const set = new Set(catalog.map((item) => item.category));
    return set;
  }, [catalog]);

  return (
    <div dir={pageDir} className="relative min-h-[600px]">
      {/* Search bar — Chrome Web Store style */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search
            size={20}
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("sites.plugins.search")}
            className="h-12 w-full rounded-full border border-slate-200 bg-white pr-14 pl-5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — categories (RTL: appears on the right) */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-28 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`mb-2 w-full rounded-full px-4 py-2 text-right text-sm font-semibold transition ${
                  category === "all"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t("sites.plugins.all")}
              </button>
            </div>

            {CATEGORY_GROUPS.map((group) => {
              const visible = group.categories.filter((c) =>
                availableCategories.has(c)
              );
              if (visible.length === 0) return null;

              return (
                <div key={group.id}>
                  <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {t(CATEGORY_GROUP_KEYS[group.id] || "", {
                      defaultValue: group.title,
                    })}
                  </p>
                  <ul className="space-y-0.5">
                    {visible.map((cat) => (
                      <li key={cat}>
                        <button
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`w-full rounded-full px-4 py-2 text-right text-sm font-medium transition ${
                            category === cat
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {t(CATEGORY_LABEL_KEYS[cat] || "", {
                            defaultValue: CATEGORY_LABELS[cat] || cat,
                          })}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {installedCount > 0 ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">{t("sites.plugins.installedOnSite")}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {installedCount}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setInstallFilter("installed");
                  }}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  {t("sites.plugins.showAll")}
                </button>
              </div>
            ) : null}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Mobile category pills */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                category === "all"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              {t("sites.plugins.all")}
            </button>
            {Array.from(availableCategories).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {t(CATEGORY_LABEL_KEYS[cat] || "", {
                  defaultValue: CATEGORY_LABELS[cat] || cat,
                })}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">{sectionTitle}</h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <SlidersHorizontal
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={installFilter}
                  onChange={(e) =>
                    setInstallFilter(e.target.value as InstallFilter)
                  }
                  className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-8 pr-9 text-xs font-medium text-slate-700 outline-none focus:border-blue-300"
                >
                  <option value="all">{t("sites.plugins.filterAll")}</option>
                  <option value="installed">{t("sites.plugins.filterInstalled")}</option>
                  <option value="available">{t("sites.plugins.filterAvailable")}</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-8 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-blue-300"
                >
                  <option value="relevant">{t("sites.plugins.sortRelevant")}</option>
                  <option value="name-asc">{t("sites.plugins.sortNameAsc")}</option>
                  <option value="name-desc">{t("sites.plugins.sortNameDesc")}</option>
                  <option value="price-asc">{t("sites.plugins.sortPriceAsc")}</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <p className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-2.5 text-xs leading-relaxed text-blue-900">
            {t("sites.plugins.billingNote")}
          </p>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredCatalog.map((plugin) => (
              <PluginStoreCard
                key={plugin.key}
                plugin={plugin}
                isEnabled={enabledSet.has(plugin.key)}
                wasDetected={detectedSet.has(plugin.key)}
                saving={saving || savingKey === plugin.key}
                onOpen={() => setDetailPlugin(plugin)}
                onToggle={() =>
                  onToggle(plugin.key, !enabledSet.has(plugin.key))
                }
                onUpgrade={onUpgrade ? () => onUpgrade(plugin.key) : undefined}
              />
            ))}
          </div>

          {filteredCatalog.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <p className="mt-4 text-sm font-semibold text-slate-700">
                {t("sites.plugins.empty")}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t("sites.plugins.emptyHint")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setInstallFilter("all");
                }}
                className="mt-4 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t("sites.plugins.clearFilter")}
              </button>
            </div>
          ) : null}
        </main>
      </div>

      <SitePluginHelpModal
        plugin={detailPlugin}
        open={Boolean(detailPlugin)}
        isEnabled={detailPlugin ? enabledSet.has(detailPlugin.key) : false}
        saving={saving}
        contained={containedHelp}
        onClose={() => setDetailPlugin(null)}
        onToggle={
          detailPlugin
            ? () =>
                onToggle(
                  detailPlugin.key,
                  !enabledSet.has(detailPlugin.key)
                )
            : undefined
        }
      />
    </div>
  );
}
