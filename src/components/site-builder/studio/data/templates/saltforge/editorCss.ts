export const saltforgeEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="saltforge"], [data-template-id="saltforge-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #e8e4df; --tpl-surface: #f5f2ed; --tpl-text: #2a2826;
  --tpl-muted: #6b6560; --tpl-primary: #c45c26; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(42,40,38,0.14); --tpl-dark: #1a1816;
}

[data-template-id="saltforge"] .tpl-display,
[data-template-id="saltforge-preview"] .tpl-display {
  font-family: "Oswald", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="saltforge"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes saltforge-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes saltforge-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes saltforge-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes saltforge-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes saltforge-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes saltforge-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="saltforge"] .tpl-ken, [data-template-id="saltforge-preview"] .tpl-ken {
  animation: saltforge-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="saltforge"] .tpl-rise, [data-template-id="saltforge-preview"] .tpl-rise {
  animation: saltforge-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="saltforge"] .tpl-rise-2, [data-template-id="saltforge-preview"] .tpl-rise-2 {
  animation: saltforge-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="saltforge"] .tpl-rise-3, [data-template-id="saltforge-preview"] .tpl-rise-3 {
  animation: saltforge-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="saltforge"] .tpl-marquee-track, [data-template-id="saltforge-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: saltforge-marquee 28s linear infinite;
}
[data-template-id="saltforge"] .tpl-float, [data-template-id="saltforge-preview"] .tpl-float {
  animation: saltforge-float 5s ease-in-out infinite;
}
[data-template-id="saltforge"] .tpl-sweep, [data-template-id="saltforge-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="saltforge"] .tpl-sweep::after, [data-template-id="saltforge-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: saltforge-sweep 4.5s ease-in-out infinite;
}
[data-template-id="saltforge"] .tpl-climb, [data-template-id="saltforge-preview"] .tpl-climb {
  animation: saltforge-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes saltforge-grain-sweep { 0% { transform: translate(0,0); } 100% { transform: translate(-20%,-10%); } }
[data-template-id="saltforge"] .tpl-grain, [data-template-id="saltforge-preview"] .tpl-grain {
  pointer-events: none; position: absolute; inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: .18; animation: saltforge-grain-sweep 6s steps(4) infinite;
}
[data-template-id="saltforge"] .tpl-masonry, [data-template-id="saltforge-preview"] .tpl-masonry {
  columns: 2; column-gap: 1rem;
}
@media (min-width: 768px) {
  [data-template-id="saltforge"] .tpl-masonry, [data-template-id="saltforge-preview"] .tpl-masonry { columns: 3; }
}
`;
