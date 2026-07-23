import React from "react";

import {
  padUnit,
  resolveFontFamily,
  type CountdownSettings,
  type CountdownUnit,
} from "./countdownUtils";
import { useCountdownTimer } from "./useCountdownTimer";

type CountdownWidgetProps = {
  settings: CountdownSettings;
  preview?: boolean;
};

function UnitBlock({
  unit,
  settings,
  preset,
}: {
  unit: CountdownUnit;
  settings: CountdownSettings;
  preset: string;
}) {
  const value = padUnit(unit.value);
  const font = resolveFontFamily(settings.fontPreset);
  const shadow = settings.shadowEnabled
    ? `0 12px 32px ${settings.shadowColor || "rgba(15,23,42,0.12)"}`
    : "none";

  if (preset === "pulse") {
    return (
      <div className="flex flex-col items-center px-2 sm:px-4">
        <span
          className="countdown-pulse block text-[clamp(2rem,6vw,3.5rem)] font-black leading-none"
          style={{ color: settings.numberColor, fontFamily: font, textShadow: shadow }}
        >
          {value}
        </span>
        <span
          className="mt-2 text-xs font-bold uppercase tracking-wide"
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
          className={`block text-3xl font-black leading-none sm:text-4xl ${preset === "neon" ? "countdown-neon" : ""}`}
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
          className="mt-1.5 text-[10px] font-bold uppercase tracking-wider sm:text-xs"
          style={{ color: settings.labelColor, fontFamily: font }}
        >
          {unit.label}
        </span>
      </div>
    );
  }

  // cards (default)
  return (
    <div
      className="min-w-[72px] rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center sm:min-w-[84px] sm:px-5 sm:py-4"
      style={{ boxShadow: shadow }}
    >
      <span
        className="block text-3xl font-black leading-none sm:text-4xl"
        style={{ color: settings.numberColor, fontFamily: font }}
      >
        {value}
      </span>
      <span
        className="mt-2 block text-[10px] font-bold uppercase tracking-wide sm:text-xs"
        style={{ color: settings.labelColor, fontFamily: font }}
      >
        {unit.label}
      </span>
    </div>
  );
}

export default function CountdownWidget({ settings, preview = false }: CountdownWidgetProps) {
  const normalized = settings;
  const { units, expired, endMs } = useCountdownTimer(normalized);
  const preset = normalized.stylePreset || "cards";
  const font = resolveFontFamily(normalized.fontPreset);
  const isGradientBg = preset === "gradient";
  const isNeon = preset === "neon";
  const bg =
    isGradientBg || String(normalized.backgroundColor || "").includes("gradient")
      ? normalized.backgroundColor ||
        "linear-gradient(135deg, #7C3AED 0%, #ec4899 100%)"
      : normalized.backgroundColor || "transparent";

  const displayUnits =
    preview && units.length === 0
      ? [
          { key: "days" as const, label: "ימים", value: 3 },
          { key: "hours" as const, label: "שעות", value: 12 },
          { key: "minutes" as const, label: "דקות", value: 45 },
          { key: "seconds" as const, label: "שניות", value: 22 },
        ].filter((u) => {
          if (u.key === "days") return normalized.showDays !== false;
          if (u.key === "hours") return normalized.showHours !== false;
          if (u.key === "minutes") return normalized.showMinutes !== false;
          return normalized.showSeconds !== false;
        })
      : units;

  return (
    <div
      dir="rtl"
      className="bizuply-countdown-widget w-full"
      data-bizuply-countdown="true"
      style={{ fontFamily: font }}
    >
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
      `}</style>

      <div
        className={`rounded-2xl px-4 py-6 sm:px-6 sm:py-8 ${
          preset === "cards" ? "bg-transparent" : ""
        } ${isNeon ? "ring-1 ring-cyan-500/20" : ""}`}
        style={{
          background: preset === "cards" ? "transparent" : bg,
        }}
      >
        {normalized.title ? (
          <p
            className="mb-5 text-center text-base font-bold sm:text-lg"
            style={{
              color: isGradientBg || isNeon ? normalized.labelColor : normalized.numberColor,
              fontFamily: font,
            }}
          >
            {normalized.title}
          </p>
        ) : null}

        {!endMs && !preview ? (
          <p className="text-center text-sm text-slate-500">הגדירו תאריך סיום בהגדרות התוסף</p>
        ) : expired && !preview ? (
          <p
            className="text-center text-lg font-black"
            style={{ color: normalized.accentColor || "#7C3AED", fontFamily: font }}
          >
            {normalized.expiredMessage || "המבצע הסתיים"}
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {displayUnits.map((unit) => (
              <UnitBlock key={unit.key} unit={unit} settings={normalized} preset={preset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
