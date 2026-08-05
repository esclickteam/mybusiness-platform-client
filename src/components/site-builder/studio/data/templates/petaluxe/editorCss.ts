export const petaluxeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lora:wght@400;500;600;700&display=swap');

[data-template-id="petaluxe"],
[data-template-id="petaluxe"] {
  --p: #BE185D;
  --s: #FDF2F8;
  --a: #F9A8D4;
  --bg: #FFF5F9;
  --surface: #FFFFFF;
  --text: #4A044E;
  --muted: #9D6B8A;
  --dark: #500724;
  font-family: "Lora", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="petaluxe"] .t-display,
[data-template-id="petaluxe"] .t-display {
  font-family: "Great Vibes", serif;
}

@keyframes petaluxe-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes petaluxe-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes petaluxe-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes petaluxe-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes petaluxe-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes petaluxe-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes petaluxe-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes petaluxe-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes petaluxe-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="petaluxe"] .t-ken,
[data-template-id="petaluxe"] .t-ken { animation: petaluxe-ken 18s ease-in-out infinite alternate; }
[data-template-id="petaluxe"] .t-anim,
[data-template-id="petaluxe"] .t-anim { animation: petaluxe-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="petaluxe"] .t-d1,
[data-template-id="petaluxe"] .t-d1 { animation-delay: .12s; }
[data-template-id="petaluxe"] .t-d2,
[data-template-id="petaluxe"] .t-d2 { animation-delay: .24s; }
[data-template-id="petaluxe"] .t-d3,
[data-template-id="petaluxe"] .t-d3 { animation-delay: .36s; }
[data-template-id="petaluxe"] .t-fade,
[data-template-id="petaluxe"] .t-fade { animation: petaluxe-fade 1s ease both; }
[data-template-id="petaluxe"] .t-marquee,
[data-template-id="petaluxe"] .t-marquee { animation: petaluxe-marquee 30s linear infinite; width: max-content; }
[data-template-id="petaluxe"] .t-float,
[data-template-id="petaluxe"] .t-float { animation: petaluxe-float 6s ease-in-out infinite; }
[data-template-id="petaluxe"] .t-pulse,
[data-template-id="petaluxe"] .t-pulse { animation: petaluxe-pulse 2.8s ease-in-out infinite; }
[data-template-id="petaluxe"] .t-shimmer,
[data-template-id="petaluxe"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: petaluxe-shimmer 2.8s linear infinite;
}
[data-template-id="petaluxe"] .t-glow,
[data-template-id="petaluxe"] .t-glow { animation: petaluxe-glow 3.2s ease-in-out infinite; }
[data-template-id="petaluxe"] .t-scalein,
[data-template-id="petaluxe"] .t-scalein { animation: petaluxe-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="petaluxe"] .t-hover,
[data-template-id="petaluxe"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="petaluxe"] .t-hover:hover,
[data-template-id="petaluxe"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="petaluxe"] .t-ken,
  [data-template-id="petaluxe"] .t-ken,
  [data-template-id="petaluxe"] .t-anim,
  [data-template-id="petaluxe"] .t-anim,
  [data-template-id="petaluxe"] .t-marquee,
  [data-template-id="petaluxe"] .t-marquee,
  [data-template-id="petaluxe"] .t-float,
  [data-template-id="petaluxe"] .t-float,
  [data-template-id="petaluxe"] .t-pulse,
  [data-template-id="petaluxe"] .t-pulse,
  [data-template-id="petaluxe"] .t-shimmer,
  [data-template-id="petaluxe"] .t-shimmer,
  [data-template-id="petaluxe"] .t-glow,
  [data-template-id="petaluxe"] .t-glow,
  [data-template-id="petaluxe"] .t-scalein,
  [data-template-id="petaluxe"] .t-scalein,
  [data-template-id="petaluxe"] .t-fade,
  [data-template-id="petaluxe"] .t-fade { animation: none !important; }
}
`;
