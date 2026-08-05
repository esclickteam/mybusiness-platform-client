export const smokepitEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="smokepit"], [data-template-id="smokepit"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #120c08; --tpl-surface: #1c140e; --tpl-text: #f3e8d8;
  --tpl-muted: #a89078; --tpl-primary: #ea580c; --tpl-primary-text: #120c08;
  --tpl-line: rgba(243,232,216,0.12); --tpl-dark: #080604;
}

[data-template-id="smokepit"] .tpl-display,
[data-template-id="smokepit"] .tpl-display {
  font-family: "Bebas Neue", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="smokepit"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes smokepit-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes smokepit-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="smokepit"] .tpl-ken, [data-template-id="smokepit"] .tpl-ken {
  animation: smokepit-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="smokepit"] .tpl-rise, [data-template-id="smokepit"] .tpl-rise {
  animation: smokepit-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="smokepit"] .tpl-rise-2, [data-template-id="smokepit"] .tpl-rise-2 {
  animation: smokepit-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="smokepit"] .tpl-rise-3, [data-template-id="smokepit"] .tpl-rise-3 {
  animation: smokepit-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes smokepit-smoke { 0% { transform: translateY(0) scale(1); opacity:.5; } 100% { transform: translateY(-80vh) scale(1.8); opacity:0; } }
[data-template-id="smokepit"] .tpl-smoke, [data-template-id="smokepit"] .tpl-smoke { animation: smokepit-smoke 7s ease-out infinite; }

`;
