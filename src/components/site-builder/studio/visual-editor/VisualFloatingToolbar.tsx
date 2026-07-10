import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Upload,
  X,
} from "lucide-react";

import type { StylePatch } from "../types";
import StudioFontPicker from "../StudioFontPicker";

type ElementKind = "text" | "image" | "button" | "section" | "general";

type ReplaceImagePayload = {
  src?: string;
  alt?: string;
  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;
};

type BackgroundImagePayload = {
  src?: string;
};

type VisualFloatingToolbarProps = {
  editor: any;
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
  { label: "Fade Up", value: "fade-up" },
  { label: "Float", value: "float-soft" },
  { label: "Fade", value: "bizuplyFadeIn 0.65s ease both" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Blur Reveal", value: "blur-reveal" },
  { label: "Pulse", value: "pulse-soft" },
];

function normalizeHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "#";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("sms:")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

function isStyleActive(style: Record<string, any>, key: string, value: string) {
  return String(style?.[key] || "").toLowerCase() === value.toLowerCase();
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));

    reader.readAsDataURL(file);
  });
}

function isImageFile(file: File) {
  return String(file.type || "").startsWith("image/");
}

function isVideoFile(file: File) {
  return String(file.type || "").startsWith("video/");
}

function getMediaTypeFromSrc(src: string) {
  const clean = String(src || "")
    .trim()
    .toLowerCase()
    .split("?")[0]
    .split("#")[0];

  if (
    clean.startsWith("data:video/") ||
    clean.startsWith("blob:") ||
    clean.includes("/video/upload/") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv")
  ) {
    return "video";
  }

  return "image";
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
  const fromElement = String(element?.tagName || "").toLowerCase();
  if (fromElement) return fromElement;

  const node = getElementNode(element);
  return String(node?.tagName || "").toLowerCase();
}

