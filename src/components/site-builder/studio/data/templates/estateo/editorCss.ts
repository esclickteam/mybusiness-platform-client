export const estateoEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="estateo"], [data-template-id="estateo-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #100e0c; --tpl-surface: #1a1612; --tpl-text: #f4ecdf;
  --tpl-muted: #a89880; --tpl-primary: #d4af6a; --tpl-primary-text: #100e0c;
  --tpl-line: rgba(244,236,223,0.14); --tpl-dark: #070605;
}

[data-template-id="estateo"] .tpl-display,
[data-template-id="estateo-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="estateo"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes estateo-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes estateo-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes estateo-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes estateo-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes estateo-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes estateo-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes estateo-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes estateo-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="estateo"] .tpl-ken, [data-template-id="estateo-preview"] .tpl-ken {
  animation: estateo-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="estateo"] .tpl-rise, [data-template-id="estateo-preview"] .tpl-rise {
  animation: estateo-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="estateo"] .tpl-rise-2, [data-template-id="estateo-preview"] .tpl-rise-2 {
  animation: estateo-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="estateo"] .tpl-rise-3, [data-template-id="estateo-preview"] .tpl-rise-3 {
  animation: estateo-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="estateo"] .tpl-draw, [data-template-id="estateo-preview"] .tpl-draw {
  transform-origin: right center;
  animation: estateo-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="estateo"] .tpl-marquee-track, [data-template-id="estateo-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: estateo-marquee 28s linear infinite;
}
[data-template-id="estateo"] .tpl-pulse-line, [data-template-id="estateo-preview"] .tpl-pulse-line {
  animation: estateo-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="estateo"] .tpl-float, [data-template-id="estateo-preview"] .tpl-float {
  animation: estateo-float 5s ease-in-out infinite;
}
[data-template-id="estateo"] .tpl-sweep, [data-template-id="estateo-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="estateo"] .tpl-sweep::after, [data-template-id="estateo-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: estateo-sweep 4.5s ease-in-out infinite;
}
[data-template-id="estateo"] .tpl-climb, [data-template-id="estateo-preview"] .tpl-climb {
  animation: estateo-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
