export const tacoflareEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="tacoflare"], [data-template-id="tacoflare-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a0e0a; --tpl-surface: #251610; --tpl-text: #fff3e8;
  --tpl-muted: #c49a7a; --tpl-primary: #e85d04; --tpl-primary-text: #1a0e0a;
  --tpl-line: rgba(255,243,232,0.12); --tpl-dark: #0d0705;
}

[data-template-id="tacoflare"] .tpl-display,
[data-template-id="tacoflare-preview"] .tpl-display {
  font-family: "Oswald", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="tacoflare"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes tacoflare-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes tacoflare-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="tacoflare"] .tpl-ken, [data-template-id="tacoflare-preview"] .tpl-ken {
  animation: tacoflare-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="tacoflare"] .tpl-rise, [data-template-id="tacoflare-preview"] .tpl-rise {
  animation: tacoflare-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="tacoflare"] .tpl-rise-2, [data-template-id="tacoflare-preview"] .tpl-rise-2 {
  animation: tacoflare-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="tacoflare"] .tpl-rise-3, [data-template-id="tacoflare-preview"] .tpl-rise-3 {
  animation: tacoflare-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes tacoflare-papel { 0%,100% { transform: rotate(var(--rot, -2deg)) translateY(0); } 50% { transform: rotate(calc(var(--rot, -2deg) + 3deg)) translateY(-8px); } }
[data-template-id="tacoflare"] .tpl-papel, [data-template-id="tacoflare-preview"] .tpl-papel { animation: tacoflare-papel 4.5s ease-in-out infinite; }

`;
