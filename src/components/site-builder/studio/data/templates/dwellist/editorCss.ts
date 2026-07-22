export const dwellistEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="dwellist"], [data-template-id="dwellist-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #faf8f5; --tpl-surface: #ffffff; --tpl-text: #2c2419;
  --tpl-muted: #8a7d6e; --tpl-primary: #5c7c6a; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(44,36,25,0.12); --tpl-dark: #1a1510;
}

[data-template-id="dwellist"] .tpl-display,
[data-template-id="dwellist-preview"] .tpl-display {
  font-family: "DM Serif Display", "DM Sans", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="dwellist"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes dwellist-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes dwellist-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dwellist-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes dwellist-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes dwellist-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes dwellist-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="dwellist"] .tpl-ken, [data-template-id="dwellist-preview"] .tpl-ken {
  animation: dwellist-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="dwellist"] .tpl-rise, [data-template-id="dwellist-preview"] .tpl-rise {
  animation: dwellist-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="dwellist"] .tpl-rise-2, [data-template-id="dwellist-preview"] .tpl-rise-2 {
  animation: dwellist-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="dwellist"] .tpl-rise-3, [data-template-id="dwellist-preview"] .tpl-rise-3 {
  animation: dwellist-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="dwellist"] .tpl-marquee-track, [data-template-id="dwellist-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: dwellist-marquee 28s linear infinite;
}
[data-template-id="dwellist"] .tpl-float, [data-template-id="dwellist-preview"] .tpl-float {
  animation: dwellist-float 5s ease-in-out infinite;
}
[data-template-id="dwellist"] .tpl-sweep, [data-template-id="dwellist-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="dwellist"] .tpl-sweep::after, [data-template-id="dwellist-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: dwellist-sweep 4.5s ease-in-out infinite;
}
[data-template-id="dwellist"] .tpl-climb, [data-template-id="dwellist-preview"] .tpl-climb {
  animation: dwellist-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes dwellist-plan-pulse { 0%,100%{opacity:.4} 50%{opacity:1;transform:scale(1.15)} }
[data-template-id="dwellist"] .tpl-hotspot, [data-template-id="dwellist-preview"] .tpl-hotspot { animation:dwellist-plan-pulse 2.4s infinite; }
@keyframes dwellist-draw-plan { to { stroke-dashoffset:0; } }
[data-template-id="dwellist"] .tpl-plan-line, [data-template-id="dwellist-preview"] .tpl-plan-line { stroke-dasharray:400;stroke-dashoffset:400;animation:dwellist-draw-plan 2s forwards; }
@keyframes dwellist-testi { to { transform:translateX(-50%); } }
[data-template-id="dwellist"] .tpl-testi-track, [data-template-id="dwellist-preview"] .tpl-testi-track {
  display:flex;width:max-content;animation:dwellist-testi 28s linear infinite;
}
`;
