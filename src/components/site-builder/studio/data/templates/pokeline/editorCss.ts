export const pokelineEditorCss = `
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Heebo:wght@500;700&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="pokeline"], [data-template-id="pokeline-preview"] {
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: #071a1f; --tpl-surface: #0d262c; --tpl-text: #e8f7f6;
  --tpl-muted: #7eb8b4; --tpl-primary: #2dd4bf; --tpl-primary-text: #071a1f;
  --tpl-line: rgba(232,247,246,0.12); --tpl-dark: #031014;
}

[data-template-id="pokeline"] .tpl-display,
[data-template-id="pokeline-preview"] .tpl-display {
  font-family: "Sora", "Heebo", "Heebo", serif;
}

[data-visual-template-canvas="true"] [data-template-id="pokeline"] > header {
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}

@keyframes pokeline-ken { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
@keyframes pokeline-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

[data-template-id="pokeline"] .tpl-ken, [data-template-id="pokeline-preview"] .tpl-ken {
  animation: pokeline-ken 18s ease-in-out infinite alternate; transform-origin: center;
}
[data-template-id="pokeline"] .tpl-rise, [data-template-id="pokeline-preview"] .tpl-rise {
  animation: pokeline-rise .9s cubic-bezier(.22,1,.36,1) both;
}
[data-template-id="pokeline"] .tpl-rise-2, [data-template-id="pokeline-preview"] .tpl-rise-2 {
  animation: pokeline-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}
[data-template-id="pokeline"] .tpl-rise-3, [data-template-id="pokeline-preview"] .tpl-rise-3 {
  animation: pokeline-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}

@keyframes pokeline-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
[data-template-id="pokeline"] .tpl-orbit, [data-template-id="pokeline-preview"] .tpl-orbit { animation: pokeline-orbit 36s linear infinite; }

`;
