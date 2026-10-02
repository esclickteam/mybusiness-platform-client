import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { demoToastSuccess } from "@/guidedDemo/demoToast";
import { readGuidedDemoLocaleLock } from "@/guidedDemo/sessionStore";
import {
  duplicateWhatsAppTemplate,
  saveWhatsAppTemplateDraft,
  submitWhatsAppTemplateToMeta,
  uploadWhatsAppTemplateMedia,
  type WhatsAppHeaderType,
  type WhatsAppTemplate,
  type WhatsAppTemplateButton,
  type WhatsAppTemplateSubmitPayload,
} from "@/api/whatsappApi";
import {
  buildTemplateSubmitPayload,
  contentChangeKeys,
  getTemplateEditPolicy,
  isResumableHeaderHandle,
  validateTemplateSampleFile,
  type TemplateEditorSnapshot,
} from "./whatsappTemplateEditorModel";
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
  headerPreviewUrl: string;
  headerMediaFileName: string;
  headerMediaMime: string;
  headerMediaBytes: number;
  templateId: string;
  metaTemplateId: string;
  metaStatus: string;
  rejectionReason: string;
  lastSyncError: string;
  lastMetaEditAt: string;
  body: string;
  footer: string;
  securityRecommendation: boolean;
  buttons: WhatsAppTemplateButton[];
  exampleValues: Record<string, string>;
};

const NAME_MAX = 512;
function otpBodyDefault(t: TFunction) {
  return t("leftover.waOtp.body", "{{1}} is your verification code.");
}
function securityFooter(t: TFunction) {
  return t("leftover.waOtp.footer", "For security, do not share this code.");
}

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
  MARKETING: ["default"],
  UTILITY: ["default"],
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

function demoTemplateLanguage() {
  const lock = readGuidedDemoLocaleLock();
  if (lock === "pt-BR") return "pt_BR";
  if (lock === "en" || lock === "es" || lock === "ar" || lock === "he") return lock;
  return "he";
}

const emptyForm = (): FormState => ({
  name: "",
  language: demoTemplateLanguage(),
  metaCategory: "MARKETING",
  templateKind: "default",
  variableType: "number",
  headerType: "none",
  headerText: "",
  headerHandle: "",
  headerPreviewUrl: "",
  headerMediaFileName: "",
  headerMediaMime: "",
  headerMediaBytes: 0,
  templateId: "",
  metaTemplateId: "",
  metaStatus: "LOCAL",
  rejectionReason: "",
  lastSyncError: "",
  lastMetaEditAt: "",
  body: "",
  footer: "",
  securityRecommendation: false,
  buttons: [],
  exampleValues: {},
});

