import React, { useEffect, useMemo, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Copy,
  CornerUpLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Italic,
  Link2,
  Lock,
  MoveDown,
  MoveUp,
  PaintBucket,
  Palette,
  PanelTop,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Underline,
  Unlock,
  Upload,
  X,
  ClipboardList,
} from "lucide-react";

import type { StylePatch } from "../types";
import StudioFontPicker from "../StudioFontPicker";
import { resolveFormContext } from "./utils/visualForms";

type ElementKind = "text" | "image" | "button" | "section" | "general";

type VisualFloatingToolbarProps = {
  editor: any;
};

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "40px",
  "48px",
  "56px",
  "64px",
  "72px",
  "88px",
  "96px",
];

const RADIUS_OPTIONS = [
  { label: "פינות", value: "" },
  { label: "0", value: "0px" },
  { label: "8", value: "8px" },
  { label: "16", value: "16px" },
  { label: "28", value: "28px" },
  { label: "עגול", value: "999px" },
];

const SHADOW_OPTIONS = [
  { label: "צל", value: "" },
  { label: "ללא", value: "none" },
  { label: "עדין", value: "0 12px 30px rgba(15,23,42,0.12)" },
  { label: "בינוני", value: "0 22px 60px rgba(15,23,42,0.18)" },
  { label: "חזק", value: "0 35px 100px rgba(15,23,42,0.25)" },
];

const ANIMATION_OPTIONS = [
  { label: "תנועה", value: "" },
  { label: "ללא", value: "none" },
  { label: "Fade Up", value: "fade-up" },
  { label: "Fade In", value: "fade-in" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Slide Right", value: "slide-right" },
  { label: "Slide Left", value: "slide-left" },
  { label: "Blur Reveal", value: "blur-reveal" },
  { label: "Float", value: "float-soft" },
  { label: "Pulse", value: "pulse-soft" },
  { label: "Gradient Flow", value: "gradient-flow" },
  { label: "Marquee", value: "marquee-left" },
  { label: "Ken Burns", value: "ken-burns" },
  { label: "Mesh Drift", value: "mesh-drift" },
  { label: "Button Shine", value: "button-shine" },
  { label: "Hover Lift", value: "hover-lift" },
  { label: "Orbit", value: "orbit" },
  { label: "Pulse Ring", value: "pulse-ring" },
  { label: "Shimmer", value: "shimmer" },
  { label: "Bounce Soft", value: "bounce-soft" },
];

function normalizeHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "#";

  if (
    clean.startsWith("#") ||
    clean.startsWith("/") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:") ||
    clean.startsWith("sms:") ||
    clean.startsWith("http://") ||
    clean.startsWith("https://")
  ) {
    return clean;
  }

  return `https://${clean}`;
}

