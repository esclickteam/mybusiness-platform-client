export const lashoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Mulish:wght@400;500;600;700&display=swap');

[data-template-id="lashora"],
[data-template-id="lashora"] {
  --p: #A78BFA;
  --s: #0B0A12;
  --a: #DDD6FE;
  --bg: #0B0A12;
  --surface: #16141F;
  --text: #F5F3FF;
  --muted: #A5A0B8;
  --dark: #05040A;
  font-family: "Mulish", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lashora"] .t-display,
[data-template-id="lashora"] .t-display {
  font-family: "Italiana", serif;
}

@keyframes lashora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes lashora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lashora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes lashora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes lashora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes lashora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes lashora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes lashora-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes lashora-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="lashora"] .t-ken,
[data-template-id="lashora"] .t-ken { animation: lashora-ken 18s ease-in-out infinite alternate; }
[data-template-id="lashora"] .t-anim,
[data-template-id="lashora"] .t-anim { animation: lashora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="lashora"] .t-d1,
[data-template-id="lashora"] .t-d1 { animation-delay: .12s; }
[data-template-id="lashora"] .t-d2,
[data-template-id="lashora"] .t-d2 { animation-delay: .24s; }
[data-template-id="lashora"] .t-d3,
[data-template-id="lashora"] .t-d3 { animation-delay: .36s; }
[data-template-id="lashora"] .t-fade,
[data-template-id="lashora"] .t-fade { animation: lashora-fade 1s ease both; }
[data-template-id="lashora"] .t-marquee,
[data-template-id="lashora"] .t-marquee { animation: lashora-marquee 30s linear infinite; width: max-content; }
[data-template-id="lashora"] .t-float,
[data-template-id="lashora"] .t-float { animation: lashora-float 6s ease-in-out infinite; }
[data-template-id="lashora"] .t-pulse,
[data-template-id="lashora"] .t-pulse { animation: lashora-pulse 2.8s ease-in-out infinite; }
[data-template-id="lashora"] .t-shimmer,
[data-template-id="lashora"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: lashora-shimmer 2.8s linear infinite;
}
[data-template-id="lashora"] .t-glow,
[data-template-id="lashora"] .t-glow { animation: lashora-glow 3.2s ease-in-out infinite; }
[data-template-id="lashora"] .t-scalein,
[data-template-id="lashora"] .t-scalein { animation: lashora-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="lashora"] .t-hover,
[data-template-id="lashora"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="lashora"] .t-hover:hover,
[data-template-id="lashora"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="lashora"] .t-ken,
  [data-template-id="lashora"] .t-ken,
  [data-template-id="lashora"] .t-anim,
  [data-template-id="lashora"] .t-anim,
  [data-template-id="lashora"] .t-marquee,
  [data-template-id="lashora"] .t-marquee,
  [data-template-id="lashora"] .t-float,
  [data-template-id="lashora"] .t-float,
  [data-template-id="lashora"] .t-pulse,
  [data-template-id="lashora"] .t-pulse,
  [data-template-id="lashora"] .t-shimmer,
  [data-template-id="lashora"] .t-shimmer,
  [data-template-id="lashora"] .t-glow,
  [data-template-id="lashora"] .t-glow,
  [data-template-id="lashora"] .t-scalein,
  [data-template-id="lashora"] .t-scalein,
  [data-template-id="lashora"] .t-fade,
  [data-template-id="lashora"] .t-fade { animation: none !important; }
}
`;
