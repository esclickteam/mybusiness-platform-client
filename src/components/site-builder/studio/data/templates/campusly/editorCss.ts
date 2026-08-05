export const campuslyEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,600;7..72,700&family=Source+Sans+3:wght@400;500;600;700&display=swap');

[data-template-id="campusly"],
[data-template-id="campusly"] {
  --p: #1D4ED8;
  --s: #EFF6FF;
  --a: #3B82F6;
  --bg: #EFF6FF;
  --surface: #FFFFFF;
  --text: #1E3A8A;
  --muted: #64748B;
  --dark: #1E3A8A;
  font-family: "Source Sans 3", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="campusly"] .t-display,
[data-template-id="campusly"] .t-display {
  font-family: "Literata", sans-serif;
}

@keyframes campusly-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes campusly-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes campusly-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes campusly-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes campusly-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes campusly-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes campusly-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes campusly-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="campusly"] .t-ken,
[data-template-id="campusly"] .t-ken { animation: campusly-ken 16s ease-in-out infinite alternate; }
[data-template-id="campusly"] .t-anim,
[data-template-id="campusly"] .t-anim { animation: campusly-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="campusly"] .t-d1,
[data-template-id="campusly"] .t-d1 { animation-delay: .12s; }
[data-template-id="campusly"] .t-d2,
[data-template-id="campusly"] .t-d2 { animation-delay: .24s; }
[data-template-id="campusly"] .t-d3,
[data-template-id="campusly"] .t-d3 { animation-delay: .36s; }
[data-template-id="campusly"] .t-fade,
[data-template-id="campusly"] .t-fade { animation: campusly-fade 1s ease both; }
[data-template-id="campusly"] .t-marquee,
[data-template-id="campusly"] .t-marquee { animation: campusly-marquee 28s linear infinite; width: max-content; }
[data-template-id="campusly"] .t-float,
[data-template-id="campusly"] .t-float { animation: campusly-float 6.5s ease-in-out infinite; }
[data-template-id="campusly"] .t-pulse,
[data-template-id="campusly"] .t-pulse { animation: campusly-pulse 2.6s ease-in-out infinite; }
[data-template-id="campusly"] .t-wave,
[data-template-id="campusly"] .t-wave { animation: campusly-wave 2.2s ease-in-out infinite; }
[data-template-id="campusly"] .t-hover,
[data-template-id="campusly"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="campusly"] .t-hover:hover,
[data-template-id="campusly"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="campusly"] .t-ken,
  [data-template-id="campusly"] .t-ken,
  [data-template-id="campusly"] .t-anim,
  [data-template-id="campusly"] .t-anim,
  [data-template-id="campusly"] .t-marquee,
  [data-template-id="campusly"] .t-marquee,
  [data-template-id="campusly"] .t-float,
  [data-template-id="campusly"] .t-float,
  [data-template-id="campusly"] .t-pulse,
  [data-template-id="campusly"] .t-pulse,
  [data-template-id="campusly"] .t-wave,
  [data-template-id="campusly"] .t-wave,
  [data-template-id="campusly"] .t-fade,
  [data-template-id="campusly"] .t-fade { animation: none !important; }
}
`;
