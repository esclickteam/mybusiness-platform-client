import React from "react";
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
  if (saveState === "saving") {
    return <span className="af-save-status af-save-status--saving">שומר…</span>;
  }
  if (saveState === "error") {
    return <span className="af-save-status af-save-status--error">שגיאה בשמירה</span>;
  }
  if (dirty) {
    return (
      <span className="af-save-status af-save-status--dirty">
        ● שינויים שלא נשמרו
      </span>
    );
  }
  if (saveState === "saved") {
    return <span className="af-save-status af-save-status--saved">✓ נשמר</span>;
  }
  if (workflow.publishedVersionId) {
    return <span className="af-save-status">פורסם</span>;
  }
  return <span className="af-save-status">טיוטה</span>;
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
  return (
    <div className="af-builder-toolbar">
      <div className="af-builder-toolbar__start">
        <button type="button" className="af-toolbar__btn" onClick={onBack}>
          <ArrowRight size={14} />
          חזרה
        </button>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="af-toolbar__btn af-toolbar__name"
          aria-label="שם האוטומציה"
          disabled={readOnly}
          title={writeBlockedTitle}
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
        >
          <Plus size={14} />
          הוסף שלב
        </button>
        <button
          type="button"
          className="af-toolbar__btn"
          disabled={readOnly}
          title={writeBlockedTitle}
          onClick={onToggleTest}
        >
          <FlaskConical size={14} />
          בדיקה
        </button>
        <button
          type="button"
          className="af-btn af-btn--secondary"
          disabled={saving || readOnly}
          title={writeBlockedTitle}
          onClick={onSave}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          שמור
        </button>
        <button
          type="button"
          className="af-btn af-btn--primary"
          disabled={publishing || readOnly || workflow.status === "archived"}
          title={
            writeBlockedTitle ||
            (workflow.status === "archived"
              ? "לא ניתן לפרסם אוטומציה בארכיון"
              : triggerCatalogError
                ? "יש לטעון מחדש את קטלוג הטריגרים"
                : hasUnsupportedTrigger
                  ? "טריגר ישן או לא נתמך"
                  : workflow.status === "active"
                    ? "עדכון הגרסה המפורסמת לפי הטיוטה הנוכחית"
                    : "פרסום האוטומציה")
          }
          onClick={onPublish}
        >
          {publishing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          {publishing
            ? "מפרסם…"
            : workflow.status === "active" || workflow.publishedVersionId
              ? "עדכון פרסום"
              : "פרסם"}
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
            השהיה
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
            הפעלה
          </button>
        ) : null}
        {workflow.status === "active" ? (
          <span className="af-badge af-badge--active">פעילה</span>
        ) : workflow.status === "paused" ? (
          <span className="af-badge af-badge--paused">מושהית</span>
        ) : null}
      </div>
    </div>
  );
}