import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Bold,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Italic,
  KeyRound,
  Loader2,
  Megaphone,
  MessageSquare,
  Phone,
  Plus,
  Strikethrough,
  Video,
  X,
} from "lucide-react";
import {
  saveWhatsAppTemplateDraft,
  submitWhatsAppTemplateToMeta,
  type WhatsAppHeaderType,
  type WhatsAppTemplateButton,
  type WhatsAppTemplateSubmitPayload,
} from "../../../../api/whatsappApi";
import "./whatsappMetaTemplateWizard.css";

type Props = {
  businessId: string;
  onClose: () => void;
  onSubmitted: () => void;
};

type MetaCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";
type Step = 0 | 1 | 2;

type FormState = {
  metaCategory: MetaCategory;
  marketingType: "default" | "catalog" | "flows" | "call_permission";
  name: string;
  language: string;
  variableType: "number" | "name";
  headerType: WhatsAppHeaderType;
  headerText: string;
  headerMediaUrl: string;
  body: string;
  footer: string;
  exampleValues: Record<string, string>;
  buttons: WhatsAppTemplateButton[];
};

const BODY_MAX = 1024;
const HEADER_MAX = 60;
const FOOTER_MAX = 60;
const BUTTON_TEXT_MAX = 25;
const URL_MAX = 2000;

const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: "he", label: "עברית" },
  { code: "en_US", label: "אנגלית (ארה״ב)" },
  { code: "en_GB", label: "אנגלית (בריטניה)" },
  { code: "en", label: "אנגלית" },
  { code: "ar", label: "ערבית" },
  { code: "fr", label: "צרפתית" },
  { code: "es", label: "ספרדית" },
  { code: "es_ES", label: "ספרדית (ספרד)" },
  { code: "es_MX", label: "ספרדית (מקסיקו)" },
  { code: "pt_BR", label: "פורטוגזית (ברזיל)" },
  { code: "pt_PT", label: "פורטוגזית (פורטוגל)" },
  { code: "de", label: "גרמנית" },
  { code: "it", label: "איטלקית" },
  { code: "ru", label: "רוסית" },
  { code: "tr", label: "טורקית" },
  { code: "hi", label: "הינדי" },
  { code: "id", label: "אינדונזית" },
];

const emptyForm: FormState = {
  metaCategory: "MARKETING",
  marketingType: "default",
  name: "",
  language: "he",
  variableType: "number",
  headerType: "none",
  headerText: "",
  headerMediaUrl: "",
  body: "",
  footer: "",
  exampleValues: {},
  buttons: [],
};

const STEPS = ["הגדרת תבנית", "עריכת תבנית", "שליחה לבדיקה"] as const;

const BUTTON_MENU: Array<{
  type: WhatsAppTemplateButton["type"];
  label: string;
  icon: typeof Globe;
}> = [
  { type: "quick_reply", label: "בהתאמה אישית", icon: MessageSquare },
  { type: "url", label: "ביקור באתר האינטרנט", icon: Globe },
  { type: "phone_number", label: "התקשרות למספר הטלפון", icon: Phone },
  { type: "copy_code", label: "העתקת קוד המבצע", icon: Copy },
];

function extractVars(body: string, variableType: "number" | "name") {
  const re =
    variableType === "name"
      ? /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g
      : /\{\{\s*(\d+)\s*\}\}/g;
  const matches = Array.from(String(body).matchAll(re));
  const seen = new Set<string>();
  const vars: string[] = [];
  for (const match of matches) {
    const key = match[1];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    vars.push(key);
  }
  if (variableType === "number") {
    return vars.sort((a, b) => Number(a) - Number(b));
  }
  return vars;
}

function nextVarToken(body: string, variableType: "number" | "name") {
  if (variableType === "name") {
    const existing = extractVars(body, "name");
    let i = 1;
    let candidate = `var_${i}`;
    while (existing.includes(candidate)) {
      i += 1;
      candidate = `var_${i}`;
    }
    return `{{${candidate}}}`;
  }
  const nums = extractVars(body, "number").map(Number);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `{{${next}}}`;
}

