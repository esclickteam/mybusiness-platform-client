export const lashatelierEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Urbanist:wght@400;500;700&display=swap');

[data-template-id="lashatelier"],
[data-template-id="lashatelier"] {
  --p: #C084FC;
  --s: #FAF5FF;
  --a: #E9D5FF;
  --bg: #120A1F;
  --surface: #1E1230;
  --text: #FAF5FF;
  --muted: #BCA6D6;
  --dark: #090411;
  font-family: "Urbanist", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lashatelier"] .t-display,
[data-template-id="lashatelier"] .t-display {
  font-family: "Cinzel", serif;
}

@keyframes lashatelier-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes lashatelier-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lashatelier-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes lashatelier-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes lashatelier-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes lashatelier-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes lashatelier-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes lashatelier-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes lashatelier-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="lashatelier"] .t-ken,
[data-template-id="lashatelier"] .t-ken { animation: lashatelier-ken 18s ease-in-out infinite alternate; }
[data-template-id="lashatelier"] .t-anim,
[data-template-id="lashatelier"] .t-anim { animation: lashatelier-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="lashatelier"] .t-d1,
[data-template-id="lashatelier"] .t-d1 { animation-delay: .12s; }
[data-template-id="lashatelier"] .t-d2,
[data-template-id="lashatelier"] .t-d2 { animation-delay: .24s; }
[data-template-id="lashatelier"] .t-d3,
[data-template-id="lashatelier"] .t-d3 { animation-delay: .36s; }
[data-template-id="lashatelier"] .t-fade,
[data-template-id="lashatelier"] .t-fade { animation: lashatelier-fade 1s ease both; }
[data-template-id="lashatelier"] .t-marquee,
[data-template-id="lashatelier"] .t-marquee { animation: lashatelier-marquee 30s linear infinite; width: max-content; }
[data-template-id="lashatelier"] .t-float,
[data-template-id="lashatelier"] .t-float { animation: lashatelier-float 6s ease-in-out infinite; }
[data-template-id="lashatelier"] .t-pulse,
[data-template-id="lashatelier"] .t-pulse { animation: lashatelier-pulse 2.8s ease-in-out infinite; }
[data-template-id="lashatelier"] .t-shimmer,
[data-template-id="lashatelier"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: lashatelier-shimmer 2.8s linear infinite;
}
[data-template-id="lashatelier"] .t-glow,
[data-template-id="lashatelier"] .t-glow { animation: lashatelier-glow 3.2s ease-in-out infinite; }
[data-template-id="lashatelier"] .t-scalein,
[data-template-id="lashatelier"] .t-scalein { animation: lashatelier-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="lashatelier"] .t-hover,
[data-template-id="lashatelier"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="lashatelier"] .t-hover:hover,
[data-template-id="lashatelier"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="lashatelier"] .t-ken,
  [data-template-id="lashatelier"] .t-ken,
  [data-template-id="lashatelier"] .t-anim,
  [data-template-id="lashatelier"] .t-anim,
  [data-template-id="lashatelier"] .t-marquee,
  [data-template-id="lashatelier"] .t-marquee,
  [data-template-id="lashatelier"] .t-float,
  [data-template-id="lashatelier"] .t-float,
  [data-template-id="lashatelier"] .t-pulse,
  [data-template-id="lashatelier"] .t-pulse,
  [data-template-id="lashatelier"] .t-shimmer,
  [data-template-id="lashatelier"] .t-shimmer,
  [data-template-id="lashatelier"] .t-glow,
  [data-template-id="lashatelier"] .t-glow,
  [data-template-id="lashatelier"] .t-scalein,
  [data-template-id="lashatelier"] .t-scalein,
  [data-template-id="lashatelier"] .t-fade,
  [data-template-id="lashatelier"] .t-fade { animation: none !important; }
}
`;
