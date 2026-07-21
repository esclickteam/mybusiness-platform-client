export const sunriftEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rubik:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="sunrift"], [data-template-id="sunrift-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a0f0a; --tpl-surface: #2a1810; --tpl-text: #fff4e8;
  --tpl-muted: #c9a484; --tpl-primary: #ff8c42; --tpl-primary-text: #1a0f0a;
  --tpl-line: rgba(255,244,232,0.12); --tpl-dark: #0d0704;
}

[data-template-id="sunrift"] .tpl-display,
[data-template-id="sunrift-preview"] .tpl-display {
  font-family: "Bebas Neue", "Rubik", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="sunrift"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes sunrift-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes sunrift-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sunrift-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes sunrift-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes sunrift-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes sunrift-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="sunrift"] .tpl-ken, [data-template-id="sunrift-preview"] .tpl-ken {
  animation: sunrift-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="sunrift"] .tpl-rise, [data-template-id="sunrift-preview"] .tpl-rise {
  animation: sunrift-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="sunrift"] .tpl-rise-2, [data-template-id="sunrift-preview"] .tpl-rise-2 {
  animation: sunrift-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="sunrift"] .tpl-rise-3, [data-template-id="sunrift-preview"] .tpl-rise-3 {
  animation: sunrift-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="sunrift"] .tpl-marquee-track, [data-template-id="sunrift-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: sunrift-marquee 28s linear infinite;
}
[data-template-id="sunrift"] .tpl-float, [data-template-id="sunrift-preview"] .tpl-float {
  animation: sunrift-float 5s ease-in-out infinite;
}
[data-template-id="sunrift"] .tpl-sweep, [data-template-id="sunrift-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="sunrift"] .tpl-sweep::after, [data-template-id="sunrift-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: sunrift-sweep 4.5s ease-in-out infinite;
}
[data-template-id="sunrift"] .tpl-climb, [data-template-id="sunrift-preview"] .tpl-climb {
  animation: sunrift-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes sunrift-shimmer { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(200%) skewX(-12deg); } }
[data-template-id="sunrift"] .tpl-shimmer, [data-template-id="sunrift-preview"] .tpl-shimmer { position: relative; overflow: hidden; }
[data-template-id="sunrift"] .tpl-shimmer::after, [data-template-id="sunrift-preview"] .tpl-shimmer::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,180,80,.35), transparent);
  animation: sunrift-shimmer 3.2s ease-in-out infinite;
}
`;
