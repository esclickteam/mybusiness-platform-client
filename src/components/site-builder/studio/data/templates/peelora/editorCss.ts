export const peeloraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Upright:wght@500;600;700&family=Sora:wght@400;500;700&display=swap');

[data-template-id="peelora"],
[data-template-id="peelora"] {
  --p: #0EA5E9;
  --s: #EFF6FF;
  --a: #BAE6FD;
  --bg: #F8FCFF;
  --surface: #FFFFFF;
  --text: #0C4A6E;
  --muted: #63889B;
  --dark: #082F49;
  font-family: "Sora", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="peelora"] .t-display,
[data-template-id="peelora"] .t-display {
  font-family: "Cormorant Upright", serif;
}

@keyframes peelora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes peelora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes peelora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes peelora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes peelora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes peelora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes peelora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes peelora-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes peelora-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="peelora"] .t-ken,
[data-template-id="peelora"] .t-ken { animation: peelora-ken 18s ease-in-out infinite alternate; }
[data-template-id="peelora"] .t-anim,
[data-template-id="peelora"] .t-anim { animation: peelora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="peelora"] .t-d1,
[data-template-id="peelora"] .t-d1 { animation-delay: .12s; }
[data-template-id="peelora"] .t-d2,
[data-template-id="peelora"] .t-d2 { animation-delay: .24s; }
[data-template-id="peelora"] .t-d3,
[data-template-id="peelora"] .t-d3 { animation-delay: .36s; }
[data-template-id="peelora"] .t-fade,
[data-template-id="peelora"] .t-fade { animation: peelora-fade 1s ease both; }
[data-template-id="peelora"] .t-marquee,
[data-template-id="peelora"] .t-marquee { animation: peelora-marquee 30s linear infinite; width: max-content; }
[data-template-id="peelora"] .t-float,
[data-template-id="peelora"] .t-float { animation: peelora-float 6s ease-in-out infinite; }
[data-template-id="peelora"] .t-pulse,
[data-template-id="peelora"] .t-pulse { animation: peelora-pulse 2.8s ease-in-out infinite; }
[data-template-id="peelora"] .t-shimmer,
[data-template-id="peelora"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: peelora-shimmer 2.8s linear infinite;
}
[data-template-id="peelora"] .t-glow,
[data-template-id="peelora"] .t-glow { animation: peelora-glow 3.2s ease-in-out infinite; }
[data-template-id="peelora"] .t-scalein,
[data-template-id="peelora"] .t-scalein { animation: peelora-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="peelora"] .t-hover,
[data-template-id="peelora"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="peelora"] .t-hover:hover,
[data-template-id="peelora"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="peelora"] .t-ken,
  [data-template-id="peelora"] .t-ken,
  [data-template-id="peelora"] .t-anim,
  [data-template-id="peelora"] .t-anim,
  [data-template-id="peelora"] .t-marquee,
  [data-template-id="peelora"] .t-marquee,
  [data-template-id="peelora"] .t-float,
  [data-template-id="peelora"] .t-float,
  [data-template-id="peelora"] .t-pulse,
  [data-template-id="peelora"] .t-pulse,
  [data-template-id="peelora"] .t-shimmer,
  [data-template-id="peelora"] .t-shimmer,
  [data-template-id="peelora"] .t-glow,
  [data-template-id="peelora"] .t-glow,
  [data-template-id="peelora"] .t-scalein,
  [data-template-id="peelora"] .t-scalein,
  [data-template-id="peelora"] .t-fade,
  [data-template-id="peelora"] .t-fade { animation: none !important; }
}
`;
