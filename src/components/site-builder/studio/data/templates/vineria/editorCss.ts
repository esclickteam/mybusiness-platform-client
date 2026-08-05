export const vineriaEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Heebo:wght@400;500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="vineria"], [data-template-id="vineria"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a1218; --tpl-surface: #241820; --tpl-text: #f5ebe0;
  --tpl-muted: #a8959a; --tpl-primary: #9b2335; --tpl-primary-text: #f5ebe0;
  --tpl-line: rgba(245,235,224,0.12); --tpl-dark: #0c080c;
}

[data-template-id="vineria"] .tpl-display,
[data-template-id="vineria"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="vineria"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes vineria-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes vineria-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vineria-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes vineria-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes vineria-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes vineria-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="vineria"] .tpl-ken, [data-template-id="vineria"] .tpl-ken {
  animation: vineria-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="vineria"] .tpl-rise, [data-template-id="vineria"] .tpl-rise {
  animation: vineria-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="vineria"] .tpl-rise-2, [data-template-id="vineria"] .tpl-rise-2 {
  animation: vineria-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="vineria"] .tpl-rise-3, [data-template-id="vineria"] .tpl-rise-3 {
  animation: vineria-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="vineria"] .tpl-marquee-track, [data-template-id="vineria"] .tpl-marquee-track {
  display: flex; width: max-content; animation: vineria-marquee 28s linear infinite;
}
[data-template-id="vineria"] .tpl-float, [data-template-id="vineria"] .tpl-float {
  animation: vineria-float 5s ease-in-out infinite;
}
[data-template-id="vineria"] .tpl-sweep, [data-template-id="vineria"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="vineria"] .tpl-sweep::after, [data-template-id="vineria"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: vineria-sweep 4.5s ease-in-out infinite;
}
[data-template-id="vineria"] .tpl-climb, [data-template-id="vineria"] .tpl-climb {
  animation: vineria-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes vineria-depth-drift { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-24px) scale(1.04); } }
@keyframes vineria-cork-float { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-14px) rotate(6deg); } }
@keyframes vineria-stamp { 0% { transform: scale(1.2) rotate(-8deg); opacity: 0; } 100% { transform: scale(1) rotate(-8deg); opacity: 1; } }
[data-template-id="vineria"] .tpl-depth-1, [data-template-id="vineria"] .tpl-depth-1 {
  animation: vineria-depth-drift 16s ease-in-out infinite alternate;
}
[data-template-id="vineria"] .tpl-depth-2, [data-template-id="vineria"] .tpl-depth-2 {
  animation: vineria-depth-drift 12s ease-in-out infinite alternate-reverse;
}
[data-template-id="vineria"] .tpl-cork, [data-template-id="vineria"] .tpl-cork {
  animation: vineria-cork-float 5.5s ease-in-out infinite;
}
[data-template-id="vineria"] .tpl-stamp, [data-template-id="vineria"] .tpl-stamp {
  animation: vineria-stamp .8s cubic-bezier(.22,1,.36,1) both;
}
`;
