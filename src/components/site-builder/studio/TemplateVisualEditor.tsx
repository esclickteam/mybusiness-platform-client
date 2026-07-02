import React from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Monitor,
  Save,
  Smartphone,
  Tablet,
} from "lucide-react";

import StudioSidebar from "./StudioSidebar";
import VisualInspector, {
  type VisualEditableElementType,
  type VisualSelectedElement,
} from "./VisualInspector";

import type {
  ActiveStudioPanel,
  AnimationPresetValue,
  InspectorTab,
  PageTemplate,
  StudioSitePage,
  StudioSitePageType,
  StylePatch,
  ThemePalette,
} from "./types";

import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";

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

  const [activeInspectorTab, setActiveInspectorTab] =
    React.useState<InspectorTab>("design");

  const [activePageId, setActivePageId] = React.useState(
    renderer.pages?.[0]?.id || "home",
  );
  const [device, setDevice] = React.useState<VisualDeviceMode>("desktop");
  const [previewOnly, setPreviewOnly] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState("");
  const [activePanel, setActivePanel] = React.useState<ActiveStudioPanel>("pages");
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

    setActiveInspectorTab(elementType === "image" ? "settings" : "design");

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

  const sidebarWidthClass = activePanel
    ? "grid-cols-[522px_minmax(760px,1fr)_560px]"
    : "grid-cols-[96px_minmax(760px,1fr)_560px]";

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

      <div
        className={[
          "grid min-h-0 flex-1 transition-[grid-template-columns] duration-300",
          previewOnly
            ? "grid-cols-[0px_minmax(0,1fr)_0px]"
            : sidebarWidthClass,
        ].join(" ")}
      >
        <StudioSidebar
          activePanel={previewOnly ? null : activePanel}
          setActivePanel={setActivePanel}
          pages={visualPages}
          activePageId={activePageId}
          activePageSections={activePageSections}
          onSelectPage={(pageId) => {
            setActivePageId(pageId);
            setPreviewOnly(false);
          }}
          onAddPage={() => showNotAvailableYet("יצירת עמוד חדש")}
          onUpdatePageTitle={() => showNotAvailableYet("עריכת שם עמוד")}
          onSelectSection={selectSection}
          onDeleteSection={() => showNotAvailableYet("מחיקת סקשן")}
          onDuplicateSection={() => showNotAvailableYet("שכפול סקשן")}
          onMoveSectionUp={() => showNotAvailableYet("הזזת סקשן למעלה")}
          onMoveSectionDown={() => showNotAvailableYet("הזזת סקשן למטה")}
          onOpenSectionsPanel={(kind) => {
            setActivePanel("sections");
            if (kind) setSidebarMessage(`פתיחת וריאציות עבור ${kind}`);
          }}
          onAddHtml={() => showNotAvailableYet("הוספת HTML")}
          onApplyTemplate={(_template: PageTemplate) =>
            showNotAvailableYet("החלפת תבנית עמוד")
          }
          onApplyPalette={(_palette: ThemePalette) =>
            showNotAvailableYet("ערכת עיצוב")
          }
          onOpenMedia={() => showNotAvailableYet("מנהל מדיה")}
        />

        <main className="min-h-0 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff)] p-5" onScroll={() => updateSelectionBox()}>
          <div className="mx-auto flex min-h-full justify-center">
            <div
              className={[
                "min-h-full overflow-hidden bg-white shadow-[0_24px_90px_rgba(15,23,42,0.16)] transition-all duration-300",
                device === "desktop"
                  ? "w-full max-w-none rounded-[26px]"
                  : "rounded-[32px] border-[10px] border-slate-900",
              ].join(" ")}
              style={{
                width: getDeviceWidth(device),
              }}
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

        <aside
          className={[
            "h-full min-h-0 min-w-[560px] overflow-hidden border-r border-slate-200 bg-white transition-opacity",
            previewOnly ? "pointer-events-none opacity-0" : "opacity-100",
          ].join(" ")}
          data-visual-inspector-root="true"
        >
          <VisualInspector
            activeTab={activeInspectorTab}
            setActiveTab={setActiveInspectorTab}
            selectedElement={selectedElement}
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
          />
        </aside>
      </div>
    </div>
  );
}
