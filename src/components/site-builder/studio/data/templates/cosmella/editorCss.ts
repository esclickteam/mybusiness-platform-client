export const cosmellaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Noto+Sans+Hebrew:wght@400;500;700&display=swap');

[data-template-id="cosmella"],
[data-template-id="cosmella-preview"] {
  --p: #059669;
  --s: #ECFDF5;
  --a: #A7F3D0;
  --bg: #F6FFFB;
  --surface: #FFFFFF;
  --text: #064E3B;
  --muted: #5C8B79;
  --dark: #022C22;
  font-family: "Noto Sans Hebrew", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="cosmella"] .t-display,
[data-template-id="cosmella-preview"] .t-display {
  font-family: "DM Serif Display", serif;
}

@keyframes cosmella-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes cosmella-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cosmella-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes cosmella-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes cosmella-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes cosmella-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes cosmella-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes cosmella-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes cosmella-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="cosmella"] .t-ken,
[data-template-id="cosmella-preview"] .t-ken { animation: cosmella-ken 18s ease-in-out infinite alternate; }
[data-template-id="cosmella"] .t-anim,
[data-template-id="cosmella-preview"] .t-anim { animation: cosmella-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="cosmella"] .t-d1,
[data-template-id="cosmella-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="cosmella"] .t-d2,
[data-template-id="cosmella-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="cosmella"] .t-d3,
[data-template-id="cosmella-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="cosmella"] .t-fade,
[data-template-id="cosmella-preview"] .t-fade { animation: cosmella-fade 1s ease both; }
[data-template-id="cosmella"] .t-marquee,
[data-template-id="cosmella-preview"] .t-marquee { animation: cosmella-marquee 30s linear infinite; width: max-content; }
[data-template-id="cosmella"] .t-float,
[data-template-id="cosmella-preview"] .t-float { animation: cosmella-float 6s ease-in-out infinite; }
[data-template-id="cosmella"] .t-pulse,
[data-template-id="cosmella-preview"] .t-pulse { animation: cosmella-pulse 2.8s ease-in-out infinite; }
[data-template-id="cosmella"] .t-shimmer,
[data-template-id="cosmella-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: cosmella-shimmer 2.8s linear infinite;
}
[data-template-id="cosmella"] .t-glow,
[data-template-id="cosmella-preview"] .t-glow { animation: cosmella-glow 3.2s ease-in-out infinite; }
[data-template-id="cosmella"] .t-scalein,
[data-template-id="cosmella-preview"] .t-scalein { animation: cosmella-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="cosmella"] .t-hover,
[data-template-id="cosmella-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="cosmella"] .t-hover:hover,
[data-template-id="cosmella-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="cosmella"] .t-ken,
  [data-template-id="cosmella-preview"] .t-ken,
  [data-template-id="cosmella"] .t-anim,
  [data-template-id="cosmella-preview"] .t-anim,
  [data-template-id="cosmella"] .t-marquee,
  [data-template-id="cosmella-preview"] .t-marquee,
  [data-template-id="cosmella"] .t-float,
  [data-template-id="cosmella-preview"] .t-float,
  [data-template-id="cosmella"] .t-pulse,
  [data-template-id="cosmella-preview"] .t-pulse,
  [data-template-id="cosmella"] .t-shimmer,
  [data-template-id="cosmella-preview"] .t-shimmer,
  [data-template-id="cosmella"] .t-glow,
  [data-template-id="cosmella-preview"] .t-glow,
  [data-template-id="cosmella"] .t-scalein,
  [data-template-id="cosmella-preview"] .t-scalein,
  [data-template-id="cosmella"] .t-fade,
  [data-template-id="cosmella-preview"] .t-fade { animation: none !important; }
}
`;
