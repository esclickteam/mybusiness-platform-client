export const burgerhausEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="burgerhaus"], [data-template-id="burgerhaus-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #111111; --tpl-surface: #1a1a1a; --tpl-text: #f5f5f5;
  --tpl-muted: #a3a3a3; --tpl-primary: #f59e0b; --tpl-primary-text: #111111;
  --tpl-line: rgba(245,245,245,0.12); --tpl-dark: #050505;
}

[data-template-id="burgerhaus"] .tpl-display,
[data-template-id="burgerhaus-preview"] .tpl-display {
  font-family: "Archivo Black", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="burgerhaus"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes burgerhaus-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes burgerhaus-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="burgerhaus"] .tpl-ken, [data-template-id="burgerhaus-preview"] .tpl-ken {
  animation: burgerhaus-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="burgerhaus"] .tpl-rise, [data-template-id="burgerhaus-preview"] .tpl-rise {
  animation: burgerhaus-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="burgerhaus"] .tpl-rise-2, [data-template-id="burgerhaus-preview"] .tpl-rise-2 {
  animation: burgerhaus-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="burgerhaus"] .tpl-rise-3, [data-template-id="burgerhaus-preview"] .tpl-rise-3 {
  animation: burgerhaus-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes burgerhaus-smash { from { opacity:0; transform: translateY(24px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
[data-template-id="burgerhaus"] .tpl-smash, [data-template-id="burgerhaus-preview"] .tpl-smash { animation: burgerhaus-smash .7s cubic-bezier(.22,1,.36,1) both; }

`;
