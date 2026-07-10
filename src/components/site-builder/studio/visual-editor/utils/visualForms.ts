import type {
  BizuplyFormConfig,
  BizuplyFormField,
  BizuplyFormFieldType,
} from "../../FormBuilderModal";

import {
  FORM_BUILDER_KEY,
  readFormBuilderByElement,
} from "./visualData";

import { safeCssSelectorValue } from "./visualSelectors";

export function toBizuplyFormFieldType(value: string): BizuplyFormFieldType {
  const clean = String(value || "").toLowerCase();

  if (clean === "email") return "email";
  if (clean === "tel" || clean === "phone") return "phone";
  if (clean === "textarea") return "textarea";
  if (clean === "number") return "number";
  if (clean === "date") return "date";
  if (clean === "select" || clean === "select-one" || clean === "select-multiple") {
    return "select";
  }
  if (clean === "checkbox") return "checkbox";
  if (clean === "file") return "file";

  return "text";
}

export function createDefaultFormBuilderConfig(): BizuplyFormConfig {
  return {
    id: "contact-form",
    title: "טופס יצירת קשר",
    submitText: "שליחת הודעה",
    successMessage: "ההודעה נשלחה בהצלחה",
    fields: [
      {
        id: "name",
        label: "שם מלא",
        type: "text",
        placeholder: "שם מלא",
        required: true,
        options: [],
      },
      {
        id: "phone",
        label: "טלפון",
        type: "phone",
        placeholder: "טלפון",
        required: true,
        options: [],
      },
      {
        id: "message",
        label: "הודעה",
        type: "textarea",
        placeholder: "איך אפשר לעזור?",
        required: false,
        options: [],
      },
    ],
  };
}

export function normalizeFormBuilderConfig(value: unknown): BizuplyFormConfig {
  const fallback = createDefaultFormBuilderConfig();

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const source = value as Partial<BizuplyFormConfig>;

  return {
    ...fallback,
    ...source,
    id: String(source.id || fallback.id),
    title: String(source.title || fallback.title),
    submitText: String(source.submitText || fallback.submitText),
    successMessage: String(source.successMessage || fallback.successMessage),
    fields: Array.isArray(source.fields)
      ? source.fields.map((field, index) => ({
          id: String(field?.id || `field-${index + 1}`),
          label: String(field?.label || `שדה ${index + 1}`),
          type: field?.type || "text",
          placeholder: String(field?.placeholder || ""),
          required: Boolean(field?.required),
          options: Array.isArray(field?.options)
            ? field.options.map((option) => String(option)).filter(Boolean)
            : [],
          width:
            field?.width === "full"
              ? "full"
              : field?.width === "half"
                ? "half"
                : undefined,
        }))
      : fallback.fields,
  };
}

export function escapeFormHtml(value: unknown) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function normalizeFormFieldDomId(value: string, index: number) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `field-${index + 1}`
  );
}

export function getFormFieldWidth(field: BizuplyFormField, fieldsLength = 2) {
  if (field.width === "full" || field.width === "half") {
    return field.width;
  }

  if (fieldsLength === 1) return "full";

  if (
    field.type === "textarea" ||
    field.type === "select" ||
    field.type === "checkbox" ||
    field.type === "file"
  ) {
    return "full";
  }

  return "half";
}

export function buildFormFieldHtml(field: BizuplyFormField, index: number) {
  const id = normalizeFormFieldDomId(field.id || field.label, index);
  const label = escapeFormHtml(field.label || `שדה ${index + 1}`);
  const placeholder = escapeFormHtml(field.placeholder || field.label || "");
  const required = field.required ? ' required aria-required="true"' : "";
  const name = escapeFormHtml(id);
  const visualId = `form.${name}`;
  const fieldWidth = getFormFieldWidth(field);

  const fieldAttrs = `data-bizuply-form-field-id="${name}" data-bizuply-form-field-width="${fieldWidth}"`;

  const inputClass =
    "h-14 w-full rounded-[22px] border border-slate-200 bg-white px-6 text-right text-base font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

  const textareaClass =
    "min-h-[150px] w-full resize-y rounded-[22px] border border-slate-200 bg-white px-6 py-5 text-right text-base font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

  if (field.type === "textarea") {
    return `<textarea id="${name}" name="${name}" placeholder="${placeholder}"${required} ${fieldAttrs} data-visual-editable="true" data-visual-edit-id="${visualId}" data-visual-edit-type="button" data-visual-edit-label="${label}" class="${textareaClass}"></textarea>`;
  }

  if (field.type === "select") {
    const options = (field.options?.length ? field.options : ["אפשרות 1", "אפשרות 2"])
      .map((option) => {
        const clean = escapeFormHtml(option);
        return `<option value="${clean}">${clean}</option>`;
      })
      .join("");

    return `<select id="${name}" name="${name}"${required} ${fieldAttrs} data-visual-editable="true" data-visual-edit-id="${visualId}" data-visual-edit-type="button" data-visual-edit-label="${label}" class="${inputClass}">${options}</select>`;
  }

  if (field.type === "checkbox") {
    return `<label ${fieldAttrs} class="flex min-h-[56px] items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-white px-6 text-base font-black text-slate-800"><span>${label}</span><input id="${name}" name="${name}" type="checkbox"${required} ${fieldAttrs} data-visual-editable="true" data-visual-edit-id="${visualId}" data-visual-edit-type="button" data-visual-edit-label="${label}" class="h-5 w-5 rounded border-slate-300 text-blue-600" /></label>`;
  }

  const htmlType =
    field.type === "phone"
      ? "tel"
      : field.type === "email" ||
          field.type === "number" ||
          field.type === "date" ||
          field.type === "file"
        ? field.type
        : "text";

  return `<input id="${name}" name="${name}" type="${htmlType}" placeholder="${placeholder}"${required} ${fieldAttrs} data-visual-editable="true" data-visual-edit-id="${visualId}" data-visual-edit-type="button" data-visual-edit-label="${label}" class="${inputClass}" />`;
}

