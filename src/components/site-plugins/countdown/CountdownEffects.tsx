import React, { useEffect, useMemo, useState } from "react";

import type { CountdownEffectMode, CountdownEffectWhen } from "./countdownUtils";

type CountdownEffectsProps = {
  mode: CountdownEffectMode;
  when: CountdownEffectWhen;
  active: boolean;
  expired: boolean;
  accentColor?: string;
};

function SparkleLayer({ accent }: { accent: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${10 + ((i * 23) % 72)}%`,
        delay: `${(i % 7) * 0.35}s`,
        size: 4 + (i % 3) * 2,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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

function BurstLayer({ accent, kind }: { accent: string; kind: "fireworks" | "confetti" }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: kind === "confetti" ? 36 : 24 }, (_, i) => ({
        id: i,
        left: `${50 + Math.sin(i) * 38}%`,
        color: i % 3 === 0 ? accent : i % 3 === 1 ? "#fbbf24" : "#ec4899",
        rotate: `${(i * 29) % 360}deg`,
        delay: `${(i % 8) * 0.04}s`,
      })),
    [accent, kind]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={kind === "confetti" ? "countdown-confetti" : "countdown-firework"}
          style={{
            left: piece.left,
            top: "42%",
            background: piece.color,
            animationDelay: piece.delay,
            transform: `rotate(${piece.rotate})`,
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
  accentColor = "#7C3AED",
}: CountdownEffectsProps) {
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (!expired) {
      setShowBurst(false);
      return;
    }
    if (when === "during") return;
    setShowBurst(true);
  }, [expired, when]);

  const showDuring =
    active &&
    !expired &&
    (when === "during" || when === "both") &&
    (mode === "sparkle" || mode === "glow");

  const showExpireBurst =
    expired &&
    (when === "onExpire" || when === "both") &&
    (mode === "fireworks" || mode === "confetti") &&
    showBurst;

  if (mode === "none") return null;

  return (
    <>
      {showDuring && mode === "sparkle" ? <SparkleLayer accent={accentColor} /> : null}
      {showDuring && mode === "glow" ? (
        <div
          className="countdown-glow pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: `0 0 40px ${accentColor}55` }}
          aria-hidden
        />
      ) : null}
      {showExpireBurst && mode === "fireworks" ? (
        <BurstLayer accent={accentColor} kind="fireworks" />
      ) : null}
      {showExpireBurst && mode === "confetti" ? (
        <BurstLayer accent={accentColor} kind="confetti" />
      ) : null}
    </>
  );
}

export const COUNTDOWN_EFFECT_STYLES = `
  @keyframes countdown-sparkle-pulse {
    0%, 100% { opacity: 0.15; transform: scale(0.8); }
    50% { opacity: 0.95; transform: scale(1.2); }
  }
  @keyframes countdown-firework-burst {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-120px) scale(0.2); }
  }
  @keyframes countdown-confetti-fall {
    0% { opacity: 1; transform: translateY(0) rotate(0deg); }
    100% { opacity: 0; transform: translateY(180px) rotate(540deg); }
  }
  @keyframes countdown-glow-pulse {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.85; }
  }
  .countdown-sparkle { animation: countdown-sparkle-pulse 2.2s ease-in-out infinite; }
  .countdown-firework {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    animation: countdown-firework-burst 1.4s ease-out forwards;
  }
  .countdown-confetti {
    position: absolute;
    width: 7px;
    height: 12px;
    border-radius: 2px;
    animation: countdown-confetti-fall 1.8s ease-in forwards;
  }
  .countdown-glow { animation: countdown-glow-pulse 1.6s ease-in-out infinite; }
`;
