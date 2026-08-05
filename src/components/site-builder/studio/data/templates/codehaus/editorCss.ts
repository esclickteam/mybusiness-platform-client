export const codehausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

[data-template-id="codehaus"],
[data-template-id="codehaus"] {
  --p: #22C55E;
  --s: #020617;
  --a: #4ADE80;
  --bg: #020617;
  --surface: #0F172A;
  --text: #E2E8F0;
  --muted: #64748B;
  --dark: #000000;
  font-family: "IBM Plex Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="codehaus"] .t-display,
[data-template-id="codehaus"] .t-display {
  font-family: "JetBrains Mono", sans-serif;
}

@keyframes codehaus-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes codehaus-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes codehaus-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes codehaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes codehaus-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes codehaus-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes codehaus-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes codehaus-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="codehaus"] .t-ken,
[data-template-id="codehaus"] .t-ken { animation: codehaus-ken 16s ease-in-out infinite alternate; }
[data-template-id="codehaus"] .t-anim,
[data-template-id="codehaus"] .t-anim { animation: codehaus-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="codehaus"] .t-d1,
[data-template-id="codehaus"] .t-d1 { animation-delay: .12s; }
[data-template-id="codehaus"] .t-d2,
[data-template-id="codehaus"] .t-d2 { animation-delay: .24s; }
[data-template-id="codehaus"] .t-d3,
[data-template-id="codehaus"] .t-d3 { animation-delay: .36s; }
[data-template-id="codehaus"] .t-fade,
[data-template-id="codehaus"] .t-fade { animation: codehaus-fade 1s ease both; }
[data-template-id="codehaus"] .t-marquee,
[data-template-id="codehaus"] .t-marquee { animation: codehaus-marquee 28s linear infinite; width: max-content; }
[data-template-id="codehaus"] .t-float,
[data-template-id="codehaus"] .t-float { animation: codehaus-float 6.5s ease-in-out infinite; }
[data-template-id="codehaus"] .t-pulse,
[data-template-id="codehaus"] .t-pulse { animation: codehaus-pulse 2.6s ease-in-out infinite; }
[data-template-id="codehaus"] .t-wave,
[data-template-id="codehaus"] .t-wave { animation: codehaus-wave 2.2s ease-in-out infinite; }
[data-template-id="codehaus"] .t-hover,
[data-template-id="codehaus"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="codehaus"] .t-hover:hover,
[data-template-id="codehaus"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="codehaus"] .t-ken,
  [data-template-id="codehaus"] .t-ken,
  [data-template-id="codehaus"] .t-anim,
  [data-template-id="codehaus"] .t-anim,
  [data-template-id="codehaus"] .t-marquee,
  [data-template-id="codehaus"] .t-marquee,
  [data-template-id="codehaus"] .t-float,
  [data-template-id="codehaus"] .t-float,
  [data-template-id="codehaus"] .t-pulse,
  [data-template-id="codehaus"] .t-pulse,
  [data-template-id="codehaus"] .t-wave,
  [data-template-id="codehaus"] .t-wave,
  [data-template-id="codehaus"] .t-fade,
  [data-template-id="codehaus"] .t-fade { animation: none !important; }
}
`;
