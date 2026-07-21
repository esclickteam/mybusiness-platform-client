export const driftwoodEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="driftwood"], [data-template-id="driftwood-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f0e8dc; --tpl-surface: #faf5ed; --tpl-text: #3c2e22;
  --tpl-muted: #8b7355; --tpl-primary: #8b5e3c; --tpl-primary-text: #faf5ed;
  --tpl-line: rgba(60,46,34,0.14); --tpl-dark: #2a2018;
}

[data-template-id="driftwood"] .tpl-display,
[data-template-id="driftwood-preview"] .tpl-display {
  font-family: "Libre Baskerville", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="driftwood"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes driftwood-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes driftwood-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes driftwood-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes driftwood-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes driftwood-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes driftwood-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="driftwood"] .tpl-ken, [data-template-id="driftwood-preview"] .tpl-ken {
  animation: driftwood-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="driftwood"] .tpl-rise, [data-template-id="driftwood-preview"] .tpl-rise {
  animation: driftwood-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="driftwood"] .tpl-rise-2, [data-template-id="driftwood-preview"] .tpl-rise-2 {
  animation: driftwood-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="driftwood"] .tpl-rise-3, [data-template-id="driftwood-preview"] .tpl-rise-3 {
  animation: driftwood-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="driftwood"] .tpl-marquee-track, [data-template-id="driftwood-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: driftwood-marquee 28s linear infinite;
}
[data-template-id="driftwood"] .tpl-float, [data-template-id="driftwood-preview"] .tpl-float {
  animation: driftwood-float 5s ease-in-out infinite;
}
[data-template-id="driftwood"] .tpl-sweep, [data-template-id="driftwood-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="driftwood"] .tpl-sweep::after, [data-template-id="driftwood-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: driftwood-sweep 4.5s ease-in-out infinite;
}
[data-template-id="driftwood"] .tpl-climb, [data-template-id="driftwood-preview"] .tpl-climb {
  animation: driftwood-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes driftwood-organic-float { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8px,-12px) rotate(4deg); } }
[data-template-id="driftwood"] .tpl-organic, [data-template-id="driftwood-preview"] .tpl-organic {
  animation: driftwood-organic-float 7s ease-in-out infinite;
}
[data-template-id="driftwood"] .tpl-menu-scroll, [data-template-id="driftwood-preview"] .tpl-menu-scroll {
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}
`;
