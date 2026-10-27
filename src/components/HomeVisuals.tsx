import type { ReactNode } from "react";

type ArtProps = { index: number };

function Frame({ children, tone }: { children: ReactNode; tone: string }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden="true" className={`home-art home-art--${tone}`}>
      <rect width="320" height="180" rx="18" fill="currentColor" opacity="0.08" />
      {children}
    </svg>
  );
}

export function WayArt({ index }: ArtProps) {
  if (index === 0) {
    return (
      <Frame tone="indigo">
        <rect x="28" y="36" width="120" height="16" rx="8" fill="#4f46e5" />
        <rect x="28" y="64" width="168" height="10" rx="5" fill="#94a3b8" />
        <rect x="28" y="84" width="140" height="10" rx="5" fill="#cbd5e1" />
        <rect x="28" y="112" width="78" height="28" rx="8" fill="#4f46e5" />
        <rect x="214" y="40" width="78" height="100" rx="12" fill="#eef2ff" />
        <rect x="226" y="54" width="54" height="8" rx="4" fill="#4f46e5" />
        <rect x="226" y="72" width="42" height="8" rx="4" fill="#a5b4fc" />
        <rect x="226" y="90" width="48" height="8" rx="4" fill="#a5b4fc" />
      </Frame>
    );
  }
  if (index === 1) {
    return (
      <Frame tone="sky">
        <rect x="36" y="28" width="248" height="124" rx="14" fill="#0f172a" />
        <rect x="52" y="44" width="72" height="8" rx="4" fill="#67e8f9" />
        <rect x="52" y="64" width="150" height="16" rx="6" fill="#ffffff" />
        <rect x="52" y="90" width="110" height="8" rx="4" fill="#94a3b8" />
        <rect x="52" y="112" width="64" height="22" rx="11" fill="#22d3ee" />
      </Frame>
    );
  }
  if (index === 2) {
    return (
      <Frame tone="violet">
        <circle cx="78" cy="90" r="28" fill="#7c3aed" />
        <circle cx="160" cy="90" r="28" fill="#4f46e5" />
        <circle cx="242" cy="90" r="28" fill="#0891b2" />
        <path d="M106 90h26M188 90h26" stroke="#c4b5fd" strokeWidth="4" />
      </Frame>
    );
  }
  return (
    <Frame tone="emerald">
      <rect x="40" y="46" width="240" height="88" rx="16" fill="#ecfdf5" />
      <circle cx="78" cy="90" r="18" fill="#10b981" />
      <rect x="108" y="74" width="140" height="10" rx="5" fill="#065f46" />
      <rect x="108" y="94" width="96" height="8" rx="4" fill="#6ee7b7" />
    </Frame>
  );
}

export function AudienceArt({ index }: ArtProps) {
  const tones = ["#4f46e5", "#0891b2", "#7c3aed", "#0f766e"];
  const color = tones[index] || tones[0];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="home-audience__mark">
      <rect width="64" height="64" rx="16" fill={color} opacity="0.12" />
      {index === 0 ? <path d="M18 42V28h10v14H18zm18 0V18h10v24H36z" fill={color} /> : null}
      {index === 1 ? <path d="M16 40c6-12 26-12 32 0" fill="none" stroke={color} strokeWidth="4" /> : null}
      {index === 1 ? <circle cx="32" cy="24" r="6" fill={color} /> : null}
      {index === 2 ? <path d="M18 40 32 16l14 24H18z" fill={color} /> : null}
      {index === 3 ? (
        <>
          <circle cx="24" cy="26" r="6" fill={color} />
          <circle cx="40" cy="26" r="6" fill={color} opacity="0.7" />
          <path d="M14 46c2-8 12-8 16 0M34 46c2-8 12-8 16 0" fill={color} />
        </>
      ) : null}
    </svg>
  );
}

export function WhyArt({ index }: ArtProps) {
  return (
    <svg viewBox="0 0 160 96" aria-hidden="true" className="home-why-art">
      <rect width="160" height="96" rx="14" fill="rgba(255,255,255,0.06)" />
      {index === 0 ? (
        <>
          <circle cx="40" cy="48" r="10" fill="#a5b4fc" />
          <circle cx="80" cy="32" r="10" fill="#67e8f9" />
          <circle cx="80" cy="64" r="10" fill="#c4b5fd" />
          <circle cx="120" cy="48" r="10" fill="#ffffff" />
          <path d="M50 48h20M90 38l20 6M90 58l20-6" stroke="#e2e8f0" strokeWidth="2" />
        </>
      ) : null}
      {index === 1 ? (
        <>
          <circle cx="80" cy="48" r="26" fill="none" stroke="#a5b4fc" strokeWidth="4" />
          <path d="M80 34v16l10 6" stroke="#67e8f9" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : null}
      {index === 2 ? (
        <>
          <rect x="28" y="58" width="16" height="20" rx="3" fill="#67e8f9" />
          <rect x="52" y="42" width="16" height="36" rx="3" fill="#a5b4fc" />
          <rect x="76" y="30" width="16" height="48" rx="3" fill="#ffffff" />
          <rect x="100" y="46" width="16" height="32" rx="3" fill="#c4b5fd" />
        </>
      ) : null}
      {index === 3 ? (
        <>
          <rect x="24" y="36" width="36" height="24" rx="6" fill="#a5b4fc" />
          <rect x="62" y="28" width="36" height="40" rx="6" fill="#67e8f9" />
          <rect x="100" y="20" width="36" height="56" rx="6" fill="#ffffff" />
        </>
      ) : null}
    </svg>
  );
}

export function JourneyRail() {
  return (
    <div className="home-journey__rail" aria-hidden="true">
      <span />
      <span />
      <span />
      <i />
    </div>
  );
}
