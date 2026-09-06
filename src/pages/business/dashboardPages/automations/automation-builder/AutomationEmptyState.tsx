import React from "react";
import { useTranslation } from "react-i18next";
import { Clock3, Plus } from "lucide-react";

type Props = {
  readOnly?: boolean;
  onAddTrigger: () => void;
};

/**
 * Make-style blank slate: one clear trigger entry point, then results.
 */
export default function AutomationEmptyState({ readOnly, onAddTrigger }: Props) {
  const { t } = useTranslation();
  return (
    <div className="af-empty-canvas">
      <div className="af-empty-canvas__stage">
        <button
          type="button"
          className="af-empty-trigger"
          disabled={readOnly}
          onClick={onAddTrigger}
          aria-label={t("automations.empty.chooseAria")}
        >
          <span className="af-empty-trigger__badge">{t("automations.empty.badge")}</span>
          <span className="af-empty-trigger__plus" aria-hidden>
            <Plus size={36} strokeWidth={2.5} />
          </span>
          <span className="af-empty-trigger__clock" aria-hidden title={t("automations.empty.scheduleHint")}>
            <Clock3 size={14} />
          </span>
        </button>
        <span className="af-empty-canvas__next" aria-hidden>
          <Plus size={14} />
        </span>
      </div>

      <strong>{t("automations.empty.title")}</strong>
      <p>{t("automations.empty.text")}</p>
      <button
        type="button"
        className="af-btn af-btn--primary"
        disabled={readOnly}
        onClick={onAddTrigger}
        data-demo-target="automations-add-trigger"
      >
        <Plus size={14} />
        {t("automations.empty.chooseTrigger")}
      </button>
    </div>
  );
}
