export const dermaraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;7..72,700&family=Source+Sans+3:wght@400;500;600;700&display=swap');

[data-template-id="dermara"],
[data-template-id="dermara"] {
  --p: #0D9488;
  --s: #F0FDFA;
  --a: #2DD4BF;
  --bg: #F7FFFD;
  --surface: #FFFFFF;
  --text: #134E4A;
  --muted: #5B8A84;
  --dark: #042F2E;
  font-family: "Source Sans 3", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="dermara"] .t-display,
[data-template-id="dermara"] .t-display {
  font-family: "Literata", serif;
}

@keyframes dermara-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes dermara-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes dermara-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes dermara-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes dermara-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes dermara-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes dermara-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes dermara-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes dermara-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="dermara"] .t-ken,
[data-template-id="dermara"] .t-ken { animation: dermara-ken 18s ease-in-out infinite alternate; }
[data-template-id="dermara"] .t-anim,
[data-template-id="dermara"] .t-anim { animation: dermara-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="dermara"] .t-d1,
[data-template-id="dermara"] .t-d1 { animation-delay: .12s; }
[data-template-id="dermara"] .t-d2,
[data-template-id="dermara"] .t-d2 { animation-delay: .24s; }
[data-template-id="dermara"] .t-d3,
[data-template-id="dermara"] .t-d3 { animation-delay: .36s; }
[data-template-id="dermara"] .t-fade,
[data-template-id="dermara"] .t-fade { animation: dermara-fade 1s ease both; }
[data-template-id="dermara"] .t-marquee,
[data-template-id="dermara"] .t-marquee { animation: dermara-marquee 30s linear infinite; width: max-content; }
[data-template-id="dermara"] .t-float,
[data-template-id="dermara"] .t-float { animation: dermara-float 6s ease-in-out infinite; }
[data-template-id="dermara"] .t-pulse,
[data-template-id="dermara"] .t-pulse { animation: dermara-pulse 2.8s ease-in-out infinite; }
[data-template-id="dermara"] .t-shimmer,
[data-template-id="dermara"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: dermara-shimmer 2.8s linear infinite;
}
[data-template-id="dermara"] .t-glow,
[data-template-id="dermara"] .t-glow { animation: dermara-glow 3.2s ease-in-out infinite; }
[data-template-id="dermara"] .t-scalein,
[data-template-id="dermara"] .t-scalein { animation: dermara-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="dermara"] .t-hover,
[data-template-id="dermara"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="dermara"] .t-hover:hover,
[data-template-id="dermara"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="dermara"] .t-ken,
  [data-template-id="dermara"] .t-ken,
  [data-template-id="dermara"] .t-anim,
  [data-template-id="dermara"] .t-anim,
  [data-template-id="dermara"] .t-marquee,
  [data-template-id="dermara"] .t-marquee,
  [data-template-id="dermara"] .t-float,
  [data-template-id="dermara"] .t-float,
  [data-template-id="dermara"] .t-pulse,
  [data-template-id="dermara"] .t-pulse,
  [data-template-id="dermara"] .t-shimmer,
  [data-template-id="dermara"] .t-shimmer,
  [data-template-id="dermara"] .t-glow,
  [data-template-id="dermara"] .t-glow,
  [data-template-id="dermara"] .t-scalein,
  [data-template-id="dermara"] .t-scalein,
  [data-template-id="dermara"] .t-fade,
  [data-template-id="dermara"] .t-fade { animation: none !important; }
}
`;
