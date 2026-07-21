export const parcelEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@600;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="parcel"], [data-template-id="parcel-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #efe9da; --tpl-surface: #e4dcc8; --tpl-text: #243018;
  --tpl-muted: #6e684f; --tpl-primary: #6b5a2e; --tpl-primary-text: #efe9da;
  --tpl-line: rgba(36,48,24,0.16); --tpl-dark: #16140c;
}

[data-template-id="parcel"] .tpl-display,
[data-template-id="parcel-preview"] .tpl-display {
  font-family: "IBM Plex Sans Hebrew", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="parcel"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes parcel-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes parcel-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes parcel-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes parcel-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes parcel-pulse-line { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes parcel-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes parcel-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
@keyframes parcel-climb { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

[data-template-id="parcel"] .tpl-ken, [data-template-id="parcel-preview"] .tpl-ken {
  animation: parcel-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="parcel"] .tpl-rise, [data-template-id="parcel-preview"] .tpl-rise {
  animation: parcel-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="parcel"] .tpl-rise-2, [data-template-id="parcel-preview"] .tpl-rise-2 {
  animation: parcel-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="parcel"] .tpl-rise-3, [data-template-id="parcel-preview"] .tpl-rise-3 {
  animation: parcel-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="parcel"] .tpl-draw, [data-template-id="parcel-preview"] .tpl-draw {
  transform-origin: right center;
  animation: parcel-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}
[data-template-id="parcel"] .tpl-marquee-track, [data-template-id="parcel-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: parcel-marquee 28s linear infinite;
}
[data-template-id="parcel"] .tpl-pulse-line, [data-template-id="parcel-preview"] .tpl-pulse-line {
  animation: parcel-pulse-line 2.4s ease-in-out infinite;
}
[data-template-id="parcel"] .tpl-float, [data-template-id="parcel-preview"] .tpl-float {
  animation: parcel-float 5s ease-in-out infinite;
}
[data-template-id="parcel"] .tpl-sweep, [data-template-id="parcel-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="parcel"] .tpl-sweep::after, [data-template-id="parcel-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: parcel-sweep 4.5s ease-in-out infinite;
}
[data-template-id="parcel"] .tpl-climb, [data-template-id="parcel-preview"] .tpl-climb {
  animation: parcel-climb .85s cubic-bezier(.22,1,.36,1) both;
}
`;
