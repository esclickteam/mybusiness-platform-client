import React, { useEffect, useMemo, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Copy,
  Image as ImageIcon,
  Italic,
  Link2,
  MoveDown,
  MoveUp,
  PaintBucket,
  Palette,
  PanelTop,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Underline,
  X,
} from "lucide-react";

import type { StylePatch } from "./types";
import StudioFontPicker from "./StudioFontPicker";

type ElementKind = "text" | "image" | "button" | "section" | "general";

type StudioFloatingToolbarProps = {
  selectedComponent: any;
  onApplyStyle: (style: StylePatch) => void;
  onSetText: (value: string) => void;
  onSetHref: (href: string) => void;
  onReplaceImage: () => void;
  onSetBackgroundImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSetAnimation: (animation: string) => void;
  onClearAnimation: () => void;
  onClearSelection: () => void;
};

const fontSizes = [
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

const radiusOptions = [
  { label: "פינות", value: "" },
  { label: "0", value: "0px" },
  { label: "8", value: "8px" },
  { label: "16", value: "16px" },
  { label: "28", value: "28px" },
  { label: "עגול", value: "999px" },
];

const shadowOptions = [
  { label: "צל", value: "" },
  { label: "ללא", value: "none" },
  { label: "עדין", value: "0 12px 30px rgba(15,23,42,0.12)" },
  { label: "בינוני", value: "0 22px 60px rgba(15,23,42,0.18)" },
  { label: "חזק", value: "0 35px 100px rgba(15,23,42,0.25)" },
];

const animations = [
  { label: "תנועה", value: "" },
  { label: "ללא", value: "none" },
  { label: "Fade Up", value: "bizuplyRevealUp 0.75s ease both" },
  { label: "Float", value: "bizuplyFloatSoft 4.8s ease-in-out infinite" },
  { label: "Fade", value: "bizuplyFadeIn 0.65s ease both" },
  { label: "Zoom", value: "bizuplySoftZoom 0.7s ease both" },
];

function getTag(component: any) {
  return String(component?.get?.("tagName") || "").toLowerCase();
}

function getAttrs(component: any) {
  try {
    return component?.getAttributes?.() || {};
  } catch {
    return {};
  }
}

function getStyle(component: any) {
  try {
    return component?.getStyle?.() || {};
  } catch {
    return {};
  }
}

function getText(component: any) {
  try {
    const attrs = getAttrs(component);
    const tag = getTag(component);

    if (tag === "input" || tag === "textarea") {
      return String(attrs.placeholder || "");
    }

    return String(
      component?.get?.("content") ||
        component?.view?.el?.innerText ||
        component?.view?.el?.textContent ||
        "",
    ).trim();
  } catch {
    return "";
  }
}

function getKind(component: any): ElementKind {
  const tag = getTag(component);
  const attrs = getAttrs(component);

  if (tag === "img" || tag === "picture" || attrs.src) return "image";

  if (
    tag === "a" ||
    tag === "button" ||
    attrs["data-editable-link"] === "true" ||
    attrs.href
  ) {
    return "button";
  }

  if (
    tag === "section" ||
    tag === "header" ||
    tag === "footer" ||
    attrs["data-section-kind"] ||
    attrs["data-bizuply-block"]
  ) {
    return "section";
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
      "em",
      "div",
    ].includes(tag)
  ) {
    return "text";
  }

  return "general";
}

function getHref(component: any) {
  const attrs = getAttrs(component);

  return String(
    attrs.href ||
      attrs["data-link-url"] ||
      attrs["data-href"] ||
      attrs.to ||
      "",
  );
}

