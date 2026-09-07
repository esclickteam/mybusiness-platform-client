import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { localizeBuiltInTemplateSeed } from "../../../../i18n/localizeBuiltInTemplateSeed";
import type { TFunction } from "i18next";
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

const VAR_KEYS: Record<string, string> = {
  "{{appointment.clientName}}": "automations.editor.mapping.clientName",
  "{{business.name}}": "automations.editor.mapping.businessName",
  "{{appointment.date}}": "automations.editor.mapping.date",
  "{{appointment.time}}": "automations.editor.mapping.appointmentTime",
  "{{appointment.duration}}": "automations.emailFields.varDuration",
  "{{appointment.serviceName}}": "automations.editor.mapping.service",
  "{{appointment.location}}": "automations.emailFields.varLocation",
  "{{appointment.notes}}": "automations.emailFields.varNotes",
  "{{lead.name}}": "automations.editor.mapping.leadName",
  "{{lead.email}}": "automations.editor.mapping.leadEmail",
  "{{lead.phone}}": "automations.editor.mapping.leadPhone",
  "{{lead.source}}": "automations.editor.mapping.leadSource",
  "{{customer.firstName}}": "automations.emailFields.varFirstName",
  "{{customer.fullName}}": "automations.editor.mapping.clientName",
  "{{order.number}}": "automations.emailFields.varOrderNumber",
  "{{order.total}}": "automations.emailFields.varOrderTotal",
  "{{order.items}}": "automations.emailFields.varOrderItems",
  "{{order.shippingAddress}}": "automations.emailFields.varShippingAddress",
  "{{store.name}}": "automations.emailFields.varStoreName",
  "{{customer.email}}": "automations.emailFields.varCustomerEmail",
  "{{customer.phone}}": "automations.emailFields.varCustomerPhone",
  "{{order.productName}}": "automations.emailFields.varProductName",
  "{{order.variant}}": "automations.emailFields.varVariant",
  "{{order.quantity}}": "automations.emailFields.varQuantity",
  "{{order.subtotal}}": "automations.emailFields.varSubtotal",
  "{{order.discount}}": "automations.emailFields.varDiscount",
  "{{order.shipping}}": "automations.emailFields.varShipping",
  "{{order.tax}}": "automations.emailFields.varTax",
  "{{order.viewUrl}}": "automations.emailFields.varOrderUrl",
};

const VAR_FALLBACKS: Record<string, string> = {
  "automations.emailFields.varDuration": "Appointment duration",
  "automations.emailFields.varLocation": "Location",
  "automations.emailFields.varNotes": "Notes",
  "automations.emailFields.varFirstName": "First name",
  "automations.emailFields.varOrderNumber": "Order number",
  "automations.emailFields.varOrderTotal": "Total",
  "automations.emailFields.varOrderItems": "Items",
  "automations.emailFields.varShippingAddress": "Shipping address",
  "automations.emailFields.varStoreName": "Store name",
  "automations.emailFields.varCustomerEmail": "Customer email",
  "automations.emailFields.varCustomerPhone": "Customer phone",
  "automations.emailFields.varProductName": "Product name",
  "automations.emailFields.varVariant": "Variant",
  "automations.emailFields.varQuantity": "Quantity",
  "automations.emailFields.varSubtotal": "Subtotal",
  "automations.emailFields.varDiscount": "Discount",
  "automations.emailFields.varShipping": "Shipping",
  "automations.emailFields.varTax": "Tax",
  "automations.emailFields.varOrderUrl": "Order link",
};

function variableLabel(token: string, fallback: string, t: TFunction) {
  const key = VAR_KEYS[token];
  if (!key) return fallback;
  return t(key, VAR_FALLBACKS[key] || fallback);
}

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
  const { t, i18n } = useTranslation();
  const focusRef = useRef<EmailField>("html");
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const htmlRef = useRef<HTMLTextAreaElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const variables = emailVariablesForTrigger(triggerKey);
  const previewContext = localizeBuiltInTemplateSeed(
    buildEmailPreviewContext(triggerKey, { businessName }),
    i18n.language,
  );
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
      <div className="af-email-vars" dir={getTextDirection(i18n.language)}>
        <strong className="af-email-vars__label">
          {t("automations.emailFields.availableVars", "Available variables")}
        </strong>
        <p className="af-email-vars__hint">
          {t(
            "automations.emailFields.varsHint",
            "Click to insert into the focused field (subject, HTML, or text)"
          )}
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
              {variableLabel(item.token, item.label, t)}
              {item.optional ? ` (${t("automations.common.optional")})` : ""}
            </button>
          ))}
        </div>
      </div>

      <label>
        {t("automations.emailFields.subject", "Subject")}
        <input
          ref={subjectRef}
          type="text"
          disabled={readOnly}
          value={subject}
          placeholder={t("automations.emailFields.subjectPh", {
            token: "{{business.name}}",
            defaultValue: "Message from {{token}}",
          })}
          onFocus={() => {
            focusRef.current = "subject";
          }}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </label>

      <label>
        {t("automations.emailFields.html", "Content (HTML)")}
        <textarea
          ref={htmlRef}
          rows={8}
          disabled={readOnly}
          value={html}
          placeholder={t("automations.emailFields.htmlPh", {
            token: "{{lead.name}}",
            defaultValue: '<div dir="ltr"><p>Hello {{token}}</p></div>',
          })}
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
        {t("automations.emailFields.plainText", "Plain text (optional)")}
        <textarea
          ref={textRef}
          rows={3}
          disabled={readOnly}
          value={text}
          placeholder={t(
            "automations.emailFields.textPh",
            "Plain-text version without HTML"
          )}
          onFocus={() => {
            focusRef.current = "text";
          }}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>

      <div className="af-gmail-preview" dir={getTextDirection(i18n.language)}>
        <strong>{t("automations.emailFields.preview", "Preview")}</strong>
        <div className="af-gmail-preview__headers">
          <span>
            {t("automations.emailFields.fromLine", {
              value: previewFromLabel,
              defaultValue: "From: {{value}}",
            })}
          </span>
          <span>
            {t("automations.emailFields.toLine", {
              value: previewToLabel,
              defaultValue: "To: {{value}}",
            })}
          </span>
          <span>
            {t("automations.emailFields.subjectLine", {
              value: previewSubject.trim() || t("automations.common.none"),
              defaultValue: "Subject: {{value}}",
            })}
          </span>
        </div>
        {!previewHtml.trim() && !previewText.trim() ? (
          <div className="af-gmail-preview__empty">
            {t("automations.emailFields.emptyPreview", "No content to preview yet")}
          </div>
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
