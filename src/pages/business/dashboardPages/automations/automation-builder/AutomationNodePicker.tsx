import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  UserPlus,
  RefreshCw,
  FileText,
  CalendarPlus,
  CalendarX,
  Bell,
  ShoppingBag,
  CreditCard,
  Play,
  Clock3,
  Zap,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import type {
  AutomationTriggerOption,
  PaletteFilter,
  PaletteItem,
} from "../automationFlowTypes";
import { TRIGGER_CATEGORY_LABELS } from "../automationFlowTypes";
import {
  groupTriggerItems,
  mapCatalogCategoryToPicker,
  readRecentTriggerKeys,
  rememberRecentTriggerKey,
  triggerMatchesQuery,
  TRIGGER_PICKER_CATEGORY_LABELS,
  type TriggerPickerCategoryId,
} from "./triggerPickerUtils";
import { MixedBidiText } from "./bidiText";

export type PickerMode = "all" | "trigger" | "result";

export type PickerCategory =
  | "all"
  | "trigger"
  | "action"
  | "logic"
  | "delay"
  | "ai"
  | "integrations";

const CATEGORIES: Array<{ id: PickerCategory; label: string }> = [
  { id: "all", label: "הכל" },
  { id: "trigger", label: "טריגרים" },
  { id: "action", label: "תוצאות" },
  { id: "logic", label: "לוגיקה" },
  { id: "delay", label: "המתנה" },
  { id: "ai", label: "AI" },
  { id: "integrations", label: "חיבורים" },
];

const TRIGGER_ICON_MAP: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  "refresh-cw": RefreshCw,
  "file-text": FileText,
  "calendar-plus": CalendarPlus,
  "calendar-x": CalendarX,
  bell: Bell,
  "shopping-bag": ShoppingBag,
  "credit-card": CreditCard,
  play: Play,
  clock: Clock3,
  "message-circle": MessageCircle,
  zap: Zap,
};

function triggerIconFor(
  option: AutomationTriggerOption | undefined,
  item: PaletteItem
): LucideIcon {
  const key = String(option?.icon || item.defaults?.icon || "").trim();
  return TRIGGER_ICON_MAP[key] || Play;
}

function isAiItem(item: PaletteItem) {
  const key = String(item.key || item.defaults?.actionKey || "");
  return key.startsWith("ai_") || /AI|ai_/.test(item.label);
}

function isIntegrationItem(item: PaletteItem) {
  const key = String(item.key || item.defaults?.actionKey || "");
  return (
    key.includes("gmail") ||
    key.includes("outlook") ||
    key.includes("calendar") ||
    key.includes("whatsapp") ||
    key === "send_gmail" ||
    key === "send_outlook"
  );
}

function matchesCategory(item: PaletteItem, category: PickerCategory) {
  if (category === "all") return true;
  if (category === "trigger") return item.filter === "trigger";
  if (category === "delay") return item.filter === "delay";
  if (category === "logic") {
    return item.filter === "condition" || item.filter === "router";
  }
  if (category === "ai") return isAiItem(item);
  if (category === "integrations") return isIntegrationItem(item);
  if (category === "action") {
    return (
      item.filter === "action" && !isAiItem(item) && !isIntegrationItem(item)
    );
  }
  return true;
}

function matchesMode(item: PaletteItem, mode: PickerMode) {
  if (mode === "trigger") return item.filter === "trigger";
  if (mode === "result") {
    return item.filter !== "trigger";
  }
  return true;
}

type Props = {
  open: boolean;
  items: PaletteItem[];
  triggerCatalog?: AutomationTriggerOption[];
  mode?: PickerMode;
  loading?: boolean;
  error?: string;
  readOnly?: boolean;
  writeBlockedTitle?: string;
  onRetryCatalog?: () => void;
  onClose: () => void;
  onPick: (item: PaletteItem) => void;
};

