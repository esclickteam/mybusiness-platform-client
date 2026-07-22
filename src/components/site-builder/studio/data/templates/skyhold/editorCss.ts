export const skyholdEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="skyhold"], [data-template-id="skyhold-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0f1419; --tpl-surface: #1a2332; --tpl-text: #e8edf5;
  --tpl-muted: #7a8fa8; --tpl-primary: #38bdf8; --tpl-primary-text: #0f1419;
  --tpl-line: rgba(232,237,245,0.14); --tpl-dark: #080c10;
}

[data-template-id="skyhold"] .tpl-display,
[data-template-id="skyhold-preview"] .tpl-display {
  font-family: "Syne", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="skyhold"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes skyhold-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes skyhold-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes skyhold-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes skyhold-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes skyhold-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes skyhold-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="skyhold"] .tpl-ken, [data-template-id="skyhold-preview"] .tpl-ken {
  animation: skyhold-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="skyhold"] .tpl-rise, [data-template-id="skyhold-preview"] .tpl-rise {
  animation: skyhold-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="skyhold"] .tpl-rise-2, [data-template-id="skyhold-preview"] .tpl-rise-2 {
  animation: skyhold-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="skyhold"] .tpl-rise-3, [data-template-id="skyhold-preview"] .tpl-rise-3 {
  animation: skyhold-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="skyhold"] .tpl-marquee-track, [data-template-id="skyhold-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: skyhold-marquee 28s linear infinite;
}
[data-template-id="skyhold"] .tpl-float, [data-template-id="skyhold-preview"] .tpl-float {
  animation: skyhold-float 5s ease-in-out infinite;
}
[data-template-id="skyhold"] .tpl-sweep, [data-template-id="skyhold-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="skyhold"] .tpl-sweep::after, [data-template-id="skyhold-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: skyhold-sweep 4.5s ease-in-out infinite;
}
[data-template-id="skyhold"] .tpl-climb, [data-template-id="skyhold-preview"] .tpl-climb {
  animation: skyhold-climb .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes skyhold-elevator { 0%,20%{transform:translateY(0)} 25%,45%{transform:translateY(-1.2em)} 50%,70%{transform:translateY(-2.4em)} 75%,100%{transform:translateY(-3.6em)} }
[data-template-id="skyhold"] .tpl-elevator-digits, [data-template-id="skyhold-preview"] .tpl-elevator-digits { animation:skyhold-elevator 8s infinite; }
@keyframes skyhold-testi { to { transform:translateX(-50%); } }
[data-template-id="skyhold"] .tpl-testi-track, [data-template-id="skyhold-preview"] .tpl-testi-track {
  display:flex;width:max-content;animation:skyhold-testi 28s linear infinite;
}
`;
