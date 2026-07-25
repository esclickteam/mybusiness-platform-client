export const formaraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Manrope:wght@400;500;600;700&display=swap');

[data-template-id="formara"],
[data-template-id="formara-preview"] {
  --p: #8B5E3C;
  --s: #1E1C1A;
  --a: #C4A484;
  --bg: #1E1C1A;
  --surface: #2A2623;
  --text: #F3EEE7;
  --muted: #A39A90;
  --dark: #12100E;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="formara"] .t-display,
[data-template-id="formara-preview"] .t-display {
  font-family: "Instrument Serif", serif;
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

[data-template-id="formara"] .t-anim,
[data-template-id="formara-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="formara"] .t-d1,
[data-template-id="formara-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="formara"] .t-d2,
[data-template-id="formara-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="formara"] .t-ken,
[data-template-id="formara-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="formara"] .t-line,
[data-template-id="formara-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="formara"] .t-card,
[data-template-id="formara-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="formara"] .t-card:hover,
[data-template-id="formara-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
