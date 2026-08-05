export const kidwiseEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

[data-template-id="kidwise"],
[data-template-id="kidwise"] {
  --p: #10B981;
  --s: #ECFDF5;
  --a: #FBBF24;
  --bg: #ECFDF5;
  --surface: #FFFFFF;
  --text: #064E3B;
  --muted: #6B7280;
  --dark: #022C22;
  font-family: "Nunito", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="kidwise"] .t-display,
[data-template-id="kidwise"] .t-display {
  font-family: "Fredoka", sans-serif;
}

@keyframes kidwise-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes kidwise-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes kidwise-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes kidwise-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes kidwise-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes kidwise-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes kidwise-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes kidwise-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="kidwise"] .t-ken,
[data-template-id="kidwise"] .t-ken { animation: kidwise-ken 16s ease-in-out infinite alternate; }
[data-template-id="kidwise"] .t-anim,
[data-template-id="kidwise"] .t-anim { animation: kidwise-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="kidwise"] .t-d1,
[data-template-id="kidwise"] .t-d1 { animation-delay: .12s; }
[data-template-id="kidwise"] .t-d2,
[data-template-id="kidwise"] .t-d2 { animation-delay: .24s; }
[data-template-id="kidwise"] .t-d3,
[data-template-id="kidwise"] .t-d3 { animation-delay: .36s; }
[data-template-id="kidwise"] .t-fade,
[data-template-id="kidwise"] .t-fade { animation: kidwise-fade 1s ease both; }
[data-template-id="kidwise"] .t-marquee,
[data-template-id="kidwise"] .t-marquee { animation: kidwise-marquee 28s linear infinite; width: max-content; }
[data-template-id="kidwise"] .t-float,
[data-template-id="kidwise"] .t-float { animation: kidwise-float 6.5s ease-in-out infinite; }
[data-template-id="kidwise"] .t-pulse,
[data-template-id="kidwise"] .t-pulse { animation: kidwise-pulse 2.6s ease-in-out infinite; }
[data-template-id="kidwise"] .t-wave,
[data-template-id="kidwise"] .t-wave { animation: kidwise-wave 2.2s ease-in-out infinite; }
[data-template-id="kidwise"] .t-hover,
[data-template-id="kidwise"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="kidwise"] .t-hover:hover,
[data-template-id="kidwise"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="kidwise"] .t-ken,
  [data-template-id="kidwise"] .t-ken,
  [data-template-id="kidwise"] .t-anim,
  [data-template-id="kidwise"] .t-anim,
  [data-template-id="kidwise"] .t-marquee,
  [data-template-id="kidwise"] .t-marquee,
  [data-template-id="kidwise"] .t-float,
  [data-template-id="kidwise"] .t-float,
  [data-template-id="kidwise"] .t-pulse,
  [data-template-id="kidwise"] .t-pulse,
  [data-template-id="kidwise"] .t-wave,
  [data-template-id="kidwise"] .t-wave,
  [data-template-id="kidwise"] .t-fade,
  [data-template-id="kidwise"] .t-fade { animation: none !important; }
}
`;
