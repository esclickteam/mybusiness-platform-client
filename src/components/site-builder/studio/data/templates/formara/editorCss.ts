export const formaraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Manrope:wght@400;500;600;700;800&display=swap');

[data-template-id="formara"],
[data-template-id="formara-preview"] {
  --p: #8B5E3C;
  --s: #1E1C1A;
  --a: #C4A484;
  --bg: #1E1C1A;
  --surface: #2A2623;
  --text: #F3EEE7;
  --muted: #B6AAA0;
  --dark: #12100E;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="formara"] *,
[data-template-id="formara-preview"] * {
  border-radius: 0 !important;
}

[data-template-id="formara"] .t-display,
[data-template-id="formara-preview"] .t-display {
  font-family: "Instrument Serif", serif;
  font-weight: 400;
  letter-spacing: -0.035em;
}

@keyframes formara-hero-zoom {
  from { transform: scale(1.1); }
  to { transform: scale(1); }
}

@keyframes formara-bar-rise {
  from { opacity: 0; transform: translateY(36px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes formara-copy-in {
  from { opacity: 0; transform: translateX(28px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes formara-clay-pulse {
  0%, 100% { box-shadow: inset 0 0 0 1px rgba(139, 94, 60, 0.24); }
  50% { box-shadow: inset 0 0 0 1px rgba(139, 94, 60, 0.58); }
}

[data-template-id="formara"] .t-hero-zoom,
[data-template-id="formara-preview"] .t-hero-zoom {
  animation: formara-hero-zoom 18s ease-out both;
}

[data-template-id="formara"] .t-hero-bar,
[data-template-id="formara-preview"] .t-hero-bar {
  animation: formara-bar-rise .9s .1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="formara"] .t-hero-copy,
[data-template-id="formara-preview"] .t-hero-copy {
  animation: formara-copy-in .9s .28s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="formara"] .t-material-card,
[data-template-id="formara-preview"] .t-material-card {
  transition: transform .45s ease, border-color .35s ease, background .35s ease;
}

[data-template-id="formara"] .t-material-card:hover,
[data-template-id="formara-preview"] .t-material-card:hover {
  border-color: rgba(139, 94, 60, .72);
  transform: translateY(-6px);
  animation: formara-clay-pulse 1.8s ease-in-out infinite;
}

[data-template-id="formara"] input,
[data-template-id="formara"] textarea,
[data-template-id="formara-preview"] input,
[data-template-id="formara-preview"] textarea {
  font-family: "Manrope", sans-serif;
}
`;
