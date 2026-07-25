export const nailoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

[data-template-id="nailora"],
[data-template-id="nailora-preview"] {
  --p: #FF4D8D;
  --s: #FFF5F8;
  --a: #FFB3C7;
  --bg: #FFF8FA;
  --surface: #FFFFFF;
  --text: #3D1F2E;
  --muted: #9A6B7C;
  --dark: #2A1220;
  font-family: "Nunito", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="nailora"] .t-display,
[data-template-id="nailora-preview"] .t-display {
  font-family: "Fredoka", serif;
}

@keyframes nailora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes nailora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes nailora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes nailora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes nailora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes nailora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes nailora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes nailora-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes nailora-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="nailora"] .t-ken,
[data-template-id="nailora-preview"] .t-ken { animation: nailora-ken 18s ease-in-out infinite alternate; }
[data-template-id="nailora"] .t-anim,
[data-template-id="nailora-preview"] .t-anim { animation: nailora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="nailora"] .t-d1,
[data-template-id="nailora-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="nailora"] .t-d2,
[data-template-id="nailora-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="nailora"] .t-d3,
[data-template-id="nailora-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="nailora"] .t-fade,
[data-template-id="nailora-preview"] .t-fade { animation: nailora-fade 1s ease both; }
[data-template-id="nailora"] .t-marquee,
[data-template-id="nailora-preview"] .t-marquee { animation: nailora-marquee 30s linear infinite; width: max-content; }
[data-template-id="nailora"] .t-float,
[data-template-id="nailora-preview"] .t-float { animation: nailora-float 6s ease-in-out infinite; }
[data-template-id="nailora"] .t-pulse,
[data-template-id="nailora-preview"] .t-pulse { animation: nailora-pulse 2.8s ease-in-out infinite; }
[data-template-id="nailora"] .t-shimmer,
[data-template-id="nailora-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: nailora-shimmer 2.8s linear infinite;
}
[data-template-id="nailora"] .t-glow,
[data-template-id="nailora-preview"] .t-glow { animation: nailora-glow 3.2s ease-in-out infinite; }
[data-template-id="nailora"] .t-scalein,
[data-template-id="nailora-preview"] .t-scalein { animation: nailora-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="nailora"] .t-hover,
[data-template-id="nailora-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="nailora"] .t-hover:hover,
[data-template-id="nailora-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="nailora"] .t-ken,
  [data-template-id="nailora-preview"] .t-ken,
  [data-template-id="nailora"] .t-anim,
  [data-template-id="nailora-preview"] .t-anim,
  [data-template-id="nailora"] .t-marquee,
  [data-template-id="nailora-preview"] .t-marquee,
  [data-template-id="nailora"] .t-float,
  [data-template-id="nailora-preview"] .t-float,
  [data-template-id="nailora"] .t-pulse,
  [data-template-id="nailora-preview"] .t-pulse,
  [data-template-id="nailora"] .t-shimmer,
  [data-template-id="nailora-preview"] .t-shimmer,
  [data-template-id="nailora"] .t-glow,
  [data-template-id="nailora-preview"] .t-glow,
  [data-template-id="nailora"] .t-scalein,
  [data-template-id="nailora-preview"] .t-scalein,
  [data-template-id="nailora"] .t-fade,
  [data-template-id="nailora-preview"] .t-fade { animation: none !important; }
}
`;
