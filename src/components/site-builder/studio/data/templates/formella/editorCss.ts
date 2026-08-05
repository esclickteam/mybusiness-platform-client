export const formellaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');

[data-template-id="formella"],
[data-template-id="formella"] {
  --p: #84CC16;
  --s: #0A0F08;
  --a: #A3E635;
  --bg: #0B1009;
  --surface: #152014;
  --text: #F7FEE7;
  --muted: #9CA88A;
  --dark: #050705;
  font-family: "Schibsted Grotesk", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="formella"] .t-display,
[data-template-id="formella"] .t-display {
  font-family: "Space Grotesk", serif;
}

@keyframes formella-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes formella-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes formella-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes formella-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes formella-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes formella-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes formella-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes formella-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes formella-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="formella"] .t-ken,
[data-template-id="formella"] .t-ken { animation: formella-ken 18s ease-in-out infinite alternate; }
[data-template-id="formella"] .t-anim,
[data-template-id="formella"] .t-anim { animation: formella-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="formella"] .t-d1,
[data-template-id="formella"] .t-d1 { animation-delay: .12s; }
[data-template-id="formella"] .t-d2,
[data-template-id="formella"] .t-d2 { animation-delay: .24s; }
[data-template-id="formella"] .t-d3,
[data-template-id="formella"] .t-d3 { animation-delay: .36s; }
[data-template-id="formella"] .t-fade,
[data-template-id="formella"] .t-fade { animation: formella-fade 1s ease both; }
[data-template-id="formella"] .t-marquee,
[data-template-id="formella"] .t-marquee { animation: formella-marquee 30s linear infinite; width: max-content; }
[data-template-id="formella"] .t-float,
[data-template-id="formella"] .t-float { animation: formella-float 6s ease-in-out infinite; }
[data-template-id="formella"] .t-pulse,
[data-template-id="formella"] .t-pulse { animation: formella-pulse 2.8s ease-in-out infinite; }
[data-template-id="formella"] .t-shimmer,
[data-template-id="formella"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: formella-shimmer 2.8s linear infinite;
}
[data-template-id="formella"] .t-glow,
[data-template-id="formella"] .t-glow { animation: formella-glow 3.2s ease-in-out infinite; }
[data-template-id="formella"] .t-scalein,
[data-template-id="formella"] .t-scalein { animation: formella-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="formella"] .t-hover,
[data-template-id="formella"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="formella"] .t-hover:hover,
[data-template-id="formella"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="formella"] .t-ken,
  [data-template-id="formella"] .t-ken,
  [data-template-id="formella"] .t-anim,
  [data-template-id="formella"] .t-anim,
  [data-template-id="formella"] .t-marquee,
  [data-template-id="formella"] .t-marquee,
  [data-template-id="formella"] .t-float,
  [data-template-id="formella"] .t-float,
  [data-template-id="formella"] .t-pulse,
  [data-template-id="formella"] .t-pulse,
  [data-template-id="formella"] .t-shimmer,
  [data-template-id="formella"] .t-shimmer,
  [data-template-id="formella"] .t-glow,
  [data-template-id="formella"] .t-glow,
  [data-template-id="formella"] .t-scalein,
  [data-template-id="formella"] .t-scalein,
  [data-template-id="formella"] .t-fade,
  [data-template-id="formella"] .t-fade { animation: none !important; }
}
`;
