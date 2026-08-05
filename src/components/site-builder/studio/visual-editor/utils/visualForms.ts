import type {
  BizuplyFormConfig,
  BizuplyFormField,
  BizuplyFormFieldType,
} from "../../FormBuilderModal";
import {
  DEFAULT_FORM_COLORS,
  normalizeFormColors,
} from "../../FormBuilderModal";
import {
  isGenericDefaultFormConfig,
  isTemplateSkinnedForm,
  TEMPLATE_FORM_SKIN_ATTR,
  TEMPLATE_FORM_SKIN_VALUE,
} from "../../data/templates/shared/templateLeadForm";

import {
  FORM_BUILDER_KEY,
  readFormBuilderByElement,
} from "./visualData";

import { safeCssSelectorValue } from "./visualSelectors";

export type FormContext = {
  elementId: string;
  formNode: HTMLFormElement | null;
  containerNode: HTMLElement | null;
};

/** Booking calendar widgets must never be rewritten by the contact form builder. */
export function isBookingWidgetForm(
  formNode: HTMLElement | null | undefined,
): boolean {
  if (!formNode) return false;

  if (
    formNode.getAttribute("data-bizuply-booking-live") === "true" ||
    formNode.getAttribute("data-bizuply-widget") === "booking" ||
    formNode.getAttribute("data-bizuply-booking-mount") === "true" ||
    formNode.getAttribute("data-bizuply-block") === "booking"
  ) {
    return true;
  }

  return Boolean(
    formNode.closest(
      '[data-bizuply-booking-mount="true"], [data-bizuply-widget="booking"], [data-bizuply-booking-host="true"], [data-bizuply-block="booking"], [data-section-kind="booking"]',
    ),
  );
}

export function resolveFormContext(
  node: HTMLElement | null,
  root?: HTMLElement | null,
): FormContext | null {
  if (!node) return null;

  // Client-portal login/register mounts are not contact/lead form builders.
  if (
    node.closest(
      '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"], [data-bizuply-portal-control]',
    )
  ) {
    return null;
  }

  if (node.tagName.toLowerCase() === "form") {
    const elementId =
      node.getAttribute("data-visual-edit-id") ||
      node.closest("[data-template-section-id]")?.getAttribute(
        "data-template-section-id",
      ) ||
      node.getAttribute("data-bizuply-form-id") ||
      "form";

    return {
      elementId,
      formNode: node as HTMLFormElement,
      containerNode: node,
    };
  }

  const closestForm = node.closest("form") as HTMLFormElement | null;

  if (closestForm) {
    const elementId =
      closestForm.getAttribute("data-visual-edit-id") ||
      closestForm
        .closest("[data-template-section-id]")
        ?.getAttribute("data-template-section-id") ||
      closestForm.closest("[data-visual-edit-id]")?.getAttribute(
        "data-visual-edit-id",
      ) ||
      closestForm.getAttribute("data-bizuply-form-id") ||
      "form";

    return {
      elementId,
      formNode: closestForm,
      containerNode: closestForm,
    };
  }

  const section = node.closest(
    "[data-template-section-id], [data-visual-edit-id]",
  ) as HTMLElement | null;

  if (section) {
    const hasFields = section.querySelector("input, textarea, select");

    if (hasFields) {
      const elementId =
        section.getAttribute("data-template-section-id") ||
        section.getAttribute("data-visual-edit-id") ||
        "";

      if (elementId) {
        return {
          elementId,
          formNode: section.querySelector("form") as HTMLFormElement | null,
          containerNode: section,
        };
      }
    }
  }

  if (root) {
    const byId = String(node.getAttribute("data-visual-edit-id") || "").trim();

    if (byId) {
      const formNode = root.querySelector<HTMLFormElement>(
        `form[data-visual-edit-id="${safeCssSelectorValue(byId)}"], [data-visual-edit-id="${safeCssSelectorValue(byId)}"] form`,
      );

      if (formNode) {
        return {
          elementId: byId,
          formNode,
          containerNode: formNode,
        };
      }
    }
  }

  return null;
}

export function findFormNodeByElementId(
  root: HTMLElement | null,
  elementId: string,
): HTMLFormElement | null {
  if (!root || !elementId) return null;

  const safeId = safeCssSelectorValue(elementId);

  const candidates = [
    root.querySelector<HTMLFormElement>(
      `form[data-visual-edit-id="${safeId}"]`,
    ),
    root.querySelector<HTMLFormElement>(
      `[data-visual-edit-id="${safeId}"] form`,
    ),
    root.querySelector<HTMLFormElement>(
      `[data-template-section-id="${safeId}"] form`,
    ),
  ];

  for (const candidate of candidates) {
    if (candidate && !isBookingWidgetForm(candidate)) {
      return candidate;
    }
  }

  return null;
}

