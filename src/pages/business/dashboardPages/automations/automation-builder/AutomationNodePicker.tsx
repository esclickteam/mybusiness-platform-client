import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import type { PaletteItem } from "../automationFlowTypes";

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
  { id: "action", label: "פעולות" },
  { id: "logic", label: "לוגיקה" },
  { id: "delay", label: "המתנה" },
  { id: "ai", label: "AI" },
  { id: "integrations", label: "חיבורים" },
];

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

type Props = {
  open: boolean;
  items: PaletteItem[];
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

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCategory("all");
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (!matchesCategory(item, category)) return false;
      if (!q) return true;
      return `${item.label} ${item.description} ${item.key}`
        .toLowerCase()
        .includes(q);
    });
  }, [category, items, query]);

  if (!open) return null;

  return createPortal(
    <div className="af-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="af-drawer af-drawer--picker"
        role="dialog"
        aria-modal="true"
        aria-label="הוסף שלב"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="af-drawer__header">
          <div>
            <h2>הוסף שלב</h2>
            <p>בחרו טריגר, פעולה או לוגיקה להוספה לזרימה</p>
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

        <label className="af-drawer__search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חפש טריגר או פעולה"
            autoFocus
          />
        </label>

        <div className="af-drawer__chips">
          {CATEGORIES.map((chip) => (
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

          {visible.length === 0 ? (
            <div className="af-drawer__empty">לא נמצאו פריטים</div>
          ) : (
            <div className="af-picker-list">
              {visible.map((item) => {
                const disabled = readOnly || item.supported === false;
                return (
                  <button
                    key={`${item.type}-${item.key}`}
                    type="button"
                    className="af-picker-item"
                    disabled={disabled}
                    title={
                      item.supported === false
                        ? "בקרוב"
                        : writeBlockedTitle
                    }
                    onClick={() => {
                      if (disabled) return;
                      onPick(item);
                    }}
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
                    {item.supported === false ? (
                      <span className="af-badge af-badge--paused">בקרוב</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}

// re-export for typing convenience
export type { PaletteFilter };