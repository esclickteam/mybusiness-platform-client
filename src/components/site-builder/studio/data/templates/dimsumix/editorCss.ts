export const dimsumixEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="dimsumix"], [data-template-id="dimsumix"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #0f1412; --tpl-surface: #18201c; --tpl-text: #f0f5f2;
  --tpl-muted: #8aa89a; --tpl-primary: #86efac; --tpl-primary-text: #0f1412;
  --tpl-line: rgba(240,245,242,0.12); --tpl-dark: #080b09;
}

[data-template-id="dimsumix"] .tpl-display,
[data-template-id="dimsumix"] .tpl-display {
  font-family: "Noto Serif SC", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="dimsumix"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes dimsumix-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes dimsumix-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="dimsumix"] .tpl-ken, [data-template-id="dimsumix"] .tpl-ken {
  animation: dimsumix-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="dimsumix"] .tpl-rise, [data-template-id="dimsumix"] .tpl-rise {
  animation: dimsumix-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="dimsumix"] .tpl-rise-2, [data-template-id="dimsumix"] .tpl-rise-2 {
  animation: dimsumix-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="dimsumix"] .tpl-rise-3, [data-template-id="dimsumix"] .tpl-rise-3 {
  animation: dimsumix-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes dimsumix-steam { 0% { transform: translateY(0) scaleX(1); opacity:.5; } 100% { transform: translateY(-70vh) scaleX(1.5); opacity:0; } }
@keyframes dimsumix-basket { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
[data-template-id="dimsumix"] .tpl-steam, [data-template-id="dimsumix"] .tpl-steam { animation: dimsumix-steam var(--steam-dur, 6s) ease-in infinite; }
[data-template-id="dimsumix"] .tpl-basket, [data-template-id="dimsumix"] .tpl-basket { animation: dimsumix-basket 4s ease-in-out infinite; }

`;
