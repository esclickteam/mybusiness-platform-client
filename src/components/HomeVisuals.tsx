type ArtProps = { index: number };

export function WayArt({ index }: ArtProps) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="home-art home-art--workspace">
        <defs>
          <linearGradient id="way-desk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>
        <rect width="360" height="220" rx="24" fill="url(#way-desk)" />
        <circle cx="300" cy="36" r="46" fill="#818cf8" opacity="0.35" />
        <rect x="28" y="28" width="196" height="164" rx="16" fill="#ffffff" />
        <rect x="44" y="44" width="72" height="8" rx="4" fill="#4f46e5" />
        <rect x="44" y="64" width="148" height="28" rx="8" fill="#eef2ff" />
        <rect x="44" y="102" width="148" height="28" rx="8" fill="#f8fafc" />
        <rect x="44" y="140" width="96" height="28" rx="8" fill="#e0e7ff" />
        <rect x="238" y="78" width="94" height="114" rx="16" fill="#ffffff" />
        <circle cx="285" cy="112" r="16" fill="#4f46e5" />
        <rect x="254" y="140" width="62" height="8" rx="4" fill="#c7d2fe" />
        <rect x="262" y="156" width="46" height="8" rx="4" fill="#e0e7ff" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="home-art home-art--site">
        <rect width="360" height="220" rx="24" fill="#082f49" />
        <circle cx="48" cy="40" r="28" fill="#22d3ee" opacity="0.35" />
        <rect x="36" y="28" width="288" height="164" rx="16" fill="#0f172a" />
        <rect x="36" y="28" width="288" height="28" rx="16" fill="#155e75" />
        <circle cx="56" cy="42" r="5" fill="#67e8f9" />
        <circle cx="74" cy="42" r="5" fill="#a5f3fc" />
        <rect x="56" y="76" width="120" height="14" rx="6" fill="#ffffff" />
        <rect x="56" y="100" width="168" height="8" rx="4" fill="#94a3b8" />
        <rect x="56" y="124" width="78" height="28" rx="14" fill="#22d3ee" />
        <rect x="214" y="76" width="86" height="86" rx="14" fill="#164e63" />
        <rect x="226" y="90" width="62" height="8" rx="4" fill="#67e8f9" />
        <rect x="226" y="108" width="46" height="8" rx="4" fill="#a5f3fc" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="home-art home-art--market">
        <rect width="360" height="220" rx="24" fill="#2e1065" />
        <path d="M40 150c40-70 90-70 130-20s70 20 150-40" fill="none" stroke="#c4b5fd" strokeWidth="3" />
        <circle cx="70" cy="78" r="22" fill="#7c3aed" />
        <circle cx="168" cy="118" r="28" fill="#4f46e5" />
        <circle cx="274" cy="72" r="24" fill="#0891b2" />
        <rect x="196" y="132" width="120" height="52" rx="14" fill="#ffffff" />
        <rect x="210" y="146" width="72" height="8" rx="4" fill="#4f46e5" />
        <rect x="210" y="162" width="48" height="8" rx="4" fill="#c4b5fd" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" className="home-art home-art--setup">
      <rect width="360" height="220" rx="24" fill="#042f2e" />
      <circle cx="292" cy="46" r="40" fill="#34d399" opacity="0.25" />
      <rect x="36" y="36" width="196" height="148" rx="16" fill="#ffffff" />
      <circle cx="68" cy="72" r="14" fill="#10b981" />
      <rect x="94" y="64" width="110" height="8" rx="4" fill="#065f46" />
      <rect x="94" y="80" width="78" height="8" rx="4" fill="#a7f3d0" />
      <rect x="56" y="108" width="156" height="22" rx="8" fill="#ecfdf5" />
      <rect x="56" y="140" width="156" height="22" rx="8" fill="#f0fdfa" />
      <rect x="248" y="92" width="76" height="76" rx="38" fill="#10b981" />
      <path d="M272 130l12 12 24-28" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
    </svg>
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
