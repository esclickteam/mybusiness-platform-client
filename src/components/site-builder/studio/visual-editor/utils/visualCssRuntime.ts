import type { AnimationPresetValue, StylePatch } from "../../types";
import type { VisualAnimationMap, VisualStyleMap } from "./visualData";
import { selectorForVisualElement } from "./visualSelectors";

export function normalizeStyle(style: StylePatch): StylePatch {
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

export function cssPropertyName(key: string) {
  if (key.startsWith("--")) return key;

  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function cssValue(value: string | number) {
  if (typeof value === "number") return String(value);

  return String(value || "");
}

export function stylePatchToCss(style: StylePatch) {
  return Object.entries(style || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `  ${cssPropertyName(key)}: ${cssValue(value as string | number)} !important;`,
    )
    .join("\n");
}

export function getAnimationCssValue(animation: AnimationPresetValue | string) {
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

export function buildVisualRuntimeCss(
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

[data-visual-template-canvas="true"] {
  min-height: 100%;
  overflow: visible;
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

.visual-editor-scroll-area {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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

    chunks.push(
      `${selectorForVisualElement(elementId)} {\n  animation: ${animationCss} !important;\n}`,
    );
  });

  if (hoveredElementId) {
    chunks.push(
      `${selectorForVisualElement(hoveredElementId)} {\n  outline: 1px dashed rgba(37, 99, 235, 0.55) !important;\n  outline-offset: 2px !important;\n}`,
    );
  }

  if (selectedElementId) {
    chunks.push(
      `${selectorForVisualElement(selectedElementId)} {\n  outline: 3px solid rgba(124, 58, 237, 0.92) !important;\n  outline-offset: 5px !important;\n}`,
    );
  }

  return chunks.join("\n\n");
}