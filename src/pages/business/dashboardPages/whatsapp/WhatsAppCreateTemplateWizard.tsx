import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  saveWhatsAppTemplateDraft,
  submitWhatsAppTemplateToMeta,
  type WhatsAppTemplateButton,
  type WhatsAppTemplateSubmitPayload,
} from "@/api/whatsappApi";
import "./whatsappMetaTemplateWizard.css";

type MetaCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";
type HeaderType = "none" | "text" | "image" | "video" | "document";
type TemplateKind = "default" | "catalog" | "flows" | "call_permission" | "otp";
type Step = 0 | 1 | 2;
type ButtonType = WhatsAppTemplateButton["type"];

type FormState = {
  name: string;
  language: string;
  metaCategory: MetaCategory;
  templateKind: TemplateKind;
  headerType: HeaderType;
  headerText: string;
  headerHandle: string;
  body: string;
  footer: string;
  securityRecommendation: boolean;
  buttons: WhatsAppTemplateButton[];
  exampleValues: Record<string, string>;
};

const NAME_MAX = 512;
const HEADER_TEXT_MAX = 60;
const BODY_MAX = 1024;
const FOOTER_MAX = 60;
const BUTTON_TEXT_MAX = 25;
const URL_MAX = 2000;
const MAX_BUTTONS = 10;
const OTP_BODY_DEFAULT = "{{1}} הוא קוד האימות שלכם.";
const SECURITY_FOOTER = "למען האבטחה, אל תשתפו את הקוד הזה.";

const LANGUAGES = [
  { code: "he", label: "עברית" },
  { code: "en", label: "אנגלית" },
  { code: "ar", label: "ערבית" },
  { code: "es", label: "ספרדית" },
  { code: "fr", label: "צרפתית" },
  { code: "pt_BR", label: "פורטוגזית (ברזיל)" },
] as const;

const CATEGORIES: Array<{
  value: MetaCategory;
  title: string;
  description: string;
}> = [
  {
    value: "MARKETING",
    title: "שיווק",
    description:
      "מבצעים, עדכוני מוצרים והודעות שיווקיות. נשלחות רק ללקוחות שהסכימו לקבל אותן.",
  },
  {
    value: "UTILITY",
    title: "שירות ציבורי",
    description:
      "עדכוני הזמנות, תזכורות ותגובות לבקשות של הלקוח. לא מיועדות לקידום מכירות.",
  },
  {
    value: "AUTHENTICATION",
    title: "אימות",
    description: "קוד חד-פעמי לכניסה, אימות זהות או אישור פעולה.",
  },
];

const SUBTYPES: Record<
  MetaCategory,
  Array<{ value: TemplateKind; title: string; description: string }>
> = {
  MARKETING: [
    {
      value: "default",
      title: "ברירת מחדל",
      description: "תבנית שיווקית רגילה עם כותרת, גוף, כותרת תחתונה ולחצנים.",
    },
    {
      value: "catalog",
      title: "קטלוג",
      description: "הודעה שמציגה פריטים מהקטלוג של העסק בוואטסאפ.",
    },
    {
      value: "flows",
      title: "תהליכים",
      description: "הודעה שפותחת תהליך איסוף פרטים או פעולה בתוך וואטסאפ.",
    },
    {
      value: "call_permission",
      title: "בקשה להרשאות שיחה",
      description: "בקשה מהלקוח לאשר שיחות עתידיות מהעסק.",
    },
  ],
  UTILITY: [
    {
      value: "default",
      title: "ברירת מחדל",
      description: "תבנית שירות רגילה עם כותרת, גוף, כותרת תחתונה ולחצנים.",
    },
    {
      value: "flows",
      title: "תהליכים",
      description: "תהליך שירות לאיסוף פרטים או השלמת פעולה.",
    },
    {
      value: "call_permission",
      title: "בקשה להרשאות שיחה",
      description: "בקשת הרשאה לשיחה בהקשר של שירות קיים.",
    },
  ],
  AUTHENTICATION: [
    {
      value: "otp",
      title: "קוד אימות חד-פעמי (OTP)",
      description: "שליחת קוד חד-פעמי לאימות זהות. זה סוג האימות הנתמך כרגע.",
    },
  ],
};

