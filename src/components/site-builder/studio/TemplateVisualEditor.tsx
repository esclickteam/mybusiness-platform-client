import React from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Italic,
  Layers,
  Link2,
  Monitor,
  MoveDown,
  MoveUp,
  PaintBucket,
  Palette,
  PanelLeft,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Type,
  Underline,
  X,
} from "lucide-react";

import type {
  VisualEditableElementType,
  VisualSelectedElement,
} from "./VisualInspector";

import type {
  ActiveStudioPanel,
  AnimationPresetValue,
  StudioSitePage,
  StudioSitePageType,
  StylePatch,
} from "./types";

import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";
import StudioFontPicker from "./StudioFontPicker";
import FormBuilderModal, {
  type BizuplyFormConfig,
  type BizuplyFormField,
  type BizuplyFormFieldType,
} from "./FormBuilderModal";
import LinkSettingsModal from "./LinkSettingsModal";

type VisualDeviceMode = "desktop" | "tablet" | "mobile";

type TemplateVisualEditorProps = {
  renderer: StudioTemplateRenderer;
  businessId?: string;
  initialData?: Record<string, any>;
  onBack?: () => void;
  onSave?: (payload: {
    templateKey: string;
    editorMode: "visual-react";
    data: Record<string, any>;
    updatedAt: string;
    published?: boolean;
    status?: "draft" | "published";
    slug?: string;
    publicUrl?: string;
    siteDomain?: string;
    domain?: {
      slug: string;
      published: boolean;
    };
    htmlSnapshot?: string;
    snapshotPageId?: string;
  }) => void | Promise<void>;
};

type VisualPageSection = {
  id: string;
  title: string;
  kind: string;
  tagName: string;
};

type VisualStyleMap = Record<string, StylePatch>;
type VisualAnimationMap = Record<string, AnimationPresetValue | string>;
type VisualContentMap = Record<
  string,
  {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    target?: "_self" | "_blank" | string;
    rel?: string;
  }
>;

type VisualSelectedElementWithLink = VisualSelectedElement & {
  linkValue?: string;
  linkTarget?: "_self" | "_blank" | string;
};

const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_CONTENT_KEY = "__content";
const FORM_BUILDER_KEY = "__formBuilder";

const FORM_BUILDER_BY_ELEMENT_KEY = "__formBuilderByElement";

function toBizuplyFormFieldType(value: string): BizuplyFormFieldType {
  const clean = String(value || "").toLowerCase();

  if (clean === "email") return "email";
  if (clean === "tel" || clean === "phone") return "phone";
  if (clean === "textarea") return "textarea";
  if (clean === "number") return "number";
  if (clean === "date") return "date";
  if (clean === "select" || clean === "select-one" || clean === "select-multiple") return "select";
  if (clean === "checkbox") return "checkbox";
  if (clean === "file") return "file";

  return "text";
}

function getInputLabel(fieldNode: HTMLElement, fallback: string) {
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
  const parentLabelText = String(parentLabel?.textContent || "").replace(/\s+/g, " ").trim();

  if (parentLabelText) return parentLabelText;

  return fallback;
}

function readFormBuilderByElement(data: Record<string, any>) {
  const value = data?.[FORM_BUILDER_BY_ELEMENT_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, BizuplyFormConfig>;
  }

  return {};
}

function createDefaultFormBuilderConfig(): BizuplyFormConfig {
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

function normalizeFormBuilderConfig(value: unknown): BizuplyFormConfig {
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
          width: field?.width === "full" ? "full" : field?.width === "half" ? "half" : undefined,
        }))
      : fallback.fields,
  };
}


function escapeFormHtml(value: unknown) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeFormFieldDomId(value: string, index: number) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `field-${index + 1}`
  );
}

function getFormFieldWidth(field: BizuplyFormField, fieldsLength = 2) {
  if (field.width === "full" || field.width === "half") {
    return field.width;
  }

  if (fieldsLength === 1) return "full";
  if (field.type === "textarea" || field.type === "select" || field.type === "checkbox" || field.type === "file") {
    return "full";
  }

  return "half";
}

function buildFormFieldHtml(field: BizuplyFormField, index: number) {
  const id = normalizeFormFieldDomId(field.id || field.label, index);
  const label = escapeFormHtml(field.label || `שדה ${index + 1}`);
  const placeholder = escapeFormHtml(field.placeholder || field.label || "");
  const required = field.required ? " required aria-required=\"true\"" : "";
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
      : field.type === "email" || field.type === "number" || field.type === "date" || field.type === "file"
        ? field.type
        : "text";

  return `<input id="${name}" name="${name}" type="${htmlType}" placeholder="${placeholder}"${required} ${fieldAttrs} data-visual-editable="true" data-visual-edit-id="${visualId}" data-visual-edit-type="button" data-visual-edit-label="${label}" class="${inputClass}" />`;
}

function buildFormBuilderDomHtml(form: BizuplyFormConfig) {
  const safeForm = normalizeFormBuilderConfig(form);
  const fields = safeForm.fields.length ? safeForm.fields : createDefaultFormBuilderConfig().fields;
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

function applyFormBuilderConfigToFormNode(
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

function applySavedFormBuildersToDom(root: HTMLElement | null, data: Record<string, any>) {
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

function cloneData<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch {
    return {} as T;
  }
}

function normalizeSlug(value: string | null | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\//, "").replace(/\/$/, "");
}

function getPageType(pageId: string): StudioSitePageType {
  if (pageId === "home") return "home";
  if (pageId === "shop") return "store";
  if (pageId === "product") return "product";
  if (pageId === "cart") return "store";
  if (pageId === "contact") return "contact";
  if (pageId === "about") return "about";
  if (pageId === "projects") return "gallery";
  if (pageId === "custom") return "service";
  if (pageId === "faq") return "blank";
  if (pageId === "terms") return "blank";
  if (pageId === "privacy") return "blank";
  if (pageId === "accessibility") return "blank";
  if (pageId === "shipping") return "blank";
  if (pageId === "orders") return "blank";

  return "blank";
}

function getSectionTagName(sectionId: string) {
  if (sectionId === "header") return "header";
  if (sectionId === "footer") return "footer";

  return "section";
}

function getDeviceWidth(device: VisualDeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";

  return "100%";
}

function getDeviceLabel(device: VisualDeviceMode) {
  if (device === "mobile") return "טלפון";
  if (device === "tablet") return "טאבלט";

  return "דסקטופ";
}


const BIZUPLY_PUBLIC_SITE_DOMAIN = "sites.bizuply.com";

function normalizeBusinessSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[֐-׿]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function isValidBusinessSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function buildPublicSiteUrl(value: string) {
  const clean = normalizeBusinessSlug(value) || "your-business";
  return `https://${clean}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`;
}

function getStoredAuthToken() {
  if (typeof window === "undefined") return "";

  const keys = [
    "token",
    "authToken",
    "accessToken",
    "jwt",
    "bizuplyToken",
    "businessToken",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return "";
}

function buildAuthHeaders(extraHeaders?: Record<string, string>) {
  const token = getStoredAuthToken();

  return {
    ...(extraHeaders || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getSectionIdFromVisualId(elementId: string) {
  const clean = String(elementId || "").trim();

  if (!clean) return "";

  return clean.split(".")[0] || "";
}

function getFieldKeyFromVisualId(elementId: string) {
  const clean = String(elementId || "").trim();
  const parts = clean.split(".");

  if (parts.length < 2) return "";

  return parts.slice(1).join(".");
}

function normalizeFieldKeyForTemplate(fieldKey: string, elementType?: string) {
  const clean = String(fieldKey || "").trim();

  if (!clean) return "";

  if (clean === "button") return "buttonText";
  if (clean === "cta") return "buttonText";
  if (clean === "heading") return "title";
  if (clean === "description") return "subtitle";
  if (clean === "image" || elementType === "image") return clean;

  return clean;
}

function normalizeStyle(style: StylePatch): StylePatch {
  const next: StylePatch = {};

  Object.entries(style || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const camelKey = key.includes("-")
      ? key.replace(/-([a-z])/g, (_, letter) => String(letter).toUpperCase())
      : key;

    next[camelKey] = value;
  });

  return next;
}

function cssPropertyName(key: string) {
  if (key.startsWith("--")) return key;

  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function cssValue(value: string | number) {
  if (typeof value === "number") return String(value);

  return String(value || "");
}

function safeCssSelectorValue(value: string) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function selectorForVisualElement(elementId: string) {
  const safeId = safeCssSelectorValue(elementId);
  const sectionId = getSectionIdFromVisualId(elementId);
  const selectors = [`[data-visual-edit-id="${safeId}"]`];

  if (elementId.endsWith(".section") && sectionId) {
    const safeSectionId = safeCssSelectorValue(sectionId);

    selectors.push(`[data-template-section-id="${safeSectionId}"]`);
    selectors.push(`[data-section-kind="${safeSectionId}"]`);
  }

  return selectors.join(",\n");
}

function stylePatchToCss(style: StylePatch) {
  return Object.entries(style || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `  ${cssPropertyName(key)}: ${cssValue(value as string | number)} !important;`)
    .join("\n");
}

function getAnimationCssValue(animation: AnimationPresetValue | string) {
  if (!animation) return "";

  if (animation === "fade-up") return "bizuplyVisualFadeUp 980ms cubic-bezier(.22,1,.36,1) both";
  if (animation === "zoom-in") return "bizuplyVisualZoomIn 980ms cubic-bezier(.22,1,.36,1) both";
  if (animation === "slide-right") return "bizuplyVisualSlideRight 980ms cubic-bezier(.22,1,.36,1) both";
  if (animation === "slide-left") return "bizuplyVisualSlideLeft 980ms cubic-bezier(.22,1,.36,1) both";
  if (animation === "blur-reveal") return "bizuplyVisualSoftReveal 980ms cubic-bezier(.22,1,.36,1) both";
  if (animation === "float-soft") return "bizuplyVisualFloatSoft 4s ease-in-out infinite";
  if (animation === "pulse-soft") return "bizuplyVisualPulseSoft 3s ease-in-out infinite";

  return String(animation);
}

function buildVisualRuntimeCss(
  styles: VisualStyleMap,
  animations: VisualAnimationMap,
  selectedElementId?: string,
  hoveredElementId?: string,
) {
  const chunks: string[] = [
    `
@keyframes bizuplyVisualFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bizuplyVisualZoomIn {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bizuplyVisualSlideRight {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bizuplyVisualSlideLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bizuplyVisualSoftReveal {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bizuplyVisualFloatSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes bizuplyVisualPulseSoft {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.92; transform: scale(1.008); }
}

[data-visual-template-canvas="true"] [data-visual-editable="true"] {
  outline-offset: 2px;
}

[data-visual-template-canvas="true"] [data-visual-editable="true"] * {
  pointer-events: auto;
}

[data-visual-template-canvas="true"] [data-visual-editable="true"][data-visual-hovered="true"] {
  outline: 1px dashed rgba(37, 99, 235, 0.55) !important;
  outline-offset: 2px !important;
}

[data-visual-template-canvas="true"] [data-visual-editable="true"][data-visual-selected="true"] {
  outline: none !important;
  box-shadow: none !important;
}

[data-visual-template-canvas="true"] [data-visual-inline-editing="true"] {
  cursor: text !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  outline: 2px solid rgba(37, 99, 235, 0.72) !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.10) !important;
  white-space: pre-wrap !important;
}

[data-visual-template-canvas="true"] [data-visual-inline-editing="true"] * {
  user-select: text !important;
  -webkit-user-select: text !important;
}

[data-visual-template-canvas="true"] a,
[data-visual-template-canvas="true"] button,
[data-visual-template-canvas="true"] input,
[data-visual-template-canvas="true"] textarea,
[data-visual-template-canvas="true"] select {
  cursor: default !important;
}
`,
  ];

  Object.entries(styles || {}).forEach(([elementId, style]) => {
    const css = stylePatchToCss(style);

    if (!css) return;

    chunks.push(`${selectorForVisualElement(elementId)} {\n${css}\n}`);
  });

  Object.entries(animations || {}).forEach(([elementId, animation]) => {
    const animationCss = getAnimationCssValue(animation);

    if (!animationCss) return;

    chunks.push(`${selectorForVisualElement(elementId)} {\n  animation: ${animationCss} !important;\n}`);
  });

  if (selectedElementId) {
    chunks.push(`${selectorForVisualElement(selectedElementId)} {\n  outline: 3px solid rgba(124, 58, 237, 0.92) !important;\n  outline-offset: 5px !important;\n}`);
  }

  return chunks.join("\n\n");
}

function readVisualStyles(data: Record<string, any>): VisualStyleMap {
  const value = data?.[VISUAL_STYLE_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualStyleMap;
  }

  return {};
}

function readVisualAnimations(data: Record<string, any>): VisualAnimationMap {
  const value = data?.[VISUAL_ANIMATION_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualAnimationMap;
  }

  return {};
}

function readVisualContent(data: Record<string, any>): VisualContentMap {
  const value = data?.[VISUAL_CONTENT_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualContentMap;
  }

  return {};
}

function getNodeText(node: HTMLElement | null) {
  return String(node?.textContent || "").replace(/\s+/g, " ").trim();
}

function getNodeImageSrc(node: HTMLElement | null) {
  if (!node) return "";

  const imageNode =
    node instanceof HTMLImageElement
      ? node
      : (node.querySelector?.("img") as HTMLImageElement | null);

  return String(imageNode?.getAttribute("src") || imageNode?.src || "");
}

function getNodeImageAlt(node: HTMLElement | null) {
  if (!node) return "";

  const imageNode =
    node instanceof HTMLImageElement
      ? node
      : (node.querySelector?.("img") as HTMLImageElement | null);

  return String(imageNode?.getAttribute("alt") || "");
}

function getElementLabel({
  elementId,
  elementType,
  sectionLabel,
  node,
}: {
  elementId: string;
  elementType: VisualEditableElementType;
  sectionLabel?: string;
  node?: HTMLElement | null;
}) {
  const attrLabel = node?.getAttribute("data-visual-edit-label");

  if (attrLabel) return attrLabel;

  if (elementType === "section") return sectionLabel || "סקשן";
  if (elementType === "text") return "טקסט";
  if (elementType === "image") return "תמונה";
  if (elementType === "button") return "כפתור";
  if (elementType === "line") return "קו";
  if (elementType === "box") return "קופסה";

  return elementId || "אלמנט";
}

function getVisualTypeFromNode(node: HTMLElement | null): VisualEditableElementType {
  const attrType = String(node?.getAttribute("data-visual-edit-type") || "");

  if (
    attrType === "section" ||
    attrType === "text" ||
    attrType === "image" ||
    attrType === "button" ||
    attrType === "line" ||
    attrType === "box" ||
    attrType === "icon"
  ) {
    return attrType;
  }

  const tagName = String(node?.tagName || "").toLowerCase();

  if (tagName === "img") return "image";
  if (tagName === "button" || tagName === "a") return "button";
  if (["h1", "h2", "h3", "h4", "p", "span", "strong"].includes(tagName)) {
    return "text";
  }

  return "section";
}

function getSectionIdFromNode(node: HTMLElement | null) {
  if (!node) return "";

  const sectionNode = node.closest?.("[data-template-section-id], [data-section-kind]");

  return (
    sectionNode?.getAttribute("data-template-section-id") ||
    sectionNode?.getAttribute("data-section-kind") ||
    ""
  );
}


const AUTO_VISUAL_SELECTOR = [
  "header",
  "footer",
  "section",
  "nav",
  "article",
  "main",
  "aside",
  "div",
  "ul",
  "ol",
  "li",
  "form",
  "label",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "strong",
  "small",
  "button",
  "a",
  "img",
  "svg",
  "path",
  "input",
  "textarea",
  "select",
].join(",");

function normalizeVisualIdPart(value: string) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9א-ת_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || "element";
}

function isIgnoredVisualNode(node: Element) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) return true;

  const tagName = String(node.tagName || "").toLowerCase();

  if (["script", "style", "meta", "link", "title", "br"].includes(tagName)) {
    return true;
  }

  if (node.closest?.("[data-template-visual-editor='true'] > header")) return true;
  if (node.closest?.("[data-studio-sidebar-root='true']")) return true;
  if (node.closest?.("[data-visual-inspector-root='true']")) return true;
  if (node.getAttribute("data-visual-template-canvas") === "true") return true;

  return false;
}

function getAutoVisualType(node: Element): VisualEditableElementType {
  const attrType = String(node.getAttribute("data-visual-edit-type") || "");

  if (
    attrType === "section" ||
    attrType === "text" ||
    attrType === "image" ||
    attrType === "button" ||
    attrType === "line" ||
    attrType === "box" ||
    attrType === "icon"
  ) {
    return attrType;
  }

  const tagName = String(node.tagName || "").toLowerCase();

  if (tagName === "img") return "image";
  if (tagName === "button" || tagName === "a" || tagName === "input" || tagName === "select" || tagName === "textarea") {
    return "button";
  }
  if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small", "label"].includes(tagName)) {
    return "text";
  }
  if (["header", "footer", "section", "main", "article", "nav", "aside"].includes(tagName)) {
    return "section";
  }
  if (tagName === "svg" || tagName === "path") return "icon";

  return "box";
}

function getAutoVisualLabel(node: Element, visualType: VisualEditableElementType) {
  const attrLabel = node.getAttribute("data-visual-edit-label");
  if (attrLabel) return attrLabel;

  const tagName = String(node.tagName || "").toLowerCase();
  const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
  const alt = node instanceof HTMLImageElement ? String(node.alt || "").trim() : "";

  if (alt) return alt;
  if (text && text.length <= 42) return text;
  if (text) return `${text.slice(0, 42)}...`;

  if (visualType === "section") return tagName === "header" ? "Header" : tagName === "footer" ? "Footer" : "סקשן";
  if (visualType === "text") return "טקסט";
  if (visualType === "image") return "תמונה";
  if (visualType === "button") return "כפתור";
  if (visualType === "icon") return "אייקון";

  return "אלמנט";
}

function stampAutoEditableElements(root: HTMLElement | null) {
  if (!root) return;

  const nodes = Array.from(root.querySelectorAll(AUTO_VISUAL_SELECTOR));
  const counters: Record<string, number> = {};

  nodes.forEach((node) => {
    if (isIgnoredVisualNode(node)) return;

    const element = node as HTMLElement;
    const tagName = String(element.tagName || "").toLowerCase();
    const visualType = getAutoVisualType(element);
    const sectionId = getSectionIdFromNode(element) || "page";
    const sectionPart = normalizeVisualIdPart(sectionId);
    const typePart = normalizeVisualIdPart(visualType);
    const tagPart = normalizeVisualIdPart(tagName);
    const counterKey = `${sectionPart}.${typePart}.${tagPart}`;

    counters[counterKey] = (counters[counterKey] || 0) + 1;

    if (!element.getAttribute("data-visual-edit-id")) {
      const explicitSection = element.getAttribute("data-template-section-id") || element.getAttribute("data-section-kind");
      const autoId = explicitSection
        ? `${normalizeVisualIdPart(explicitSection)}.section`
        : `${counterKey}.${counters[counterKey]}`;

      element.setAttribute("data-visual-edit-id", autoId);
      element.setAttribute("data-visual-auto-id", "true");
    }

    if (!element.getAttribute("data-visual-edit-type")) {
      element.setAttribute("data-visual-edit-type", visualType);
    }

    if (!element.getAttribute("data-visual-edit-label")) {
      element.setAttribute("data-visual-edit-label", getAutoVisualLabel(element, visualType));
    }

    element.setAttribute("data-visual-editable", "true");
  });
}

function getVisualNodeRank(node: Element) {
  const type = getAutoVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  if (type === "image") return 100;
  if (type === "button") return 95;
  if (type === "text") return 90;
  if (tagName === "svg" || tagName === "path") return 82;
  if (["input", "textarea", "select", "form"].includes(tagName)) return 80;
  if (["li", "article", "label"].includes(tagName)) return 70;
  if (type === "box") return 55;
  if (type === "section") return 30;

  return 10;
}

function findBestEditableNode(
  target: HTMLElement | null,
  canvas: HTMLElement | null,
) {
  if (!target || !canvas) return null;

  const candidates: HTMLElement[] = [];
  let current: HTMLElement | null = target;

  while (current && current !== canvas) {
    if (!isIgnoredVisualNode(current) && current.matches?.(AUTO_VISUAL_SELECTOR)) {
      candidates.push(current);
    }

    current = current.parentElement;
  }

  if (!candidates.length) return null;

  const firstInteractive = candidates.find((node) => {
    const tagName = String(node.tagName || "").toLowerCase();
    return ["img", "button", "a", "input", "textarea", "select"].includes(tagName);
  });

  if (firstInteractive) return firstInteractive;

  const firstText = candidates.find((node) => {
    const tagName = String(node.tagName || "").toLowerCase();
    return ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small", "label"].includes(tagName);
  });

  if (firstText) return firstText;

  const explicitNonSection = candidates.find((node) => {
    const type = getAutoVisualType(node);
    return (
      node.getAttribute("data-visual-edit-id") &&
      node.getAttribute("data-visual-auto-id") !== "true" &&
      type !== "section"
    );
  });

  if (explicitNonSection) return explicitNonSection;

  const box = candidates.find((node) => getAutoVisualType(node) === "box");
  if (box) return box;

  const section = candidates.find((node) => getAutoVisualType(node) === "section");
  if (section) return section;

  return candidates
    .slice()
    .sort((a, b) => getVisualNodeRank(b) - getVisualNodeRank(a))[0];
}

function normalizeVisualLinkHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("sms:")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

function getNodeLinkHref(node: HTMLElement | null) {
  if (!node) return "";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.querySelector?.("a") as HTMLAnchorElement | null);

  return String(
    linkNode?.getAttribute("href") ||
      node.getAttribute("href") ||
      node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      "",
  );
}

function getNodeLinkTarget(node: HTMLElement | null) {
  if (!node) return "_self";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.querySelector?.("a") as HTMLAnchorElement | null);

  return String(
    linkNode?.getAttribute("target") ||
      node.getAttribute("target") ||
      node.getAttribute("data-visual-link-target") ||
      "_self",
  );
}

