export const homaraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@600;700;800&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="homara"], [data-template-id="homara-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f3f0e8; --tpl-surface: #ebe6da; --tpl-text: #243028;
  --tpl-muted: #6d7568; --tpl-primary: #3f6f5a; --tpl-primary-text: #f3f0e8;
  --tpl-line: rgba(36,48,40,0.14); --tpl-dark: #1a221c;
}

[data-template-id="homara"] .tpl-display,
[data-template-id="homara-preview"] .tpl-display {
  font-family: "Assistant", "Heebo", sans-serif;
}

[data-template-id="homara"] input::placeholder,
[data-template-id="homara"] textarea::placeholder,
[data-template-id="homara-preview"] input::placeholder,
[data-template-id="homara-preview"] textarea::placeholder {
  color: rgba(36,48,40,.48);
}

[data-visual-template-canvas="true"] [data-template-id="homara"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes homara-ken { 0% { transform: scale(1); } 100% { transform: scale(1.07); } }
@keyframes homara-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes homara-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes homara-marquee { from { transform: translateX(0); } to { transform: translateX(50%); } }
@keyframes homara-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes homara-pulse { 0%,100% { opacity: .38; } 50% { opacity: 1; } }
@keyframes homara-sweep { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }

[data-template-id="homara"] .tpl-ken, [data-template-id="homara-preview"] .tpl-ken {
  animation: homara-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="homara"] .tpl-rise, [data-template-id="homara-preview"] .tpl-rise {
  animation: homara-rise .85s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="homara"] .tpl-rise-2, [data-template-id="homara-preview"] .tpl-rise-2 {
  animation: homara-rise .85s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="homara"] .tpl-rise-3, [data-template-id="homara-preview"] .tpl-rise-3 {
  animation: homara-rise .85s cubic-bezier(.22,1,.36,1) .24s both;
}
[data-template-id="homara"] .tpl-draw, [data-template-id="homara-preview"] .tpl-draw {
  transform-origin: right center;
  animation: homara-draw 1s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="homara"] .tpl-marquee-track, [data-template-id="homara-preview"] .tpl-marquee-track {
  display: flex; width: max-content; animation: homara-marquee 30s linear infinite;
}
[data-template-id="homara"] .tpl-float, [data-template-id="homara-preview"] .tpl-float {
  animation: homara-float 5.4s ease-in-out infinite;
}
[data-template-id="homara"] .tpl-pulse-line, [data-template-id="homara-preview"] .tpl-pulse-line {
  animation: homara-pulse 2.4s ease-in-out infinite;
}
[data-template-id="homara"] .tpl-sweep, [data-template-id="homara-preview"] .tpl-sweep { position: relative; overflow: hidden; }
[data-template-id="homara"] .tpl-sweep::after, [data-template-id="homara-preview"] .tpl-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 36%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
  animation: homara-sweep 4.4s ease-in-out infinite;
}
`;
