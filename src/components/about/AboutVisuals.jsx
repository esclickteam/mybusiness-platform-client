import React from "react";

function Art({ label, className, children, viewBox }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function HeroComposition({ label }) {
  return (
    <Art label={label} className="about-art about-art--hero" viewBox="0 0 640 560">
      <rect x="16" y="16" width="608" height="528" rx="36" fill="#16233f" />
      <circle cx="520" cy="88" r="110" fill="#7c5cff" opacity="0.18" />
      <circle cx="120" cy="470" r="90" fill="#9db7ff" opacity="0.08" />
      <g className="about-flow" fill="none" stroke="#d9e2f5" strokeWidth="1.7">
        <path d="M320 268 L168 132" />
        <path d="M320 268 L486 128" />
        <path d="M320 268 L128 318" />
        <path d="M320 268 L512 348" />
        <path d="M320 268 L318 456" />
      </g>
      <g className="about-float about-float-a">
        <rect x="92" y="78" width="132" height="92" rx="22" fill="#f6f8fc" />
        <circle cx="128" cy="116" r="14" fill="none" stroke="#10182e" strokeWidth="2.4" />
        <path d="M112 150c6-12 26-12 32 0" fill="none" stroke="#10182e" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M158 108h46M158 124h34" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g className="about-float about-float-b">
        <rect x="430" y="72" width="128" height="96" rx="22" fill="#f6f8fc" />
        <path d="M462 128V96h28l18 16v16" fill="none" stroke="#10182e" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M470 116h18" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g className="about-float about-float-c">
        <rect x="48" y="286" width="140" height="92" rx="22" fill="#f6f8fc" />
        <path d="M78 322h78c8 0 14 6 14 14v8H92l-14 12v-12h-8c-8 0-14-6-14-14v-8c0-8 6-14 14-14z" fill="none" stroke="#10182e" strokeWidth="2.3" />
        <path d="M92 330h42" stroke="#7c3aed" strokeWidth="2.3" strokeLinecap="round" />
      </g>
      <g className="about-float about-float-d">
        <rect x="452" y="300" width="136" height="100" rx="22" fill="#f6f8fc" />
        <rect x="478" y="324" width="84" height="56" rx="8" fill="none" stroke="#10182e" strokeWidth="2.3" />
        <path d="M478 342h84M498 324v56M518 324v56" stroke="#7c3aed" strokeWidth="2" />
      </g>
      <g className="about-float about-float-e">
        <rect x="236" y="408" width="164" height="78" rx="22" fill="#f6f8fc" />
        <circle cx="274" cy="447" r="14" fill="none" stroke="#10182e" strokeWidth="2.3" />
        <path d="M268 447l4 4 8-9" fill="none" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M302 438h72M302 456h52" stroke="#10182e" strokeWidth="2.3" strokeLinecap="round" />
      </g>
      <circle cx="320" cy="268" r="58" fill="#f7f8fc" />
      <circle cx="320" cy="268" r="34" fill="none" stroke="#10182e" strokeWidth="2.6" />
      <path d="M320 246v44M298 268h44" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
    </Art>
  );
}

export function WorkspaceComposition({ label }) {
  return (
    <Art label={label} className="about-art about-art--workspace" viewBox="0 0 640 420">
      <rect width="640" height="420" rx="28" fill="#f4f7fb" />
      <path d="M48 318h544" stroke="#d5deea" strokeWidth="2" />
      <rect x="78" y="86" width="300" height="196" rx="18" fill="#ffffff" stroke="#10182e" strokeWidth="2" />
      <rect x="98" y="108" width="168" height="12" rx="6" fill="#10182e" />
      <rect x="98" y="134" width="120" height="8" rx="4" fill="#7c3aed" />
      <rect x="98" y="164" width="74" height="74" rx="12" fill="#eef2ff" />
      <rect x="186" y="164" width="74" height="74" rx="12" fill="#f6f3ff" />
      <rect x="274" y="164" width="80" height="74" rx="12" fill="#10182e" />
      <path d="M292 188h44M292 206h32M292 224h38" stroke="#f7f8fc" strokeWidth="3" strokeLinecap="round" />
      <rect x="408" y="70" width="168" height="228" rx="22" fill="#ffffff" stroke="#10182e" strokeWidth="2" />
      <circle cx="448" cy="118" r="8" fill="#7c3aed" />
      <circle cx="492" cy="150" r="8" fill="#10182e" />
      <circle cx="536" cy="112" r="8" fill="#2450c8" />
      <path d="M448 118 L492 150 L536 112" fill="none" stroke="#7c3aed" strokeWidth="2" />
      <rect x="430" y="190" width="124" height="10" rx="5" fill="#d9e0ec" />
      <rect x="430" y="214" width="96" height="10" rx="5" fill="#d9e0ec" />
      <rect x="430" y="238" width="110" height="10" rx="5" fill="#7c3aed" opacity="0.85" />
      <rect x="150" y="318" width="86" height="46" rx="10" fill="#10182e" />
      <path d="M168 364c18-28 50-28 68 0" fill="#1f8a62" />
      <rect x="430" y="318" width="120" height="18" rx="9" fill="#ffffff" stroke="#10182e" strokeWidth="2" />
    </Art>
  );
}

export function StepMark({ index }) {
  const marks = [
    <g key="a" fill="none" stroke="#10182e" strokeWidth="1.8">
      <circle cx="28" cy="28" r="16" />
      <path d="M20 30h16M28 22v16" stroke="#7c3aed" strokeLinecap="round" />
    </g>,
    <g key="b" fill="none" stroke="#10182e" strokeWidth="1.8">
      <rect x="12" y="16" width="12" height="12" rx="3" />
      <rect x="32" y="16" width="12" height="12" rx="3" />
      <rect x="22" y="34" width="12" height="12" rx="3" />
      <path d="M24 22h8M30 28v6" stroke="#7c3aed" />
    </g>,
    <g key="c" fill="none" stroke="#10182e" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 36h10l6-16 6 16h10" />
      <path d="M18 28h20" stroke="#7c3aed" />
    </g>,
    <g key="d" fill="none" stroke="#10182e" strokeWidth="1.8" strokeLinecap="round">
      <path d="M16 36c8-16 24-16 24 0" />
      <path d="M28 16v8" stroke="#7c3aed" />
      <circle cx="40" cy="20" r="3" fill="#7c3aed" stroke="none" />
    </g>,
  ];
  return (
    <svg className="about-step-mark" viewBox="0 0 56 56" aria-hidden="true">
      <rect width="56" height="56" rx="16" fill="#f4f7fb" />
      {marks[index]}
    </svg>
  );
}

export function AudienceArt({ index, label }) {
  const scenes = [
    <g key="solo">
      <rect width="320" height="168" rx="20" fill="#ffffff" />
      <rect x="36" y="36" width="120" height="78" rx="12" fill="#10182e" />
      <path d="M52 58h88M52 74h64M52 90h72" stroke="#f7f8fc" strokeWidth="4" strokeLinecap="round" />
      <circle cx="214" cy="74" r="28" fill="none" stroke="#7c3aed" strokeWidth="3" />
      <path d="M196 112c8-16 28-16 36 0" fill="none" stroke="#10182e" strokeWidth="3" strokeLinecap="round" />
    </g>,
    <g key="small">
      <rect width="320" height="168" rx="20" fill="#ffffff" />
      <path d="M40 108V58h70l24 22v28" fill="none" stroke="#10182e" strokeWidth="3" />
      <path d="M58 108V78h28v30" fill="none" stroke="#7c3aed" strokeWidth="3" />
      <rect x="168" y="42" width="112" height="28" rx="8" fill="#10182e" />
      <rect x="168" y="80" width="112" height="28" rx="8" fill="#f4f0ff" stroke="#7c3aed" strokeWidth="2" />
      <rect x="168" y="118" width="80" height="16" rx="8" fill="#d9e0ec" />
    </g>,
    <g key="service">
      <rect width="320" height="168" rx="20" fill="#ffffff" />
      <rect x="36" y="32" width="150" height="108" rx="14" fill="none" stroke="#10182e" strokeWidth="3" />
      <path d="M36 58h150M68 32v108M104 32v108" stroke="#7c3aed" strokeWidth="2" />
      <circle cx="230" cy="86" r="36" fill="none" stroke="#10182e" strokeWidth="3" />
      <path d="M230 68v20l14 8" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
    </g>,
    <g key="team">
      <rect width="320" height="168" rx="20" fill="#ffffff" />
      <path d="M70 92 L160 48 L250 92 L160 124 Z" fill="none" stroke="#7c3aed" strokeWidth="2.4" />
      <circle cx="70" cy="92" r="16" fill="#10182e" />
      <circle cx="160" cy="48" r="16" fill="#7c3aed" />
      <circle cx="250" cy="92" r="16" fill="#2450c8" />
      <circle cx="160" cy="124" r="16" fill="#10182e" />
    </g>,
  ];
  return (
    <Art label={label} className="about-art about-art--audience" viewBox="0 0 320 168">
      {scenes[index]}
    </Art>
  );
}

export function PeopleConstellation({ label }) {
  return (
    <Art label={label} className="about-art about-art--people" viewBox="0 0 520 360">
      <circle cx="260" cy="180" r="150" fill="none" stroke="#d9e2f5" strokeOpacity="0.35" />
      <circle cx="260" cy="180" r="96" fill="none" stroke="#c4b5fd" strokeOpacity="0.45" />
      <g className="about-flow" stroke="#e7edf8" strokeWidth="1.4" fill="none">
        <path d="M120 96 L250 150 L390 84" />
        <path d="M96 220 L230 190 L400 230" />
        <path d="M250 150 L230 190 L300 280" />
      </g>
      <circle cx="120" cy="96" r="9" fill="#f7f8fc" />
      <circle cx="250" cy="150" r="12" fill="#c4b5fd" />
      <circle cx="390" cy="84" r="8" fill="#f7f8fc" />
      <circle cx="96" cy="220" r="7" fill="#9db7ff" />
      <circle cx="230" cy="190" r="8" fill="#f7f8fc" />
      <circle cx="400" cy="230" r="10" fill="#f7f8fc" />
      <circle cx="300" cy="280" r="8" fill="#c4b5fd" />
    </Art>
  );
}

export function CommitmentMark({ label }) {
  return (
    <Art label={label} className="about-art about-art--mark" viewBox="0 0 280 220">
      <path d="M30 160c40-90 180-90 220 0" fill="none" stroke="#7c3aed" strokeWidth="3" />
      <path d="M48 160c34-70 150-70 186 0" fill="none" stroke="#10182e" strokeWidth="1.5" opacity="0.5" />
      <circle cx="140" cy="78" r="8" fill="#7c3aed" />
      <circle cx="40" cy="156" r="5" fill="#10182e" />
      <circle cx="236" cy="156" r="5" fill="#10182e" />
    </Art>
  );
}

export function PrincipleIcon({ name }) {
  const paths = {
    clarity: (
      <>
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </>
    ),
    connection: (
      <>
        <circle cx="6" cy="12" r="2.2" fill="currentColor" />
        <circle cx="18" cy="6" r="2.2" fill="currentColor" />
        <circle cx="18" cy="18" r="2.2" fill="currentColor" />
        <path d="M8 11 L16 7M8 13 L16 17" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
    practicality: (
      <path
        d="M6 12.5l3.2 3.2L18 7.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg className="about-principle-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function DifferenceIcon({ name }) {
  const paths = {
    tools: (
      <>
        <rect x="3" y="4" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="4" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="8" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
    start: (
      <path d="M5 16c2-6 5-8 7-8s5 2 7 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
    flow: (
      <path d="M4 8h10M4 12h16M4 16h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
    services: (
      <>
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  };
  return (
    <svg className="about-diff-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