function normalizeElementKind(value: string): ElementKind | "" {
  const clean = String(value || "").trim().toLowerCase();

  if (!clean) return "";

  if (clean === "text") return "text";
  if (clean === "heading") return "text";
  if (clean === "paragraph") return "text";

  if (clean === "image") return "image";
  if (clean === "video") return "image";
  if (clean === "media") return "image";
  if (clean === "raw") return "image";

  if (clean === "button") return "button";
  if (clean === "link") return "button";

  if (clean === "section") return "section";

  if (clean === "box") return "general";
  if (clean === "line") return "general";
  if (clean === "icon") return "general";
  if (clean === "general") return "general";

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

  if (tagName === "img" || tagName === "video" || tagName === "source") {
    return "image";
  }

  if (
    tagName === "a" ||
    tagName === "button" ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
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
  const direct = String(element?.text || element?.content || "").trim();

  if (direct) return direct;

  const node = getElementNode(element);

  if (node instanceof HTMLInputElement) {
    return String(node.value || node.placeholder || "").trim();
  }

  if (node instanceof HTMLTextAreaElement) {
    return String(node.value || node.placeholder || node.textContent || "").trim();
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
  const direct = String(element?.src || "").trim();

  if (direct) return direct;

  const node = getElementNode(element);

  if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement) {
    return String(node.getAttribute("src") || "").trim();
  }

  const mediaNode = node?.querySelector?.("img, video, source") as
    | HTMLElement
    | null;

  return String(mediaNode?.getAttribute("src") || "").trim();
}

function getElementAlt(element: any) {
  const direct = String(element?.alt || "").trim();

  if (direct) return direct;

  const node = getElementNode(element);

  if (node instanceof HTMLImageElement) {
    return String(node.getAttribute("alt") || "").trim();
  }

  const img = node?.querySelector?.("img") as HTMLImageElement | null;

  return String(img?.getAttribute("alt") || "").trim();
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
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
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
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
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
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
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

export default function VisualFloatingToolbar({
  editor,
}: VisualFloatingToolbarProps) {
  const element = editor?.selectedElement || null;

  const [textValue, setTextValue] = useState("");
  const [hrefValue, setHrefValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement | null>(null);

  const elementId = getElementId(element);
  const kind = useMemo(() => getElementKind(element), [element]);

  const style = useMemo(() => {
    if (!elementId) return {};

    return {
      ...(editor?.styles?.[elementId] || {}),
    } as Record<string, any>;
  }, [editor?.styles, elementId]);

  const currentFont = String(style["font-family"] || style.fontFamily || "");
  const currentFontSize = String(style["font-size"] || style.fontSize || "");
  const currentColor = String(style.color || "#111827");
  const currentBackground = String(
    style["background-color"] ||
      style.backgroundColor ||
      style.background ||
      "#ffffff",
  );
  const currentRadius = String(style["border-radius"] || style.borderRadius || "");
  const currentShadow = String(style["box-shadow"] || style.boxShadow || "");
  const currentObjectFit = String(style["object-fit"] || style.objectFit || "");
  const currentAnimation = String(
    editor?.animations?.[elementId] || style.animation || "",
  );

  useEffect(() => {
    if (!element) return;

    setTextValue(getElementText(element));
    setHrefValue(getElementHref(element));
    setImageUrl(getElementSrc(element));
    setImageAlt(getElementAlt(element));
    setLinkOpen(false);
    setImageOpen(false);
  }, [elementId, element]);

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
    if (!elementId) return;

    if (typeof editor?.applyStyle === "function") {
      editor.applyStyle(elementId, stylePatch);
    }
  }

  function submitText(value = textValue) {
    if (!elementId) return;

    const cleanValue = String(value ?? "");

    setTextValue(cleanValue);

    if (typeof editor?.updateText === "function") {
      editor.updateText(elementId, cleanValue);
      return;
    }

    if (typeof editor?.updateInlineText === "function") {
      editor.updateInlineText(elementId, cleanValue);
      return;
    }

    if (typeof editor?.updateElementText === "function") {
      editor.updateElementText(elementId, cleanValue);
      return;
    }
  }

  function submitHref() {
    if (!elementId) return;

    const clean = normalizeHref(hrefValue);

    setHrefValue(clean);

    if (typeof editor?.updateLink === "function") {
      editor.updateLink(elementId, {
        href: clean,
        target: "_self",
      });
    }

    setLinkOpen(false);
  }

  function replaceImage(payload?: ReplaceImagePayload) {
    if (!elementId) return;

    const src = String(payload?.src || "").trim();
    const alt = String(payload?.alt || "").trim();
    const mediaType = payload?.mediaType || getMediaTypeFromSrc(src);

    if (!src) return;

    if (typeof editor?.updateImage === "function") {
      editor.updateImage(elementId, {
        src,
        alt,
        mediaType,
        resourceType: payload?.resourceType || mediaType,
      });

      setImageUrl(src);
      setImageAlt(alt);
      return;
    }

    window.alert("החלפת מדיה לא מחוברת לעורך.");
  }

  function setBackgroundImage(payload?: BackgroundImagePayload) {
    const src = String(payload?.src || "").trim();

    if (!src) {
      const nextSrc = window.prompt("הדביקי כתובת תמונת רקע", "");
      if (!nextSrc) return;

      apply({
        backgroundImage: `url("${nextSrc.trim()}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as StylePatch);

      return;
    }

    apply({
      backgroundImage: `url("${src}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as StylePatch);
  }

  function submitImage() {
    const cleanSrc = imageUrl.trim();

    if (!cleanSrc) {
      imageFileInputRef.current?.click();
      return;
    }

    replaceImage({
      src: cleanSrc,
      alt: imageAlt.trim(),
      mediaType: getMediaTypeFromSrc(cleanSrc),
      resourceType: getMediaTypeFromSrc(cleanSrc),
    });

    setImageOpen(false);
  }

  async function handleImageFile(file: File | null | undefined) {
    if (!file) return;

    if (!isImageFile(file) && !isVideoFile(file)) {
      window.alert("אפשר להעלות רק תמונה או וידאו.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const alt = imageAlt.trim() || file.name.replace(/\.[^.]+$/, "");
      const mediaType = isVideoFile(file) ? "video" : "image";

      setImageUrl(dataUrl);
      setImageAlt(alt);

      replaceImage({
        src: dataUrl,
        alt,
        mediaType,
        resourceType: mediaType,
      });

      setImageOpen(false);
    } catch {
      window.alert("לא הצלחנו להעלות את הקובץ. נסי קובץ אחר.");
    }
  }

  async function handleBackgroundFile(file: File | null | undefined) {
    if (!file) return;

    if (!isImageFile(file)) {
      window.alert("אפשר להעלות רק קובץ תמונה.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);

      setBackgroundImage({
        src: dataUrl,
      });
    } catch {
      window.alert("לא הצלחנו להעלות את תמונת הרקע. נסי קובץ אחר.");
    }
  }

  function setAnimation(value: string) {
    if (!elementId) return;
    if (!value) return;

    if (value === "none") {
      if (typeof editor?.clearAnimation === "function") {
        editor.clearAnimation(elementId);
      }

      return;
    }

    if (typeof editor?.setAnimation === "function") {
      editor.setAnimation(elementId, value);
    }
  }

  function bringForward() {
    if (typeof editor?.bringForward === "function") {
      editor.bringForward(elementId);
    }
  }

  function sendBackward() {
    if (typeof editor?.sendBackward === "function") {
      editor.sendBackward(elementId);
    }
  }

  function duplicateSelected() {
    if (typeof editor?.duplicateElement === "function") {
      editor.duplicateElement(elementId);
      return;
    }

    if (typeof editor?.duplicateSelected === "function") {
      editor.duplicateSelected();
    }
  }

  function deleteSelected() {
    if (typeof editor?.deleteElement === "function") {
      editor.deleteElement(elementId);
      return;
    }

    if (typeof editor?.deleteSelected === "function") {
      editor.deleteSelected();
    }
  }

  function resetStyle() {
    if (typeof editor?.resetStyle === "function") {
      editor.resetStyle(elementId);
      return;
    }

    apply({
      "font-weight": "",
      fontWeight: "",
      "font-style": "",
      fontStyle: "",
      "text-decoration": "",
      textDecoration: "",
      "text-align": "",
      textAlign: "",
      "box-shadow": "",
      boxShadow: "",
      animation: "",
    } as StylePatch);
  }

  function clearSelection() {
    setLinkOpen(false);
    setImageOpen(false);

    if (typeof editor?.clearSelection === "function") {
      editor.clearSelection();
    }
  }

  return (
    <div
      dir="rtl"
      data-visual-floating-toolbar="true"
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      className="
        pointer-events-none fixed left-0 right-0 top-[72px] z-[2147483000]
        flex justify-center overflow-visible border-b border-slate-200 bg-white/95
        px-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl
      "
    >
      <input
        ref={imageFileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleImageFile(file);
          event.currentTarget.value = "";
        }}
      />

      <input
        ref={backgroundFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleBackgroundFile(file);
          event.currentTarget.value = "";
        }}
      />

      <div
        className="
          pointer-events-auto relative flex h-14 w-full max-w-[1680px]
          items-center justify-center gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap
          text-slate-950
        "
      >
        <button
          type="button"
          title="Ask Aria"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
        >
          <Sparkles className="h-4 w-4" />
          Ask Aria
        </button>

        <ToolbarDivider />

        {isTextEditable ? (
          <>
            <div className="relative h-9 w-[min(300px,22vw)] min-w-[160px] shrink">
              <Type className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={textValue}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onChange={(event) => {
                  const nextValue = event.target.value;

                  setTextValue(nextValue);
                  submitText(nextValue);
                }}
                onBlur={() => submitText()}
                onKeyDown={(event) => {
                  event.stopPropagation();

                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitText();
                  }
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
                isStyleActive(style, "font-weight", "bold") ||
                isStyleActive(style, "fontWeight", "700") ||
                isStyleActive(style, "fontWeight", "bold")
              }
              onClick={() => {
                const isBold =
                  isStyleActive(style, "font-weight", "700") ||
                  isStyleActive(style, "font-weight", "bold") ||
                  isStyleActive(style, "fontWeight", "700") ||
                  isStyleActive(style, "fontWeight", "bold");

                apply({
                  "font-weight": isBold ? "400" : "700",
                  fontWeight: isBold ? "400" : "700",
                } as StylePatch);
              }}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              active={
                isStyleActive(style, "font-style", "italic") ||
                isStyleActive(style, "fontStyle", "italic")
              }
              onClick={() => {
                const isItalic =
                  isStyleActive(style, "font-style", "italic") ||
                  isStyleActive(style, "fontStyle", "italic");

                apply({
                  "font-style": isItalic ? "normal" : "italic",
                  fontStyle: isItalic ? "normal" : "italic",
                } as StylePatch);
              }}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="Underline"
              active={
                String(style["text-decoration"] || "").includes("underline") ||
                String(style.textDecoration || "").includes("underline")
              }
              onClick={() => {
                const isUnderline =
                  String(style["text-decoration"] || "").includes("underline") ||
                  String(style.textDecoration || "").includes("underline");

                apply({
                  "text-decoration": isUnderline ? "none" : "underline",
                  textDecoration: isUnderline ? "none" : "underline",
                } as StylePatch);
              }}
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="יישור לימין"
              active={
                isStyleActive(style, "text-align", "right") ||
                isStyleActive(style, "textAlign", "right")
              }
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
              title="יישור לאמצע"
              active={
                isStyleActive(style, "text-align", "center") ||
                isStyleActive(style, "textAlign", "center")
              }
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
              active={
                isStyleActive(style, "text-align", "left") ||
                isStyleActive(style, "textAlign", "left")
              }
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
              onChange={(value) => apply({ color: value } as StylePatch)}
            >
              <Palette className="h-4 w-4" />
            </ColorControl>
          </>
        ) : null}

        {hasBackground ? (
          <ColorControl
            title="צבע רקע"
            value={currentBackground}
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
              {radiusOptions.map((item) => (
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
              title="התאמת תמונה"
            >
              <option value="">Fit</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </SelectControl>

            <button
              type="button"
              title="העלאת תמונה / וידאו מהמחשב"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                imageFileInputRef.current?.click();
              }}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-black text-white transition hover:bg-violet-700"
            >
              <Upload className="h-4 w-4" />
              החלפת מדיה
            </button>

            <ToolbarButton
              title="הדבקת כתובת תמונה / וידאו"
              active={imageOpen}
              onClick={() => setImageOpen((value) => !value)}
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        {kind === "section" ? (
          <>
            <ToolbarButton
              title="העלאת תמונת רקע"
              onClick={() => backgroundFileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="תמונת רקע לפי כתובת"
              onClick={() => setBackgroundImage()}
            >
              <PanelTop className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        {kind === "button" || kind === "text" ? (
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
        ) : null}

        <SelectControl
          value={currentAnimation}
          onChange={setAnimation}
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

        <ToolbarButton title="קדימה" onClick={bringForward}>
          <MoveUp className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="אחורה" onClick={sendBackward}>
          <MoveDown className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="שכפול" onClick={duplicateSelected}>
          <Copy className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="מחיקה" danger onClick={deleteSelected}>
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="איפוס עיצוב" onClick={resetStyle}>
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="סגור בחירה" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {linkOpen ? (
        <div
          className="
            pointer-events-auto absolute right-1/2 top-[66px] z-[2147483001]
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
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setHrefValue(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

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
            שמור
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

      {imageOpen && kind === "image" ? (
        <div
          className="
            pointer-events-auto absolute right-1/2 top-[66px] z-[2147483001]
            flex w-[min(820px,calc(100vw-32px))] translate-x-1/2 items-center gap-2
            rounded-[18px] border border-slate-200 bg-white/95 p-3
            shadow-[0_18px_60px_rgba(15,23,42,0.16)]
            backdrop-blur-2xl
          "
        >
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
              imageFileInputRef.current?.click();
            }}
            className="h-11 shrink-0 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            העלאת מדיה
          </button>

          <input
            value={imageUrl}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setImageUrl(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") submitImage();
            }}
            placeholder="או הדביקי כתובת תמונה / וידאו..."
            dir="ltr"
            className="
              h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4
              text-left text-sm font-bold text-slate-800 outline-none transition
              focus:border-violet-300 focus:ring-4 focus:ring-violet-100
            "
          />

          <input
            value={imageAlt}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setImageAlt(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") submitImage();
            }}
            placeholder="Alt"
            className="
              h-11 w-[150px] rounded-2xl border border-slate-200 bg-white px-4
              text-sm font-bold text-slate-800 outline-none transition
              focus:border-violet-300 focus:ring-4 focus:ring-violet-100
            "
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
              submitImage();
            }}
            className="h-11 shrink-0 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            החלף
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
              setImageOpen(false);
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