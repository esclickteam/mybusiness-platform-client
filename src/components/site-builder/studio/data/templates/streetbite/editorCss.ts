export const streetbiteEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@700;800;900&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="streetbite"], [data-template-id="streetbite"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0d1117; --tpl-surface: #161b22; --tpl-text: #e6edf3;
  --tpl-muted: #8b949e; --tpl-primary: #39d353; --tpl-primary-text: #0d1117;
  --tpl-line: rgba(230,237,243,0.12); --tpl-dark: #010409;
}

[data-template-id="streetbite"] .tpl-display,
[data-template-id="streetbite"] .tpl-display {
  font-family: "Rubik", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="streetbite"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes streetbite-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes streetbite-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes streetbite-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes streetbite-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes streetbite-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes streetbite-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="streetbite"] .tpl-ken, [data-template-id="streetbite"] .tpl-ken {
  animation: streetbite-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="streetbite"] .tpl-rise, [data-template-id="streetbite"] .tpl-rise {
  animation: streetbite-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="streetbite"] .tpl-rise-2, [data-template-id="streetbite"] .tpl-rise-2 {
  animation: streetbite-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="streetbite"] .tpl-rise-3, [data-template-id="streetbite"] .tpl-rise-3 {
  animation: streetbite-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="streetbite"] .tpl-marquee-track, [data-template-id="streetbite"] .tpl-marquee-track {
  display: flex; width: max-content; animation: streetbite-marquee 28s linear infinite;
}
[data-template-id="streetbite"] .tpl-float, [data-template-id="streetbite"] .tpl-float {
  animation: streetbite-float 5s ease-in-out infinite;
}
[data-template-id="streetbite"] .tpl-sweep, [data-template-id="streetbite"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="streetbite"] .tpl-sweep::after, [data-template-id="streetbite"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: streetbite-sweep 4.5s ease-in-out infinite;
}
[data-template-id="streetbite"] .tpl-climb, [data-template-id="streetbite"] .tpl-climb {
  animation: streetbite-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes streetbite-truck-slide { 0% { transform: translateX(110%); } 100% { transform: translateX(-110%); } }
@keyframes streetbite-neon-flicker { 0%,18%,22%,25%,53%,57%,100% { opacity: 1; text-shadow: 0 0 10px #39d353, 0 0 24px #39d353; } 20%,24%,55% { opacity: .4; text-shadow: none; } }
@keyframes streetbite-pin-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes streetbite-stack-in { from { opacity: 0; transform: translateY(30px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
[data-template-id="streetbite"] .tpl-truck, [data-template-id="streetbite"] .tpl-truck {
  animation: streetbite-truck-slide 18s linear infinite;
}
[data-template-id="streetbite"] .tpl-neon-title, [data-template-id="streetbite"] .tpl-neon-title {
  animation: streetbite-neon-flicker 3.5s linear infinite; color: #39d353;
}
[data-template-id="streetbite"] .tpl-pin, [data-template-id="streetbite"] .tpl-pin {
  animation: streetbite-pin-bounce 1.8s ease-in-out infinite;
}
[data-template-id="streetbite"] .tpl-stack-card, [data-template-id="streetbite"] .tpl-stack-card {
  animation: streetbite-stack-in .8s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="streetbite"] .tpl-ticket-tear, [data-template-id="streetbite"] .tpl-ticket-tear {
  mask-image: radial-gradient(circle at 0 50%, transparent 8px, black 9px);
}
`;
