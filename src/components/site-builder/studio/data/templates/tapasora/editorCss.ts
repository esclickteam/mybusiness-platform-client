export const tapasoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="tapasora"], [data-template-id="tapasora"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #12081a; --tpl-surface: #1e1028; --tpl-text: #f8eef8;
  --tpl-muted: #b89bc4; --tpl-primary: #ff2d95; --tpl-primary-text: #12081a;
  --tpl-line: rgba(248,238,248,0.14); --tpl-dark: #080410;
}

[data-template-id="tapasora"] .tpl-display,
[data-template-id="tapasora"] .tpl-display {
  font-family: "Oswald", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="tapasora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes tapasora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes tapasora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tapasora-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes tapasora-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes tapasora-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes tapasora-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="tapasora"] .tpl-ken, [data-template-id="tapasora"] .tpl-ken {
  animation: tapasora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="tapasora"] .tpl-rise, [data-template-id="tapasora"] .tpl-rise {
  animation: tapasora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="tapasora"] .tpl-rise-2, [data-template-id="tapasora"] .tpl-rise-2 {
  animation: tapasora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="tapasora"] .tpl-rise-3, [data-template-id="tapasora"] .tpl-rise-3 {
  animation: tapasora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="tapasora"] .tpl-marquee-track, [data-template-id="tapasora"] .tpl-marquee-track {
  display: flex; width: max-content; animation: tapasora-marquee 28s linear infinite;
}
[data-template-id="tapasora"] .tpl-float, [data-template-id="tapasora"] .tpl-float {
  animation: tapasora-float 5s ease-in-out infinite;
}
[data-template-id="tapasora"] .tpl-sweep, [data-template-id="tapasora"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="tapasora"] .tpl-sweep::after, [data-template-id="tapasora"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: tapasora-sweep 4.5s ease-in-out infinite;
}
[data-template-id="tapasora"] .tpl-climb, [data-template-id="tapasora"] .tpl-climb {
  animation: tapasora-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes tapasora-plate-rise { 0% { transform: translateY(40px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes tapasora-neon-flicker { 0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; text-shadow: 0 0 12px #ff2d95, 0 0 28px #ff2d95; } 20%,24%,55% { opacity: .45; text-shadow: none; } }
@keyframes tapasora-wine-pour { 0% { height: 0%; } 100% { height: 70%; } }
@keyframes tapasora-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
[data-template-id="tapasora"] .tpl-plate-rise, [data-template-id="tapasora"] .tpl-plate-rise {
  animation: tapasora-plate-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="tapasora"] .tpl-neon, [data-template-id="tapasora"] .tpl-neon {
  animation: tapasora-neon-flicker 4s linear infinite; color: #ff2d95;
}
[data-template-id="tapasora"] .tpl-wine-fill, [data-template-id="tapasora"] .tpl-wine-fill {
  animation: tapasora-wine-pour 3.5s ease-in-out infinite alternate;
}
[data-template-id="tapasora"] .tpl-marquee-track, [data-template-id="tapasora"] .tpl-marquee-track {
  display: flex; width: max-content; animation: tapasora-marquee 24s linear infinite;
}
`;
