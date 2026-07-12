import type {
  AnimationPresetValue,
  StylePatch,
} from "../../types";

import type {
  VisualAnimationMap,
  VisualStyleMap,
} from "./visualData";

import { selectorForVisualElement } from "./visualSelectors";

const ANIMATION_PRESETS: Record<string, string> = {
  "fade-up":
    "bizuplyVisualFadeUp 680ms cubic-bezier(0.22,1,0.36,1) both",
  "fade-in":
    "bizuplyVisualFadeIn 620ms ease both",
  "zoom-in":
    "bizuplyVisualZoomIn 620ms cubic-bezier(0.22,1,0.36,1) both",
  "slide-right":
    "bizuplyVisualSlideRight 650ms cubic-bezier(0.22,1,0.36,1) both",
  "slide-left":
    "bizuplyVisualSlideLeft 650ms cubic-bezier(0.22,1,0.36,1) both",
  "blur-reveal":
    "bizuplyVisualBlurReveal 760ms cubic-bezier(0.22,1,0.36,1) both",
  "float-soft":
    "bizuplyVisualFloatSoft 4s ease-in-out infinite",
  "pulse-soft":
    "bizuplyVisualPulseSoft 3s ease-in-out infinite",
  "gradient-flow":
    "bizuplyVisualGradientFlow 6s ease-in-out infinite",
  "marquee-left":
    "bizuplyVisualMarqueeLeft 16s linear infinite",
  "ken-burns":
    "bizuplyVisualKenBurns 10s ease-in-out infinite alternate",
  "mesh-drift":
    "bizuplyVisualMeshDrift 8s ease-in-out infinite alternate",
  "button-shine":
    "bizuplyVisualButtonShine 3.6s ease-in-out infinite",
  "hover-lift":
    "bizuplyVisualHoverLift 4s ease-in-out infinite",
  "orbit":
    "bizuplyVisualOrbit 6s linear infinite",
  "pulse-ring":
    "bizuplyVisualPulseRing 2.2s ease-out infinite",
  "shimmer":
    "bizuplyVisualShimmer 4s linear infinite",
  "bounce-soft":
    "bizuplyVisualBounceSoft 2.8s ease-in-out infinite",
};

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function normalizeStyle(style: StylePatch): StylePatch {
  const next: StylePatch = {};

  Object.entries(style || {}).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    const normalizedKey = key.includes("-")
      ? key.replace(
          /-([a-z])/g,
          (_, letter: string) => letter.toUpperCase(),
        )
      : key;

    (next as Record<string, any>)[normalizedKey] = value;
  });

  return next;
}

export function cssPropertyName(key: string) {
  if (key.startsWith("--")) return key;

  return key.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  );
}

export function cssValue(value: string | number | boolean) {
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";

  return String(value || "").trim();
}

export function stylePatchToCss(style: StylePatch) {
  if (!isPlainObject(style)) return "";

  const normalized = new Map<string, string>();

  Object.entries(style).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    const property = cssPropertyName(key);
    const serialized = cssValue(
      value as string | number | boolean,
    );

    if (!serialized) return;

    normalized.set(property, serialized);
  });

  return Array.from(normalized.entries())
    .map(
      ([property, value]) =>
        `  ${property}: ${value} !important;`,
    )
    .join("\n");
}

export function getAnimationCssValue(
  animation: AnimationPresetValue | string,
) {
  const clean = String(animation || "").trim();

  if (!clean || clean === "none") return "";

  return ANIMATION_PRESETS[clean] || clean;
}

