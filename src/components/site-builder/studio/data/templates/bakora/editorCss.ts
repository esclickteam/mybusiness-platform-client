export const bakoraEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="bakora"], [data-template-id="bakora"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #faf6f0; --tpl-surface: #fffaf3; --tpl-text: #2a1f18;
  --tpl-muted: #8a6f5c; --tpl-primary: #c4784a; --tpl-primary-text: #fffaf3;
  --tpl-line: rgba(42,31,24,0.12); --tpl-dark: #1c140f;
}

[data-template-id="bakora"] .tpl-display,
[data-template-id="bakora"] .tpl-display {
  font-family: "Libre Baskerville", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="bakora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes bakora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes bakora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="bakora"] .tpl-ken, [data-template-id="bakora"] .tpl-ken {
  animation: bakora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="bakora"] .tpl-rise, [data-template-id="bakora"] .tpl-rise {
  animation: bakora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="bakora"] .tpl-rise-2, [data-template-id="bakora"] .tpl-rise-2 {
  animation: bakora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="bakora"] .tpl-rise-3, [data-template-id="bakora"] .tpl-rise-3 {
  animation: bakora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes bakora-lam { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes bakora-flour { 0% { transform: translateY(-5%); opacity:.7; } 100% { transform: translateY(110vh); opacity:.1; } }
[data-template-id="bakora"] .tpl-lam-layer, [data-template-id="bakora"] .tpl-lam-layer { animation: bakora-lam 5s ease-in-out infinite; }
[data-template-id="bakora"] .tpl-flour, [data-template-id="bakora"] .tpl-flour { animation: bakora-flour var(--flour-dur, 8s) linear infinite; }

`;