export function buildFormBuilderDomHtml(form: BizuplyFormConfig) {
  const safeForm = normalizeFormBuilderConfig(form);
  const fields = safeForm.fields.length
    ? safeForm.fields
    : createDefaultFormBuilderConfig().fields;

  const submitText = escapeFormHtml(safeForm.submitText || "שליחת הודעה");

  const fieldHtml = fields
    .map((field, index) => {
      const width = getFormFieldWidth(field, fields.length);
      const wrapperClass = width === "full" ? "md:col-span-2" : "";

      return `<div class="${wrapperClass}" data-bizuply-form-field-wrapper="true" data-bizuply-form-field-width="${width}">${buildFormFieldHtml(field, index)}</div>`;
    })
    .join("");

  return `
    <div class="grid gap-5 md:grid-cols-2" data-bizuply-form-fields="true">
      ${fieldHtml}
    </div>
    <button type="submit" data-visual-editable="true" data-visual-edit-id="form.submit" data-visual-edit-type="button" data-visual-edit-label="${submitText}" class="mt-7 h-16 w-full rounded-[22px] bg-blue-600 px-6 text-center text-lg font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.24)] transition hover:bg-blue-700">
      ${submitText}
    </button>
  `;
}

export function applyFormBuilderConfigToFormNode(
  formNode: HTMLFormElement | null,
  form: BizuplyFormConfig,
) {
  if (!formNode) return;

  const safeForm = normalizeFormBuilderConfig(form);

  formNode.setAttribute("data-bizuply-form-builder", "true");
  formNode.setAttribute("data-bizuply-form-id", safeForm.id || "contact-form");
  formNode.setAttribute("data-bizuply-success-message", safeForm.successMessage || "");
  formNode.innerHTML = buildFormBuilderDomHtml(safeForm);
}

export function applySavedFormBuildersToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const byElement = readFormBuilderByElement(data);

  Object.entries(byElement).forEach(([formElementId, form]) => {
    const safeId = safeCssSelectorValue(formElementId);

    const formNode = root.querySelector<HTMLFormElement>(
      `form[data-visual-edit-id="${safeId}"], [data-visual-edit-id="${safeId}"] form`,
    );

    applyFormBuilderConfigToFormNode(formNode, normalizeFormBuilderConfig(form));
  });

  const fallbackForm = data?.[FORM_BUILDER_KEY];

  if (fallbackForm && Object.keys(byElement).length === 0) {
    applyFormBuilderConfigToFormNode(
      root.querySelector<HTMLFormElement>("form"),
      normalizeFormBuilderConfig(fallbackForm),
    );
  }
}

export function getInputLabel(fieldNode: HTMLElement, fallback: string) {
  const attrLabel =
    fieldNode.getAttribute("aria-label") ||
    fieldNode.getAttribute("data-visual-edit-label") ||
    fieldNode.getAttribute("placeholder") ||
    "";

  if (attrLabel) return attrLabel;

  const id = fieldNode.getAttribute("id");
  const form = fieldNode.closest("form");

  if (id && form) {
    const label = form.querySelector(`label[for="${safeCssSelectorValue(id)}"]`);
    const text = String(label?.textContent || "").replace(/\s+/g, " ").trim();

    if (text) return text;
  }

  const parentLabel = fieldNode.closest("label");
  const parentLabelText = String(parentLabel?.textContent || "")
    .replace(/\s+/g, " ")
    .trim();

  if (parentLabelText) return parentLabelText;

  return fallback;
}