export const villaireEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="villaire"], [data-template-id="villaire-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0a0a0a; --tpl-surface: #141414; --tpl-text: #f4efe6;
  --tpl-muted: #a89a86; --tpl-primary: #e2c7a0; --tpl-primary-text: #0a0a0a;
  --tpl-line: rgba(226,199,160,0.18); --tpl-dark: #000000;
}

[data-template-id="villaire"] .tpl-display,
[data-template-id="villaire-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="villaire"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes villaire-ken { 0% { transform: scale(1); } 100% { transform: scale(1.075); } }
@keyframes villaire-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
@keyframes villaire-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes villaire-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes villaire-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes villaire-pulse { 0%,100% { opacity: .28; } 50% { opacity: 1; } }
@keyframes villaire-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes villaire-climb { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="villaire"] .tpl-ken, [data-template-id="villaire-preview"] .tpl-ken {
  animation: villaire-ken 22s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="villaire"] .tpl-rise, [data-template-id="villaire-preview"] .tpl-rise {
  animation: villaire-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="villaire"] .tpl-rise-2, [data-template-id="villaire-preview"] .tpl-rise-2 {
  animation: villaire-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="villaire"] .tpl-rise-3, [data-template-id="villaire-preview"] .tpl-rise-3 {
  animation: villaire-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="villaire"] .tpl-draw, [data-template-id="villaire-preview"] .tpl-draw {
  transform-origin: center; animation: villaire-draw 1.2s cubic-bezier(.22,1,.36,1) .18s both;
}
[data-template-id="villaire"] .tpl-marquee-track, [data-template-id="villaire-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: villaire-marquee 34s linear infinite;
}
[data-template-id="villaire"] .tpl-float, [data-template-id="villaire-preview"] .tpl-float {
  animation: villaire-float 5.8s ease-in-out infinite;
}
[data-template-id="villaire"] .tpl-pulse-line, [data-template-id="villaire-preview"] .tpl-pulse-line {
  animation: villaire-pulse 2.4s ease-in-out infinite;
}
[data-template-id="villaire"] .tpl-sweep, [data-template-id="villaire-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="villaire"] .tpl-sweep::after, [data-template-id="villaire-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 30%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(226,199,160,.18), transparent);
  animation: villaire-sweep 5s ease-in-out infinite;
}
[data-template-id="villaire"] .tpl-climb, [data-template-id="villaire-preview"] .tpl-climb {
  animation: villaire-climb .8s cubic-bezier(.22,1,.36,1) both;
}
`;
