import React from "react";
import { Plus } from "lucide-react";

type Props = {
  readOnly?: boolean;
  onAddTrigger: () => void;
};

export default function AutomationEmptyState({ readOnly, onAddTrigger }: Props) {
  return (
    <div className="af-empty-canvas">
      <strong>הוסף טריגר כדי להתחיל</strong>
      <p>הזרימה מתחילה בטריגר — ואז מוסיפים פעולות, תנאים והמתנות.</p>
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