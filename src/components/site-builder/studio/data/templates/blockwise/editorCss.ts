export const blockwiseEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Sans+Hebrew:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="blockwise"], [data-template-id="blockwise-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #e8e4df; --tpl-surface: #f5f2ee; --tpl-text: #1a1a1a;
  --tpl-muted: #666666; --tpl-primary: #e63946; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(26,26,26,0.18); --tpl-dark: #0d0d0d;
}

[data-template-id="blockwise"] .tpl-display,
[data-template-id="blockwise-preview"] .tpl-display {
  font-family: "Archivo Black", "IBM Plex Sans Hebrew", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="blockwise"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes blockwise-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes blockwise-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blockwise-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes blockwise-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes blockwise-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes blockwise-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="blockwise"] .tpl-ken, [data-template-id="blockwise-preview"] .tpl-ken {
  animation: blockwise-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="blockwise"] .tpl-rise, [data-template-id="blockwise-preview"] .tpl-rise {
  animation: blockwise-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="blockwise"] .tpl-rise-2, [data-template-id="blockwise-preview"] .tpl-rise-2 {
  animation: blockwise-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="blockwise"] .tpl-rise-3, [data-template-id="blockwise-preview"] .tpl-rise-3 {
  animation: blockwise-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="blockwise"] .tpl-marquee-track, [data-template-id="blockwise-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: blockwise-marquee 28s linear infinite;
}
[data-template-id="blockwise"] .tpl-float, [data-template-id="blockwise-preview"] .tpl-float {
  animation: blockwise-float 5s ease-in-out infinite;
}
[data-template-id="blockwise"] .tpl-sweep, [data-template-id="blockwise-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="blockwise"] .tpl-sweep::after, [data-template-id="blockwise-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: blockwise-sweep 4.5s ease-in-out infinite;
}
[data-template-id="blockwise"] .tpl-climb, [data-template-id="blockwise-preview"] .tpl-climb {
  animation: blockwise-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes blockwise-stack { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
[data-template-id="blockwise"] .tpl-block, [data-template-id="blockwise-preview"] .tpl-block { animation:blockwise-stack .7s both; }
@keyframes blockwise-testi { to { transform:translateX(-50%); } }
[data-template-id="blockwise"] .tpl-testi-track, [data-template-id="blockwise-preview"] .tpl-testi-track {
  display:flex;width:max-content;animation:blockwise-testi 28s linear infinite;
}
`;
