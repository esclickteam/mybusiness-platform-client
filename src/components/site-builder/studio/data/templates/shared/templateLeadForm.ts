import type {
  BizuplyFormConfig,
  BizuplyFormField,
} from "../../../FormBuilderModal";

export const TEMPLATE_FORM_SKIN_ATTR = "data-bizuply-form-skin";
export const TEMPLATE_FORM_SKIN_VALUE = "template";

/** Generic studio default - must not replace a template's native lead form. */
export function isGenericDefaultFormConfig(
  value: Partial<BizuplyFormConfig> | null | undefined,
): boolean {
  if (!value || typeof value !== "object") return false;

  const title = String(value.title || "").trim();
  const submitText = String(value.submitText || "").trim();
  const fields = Array.isArray(value.fields) ? value.fields : [];
  const fieldIds = fields.map((field) => String(field?.id || "").toLowerCase());

  const looksLikeDefaultTitle =
    title === "טופס יצירת קשר" || title === "בואו נדבר";
  const looksLikeDefaultSubmit =
    submitText === "שליחת הודעה" || submitText === "שליחת הודעה >";
  const looksLikeDefaultFields =
    fieldIds.length === 3 &&
    fieldIds.includes("name") &&
    fieldIds.includes("phone") &&
    (fieldIds.includes("message") || fieldIds.includes("other")) &&
    !fieldIds.includes("email");

  return (
    !value.preserveTemplateSkin &&
    looksLikeDefaultTitle &&
    looksLikeDefaultSubmit &&
    looksLikeDefaultFields
  );
}

export function isTemplateSkinnedForm(
  formNode: HTMLElement | null | undefined,
): boolean {
  if (!formNode) return false;
  return (
    formNode.getAttribute(TEMPLATE_FORM_SKIN_ATTR) === TEMPLATE_FORM_SKIN_VALUE
  );
}

export function findFormBuilderConfigInData(
  data: Record<string, unknown> | null | undefined,
  formId: string,
): BizuplyFormConfig | null {
  const id = String(formId || "").trim();
  if (!id || !data || typeof data !== "object") return null;

  const map = (data as Record<string, unknown>).__formBuilderByElement;
  if (!map || typeof map !== "object" || Array.isArray(map)) return null;

  const byKey = (map as Record<string, BizuplyFormConfig>)[id];
  if (byKey && typeof byKey === "object") return byKey;

  const match = Object.values(map as Record<string, BizuplyFormConfig>).find(
    (entry) => entry && String(entry.id || "").trim() === id,
  );

  return match || null;
}

export type ResolvedTemplateLeadForm = {
  fields: BizuplyFormField[];
  submitText: string;
  title: string;
  successMessage: string;
};

export function resolveTemplateLeadForm(
  data: Record<string, unknown> | null | undefined,
  formId: string,
  fallback: ResolvedTemplateLeadForm,
): ResolvedTemplateLeadForm {
  const saved = findFormBuilderConfigInData(data, formId);

  if (!saved || isGenericDefaultFormConfig(saved)) {
    return fallback;
  }

  const fields = Array.isArray(saved.fields)
    ? saved.fields.filter(Boolean)
    : [];

  return {
    fields: fields.length ? fields : fallback.fields,
    submitText: String(saved.submitText || "").trim() || fallback.submitText,
    title: String(saved.title || "").trim(),
    successMessage:
      String(saved.successMessage || "").trim() || fallback.successMessage,
  };
}
