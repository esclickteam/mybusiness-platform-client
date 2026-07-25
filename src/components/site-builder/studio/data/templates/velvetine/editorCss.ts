export const velvetineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

[data-template-id="velvetine"],
[data-template-id="velvetine-preview"] {
  --p: #C9A227;
  --s: #1A1210;
  --a: #E8D5A3;
  --bg: #120E0C;
  --surface: #1F1714;
  --text: #F5EDE3;
  --muted: #A89888;
  --dark: #0A0807;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="velvetine"] .t-display,
[data-template-id="velvetine-preview"] .t-display {
  font-family: "Cormorant Garamond", serif;
}

@keyframes velvetine-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes velvetine-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes velvetine-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes velvetine-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes velvetine-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes velvetine-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes velvetine-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes velvetine-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes velvetine-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="velvetine"] .t-ken,
[data-template-id="velvetine-preview"] .t-ken { animation: velvetine-ken 18s ease-in-out infinite alternate; }
[data-template-id="velvetine"] .t-anim,
[data-template-id="velvetine-preview"] .t-anim { animation: velvetine-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="velvetine"] .t-d1,
[data-template-id="velvetine-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="velvetine"] .t-d2,
[data-template-id="velvetine-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="velvetine"] .t-d3,
[data-template-id="velvetine-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="velvetine"] .t-fade,
[data-template-id="velvetine-preview"] .t-fade { animation: velvetine-fade 1s ease both; }
[data-template-id="velvetine"] .t-marquee,
[data-template-id="velvetine-preview"] .t-marquee { animation: velvetine-marquee 30s linear infinite; width: max-content; }
[data-template-id="velvetine"] .t-float,
[data-template-id="velvetine-preview"] .t-float { animation: velvetine-float 6s ease-in-out infinite; }
[data-template-id="velvetine"] .t-pulse,
[data-template-id="velvetine-preview"] .t-pulse { animation: velvetine-pulse 2.8s ease-in-out infinite; }
[data-template-id="velvetine"] .t-shimmer,
[data-template-id="velvetine-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: velvetine-shimmer 2.8s linear infinite;
}
[data-template-id="velvetine"] .t-glow,
[data-template-id="velvetine-preview"] .t-glow { animation: velvetine-glow 3.2s ease-in-out infinite; }
[data-template-id="velvetine"] .t-scalein,
[data-template-id="velvetine-preview"] .t-scalein { animation: velvetine-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="velvetine"] .t-hover,
[data-template-id="velvetine-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="velvetine"] .t-hover:hover,
[data-template-id="velvetine-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="velvetine"] .t-ken,
  [data-template-id="velvetine-preview"] .t-ken,
  [data-template-id="velvetine"] .t-anim,
  [data-template-id="velvetine-preview"] .t-anim,
  [data-template-id="velvetine"] .t-marquee,
  [data-template-id="velvetine-preview"] .t-marquee,
  [data-template-id="velvetine"] .t-float,
  [data-template-id="velvetine-preview"] .t-float,
  [data-template-id="velvetine"] .t-pulse,
  [data-template-id="velvetine-preview"] .t-pulse,
  [data-template-id="velvetine"] .t-shimmer,
  [data-template-id="velvetine-preview"] .t-shimmer,
  [data-template-id="velvetine"] .t-glow,
  [data-template-id="velvetine-preview"] .t-glow,
  [data-template-id="velvetine"] .t-scalein,
  [data-template-id="velvetine-preview"] .t-scalein,
  [data-template-id="velvetine"] .t-fade,
  [data-template-id="velvetine-preview"] .t-fade { animation: none !important; }
}
`;