function formLooksSingleColumn(formNode: HTMLFormElement) {
  if (formNode.querySelector("[data-bizuply-form-field-width='half']")) {
    return false;
  }

  const fieldsGrid = formNode.querySelector<HTMLElement>(
    "[data-bizuply-form-fields='true']",
  );
  const gridClass = String(
    fieldsGrid?.className || formNode.className || "",
  ).toLowerCase();

  if (
    gridClass.includes("grid-cols-2") ||
    gridClass.includes("md:grid-cols-2") ||
    gridClass.includes("sm:grid-cols-2")
  ) {
    return false;
  }

  return true;
}

function collectFormColorsFromDom(
  formNode: HTMLFormElement,
): BizuplyFormConfig["colors"] | undefined {
  if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
    return undefined;
  }

  const submitButton = formNode.querySelector<HTMLElement>(
    'button[type="submit"], input[type="submit"]',
  );
  const sampleField = formNode.querySelector<HTMLElement>(
    "input:not([type='hidden']):not([type='submit']):not([type='button']), textarea, select",
  );

  const formStyles = window.getComputedStyle(formNode);
  const buttonStyles = submitButton
    ? window.getComputedStyle(submitButton)
    : null;
  const fieldStyles = sampleField ? window.getComputedStyle(sampleField) : null;

  return normalizeFormColors({
    formBg: formStyles.backgroundColor || undefined,
    formBorder: formStyles.borderColor || undefined,
    fieldBg: fieldStyles?.backgroundColor || undefined,
    fieldBorder: fieldStyles?.borderColor || undefined,
    fieldText: fieldStyles?.color || undefined,
    buttonBg: buttonStyles?.backgroundColor || undefined,
    buttonText: buttonStyles?.color || undefined,
    buttonBorder: buttonStyles?.borderColor || undefined,
  });
}

export function collectFormConfigFromDom(
  formNode: HTMLFormElement | null,
  elementId = "contact-form",
): BizuplyFormConfig {
  const fallback = createDefaultFormBuilderConfig();

  if (!formNode) {
    return {
      ...fallback,
      id: elementId || fallback.id,
    };
  }

  const preserveTemplateSkin = isTemplateSkinnedForm(formNode);
  const singleColumn = formLooksSingleColumn(formNode);
  const fields: BizuplyFormField[] = [];

  Array.from(
    formNode.querySelectorAll<HTMLElement>(
      "input, textarea, select",
    ),
  ).forEach((fieldNode, index) => {
    if (
      fieldNode instanceof HTMLInputElement &&
      (fieldNode.type === "submit" || fieldNode.type === "button" || fieldNode.type === "hidden")
    ) {
      return;
    }

    const inputType =
      fieldNode instanceof HTMLInputElement
        ? fieldNode.type
        : fieldNode instanceof HTMLTextAreaElement
          ? "textarea"
          : fieldNode instanceof HTMLSelectElement
            ? "select"
            : "text";

    const fieldId = normalizeFormFieldDomId(
      fieldNode.getAttribute("name") ||
        fieldNode.getAttribute("id") ||
        fieldNode.getAttribute("data-bizuply-form-field-id") ||
        getInputLabel(fieldNode, `field-${index + 1}`),
      index,
    );

    const widthAttr = fieldNode.getAttribute("data-bizuply-form-field-width");
    const wrapperWidth = fieldNode
      .closest("[data-bizuply-form-field-wrapper]")
      ?.getAttribute("data-bizuply-form-field-width");

    const explicitWidth =
      widthAttr === "full" || wrapperWidth === "full"
        ? "full"
        : widthAttr === "half" || wrapperWidth === "half"
          ? "half"
          : undefined;

    fields.push({
      id: fieldId,
      label: getInputLabel(fieldNode, `שדה ${index + 1}`),
      type: toBizuplyFormFieldType(inputType),
      placeholder:
        fieldNode.getAttribute("placeholder") ||
        getInputLabel(fieldNode, `שדה ${index + 1}`),
      required: fieldNode.hasAttribute("required"),
      options:
        fieldNode instanceof HTMLSelectElement
          ? Array.from(fieldNode.options)
              .map((option) => option.textContent?.trim() || "")
              .filter(Boolean)
          : [],
      width: explicitWidth || (preserveTemplateSkin || singleColumn ? "full" : undefined),
    });
  });

  const submitButton = formNode.querySelector(
    'button[type="submit"], input[type="submit"]',
  );
  const titleNode = formNode.querySelector<HTMLElement>(
    "[data-bizuply-form-title='true'], [data-bizuply-form-header] h2",
  );
  const title = preserveTemplateSkin
    ? String(titleNode?.textContent || "").trim()
    : String(titleNode?.textContent || "").trim() || fallback.title;

  return normalizeFormBuilderConfig({
    id:
      formNode.getAttribute("data-bizuply-form-id") ||
      elementId ||
      fallback.id,
    title,
    submitText:
      String(submitButton?.textContent || "").trim() || fallback.submitText,
    successMessage:
      formNode.getAttribute("data-bizuply-success-message") ||
      fallback.successMessage,
    fields: fields.length ? fields : fallback.fields,
    colors: collectFormColorsFromDom(formNode) || fallback.colors,
    preserveTemplateSkin,
  });
}

