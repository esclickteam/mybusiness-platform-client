import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Accessibility,
  ALargeSmall,
  AlignRight,
  Contrast,
  Droplets,
  ImageOff,
  Info,
  Link2,
  MousePointer2,
  PauseCircle,
  RefreshCw,
  UnfoldHorizontal,
  UnfoldVertical,
  X,
} from "lucide-react";

import {
  ACCESSIBILITY_FEATURES,
  applyAccessibilityToDocument,
  clearVisitorAccessibilityState,
  createEmptyVisitorState,
  cycleLevel,
  getFeatureLabel,
  isFeatureActive,
  isFeatureEnabled,
  mergeAccessibilitySettings,
  readVisitorAccessibilityState,
  resetAccessibilityOnDocument,
  writeVisitorAccessibilityState,
  type AccessibilityFeatureKey,
  type AccessibilitySettings,
  type AccessibilityVisitorState,
  type ContrastLevel,
  type IntensityLevel,
  type SaturationLevel,
} from "./accessibilityUtils";
import "./AccessibilityWidget.css";

type AccessibilityWidgetProps = {
  siteKey?: string;
  settings?: Partial<AccessibilitySettings> | null;
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

const FEATURE_ICONS: Record<
  AccessibilityFeatureKey,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  highlightLinks: Link2,
  contrast: Contrast,
  textSpacing: UnfoldHorizontal,
  largeText: ALargeSmall,
  hideImages: ImageOff,
  stopAnimations: PauseCircle,
  largeCursor: MousePointer2,
  dyslexia: ALargeSmall,
  lineHeight: UnfoldVertical,
  descriptions: Info,
  saturation: Droplets,
  textAlign: AlignRight,
};

function DyslexiaIcon({ size = 28 }: { size?: number; strokeWidth?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: Math.round(size * 0.78),
        fontWeight: 800,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
    >
      Df
    </span>
  );
}

