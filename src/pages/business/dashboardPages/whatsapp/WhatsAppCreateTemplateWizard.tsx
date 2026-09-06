import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
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

const LANGUAGE_CODES = ["he", "en", "ar", "es", "fr", "pt_BR"] as const;

function getLanguages(t: TFunction) {
  return LANGUAGE_CODES.map((code) => ({
    code,
    label: t(`whatsapp.wizard.languages.${code}`),
  }));
}

function getCategories(t: TFunction): Array<{
  value: MetaCategory;
  title: string;
  description: string;
}> {
  return (["MARKETING", "UTILITY", "AUTHENTICATION"] as MetaCategory[]).map(
    (value) => ({
      value,
      title: t(`whatsapp.wizard.categories.${value}.title`),
      description: t(`whatsapp.wizard.categories.${value}.description`),
    })
  );
}

const SUBTYPE_VALUES: Record<MetaCategory, TemplateKind[]> = {
  MARKETING: ["default", "catalog", "call_permission"],
  UTILITY: ["default", "call_permission"],
  AUTHENTICATION: ["otp"],
};

function subtypeKey(category: MetaCategory, kind: TemplateKind): string {
  if (kind === "default" && category === "MARKETING") return "defaultMarketing";
  if (kind === "default" && category === "UTILITY") return "defaultUtility";
  if (kind === "call_permission") return "callPermission";
  return kind;
}

function getSubtypes(t: TFunction) {
  return (Object.keys(SUBTYPE_VALUES) as MetaCategory[]).reduce(
    (acc, category) => {
      acc[category] = SUBTYPE_VALUES[category].map((value) => ({
        value,
        title: t(`whatsapp.wizard.subtypes.${subtypeKey(category, value)}.title`),
        description: t(
          `whatsapp.wizard.subtypes.${subtypeKey(category, value)}.description`
        ),
      }));
      return acc;
    },
    {} as Record<
      MetaCategory,
      Array<{ value: TemplateKind; title: string; description: string }>
    >
  );
}

const STEP_KEYS = ["setup", "edit", "review"] as const;

function getSteps(t: TFunction) {
  return STEP_KEYS.map((key) => ({
    key,
    title: t(`whatsapp.wizard.steps.${key}.title`),
    hint: t(`whatsapp.wizard.steps.${key}.hint`),
  }));
}

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

function categoryLabel(value: MetaCategory, t: TFunction): string {
  return getCategories(t).find((item) => item.value === value)?.title || value;
}

function kindLabel(
  category: MetaCategory,
  kind: TemplateKind,
  t: TFunction
): string {
  return (
    getSubtypes(t)[category].find((item) => item.value === kind)?.title || kind
  );
}