const HEADER_OPTIONS: Array<{ value: HeaderType; label: string }> = [
  { value: "none", label: "ללא" },
  { value: "text", label: "טקסט" },
  { value: "image", label: "תמונה" },
  { value: "video", label: "וידאו" },
  { value: "document", label: "מסמך" },
];

const BUTTON_MENU: Array<{
  type: ButtonType;
  title: string;
  description: string;
}> = [
  {
    type: "quick_reply",
    title: "תשובה מהירה / בהתאמה אישית",
    description: "הלקוח שולח תשובה קצרה בלחיצה אחת.",
  },
  {
    type: "url",
    title: "ביקור באתר",
    description: "פותח כתובת אתר סטטית או דינמית.",
  },
  {
    type: "phone_number",
    title: "התקשרות למספר טלפון",
    description: "מתקשר למספר שהוגדר מראש.",
  },
  {
    type: "copy_code",
    title: "העתקת קוד",
    description: "מעתיק קוד מבצע או קוד אימות ללוח.",
  },
];

const STEPS = [
  { title: "הגדרת תבנית", hint: "קטגוריה ותת-קטגוריה" },
  { title: "עריכת תבנית", hint: "שם, שפה ותוכן" },
  { title: "שליחה לבדיקה", hint: "סקירה לפני מטא" },
] as const;

const emptyForm = (): FormState => ({
  name: "",
  language: "he",
  metaCategory: "MARKETING",
  templateKind: "default",
  headerType: "none",
  headerText: "",
  headerHandle: "",
  body: "",
  footer: "",
  securityRecommendation: false,
  buttons: [],
  exampleValues: {},
});

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

function categoryLabel(value: MetaCategory): string {
  return CATEGORIES.find((item) => item.value === value)?.title || value;
}

function kindLabel(category: MetaCategory, kind: TemplateKind): string {
  return (
    SUBTYPES[category].find((item) => item.value === kind)?.title || kind
  );
}

function buttonTypeLabel(type: ButtonType): string {
  return BUTTON_MENU.find((item) => item.type === type)?.title || type;
}

function allowedHeaderOptions(category: MetaCategory): HeaderType[] {
  if (category === "AUTHENTICATION") return ["none"];
  return ["none", "text", "image", "video", "document"];
}

function allowedButtons(category: MetaCategory): ButtonType[] {
  if (category === "AUTHENTICATION") return ["copy_code"];
  return ["quick_reply", "url", "phone_number", "copy_code"];
}

