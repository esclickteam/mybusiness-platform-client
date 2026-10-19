import type { MetaLeadForm } from "../../../../../api/metaCampaignsApi";
import {
  LEAD_FORM_CONTACT_FIELDS,
  createLeadFormCustomQuestion,
  type LeadFormCustomQuestionDraft,
} from "../metaCampaignUtils";
import type { FormSharing } from "./AdsManagerFormSettingsModal";

export type LeadFormDuplicateAction = "website" | "file" | "call" | "whatsapp";

export type LeadFormDuplicateSeed = {
  sourceFormId: string;
  draftId?: string;
  idempotencyKey?: string;
  name: string;
  formType: "volume" | "intent" | "rich";
  requireSms: boolean;
  introTitle: string;
  introDescription: string;
  privacyUrl: string;
  thankYouTitle: string;
  thankYouBody: string;
  thankYouButton: string;
  additionalAction: LeadFormDuplicateAction;
  thankYouLink: string;
  callPhone: string;
  whatsappPhone: string;
  locale: string;
  sharing: FormSharing;
  contactTypes: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
  contactFieldKeys: Record<string, string>;
  trackingParameters?: Array<{ id: string; key: string; value: string }>;
};

const CONTACT_TYPES = new Set<string>(
  LEAD_FORM_CONTACT_FIELDS.map((field) => field.type)
);

export function leadFormActionFromButton(buttonType?: string): LeadFormDuplicateAction {
  const type = String(buttonType || "").toUpperCase();
  if (type === "WHATSAPP") return "whatsapp";
  if (type === "CALL_BUSINESS") return "call";
  if (type === "DOWNLOAD") return "file";
  return "website";
}

function optionLabel(option: string | { key?: string; value?: string } | undefined) {
  if (typeof option === "string") return option;
  return String(option?.value || option?.key || "");
}

export function leadFormDuplicateSeedFromMeta(
  form: Pick<
    MetaLeadForm,
    | "id"
    | "name"
    | "locale"
    | "privacyPolicyUrl"
    | "questions"
    | "contextCard"
    | "thankYouPage"
    | "followUpActionUrl"
  >
): LeadFormDuplicateSeed {
  const questions = Array.isArray(form.questions) ? form.questions : [];
  const contactTypes: string[] = [];
  const contactFieldKeys: Record<string, string> = {};
  const customQuestions: LeadFormCustomQuestionDraft[] = [];
  questions.forEach((question) => {
    const type = String(question?.type || "").toUpperCase();
    if (CONTACT_TYPES.has(type)) {
      contactTypes.push(type);
      if (question.key) contactFieldKeys[type] = question.key;
      return;
    }
    const options = (question.options || []).map((option) => optionLabel(option)).filter(Boolean);
    customQuestions.push(
      createLeadFormCustomQuestion({
        id: question.id || question.key,
        label: question.label || "",
        key: question.key,
        answerType: options.length ? "multiple_choice" : "short_answer",
        options,
      })
    );
  });
  const action = leadFormActionFromButton(form.thankYouPage?.buttonType);
  const website =
    String(form.followUpActionUrl || form.thankYouPage?.websiteUrl || "").trim();
  const phone = String(form.thankYouPage?.businessPhoneNumber || "").trim();
  const baseName = String(form.name || "").trim() || "טופס לידים";
  return {
    sourceFormId: form.id,
    name: baseName.endsWith(" - עותק") ? baseName : `${baseName} - עותק`,
    formType: "volume",
    requireSms: false,
    introTitle: form.contextCard?.title || "",
    introDescription: form.contextCard?.content || "",
    privacyUrl: form.privacyPolicyUrl || "",
    thankYouTitle: form.thankYouPage?.title || "",
    thankYouBody: form.thankYouPage?.body || "",
    thankYouButton: form.thankYouPage?.buttonText || "",
    additionalAction: action,
    thankYouLink: action === "website" || action === "file" ? website : "",
    callPhone: action === "call" ? phone : "",
    whatsappPhone: action === "whatsapp" ? phone : "",
    locale: form.locale || "he_IL",
    sharing: "restricted",
    contactTypes,
    customQuestions,
    contactFieldKeys,
  };
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function leadFormDuplicateSeedFromSavedEditor(
  sourceFormId: string,
  editor: Record<string, unknown> | null | undefined
): LeadFormDuplicateSeed | null {
  if (!editor || typeof editor !== "object" || !sourceFormId) return null;
  const name = asString(editor.name);
  const hasContent = Boolean(
    name.trim() ||
      asString(editor.introTitle).trim() ||
      asString(editor.thankYouLink).trim() ||
      asString(editor.privacyUrl).trim() ||
      (Array.isArray(editor.contactTypes) && editor.contactTypes.length) ||
      (Array.isArray(editor.customQuestions) && editor.customQuestions.length)
  );
  if (!hasContent) return null;
  const action = editor.additionalAction;
  const additionalAction: LeadFormDuplicateAction =
    action === "file" || action === "call" || action === "whatsapp" || action === "website"
      ? action
      : "website";
  const formType = editor.formType;
  const sharing = editor.sharing;
  const contactTypes = Array.isArray(editor.contactTypes)
    ? editor.contactTypes.map((type) => String(type || "")).filter(Boolean)
    : [];
  const customQuestions = Array.isArray(editor.customQuestions)
    ? editor.customQuestions.map((question) =>
        createLeadFormCustomQuestion(
          question && typeof question === "object"
            ? (question as Partial<LeadFormCustomQuestionDraft>)
            : undefined
        )
      )
    : [];
  const contactFieldKeys =
    editor.contactFieldKeys && typeof editor.contactFieldKeys === "object"
      ? Object.fromEntries(
          Object.entries(editor.contactFieldKeys as Record<string, unknown>).map(
            ([key, value]) => [key, String(value || "")]
          )
        )
      : {};
  const trackingParameters = Array.isArray(editor.trackingParameters)
    ? editor.trackingParameters.flatMap((row) => {
        if (!row || typeof row !== "object") return [];
        const item = row as { id?: string; key?: string; value?: string };
        const key = String(item.key || "").trim();
        if (!key) return [];
        return [{ id: String(item.id || `track_${key}`), key, value: String(item.value || "") }];
      })
    : [];
  return {
    sourceFormId,
    draftId: asString(editor.draftId),
    idempotencyKey: asString(editor.idempotencyKey),
    name,
    formType: formType === "intent" || formType === "rich" ? formType : "volume",
    requireSms: Boolean(editor.requireSms),
    introTitle: asString(editor.introTitle),
    introDescription: asString(editor.introDescription),
    privacyUrl: asString(editor.privacyUrl),
    thankYouTitle: asString(editor.thankYouTitle),
    thankYouBody: asString(editor.thankYouBody),
    thankYouButton: asString(editor.thankYouButton),
    additionalAction,
    thankYouLink: asString(editor.thankYouLink),
    callPhone: asString(editor.callPhone),
    whatsappPhone: asString(editor.whatsappPhone),
    locale: asString(editor.locale) || "he_IL",
    sharing: sharing === "open" ? "open" : "restricted",
    contactTypes,
    customQuestions,
    contactFieldKeys,
    trackingParameters,
  };
}
