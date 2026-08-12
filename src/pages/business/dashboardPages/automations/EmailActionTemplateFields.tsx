import React, { useRef } from "react";
import {
  emailVariablesForTrigger,
  insertTokenAtCursor,
  interpolateEmailTemplate,
  buildEmailPreviewContext,
} from "./appointmentConfirmationEmail";

type EmailField = "subject" | "html" | "text";

type Props = {
  triggerKey: string;
  readOnly?: boolean;
  subject: string;
  html: string;
  text: string;
  onChange: (patch: {
    subject?: string;
    html?: string;
    body?: string;
    text?: string;
  }) => void;
  previewFromLabel: string;
  previewToLabel: string;
  businessName?: string;
};

export function EmailActionTemplateFields({
  triggerKey,
  readOnly = false,
  subject,
  html,
  text,
  onChange,
  previewFromLabel,
  previewToLabel,
  businessName,
}: Props) {
  const focusRef = useRef<EmailField>("html");
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const htmlRef = useRef<HTMLTextAreaElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const variables = emailVariablesForTrigger(triggerKey);
  const previewContext = buildEmailPreviewContext(triggerKey, { businessName });
  const previewSubject = interpolateEmailTemplate(subject, previewContext);
  const previewHtml = interpolateEmailTemplate(html, previewContext);
  const previewText = interpolateEmailTemplate(text, previewContext);

  const insertToken = (token: string) => {
    if (readOnly) return;
    const field = focusRef.current;
    if (field === "subject") {
      const el = subjectRef.current;
      const next = insertTokenAtCursor(
        subject,
        token,
        el?.selectionStart,
        el?.selectionEnd
      );
      onChange({ subject: next });
      return;
    }
    if (field === "text") {
      const el = textRef.current;
      const next = insertTokenAtCursor(
        text,
        token,
        el?.selectionStart,
        el?.selectionEnd
      );
      onChange({ text: next });
      return;
    }
    const el = htmlRef.current;
    const next = insertTokenAtCursor(
      html,
      token,
      el?.selectionStart,
      el?.selectionEnd
    );
    onChange({ html: next, body: next });
  };

  return (
    <>
      <div className="af-email-vars" dir="rtl">
        <strong className="af-email-vars__label">משתנים זמינים</strong>
        <p className="af-email-vars__hint">
          לחצו כדי להוסיף לשדה המסומן (נושא, HTML או טקסט)
        </p>
        <div className="af-email-vars__chips">
          {variables.map((item) => (
            <button
              key={item.token}
              type="button"
              className="af-email-vars__chip"
              disabled={readOnly}
              title={item.token}
              onClick={() => insertToken(item.token)}
            >
              {item.label}
              {item.optional ? " (אופציונלי)" : ""}
            </button>
          ))}
        </div>
      </div>

      <label>
        נושא
        <input
          ref={subjectRef}
          type="text"
          disabled={readOnly}
          value={subject}
          placeholder="הודעה מ{{business.name}}"
          onFocus={() => {
            focusRef.current = "subject";
          }}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </label>

      <label>
        תוכן (HTML)
        <textarea
          ref={htmlRef}
          rows={8}
          disabled={readOnly}
          value={html}
          placeholder='<div dir="rtl"><p>שלום {{lead.name}}</p></div>'
          onFocus={() => {
            focusRef.current = "html";
          }}
          onChange={(e) =>
            onChange({
              html: e.target.value,
              body: e.target.value,
            })
          }
        />
      </label>

      <label>
        טקסט פשוט (אופציונלי)
        <textarea
          ref={textRef}
          rows={3}
          disabled={readOnly}
          value={text}
          placeholder="גרסת טקסט ללא HTML"
          onFocus={() => {
            focusRef.current = "text";
          }}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>

      <div className="af-gmail-preview" dir="rtl">
        <strong>תצוגה מקדימה</strong>
        <div className="af-gmail-preview__headers">
          <span>מ: {previewFromLabel}</span>
          <span>אל: {previewToLabel}</span>
          <span>נושא: {previewSubject.trim() || "—"}</span>
        </div>
        {!previewHtml.trim() && !previewText.trim() ? (
          <div className="af-gmail-preview__empty">אין עדיין תוכן להצגה</div>
        ) : (
          <>
            {previewHtml.trim() ? (
              <div
                className="af-gmail-preview__body"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : null}
            {previewText.trim() ? (
              <pre className="af-gmail-preview__text">{previewText}</pre>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
