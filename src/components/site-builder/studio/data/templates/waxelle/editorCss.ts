export const waxelleEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Work+Sans:wght@400;500;600;700&display=swap');

[data-template-id="waxelle"],
[data-template-id="waxelle"] {
  --p: #EA580C;
  --s: #FFF7ED;
  --a: #FB923C;
  --bg: #FFFBF5;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #9A6B4F;
  --dark: #1C0A04;
  font-family: "Work Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="waxelle"] .t-display,
[data-template-id="waxelle"] .t-display {
  font-family: "Bricolage Grotesque", serif;
}

@keyframes waxelle-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes waxelle-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes waxelle-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes waxelle-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes waxelle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes waxelle-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes waxelle-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes waxelle-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes waxelle-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="waxelle"] .t-ken,
[data-template-id="waxelle"] .t-ken { animation: waxelle-ken 18s ease-in-out infinite alternate; }
[data-template-id="waxelle"] .t-anim,
[data-template-id="waxelle"] .t-anim { animation: waxelle-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="waxelle"] .t-d1,
[data-template-id="waxelle"] .t-d1 { animation-delay: .12s; }
[data-template-id="waxelle"] .t-d2,
[data-template-id="waxelle"] .t-d2 { animation-delay: .24s; }
[data-template-id="waxelle"] .t-d3,
[data-template-id="waxelle"] .t-d3 { animation-delay: .36s; }
[data-template-id="waxelle"] .t-fade,
[data-template-id="waxelle"] .t-fade { animation: waxelle-fade 1s ease both; }
[data-template-id="waxelle"] .t-marquee,
[data-template-id="waxelle"] .t-marquee { animation: waxelle-marquee 30s linear infinite; width: max-content; }
[data-template-id="waxelle"] .t-float,
[data-template-id="waxelle"] .t-float { animation: waxelle-float 6s ease-in-out infinite; }
[data-template-id="waxelle"] .t-pulse,
[data-template-id="waxelle"] .t-pulse { animation: waxelle-pulse 2.8s ease-in-out infinite; }
[data-template-id="waxelle"] .t-shimmer,
[data-template-id="waxelle"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: waxelle-shimmer 2.8s linear infinite;
}
[data-template-id="waxelle"] .t-glow,
[data-template-id="waxelle"] .t-glow { animation: waxelle-glow 3.2s ease-in-out infinite; }
[data-template-id="waxelle"] .t-scalein,
[data-template-id="waxelle"] .t-scalein { animation: waxelle-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="waxelle"] .t-hover,
[data-template-id="waxelle"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="waxelle"] .t-hover:hover,
[data-template-id="waxelle"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="waxelle"] .t-ken,
  [data-template-id="waxelle"] .t-ken,
  [data-template-id="waxelle"] .t-anim,
  [data-template-id="waxelle"] .t-anim,
  [data-template-id="waxelle"] .t-marquee,
  [data-template-id="waxelle"] .t-marquee,
  [data-template-id="waxelle"] .t-float,
  [data-template-id="waxelle"] .t-float,
  [data-template-id="waxelle"] .t-pulse,
  [data-template-id="waxelle"] .t-pulse,
  [data-template-id="waxelle"] .t-shimmer,
  [data-template-id="waxelle"] .t-shimmer,
  [data-template-id="waxelle"] .t-glow,
  [data-template-id="waxelle"] .t-glow,
  [data-template-id="waxelle"] .t-scalein,
  [data-template-id="waxelle"] .t-scalein,
  [data-template-id="waxelle"] .t-fade,
  [data-template-id="waxelle"] .t-fade { animation: none !important; }
}
`;
