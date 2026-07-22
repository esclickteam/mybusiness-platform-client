export const axispointEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rubik:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="axispoint"], [data-template-id="axispoint-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0c1222; --tpl-surface: #151d32; --tpl-text: #e2e8f0;
  --tpl-muted: #94a3b8; --tpl-primary: #f43f5e; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(226,232,240,0.12); --tpl-dark: #060a14;
}

[data-template-id="axispoint"] .tpl-display,
[data-template-id="axispoint-preview"] .tpl-display {
  font-family: "Bebas Neue", "Rubik", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="axispoint"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes axispoint-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes axispoint-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes axispoint-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes axispoint-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes axispoint-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes axispoint-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="axispoint"] .tpl-ken, [data-template-id="axispoint-preview"] .tpl-ken {
  animation: axispoint-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="axispoint"] .tpl-rise, [data-template-id="axispoint-preview"] .tpl-rise {
  animation: axispoint-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="axispoint"] .tpl-rise-2, [data-template-id="axispoint-preview"] .tpl-rise-2 {
  animation: axispoint-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="axispoint"] .tpl-rise-3, [data-template-id="axispoint-preview"] .tpl-rise-3 {
  animation: axispoint-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="axispoint"] .tpl-marquee-track, [data-template-id="axispoint-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: axispoint-marquee 28s linear infinite;
}
[data-template-id="axispoint"] .tpl-float, [data-template-id="axispoint-preview"] .tpl-float {
  animation: axispoint-float 5s ease-in-out infinite;
}
[data-template-id="axispoint"] .tpl-sweep, [data-template-id="axispoint-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="axispoint"] .tpl-sweep::after, [data-template-id="axispoint-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: axispoint-sweep 4.5s ease-in-out infinite;
}
[data-template-id="axispoint"] .tpl-climb, [data-template-id="axispoint-preview"] .tpl-climb {
  animation: axispoint-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes axispoint-axis { from{transform:scaleX(0)} to{transform:scaleX(1)} }
[data-template-id="axispoint"] .tpl-axis-line, [data-template-id="axispoint-preview"] .tpl-axis-line { animation:axispoint-axis 1.4s both; }
[data-template-id="axispoint"] .tpl-skew-grid, [data-template-id="axispoint-preview"] .tpl-skew-grid { transform:skewY(-2deg); }
[data-template-id="axispoint"] .tpl-skew-grid > *, [data-template-id="axispoint-preview"] .tpl-skew-grid > * { transform:skewY(2deg); }

@keyframes axispoint-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes axispoint-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes axispoint-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="axispoint"] .tpl-glass, [data-template-id="axispoint-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="axispoint"] .tpl-glow, [data-template-id="axispoint-preview"] .tpl-glow {{
  background: radial-gradient(circle, #f43f5e44, transparent 70%);
  animation: axispoint-glow 3s ease-in-out infinite;
}}
[data-template-id="axispoint"] .tpl-shimmer, [data-template-id="axispoint-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #f43f5e18 50%, transparent 70%);
  background-size: 200% 100%;
  animation: axispoint-shimmer 4s linear infinite;
}}
[data-template-id="axispoint"] .tpl-parallax, [data-template-id="axispoint-preview"] .tpl-parallax {{
  animation: axispoint-parallax 8s ease-in-out infinite;
}}
[data-template-id="axispoint"] .tpl-magnetic, [data-template-id="axispoint-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="axispoint"] .tpl-magnetic:hover, [data-template-id="axispoint-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="axispoint"] details[open] summary, [data-template-id="axispoint-preview"] details[open] summary {{
  color: #f43f5e;
}}
@keyframes axispoint-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes axispoint-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="axispoint"] .tpl-testi-track, [data-template-id="axispoint-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:axispoint-testi 28s linear infinite;
}}
[data-template-id="axispoint"] .tpl-line-draw, [data-template-id="axispoint-preview"] .tpl-line-draw {{
  transform-origin:right;animation:axispoint-draw 1.2s both;
}}

`;
