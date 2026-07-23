import React, { useEffect, useMemo, useState } from "react";

import type { CountdownEffectMode, CountdownEffectWhen } from "./countdownUtils";

type CountdownEffectsProps = {
  mode: CountdownEffectMode;
  when: CountdownEffectWhen;
  active: boolean;
  expired: boolean;
  preview?: boolean;
  accentColor?: string;
};

function SparkleLayer({ accent }: { accent: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 19) % 88)}%`,
        top: `${8 + ((i * 27) % 78)}%`,
        delay: `${(i % 7) * 0.35}s`,
        size: 6 + (i % 4) * 2,
      })),
    []
  );

  return (
    <div className="countdown-fx-layer" aria-hidden>
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="countdown-sparkle absolute rounded-full"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            background: accent,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}

function ConfettiRain({ accent, burstKey }: { accent: string; burstKey: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: `${(i * 13) % 100}%`,
        color: i % 3 === 0 ? accent : i % 3 === 1 ? "#fbbf24" : "#ec4899",
        delay: `${(i % 10) * 0.12}s`,
        duration: `${1.4 + (i % 5) * 0.2}s`,
        rotate: (i * 37) % 360,
      })),
    [accent, burstKey]
  );

  return (
    <div className="countdown-fx-layer" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="countdown-confetti absolute"
          style={{
            left: piece.left,
            top: "-12%",
            background: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            ["--countdown-rotate" as string]: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function FireworksBurst({ accent, burstKey }: { accent: string; burstKey: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: `${48 + Math.sin(i * 0.9) * 34}%`,
        color: i % 2 === 0 ? accent : "#fbbf24",
        delay: `${(i % 6) * 0.05}s`,
        angle: (i * 360) / 28,
      })),
    [accent, burstKey]
  );

  return (
    <div className="countdown-fx-layer" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="countdown-firework absolute"
          style={{
            left: piece.left,
            top: "46%",
            background: piece.color,
            animationDelay: piece.delay,
            ["--countdown-angle" as string]: `${piece.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default function CountdownEffects({
  mode,
  when,
  active,
  expired,
  preview = false,
  accentColor = "#7C3AED",
}: CountdownEffectsProps) {
  const [burstKey, setBurstKey] = useState(0);

  const wantsDuring = when === "during" || when === "both";
  const wantsExpire = when === "onExpire" || when === "both";

  const showDuring = (preview || (active && !expired)) && wantsDuring;
  const showExpire = (preview && wantsExpire) || (expired && wantsExpire);

  const shouldRender =
    mode !== "none" &&
    (preview ? wantsDuring || wantsExpire : showDuring || showExpire);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const interval = window.setInterval(() => {
      setBurstKey((key) => key + 1);
    }, mode === "fireworks" ? 2200 : 2800);

    return () => window.clearInterval(interval);
  }, [mode, shouldRender]);

  useEffect(() => {
    if (expired && wantsExpire) {
      setBurstKey((key) => key + 1);
    }
  }, [expired, wantsExpire]);

  if (!shouldRender) return null;

  if (mode === "sparkle") return <SparkleLayer accent={accentColor} />;
  if (mode === "glow") {
    return (
      <div
        className="countdown-glow countdown-fx-layer rounded-2xl"
        style={{ boxShadow: `0 0 48px ${accentColor}88, inset 0 0 24px ${accentColor}33` }}
        aria-hidden
      />
    );
  }
  if (mode === "confetti") return <ConfettiRain accent={accentColor} burstKey={burstKey} />;
  if (mode === "fireworks") return <FireworksBurst accent={accentColor} burstKey={burstKey} />;

  return null;
}

export const COUNTDOWN_EFFECT_STYLES = `
  .countdown-fx-layer {
    pointer-events: none;
    position: absolute;
    inset: -20px;
    overflow: visible;
    z-index: 5;
  }
  @keyframes countdown-sparkle-pulse {
    0%, 100% { opacity: 0.2; transform: scale(0.75); }
    50% { opacity: 1; transform: scale(1.25); }
  }
  @keyframes countdown-firework-burst {
    0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--countdown-angle, 0deg)) translateY(0) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--countdown-angle, 0deg)) translateY(-110px) scale(0.15); }
  }
  @keyframes countdown-confetti-fall {
    0% { opacity: 0; transform: translateY(-10px) rotate(var(--countdown-rotate, 0deg)); }
    12% { opacity: 1; }
    100% { opacity: 0; transform: translateY(220px) rotate(calc(var(--countdown-rotate, 0deg) + 540deg)); }
  }
  @keyframes countdown-glow-pulse {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 1; }
  }
  .countdown-sparkle { animation: countdown-sparkle-pulse 2.2s ease-in-out infinite; }
  .countdown-firework {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    animation: countdown-firework-burst 1.5s ease-out infinite;
  }
  .countdown-confetti {
    width: 9px;
    height: 14px;
    border-radius: 2px;
    animation: countdown-confetti-fall 2.2s linear infinite;
  }
  .countdown-glow { animation: countdown-glow-pulse 1.6s ease-in-out infinite; }
`;
