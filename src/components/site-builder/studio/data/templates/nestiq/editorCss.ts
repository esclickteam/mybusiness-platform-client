export const nestiqEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="nestiq"], [data-template-id="nestiq-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #faf5ff; --tpl-surface: #ffffff; --tpl-text: #1e1b4b;
  --tpl-muted: #6366f1; --tpl-primary: #7c3aed; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(30,27,75,0.1); --tpl-dark: #0f0a1e;
}

[data-template-id="nestiq"] .tpl-display,
[data-template-id="nestiq-preview"] .tpl-display {
  font-family: "Plus Jakarta Sans", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="nestiq"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes nestiq-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes nestiq-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nestiq-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes nestiq-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes nestiq-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes nestiq-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="nestiq"] .tpl-ken, [data-template-id="nestiq-preview"] .tpl-ken {
  animation: nestiq-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="nestiq"] .tpl-rise, [data-template-id="nestiq-preview"] .tpl-rise {
  animation: nestiq-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="nestiq"] .tpl-rise-2, [data-template-id="nestiq-preview"] .tpl-rise-2 {
  animation: nestiq-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="nestiq"] .tpl-rise-3, [data-template-id="nestiq-preview"] .tpl-rise-3 {
  animation: nestiq-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="nestiq"] .tpl-marquee-track, [data-template-id="nestiq-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: nestiq-marquee 28s linear infinite;
}
[data-template-id="nestiq"] .tpl-float, [data-template-id="nestiq-preview"] .tpl-float {
  animation: nestiq-float 5s ease-in-out infinite;
}
[data-template-id="nestiq"] .tpl-sweep, [data-template-id="nestiq-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="nestiq"] .tpl-sweep::after, [data-template-id="nestiq-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: nestiq-sweep 4.5s ease-in-out infinite;
}
[data-template-id="nestiq"] .tpl-climb, [data-template-id="nestiq-preview"] .tpl-climb {
  animation: nestiq-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes nestiq-count { from{opacity:.3;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
[data-template-id="nestiq"] .tpl-counter, [data-template-id="nestiq-preview"] .tpl-counter { animation:nestiq-count 1s both; }

@keyframes nestiq-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes nestiq-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes nestiq-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="nestiq"] .tpl-glass, [data-template-id="nestiq-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="nestiq"] .tpl-glow, [data-template-id="nestiq-preview"] .tpl-glow {{
  background: radial-gradient(circle, #7c3aed44, transparent 70%);
  animation: nestiq-glow 3s ease-in-out infinite;
}}
[data-template-id="nestiq"] .tpl-shimmer, [data-template-id="nestiq-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, #7c3aed18 50%, transparent 70%);
  background-size: 200% 100%;
  animation: nestiq-shimmer 4s linear infinite;
}}
[data-template-id="nestiq"] .tpl-parallax, [data-template-id="nestiq-preview"] .tpl-parallax {{
  animation: nestiq-parallax 8s ease-in-out infinite;
}}
[data-template-id="nestiq"] .tpl-magnetic, [data-template-id="nestiq-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="nestiq"] .tpl-magnetic:hover, [data-template-id="nestiq-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="nestiq"] details[open] summary, [data-template-id="nestiq-preview"] details[open] summary {{
  color: #7c3aed;
}}
@keyframes nestiq-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes nestiq-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="nestiq"] .tpl-testi-track, [data-template-id="nestiq-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:nestiq-testi 28s linear infinite;
}}
[data-template-id="nestiq"] .tpl-line-draw, [data-template-id="nestiq-preview"] .tpl-line-draw {{
  transform-origin:right;animation:nestiq-draw 1.2s both;
}}

`;
