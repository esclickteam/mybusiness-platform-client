export const notelineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

[data-template-id="noteline"],
[data-template-id="noteline"] {
  --p: #C2410C;
  --s: #1C1917;
  --a: #EA580C;
  --bg: #1C1917;
  --surface: #292524;
  --text: #FAFAF9;
  --muted: #A8A29E;
  --dark: #0C0A09;
  font-family: "Space Grotesk", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="noteline"] .t-display,
[data-template-id="noteline"] .t-display {
  font-family: "Outfit", sans-serif;
}

@keyframes noteline-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes noteline-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes noteline-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes noteline-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes noteline-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes noteline-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes noteline-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes noteline-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="noteline"] .t-ken,
[data-template-id="noteline"] .t-ken { animation: noteline-ken 16s ease-in-out infinite alternate; }
[data-template-id="noteline"] .t-anim,
[data-template-id="noteline"] .t-anim { animation: noteline-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="noteline"] .t-d1,
[data-template-id="noteline"] .t-d1 { animation-delay: .12s; }
[data-template-id="noteline"] .t-d2,
[data-template-id="noteline"] .t-d2 { animation-delay: .24s; }
[data-template-id="noteline"] .t-d3,
[data-template-id="noteline"] .t-d3 { animation-delay: .36s; }
[data-template-id="noteline"] .t-fade,
[data-template-id="noteline"] .t-fade { animation: noteline-fade 1s ease both; }
[data-template-id="noteline"] .t-marquee,
[data-template-id="noteline"] .t-marquee { animation: noteline-marquee 28s linear infinite; width: max-content; }
[data-template-id="noteline"] .t-float,
[data-template-id="noteline"] .t-float { animation: noteline-float 6.5s ease-in-out infinite; }
[data-template-id="noteline"] .t-pulse,
[data-template-id="noteline"] .t-pulse { animation: noteline-pulse 2.6s ease-in-out infinite; }
[data-template-id="noteline"] .t-wave,
[data-template-id="noteline"] .t-wave { animation: noteline-wave 2.2s ease-in-out infinite; }
[data-template-id="noteline"] .t-hover,
[data-template-id="noteline"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="noteline"] .t-hover:hover,
[data-template-id="noteline"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="noteline"] .t-ken,
  [data-template-id="noteline"] .t-ken,
  [data-template-id="noteline"] .t-anim,
  [data-template-id="noteline"] .t-anim,
  [data-template-id="noteline"] .t-marquee,
  [data-template-id="noteline"] .t-marquee,
  [data-template-id="noteline"] .t-float,
  [data-template-id="noteline"] .t-float,
  [data-template-id="noteline"] .t-pulse,
  [data-template-id="noteline"] .t-pulse,
  [data-template-id="noteline"] .t-wave,
  [data-template-id="noteline"] .t-wave,
  [data-template-id="noteline"] .t-fade,
  [data-template-id="noteline"] .t-fade { animation: none !important; }
}
`;