function formFromTemplate(template: WhatsAppTemplate): FormState {
  const metaCategory = (["MARKETING", "UTILITY", "AUTHENTICATION"].includes(
    String(template.metaCategory || "").toUpperCase()
  )
    ? String(template.metaCategory).toUpperCase()
    : template.category === "promotion"
      ? "MARKETING"
      : "UTILITY") as MetaCategory;
  return {
    ...emptyForm(),
    name: String(template.metaTemplateName || template.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_"),
    language: template.language || "he",
    metaCategory,
    templateKind: metaCategory === "AUTHENTICATION" ? "otp" : "default",
    variableType: template.variableType === "name" ? "name" : "number",
    headerType: template.headerType || "none",
    headerText: template.headerText || "",
    headerHandle: template.headerMediaHandle || "",
    headerPreviewUrl: template.headerMediaUrl || "",
    headerMediaFileName: template.headerMediaFileName || "",
    headerMediaMime: template.headerMediaMime || "",
    headerMediaBytes: template.headerMediaBytes || 0,
    templateId: template._id,
    metaTemplateId: template.metaTemplateId || "",
    metaStatus: template.metaStatus || "LOCAL",
    rejectionReason: template.rejectionReason || "",
    lastSyncError: template.lastSyncError || "",
    lastMetaEditAt: template.lastMetaEditAt || "",
    body: template.body || "",
    footer: template.footer || "",
    buttons: (template.buttons || []).map((button) => ({ ...button })),
    exampleValues:
      template.exampleValues && !(template.exampleValues instanceof Map)
        ? { ...template.exampleValues }
        : {},
  };
}

function snapshotOf(form: FormState): TemplateEditorSnapshot {
  return {
    name: form.name,
    language: form.language,
    metaCategory: form.metaCategory,
    headerType: form.headerType,
    headerText: form.headerText,
    headerMediaHandle: form.headerHandle,
    headerMediaUrl: form.headerPreviewUrl,
    body: form.body,
    footer: form.footer,
    buttons: form.buttons,
    exampleValues: form.exampleValues,
  };
}

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

function apiErrorMessage(
  err: unknown,
  t: TFunction,
  fallback: string
): string {
  const data = (err as { response?: { data?: { code?: string; error?: string } } })
    ?.response?.data;
  const code = String(data?.code || "");
  if (code) {
    const translated = t(`whatsapp.wizard.errors.${code}`, { defaultValue: "" });
    if (translated) return translated;
  }
  return data?.error || (err instanceof Error ? err.message : fallback);
}

export function WhatsAppCreateTemplateWizard({
  businessId,
  initialTemplate = null,
  initialStep = 0,
  uploadSample,
  onClose,
  onSubmitted,
}: {
  businessId: string;
  initialTemplate?: WhatsAppTemplate | null;
  initialStep?: Step;
  uploadSample?: (
    file: File,
    headerType: "image" | "video" | "document"
  ) => Promise<{
    headerMediaHandle: string;
    headerMediaUrl?: string;
    headerMediaFileName?: string;
    headerMediaMime?: string;
    headerMediaBytes?: number;
  }>;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const languages = getLanguages(t);
  const categories = getCategories(t);
  const subtypesByCategory = getSubtypes(t);
  const steps = getSteps(t);
  const [step, setStep] = useState<Step>(initialTemplate ? 1 : initialStep);
  const [form, setForm] = useState<FormState>(() =>
    initialTemplate ? formFromTemplate(initialTemplate) : emptyForm()
  );
  const [baseline] = useState<FormState>(() =>
    initialTemplate ? formFromTemplate(initialTemplate) : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const policy = useMemo(
    () =>
      getTemplateEditPolicy({
        metaStatus: form.metaStatus as WhatsAppTemplate["metaStatus"],
        metaTemplateId: form.metaTemplateId,
        lastMetaEditAt: form.lastMetaEditAt || null,
      }),
    [form.metaStatus, form.metaTemplateId, form.lastMetaEditAt]
  );
  const mediaHeader = ["image", "video", "document"].includes(form.headerType);
  const mediaReady = !mediaHeader || isResumableHeaderHandle(form.headerHandle);
  const nameValid = /^[a-z0-9_]+$/.test(form.name) && form.name.length > 0;
  const canGoEdit = Boolean(form.metaCategory && form.templateKind);
  const canGoReview =
    nameValid &&
    Boolean(form.language) &&
    Boolean(form.body.trim()) &&
    (form.headerType !== "text" || Boolean(form.headerText.trim())) &&
    mediaReady &&
    policy.canEditContent;
  const changes = contentChangeKeys(snapshotOf(form), snapshotOf(baseline));

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
      headerPreviewUrl: value === "AUTHENTICATION" ? "" : prev.headerPreviewUrl,
      headerMediaFileName: value === "AUTHENTICATION" ? "" : prev.headerMediaFileName,
      body:
        value === "AUTHENTICATION" && !prev.body.trim()
          ? otpBodyDefault(t)
          : prev.body,
      footer:
        value === "AUTHENTICATION" && prev.securityRecommendation
          ? securityFooter(t)
          : prev.footer,
      buttons:
        value === "AUTHENTICATION"
          ? prev.buttons.filter((button) => button.type === "copy_code")
          : prev.buttons,
    }));
  };

  const buildPayload = (requireMedia = true): WhatsAppTemplateSubmitPayload =>
    buildTemplateSubmitPayload({
      templateId: form.templateId || undefined,
      name: form.name.trim(),
      language: form.language,
      metaCategory: form.metaCategory,
      variableType: form.variableType,
      headerType: form.headerType,
      headerText: form.headerText,
      headerMediaUrl: form.headerPreviewUrl,
      headerMediaHandle: form.headerHandle,
      headerMediaFileName: form.headerMediaFileName,
      headerMediaMime: form.headerMediaMime,
      headerMediaBytes: form.headerMediaBytes,
      body: form.body,
      footer: form.footer,
      buttons: form.buttons,
      exampleValues: form.exampleValues,
    }, { requireMedia });

  const handleUpload = async (file: File) => {
    const kind = form.headerType;
    if (kind !== "image" && kind !== "video" && kind !== "document") return;
    const problem = validateTemplateSampleFile(file, kind);
    if (problem) {
      const key =
        problem === "too-large"
          ? "whatsapp.wizard.errors.FILE_TOO_LARGE"
          : problem === "mime"
            ? "whatsapp.wizard.errors.UNSUPPORTED_MIME"
            : "whatsapp.wizard.errors.EMPTY_FILE";
      setError(t(key));
      return;
    }
    setUploading(true);
    setError(null);
    const localUrl = URL.createObjectURL(file);
    try {
      const uploaded = uploadSample
        ? await uploadSample(file, kind)
        : await uploadWhatsAppTemplateMedia(businessId, kind, file);
      if (!isResumableHeaderHandle(uploaded.headerMediaHandle)) {
        setError(t("whatsapp.wizard.errors.RESUMABLE_UPLOAD_FAILED"));
        return;
      }
      setForm((prev) => ({
        ...prev,
        headerHandle: uploaded.headerMediaHandle,
        headerPreviewUrl: uploaded.headerMediaUrl || localUrl,
        headerMediaFileName: uploaded.headerMediaFileName || file.name,
        headerMediaMime: uploaded.headerMediaMime || file.type,
        headerMediaBytes: uploaded.headerMediaBytes || file.size,
      }));
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        headerHandle: "",
        headerPreviewUrl: "",
        headerMediaFileName: "",
      }));
      setError(apiErrorMessage(err, t, t("whatsapp.wizard.errors.RESUMABLE_UPLOAD_FAILED")));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveWhatsAppTemplateDraft(businessId, buildPayload(false));
      toast.success(t("whatsapp.wizard.draftSaved"));
      onSubmitted();
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err, t, t("whatsapp.wizard.draftFailed")));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!mediaReady) {
        setError(t("whatsapp.wizard.errors.MEDIA_SAMPLE_REQUIRED"));
        return;
      }
      const result = await submitWhatsAppTemplateToMeta(
        businessId,
        buildPayload(true)
      );
      if (result.demoSafe) {
        demoToastSuccess(
          t(
            "whatsapp.wizard.demoSaved",
            "Demo template saved. It was not sent to Meta."
          )
        );
        onSubmitted();
        onClose();
        return;
      }
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
      setError(apiErrorMessage(err, t, t("whatsapp.wizard.submitFailed")));
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
          <h3>
            {initialTemplate
              ? t("whatsapp.wizard.editTitle")
              : t("whatsapp.wizard.title")}
          </h3>
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

      <div className="wa-meta-wizard__body">
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
                <div className="wa-meta-bubble__media">
                  {form.headerPreviewUrl ? (
                    <img src={form.headerPreviewUrl} alt="" />
                  ) : (
                    t("whatsapp.wizard.media.image")
                  )}
                </div>
              )}
              {form.headerType === "video" && (
                <div className="wa-meta-bubble__media">
                  {form.headerPreviewUrl ? (
                    <video src={form.headerPreviewUrl} muted />
                  ) : (
                    t("whatsapp.wizard.media.video")
                  )}
                </div>
              )}
              {form.headerType === "document" && (
                <div className="wa-meta-bubble__media">
                  {form.headerMediaFileName || t("whatsapp.wizard.media.document")}
                </div>
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
                    disabled={!policy.canEditCategory}
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
                    disabled={!policy.canEditCategory}
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
                  disabled={!policy.canEditName}
                  onChange={(e) =>
                    update("name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))
                  }
                  placeholder="welcome_offer"
                />
                <p className="wa-meta-help">
                  {t("whatsapp.wizard.nameHelp")}
                </p>
              </label>

              {policy.lockMessageKey ? (
                <p className="wa-meta-alert wa-meta-alert--warn">
                  {t(policy.lockMessageKey)}
                </p>
              ) : null}
              {form.lastSyncError ? (
                <p className="wa-meta-alert wa-meta-alert--error">
                  {t("whatsapp.wizard.syncError", { message: form.lastSyncError })}
                </p>
              ) : null}
              {form.rejectionReason ? (
                <p className="wa-meta-alert wa-meta-alert--error">{form.rejectionReason}</p>
              ) : null}

              <label>
                <span className="wa-meta-label">{t("whatsapp.wizard.language")}</span>
                <select
                  className="wa-meta-select"
                  value={form.language}
                  disabled={!policy.canEditLanguage}
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
                          footer: checked ? securityFooter(t) : "",
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
                headerMediaUrl={form.headerPreviewUrl}
                headerMediaFileName={form.headerMediaFileName}
                body={form.body}
                footer={form.footer}
                buttons={form.buttons}
                exampleValues={form.exampleValues}
                variableType={form.variableType}
                showHeader={form.metaCategory !== "AUTHENTICATION"}
                allowedButtons={allowedButtons(form.metaCategory)}
                mediaUploading={uploading}
                mediaError={mediaHeader && !mediaReady && error ? error : ""}
                readOnly={!policy.canEditContent}
                bodyPlaceholder={
                  form.metaCategory === "AUTHENTICATION"
                    ? otpBodyDefault(t)
                    : t("whatsapp.wizard.bodyPlaceholder")
                }
                onUploadFile={(file) => void handleUpload(file)}
                onClearMedia={() =>
                  setForm((prev) => ({
                    ...prev,
                    headerHandle: "",
                    headerPreviewUrl: "",
                    headerMediaFileName: "",
                    headerMediaMime: "",
                    headerMediaBytes: 0,
                  }))
                }
                onChange={(patch) =>
                  setForm((prev) => {
                    const nextType = patch.headerType ?? prev.headerType;
                    const mediaChanged =
                      patch.headerType !== undefined && patch.headerType !== prev.headerType;
                    return {
                      ...prev,
                      ...patch,
                      headerHandle: mediaChanged ? "" : prev.headerHandle,
                      headerPreviewUrl: mediaChanged ? "" : prev.headerPreviewUrl,
                      headerMediaFileName: mediaChanged ? "" : prev.headerMediaFileName,
                      headerMediaMime: mediaChanged ? "" : prev.headerMediaMime,
                      headerMediaBytes: mediaChanged ? 0 : prev.headerMediaBytes,
                      headerType: nextType,
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
              {initialTemplate ? (
                <div>
                  <h5>{t("whatsapp.wizard.changesTitle")}</h5>
                  <p className="wa-meta-help">
                    {changes.length
                      ? changes
                          .map((key) => t(`whatsapp.wizard.changeFields.${key}`))
                          .join(" · ")
                      : t("whatsapp.wizard.noChanges")}
                  </p>
                </div>
              ) : null}
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
              disabled={saving || !form.name || !policy.canSaveLocalDraft}
              onClick={handleSaveDraft}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("whatsapp.wizard.saveDraft")}
            </button>
            {form.templateId ? (
              <button
                type="button"
                className="wa-meta-btn wa-meta-btn--secondary"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  setError(null);
                  try {
                    await duplicateWhatsAppTemplate(businessId, form.templateId);
                    toast.success(t("whatsapp.wizard.duplicated"));
                    onSubmitted();
                    onClose();
                  } catch (err) {
                    setError(apiErrorMessage(err, t, t("whatsapp.wizard.draftFailed")));
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {t("whatsapp.wizard.duplicate")}
              </button>
            ) : null}
            {initialTemplate ? (
              <button
                type="button"
                className="wa-meta-btn wa-meta-btn--ghost"
                disabled={saving || changes.length === 0}
                onClick={() => {
                  setForm(baseline);
                  setError(null);
                }}
              >
                {t("whatsapp.wizard.discard")}
              </button>
            ) : null}
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
