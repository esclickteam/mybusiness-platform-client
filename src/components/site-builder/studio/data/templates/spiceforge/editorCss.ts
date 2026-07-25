export const spiceforgeEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="spiceforge"], [data-template-id="spiceforge-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a0f0a; --tpl-surface: #2a1810; --tpl-text: #fff1e0;
  --tpl-muted: #c4a08a; --tpl-primary: #e76f51; --tpl-primary-text: #1a0f0a;
  --tpl-line: rgba(255,241,224,0.14); --tpl-dark: #0e0805;
}

[data-template-id="spiceforge"] .tpl-display,
[data-template-id="spiceforge-preview"] .tpl-display {
  font-family: "Libre Baskerville", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="spiceforge"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes spiceforge-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes spiceforge-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spiceforge-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes spiceforge-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes spiceforge-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes spiceforge-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="spiceforge"] .tpl-ken, [data-template-id="spiceforge-preview"] .tpl-ken {
  animation: spiceforge-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="spiceforge"] .tpl-rise, [data-template-id="spiceforge-preview"] .tpl-rise {
  animation: spiceforge-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="spiceforge"] .tpl-rise-2, [data-template-id="spiceforge-preview"] .tpl-rise-2 {
  animation: spiceforge-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="spiceforge"] .tpl-rise-3, [data-template-id="spiceforge-preview"] .tpl-rise-3 {
  animation: spiceforge-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="spiceforge"] .tpl-marquee-track, [data-template-id="spiceforge-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: spiceforge-marquee 28s linear infinite;
}
[data-template-id="spiceforge"] .tpl-float, [data-template-id="spiceforge-preview"] .tpl-float {
  animation: spiceforge-float 5s ease-in-out infinite;
}
[data-template-id="spiceforge"] .tpl-sweep, [data-template-id="spiceforge-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="spiceforge"] .tpl-sweep::after, [data-template-id="spiceforge-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: spiceforge-sweep 4.5s ease-in-out infinite;
}
[data-template-id="spiceforge"] .tpl-climb, [data-template-id="spiceforge-preview"] .tpl-climb {
  animation: spiceforge-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes spiceforge-spice-fall { 0% { transform: translateY(-10%) rotate(0deg); opacity: .9; } 100% { transform: translateY(110vh) rotate(420deg); opacity: .15; } }
@keyframes spiceforge-wheel-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes spiceforge-spiral-in { from { opacity: 0; transform: scale(.8) rotate(-8deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
[data-template-id="spiceforge"] .tpl-spice, [data-template-id="spiceforge-preview"] .tpl-spice {
  animation: spiceforge-spice-fall var(--spice-dur, 9s) linear infinite;
}
[data-template-id="spiceforge"] .tpl-spice-wheel, [data-template-id="spiceforge-preview"] .tpl-spice-wheel {
  animation: spiceforge-wheel-spin 50s linear infinite;
  background: conic-gradient(from 0deg, #e76f51, #e9c46a, #f4a261, #e76f51, #9b2226, #e76f51);
}
[data-template-id="spiceforge"] .tpl-spiral-step, [data-template-id="spiceforge-preview"] .tpl-spiral-step {
  animation: spiceforge-spiral-in .85s cubic-bezier(.22,1,.36,1) both;
}
`;
