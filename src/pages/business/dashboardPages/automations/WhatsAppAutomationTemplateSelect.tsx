import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import type { ApprovedWhatsAppTemplate } from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
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

const MENU_GAP_PX = 4;
const MENU_VIEWPORT_PAD_PX = 8;
const MENU_MAX_HEIGHT_PX = 320;

/** Always below the field. A short viewport shrinks the list; it never flips upward. */
export function downwardTemplateMenuStyle(
  rect: Pick<DOMRect, "top" | "bottom" | "left" | "width">,
  viewport: { width: number; height: number }
): CSSProperties {
  const spaceBelow = Math.max(
    0,
    viewport.height - rect.bottom - MENU_GAP_PX - MENU_VIEWPORT_PAD_PX
  );
  const width = Math.min(
    rect.width,
    Math.max(0, viewport.width - MENU_VIEWPORT_PAD_PX * 2)
  );
  let left = rect.left;
  if (left + width > viewport.width - MENU_VIEWPORT_PAD_PX) {
    left = viewport.width - MENU_VIEWPORT_PAD_PX - width;
  }
  if (left < MENU_VIEWPORT_PAD_PX) left = MENU_VIEWPORT_PAD_PX;
  return {
    position: "fixed",
    top: rect.bottom + MENU_GAP_PX,
    left,
    width,
    maxHeight: Math.min(MENU_MAX_HEIGHT_PX, spaceBelow),
    zIndex: 1000,
  };
}

function useDownwardMenuStyle(
  open: boolean,
  buttonRef: RefObject<HTMLButtonElement | null>
) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const button = buttonRef.current;
      if (!button) return;
      const viewport = window.visualViewport;
      setStyle(
        downwardTemplateMenuStyle(button.getBoundingClientRect(), {
          width: viewport?.width ?? window.innerWidth,
          height: viewport?.height ?? window.innerHeight,
        })
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [open, buttonRef]);

  return open ? style : undefined;
}

function TemplateTwoLine({
  template,
  disabledHint = "",
}: {
  template: Partial<ApprovedWhatsAppTemplate>;
  disabledHint?: string;
}) {
  const { i18n } = useTranslation();
  return (
    <span className="af-wa-tpl-option" dir={getTextDirection(i18n.language)}>
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

function TemplateMenu({
  open,
  buttonRef,
  pageDir,
  query,
  setQuery,
  filtered,
  closedTemplate,
  savedUnsendable,
  warningKind,
  loading,
  placeholder,
  searchPlaceholder,
  searchLabel,
  emptyLabel,
}: {
  open: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  pageDir: string;
  query: string;
  setQuery: (value: string) => void;
  filtered: ApprovedWhatsAppTemplate[];
  closedTemplate: Partial<ApprovedWhatsAppTemplate> | null;
  savedUnsendable: ApprovedWhatsAppTemplate | null;
  warningKind: string;
  loading: boolean;
  placeholder: string;
  searchPlaceholder: string;
  searchLabel: string;
  emptyLabel: string;
}) {
  const menuStyle = useDownwardMenuStyle(open, buttonRef);

  return (
    <>
      <ComboboxButton
        ref={buttonRef}
        className={`af-wa-tpl-select__button${
          warningKind !== "none" ? " af-wa-tpl-select__button--warn" : ""
        }`}
      >
        {closedTemplate ? (
          <TemplateTwoLine
            template={closedTemplate}
            disabledHint={
              savedUnsendable ? TENANT_TEMPLATE_NOT_SENDABLE_HE() : ""
            }
          />
        ) : (
          <span className="af-wa-tpl-select__placeholder">{placeholder}</span>
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
        portal
        modal={false}
        className="af-wa-tpl-select__options"
        style={menuStyle}
        dir={pageDir === "ltr" ? "ltr" : "rtl"}
        data-placement="bottom"
        data-testid="wa-template-menu"
      >
        <div className="af-wa-tpl-select__search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            className="af-wa-tpl-select__search-input"
            dir={pageDir}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          />
        </div>
        <div className="af-wa-tpl-select__list">
          {filtered.length === 0 ? (
            <div className="af-wa-tpl-select__empty">{emptyLabel}</div>
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
                          sendable ? "" : TENANT_TEMPLATE_NOT_SENDABLE_HE()
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
        </div>
      </ComboboxOptions>
    </>
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
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="af-wa-tpl-select" dir={pageDir}>
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
        {({ open }) => (
          <TemplateMenu
            open={open}
            buttonRef={buttonRef}
            pageDir={pageDir}
            query={query}
            setQuery={setQuery}
            filtered={filtered}
            closedTemplate={closedTemplate}
            savedUnsendable={savedUnsendable}
            warningKind={warning.kind}
            loading={loading}
            placeholder={t("leftover.waTemplate.pick", "Choose a template")}
            searchPlaceholder={t(
              "leftover.waTemplate.searchPh",
              "Search by name, language, or category..."
            )}
            searchLabel={t(
              "leftover.waTemplate.searchAria",
              "Search WhatsApp templates"
            )}
            emptyLabel={t("leftover.waTemplate.empty", "No matching templates")}
          />
        )}
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
