export const brokeriaEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="brokeria"], [data-template-id="brokeria-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0a0f18; --tpl-surface: #141c2a; --tpl-text: #f0f4fa;
  --tpl-muted: #8b9cb5; --tpl-primary: #c9a962; --tpl-primary-text: #0a0f18;
  --tpl-line: rgba(240,244,250,0.14); --tpl-dark: #050810;
}

[data-template-id="brokeria"] .tpl-display,
[data-template-id="brokeria-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="brokeria"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes brokeria-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes brokeria-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes brokeria-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes brokeria-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes brokeria-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes brokeria-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="brokeria"] .tpl-ken, [data-template-id="brokeria-preview"] .tpl-ken {
  animation: brokeria-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="brokeria"] .tpl-rise, [data-template-id="brokeria-preview"] .tpl-rise {
  animation: brokeria-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="brokeria"] .tpl-rise-2, [data-template-id="brokeria-preview"] .tpl-rise-2 {
  animation: brokeria-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="brokeria"] .tpl-rise-3, [data-template-id="brokeria-preview"] .tpl-rise-3 {
  animation: brokeria-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="brokeria"] .tpl-marquee-track, [data-template-id="brokeria-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: brokeria-marquee 28s linear infinite;
}
[data-template-id="brokeria"] .tpl-float, [data-template-id="brokeria-preview"] .tpl-float {
  animation: brokeria-float 5s ease-in-out infinite;
}
[data-template-id="brokeria"] .tpl-sweep, [data-template-id="brokeria-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="brokeria"] .tpl-sweep::after, [data-template-id="brokeria-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: brokeria-sweep 4.5s ease-in-out infinite;
}
[data-template-id="brokeria"] .tpl-climb, [data-template-id="brokeria-preview"] .tpl-climb {
  animation: brokeria-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes brokeria-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
[data-template-id="brokeria"] .tpl-prop-ticker, [data-template-id="brokeria-preview"] .tpl-prop-ticker { display:flex;width:max-content;animation:brokeria-ticker 35s linear infinite; }
[data-template-id="brokeria"] .tpl-zoom-card:hover img, [data-template-id="brokeria-preview"] .tpl-zoom-card:hover img { transform:scale(1.1); }

@keyframes brokeria-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes brokeria-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes brokeria-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="brokeria"] .tpl-glass, [data-template-id="brokeria-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="brokeria"] .tpl-glow, [data-template-id="brokeria-preview"] .tpl-glow {{
  background: radial-gradient(circle, #c9a96244, transparent 70%);
  animation: brokeria-glow 3s ease-in-out infinite;
}}
[data-template-id="brokeria"] .tpl-shimmer, [data-template-id="brokeria-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #c9a96218 50%, transparent 70%);
  background-size: 200% 100%;
  animation: brokeria-shimmer 4s linear infinite;
}}
[data-template-id="brokeria"] .tpl-parallax, [data-template-id="brokeria-preview"] .tpl-parallax {{
  animation: brokeria-parallax 8s ease-in-out infinite;
}}
[data-template-id="brokeria"] .tpl-magnetic, [data-template-id="brokeria-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="brokeria"] .tpl-magnetic:hover, [data-template-id="brokeria-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="brokeria"] details[open] summary, [data-template-id="brokeria-preview"] details[open] summary {{
  color: #c9a962;
}}
@keyframes brokeria-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes brokeria-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="brokeria"] .tpl-testi-track, [data-template-id="brokeria-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:brokeria-testi 28s linear infinite;
}}
[data-template-id="brokeria"] .tpl-line-draw, [data-template-id="brokeria-preview"] .tpl-line-draw {{
  transform-origin:right;animation:brokeria-draw 1.2s both;
}}

`;
