import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ApprovedWhatsAppTemplate } from "../../../../api/whatsappApi";
import {
  TENANT_TEMPLATE_NOT_SENDABLE_HE,
  buildWhatsAppTemplateSecondaryLine,
  canPersistAutomationTemplateSelection,
  filterWhatsAppTemplatesByQuery,
  isAutomationSendableTemplate,
  listAutomationPickerTemplates,
  resolveAutomationTemplateWarning,
  resolveWhatsAppTemplateDisplayName,
} from "./whatsAppTemplateSelectFormat";

export type WhatsAppAutomationTemplateSelectProps = {
  templates: ApprovedWhatsAppTemplate[];
  value: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (template: ApprovedWhatsAppTemplate | null) => void;
  savedMeta?: {
    templateId?: string;
    metaTemplateName?: string;
    language?: string;
    displayName?: string;
  };
};

function TemplateTwoLine({
  template,
  disabledHint = "",
}: {
  template: Partial<ApprovedWhatsAppTemplate>;
  disabledHint?: string;
}) {
  return (
    <span className="af-wa-tpl-option" dir="rtl">
      <span className="af-wa-tpl-option__title">
        {resolveWhatsAppTemplateDisplayName(template)}
      </span>
      <span className="af-wa-tpl-option__meta" dir="auto">
        {buildWhatsAppTemplateSecondaryLine(template)}
      </span>
      {disabledHint ? (
        <span className="af-wa-tpl-option__hint">{disabledHint}</span>
      ) : null}
    </span>
  );
}

export function WhatsAppAutomationTemplateSelect({
  templates,
  value,
  disabled = false,
  loading = false,
  onChange,
  savedMeta,
}: WhatsAppAutomationTemplateSelectProps) {
  const [query, setQuery] = useState("");

  const pickerRows = useMemo(
    () => listAutomationPickerTemplates(templates),
    [templates]
  );

  const filtered = useMemo(
    () => filterWhatsAppTemplatesByQuery(pickerRows, query),
    [pickerRows, query]
  );

  const selectedFromList =
    templates.find((tpl) => String(tpl._id) === String(value)) || null;

  const selectedSendable =
    selectedFromList && isAutomationSendableTemplate(selectedFromList)
      ? selectedFromList
      : null;

  const savedUnsendable =
    selectedFromList && !isAutomationSendableTemplate(selectedFromList)
      ? selectedFromList
      : null;

  const warning = resolveAutomationTemplateWarning({
    value,
    selected: selectedFromList,
    templates,
    savedMeta,
  });

  const unavailablePreview: Partial<ApprovedWhatsAppTemplate> | null =
    !selectedFromList &&
    Boolean(value || savedMeta?.templateId || savedMeta?.metaTemplateName)
      ? {
          _id: String(savedMeta?.templateId || value || ""),
          metaTemplateName: String(savedMeta?.metaTemplateName || ""),
          name: savedMeta?.displayName || savedMeta?.metaTemplateName || "",
          language: savedMeta?.language || "",
        }
      : null;

  const closedTemplate =
    selectedSendable || savedUnsendable || unavailablePreview;

  return (
    <div className="af-wa-tpl-select" dir="rtl">
      <Combobox
        value={selectedSendable}
        disabled={disabled || loading}
        onChange={(tpl) => {
          setQuery("");
          if (!tpl) {
            onChange(null);
            return;
          }
          if (!canPersistAutomationTemplateSelection(tpl)) {
            return;
          }
          onChange(tpl);
        }}
        onClose={() => setQuery("")}
        by={(a, b) => String(a?._id || "") === String(b?._id || "")}
      >
        <ComboboxButton
          className={`af-wa-tpl-select__button${
            warning.kind !== "none" ? " af-wa-tpl-select__button--warn" : ""
          }`}
        >
          {closedTemplate ? (
            <TemplateTwoLine
              template={closedTemplate}
              disabledHint={
                savedUnsendable ? TENANT_TEMPLATE_NOT_SENDABLE_HE : ""
              }
            />
          ) : (
            <span className="af-wa-tpl-select__placeholder">בחרו תבנית</span>
          )}
          <span className="af-wa-tpl-select__chevron" aria-hidden>
            {loading ? (
              <Loader2 size={16} className="af-spin" />
            ) : (
              <ChevronsUpDown size={16} />
            )}
          </span>
        </ComboboxButton>

        <ComboboxOptions
          anchor="bottom end"
          className="af-wa-tpl-select__options"
        >
          <div className="af-wa-tpl-select__search">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="חיפוש לפי שם, שפה או קטגוריה..."
              aria-label="חיפוש תבניות WhatsApp"
              className="af-wa-tpl-select__search-input"
              dir="rtl"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            />
          </div>
          {filtered.length === 0 ? (
            <div className="af-wa-tpl-select__empty">לא נמצאו תבניות מתאימות</div>
          ) : (
            filtered.map((tpl) => {
              const sendable = isAutomationSendableTemplate(tpl);
              return (
                <ComboboxOption
                  key={tpl._id}
                  value={tpl}
                  disabled={!sendable}
                  className={`af-wa-tpl-select__option${
                    sendable ? "" : " af-wa-tpl-select__option--disabled"
                  }`}
                >
                  {({ selected: isSelected }) => (
                    <>
                      <TemplateTwoLine
                        template={tpl}
                        disabledHint={
                          sendable ? "" : TENANT_TEMPLATE_NOT_SENDABLE_HE
                        }
                      />
                      {isSelected && sendable ? (
                        <Check
                          size={16}
                          className="af-wa-tpl-select__check"
                          aria-hidden
                        />
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              );
            })
          )}
        </ComboboxOptions>
      </Combobox>

      {warning.kind !== "none" ? (
        <p
          className={`af-wa-tpl-select__warn${
            warning.kind === "tenant_not_sendable"
              ? " af-wa-tpl-select__warn--info"
              : ""
          }`}
          role="status"
        >
          {warning.message}
        </p>
      ) : null}
    </div>
  );
}

export default WhatsAppAutomationTemplateSelect;
