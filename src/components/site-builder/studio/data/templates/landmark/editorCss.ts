export const landmarkEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="landmark"], [data-template-id="landmark-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f0f4f8; --tpl-surface: #ffffff; --tpl-text: #1e293b;
  --tpl-muted: #64748b; --tpl-primary: #0ea5e9; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(30,41,59,0.1); --tpl-dark: #0f172a;
}

[data-template-id="landmark"] .tpl-display,
[data-template-id="landmark-preview"] .tpl-display {
  font-family: "Outfit", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="landmark"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes landmark-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes landmark-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes landmark-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes landmark-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes landmark-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes landmark-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="landmark"] .tpl-ken, [data-template-id="landmark-preview"] .tpl-ken {
  animation: landmark-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="landmark"] .tpl-rise, [data-template-id="landmark-preview"] .tpl-rise {
  animation: landmark-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="landmark"] .tpl-rise-2, [data-template-id="landmark-preview"] .tpl-rise-2 {
  animation: landmark-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="landmark"] .tpl-rise-3, [data-template-id="landmark-preview"] .tpl-rise-3 {
  animation: landmark-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="landmark"] .tpl-marquee-track, [data-template-id="landmark-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: landmark-marquee 28s linear infinite;
}
[data-template-id="landmark"] .tpl-float, [data-template-id="landmark-preview"] .tpl-float {
  animation: landmark-float 5s ease-in-out infinite;
}
[data-template-id="landmark"] .tpl-sweep, [data-template-id="landmark-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="landmark"] .tpl-sweep::after, [data-template-id="landmark-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: landmark-sweep 4.5s ease-in-out infinite;
}
[data-template-id="landmark"] .tpl-climb, [data-template-id="landmark-preview"] .tpl-climb {
  animation: landmark-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes landmark-pin { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.4);opacity:1} }
[data-template-id="landmark"] .tpl-pin, [data-template-id="landmark-preview"] .tpl-pin { animation:landmark-pin 2s infinite; }
@keyframes landmark-testi { to { transform:translateX(-50%); } }
[data-template-id="landmark"] .tpl-testi-track, [data-template-id="landmark-preview"] .tpl-testi-track {
  display:flex;width:max-content;animation:landmark-testi 28s linear infinite;
}
`;
