export const brunchhausEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="brunchhaus"], [data-template-id="brunchhaus"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #fff8f0; --tpl-surface: #ffffff; --tpl-text: #3a2a1e;
  --tpl-muted: #9a7b62; --tpl-primary: #f4a261; --tpl-primary-text: #3a2a1e;
  --tpl-line: rgba(58,42,30,0.12); --tpl-dark: #2a1c14;
}

[data-template-id="brunchhaus"] .tpl-display,
[data-template-id="brunchhaus"] .tpl-display {
  font-family: "Fraunces", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="brunchhaus"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes brunchhaus-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes brunchhaus-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes brunchhaus-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes brunchhaus-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes brunchhaus-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes brunchhaus-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="brunchhaus"] .tpl-ken, [data-template-id="brunchhaus"] .tpl-ken {
  animation: brunchhaus-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="brunchhaus"] .tpl-rise, [data-template-id="brunchhaus"] .tpl-rise {
  animation: brunchhaus-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="brunchhaus"] .tpl-rise-2, [data-template-id="brunchhaus"] .tpl-rise-2 {
  animation: brunchhaus-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="brunchhaus"] .tpl-rise-3, [data-template-id="brunchhaus"] .tpl-rise-3 {
  animation: brunchhaus-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="brunchhaus"] .tpl-marquee-track, [data-template-id="brunchhaus"] .tpl-marquee-track {
  display: flex; width: max-content; animation: brunchhaus-marquee 28s linear infinite;
}
[data-template-id="brunchhaus"] .tpl-float, [data-template-id="brunchhaus"] .tpl-float {
  animation: brunchhaus-float 5s ease-in-out infinite;
}
[data-template-id="brunchhaus"] .tpl-sweep, [data-template-id="brunchhaus"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="brunchhaus"] .tpl-sweep::after, [data-template-id="brunchhaus"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: brunchhaus-sweep 4.5s ease-in-out infinite;
}
[data-template-id="brunchhaus"] .tpl-climb, [data-template-id="brunchhaus"] .tpl-climb {
  animation: brunchhaus-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes brunchhaus-sun-rays { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes brunchhaus-polaroid-wiggle { 0%,100% { transform: rotate(var(--rot, -4deg)); } 50% { transform: rotate(calc(var(--rot, -4deg) + 3deg)) translateY(-6px); } }
[data-template-id="brunchhaus"] .tpl-sun-rays, [data-template-id="brunchhaus"] .tpl-sun-rays {
  animation: brunchhaus-sun-rays 40s linear infinite;
}
[data-template-id="brunchhaus"] .tpl-polaroid, [data-template-id="brunchhaus"] .tpl-polaroid {
  animation: brunchhaus-polaroid-wiggle 5s ease-in-out infinite;
}
[data-template-id="brunchhaus"] .tpl-sunny-logo, [data-template-id="brunchhaus"] .tpl-sunny-logo {
  border-radius: 999px; background: radial-gradient(circle at 30% 30%, #f4a26188, transparent 70%);
}
[data-template-id="brunchhaus"] .tpl-napkin-dot, [data-template-id="brunchhaus"] .tpl-napkin-dot {
  background-image: radial-gradient(#f4a26155 1px, transparent 1px); background-size: 10px 10px;
}
`;
