export const coralineEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="coraline"], [data-template-id="coraline-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #041824; --tpl-surface: #0a2438; --tpl-text: #e8f4ff;
  --tpl-muted: #7eb8d4; --tpl-primary: #3dffd4; --tpl-primary-text: #041824;
  --tpl-line: rgba(232,244,255,0.14); --tpl-dark: #020c14;
}

[data-template-id="coraline"] .tpl-display,
[data-template-id="coraline-preview"] .tpl-display {
  font-family: "Sora", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="coraline"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes coraline-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes coraline-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes coraline-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes coraline-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes coraline-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes coraline-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="coraline"] .tpl-ken, [data-template-id="coraline-preview"] .tpl-ken {
  animation: coraline-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="coraline"] .tpl-rise, [data-template-id="coraline-preview"] .tpl-rise {
  animation: coraline-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="coraline"] .tpl-rise-2, [data-template-id="coraline-preview"] .tpl-rise-2 {
  animation: coraline-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="coraline"] .tpl-rise-3, [data-template-id="coraline-preview"] .tpl-rise-3 {
  animation: coraline-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="coraline"] .tpl-marquee-track, [data-template-id="coraline-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: coraline-marquee 28s linear infinite;
}
[data-template-id="coraline"] .tpl-float, [data-template-id="coraline-preview"] .tpl-float {
  animation: coraline-float 5s ease-in-out infinite;
}
[data-template-id="coraline"] .tpl-sweep, [data-template-id="coraline-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="coraline"] .tpl-sweep::after, [data-template-id="coraline-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: coraline-sweep 4.5s ease-in-out infinite;
}
[data-template-id="coraline"] .tpl-climb, [data-template-id="coraline-preview"] .tpl-climb {
  animation: coraline-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes coraline-bubble-rise { 0% { transform: translateY(0) scale(1); opacity: .55; } 100% { transform: translateY(-120vh) scale(1.2); opacity: 0; } }
[data-template-id="coraline"] .tpl-bubble, [data-template-id="coraline-preview"] .tpl-bubble {
  animation: coraline-bubble-rise var(--bubble-dur, 8s) ease-in infinite;
}
[data-template-id="coraline"] .tpl-glass, [data-template-id="coraline-preview"] .tpl-glass {
  backdrop-filter: blur(16px); background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
}
`;
