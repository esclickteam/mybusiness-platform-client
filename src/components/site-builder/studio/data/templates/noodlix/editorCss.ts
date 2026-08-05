export const noodlixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="noodlix"], [data-template-id="noodlix"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0f1412; --tpl-surface: #18201c; --tpl-text: #eef6f1;
  --tpl-muted: #8aa89a; --tpl-primary: #3dd6c6; --tpl-primary-text: #0a1210;
  --tpl-line: rgba(238,246,241,0.12); --tpl-dark: #070a09;
}

[data-template-id="noodlix"] .tpl-display,
[data-template-id="noodlix"] .tpl-display {
  font-family: "Sora", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="noodlix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes noodlix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes noodlix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes noodlix-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes noodlix-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes noodlix-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes noodlix-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="noodlix"] .tpl-ken, [data-template-id="noodlix"] .tpl-ken {
  animation: noodlix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="noodlix"] .tpl-rise, [data-template-id="noodlix"] .tpl-rise {
  animation: noodlix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="noodlix"] .tpl-rise-2, [data-template-id="noodlix"] .tpl-rise-2 {
  animation: noodlix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="noodlix"] .tpl-rise-3, [data-template-id="noodlix"] .tpl-rise-3 {
  animation: noodlix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="noodlix"] .tpl-marquee-track, [data-template-id="noodlix"] .tpl-marquee-track {
  display: flex; width: max-content; animation: noodlix-marquee 28s linear infinite;
}
[data-template-id="noodlix"] .tpl-float, [data-template-id="noodlix"] .tpl-float {
  animation: noodlix-float 5s ease-in-out infinite;
}
[data-template-id="noodlix"] .tpl-sweep, [data-template-id="noodlix"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="noodlix"] .tpl-sweep::after, [data-template-id="noodlix"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: noodlix-sweep 4.5s ease-in-out infinite;
}
[data-template-id="noodlix"] .tpl-climb, [data-template-id="noodlix"] .tpl-climb {
  animation: noodlix-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes noodlix-steam { 0% { transform: translateY(0) scaleX(1); opacity: .55; } 100% { transform: translateY(-80vh) scaleX(1.6); opacity: 0; } }
@keyframes noodlix-bowl-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes noodlix-radial-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
[data-template-id="noodlix"] .tpl-steam, [data-template-id="noodlix"] .tpl-steam {
  animation: noodlix-steam var(--steam-dur, 6s) ease-in infinite;
}
[data-template-id="noodlix"] .tpl-bowl-float, [data-template-id="noodlix"] .tpl-bowl-float {
  animation: noodlix-bowl-float 5s ease-in-out infinite;
}
[data-template-id="noodlix"] .tpl-radial-orbit, [data-template-id="noodlix"] .tpl-radial-orbit {
  animation: noodlix-radial-spin 40s linear infinite;
}
[data-template-id="noodlix"] .tpl-steam-card, [data-template-id="noodlix"] .tpl-steam-card {
  backdrop-filter: blur(14px); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
}
`;