export default function AutomationNodePicker({
  open,
  items,
  triggerCatalog = [],
  mode = "all",
  loading,
  error,
  readOnly,
  writeBlockedTitle,
  onRetryCatalog,
  onClose,
  onPick,
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PickerCategory>("all");
  const [triggerCategory, setTriggerCategory] = useState<
    TriggerPickerCategoryId | "all"
  >("all");
  const [recentKeys, setRecentKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCategory("all");
      setTriggerCategory("all");
      return;
    }
    setCategory(mode === "trigger" ? "trigger" : mode === "result" ? "action" : "all");
    setTriggerCategory("all");
    setRecentKeys(readRecentTriggerKeys());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, mode]);

  const catalogByKey = useMemo(() => {
    const map = new Map<string, AutomationTriggerOption>();
    for (const row of triggerCatalog) map.set(row.key, row);
    return map;
  }, [triggerCatalog]);

  const visibleCategories = useMemo(() => {
    if (mode === "trigger") return [];
    if (mode === "result") {
      return CATEGORIES.filter((c) => c.id !== "trigger");
    }
    return CATEGORIES;
  }, [mode]);

  const triggerGroups = useMemo(() => {
    if (mode !== "trigger") return [];
    const groups = groupTriggerItems(items, triggerCatalog, recentKeys);
    if (!query.trim() && triggerCategory === "all") return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (
            triggerCategory !== "all" &&
            group.id !== triggerCategory &&
            !(triggerCategory === "common" && group.id === "common") &&
            !(triggerCategory === "recent" && group.id === "recent")
          ) {
            // When a domain chip is selected, only that group.
            if (group.id !== triggerCategory) return false;
          }
          return triggerMatchesQuery(item, catalogByKey.get(item.key), query);
        }),
      }))
      .filter((group) => {
        if (!group.items.length) return false;
        if (triggerCategory === "all") return true;
        return group.id === triggerCategory;
      });
  }, [
    catalogByKey,
    items,
    mode,
    query,
    recentKeys,
    triggerCatalog,
    triggerCategory,
  ]);

  const triggerCategoryChips = useMemo(() => {
    if (mode !== "trigger") return [];
    const groups = groupTriggerItems(items, triggerCatalog, recentKeys);
    const chips: Array<{ id: TriggerPickerCategoryId | "all"; label: string }> =
      [{ id: "all", label: "הכל" }];
    for (const group of groups) {
      chips.push({ id: group.id, label: group.label });
    }
    return chips;
  }, [items, mode, recentKeys, triggerCatalog]);

  const visible = useMemo(() => {
    if (mode === "trigger") return [];
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (!matchesMode(item, mode)) return false;
      if (item.filter === "trigger" && item.supported === false) return false;
      if (!matchesCategory(item, category)) return false;
      if (!q) return true;
      const option = catalogByKey.get(item.key);
      if (item.filter === "trigger") {
        return triggerMatchesQuery(item, option, q);
      }
      return `${item.label} ${item.description} ${item.key}`
        .toLowerCase()
        .includes(q);
    });
  }, [catalogByKey, category, items, mode, query]);

  if (!open) return null;

  const isTriggerMode = mode === "trigger";
  const title = isTriggerMode
    ? "מה יפעיל את האוטומציה?"
    : mode === "result"
      ? "מה יקרה אוטומטית?"
      : "הוסף שלב";
  const subtitle = isTriggerMode
    ? "בחרו את האירוע שיתחיל את התהליך"
    : mode === "result"
      ? "התוצאה היא מה שקורה אחרי הטריגר. אפשר להוסיף כמה תוצאות יחד."
      : "בחרו טריגר, תוצאה או לוגיקה להוספה לזרימה";

  const handlePick = (item: PaletteItem) => {
    if (readOnly || item.supported === false) return;
    if (item.filter === "trigger") {
      rememberRecentTriggerKey(item.key);
      setRecentKeys(readRecentTriggerKeys());
    }
    onPick(item);
  };

  const renderTriggerItem = (item: PaletteItem) => {
    const option = catalogByKey.get(item.key);
    const Icon = triggerIconFor(option, item);
    const categoryLabel =
      TRIGGER_CATEGORY_LABELS[option?.category || ""] ||
      TRIGGER_PICKER_CATEGORY_LABELS[
        mapCatalogCategoryToPicker(option?.category)
      ];
    const billingNote =
      option?.billingNote ||
      String(item.defaults?.billingNote || "ללא חיוב");
    const disabled = readOnly || item.supported === false;
    return (
      <button
        key={`${item.type}-${item.key}`}
        type="button"
        className="af-picker-item af-picker-item--trigger"
        disabled={disabled}
        title={writeBlockedTitle}
        aria-label={`${item.label}. ${item.description}`}
        onClick={() => handlePick(item)}
      >
        <span className="af-picker-item__icon" aria-hidden>
          <Icon size={18} />
        </span>
        <span className="af-picker-item__text">
          <MixedBidiText as="strong" text={item.label} />
          <MixedBidiText as="em" text={item.description} />
          <span className="af-picker-item__meta">
            <MixedBidiText
              as="span"
              className="af-picker-item__category"
              text={categoryLabel}
            />
            {!option?.triggerBillable ? (
              <span className="af-picker-item__billing">{billingNote}</span>
            ) : null}
          </span>
        </span>
      </button>
    );
  };

  const triggerFlatCount = triggerGroups.reduce(
    (sum, group) => sum + group.items.length,
    0
  );

  return (
    <div className="af-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className={`af-drawer af-drawer--picker${
          isTriggerMode ? " af-drawer--trigger-picker" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="af-drawer__header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button
            type="button"
            className="af-drawer__close"
            aria-label="סגור"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </header>

        <label className="af-drawer__search af-drawer__search--prominent">
          <Search size={16} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isTriggerMode
                ? "חיפוש: ליד, CRM, פגישה, וואטסאפ, תשלום, הזמנה, טופס, זמן…"
                : mode === "result"
                  ? "חפש תוצאה (וואטסאפ, משימה, AI…)"
                  : "חפש טריגר או תוצאה"
            }
            autoFocus
            aria-label="חיפוש טריגרים"
          />
        </label>

        {isTriggerMode ? (
          <div className="af-drawer__chips" role="tablist" aria-label="קטגוריות טריגר">
            {triggerCategoryChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={triggerCategory === chip.id}
                className={`af-filter-chip${
                  triggerCategory === chip.id ? " af-filter-chip--active" : ""
                }`}
                onClick={() => setTriggerCategory(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="af-drawer__chips">
            {visibleCategories.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`af-filter-chip${
                  category === chip.id ? " af-filter-chip--active" : ""
                }`}
                onClick={() => setCategory(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        <div className="af-drawer__body">
          {loading ? <p className="af-palette__hint">טוען טריגרים מהשרת...</p> : null}
          {error ? (
            <div className="af-wa-template__state af-wa-template__state--error">
              <p>{error}</p>
              {onRetryCatalog ? (
                <button
                  type="button"
                  className="af-toolbar__btn"
                  onClick={onRetryCatalog}
                >
                  נסיון חוזר
                </button>
              ) : null}
            </div>
          ) : null}

          {isTriggerMode ? (
            triggerFlatCount === 0 ? (
              <div className="af-drawer__empty" role="status">
                לא נמצאו טריגרים מתאימים
              </div>
            ) : (
              <div className="af-picker-groups">
                {triggerGroups.map((group) => (
                  <section key={group.id} className="af-picker-group">
                    <h3 className="af-picker-group__title">{group.label}</h3>
                    <div className="af-picker-list">
                      {group.items.map((item) => renderTriggerItem(item))}
                    </div>
                  </section>
                ))}
              </div>
            )
          ) : visible.length === 0 ? (
            <div className="af-drawer__empty">לא נמצאו פריטים</div>
          ) : (
            <div className="af-picker-list">
              {visible.map((item) => {
                const disabled = readOnly || item.supported === false;
                if (item.filter === "trigger") {
                  return renderTriggerItem(item);
                }
                return (
                  <button
                    key={`${item.type}-${item.key}`}
                    type="button"
                    className="af-picker-item"
                    disabled={disabled}
                    title={writeBlockedTitle}
                    onClick={() => handlePick(item)}
                  >
                    <span
                      className="af-picker-item__dot"
                      style={{ background: item.color }}
                      aria-hidden
                    />
                    <span className="af-picker-item__text">
                      <strong>{item.label}</strong>
                      <em>{item.description}</em>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export type { PaletteFilter };