export function applyFormBuilderConfigForElement(
  root: HTMLElement | null,
  elementId: string,
  form: BizuplyFormConfig,
) {
  if (!root || !elementId) return;

  // Never hydrate form-builder config into booking calendar mounts.
  const safeId = safeCssSelectorValue(elementId);
  const targetContainer = root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeId}"], [data-template-section-id="${safeId}"]`,
  );
  if (
    targetContainer &&
    (isBookingWidgetForm(targetContainer) ||
      targetContainer.getAttribute("data-section-kind") === "booking" ||
      targetContainer.querySelector(
        '[data-bizuply-booking-mount="true"], [data-bizuply-widget="booking"]',
      ))
  ) {
    return;
  }

  let formNode = findFormNodeByElementId(root, elementId);

  if (!formNode) {
    const container = targetContainer;

    if (container && !isBookingWidgetForm(container)) {
      const nestedForms = Array.from(
        container.querySelectorAll<HTMLFormElement>("form"),
      ).filter((node) => !isBookingWidgetForm(node));
      formNode = nestedForms[0] || null;

      if (!formNode) {
        formNode = document.createElement("form");
        formNode.className = "mt-8";
        container.appendChild(formNode);
      }
    }
  }

  if (!formNode || isBookingWidgetForm(formNode)) return;

  if (!formNode.getAttribute("data-visual-edit-id")) {
    formNode.setAttribute("data-visual-edit-id", elementId);
  }

  applyFormBuilderConfigToFormNode(formNode, form);
}

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
    successMessage: "תודה! קיבלנו את הפנייה ונחזור אליך בהקדם.",
    colors: { ...DEFAULT_FORM_COLORS },
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

  const preserveTemplateSkin = Boolean(source.preserveTemplateSkin);
  const rawTitle =
    source.title === undefined || source.title === null
      ? fallback.title
      : String(source.title);

  return {
    ...fallback,
    ...source,
    id: String(source.id || fallback.id),
    title: preserveTemplateSkin ? rawTitle : rawTitle || fallback.title,
    submitText: String(source.submitText || fallback.submitText),
    successMessage: String(source.successMessage || fallback.successMessage),
    colors: normalizeFormColors(source.colors),
    preserveTemplateSkin,
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

function getFieldIconSvg(type: BizuplyFormFieldType) {
  const common =
    'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  if (type === "email") {
    return `<svg ${common}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`;
  }

  if (type === "phone") {
    return `<svg ${common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>`;
  }

  if (type === "textarea") {
    return `<svg ${common}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 8h8M8 12h5"/></svg>`;
  }

  if (type === "number") {
    return `<svg ${common}><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>`;
  }

  if (type === "date") {
    return `<svg ${common}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
  }

  if (type === "select") {
    return `<svg ${common}><path d="m7 10 5 5 5-5"/></svg>`;
  }

  if (type === "checkbox") {
    return `<svg ${common}><rect width="18" height="18" x="3" y="3" rx="4"/><path d="m8 12 3 3 5-6"/></svg>`;
  }

  if (type === "file") {
    return `<svg ${common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3"/></svg>`;
  }

  return `<svg ${common}><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`;
}

export function buildFormFieldHtml(field: BizuplyFormField, index: number) {
  const id = normalizeFormFieldDomId(field.id || field.label, index);
  const label = escapeFormHtml(field.label || `שדה ${index + 1}`);
  const placeholder = escapeFormHtml(field.placeholder || field.label || "");
  const required = field.required ? ' required aria-required="true"' : "";
  const requiredMark = field.required
    ? '<span class="text-rose-500" aria-hidden="true">*</span>'
    : "";
  const name = escapeFormHtml(id);
  const visualId = `form.${name}`;
  const fieldWidth = getFormFieldWidth(field);
  const icon = getFieldIconSvg(field.type);

  const fieldAttrs = [
    `data-bizuply-form-field-id="${name}"`,
    `data-bizuply-form-field-width="${fieldWidth}"`,
    'data-bizuply-form-control="true"',
    'data-visual-editable="true"',
    `data-visual-edit-id="${visualId}"`,
    'data-visual-edit-type="input"',
    `data-visual-edit-label="${label}"`,
  ].join(" ");

  const controlStyle =
    "background:var(--biz-form-field-bg,#fff);border-color:var(--biz-form-field-border,#e2e8f0);color:var(--biz-form-field-text,#0f172a);padding-inline-start:1rem;padding-inline-end:3rem;box-sizing:border-box;width:100%;max-width:100%";

  const inputClass =
    "bizuply-form-input peer h-14 w-full max-w-full rounded-2xl border text-right text-[15px] font-semibold outline-none transition";

  const textareaClass =
    "bizuply-form-input peer min-h-[148px] w-full max-w-full resize-y rounded-2xl border py-4 text-right text-[15px] font-semibold leading-7 outline-none transition";

  const labelHtml = `
    <label
      for="${name}"
      class="mb-2.5 flex items-center gap-1.5 text-sm font-black"
      style="color:var(--biz-form-label,#334155)"
      data-visual-editable="true"
      data-visual-edit-id="${visualId}.label"
      data-visual-edit-type="text"
      data-visual-edit-label="${label}"
      data-bizuply-form-field-label="true"
    >
      <span data-visual-ignore-select="true">${label}</span>
      ${requiredMark}
    </label>
  `;

  const iconHtml = `
    <span class="pointer-events-none absolute top-1/2 -translate-y-1/2 transition" style="inset-inline-end:1rem;color:var(--biz-form-accent,#0f766e)">
      ${icon}
    </span>
  `;

  if (field.type === "textarea") {
    return `
      ${labelHtml}
      <div class="relative">
        <textarea id="${name}" name="${name}" placeholder="${placeholder}"${required} ${fieldAttrs} class="${textareaClass}" style="${controlStyle};padding-block:1rem"></textarea>
        <span class="pointer-events-none absolute top-4 transition" style="inset-inline-end:1rem;color:var(--biz-form-accent,#0f766e)">
          ${icon}
        </span>
      </div>
    `;
  }

  if (field.type === "select") {
    const options = (
      field.options?.length
        ? field.options
        : ["אפשרות 1", "אפשרות 2"]
    )
      .map((option) => {
        const clean = escapeFormHtml(option);
        return `<option value="${clean}">${clean}</option>`;
      })
      .join("");

    return `
      ${labelHtml}
      <div class="relative">
        <select id="${name}" name="${name}"${required} ${fieldAttrs} class="${inputClass} appearance-none" style="${controlStyle}">
          <option value="" selected disabled>${placeholder || "בחרו אפשרות"}</option>
          ${options}
        </select>
        ${iconHtml}
        <span class="pointer-events-none absolute top-1/2 -translate-y-1/2" style="inset-inline-start:1rem;color:var(--biz-form-accent,#0f766e)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 10 5 5 5-5"/></svg>
        </span>
      </div>
    `;
  }

  if (field.type === "checkbox") {
    return `
      <label class="group flex min-h-[62px] cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 transition" style="${controlStyle}">
        <span class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl" style="background:color-mix(in srgb, var(--biz-form-accent,#0f766e) 12%, white);color:var(--biz-form-accent,#0f766e)">
            ${icon}
          </span>
          <span class="text-sm font-black" style="color:var(--biz-form-label,#334155)">${label} ${requiredMark}</span>
        </span>
        <input id="${name}" name="${name}" type="checkbox"${required} ${fieldAttrs} class="h-5 w-5 rounded-md" style="accent-color:var(--biz-form-accent,#0f766e)" />
      </label>
    `;
  }

  if (field.type === "file") {
    return `
      ${labelHtml}
      <label class="flex min-h-[92px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed px-5 transition" style="${controlStyle}">
        <span class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm" style="background:var(--biz-form-field-bg,#fff);color:var(--biz-form-accent,#0f766e)">
            ${icon}
          </span>
          <span>
            <span class="block text-sm font-black" style="color:var(--biz-form-title,#1e293b)">${label}</span>
            <span class="mt-1 block text-xs font-semibold" style="color:var(--biz-form-subtitle,#64748b)">לחצו לבחירת קובץ</span>
          </span>
        </span>
        <span class="rounded-xl px-4 py-2 text-xs font-black shadow-sm" style="background:var(--biz-form-field-bg,#fff);color:var(--biz-form-accent,#0f766e)">העלאה</span>
        <input id="${name}" name="${name}" type="file"${required} ${fieldAttrs} class="sr-only" />
      </label>
    `;
  }

  const htmlType =
    field.type === "phone"
      ? "tel"
      : field.type === "email" ||
          field.type === "number" ||
          field.type === "date"
        ? field.type
        : "text";

  return `
    ${labelHtml}
    <div class="relative">
      <input id="${name}" name="${name}" type="${htmlType}" placeholder="${placeholder}"${required} ${fieldAttrs} class="${inputClass}" style="${controlStyle}" />
      ${iconHtml}
    </div>
  `;
}

export function buildFormBuilderDomHtml(form: BizuplyFormConfig) {
  const safeForm = normalizeFormBuilderConfig(form);
  const fields = safeForm.fields;
  const title = escapeFormHtml(
    safeForm.title || "בואו נדבר",
  );
  const submitText = escapeFormHtml(
    safeForm.submitText || "שליחת הודעה",
  );

  const fieldHtml = fields
    .map((field, index) => {
      const width = getFormFieldWidth(field, fields.length);
      const wrapperClass =
        width === "full" ? "md:col-span-2" : "md:col-span-1";

      const fieldId = escapeFormHtml(field.id || `field-${index + 1}`);
      const fieldLabel = escapeFormHtml(field.label || `שדה ${index + 1}`);

      return `
        <div
          class="${wrapperClass} min-w-0"
          data-bizuply-form-field-wrapper="true"
          data-bizuply-form-field-id="${fieldId}"
          data-bizuply-form-field-width="${width}"
          data-visual-editable="true"
          data-visual-edit-id="form.field.${fieldId}"
          data-visual-edit-type="box"
          data-visual-edit-label="${fieldLabel}"
        >
          ${buildFormFieldHtml(field, index)}
        </div>
      `;
    })
    .join("");

  const emptyState = `
    <div class="md:col-span-2 rounded-3xl border-2 border-dashed px-6 py-14 text-center" style="border-color:color-mix(in srgb, var(--biz-form-accent,#0f766e) 35%, white);background:color-mix(in srgb, var(--biz-form-accent,#0f766e) 8%, white)">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm" style="background:var(--biz-form-field-bg,#fff);color:var(--biz-form-accent,#0f766e)">
        ${getFieldIconSvg("text")}
      </div>
      <p class="mt-4 text-base font-black" style="color:var(--biz-form-title,#1e293b)">הטופס עדיין ריק</p>
      <p class="mt-1 text-sm font-semibold" style="color:var(--biz-form-subtitle,#64748b)">הוסיפו שדות מתוך עורך הטופס</p>
    </div>
  `;

  return `
    <div class="mb-2 w-full shrink-0" data-bizuply-form-header="true">
      <div
        class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black"
        style="border-color:color-mix(in srgb, var(--biz-form-accent,#0f766e) 25%, white);background:color-mix(in srgb, var(--biz-form-accent,#0f766e) 10%, white);color:var(--biz-form-accent,#0f766e)"
        data-visual-editable="true"
        data-visual-edit-id="form.badge"
        data-visual-edit-type="text"
        data-visual-edit-label="תגית טופס"
      >
        <span class="h-2 w-2 rounded-full" style="background:var(--biz-form-accent,#0f766e)" data-visual-ignore-select="true"></span>
        נשמח לשמוע מכם
      </div>
      <h2
        class="mt-4 text-3xl font-black tracking-tight md:text-4xl"
        style="color:var(--biz-form-title,#1e293b)"
        data-bizuply-form-title="true"
        data-visual-editable="true"
        data-visual-edit-id="form.title"
        data-visual-edit-type="text"
        data-visual-edit-label="${title}"
      >
        ${title}
      </h2>
      <p
        class="mt-2 max-w-2xl text-sm font-semibold leading-7"
        style="color:var(--biz-form-subtitle,#64748b)"
        data-visual-editable="true"
        data-visual-edit-id="form.subtitle"
        data-visual-edit-type="text"
        data-visual-edit-label="תיאור טופס"
      >
        השאירו פרטים ונחזור אליכם בהקדם.
      </p>
    </div>

    <div
      class="grid w-full grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2"
      data-bizuply-form-fields="true"
    >
      ${fields.length ? fieldHtml : emptyState}
    </div>

    <div class="mt-2 w-full shrink-0" data-bizuply-form-actions="true">
      <button
        type="submit"
        data-visual-editable="true"
        data-visual-edit-id="form.submit"
        data-visual-edit-type="button"
        data-visual-edit-label="${submitText}"
        class="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border px-6 text-center text-base font-black shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 sm:h-16 sm:text-lg"
        style="background:var(--biz-form-button-bg,#0f172a);color:var(--biz-form-button-text,#fff);border-color:var(--biz-form-button-border,#0f172a)"
      >
        <span data-visual-ignore-select="true">${submitText}</span>
        <svg class="transition group-hover:-translate-x-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-visual-ignore-select="true">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  `;
}


function listTemplateFormControls(formNode: HTMLFormElement) {
  return Array.from(
    formNode.querySelectorAll<HTMLElement>("input, textarea, select"),
  ).filter((node) => {
    if (!(node instanceof HTMLInputElement)) return true;
    const type = String(node.type || "text").toLowerCase();
    return !["submit", "button", "hidden", "reset", "image"].includes(type);
  });
}

function getTemplateFieldKey(node: HTMLElement, index: number) {
  return normalizeFormFieldDomId(
    node.getAttribute("data-bizuply-form-field-id") ||
      node.getAttribute("name") ||
      node.getAttribute("id") ||
      getInputLabel(node, `field-${index + 1}`),
    index,
  );
}

function createTemplateFieldControl(
  field: BizuplyFormField,
  sample: HTMLElement | null,
) {
  const tag =
    field.type === "textarea"
      ? "textarea"
      : field.type === "select"
        ? "select"
        : "input";
  const node = document.createElement(tag) as HTMLElement;
  if (sample?.className) node.className = sample.className;
  if (sample) {
    const styleAttr = sample.getAttribute("style");
    if (styleAttr) node.setAttribute("style", styleAttr);
  }

  const name = normalizeFormFieldDomId(field.id || field.label, 0);
  node.setAttribute("name", name);
  node.setAttribute("data-bizuply-form-field-id", name);
  node.setAttribute("data-bizuply-form-field-width", field.width || "full");
  if (field.placeholder) node.setAttribute("placeholder", field.placeholder);
  if (field.required) node.setAttribute("required", "true");

  if (node instanceof HTMLInputElement) {
    node.type =
      field.type === "phone"
        ? "tel"
        : field.type === "email" ||
            field.type === "number" ||
            field.type === "date"
          ? field.type
          : "text";
  }

  if (node instanceof HTMLSelectElement) {
    const options = field.options?.length
      ? field.options
      : [field.placeholder || field.label || "בחרו אפשרות"];
    options.forEach((option, index) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (index === 0) opt.selected = true;
      node.appendChild(opt);
    });
  }

  return node;
}

