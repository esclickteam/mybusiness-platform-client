export const groomoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Barlow:wght@400;500;700&display=swap');

[data-template-id="groomora"],
[data-template-id="groomora"] {
  --p: #65A30D;
  --s: #F7FEE7;
  --a: #BEF264;
  --bg: #0C1208;
  --surface: #151F10;
  --text: #F7FEE7;
  --muted: #AAB894;
  --dark: #050805;
  font-family: "Barlow", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="groomora"] .t-display,
[data-template-id="groomora"] .t-display {
  font-family: "Oswald", serif;
}

@keyframes groomora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes groomora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes groomora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes groomora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes groomora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes groomora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes groomora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes groomora-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes groomora-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="groomora"] .t-ken,
[data-template-id="groomora"] .t-ken { animation: groomora-ken 18s ease-in-out infinite alternate; }
[data-template-id="groomora"] .t-anim,
[data-template-id="groomora"] .t-anim { animation: groomora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="groomora"] .t-d1,
[data-template-id="groomora"] .t-d1 { animation-delay: .12s; }
[data-template-id="groomora"] .t-d2,
[data-template-id="groomora"] .t-d2 { animation-delay: .24s; }
[data-template-id="groomora"] .t-d3,
[data-template-id="groomora"] .t-d3 { animation-delay: .36s; }
[data-template-id="groomora"] .t-fade,
[data-template-id="groomora"] .t-fade { animation: groomora-fade 1s ease both; }
[data-template-id="groomora"] .t-marquee,
[data-template-id="groomora"] .t-marquee { animation: groomora-marquee 30s linear infinite; width: max-content; }
[data-template-id="groomora"] .t-float,
[data-template-id="groomora"] .t-float { animation: groomora-float 6s ease-in-out infinite; }
[data-template-id="groomora"] .t-pulse,
[data-template-id="groomora"] .t-pulse { animation: groomora-pulse 2.8s ease-in-out infinite; }
[data-template-id="groomora"] .t-shimmer,
[data-template-id="groomora"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: groomora-shimmer 2.8s linear infinite;
}
[data-template-id="groomora"] .t-glow,
[data-template-id="groomora"] .t-glow { animation: groomora-glow 3.2s ease-in-out infinite; }
[data-template-id="groomora"] .t-scalein,
[data-template-id="groomora"] .t-scalein { animation: groomora-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="groomora"] .t-hover,
[data-template-id="groomora"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="groomora"] .t-hover:hover,
[data-template-id="groomora"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="groomora"] .t-ken,
  [data-template-id="groomora"] .t-ken,
  [data-template-id="groomora"] .t-anim,
  [data-template-id="groomora"] .t-anim,
  [data-template-id="groomora"] .t-marquee,
  [data-template-id="groomora"] .t-marquee,
  [data-template-id="groomora"] .t-float,
  [data-template-id="groomora"] .t-float,
  [data-template-id="groomora"] .t-pulse,
  [data-template-id="groomora"] .t-pulse,
  [data-template-id="groomora"] .t-shimmer,
  [data-template-id="groomora"] .t-shimmer,
  [data-template-id="groomora"] .t-glow,
  [data-template-id="groomora"] .t-glow,
  [data-template-id="groomora"] .t-scalein,
  [data-template-id="groomora"] .t-scalein,
  [data-template-id="groomora"] .t-fade,
  [data-template-id="groomora"] .t-fade { animation: none !important; }
}
`;
