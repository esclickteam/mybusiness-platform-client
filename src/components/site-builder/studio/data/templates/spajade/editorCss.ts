export const spajadeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Infant:wght@500;600;700&family=Manrope:wght@400;500;700&display=swap');

[data-template-id="spajade"],
[data-template-id="spajade-preview"] {
  --p: #10B981;
  --s: #ECFDF5;
  --a: #A7F3D0;
  --bg: #07140F;
  --surface: #10231A;
  --text: #ECFDF5;
  --muted: #A1BDAF;
  --dark: #030A07;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="spajade"] .t-display,
[data-template-id="spajade-preview"] .t-display {
  font-family: "Cormorant Infant", serif;
}

@keyframes spajade-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes spajade-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spajade-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spajade-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes spajade-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes spajade-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes spajade-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes spajade-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes spajade-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="spajade"] .t-ken,
[data-template-id="spajade-preview"] .t-ken { animation: spajade-ken 18s ease-in-out infinite alternate; }
[data-template-id="spajade"] .t-anim,
[data-template-id="spajade-preview"] .t-anim { animation: spajade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="spajade"] .t-d1,
[data-template-id="spajade-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="spajade"] .t-d2,
[data-template-id="spajade-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="spajade"] .t-d3,
[data-template-id="spajade-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="spajade"] .t-fade,
[data-template-id="spajade-preview"] .t-fade { animation: spajade-fade 1s ease both; }
[data-template-id="spajade"] .t-marquee,
[data-template-id="spajade-preview"] .t-marquee { animation: spajade-marquee 30s linear infinite; width: max-content; }
[data-template-id="spajade"] .t-float,
[data-template-id="spajade-preview"] .t-float { animation: spajade-float 6s ease-in-out infinite; }
[data-template-id="spajade"] .t-pulse,
[data-template-id="spajade-preview"] .t-pulse { animation: spajade-pulse 2.8s ease-in-out infinite; }
[data-template-id="spajade"] .t-shimmer,
[data-template-id="spajade-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: spajade-shimmer 2.8s linear infinite;
}
[data-template-id="spajade"] .t-glow,
[data-template-id="spajade-preview"] .t-glow { animation: spajade-glow 3.2s ease-in-out infinite; }
[data-template-id="spajade"] .t-scalein,
[data-template-id="spajade-preview"] .t-scalein { animation: spajade-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="spajade"] .t-hover,
[data-template-id="spajade-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="spajade"] .t-hover:hover,
[data-template-id="spajade-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="spajade"] .t-ken,
  [data-template-id="spajade-preview"] .t-ken,
  [data-template-id="spajade"] .t-anim,
  [data-template-id="spajade-preview"] .t-anim,
  [data-template-id="spajade"] .t-marquee,
  [data-template-id="spajade-preview"] .t-marquee,
  [data-template-id="spajade"] .t-float,
  [data-template-id="spajade-preview"] .t-float,
  [data-template-id="spajade"] .t-pulse,
  [data-template-id="spajade-preview"] .t-pulse,
  [data-template-id="spajade"] .t-shimmer,
  [data-template-id="spajade-preview"] .t-shimmer,
  [data-template-id="spajade"] .t-glow,
  [data-template-id="spajade-preview"] .t-glow,
  [data-template-id="spajade"] .t-scalein,
  [data-template-id="spajade-preview"] .t-scalein,
  [data-template-id="spajade"] .t-fade,
  [data-template-id="spajade-preview"] .t-fade { animation: none !important; }
}
`;
