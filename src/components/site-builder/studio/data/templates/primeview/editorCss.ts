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
`;
