export const seabloomEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Heebo:wght@400;500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="seabloom"], [data-template-id="seabloom-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f5faf5; --tpl-surface: #ffffff; --tpl-text: #1a3d2e;
  --tpl-muted: #5a8a72; --tpl-primary: #2d8a6e; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(26,61,46,0.12); --tpl-dark: #0f2419;
}

[data-template-id="seabloom"] .tpl-display,
[data-template-id="seabloom-preview"] .tpl-display {
  font-family: "DM Serif Display", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="seabloom"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes seabloom-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes seabloom-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes seabloom-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes seabloom-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes seabloom-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes seabloom-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="seabloom"] .tpl-ken, [data-template-id="seabloom-preview"] .tpl-ken {
  animation: seabloom-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="seabloom"] .tpl-rise, [data-template-id="seabloom-preview"] .tpl-rise {
  animation: seabloom-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="seabloom"] .tpl-rise-2, [data-template-id="seabloom-preview"] .tpl-rise-2 {
  animation: seabloom-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="seabloom"] .tpl-rise-3, [data-template-id="seabloom-preview"] .tpl-rise-3 {
  animation: seabloom-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="seabloom"] .tpl-marquee-track, [data-template-id="seabloom-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: seabloom-marquee 28s linear infinite;
}
[data-template-id="seabloom"] .tpl-float, [data-template-id="seabloom-preview"] .tpl-float {
  animation: seabloom-float 5s ease-in-out infinite;
}
[data-template-id="seabloom"] .tpl-sweep, [data-template-id="seabloom-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="seabloom"] .tpl-sweep::after, [data-template-id="seabloom-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: seabloom-sweep 4.5s ease-in-out infinite;
}
[data-template-id="seabloom"] .tpl-climb, [data-template-id="seabloom-preview"] .tpl-climb {
  animation: seabloom-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes seabloom-petal-fall { 0% { transform: translateY(-10%) rotate(0deg); opacity: .9; } 100% { transform: translateY(110vh) rotate(360deg); opacity: .2; } }
[data-template-id="seabloom"] .tpl-petal, [data-template-id="seabloom-preview"] .tpl-petal {
  animation: seabloom-petal-fall var(--petal-dur, 9s) linear infinite;
}
[data-template-id="seabloom"] .tpl-carousel-track, [data-template-id="seabloom-preview"] .tpl-carousel-track {
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}
`;
