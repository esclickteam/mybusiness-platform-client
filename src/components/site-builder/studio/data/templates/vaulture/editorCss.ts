export const vaultureEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="vaulture"], [data-template-id="vaulture-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0c0a08; --tpl-surface: #1a1612; --tpl-text: #f5f0e8;
  --tpl-muted: #a89880; --tpl-primary: #d4af37; --tpl-primary-text: #0c0a08;
  --tpl-line: rgba(245,240,232,0.12); --tpl-dark: #050403;
}

[data-template-id="vaulture"] .tpl-display,
[data-template-id="vaulture-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="vaulture"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes vaulture-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes vaulture-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vaulture-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes vaulture-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes vaulture-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes vaulture-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="vaulture"] .tpl-ken, [data-template-id="vaulture-preview"] .tpl-ken {
  animation: vaulture-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="vaulture"] .tpl-rise, [data-template-id="vaulture-preview"] .tpl-rise {
  animation: vaulture-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="vaulture"] .tpl-rise-2, [data-template-id="vaulture-preview"] .tpl-rise-2 {
  animation: vaulture-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="vaulture"] .tpl-rise-3, [data-template-id="vaulture-preview"] .tpl-rise-3 {
  animation: vaulture-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="vaulture"] .tpl-marquee-track, [data-template-id="vaulture-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: vaulture-marquee 28s linear infinite;
}
[data-template-id="vaulture"] .tpl-float, [data-template-id="vaulture-preview"] .tpl-float {
  animation: vaulture-float 5s ease-in-out infinite;
}
[data-template-id="vaulture"] .tpl-sweep, [data-template-id="vaulture-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="vaulture"] .tpl-sweep::after, [data-template-id="vaulture-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: vaulture-sweep 4.5s ease-in-out infinite;
}
[data-template-id="vaulture"] .tpl-climb, [data-template-id="vaulture-preview"] .tpl-climb {
  animation: vaulture-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes vaulture-curtain { 0%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0)} }
[data-template-id="vaulture"] .tpl-curtain img, [data-template-id="vaulture-preview"] .tpl-curtain img { animation:vaulture-curtain 1.8s both; }
@keyframes vaulture-testi { to { transform:translateX(-50%); } }
[data-template-id="vaulture"] .tpl-testi-track, [data-template-id="vaulture-preview"] .tpl-testi-track { display:flex;width:max-content;animation:vaulture-testi 24s linear infinite; }
`;