export function WhatsAppCreateTemplateWizard({
  businessId,
  onClose,
  onSubmitted,
}: {
  businessId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUp, setMenuUp] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const variables = useMemo(
    () => extractVariables(`${form.headerText}\n${form.body}`),
    [form.headerText, form.body]
  );
  const previewBody = useMemo(() => {
    let text = form.body || "כאן יופיע גוף ההודעה.";
    variables.forEach((variable) => {
      text = text.replaceAll(
        `{{${variable}}}`,
        form.exampleValues[variable] || `{{${variable}}}`
      );
    });
    return text;
  }, [form.body, form.exampleValues, variables]);

  const nameValid = /^[a-z0-9_]+$/.test(form.name) && form.name.length > 0;
  const canGoEdit = Boolean(form.metaCategory && form.templateKind);
  const canGoReview =
    nameValid &&
    Boolean(form.language) &&
    Boolean(form.body.trim()) &&
    (form.headerType !== "text" || Boolean(form.headerText.trim())) &&
    (form.headerType === "none" ||
      form.headerType === "text" ||
      Boolean(form.headerHandle.trim()));

  useEffect(() => {
    if (!menuOpen) return;
    const place = () => {
      const button = addBtnRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setMenuUp(spaceBelow < 280 && spaceAbove > spaceBelow);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        addBtnRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectCategory = (value: MetaCategory) => {
    const firstKind = SUBTYPES[value][0]?.value || "default";
    setForm((prev) => ({
      ...prev,
      metaCategory: value,
      templateKind: firstKind,
      headerType: value === "AUTHENTICATION" ? "none" : prev.headerType,
      headerText: value === "AUTHENTICATION" ? "" : prev.headerText,
      headerHandle: value === "AUTHENTICATION" ? "" : prev.headerHandle,
      body:
        value === "AUTHENTICATION" && !prev.body.trim()
          ? OTP_BODY_DEFAULT
          : prev.body,
      footer:
        value === "AUTHENTICATION" && prev.securityRecommendation
          ? SECURITY_FOOTER
          : prev.footer,
      buttons:
        value === "AUTHENTICATION"
          ? prev.buttons.filter((button) => button.type === "copy_code")
          : prev.buttons,
    }));
  };

  const insertFormat = (before: string, after: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    update("body", wrapSelection(form.body, start, end, before, after));
  };

  const insertVariable = () => {
    const index = nextVariableIndex(form.body);
    const el = bodyRef.current;
    if (!el) {
      update("body", `${form.body}{{${index}}}`);
      return;
    }
    const start = el.selectionStart;
    update(
      "body",
      `${form.body.slice(0, start)}{{${index}}}${form.body.slice(start)}`
    );
  };

  const addButton = (type: ButtonType) => {
    if (form.buttons.length >= MAX_BUTTONS) return;
    const next: WhatsAppTemplateButton = {
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
    update("buttons", [...form.buttons, next]);
    setMenuOpen(false);
  };

  const updateButton = (
    index: number,
    patch: Partial<WhatsAppTemplateButton>
  ) => {
    update(
      "buttons",
      form.buttons.map((button, i) =>
        i === index ? { ...button, ...patch } : button
      )
    );
  };

  const buildPayload = (): WhatsAppTemplateSubmitPayload => ({
    name: form.name.trim(),
    language: form.language,
    metaCategory: form.metaCategory,
    headerType: form.headerType,
    headerText: form.headerType === "text" ? form.headerText : undefined,
    headerMediaUrl:
      form.headerType === "image" ||
      form.headerType === "video" ||
      form.headerType === "document"
        ? form.headerHandle
        : undefined,
    body: form.body,
    footer: form.footer || undefined,
    buttons: form.buttons,
    exampleValues: form.exampleValues,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveWhatsAppTemplateDraft(businessId, buildPayload());
      toast.success("הטיוטה נשמרה");
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שמירת הטיוטה נכשלה");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await submitWhatsAppTemplateToMeta(
        businessId,
        buildPayload()
      );
      const rawStatus = String(result.meta?.status || "").toUpperCase();
      const status =
        rawStatus === "PENDING"
          ? "ממתין"
          : rawStatus === "APPROVED"
            ? "מאושרת"
            : rawStatus === "REJECTED"
              ? "נדחתה"
              : rawStatus === "DRAFT"
                ? "טיוטה"
                : result.meta?.status || "ממתין";
      toast.success(
        result.meta?.id
          ? `התבנית נשלחה לבדיקה. הסטטוס: ${status}.`
          : "התבנית נשמרה כטיוטה כי אין חיבור מטא פעיל."
      );
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שליחת התבנית נכשלה");
    } finally {
      setSaving(false);
    }
  };

  const headerOptions = HEADER_OPTIONS.filter((option) =>
    allowedHeaderOptions(form.metaCategory).includes(option.value)
  );
  const buttonMenu = BUTTON_MENU.filter((item) =>
    allowedButtons(form.metaCategory).includes(item.type)
  );
  const subtypes = SUBTYPES[form.metaCategory];

  return (
    <section className="wa-meta-wizard" dir="rtl" aria-label="יצירת תבנית">
      <header className="wa-meta-wizard__top">
        <div>
          <p className="wa-meta-kicker">תבניות הודעה</p>
          <h3>יצירת תבנית</h3>
        </div>
        <div className="wa-meta-wizard__top-actions">
          <span className="wa-meta-badge">ממשק מטא</span>
          <button
            type="button"
            className="wa-meta-icon-btn"
            onClick={onClose}
            aria-label="סגירה"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ol className="wa-meta-stepper">
        {STEPS.map((item, index) => {
          const state =
            step === index ? "current" : step > index ? "done" : "todo";
          return (
            <li key={item.title} className={`is-${state}`}>
              <span className="wa-meta-stepper__num">
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span>
                <strong>{item.title}</strong>
                <em>{item.hint}</em>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="wa-meta-wizard__body" dir="ltr">
        <aside className="wa-meta-preview" dir="rtl">
          <div className="wa-meta-preview__chrome">
            <strong>תצוגה מקדימה</strong>
            <span>וואטסאפ · עסק</span>
          </div>
          <div className="wa-meta-preview__stage">
            <div className="wa-meta-bubble">
              {form.headerType === "text" && form.headerText && (
                <p className="wa-meta-bubble__header">{form.headerText}</p>
              )}
              {form.headerType === "image" && (
                <div className="wa-meta-bubble__media">תמונה</div>
              )}
              {form.headerType === "video" && (
                <div className="wa-meta-bubble__media">וידאו</div>
              )}
              {form.headerType === "document" && (
                <div className="wa-meta-bubble__media">מסמך</div>
              )}
              <p className="wa-meta-bubble__body">{previewBody}</p>
              {form.footer && (
                <p className="wa-meta-bubble__footer">{form.footer}</p>
              )}
              <time>12:00</time>
              {form.buttons.length > 0 && (
                <div className="wa-meta-bubble__buttons">
                  {form.buttons.map((button, index) => (
                    <span key={`${button.type}-${index}`}>
                      {button.text || buttonTypeLabel(button.type)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="wa-meta-editor" dir="rtl">
          {step === 0 && (
            <div className="wa-meta-card">
              <h4>קטגוריה</h4>
              <p className="wa-meta-help">
                בחרו קטגוריה ותת-קטגוריה. שם התבנית והשפה יוגדרו בשלב העריכה.
              </p>
              <div className="wa-meta-choice-list" style={{ marginTop: 16 }}>
                {CATEGORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`wa-meta-choice ${form.metaCategory === item.value ? "is-selected" : ""}`}
                    onClick={() => selectCategory(item.value)}
                  >
                    <span className="wa-meta-radio" />
                    <span>
                      <strong>{item.title}</strong>
                      <em>{item.description}</em>
                    </span>
                  </button>
                ))}
              </div>

              <div className="wa-meta-section-divider">
                <h4>תת-קטגוריה</h4>
                <p className="wa-meta-help">
                  האפשרויות משתנות לפי הקטגוריה שנבחרה.
                </p>
                <div className="wa-meta-choice-list" style={{ marginTop: 12 }}>
                  {subtypes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`wa-meta-choice ${form.templateKind === item.value ? "is-selected" : ""}`}
                      onClick={() => update("templateKind", item.value)}
                    >
                      <span className="wa-meta-radio" />
                      <span>
                        <strong>{item.title}</strong>
                        <em>{item.description}</em>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wa-meta-card wa-meta-editor-flow">
              <label>
                <div className="wa-meta-field-row">
                  <span className="wa-meta-label">שם התבנית</span>
                  <span className="wa-meta-counter">
                    {form.name.length}/{NAME_MAX}
                  </span>
                </div>
                <input
                  className="wa-meta-input"
                  dir="ltr"
                  maxLength={NAME_MAX}
                  value={form.name}
                  onChange={(e) =>
                    update("name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))
                  }
                  placeholder="welcome_offer"
                />
                <p className="wa-meta-help">
                  אותיות אנגליות קטנות, מספרים וקו תחתון בלבד. לא יוצג ללקוחות.
                </p>
              </label>

              <label>
                <span className="wa-meta-label">שפה</span>
                <select
                  className="wa-meta-select"
                  value={form.language}
                  onChange={(e) => update("language", e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <p className="wa-meta-help">
                  השפה שבה ייכתב תוכן התבנית. אפשר להוסיף גרסאות נוספות מאוחר יותר.
                </p>
              </label>

              {form.metaCategory === "AUTHENTICATION" && (
                <div className="wa-meta-auth-panel">
                  <h4>אפשרויות אימות</h4>
                  <p className="wa-meta-help">
                    מוצגות רק האפשרויות שנתמכות בפועל בשליחה למטא. כניסה בלחיצה
                    אחת וכניסה ללא לחיצה אינן זמינות כרגע.
                  </p>
                  <div className="wa-meta-auth-row">
                    <strong>קוד OTP</strong>
                    <span>הגוף חייב לכלול את המשתנה {"{{1}}"} לקוד האימות.</span>
                  </div>
                  <label className="wa-meta-check">
                    <input
                      type="checkbox"
                      checked={form.securityRecommendation}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          securityRecommendation: checked,
                          footer: checked ? SECURITY_FOOTER : "",
                        }));
                      }}
                    />
                    <span>
                      <strong>המלצת אבטחה</strong>
                      <em>מוסיפה כותרת תחתונה שממליצה לא לשתף את הקוד.</em>
                    </span>
                  </label>
                  <div className="wa-meta-auth-row">
                    <strong>זמן תפוגת הקוד</strong>
                    <span>
                      מטא מציגה תפוגה של 10 דקות. אין שדה נפרד שנתמך כרגע בחיבור
                      שלנו.
                    </span>
                  </div>
                  <div className="wa-meta-auth-row">
                    <strong>העתקת קוד</strong>
                    <span>אפשר להוסיף לחצן העתקה באזור הלחצנים למטה.</span>
                  </div>
                </div>
              )}

              {form.metaCategory !== "AUTHENTICATION" && (
                <div>
                  <span className="wa-meta-label">כותרת</span>
                  <p className="wa-meta-help">
                    בחרו סוג כותרת. יוצג רק השדה הרלוונטי לבחירה.
                  </p>
                  <div className="wa-meta-pills" role="radiogroup" aria-label="סוג כותרת">
                    {headerOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={form.headerType === option.value ? "is-selected" : ""}
                        onClick={() => update("headerType", option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {form.headerType === "text" && (
                    <label style={{ marginTop: 12 }}>
                      <div className="wa-meta-field-row">
                        <span className="wa-meta-label">טקסט כותרת</span>
                        <span className="wa-meta-counter">
                          {form.headerText.length}/{HEADER_TEXT_MAX}
                        </span>
                      </div>
                      <input
                        className="wa-meta-input"
                        maxLength={HEADER_TEXT_MAX}
                        value={form.headerText}
                        onChange={(e) => update("headerText", e.target.value)}
                        placeholder="לדוגמה: מבצע לחברים"
                      />
                    </label>
                  )}
                  {(form.headerType === "image" ||
                    form.headerType === "video" ||
                    form.headerType === "document") && (
                    <label style={{ marginTop: 12 }}>
                      <span className="wa-meta-label">
                        {form.headerType === "image"
                          ? "מזהה מדיה לתמונה"
                          : form.headerType === "video"
                            ? "מזהה מדיה לווידאו"
                            : "מזהה מדיה למסמך"}
                      </span>
                      <input
                        className="wa-meta-input"
                        dir="ltr"
                        value={form.headerHandle}
                        onChange={(e) => update("headerHandle", e.target.value)}
                        placeholder="מזהה מדיה שהתקבל מהעלאה"
                      />
                      <p className="wa-meta-help">
                        מטא דורשת מזהה מדיה שהועלה מראש. בלי מזהה אי אפשר לשלוח
                        לבדיקה.
                      </p>
                    </label>
                  )}
                </div>
              )}

              <div>
                <div className="wa-meta-field-row">
                  <span className="wa-meta-label">גוף</span>
                  <span className="wa-meta-counter">
                    {form.body.length}/{BODY_MAX}
                  </span>
                </div>
                <div className="wa-meta-toolbar">
                  <button type="button" onClick={() => insertFormat("*", "*")}>
                    מודגש
                  </button>
                  <button type="button" onClick={() => insertFormat("_", "_")}>
                    נטוי
                  </button>
                  <button type="button" onClick={() => insertFormat("~", "~")}>
                    קו חוצה
                  </button>
                  <button type="button" onClick={() => insertFormat("```", "```")}>
                    קוד
                  </button>
                  <button type="button" onClick={insertVariable}>
                    + משתנה
                  </button>
                </div>
                <textarea
                  ref={bodyRef}
                  className="wa-meta-textarea"
                  maxLength={BODY_MAX}
                  value={form.body}
                  onChange={(e) => update("body", e.target.value)}
                  placeholder={
                    form.metaCategory === "AUTHENTICATION"
                      ? OTP_BODY_DEFAULT
                      : "כתבו את גוף ההודעה. השתמשו ב-{{1}} למשתנים."
                  }
                />
                <p className="wa-meta-help">
                  אפשר להוסיף משתנים במבנה {"{{1}}"}, {"{{2}}"}. התצוגה המקדימה
                  מתעדכנת בזמן אמת.
                </p>
              </div>

              {variables.length > 0 && (
                <div>
                  <span className="wa-meta-label">ערכי דוגמה למשתנים</span>
                  <p className="wa-meta-help">
                    מטא דורשת דוגמאות לכל משתנה לפני בדיקה.
                  </p>
                  <div className="wa-meta-var-grid">
                    {variables.map((variable) => (
                      <label key={variable}>
                        <span className="wa-meta-label">{`{{${variable}}}`}</span>
                        <input
                          className="wa-meta-input"
                          value={form.exampleValues[variable] || ""}
                          onChange={(e) =>
                            update("exampleValues", {
                              ...form.exampleValues,
                              [variable]: e.target.value,
                            })
                          }
                          placeholder="ערך לדוגמה"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <label>
                <div className="wa-meta-field-row">
                  <span className="wa-meta-label">כותרת תחתונה</span>
                  <span className="wa-meta-counter">
                    {form.footer.length}/{FOOTER_MAX}
                  </span>
                </div>
                <input
                  className="wa-meta-input"
                  maxLength={FOOTER_MAX}
                  value={form.footer}
                  onChange={(e) => update("footer", e.target.value)}
                  placeholder="לא חובה"
                />
                <p className="wa-meta-help">
                  טקסט קצר בתחתית ההודעה. אפשר להשאיר ריק.
                </p>
              </label>

              <div>
                <div className="wa-meta-field-row">
                  <span className="wa-meta-label">לחצנים</span>
                  <span className="wa-meta-help" style={{ margin: 0 }}>
                    עד {MAX_BUTTONS} לחצנים
                  </span>
                </div>
                <div className="wa-meta-add-wrap">
                  <button
                    ref={addBtnRef}
                    type="button"
                    className="wa-meta-btn wa-meta-btn--secondary"
                    disabled={form.buttons.length >= MAX_BUTTONS}
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
                    >
                      {buttonMenu.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => addButton(item.type)}
                        >
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {form.buttons.map((btn, index) => (
                  <div key={`${btn.type}-${index}`} className="wa-meta-button-card">
                    <header>
                      <strong>{buttonTypeLabel(btn.type)}</strong>
                      <button
                        type="button"
                        className="wa-meta-icon-btn"
                        onClick={() =>
                          update(
                            "buttons",
                            form.buttons.filter((_, i) => i !== index)
                          )
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
                          onChange={(e) =>
                            updateButton(index, { text: e.target.value })
                          }
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
                            onChange={(e) =>
                              updateButton(index, { url: e.target.value })
                            }
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
                                updateButton(index, {
                                  exampleUrl: e.target.value,
                                })
                              }
                              placeholder="https://www.example.com/offer"
                            />
                            <p className="wa-meta-help">
                              לסיום הבדיקה יש לספק דוגמה לחלק הדינמי. בלי נתוני
                              לקוח אמיתיים.
                            </p>
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
                            updateButton(index, {
                              phoneNumber: e.target.value,
                            })
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
                            updateButton(index, {
                              exampleUrl: e.target.value,
                            })
                          }
                          placeholder="123456"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wa-meta-card wa-meta-review">
              <h4>בדיקה לפני שליחה</h4>
              <p className="wa-meta-help">
                ודאו שהפרטים נכונים לפני השליחה לבדיקה של מטא.
              </p>
              <dl style={{ marginTop: 14 }}>
                <dt>קטגוריה</dt>
                <dd>{categoryLabel(form.metaCategory)}</dd>
                <dt>תת-קטגוריה</dt>
                <dd>{kindLabel(form.metaCategory, form.templateKind)}</dd>
                <dt>שם התבנית</dt>
                <dd dir="ltr">{form.name || "—"}</dd>
                <dt>שפה</dt>
                <dd>
                  {LANGUAGES.find((lang) => lang.code === form.language)?.label ||
                    form.language}
                </dd>
                <dt>כותרת</dt>
                <dd>
                  {form.headerType === "text"
                    ? form.headerText || "—"
                    : form.headerType === "none"
                      ? "ללא"
                      : form.headerType === "image"
                        ? "תמונה"
                        : form.headerType === "video"
                          ? "וידאו"
                          : "מסמך"}
                </dd>
                <dt>גוף</dt>
                <dd style={{ whiteSpace: "pre-wrap", fontWeight: 500 }}>
                  {form.body || "—"}
                </dd>
                <dt>כותרת תחתונה</dt>
                <dd>{form.footer || "—"}</dd>
                <dt>לחצנים</dt>
                <dd>
                  {form.buttons.length
                    ? form.buttons
                        .map(
                          (button) =>
                            `${buttonTypeLabel(button.type)}: ${button.text || button.exampleUrl}`
                        )
                        .join(" · ")
                    : "—"}
                </dd>
                <dt>דגימות משתנים</dt>
                <dd dir="ltr">
                  {variables.length
                    ? variables
                        .map((v) => `{{${v}}}=${form.exampleValues[v] || ""}`)
                        .join(" · ")
                    : "—"}
                </dd>
              </dl>
              <p className="wa-meta-alert wa-meta-alert--warn">
                שליחה מעבירה את התבנית לבדיקה במטא. הסטטוס יוצג כממתין עד שמטא
                תחזיר מאושרת או נדחתה.
              </p>
            </div>
          )}

          {error && <p className="wa-meta-alert wa-meta-alert--error">{error}</p>}
        </div>
      </div>

      <div className="wa-meta-wizard__footer">
        <div className="wa-meta-wizard__footer-cluster">
          {step > 0 && (
            <button
              type="button"
              className="wa-meta-btn wa-meta-btn--secondary"
              onClick={() => setStep((prev) => (prev - 1) as Step)}
            >
              הקודם
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              className="wa-meta-btn wa-meta-btn--primary"
              disabled={step === 0 ? !canGoEdit : !canGoReview}
              onClick={() => setStep((prev) => (prev + 1) as Step)}
            >
              הבא
            </button>
          ) : (
            <button
              type="button"
              className="wa-meta-btn wa-meta-btn--primary"
              disabled={saving || !canGoReview}
              onClick={handleSubmit}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              שליחה לבדיקה
            </button>
          )}
        </div>
        <div className="wa-meta-wizard__footer-cluster">
          <button
            type="button"
            className="wa-meta-btn wa-meta-btn--secondary"
            disabled={saving || !form.name}
            onClick={handleSaveDraft}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            שמירה כטיוטה
          </button>
          <button
            type="button"
            className="wa-meta-btn wa-meta-btn--ghost"
            onClick={onClose}
          >
            סגירה
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhatsAppCreateTemplateWizard;
