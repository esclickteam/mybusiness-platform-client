import { useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  saveWhatsAppTemplateDraft,
  submitWhatsAppTemplateToMeta,
  type WhatsAppHeaderType,
  type WhatsAppTemplateButton,
  type WhatsAppTemplateSubmitPayload,
} from "@/api/whatsappApi";
import {
  metaButtonTypeLabel,
  WhatsAppMetaTemplateContent,
} from "./WhatsAppMetaTemplateContent";
import "./whatsappMetaTemplateWizard.css";

type MetaCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";
type TemplateKind = "default" | "catalog" | "flows" | "call_permission" | "otp";
type Step = 0 | 1 | 2;
type ButtonType = WhatsAppTemplateButton["type"];

type FormState = {
  name: string;
  language: string;
  metaCategory: MetaCategory;
  templateKind: TemplateKind;
  variableType: "number" | "name";
  headerType: WhatsAppHeaderType;
  headerText: string;
  headerHandle: string;
  body: string;
  footer: string;
  securityRecommendation: boolean;
  buttons: WhatsAppTemplateButton[];
  exampleValues: Record<string, string>;
};

const NAME_MAX = 512;
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
      description:
        "אפשר לשלוח הודעות עם מדיה ולחצנים בהתאמה אישית כדי לעודד מעורבות של הלקוחות.",
    },
    {
      value: "catalog",
      title: "קטלוג",
      description:
        "ניתן לשלוח הודעות שמשפרות את המכירות על ידי חיבור של קטלוג המוצרים.",
    },
    {
      value: "call_permission",
      title: "בקשה להרשאות שיחה",
      description: "ניתן לשאול לקוחות אם אפשר להתקשר אליהם בוואטסאפ.",
    },
  ],
  UTILITY: [
    {
      value: "default",
      title: "ברירת מחדל",
      description: "כאן אפשר לשלוח הודעות לגבי הזמנה או חשבון קיימים.",
    },
    {
      value: "call_permission",
      title: "בקשה להרשאות שיחה",
      description: "ניתן לשאול לקוחות אם אפשר להתקשר אליהם בוואטסאפ.",
    },
  ],
  AUTHENTICATION: [
    {
      value: "otp",
      title: "קוד סיסמה חד-פעמי",
      description: "צריך לשלוח קודים כדי לאמת עסקה או התחברות.",
    },
  ],
};

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
  variableType: "number",
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

function categoryLabel(value: MetaCategory): string {
  return CATEGORIES.find((item) => item.value === value)?.title || value;
}

function kindLabel(category: MetaCategory, kind: TemplateKind): string {
  return (
    SUBTYPES[category].find((item) => item.value === kind)?.title || kind
  );
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

  const buildPayload = (): WhatsAppTemplateSubmitPayload => ({
    name: form.name.trim(),
    language: form.language,
    metaCategory: form.metaCategory,
    variableType: form.variableType,
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
              {form.headerType === "location" && (
                <div className="wa-meta-bubble__media">מיקום</div>
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
                      {button.text || metaButtonTypeLabel(button.type)}
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

              <WhatsAppMetaTemplateContent
                headerType={form.headerType}
                headerText={form.headerText}
                headerMediaUrl={form.headerHandle}
                body={form.body}
                footer={form.footer}
                buttons={form.buttons}
                exampleValues={form.exampleValues}
                variableType={form.variableType}
                showHeader={form.metaCategory !== "AUTHENTICATION"}
                allowedButtons={allowedButtons(form.metaCategory)}
                bodyPlaceholder={
                  form.metaCategory === "AUTHENTICATION"
                    ? OTP_BODY_DEFAULT
                    : "כתבו את גוף ההודעה. השתמשו ב-{{1}} למשתנים."
                }
                onChange={(patch) =>
                  setForm((prev) => {
                    const { headerMediaUrl, ...rest } = patch;
                    return {
                      ...prev,
                      ...rest,
                      headerHandle:
                        headerMediaUrl !== undefined
                          ? headerMediaUrl
                          : prev.headerHandle,
                    };
                  })
                }
              />
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
                          : form.headerType === "location"
                            ? "מיקום"
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
                            `${metaButtonTypeLabel(button.type)}: ${button.text || button.exampleUrl}`
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