function normalizeName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 512);
}

function wrapSelection(
  textarea: HTMLTextAreaElement | null,
  value: string,
  before: string,
  after: string,
  onChange: (next: string) => void
) {
  if (!textarea) {
    onChange(`${value}${before}${after}`.slice(0, BODY_MAX));
    return;
  }
  const start = textarea.selectionStart ?? value.length;
  const end = textarea.selectionEnd ?? value.length;
  const selected = value.slice(start, end) || "טקסט";
  const next = (
    value.slice(0, start) +
    before +
    selected +
    after +
    value.slice(end)
  ).slice(0, BODY_MAX);
  onChange(next);
  requestAnimationFrame(() => {
    const pos = start + before.length + selected.length + after.length;
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
  });
}

function renderPreviewBody(body: string, samples: Record<string, string>) {
  return String(body || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) =>
    samples[key] ? String(samples[key]) : `{{${key}}}`
  );
}

function categoryLabel(value: MetaCategory) {
  if (value === "MARKETING") return "שיווק";
  if (value === "UTILITY") return "שירות";
  return "אימות";
}

function buttonTypeLabel(type: WhatsAppTemplateButton["type"]) {
  return BUTTON_MENU.find((item) => item.type === type)?.label || type;
}

function defaultButtonText(type: WhatsAppTemplateButton["type"]) {
  if (type === "copy_code") return "העתקת קוד";
  if (type === "url") return "לחצו כאן";
  if (type === "phone_number") return "התקשרו עכשיו";
  return "לחצן";
}

