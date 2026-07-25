export const tipcraftEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Heebo:wght@400;500;700&display=swap');

[data-template-id="tipcraft"],
[data-template-id="tipcraft-preview"] {
  --p: #7C3AED;
  --s: #F5F3FF;
  --a: #C4B5FD;
  --bg: #FAF8FF;
  --surface: #FFFFFF;
  --text: #2E1065;
  --muted: #76639B;
  --dark: #160A35;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="tipcraft"] .t-display,
[data-template-id="tipcraft-preview"] .t-display {
  font-family: "Unbounded", serif;
}

@keyframes tipcraft-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes tipcraft-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes tipcraft-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes tipcraft-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes tipcraft-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes tipcraft-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes tipcraft-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes tipcraft-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes tipcraft-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="tipcraft"] .t-ken,
[data-template-id="tipcraft-preview"] .t-ken { animation: tipcraft-ken 18s ease-in-out infinite alternate; }
[data-template-id="tipcraft"] .t-anim,
[data-template-id="tipcraft-preview"] .t-anim { animation: tipcraft-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="tipcraft"] .t-d1,
[data-template-id="tipcraft-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="tipcraft"] .t-d2,
[data-template-id="tipcraft-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="tipcraft"] .t-d3,
[data-template-id="tipcraft-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="tipcraft"] .t-fade,
[data-template-id="tipcraft-preview"] .t-fade { animation: tipcraft-fade 1s ease both; }
[data-template-id="tipcraft"] .t-marquee,
[data-template-id="tipcraft-preview"] .t-marquee { animation: tipcraft-marquee 30s linear infinite; width: max-content; }
[data-template-id="tipcraft"] .t-float,
[data-template-id="tipcraft-preview"] .t-float { animation: tipcraft-float 6s ease-in-out infinite; }
[data-template-id="tipcraft"] .t-pulse,
[data-template-id="tipcraft-preview"] .t-pulse { animation: tipcraft-pulse 2.8s ease-in-out infinite; }
[data-template-id="tipcraft"] .t-shimmer,
[data-template-id="tipcraft-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: tipcraft-shimmer 2.8s linear infinite;
}
[data-template-id="tipcraft"] .t-glow,
[data-template-id="tipcraft-preview"] .t-glow { animation: tipcraft-glow 3.2s ease-in-out infinite; }
[data-template-id="tipcraft"] .t-scalein,
[data-template-id="tipcraft-preview"] .t-scalein { animation: tipcraft-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="tipcraft"] .t-hover,
[data-template-id="tipcraft-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="tipcraft"] .t-hover:hover,
[data-template-id="tipcraft-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="tipcraft"] .t-ken,
  [data-template-id="tipcraft-preview"] .t-ken,
  [data-template-id="tipcraft"] .t-anim,
  [data-template-id="tipcraft-preview"] .t-anim,
  [data-template-id="tipcraft"] .t-marquee,
  [data-template-id="tipcraft-preview"] .t-marquee,
  [data-template-id="tipcraft"] .t-float,
  [data-template-id="tipcraft-preview"] .t-float,
  [data-template-id="tipcraft"] .t-pulse,
  [data-template-id="tipcraft-preview"] .t-pulse,
  [data-template-id="tipcraft"] .t-shimmer,
  [data-template-id="tipcraft-preview"] .t-shimmer,
  [data-template-id="tipcraft"] .t-glow,
  [data-template-id="tipcraft-preview"] .t-glow,
  [data-template-id="tipcraft"] .t-scalein,
  [data-template-id="tipcraft-preview"] .t-scalein,
  [data-template-id="tipcraft"] .t-fade,
  [data-template-id="tipcraft-preview"] .t-fade { animation: none !important; }
}
`;
