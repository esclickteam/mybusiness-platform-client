export const crustoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="crustora"], [data-template-id="crustora"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #faf4eb; --tpl-surface: #ffffff; --tpl-text: #2a1810;
  --tpl-muted: #8b6b52; --tpl-primary: #c1121f; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(42,24,16,0.12); --tpl-dark: #1a0e0a;
}

[data-template-id="crustora"] .tpl-display,
[data-template-id="crustora"] .tpl-display {
  font-family: "Archivo Black", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="crustora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes crustora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes crustora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes crustora-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes crustora-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes crustora-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes crustora-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="crustora"] .tpl-ken, [data-template-id="crustora"] .tpl-ken {
  animation: crustora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="crustora"] .tpl-rise, [data-template-id="crustora"] .tpl-rise {
  animation: crustora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="crustora"] .tpl-rise-2, [data-template-id="crustora"] .tpl-rise-2 {
  animation: crustora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="crustora"] .tpl-rise-3, [data-template-id="crustora"] .tpl-rise-3 {
  animation: crustora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="crustora"] .tpl-marquee-track, [data-template-id="crustora"] .tpl-marquee-track {
  display: flex; width: max-content; animation: crustora-marquee 28s linear infinite;
}
[data-template-id="crustora"] .tpl-float, [data-template-id="crustora"] .tpl-float {
  animation: crustora-float 5s ease-in-out infinite;
}
[data-template-id="crustora"] .tpl-sweep, [data-template-id="crustora"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="crustora"] .tpl-sweep::after, [data-template-id="crustora"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: crustora-sweep 4.5s ease-in-out infinite;
}
[data-template-id="crustora"] .tpl-climb, [data-template-id="crustora"] .tpl-climb {
  animation: crustora-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes crustora-pizza-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes crustora-flour { 0% { transform: translateY(-5%) translateX(0); opacity: .7; } 100% { transform: translateY(110vh) translateX(20px); opacity: .1; } }
@keyframes crustora-heat-shimmer { 0%,100% { transform: skewX(0deg) scaleY(1); opacity: .35; } 50% { transform: skewX(2deg) scaleY(1.04); opacity: .6; } }
@keyframes crustora-stretch-line { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
[data-template-id="crustora"] .tpl-pizza-spin, [data-template-id="crustora"] .tpl-pizza-spin {
  animation: crustora-pizza-spin 28s linear infinite;
}
[data-template-id="crustora"] .tpl-flour, [data-template-id="crustora"] .tpl-flour {
  animation: crustora-flour var(--flour-dur, 8s) linear infinite;
}
[data-template-id="crustora"] .tpl-heat-shimmer, [data-template-id="crustora"] .tpl-heat-shimmer {
  animation: crustora-heat-shimmer 2.6s ease-in-out infinite;
}
[data-template-id="crustora"] .tpl-stretch-under, [data-template-id="crustora"] .tpl-stretch-under {
  transform-origin: right center; animation: crustora-stretch-line 1.2s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="crustora"] .tpl-tri-card, [data-template-id="crustora"] .tpl-tri-card {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
`;
