export const urbanixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@700;900&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="urbanix"], [data-template-id="urbanix-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #141516; --tpl-surface: #1e2022; --tpl-text: #f2f2f0;
  --tpl-muted: #9a9d98; --tpl-primary: #c8f542; --tpl-primary-text: #101210;
  --tpl-line: rgba(242,242,240,0.12); --tpl-dark: #0a0b0c;
}

[data-template-id="urbanix"] .tpl-display,
[data-template-id="urbanix-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="urbanix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes urbanix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes urbanix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes urbanix-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes urbanix-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes urbanix-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes urbanix-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes urbanix-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes urbanix-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="urbanix"] .tpl-ken, [data-template-id="urbanix-preview"] .tpl-ken {
  animation: urbanix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="urbanix"] .tpl-rise, [data-template-id="urbanix-preview"] .tpl-rise {
  animation: urbanix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="urbanix"] .tpl-rise-2, [data-template-id="urbanix-preview"] .tpl-rise-2 {
  animation: urbanix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="urbanix"] .tpl-rise-3, [data-template-id="urbanix-preview"] .tpl-rise-3 {
  animation: urbanix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="urbanix"] .tpl-draw, [data-template-id="urbanix-preview"] .tpl-draw {
  transform-origin: right center;
  animation: urbanix-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="urbanix"] .tpl-marquee-track, [data-template-id="urbanix-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: urbanix-marquee 28s linear infinite;
}
[data-template-id="urbanix"] .tpl-pulse-line, [data-template-id="urbanix-preview"] .tpl-pulse-line {
  animation: urbanix-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="urbanix"] .tpl-float, [data-template-id="urbanix-preview"] .tpl-float {
  animation: urbanix-float 5s ease-in-out infinite;
}
[data-template-id="urbanix"] .tpl-sweep, [data-template-id="urbanix-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="urbanix"] .tpl-sweep::after, [data-template-id="urbanix-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: urbanix-sweep 4.5s ease-in-out infinite;
}
[data-template-id="urbanix"] .tpl-climb, [data-template-id="urbanix-preview"] .tpl-climb {
  animation: urbanix-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
