export const nestoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="nestora"], [data-template-id="nestora-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #eef1f5; --tpl-surface: #e2e7ee; --tpl-text: #1e2836;
  --tpl-muted: #6a7585; --tpl-primary: #3d5a80; --tpl-primary-text: #eef1f5;
  --tpl-line: rgba(61,90,128,0.14); --tpl-dark: #121820;
}

[data-template-id="nestora"] .tpl-display,
[data-template-id="nestora-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="nestora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes nestora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.065); } }
@keyframes nestora-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nestora-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes nestora-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes nestora-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes nestora-pulse { 0%,100% { opacity: .36; } 50% { opacity: .86; } }
@keyframes nestora-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes nestora-climb { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="nestora"] .tpl-ken, [data-template-id="nestora-preview"] .tpl-ken {
  animation: nestora-ken 23s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="nestora"] .tpl-rise, [data-template-id="nestora-preview"] .tpl-rise {
  animation: nestora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="nestora"] .tpl-rise-2, [data-template-id="nestora-preview"] .tpl-rise-2 {
  animation: nestora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="nestora"] .tpl-rise-3, [data-template-id="nestora-preview"] .tpl-rise-3 {
  animation: nestora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="nestora"] .tpl-draw, [data-template-id="nestora-preview"] .tpl-draw {
  transform-origin: right center; animation: nestora-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="nestora"] .tpl-marquee-track, [data-template-id="nestora-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: nestora-marquee 36s linear infinite;
}
[data-template-id="nestora"] .tpl-float, [data-template-id="nestora-preview"] .tpl-float {
  animation: nestora-float 6s ease-in-out infinite;
}
[data-template-id="nestora"] .tpl-pulse-line, [data-template-id="nestora-preview"] .tpl-pulse-line {
  animation: nestora-pulse 2.8s ease-in-out infinite;
}
[data-template-id="nestora"] .tpl-sweep, [data-template-id="nestora-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="nestora"] .tpl-sweep::after, [data-template-id="nestora-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 34%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(238,241,245,.26), transparent);
  animation: nestora-sweep 5.2s ease-in-out infinite;
}
[data-template-id="nestora"] .tpl-climb, [data-template-id="nestora-preview"] .tpl-climb {
  animation: nestora-climb .82s cubic-bezier(.22,1,.36,1) both;
}
`;
