import React from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  FlaskConical,
  Loader2,
  Pause,
  Play,
  Plus,
  Save,
} from "lucide-react";
import type { AutomationWorkflow } from "../../../../../api/automationWorkflowApi";

export type BuilderSaveState = "idle" | "saving" | "saved" | "error";

type Props = {
  name: string;
  onNameChange: (value: string) => void;
  onBack: () => void;
  readOnly: boolean;
  writeBlockedTitle?: string;
  dirty: boolean;
  saveState: BuilderSaveState;
  saving: boolean;
  publishing: boolean;
  workflow: AutomationWorkflow;
  onSave: () => void;
  onPublish: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleTest: () => void;
  onOpenPicker: () => void;
  hasUnsupportedTrigger: boolean;
  triggerCatalogError: string;
};

function SaveStatus({
  dirty,
  saveState,
  workflow,
}: {
  dirty: boolean;
  saveState: BuilderSaveState;
  workflow: AutomationWorkflow;
}) {
  const { t } = useTranslation();
  if (saveState === "saving") {
    return (
      <span className="af-save-status af-save-status--saving">
        {t("automations.toolbar.saving")}
      </span>
    );
  }
  if (saveState === "error") {
    return (
      <span className="af-save-status af-save-status--error">
        {t("automations.toolbar.saveError")}
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="af-save-status af-save-status--dirty">
        {t("automations.toolbar.unsaved")}
      </span>
    );
  }
  if (saveState === "saved") {
    return (
      <span className="af-save-status af-save-status--saved">
        {t("automations.toolbar.saved")}
      </span>
    );
  }
  if (workflow.publishedVersionId) {
    return <span className="af-save-status">{t("automations.toolbar.published")}</span>;
  }
  return <span className="af-save-status">{t("automations.toolbar.draft")}</span>;
}

export default function AutomationBuilderToolbar({
  name,
  onNameChange,
  onBack,
  readOnly,
  writeBlockedTitle,
  dirty,
  saveState,
  saving,
  publishing,
  workflow,
  onSave,
  onPublish,
  onPause,
  onResume,
  onToggleTest,
  onOpenPicker,
  hasUnsupportedTrigger,
  triggerCatalogError,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="af-builder-toolbar">
      <div className="af-builder-toolbar__start">
        <button type="button" className="af-toolbar__btn" onClick={onBack}>
          <ArrowRight size={14} />
          {t("automations.toolbar.back")}
        </button>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="af-toolbar__btn af-toolbar__name"
          aria-label={t("automations.toolbar.nameAria")}
          disabled={readOnly}
          title={writeBlockedTitle || name}
          dir="auto"
          spellCheck={false}
        />
        <SaveStatus dirty={dirty} saveState={saveState} workflow={workflow} />
      </div>

      <div className="af-builder-toolbar__actions">
        <button
          type="button"
          className="af-toolbar__btn"
          disabled={readOnly}
          title={writeBlockedTitle}
          onClick={onOpenPicker}
          data-demo-target="automations-add-action"
        >
          <Plus size={14} />
          {t("automations.toolbar.addStep")}
        </button>
        <button
          type="button"
          className="af-toolbar__btn"
          disabled={readOnly}
          title={writeBlockedTitle}
          onClick={onToggleTest}
        >
          <FlaskConical size={14} />
          {t("automations.toolbar.test")}
        </button>
        <button
          type="button"
          className="af-btn af-btn--secondary"
          disabled={saving || readOnly}
          title={writeBlockedTitle}
          data-demo-target="automations-save"
          onClick={onSave}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {t("automations.toolbar.save")}
        </button>
        <button
          type="button"
          className="af-btn af-btn--primary"
          disabled={publishing || readOnly || workflow.status === "archived"}
          title={
            writeBlockedTitle ||
            (workflow.status === "archived"
              ? t("automations.toolbar.cannotPublishArchived")
              : triggerCatalogError
                ? t("automations.toolbar.reloadTriggers")
                : hasUnsupportedTrigger
                  ? t("automations.toolbar.unsupportedTrigger")
                  : workflow.status === "active"
                    ? t("automations.toolbar.updatePublished")
                    : t("automations.toolbar.publishAutomation"))
          }
          onClick={onPublish}
        >
          {publishing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          {publishing
            ? t("automations.toolbar.publishing")
            : workflow.status === "active" || workflow.publishedVersionId
              ? t("automations.toolbar.updatePublish")
              : t("automations.toolbar.publish")}
        </button>
        {workflow.status === "active" ? (
          <button
            type="button"
            className="af-toolbar__btn"
            disabled={readOnly}
            title={writeBlockedTitle}
            onClick={onPause}
          >
            <Pause size={14} />
            {t("automations.toolbar.pause")}
          </button>
        ) : workflow.status === "paused" ? (
          <button
            type="button"
            className="af-toolbar__btn"
            disabled={readOnly}
            title={writeBlockedTitle}
            onClick={onResume}
          >
            <Play size={14} />
            {t("automations.toolbar.resume")}
          </button>
        ) : null}
        {workflow.status === "active" ? (
          <span className="af-badge af-badge--active">{t("automations.toolbar.active")}</span>
        ) : workflow.status === "paused" ? (
          <span className="af-badge af-badge--paused">{t("automations.toolbar.paused")}</span>
        ) : null}
      </div>
    </div>
  );
}