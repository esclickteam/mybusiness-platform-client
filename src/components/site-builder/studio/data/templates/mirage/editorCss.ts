export const mirageEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="mirage"], [data-template-id="mirage-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f7f0e4; --tpl-surface: #fff9f0; --tpl-text: #4a3828;
  --tpl-muted: #9a8268; --tpl-primary: #d4a574; --tpl-primary-text: #2a1e12;
  --tpl-line: rgba(74,56,40,0.14); --tpl-dark: #2a1e12;
}

[data-template-id="mirage"] .tpl-display,
[data-template-id="mirage-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="mirage"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes mirage-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes mirage-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mirage-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes mirage-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes mirage-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes mirage-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="mirage"] .tpl-ken, [data-template-id="mirage-preview"] .tpl-ken {
  animation: mirage-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="mirage"] .tpl-rise, [data-template-id="mirage-preview"] .tpl-rise {
  animation: mirage-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="mirage"] .tpl-rise-2, [data-template-id="mirage-preview"] .tpl-rise-2 {
  animation: mirage-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="mirage"] .tpl-rise-3, [data-template-id="mirage-preview"] .tpl-rise-3 {
  animation: mirage-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="mirage"] .tpl-marquee-track, [data-template-id="mirage-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: mirage-marquee 28s linear infinite;
}
[data-template-id="mirage"] .tpl-float, [data-template-id="mirage-preview"] .tpl-float {
  animation: mirage-float 5s ease-in-out infinite;
}
[data-template-id="mirage"] .tpl-sweep, [data-template-id="mirage-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="mirage"] .tpl-sweep::after, [data-template-id="mirage-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: mirage-sweep 4.5s ease-in-out infinite;
}
[data-template-id="mirage"] .tpl-climb, [data-template-id="mirage-preview"] .tpl-climb {
  animation: mirage-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes mirage-shimmer-wobble { 0%,100% { transform: skewY(0deg) scaleY(1); opacity: .35; } 50% { transform: skewY(1.2deg) scaleY(1.02); opacity: .55; } }
[data-template-id="mirage"] .tpl-shimmer-wobble, [data-template-id="mirage-preview"] .tpl-shimmer-wobble {
  animation: mirage-shimmer-wobble 2.8s ease-in-out infinite;
}
[data-template-id="mirage"] .tpl-temp-band, [data-template-id="mirage-preview"] .tpl-temp-band {
  height: 4px; border-radius: 999px;
}
`;
