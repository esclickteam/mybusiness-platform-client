import type { SitePluginDefinition } from "../../../api/sitePluginsApi";

export const CATEGORY_LABELS: Record<string, string> = {
  all: "הכול",
  commerce: "מסחר",
  scheduling: "תזמון",
  finance: "כספים",
  marketing: "שיווק",
  engagement: "מעורבות",
  analytics: "אנליטיקה",
  conversion: "המרות",
  ai: "AI",
  accessibility: "נגישות",
  navigation: "ניווט",
  content: "תוכן",
  trust: "אמון",
  media: "מדיה",
  utility: "כלים",
};

export const CATEGORY_GROUPS: Array<{
  title: string;
  categories: string[];
}> = [
  {
    title: "מסחר ומעורבות",
    categories: ["commerce", "engagement"],
  },
  {
    title: "AI וניווט",
    categories: ["ai", "navigation"],
  },
  {
    title: "נגישות",
    categories: ["accessibility"],
  },
];

export type SortOption = "relevant" | "name-asc" | "name-desc" | "price-asc";
export type InstallFilter = "all" | "installed" | "available";

export function formatPluginPrice(plugin: SitePluginDefinition) {
  if (plugin.displayPriceLabel) return plugin.displayPriceLabel;
  if (plugin.priceLabel) return plugin.priceLabel;
  if (plugin.priceMonthly == null) return "כלול בחבילה";
  if (plugin.priceMax && plugin.priceMax > (plugin.priceMonthly || 0)) {
    return `₪${plugin.priceMonthly}–${plugin.priceMax}/חודש`;
  }
  return `₪${plugin.priceMonthly}/חודש`;
}

/** Stable visual rating for store cards (4.0–4.9) */
export function getPluginRating(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 4 + (Math.abs(hash) % 10) / 10;
}

export function filterAndSortPlugins(
  catalog: SitePluginDefinition[],
  {
    category,
    query,
    sort,
    installFilter,
    enabledSet,
  }: {
    category: string;
    query: string;
    sort: SortOption;
    installFilter: InstallFilter;
    enabledSet: Set<string>;
  }
) {
  const q = query.trim().toLowerCase();

  let items = catalog.filter((plugin) => {
    const categoryOk = category === "all" || plugin.category === category;
    if (!categoryOk) return false;

    if (installFilter === "installed" && !enabledSet.has(plugin.key)) return false;
    if (installFilter === "available" && enabledSet.has(plugin.key)) return false;

    if (!q) return true;
    return (
      plugin.name.toLowerCase().includes(q) ||
      plugin.description.toLowerCase().includes(q) ||
      (CATEGORY_LABELS[plugin.category] || "").includes(q)
    );
  });

  items = [...items].sort((a, b) => {
    if (sort === "relevant") {
      const aInst = enabledSet.has(a.key) ? 1 : 0;
      const bInst = enabledSet.has(b.key) ? 1 : 0;
      if (aInst !== bInst) return bInst - aInst;
      return a.name.localeCompare(b.name, "he");
    }
    if (sort === "name-asc") return a.name.localeCompare(b.name, "he");
    if (sort === "name-desc") return b.name.localeCompare(a.name, "he");
    if (sort === "price-asc") {
      const pa = a.priceMonthly ?? 0;
      const pb = b.priceMonthly ?? 0;
      return pa - pb;
    }
    return 0;
  });

  return items;
}
