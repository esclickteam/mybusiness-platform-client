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

export type FormContext = {
  elementId: string;
  formNode: HTMLFormElement | null;
  containerNode: HTMLElement | null;
};

export function resolveFormContext(
  node: HTMLElement | null,
  root?: HTMLElement | null,
): FormContext | null {
  if (!node) return null;

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

  return (
    root.querySelector<HTMLFormElement>(
      `form[data-visual-edit-id="${safeId}"]`,
    ) ||
    root.querySelector<HTMLFormElement>(
      `[data-visual-edit-id="${safeId}"] form`,
    ) ||
    root.querySelector<HTMLFormElement>(
      `[data-template-section-id="${safeId}"] form`,
    ) ||
    null
  );
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
      width:
        widthAttr === "full" || wrapperWidth === "full"
          ? "full"
          : widthAttr === "half" || wrapperWidth === "half"
            ? "half"
            : undefined,
    });
  });

  const submitButton = formNode.querySelector(
    'button[type="submit"], input[type="submit"]',
  );

  return normalizeFormBuilderConfig({
    id:
      formNode.getAttribute("data-bizuply-form-id") ||
      elementId ||
      fallback.id,
    title: fallback.title,
    submitText:
      String(submitButton?.textContent || "").trim() || fallback.submitText,
    successMessage:
      formNode.getAttribute("data-bizuply-success-message") ||
      fallback.successMessage,
    fields: fields.length ? fields : fallback.fields,
  });
}

export function applyFormBuilderConfigForElement(
  root: HTMLElement | null,
  elementId: string,
  form: BizuplyFormConfig,
) {
  if (!root || !elementId) return;

  let formNode = findFormNodeByElementId(root, elementId);

  if (!formNode) {
    const safeId = safeCssSelectorValue(elementId);
    const container = root.querySelector<HTMLElement>(
      `[data-visual-edit-id="${safeId}"], [data-template-section-id="${safeId}"]`,
    );

    if (container) {
      formNode = container.querySelector("form");

      if (!formNode) {
        formNode = document.createElement("form");
        formNode.className = "mt-8";
        container.appendChild(formNode);
      }
    }
  }

  if (!formNode) return;

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

  const inputClass =
    "peer h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-right text-[15px] font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  const textareaClass =
    "peer min-h-[148px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-12 text-right text-[15px] font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  const labelHtml = `
    <label
      for="${name}"
      class="mb-2.5 flex items-center gap-1.5 text-sm font-black text-slate-700"
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
    <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition peer-focus:text-violet-600">
      ${icon}
    </span>
  `;

  if (field.type === "textarea") {
    return `
      ${labelHtml}
      <div class="relative">
        <textarea id="${name}" name="${name}" placeholder="${placeholder}"${required} ${fieldAttrs} class="${textareaClass}"></textarea>
        <span class="pointer-events-none absolute right-4 top-4 text-slate-400 transition peer-focus:text-violet-600">
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
        <select id="${name}" name="${name}"${required} ${fieldAttrs} class="${inputClass} appearance-none">
          <option value="" selected disabled>${placeholder || "בחרו אפשרות"}</option>
          ${options}
        </select>
        ${iconHtml}
        <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 10 5 5 5-5"/></svg>
        </span>
      </div>
    `;
  }

  if (field.type === "checkbox") {
    return `
      <label class="group flex min-h-[62px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 transition hover:border-violet-300 hover:bg-violet-50/40">
        <span class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            ${icon}
          </span>
          <span class="text-sm font-black text-slate-700">${label} ${requiredMark}</span>
        </span>
        <input id="${name}" name="${name}" type="checkbox"${required} ${fieldAttrs} class="h-5 w-5 rounded-md border-slate-300 text-violet-600 focus:ring-violet-200" />
      </label>
    `;
  }

  if (field.type === "file") {
    return `
      ${labelHtml}
      <label class="flex min-h-[92px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 transition hover:border-violet-400 hover:bg-violet-50/60">
        <span class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200">
            ${icon}
          </span>
          <span>
            <span class="block text-sm font-black text-slate-800">${label}</span>
            <span class="mt-1 block text-xs font-semibold text-slate-400">לחצו לבחירת קובץ</span>
          </span>
        </span>
        <span class="rounded-xl bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-100">העלאה</span>
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
      <input id="${name}" name="${name}" type="${htmlType}" placeholder="${placeholder}"${required} ${fieldAttrs} class="${inputClass}" />
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
          class="${wrapperClass}"
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
    <div class="md:col-span-2 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-6 py-14 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
        ${getFieldIconSvg("text")}
      </div>
      <p class="mt-4 text-base font-black text-slate-800">הטופס עדיין ריק</p>
      <p class="mt-1 text-sm font-semibold text-slate-400">הוסיפו שדות מתוך עורך הטופס</p>
    </div>
  `;

  return `
    <div class="mb-7" data-bizuply-form-header="true">
      <div
        class="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700"
        data-visual-editable="true"
        data-visual-edit-id="form.badge"
        data-visual-edit-type="text"
        data-visual-edit-label="תגית טופס"
      >
        <span class="h-2 w-2 rounded-full bg-violet-500" data-visual-ignore-select="true"></span>
        נשמח לשמוע מכם
      </div>
      <h2
        class="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl"
        data-bizuply-form-title="true"
        data-visual-editable="true"
        data-visual-edit-id="form.title"
        data-visual-edit-type="text"
        data-visual-edit-label="${title}"
      >
        ${title}
      </h2>
      <p
        class="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500"
        data-visual-editable="true"
        data-visual-edit-id="form.subtitle"
        data-visual-edit-type="text"
        data-visual-edit-label="תיאור טופס"
      >
        השאירו פרטים ונחזור אליכם בהקדם.
      </p>
    </div>

    <div class="grid gap-x-5 gap-y-5 md:grid-cols-2" data-bizuply-form-fields="true">
      ${fields.length ? fieldHtml : emptyState}
    </div>

    <button
      type="submit"
      data-visual-editable="true"
      data-visual-edit-id="form.submit"
      data-visual-edit-type="button"
      data-visual-edit-label="${submitText}"
      class="group mt-7 inline-flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-center text-lg font-black text-slate-800 shadow-[0_20px_50px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(79,70,229,0.34)] focus:outline-none focus:ring-4 focus:ring-violet-200"
    >
      <span data-visual-ignore-select="true">${submitText}</span>
      <svg class="transition group-hover:-translate-x-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-visual-ignore-select="true">
        <path d="m9 18 6-6-6-6"/>
      </svg>
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
    "rounded-[32px]",
    "border",
    "border-white/80",
    "bg-white/95",
    "p-6",
    "shadow-[0_28px_90px_rgba(15,23,42,0.14)]",
    "backdrop-blur",
    "md:p-8",
  ];

  formNode.classList.remove("overflow-hidden");

  requiredClasses.forEach((className) => {
    formNode.classList.add(className);
  });

  formNode.innerHTML = buildFormBuilderDomHtml(safeForm);
}

export function applySavedFormBuildersToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const byElement = readFormBuilderByElement(data);

  Object.entries(byElement).forEach(([formElementId, form]) => {
    applyFormBuilderConfigForElement(
      root,
      formElementId,
      normalizeFormBuilderConfig(form),
    );
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