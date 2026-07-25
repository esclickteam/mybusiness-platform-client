export const juicepressEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="juicepress"], [data-template-id="juicepress-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #fffbeb; --tpl-surface: #ffffff; --tpl-text: #1c1917;
  --tpl-muted: #78716c; --tpl-primary: #f59e0b; --tpl-primary-text: #1c1917;
  --tpl-line: rgba(28,25,23,0.1); --tpl-dark: #0c0a09;
}

[data-template-id="juicepress"] .tpl-display,
[data-template-id="juicepress-preview"] .tpl-display {
  font-family: "Space Grotesk", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="juicepress"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes juicepress-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes juicepress-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="juicepress"] .tpl-ken, [data-template-id="juicepress-preview"] .tpl-ken {
  animation: juicepress-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="juicepress"] .tpl-rise, [data-template-id="juicepress-preview"] .tpl-rise {
  animation: juicepress-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="juicepress"] .tpl-rise-2, [data-template-id="juicepress-preview"] .tpl-rise-2 {
  animation: juicepress-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="juicepress"] .tpl-rise-3, [data-template-id="juicepress-preview"] .tpl-rise-3 {
  animation: juicepress-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes juicepress-burst { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(360deg) scale(1.05); } }
[data-template-id="juicepress"] .tpl-burst, [data-template-id="juicepress-preview"] .tpl-burst { animation: juicepress-burst 22s linear infinite; }

`;
