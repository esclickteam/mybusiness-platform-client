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
  buildWhatsAppTemplateSecondaryLine,
  filterWhatsAppTemplatesByQuery,
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
}: {
  template: Partial<ApprovedWhatsAppTemplate>;
}) {
  return (
    <span className="af-wa-tpl-option" dir="rtl">
      <span className="af-wa-tpl-option__title">
        {resolveWhatsAppTemplateDisplayName(template)}
      </span>
      <span className="af-wa-tpl-option__meta" dir="auto">
        {buildWhatsAppTemplateSecondaryLine(template)}
      </span>
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

  const selectable = useMemo(
    () =>
      templates.filter((tpl) => {
        if (tpl.isTestTemplate) return false;
        if (tpl.automationSendable === false) return false;
        return true;
      }),
    [templates]
  );

  const filtered = useMemo(
    () => filterWhatsAppTemplatesByQuery(selectable, query),
    [selectable, query]
  );

  const selected =
    selectable.find((tpl) => String(tpl._id) === String(value)) ||
    templates.find((tpl) => String(tpl._id) === String(value)) ||
    null;

  const savedUnavailable =
    Boolean(value || savedMeta?.templateId || savedMeta?.metaTemplateName) &&
    !selected &&
    Boolean(savedMeta?.metaTemplateName || value);

  const unavailablePreview: Partial<ApprovedWhatsAppTemplate> | null =
    savedUnavailable
      ? {
          _id: String(savedMeta?.templateId || value || ""),
          metaTemplateName: String(savedMeta?.metaTemplateName || ""),
          name: savedMeta?.displayName || savedMeta?.metaTemplateName || "",
          language: savedMeta?.language || "",
        }
      : null;

  return (
    <div className="af-wa-tpl-select" dir="rtl">
      <Combobox
        value={selected}
        disabled={disabled || loading}
        onChange={(tpl) => {
          setQuery("");
          onChange(tpl);
        }}
        onClose={() => setQuery("")}
        by={(a, b) => String(a?._id || "") === String(b?._id || "")}
      >
        <ComboboxButton className="af-wa-tpl-select__button">
          {selected ? (
            <TemplateTwoLine template={selected} />
          ) : unavailablePreview ? (
            <TemplateTwoLine template={unavailablePreview} />
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
            filtered.map((tpl) => (
              <ComboboxOption
                key={tpl._id}
                value={tpl}
                className="af-wa-tpl-select__option"
              >
                {({ selected: isSelected }) => (
                  <>
                    <TemplateTwoLine template={tpl} />
                    {isSelected ? (
                      <Check
                        size={16}
                        className="af-wa-tpl-select__check"
                        aria-hidden
                      />
                    ) : null}
                  </>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

      {savedUnavailable ? (
        <p className="af-wa-tpl-select__warn" role="status">
          התבנית אינה מאושרת כרגע ולא ניתן לשלוח אותה.
        </p>
      ) : null}
    </div>
  );
}

export default WhatsAppAutomationTemplateSelect;
