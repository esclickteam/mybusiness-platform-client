export const tidehausEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="tidehaus"], [data-template-id="tidehaus-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #eef6fb; --tpl-surface: #ffffff; --tpl-text: #0c2a3a;
  --tpl-muted: #4a7185; --tpl-primary: #0077b6; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(12,42,58,0.12); --tpl-dark: #061820;
}

[data-template-id="tidehaus"] .tpl-display,
[data-template-id="tidehaus-preview"] .tpl-display {
  font-family: "Archivo Black", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="tidehaus"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes tidehaus-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes tidehaus-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tidehaus-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes tidehaus-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes tidehaus-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes tidehaus-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="tidehaus"] .tpl-ken, [data-template-id="tidehaus-preview"] .tpl-ken {
  animation: tidehaus-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="tidehaus"] .tpl-rise, [data-template-id="tidehaus-preview"] .tpl-rise {
  animation: tidehaus-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="tidehaus"] .tpl-rise-2, [data-template-id="tidehaus-preview"] .tpl-rise-2 {
  animation: tidehaus-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="tidehaus"] .tpl-rise-3, [data-template-id="tidehaus-preview"] .tpl-rise-3 {
  animation: tidehaus-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="tidehaus"] .tpl-marquee-track, [data-template-id="tidehaus-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: tidehaus-marquee 28s linear infinite;
}
[data-template-id="tidehaus"] .tpl-float, [data-template-id="tidehaus-preview"] .tpl-float {
  animation: tidehaus-float 5s ease-in-out infinite;
}
[data-template-id="tidehaus"] .tpl-sweep, [data-template-id="tidehaus-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="tidehaus"] .tpl-sweep::after, [data-template-id="tidehaus-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: tidehaus-sweep 4.5s ease-in-out infinite;
}
[data-template-id="tidehaus"] .tpl-climb, [data-template-id="tidehaus-preview"] .tpl-climb {
  animation: tidehaus-climb .85s cubic-bezier(.22,1,.36,1) both;
}

@keyframes tidehaus-tide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-12px); } }
@keyframes tidehaus-board-tilt { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
[data-template-id="tidehaus"] .tpl-tide-line, [data-template-id="tidehaus-preview"] .tpl-tide-line {
  animation: tidehaus-tide 4s ease-in-out infinite;
}
[data-template-id="tidehaus"] .tpl-board-rail, [data-template-id="tidehaus-preview"] .tpl-board-rail {
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}
[data-template-id="tidehaus"] .tpl-board-card, [data-template-id="tidehaus-preview"] .tpl-board-card {
  scroll-snap-align: center; flex: 0 0 min(280px, 80vw);
  animation: tidehaus-board-tilt 5s ease-in-out infinite;
}
`;