function normalizeColor(value: unknown, fallback: string) {
  const clean = String(value || "").trim();

  if (/^#[0-9a-f]{6}$/i.test(clean)) return clean;
  if (/^#[0-9a-f]{3}$/i.test(clean)) {
    return `#${clean
      .slice(1)
      .split("")
      .map((character) => character + character)
      .join("")}`;
  }

  const rgbaMatch = clean.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );

  if (rgbaMatch) {
    const [, red, green, blue] = rgbaMatch;

    return `#${[red, green, blue]
      .map((part) =>
        Math.max(0, Math.min(255, Number(part)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  }

  return fallback;
}

function isTransparentColor(value: unknown) {
  const clean = String(value || "")
    .replace(/\s+/g, "")
    .toLowerCase();

  return (
    !clean ||
    clean === "transparent" ||
    clean === "rgba(0,0,0,0)" ||
    clean === "hsla(0,0%,0%,0)"
  );
}

function getStyleValue(
  style: Record<string, any>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = String(style?.[key] ?? "").trim();
    if (value) return value;
  }

  return fallback;
}

function parseGradientColors(value: unknown) {
  const source = String(value || "").trim();

  if (!/gradient\(/i.test(source)) return [];

  const matches = source.match(
    /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi,
  );

  return (matches || [])
    .map((color) => normalizeColor(color, ""))
    .filter(Boolean)
    .slice(0, 5);
}

function parseGradientAngle(value: unknown, fallback = 90) {
  const source = String(value || "");
  const match = source.match(/linear-gradient\(\s*(-?\d+(?:\.\d+)?)deg/i);

  if (!match) return fallback;

  const number = Number(match[1]);

  if (!Number.isFinite(number)) return fallback;

  return Math.max(0, Math.min(360, Math.round(number)));
}

function buildLinearGradient(colors: string[], angle: number) {
  const safeColors = colors
    .map((color) => normalizeColor(color, ""))
    .filter(Boolean)
    .slice(0, 5);

  if (safeColors.length < 2) return "";

  const safeAngle = Math.max(0, Math.min(360, Number(angle) || 0));

  return `linear-gradient(${safeAngle}deg, ${safeColors.join(", ")})`;
}

function isStyleActive(
  style: Record<string, any>,
  keys: string[],
  values: string[],
) {
  return keys.some((key) => {
    const current = String(style?.[key] || "").toLowerCase();

    return values.some((value) => current === value.toLowerCase());
  });
}

function getElementId(element: any) {
  return String(
    element?.id ||
      element?.elementId ||
      element?.visualId ||
      element?.key ||
      "",
  ).trim();
}

function getElementNode(element: any): HTMLElement | null {
  const node =
    element?.node ||
    element?.domNode ||
    element?.element ||
    element?.target ||
    null;

  return node instanceof HTMLElement ? node : null;
}

function resolveStyleTarget(element: any, elementId: string) {
  const node = getElementNode(element);

  if (!node) return elementId;

  if (node.getAttribute("data-visual-no-background") === "true") {
    const backgroundLayer = node.closest<HTMLElement>(
      "[data-visual-background-layer='true']",
    );

    if (backgroundLayer) {
      return (
        backgroundLayer.getAttribute("data-visual-edit-id") || elementId
      );
    }

    const sectionNode = node.closest<HTMLElement>(
      '[data-visual-edit-type="section"]',
    );

    if (sectionNode) {
      return sectionNode.getAttribute("data-visual-edit-id") || elementId;
    }
  }

  return elementId;
}

function getTagName(element: any) {
  const explicit = String(element?.tagName || "").toLowerCase();

  if (explicit) return explicit;

  return String(getElementNode(element)?.tagName || "").toLowerCase();
}

function normalizeElementKind(value: unknown): ElementKind | "" {
  const clean = String(value || "").trim().toLowerCase();

  if (["text", "heading", "paragraph"].includes(clean)) return "text";
  if (["image", "video", "media", "raw"].includes(clean)) return "image";
  if (
    [
      "button",
      "link",
      "control",
      "social-link",
      "phone-link",
      "email-link",
    ].includes(clean)
  ) {
    return "button";
  }
  if (clean === "section") return "section";
  if (["box", "container", "line", "icon", "general"].includes(clean)) {
    return "general";
  }

  return "";
}

function getElementKind(element: any): ElementKind {
  const explicit =
    normalizeElementKind(element?.type) ||
    normalizeElementKind(element?.elementType) ||
    normalizeElementKind(element?.kind);

  if (explicit) return explicit;

  const node = getElementNode(element);

  const nodeType = normalizeElementKind(
    node?.getAttribute("data-visual-edit-type") ||
      node?.getAttribute("data-visual-type") ||
      node?.getAttribute("data-edit-type") ||
      "",
  );

  if (nodeType) return nodeType;

  const tagName = getTagName(element);

  if (["img", "video", "source", "picture"].includes(tagName)) {
    return "image";
  }

  if (
    ["a", "button", "input", "textarea", "select"].includes(tagName)
  ) {
    return "button";
  }

  if (
    [
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
      "label",
      "em",
      "b",
      "i",
    ].includes(tagName)
  ) {
    return "text";
  }

  if (
    [
      "section",
      "article",
      "header",
      "footer",
      "main",
      "nav",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  return "general";
}

function getElementText(element: any) {
  if (typeof element?.text === "string") return element.text;

  const node = getElementNode(element);

  if (node instanceof HTMLInputElement) {
    return node.value || node.placeholder || "";
  }

  if (node instanceof HTMLTextAreaElement) {
    return node.value || node.placeholder || node.textContent || "";
  }

  return String(node?.textContent || "").replace(/\s+/g, " ").trim();
}

function getElementHref(element: any) {
  const direct = String(element?.href || element?.linkValue || "").trim();

  if (direct) return direct;

  const node = getElementNode(element);

  const link =
    node instanceof HTMLAnchorElement
      ? node
      : (node?.closest?.("a") as HTMLAnchorElement | null) ||
        (node?.querySelector?.("a") as HTMLAnchorElement | null);

  return String(
    link?.getAttribute("href") ||
      node?.getAttribute("data-visual-link-href") ||
      node?.getAttribute("data-link-url") ||
      "",
  ).trim();
}

function getElementSrc(element: any) {
  const direct = String(
    element?.secureUrl ||
      element?.secure_url ||
      element?.url ||
      element?.src ||
      "",
  ).trim();

  if (direct) return direct;

  const node = getElementNode(element);

  if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement) {
    return String(
      node.getAttribute("data-visual-current-src") ||
        node.getAttribute("src") ||
        "",
    ).trim();
  }

  const mediaNode = node?.querySelector?.(
    "img, video, source",
  ) as HTMLElement | null;

  return String(
    mediaNode?.getAttribute("data-visual-current-src") ||
      mediaNode?.getAttribute("src") ||
      "",
  ).trim();
}

function getElementAlt(element: any) {
  const direct = String(element?.alt || "").trim();

  if (direct) return direct;

  const node = getElementNode(element);

  if (node instanceof HTMLImageElement) {
    return String(node.getAttribute("alt") || "").trim();
  }

  const image = node?.querySelector?.("img") as HTMLImageElement | null;

  return String(image?.getAttribute("alt") || "").trim();
}

function ToolbarDivider() {
  return <div className="h-7 w-px shrink-0 bg-slate-200" />;
}

function ToolbarButton({
  title,
  active,
  danger,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!disabled) onClick();
      }}
      className={[
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition",
        active
          ? "bg-slate-950 text-white shadow-sm"
          : danger
            ? "text-rose-600 hover:bg-rose-50"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SelectControl({
  value,
  onChange,
  children,
  className = "",
  title,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <label
      title={title}
      onMouseDown={(event) => event.stopPropagation()}
      className={[
        "relative inline-flex h-9 shrink-0 items-center rounded-xl bg-transparent text-sm font-bold text-slate-900 transition hover:bg-slate-100",
        className,
      ].join(" ")}
    >
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-xl bg-transparent py-0 pl-7 pr-2 text-sm font-bold outline-none"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute left-2 h-4 w-4 text-slate-500" />
    </label>
  );
}

function ColorControl({
  title,
  value,
  fallback,
  onChange,
  children,
}: {
  title: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const safeValue = normalizeColor(value, fallback);

  return (
    <label
      title={title}
      onMouseDown={(event) => event.stopPropagation()}
      className="relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
    >
      {children}

      <span
        className="absolute bottom-1 h-3.5 w-3.5 rounded-full border border-white shadow"
        style={{ background: safeValue }}
      />

      <input
        type="color"
        value={safeValue}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

function GradientColorPicker({
  colors,
  angle,
  target,
  onColorsChange,
  onAngleChange,
  onApply,
  onClear,
  onClose,
}: {
  colors: string[];
  angle: number;
  target: "text" | "background";
  onColorsChange: (colors: string[]) => void;
  onAngleChange: (angle: number) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const gradient = buildLinearGradient(colors, angle);

  function updateColor(index: number, value: string) {
    onColorsChange(
      colors.map((color, colorIndex) =>
        colorIndex === index ? value : color,
      ),
    );
  }

  function addColor() {
    if (colors.length >= 5) return;

    const fallback = colors[colors.length - 1] || "#111827";
    onColorsChange([...colors, fallback]);
  }

  function removeColor(index: number) {
    if (colors.length <= 2) return;

    onColorsChange(colors.filter((_, colorIndex) => colorIndex !== index));
  }

  return (
    <div
      className="pointer-events-auto absolute right-1/2 top-[66px] z-[2147483002] w-[min(720px,calc(100vw-32px))] translate-x-1/2 rounded-[22px] border border-slate-200 bg-white/95 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.2)] backdrop-blur-2xl"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950">
            {target === "text" ? "מיקס צבעים לטקסט" : "מיקס צבעים לרקע"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            אפשר לבחור בין 2 ל־5 צבעים ולשנות את זווית המעבר.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className="mt-4 h-16 rounded-2xl border border-slate-200 shadow-inner"
        style={{ background: gradient || "#f8fafc" }}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {colors.map((color, index) => (
          <div
            key={`${index}-${color}`}
            className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5"
          >
            <input
              type="color"
              value={normalizeColor(color, "#111827")}
              onChange={(event) => updateColor(index, event.target.value)}
              className="h-9 w-11 cursor-pointer rounded-xl border-0 bg-transparent p-0"
              title={`צבע ${index + 1}`}
            />

            <span className="min-w-[70px] px-1 text-xs font-black text-slate-600" dir="ltr">
              {normalizeColor(color, "#111827")}
            </span>

            {colors.length > 2 ? (
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50"
                title="הסרת צבע"
              >
                <Minus className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}

        <button
          type="button"
          disabled={colors.length >= 5}
          onClick={addColor}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 px-4 text-sm font-black text-violet-700 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          הוספת צבע
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_110px] sm:items-center">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          זווית: {angle}°
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(event) => onAngleChange(Number(event.target.value))}
            className="w-full accent-violet-600"
          />
        </label>

        <input
          type="number"
          min="0"
          max="360"
          value={angle}
          onChange={(event) => onAngleChange(Number(event.target.value))}
          className="h-11 rounded-2xl border border-slate-200 px-3 text-center text-sm font-black outline-none focus:border-violet-300"
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onClear}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
        >
          הסרת מיקס
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={!gradient}
          className="h-11 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-sm hover:bg-violet-700 disabled:opacity-40"
        >
          החלת המיקס
        </button>
      </div>
    </div>
  );
}

export default function VisualFloatingToolbar({
  editor,
}: VisualFloatingToolbarProps) {
  const element = editor?.selectedElement || null;

  const [textValue, setTextValue] = useState("");
  const [hrefValue, setHrefValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTargetMode, setLinkTargetMode] = useState<
    "url" | "section" | "page"
  >("url");

  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  const [gradientOpen, setGradientOpen] = useState(false);
  const [gradientTarget, setGradientTarget] =
    useState<"text" | "background">("text");
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#111827",
    "#ff7a00",
  ]);
  const [gradientAngle, setGradientAngle] = useState(90);

  const elementId = getElementId(element);
  const kind = useMemo(() => getElementKind(element), [element]);

  const canEditForm = useMemo(() => {
    const node = getElementNode(element);
    if (!node) return false;

    const root = editor?.canvasRef?.current || null;
    return Boolean(resolveFormContext(node, root));
  }, [element, editor?.canvasRef]);

  const selectedContent = useMemo(
    () =>
      elementId
        ? (editor?.content?.[elementId] || {})
        : {},
    [editor?.content, elementId],
  );

  const linkTargets = useMemo(
    () => editor?.getLinkTargets?.() || { pages: [], sections: [] },
    [editor, linkOpen, elementId],
  );

  const selectedVisualType = String(
    element?.type ||
      element?.elementType ||
      getElementNode(element)?.getAttribute(
        "data-visual-edit-type",
      ) ||
      "",
  ).toLowerCase();

  const selectedPlatform = String(
    selectedContent?.platform || "",
  ).toLowerCase();

  const style = useMemo(() => {
    if (!elementId) return {};

    return {
      ...(element?.computedStyle || {}),
      ...(editor?.styles?.[elementId] || {}),
    } as Record<string, any>;
  }, [editor?.styles, element?.computedStyle, elementId]);

  const locked = Boolean(editor?.locked?.[elementId]);
  const hidden = Boolean(editor?.hidden?.[elementId]);

  const currentFont = String(
    style["font-family"] || style.fontFamily || "",
  );
  const currentFontSize = String(
    style["font-size"] || style.fontSize || "",
  );
  const currentGradient = getStyleValue(style, [
    "background-image",
    "backgroundImage",
  ]);

  const currentGradientColors = parseGradientColors(currentGradient);

  const currentTextFill = getStyleValue(style, [
    "-webkit-text-fill-color",
    "WebkitTextFillColor",
    "webkitTextFillColor",
  ]);

  const currentRawColor = getStyleValue(style, [
    "color",
    "rawColor",
  ]);

  const currentColor =
    !isTransparentColor(currentTextFill)
      ? currentTextFill
      : !isTransparentColor(currentRawColor)
        ? currentRawColor
        : currentGradientColors[0] || "#111827";

  const currentBackground = getStyleValue(
    style,
    ["background-color", "backgroundColor"],
    currentGradientColors[0] || "#ffffff",
  );

  const currentBackgroundClip = getStyleValue(style, [
    "background-clip",
    "backgroundClip",
    "-webkit-background-clip",
    "WebkitBackgroundClip",
    "webkitBackgroundClip",
  ]);

  const hasTextGradient =
    /gradient\(/i.test(currentGradient) &&
    (currentBackgroundClip === "text" || isTransparentColor(currentTextFill));

  const hasBackgroundGradient =
    /gradient\(/i.test(currentGradient) && !hasTextGradient;
  const currentRadius = String(
    style["border-radius"] || style.borderRadius || "",
  );
  const currentShadow = String(
    style["box-shadow"] || style.boxShadow || "",
  );
  const currentObjectFit = String(
    style["object-fit"] || style.objectFit || "",
  );
  const currentAnimation = String(
    editor?.animations?.[elementId] ||
      element?.detectedAnimation?.name ||
      "",
  );

  useEffect(() => {
    if (!element) return;

    setTextValue(getElementText(element));
    setHrefValue(
      String(
        selectedContent?.href ||
          getElementHref(element) ||
          "",
      ),
    );
    setPhoneValue(
      String(
        selectedContent?.phoneNumber ||
          selectedContent?.phone ||
          "",
      ),
    );
    setMessageValue(
      String(selectedContent?.message || ""),
    );
    setEmailValue(
      String(selectedContent?.email || ""),
    );
    setSubjectValue(
      String(selectedContent?.subject || ""),
    );
    setMediaUrl(getElementSrc(element));
    setMediaAlt(getElementAlt(element));
    setLinkOpen(false);
    setMediaOpen(false);
    setGradientOpen(false);

    const selectedGradient = getStyleValue(
      {
        ...(element?.computedStyle || {}),
        ...(editor?.styles?.[elementId] || {}),
      },
      ["background-image", "backgroundImage"],
    );

    const selectedColors = parseGradientColors(selectedGradient);

    if (selectedColors.length >= 2) {
      setGradientColors(selectedColors);
      setGradientAngle(parseGradientAngle(selectedGradient));
    } else {
      const baseColor = normalizeColor(
        String(
          element?.computedStyle?.color ||
            editor?.styles?.[elementId]?.color ||
            "#111827",
        ),
        "#111827",
      );

      setGradientColors([baseColor, "#ff7a00"]);
      setGradientAngle(90);
    }
  }, [
    element,
    elementId,
    editor?.styles,
    selectedContent,
  ]);

  if (!element || !elementId) return null;

  const isTextEditable = kind === "text" || kind === "button";
  const selectedNode = getElementNode(element);
  const blocksBackground =
    selectedNode?.getAttribute("data-visual-no-background") === "true";
  const hasBackground =
    !blocksBackground &&
    (kind === "button" || kind === "section" || kind === "general");
  const hasShape =
    kind === "image" ||
    kind === "button" ||
    kind === "section" ||
    kind === "general";

  function apply(stylePatch: StylePatch) {
    if (!elementId || locked) return;

    const targetId = resolveStyleTarget(element, elementId);
    editor?.applyStyle?.(targetId, stylePatch);
  }

  function openGradient(target: "text" | "background") {
    if (locked) return;

    setGradientTarget(target);

    if (currentGradientColors.length >= 2) {
      setGradientColors(currentGradientColors);
      setGradientAngle(parseGradientAngle(currentGradient));
    } else if (target === "text") {
      setGradientColors([
        normalizeColor(currentColor, "#111827"),
        "#ff7a00",
      ]);
    } else {
      setGradientColors([
        normalizeColor(currentBackground, "#ffffff"),
        "#ff7a00",
      ]);
    }

    setGradientOpen(true);
  }

  function applyGradient() {
    const gradient = buildLinearGradient(
      gradientColors,
      gradientAngle,
    );

    if (!gradient) return;

    if (gradientTarget === "text") {
      apply({
        "background-image": gradient,
        backgroundImage: gradient,
        "background-clip": "text",
        backgroundClip: "text",
        "-webkit-background-clip": "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        "-webkit-text-fill-color": "transparent",
        WebkitTextFillColor: "transparent",
      } as StylePatch);
    } else {
      apply({
        "background-image": gradient,
        backgroundImage: gradient,
        "background-color": "transparent",
        backgroundColor: "transparent",
      } as StylePatch);
    }

    setGradientOpen(false);
  }

  function clearGradient() {
    if (gradientTarget === "text") {
      const fallbackColor =
        gradientColors[0] || normalizeColor(currentColor, "#111827");

      apply({
        "background-image": "none",
        backgroundImage: "none",
        "background-clip": "border-box",
        backgroundClip: "border-box",
        "-webkit-background-clip": "border-box",
        WebkitBackgroundClip: "border-box",
        color: fallbackColor,
        "-webkit-text-fill-color": fallbackColor,
        WebkitTextFillColor: fallbackColor,
      } as StylePatch);
    } else {
      apply({
        "background-image": "none",
        backgroundImage: "none",
      } as StylePatch);
    }

    setGradientOpen(false);
  }

  function submitText(value = textValue) {
    if (!elementId || locked) return;

    const nextValue = String(value ?? "");

    setTextValue(nextValue);

    if (typeof editor?.updateText === "function") {
      editor.updateText(elementId, nextValue);
      return;
    }

    editor?.updateInlineText?.(elementId, nextValue);
  }

  function submitHref() {
    if (!elementId || locked) return;

    const normalizePhone = (value: string) => {
      const raw = String(value || "").trim();
      const digits = raw.replace(/\D/g, "");

      if (!digits) return "";
      if (raw.startsWith("+")) return `+${digits}`;
      if (digits.startsWith("0")) {
        return `+972${digits.slice(1)}`;
      }

      return digits;
    };

    let href = normalizeHref(hrefValue);
    let target = "_self";

    if (
      selectedVisualType === "phone-link" ||
      selectedPlatform === "phone"
    ) {
      const phone = normalizePhone(phoneValue);
      href = phone ? `tel:${phone}` : "#";
    } else if (
      selectedVisualType === "email-link" ||
      selectedPlatform === "email"
    ) {
      const email = emailValue.trim();
      const params = new URLSearchParams();

      if (subjectValue.trim()) {
        params.set("subject", subjectValue.trim());
      }

      href = email
        ? `mailto:${email}${
            params.toString()
              ? `?${params.toString()}`
              : ""
          }`
        : "#";
    } else if (selectedPlatform === "whatsapp") {
      const phone = normalizePhone(phoneValue).replace(
        /\D/g,
        "",
      );

      href = phone
        ? `https://wa.me/${phone}${
            messageValue.trim()
              ? `?text=${encodeURIComponent(
                  messageValue.trim(),
                )}`
              : ""
          }`
        : "#";
      target = "_blank";
    } else {
      target = href.startsWith("http") ? "_blank" : "_self";
    }

    setHrefValue(href);

    editor?.updateContent?.(elementId, {
      href,
      target,
      rel:
        target === "_blank"
          ? "noopener noreferrer"
          : "",
      phoneNumber: phoneValue,
      message: messageValue,
      email: emailValue,
      subject: subjectValue,
    });

    editor?.updateLink?.(elementId, {
      href,
      target,
      rel:
        target === "_blank"
          ? "noopener noreferrer"
          : "",
    });

    setLinkOpen(false);
  }

  function submitMediaUrl() {
    if (!elementId || locked) return;

    const src = mediaUrl.trim();

    if (!src) return;

    const mediaType =
      src.includes("/video/upload/") ||
      /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(src)
        ? "video"
        : "image";

    editor?.updateImage?.(elementId, {
      src,
      url: src,
      secureUrl: src,
      alt: mediaAlt.trim(),
      mediaType,
      resourceType: mediaType,
    });

    setMediaOpen(false);
  }

  function openMediaPicker() {
    if (!elementId || locked) return;

    if (typeof editor?.openMediaModal === "function") {
      editor.openMediaModal(elementId, "change");
      setMediaOpen(false);
      return;
    }

    if (typeof editor?.openMediaPicker === "function") {
      void editor.openMediaPicker(elementId);
      setMediaOpen(false);
      return;
    }

    window.alert("העלאת המדיה עדיין לא מחוברת לעורך.");
  }

  function openMediaEditor() {
    if (!elementId || locked) return;

    if (typeof editor?.openMediaModal === "function") {
      editor.openMediaModal(elementId, "edit");
      setMediaOpen(false);
    }
  }

  function setBackgroundImageFromUrl() {
    if (locked) return;

    const src = window.prompt("הדביקי כתובת תמונת רקע", "");

    if (!src?.trim()) return;

    apply({
      backgroundImage: `url("${src.trim()}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    } as StylePatch);
  }

  function uploadBackgroundImage() {
    if (locked) return;

    if (typeof editor?.openBackgroundMediaPicker === "function") {
      void editor.openBackgroundMediaPicker(elementId);
      return;
    }

    window.alert(
      "העלאת תמונת רקע מהמחשב תחובר בשלב המדיה. כרגע אפשר להדביק כתובת תמונה.",
    );
  }

  function setAnimation(value: string) {
    if (!value || locked) return;

    if (value === "none") {
      editor?.clearAnimation?.(elementId);
      return;
    }

    editor?.setAnimation?.(elementId, value);
  }

  function toggleLock() {
    if (typeof editor?.setElementLocked === "function") {
      editor.setElementLocked(elementId, !locked);
      return;
    }

    if (typeof editor?.toggleElementLocked === "function") {
      editor.toggleElementLocked(elementId);
      return;
    }

    window.alert("נעילת אלמנטים תחובר במנוע הפעולות המרכזי.");
  }

  function toggleHidden() {
    if (typeof editor?.setElementHidden === "function") {
      editor.setElementHidden(elementId, !hidden);
      return;
    }

    if (typeof editor?.toggleElementHidden === "function") {
      editor.toggleElementHidden(elementId);
      return;
    }

    window.alert("הסתרת אלמנטים תחובר במנוע הפעולות המרכזי.");
  }

  function resetStyle() {
    if (locked) return;

    editor?.resetStyle?.(elementId);
  }

  function closeSelection() {
    setLinkOpen(false);
    setMediaOpen(false);
    editor?.clearSelection?.();
  }

  return (
    <div
      dir="rtl"
      data-visual-floating-toolbar="true"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      className="pointer-events-none fixed inset-x-0 top-[72px] z-[2147483000] flex justify-center overflow-visible border-b border-slate-200 bg-white/95 px-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
    >
      <div className="pointer-events-auto relative flex h-14 w-full max-w-[1720px] items-center gap-1.5 overflow-x-auto overflow-y-visible whitespace-nowrap px-1 text-slate-950">
        <div className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-violet-50 px-3 text-xs font-black text-violet-700">
          <Sparkles className="h-4 w-4" />
          {element?.label || getTagName(element) || "אלמנט"}
        </div>

        <ToolbarDivider />

        {canEditForm ? (
          <>
            <button
              type="button"
              title="עריכת טופס"
              disabled={locked}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                editor?.openFormBuilder?.();
              }}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-black text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardList className="h-4 w-4" />
              עריכת טופס
            </button>

            <ToolbarDivider />
          </>
        ) : null}

        {isTextEditable ? (
          <>
            <div className="relative h-9 w-[min(300px,22vw)] min-w-[160px] shrink">
              <Type className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={textValue}
                disabled={locked}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => {
                  const value = event.target.value;
                  setTextValue(value);
                  submitText(value);
                }}
                onBlur={() => submitText()}
                onKeyDown={(event) => {
                  event.stopPropagation();

                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitText();
                  }
                }}
                placeholder="עריכת טקסט"
                className="h-9 w-full rounded-xl bg-transparent px-8 pl-2 text-sm font-bold text-slate-900 outline-none transition hover:bg-slate-100 focus:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <StudioFontPicker
              value={currentFont}
              onChange={(fontFamily) =>
                apply({
                  "font-family": fontFamily,
                  fontFamily,
                } as StylePatch)
              }
            />

            <SelectControl
              value={currentFontSize}
              onChange={(value) =>
                apply({
                  "font-size": value,
                  fontSize: value,
                } as StylePatch)
              }
              className="w-[74px]"
              title="גודל טקסט"
            >
              <option value="">גודל</option>

              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size.replace("px", "")}
                </option>
              ))}
            </SelectControl>

            <ToolbarButton
              title="מודגש"
              disabled={locked}
              active={isStyleActive(
                style,
                ["font-weight", "fontWeight"],
                ["700", "bold"],
              )}
              onClick={() => {
                const active = isStyleActive(
                  style,
                  ["font-weight", "fontWeight"],
                  ["700", "bold"],
                );

                apply({
                  "font-weight": active ? "400" : "700",
                  fontWeight: active ? "400" : "700",
                } as StylePatch);
              }}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="נטוי"
              disabled={locked}
              active={isStyleActive(
                style,
                ["font-style", "fontStyle"],
                ["italic"],
              )}
              onClick={() => {
                const active = isStyleActive(
                  style,
                  ["font-style", "fontStyle"],
                  ["italic"],
                );

                apply({
                  "font-style": active ? "normal" : "italic",
                  fontStyle: active ? "normal" : "italic",
                } as StylePatch);
              }}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="קו תחתון"
              disabled={locked}
              active={String(
                style["text-decoration"] || style.textDecoration || "",
              ).includes("underline")}
              onClick={() => {
                const active = String(
                  style["text-decoration"] || style.textDecoration || "",
                ).includes("underline");

                apply({
                  "text-decoration": active ? "none" : "underline",
                  textDecoration: active ? "none" : "underline",
                } as StylePatch);
              }}
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לימין"
              disabled={locked}
              active={isStyleActive(
                style,
                ["text-align", "textAlign"],
                ["right"],
              )}
              onClick={() =>
                apply({
                  "text-align": "right",
                  textAlign: "right",
                } as StylePatch)
              }
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור למרכז"
              disabled={locked}
              active={isStyleActive(
                style,
                ["text-align", "textAlign"],
                ["center"],
              )}
              onClick={() =>
                apply({
                  "text-align": "center",
                  textAlign: "center",
                } as StylePatch)
              }
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לשמאל"
              disabled={locked}
              active={isStyleActive(
                style,
                ["text-align", "textAlign"],
                ["left"],
              )}
              onClick={() =>
                apply({
                  "text-align": "left",
                  textAlign: "left",
                } as StylePatch)
              }
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>

            <ColorControl
              title="צבע טקסט"
              value={currentColor}
              fallback="#111827"
              onChange={(value) =>
                apply({
                  color: value,
                  "-webkit-text-fill-color": value,
                  WebkitTextFillColor: value,
                  backgroundImage: "none",
                  "background-image": "none",
                } as StylePatch)
              }
            >
              <Palette className="h-4 w-4" />
            </ColorControl>

            <ToolbarButton
              title="מיקס צבעים לטקסט"
              disabled={locked}
              active={hasTextGradient && gradientOpen}
              onClick={() => openGradient("text")}
            >
              <Sparkles className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        {hasBackground ? (
          <>
            <ColorControl
            title="צבע רקע"
            value={currentBackground}
            fallback="#ffffff"
            onChange={(value) =>
              apply({
                "background-color": value,
                backgroundColor: value,
              } as StylePatch)
            }
          >
            <PaintBucket className="h-4 w-4" />
          </ColorControl>

          <ToolbarButton
            title="מיקס צבעים לרקע"
            disabled={locked}
            active={hasBackgroundGradient && gradientOpen}
            onClick={() => openGradient("background")}
          >
            <Sparkles className="h-4 w-4" />
          </ToolbarButton>
          </>
        ) : null}

        {hasShape ? (
          <>
            <SelectControl
              value={currentRadius}
              onChange={(value) =>
                apply({
                  "border-radius": value,
                  borderRadius: value,
                } as StylePatch)
              }
              className="w-[86px]"
              title="פינות"
            >
              {RADIUS_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectControl>

            <SelectControl
              value={currentShadow}
              onChange={(value) =>
                apply({
                  "box-shadow": value,
                  boxShadow: value,
                } as StylePatch)
              }
              className="w-[88px]"
              title="צל"
            >
              {SHADOW_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectControl>
          </>
        ) : null}

        {kind === "image" ? (
          <>
            <SelectControl
              value={currentObjectFit}
              onChange={(value) =>
                apply({
                  "object-fit": value,
                  objectFit: value,
                } as StylePatch)
              }
              className="w-[92px]"
              title="התאמת מדיה"
            >
              <option value="">Fit</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </SelectControl>

            <button
              type="button"
              title="שינוי תמונה או וידאו"
              disabled={locked}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openMediaPicker();
              }}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              שינוי
            </button>

            <button
              type="button"
              title="עריכת תמונה"
              disabled={locked}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openMediaEditor();
              }}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 text-sm font-black text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              עריכה
            </button>

            <ToolbarButton
              title="מדיה לפי כתובת"
              disabled={locked}
              active={mediaOpen}
              onClick={() => setMediaOpen((value) => !value)}
            >
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        {kind === "section" || kind === "general" ? (
          <>
            <ToolbarButton
              title="העלאת תמונת רקע"
              disabled={locked}
              onClick={uploadBackgroundImage}
            >
              <Upload className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="תמונת רקע לפי כתובת"
              disabled={locked}
              onClick={setBackgroundImageFromUrl}
            >
              <PanelTop className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        {kind === "button" || kind === "text" ? (
          <ToolbarButton
            title="קישור"
            disabled={locked}
            onClick={() => {
              if (!elementId) return;
              editor?.openLinkSettings?.(elementId);
              setLinkOpen(false);
            }}
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
        ) : null}

        <SelectControl
          value={currentAnimation}
          onChange={setAnimation}
          className="w-[104px]"
          title="אנימציה"
        >
          {ANIMATION_OPTIONS.map((animation) => (
            <option key={animation.label} value={animation.value}>
              {animation.label}
            </option>
          ))}
        </SelectControl>

        <ToolbarDivider />

        <ToolbarButton
          title="בחירת האלמנט ההורה"
          onClick={() => editor?.selectParent?.()}
        >
          <CornerUpLeft className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="קדימה בשכבות"
          disabled={locked}
          onClick={() => editor?.bringForward?.(elementId)}
        >
          <MoveUp className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="אחורה בשכבות"
          disabled={locked}
          onClick={() => editor?.sendBackward?.(elementId)}
        >
          <MoveDown className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="שכפול"
          disabled={locked}
          onClick={() =>
            editor?.duplicateElement?.(elementId) ||
            editor?.duplicateSelected?.()
          }
        >
          <Copy className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title={locked ? "פתיחת נעילה" : "נעילת אלמנט"}
          active={locked}
          onClick={toggleLock}
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
        </ToolbarButton>

        <ToolbarButton
          title={hidden ? "הצגת אלמנט" : "הסתרת אלמנט"}
          active={hidden}
          onClick={toggleHidden}
        >
          {hidden ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </ToolbarButton>

        <ToolbarButton
          title="איפוס עיצוב"
          disabled={locked}
          onClick={resetStyle}
        >
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="מחיקה"
          danger
          disabled={locked}
          onClick={() =>
            editor?.deleteElement?.(elementId) ||
            editor?.deleteSelected?.()
          }
        >
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="סגירת בחירה" onClick={closeSelection}>
          <X className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {gradientOpen ? (
        <GradientColorPicker
          colors={gradientColors}
          angle={gradientAngle}
          target={gradientTarget}
          onColorsChange={setGradientColors}
          onAngleChange={(value) =>
            setGradientAngle(Math.max(0, Math.min(360, value || 0)))
          }
          onApply={applyGradient}
          onClear={clearGradient}
          onClose={() => setGradientOpen(false)}
        />
      ) : null}

      {mediaOpen && kind === "image" ? (
        <div className="pointer-events-auto absolute right-1/2 top-[66px] z-[2147483001] flex w-[min(860px,calc(100vw-32px))] translate-x-1/2 items-center gap-2 rounded-[20px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <ImageIcon className="h-4 w-4" />
          </div>

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openMediaPicker();
            }}
            className="h-11 shrink-0 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            העלאה מהמחשב
          </button>

          <input
            value={mediaUrl}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setMediaUrl(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") {
                event.preventDefault();
                submitMediaUrl();
              }
            }}
            placeholder="כתובת תמונה או וידאו"
            dir="ltr"
            className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <input
            value={mediaAlt}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setMediaAlt(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") {
                event.preventDefault();
                submitMediaUrl();
              }
            }}
            placeholder="Alt"
            className="h-11 w-[150px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              submitMediaUrl();
            }}
            className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            החלפה
          </button>

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMediaOpen(false);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
