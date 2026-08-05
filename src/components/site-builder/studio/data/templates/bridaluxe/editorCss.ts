export const bridaluxeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Miriam+Libre:wght@400;700&display=swap');

[data-template-id="bridaluxe"],
[data-template-id="bridaluxe"] {
  --p: #BE123C;
  --s: #FFF1F2;
  --a: #FDA4AF;
  --bg: #FFF7F8;
  --surface: #FFFFFF;
  --text: #4C0519;
  --muted: #9A6671;
  --dark: #28020B;
  font-family: "Miriam Libre", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="bridaluxe"] .t-display,
[data-template-id="bridaluxe"] .t-display {
  font-family: "Parisienne", serif;
}

@keyframes bridaluxe-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes bridaluxe-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bridaluxe-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes bridaluxe-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes bridaluxe-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes bridaluxe-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes bridaluxe-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes bridaluxe-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes bridaluxe-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="bridaluxe"] .t-ken,
[data-template-id="bridaluxe"] .t-ken { animation: bridaluxe-ken 18s ease-in-out infinite alternate; }
[data-template-id="bridaluxe"] .t-anim,
[data-template-id="bridaluxe"] .t-anim { animation: bridaluxe-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="bridaluxe"] .t-d1,
[data-template-id="bridaluxe"] .t-d1 { animation-delay: .12s; }
[data-template-id="bridaluxe"] .t-d2,
[data-template-id="bridaluxe"] .t-d2 { animation-delay: .24s; }
[data-template-id="bridaluxe"] .t-d3,
[data-template-id="bridaluxe"] .t-d3 { animation-delay: .36s; }
[data-template-id="bridaluxe"] .t-fade,
[data-template-id="bridaluxe"] .t-fade { animation: bridaluxe-fade 1s ease both; }
[data-template-id="bridaluxe"] .t-marquee,
[data-template-id="bridaluxe"] .t-marquee { animation: bridaluxe-marquee 30s linear infinite; width: max-content; }
[data-template-id="bridaluxe"] .t-float,
[data-template-id="bridaluxe"] .t-float { animation: bridaluxe-float 6s ease-in-out infinite; }
[data-template-id="bridaluxe"] .t-pulse,
[data-template-id="bridaluxe"] .t-pulse { animation: bridaluxe-pulse 2.8s ease-in-out infinite; }
[data-template-id="bridaluxe"] .t-shimmer,
[data-template-id="bridaluxe"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: bridaluxe-shimmer 2.8s linear infinite;
}
[data-template-id="bridaluxe"] .t-glow,
[data-template-id="bridaluxe"] .t-glow { animation: bridaluxe-glow 3.2s ease-in-out infinite; }
[data-template-id="bridaluxe"] .t-scalein,
[data-template-id="bridaluxe"] .t-scalein { animation: bridaluxe-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="bridaluxe"] .t-hover,
[data-template-id="bridaluxe"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="bridaluxe"] .t-hover:hover,
[data-template-id="bridaluxe"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="bridaluxe"] .t-ken,
  [data-template-id="bridaluxe"] .t-ken,
  [data-template-id="bridaluxe"] .t-anim,
  [data-template-id="bridaluxe"] .t-anim,
  [data-template-id="bridaluxe"] .t-marquee,
  [data-template-id="bridaluxe"] .t-marquee,
  [data-template-id="bridaluxe"] .t-float,
  [data-template-id="bridaluxe"] .t-float,
  [data-template-id="bridaluxe"] .t-pulse,
  [data-template-id="bridaluxe"] .t-pulse,
  [data-template-id="bridaluxe"] .t-shimmer,
  [data-template-id="bridaluxe"] .t-shimmer,
  [data-template-id="bridaluxe"] .t-glow,
  [data-template-id="bridaluxe"] .t-glow,
  [data-template-id="bridaluxe"] .t-scalein,
  [data-template-id="bridaluxe"] .t-scalein,
  [data-template-id="bridaluxe"] .t-fade,
  [data-template-id="bridaluxe"] .t-fade { animation: none !important; }
}
`;
