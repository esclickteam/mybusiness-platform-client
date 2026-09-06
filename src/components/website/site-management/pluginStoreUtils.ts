import type { SitePluginDefinition } from "../../../api/sitePluginsApi";

export const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  commerce: "Commerce",
  scheduling: "Scheduling",
  finance: "Finance",
  marketing: "Marketing",
  engagement: "Engagement",
  analytics: "Analytics",
  conversion: "Conversions",
  ai: "AI",
  accessibility: "Accessibility",
  navigation: "Navigation",
  content: "Content",
  trust: "Trust",
  media: "Media",
  utility: "Tools",
};

export const CATEGORY_LABEL_KEYS: Record<string, string> = {
  all: "sites.plugins.all",
  commerce: "sites.plugins.catCommerce",
  scheduling: "sites.plugins.catScheduling",
  finance: "sites.plugins.catFinance",
  marketing: "sites.plugins.catMarketing",
  engagement: "sites.plugins.catEngagement",
  analytics: "sites.plugins.catAnalytics",
  conversion: "sites.plugins.catConversion",
  ai: "sites.plugins.catAi",
  accessibility: "sites.plugins.catAccessibility",
  navigation: "sites.plugins.catNavigation",
  content: "sites.plugins.catContent",
  trust: "sites.plugins.catTrust",
  media: "sites.plugins.catMedia",
  utility: "sites.plugins.catUtility",
};

export const CATEGORY_GROUPS: Array<{
  id: string;
  title: string;
  categories: string[];
}> = [
  {
    id: "commerce",
    title: "Commerce and engagement",
    categories: ["commerce", "engagement"],
  },
  {
    id: "scheduling",
    title: "Scheduling and marketing",
    categories: ["scheduling", "marketing", "conversion"],
  },
  {
    id: "ai",
    title: "AI and navigation",
    categories: ["ai", "navigation"],
  },
  {
    id: "tools",
    title: "Tools and accessibility",
    categories: ["utility", "accessibility"],
  },
];

export const CATEGORY_GROUP_KEYS: Record<string, string> = {
  commerce: "sites.plugins.groupCommerce",
  scheduling: "sites.plugins.groupScheduling",
  ai: "sites.plugins.groupAi",
  tools: "sites.plugins.groupTools",
};
export type SortOption = "relevant" | "name-asc" | "name-desc" | "price-asc";
export type InstallFilter = "all" | "installed" | "available";

export function formatPluginPrice(plugin: SitePluginDefinition) {
  if (plugin.displayPriceLabel) return plugin.displayPriceLabel;
  if (plugin.priceLabel) return plugin.priceLabel;
  if (plugin.priceMonthly == null) return "Included in the plan";
  if (plugin.priceMax && plugin.priceMax > (plugin.priceMonthly || 0)) {
    return `₪${plugin.priceMonthly}–${plugin.priceMax}/month`;
  }
  return `₪${plugin.priceMonthly}/month`;
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
