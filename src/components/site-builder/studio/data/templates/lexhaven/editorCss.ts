export const lexhavenEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Karla:wght@400;500;600;700&display=swap');

[data-template-id="lexhaven"],
[data-template-id="lexhaven-preview"] {
  --p: #7A1F2B;
  --s: #F7F3EE;
  --a: #A33A48;
  --bg: #F7F3EE;
  --surface: #FFFFFF;
  --text: #1C1412;
  --muted: #6E625C;
  --dark: #2A1518;
  font-family: "Karla", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lexhaven"] .t-display,
[data-template-id="lexhaven-preview"] .t-display {
  font-family: "Libre Baskerville", serif;
}

@keyframes t-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes t-scale {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}
@keyframes t-line {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

[data-template-id="lexhaven"] .t-anim,
[data-template-id="lexhaven-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="lexhaven"] .t-d1,
[data-template-id="lexhaven-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="lexhaven"] .t-d2,
[data-template-id="lexhaven-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="lexhaven"] .t-ken,
[data-template-id="lexhaven-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="lexhaven"] .t-line,
[data-template-id="lexhaven-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="lexhaven"] .t-card,
[data-template-id="lexhaven-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="lexhaven"] .t-card:hover,
[data-template-id="lexhaven-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
