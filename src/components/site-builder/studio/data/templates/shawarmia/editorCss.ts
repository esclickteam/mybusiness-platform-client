export const shawarmiaEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@600;800&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="shawarmia"], [data-template-id="shawarmia-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #14110e; --tpl-surface: #1e1914; --tpl-text: #f5ebe0;
  --tpl-muted: #b9a08a; --tpl-primary: #d97706; --tpl-primary-text: #14110e;
  --tpl-line: rgba(245,235,224,0.12); --tpl-dark: #0a0806;
}

[data-template-id="shawarmia"] .tpl-display,
[data-template-id="shawarmia-preview"] .tpl-display {
  font-family: "Rubik", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="shawarmia"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes shawarmia-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes shawarmia-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="shawarmia"] .tpl-ken, [data-template-id="shawarmia-preview"] .tpl-ken {
  animation: shawarmia-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="shawarmia"] .tpl-rise, [data-template-id="shawarmia-preview"] .tpl-rise {
  animation: shawarmia-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="shawarmia"] .tpl-rise-2, [data-template-id="shawarmia-preview"] .tpl-rise-2 {
  animation: shawarmia-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="shawarmia"] .tpl-rise-3, [data-template-id="shawarmia-preview"] .tpl-rise-3 {
  animation: shawarmia-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes shawarmia-spit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
[data-template-id="shawarmia"] .tpl-spit, [data-template-id="shawarmia-preview"] .tpl-spit { animation: shawarmia-spit 18s linear infinite; transform-origin: center top; }

`;
