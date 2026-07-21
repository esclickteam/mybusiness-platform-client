export const dunewaveEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="dunewave"], [data-template-id="dunewave-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f4ead8; --tpl-surface: #fff8ee; --tpl-text: #3d2f1f;
  --tpl-muted: #8a7358; --tpl-primary: #c9956a; --tpl-primary-text: #2a1c10;
  --tpl-line: rgba(61,47,31,0.14); --tpl-dark: #2a1c10;
}

[data-template-id="dunewave"] .tpl-display,
[data-template-id="dunewave-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="dunewave"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes dunewave-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes dunewave-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dunewave-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes dunewave-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes dunewave-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes dunewave-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="dunewave"] .tpl-ken, [data-template-id="dunewave-preview"] .tpl-ken {
  animation: dunewave-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="dunewave"] .tpl-rise, [data-template-id="dunewave-preview"] .tpl-rise {
  animation: dunewave-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="dunewave"] .tpl-rise-2, [data-template-id="dunewave-preview"] .tpl-rise-2 {
  animation: dunewave-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="dunewave"] .tpl-rise-3, [data-template-id="dunewave-preview"] .tpl-rise-3 {
  animation: dunewave-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="dunewave"] .tpl-marquee-track, [data-template-id="dunewave-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: dunewave-marquee 28s linear infinite;
}
[data-template-id="dunewave"] .tpl-float, [data-template-id="dunewave-preview"] .tpl-float {
  animation: dunewave-float 5s ease-in-out infinite;
}
[data-template-id="dunewave"] .tpl-sweep, [data-template-id="dunewave-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="dunewave"] .tpl-sweep::after, [data-template-id="dunewave-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: dunewave-sweep 4.5s ease-in-out infinite;
}
[data-template-id="dunewave"] .tpl-climb, [data-template-id="dunewave-preview"] .tpl-climb {
  animation: dunewave-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes dunewave-dune-shift { 0% { transform: translateY(0); } 100% { transform: translateY(-18px); } }
[data-template-id="dunewave"] .tpl-dune-back, [data-template-id="dunewave-preview"] .tpl-dune-back {
  animation: dunewave-dune-shift 14s ease-in-out infinite alternate;
}
[data-template-id="dunewave"] .tpl-dune-mid, [data-template-id="dunewave-preview"] .tpl-dune-mid {
  animation: dunewave-dune-shift 10s ease-in-out infinite alternate-reverse;
}
[data-template-id="dunewave"] .tpl-villa-rail, [data-template-id="dunewave-preview"] .tpl-villa-rail {
  display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .5rem;
}
[data-template-id="dunewave"] .tpl-villa-rail > *, [data-template-id="dunewave-preview"] .tpl-villa-rail > * {
  scroll-snap-align: start; flex: 0 0 min(320px, 85vw);
}
`;
