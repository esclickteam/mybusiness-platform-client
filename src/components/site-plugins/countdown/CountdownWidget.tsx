import React, { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import CountdownEffects, { COUNTDOWN_EFFECT_STYLES } from "./CountdownEffects";
import {
  padUnit,
  previewCountdownUnits,
  resolveFontFamily,
  resolveSizeClasses,
  type CountdownSettings,
  type CountdownUnit,
} from "./countdownUtils";
import { useCountdownTimer } from "./useCountdownTimer";

type CountdownWidgetProps = {
  settings: CountdownSettings;
  preview?: boolean;
  editorMode?: boolean;
  onFloatingPositionChange?: (pos: { x: number; y: number }) => void;
};

function UnitBlock({
  unit,
  settings,
  preset,
  sizeClasses,
}: {
  unit: CountdownUnit;
  settings: CountdownSettings;
  preset: string;
  sizeClasses: ReturnType<typeof resolveSizeClasses>;
}) {
  const value = padUnit(unit.value, unit.key, settings);
  const font = resolveFontFamily(settings.fontPreset);
  const shadow = settings.shadowEnabled
    ? `0 12px 32px ${settings.shadowColor || "rgba(15,23,42,0.12)"}`
    : "none";
  const cardBg = settings.cardBackgroundColor || "#ffffff";

  if (preset === "pulse") {
    return (
      <div className="flex flex-col items-center px-2 sm:px-4">
        <span
          className={`countdown-pulse block font-black leading-none ${sizeClasses.pulseNumber}`}
          style={{ color: settings.numberColor, fontFamily: font, textShadow: shadow }}
        >
          {value}
        </span>
        <span
          className={`mt-2 font-bold uppercase tracking-wide ${sizeClasses.label}`}
          style={{ color: settings.labelColor, fontFamily: font }}
        >
          {unit.label}
        </span>
      </div>
    );
  }

  if (preset === "gradient" || preset === "neon") {
    return (
      <div className="flex min-w-[64px] flex-col items-center px-2 sm:min-w-[72px] sm:px-3">
        <span
          className={`block font-black leading-none ${sizeClasses.number} ${preset === "neon" ? "countdown-neon" : ""}`}
          style={{
            color: settings.numberColor,
            fontFamily: font,
            textShadow:
              preset === "neon"
                ? `0 0 18px ${settings.accentColor || "#a855f7"}`
                : shadow,
          }}
        >
          {value}
        </span>
        <span
          className={`mt-1.5 font-bold uppercase tracking-wider ${sizeClasses.label}`}
          style={{ color: settings.labelColor, fontFamily: font }}
        >
          {unit.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 text-center ${sizeClasses.card}`}
      style={{ background: cardBg, boxShadow: shadow }}
    >
      <span
        className={`block font-black leading-none ${sizeClasses.number}`}
        style={{ color: settings.numberColor, fontFamily: font }}
      >
        {value}
      </span>
      <span
        className={`mt-2 block font-bold uppercase tracking-wide ${sizeClasses.label}`}
        style={{ color: settings.labelColor, fontFamily: font }}
      >
        {unit.label}
      </span>
    </div>
  );
}

function CountdownBody({
  settings,
  preview,
  displayUnits,
  expired,
  endMs,
}: {
  settings: CountdownSettings;
  preview: boolean;
  displayUnits: CountdownUnit[];
  expired: boolean;
  endMs: number | null;
}) {
  const preset = settings.stylePreset || "cards";
  const font = resolveFontFamily(settings.fontPreset);
  const sizeClasses = resolveSizeClasses(settings.sizePreset);
  const isGradientBg = preset === "gradient";
  const isNeon = preset === "neon";
  const bg =
    isGradientBg || String(settings.backgroundColor || "").includes("gradient")
      ? settings.backgroundColor || "linear-gradient(135deg, #7C3AED 0%, #ec4899 100%)"
      : settings.backgroundColor || "transparent";

  const effectMode = settings.effectMode || "none";
  const effectWhen = settings.effectWhen || "onExpire";

  return (
    <div
      className={`relative overflow-visible rounded-2xl px-4 py-6 sm:px-6 sm:py-8 ${
        preset === "cards" ? "bg-transparent" : ""
      } ${isNeon ? "ring-1 ring-cyan-500/20" : ""}`}
      style={{ background: preset === "cards" ? "transparent" : bg }}
    >
      <CountdownEffects
        mode={effectMode}
        when={effectWhen}
        active={!expired || preview}
        expired={expired}
        preview={preview}
        accentColor={settings.accentColor}
      />

      {settings.title ? (
        <p
          className={`mb-5 text-center font-bold ${sizeClasses.title}`}
          style={{
            color: isGradientBg || isNeon ? settings.labelColor : settings.numberColor,
            fontFamily: font,
          }}
        >
          {settings.title}
        </p>
      ) : null}

      {!endMs && !preview ? (
        <p className="text-center text-sm text-slate-500">הגדירו תאריך סיום בהגדרות התוסף</p>
      ) : expired && !preview ? (
        <p
          className="text-center text-lg font-black"
          style={{ color: settings.accentColor || "#7C3AED", fontFamily: font }}
        >
          {settings.expiredMessage || "המבצע הסתיים"}
        </p>
      ) : (
        <div
          className={`flex flex-wrap items-center justify-center ${sizeClasses.gap}`}
          dir="rtl"
        >
          {displayUnits.map((unit) => (
            <UnitBlock
              key={unit.key}
              unit={unit}
              settings={settings}
              preset={preset}
              sizeClasses={sizeClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CountdownWidget({
  settings,
  preview = false,
  editorMode = false,
  onFloatingPositionChange,
}: CountdownWidgetProps) {
  const normalized = settings;
  const { units, expired, endMs } = useCountdownTimer(normalized);
  const font = resolveFontFamily(normalized.fontPreset);
  const sizeClasses = resolveSizeClasses(normalized.sizePreset);
  const layoutMode = normalized.layoutMode || "section";
  const isFloating = layoutMode === "floating";
  const position = normalized.floatingPosition || { x: 12, y: 78 };

  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  useEffect(() => {
    setDragPos(position);
  }, [position.x, position.y]);

  const displayUnits =
    preview && units.length === 0 ? previewCountdownUnits(normalized) : units;

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!editorMode || !isFloating) return;
      event.preventDefault();
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        origX: dragPos.x,
        origY: dragPos.y,
      };
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    },
    [dragPos.x, dragPos.y, editorMode, isFloating]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      const next = {
        x: Math.min(92, Math.max(4, dragRef.current.origX + (dx / window.innerWidth) * 100)),
        y: Math.min(92, Math.max(4, dragRef.current.origY + (dy / window.innerHeight) * 100)),
      };
      setDragPos(next);
    },
    []
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!dragRef.current) return;
      dragRef.current = null;
      onFloatingPositionChange?.(dragPos);
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    },
    [dragPos, onFloatingPositionChange]
  );

  const body = (
    <CountdownBody
      settings={normalized}
      preview={preview}
      displayUnits={displayUnits}
      expired={expired}
      endMs={endMs}
    />
  );

  const sharedStyles = (
    <style>{`
      @keyframes countdown-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
      }
      @keyframes countdown-neon-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.88; }
      }
      .countdown-pulse { animation: countdown-pulse 1.8s ease-in-out infinite; }
      .countdown-neon { animation: countdown-neon-flicker 2.4s ease-in-out infinite; }
      ${COUNTDOWN_EFFECT_STYLES}
    `}</style>
  );

  if (isFloating) {
    return (
      <div
        className="bizuply-countdown-widget pointer-events-none"
        data-bizuply-countdown="true"
        data-countdown-layout="floating"
        style={{ fontFamily: font, minHeight: 0 }}
      >
        {sharedStyles}
        <div
          className={`pointer-events-auto fixed z-[8600] w-[min(92vw,320px)] rounded-2xl border border-violet-200/80 bg-white/95 shadow-2xl backdrop-blur ${
            editorMode ? "ring-2 ring-violet-300" : ""
          }`}
          style={{
            left: `${dragPos.x}%`,
            top: `${dragPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {editorMode ? (
            <button
              type="button"
              aria-label="גרירת שעון"
              className="absolute -top-3 left-1/2 flex -translate-x-1/2 cursor-grab items-center gap-1 rounded-full border border-violet-200 bg-white px-2 py-1 text-[10px] font-black text-violet-700 shadow active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <GripVertical size={12} />
              גרירה
            </button>
          ) : null}
          <div className="p-3">{body}</div>
        </div>
      </div>
    );
  }

  const layoutClass =
    layoutMode === "compact"
      ? `mx-auto w-full ${sizeClasses.wrapper}`
      : "w-full";

  return (
    <div
      dir="rtl"
      className={`bizuply-countdown-widget ${layoutClass}`}
      data-bizuply-countdown="true"
      data-countdown-layout={layoutMode}
      style={{ fontFamily: font }}
    >
      {sharedStyles}
      {body}
    </div>
  );
}