function normalizeHref(value: string) {
  const clean = value.trim();

  if (!clean) return "#";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

function isStyleActive(style: Record<string, any>, key: string, value: string) {
  return String(style?.[key] || "").toLowerCase() === value.toLowerCase();
}

function ToolbarDivider() {
  return <div className="h-7 w-px shrink-0 bg-slate-200" />;
}

function ToolbarButton({
  title,
  active,
  danger,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black transition",
        active
          ? "bg-slate-950 text-white"
          : danger
            ? "text-rose-600 hover:bg-rose-50"
            : "text-slate-800 hover:bg-slate-100",
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
      className={[
        "relative inline-flex h-9 shrink-0 items-center rounded-lg bg-transparent text-sm font-bold text-slate-900 transition hover:bg-slate-100",
        className,
      ].join(" ")}
    >
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-lg bg-transparent py-0 pl-7 pr-2 text-sm font-bold outline-none"
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
  onChange,
  children,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#111827";

  return (
    <label
      title={title}
      className="relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-800 transition hover:bg-slate-100"
    >
      {children}

      <span
        className="absolute bottom-1 h-4 w-4 rounded-full border border-white shadow-sm"
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

export default function StudioFloatingToolbar({
  selectedComponent,
  onApplyStyle,
  onSetText,
  onSetHref,
  onReplaceImage,
  onSetBackgroundImage,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onSetAnimation,
  onClearAnimation,
  onClearSelection,
}: StudioFloatingToolbarProps) {
  const [textValue, setTextValue] = useState("");
  const [hrefValue, setHrefValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  const kind = useMemo(() => getKind(selectedComponent), [selectedComponent]);
  const style = useMemo(() => getStyle(selectedComponent), [selectedComponent]);

  const currentFont = String(style["font-family"] || "");
  const currentFontSize = String(style["font-size"] || "");
  const currentColor = String(style.color || "#111827");
  const currentBackground = String(
    style["background-color"] || style.background || "#ffffff",
  );
  const currentRadius = String(style["border-radius"] || "");
  const currentShadow = String(style["box-shadow"] || "");
  const currentObjectFit = String(style["object-fit"] || "");
  const currentAnimation = String(style.animation || "");

  useEffect(() => {
    setTextValue(getText(selectedComponent));
    setHrefValue(getHref(selectedComponent));
    setLinkOpen(false);
  }, [selectedComponent]);

  if (!selectedComponent) return null;

  const isTextEditable =
    kind === "text" || kind === "button" || kind === "general";

  const hasBackground =
    kind === "button" || kind === "section" || kind === "general";

  const hasShape =
    kind === "image" ||
    kind === "button" ||
    kind === "section" ||
    kind === "general";

  function apply(stylePatch: StylePatch) {
    onApplyStyle(stylePatch);
  }

  function submitText() {
    const clean = textValue.trim();

    if (!clean) return;

    onSetText(clean);
  }

  function submitHref() {
    const clean = normalizeHref(hrefValue);

    setHrefValue(clean);
    onSetHref(clean);
    setLinkOpen(false);
  }

  return (
    <div
      dir="rtl"
      className="
        pointer-events-none fixed left-0 right-0 top-[74px] z-[999998]
        flex justify-center overflow-visible border-b border-slate-200 bg-white/95
        px-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl
      "
    >
      <div
        className="
          pointer-events-auto relative flex h-14 w-full max-w-[1680px]
          items-center justify-center gap-2 overflow-visible whitespace-nowrap
          text-slate-950
        "
      >
        <button
          type="button"
          title="Ask Aria"
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
        >
          <Sparkles className="h-4 w-4" />
          Ask Aria
        </button>

        <ToolbarDivider />

        {isTextEditable && (
          <>
            <div className="relative h-9 w-[min(300px,22vw)] min-w-[160px] shrink">
              <Type className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
                onBlur={submitText}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitText();
                }}
                placeholder="Edit Text"
                className="
                  h-9 w-full rounded-lg bg-transparent px-8 pl-2
                  text-sm font-bold text-slate-900 outline-none
                  transition hover:bg-slate-100 focus:bg-slate-100
                "
              />
            </div>

            <ToolbarDivider />

            <StudioFontPicker
              value={currentFont}
              onChange={(fontFamily) =>
                apply({ "font-family": fontFamily } as StylePatch)
              }
            />

            <SelectControl
              value={currentFontSize}
              onChange={(value) =>
                apply({ "font-size": value } as StylePatch)
              }
              className="w-[74px]"
              title="גודל טקסט"
            >
              <option value="">גודל</option>

              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size.replace("px", "")}
                </option>
              ))}
            </SelectControl>

            <ToolbarButton
              title="Bold"
              active={
                isStyleActive(style, "font-weight", "700") ||
                isStyleActive(style, "font-weight", "bold")
              }
              onClick={() =>
                apply({
                  "font-weight":
                    isStyleActive(style, "font-weight", "700") ||
                    isStyleActive(style, "font-weight", "bold")
                      ? "400"
                      : "700",
                } as StylePatch)
              }
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              active={isStyleActive(style, "font-style", "italic")}
              onClick={() =>
                apply({
                  "font-style": isStyleActive(style, "font-style", "italic")
                    ? "normal"
                    : "italic",
                } as StylePatch)
              }
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="Underline"
              active={String(style["text-decoration"] || "").includes(
                "underline",
              )}
              onClick={() =>
                apply({
                  "text-decoration": String(
                    style["text-decoration"] || "",
                  ).includes("underline")
                    ? "none"
                    : "underline",
                } as StylePatch)
              }
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לימין"
              active={isStyleActive(style, "text-align", "right")}
              onClick={() => apply({ "text-align": "right" } as StylePatch)}
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לאמצע"
              active={isStyleActive(style, "text-align", "center")}
              onClick={() => apply({ "text-align": "center" } as StylePatch)}
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לשמאל"
              active={isStyleActive(style, "text-align", "left")}
              onClick={() => apply({ "text-align": "left" } as StylePatch)}
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>

            <ColorControl
              title="צבע טקסט"
              value={currentColor}
              onChange={(value) => apply({ color: value } as StylePatch)}
            >
              <Palette className="h-4 w-4" />
            </ColorControl>
          </>
        )}

        {hasBackground && (
          <ColorControl
            title="צבע רקע"
            value={currentBackground}
            onChange={(value) =>
              apply({ "background-color": value } as StylePatch)
            }
          >
            <PaintBucket className="h-4 w-4" />
          </ColorControl>
        )}

        {hasShape && (
          <>
            <SelectControl
              value={currentRadius}
              onChange={(value) =>
                apply({ "border-radius": value } as StylePatch)
              }
              className="w-[86px]"
              title="פינות"
            >
              {radiusOptions.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectControl>

            <SelectControl
              value={currentShadow}
              onChange={(value) => apply({ "box-shadow": value } as StylePatch)}
              className="w-[86px]"
              title="צל"
            >
              {shadowOptions.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectControl>
          </>
        )}

        {kind === "image" && (
          <>
            <SelectControl
              value={currentObjectFit}
              onChange={(value) => apply({ "object-fit": value } as StylePatch)}
              className="w-[92px]"
              title="התאמת תמונה"
            >
              <option value="">Fit</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </SelectControl>

            <ToolbarButton title="החלפת תמונה" onClick={onReplaceImage}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        {kind === "section" && (
          <ToolbarButton title="תמונת רקע" onClick={onSetBackgroundImage}>
            <PanelTop className="h-4 w-4" />
          </ToolbarButton>
        )}

        {(kind === "button" || kind === "text" || kind === "general") && (
          <>
            <ToolbarDivider />

            <ToolbarButton
              title="קישור"
              active={linkOpen}
              onClick={() => setLinkOpen((value) => !value)}
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <SelectControl
          value={currentAnimation}
          onChange={(value) => {
            if (!value) return;

            if (value === "none") {
              onClearAnimation();
              return;
            }

            onSetAnimation(value);
          }}
          className="w-[98px]"
          title="תנועה"
        >
          {animations.map((animation) => (
            <option key={animation.label} value={animation.value}>
              {animation.label}
            </option>
          ))}
        </SelectControl>

        <ToolbarDivider />

        <ToolbarButton title="קדימה" onClick={onBringForward}>
          <MoveUp className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="אחורה" onClick={onSendBackward}>
          <MoveDown className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="שכפול" onClick={onDuplicate}>
          <Copy className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="מחיקה" danger onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="איפוס עיצוב"
          onClick={() =>
            apply({
              "font-weight": "",
              "font-style": "",
              "text-decoration": "",
              "text-align": "",
              "box-shadow": "",
              animation: "",
            } as StylePatch)
          }
        >
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="סגור בחירה" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {linkOpen && (
        <div
          className="
            pointer-events-auto absolute right-1/2 top-[66px] z-[999999]
            flex w-[min(580px,calc(100vw-32px))] translate-x-1/2 items-center gap-2
            rounded-[18px] border border-slate-200 bg-white/95 p-3
            shadow-[0_18px_60px_rgba(15,23,42,0.16)]
            backdrop-blur-2xl
          "
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Link2 className="h-4 w-4" />
          </div>

          <input
            value={hrefValue}
            onChange={(event) => setHrefValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitHref();
            }}
            placeholder="https://example.com או #section"
            className="
              h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4
              text-sm font-bold text-slate-800 outline-none transition
              focus:border-violet-300 focus:ring-4 focus:ring-violet-100
            "
          />

          <button
            type="button"
            onClick={submitHref}
            className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            שמור
          </button>

          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}