function applyVisualLinkToDomNode(
  node: HTMLElement,
  href: string,
  target: string = "_self",
) {
  const cleanHref = normalizeVisualLinkHref(href);
  const cleanTarget = target === "_blank" ? "_blank" : "_self";
  const rel = cleanTarget === "_blank" ? "noopener noreferrer" : "";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.querySelector?.("a") as HTMLAnchorElement | null);

  if (linkNode) {
    if (cleanHref) {
      linkNode.setAttribute("href", cleanHref);
      linkNode.setAttribute("data-visual-link-href", cleanHref);
      linkNode.setAttribute("data-link-url", cleanHref);
      linkNode.setAttribute("target", cleanTarget);
      if (rel) linkNode.setAttribute("rel", rel);
      else linkNode.removeAttribute("rel");
    } else {
      linkNode.removeAttribute("href");
      linkNode.removeAttribute("data-visual-link-href");
      linkNode.removeAttribute("data-link-url");
      linkNode.removeAttribute("target");
      linkNode.removeAttribute("rel");
    }

    return;
  }

  if (cleanHref) {
    const jsHref = cleanHref.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

    node.setAttribute("data-visual-link-href", cleanHref);
    node.setAttribute("data-link-url", cleanHref);
    node.setAttribute("data-href", cleanHref);
    node.setAttribute("data-visual-link-target", cleanTarget);
    node.setAttribute("role", node.tagName.toLowerCase() === "button" ? "button" : "link");
    node.setAttribute(
      "onclick",
      cleanTarget === "_blank"
        ? `window.open('${jsHref}', '_blank', 'noopener,noreferrer')`
        : `window.location.href='${jsHref}'`,
    );
    node.style.cursor = "pointer";
  } else {
    node.removeAttribute("data-visual-link-href");
    node.removeAttribute("data-link-url");
    node.removeAttribute("data-href");
    node.removeAttribute("data-visual-link-target");
    node.removeAttribute("onclick");
    node.style.cursor = "";
  }
}

function applyVisualContentToDom(root: HTMLElement | null, content: VisualContentMap) {
  if (!root) return;

  Object.entries(content || {}).forEach(([elementId, value]) => {
    const selector = selectorForVisualElement(elementId).replace(/\n/g, "");
    const node = root.querySelector(selector) as HTMLElement | null;

    if (!node) return;

    const type = getAutoVisualType(node);

    if (value.src && type === "image") {
      const imageNode = node instanceof HTMLImageElement ? node : node.querySelector("img");
      imageNode?.setAttribute("src", value.src);
      if (value.alt !== undefined) imageNode?.setAttribute("alt", value.alt || "");
      return;
    }

    if (value.text !== undefined && (type === "text" || type === "button")) {
      node.textContent = value.text || "";
    }

    if (value.href !== undefined) {
      applyVisualLinkToDomNode(node, value.href || "", value.target || "_self");
    }
  });
}


function collectVisualContentFromDom(
  root: HTMLElement | null,
  currentData: Record<string, any>,
): VisualContentMap {
  const currentContent = readVisualContent(currentData);
  const nextContent: VisualContentMap = { ...currentContent };

  if (!root) return nextContent;

  stampAutoEditableElements(root);

  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-visual-editable='true'][data-visual-edit-id]",
    ),
  );

  nodes.forEach((node) => {
    const elementId = String(node.getAttribute("data-visual-edit-id") || "");
    if (!elementId) return;

    const type = getAutoVisualType(node);
    const currentValue = nextContent[elementId] || {};
    const nextValue: VisualContentMap[string] = { ...currentValue };

    if (type === "text" || type === "button") {
      const text = getNodeText(node);
      if (text || currentValue.text !== undefined) {
        nextValue.text = text;
      }
    }

    if (type === "image") {
      const src = getNodeImageSrc(node);
      const alt = getNodeImageAlt(node);
      if (src || currentValue.src !== undefined) {
        nextValue.src = src;
      }
      if (alt || currentValue.alt !== undefined) {
        nextValue.alt = alt;
      }
    }

    const href = normalizeVisualLinkHref(getNodeLinkHref(node));
    const target = getNodeLinkTarget(node) === "_blank" ? "_blank" : "_self";

    if (href || currentValue.href !== undefined) {
      nextValue.href = href;
      nextValue.target = target;
      nextValue.rel = target === "_blank" ? "noopener noreferrer" : "";
    }

    if (Object.keys(nextValue).length > 0) {
      nextContent[elementId] = nextValue;
    }
  });

  return nextContent;
}

function buildVisualSaveDataFromDom(
  root: HTMLElement | null,
  currentData: Record<string, any>,
): Record<string, any> {
  const nextContent = collectVisualContentFromDom(root, currentData);

  return {
    ...currentData,
    [VISUAL_CONTENT_KEY]: nextContent,
  };
}


type VisualSelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type VisualDragMode =
  | "move"
  | "resize-n"
  | "resize-s"
  | "resize-e"
  | "resize-w"
  | "resize-ne"
  | "resize-nw"
  | "resize-se"
  | "resize-sw";

type VisualTransformParts = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

function parseVisualTransform(value: unknown): VisualTransformParts {
  const source = String(value || "");
  const translateMatch = source.match(/translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/i);
  const scaleMatch = source.match(/scale\(\s*(-?\d+(?:\.\d+)?)\s*\)/i);
  const rotateMatch = source.match(/rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/i);

  return {
    x: translateMatch ? Number(translateMatch[1]) || 0 : 0,
    y: translateMatch ? Number(translateMatch[2]) || 0 : 0,
    scale: scaleMatch ? Number(scaleMatch[1]) || 1 : 1,
    rotate: rotateMatch ? Number(rotateMatch[1]) || 0 : 0,
  };
}

function buildVisualTransform(parts: VisualTransformParts) {
  return `translate(${Math.round(parts.x)}px, ${Math.round(parts.y)}px) scale(${Number(parts.scale || 1).toFixed(3)}) rotate(${Math.round(parts.rotate || 0)}deg)`;
}

function getVisualNodeRectInCanvas(node: HTMLElement, canvas: HTMLElement): VisualSelectionBox {
  const nodeRect = node.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  return {
    top: nodeRect.top - canvasRect.top + canvas.scrollTop,
    left: nodeRect.left - canvasRect.left + canvas.scrollLeft,
    width: nodeRect.width,
    height: nodeRect.height,
  };
}

function clampVisualSize(value: number, min = 24) {
  return Math.max(min, Math.round(value));
}

function getResizeCursor(mode: VisualDragMode) {
  if (mode === "move") return "move";
  if (mode === "resize-n" || mode === "resize-s") return "ns-resize";
  if (mode === "resize-e" || mode === "resize-w") return "ew-resize";
  if (mode === "resize-ne" || mode === "resize-sw") return "nesw-resize";
  if (mode === "resize-nw" || mode === "resize-se") return "nwse-resize";
  return "default";
}

function canFreeTransformElement(element: VisualSelectedElement | null) {
  if (!element) return false;
  return element.type !== "section" && element.type !== "unknown";
}

function getSelectionBorderClass(element: VisualSelectedElement | null) {
  if (element?.type === "section") {
    return "border border-dashed border-blue-500/70 bg-blue-500/[0.015]";
  }

  return "border border-blue-600 bg-blue-500/[0.01] shadow-[0_0_0_2px_rgba(37,99,235,0.12)]";
}



type VisualTopToolbarProps = {
  selectedElement: VisualSelectedElementWithLink | null;
  styles: VisualStyleMap;
  content: VisualContentMap;
  pages: StudioSitePage[];
  sections: VisualPageSection[];
  activePageId: string;
  onUpdateText: (elementId: string, value: string) => void;
  onUpdateImage: (elementId: string, payload: { src?: string; alt?: string }) => void;
  onUpdateLink: (elementId: string, payload: { href?: string; target?: "_self" | "_blank" | string }) => void;
  onApplyStyle: (elementId: string, style: StylePatch) => void;
  onResetStyle: (elementId: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: (elementId: string) => void;
  onSendBackward: (elementId: string) => void;
  onSetAnimation: (elementId: string, animation: AnimationPresetValue | string) => void;
  onClearAnimation: (elementId: string) => void;
  onClearSelection: () => void;
};

const toolbarFontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px", "48px", "56px", "64px", "72px", "88px", "96px"];

const toolbarAnimations = [
  { label: "ללא", value: "" },
  { label: "Fade up", value: "fade-up" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Blur reveal", value: "blur-reveal" },
  { label: "Float", value: "float-soft" },
  { label: "Pulse", value: "pulse-soft" },
];

function getToolbarLabel(type?: string) {
  if (type === "text") return "טקסט";
  if (type === "image") return "תמונה";
  if (type === "button") return "כפתור";
  if (type === "section") return "סקשן";
  if (type === "box") return "קופסה";
  if (type === "icon") return "אייקון";
  return "אלמנט";
}

function toolbarStyleValue(styles: VisualStyleMap, elementId: string, key: string) {
  const style = styles[elementId] || {};
  return String((style as Record<string, any>)[key] || "");
}

function MiniSelect({ value, onChange, children, className = "", title }: { value: string; onChange: (value: string) => void; children: React.ReactNode; className?: string; title?: string }) {
  return (
    <label title={title} className={["relative inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50", className].join(" ")}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-full w-full appearance-none rounded-xl bg-transparent py-0 pl-8 pr-3 text-sm font-black outline-none">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute left-2 h-4 w-4 text-slate-400" />
    </label>
  );
}

function MiniButton({ active, danger, title, onClick, children }: { active?: boolean; danger?: boolean; title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick} className={[
      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black shadow-sm transition",
      active ? "border-violet-200 bg-violet-600 text-white shadow-violet-200" : danger ? "border-rose-100 bg-white text-rose-600 hover:bg-rose-50" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ].join(" ")}>
      {children}
    </button>
  );
}

function MiniColor({ title, value, fallback, onChange, children }: { title: string; value: string; fallback: string; onChange: (value: string) => void; children: React.ReactNode }) {
  const color = value || fallback;
  return (
    <label title={title} className="relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
      {children}
      <span className="absolute bottom-1.5 h-1.5 w-5 rounded-full border border-white shadow-sm" style={{ background: color }} />
      <input type="color" value={color} onChange={(event) => onChange(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
    </label>
  );
}


function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result || ""));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
}

function isImageFile(file: File) {
  return String(file.type || "").startsWith("image/");
}