/**
 * Keep template markup/classes/colors. Only sync metadata + optional field list.
 * Never replaces innerHTML / never injects generic Form Builder chrome.
 */
export function syncTemplateSkinnedFormFromConfig(
  formNode: HTMLFormElement,
  form: BizuplyFormConfig,
) {
  const safeForm = normalizeFormBuilderConfig(form);
  formNode.setAttribute(TEMPLATE_FORM_SKIN_ATTR, TEMPLATE_FORM_SKIN_VALUE);
  formNode.setAttribute("data-bizuply-form-builder", "true");
  formNode.setAttribute(
    "data-bizuply-form-id",
    safeForm.id || formNode.getAttribute("data-bizuply-form-id") || "contact-form",
  );
  formNode.setAttribute(
    "data-bizuply-success-message",
    safeForm.successMessage ||
      formNode.getAttribute("data-bizuply-success-message") ||
      "",
  );

  // Stale generic defaults must never mutate a template-designed form.
  if (isGenericDefaultFormConfig(safeForm) || isGenericDefaultFormConfig(form)) {
    return;
  }

  const submitButton = formNode.querySelector<HTMLElement>(
    'button[type="submit"], input[type="submit"]',
  );
  if (submitButton && safeForm.submitText) {
    const labelNode =
      submitButton.querySelector("[data-visual-ignore-select='true']") ||
      submitButton;
    if (labelNode === submitButton) {
      submitButton.textContent = safeForm.submitText;
    } else {
      labelNode.textContent = safeForm.submitText;
    }
  }

  // Field list sync only for explicit template-skin configs (real edits).
  if (!safeForm.preserveTemplateSkin) return;

  const desired = safeForm.fields || [];
  if (!desired.length) return;

  const existing = listTemplateFormControls(formNode);
  const existingIds = existing.map((node, index) => getTemplateFieldKey(node, index));
  const desiredIds = desired.map((field, index) =>
    normalizeFormFieldDomId(field.id || field.label, index),
  );
  const sameFieldSet =
    existingIds.length === desiredIds.length &&
    existingIds.every((id, index) => id === desiredIds[index]);
  if (sameFieldSet) return;
  const existingByKey = new Map<string, HTMLElement>();
  existing.forEach((node, index) => {
    existingByKey.set(getTemplateFieldKey(node, index), node);
  });

  const sample = existing[0] || null;
  const sampleTextarea =
    existing.find((node) => node instanceof HTMLTextAreaElement) || sample;
  const host =
    (existing[0]?.parentElement &&
    existing[0].parentElement !== formNode &&
    !existing[0].parentElement.matches("label")
      ? existing[0].parentElement
      : null) || formNode;

  const keep = new Set<string>();
  const fragment = document.createDocumentFragment();
  let usedFragment = false;

  desired.forEach((field, index) => {
    const key = normalizeFormFieldDomId(field.id || field.label, index);
    keep.add(key);
    let node = existingByKey.get(key) || null;

    if (!node) {
      node = createTemplateFieldControl(
        field,
        field.type === "textarea" ? sampleTextarea : sample,
      );
      if (host === formNode && submitButton && submitButton.parentElement === formNode) {
        formNode.insertBefore(node, submitButton);
      } else if (host !== formNode) {
        host.appendChild(node);
      } else {
        fragment.appendChild(node);
        usedFragment = true;
      }
    } else {
      node.setAttribute("name", key);
      node.setAttribute("data-bizuply-form-field-id", key);
      node.setAttribute("data-bizuply-form-field-width", field.width || "full");
      if (field.placeholder) node.setAttribute("placeholder", field.placeholder);
      if (field.required) node.setAttribute("required", "true");
      else node.removeAttribute("required");
    }
  });

  existing.forEach((node, index) => {
    const key = getTemplateFieldKey(node, index);
    if (!keep.has(key)) node.remove();
  });

  if (usedFragment) {
    if (submitButton && submitButton.parentElement === formNode) {
      formNode.insertBefore(fragment, submitButton);
    } else {
      formNode.appendChild(fragment);
    }
  }
}


