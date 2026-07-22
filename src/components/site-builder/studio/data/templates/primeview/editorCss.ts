export const primeviewEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="primeview"], [data-template-id="primeview-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f8fafc; --tpl-surface: #ffffff; --tpl-text: #0f172a;
  --tpl-muted: #64748b; --tpl-primary: #059669; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(15,23,42,0.1); --tpl-dark: #020617;
}

[data-template-id="primeview"] .tpl-display,
[data-template-id="primeview-preview"] .tpl-display {
  font-family: "Libre Baskerville", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="primeview"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes primeview-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes primeview-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes primeview-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes primeview-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes primeview-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes primeview-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="primeview"] .tpl-ken, [data-template-id="primeview-preview"] .tpl-ken {
  animation: primeview-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="primeview"] .tpl-rise, [data-template-id="primeview-preview"] .tpl-rise {
  animation: primeview-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="primeview"] .tpl-rise-2, [data-template-id="primeview-preview"] .tpl-rise-2 {
  animation: primeview-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="primeview"] .tpl-rise-3, [data-template-id="primeview-preview"] .tpl-rise-3 {
  animation: primeview-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="primeview"] .tpl-marquee-track, [data-template-id="primeview-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: primeview-marquee 28s linear infinite;
}
[data-template-id="primeview"] .tpl-float, [data-template-id="primeview-preview"] .tpl-float {
  animation: primeview-float 5s ease-in-out infinite;
}
[data-template-id="primeview"] .tpl-sweep, [data-template-id="primeview-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="primeview"] .tpl-sweep::after, [data-template-id="primeview-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: primeview-sweep 4.5s ease-in-out infinite;
}
[data-template-id="primeview"] .tpl-climb, [data-template-id="primeview-preview"] .tpl-climb {
  animation: primeview-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes primeview-handle { 0%,100%{left:35%} 50%{left:65%} }
[data-template-id="primeview"] .tpl-compare-handle, [data-template-id="primeview-preview"] .tpl-compare-handle { animation:primeview-handle 5s infinite; }

@keyframes primeview-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes primeview-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes primeview-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="primeview"] .tpl-glass, [data-template-id="primeview-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="primeview"] .tpl-glow, [data-template-id="primeview-preview"] .tpl-glow {{
  background: radial-gradient(circle, #05966944, transparent 70%);
  animation: primeview-glow 3s ease-in-out infinite;
}}
[data-template-id="primeview"] .tpl-shimmer, [data-template-id="primeview-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #05966918 50%, transparent 70%);
  background-size: 200% 100%;
  animation: primeview-shimmer 4s linear infinite;
}}
[data-template-id="primeview"] .tpl-parallax, [data-template-id="primeview-preview"] .tpl-parallax {{
  animation: primeview-parallax 8s ease-in-out infinite;
}}
[data-template-id="primeview"] .tpl-magnetic, [data-template-id="primeview-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="primeview"] .tpl-magnetic:hover, [data-template-id="primeview-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="primeview"] details[open] summary, [data-template-id="primeview-preview"] details[open] summary {{
  color: #059669;
}}
@keyframes primeview-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes primeview-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="primeview"] .tpl-testi-track, [data-template-id="primeview-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:primeview-testi 28s linear infinite;
}}
[data-template-id="primeview"] .tpl-line-draw, [data-template-id="primeview-preview"] .tpl-line-draw {{
  transform-origin:right;animation:primeview-draw 1.2s both;
}}

`;
