import React from "react";
import { Clock3, Plus } from "lucide-react";

type Props = {
  readOnly?: boolean;
  onAddTrigger: () => void;
};

/**
 * Make-style blank slate: one clear trigger entry point, then results.
 */
export default function AutomationEmptyState({ readOnly, onAddTrigger }: Props) {
  return (
    <div className="af-empty-canvas">
      <div className="af-empty-canvas__stage">
        <button
          type="button"
          className="af-empty-trigger"
          disabled={readOnly}
          onClick={onAddTrigger}
          aria-label="בחר טריגר"
        >
          <span className="af-empty-trigger__badge">טריגר</span>
          <span className="af-empty-trigger__plus" aria-hidden>
            <Plus size={36} strokeWidth={2.5} />
          </span>
          <span className="af-empty-trigger__clock" aria-hidden title="גם לפי לוח זמנים">
            <Clock3 size={14} />
          </span>
        </button>
        <span className="af-empty-canvas__next" aria-hidden>
          <Plus size={14} />
        </span>
      </div>

      <strong>התחילו בטריגר</strong>
      <p>
        בחרו מתי האוטומציה מתחילה (למשל ליד חדש). אחר כך תוסיפו מה יקרה אוטומטית —
        התוצאה. אפשר לפצל לכמה תוצאות יחד, בלי מסלולים מורכבים.
      </p>
      <button
        type="button"
        className="af-btn af-btn--primary"
        disabled={readOnly}
        onClick={onAddTrigger}
      >
        <Plus size={14} />
        בחר טריגר
      </button>
    </div>
  );
}
