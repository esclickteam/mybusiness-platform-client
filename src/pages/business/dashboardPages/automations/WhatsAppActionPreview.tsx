import { FileText, Image as ImageIcon, MapPin, Video } from "lucide-react";
import type {
  ApprovedWhatsAppTemplate,
  WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import {
  WA_PREVIEW_EMPTY_HE,
  WA_PREVIEW_ERROR_HE,
  buildWhatsAppPreviewModel,
} from "./whatsAppActionPreviewModel";

type Props = {
  template: ApprovedWhatsAppTemplate | null;
  mappings?: WhatsAppVariableMapping[];
  recipientType?: string;
  senderLabel?: string;
  hasSelection?: boolean;
};

function MediaPlaceholder({
  kind,
}: {
  kind: "image" | "video" | "document" | "location";
}) {
  const label =
    kind === "image"
      ? "תמונה"
      : kind === "video"
        ? "וידאו"
        : kind === "document"
          ? "מסמך"
          : "מיקום";
  const Icon =
    kind === "image"
      ? ImageIcon
      : kind === "video"
        ? Video
        : kind === "document"
          ? FileText
          : MapPin;
  return (
    <div className={`af-wa-preview__media af-wa-preview__media--${kind}`}>
      <Icon size={18} aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function WhatsAppActionPreview({
  template,
  mappings,
  recipientType,
  senderLabel,
  hasSelection,
}: Props) {
  let model;
  try {
    model = buildWhatsAppPreviewModel({
      template,
      mappings,
      recipientType,
      senderLabel,
      hasSelection,
    });
  } catch {
    model = buildWhatsAppPreviewModel({
      template: null,
      hasSelection: true,
      forceError: true,
      senderLabel,
      recipientType,
    });
  }

  return (
    <section className="af-wa-preview" dir="rtl" data-testid="wa-action-preview">
      <strong>תצוגה מקדימה</strong>
      {model.state === "empty" ? (
        <div className="af-wa-preview__empty">{WA_PREVIEW_EMPTY_HE}</div>
      ) : model.state === "error" ? (
        <div className="af-wa-preview__empty af-wa-preview__empty--error">
          {WA_PREVIEW_ERROR_HE}
        </div>
      ) : (
        <>
          <div className="af-wa-preview__headers">
            <span>מ: {model.senderLabel}</span>
            <span>אל: {model.recipientLabel}</span>
          </div>
          <div className="af-wa-preview__chat">
            <div className="af-wa-preview__bubble">
              {["image", "video", "document", "location"].includes(
                model.headerType
              ) ? (
                <MediaPlaceholder
                  kind={model.headerType as "image" | "video" | "document" | "location"}
                />
              ) : null}
              {model.headerText ? (
                <p className="af-wa-preview__header-text">{model.headerText}</p>
              ) : null}
              {model.body ? (
                <p className="af-wa-preview__body">{model.body}</p>
              ) : null}
              {model.footer ? (
                <p className="af-wa-preview__footer">{model.footer}</p>
              ) : null}
              {model.buttons.length > 0 ? (
                <div className="af-wa-preview__buttons">
                  {model.buttons.map((btn, index) => (
                    <div
                      key={`${btn.type}-${index}`}
                      className="af-wa-preview__button"
                      role="presentation"
                      aria-hidden="true"
                    >
                      {btn.text || `כפתור ${index + 1}`}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
