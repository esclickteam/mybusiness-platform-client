export const openhausEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="openhaus"], [data-template-id="openhaus-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #fffbf7; --tpl-surface: #ffffff; --tpl-text: #292524;
  --tpl-muted: #78716c; --tpl-primary: #ea580c; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(41,37,36,0.1); --tpl-dark: #1c1917;
}

[data-template-id="openhaus"] .tpl-display,
[data-template-id="openhaus-preview"] .tpl-display {
  font-family: "Manrope", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="openhaus"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes openhaus-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes openhaus-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes openhaus-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes openhaus-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes openhaus-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes openhaus-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="openhaus"] .tpl-ken, [data-template-id="openhaus-preview"] .tpl-ken {
  animation: openhaus-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="openhaus"] .tpl-rise, [data-template-id="openhaus-preview"] .tpl-rise {
  animation: openhaus-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="openhaus"] .tpl-rise-2, [data-template-id="openhaus-preview"] .tpl-rise-2 {
  animation: openhaus-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="openhaus"] .tpl-rise-3, [data-template-id="openhaus-preview"] .tpl-rise-3 {
  animation: openhaus-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="openhaus"] .tpl-marquee-track, [data-template-id="openhaus-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: openhaus-marquee 28s linear infinite;
}
[data-template-id="openhaus"] .tpl-float, [data-template-id="openhaus-preview"] .tpl-float {
  animation: openhaus-float 5s ease-in-out infinite;
}
[data-template-id="openhaus"] .tpl-sweep, [data-template-id="openhaus-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="openhaus"] .tpl-sweep::after, [data-template-id="openhaus-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: openhaus-sweep 4.5s ease-in-out infinite;
}
[data-template-id="openhaus"] .tpl-climb, [data-template-id="openhaus-preview"] .tpl-climb {
  animation: openhaus-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes openhaus-rotate { 0%,30%{transform:rotateY(0)} 33%,63%{transform:rotateY(-120deg)} 66%,96%{transform:rotateY(-240deg)} 100%{transform:rotateY(-360deg)} }
[data-template-id="openhaus"] .tpl-rotate-stage, [data-template-id="openhaus-preview"] .tpl-rotate-stage { perspective:1200px; }
[data-template-id="openhaus"] .tpl-rotate-track, [data-template-id="openhaus-preview"] .tpl-rotate-track { transform-style:preserve-3d;animation:openhaus-rotate 18s infinite; }
[data-template-id="openhaus"] .tpl-masonry, [data-template-id="openhaus-preview"] .tpl-masonry { columns:2;column-gap:1rem; }

@keyframes openhaus-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes openhaus-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes openhaus-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="openhaus"] .tpl-glass, [data-template-id="openhaus-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="openhaus"] .tpl-glow, [data-template-id="openhaus-preview"] .tpl-glow {{
  background: radial-gradient(circle, #ea580c44, transparent 70%);
  animation: openhaus-glow 3s ease-in-out infinite;
}}
[data-template-id="openhaus"] .tpl-shimmer, [data-template-id="openhaus-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #ea580c18 50%, transparent 70%);
  background-size: 200% 100%;
  animation: openhaus-shimmer 4s linear infinite;
}}
[data-template-id="openhaus"] .tpl-parallax, [data-template-id="openhaus-preview"] .tpl-parallax {{
  animation: openhaus-parallax 8s ease-in-out infinite;
}}
[data-template-id="openhaus"] .tpl-magnetic, [data-template-id="openhaus-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="openhaus"] .tpl-magnetic:hover, [data-template-id="openhaus-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="openhaus"] details[open] summary, [data-template-id="openhaus-preview"] details[open] summary {{
  color: #ea580c;
}}
@keyframes openhaus-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes openhaus-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="openhaus"] .tpl-testi-track, [data-template-id="openhaus-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:openhaus-testi 28s linear infinite;
}}
[data-template-id="openhaus"] .tpl-line-draw, [data-template-id="openhaus-preview"] .tpl-line-draw {{
  transform-origin:right;animation:openhaus-draw 1.2s both;
}}

`;
