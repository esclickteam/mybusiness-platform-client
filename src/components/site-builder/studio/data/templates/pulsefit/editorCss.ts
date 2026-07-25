export const pulsefitEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

[data-template-id="pulsefit"],
[data-template-id="pulsefit-preview"] {
  --p: #C8FF3D;
  --s: #121212;
  --a: #E0FF7A;
  --bg: #121212;
  --surface: #1C1C1C;
  --text: #F4F4F4;
  --muted: #9A9A9A;
  --dark: #0A0A0A;
  font-family: "IBM Plex Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="pulsefit"] .t-display,
[data-template-id="pulsefit-preview"] .t-display {
  font-family: "Oswald", serif;
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

[data-template-id="pulsefit"] .t-anim,
[data-template-id="pulsefit-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="pulsefit"] .t-d1,
[data-template-id="pulsefit-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="pulsefit"] .t-d2,
[data-template-id="pulsefit-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="pulsefit"] .t-ken,
[data-template-id="pulsefit-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="pulsefit"] .t-line,
[data-template-id="pulsefit-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="pulsefit"] .t-card,
[data-template-id="pulsefit-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="pulsefit"] .t-card:hover,
[data-template-id="pulsefit-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
