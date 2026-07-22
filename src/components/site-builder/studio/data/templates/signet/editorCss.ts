export const signetEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="signet"], [data-template-id="signet-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a1814; --tpl-surface: #2a2620; --tpl-text: #f5f0e6;
  --tpl-muted: #b8a898; --tpl-primary: #b8860b; --tpl-primary-text: #1a1814;
  --tpl-line: rgba(245,240,230,0.12); --tpl-dark: #0d0c0a;
}

[data-template-id="signet"] .tpl-display,
[data-template-id="signet-preview"] .tpl-display {
  font-family: "Cinzel", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="signet"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes signet-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes signet-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes signet-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes signet-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes signet-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes signet-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="signet"] .tpl-ken, [data-template-id="signet-preview"] .tpl-ken {
  animation: signet-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="signet"] .tpl-rise, [data-template-id="signet-preview"] .tpl-rise {
  animation: signet-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="signet"] .tpl-rise-2, [data-template-id="signet-preview"] .tpl-rise-2 {
  animation: signet-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="signet"] .tpl-rise-3, [data-template-id="signet-preview"] .tpl-rise-3 {
  animation: signet-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="signet"] .tpl-marquee-track, [data-template-id="signet-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: signet-marquee 28s linear infinite;
}
[data-template-id="signet"] .tpl-float, [data-template-id="signet-preview"] .tpl-float {
  animation: signet-float 5s ease-in-out infinite;
}
[data-template-id="signet"] .tpl-sweep, [data-template-id="signet-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="signet"] .tpl-sweep::after, [data-template-id="signet-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: signet-sweep 4.5s ease-in-out infinite;
}
[data-template-id="signet"] .tpl-climb, [data-template-id="signet-preview"] .tpl-climb {
  animation: signet-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes signet-stamp { 0%{transform:scale(2) rotate(-12deg);opacity:0} 100%{transform:scale(1);opacity:1} }
[data-template-id="signet"] .tpl-stamp, [data-template-id="signet-preview"] .tpl-stamp { animation:signet-stamp .9s both; }
@keyframes signet-testi { to { transform:translateX(-50%); } }
[data-template-id="signet"] .tpl-testi-track, [data-template-id="signet-preview"] .tpl-testi-track {
  display:flex;width:max-content;animation:signet-testi 28s linear infinite;
}
`;
