export const sugaroseEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cooper+Black&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap');

[data-template-id="sugarose"],
[data-template-id="sugarose"] {
  --p: #D97706;
  --s: #FFFBEB;
  --a: #FDE68A;
  --bg: #FFF8E6;
  --surface: #FFFFFF;
  --text: #4B2202;
  --muted: #936B35;
  --dark: #241003;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="sugarose"] .t-display,
[data-template-id="sugarose"] .t-display {
  font-family: "Cooper Black", serif;
}

@keyframes sugarose-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes sugarose-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes sugarose-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sugarose-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes sugarose-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes sugarose-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes sugarose-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes sugarose-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes sugarose-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="sugarose"] .t-ken,
[data-template-id="sugarose"] .t-ken { animation: sugarose-ken 18s ease-in-out infinite alternate; }
[data-template-id="sugarose"] .t-anim,
[data-template-id="sugarose"] .t-anim { animation: sugarose-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="sugarose"] .t-d1,
[data-template-id="sugarose"] .t-d1 { animation-delay: .12s; }
[data-template-id="sugarose"] .t-d2,
[data-template-id="sugarose"] .t-d2 { animation-delay: .24s; }
[data-template-id="sugarose"] .t-d3,
[data-template-id="sugarose"] .t-d3 { animation-delay: .36s; }
[data-template-id="sugarose"] .t-fade,
[data-template-id="sugarose"] .t-fade { animation: sugarose-fade 1s ease both; }
[data-template-id="sugarose"] .t-marquee,
[data-template-id="sugarose"] .t-marquee { animation: sugarose-marquee 30s linear infinite; width: max-content; }
[data-template-id="sugarose"] .t-float,
[data-template-id="sugarose"] .t-float { animation: sugarose-float 6s ease-in-out infinite; }
[data-template-id="sugarose"] .t-pulse,
[data-template-id="sugarose"] .t-pulse { animation: sugarose-pulse 2.8s ease-in-out infinite; }
[data-template-id="sugarose"] .t-shimmer,
[data-template-id="sugarose"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: sugarose-shimmer 2.8s linear infinite;
}
[data-template-id="sugarose"] .t-glow,
[data-template-id="sugarose"] .t-glow { animation: sugarose-glow 3.2s ease-in-out infinite; }
[data-template-id="sugarose"] .t-scalein,
[data-template-id="sugarose"] .t-scalein { animation: sugarose-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="sugarose"] .t-hover,
[data-template-id="sugarose"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="sugarose"] .t-hover:hover,
[data-template-id="sugarose"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="sugarose"] .t-ken,
  [data-template-id="sugarose"] .t-ken,
  [data-template-id="sugarose"] .t-anim,
  [data-template-id="sugarose"] .t-anim,
  [data-template-id="sugarose"] .t-marquee,
  [data-template-id="sugarose"] .t-marquee,
  [data-template-id="sugarose"] .t-float,
  [data-template-id="sugarose"] .t-float,
  [data-template-id="sugarose"] .t-pulse,
  [data-template-id="sugarose"] .t-pulse,
  [data-template-id="sugarose"] .t-shimmer,
  [data-template-id="sugarose"] .t-shimmer,
  [data-template-id="sugarose"] .t-glow,
  [data-template-id="sugarose"] .t-glow,
  [data-template-id="sugarose"] .t-scalein,
  [data-template-id="sugarose"] .t-scalein,
  [data-template-id="sugarose"] .t-fade,
  [data-template-id="sugarose"] .t-fade { animation: none !important; }
}
`;
