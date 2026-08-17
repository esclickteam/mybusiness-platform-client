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
import {
  clearTextRangeSnapshot,
  getLiveTextRange,
  peekTextRangeSnapshot,
  snapshotTextRange,
} from "./utils/richTextHtml";
import { resolvePersistedVisualId } from "./utils/visualPersistId";
import {
  clampPanelToViewport,
  placeTextSettingsPanel,
  TEXT_SETTINGS_PANEL_WIDTH,
  type TextSettingsPlacementSide,
} from "./utils/textSettingsPlacement";

type VisualTextSettingsPanelProps = {
  editor: any;
};

const FONT_WEIGHTS = [
  { label: "רגיל", value: "400" },
  { label: "בינוני", value: "500" },
  { label: "חצי מודגש", value: "600" },
  { label: "מודגש", value: "700" },
  { label: "שחור", value: "900" },
];

const STYLE_LABELS: Record<string, string> = {
  h1: "כותרת 1",
  h2: "כותרת 2",
  h3: "כותרת 3",
  h4: "כותרת 4",
  paragraph: "פסקה",
};

const LINE_HEIGHTS = ["1", "1.15", "1.3", "1.5", "1.7", "2"];
const LETTER_SPACINGS = ["-1px", "0px", "0.5px", "1px", "2px", "4px"];

function getElementNode(element: any): HTMLElement | null {
  let node =
    element?.node || element?.domNode || element?.element || null;
  if (!(node instanceof HTMLElement)) return null;

  while (node.parentElement) {
    const paint = node.getAttribute("data-visual-rich-paint") === "true";
    const elementLink = node.getAttribute("data-visual-element-link") === "true";
    const mark = node.getAttribute("data-visual-inline-mark") === "true";
    if (!paint && !elementLink && !mark) break;
    const parent = node.parentElement;
    if (!parent.getAttribute("data-visual-edit-id")) break;
    node = parent;
  }

  return node;
}

function getStableVisualId(node: HTMLElement | null, fallback = "") {
  return resolvePersistedVisualId(node, fallback);
}

