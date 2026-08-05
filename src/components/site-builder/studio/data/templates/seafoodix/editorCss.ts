export const seafoodixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="seafoodix"], [data-template-id="seafoodix"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #04151c; --tpl-surface: #0a2430; --tpl-text: #e6f4f8;
  --tpl-muted: #7aa8b8; --tpl-primary: #38bdf8; --tpl-primary-text: #04151c;
  --tpl-line: rgba(230,244,248,0.12); --tpl-dark: #020b10;
}

[data-template-id="seafoodix"] .tpl-display,
[data-template-id="seafoodix"] .tpl-display {
  font-family: "Fraunces", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="seafoodix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes seafoodix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes seafoodix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="seafoodix"] .tpl-ken, [data-template-id="seafoodix"] .tpl-ken {
  animation: seafoodix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="seafoodix"] .tpl-rise, [data-template-id="seafoodix"] .tpl-rise {
  animation: seafoodix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="seafoodix"] .tpl-rise-2, [data-template-id="seafoodix"] .tpl-rise-2 {
  animation: seafoodix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="seafoodix"] .tpl-rise-3, [data-template-id="seafoodix"] .tpl-rise-3 {
  animation: seafoodix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes seafoodix-wave { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
[data-template-id="seafoodix"] .tpl-wave, [data-template-id="seafoodix"] .tpl-wave { animation: seafoodix-wave 14s linear infinite; }

`;
