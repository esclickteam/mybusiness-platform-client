import type { AutomationTriggerOption, PaletteItem } from "../automationFlowTypes";

export const TRIGGER_PICKER_CATEGORY_ORDER = [
  "common",
  "recent",
  "crm",
  "appointments",
  "whatsapp",
  "store",
  "website",
  "subscriptions",
  "tasks",
  "email",
  "schedule",
  "manual",
  "system",
] as const;

export type TriggerPickerCategoryId =
  (typeof TRIGGER_PICKER_CATEGORY_ORDER)[number];

export const TRIGGER_PICKER_CATEGORY_LABELS: Record<
  TriggerPickerCategoryId,
  string
> = {
  common: "נפוצים",
  recent: "אחרונים בשימוש",
  crm: "CRM ולידים",
  appointments: "פגישות",
  whatsapp: "WhatsApp",
  store: "חנות ותשלומים",
  website: "אתר וטפסים",
  subscriptions: "מנויים וחיובים",
  tasks: "משימות וצוות",
  email: "אימייל",
  schedule: "לוח זמנים",
  manual: "אינטגרציות ומערכת",
  system: "אינטגרציות ומערכת",
};

/** Popular keys shown under "נפוצים" when present in the supported catalog. */
export const COMMON_TRIGGER_KEYS = [
  "new_lead",
  "lead_status_changed",
  "appointment_created",
  "appointment_reminder",
  "form_submitted",
  "order_created",
  "payment_succeeded",
  "scheduled",
  "manual",
] as const;

const RECENT_STORAGE_KEY = "bizuply.automation.recentTriggers";

export function mapCatalogCategoryToPicker(
  category: string | undefined
): TriggerPickerCategoryId {
  const key = String(category || "").trim();
  if (key === "manual") return "manual";
  if ((TRIGGER_PICKER_CATEGORY_ORDER as readonly string[]).includes(key)) {
    return key as TriggerPickerCategoryId;
  }
  return "system";
}

export function readRecentTriggerKeys(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => String(value || "").trim())
      .filter(Boolean)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function rememberRecentTriggerKey(key: string) {
  const normalized = String(key || "").trim();
  if (!normalized) return;
  try {
    const next = [
      normalized,
      ...readRecentTriggerKeys().filter((item) => item !== normalized),
    ].slice(0, 8);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

export function triggerMatchesQuery(
  item: PaletteItem,
  option: AutomationTriggerOption | undefined,
  query: string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    item.label,
    item.description,
    item.key,
    option?.label,
    option?.description,
    option?.category,
    TRIGGER_PICKER_CATEGORY_LABELS[
      mapCatalogCategoryToPicker(option?.category)
    ],
    ...(option?.keywords || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function groupTriggerItems(
  items: PaletteItem[],
  catalog: AutomationTriggerOption[],
  recentKeys: string[]
) {
  const byKey = new Map(catalog.map((row) => [row.key, row]));
  const supported = items.filter(
    (item) => item.filter === "trigger" && item.supported !== false
  );

  const groups: Array<{
    id: TriggerPickerCategoryId;
    label: string;
    items: PaletteItem[];
  }> = [];

  const recentItems = recentKeys
    .map((key) => supported.find((item) => item.key === key))
    .filter(Boolean) as PaletteItem[];
  if (recentItems.length) {
    groups.push({
      id: "recent",
      label: TRIGGER_PICKER_CATEGORY_LABELS.recent,
      items: recentItems,
    });
  }

  const commonItems = COMMON_TRIGGER_KEYS.map((key) =>
    supported.find((item) => item.key === key)
  ).filter(Boolean) as PaletteItem[];
  if (commonItems.length) {
    groups.push({
      id: "common",
      label: TRIGGER_PICKER_CATEGORY_LABELS.common,
      items: commonItems,
    });
  }

  const byCategory = new Map<TriggerPickerCategoryId, PaletteItem[]>();
  for (const item of supported) {
    const option = byKey.get(item.key);
    const category = mapCatalogCategoryToPicker(option?.category);
    const list = byCategory.get(category) || [];
    if (!list.some((row) => row.key === item.key)) list.push(item);
    byCategory.set(category, list);
  }

  for (const categoryId of TRIGGER_PICKER_CATEGORY_ORDER) {
    if (categoryId === "common" || categoryId === "recent") continue;
    const full = byCategory.get(categoryId) || [];
    if (!full.length) continue;
    groups.push({
      id: categoryId,
      label: TRIGGER_PICKER_CATEGORY_LABELS[categoryId],
      items: full,
    });
  }

  return groups;
}
