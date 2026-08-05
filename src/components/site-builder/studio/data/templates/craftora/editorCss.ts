export const craftoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700&family=Karla:wght@400;500;600;700&display=swap');

[data-template-id="craftora"],
[data-template-id="craftora"] {
  --p: #4D7C0F;
  --s: #F5F5F4;
  --a: #78716C;
  --bg: #F5F5F4;
  --surface: #FFFFFF;
  --text: #1C1917;
  --muted: #78716C;
  --dark: #292524;
  font-family: "Karla", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="craftora"] .t-display,
[data-template-id="craftora"] .t-display {
  font-family: "Bitter", sans-serif;
}

@keyframes craftora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes craftora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes craftora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes craftora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes craftora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes craftora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes craftora-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes craftora-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="craftora"] .t-ken,
[data-template-id="craftora"] .t-ken { animation: craftora-ken 16s ease-in-out infinite alternate; }
[data-template-id="craftora"] .t-anim,
[data-template-id="craftora"] .t-anim { animation: craftora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="craftora"] .t-d1,
[data-template-id="craftora"] .t-d1 { animation-delay: .12s; }
[data-template-id="craftora"] .t-d2,
[data-template-id="craftora"] .t-d2 { animation-delay: .24s; }
[data-template-id="craftora"] .t-d3,
[data-template-id="craftora"] .t-d3 { animation-delay: .36s; }
[data-template-id="craftora"] .t-fade,
[data-template-id="craftora"] .t-fade { animation: craftora-fade 1s ease both; }
[data-template-id="craftora"] .t-marquee,
[data-template-id="craftora"] .t-marquee { animation: craftora-marquee 28s linear infinite; width: max-content; }
[data-template-id="craftora"] .t-float,
[data-template-id="craftora"] .t-float { animation: craftora-float 6.5s ease-in-out infinite; }
[data-template-id="craftora"] .t-pulse,
[data-template-id="craftora"] .t-pulse { animation: craftora-pulse 2.6s ease-in-out infinite; }
[data-template-id="craftora"] .t-wave,
[data-template-id="craftora"] .t-wave { animation: craftora-wave 2.2s ease-in-out infinite; }
[data-template-id="craftora"] .t-hover,
[data-template-id="craftora"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="craftora"] .t-hover:hover,
[data-template-id="craftora"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="craftora"] .t-ken,
  [data-template-id="craftora"] .t-ken,
  [data-template-id="craftora"] .t-anim,
  [data-template-id="craftora"] .t-anim,
  [data-template-id="craftora"] .t-marquee,
  [data-template-id="craftora"] .t-marquee,
  [data-template-id="craftora"] .t-float,
  [data-template-id="craftora"] .t-float,
  [data-template-id="craftora"] .t-pulse,
  [data-template-id="craftora"] .t-pulse,
  [data-template-id="craftora"] .t-wave,
  [data-template-id="craftora"] .t-wave,
  [data-template-id="craftora"] .t-fade,
  [data-template-id="craftora"] .t-fade { animation: none !important; }
}
`;
