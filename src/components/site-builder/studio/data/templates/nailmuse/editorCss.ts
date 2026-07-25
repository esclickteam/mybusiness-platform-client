export const nailmuseEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Secular+One&display=swap');

[data-template-id="nailmuse"],
[data-template-id="nailmuse-preview"] {
  --p: #F97316;
  --s: #FFF7ED;
  --a: #FDE68A;
  --bg: #FFF9F0;
  --surface: #FFFFFF;
  --text: #5A1C05;
  --muted: #A26F4E;
  --dark: #2B0B02;
  font-family: "Secular One", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="nailmuse"] .t-display,
[data-template-id="nailmuse-preview"] .t-display {
  font-family: "Shrikhand", serif;
}

@keyframes nailmuse-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes nailmuse-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes nailmuse-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes nailmuse-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes nailmuse-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes nailmuse-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes nailmuse-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes nailmuse-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes nailmuse-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="nailmuse"] .t-ken,
[data-template-id="nailmuse-preview"] .t-ken { animation: nailmuse-ken 18s ease-in-out infinite alternate; }
[data-template-id="nailmuse"] .t-anim,
[data-template-id="nailmuse-preview"] .t-anim { animation: nailmuse-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="nailmuse"] .t-d1,
[data-template-id="nailmuse-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="nailmuse"] .t-d2,
[data-template-id="nailmuse-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="nailmuse"] .t-d3,
[data-template-id="nailmuse-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="nailmuse"] .t-fade,
[data-template-id="nailmuse-preview"] .t-fade { animation: nailmuse-fade 1s ease both; }
[data-template-id="nailmuse"] .t-marquee,
[data-template-id="nailmuse-preview"] .t-marquee { animation: nailmuse-marquee 30s linear infinite; width: max-content; }
[data-template-id="nailmuse"] .t-float,
[data-template-id="nailmuse-preview"] .t-float { animation: nailmuse-float 6s ease-in-out infinite; }
[data-template-id="nailmuse"] .t-pulse,
[data-template-id="nailmuse-preview"] .t-pulse { animation: nailmuse-pulse 2.8s ease-in-out infinite; }
[data-template-id="nailmuse"] .t-shimmer,
[data-template-id="nailmuse-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: nailmuse-shimmer 2.8s linear infinite;
}
[data-template-id="nailmuse"] .t-glow,
[data-template-id="nailmuse-preview"] .t-glow { animation: nailmuse-glow 3.2s ease-in-out infinite; }
[data-template-id="nailmuse"] .t-scalein,
[data-template-id="nailmuse-preview"] .t-scalein { animation: nailmuse-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="nailmuse"] .t-hover,
[data-template-id="nailmuse-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="nailmuse"] .t-hover:hover,
[data-template-id="nailmuse-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="nailmuse"] .t-ken,
  [data-template-id="nailmuse-preview"] .t-ken,
  [data-template-id="nailmuse"] .t-anim,
  [data-template-id="nailmuse-preview"] .t-anim,
  [data-template-id="nailmuse"] .t-marquee,
  [data-template-id="nailmuse-preview"] .t-marquee,
  [data-template-id="nailmuse"] .t-float,
  [data-template-id="nailmuse-preview"] .t-float,
  [data-template-id="nailmuse"] .t-pulse,
  [data-template-id="nailmuse-preview"] .t-pulse,
  [data-template-id="nailmuse"] .t-shimmer,
  [data-template-id="nailmuse-preview"] .t-shimmer,
  [data-template-id="nailmuse"] .t-glow,
  [data-template-id="nailmuse-preview"] .t-glow,
  [data-template-id="nailmuse"] .t-scalein,
  [data-template-id="nailmuse-preview"] .t-scalein,
  [data-template-id="nailmuse"] .t-fade,
  [data-template-id="nailmuse-preview"] .t-fade { animation: none !important; }
}
`;
