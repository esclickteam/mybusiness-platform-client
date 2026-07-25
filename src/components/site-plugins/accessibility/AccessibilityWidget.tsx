import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  ALargeSmall,
  Contrast,
  Droplets,
  Link2,
  MousePointer2,
  PauseCircle,
  RefreshCw,
  Type,
  UnfoldHorizontal,
  X,
} from "lucide-react";

import {
  ACCESSIBILITY_FEATURES,
  applyAccessibilityToDocument,
  clearVisitorAccessibilityState,
  createEmptyVisitorState,
  isFeatureEnabled,
  mergeAccessibilitySettings,
  readVisitorAccessibilityState,
  resetAccessibilityOnDocument,
  writeVisitorAccessibilityState,
  type AccessibilityFeatureKey,
  type AccessibilitySettings,
  type AccessibilityVisitorState,
} from "./accessibilityUtils";
import "./AccessibilityWidget.css";

type AccessibilityWidgetProps = {
  siteKey?: string;
  settings?: Partial<AccessibilitySettings> | null;
  mode?: "live" | "editor";
};

const FEATURE_ICONS: Record<
  AccessibilityFeatureKey,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  largeText: ALargeSmall,
  highContrast: Contrast,
  grayscale: Droplets,
  highlightLinks: Link2,
  stopAnimations: PauseCircle,
  readableFont: Type,
  textSpacing: UnfoldHorizontal,
  largeCursor: MousePointer2,
};

export default function AccessibilityWidget({
  siteKey = "site",
  settings: settingsProp,
  mode = "live",
}: AccessibilityWidgetProps) {
  const settings = useMemo(
    () => mergeAccessibilitySettings(settingsProp),
    [settingsProp]
  );
  const isEditor = mode === "editor";
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
  const positionClass =
    settings.widgetPosition === "bottom-right"
      ? "bizuply-a11y-trigger--right"
      : "bizuply-a11y-trigger--left";

  const visibleFeatures = ACCESSIBILITY_FEATURES.filter((feature) =>
    isFeatureEnabled(settings, feature.key)
  );

  function toggleFeature(key: AccessibilityFeatureKey) {
    if (isEditor) return;
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "largeText" && next.largeText && next.fontScale < 115) {
        next.fontScale = 120;
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

  return (
    <div
      className="bizuply-a11y-root"
      style={{ ["--biz-a11y-primary" as string]: accent }}
      data-bizuply-accessibility-widget="true"
      data-mode={mode}
    >
      <button
        type="button"
        className={`bizuply-a11y-trigger ${positionClass}`}
        aria-label="פתח תפריט נגישות"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="תפריט נגישות (Ctrl+U)"
        onClick={() => setOpen(true)}
      >
        <Accessibility size={28} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="bizuply-a11y-overlay"
          role="presentation"
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
                <div>
                  <h2 id={titleId} className="bizuply-a11y-title">
                    תפריט נגישות (Ctrl+U)
                  </h2>
                  <p className="bizuply-a11y-subtitle">
                    התאמות נגישות מובנות של BizUply
                  </p>
                </div>
                <button
                  type="button"
                  className="bizuply-a11y-close"
                  aria-label="סגור תפריט נגישות"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="bizuply-a11y-brand-chip">
                <span aria-hidden="true">◆</span>
                BizUply Accessibility
              </div>
            </header>

            <div className="bizuply-a11y-body">
              <div className="bizuply-a11y-grid" role="group" aria-label="אפשרויות נגישות">
                {visibleFeatures.map((feature) => {
                  const Icon = FEATURE_ICONS[feature.key];
                  const active = Boolean(state[feature.key]);
                  return (
                    <button
                      key={feature.key}
                      type="button"
                      className={`bizuply-a11y-tile${active ? " is-active" : ""}`}
                      aria-pressed={active}
                      title={feature.description}
                      onClick={() => toggleFeature(feature.key)}
                    >
                      <span className="bizuply-a11y-tile-icon" aria-hidden="true">
                        <Icon size={28} strokeWidth={2} />
                      </span>
                      <span className="bizuply-a11y-tile-label">{feature.label}</span>
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
}
