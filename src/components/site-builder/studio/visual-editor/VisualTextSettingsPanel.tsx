import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  HelpCircle,
  Highlighter,
  Italic,
  Link2,
  Palette,
  Sparkles,
  Underline,
  X,
} from "lucide-react";

import type { StylePatch } from "../types";
import StudioFontPicker from "../StudioFontPicker";
import {
  inferTextStyleId,
  isTextSettingsElement,
  TEXT_STYLE_PRESETS,
} from "./utils/textFormatCommands";
import { snapshotTextRange } from "./utils/richTextHtml";

type VisualTextSettingsPanelProps = {
  editor: any;
};

const FONT_WEIGHTS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Black", value: "900" },
];

const LINE_HEIGHTS = ["1", "1.15", "1.3", "1.5", "1.7", "2"];
const LETTER_SPACINGS = ["-1px", "0px", "0.5px", "1px", "2px", "4px"];

function getElementNode(element: any): HTMLElement | null {
  const node =
    element?.node || element?.domNode || element?.element || null;
  return node instanceof HTMLElement ? node : null;
}

function getElementId(element: any) {
  return String(element?.id || element?.elementId || element?.visualId || "").trim();
}

function getStyleValue(
  style: Record<string, any>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = style?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }
  return fallback;
}

function parsePx(value: string) {
  const match = String(value || "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 16;
}

function normalizeColor(value: string, fallback: string) {
  const clean = String(value || "").trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) {
    if (clean.length === 4) {
      return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    return clean;
  }
  return fallback;
}

function rgbToHex(value: string, fallback: string) {
  const rgb = String(value || "").match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );
  if (!rgb) return normalizeColor(value, fallback);
  const hex = [rgb[1], rgb[2], rgb[3]]
    .map((part) => Number(part).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

function isTransparentColor(value: string) {
  const clean = String(value || "").trim().toLowerCase();
  return !clean || clean === "transparent" || clean === "rgba(0, 0, 0, 0)";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
      {children}
    </div>
  );
}

function PanelSelect({
  value,
  onChange,
  children,
  title,
  testId,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  title?: string;
  testId?: string;
}) {
  return (
    <label className="relative block" title={title}>
      <select
        data-testid={testId}
        value={value}
        onMouseDown={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-violet-400"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function ToggleButton({
  active,
  disabled,
  title,
  onClick,
  testId,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  testId?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      title={title}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-black transition ${
        active
          ? "bg-sky-100 text-sky-700"
          : "text-slate-700 hover:bg-slate-100"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function ColorSwatch({
  title,
  value,
  fallback,
  onChange,
  testId,
  children,
}: {
  title: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
  testId?: string;
  children: React.ReactNode;
}) {
  const safe = normalizeColor(rgbToHex(value, fallback), fallback);
  return (
    <label
      title={title}
      data-testid={testId}
      onMouseDown={(event) => event.stopPropagation()}
      className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
    >
      {children}
      <span
        className="absolute bottom-0.5 h-2.5 w-2.5 rounded-full border border-white shadow"
        style={{ background: safe }}
      />
      <input
        type="color"
        value={safe}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

export default function VisualTextSettingsPanel({
  editor,
}: VisualTextSettingsPanelProps) {
  const element = editor?.selectedElement;
  const elementId = getElementId(element);
  const node = getElementNode(element);
  const isText = isTextSettingsElement(element);
  const locked = Boolean(elementId && editor?.locked?.[elementId]);

  const [open, setOpen] = useState(false);
  const dismissedIdRef = useRef("");
  const [position, setPosition] = useState({ top: 148, left: 0 });
  const [dragging, setDragging] = useState<null | { x: number; y: number; top: number; left: number }>(null);
  const [effectsOpen, setEffectsOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [hasInlineRange, setHasInlineRange] = useState(false);

  const style = useMemo(() => {
    if (!elementId) return {};
    return {
      ...(element?.computedStyle || {}),
      ...(editor?.styles?.[elementId] || {}),
    } as Record<string, any>;
  }, [editor?.styles, element?.computedStyle, elementId]);

  const currentFont = getStyleValue(style, ["font-family", "fontFamily"]);
  const currentSize = getStyleValue(style, ["font-size", "fontSize"]);
  const currentWeight = getStyleValue(style, ["font-weight", "fontWeight"]);
  const currentAlign = getStyleValue(style, ["text-align", "textAlign"]);
  const currentLineHeight = getStyleValue(style, ["line-height", "lineHeight"]);
  const currentLetterSpacing = getStyleValue(style, [
    "letter-spacing",
    "letterSpacing",
  ]);
  const currentDirection = getStyleValue(style, ["direction"], "rtl");
  const currentColor = getStyleValue(style, [
    "-webkit-text-fill-color",
    "color",
  ], "#111827");
  const currentHighlight = getStyleValue(style, [
    "background-color",
    "backgroundColor",
  ]);
  const currentGradient = getStyleValue(style, [
    "background-image",
    "backgroundImage",
  ]);
  const hasTextGradient = /gradient\(/i.test(currentGradient);
  const sizePx = parsePx(currentSize);
  const tagName = String(element?.tagName || node?.tagName || "").toLowerCase();
  const styleId = inferTextStyleId(tagName, currentSize);
  const boldActive = ["700", "800", "900", "bold"].includes(
    String(currentWeight || "").toLowerCase(),
  );
  const italicActive =
    getStyleValue(style, ["font-style", "fontStyle"]) === "italic";
  const underlineActive = getStyleValue(style, [
    "text-decoration",
    "textDecoration",
  ]).includes("underline");

  useEffect(() => {
    if (!elementId || !isText) {
      setOpen(false);
      return;
    }
    if (dismissedIdRef.current === elementId) return;
    setOpen(true);
  }, [elementId, isText]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const place = () => {
      setPosition((current) => ({
        top: Math.min(Math.max(88, current.top), Math.max(88, window.innerHeight - 160)),
        left: Math.min(
          Math.max(12, current.left || Math.max(24, window.innerWidth - 360)),
          Math.max(12, window.innerWidth - 332),
        ),
      }));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissedIdRef.current = elementId;
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [elementId, open]);

  useEffect(() => {
    if (!open || !node) return;

    const syncRange = () => {
      const selection = window.getSelection();
      const hasRange = Boolean(
        selection &&
          !selection.isCollapsed &&
          selection.rangeCount > 0 &&
          node.contains(selection.anchorNode),
      );
      setHasInlineRange(hasRange);
      if (hasRange) snapshotTextRange(node, elementId);
    };

    document.addEventListener("selectionchange", syncRange);
    node.addEventListener("mouseup", syncRange);
    return () => {
      document.removeEventListener("selectionchange", syncRange);
      node.removeEventListener("mouseup", syncRange);
    };
  }, [elementId, node, open]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: MouseEvent) => {
      setPosition({
        top: Math.max(88, dragging.top + event.clientY - dragging.y),
        left: Math.max(12, dragging.left + event.clientX - dragging.x),
      });
    };
    const onUp = () => setDragging(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  if (!open || !element || !elementId || !isText) return null;

  function apply(patch: StylePatch, forceElement = false) {
    if (!elementId || locked) return;
    snapshotTextRange(node, elementId);
    if (typeof editor?.applyTextFormat === "function") {
      editor.applyTextFormat(elementId, patch, { forceElement });
      return;
    }
    editor?.applyStyle?.(elementId, patch);
  }

  function preview(patch: StylePatch) {
    if (!elementId || locked || hasInlineRange) return;
    editor?.previewStyle?.(elementId, patch);
  }

  return (
    <aside
      dir="ltr"
      data-visual-text-settings-panel="true"
      data-testid="visual-text-settings-panel"
      onMouseDown={(event) => {
        event.stopPropagation();
        snapshotTextRange(node, elementId, { clearIfNone: true });
      }}
      onClick={(event) => event.stopPropagation()}
      className="pointer-events-auto fixed z-[2147483001] flex w-[min(320px,calc(100vw-24px))] max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      style={{ top: position.top, left: position.left }}
    >
      <header
        className="flex cursor-grab items-center justify-between border-b border-slate-100 px-4 py-3 active:cursor-grabbing"
        onMouseDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          setDragging({
            x: event.clientX,
            y: event.clientY,
            top: position.top,
            left: position.left,
          });
        }}
      >
        <div className="text-[15px] font-semibold text-slate-900">
          Text Settings
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-flex h-7 w-7 items-center justify-center text-slate-400">
            <HelpCircle className="h-4 w-4" />
          </span>
          <button
            type="button"
            data-testid="text-settings-close"
            title="Close"
            onClick={() => {
              dismissedIdRef.current = elementId;
              setOpen(false);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {hasInlineRange ? (
          <div
            data-testid="text-settings-inline-hint"
            className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800"
          >
            Formatting applies to the selected text.
          </div>
        ) : (
          <div
            data-testid="text-settings-element-hint"
            className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"
          >
            Formatting applies to the whole text element.
          </div>
        )}

        <div>
          <FieldLabel>Style</FieldLabel>
          <PanelSelect
            testId="text-settings-style"
            value={styleId}
            title="Text style"
            onChange={(id) => {
              const preset = TEXT_STYLE_PRESETS.find((item) => item.id === id);
              if (preset) apply(preset.style, true);
            }}
          >
            {TEXT_STYLE_PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </PanelSelect>
        </div>

        <div>
          <FieldLabel>Fonts</FieldLabel>
          <div data-testid="text-settings-font-family">
            <StudioFontPicker
              value={currentFont}
              onChange={(fontFamily) =>
                apply({
                  "font-family": fontFamily,
                  fontFamily,
                } as StylePatch)
              }
            />
          </div>
          <div className="mt-2">
            <PanelSelect
              testId="text-settings-font-weight"
              value={
                FONT_WEIGHTS.some((item) => item.value === currentWeight)
                  ? currentWeight
                  : boldActive
                    ? "700"
                    : "400"
              }
              title="Font weight"
              onChange={(fontWeight) =>
                apply({
                  "font-weight": fontWeight,
                  fontWeight,
                } as StylePatch)
              }
            >
              {FONT_WEIGHTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </PanelSelect>
          </div>
        </div>

        <div>
          <FieldLabel>Font size (px)</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={8}
              max={120}
              value={Math.min(120, Math.max(8, sizePx))}
              data-testid="text-settings-font-size-slider"
              onMouseDown={(event) => event.stopPropagation()}
              onChange={(event) => {
                const fontSize = `${event.target.value}px`;
                apply({
                  "font-size": fontSize,
                  fontSize,
                } as StylePatch);
              }}
              className="h-1 flex-1 accent-sky-600"
            />
            <input
              type="number"
              min={8}
              max={120}
              value={Math.round(sizePx) || 16}
              data-testid="text-settings-font-size"
              onMouseDown={(event) => event.stopPropagation()}
              onChange={(event) => {
                const fontSize = `${event.target.value}px`;
                apply({
                  "font-size": fontSize,
                  fontSize,
                } as StylePatch);
              }}
              className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-center text-sm font-semibold outline-none focus:border-violet-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <ToggleButton
            testId="text-settings-bold"
            title="Bold"
            disabled={locked}
            active={boldActive}
            onClick={() =>
              apply({
                "font-weight": boldActive ? "400" : "700",
                fontWeight: boldActive ? "400" : "700",
              } as StylePatch)
            }
          >
            <Bold className="h-4 w-4" />
          </ToggleButton>
          <ToggleButton
            testId="text-settings-italic"
            title="Italic"
            disabled={locked}
            active={italicActive}
            onClick={() =>
              apply({
                "font-style": italicActive ? "normal" : "italic",
                fontStyle: italicActive ? "normal" : "italic",
              } as StylePatch)
            }
          >
            <Italic className="h-4 w-4" />
          </ToggleButton>
          <ToggleButton
            testId="text-settings-underline"
            title="Underline"
            disabled={locked}
            active={underlineActive}
            onClick={() =>
              apply({
                "text-decoration": underlineActive ? "none" : "underline",
                textDecoration: underlineActive ? "none" : "underline",
              } as StylePatch)
            }
          >
            <Underline className="h-4 w-4" />
          </ToggleButton>
          <ColorSwatch
            testId="text-settings-color"
            title="Text color"
            value={isTransparentColor(currentColor) ? "#111827" : currentColor}
            fallback="#111827"
            onChange={(value) => {
              preview({
                color: value,
                "-webkit-text-fill-color": value,
                WebkitTextFillColor: value,
                backgroundImage: "none",
                "background-image": "none",
              } as StylePatch);
              apply({
                color: value,
                "-webkit-text-fill-color": value,
                WebkitTextFillColor: value,
                backgroundImage: "none",
                "background-image": "none",
              } as StylePatch);
            }}
          >
            <Palette className="h-4 w-4" />
          </ColorSwatch>
          <ColorSwatch
            testId="text-settings-highlight"
            title="Highlight"
            value={
              isTransparentColor(currentHighlight) ? "#fff59d" : currentHighlight
            }
            fallback="#fff59d"
            onChange={(value) =>
              apply({
                "background-color": value,
                backgroundColor: value,
              } as StylePatch)
            }
          >
            <Highlighter className="h-4 w-4" />
          </ColorSwatch>
          <ToggleButton
            testId="text-settings-link"
            title="Link"
            disabled={locked}
            onClick={() => editor?.openLinkSettings?.(elementId)}
          >
            <Link2 className="h-4 w-4" />
          </ToggleButton>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <ToggleButton
            testId="text-settings-align-left"
            title="Align left"
            disabled={locked}
            active={currentAlign === "left"}
            onClick={() =>
              apply(
                { "text-align": "left", textAlign: "left" } as StylePatch,
                true,
              )
            }
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleButton>
          <ToggleButton
            testId="text-settings-align-center"
            title="Align center"
            disabled={locked}
            active={currentAlign === "center"}
            onClick={() =>
              apply(
                { "text-align": "center", textAlign: "center" } as StylePatch,
                true,
              )
            }
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleButton>
          <ToggleButton
            testId="text-settings-align-right"
            title="Align right"
            disabled={locked}
            active={currentAlign === "right"}
            onClick={() =>
              apply(
                { "text-align": "right", textAlign: "right" } as StylePatch,
                true,
              )
            }
          >
            <AlignRight className="h-4 w-4" />
          </ToggleButton>
          <ToggleButton
            testId="text-settings-ltr"
            title="LTR"
            disabled={locked}
            active={currentDirection === "ltr"}
            onClick={() =>
              apply(
                {
                  direction: "ltr",
                  "unicode-bidi": "isolate",
                  unicodeBidi: "isolate",
                } as StylePatch,
                true,
              )
            }
          >
            LTR
          </ToggleButton>
          <ToggleButton
            testId="text-settings-rtl"
            title="RTL"
            disabled={locked}
            active={currentDirection === "rtl"}
            onClick={() =>
              apply(
                {
                  direction: "rtl",
                  "unicode-bidi": "isolate",
                  unicodeBidi: "isolate",
                } as StylePatch,
                true,
              )
            }
          >
            RTL
          </ToggleButton>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Line height</FieldLabel>
            <PanelSelect
              testId="text-settings-line-height"
              value={currentLineHeight}
              onChange={(lineHeight) =>
                apply(
                  { "line-height": lineHeight, lineHeight } as StylePatch,
                  true,
                )
              }
            >
              <option value="">Default</option>
              {LINE_HEIGHTS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </PanelSelect>
          </div>
          <div>
            <FieldLabel>Letter spacing</FieldLabel>
            <PanelSelect
              testId="text-settings-letter-spacing"
              value={currentLetterSpacing}
              onChange={(letterSpacing) =>
                apply(
                  {
                    "letter-spacing": letterSpacing,
                    letterSpacing,
                  } as StylePatch,
                  true,
                )
              }
            >
              <option value="">Default</option>
              {LETTER_SPACINGS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </PanelSelect>
          </div>
        </div>

        <div>
          <FieldLabel>Link</FieldLabel>
          <div className="flex gap-2">
            <input
              data-testid="text-settings-link-input"
              value={linkValue}
              placeholder="https://"
              onMouseDown={(event) => event.stopPropagation()}
              onChange={(event) => setLinkValue(event.target.value)}
              className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
            />
            <button
              type="button"
              data-testid="text-settings-link-apply"
              disabled={locked || !linkValue.trim()}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={() => {
                const href = linkValue.trim();
                if (!href) return;
                apply({ href } as StylePatch);
                editor?.updateLink?.(elementId, {
                  href,
                  target: href.startsWith("http") ? "_blank" : "_self",
                });
              }}
              className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-2">
          <button
            type="button"
            data-testid="text-settings-effects"
            onClick={() => setEffectsOpen((value) => !value)}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold text-slate-800"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Effects
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition ${
                effectsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {effectsOpen ? (
            <div className="pb-2">
              <button
                type="button"
                disabled={locked}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={() => {
                  if (hasTextGradient) {
                    apply(
                      {
                        "background-image": "none",
                        backgroundImage: "none",
                        color: "#111827",
                        "-webkit-text-fill-color": "#111827",
                        WebkitTextFillColor: "#111827",
                      } as StylePatch,
                      true,
                    );
                    return;
                  }
                  apply(
                    {
                      "background-image":
                        "linear-gradient(90deg, #7c3aed 0%, #f97316 100%)",
                      backgroundImage:
                        "linear-gradient(90deg, #7c3aed 0%, #f97316 100%)",
                      "background-clip": "text",
                      backgroundClip: "text",
                      "-webkit-background-clip": "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      "-webkit-text-fill-color": "transparent",
                      WebkitTextFillColor: "transparent",
                    } as StylePatch,
                    true,
                  );
                }}
                className={`mt-1 h-9 w-full rounded-lg border text-sm font-semibold ${
                  hasTextGradient
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {hasTextGradient ? "Clear text gradient" : "Text gradient"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
