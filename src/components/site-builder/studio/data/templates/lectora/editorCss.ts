export const lectoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&display=swap');

[data-template-id="lectora"],
[data-template-id="lectora-preview"] {
  --p: #0D9488;
  --s: #041F1E;
  --a: #F97316;
  --bg: #041F1E;
  --surface: #0A2F2D;
  --text: #ECFDF5;
  --muted: #99F6E4;
  --dark: #021412;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lectora"] .t-display,
[data-template-id="lectora-preview"] .t-display {
  font-family: "Syne", sans-serif;
}

@keyframes lectora-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes lectora-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lectora-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes lectora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes lectora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes lectora-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes lectora-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes lectora-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="lectora"] .t-ken,
[data-template-id="lectora-preview"] .t-ken { animation: lectora-ken 16s ease-in-out infinite alternate; }
[data-template-id="lectora"] .t-anim,
[data-template-id="lectora-preview"] .t-anim { animation: lectora-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="lectora"] .t-d1,
[data-template-id="lectora-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="lectora"] .t-d2,
[data-template-id="lectora-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="lectora"] .t-d3,
[data-template-id="lectora-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="lectora"] .t-fade,
[data-template-id="lectora-preview"] .t-fade { animation: lectora-fade 1s ease both; }
[data-template-id="lectora"] .t-marquee,
[data-template-id="lectora-preview"] .t-marquee { animation: lectora-marquee 28s linear infinite; width: max-content; }
[data-template-id="lectora"] .t-float,
[data-template-id="lectora-preview"] .t-float { animation: lectora-float 6.5s ease-in-out infinite; }
[data-template-id="lectora"] .t-pulse,
[data-template-id="lectora-preview"] .t-pulse { animation: lectora-pulse 2.6s ease-in-out infinite; }
[data-template-id="lectora"] .t-wave,
[data-template-id="lectora-preview"] .t-wave { animation: lectora-wave 2.2s ease-in-out infinite; }
[data-template-id="lectora"] .t-hover,
[data-template-id="lectora-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="lectora"] .t-hover:hover,
[data-template-id="lectora-preview"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="lectora"] .t-ken,
  [data-template-id="lectora-preview"] .t-ken,
  [data-template-id="lectora"] .t-anim,
  [data-template-id="lectora-preview"] .t-anim,
  [data-template-id="lectora"] .t-marquee,
  [data-template-id="lectora-preview"] .t-marquee,
  [data-template-id="lectora"] .t-float,
  [data-template-id="lectora-preview"] .t-float,
  [data-template-id="lectora"] .t-pulse,
  [data-template-id="lectora-preview"] .t-pulse,
  [data-template-id="lectora"] .t-wave,
  [data-template-id="lectora-preview"] .t-wave,
  [data-template-id="lectora"] .t-fade,
  [data-template-id="lectora-preview"] .t-fade { animation: none !important; }
}
`;
