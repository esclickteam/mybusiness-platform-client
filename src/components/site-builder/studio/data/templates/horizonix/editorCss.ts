export const horizonixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="horizonix"], [data-template-id="horizonix-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0d1117; --tpl-surface: #161b22; --tpl-text: #f0f6fc;
  --tpl-muted: #8b949e; --tpl-primary: #58a6ff; --tpl-primary-text: #0d1117;
  --tpl-line: rgba(240,246,252,0.12); --tpl-dark: #010409;
}

[data-template-id="horizonix"] .tpl-display,
[data-template-id="horizonix-preview"] .tpl-display {
  font-family: "Space Grotesk", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="horizonix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes horizonix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes horizonix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes horizonix-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes horizonix-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes horizonix-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes horizonix-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="horizonix"] .tpl-ken, [data-template-id="horizonix-preview"] .tpl-ken {
  animation: horizonix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="horizonix"] .tpl-rise, [data-template-id="horizonix-preview"] .tpl-rise {
  animation: horizonix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="horizonix"] .tpl-rise-2, [data-template-id="horizonix-preview"] .tpl-rise-2 {
  animation: horizonix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="horizonix"] .tpl-rise-3, [data-template-id="horizonix-preview"] .tpl-rise-3 {
  animation: horizonix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="horizonix"] .tpl-marquee-track, [data-template-id="horizonix-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: horizonix-marquee 28s linear infinite;
}
[data-template-id="horizonix"] .tpl-float, [data-template-id="horizonix-preview"] .tpl-float {
  animation: horizonix-float 5s ease-in-out infinite;
}
[data-template-id="horizonix"] .tpl-sweep, [data-template-id="horizonix-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="horizonix"] .tpl-sweep::after, [data-template-id="horizonix-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: horizonix-sweep 4.5s ease-in-out infinite;
}
[data-template-id="horizonix"] .tpl-climb, [data-template-id="horizonix-preview"] .tpl-climb {
  animation: horizonix-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes horizonix-pan-slide { 0% { transform: translateX(0); } 33% { transform: translateX(0); } 38% { transform: translateX(-33.333%); } 71% { transform: translateX(-33.333%); } 76% { transform: translateX(-66.666%); } 100% { transform: translateX(-66.666%); } }
[data-template-id="horizonix"] .tpl-pan-track, [data-template-id="horizonix-preview"] .tpl-pan-track {
  display: flex; width: 300%; animation: horizonix-pan-slide 18s ease-in-out infinite;
}
[data-template-id="horizonix"] .tpl-pan-panel, [data-template-id="horizonix-preview"] .tpl-pan-panel {
  flex: 0 0 33.333%; min-height: 72vh;
}
[data-template-id="horizonix"] .tpl-gallery-zoom img, [data-template-id="horizonix-preview"] .tpl-gallery-zoom img {
  transition: transform .6s cubic-bezier(.22,1,.36,1);
}
[data-template-id="horizonix"] .tpl-gallery-zoom:hover img, [data-template-id="horizonix-preview"] .tpl-gallery-zoom:hover img {
  transform: scale(1.08);
}
`;