function VisualTopToolbar({ selectedElement, styles, content, pages, sections, activePageId, onUpdateText, onUpdateImage, onUpdateLink, onApplyStyle, onResetStyle, onDuplicate, onDelete, onBringForward, onSendBackward, onSetAnimation, onClearAnimation, onClearSelection }: VisualTopToolbarProps) {
  const [textValue, setTextValue] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [showImageBox, setShowImageBox] = React.useState(false);
  const [showLinkBox, setShowLinkBox] = React.useState(false);
  const [linkHref, setLinkHref] = React.useState("");
  const [linkTarget, setLinkTarget] = React.useState<"_self" | "_blank">("_self");
  const imageFileInputRef = React.useRef<HTMLInputElement | null>(null);

  async function handleLocalImageFile(file: File | null | undefined) {
    if (!file || !selectedElement?.id) return;

    if (!isImageFile(file)) {
      window.alert("אפשר להעלות רק קובץ תמונה.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const alt = imageAlt.trim() || file.name.replace(/\.[^.]+$/, "");

      setImageUrl(dataUrl);
      setImageAlt(alt);

      onUpdateImage(selectedElement.id, {
        src: dataUrl,
        alt,
      });

      setShowImageBox(false);
    } catch {
      window.alert("לא הצלחנו להעלות את התמונה. נסי קובץ אחר.");
    }
  }

  function openImagePicker() {
    imageFileInputRef.current?.click();
  }

  React.useEffect(() => {
    const savedLink = selectedElement?.id ? content[selectedElement.id]?.href || "" : "";
    const savedTarget = selectedElement?.id ? content[selectedElement.id]?.target || "_self" : "_self";

    setTextValue(selectedElement?.textValue || "");
    setImageUrl(selectedElement?.imageValue || "");
    setImageAlt(selectedElement?.altValue || "");
    setLinkHref(savedLink || selectedElement?.linkValue || "");
    setLinkTarget(savedTarget === "_blank" || selectedElement?.linkTarget === "_blank" ? "_blank" : "_self");
    setShowImageBox(false);
    setShowLinkBox(false);
  }, [content, selectedElement?.id, selectedElement?.textValue, selectedElement?.imageValue, selectedElement?.altValue, selectedElement?.linkValue, selectedElement?.linkTarget]);

  if (!selectedElement?.id) return null;

  const id = selectedElement.id;
  const type = selectedElement.type;
  const fontFamily = toolbarStyleValue(styles, id, "fontFamily");
  const fontSize = toolbarStyleValue(styles, id, "fontSize");
  const color = toolbarStyleValue(styles, id, "color");
  const backgroundColor = toolbarStyleValue(styles, id, "backgroundColor");
  const borderRadius = toolbarStyleValue(styles, id, "borderRadius");
  const boxShadow = toolbarStyleValue(styles, id, "boxShadow");
  const objectFit = toolbarStyleValue(styles, id, "objectFit");
  const animation = toolbarStyleValue(styles, id, "animation");
  const textDecoration = toolbarStyleValue(styles, id, "textDecoration");
  const fontWeight = toolbarStyleValue(styles, id, "fontWeight");
  const fontStyle = toolbarStyleValue(styles, id, "fontStyle");
  const textAlign = toolbarStyleValue(styles, id, "textAlign");

  const canText = type === "text" || type === "button";
  const canLink = type === "text" || type === "button" || type === "box";
  const canImage = type === "image";
  const canBox = type === "section" || type === "box" || type === "button" || type === "image" || type === "line" || type === "icon";
  const apply = (style: StylePatch) => onApplyStyle(id, style);

  return (
    <div
      dir="rtl"
      className="pointer-events-none fixed left-0 right-0 top-[74px] z-[999998] flex justify-center border-b border-slate-200 bg-white/95 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
    >
      <div className="pointer-events-auto flex h-14 w-full max-w-[1680px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-slate-950">
        <div className="flex h-10 shrink-0 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-white">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <span className="whitespace-nowrap text-sm font-black">{getToolbarLabel(type)}</span>
        </div>

        {canText ? (
          <>
            <StudioFontPicker
              value={fontFamily}
              onChange={(fontFamilyValue) => apply({ fontFamily: fontFamilyValue })}
            />
            <MiniSelect value={fontSize} onChange={(value) => apply({ fontSize: value })} className="w-[92px]" title="גודל">
              <option value="">גודל</option>
              {toolbarFontSizes.map((size) => <option key={size} value={size}>{size.replace("px", "")}</option>)}
            </MiniSelect>
            <MiniButton title="Bold" active={fontWeight === "700" || fontWeight === "bold"} onClick={() => apply({ fontWeight: fontWeight === "700" || fontWeight === "bold" ? "400" : "700" })}><Bold className="h-4 w-4" /></MiniButton>
            <MiniButton title="Italic" active={fontStyle === "italic"} onClick={() => apply({ fontStyle: fontStyle === "italic" ? "normal" : "italic" })}><Italic className="h-4 w-4" /></MiniButton>
            <MiniButton title="Underline" active={textDecoration.includes("underline")} onClick={() => apply({ textDecoration: textDecoration.includes("underline") ? "none" : "underline" })}><Underline className="h-4 w-4" /></MiniButton>
            <MiniButton title="ימין" active={textAlign === "right"} onClick={() => apply({ textAlign: "right" })}><AlignRight className="h-4 w-4" /></MiniButton>
            <MiniButton title="מרכז" active={textAlign === "center"} onClick={() => apply({ textAlign: "center" })}><AlignCenter className="h-4 w-4" /></MiniButton>
            <MiniButton title="שמאל" active={textAlign === "left"} onClick={() => apply({ textAlign: "left" })}><AlignLeft className="h-4 w-4" /></MiniButton>
            <MiniColor title="צבע טקסט" value={color} fallback="#111827" onChange={(value) => apply({ color: value })}><Palette className="h-4 w-4" /></MiniColor>
          </>
        ) : null}

        {canLink ? (
          <>
            <MiniButton
              title="קישור"
              active={showLinkBox || Boolean(linkHref)}
              onClick={() => setShowLinkBox((value) => !value)}
            >
              <Link2 className="h-4 w-4" />
            </MiniButton>
          </>
        ) : null}

        {canBox ? (
          <>
            <MiniColor title="צבע רקע" value={backgroundColor} fallback="#ffffff" onChange={(value) => apply({ backgroundColor: value })}><PaintBucket className="h-4 w-4" /></MiniColor>
            <MiniSelect value={borderRadius} onChange={(value) => apply({ borderRadius: value })} className="w-[112px]" title="פינות">
              <option value="">פינות</option>
              <option value="0px">ללא</option>
              <option value="8px">קטן</option>
              <option value="16px">בינוני</option>
              <option value="28px">עגול</option>
              <option value="999px">עיגול מלא</option>
            </MiniSelect>
            <MiniSelect value={boxShadow} onChange={(value) => apply({ boxShadow: value })} className="w-[112px]" title="צל">
              <option value="">צל</option>
              <option value="none">ללא</option>
              <option value="0 12px 30px rgba(15,23,42,0.12)">עדין</option>
              <option value="0 22px 60px rgba(15,23,42,0.18)">בינוני</option>
              <option value="0 35px 100px rgba(15,23,42,0.25)">חזק</option>
            </MiniSelect>
          </>
        ) : null}

        {canImage ? (
          <>
            <MiniSelect
              value={objectFit}
              onChange={(value) => apply({ objectFit: value })}
              className="w-[118px]"
              title="התאמה"
            >
              <option value="">התאמה</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </MiniSelect>

            <input
              ref={imageFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                void handleLocalImageFile(file);
                event.currentTarget.value = "";
              }}
            />

            <button
              type="button"
              title="החלפת תמונה"
              onClick={openImagePicker}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-violet-100 bg-violet-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-700"
            >
              <ImageIcon className="h-4 w-4" />
              החלפת תמונה
            </button>

            <MiniButton
              title="הדבקת כתובת תמונה"
              active={showImageBox}
              onClick={() => setShowImageBox((value) => !value)}
            >
              <Link2 className="h-4 w-4" />
            </MiniButton>
          </>
        ) : null}

        <MiniSelect value={animation} onChange={(value) => value ? onSetAnimation(id, value) : onClearAnimation(id)} className="w-[132px]" title="תנועה">
          {toolbarAnimations.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
        </MiniSelect>

        <div className="mx-1 h-9 w-px shrink-0 bg-slate-200" />
        <MiniButton title="קדימה" onClick={() => onBringForward(id)}><MoveUp className="h-4 w-4" /></MiniButton>
        <MiniButton title="אחורה" onClick={() => onSendBackward(id)}><MoveDown className="h-4 w-4" /></MiniButton>
        <MiniButton title="שכפול" onClick={onDuplicate}><Copy className="h-4 w-4" /></MiniButton>
        <MiniButton title="מחיקה" danger onClick={onDelete}><Trash2 className="h-4 w-4" /></MiniButton>
        <MiniButton title="איפוס" onClick={() => onResetStyle(id)}><RotateCcw className="h-4 w-4" /></MiniButton>
        <MiniButton title="סגור" onClick={onClearSelection}><X className="h-4 w-4" /></MiniButton>
      </div>

      <LinkSettingsModal
        open={showLinkBox}
        pages={pages}
        sections={sections}
        activePageId={activePageId}
        currentHref={linkHref}
        currentTarget={linkTarget}
        selectedElement={selectedElement}
        onClose={() => setShowLinkBox(false)}
        onSave={(payload) => {
          if (!selectedElement?.id) return;

          onUpdateLink(selectedElement.id, {
            href: payload.href,
            target: payload.target || "_self",
          });

          setLinkHref(payload.href);
          setLinkTarget(payload.target === "_blank" ? "_blank" : "_self");
          setShowLinkBox(false);
        }}
        onRemove={() => {
          if (!selectedElement?.id) return;

          onUpdateLink(selectedElement.id, {
            href: "",
            target: "_self",
          });

          setLinkHref("");
          setLinkTarget("_self");
          setShowLinkBox(false);
        }}
      />

      {showImageBox ? (
        <div className="pointer-events-auto absolute right-1/2 top-[66px] flex w-[min(860px,calc(100vw-32px))] translate-x-1/2 items-center gap-2 rounded-[18px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <ImageIcon className="h-4 w-4" />
          </div>

          <button
            type="button"
            onClick={openImagePicker}
            className="h-11 shrink-0 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            העלאת תמונה
          </button>

          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="או הדביקי כתובת תמונה..."
            className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <input
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            placeholder="Alt"
            className="h-11 w-[160px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <button
            type="button"
            onClick={() => {
              const src = imageUrl.trim();

              if (!src) {
                openImagePicker();
                return;
              }

              onUpdateImage(id, {
                src,
                alt: imageAlt.trim(),
              });

              setShowImageBox(false);
            }}
            className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            החלף
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function TemplateVisualEditor({
  renderer,
  businessId,
  initialData,
  onBack,
  onSave,
}: TemplateVisualEditorProps) {
  const TemplateComponent = renderer.Component as React.ComponentType<any>;

  const schema = renderer.schema;
  const sections = React.useMemo(() => schema?.sections || [], [schema]);

  const baseData = React.useMemo(() => {
    return {
      ...(cloneData(renderer.defaultData || {}) as Record<string, any>),
      ...(cloneData(initialData || {}) as Record<string, any>),
    };
  }, [renderer.defaultData, initialData]);

  const [templateData, setTemplateData] =
    React.useState<Record<string, any>>(baseData);

  const templateDataRef = React.useRef<Record<string, any>>(templateData);

  React.useEffect(() => {
    templateDataRef.current = templateData;
  }, [templateData]);

  const [selectedSectionId, setSelectedSectionId] = React.useState(
    sections[0]?.id || "",
  );
  const [selectedElement, setSelectedElement] =
    React.useState<VisualSelectedElementWithLink | null>(null);
  const [hoveredElementId, setHoveredElementId] = React.useState("");
  const [inlineEditingElementId, setInlineEditingElementId] = React.useState("");

  const canvasRef = React.useRef<HTMLDivElement | null>(null);
  const activeFormElementIdRef = React.useRef("");
  const activeFormNodeRef = React.useRef<HTMLFormElement | null>(null);
  const suppressNextCanvasClickRef = React.useRef(false);

  const dragStateRef = React.useRef<{
    mode: VisualDragMode;
    elementId: string;
    elementType: VisualEditableElementType;
    node: HTMLElement;
    startX: number;
    startY: number;
    startBox: VisualSelectionBox;
    startTransform: VisualTransformParts;
    startWidth: number;
    startHeight: number;
    startFontSize: number;
  } | null>(null);

  const [selectionBox, setSelectionBox] = React.useState<VisualSelectionBox | null>(null);
  const [isDraggingElement, setIsDraggingElement] = React.useState(false);

  const [activePageId, setActivePageId] = React.useState(
    renderer.pages?.[0]?.id || "home",
  );
  const [device, setDevice] = React.useState<VisualDeviceMode>("desktop");
  const [previewOnly, setPreviewOnly] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState("");
  const [activePanel, setActivePanel] = React.useState<ActiveStudioPanel | null>(null);
  const [sidebarMessage, setSidebarMessage] = React.useState("");
  const [publishPanelOpen, setPublishPanelOpen] = React.useState(false);
  const [siteSlug, setSiteSlug] = React.useState(() => {
    const storedSlug =
      typeof window !== "undefined"
        ? window.localStorage.getItem(`bizuply-visual-site-slug-${businessId || renderer.key}`)
        : "";

    return (
      normalizeBusinessSlug(storedSlug || businessId || renderer.key || "your-business") ||
      "your-business"
    );
  });
  const [slugChecking, setSlugChecking] = React.useState(false);
  const [slugAvailable, setSlugAvailable] = React.useState<boolean | null>(null);
  const [slugError, setSlugError] = React.useState("");

  const [formBuilderOpen, setFormBuilderOpen] = React.useState(false);
  const [formBuilderForm, setFormBuilderForm] = React.useState<BizuplyFormConfig>(
    () => normalizeFormBuilderConfig(baseData[FORM_BUILDER_KEY]),
  );

  const visualStyles = React.useMemo(() => readVisualStyles(templateData), [templateData]);
  const visualAnimations = React.useMemo(
    () => readVisualAnimations(templateData),
    [templateData],
  );
  const visualContent = React.useMemo(
    () => readVisualContent(templateData),
    [templateData],
  );

  const selectedSection = React.useMemo(() => {
    return (
      sections.find((section) => section.id === selectedSectionId) ||
      sections[0] ||
      null
    );
  }, [sections, selectedSectionId]);

  const templateEditorCss = React.useMemo(() => String(renderer.editorCss || ""), [renderer.editorCss]);

  const visualRuntimeCss = React.useMemo(() => {
    return buildVisualRuntimeCss(
      visualStyles,
      visualAnimations,
      selectedElement?.id,
      hoveredElementId,
    );
  }, [visualStyles, visualAnimations, selectedElement?.id, hoveredElementId]);

  const visualPages = React.useMemo<StudioSitePage[]>(() => {
    const now = new Date().toISOString();

    const sourcePages =
      Array.isArray(renderer.pages) && renderer.pages.length
        ? renderer.pages
        : [
            {
              id: "home",
              name: "Home",
              slug: "/",
            },
          ];

    return sourcePages.map((page: any, index: number) => {
      const pageId = String(page.id || `page-${index + 1}`);
      const isHome = pageId === "home" || page.slug === "/" || index === 0;

      return {
        id: pageId,
        title: String(page.name || page.title || pageId),
        slug: isHome ? "" : normalizeSlug(page.slug || pageId),
        type: getPageType(pageId),
        isHome,
        html: "",
        css: "",
        createdAt: now,
        updatedAt: now,
      } as StudioSitePage;
    });
  }, [renderer.pages]);

  const activeVisualPage = React.useMemo(() => {
    return (
      visualPages.find((page) => page.id === activePageId) ||
      visualPages[0] ||
      null
    );
  }, [visualPages, activePageId]);

  const activeVisualPageSlug = React.useMemo(() => {
    if (!activeVisualPage) return "/";
    if (activeVisualPage.isHome) return "/";

    const cleanSlug = normalizeSlug(activeVisualPage.slug || activeVisualPage.id);

    return cleanSlug ? `/${cleanSlug}` : "/";
  }, [activeVisualPage]);

  const activePageSections = React.useMemo<VisualPageSection[]>(() => {
    return sections.map((section) => ({
      id: section.id,
      title: section.label,
      kind: section.id,
      tagName: getSectionTagName(section.id),
    }));
  }, [sections]);


  const siteSlugValid = React.useMemo(() => {
    return isValidBusinessSlug(siteSlug);
  }, [siteSlug]);

  const publicUrl = React.useMemo(() => {
    return buildPublicSiteUrl(siteSlug);
  }, [siteSlug]);

  const checkSlugAvailability = React.useCallback(async () => {
    const cleanSlug = normalizeBusinessSlug(siteSlug);

    if (!cleanSlug || cleanSlug === "your-business" || !isValidBusinessSlug(cleanSlug)) {
      setSlugAvailable(null);
      setSlugError("מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה: hadar-beauty");
      return false;
    }

    setSlugChecking(true);
    setSlugError("");

    try {
      const params = new URLSearchParams({ slug: cleanSlug });

      if (businessId) {
        params.set("businessId", businessId);
      }

      const response = await fetch(`/api/site-builder/slug/check?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: buildAuthHeaders(),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.error || "שגיאה בבדיקת הכתובת";
        setSlugAvailable(false);
        setSlugError(message);
        return false;
      }

      const available = Boolean(data?.available);

      setSlugAvailable(available);
      setSlugError(available ? "" : data?.error || "הכתובת הזו כבר תפוסה. בחרי כתובת אחרת.");

      // לא שומרים את כתובת האתר ב-localStorage כדי לא לחסום שמירה לשרת.

      return available;
    } catch {
      setSlugAvailable(false);
      setSlugError("שגיאה בבדיקת הכתובת. נסי שוב.");
      return false;
    } finally {
      setSlugChecking(false);
    }
  }, [businessId, renderer.key, siteSlug]);

  React.useEffect(() => {
    setTemplateData(baseData);
    setFormBuilderForm(normalizeFormBuilderConfig(baseData[FORM_BUILDER_KEY]));
  }, [baseData]);

  React.useEffect(() => {
    if (!selectedSectionId && sections[0]?.id) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  React.useEffect(() => {
    const pageExists = visualPages.some((page) => page.id === activePageId);

    if (!pageExists && visualPages[0]?.id) {
      setActivePageId(visualPages[0].id);
    }
  }, [visualPages, activePageId]);


  React.useEffect(() => {
    const cleanSlug = normalizeBusinessSlug(siteSlug);

    if (cleanSlug !== siteSlug) {
      setSiteSlug(cleanSlug);
      return;
    }

    setSlugAvailable(null);
    setSlugError("");

    if (!cleanSlug || cleanSlug === "your-business" || !siteSlugValid) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void checkSlugAvailability();
    }, 520);

    return () => window.clearTimeout(timeout);
  }, [checkSlugAvailability, siteSlug, siteSlugValid]);

  React.useEffect(() => {
    if (!sidebarMessage) return;

    const timer = window.setTimeout(() => setSidebarMessage(""), 2600);

    return () => window.clearTimeout(timer);
  }, [sidebarMessage]);

  React.useEffect(() => {
    const root = canvasRef.current;

    if (!root) return;

    const stamp = () => {
      stampAutoEditableElements(root);

      if (!inlineEditingElementId) {
        applyVisualContentToDom(root, readVisualContent(templateData));
        applySavedFormBuildersToDom(root, templateData);
      }
    };

    const frame = window.requestAnimationFrame(stamp);
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(stamp);
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activePageId, previewOnly, templateData, inlineEditingElementId]);

  React.useEffect(() => {
    const root = canvasRef.current;
    if (!root || inlineEditingElementId) return;

    const content = readVisualContent(templateData);
    window.requestAnimationFrame(() => applyVisualContentToDom(root, content));
  }, [templateData, inlineEditingElementId]);

  function scrollToSection(sectionId: string) {
    window.requestAnimationFrame(() => {
      const selector = `[data-template-section-id="${safeCssSelectorValue(
        sectionId,
      )}"], [data-section-kind="${safeCssSelectorValue(sectionId)}"]`;
      const target = document.querySelector(selector);

      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function selectSection(sectionId: string) {
    const section = sections.find((item) => item.id === sectionId);

    setSelectedSectionId(sectionId);
    setSelectedElement({
      id: `${sectionId}.section`,
      type: "section",
      label: section?.label || sectionId,
      sectionId,
      fieldKey: "section",
    });
    setPreviewOnly(false);
    scrollToSection(sectionId);
  }

  function updateTemplateFieldByVisualId(
    elementId: string,
    elementType: VisualEditableElementType | string,
    value: string,
  ) {
    const sectionId = getSectionIdFromVisualId(elementId);
    const rawFieldKey = getFieldKeyFromVisualId(elementId);
    const fieldKey = normalizeFieldKeyForTemplate(rawFieldKey, elementType);

    if (!sectionId || !fieldKey || fieldKey === "section") return;

    setTemplateData((current) => {
      const currentSection = current?.[sectionId];

      if (!currentSection || typeof currentSection !== "object" || Array.isArray(currentSection)) {
        return current;
      }

      const nextData = {
        ...current,
        [sectionId]: {
          ...currentSection,
          [fieldKey]: value,
        },
      };

      templateDataRef.current = nextData;

      return nextData;
    });
  }

  function updateTemplateLinkFieldByVisualId(elementId: string, href: string) {
    const sectionId = getSectionIdFromVisualId(elementId);
    const rawFieldKey = getFieldKeyFromVisualId(elementId);
    const fieldKey = normalizeFieldKeyForTemplate(rawFieldKey, "button");

    if (!sectionId || !fieldKey || fieldKey === "section") return;

    const linkFieldCandidates = [
      `${fieldKey}Href`,
      `${fieldKey}Link`,
      `${fieldKey}Url`,
      `${fieldKey}URL`,
      `${fieldKey}To`,
      "href",
      "link",
      "url",
      "buttonHref",
      "buttonLink",
      "buttonUrl",
      "ctaHref",
      "ctaLink",
      "ctaUrl",
    ];

    setTemplateData((current) => {
      const currentSection = current?.[sectionId];

      if (
        !currentSection ||
        typeof currentSection !== "object" ||
        Array.isArray(currentSection)
      ) {
        return current;
      }

      const nextSection = { ...currentSection };
      let changed = false;

      linkFieldCandidates.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(nextSection, key)) {
          nextSection[key] = href;
          changed = true;
        }
      });

      if (!changed) {
        templateDataRef.current = current;
        return current;
      }

      const nextData = {
        ...current,
        [sectionId]: nextSection,
      };

      templateDataRef.current = nextData;

      return nextData;
    });
  }


  function normalizeLinksInSnapshot(snapshotRoot: HTMLElement) {
    const linkedNodes = Array.from(
      snapshotRoot.querySelectorAll<HTMLElement>(
        "a[href], [data-visual-link-href], [data-link-url], [data-href]",
      ),
    );

    linkedNodes.forEach((node) => {
      const rawHref =
        node.getAttribute("href") ||
        node.getAttribute("data-visual-link-href") ||
        node.getAttribute("data-link-url") ||
        node.getAttribute("data-href") ||
        "";

      const cleanHref = normalizeVisualLinkHref(rawHref);
      if (!cleanHref) return;

      const cleanTarget =
        node.getAttribute("target") === "_blank" ||
        node.getAttribute("data-visual-link-target") === "_blank"
          ? "_blank"
          : "_self";

      const rel = cleanTarget === "_blank" ? "noopener noreferrer" : "";
      const tagName = String(node.tagName || "").toLowerCase();

      if (tagName === "a") {
        node.setAttribute("href", cleanHref);
        node.setAttribute("data-visual-link-href", cleanHref);
        node.setAttribute("data-link-url", cleanHref);
        node.setAttribute("target", cleanTarget);
        if (rel) node.setAttribute("rel", rel);
        else node.removeAttribute("rel");
        node.style.cursor = "pointer";
        return;
      }

      if (tagName === "button") {
        const anchor = document.createElement("a");

        Array.from(node.attributes).forEach((attribute) => {
          const attrName = attribute.name;
          const attrValue = attribute.value;

          if (["type", "disabled", "onclick", "role"].includes(attrName)) return;
          anchor.setAttribute(attrName, attrValue);
        });

        anchor.setAttribute("href", cleanHref);
        anchor.setAttribute("data-visual-link-href", cleanHref);
        anchor.setAttribute("data-link-url", cleanHref);
        anchor.setAttribute("target", cleanTarget);
        if (rel) anchor.setAttribute("rel", rel);
        anchor.setAttribute("role", "link");
        anchor.style.cursor = "pointer";
        anchor.innerHTML = node.innerHTML;

        node.replaceWith(anchor);
        return;
      }

      const jsHref = cleanHref.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      node.setAttribute("data-visual-link-href", cleanHref);
      node.setAttribute("data-link-url", cleanHref);
      node.setAttribute("data-href", cleanHref);
      node.setAttribute("data-visual-link-target", cleanTarget);
      node.setAttribute("role", "link");
      node.setAttribute(
        "onclick",
        cleanTarget === "_blank"
          ? `window.open('${jsHref}', '_blank', 'noopener,noreferrer')`
          : `window.location.href='${jsHref}'`,
      );
      node.style.cursor = "pointer";
    });
  }

  function buildLiveHtmlSnapshot(
    root: HTMLElement | null,
    visualData?: Record<string, any>,
  ) {
    if (!root) return "";

    const liveSite =
      root.querySelector('[data-studio-page="true"][data-bizuply-site="true"]') ||
      root.querySelector('[data-studio-page="true"]') ||
      root.querySelector('[data-bizuply-site="true"]') ||
      root.querySelector('[data-template-id]');

    const source = (liveSite || root) as HTMLElement;
    const clone = source.cloneNode(true) as HTMLElement;

    const contentForSnapshot = readVisualContent(
      visualData || templateDataRef.current || templateData || {},
    );

    applyVisualContentToDom(clone, contentForSnapshot);
    applySavedFormBuildersToDom(clone, visualData || templateDataRef.current || templateData || {});
    normalizeLinksInSnapshot(clone);

    clone
      .querySelectorAll('[contenteditable], [data-visual-inline-editing="true"]')
      .forEach((node) => {
        const el = node as HTMLElement;
        el.removeAttribute("contenteditable");
        el.removeAttribute("spellcheck");
        el.removeAttribute("tabindex");
        el.removeAttribute("data-visual-inline-editing");
        el.style.removeProperty("cursor");
        el.style.removeProperty("user-select");
        el.style.removeProperty("-webkit-user-select");
        el.style.removeProperty("pointer-events");
      });

    clone
      .querySelectorAll('[data-visual-selected="true"], [data-visual-hovered="true"]')
      .forEach((node) => {
        node.removeAttribute("data-visual-selected");
        node.removeAttribute("data-visual-hovered");
      });

    clone.querySelectorAll('[data-visual-selection-overlay="true"]').forEach((node) => node.remove());

    return clone.outerHTML;
  }


  async function handleSave(published = false) {
    const updatedAt = new Date().toISOString();
    const cleanSlug = normalizeBusinessSlug(siteSlug);

    if (published) {
      if (!cleanSlug || cleanSlug === "your-business" || !isValidBusinessSlug(cleanSlug)) {
        alert("בחרי כתובת אתר תקינה לפני פרסום. לדוגמה: hadar-beauty");
        setPublishPanelOpen(true);
        return;
      }

      if (slugChecking) {
        alert("רגע, אנחנו עדיין בודקים אם הכתובת פנויה.");
        return;
      }

      const available = slugAvailable === true ? true : await checkSlugAvailability();

      if (!available) {
        alert(slugError || "הכתובת הזו לא פנויה. בחרי כתובת אחרת.");
        setPublishPanelOpen(true);
        return;
      }
    }

    setSaving(true);

    try {
      const latestData = buildVisualSaveDataFromDom(
        canvasRef.current,
        templateDataRef.current || templateData,
      );

      const latestContent = readVisualContent(latestData);

      console.log("[BizUply Visual Save] links in latestData", {
        links: Object.entries(latestContent)
          .filter(([, value]) => Boolean(value?.href))
          .map(([elementId, value]) => ({
            elementId,
            href: value.href,
            target: value.target,
          })),
      });

      templateDataRef.current = latestData;
      setTemplateData(latestData);

      const nextPublicUrl = buildPublicSiteUrl(cleanSlug || renderer.key);
      const htmlSnapshot = buildLiveHtmlSnapshot(canvasRef.current, latestData);

      console.log("[BizUply Visual Save] payload data before onSave", {
        published,
        slug: cleanSlug,
        contentKeys: Object.keys(readVisualContent(latestData)).length,
        styleKeys: Object.keys(readVisualStyles(latestData)).length,
        animationKeys: Object.keys(readVisualAnimations(latestData)).length,
        sampleContent: Object.entries(readVisualContent(latestData)).slice(0, 5),
        htmlSnapshotLength: htmlSnapshot.length,
        htmlSnapshotPreview: htmlSnapshot.slice(0, 240),
      });

      const payload = {
        templateKey: renderer.key,
        editorMode: "visual-react" as const,
        data: latestData,
        updatedAt,
        published,
        status: published ? "published" as const : "draft" as const,
        slug: cleanSlug,
        publicUrl: nextPublicUrl,
        siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
        domain: {
          slug: cleanSlug,
          published,
        },
        htmlSnapshot,
        snapshotPageId: activePageId,
      };

      await onSave?.(payload);

      console.log("[BizUply Visual Save] onSave finished", {
        published,
        slug: cleanSlug,
        contentKeys: Object.keys(readVisualContent(latestData)).length,
      });

      // השמירה האמיתית מתבצעת דרך onSave -> WebsiteStudioPage -> MongoDB.
      // לא שומרים payload כבד ב-localStorage כדי למנוע QuotaExceededError.

      setSavedAt(updatedAt);

      if (published) {
        setPublishPanelOpen(false);
        window.alert(`האתר פורסם בהצלחה: ${nextPublicUrl}`);
      }
    } finally {
      setSaving(false);
    }
  }

  function showNotAvailableYet(label: string) {
    setSidebarMessage(`${label} יחובר בשלב הבא לעורך הוויזואלי`);
  }

  function getNodeByVisualId(elementId: string) {
    const root = canvasRef.current;
    if (!root || !elementId) return null;

    const selector = selectorForVisualElement(elementId).replace(/\n/g, "");
    return root.querySelector(selector) as HTMLElement | null;
  }

  function updateSelectionBox(elementId = selectedElement?.id || "") {
    const root = canvasRef.current;
    if (!root || !elementId) {
      setSelectionBox(null);
      return;
    }

    const node = getNodeByVisualId(elementId);

    if (!node) {
      setSelectionBox(null);
      return;
    }

    setSelectionBox(getVisualNodeRectInCanvas(node, root));
  }

  function selectVisualNode(editNode: HTMLElement) {
    const root = canvasRef.current;
    if (!root || !editNode || isIgnoredVisualNode(editNode)) return;

    const visualId = editNode.getAttribute("data-visual-edit-id");
    const sectionId = getSectionIdFromNode(editNode);
    const section = sections.find((item) => item.id === sectionId);
    const elementType = getVisualTypeFromNode(editNode);

    const elementId =
      visualId ||
      (sectionId
        ? `${sectionId}.section`
        : editNode.getAttribute("data-section-kind") || "");

    if (!elementId) return;

    if (sectionId) {
      setSelectedSectionId(sectionId);
    }

    const content = readVisualContent(templateData);
    const contentValue = content[elementId] || {};
    const textValue = contentValue.text || getNodeText(editNode);
    const imageValue = contentValue.src || getNodeImageSrc(editNode);
    const altValue = contentValue.alt || getNodeImageAlt(editNode);
    const linkValue = contentValue.href || getNodeLinkHref(editNode);
    const linkTarget = contentValue.target || getNodeLinkTarget(editNode);

    root
      .querySelectorAll("[data-visual-selected='true']")
      .forEach((node) => node.removeAttribute("data-visual-selected"));

    editNode.setAttribute("data-visual-selected", "true");

    setSelectedElement({
      id: elementId,
      type: elementType,
      label: getElementLabel({
        elementId,
        elementType,
        sectionLabel: section?.label,
        node: editNode,
      }),
      sectionId: sectionId || getSectionIdFromVisualId(elementId),
      fieldKey: getFieldKeyFromVisualId(elementId),
      textValue,
      imageValue,
      altValue,
      linkValue,
      linkTarget,
    });


    window.requestAnimationFrame(() => {
      setSelectionBox(getVisualNodeRectInCanvas(editNode, root));
    });
  }

  function clearNativeBrowserSelection() {
    try {
      window.getSelection?.()?.removeAllRanges();
    } catch {
      /* noop */
    }
  }

  function placeCaretAtEnd(node: HTMLElement) {
    try {
      node.focus({ preventScroll: true });

      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);

      const selection = window.getSelection?.();
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch {
      node.focus();
    }
  }

  function commitInlineTextEdit(node: HTMLElement, elementId: string) {
    const value = String(node.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .trim();

    node.removeAttribute("contenteditable");
    node.removeAttribute("spellcheck");
    node.removeAttribute("data-visual-inline-editing");

    setInlineEditingElementId((current) =>
      current === elementId ? "" : current,
    );

    if (value) {
      handleUpdateVisualText(elementId, value);
    }

    window.requestAnimationFrame(() => updateSelectionBox(elementId));
  }

  function beginInlineTextEdit(editNode: HTMLElement) {
    const root = canvasRef.current;

    if (!root || !editNode || isIgnoredVisualNode(editNode)) return;

    const elementType = getVisualTypeFromNode(editNode);

    if (elementType !== "text" && elementType !== "button") return;

    const visualId = editNode.getAttribute("data-visual-edit-id") || "";
    const sectionId = getSectionIdFromNode(editNode);
    const elementId =
      visualId ||
      (sectionId
        ? `${sectionId}.section`
        : editNode.getAttribute("data-section-kind") || "");

    if (!elementId) return;

    selectVisualNode(editNode);
    setInlineEditingElementId(elementId);
    setPreviewOnly(false);
    setSelectionBox(null);
    clearNativeBrowserSelection();

    editNode.setAttribute("contenteditable", "true");
    editNode.setAttribute("spellcheck", "false");
    editNode.setAttribute("data-visual-inline-editing", "true");

    const handleBlur = () => {
      editNode.removeEventListener("blur", handleBlur);
      editNode.removeEventListener("keydown", handleKeyDown);
      commitInlineTextEdit(editNode, elementId);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        editNode.blur();
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        editNode.blur();
      }
    };

    editNode.addEventListener("blur", handleBlur);
    editNode.addEventListener("keydown", handleKeyDown);

    window.requestAnimationFrame(() => placeCaretAtEnd(editNode));
  }

  function startElementDrag(
    event: React.PointerEvent<HTMLElement>,
    mode: VisualDragMode,
  ) {
    if (previewOnly || !selectedElement?.id) return;

    const root = canvasRef.current;
    const node = getNodeByVisualId(selectedElement.id);

    if (!root || !node) return;

    event.preventDefault();
    event.stopPropagation();

    const box = getVisualNodeRectInCanvas(node, root);
    const currentStyle = visualStyles[selectedElement.id] || {};
    const transform = parseVisualTransform(currentStyle.transform);
    const computed = window.getComputedStyle(node);
    const startFontSize = Number.parseFloat(computed.fontSize || "") || 18;

    dragStateRef.current = {
      mode,
      elementId: selectedElement.id,
      elementType: selectedElement.type,
      node,
      startX: event.clientX,
      startY: event.clientY,
      startBox: box,
      startTransform: transform,
      startWidth: box.width,
      startHeight: box.height,
      startFontSize,
    };

    setSelectionBox(box);
    setIsDraggingElement(true);
    clearNativeBrowserSelection();

    try {
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
  }

  React.useEffect(() => {
    if (!isDraggingElement) return;

    function handlePointerMove(event: PointerEvent) {
      const state = dragStateRef.current;
      const root = canvasRef.current;

      if (!state || !root) return;

      event.preventDefault();
      clearNativeBrowserSelection();

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;

      if (state.mode === "move") {
        const nextTransform = {
          ...state.startTransform,
          x: state.startTransform.x + deltaX,
          y: state.startTransform.y + deltaY,
        };

        handleApplyVisualStyle(state.elementId, {
          position: "relative",
          transform: buildVisualTransform(nextTransform),
        });

        setSelectionBox({
          ...state.startBox,
          left: state.startBox.left + deltaX,
          top: state.startBox.top + deltaY,
        });
        return;
      }

      let nextWidth = state.startWidth;
      let nextHeight = state.startHeight;
      let nextLeft = state.startBox.left;
      let nextTop = state.startBox.top;

      if (state.mode.includes("e")) {
        nextWidth = state.startWidth + deltaX;
      }

      if (state.mode.includes("s")) {
        nextHeight = state.startHeight + deltaY;
      }

      if (state.mode.includes("w")) {
        nextWidth = state.startWidth - deltaX;
        nextLeft = state.startBox.left + deltaX;
      }

      if (state.mode.includes("n")) {
        nextHeight = state.startHeight - deltaY;
        nextTop = state.startBox.top + deltaY;
      }

      nextWidth = clampVisualSize(nextWidth);
      nextHeight = clampVisualSize(nextHeight);

      if (state.elementType === "text") {
        const ratioX = nextWidth / Math.max(1, state.startWidth);
        const ratioY = nextHeight / Math.max(1, state.startHeight);
        const ratio = Math.max(0.35, Math.min(3.2, (ratioX + ratioY) / 2));
        const nextFontSize = Math.max(8, Math.round(state.startFontSize * ratio));

        handleApplyVisualStyle(state.elementId, {
          display: "inline-block",
          width: `${nextWidth}px`,
          maxWidth: "none",
          fontSize: `${nextFontSize}px`,
          lineHeight: "1.05",
        });
      } else {
        handleApplyVisualStyle(state.elementId, {
          display: state.elementType === "image" ? "block" : undefined,
          width: `${nextWidth}px`,
          height: `${nextHeight}px`,
          maxWidth: "none",
          objectFit: state.elementType === "image" ? "cover" : undefined,
        });
      }

      setSelectionBox({
        top: nextTop,
        left: nextLeft,
        width: nextWidth,
        height: nextHeight,
      });
    }

    function handlePointerUp() {
      dragStateRef.current = null;
      setIsDraggingElement(false);
      window.requestAnimationFrame(() => updateSelectionBox());
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDraggingElement, selectedElement?.id, visualStyles]);

  React.useEffect(() => {
    if (!selectedElement?.id || inlineEditingElementId) {
      setSelectionBox(null);
      return;
    }

    window.requestAnimationFrame(() => updateSelectionBox(selectedElement.id));
  }, [selectedElement?.id, visualStyles, activePageId, device, inlineEditingElementId]);


  function handleCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (inlineEditingElementId) return;
    if (previewOnly) return;

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

    const formButtonNode = getFormButtonFromNode(target);

    if (formButtonNode) {
      event.preventDefault();
      event.stopPropagation();

      suppressNextCanvasClickRef.current = true;

      // פתיחה מהירה: לא סורקים את כל הקנבס ולא בוחרים את הכפתור לפני פתיחת המודאל.
      // זה היה גורם לעיכוב מורגש בטפסים גדולים / תבניות כבדות.
      openFormBuilderForFormNode(getFormNodeFromButtonNode(formButtonNode), event);
      return;
    }

    if (!selectedElement?.id || !canFreeTransformElement(selectedElement)) return;

    // חשוב:
    // טקסט וכפתורים לא מתחילים גרירה מתוך הקליק על האלמנט עצמו.
    // אחרת הדאבל־קליק נתפס כגרירה ולא מגיע למצב contentEditable.
    // גרירה/שינוי גודל עדיין עובדים דרך התווית הכחולה והידיות.
    if (selectedElement.type === "text" || selectedElement.type === "button") return;

    // בדאבל־קליק לא מתחילים drag בכלל, כדי לאפשר עריכה ישירה כמו Wix.
    if (event.detail >= 2) return;

    stampAutoEditableElements(root);

    const editNode = findBestEditableNode(target, root);
    const nodeId = editNode?.getAttribute("data-visual-edit-id") || "";

    if (nodeId !== selectedElement.id) return;

    const tagName = String(editNode?.tagName || "").toLowerCase();

    if (["input", "textarea", "select"].includes(tagName)) return;

    startElementDrag(event, "move");
  }

  function handleCanvasClick(event: React.MouseEvent<HTMLDivElement>) {
    if (previewOnly) return;

    if (suppressNextCanvasClickRef.current) {
      suppressNextCanvasClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

    if (inlineEditingElementId) {
      const editingNode = root.querySelector(
        `[data-visual-edit-id="${safeCssSelectorValue(inlineEditingElementId)}"]`,
      ) as HTMLElement | null;

      if (editingNode?.contains(target)) {
        return;
      }
    }

    stampAutoEditableElements(root);

    const editNode = findBestEditableNode(target, root);

    if (!editNode || isIgnoredVisualNode(editNode)) return;

    const elementType = getVisualTypeFromNode(editNode);

    const formButtonNode = getFormButtonFromNode(editNode);

    if (formButtonNode) {
      event.preventDefault();
      event.stopPropagation();

      selectVisualNode(formButtonNode);
      setPreviewOnly(false);
      openFormBuilderForFormNode(
        formButtonNode.closest("form") as HTMLFormElement | null,
        event,
      );
      return;
    }

    // חשוב מאוד:
    // בחלק מהדפדפנים onDoubleClickCapture לא מגיע כי הקליק הראשון מסמן את האלמנט
    // ומפעיל שכבת בחירה. לכן בדיקה של event.detail >= 2 בתוך onClickCapture
    // היא הדרך הכי יציבה להפעיל עריכת טקסט כמו Wix.
    if (event.detail >= 2 && (elementType === "text" || elementType === "button")) {
      event.preventDefault();
      event.stopPropagation();
      beginInlineTextEdit(editNode);
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    selectVisualNode(editNode);
    setPreviewOnly(false);
  }

  function handleCanvasDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (previewOnly) return;

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

    stampAutoEditableElements(root);

    const editNode = findBestEditableNode(target, root);

    if (!editNode || isIgnoredVisualNode(editNode)) return;

    const elementType = getVisualTypeFromNode(editNode);

    if (elementType !== "text" && elementType !== "button") return;

    event.preventDefault();
    event.stopPropagation();

    beginInlineTextEdit(editNode);
  }

  function handleCanvasMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (inlineEditingElementId) return;
    if (previewOnly) return;

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

    stampAutoEditableElements(root);

    const editNode = findBestEditableNode(target, root);
    const nextId = editNode?.getAttribute("data-visual-edit-id") || "";

    if (nextId !== hoveredElementId) {
      root
        .querySelectorAll("[data-visual-hovered='true']")
        .forEach((node) => node.removeAttribute("data-visual-hovered"));

      if (editNode && nextId) {
        editNode.setAttribute("data-visual-hovered", "true");
      }

      setHoveredElementId(nextId);
    }
  }

  function handleCanvasMouseLeave() {
    const root = canvasRef.current;

    root
      ?.querySelectorAll("[data-visual-hovered='true']")
      .forEach((node) => node.removeAttribute("data-visual-hovered"));

    setHoveredElementId("");
  }

  function handleApplyVisualStyle(elementId: string, style: StylePatch) {
    const normalized = normalizeStyle(style);

    setTemplateData((current) => {
      const currentStyles = readVisualStyles(current);

      return {
        ...current,
        [VISUAL_STYLE_KEY]: {
          ...currentStyles,
          [elementId]: {
            ...(currentStyles[elementId] || {}),
            ...normalized,
          },
        },
      };
    });

    window.requestAnimationFrame(() => updateSelectionBox(elementId));
  }

  function handleResetVisualStyle(elementId: string) {
    setTemplateData((current) => {
      const currentStyles = { ...readVisualStyles(current) };
      const currentAnimations = { ...readVisualAnimations(current) };

      delete currentStyles[elementId];
      delete currentAnimations[elementId];

      return {
        ...current,
        [VISUAL_STYLE_KEY]: currentStyles,
        [VISUAL_ANIMATION_KEY]: currentAnimations,
      };
    });
  }

  function handleUpdateVisualText(elementId: string, value: string) {
    const elementType = selectedElement?.type || "text";

    setTemplateData((current) => {
      const currentContent = readVisualContent(current);

      return {
        ...current,
        [VISUAL_CONTENT_KEY]: {
          ...currentContent,
          [elementId]: {
            ...(currentContent[elementId] || {}),
            text: value,
          },
        },
      };
    });

    updateTemplateFieldByVisualId(elementId, elementType, value);

    setSelectedElement((current) =>
      current?.id === elementId
        ? {
            ...current,
            textValue: value,
          }
        : current,
    );
  }

  function handleUpdateVisualImage(
    elementId: string,
    payload: {
      src?: string;
      alt?: string;
    },
  ) {
    setTemplateData((current) => {
      const currentContent = readVisualContent(current);

      return {
        ...current,
        [VISUAL_CONTENT_KEY]: {
          ...currentContent,
          [elementId]: {
            ...(currentContent[elementId] || {}),
            src: payload.src,
            alt: payload.alt,
          },
        },
      };
    });

    if (payload.src) {
      updateTemplateFieldByVisualId(elementId, "image", payload.src);
    }

    setSelectedElement((current) =>
      current?.id === elementId
        ? {
            ...current,
            imageValue: payload.src || current.imageValue,
            altValue: payload.alt || current.altValue,
          }
        : current,
    );
  }

  function handleUpdateVisualLink(
    elementId: string,
    payload: {
      href?: string;
      target?: "_self" | "_blank" | string;
    },
  ) {
    const href = normalizeVisualLinkHref(payload.href || "");
    const target = payload.target === "_blank" ? "_blank" : "_self";
    const rel = target === "_blank" ? "noopener noreferrer" : "";

    const buildNextData = (current: Record<string, any>) => {
      const currentContent = readVisualContent(current);

      return {
        ...current,
        [VISUAL_CONTENT_KEY]: {
          ...currentContent,
          [elementId]: {
            ...(currentContent[elementId] || {}),
            href,
            target,
            rel,
          },
        },
      };
    };

    setTemplateData((current) => {
      const nextData = buildNextData(current);

      templateDataRef.current = nextData;

      return nextData;
    });

    updateTemplateLinkFieldByVisualId(elementId, href);

    const node = getNodeByVisualId(elementId);

    if (node) {
      applyVisualLinkToDomNode(node, href, target);
    }

    setSelectedElement((current) =>
      current?.id === elementId
        ? {
            ...current,
            linkValue: href,
            linkTarget: target,
          }
        : current,
    );

    console.log("[BizUply Visual Link] updated", {
      elementId,
      href,
      target,
      savedInContent: true,
    });
  }

  function handleSetAnimation(
    elementId: string,
    animation: AnimationPresetValue | string,
  ) {
    setTemplateData((current) => {
      const currentAnimations = readVisualAnimations(current);

      return {
        ...current,
        [VISUAL_ANIMATION_KEY]: {
          ...currentAnimations,
          [elementId]: animation,
        },
      };
    });
  }

  function handleClearAnimation(elementId: string) {
    setTemplateData((current) => {
      const currentAnimations = { ...readVisualAnimations(current) };

      delete currentAnimations[elementId];

      return {
        ...current,
        [VISUAL_ANIMATION_KEY]: currentAnimations,
      };
    });
  }

  function handleBringForward(elementId: string) {
    const currentZ = Number(visualStyles[elementId]?.zIndex || 1);

    handleApplyVisualStyle(elementId, {
      position: "relative",
      zIndex: currentZ + 1,
    });
  }

  function handleSendBackward(elementId: string) {
    const currentZ = Number(visualStyles[elementId]?.zIndex || 1);

    handleApplyVisualStyle(elementId, {
      position: "relative",
      zIndex: Math.max(0, currentZ - 1),
    });
  }

  function getFormButtonFromNode(node: HTMLElement | null) {
    if (!node) return null;

    const formNode = node.closest?.("form") as HTMLFormElement | null;

    if (!formNode) return null;

    /*
      פותחים את מודאל עריכת הטופס מכל אלמנט לחיץ/אינטראקטיבי בתוך הטופס,
      לא רק מכפתור submit.
      חשוב לתבניות שבהן יש כמה כפתורים בתוך הטופס, שדות שמוגדרים כ-button
      או אלמנטים עם role/button/data-visual-edit-type.
    */
    const actionNode = node.closest?.(
      [
        "button",
        "a",
        "input",
        "textarea",
        "select",
        "label",
        "[role='button']",
        "[data-visual-edit-id='form.submit']",
        "[data-visual-edit-type='button']",
        "[data-bizuply-form-field-wrapper='true']",
        "[data-bizuply-form-field-id]",
      ].join(","),
    ) as HTMLElement | null;

    if (!actionNode) return null;
    if (!formNode.contains(actionNode)) return null;

    return actionNode;
  }

  function getFormNodeFromButtonNode(node: HTMLElement | null) {
    const buttonNode = getFormButtonFromNode(node);

    return buttonNode?.closest("form") as HTMLFormElement | null;
  }

  function getSelectedFormNode() {
    if (!selectedElement?.id) return null;

    const node = getNodeByVisualId(selectedElement.id);
    const formButtonNode = getFormButtonFromNode(node);

    if (!formButtonNode) return null;

    return formButtonNode.closest("form") as HTMLFormElement | null;
  }

  function prepareFormNodeForBuilder(formNode: HTMLFormElement | null) {
    if (!formNode) return;

    if (!formNode.getAttribute("data-visual-edit-id")) {
      formNode.setAttribute("data-visual-edit-id", "contact.form");
    }

    formNode.setAttribute("data-visual-editable", "true");
    formNode.setAttribute("data-visual-edit-type", "button");
    formNode.setAttribute("data-visual-edit-label", "טופס");
  }

  function getFormElementIdFromNode(formNode: HTMLFormElement | null) {
    if (!formNode) return "";

    prepareFormNodeForBuilder(formNode);

    return (
      formNode.getAttribute("data-visual-edit-id") ||
      selectedElement?.sectionId ||
      selectedElement?.id ||
      "contact-form"
    );
  }

  function getSelectedFormElementId() {
    return getFormElementIdFromNode(getSelectedFormNode());
  }

  function selectedElementIsInsideForm() {
    return Boolean(getSelectedFormNode());
  }

  function getSavedSelectedFormConfig(formElementIdOverride = "") {
    const formElementId = formElementIdOverride || getSelectedFormElementId();
    const byElement = readFormBuilderByElement(templateData);

    if (formElementId && byElement[formElementId]) {
      return normalizeFormBuilderConfig(byElement[formElementId]);
    }

    return normalizeFormBuilderConfig(templateData[FORM_BUILDER_KEY] || formBuilderForm);
  }

  function getMeasuredFormFieldWidth(
    fieldNode: HTMLElement,
    allFieldNodes: HTMLElement[],
  ): "half" | "full" | undefined {
    const explicitWidth =
      fieldNode.getAttribute("data-bizuply-form-field-width") ||
      fieldNode.closest("[data-bizuply-form-field-wrapper]")?.getAttribute("data-bizuply-form-field-width") ||
      "";

    if (explicitWidth === "full" || explicitWidth === "half") {
      return explicitWidth;
    }

    const wrapper =
      (fieldNode.closest("[data-bizuply-form-field-wrapper]") as HTMLElement | null) ||
      (fieldNode.closest("[class*='col-span']") as HTMLElement | null) ||
      (fieldNode.closest("label") as HTMLElement | null) ||
      fieldNode.parentElement ||
      fieldNode;

    const wrapperClass = String(wrapper.getAttribute("class") || "");

    if (
      /\bmd:col-span-2\b/.test(wrapperClass) ||
      /\bcol-span-2\b/.test(wrapperClass) ||
      /\bw-full\b/.test(wrapperClass) ||
      /\bgrid-column:\s*span\s*2\b/.test(wrapper.getAttribute("style") || "")
    ) {
      return "full";
    }

    if (
      wrapper.getAttribute("data-bizuply-form-field-width") === "half" ||
      /\bmd:col-span-1\b/.test(wrapperClass) ||
      /\bw-1\/2\b/.test(wrapperClass) ||
      /\bmd:w-1\/2\b/.test(wrapperClass)
    ) {
      return "half";
    }

    const parent =
      (wrapper.closest("[data-bizuply-form-fields]") as HTMLElement | null) ||
      wrapper.parentElement ||
      fieldNode.closest("form");

    if (parent) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      if (parentRect.width > 0 && wrapperRect.width > 0) {
        const ratio = wrapperRect.width / parentRect.width;

        if (ratio >= 0.72) return "full";
        if (ratio <= 0.68) return "half";
      }
    }

    const fieldRect = fieldNode.getBoundingClientRect();
    const sameRowFields = allFieldNodes.filter((otherNode) => {
      if (otherNode === fieldNode) return false;

      const otherRect = otherNode.getBoundingClientRect();

      return Math.abs(otherRect.top - fieldRect.top) <= 12;
    });

    if (sameRowFields.length > 0) {
      return "half";
    }

    return undefined;
  }

  function buildFormBuilderConfigFromSelectedDom(
    formNodeOverride?: HTMLFormElement | null,
  ): BizuplyFormConfig {
    const formNode = formNodeOverride || getSelectedFormNode();
    const formElementId = getFormElementIdFromNode(formNode);
    const savedForm = getSavedSelectedFormConfig(formElementId);

    if (!formNode) return savedForm;

    const titleNode =
      formNode.closest("section")?.querySelector("h1,h2,h3,[data-form-title]") ||
      formNode.querySelector("[data-form-title]");

    const submitNode =
      formNode.querySelector<HTMLButtonElement>('button[type="submit"]') ||
      formNode.querySelector<HTMLButtonElement>("button") ||
      formNode.querySelector<HTMLInputElement>('input[type="submit"]');

    const fieldNodes = Array.from(
      formNode.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input, textarea, select",
      ),
    ).filter((fieldNode) => {
      const tagName = String(fieldNode.tagName || "").toLowerCase();
      const type = String(fieldNode.getAttribute("type") || "").toLowerCase();

      if (tagName === "input" && ["button", "submit", "reset", "hidden"].includes(type)) {
        return false;
      }

      return true;
    });

    const htmlFieldNodes = fieldNodes as HTMLElement[];

    const fields: BizuplyFormField[] = fieldNodes.map((fieldNode, index) => {
      const tagName = String(fieldNode.tagName || "").toLowerCase();
      const rawType =
        tagName === "textarea"
          ? "textarea"
          : tagName === "select"
            ? "select"
            : String(fieldNode.getAttribute("type") || "text");
      const fieldType = toBizuplyFormFieldType(rawType);
      const label = getInputLabel(fieldNode, `שדה ${index + 1}`);
      const placeholder =
        fieldNode instanceof HTMLInputElement || fieldNode instanceof HTMLTextAreaElement
          ? String(fieldNode.getAttribute("placeholder") || "")
          : "";
      const nameOrId =
        fieldNode.getAttribute("name") ||
        fieldNode.getAttribute("id") ||
        fieldNode.getAttribute("data-bizuply-form-field-id") ||
        fieldNode.getAttribute("data-visual-edit-id") ||
        `field-${index + 1}`;

      const savedField =
        savedForm.fields.find((field) => field.id === nameOrId) ||
        savedForm.fields.find((field) => field.label === label) ||
        savedForm.fields[index];

      const measuredWidth = getMeasuredFormFieldWidth(fieldNode, htmlFieldNodes);

      return {
        id: String(nameOrId)
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9א-ת_-]/g, "") || `field-${index + 1}`,
        label,
        type: fieldType,
        placeholder,
        required:
          fieldNode.hasAttribute("required") ||
          String(fieldNode.getAttribute("aria-required") || "") === "true",
        options:
          fieldNode instanceof HTMLSelectElement
            ? Array.from(fieldNode.options)
                .map((option) => String(option.textContent || option.value || "").trim())
                .filter(Boolean)
            : [],
        width:
          measuredWidth ||
          savedField?.width ||
          (fieldType === "textarea" || fieldType === "select" || fieldType === "checkbox" || fieldType === "file"
            ? "full"
            : "half"),
      };
    });

    return normalizeFormBuilderConfig({
      ...savedForm,
      id: formElementId || savedForm.id,
      title: String(titleNode?.textContent || savedForm.title || "טופס יצירת קשר")
        .replace(/\s+/g, " ")
        .trim(),
      submitText: String(
        submitNode instanceof HTMLInputElement
          ? submitNode.value || submitNode.getAttribute("value") || savedForm.submitText
          : submitNode?.textContent || savedForm.submitText,
      )
        .replace(/\s+/g, " ")
        .trim(),
      fields: fields.length ? fields : savedForm.fields,
    });
  }

  function openFormBuilderForFormNode(
    formNode: HTMLFormElement | null,
    event?: React.MouseEvent<any> | React.PointerEvent<any>,
  ) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!formNode) return;

    prepareFormNodeForBuilder(formNode);

    const formElementId = getFormElementIdFromNode(formNode) || "contact-form";
    const savedForm = getSavedSelectedFormConfig(formElementId);

    activeFormElementIdRef.current = formElementId;
    activeFormNodeRef.current = formNode;

    // פתיחה מיידית עם המידע שכבר שמור בזיכרון.
    // את הקריאה הכבדה מה-DOM עושים אחרי שהמודאל כבר על המסך.
    setFormBuilderForm(savedForm);
    setFormBuilderOpen(true);

    window.requestAnimationFrame(() => {
      if (activeFormElementIdRef.current !== formElementId) return;
      if (!formNode.isConnected) return;

      const domForm = buildFormBuilderConfigFromSelectedDom(formNode);

      setFormBuilderForm((current) => {
        const currentSafe = normalizeFormBuilderConfig(current);
        const domSafe = normalizeFormBuilderConfig(domForm);

        // אם המשתמשת כבר הספיקה לערוך משהו אחרי הפתיחה, לא דורסים שינויים.
        if (JSON.stringify(currentSafe) !== JSON.stringify(savedForm)) {
          return currentSafe;
        }

        return domSafe;
      });
    });
  }

  function openFormBuilderForSelectedForm(
    event?: React.MouseEvent<HTMLButtonElement>,
  ) {
    openFormBuilderForFormNode(getSelectedFormNode(), event);
  }

  function syncFormBuilderToTemplateData(nextForm: BizuplyFormConfig) {
    const safeForm = normalizeFormBuilderConfig(nextForm);
    const formElementId =
      activeFormElementIdRef.current ||
      getSelectedFormElementId() ||
      safeForm.id ||
      "contact-form";

    const root = canvasRef.current;

    const activeFormNode =
      activeFormNodeRef.current && activeFormNodeRef.current.isConnected
        ? activeFormNodeRef.current
        : null;

    const selectedFormNode =
      activeFormNode ||
      getSelectedFormNode() ||
      root?.querySelector<HTMLFormElement>(
        `form[data-visual-edit-id="${safeCssSelectorValue(formElementId)}"], [data-visual-edit-id="${safeCssSelectorValue(formElementId)}"] form`,
      ) ||
      root?.querySelector<HTMLFormElement>("form") ||
      null;

    applyFormBuilderConfigToFormNode(selectedFormNode, safeForm);
    stampAutoEditableElements(root);

    setTemplateData((currentData) => {
      const byElement = readFormBuilderByElement(currentData);
      const updatedData = {
        ...currentData,
        [FORM_BUILDER_KEY]: safeForm,
        [FORM_BUILDER_BY_ELEMENT_KEY]: {
          ...byElement,
          [formElementId]: safeForm,
        },
      };

      templateDataRef.current = updatedData;
      return updatedData;
    });
  }

  function closeFormBuilderAndApplyChanges() {
    syncFormBuilderToTemplateData(formBuilderForm);
    setFormBuilderOpen(false);
    activeFormElementIdRef.current = "";
    activeFormNodeRef.current = null;
  }

  function handleUpdateFormBuilderForm(patch: Partial<BizuplyFormConfig>) {
    setFormBuilderForm((current) =>
      normalizeFormBuilderConfig({
        ...current,
        ...patch,
      }),
    );
  }

  function createFormBuilderFieldByType(
    type: BizuplyFormFieldType = "text",
  ): BizuplyFormField {
    const fieldId = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (type === "email") {
      return {
        id: fieldId,
        label: "כתובת אימייל",
        type,
        placeholder: "כתובת אימייל",
        required: false,
        options: [],
        width: "half",
      };
    }

    if (type === "phone") {
      return {
        id: fieldId,
        label: "טלפון",
        type,
        placeholder: "טלפון",
        required: false,
        options: [],
        width: "half",
      };
    }

    if (type === "textarea") {
      return {
        id: fieldId,
        label: "הודעה",
        type,
        placeholder: "כתבו כאן...",
        required: false,
        options: [],
        width: "full",
      };
    }

    if (type === "number") {
      return {
        id: fieldId,
        label: "מספר",
        type,
        placeholder: "הזינו מספר",
        required: false,
        options: [],
        width: "half",
      };
    }

    if (type === "date") {
      return {
        id: fieldId,
        label: "תאריך",
        type,
        placeholder: "",
        required: false,
        options: [],
        width: "half",
      };
    }

    if (type === "select") {
      return {
        id: fieldId,
        label: "בחירה",
        type,
        placeholder: "",
        required: false,
        options: ["אפשרות 1", "אפשרות 2", "אפשרות 3"],
        width: "full",
      };
    }

    if (type === "checkbox") {
      return {
        id: fieldId,
        label: "אני מאשר/ת",
        type,
        placeholder: "",
        required: false,
        options: [],
        width: "full",
      };
    }

    if (type === "file") {
      return {
        id: fieldId,
        label: "העלאת קובץ",
        type,
        placeholder: "",
        required: false,
        options: [],
        width: "full",
      };
    }

    return {
      id: fieldId,
      label: "שדה חדש",
      type: "text",
      placeholder: "הקלידו כאן",
      required: false,
      options: [],
      width: "half",
    };
  }

  function handleUpdateFormBuilderField(
    fieldId: string,
    patch: Partial<BizuplyFormField>,
  ) {
    setFormBuilderForm((current) =>
      normalizeFormBuilderConfig({
        ...current,
        fields: current.fields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                ...patch,
              }
            : field,
        ),
      }),
    );
  }

  function handleDeleteFormBuilderField(fieldId: string) {
    setFormBuilderForm((current) =>
      normalizeFormBuilderConfig({
        ...current,
        fields: current.fields.filter((field) => field.id !== fieldId),
      }),
    );
  }

  function handleMoveFormBuilderField(fieldId: string, direction: "up" | "down") {
    setFormBuilderForm((current) => {
      const currentIndex = current.fields.findIndex((field) => field.id === fieldId);

      if (currentIndex < 0) return current;

      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= current.fields.length) return current;

      const nextFields = [...current.fields];
      const [movedField] = nextFields.splice(currentIndex, 1);
      nextFields.splice(nextIndex, 0, movedField);

      return normalizeFormBuilderConfig({
        ...current,
        fields: nextFields,
      });
    });
  }


  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-100 text-slate-950"
      dir="rtl"
      data-template-visual-editor="true"
      data-template-key={renderer.key}
      data-business-id={businessId || ""}
    >
      <header className="z-30 flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </button>
          ) : null}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              React Visual Editor
            </p>

            <h1 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {renderer.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sidebarMessage ? (
            <div className="hidden rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-black text-amber-700 xl:block">
              {sidebarMessage}
            </div>
          ) : null}

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 md:flex">
            {(["desktop", "tablet", "mobile"] as VisualDeviceMode[]).map(
              (item) => {
                const active = device === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDevice(item)}
                    title={getDeviceLabel(item)}
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl transition",
                      active
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:bg-white hover:text-slate-950",
                    ].join(" ")}
                  >
                    {item === "desktop" ? (
                      <Monitor className="h-4 w-4" />
                    ) : item === "tablet" ? (
                      <Tablet className="h-4 w-4" />
                    ) : (
                      <Smartphone className="h-4 w-4" />
                    )}
                  </button>
                );
              },
            )}
          </div>

          <button
            type="button"
            onClick={() => setPreviewOnly((current) => !current)}
            className={[
              "inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition",
              previewOnly
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {previewOnly ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewOnly ? "חזרה לעריכה" : "מצב צפייה"}
          </button>

          {!previewOnly && selectedElementIsInsideForm() ? (
  <button
    type="button"
    onMouseDown={(event) => {
      event.preventDefault();
      event.stopPropagation();
    }}
    onPointerDown={(event) => {
      event.preventDefault();
      event.stopPropagation();
    }}
    onClick={(event) => openFormBuilderForSelectedForm(event)}
    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-5 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-100"
  >
    <Plus className="h-4 w-4" />
    עריכת טופס
  </button>
) : null}

          <button
            type="button"
            onClick={() => void handleSave(false)}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "שומר..." : "שמירת טיוטה"}
          </button>

          <button
            type="button"
            onClick={() => setPublishPanelOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-black"
          >
            <Sparkles className="h-4 w-4" />
            פרסום אתר
          </button>
        </div>
      </header>

      {publishPanelOpen ? (
        <div className="z-[120] border-b border-slate-200 bg-white/95 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-between gap-4">
            <div className="min-w-[260px]">
              <p className="text-sm font-black text-slate-950">פרסום האתר</p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                קודם בודקים שהכתובת פנויה, ואז מפרסמים את האתר.
              </p>
            </div>

            <div className="flex min-w-[320px] flex-1 flex-wrap items-center gap-2">
              <div className="flex h-12 min-w-[320px] flex-1 items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
                <span className="shrink-0 px-4 text-sm font-black text-slate-400">https://</span>
                <input
                  value={siteSlug}
                  onChange={(event) => {
                    setSiteSlug(normalizeBusinessSlug(event.target.value));
                    setSlugAvailable(null);
                    setSlugError("");
                  }}
                  dir="ltr"
                  placeholder="your-business"
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-left text-sm font-black text-slate-950 outline-none"
                />
                <span className="shrink-0 px-4 text-sm font-black text-slate-400">
                  .{BIZUPLY_PUBLIC_SITE_DOMAIN}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void checkSlugAvailability()}
                disabled={slugChecking || !siteSlugValid || !siteSlug || siteSlug === "your-business"}
                className="h-12 rounded-2xl border border-blue-100 bg-blue-50 px-5 text-sm font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {slugChecking ? "בודק..." : "בדיקת זמינות"}
              </button>

              <button
                type="button"
                onClick={() => void handleSave(true)}
                disabled={saving || slugChecking || slugAvailable !== true}
                className="h-12 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? "מפרסם..." : "פרסם אתר"}
              </button>

              <button
                type="button"
                onClick={() => setPublishPanelOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                aria-label="סגירת פרסום"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-3 max-w-[1420px] text-center text-xs font-black">
            {!siteSlugValid && siteSlug ? (
              <span className="text-rose-600">מותר רק אותיות באנגלית קטנות, מספרים ומקף.</span>
            ) : slugChecking ? (
              <span className="text-sky-700">בודק אם הכתובת פנויה...</span>
            ) : slugAvailable === true ? (
              <span className="text-emerald-700">הכתובת פנויה: {publicUrl}</span>
            ) : slugAvailable === false ? (
              <span className="text-rose-600">{slugError || "הכתובת הזו כבר תפוסה."}</span>
            ) : (
              <span className="text-slate-500">כתובת הפרסום תהיה: {publicUrl}</span>
            )}
          </div>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#eef1f8]">
        {!previewOnly ? (
          <div className="absolute right-4 top-4 z-[80] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setActivePanel((current) => (current === "pages" ? null : "pages"))}
              className={[
                "flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-50",
                activePanel === "pages" ? "border-violet-200 text-violet-700" : "border-slate-200 text-slate-700",
              ].join(" ")}
              title="דפים"
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((current) => (current === "sections" ? null : "sections"))}
              className={[
                "flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-50",
                activePanel === "sections" ? "border-violet-200 text-violet-700" : "border-slate-200 text-slate-700",
              ].join(" ")}
              title="סקשנים"
            >
              <Layers className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => showNotAvailableYet("הוספת אלמנט")}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-50"
              title="הוספה"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        {!previewOnly && activePanel ? (
          <aside
            dir="rtl"
            className="absolute right-20 top-4 z-[85] flex max-h-[calc(100%-32px)] w-[360px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_26px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">
                  {activePanel === "pages" ? "Pages" : "Sections"}
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-950">
                  {activePanel === "pages" ? "דפים" : "סקשנים בעמוד"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {activePanel === "pages" ? (
                <div className="space-y-2">
                  {visualPages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => {
                        setActivePageId(page.id);
                        setSelectedElement(null);
                        setSelectionBox(null);
                        setHoveredElementId("");
                        setSelectedSectionId("");
                        setPreviewOnly(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-right transition",
                        activePageId === page.id
                          ? "border-violet-200 bg-violet-50 text-violet-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="min-w-0 truncate text-sm font-black">
                        {page.title}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
                        {page.isHome ? "בית" : page.slug || page.id}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {activePageSections.map((section, index) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => selectSection(section.id)}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-right transition",
                        selectedSectionId === section.id
                          ? "border-violet-200 bg-violet-50 text-violet-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="min-w-0 truncate text-sm font-black">
                        {section.title}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        ) : null}

        {!previewOnly && selectedElement ? (
          <VisualTopToolbar
            selectedElement={selectedElement}
            styles={visualStyles}
            content={visualContent}
            pages={visualPages}
            sections={activePageSections}
            activePageId={activePageId}
            onUpdateText={handleUpdateVisualText}
            onUpdateImage={handleUpdateVisualImage}
            onUpdateLink={handleUpdateVisualLink}
            onApplyStyle={handleApplyVisualStyle}
            onResetStyle={handleResetVisualStyle}
            onDuplicate={() => showNotAvailableYet("שכפול אלמנט")}
            onDelete={() => showNotAvailableYet("מחיקת אלמנט")}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSetAnimation={handleSetAnimation}
            onClearAnimation={handleClearAnimation}
            onClearSelection={() => {
              setSelectedElement(null);
              setSelectionBox(null);
              canvasRef.current
                ?.querySelectorAll("[data-visual-selected='true']")
                .forEach((node) => node.removeAttribute("data-visual-selected"));
            }}
          />
        ) : null}

        <main
          className="h-full min-h-0 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff)] p-5"
          onScroll={() => updateSelectionBox()}
        >
          <div className="mx-auto flex min-h-full justify-center">
            <div
              className={[
                "min-h-full overflow-hidden bg-white shadow-[0_24px_90px_rgba(15,23,42,0.16)] transition-all duration-300",
                device === "desktop"
                  ? "w-full max-w-none rounded-[26px]"
                  : "rounded-[32px] border-[10px] border-slate-900",
              ].join(" ")}
              style={{ width: getDeviceWidth(device) }}
            >
              <div
                ref={canvasRef}
                className="relative min-h-full"
                data-visual-template-canvas="true"
                onPointerDownCapture={handleCanvasPointerDown}
                onClickCapture={handleCanvasClick}
                onDoubleClickCapture={handleCanvasDoubleClick}
                onSubmitCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onMouseMoveCapture={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              >
                {templateEditorCss ? <style>{templateEditorCss}</style> : null}
                <style>{visualRuntimeCss}</style>

                <TemplateComponent
                  key={`${renderer.key}-${activePageId}`}
                  mode="editor"
                  viewMode="editor"
                  runtimeMode="editor"
                  initialPage={activePageId}
                  pageId={activePageId}
                  activePageId={activePageId}
                  selectedPageId={activePageId}
                  currentPageId={activePageId}
                  slug={activeVisualPageSlug}
                  pageSlug={activeVisualPageSlug}
                  activePageSlug={activeVisualPageSlug}
                  selectedPageSlug={activeVisualPageSlug}
                  currentPageSlug={activeVisualPageSlug}
                  page={activeVisualPage}
                  activePage={activeVisualPage}
                  selectedPage={activeVisualPage}
                  currentPage={activeVisualPage}
                  isStudioStatic={false}
                  isVisualEditor
                  templateData={templateData}
                  data={templateData}
                  studioData={templateData}
                />

                {!previewOnly && selectedElement && selectionBox && selectedElement.type !== "text" && selectedElement.type !== "button" ? (
                  <div
                    className="pointer-events-none absolute z-[9999]"
                    style={{
                      top: selectionBox.top,
                      left: selectionBox.left,
                      width: selectionBox.width,
                      height: selectionBox.height,
                    }}
                  >
                    <div
                      className={[
                        "absolute inset-0 rounded-[3px]",
                        getSelectionBorderClass(selectedElement),
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "pointer-events-auto absolute -top-7 right-0 rounded-[7px] px-2.5 py-1 text-[10px] font-black leading-none text-white shadow-lg",
                        canFreeTransformElement(selectedElement)
                          ? "cursor-move bg-blue-600"
                          : "cursor-default bg-blue-500/90",
                      ].join(" ")}
                      onPointerDown={(event) => {
                        if (canFreeTransformElement(selectedElement)) {
                          startElementDrag(event, "move");
                        }
                      }}
                    >
                      {selectedElement.label || "אלמנט"}
                    </div>

                    {canFreeTransformElement(selectedElement)
                      ? ([
                          ["resize-nw", "-right-[5px] -top-[5px]"],
                          ["resize-n", "left-1/2 -top-[5px] -translate-x-1/2"],
                          ["resize-ne", "-left-[5px] -top-[5px]"],
                          ["resize-e", "-left-[5px] top-1/2 -translate-y-1/2"],
                          ["resize-se", "-bottom-[5px] -left-[5px]"],
                          ["resize-s", "left-1/2 -bottom-[5px] -translate-x-1/2"],
                          ["resize-sw", "-bottom-[5px] -right-[5px]"],
                          ["resize-w", "-right-[5px] top-1/2 -translate-y-1/2"],
                        ] as Array<[VisualDragMode, string]>).map(([mode, position]) => (
                          <div
                            key={mode}
                            className={[
                              "pointer-events-auto absolute h-[10px] w-[10px] rounded-[2px] border border-white bg-blue-600 shadow-[0_1px_4px_rgba(15,23,42,0.24)]",
                              position,
                            ].join(" ")}
                            style={{ cursor: getResizeCursor(mode) }}
                            onPointerDown={(event) => startElementDrag(event, mode)}
                          />
                        ))
                      : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>


      {formBuilderOpen ? (
        <FormBuilderModal
          form={formBuilderForm}
          onClose={closeFormBuilderAndApplyChanges}
          onUpdateForm={handleUpdateFormBuilderForm}
          onUpdateField={handleUpdateFormBuilderField}
          onDeleteField={handleDeleteFormBuilderField}
          onMoveField={handleMoveFormBuilderField}
        />
      ) : null}
    </div>
  );
}
