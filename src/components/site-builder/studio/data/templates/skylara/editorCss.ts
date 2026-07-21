export const skylaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="skylara"], [data-template-id="skylara-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #06101c; --tpl-surface: #0c1a2b; --tpl-text: #e8f1ff;
  --tpl-muted: #7f97b0; --tpl-primary: #39d0ff; --tpl-primary-text: #041018;
  --tpl-line: rgba(57,208,255,0.18); --tpl-dark: #02070e;
}

[data-template-id="skylara"] .tpl-display,
[data-template-id="skylara-preview"] .tpl-display {
  font-family: "Space Grotesk", "Heebo", sans-serif;
}

[data-visual-template-canvas="true"] [data-template-id="skylara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes skylara-ken { 0% { transform: scale(1); } 100% { transform: scale(1.09) translateY(-1.5%); } }
@keyframes skylara-rise { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes skylara-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes skylara-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes skylara-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes skylara-pulse { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes skylara-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes skylara-climb { from { opacity: 0; transform: translateY(54px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="skylara"] .tpl-ken, [data-template-id="skylara-preview"] .tpl-ken {
  animation: skylara-ken 20s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="skylara"] .tpl-rise, [data-template-id="skylara-preview"] .tpl-rise {
  animation: skylara-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="skylara"] .tpl-rise-2, [data-template-id="skylara-preview"] .tpl-rise-2 {
  animation: skylara-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="skylara"] .tpl-rise-3, [data-template-id="skylara-preview"] .tpl-rise-3 {
  animation: skylara-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="skylara"] .tpl-draw, [data-template-id="skylara-preview"] .tpl-draw {
  transform-origin: right center; animation: skylara-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="skylara"] .tpl-marquee-track, [data-template-id="skylara-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: skylara-marquee 28s linear infinite;
}
[data-template-id="skylara"] .tpl-float, [data-template-id="skylara-preview"] .tpl-float {
  animation: skylara-float 5s ease-in-out infinite;
}
[data-template-id="skylara"] .tpl-pulse-line, [data-template-id="skylara-preview"] .tpl-pulse-line {
  animation: skylara-pulse 2.1s ease-in-out infinite;
}
[data-template-id="skylara"] .tpl-sweep, [data-template-id="skylara-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="skylara"] .tpl-sweep::after, [data-template-id="skylara-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 32%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(57,208,255,.22), transparent);
  animation: skylara-sweep 4.3s ease-in-out infinite;
}
[data-template-id="skylara"] .tpl-climb, [data-template-id="skylara-preview"] .tpl-climb {
  animation: skylara-climb .82s cubic-bezier(.22,1,.36,1) both;
}
`;