export function applyFormBuilderConfigToFormNode(
  formNode: HTMLFormElement | null,
  form: BizuplyFormConfig,
) {
  if (!formNode) return;
  if (isBookingWidgetForm(formNode)) return;

  const safeForm = normalizeFormBuilderConfig(form);
  const templateSkin =
    isTemplateSkinnedForm(formNode) || Boolean(safeForm.preserveTemplateSkin);

  formNode.setAttribute("data-bizuply-form-builder", "true");
  formNode.setAttribute(
    "data-bizuply-form-id",
    safeForm.id || "contact-form",
  );
  formNode.setAttribute(
    "data-bizuply-success-message",
    safeForm.successMessage || "",
  );
  formNode.setAttribute("novalidate", "false");

  /*
    Template-native forms keep their React/Tailwind markup.
    Only sync metadata so editor/preview/public stay visually identical.
  */
  if (templateSkin) {
    syncTemplateSkinnedFormFromConfig(formNode, safeForm);
    return;
  }

  /*
    שומרים classes מקוריים של התבנית, אבל מוסיפים מעטפת אחידה ויוקרתית.
    כך הטופס נראה טוב גם בתבנית שאין לה CSS ייעודי לטפסים.
  */
  const requiredClasses = [
    "relative",
    /*
      overflow-visible so dragged labels/buttons/fields are not clipped
      inside the form card while editing (overflow-hidden made drag look broken).
    */
    "overflow-visible",
    "flex",
    "flex-col",
    "gap-6",
    "rounded-[32px]",
    "border",
    "p-6",
    "shadow-[0_28px_90px_rgba(15,23,42,0.14)]",
    "backdrop-blur",
    "md:gap-7",
    "md:p-8",
  ];

  formNode.classList.remove("overflow-hidden");
  formNode.classList.remove("grid");
  formNode.classList.remove("flex-row");
  formNode.classList.remove("border-white/80");
  formNode.classList.remove("bg-white/95");

  requiredClasses.forEach((className) => {
    formNode.classList.add(className);
  });

  const colors = normalizeFormColors(safeForm.colors);
  formNode.style.display = "flex";
  formNode.style.flexDirection = "column";
  formNode.style.gap = "1.5rem";
  formNode.style.background = colors.formBg;
  formNode.style.borderColor = colors.formBorder;
  formNode.style.setProperty("--biz-form-bg", colors.formBg);
  formNode.style.setProperty("--biz-form-border", colors.formBorder);
  formNode.style.setProperty("--biz-form-title", colors.titleColor);
  formNode.style.setProperty("--biz-form-subtitle", colors.subtitleColor);
  formNode.style.setProperty("--biz-form-label", colors.labelColor);
  formNode.style.setProperty("--biz-form-field-bg", colors.fieldBg);
  formNode.style.setProperty("--biz-form-field-border", colors.fieldBorder);
  formNode.style.setProperty("--biz-form-field-text", colors.fieldText);
  formNode.style.setProperty("--biz-form-button-bg", colors.buttonBg);
  formNode.style.setProperty("--biz-form-button-text", colors.buttonText);
  formNode.style.setProperty("--biz-form-button-border", colors.buttonBorder);
  formNode.style.setProperty("--biz-form-accent", colors.accent);

  formNode.innerHTML = buildFormBuilderDomHtml(safeForm);

  // Reset absolute drag offsets so fields never stack/crowd after edits.
  formNode
    .querySelectorAll<HTMLElement>(
      "[data-bizuply-form-header], [data-bizuply-form-fields], [data-bizuply-form-field-wrapper], [data-bizuply-form-actions], button[type='submit']"
    )
    .forEach((node) => {
      node.style.position = "relative";
      node.style.left = "auto";
      node.style.top = "auto";
      node.style.right = "auto";
      node.style.bottom = "auto";
      node.style.transform = "none";
      if (node.matches("[data-bizuply-form-fields], [data-bizuply-form-actions], [data-bizuply-form-header]")) {
        node.style.width = "100%";
      }
    });

  const fieldsGrid = formNode.querySelector<HTMLElement>(
    "[data-bizuply-form-fields='true']"
  );
  if (fieldsGrid) {
    fieldsGrid.style.display = "grid";
    fieldsGrid.style.width = "100%";
    fieldsGrid.style.gap = "1.25rem";
    // Let Tailwind md:grid-cols-2 handle breakpoints; clear stale absolute widths.
    fieldsGrid.style.gridTemplateColumns = "";
  }
}

