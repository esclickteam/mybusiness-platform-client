import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Copy,
  CornerUpLeft,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MapPin,
  Phone,
  PlayCircle,
  Plus,
  X,
} from "lucide-react";
import type {
  WhatsAppHeaderType,
  WhatsAppTemplateButton,
} from "@/api/whatsappApi";
import "./whatsappMetaTemplateWizard.css";

type ButtonType = WhatsAppTemplateButton["type"];
type VariableType = "number" | "name";
type MediaSample = "none" | "image" | "video" | "document" | "location";

const HEADER_TEXT_MAX = 60;
const BODY_MAX = 1024;
const FOOTER_MAX = 60;
const BUTTON_TEXT_MAX = 25;
const URL_MAX = 2000;
const MAX_BUTTONS = 10;

const VARIABLE_OPTIONS: Array<{ value: VariableType; label: string }> = [
  { value: "name", label: "שם" },
  { value: "number", label: "מספר" },
];

const MEDIA_OPTIONS: Array<{
  value: MediaSample;
  label: string;
  Icon?: typeof ImageIcon;
}> = [
  { value: "none", label: "בלי" },
  { value: "image", label: "תמונה", Icon: ImageIcon },
  { value: "video", label: "סרטון", Icon: PlayCircle },
  { value: "document", label: "מסמך", Icon: FileText },
  { value: "location", label: "מיקום", Icon: MapPin },
];

const BUTTON_MENU: Array<{
  type: ButtonType;
  title: string;
  description: string;
  Icon: typeof Copy;
}> = [
  {
    type: "quick_reply",
    title: "בהתאמה אישית",
    description: "הלקוח שולח תשובה קצרה בלחיצה אחת.",
    Icon: CornerUpLeft,
  },
  {
    type: "url",
    title: "ביקור באתר האינטרנט",
    description: "פותח כתובת אתר סטטית או דינמית.",
    Icon: ExternalLink,
  },
  {
    type: "phone_number",
    title: "התקשרות למספר הטלפון",
    description: "מתקשר למספר שהוגדר מראש.",
    Icon: Phone,
  },
  {
    type: "copy_code",
    title: "העתקת קוד",
    description: "מעתיק קוד מבצע או קוד אימות ללוח.",
    Icon: Copy,
  },
];

function extractVariables(text: string): string[] {
  const matches = text.matchAll(/\{\{\s*([1-9]\d*)\s*\}\}/g);
  return [...new Set([...matches].map((match) => match[1]))].sort(
    (a, b) => Number(a) - Number(b)
  );
}

function nextVariableIndex(text: string): number {
  const vars = extractVariables(text).map(Number);
  return vars.length ? Math.max(...vars) + 1 : 1;
}

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string
): string {
  return `${value.slice(0, start)}${before}${value.slice(start, end) || "טקסט"}${after}${value.slice(end)}`;
}

function buttonTypeLabel(type: ButtonType): string {
  return BUTTON_MENU.find((item) => item.type === type)?.title || type;
}

function defaultButton(type: ButtonType): WhatsAppTemplateButton {
  return {
    type,
    text:
      type === "url"
        ? "ביקור באתר"
        : type === "phone_number"
          ? "התקשרות"
          : type === "copy_code"
            ? "העתקת קוד"
            : "תשובה מהירה",
    url: type === "url" ? "" : undefined,
    urlType: type === "url" ? "static" : undefined,
    phoneNumber: type === "phone_number" ? "" : undefined,
    exampleUrl: type === "copy_code" ? "" : undefined,
  };
}

function mediaFromHeader(headerType: WhatsAppHeaderType): MediaSample {
  if (
    headerType === "image" ||
    headerType === "video" ||
    headerType === "document" ||
    headerType === "location"
  ) {
    return headerType;
  }
  return "none";
}

function resolveHeaderType(
  media: MediaSample,
  headerText: string
): WhatsAppHeaderType {
  if (media !== "none") return media;
  return headerText.trim() ? "text" : "none";
}

function MetaSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  info,
  radioEnd,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; Icon?: typeof ImageIcon }>;
  onChange: (value: T) => void;
  info?: boolean;
  radioEnd?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const button = btnRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setUp(spaceBelow < 280 && rect.top > spaceBelow);
    };
    place();
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || btnRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className="wa-meta-dd">
      <div className="wa-meta-dd__label">
        <span>{label}</span>
        {info ? (
          <span className="wa-meta-dd__info" aria-hidden>
            i
          </span>
        ) : null}
      </div>
      <button
        ref={btnRef}
        type="button"
        className={`wa-meta-dd__trigger ${open ? "is-open" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className={`wa-meta-dd__menu ${up ? "is-up" : ""} ${radioEnd ? "is-radio-end" : ""}`}
          role="listbox"
        >
          {options.map((option) => {
            const Icon = option.Icon;
            const selectedOption = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selectedOption}
                className={selectedOption ? "is-selected" : ""}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="wa-meta-dd__radio" />
                <span className="wa-meta-dd__option">
                  {Icon ? (
                    <span className="wa-meta-dd__option-icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                  ) : null}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WhatsAppMetaTemplateContent({
  headerType,
  headerText,
  headerMediaUrl,
  body,
  footer,
  buttons,
  exampleValues,
  variableType = "number",
  showHeader = true,
  allowedButtons,
  bodyPlaceholder = "כתבו את גוף ההודעה. השתמשו ב-{{1}} למשתנים.",
  onChange,
}: {
  headerType: WhatsAppHeaderType;
  headerText: string;
  headerMediaUrl: string;
  body: string;
  footer: string;
  buttons: WhatsAppTemplateButton[];
  exampleValues: Record<string, string>;
  variableType?: VariableType;
  showHeader?: boolean;
  allowedButtons: ButtonType[];
  bodyPlaceholder?: string;
  onChange: (patch: {
    headerType?: WhatsAppHeaderType;
    headerText?: string;
    headerMediaUrl?: string;
    body?: string;
    footer?: string;
    buttons?: WhatsAppTemplateButton[];
    exampleValues?: Record<string, string>;
    variableType?: VariableType;
  }) => void;
}) {
  const headerRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUp, setMenuUp] = useState(false);
  const media = mediaFromHeader(headerType);
  const variables = extractVariables(`${headerText}\n${body}`);
  const buttonMenu = BUTTON_MENU.filter((item) =>
    allowedButtons.includes(item.type)
  );

  useEffect(() => {
    if (!menuOpen) return;
    const place = () => {
      const button = addBtnRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuUp(spaceBelow < 320 && rect.top > spaceBelow);
    };
    place();
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || addBtnRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  const insertAt = (
    el: HTMLInputElement | HTMLTextAreaElement | null,
    value: string,
    token: string,
    key: "headerText" | "body"
  ) => {
    if (!el) {
      onChange({ [key]: `${value}${token}` });
      return;
    }
    const start = el.selectionStart ?? value.length;
    onChange({
      [key]: `${value.slice(0, start)}${token}${value.slice(start)}`,
    });
  };

  const insertHeaderVariable = () => {
    insertAt(
      headerRef.current,
      headerText,
      `{{${nextVariableIndex(`${headerText}\n${body}`)}}}` ,
      "headerText"
    );
  };

  const insertBodyVariable = () => {
    insertAt(
      bodyRef.current,
      body,
      `{{${nextVariableIndex(`${headerText}\n${body}`)}}}` ,
      "body"
    );
  };

  const insertFormat = (before: string, after: string) => {
    const el = bodyRef.current;
    if (!el) return;
    onChange({
      body: wrapSelection(body, el.selectionStart, el.selectionEnd, before, after),
    });
  };

  const setMedia = (next: MediaSample) => {
    onChange({
      headerType: resolveHeaderType(next, headerText),
      headerMediaUrl: next === "none" || next === "location" ? "" : headerMediaUrl,
    });
  };

  const setHeaderText = (next: string) => {
    onChange({
      headerText: next,
      headerType: resolveHeaderType(media, next),
    });
  };

  const addButton = (type: ButtonType) => {
    if (buttons.length >= MAX_BUTTONS) return;
    onChange({ buttons: [...buttons, defaultButton(type)] });
    setMenuOpen(false);
  };

  const updateButton = (
    index: number,
    patch: Partial<WhatsAppTemplateButton>
  ) => {
    onChange({
      buttons: buttons.map((button, i) =>
        i === index ? { ...button, ...patch } : button
      ),
    });
  };

  return (
    <div className="wa-meta-content">
      <div className="wa-meta-content__intro">
        <h4>תוכן</h4>
        <p className="wa-meta-help">
          יש להוסיף כותרת, גוף וחתימה לתבנית שלכם. המשתנים נכתבים במבנה {"{{1}}"}
          , {"{{2}}"}.
        </p>
      </div>

      {showHeader && (
        <>
          <MetaSelect
            label="סוג המשתנה"
            info
            value={variableType}
            options={VARIABLE_OPTIONS}
            onChange={(next) => onChange({ variableType: next })}
          />

          <MetaSelect
            label="דגימת מדיה · לא חובה"
            value={media}
            options={MEDIA_OPTIONS}
            radioEnd
            onChange={setMedia}
          />

          {(media === "image" || media === "video" || media === "document") && (
            <label className="wa-meta-content__field">
              <span className="wa-meta-label">
                {media === "image"
                  ? "מזהה מדיה לתמונה"
                  : media === "video"
                    ? "מזהה מדיה לסרטון"
                    : "מזהה מדיה למסמך"}
              </span>
              <input
                className="wa-meta-input"
                dir="ltr"
                value={headerMediaUrl}
                onChange={(e) => onChange({ headerMediaUrl: e.target.value })}
                placeholder="מזהה מדיה שהתקבל מהעלאה"
              />
            </label>
          )}

          <section className="wa-meta-content__block">
            <div className="wa-meta-field-row">
              <span className="wa-meta-label">כותרת · לא חובה</span>
              <span className="wa-meta-counter">
                {headerText.length}/{HEADER_TEXT_MAX}
              </span>
            </div>
            <input
              ref={headerRef}
              className="wa-meta-input"
              maxLength={HEADER_TEXT_MAX}
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="הוספת שורת טקסט קצרה לכותרת ההודעה"
            />
            <button
              type="button"
              className="wa-meta-link-btn"
              onClick={insertHeaderVariable}
            >
              + הוספת משתנה
            </button>
          </section>
        </>
      )}

      <section className="wa-meta-content__block">
        <h5>גוף</h5>
        <div className="wa-meta-toolbar-row">
          <div className="wa-meta-toolbar">
            <button type="button" onClick={insertBodyVariable}>
              + משתנה
            </button>
            <button type="button" onClick={() => insertFormat("```", "```")}>
              קוד
            </button>
            <button type="button" onClick={() => insertFormat("~", "~")}>
              קו חוצה
            </button>
            <button type="button" onClick={() => insertFormat("_", "_")}>
              נטוי
            </button>
            <button type="button" onClick={() => insertFormat("*", "*")}>
              מודגש
            </button>
          </div>
          <span className="wa-meta-counter">
            {body.length}/{BODY_MAX}
          </span>
        </div>
        <textarea
          ref={bodyRef}
          className="wa-meta-textarea"
          maxLength={BODY_MAX}
          value={body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder={bodyPlaceholder}
        />
        <p className="wa-meta-help">
          אפשר להוסיף משתנים במבנה {"{{1}}"}, {"{{2}}"}. התצוגה המקדימה מתעדכנת
          בזמן אמת.
        </p>
      </section>

      {variables.length > 0 && (
        <section className="wa-meta-content__block">
          <h5>ערכי דוגמה למשתנים</h5>
          <p className="wa-meta-help">מטא דורשת דוגמאות לכל משתנה לפני בדיקה.</p>
          <div className="wa-meta-var-grid">
            {variables.map((variable) => (
              <label key={variable}>
                <span className="wa-meta-label">{`{{${variable}}}`}</span>
                <input
                  className="wa-meta-input"
                  value={exampleValues[variable] || ""}
                  onChange={(e) =>
                    onChange({
                      exampleValues: {
                        ...exampleValues,
                        [variable]: e.target.value,
                      },
                    })
                  }
                  placeholder="ערך לדוגמה"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="wa-meta-content__block">
        <div className="wa-meta-field-row">
          <h5>כותרת תחתונה · לא חובה</h5>
          <span className="wa-meta-counter">
            {footer.length}/{FOOTER_MAX}
          </span>
        </div>
        <p className="wa-meta-help">טקסט קצר בתחתית ההודעה. אפשר להשאיר ריק.</p>
        <input
          className="wa-meta-input"
          maxLength={FOOTER_MAX}
          value={footer}
          onChange={(e) => onChange({ footer: e.target.value })}
          placeholder="לדוגמה: אל תשיבו להודעה זו"
        />
      </section>

      <section className="wa-meta-content__block">
        <h5>לחצנים · לא חובה</h5>
        <p className="wa-meta-help">
          יצירת לחצנים שיאפשרו ללקוחות להשיב להודעה שלכם או לבצע פעולה. ניתן
          להוסיף עד {MAX_BUTTONS} לחצנים.
        </p>
        <div className="wa-meta-add-wrap">
          <button
            ref={addBtnRef}
            type="button"
            className="wa-meta-add-btn"
            disabled={buttons.length >= MAX_BUTTONS}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Plus className="h-4 w-4" />
            הוספת לחצן
            <ChevronDown className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className={`wa-meta-menu ${menuUp ? "is-up" : ""}`}
              role="menu"
            >
              {buttonMenu.map((item) => {
                const Icon = item.Icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    role="menuitem"
                    onClick={() => addButton(item.type)}
                  >
                    <span className="wa-meta-menu__icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="wa-meta-menu__copy">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {buttons.map((btn, index) => (
          <div key={`${btn.type}-${index}`} className="wa-meta-button-card">
            <header>
              <strong>{buttonTypeLabel(btn.type)}</strong>
              <button
                type="button"
                className="wa-meta-icon-btn"
                onClick={() =>
                  onChange({
                    buttons: buttons.filter((_, i) => i !== index),
                  })
                }
                aria-label="הסרת לחצן"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            {btn.type !== "copy_code" && (
              <label>
                <div className="wa-meta-field-row">
                  <span className="wa-meta-label">טקסט הלחצן</span>
                  <span className="wa-meta-counter">
                    {btn.text.length}/{BUTTON_TEXT_MAX}
                  </span>
                </div>
                <input
                  className="wa-meta-input"
                  maxLength={BUTTON_TEXT_MAX}
                  value={btn.text}
                  onChange={(e) => updateButton(index, { text: e.target.value })}
                />
              </label>
            )}
            {btn.type === "url" && (
              <>
                <label>
                  <span className="wa-meta-label">סוג כתובת</span>
                  <select
                    className="wa-meta-select"
                    value={btn.urlType || "static"}
                    onChange={(e) =>
                      updateButton(index, {
                        urlType: e.target.value as "static" | "dynamic",
                      })
                    }
                  >
                    <option value="static">סטטית</option>
                    <option value="dynamic">דינמית</option>
                  </select>
                </label>
                <label>
                  <div className="wa-meta-field-row">
                    <span className="wa-meta-label">כתובת אתר</span>
                    <span className="wa-meta-counter">
                      {(btn.url || "").length}/{URL_MAX}
                    </span>
                  </div>
                  <input
                    className="wa-meta-input"
                    dir="ltr"
                    maxLength={URL_MAX}
                    value={btn.url || ""}
                    onChange={(e) => updateButton(index, { url: e.target.value })}
                    placeholder="https://www.example.com"
                  />
                </label>
                {btn.urlType === "dynamic" && (
                  <label>
                    <span className="wa-meta-label">כתובת לדוגמה</span>
                    <input
                      className="wa-meta-input"
                      dir="ltr"
                      value={btn.exampleUrl || ""}
                      onChange={(e) =>
                        updateButton(index, { exampleUrl: e.target.value })
                      }
                      placeholder="https://www.example.com/offer"
                    />
                  </label>
                )}
              </>
            )}
            {btn.type === "phone_number" && (
              <label>
                <span className="wa-meta-label">מספר טלפון</span>
                <input
                  className="wa-meta-input"
                  dir="ltr"
                  value={btn.phoneNumber || ""}
                  onChange={(e) =>
                    updateButton(index, { phoneNumber: e.target.value })
                  }
                  placeholder="+972501234567"
                />
              </label>
            )}
            {btn.type === "copy_code" && (
              <label>
                <span className="wa-meta-label">קוד לדוגמה</span>
                <input
                  className="wa-meta-input"
                  dir="ltr"
                  value={btn.exampleUrl || ""}
                  onChange={(e) =>
                    updateButton(index, { exampleUrl: e.target.value })
                  }
                  placeholder="123456"
                />
              </label>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export function metaButtonTypeLabel(type: WhatsAppTemplateButton["type"]) {
  return buttonTypeLabel(type);
}