function allowedButtons(category: MetaCategory): ButtonType[] {
  if (category === "AUTHENTICATION") return ["copy_code"];
  return [
    "quick_reply",
    "url",
    "voice_call",
    "phone_number",
    "request_contact_info",
  ];
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
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const languages = getLanguages(t);
  const categories = getCategories(t);
  const subtypesByCategory = getSubtypes(t);
  const steps = getSteps(t);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variables = useMemo(
    () => extractVariables(`${form.headerText}\n${form.body}`),
    [form.headerText, form.body]
  );
  const previewBody = useMemo(() => {
    let text = form.body || t("whatsapp.wizard.bodyPlaceholderPreview");
    variables.forEach((variable) => {
      text = text.replaceAll(
        `{{${variable}}}`,
        form.exampleValues[variable] || `{{${variable}}}`
      );
    });
    return text;
  }, [form.body, form.exampleValues, variables, t]);

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
    const firstKind = SUBTYPE_VALUES[value][0] || "default";
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
      toast.success(t("whatsapp.wizard.draftSaved"));
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("whatsapp.wizard.draftFailed"));
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
      const statusKey =
        rawStatus === "PENDING"
          ? "pending"
          : rawStatus === "APPROVED"
            ? "approved"
            : rawStatus === "REJECTED"
              ? "rejected"
              : rawStatus === "DRAFT"
                ? "draft"
                : "";
      const status = statusKey
        ? t(`whatsapp.wizard.status.${statusKey}`)
        : result.meta?.status || t("whatsapp.wizard.status.pending");
      toast.success(
        result.meta?.id
          ? t("whatsapp.wizard.submitted", { status })
          : t("whatsapp.wizard.savedNoMeta")
      );
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("whatsapp.wizard.submitFailed"));
    } finally {
      setSaving(false);
    }
  };

  const subtypes = subtypesByCategory[form.metaCategory];

  return (
    <section className="wa-meta-wizard" dir={dir} aria-label={t("whatsapp.wizard.ariaCreate")}>
      <header className="wa-meta-wizard__top">
        <div>
          <p className="wa-meta-kicker">{t("whatsapp.wizard.kicker")}</p>
          <h3>{t("whatsapp.wizard.title")}</h3>
        </div>
        <div className="wa-meta-wizard__top-actions">
          <span className="wa-meta-badge">{t("whatsapp.wizard.metaBadge")}</span>
          <button
            type="button"
            className="wa-meta-icon-btn"
            onClick={onClose}
            aria-label={t("whatsapp.wizard.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ol className="wa-meta-stepper">
        {steps.map((item, index) => {
          const state =
            step === index ? "current" : step > index ? "done" : "todo";
          return (
            <li key={item.key} className={`is-${state}`}>
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
        <aside className="wa-meta-preview" dir={dir}>
          <div className="wa-meta-preview__chrome">
            <strong>{t("whatsapp.wizard.preview")}</strong>
            <span>{t("whatsapp.wizard.previewBusiness")}</span>
          </div>
          <div className="wa-meta-preview__stage">
            <div className="wa-meta-bubble">
              {form.headerType === "text" && form.headerText && (
                <p className="wa-meta-bubble__header">{form.headerText}</p>
              )}
              {form.headerType === "image" && (
                <div className="wa-meta-bubble__media">{t("whatsapp.wizard.media.image")}</div>
              )}
              {form.headerType === "video" && (
                <div className="wa-meta-bubble__media">{t("whatsapp.wizard.media.video")}</div>
              )}
              {form.headerType === "document" && (
                <div className="wa-meta-bubble__media">{t("whatsapp.wizard.media.document")}</div>
              )}
              {form.headerType === "location" && (
                <div className="wa-meta-bubble__media">{t("whatsapp.wizard.media.location")}</div>
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
                      {button.text || metaButtonTypeLabel(button.type, t)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="wa-meta-editor" dir={dir}>
          {step === 0 && (
            <div className="wa-meta-card">
              <h4>{t("whatsapp.wizard.category")}</h4>
              <p className="wa-meta-help">
                {t("whatsapp.wizard.categoryHelp")}
              </p>
              <div className="wa-meta-choice-list" style={{ marginTop: 16 }}>
                {categories.map((item) => (
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
                <h4>{t("whatsapp.wizard.subcategory")}</h4>
                <p className="wa-meta-help">
                  {t("whatsapp.wizard.subcategoryHelp")}
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
                  <span className="wa-meta-label">{t("whatsapp.wizard.templateName")}</span>
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
                  {t("whatsapp.wizard.nameHelp")}
                </p>
              </label>

              <label>
                <span className="wa-meta-label">{t("whatsapp.wizard.language")}</span>
                <select
                  className="wa-meta-select"
                  value={form.language}
                  onChange={(e) => update("language", e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <p className="wa-meta-help">
                  {t("whatsapp.wizard.languageHelp")}
                </p>
              </label>

              {form.metaCategory === "AUTHENTICATION" && (
                <div className="wa-meta-auth-panel">
                  <h4>{t("whatsapp.wizard.authOptions")}</h4>
                  <p className="wa-meta-help">
{t("whatsapp.wizard.authHelp")}
                  </p>
                  <div className="wa-meta-auth-row">
                    <strong>{t("whatsapp.wizard.otp")}</strong>
                    <span>{t("whatsapp.wizard.otpHint")}</span>
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
                      <strong>{t("whatsapp.wizard.securityRec")}</strong>
                      <em>{t("whatsapp.wizard.securityRecHint")}</em>
                    </span>
                  </label>
                  <div className="wa-meta-auth-row">
                    <strong>{t("whatsapp.wizard.expiry")}</strong>
                    <span>
{t("whatsapp.wizard.expiryHint")}
                    </span>
                  </div>
                  <div className="wa-meta-auth-row">
                    <strong>{t("whatsapp.wizard.copyCode")}</strong>
                    <span>{t("whatsapp.wizard.copyCodeHint")}</span>
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
                    : t("whatsapp.wizard.bodyPlaceholder")
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
              <h4>{t("whatsapp.wizard.reviewTitle")}</h4>
              <p className="wa-meta-help">
                {t("whatsapp.wizard.reviewHelp")}
              </p>
              <dl style={{ marginTop: 14 }}>
                <dt>{t("whatsapp.wizard.category")}</dt>
                <dd>{categoryLabel(form.metaCategory, t)}</dd>
                <dt>{t("whatsapp.wizard.subcategory")}</dt>
                <dd>{kindLabel(form.metaCategory, form.templateKind, t)}</dd>
                <dt>{t("whatsapp.wizard.templateName")}</dt>
                <dd dir="ltr">{form.name || "—"}</dd>
                <dt>{t("whatsapp.wizard.language")}</dt>
                <dd>
                  {languages.find((lang) => lang.code === form.language)?.label ||
                    form.language}
                </dd>
                <dt>{t("whatsapp.wizard.header")}</dt>
                <dd>
                  {form.headerType === "text"
                    ? form.headerText || "—"
                    : form.headerType === "none"
                      ? t("whatsapp.wizard.none")
                      : form.headerType === "image"
                        ? t("whatsapp.wizard.media.image")
                        : form.headerType === "video"
                          ? t("whatsapp.wizard.media.video")
                          : form.headerType === "location"
                            ? t("whatsapp.wizard.media.location")
                            : t("whatsapp.wizard.media.document")}
                </dd>
                <dt>{t("whatsapp.wizard.body")}</dt>
                <dd style={{ whiteSpace: "pre-wrap", fontWeight: 500 }}>
                  {form.body || "—"}
                </dd>
                <dt>{t("whatsapp.wizard.footer")}</dt>
                <dd>{form.footer || "—"}</dd>
                <dt>{t("whatsapp.wizard.buttons")}</dt>
                <dd>
                  {form.buttons.length
                    ? form.buttons
                        .map(
                          (button) =>
                            `${metaButtonTypeLabel(button.type, t)}: ${button.text || button.exampleUrl}`
                        )
                        .join(" · ")
                    : "—"}
                </dd>
                <dt>{t("whatsapp.wizard.samples")}</dt>
                <dd dir="ltr">
                  {variables.length
                    ? variables
                        .map((v) => `{{${v}}}=${form.exampleValues[v] || ""}`)
                        .join(" · ")
                    : "—"}
                </dd>
              </dl>
              <p className="wa-meta-alert wa-meta-alert--warn">
{t("whatsapp.wizard.reviewWarn")}
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
              {t("whatsapp.wizard.prev")}
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              className="wa-meta-btn wa-meta-btn--primary"
              disabled={step === 0 ? !canGoEdit : !canGoReview}
              onClick={() => setStep((prev) => (prev + 1) as Step)}
            >
              {t("whatsapp.wizard.next")}
            </button>
          ) : (
            <button
              type="button"
              className="wa-meta-btn wa-meta-btn--primary"
              disabled={saving || !canGoReview}
              onClick={handleSubmit}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("whatsapp.wizard.submitReview")}
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
            {t("whatsapp.wizard.saveDraft")}
          </button>
          <button
            type="button"
            className="wa-meta-btn wa-meta-btn--ghost"
            onClick={onClose}
          >
            {t("whatsapp.wizard.close")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhatsAppCreateTemplateWizard;
