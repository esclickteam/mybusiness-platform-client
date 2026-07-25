export const gelatixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="gelatix"], [data-template-id="gelatix-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #fff5f8; --tpl-surface: #ffffff; --tpl-text: #2b1822;
  --tpl-muted: #9a6b7c; --tpl-primary: #e85a8c; --tpl-primary-text: #ffffff;
  --tpl-line: rgba(43,24,34,0.1); --tpl-dark: #1a0f14;
}

[data-template-id="gelatix"] .tpl-display,
[data-template-id="gelatix-preview"] .tpl-display {
  font-family: "Cormorant Garamond", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="gelatix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes gelatix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes gelatix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="gelatix"] .tpl-ken, [data-template-id="gelatix-preview"] .tpl-ken {
  animation: gelatix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="gelatix"] .tpl-rise, [data-template-id="gelatix-preview"] .tpl-rise {
  animation: gelatix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="gelatix"] .tpl-rise-2, [data-template-id="gelatix-preview"] .tpl-rise-2 {
  animation: gelatix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="gelatix"] .tpl-rise-3, [data-template-id="gelatix-preview"] .tpl-rise-3 {
  animation: gelatix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes gelatix-drip { 0% { transform: translateY(-10%) scaleY(.6); opacity:.8; } 100% { transform: translateY(40px) scaleY(1.2); opacity:.2; } }
@keyframes gelatix-scoop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
[data-template-id="gelatix"] .tpl-drip, [data-template-id="gelatix-preview"] .tpl-drip { animation: gelatix-drip 3.2s ease-in infinite; }
[data-template-id="gelatix"] .tpl-scoop, [data-template-id="gelatix-preview"] .tpl-scoop { animation: gelatix-scoop 4s ease-in-out infinite; }

`;
