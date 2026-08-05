export const silkbarEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Figtree:wght@400;500;600;700&display=swap');

[data-template-id="silkbar"],
[data-template-id="silkbar"] {
  --p: #0F766E;
  --s: #F3FAF9;
  --a: #14B8A6;
  --bg: #F7FCFB;
  --surface: #FFFFFF;
  --text: #134E4A;
  --muted: #5F8F8A;
  --dark: #042F2E;
  font-family: "Figtree", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="silkbar"] .t-display,
[data-template-id="silkbar"] .t-display {
  font-family: "Libre Baskerville", serif;
}

@keyframes silkbar-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes silkbar-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes silkbar-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes silkbar-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes silkbar-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes silkbar-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes silkbar-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes silkbar-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes silkbar-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="silkbar"] .t-ken,
[data-template-id="silkbar"] .t-ken { animation: silkbar-ken 18s ease-in-out infinite alternate; }
[data-template-id="silkbar"] .t-anim,
[data-template-id="silkbar"] .t-anim { animation: silkbar-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="silkbar"] .t-d1,
[data-template-id="silkbar"] .t-d1 { animation-delay: .12s; }
[data-template-id="silkbar"] .t-d2,
[data-template-id="silkbar"] .t-d2 { animation-delay: .24s; }
[data-template-id="silkbar"] .t-d3,
[data-template-id="silkbar"] .t-d3 { animation-delay: .36s; }
[data-template-id="silkbar"] .t-fade,
[data-template-id="silkbar"] .t-fade { animation: silkbar-fade 1s ease both; }
[data-template-id="silkbar"] .t-marquee,
[data-template-id="silkbar"] .t-marquee { animation: silkbar-marquee 30s linear infinite; width: max-content; }
[data-template-id="silkbar"] .t-float,
[data-template-id="silkbar"] .t-float { animation: silkbar-float 6s ease-in-out infinite; }
[data-template-id="silkbar"] .t-pulse,
[data-template-id="silkbar"] .t-pulse { animation: silkbar-pulse 2.8s ease-in-out infinite; }
[data-template-id="silkbar"] .t-shimmer,
[data-template-id="silkbar"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: silkbar-shimmer 2.8s linear infinite;
}
[data-template-id="silkbar"] .t-glow,
[data-template-id="silkbar"] .t-glow { animation: silkbar-glow 3.2s ease-in-out infinite; }
[data-template-id="silkbar"] .t-scalein,
[data-template-id="silkbar"] .t-scalein { animation: silkbar-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="silkbar"] .t-hover,
[data-template-id="silkbar"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="silkbar"] .t-hover:hover,
[data-template-id="silkbar"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="silkbar"] .t-ken,
  [data-template-id="silkbar"] .t-ken,
  [data-template-id="silkbar"] .t-anim,
  [data-template-id="silkbar"] .t-anim,
  [data-template-id="silkbar"] .t-marquee,
  [data-template-id="silkbar"] .t-marquee,
  [data-template-id="silkbar"] .t-float,
  [data-template-id="silkbar"] .t-float,
  [data-template-id="silkbar"] .t-pulse,
  [data-template-id="silkbar"] .t-pulse,
  [data-template-id="silkbar"] .t-shimmer,
  [data-template-id="silkbar"] .t-shimmer,
  [data-template-id="silkbar"] .t-glow,
  [data-template-id="silkbar"] .t-glow,
  [data-template-id="silkbar"] .t-scalein,
  [data-template-id="silkbar"] .t-scalein,
  [data-template-id="silkbar"] .t-fade,
  [data-template-id="silkbar"] .t-fade { animation: none !important; }
}
`;
