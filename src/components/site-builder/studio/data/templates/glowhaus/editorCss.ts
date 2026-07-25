export const glowhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&display=swap');

[data-template-id="glowhaus"],
[data-template-id="glowhaus-preview"] {
  --p: #22D3EE;
  --s: #071521;
  --a: #67E8F9;
  --bg: #061018;
  --surface: #0D1F2D;
  --text: #E0F2FE;
  --muted: #7DA4B8;
  --dark: #030A10;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="glowhaus"] .t-display,
[data-template-id="glowhaus-preview"] .t-display {
  font-family: "Archivo", serif;
}

@keyframes glowhaus-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}
@keyframes glowhaus-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glowhaus-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes glowhaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes glowhaus-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes glowhaus-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes glowhaus-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes glowhaus-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes glowhaus-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="glowhaus"] .t-ken,
[data-template-id="glowhaus-preview"] .t-ken { animation: glowhaus-ken 18s ease-in-out infinite alternate; }
[data-template-id="glowhaus"] .t-anim,
[data-template-id="glowhaus-preview"] .t-anim { animation: glowhaus-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="glowhaus"] .t-d1,
[data-template-id="glowhaus-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="glowhaus"] .t-d2,
[data-template-id="glowhaus-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="glowhaus"] .t-d3,
[data-template-id="glowhaus-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="glowhaus"] .t-fade,
[data-template-id="glowhaus-preview"] .t-fade { animation: glowhaus-fade 1s ease both; }
[data-template-id="glowhaus"] .t-marquee,
[data-template-id="glowhaus-preview"] .t-marquee { animation: glowhaus-marquee 30s linear infinite; width: max-content; }
[data-template-id="glowhaus"] .t-float,
[data-template-id="glowhaus-preview"] .t-float { animation: glowhaus-float 6s ease-in-out infinite; }
[data-template-id="glowhaus"] .t-pulse,
[data-template-id="glowhaus-preview"] .t-pulse { animation: glowhaus-pulse 2.8s ease-in-out infinite; }
[data-template-id="glowhaus"] .t-shimmer,
[data-template-id="glowhaus-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: glowhaus-shimmer 2.8s linear infinite;
}
[data-template-id="glowhaus"] .t-glow,
[data-template-id="glowhaus-preview"] .t-glow { animation: glowhaus-glow 3.2s ease-in-out infinite; }
[data-template-id="glowhaus"] .t-scalein,
[data-template-id="glowhaus-preview"] .t-scalein { animation: glowhaus-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="glowhaus"] .t-hover,
[data-template-id="glowhaus-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="glowhaus"] .t-hover:hover,
[data-template-id="glowhaus-preview"] .t-hover:hover { transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="glowhaus"] .t-ken,
  [data-template-id="glowhaus-preview"] .t-ken,
  [data-template-id="glowhaus"] .t-anim,
  [data-template-id="glowhaus-preview"] .t-anim,
  [data-template-id="glowhaus"] .t-marquee,
  [data-template-id="glowhaus-preview"] .t-marquee,
  [data-template-id="glowhaus"] .t-float,
  [data-template-id="glowhaus-preview"] .t-float,
  [data-template-id="glowhaus"] .t-pulse,
  [data-template-id="glowhaus-preview"] .t-pulse,
  [data-template-id="glowhaus"] .t-shimmer,
  [data-template-id="glowhaus-preview"] .t-shimmer,
  [data-template-id="glowhaus"] .t-glow,
  [data-template-id="glowhaus-preview"] .t-glow,
  [data-template-id="glowhaus"] .t-scalein,
  [data-template-id="glowhaus-preview"] .t-scalein,
  [data-template-id="glowhaus"] .t-fade,
  [data-template-id="glowhaus-preview"] .t-fade { animation: none !important; }
}
`;
