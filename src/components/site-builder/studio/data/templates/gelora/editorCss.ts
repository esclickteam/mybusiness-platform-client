export const geloraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Assistant:wght@400;500;600;700&display=swap');

[data-template-id="gelora"],
[data-template-id="gelora"] {
  --p: #DB2777;
  --s: #FFF1F7;
  --a: #F9A8D4;
  --bg: #FFF7FB;
  --surface: #FFFFFF;
  --text: #4C0F2E;
  --muted: #9D6681;
  --dark: #2A0718;
  font-family: "Assistant", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="gelora"] .t-display,
[data-template-id="gelora"] .t-display {
  font-family: "Fraunces", serif;
}

/* Header logo must stay a badge — never fill the canvas in the visual editor. */
[data-template-id="gelora"] [data-section-kind="header"] img.h-10,
[data-template-id="gelora"] [data-section-kind="header"] img.h-10,
[data-template-id="gelora"] [data-section-kind="header"] .h-10.w-10 img,
[data-template-id="gelora"] [data-section-kind="header"] .h-10.w-10 img {
  width: 2.5rem !important;
  height: 2.5rem !important;
  max-width: 2.5rem !important;
  max-height: 2.5rem !important;
  object-fit: cover !important;
}

/* Keep hero/editor parity: columns follow canvas width, never image min-content. */
[data-template-id="gelora"] .gelora-hero-grid,
[data-template-id="gelora"] .gelora-hero-grid {
  width: 100%;
  min-width: 0;
}

[data-template-id="gelora"] .gelora-hero-grid > *,
[data-template-id="gelora"] .gelora-hero-grid > * {
  min-width: 0;
  max-width: 100%;
}

[data-template-id="gelora"] .gelora-hero-grid img,
[data-template-id="gelora"] .gelora-hero-grid img {
  min-width: 0;
  max-width: 100%;
  width: 100%;
}

[data-template-id="gelora"] .gelora-hero-grid h1,
[data-template-id="gelora"] .gelora-hero-grid h1,
[data-template-id="gelora"] .gelora-hero-grid p,
[data-template-id="gelora"] .gelora-hero-grid p {
  overflow-wrap: break-word;
  word-break: normal;
  max-width: 100%;
}

[data-template-id="gelora"] .gelora-hero-grid button,
[data-template-id="gelora"] .gelora-hero-grid button,
[data-template-id="gelora"] [data-section-kind="header"] button,
[data-template-id="gelora"] [data-section-kind="header"] button {
  white-space: nowrap;
  width: auto;
  max-width: 100%;
}

@container bizuply-template (max-width: 1023px) {
  [data-template-id="gelora"] .gelora-hero-grid,
  [data-template-id="gelora"] .gelora-hero-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }
}

@container bizuply-template (min-width: 1024px) {
  [data-template-id="gelora"] .gelora-hero-grid,
  [data-template-id="gelora"] .gelora-hero-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr) !important;
  }
}

@keyframes gelora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes gelora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes gelora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes gelora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes gelora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes gelora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes gelora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes gelora-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes gelora-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="gelora"] .t-ken,
[data-template-id="gelora"] .t-ken { animation: gelora-ken 18s ease-in-out infinite alternate; }
[data-template-id="gelora"] .t-anim,
[data-template-id="gelora"] .t-anim { animation: gelora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="gelora"] .t-d1,
[data-template-id="gelora"] .t-d1 { animation-delay: .12s; }
[data-template-id="gelora"] .t-d2,
[data-template-id="gelora"] .t-d2 { animation-delay: .24s; }
[data-template-id="gelora"] .t-d3,
[data-template-id="gelora"] .t-d3 { animation-delay: .36s; }
[data-template-id="gelora"] .t-fade,
[data-template-id="gelora"] .t-fade { animation: gelora-fade 1s ease both; }
[data-template-id="gelora"] .t-marquee,
[data-template-id="gelora"] .t-marquee { animation: gelora-marquee 30s linear infinite; width: max-content; }
[data-template-id="gelora"] .t-float,
[data-template-id="gelora"] .t-float { animation: gelora-float 6s ease-in-out infinite; }
[data-template-id="gelora"] .t-pulse,
[data-template-id="gelora"] .t-pulse { animation: gelora-pulse 2.8s ease-in-out infinite; }
[data-template-id="gelora"] .t-shimmer,
[data-template-id="gelora"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: gelora-shimmer 2.8s linear infinite;
}
[data-template-id="gelora"] .t-glow,
[data-template-id="gelora"] .t-glow { animation: gelora-glow 3.2s ease-in-out infinite; }
[data-template-id="gelora"] .t-scalein,
[data-template-id="gelora"] .t-scalein { animation: gelora-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="gelora"] .t-hover,
[data-template-id="gelora"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="gelora"] .t-hover:hover,
[data-template-id="gelora"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="gelora"] .t-ken,
  [data-template-id="gelora"] .t-ken,
  [data-template-id="gelora"] .t-anim,
  [data-template-id="gelora"] .t-anim,
  [data-template-id="gelora"] .t-marquee,
  [data-template-id="gelora"] .t-marquee,
  [data-template-id="gelora"] .t-float,
  [data-template-id="gelora"] .t-float,
  [data-template-id="gelora"] .t-pulse,
  [data-template-id="gelora"] .t-pulse,
  [data-template-id="gelora"] .t-shimmer,
  [data-template-id="gelora"] .t-shimmer,
  [data-template-id="gelora"] .t-glow,
  [data-template-id="gelora"] .t-glow,
  [data-template-id="gelora"] .t-scalein,
  [data-template-id="gelora"] .t-scalein,
  [data-template-id="gelora"] .t-fade,
  [data-template-id="gelora"] .t-fade { animation: none !important; }
}
`;
