export const dessertlabEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="dessertlab"], [data-template-id="dessertlab-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #1a1220; --tpl-surface: #241832; --tpl-text: #f8eef8;
  --tpl-muted: #b89bb8; --tpl-primary: #e879f9; --tpl-primary-text: #1a1220;
  --tpl-line: rgba(248,238,248,0.12); --tpl-dark: #0e0a14;
}

[data-template-id="dessertlab"] .tpl-display,
[data-template-id="dessertlab-preview"] .tpl-display {
  font-family: "Great Vibes", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="dessertlab"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes dessertlab-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes dessertlab-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="dessertlab"] .tpl-ken, [data-template-id="dessertlab-preview"] .tpl-ken {
  animation: dessertlab-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="dessertlab"] .tpl-rise, [data-template-id="dessertlab-preview"] .tpl-rise {
  animation: dessertlab-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="dessertlab"] .tpl-rise-2, [data-template-id="dessertlab-preview"] .tpl-rise-2 {
  animation: dessertlab-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="dessertlab"] .tpl-rise-3, [data-template-id="dessertlab-preview"] .tpl-rise-3 {
  animation: dessertlab-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes dessertlab-crystal { 0%,100% { filter: brightness(1); transform: scale(1); } 50% { filter: brightness(1.15); transform: scale(1.02); } }
[data-template-id="dessertlab"] .tpl-crystal, [data-template-id="dessertlab-preview"] .tpl-crystal { animation: dessertlab-crystal 3.5s ease-in-out infinite; }

`;