function buildElementRule(
  elementId: string,
  body: string,
) {
  if (!elementId || !body) return "";

  return `${selectorForVisualElement(elementId)} {\n${body}\n}`;
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
  from {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bizuplyVisualZoomIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bizuplyVisualSlideRight {
  from {
    opacity: 0;
    transform: translate3d(34px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualSlideLeft {
  from {
    opacity: 0;
    transform: translate3d(-34px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualBlurReveal {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translate3d(0, 18px, 0);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualFloatSoft {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -14px, 0);
  }
}

@keyframes bizuplyVisualPulseSoft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.78;
    transform: scale(1.025);
  }
}

@keyframes bizuplyVisualGradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes bizuplyVisualMarqueeLeft {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-48%, 0, 0); }
}

@keyframes bizuplyVisualKenBurns {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

@keyframes bizuplyVisualMeshDrift {
  0% { filter: hue-rotate(0deg) saturate(1); transform: scale(1); }
  100% { filter: hue-rotate(18deg) saturate(1.12); transform: scale(1.025); }
}

@keyframes bizuplyVisualButtonShine {
  0%, 75%, 100% { filter: brightness(1); transform: translateY(0); }
  82% { filter: brightness(1.18); transform: translateY(-2px); }
}

@keyframes bizuplyVisualHoverLift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes bizuplyVisualOrbit {
  from { transform: rotate(0deg) translateX(94px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(94px) rotate(-360deg); }
}

@keyframes bizuplyVisualPulseRing {
  0% { opacity: .8; transform: scale(.82); }
  80%, 100% { opacity: 0; transform: scale(1.55); }
}

@keyframes bizuplyVisualShimmer {
  from { background-position: 140% 0; }
  to { background-position: -140% 0; }
}

@keyframes bizuplyVisualBounceSoft {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-2deg); }
}

@media (prefers-reduced-motion: reduce) {
  [data-visual-edit-id] {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}

[data-visual-template-canvas="true"] {
  min-height: 100%;
  overflow: visible;
  isolation: isolate;
}

[data-visual-template-canvas="true"] [data-visual-editable="true"] {
  box-sizing: border-box;
  outline-offset: 2px;
}

[data-visual-template-canvas="true"] [data-visual-editable="true"] * {
  pointer-events: auto;
}

[data-visual-template-canvas="true"]
[data-visual-editable="true"]
[data-visual-hovered="true"] {
  outline: 1px dashed rgba(37, 99, 235, 0.55) !important;
  outline-offset: 2px !important;
}

[data-visual-template-canvas="true"]
[data-visual-editable="true"]
[data-visual-selected="true"] {
  outline: none !important;
  box-shadow: none !important;
}

[data-visual-template-canvas="true"]
[data-visual-inline-editing="true"] {
  cursor: text !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  outline: 2px solid rgba(37, 99, 235, 0.72) !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.10) !important;
  white-space: pre-wrap !important;
}

[data-visual-template-canvas="true"]
[data-visual-inline-editing="true"] * {
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

[data-visual-template-canvas="true"]
[data-visual-deleted="true"] {
  display: none !important;
}

[data-visual-template-canvas="true"]
[data-visual-hidden="true"] {
  visibility: hidden !important;
  pointer-events: none !important;
}

[data-visual-template-canvas="true"]
[data-visual-locked="true"] {
  cursor: not-allowed !important;
}

.visual-editor-scroll-area {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (prefers-reduced-motion: reduce) {
  [data-visual-template-canvas="true"]
  [data-visual-edit-id] {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`,
  ];

  Object.entries(styles || {}).forEach(
    ([elementId, style]) => {
      const css = stylePatchToCss(style);

      if (!css) return;

      chunks.push(buildElementRule(elementId, css));
    },
  );

  Object.entries(animations || {}).forEach(
    ([elementId, animation]) => {
      const animationCss = getAnimationCssValue(animation);

      if (!animationCss) {
        chunks.push(
          buildElementRule(
            elementId,
            "  animation: none !important;",
          ),
        );
        return;
      }

      chunks.push(
        buildElementRule(
          elementId,
          `  animation: ${animationCss} !important;`,
        ),
      );
    },
  );

  if (hoveredElementId) {
    chunks.push(
      buildElementRule(
        hoveredElementId,
        [
          "  outline: 1px dashed rgba(37, 99, 235, 0.55) !important;",
          "  outline-offset: 2px !important;",
        ].join("\n"),
      ),
    );
  }

  if (selectedElementId) {
    chunks.push(
      buildElementRule(
        selectedElementId,
        [
          "  outline: 3px solid rgba(124, 58, 237, 0.92) !important;",
          "  outline-offset: 5px !important;",
        ].join("\n"),
      ),
    );
  }

  return chunks.filter(Boolean).join("\n\n");
}
