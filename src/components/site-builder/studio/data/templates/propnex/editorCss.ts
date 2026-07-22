export const propnexEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="propnex"], [data-template-id="propnex-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f4f6f9; --tpl-surface: #ffffff; --tpl-text: #111827;
  --tpl-muted: #6b7280; --tpl-primary: #2563eb; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(17,24,39,0.1); --tpl-dark: #0f172a;
}

[data-template-id="propnex"] .tpl-display,
[data-template-id="propnex-preview"] .tpl-display {
  font-family: "Space Grotesk", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="propnex"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes propnex-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes propnex-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes propnex-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes propnex-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes propnex-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes propnex-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="propnex"] .tpl-ken, [data-template-id="propnex-preview"] .tpl-ken {
  animation: propnex-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="propnex"] .tpl-rise, [data-template-id="propnex-preview"] .tpl-rise {
  animation: propnex-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="propnex"] .tpl-rise-2, [data-template-id="propnex-preview"] .tpl-rise-2 {
  animation: propnex-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="propnex"] .tpl-rise-3, [data-template-id="propnex-preview"] .tpl-rise-3 {
  animation: propnex-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="propnex"] .tpl-marquee-track, [data-template-id="propnex-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: propnex-marquee 28s linear infinite;
}
[data-template-id="propnex"] .tpl-float, [data-template-id="propnex-preview"] .tpl-float {
  animation: propnex-float 5s ease-in-out infinite;
}
[data-template-id="propnex"] .tpl-sweep, [data-template-id="propnex-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="propnex"] .tpl-sweep::after, [data-template-id="propnex-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: propnex-sweep 4.5s ease-in-out infinite;
}
[data-template-id="propnex"] .tpl-climb, [data-template-id="propnex-preview"] .tpl-climb {
  animation: propnex-climb .85s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="propnex"] .tpl-bento, [data-template-id="propnex-preview"] .tpl-bento { display:grid;gap:.75rem;grid-template-columns:repeat(6,1fr); }
@keyframes propnex-draw { from { transform:scaleX(0); } to { transform:scaleX(1); } }
[data-template-id="propnex"] .tpl-line-draw, [data-template-id="propnex-preview"] .tpl-line-draw { transform-origin:right;animation:propnex-draw 1.2s both; }

@keyframes propnex-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes propnex-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes propnex-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="propnex"] .tpl-glass, [data-template-id="propnex-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="propnex"] .tpl-glow, [data-template-id="propnex-preview"] .tpl-glow {{
  background: radial-gradient(circle, #2563eb44, transparent 70%);
  animation: propnex-glow 3s ease-in-out infinite;
}}
[data-template-id="propnex"] .tpl-shimmer, [data-template-id="propnex-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #2563eb18 50%, transparent 70%);
  background-size: 200% 100%;
  animation: propnex-shimmer 4s linear infinite;
}}
[data-template-id="propnex"] .tpl-parallax, [data-template-id="propnex-preview"] .tpl-parallax {{
  animation: propnex-parallax 8s ease-in-out infinite;
}}
[data-template-id="propnex"] .tpl-magnetic, [data-template-id="propnex-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="propnex"] .tpl-magnetic:hover, [data-template-id="propnex-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="propnex"] details[open] summary, [data-template-id="propnex-preview"] details[open] summary {{
  color: #2563eb;
}}
@keyframes propnex-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes propnex-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="propnex"] .tpl-testi-track, [data-template-id="propnex-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:propnex-testi 28s linear infinite;
}}
[data-template-id="propnex"] .tpl-line-draw, [data-template-id="propnex-preview"] .tpl-line-draw {{
  transform-origin:right;animation:propnex-draw 1.2s both;
}}

`;
