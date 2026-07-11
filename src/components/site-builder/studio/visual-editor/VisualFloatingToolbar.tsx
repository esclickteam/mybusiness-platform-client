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
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Underline,
  Unlock,
  Upload,
  X,
} from "lucide-react";

import type { StylePatch } from "../types";
import StudioFontPicker from "../StudioFontPicker";

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
  { label: "Fade", value: "fade-in" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Blur Reveal", value: "blur-reveal" },
  { label: "Float", value: "float-soft" },
  { label: "Pulse", value: "pulse-soft" },
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

function getTagName(element: any) {
  const explicit = String(element?.tagName || "").toLowerCase();

  if (explicit) return explicit;

  return String(getElementNode(element)?.tagName || "").toLowerCase();
}

function normalizeElementKind(value: unknown): ElementKind | "" {
  const clean = String(value || "").trim().toLowerCase();

  if (["text", "heading", "paragraph"].includes(clean)) return "text";
  if (["image", "video", "media", "raw"].includes(clean)) return "image";
  if (["button", "link", "control"].includes(clean)) return "button";
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

export default function VisualFloatingToolbar({
  editor,
}: VisualFloatingToolbarProps) {
  const element = editor?.selectedElement || null;

  const [textValue, setTextValue] = useState("");
  const [hrefValue, setHrefValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  const elementId = getElementId(element);
  const kind = useMemo(() => getElementKind(element), [element]);

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
  const currentColor = String(style.color || "#111827");
  const currentBackground = String(
    style["background-color"] ||
      style.backgroundColor ||
      style.background ||
      "#ffffff",
  );
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
    setHrefValue(getElementHref(element));
    setMediaUrl(getElementSrc(element));
    setMediaAlt(getElementAlt(element));
    setLinkOpen(false);
    setMediaOpen(false);
  }, [element, elementId]);

  if (!element || !elementId) return null;

  const isTextEditable = kind === "text" || kind === "button";
  const hasBackground =
    kind === "button" || kind === "section" || kind === "general";
  const hasShape =
    kind === "image" ||
    kind === "button" ||
    kind === "section" ||
    kind === "general";

  function apply(stylePatch: StylePatch) {
    if (!elementId || locked) return;

    editor?.applyStyle?.(elementId, stylePatch);
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

    const href = normalizeHref(hrefValue);

    setHrefValue(href);
    editor?.updateLink?.(elementId, {
      href,
      target: "_self",
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

    if (typeof editor?.openMediaPicker === "function") {
      void editor.openMediaPicker(elementId);
      setMediaOpen(false);
      return;
    }

    window.alert("העלאת המדיה עדיין לא מחוברת לעורך.");
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
          </>
        ) : null}

        {hasBackground ? (
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
              title="החלפת תמונה או וידאו"
              disabled={locked || Boolean(editor?.isUploadingMedia)}
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
              {editor?.isUploadingMedia ? "מעלה..." : "החלפת מדיה"}
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
            active={linkOpen}
            onClick={() => setLinkOpen((value) => !value)}
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

      {linkOpen ? (
        <div className="pointer-events-auto absolute right-1/2 top-[66px] z-[2147483001] flex w-[min(620px,calc(100vw-32px))] translate-x-1/2 items-center gap-2 rounded-[20px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Link2 className="h-4 w-4" />
          </div>

          <input
            value={hrefValue}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setHrefValue(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") {
                event.preventDefault();
                submitHref();
              }
            }}
            placeholder="https://example.com או #section"
            className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
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
              submitHref();
            }}
            className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            שמירה
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
              setLinkOpen(false);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
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
