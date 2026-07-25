export const blushlabEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Karla:wght@400;500;600;700&display=swap');

[data-template-id="blushlab"],
[data-template-id="blushlab-preview"] {
  --p: #E11D48;
  --s: #1C0A10;
  --a: #FB7185;
  --bg: #14080C;
  --surface: #241018;
  --text: #FFF1F2;
  --muted: #E8A0AE;
  --dark: #0A0406;
  font-family: "Karla", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="blushlab"] .t-display,
[data-template-id="blushlab-preview"] .t-display {
  font-family: "Playfair Display", serif;
}

@keyframes blushlab-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes blushlab-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes blushlab-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes blushlab-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes blushlab-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes blushlab-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes blushlab-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes blushlab-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes blushlab-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="blushlab"] .t-ken,
[data-template-id="blushlab-preview"] .t-ken { animation: blushlab-ken 18s ease-in-out infinite alternate; }
[data-template-id="blushlab"] .t-anim,
[data-template-id="blushlab-preview"] .t-anim { animation: blushlab-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="blushlab"] .t-d1,
[data-template-id="blushlab-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="blushlab"] .t-d2,
[data-template-id="blushlab-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="blushlab"] .t-d3,
[data-template-id="blushlab-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="blushlab"] .t-fade,
[data-template-id="blushlab-preview"] .t-fade { animation: blushlab-fade 1s ease both; }
[data-template-id="blushlab"] .t-marquee,
[data-template-id="blushlab-preview"] .t-marquee { animation: blushlab-marquee 30s linear infinite; width: max-content; }
[data-template-id="blushlab"] .t-float,
[data-template-id="blushlab-preview"] .t-float { animation: blushlab-float 6s ease-in-out infinite; }
[data-template-id="blushlab"] .t-pulse,
[data-template-id="blushlab-preview"] .t-pulse { animation: blushlab-pulse 2.8s ease-in-out infinite; }
[data-template-id="blushlab"] .t-shimmer,
[data-template-id="blushlab-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: blushlab-shimmer 2.8s linear infinite;
}
[data-template-id="blushlab"] .t-glow,
[data-template-id="blushlab-preview"] .t-glow { animation: blushlab-glow 3.2s ease-in-out infinite; }
[data-template-id="blushlab"] .t-scalein,
[data-template-id="blushlab-preview"] .t-scalein { animation: blushlab-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="blushlab"] .t-hover,
[data-template-id="blushlab-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="blushlab"] .t-hover:hover,
[data-template-id="blushlab-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="blushlab"] .t-ken,
  [data-template-id="blushlab-preview"] .t-ken,
  [data-template-id="blushlab"] .t-anim,
  [data-template-id="blushlab-preview"] .t-anim,
  [data-template-id="blushlab"] .t-marquee,
  [data-template-id="blushlab-preview"] .t-marquee,
  [data-template-id="blushlab"] .t-float,
  [data-template-id="blushlab-preview"] .t-float,
  [data-template-id="blushlab"] .t-pulse,
  [data-template-id="blushlab-preview"] .t-pulse,
  [data-template-id="blushlab"] .t-shimmer,
  [data-template-id="blushlab-preview"] .t-shimmer,
  [data-template-id="blushlab"] .t-glow,
  [data-template-id="blushlab-preview"] .t-glow,
  [data-template-id="blushlab"] .t-scalein,
  [data-template-id="blushlab-preview"] .t-scalein,
  [data-template-id="blushlab"] .t-fade,
  [data-template-id="blushlab-preview"] .t-fade { animation: none !important; }
}
`;
