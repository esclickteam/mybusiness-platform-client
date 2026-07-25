export const chromabarEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;700&display=swap');

[data-template-id="chromabar"],
[data-template-id="chromabar-preview"] {
  --p: #2563EB;
  --s: #EFF6FF;
  --a: #93C5FD;
  --bg: #0B1220;
  --surface: #111C2F;
  --text: #EAF2FF;
  --muted: #9FB3CF;
  --dark: #050914;
  font-family: "Inter", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="chromabar"] .t-display,
[data-template-id="chromabar-preview"] .t-display {
  font-family: "Archivo Black", serif;
}

@keyframes chromabar-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes chromabar-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes chromabar-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes chromabar-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes chromabar-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes chromabar-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes chromabar-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes chromabar-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes chromabar-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="chromabar"] .t-ken,
[data-template-id="chromabar-preview"] .t-ken { animation: chromabar-ken 18s ease-in-out infinite alternate; }
[data-template-id="chromabar"] .t-anim,
[data-template-id="chromabar-preview"] .t-anim { animation: chromabar-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="chromabar"] .t-d1,
[data-template-id="chromabar-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="chromabar"] .t-d2,
[data-template-id="chromabar-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="chromabar"] .t-d3,
[data-template-id="chromabar-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="chromabar"] .t-fade,
[data-template-id="chromabar-preview"] .t-fade { animation: chromabar-fade 1s ease both; }
[data-template-id="chromabar"] .t-marquee,
[data-template-id="chromabar-preview"] .t-marquee { animation: chromabar-marquee 30s linear infinite; width: max-content; }
[data-template-id="chromabar"] .t-float,
[data-template-id="chromabar-preview"] .t-float { animation: chromabar-float 6s ease-in-out infinite; }
[data-template-id="chromabar"] .t-pulse,
[data-template-id="chromabar-preview"] .t-pulse { animation: chromabar-pulse 2.8s ease-in-out infinite; }
[data-template-id="chromabar"] .t-shimmer,
[data-template-id="chromabar-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: chromabar-shimmer 2.8s linear infinite;
}
[data-template-id="chromabar"] .t-glow,
[data-template-id="chromabar-preview"] .t-glow { animation: chromabar-glow 3.2s ease-in-out infinite; }
[data-template-id="chromabar"] .t-scalein,
[data-template-id="chromabar-preview"] .t-scalein { animation: chromabar-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="chromabar"] .t-hover,
[data-template-id="chromabar-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="chromabar"] .t-hover:hover,
[data-template-id="chromabar-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="chromabar"] .t-ken,
  [data-template-id="chromabar-preview"] .t-ken,
  [data-template-id="chromabar"] .t-anim,
  [data-template-id="chromabar-preview"] .t-anim,
  [data-template-id="chromabar"] .t-marquee,
  [data-template-id="chromabar-preview"] .t-marquee,
  [data-template-id="chromabar"] .t-float,
  [data-template-id="chromabar-preview"] .t-float,
  [data-template-id="chromabar"] .t-pulse,
  [data-template-id="chromabar-preview"] .t-pulse,
  [data-template-id="chromabar"] .t-shimmer,
  [data-template-id="chromabar-preview"] .t-shimmer,
  [data-template-id="chromabar"] .t-glow,
  [data-template-id="chromabar-preview"] .t-glow,
  [data-template-id="chromabar"] .t-scalein,
  [data-template-id="chromabar-preview"] .t-scalein,
  [data-template-id="chromabar"] .t-fade,
  [data-template-id="chromabar-preview"] .t-fade { animation: none !important; }
}
`;
