export const sushisenEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="sushisen"], [data-template-id="sushisen-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0b0b0b; --tpl-surface: #161616; --tpl-text: #f2f0ea;
  --tpl-muted: #9a958c; --tpl-primary: #d4af37; --tpl-primary-text: #0b0b0b;
  --tpl-line: rgba(242,240,234,0.12); --tpl-dark: #050505;
}

[data-template-id="sushisen"] .tpl-display,
[data-template-id="sushisen-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="sushisen"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes sushisen-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes sushisen-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sushisen-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes sushisen-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes sushisen-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes sushisen-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="sushisen"] .tpl-ken, [data-template-id="sushisen-preview"] .tpl-ken {
  animation: sushisen-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="sushisen"] .tpl-rise, [data-template-id="sushisen-preview"] .tpl-rise {
  animation: sushisen-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="sushisen"] .tpl-rise-2, [data-template-id="sushisen-preview"] .tpl-rise-2 {
  animation: sushisen-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="sushisen"] .tpl-rise-3, [data-template-id="sushisen-preview"] .tpl-rise-3 {
  animation: sushisen-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="sushisen"] .tpl-marquee-track, [data-template-id="sushisen-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: sushisen-marquee 28s linear infinite;
}
[data-template-id="sushisen"] .tpl-float, [data-template-id="sushisen-preview"] .tpl-float {
  animation: sushisen-float 5s ease-in-out infinite;
}
[data-template-id="sushisen"] .tpl-sweep, [data-template-id="sushisen-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="sushisen"] .tpl-sweep::after, [data-template-id="sushisen-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: sushisen-sweep 4.5s ease-in-out infinite;
}
[data-template-id="sushisen"] .tpl-climb, [data-template-id="sushisen-preview"] .tpl-climb {
  animation: sushisen-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes sushisen-conveyor { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes sushisen-wasabi-pulse { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55,.4); } 50% { transform: scale(1.06); box-shadow: 0 0 20px 4px rgba(212,175,55,.25); } }
@keyframes sushisen-nigiri-snap { 0%,90%,100% { transform: translateY(0); } 95% { transform: translateY(-6px); } }
[data-template-id="sushisen"] .tpl-conveyor, [data-template-id="sushisen-preview"] .tpl-conveyor {
  display: flex; width: max-content; animation: sushisen-conveyor 22s linear infinite; gap: 1rem;
}
[data-template-id="sushisen"] .tpl-wasabi, [data-template-id="sushisen-preview"] .tpl-wasabi {
  animation: sushisen-wasabi-pulse 2.2s ease-in-out infinite;
}
[data-template-id="sushisen"] .tpl-nigiri-rail, [data-template-id="sushisen-preview"] .tpl-nigiri-rail {
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}
[data-template-id="sushisen"] .tpl-nigiri-card, [data-template-id="sushisen-preview"] .tpl-nigiri-card {
  scroll-snap-align: center; flex: 0 0 min(240px, 70vw);
  animation: sushisen-nigiri-snap 4s ease-in-out infinite;
}
`;
