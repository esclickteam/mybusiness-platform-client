export const skillforgeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Barlow:wght@400;500;600;700&display=swap');

[data-template-id="skillforge"],
[data-template-id="skillforge"] {
  --p: #A3E635;
  --s: #18181B;
  --a: #84CC16;
  --bg: #18181B;
  --surface: #27272A;
  --text: #FAFAFA;
  --muted: #A1A1AA;
  --dark: #09090B;
  font-family: "Barlow", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="skillforge"] .t-display,
[data-template-id="skillforge"] .t-display {
  font-family: "Oswald", sans-serif;
}

@keyframes skillforge-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes skillforge-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes skillforge-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes skillforge-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes skillforge-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes skillforge-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes skillforge-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes skillforge-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="skillforge"] .t-ken,
[data-template-id="skillforge"] .t-ken { animation: skillforge-ken 16s ease-in-out infinite alternate; }
[data-template-id="skillforge"] .t-anim,
[data-template-id="skillforge"] .t-anim { animation: skillforge-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="skillforge"] .t-d1,
[data-template-id="skillforge"] .t-d1 { animation-delay: .12s; }
[data-template-id="skillforge"] .t-d2,
[data-template-id="skillforge"] .t-d2 { animation-delay: .24s; }
[data-template-id="skillforge"] .t-d3,
[data-template-id="skillforge"] .t-d3 { animation-delay: .36s; }
[data-template-id="skillforge"] .t-fade,
[data-template-id="skillforge"] .t-fade { animation: skillforge-fade 1s ease both; }
[data-template-id="skillforge"] .t-marquee,
[data-template-id="skillforge"] .t-marquee { animation: skillforge-marquee 28s linear infinite; width: max-content; }
[data-template-id="skillforge"] .t-float,
[data-template-id="skillforge"] .t-float { animation: skillforge-float 6.5s ease-in-out infinite; }
[data-template-id="skillforge"] .t-pulse,
[data-template-id="skillforge"] .t-pulse { animation: skillforge-pulse 2.6s ease-in-out infinite; }
[data-template-id="skillforge"] .t-wave,
[data-template-id="skillforge"] .t-wave { animation: skillforge-wave 2.2s ease-in-out infinite; }
[data-template-id="skillforge"] .t-hover,
[data-template-id="skillforge"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="skillforge"] .t-hover:hover,
[data-template-id="skillforge"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="skillforge"] .t-ken,
  [data-template-id="skillforge"] .t-ken,
  [data-template-id="skillforge"] .t-anim,
  [data-template-id="skillforge"] .t-anim,
  [data-template-id="skillforge"] .t-marquee,
  [data-template-id="skillforge"] .t-marquee,
  [data-template-id="skillforge"] .t-float,
  [data-template-id="skillforge"] .t-float,
  [data-template-id="skillforge"] .t-pulse,
  [data-template-id="skillforge"] .t-pulse,
  [data-template-id="skillforge"] .t-wave,
  [data-template-id="skillforge"] .t-wave,
  [data-template-id="skillforge"] .t-fade,
  [data-template-id="skillforge"] .t-fade { animation: none !important; }
}
`;
