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
  }
>;

const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_CONTENT_KEY = "__content";

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

  if (animation === "fade-up") return "bizuplyVisualFadeUp 680ms ease both";
  if (animation === "zoom-in") return "bizuplyVisualZoomIn 620ms ease both";
  if (animation === "slide-right") return "bizuplyVisualSlideRight 650ms ease both";
  if (animation === "slide-left") return "bizuplyVisualSlideLeft 650ms ease both";
  if (animation === "blur-reveal") return "bizuplyVisualBlurReveal 760ms ease both";
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
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bizuplyVisualZoomIn {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bizuplyVisualSlideRight {
  from { opacity: 0; transform: translateX(34px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bizuplyVisualSlideLeft {
  from { opacity: 0; transform: translateX(-34px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bizuplyVisualBlurReveal {
  from { opacity: 0; filter: blur(14px); transform: translateY(18px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}

@keyframes bizuplyVisualFloatSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@keyframes bizuplyVisualPulseSoft {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.78; transform: scale(1.025); }
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
  });
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
  selectedElement: VisualSelectedElement | null;
  styles: VisualStyleMap;
  onUpdateText: (elementId: string, value: string) => void;
  onUpdateImage: (elementId: string, payload: { src?: string; alt?: string }) => void;
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

function VisualTopToolbar({ selectedElement, styles, onUpdateText, onUpdateImage, onApplyStyle, onResetStyle, onDuplicate, onDelete, onBringForward, onSendBackward, onSetAnimation, onClearAnimation, onClearSelection }: VisualTopToolbarProps) {
  const [textValue, setTextValue] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [showImageBox, setShowImageBox] = React.useState(false);

  React.useEffect(() => {
    setTextValue(selectedElement?.textValue || "");
    setImageUrl(selectedElement?.imageValue || "");
    setImageAlt(selectedElement?.altValue || "");
    setShowImageBox(false);
  }, [selectedElement?.id, selectedElement?.textValue, selectedElement?.imageValue, selectedElement?.altValue]);

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
            <input value={textValue} onChange={(event) => setTextValue(event.target.value)} onBlur={() => onUpdateText(id, textValue)} onKeyDown={(event) => { if (event.key === "Enter") onUpdateText(id, textValue); }} placeholder="עריכת טקסט..." className="h-10 w-[240px] shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
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
            <MiniSelect value={objectFit} onChange={(value) => apply({ objectFit: value })} className="w-[118px]" title="התאמה">
              <option value="">התאמה</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </MiniSelect>
            <MiniButton title="החלפת תמונה" active={showImageBox} onClick={() => setShowImageBox((value) => !value)}><ImageIcon className="h-4 w-4" /></MiniButton>
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

      {showImageBox ? (
        <div className="pointer-events-auto absolute right-1/2 top-[66px] flex w-[min(760px,calc(100vw-32px))] translate-x-1/2 items-center gap-2 rounded-[18px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><ImageIcon className="h-4 w-4" /></div>
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="כתובת תמונה..." className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
          <input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="Alt" className="h-11 w-[160px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
          <button type="button" onClick={() => onUpdateImage(id, { src: imageUrl.trim(), alt: imageAlt.trim() })} className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700">החלף</button>
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

  const [selectedSectionId, setSelectedSectionId] = React.useState(
    sections[0]?.id || "",
  );
  const [selectedElement, setSelectedElement] =
    React.useState<VisualSelectedElement | null>(null);
  const [hoveredElementId, setHoveredElementId] = React.useState("");

  const canvasRef = React.useRef<HTMLDivElement | null>(null);
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

  const visualStyles = React.useMemo(() => readVisualStyles(templateData), [templateData]);
  const visualAnimations = React.useMemo(
    () => readVisualAnimations(templateData),
    [templateData],
  );

  const selectedSection = React.useMemo(() => {
    return (
      sections.find((section) => section.id === selectedSectionId) ||
      sections[0] ||
      null
    );
  }, [sections, selectedSectionId]);

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

  const activePageSections = React.useMemo<VisualPageSection[]>(() => {
    return sections.map((section) => ({
      id: section.id,
      title: section.label,
      kind: section.id,
      tagName: getSectionTagName(section.id),
    }));
  }, [sections]);

  React.useEffect(() => {
    setTemplateData(baseData);
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
    if (!sidebarMessage) return;

    const timer = window.setTimeout(() => setSidebarMessage(""), 2600);

    return () => window.clearTimeout(timer);
  }, [sidebarMessage]);

  React.useEffect(() => {
    const root = canvasRef.current;

    if (!root) return;

    const stamp = () => {
      stampAutoEditableElements(root);
      applyVisualContentToDom(root, readVisualContent(templateData));
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
  }, [activePageId, previewOnly, templateData]);

  React.useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    const content = readVisualContent(templateData);
    window.requestAnimationFrame(() => applyVisualContentToDom(root, content));
  }, [templateData]);

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

      return {
        ...current,
        [sectionId]: {
          ...currentSection,
          [fieldKey]: value,
        },
      };
    });
  }

  async function handleSave() {
    const updatedAt = new Date().toISOString();

    setSaving(true);

    try {
      const payload = {
        templateKey: renderer.key,
        editorMode: "visual-react" as const,
        data: templateData,
        updatedAt,
      };

      await onSave?.(payload);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `bizuply-visual-template-${businessId || renderer.key}`,
          JSON.stringify(payload),
        );
      }

      setSavedAt(updatedAt);
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
    if (!selectedElement?.id) {
      setSelectionBox(null);
      return;
    }

    window.requestAnimationFrame(() => updateSelectionBox(selectedElement.id));
  }, [selectedElement?.id, visualStyles, activePageId, device]);


  function handleCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (previewOnly || !selectedElement?.id || !canFreeTransformElement(selectedElement)) return;

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

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

    const target = event.target as HTMLElement | null;
    const root = canvasRef.current;

    if (!target || !root) return;

    stampAutoEditableElements(root);

    const editNode = findBestEditableNode(target, root);

    if (!editNode || isIgnoredVisualNode(editNode)) return;

    event.preventDefault();
    event.stopPropagation();

    selectVisualNode(editNode);
    setPreviewOnly(false);
  }

  function handleCanvasMouseMove(event: React.MouseEvent<HTMLDivElement>) {
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

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "שומר..." : "שמירה"}
          </button>
        </div>
      </header>

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
            onUpdateText={handleUpdateVisualText}
            onUpdateImage={handleUpdateVisualImage}
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
                onMouseMoveCapture={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              >
                <style>{visualRuntimeCss}</style>

                <TemplateComponent
                  initialPage={activePageId}
                  isStudioStatic={false}
                  isVisualEditor
                  templateData={templateData}
                  data={templateData}
                  studioData={templateData}
                />

                {!previewOnly && selectedElement && selectionBox ? (
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
    </div>
  );
}
