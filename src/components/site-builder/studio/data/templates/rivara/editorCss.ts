export const rivaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="rivara"], [data-template-id="rivara-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #e8f3f2; --tpl-surface: #d9ecea; --tpl-text: #12343a;
  --tpl-muted: #4f6d72; --tpl-primary: #1f7a78; --tpl-primary-text: #e8f3f2;
  --tpl-line: rgba(18,52,58,0.12); --tpl-dark: #0b1f24;
}

[data-template-id="rivara"] .tpl-display,
[data-template-id="rivara-preview"] .tpl-display {
  font-family: "Frank Ruhl Libre", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="rivara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes rivara-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes rivara-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rivara-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rivara-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes rivara-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes rivara-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes rivara-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes rivara-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="rivara"] .tpl-ken, [data-template-id="rivara-preview"] .tpl-ken {
  animation: rivara-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="rivara"] .tpl-rise, [data-template-id="rivara-preview"] .tpl-rise {
  animation: rivara-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="rivara"] .tpl-rise-2, [data-template-id="rivara-preview"] .tpl-rise-2 {
  animation: rivara-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="rivara"] .tpl-rise-3, [data-template-id="rivara-preview"] .tpl-rise-3 {
  animation: rivara-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="rivara"] .tpl-draw, [data-template-id="rivara-preview"] .tpl-draw {
  transform-origin: right center;
  animation: rivara-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="rivara"] .tpl-marquee-track, [data-template-id="rivara-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: rivara-marquee 28s linear infinite;
}
[data-template-id="rivara"] .tpl-pulse-line, [data-template-id="rivara-preview"] .tpl-pulse-line {
  animation: rivara-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="rivara"] .tpl-float, [data-template-id="rivara-preview"] .tpl-float {
  animation: rivara-float 5s ease-in-out infinite;
}
[data-template-id="rivara"] .tpl-sweep, [data-template-id="rivara-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="rivara"] .tpl-sweep::after, [data-template-id="rivara-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: rivara-sweep 4.5s ease-in-out infinite;
}
[data-template-id="rivara"] .tpl-climb, [data-template-id="rivara-preview"] .tpl-climb {
  animation: rivara-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
