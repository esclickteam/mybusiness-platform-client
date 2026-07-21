export const azurelineEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="azureline"], [data-template-id="azureline-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f8fcff; --tpl-surface: #ffffff; --tpl-text: #0a2540;
  --tpl-muted: #5a7a96; --tpl-primary: #0066cc; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(10,37,64,0.1); --tpl-dark: #051828;
}

[data-template-id="azureline"] .tpl-display,
[data-template-id="azureline-preview"] .tpl-display {
  font-family: "Manrope", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="azureline"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes azureline-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes azureline-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes azureline-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes azureline-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes azureline-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes azureline-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="azureline"] .tpl-ken, [data-template-id="azureline-preview"] .tpl-ken {
  animation: azureline-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="azureline"] .tpl-rise, [data-template-id="azureline-preview"] .tpl-rise {
  animation: azureline-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="azureline"] .tpl-rise-2, [data-template-id="azureline-preview"] .tpl-rise-2 {
  animation: azureline-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="azureline"] .tpl-rise-3, [data-template-id="azureline-preview"] .tpl-rise-3 {
  animation: azureline-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="azureline"] .tpl-marquee-track, [data-template-id="azureline-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: azureline-marquee 28s linear infinite;
}
[data-template-id="azureline"] .tpl-float, [data-template-id="azureline-preview"] .tpl-float {
  animation: azureline-float 5s ease-in-out infinite;
}
[data-template-id="azureline"] .tpl-sweep, [data-template-id="azureline-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="azureline"] .tpl-sweep::after, [data-template-id="azureline-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: azureline-sweep 4.5s ease-in-out infinite;
}
[data-template-id="azureline"] .tpl-climb, [data-template-id="azureline-preview"] .tpl-climb {
  animation: azureline-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes azureline-ripple { 0% { transform: scale(.6); opacity: .7; } 100% { transform: scale(2.4); opacity: 0; } }
[data-template-id="azureline"] .tpl-ripple, [data-template-id="azureline-preview"] .tpl-ripple {
  animation: azureline-ripple 3.5s ease-out infinite;
}
[data-template-id="azureline"] .tpl-horizon, [data-template-id="azureline-preview"] .tpl-horizon {
  height: 1px; width: 100%;
}
`;
