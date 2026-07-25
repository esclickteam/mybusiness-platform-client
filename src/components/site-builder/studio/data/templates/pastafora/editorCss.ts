export const pastaforaEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="pastafora"], [data-template-id="pastafora-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #faf7f2; --tpl-surface: #ffffff; --tpl-text: #2c1810;
  --tpl-muted: #8b6b5a; --tpl-primary: #b91c1c; --tpl-primary-text: #faf7f2;
  --tpl-line: rgba(44,24,16,0.12); --tpl-dark: #1a0e0a;
}

[data-template-id="pastafora"] .tpl-display,
[data-template-id="pastafora-preview"] .tpl-display {
  font-family: "Playfair Display", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="pastafora"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes pastafora-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes pastafora-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="pastafora"] .tpl-ken, [data-template-id="pastafora-preview"] .tpl-ken {
  animation: pastafora-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="pastafora"] .tpl-rise, [data-template-id="pastafora-preview"] .tpl-rise {
  animation: pastafora-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="pastafora"] .tpl-rise-2, [data-template-id="pastafora-preview"] .tpl-rise-2 {
  animation: pastafora-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="pastafora"] .tpl-rise-3, [data-template-id="pastafora-preview"] .tpl-rise-3 {
  animation: pastafora-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes pastafora-swirl { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
[data-template-id="pastafora"] .tpl-swirl, [data-template-id="pastafora-preview"] .tpl-swirl { animation: pastafora-swirl 28s linear infinite; }

`;
