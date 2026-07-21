export const keyoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@600;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="keyora"], [data-template-id="keyora-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f5f8fc; --tpl-surface: #ffffff; --tpl-text: #0f1b2d;
  --tpl-muted: #5b6b7c; --tpl-primary: #0b5fff; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(15,27,45,0.12); --tpl-dark: #0a1424;
}

[data-template-id="keyora"] .tpl-display,
[data-template-id="keyora-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="keyora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes keyora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes keyora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes keyora-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes keyora-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes keyora-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes keyora-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes keyora-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes keyora-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="keyora"] .tpl-ken, [data-template-id="keyora-preview"] .tpl-ken {
  animation: keyora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="keyora"] .tpl-rise, [data-template-id="keyora-preview"] .tpl-rise {
  animation: keyora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="keyora"] .tpl-rise-2, [data-template-id="keyora-preview"] .tpl-rise-2 {
  animation: keyora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="keyora"] .tpl-rise-3, [data-template-id="keyora-preview"] .tpl-rise-3 {
  animation: keyora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="keyora"] .tpl-draw, [data-template-id="keyora-preview"] .tpl-draw {
  transform-origin: right center;
  animation: keyora-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="keyora"] .tpl-marquee-track, [data-template-id="keyora-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: keyora-marquee 28s linear infinite;
}
[data-template-id="keyora"] .tpl-pulse-line, [data-template-id="keyora-preview"] .tpl-pulse-line {
  animation: keyora-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="keyora"] .tpl-float, [data-template-id="keyora-preview"] .tpl-float {
  animation: keyora-float 5s ease-in-out infinite;
}
[data-template-id="keyora"] .tpl-sweep, [data-template-id="keyora-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="keyora"] .tpl-sweep::after, [data-template-id="keyora-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: keyora-sweep 4.5s ease-in-out infinite;
}
[data-template-id="keyora"] .tpl-climb, [data-template-id="keyora-preview"] .tpl-climb {
  animation: keyora-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
