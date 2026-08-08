import React, { useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FilePlus2, LayoutTemplate, Loader2, Sparkles, X } from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  isAutomationsReadOnly,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";

type Props = {
  open: boolean;
  businessId: string | null;
  readOnly: boolean;
  onClose: () => void;
};

/**
 * AI text-to-automation is not implemented yet.
 * Keep the option visible as Beta / Coming soon — never fake-create.
 */
const AI_TEXT_CREATION_AVAILABLE = false;

export default function CreateAutomationModal({
  open,
  businessId,
  readOnly,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const titleId = useId();
  const [aiPrompt, setAiPrompt] = useState("");
  const [creatingBlank, setCreatingBlank] = useState(false);

  useEffect(() => {
    if (!open) {
      setAiPrompt("");
      setCreatingBlank(false);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const handleBlank = async () => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      // keep toast via parent pattern — modal can also surface via alert-less path
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setCreatingBlank(true);
    try {
      const created = await createAutomationWorkflow(businessId, {
        useStarter: true,
        name: "אוטומציה חדשה",
      });
      toast.success("האוטומציה מוכנה לעריכה על הבד");
      onClose();
      navigate(
        `/business/${businessId}/dashboard/automations/${created._id}`
      );
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
    } finally {
      setCreatingBlank(false);
    }
  };

  const handleTemplates = () => {
    onClose();
    if (businessId) {
      navigate(`/business/${businessId}/dashboard/automations/templates`);
    } else {
      navigate("templates");
    }
  };

  return (
    <div
      className="ax-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="ax-create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="ax-create-modal__close"
          aria-label="סגור"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <header className="ax-create-modal__header">
          <h2 id={titleId}>צור אוטומציה</h2>
          <p>בחר איך להתחיל</p>
        </header>

        <section className="ax-create-modal__ai">
          <div className="ax-create-modal__ai-head">
            <span className="ax-create-modal__ai-icon" aria-hidden>
              <Sparkles size={16} />
            </span>
            <div>
              <strong>מה תרצה להפוך לאוטומטי?</strong>
              <em className="ax-badge ax-badge--draft">Beta · בקרוב</em>
            </div>
          </div>
          <textarea
            className="ax-create-modal__textarea"
            rows={3}
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            placeholder="כשנכנס ליד חדש, שלח מייל ולאחר יום צור משימת מעקב"
            disabled={!AI_TEXT_CREATION_AVAILABLE}
          />
          <button
            type="button"
            className="ax-btn ax-btn--primary ax-create-modal__ai-cta"
            disabled
            title="יצירה עם AI מטקסט תהיה זמינה בקרוב"
          >
            צור עם AI
          </button>
        </section>

        <div className="ax-create-modal__divider" role="separator">
          <span>או</span>
        </div>

        <div className="ax-create-modal__choices">
          <button
            type="button"
            className="ax-create-choice"
            disabled={!businessId || creatingBlank || readOnly}
            title={writeBlockedTitle}
            onClick={() => void handleBlank()}
          >
            <span className="ax-create-choice__icon">
              {creatingBlank ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FilePlus2 size={18} />
              )}
            </span>
            <span className="ax-create-choice__text">
              <strong>אוטומציה ריקה</strong>
              <em>התחל מהבד ובנה את הזרימה בעצמך</em>
            </span>
          </button>

          <button
            type="button"
            className="ax-create-choice"
            onClick={handleTemplates}
          >
            <span className="ax-create-choice__icon">
              <LayoutTemplate size={18} />
            </span>
            <span className="ax-create-choice__text">
              <strong>תבניות</strong>
              <em>התחל מתהליך מוכן והתאם אותו לעסק</em>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
