export const microarchEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Alef:wght@400;700&display=swap');

[data-template-id="microarch"],
[data-template-id="microarch"] {
  --p: #92400E;
  --s: #FEF3C7;
  --a: #FCD34D;
  --bg: #FFFBEB;
  --surface: #FFFFFF;
  --text: #451A03;
  --muted: #8B6B43;
  --dark: #261204;
  font-family: "Alef", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="microarch"] .t-display,
[data-template-id="microarch"] .t-display {
  font-family: "Marcellus", serif;
}

@keyframes microarch-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes microarch-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes microarch-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes microarch-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes microarch-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes microarch-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes microarch-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes microarch-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes microarch-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="microarch"] .t-ken,
[data-template-id="microarch"] .t-ken { animation: microarch-ken 18s ease-in-out infinite alternate; }
[data-template-id="microarch"] .t-anim,
[data-template-id="microarch"] .t-anim { animation: microarch-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="microarch"] .t-d1,
[data-template-id="microarch"] .t-d1 { animation-delay: .12s; }
[data-template-id="microarch"] .t-d2,
[data-template-id="microarch"] .t-d2 { animation-delay: .24s; }
[data-template-id="microarch"] .t-d3,
[data-template-id="microarch"] .t-d3 { animation-delay: .36s; }
[data-template-id="microarch"] .t-fade,
[data-template-id="microarch"] .t-fade { animation: microarch-fade 1s ease both; }
[data-template-id="microarch"] .t-marquee,
[data-template-id="microarch"] .t-marquee { animation: microarch-marquee 30s linear infinite; width: max-content; }
[data-template-id="microarch"] .t-float,
[data-template-id="microarch"] .t-float { animation: microarch-float 6s ease-in-out infinite; }
[data-template-id="microarch"] .t-pulse,
[data-template-id="microarch"] .t-pulse { animation: microarch-pulse 2.8s ease-in-out infinite; }
[data-template-id="microarch"] .t-shimmer,
[data-template-id="microarch"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: microarch-shimmer 2.8s linear infinite;
}
[data-template-id="microarch"] .t-glow,
[data-template-id="microarch"] .t-glow { animation: microarch-glow 3.2s ease-in-out infinite; }
[data-template-id="microarch"] .t-scalein,
[data-template-id="microarch"] .t-scalein { animation: microarch-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="microarch"] .t-hover,
[data-template-id="microarch"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="microarch"] .t-hover:hover,
[data-template-id="microarch"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="microarch"] .t-ken,
  [data-template-id="microarch"] .t-ken,
  [data-template-id="microarch"] .t-anim,
  [data-template-id="microarch"] .t-anim,
  [data-template-id="microarch"] .t-marquee,
  [data-template-id="microarch"] .t-marquee,
  [data-template-id="microarch"] .t-float,
  [data-template-id="microarch"] .t-float,
  [data-template-id="microarch"] .t-pulse,
  [data-template-id="microarch"] .t-pulse,
  [data-template-id="microarch"] .t-shimmer,
  [data-template-id="microarch"] .t-shimmer,
  [data-template-id="microarch"] .t-glow,
  [data-template-id="microarch"] .t-glow,
  [data-template-id="microarch"] .t-scalein,
  [data-template-id="microarch"] .t-scalein,
  [data-template-id="microarch"] .t-fade,
  [data-template-id="microarch"] .t-fade { animation: none !important; }
}
`;
