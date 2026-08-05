export const browlineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,600;6..96,700&family=Arimo:wght@400;500;700&display=swap');

[data-template-id="browline"],
[data-template-id="browline"] {
  --p: #6D4C41;
  --s: #F8F1ED;
  --a: #D7B8A6;
  --bg: #FBF7F4;
  --surface: #FFFFFF;
  --text: #3E2723;
  --muted: #8A6D64;
  --dark: #1F100D;
  font-family: "Arimo", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="browline"] .t-display,
[data-template-id="browline"] .t-display {
  font-family: "Bodoni Moda", serif;
}

@keyframes browline-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes browline-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes browline-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes browline-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes browline-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes browline-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes browline-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes browline-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes browline-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="browline"] .t-ken,
[data-template-id="browline"] .t-ken { animation: browline-ken 18s ease-in-out infinite alternate; }
[data-template-id="browline"] .t-anim,
[data-template-id="browline"] .t-anim { animation: browline-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="browline"] .t-d1,
[data-template-id="browline"] .t-d1 { animation-delay: .12s; }
[data-template-id="browline"] .t-d2,
[data-template-id="browline"] .t-d2 { animation-delay: .24s; }
[data-template-id="browline"] .t-d3,
[data-template-id="browline"] .t-d3 { animation-delay: .36s; }
[data-template-id="browline"] .t-fade,
[data-template-id="browline"] .t-fade { animation: browline-fade 1s ease both; }
[data-template-id="browline"] .t-marquee,
[data-template-id="browline"] .t-marquee { animation: browline-marquee 30s linear infinite; width: max-content; }
[data-template-id="browline"] .t-float,
[data-template-id="browline"] .t-float { animation: browline-float 6s ease-in-out infinite; }
[data-template-id="browline"] .t-pulse,
[data-template-id="browline"] .t-pulse { animation: browline-pulse 2.8s ease-in-out infinite; }
[data-template-id="browline"] .t-shimmer,
[data-template-id="browline"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: browline-shimmer 2.8s linear infinite;
}
[data-template-id="browline"] .t-glow,
[data-template-id="browline"] .t-glow { animation: browline-glow 3.2s ease-in-out infinite; }
[data-template-id="browline"] .t-scalein,
[data-template-id="browline"] .t-scalein { animation: browline-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="browline"] .t-hover,
[data-template-id="browline"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="browline"] .t-hover:hover,
[data-template-id="browline"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="browline"] .t-ken,
  [data-template-id="browline"] .t-ken,
  [data-template-id="browline"] .t-anim,
  [data-template-id="browline"] .t-anim,
  [data-template-id="browline"] .t-marquee,
  [data-template-id="browline"] .t-marquee,
  [data-template-id="browline"] .t-float,
  [data-template-id="browline"] .t-float,
  [data-template-id="browline"] .t-pulse,
  [data-template-id="browline"] .t-pulse,
  [data-template-id="browline"] .t-shimmer,
  [data-template-id="browline"] .t-shimmer,
  [data-template-id="browline"] .t-glow,
  [data-template-id="browline"] .t-glow,
  [data-template-id="browline"] .t-scalein,
  [data-template-id="browline"] .t-scalein,
  [data-template-id="browline"] .t-fade,
  [data-template-id="browline"] .t-fade { animation: none !important; }
}
`;
