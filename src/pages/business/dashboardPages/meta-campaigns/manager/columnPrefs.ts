export type ManagerColumnId =
  | "name"
  | "status"
  | "budget"
  | "spend"
  | "results"
  | "leads"
  | "impressions"
  | "reach"
  | "frequency"
  | "linkClicks"
  | "landingPageViews"
  | "clicks"
  | "ctr"
  | "cpc"
  | "cpm"
  | "cpl"
  | "costPerResult"
  | "purchases"
  | "updated";

export type ColumnPrefs = {
  order: ManagerColumnId[];
  hidden: ManagerColumnId[];
  widths: Partial<Record<ManagerColumnId, number>>;
};

export const MANAGER_COLUMNS: ManagerColumnId[] = [
  "name",
  "status",
  "budget",
  "spend",
  "results",
  "leads",
  "impressions",
  "reach",
  "frequency",
  "linkClicks",
  "landingPageViews",
  "clicks",
  "ctr",
  "cpc",
  "cpm",
  "cpl",
  "costPerResult",
  "purchases",
  "updated",
];

export const COLUMN_PRESETS: Record<string, ManagerColumnId[]> = {
  performance: ["name", "status", "spend", "results", "impressions", "reach", "linkClicks", "ctr", "cpc", "costPerResult"],
  leads: ["name", "status", "spend", "leads", "cpl", "landingPageViews", "results"],
  engagement: ["name", "status", "impressions", "reach", "frequency", "clicks", "ctr"],
  spend: ["name", "status", "budget", "spend", "cpm", "cpc", "impressions"],
};

const LOCKED: ManagerColumnId[] = ["name", "status"];

export function defaultColumnPrefs(): ColumnPrefs {
  return {
    order: [...COLUMN_PRESETS.performance],
    hidden: MANAGER_COLUMNS.filter((id) => !COLUMN_PRESETS.performance.includes(id)),
    widths: {},
  };
}

export function columnStorageKey(businessId: string, level: string) {
  return `bizuply.metaAds.columns.${businessId}.${level}`;
}

export function sanitizeColumnPrefs(value: unknown): ColumnPrefs {
  const fallback = defaultColumnPrefs();
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<ColumnPrefs>;
  const order = Array.isArray(raw.order)
    ? raw.order.filter((id): id is ManagerColumnId => MANAGER_COLUMNS.includes(id as ManagerColumnId))
    : fallback.order;
  const hidden = Array.isArray(raw.hidden)
    ? raw.hidden.filter(
        (id): id is ManagerColumnId =>
          MANAGER_COLUMNS.includes(id as ManagerColumnId) && !LOCKED.includes(id as ManagerColumnId)
      )
    : fallback.hidden;
  const seen = new Set<ManagerColumnId>();
  const uniqueOrder = order.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  MANAGER_COLUMNS.forEach((id) => {
    if (!seen.has(id)) uniqueOrder.push(id);
  });
  return {
    order: uniqueOrder,
    hidden,
    widths: raw.widths && typeof raw.widths === "object" ? raw.widths : {},
  };
}

export function visibleColumns(prefs: ColumnPrefs): ManagerColumnId[] {
  return prefs.order.filter((id) => !prefs.hidden.includes(id));
}

export function applyColumnPreset(preset: keyof typeof COLUMN_PRESETS): ColumnPrefs {
  const order = [...COLUMN_PRESETS[preset]];
  MANAGER_COLUMNS.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  return {
    order,
    hidden: MANAGER_COLUMNS.filter((id) => !COLUMN_PRESETS[preset].includes(id)),
    widths: {},
  };
}

export function moveColumn(prefs: ColumnPrefs, id: ManagerColumnId, direction: -1 | 1): ColumnPrefs {
  const order = [...prefs.order];
  const index = order.indexOf(id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= order.length) return prefs;
  const [item] = order.splice(index, 1);
  order.splice(next, 0, item);
  return { ...prefs, order };
}

export function loadColumnPrefs(storage: Pick<Storage, "getItem"> | null, businessId: string, level: string): ColumnPrefs {
  if (!storage) return defaultColumnPrefs();
  try {
    const raw = storage.getItem(columnStorageKey(businessId, level));
    return sanitizeColumnPrefs(raw ? JSON.parse(raw) : null);
  } catch {
    return defaultColumnPrefs();
  }
}

export function saveColumnPrefs(
  storage: Pick<Storage, "setItem"> | null,
  businessId: string,
  level: string,
  prefs: ColumnPrefs
) {
  if (!storage) return;
  storage.setItem(columnStorageKey(businessId, level), JSON.stringify(prefs));
}
