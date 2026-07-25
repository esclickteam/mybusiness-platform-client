export const plantoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="plantora"], [data-template-id="plantora-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #f4f7f0; --tpl-surface: #ffffff; --tpl-text: #1a2e1a;
  --tpl-muted: #5c7a5c; --tpl-primary: #65a30d; --tpl-primary-text: #f4f7f0;
  --tpl-line: rgba(26,46,26,0.12); --tpl-dark: #0f1a0f;
}

[data-template-id="plantora"] .tpl-display,
[data-template-id="plantora-preview"] .tpl-display {
  font-family: "DM Serif Display", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="plantora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes plantora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes plantora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="plantora"] .tpl-ken, [data-template-id="plantora-preview"] .tpl-ken {
  animation: plantora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="plantora"] .tpl-rise, [data-template-id="plantora-preview"] .tpl-rise {
  animation: plantora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="plantora"] .tpl-rise-2, [data-template-id="plantora-preview"] .tpl-rise-2 {
  animation: plantora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="plantora"] .tpl-rise-3, [data-template-id="plantora-preview"] .tpl-rise-3 {
  animation: plantora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes plantora-root { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
[data-template-id="plantora"] .tpl-root, [data-template-id="plantora-preview"] .tpl-root { transform-origin: top; animation: plantora-root 1.4s cubic-bezier(.22,1,.36,1) both; }

`;
