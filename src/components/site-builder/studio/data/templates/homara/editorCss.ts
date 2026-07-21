export const homaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="homara"], [data-template-id="homara-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f3f0e8; --tpl-surface: #ebe6da; --tpl-text: #243028;
  --tpl-muted: #6d7568; --tpl-primary: #3f6f5a; --tpl-primary-text: #f3f0e8;
  --tpl-line: rgba(36,48,40,0.14); --tpl-dark: #1a221c;
}

[data-template-id="homara"] .tpl-display,
[data-template-id="homara-preview"] .tpl-display {
  font-family: "Assistant", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="homara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes homara-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes homara-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes homara-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes homara-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes homara-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes homara-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes homara-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes homara-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="homara"] .tpl-ken, [data-template-id="homara-preview"] .tpl-ken {
  animation: homara-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="homara"] .tpl-rise, [data-template-id="homara-preview"] .tpl-rise {
  animation: homara-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="homara"] .tpl-rise-2, [data-template-id="homara-preview"] .tpl-rise-2 {
  animation: homara-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="homara"] .tpl-rise-3, [data-template-id="homara-preview"] .tpl-rise-3 {
  animation: homara-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="homara"] .tpl-draw, [data-template-id="homara-preview"] .tpl-draw {
  transform-origin: right center;
  animation: homara-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="homara"] .tpl-marquee-track, [data-template-id="homara-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: homara-marquee 28s linear infinite;
}
[data-template-id="homara"] .tpl-pulse-line, [data-template-id="homara-preview"] .tpl-pulse-line {
  animation: homara-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="homara"] .tpl-float, [data-template-id="homara-preview"] .tpl-float {
  animation: homara-float 5s ease-in-out infinite;
}
[data-template-id="homara"] .tpl-sweep, [data-template-id="homara-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="homara"] .tpl-sweep::after, [data-template-id="homara-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: homara-sweep 4.5s ease-in-out infinite;
}
[data-template-id="homara"] .tpl-climb, [data-template-id="homara-preview"] .tpl-climb {
  animation: homara-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