function getElementId(element: any) {
  const node = getElementNode(element);
  return getStableVisualId(
    node,
    String(element?.id || element?.elementId || element?.visualId || "").trim(),
  );
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
    <div className="mb-1.5 text-right text-[11px] font-bold tracking-wide text-slate-500">
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
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pl-8 text-right text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-violet-400"
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
      aria-label={title}
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
      data-active={active ? "true" : "false"}
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
      aria-label={title}
      data-testid={testId}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={() => onChange(safe)}
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
        onInput={(event) => onChange(event.currentTarget.value)}
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
  const panelRef = useRef<HTMLElement | null>(null);
  const userDraggedRef = useRef(false);
  const lastPlacedIdRef = useRef("");
  const [position, setPosition] = useState({ top: 148, left: 24 });
  const [placementSide, setPlacementSide] = useState<TextSettingsPlacementSide>("right");
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
    if (lastPlacedIdRef.current !== elementId) {
      userDraggedRef.current = false;
      lastPlacedIdRef.current = elementId;
    }
    setOpen(true);
  }, [elementId, isText]);

  useEffect(() => {
    if (!node || !elementId || !isText) return;

    const reopen = () => {
      if (dismissedIdRef.current !== elementId) return;
      dismissedIdRef.current = "";
      userDraggedRef.current = false;
      setOpen(true);
    };

    node.addEventListener("click", reopen);
    return () => node.removeEventListener("click", reopen);
  }, [elementId, isText, node]);

  useEffect(() => {
    if (!open || !node || typeof window === "undefined") return;

    const placeBesideElement = () => {
      if (userDraggedRef.current) {
        const box = panelRef.current?.getBoundingClientRect();
        setPosition((current) =>
          clampPanelToViewport(
            current,
            {
              width: box?.width || TEXT_SETTINGS_PANEL_WIDTH,
              height: box?.height || 480,
            },
            { width: window.innerWidth, height: window.innerHeight },
          ),
        );
        return;
      }

      if (!node.isConnected) {
        return;
      }

      const blockRect = node.getBoundingClientRect();
      let rect = blockRect;
      try {
        const range = document.createRange();
        range.selectNodeContents(node);
        const contentRect = range.getBoundingClientRect();
        if (contentRect.width >= 40 && contentRect.height >= 8) {
          rect = contentRect;
        }
      } catch {
        rect = blockRect;
      }
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      const box = panelRef.current?.getBoundingClientRect();
      const placed = placeTextSettingsPanel({
        element: rect,
        panel: {
          width: box?.width || TEXT_SETTINGS_PANEL_WIDTH,
          height: box?.height || 520,
        },
        viewport,
      });
      setPosition({ top: placed.top, left: placed.left });
      setPlacementSide(placed.side);
    };

    placeBesideElement();
    const frame = window.requestAnimationFrame(placeBesideElement);
    window.addEventListener("resize", placeBesideElement);
    window.addEventListener("scroll", placeBesideElement, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", placeBesideElement);
      window.removeEventListener("scroll", placeBesideElement, true);
    };
  }, [elementId, node, open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("[data-visual-text-settings-panel='true']")) return;
      if (target.closest("[data-visual-font-picker='true']")) return;
      if (target.closest("[data-visual-floating-toolbar='true']")) return;
      if (node?.contains(target)) return;
      if (target.closest("[data-visual-edit-id], [data-visual-editable='true']")) {
        return;
      }
      editor?.clearSelection?.();
      dismissedIdRef.current = elementId;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown, true);
    return () => document.removeEventListener("mousedown", onPointerDown, true);
  }, [editor, elementId, node, open]);

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
    clearTextRangeSnapshot();
    setHasInlineRange(false);
  }, [elementId]);

  useEffect(() => {
    if (!open || !node) return;

    const syncRange = (fromNodeClick = false) => {
      const live = Boolean(getLiveTextRange(node));
      if (live) {
        snapshotTextRange(node, elementId);
        setHasInlineRange(true);
        return;
      }
      if (fromNodeClick) {
        clearTextRangeSnapshot(elementId);
        setHasInlineRange(false);
        return;
      }
      setHasInlineRange(Boolean(peekTextRangeSnapshot(elementId)));
    };

    const onSelectionChange = () => syncRange(false);
    const onNodeMouseUp = () => syncRange(true);

    document.addEventListener("selectionchange", onSelectionChange);
    node.addEventListener("mouseup", onNodeMouseUp);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      node.removeEventListener("mouseup", onNodeMouseUp);
    };
  }, [elementId, node, open]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: MouseEvent) => {
      const box = panelRef.current?.getBoundingClientRect();
      setPosition(
        clampPanelToViewport(
          {
            top: dragging.top + event.clientY - dragging.y,
            left: dragging.left + event.clientX - dragging.x,
          },
          {
            width: box?.width || TEXT_SETTINGS_PANEL_WIDTH,
            height: box?.height || 480,
          },
          { width: window.innerWidth, height: window.innerHeight },
        ),
      );
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
      ref={panelRef}
      dir="rtl"
      data-visual-text-settings-panel="true"
      data-testid="visual-text-settings-panel"
      data-floating-panel="true"
      data-panel-sidebar="false"
      data-panel-placement={placementSide}
      onMouseDown={(event) => {
        event.stopPropagation();
        snapshotTextRange(node, elementId);
      }}
      onClick={(event) => event.stopPropagation()}
      className="pointer-events-auto fixed z-[2147483001] flex w-[min(320px,calc(100vw-24px))] max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-right shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      style={{ top: position.top, left: position.left }}
    >
      <header
        className="flex cursor-grab items-center justify-between border-b border-slate-100 px-4 py-3 active:cursor-grabbing"
        onMouseDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          snapshotTextRange(node, elementId, { clearIfNone: true });
          setHasInlineRange(false);
          userDraggedRef.current = true;
          setDragging({
            x: event.clientX,
            y: event.clientY,
            top: position.top,
            left: position.left,
          });
        }}
      >
        <div className="text-[15px] font-semibold text-slate-900">
          הגדרות טקסט
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-flex h-7 w-7 items-center justify-center text-slate-400" title="עזרה" aria-label="עזרה">
            <HelpCircle className="h-4 w-4" />
          </span>
          <button
            type="button"
            data-testid="text-settings-close"
            title="סגירה"
            aria-label="סגירה"
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
            העיצוב חל על הטקסט שנבחר.
          </div>
        ) : (
          <div
            data-testid="text-settings-element-hint"
            className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"
          >
            העיצוב חל על כל אלמנט הטקסט.
          </div>
        )}

        <div>
          <FieldLabel>סגנון</FieldLabel>
          <PanelSelect
            testId="text-settings-style"
            value={styleId}
            title="סגנון טקסט"
            onChange={(id) => {
              const preset = TEXT_STYLE_PRESETS.find((item) => item.id === id);
              if (preset) apply(preset.style, true);
            }}
          >
            {TEXT_STYLE_PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {STYLE_LABELS[item.id] || item.label}
              </option>
            ))}
          </PanelSelect>
        </div>

        <div>
          <FieldLabel>גופן</FieldLabel>
          <div data-testid="text-settings-font-family">
            <StudioFontPicker
              value={currentFont}
              searchPlaceholder="חיפוש גופנים..."
              closeAriaLabel="סגור גופנים"
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
              title="משקל"
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
          <FieldLabel>גודל גופן (px)</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={8}
              max={120}
              value={Math.min(120, Math.max(8, sizePx))}
              data-testid="text-settings-font-size-slider"
              aria-label="גודל גופן"
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
              aria-label="גודל גופן"
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
            title="מודגש"
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
            title="נטוי"
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
            title="קו תחתון"
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
            title="צבע טקסט"
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
            title="הדגשה"
            value={
              isTransparentColor(currentHighlight) ? "#fff59d" : currentHighlight
            }
            fallback="#fff59d"
            onChange={(value) =>
              apply(
                {
                  "background-color": value,
                  backgroundColor: value,
                } as StylePatch,
                !hasInlineRange,
              )
            }
          >
            <Highlighter className="h-4 w-4" />
          </ColorSwatch>
          <ToggleButton
            testId="text-settings-link"
            title="קישור"
            disabled={locked}
            onClick={() => editor?.openLinkSettings?.(elementId)}
          >
            <Link2 className="h-4 w-4" />
          </ToggleButton>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <ToggleButton
            testId="text-settings-align-left"
            title="יישור לשמאל"
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
            title="יישור למרכז"
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
            title="יישור לימין"
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
            title="משמאל לימין"
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
            title="מימין לשמאל"
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
            <FieldLabel>גובה שורה</FieldLabel>
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
              <option value="">ברירת מחדל</option>
              {LINE_HEIGHTS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </PanelSelect>
          </div>
          <div>
            <FieldLabel>ריווח אותיות</FieldLabel>
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
              <option value="">ברירת מחדל</option>
              {LETTER_SPACINGS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </PanelSelect>
          </div>
        </div>

        <div>
          <FieldLabel>קישור</FieldLabel>
          <div className="flex gap-2">
            <input
              data-testid="text-settings-link-input"
              value={linkValue}
              placeholder="הדביקו קישור"
              aria-label="קישור"
              onMouseDown={(event) => event.stopPropagation()}
              onChange={(event) => setLinkValue(event.target.value)}
              className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
            />
            <button
              type="button"
              data-testid="text-settings-link-apply"
              title="החל"
              aria-label="החל"
              disabled={locked || !linkValue.trim()}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={() => {
                const href = linkValue.trim();
                if (!href) return;
                const target = href.startsWith("http") ? "_blank" : "_self";
                if (hasInlineRange) {
                  apply({ href, target } as StylePatch);
                  return;
                }
                apply({ href, target } as StylePatch, true);
                editor?.updateLink?.(elementId, { href, target });
              }}
              className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-40"
            >
              החל
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-2">
          <button
            type="button"
            data-testid="text-settings-effects"
            title="אפקטים"
            onClick={() => setEffectsOpen((value) => !value)}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold text-slate-800"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              אפקטים
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
                {hasTextGradient ? "נקה גרדיאנט טקסט" : "גרדיאנט טקסט"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
