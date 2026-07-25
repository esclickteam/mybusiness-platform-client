export const mezzalineEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="mezzaline"], [data-template-id="mezzaline-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f7f1e6; --tpl-surface: #fffdf8; --tpl-text: #2c2a22;
  --tpl-muted: #7a7260; --tpl-primary: #5c7a4a; --tpl-primary-text: #f7f1e6;
  --tpl-line: rgba(44,42,34,0.12); --tpl-dark: #1c1a14;
}

[data-template-id="mezzaline"] .tpl-display,
[data-template-id="mezzaline-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="mezzaline"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes mezzaline-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes mezzaline-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mezzaline-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes mezzaline-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes mezzaline-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes mezzaline-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="mezzaline"] .tpl-ken, [data-template-id="mezzaline-preview"] .tpl-ken {
  animation: mezzaline-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="mezzaline"] .tpl-rise, [data-template-id="mezzaline-preview"] .tpl-rise {
  animation: mezzaline-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="mezzaline"] .tpl-rise-2, [data-template-id="mezzaline-preview"] .tpl-rise-2 {
  animation: mezzaline-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="mezzaline"] .tpl-rise-3, [data-template-id="mezzaline-preview"] .tpl-rise-3 {
  animation: mezzaline-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="mezzaline"] .tpl-marquee-track, [data-template-id="mezzaline-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: mezzaline-marquee 28s linear infinite;
}
[data-template-id="mezzaline"] .tpl-float, [data-template-id="mezzaline-preview"] .tpl-float {
  animation: mezzaline-float 5s ease-in-out infinite;
}
[data-template-id="mezzaline"] .tpl-sweep, [data-template-id="mezzaline-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="mezzaline"] .tpl-sweep::after, [data-template-id="mezzaline-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: mezzaline-sweep 4.5s ease-in-out infinite;
}
[data-template-id="mezzaline"] .tpl-climb, [data-template-id="mezzaline-preview"] .tpl-climb {
  animation: mezzaline-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes mezzaline-olive-float { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(10px,-16px) rotate(12deg); } }
@keyframes mezzaline-platter-drift { 0% { transform: translateX(0); } 100% { transform: translateX(-40%); } }
[data-template-id="mezzaline"] .tpl-olive, [data-template-id="mezzaline-preview"] .tpl-olive {
  animation: mezzaline-olive-float 6s ease-in-out infinite;
}
[data-template-id="mezzaline"] .tpl-platter-rail, [data-template-id="mezzaline-preview"] .tpl-platter-rail {
  display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .5rem;
}
[data-template-id="mezzaline"] .tpl-platter-rail > *, [data-template-id="mezzaline-preview"] .tpl-platter-rail > * {
  scroll-snap-align: start; flex: 0 0 min(280px, 78vw);
}
[data-template-id="mezzaline"] .tpl-branch-under, [data-template-id="mezzaline-preview"] .tpl-branch-under {
  height: 2px; background: linear-gradient(90deg, transparent, #5c7a4a, transparent);
}
`;
