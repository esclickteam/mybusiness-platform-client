import React from "react";
import { useTranslation } from "react-i18next";
import { btnSecondary, cardBase } from "../../../../../styles/bizuplyUi";
import { applyColumnPreset, moveColumn, type ColumnPrefs, type ManagerColumnId } from "./columnPrefs";
import { COLUMN_LABEL } from "./columnLabels";

type Props = {
  prefs: ColumnPrefs;
  onChange: (next: ColumnPrefs) => void;
};

export default function ManagerColumnMenu({ prefs, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className={`${cardBase} space-y-2 p-3`} data-testid="meta-column-menu">
      <div className="flex flex-wrap gap-2">
        {(["performance", "leads", "engagement", "spend"] as const).map((preset) => (
          <button key={preset} type="button" className={btnSecondary} data-testid={`meta-column-preset-${preset}`} onClick={() => onChange(applyColumnPreset(preset))}>
            {t(`metaCampaigns.levels.preset${preset[0].toUpperCase()}${preset.slice(1)}`)}
          </button>
        ))}
        <button type="button" className={btnSecondary} data-testid="meta-column-reset" onClick={() => onChange(applyColumnPreset("performance"))}>
          {t("metaCampaigns.levels.resetColumns")}
        </button>
      </div>
      {prefs.order.map((id) => (
        <label key={id} className="flex items-center justify-between gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!prefs.hidden.includes(id)}
              disabled={id === "name" || id === "status"}
              aria-label={t(COLUMN_LABEL[id])}
              onChange={() =>
                onChange({
                  ...prefs,
                  hidden: prefs.hidden.includes(id)
                    ? prefs.hidden.filter((item) => item !== id)
                    : [...prefs.hidden, id],
                })
              }
            />
            {t(COLUMN_LABEL[id])}
          </span>
          <span className="flex gap-1">
            <button type="button" className={btnSecondary} aria-label={`${t(COLUMN_LABEL[id])} up`} onClick={() => onChange(moveColumn(prefs, id, -1))}>
              ↑
            </button>
            <button type="button" className={btnSecondary} aria-label={`${t(COLUMN_LABEL[id])} down`} onClick={() => onChange(moveColumn(prefs, id, 1))}>
              ↓
            </button>
          </span>
        </label>
      ))}
    </div>
  );
}

export function beginColumnResize(
  event: React.MouseEvent<HTMLElement>,
  column: ManagerColumnId,
  prefs: ColumnPrefs,
  onChange: (next: ColumnPrefs) => void
) {
  event.preventDefault();
  const startX = event.clientX;
  const start = prefs.widths[column] || 140;
  const dir = event.currentTarget.closest("[dir]")?.getAttribute("dir") || "rtl";
  const onMove = (move: MouseEvent) => {
    const delta = dir === "rtl" ? startX - move.clientX : move.clientX - startX;
    onChange({
      ...prefs,
      widths: { ...prefs.widths, [column]: Math.max(90, start + delta) },
    });
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}