export function applySavedFormBuildersToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const byElement = readFormBuilderByElement(data);

  Object.entries(byElement).forEach(([formElementId, form]) => {
    const formNode = findFormNodeByElementId(root, formElementId);
    if (
      (isTemplateSkinnedForm(formNode) ||
        Boolean((form as BizuplyFormConfig)?.preserveTemplateSkin)) &&
      isGenericDefaultFormConfig(form as BizuplyFormConfig)
    ) {
      return;
    }
    applyFormBuilderConfigForElement(
      root,
      formElementId,
      normalizeFormBuilderConfig(form),
    );
  });

  const fallbackForm = data?.[FORM_BUILDER_KEY];

  if (fallbackForm && Object.keys(byElement).length === 0) {
    // Only hydrate real form-builder nodes — never the first <form> on the page
    // (booking calendar widgets also render a <form> and were being overwritten).
    const fallbackTarget =
      root.querySelector<HTMLFormElement>(
        'form[data-bizuply-form-builder="true"]',
      ) ||
      root.querySelector<HTMLFormElement>("form[data-bizuply-form-id]") ||
      Array.from(root.querySelectorAll<HTMLFormElement>("form")).find(
        (node) => !isBookingWidgetForm(node),
      ) ||
      null;

    if (fallbackTarget) {
      applyFormBuilderConfigToFormNode(
        fallbackTarget,
        normalizeFormBuilderConfig(fallbackForm),
      );
    }
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