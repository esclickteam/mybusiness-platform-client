export const loteraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="lotera"], [data-template-id="lotera-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #07131f; --tpl-surface: #0f2133; --tpl-text: #eef5fb;
  --tpl-muted: #8fa8bd; --tpl-primary: #5eb4ff; --tpl-primary-text: #041018;
  --tpl-line: rgba(238,245,251,0.16); --tpl-dark: #030910;
}

[data-template-id="lotera"] .tpl-display,
[data-template-id="lotera-preview"] .tpl-display {
  font-family: "Frank Ruhl Libre", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="lotera"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes lotera-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes lotera-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lotera-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes lotera-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes lotera-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes lotera-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes lotera-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes lotera-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="lotera"] .tpl-ken, [data-template-id="lotera-preview"] .tpl-ken {
  animation: lotera-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="lotera"] .tpl-rise, [data-template-id="lotera-preview"] .tpl-rise {
  animation: lotera-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="lotera"] .tpl-rise-2, [data-template-id="lotera-preview"] .tpl-rise-2 {
  animation: lotera-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="lotera"] .tpl-rise-3, [data-template-id="lotera-preview"] .tpl-rise-3 {
  animation: lotera-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="lotera"] .tpl-draw, [data-template-id="lotera-preview"] .tpl-draw {
  transform-origin: right center;
  animation: lotera-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="lotera"] .tpl-marquee-track, [data-template-id="lotera-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: lotera-marquee 28s linear infinite;
}
[data-template-id="lotera"] .tpl-pulse-line, [data-template-id="lotera-preview"] .tpl-pulse-line {
  animation: lotera-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="lotera"] .tpl-float, [data-template-id="lotera-preview"] .tpl-float {
  animation: lotera-float 5s ease-in-out infinite;
}
[data-template-id="lotera"] .tpl-sweep, [data-template-id="lotera-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="lotera"] .tpl-sweep::after, [data-template-id="lotera-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: lotera-sweep 4.5s ease-in-out infinite;
}
[data-template-id="lotera"] .tpl-climb, [data-template-id="lotera-preview"] .tpl-climb {
  animation: lotera-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
