export const polyglotaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');

[data-template-id="polyglota"],
[data-template-id="polyglota"] {
  --p: #0284C7;
  --s: #F0F9FF;
  --a: #38BDF8;
  --bg: #F0F9FF;
  --surface: #FFFFFF;
  --text: #0C4A6E;
  --muted: #64748B;
  --dark: #082F49;
  font-family: "Nunito Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="polyglota"] .t-display,
[data-template-id="polyglota"] .t-display {
  font-family: "Sora", sans-serif;
}

@keyframes polyglota-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes polyglota-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes polyglota-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes polyglota-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes polyglota-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes polyglota-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes polyglota-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes polyglota-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="polyglota"] .t-ken,
[data-template-id="polyglota"] .t-ken { animation: polyglota-ken 16s ease-in-out infinite alternate; }
[data-template-id="polyglota"] .t-anim,
[data-template-id="polyglota"] .t-anim { animation: polyglota-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="polyglota"] .t-d1,
[data-template-id="polyglota"] .t-d1 { animation-delay: .12s; }
[data-template-id="polyglota"] .t-d2,
[data-template-id="polyglota"] .t-d2 { animation-delay: .24s; }
[data-template-id="polyglota"] .t-d3,
[data-template-id="polyglota"] .t-d3 { animation-delay: .36s; }
[data-template-id="polyglota"] .t-fade,
[data-template-id="polyglota"] .t-fade { animation: polyglota-fade 1s ease both; }
[data-template-id="polyglota"] .t-marquee,
[data-template-id="polyglota"] .t-marquee { animation: polyglota-marquee 28s linear infinite; width: max-content; }
[data-template-id="polyglota"] .t-float,
[data-template-id="polyglota"] .t-float { animation: polyglota-float 6.5s ease-in-out infinite; }
[data-template-id="polyglota"] .t-pulse,
[data-template-id="polyglota"] .t-pulse { animation: polyglota-pulse 2.6s ease-in-out infinite; }
[data-template-id="polyglota"] .t-wave,
[data-template-id="polyglota"] .t-wave { animation: polyglota-wave 2.2s ease-in-out infinite; }
[data-template-id="polyglota"] .t-hover,
[data-template-id="polyglota"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="polyglota"] .t-hover:hover,
[data-template-id="polyglota"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="polyglota"] .t-ken,
  [data-template-id="polyglota"] .t-ken,
  [data-template-id="polyglota"] .t-anim,
  [data-template-id="polyglota"] .t-anim,
  [data-template-id="polyglota"] .t-marquee,
  [data-template-id="polyglota"] .t-marquee,
  [data-template-id="polyglota"] .t-float,
  [data-template-id="polyglota"] .t-float,
  [data-template-id="polyglota"] .t-pulse,
  [data-template-id="polyglota"] .t-pulse,
  [data-template-id="polyglota"] .t-wave,
  [data-template-id="polyglota"] .t-wave,
  [data-template-id="polyglota"] .t-fade,
  [data-template-id="polyglota"] .t-fade { animation: none !important; }
}
`;