export default function WhatsAppCreateTemplateWizard({
  businessId,
  onClose,
  onSubmitted,
}: Props) {
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const addMenuRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const variables = useMemo(
    () => extractVars(form.body, form.variableType),
    [form.body, form.variableType]
  );

  const nameValid = /^[a-z0-9_]+$/.test(form.name) && form.name.length > 0;
  const samplesComplete = variables.every((v) =>
    String(form.exampleValues[v] || "").trim()
  );
  const bodyValid = form.body.trim().length > 0;
  const languageValid = Boolean(form.language);
  const mediaOk =
    form.headerType === "none" ||
    form.headerType === "text" ||
    Boolean(form.headerMediaUrl.trim());

  const canGoEdit = nameValid && languageValid && Boolean(form.metaCategory);
  const canGoReview =
    canGoEdit &&
    bodyValid &&
    samplesComplete &&
    mediaOk &&
    !/^\{\{/.test(form.body.trim()) &&
    !/\}\}$/.test(form.body.trim());

  const previewBody = renderPreviewBody(form.body, form.exampleValues);
  const previewHeader =
    form.headerType === "text"
      ? renderPreviewBody(form.headerText, form.exampleValues)
      : "";

  useEffect(() => {
    if (!addMenuOpen) return;
    const onDown = (event: MouseEvent) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target as Node)
      ) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [addMenuOpen]);

  const buildPayload = (): WhatsAppTemplateSubmitPayload => ({
    name: form.name,
    metaTemplateName: form.name,
    language: form.language,
    metaCategory: form.metaCategory,
    category: form.metaCategory === "MARKETING" ? "promotion" : "custom",
    variableType: form.variableType,
    headerType: form.headerType,
    headerText: form.headerText,
    headerMediaUrl: form.headerMediaUrl,
    body: form.body,
    footer: form.footer,
    exampleValues: form.exampleValues,
    buttons: form.buttons,
  });

  const insertVariable = () => {
    const token = nextVarToken(form.body, form.variableType);
    const textarea = bodyRef.current;
    if (!textarea) {
      setForm((prev) => ({
        ...prev,
        body: `${prev.body}${prev.body && !/\s$/.test(prev.body) ? " " : ""}${token}`.slice(
          0,
          BODY_MAX
        ),
      }));
      return;
    }
    const start = textarea.selectionStart ?? form.body.length;
    const end = textarea.selectionEnd ?? form.body.length;
    const next = (
      form.body.slice(0, start) +
      token +
      form.body.slice(end)
    ).slice(0, BODY_MAX);
    setForm((prev) => ({ ...prev, body: next }));
    requestAnimationFrame(() => {
      const pos = start + token.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const addButton = (type: WhatsAppTemplateButton["type"]) => {
    setAddMenuOpen(false);
    setForm((prev) => {
      if (prev.buttons.length >= 10) return prev;
      return {
        ...prev,
        buttons: [
          ...prev.buttons,
          {
            type,
            text: defaultButtonText(type),
            url: type === "url" ? "https://" : "",
            urlType: "static",
            exampleUrl: "",
            phoneNumber: "",
          },
        ],
      };
    });
  };

  const updateButton = (
    index: number,
    patch: Partial<WhatsAppTemplateButton>
  ) => {
    setForm((prev) => ({
      ...prev,
      buttons: prev.buttons.map((button, i) =>
        i === index ? { ...button, ...patch } : button
      ),
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      await saveWhatsAppTemplateDraft(businessId, buildPayload());
      toast.success("הטיוטה נשמרה");
      onSubmitted();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || "שמירת הטיוטה נכשלה";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      const result = await submitWhatsAppTemplateToMeta(
        businessId,
        buildPayload()
      );
      toast.success(
        `נשלחה לבדיקה במטא · סטטוס: ${result.meta?.status || "PENDING"}`
      );
      onSubmitted();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "שליחת התבנית למטא נכשלה";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const previewTime = new Date().toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="wa-meta-wizard" dir="rtl">
      <div className="wa-meta-wizard__header">
        <div>
          <h3 className="wa-meta-wizard__title">יצירת תבנית</h3>
          <p className="wa-meta-wizard__subtitle">
            אותו מבנה וזרימה כמו ב-WhatsApp Manager של Meta
          </p>
        </div>
        <span className="wa-meta-wizard__badge">Meta Cloud API</span>
      </div>

      <div className="wa-meta-wizard__stepper" role="list">
        {STEPS.map((label, index) => {
          const done = step > index;
          const active = step === index;
          return (
            <React.Fragment key={label}>
              {index > 0 ? (
                <span className="wa-meta-wizard__step-line" aria-hidden />
              ) : null}
              <div
                role="listitem"
                className={[
                  "wa-meta-wizard__step",
                  active ? "is-active" : "",
                  done ? "is-done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="wa-meta-wizard__step-index">
                  {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                {label}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="wa-meta-wizard__body" dir="ltr">
        <aside className="wa-meta-preview" dir="rtl">
          <div className="wa-meta-preview__head">
            <h4>תצוגה מקדימה של התבנית</h4>
            <p>מתעדכנת בזמן אמת לפי השדות וערכי הדוגמה</p>
          </div>
          <div className="wa-meta-preview__stage">
            <div className="wa-meta-bubble">
              {form.headerType === "image" && (
                <div className="wa-meta-bubble__media">
                  {form.headerMediaUrl ? (
                    <img src={form.headerMediaUrl} alt="" />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6" />
                      תמונה
                    </>
                  )}
                </div>
              )}
              {form.headerType === "video" && (
                <div className="wa-meta-bubble__media">
                  <Video className="h-6 w-6" />
                  וידאו
                </div>
              )}
              {form.headerType === "document" && (
                <div className="wa-meta-bubble__media">
                  <FileText className="h-5 w-5" />
                  מסמך לדוגמה
                </div>
              )}
              <div className="wa-meta-bubble__content">
                {previewHeader ? (
                  <p className="wa-meta-bubble__header">{previewHeader}</p>
                ) : null}
                <p className="wa-meta-bubble__body">
                  {previewBody || "גוף ההודעה יופיע כאן"}
                </p>
                {form.footer ? (
                  <p className="wa-meta-bubble__footer-text">{form.footer}</p>
                ) : null}
                <p className="wa-meta-bubble__time">{previewTime}</p>
              </div>
              {form.buttons.length > 0 && (
                <div className="wa-meta-bubble__actions">
                  {form.buttons.map((btn, i) => (
                    <div key={i} className="wa-meta-bubble__action">
                      {btn.type === "url" ? (
                        <ExternalLink className="h-3.5 w-3.5" />
                      ) : btn.type === "phone_number" ? (
                        <Phone className="h-3.5 w-3.5" />
                      ) : btn.type === "copy_code" ? (
                        <Copy className="h-3.5 w-3.5" />
                      ) : null}
                      {btn.text || `לחצן ${i + 1}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="wa-meta-editor" dir="rtl">
          {step === 0 && (
            <>
              <div className="wa-meta-card">
                <h4>להגדיר את התבנית שלך</h4>
                <p className="wa-meta-help">
                  בחרו קטגוריה שמתאימה למטרת ההודעה. Meta בודקת את הקטגוריה כחלק
                  מתהליך האישור.
                </p>
                <div className="wa-meta-cats">
                  {(
                    [
                      ["MARKETING", "שיווק", Megaphone],
                      ["UTILITY", "שירות", Bell],
                      ["AUTHENTICATION", "אימות", KeyRound],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      className={[
                        "wa-meta-cat",
                        form.metaCategory === value ? "is-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, metaCategory: value }))
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </button>
                  ))}
                </div>
                {form.metaCategory === "MARKETING" && (
                  <div className="wa-meta-radios">
                    {(
                      [
                        [
                          "default",
                          "ברירת מחדל",
                          "מאפשרת מדיה, טקסט מותאם ולחצני פעולה.",
                        ],
                        [
                          "catalog",
                          "קטלוג",
                          "שליחת פריטים מתוך קטלוג המוצרים המחובר.",
                        ],
                        [
                          "flows",
                          "תהליכים",
                          "פתיחת תהליך WhatsApp Flows אצל הלקוח.",
                        ],
                        [
                          "call_permission",
                          "בקשה להרשאות שיחה",
                          "בקשה מהלקוח לאשר שיחות עתידיות.",
                        ],
                      ] as const
                    ).map(([value, title, desc]) => (
                      <label
                        key={value}
                        className={[
                          "wa-meta-radio",
                          form.marketingType === value ? "is-selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <input
                          type="radio"
                          checked={form.marketingType === value}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              marketingType: value,
                            }))
                          }
                        />
                        <span>
                          <strong>{title}</strong>
                          <span>{desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {form.metaCategory === "AUTHENTICATION" && (
                  <p className="wa-meta-help" style={{ marginTop: 12 }}>
                    הודעות אימות פגות כברירת מחדל לאחר 10 דקות. אפשר להגדיר תוקף
                    מותאם ב-WhatsApp Manager אחרי האישור.
                  </p>
                )}
              </div>

              <div className="wa-meta-grid-2">
                <label>
                  <span className="wa-meta-label">שם התבנית</span>
                  <input
                    className="wa-meta-input"
                    dir="ltr"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: normalizeName(e.target.value),
                      }))
                    }
                    placeholder="order_update"
                  />
                  <p className="wa-meta-help">
                    אותיות אנגליות קטנות, מספרים וקו תחתון בלבד ·{" "}
                    <span dir="ltr">{form.name || "template_name"}</span>
                  </p>
                  {form.name && !nameValid && (
                    <p className="wa-meta-error">שם התבנית אינו תקין</p>
                  )}
                </label>
                <label>
                  <span className="wa-meta-label">שפה</span>
                  <select
                    className="wa-meta-select"
                    value={form.language}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label} ({lang.code})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="wa-meta-card">
                <div className="wa-meta-field-row">
                  <h4>כותרת · לא חובה</h4>
                  <span className="wa-meta-counter">
                    {form.headerText.length}/{HEADER_MAX}
                  </span>
                </div>
                <p className="wa-meta-help">
                  אפשר להוסיף טקסט קצר או מדיה בראש ההודעה.
                </p>
                <div className="wa-meta-media" style={{ marginTop: 12 }}>
                  {(
                    [
                      ["none", "ללא", null],
                      ["text", "טקסט", null],
                      ["image", "תמונה", ImageIcon],
                      ["video", "וידאו", Video],
                      ["document", "מסמך", FileText],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      className={form.headerType === value ? "is-selected" : ""}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          headerType: value,
                          headerText: value === "text" ? prev.headerText : "",
                        }))
                      }
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {label}
                    </button>
                  ))}
                </div>
                {(form.headerType === "none" || form.headerType === "text") && (
                  <input
                    className="wa-meta-input"
                    style={{ marginTop: 12 }}
                    maxLength={HEADER_MAX}
                    value={form.headerText}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        headerText: e.target.value,
                        headerType: e.target.value.trim() ? "text" : "none",
                      }))
                    }
                    placeholder="הוסיפו כותרת קצרה"
                  />
                )}
                {["image", "video", "document"].includes(form.headerType) && (
                  <div style={{ marginTop: 12 }}>
                    <input
                      className="wa-meta-input"
                      dir="ltr"
                      value={form.headerMediaUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          headerMediaUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/sample.jpg"
                    />
                    <p className="wa-meta-help">
                      כותרות מדיה נשמרות בטיוטה מקומית. שליחה למטא תומכת כרגע
                      בכותרת טקסט (נדרש handle להעלאת מדיה).
                    </p>
                    {form.headerMediaUrl && (
                      <button
                        type="button"
                        className="wa-meta-btn wa-meta-btn--secondary"
                        style={{ marginTop: 8 }}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            headerMediaUrl: "",
                          }))
                        }
                      >
                        הסרה
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="wa-meta-card">
                <div className="wa-meta-field-row">
                  <h4>גוף</h4>
                  <span className="wa-meta-counter">
                    {form.body.length}/{BODY_MAX}
                  </span>
                </div>
                <p className="wa-meta-help">
                  הזינו את תוכן ההודעה. אפשר להוסיף משתנים ועיצוב כמו ב-Meta.
                </p>
                <label className="wa-meta-label" style={{ marginTop: 12 }}>
                  סוג משתנים
                </label>
                <select
                  className="wa-meta-select"
                  value={form.variableType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      variableType: e.target.value as "number" | "name",
                    }))
                  }
                >
                  <option value="number">מספרי · {"{{1}} {{2}} {{3}}"}</option>
                  <option value="name">
                    שמות · {"{{customer_name}} {{appointment_date}}"}
                  </option>
                </select>
                <textarea
                  ref={bodyRef}
                  className="wa-meta-textarea"
                  style={{ marginTop: 12 }}
                  maxLength={BODY_MAX}
                  value={form.body}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      body: e.target.value.slice(0, BODY_MAX),
                    }))
                  }
                  placeholder={"שלום {{1}},\nאיך אפשר לעזור?"}
                />
                <div className="wa-meta-toolbar">
                  <button
                    type="button"
                    className="wa-meta-icon-btn"
                    onClick={insertVariable}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    הוספת משתנה
                  </button>
                  <button
                    type="button"
                    className="wa-meta-icon-btn"
                    aria-label="מודגש"
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "*",
                        "*",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="wa-meta-icon-btn"
                    aria-label="נטוי"
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "_",
                        "_",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="wa-meta-icon-btn"
                    aria-label="קו חוצה"
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "~",
                        "~",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    <Strikethrough className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="wa-meta-icon-btn"
                    onClick={() =>
                      wrapSelection(
                        bodyRef.current,
                        form.body,
                        "```",
                        "```",
                        (next) => setForm((prev) => ({ ...prev, body: next }))
                      )
                    }
                  >
                    קוד
                  </button>
                </div>
              </div>

              {variables.length > 0 && (
                <div className="wa-meta-card">
                  <h4>דגימות של משתנים</h4>
                  <p className="wa-meta-help">
                    Meta צריכה דוגמאות לבדיקת התבנית. אל תכללו מידע רגיש או פרטי
                    לקוח אמיתיים.
                  </p>
                  <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    {variables.map((key) => (
                      <label key={key}>
                        <span className="wa-meta-label">
                          גוף · <span dir="ltr">{`{{${key}}}`}</span>
                        </span>
                        <input
                          className="wa-meta-input"
                          value={form.exampleValues[key] || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              exampleValues: {
                                ...prev.exampleValues,
                                [key]: e.target.value,
                              },
                            }))
                          }
                          placeholder="ערך לדוגמה"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="wa-meta-card">
                <div className="wa-meta-field-row">
                  <h4>כותרת תחתונה · לא חובה</h4>
                  <span className="wa-meta-counter">
                    {form.footer.length}/{FOOTER_MAX}
                  </span>
                </div>
                <p className="wa-meta-help">
                  שורה קצרה בתחתית ההודעה, ללא משתנים.
                </p>
                <input
                  className="wa-meta-input"
                  style={{ marginTop: 12 }}
                  maxLength={FOOTER_MAX}
                  value={form.footer}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      footer: e.target.value.replace(/\{\{[^}]*\}\}/g, ""),
                    }))
                  }
                  placeholder="לדוגמה: אל תשיבו להודעה זו"
                />
              </div>

              <div className="wa-meta-card">
                <h4>לחצנים · לא חובה</h4>
                <p className="wa-meta-help">
                  לחצנים מאפשרים ללקוחות להגיב או לבצע פעולה. עד 10 לחצנים.
                </p>
                <div ref={addMenuRef} className="wa-meta-add-wrap" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="wa-meta-btn wa-meta-btn--secondary"
                    disabled={form.buttons.length >= 10}
                    onClick={() => setAddMenuOpen((open) => !open)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    הוספת לחצן
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {addMenuOpen && (
                    <div className="wa-meta-menu" role="menu">
                      {BUTTON_MENU.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          role="menuitem"
                          onClick={() => addButton(item.type)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {form.buttons.map((btn, index) => (
                  <div key={index} className="wa-meta-btn-row">
                    <div className="wa-meta-btn-row__top">
                      <span className="wa-meta-label" style={{ margin: 0 }}>
                        {buttonTypeLabel(btn.type)}
                      </span>
                      <button
                        type="button"
                        className="wa-meta-x"
                        aria-label="מחיקת לחצן"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            buttons: prev.buttons.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
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
                          value={btn.text}
                          maxLength={BUTTON_TEXT_MAX}
                          onChange={(e) =>
                            updateButton(index, { text: e.target.value })
                          }
                          placeholder="טקסט הלחצן"
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
                        <span className="wa-meta-label">קוד מבצע לדוגמה</span>
                        <input
                          className="wa-meta-input"
                          dir="ltr"
                          value={btn.exampleUrl || ""}
                          onChange={(e) =>
                            updateButton(index, {
                              exampleUrl: e.target.value,
                            })
                          }
                          placeholder="SAVE20"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="wa-meta-card wa-meta-review">
              <h4>בדיקה לפני שליחה</h4>
              <p className="wa-meta-help">
                ודאו שהפרטים נכונים לפני השליחה לבדיקה של Meta.
              </p>
              <dl style={{ marginTop: 14 }}>
                <dt>שם התבנית</dt>
                <dd dir="ltr">{form.name || "—"}</dd>
                <dt>שפה</dt>
                <dd>
                  {LANGUAGES.find((lang) => lang.code === form.language)?.label ||
                    form.language}
                </dd>
                <dt>קטגוריה</dt>
                <dd>{categoryLabel(form.metaCategory)}</dd>
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
                תחזיר מאושרת או נדחתה. לא מוצג סטטוס מאושר מדומה.
              </p>
            </div>
          )}

          {error && <p className="wa-meta-alert wa-meta-alert--error">{error}</p>}
        </div>
      </div>

      <div className="wa-meta-wizard__footer">
        <div className="wa-meta-wizard__footer-cluster">
          <button
            type="button"
            className="wa-meta-btn wa-meta-btn--ghost"
            onClick={onClose}
          >
            סגירה
          </button>
          <button
            type="button"
            className="wa-meta-btn wa-meta-btn--secondary"
            disabled={saving || !form.name}
            onClick={handleSaveDraft}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            שמירה כטיוטה
          </button>
        </div>
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
      </div>
    </section>
  );
}
