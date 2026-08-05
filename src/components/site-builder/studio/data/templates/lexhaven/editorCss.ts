export const lexhavenEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Karla:wght@400;500;600;700;800&display=swap');

[data-template-id="lexhaven"],
[data-template-id="lexhaven"] {
  --p: #7A1F2B;
  --s: #F7F3EE;
  --a: #9F3341;
  --bg: #F7F3EE;
  --surface: #FFFDFC;
  --text: #211615;
  --muted: #6D615B;
  --dark: #2A1518;
  font-family: "Karla", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lexhaven"] *,
[data-template-id="lexhaven"] * {
  border-radius: 0 !important;
}

[data-template-id="lexhaven"] .t-display,
[data-template-id="lexhaven"] .t-display {
  font-family: "Libre Baskerville", serif;
}

[data-template-id="lexhaven"] a,
[data-template-id="lexhaven"] a,
[data-template-id="lexhaven"] button,
[data-template-id="lexhaven"] button {
  transition: background .25s ease, color .25s ease, border-color .25s ease, transform .25s ease;
}

[data-template-id="lexhaven"] button:hover,
[data-template-id="lexhaven"] button:hover,
[data-template-id="lexhaven"] a:hover,
[data-template-id="lexhaven"] a:hover {
  transform: translateY(-2px);
}

[data-template-id="lexhaven"] .lexhaven-practice-row,
[data-template-id="lexhaven"] .lexhaven-practice-row {
  transition: background .35s ease, padding-inline .35s ease;
}

[data-template-id="lexhaven"] .lexhaven-practice-row:hover,
[data-template-id="lexhaven"] .lexhaven-practice-row:hover {
  background: rgba(122, 31, 43, 0.06);
  padding-inline: 1.25rem;
}

[data-template-id="lexhaven"] .lexhaven-process-track::before,
[data-template-id="lexhaven"] .lexhaven-process-track::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 2rem;
  height: 2px;
  background: var(--p);
  transform-origin: right center;
  animation: lexhaven-line 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes lexhaven-line {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (max-width: 767px) {
  [data-template-id="lexhaven"] .lexhaven-process-track::before,
  [data-template-id="lexhaven"] .lexhaven-process-track::before {
    inset-inline: auto;
    right: 2rem;
    top: 0;
    bottom: 0;
    width: 2px;
    height: auto;
    transform-origin: top center;
    animation-name: lexhaven-line-y;
  }
}

@keyframes lexhaven-line-y {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

[data-template-id="lexhaven"] input,
[data-template-id="lexhaven"] input,
[data-template-id="lexhaven"] textarea,
[data-template-id="lexhaven"] textarea {
  font-family: "Karla", sans-serif;
}
`;
