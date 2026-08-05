export const masterlyEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

[data-template-id="masterly"],
[data-template-id="masterly"] {
  --p: #D4AF37;
  --s: #0A0A0A;
  --a: #F5E6C8;
  --bg: #0A0A0A;
  --surface: #171717;
  --text: #FAF7F0;
  --muted: #A3A3A3;
  --dark: #000000;
  font-family: "Montserrat", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="masterly"] .t-display,
[data-template-id="masterly"] .t-display {
  font-family: "Cinzel", sans-serif;
}

@keyframes masterly-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes masterly-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes masterly-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes masterly-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes masterly-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes masterly-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes masterly-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes masterly-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="masterly"] .t-ken,
[data-template-id="masterly"] .t-ken { animation: masterly-ken 16s ease-in-out infinite alternate; }
[data-template-id="masterly"] .t-anim,
[data-template-id="masterly"] .t-anim { animation: masterly-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="masterly"] .t-d1,
[data-template-id="masterly"] .t-d1 { animation-delay: .12s; }
[data-template-id="masterly"] .t-d2,
[data-template-id="masterly"] .t-d2 { animation-delay: .24s; }
[data-template-id="masterly"] .t-d3,
[data-template-id="masterly"] .t-d3 { animation-delay: .36s; }
[data-template-id="masterly"] .t-fade,
[data-template-id="masterly"] .t-fade { animation: masterly-fade 1s ease both; }
[data-template-id="masterly"] .t-marquee,
[data-template-id="masterly"] .t-marquee { animation: masterly-marquee 28s linear infinite; width: max-content; }
[data-template-id="masterly"] .t-float,
[data-template-id="masterly"] .t-float { animation: masterly-float 6.5s ease-in-out infinite; }
[data-template-id="masterly"] .t-pulse,
[data-template-id="masterly"] .t-pulse { animation: masterly-pulse 2.6s ease-in-out infinite; }
[data-template-id="masterly"] .t-wave,
[data-template-id="masterly"] .t-wave { animation: masterly-wave 2.2s ease-in-out infinite; }
[data-template-id="masterly"] .t-hover,
[data-template-id="masterly"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="masterly"] .t-hover:hover,
[data-template-id="masterly"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="masterly"] .t-ken,
  [data-template-id="masterly"] .t-ken,
  [data-template-id="masterly"] .t-anim,
  [data-template-id="masterly"] .t-anim,
  [data-template-id="masterly"] .t-marquee,
  [data-template-id="masterly"] .t-marquee,
  [data-template-id="masterly"] .t-float,
  [data-template-id="masterly"] .t-float,
  [data-template-id="masterly"] .t-pulse,
  [data-template-id="masterly"] .t-pulse,
  [data-template-id="masterly"] .t-wave,
  [data-template-id="masterly"] .t-wave,
  [data-template-id="masterly"] .t-fade,
  [data-template-id="masterly"] .t-fade { animation: none !important; }
}
`;
