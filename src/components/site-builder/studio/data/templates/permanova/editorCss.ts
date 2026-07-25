export const permanovaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Prata&family=Rubik:wght@400;500;700&display=swap');

[data-template-id="permanova"],
[data-template-id="permanova-preview"] {
  --p: #B45309;
  --s: #FFF7ED;
  --a: #FDBA74;
  --bg: #FFFBF7;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #8A6248;
  --dark: #241006;
  font-family: "Rubik", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="permanova"] .t-display,
[data-template-id="permanova-preview"] .t-display {
  font-family: "Prata", serif;
}

@keyframes permanova-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes permanova-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes permanova-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes permanova-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes permanova-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes permanova-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes permanova-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes permanova-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes permanova-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="permanova"] .t-ken,
[data-template-id="permanova-preview"] .t-ken { animation: permanova-ken 18s ease-in-out infinite alternate; }
[data-template-id="permanova"] .t-anim,
[data-template-id="permanova-preview"] .t-anim { animation: permanova-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="permanova"] .t-d1,
[data-template-id="permanova-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="permanova"] .t-d2,
[data-template-id="permanova-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="permanova"] .t-d3,
[data-template-id="permanova-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="permanova"] .t-fade,
[data-template-id="permanova-preview"] .t-fade { animation: permanova-fade 1s ease both; }
[data-template-id="permanova"] .t-marquee,
[data-template-id="permanova-preview"] .t-marquee { animation: permanova-marquee 30s linear infinite; width: max-content; }
[data-template-id="permanova"] .t-float,
[data-template-id="permanova-preview"] .t-float { animation: permanova-float 6s ease-in-out infinite; }
[data-template-id="permanova"] .t-pulse,
[data-template-id="permanova-preview"] .t-pulse { animation: permanova-pulse 2.8s ease-in-out infinite; }
[data-template-id="permanova"] .t-shimmer,
[data-template-id="permanova-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: permanova-shimmer 2.8s linear infinite;
}
[data-template-id="permanova"] .t-glow,
[data-template-id="permanova-preview"] .t-glow { animation: permanova-glow 3.2s ease-in-out infinite; }
[data-template-id="permanova"] .t-scalein,
[data-template-id="permanova-preview"] .t-scalein { animation: permanova-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="permanova"] .t-hover,
[data-template-id="permanova-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="permanova"] .t-hover:hover,
[data-template-id="permanova-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="permanova"] .t-ken,
  [data-template-id="permanova-preview"] .t-ken,
  [data-template-id="permanova"] .t-anim,
  [data-template-id="permanova-preview"] .t-anim,
  [data-template-id="permanova"] .t-marquee,
  [data-template-id="permanova-preview"] .t-marquee,
  [data-template-id="permanova"] .t-float,
  [data-template-id="permanova-preview"] .t-float,
  [data-template-id="permanova"] .t-pulse,
  [data-template-id="permanova-preview"] .t-pulse,
  [data-template-id="permanova"] .t-shimmer,
  [data-template-id="permanova-preview"] .t-shimmer,
  [data-template-id="permanova"] .t-glow,
  [data-template-id="permanova-preview"] .t-glow,
  [data-template-id="permanova"] .t-scalein,
  [data-template-id="permanova-preview"] .t-scalein,
  [data-template-id="permanova"] .t-fade,
  [data-template-id="permanova-preview"] .t-fade { animation: none !important; }
}
`;