export default function AccessibilityWidget({
  siteKey = "site",
  settings: settingsProp,
  mode = "live",
  onPositionChange,
}: AccessibilityWidgetProps) {
  const settings = useMemo(
    () => mergeAccessibilitySettings(settingsProp),
    [settingsProp]
  );
  const isEditor = mode === "editor";
  const position = settings.triggerPosition || {
    x: settings.widgetPosition === "bottom-right" ? 8 : 88,
    y: 88,
  };
  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const dragPosRef = useRef(dragPos);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (dragRef.current) return;
    setDragPos(position);
    dragPosRef.current = position;
  }, [position.x, position.y]);

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPosRef.current.x,
      origY: dragPosRef.current.y,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) dragRef.current.moved = true;
    const next = {
      x: Math.min(94, Math.max(6, dragRef.current.origX - dx)),
      y: Math.min(94, Math.max(6, dragRef.current.origY + dy)),
    };
    dragPosRef.current = next;
    setDragPos(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const moved = dragRef.current.moved;
    dragRef.current = null;
    if (moved) {
      suppressClickRef.current = true;
      onPositionChange?.(dragPosRef.current);
      e.preventDefault();
      e.stopPropagation();
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AccessibilityVisitorState>(() =>
    isEditor
      ? createEmptyVisitorState(settings.defaultFontScale)
      : readVisitorAccessibilityState(siteKey)
  );

  useEffect(() => {
    if (isEditor) return;
    const next = readVisitorAccessibilityState(siteKey);
    setState(next);
    applyAccessibilityToDocument(next);
  }, [isEditor, siteKey]);

  useEffect(() => {
    if (isEditor) return;
    applyAccessibilityToDocument(state);
    writeVisitorAccessibilityState(siteKey, state);
  }, [isEditor, siteKey, state]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button, [href], input, select, textarea")
        ?.focus();
    }, 40);
    return () => window.clearTimeout(t);
  }, [open]);

  if (settings.isActive === false) return null;

  const accent = settings.accentColor || "#7C3AED";
  // Trigger defaults to left; panel always docks left.
  const triggerSide =
    settings.widgetPosition === "bottom-right" ? "right" : "left";
  const useFreePos = Boolean(settings.triggerPosition) || isEditor;

  const visibleFeatures = ACCESSIBILITY_FEATURES.filter((feature) =>
    isFeatureEnabled(settings, feature.key)
  );

  function activateFeature(key: AccessibilityFeatureKey) {
    if (isEditor) return;
    setState((prev) => {
      const next: AccessibilityVisitorState = { ...prev };

      if (key === "contrast") {
        next.contrast = cycleLevel(prev.contrast) as ContrastLevel;
        return next;
      }
      if (key === "saturation") {
        next.saturation = cycleLevel(prev.saturation) as SaturationLevel;
        return next;
      }
      if (key === "textSpacing") {
        next.textSpacing = cycleLevel(prev.textSpacing) as IntensityLevel;
        return next;
      }
      if (key === "lineHeight") {
        next.lineHeight = cycleLevel(prev.lineHeight) as IntensityLevel;
        return next;
      }
      if (key === "largeText") {
        next.largeText = !prev.largeText;
        if (next.largeText && next.fontScale < 115) next.fontScale = 120;
        if (!next.largeText) next.fontScale = settings.defaultFontScale || 100;
        return next;
      }

      if (
        key === "highlightLinks" ||
        key === "hideImages" ||
        key === "stopAnimations" ||
        key === "largeCursor" ||
        key === "dyslexia" ||
        key === "descriptions" ||
        key === "textAlign"
      ) {
        next[key] = !prev[key];
      }
      return next;
    });
  }

  function handleFontScale(value: number) {
    if (isEditor) return;
    setState((prev) => ({
      ...prev,
      largeText: value > 100,
      fontScale: value,
    }));
  }

  function handleReset() {
    if (isEditor) return;
    const empty = createEmptyVisitorState(settings.defaultFontScale || 100);
    setState(empty);
    clearVisitorAccessibilityState(siteKey);
    resetAccessibilityOnDocument();
  }

  const ui = (
    <div
      className="bizuply-a11y-root"
      style={{ ["--biz-a11y-primary" as string]: accent }}
      data-bizuply-accessibility-widget="true"
      data-mode={mode}
    >
      <button
        type="button"
        className={`bizuply-a11y-trigger ${
          useFreePos
            ? "bizuply-a11y-trigger--free"
            : `bizuply-a11y-trigger--${triggerSide}`
        } ${isEditor ? "ring-2 ring-violet-300 ring-offset-2" : ""}`}
        style={
          useFreePos
            ? {
                ...(dragPos.x > 50
                  ? { left: `${100 - dragPos.x}%`, right: "auto" }
                  : { right: `${dragPos.x}%`, left: "auto" }),
                bottom: `${100 - dragPos.y}%`,
                maxWidth: "calc(100vw - 1.5rem)",
              }
            : undefined
        }
        aria-label="פתח תפריט נגישות"
        aria-haspopup="dialog"
        aria-expanded={open}
        title={isEditor ? "גררו לכל מקום בעמוד" : "תפריט נגישות (Ctrl+U)"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => {
          if (suppressClickRef.current) return;
          if (isEditor) return;
          setOpen(true);
        }}
      >
        <Accessibility size={28} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="bizuply-a11y-overlay"
          role="presentation"
          onMouseDown={(e) => {
            // Prevent backdrop close when interacting with contrast filters
            // that temporarily reshuffle hit-testing.
            e.stopPropagation();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={panelRef}
            className="bizuply-a11y-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <header className="bizuply-a11y-header">
              <div className="bizuply-a11y-header-row">
                <button
                  type="button"
                  className="bizuply-a11y-close"
                  aria-label="סגור תפריט נגישות"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
                <div className="bizuply-a11y-header-text">
                  <h2 id={titleId} className="bizuply-a11y-title">
                    תפריט נגישות (Ctrl+U)
                  </h2>
                  <p className="bizuply-a11y-subtitle">
                    התאמות נגישות מובנות של BizUply
                  </p>
                </div>
              </div>
              <div className="bizuply-a11y-brand-chip">
                <span aria-hidden="true">◆</span>
                BizUply Accessibility
              </div>
            </header>

            <div className="bizuply-a11y-body">
              <div className="bizuply-a11y-grid" role="group" aria-label="אפשרויות נגישות">
                {visibleFeatures.map((feature) => {
                  const Icon =
                    feature.key === "dyslexia"
                      ? DyslexiaIcon
                      : FEATURE_ICONS[feature.key];
                  const active = isFeatureActive(state, feature.key);
                  const label = getFeatureLabel(feature.key, state, feature.label);
                  const level =
                    feature.key === "contrast"
                      ? state.contrast
                      : feature.key === "saturation"
                        ? state.saturation
                        : feature.key === "textSpacing"
                          ? state.textSpacing
                          : feature.key === "lineHeight"
                            ? state.lineHeight
                            : 0;

                  return (
                    <button
                      key={feature.key}
                      type="button"
                      className={`bizuply-a11y-tile${active ? " is-active" : ""}`}
                      aria-pressed={active}
                      title={feature.description}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        activateFeature(feature.key);
                      }}
                    >
                      <span className="bizuply-a11y-tile-icon" aria-hidden="true">
                        <Icon size={28} strokeWidth={2} />
                      </span>
                      <span className="bizuply-a11y-tile-label">{label}</span>
                      {active && level > 0 ? (
                        <span
                          className="bizuply-a11y-level"
                          style={{ width: `${(level / 3) * 100}%` }}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {isFeatureEnabled(settings, "largeText") ? (
                <div className="bizuply-a11y-scale">
                  <label htmlFor="bizuply-a11y-font-scale">
                    <span>גודל טקסט</span>
                    <span>{state.fontScale}%</span>
                  </label>
                  <input
                    id="bizuply-a11y-font-scale"
                    type="range"
                    min={100}
                    max={180}
                    step={10}
                    value={state.fontScale}
                    disabled={isEditor}
                    onChange={(e) => handleFontScale(Number(e.target.value) || 100)}
                  />
                </div>
              ) : null}
            </div>

            <footer className="bizuply-a11y-footer">
              <button
                type="button"
                className="bizuply-a11y-reset"
                onClick={handleReset}
                disabled={isEditor}
              >
                <RefreshCw size={18} aria-hidden="true" />
                איפוס את כל הגדרות הנגישות
              </button>
              <div className="bizuply-a11y-powered">מופעל על ידי BizUply · ללא עלות חיצונית</div>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );

  // Portal outside <body> so body filters (contrast/saturation) cannot break
  // position:fixed and make the menu jump/close on the 2nd contrast click.
  if (typeof document === "undefined") return ui;
  return createPortal(ui, document.documentElement);
}
