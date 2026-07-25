export const bladehausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');

[data-template-id="bladehaus"],
[data-template-id="bladehaus-preview"] {
  --p: #E8E8E8;
  --s: #111111;
  --a: #C0A060;
  --bg: #111111;
  --surface: #1A1A1A;
  --text: #F2F2F2;
  --muted: #8A8A8A;
  --dark: #000000;
  font-family: "Barlow", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="bladehaus"] .t-display,
[data-template-id="bladehaus-preview"] .t-display {
  font-family: "Bebas Neue", serif;
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

[data-template-id="bladehaus"] .t-anim,
[data-template-id="bladehaus-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="bladehaus"] .t-d1,
[data-template-id="bladehaus-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="bladehaus"] .t-d2,
[data-template-id="bladehaus-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="bladehaus"] .t-ken,
[data-template-id="bladehaus-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="bladehaus"] .t-line,
[data-template-id="bladehaus-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="bladehaus"] .t-card,
[data-template-id="bladehaus-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="bladehaus"] .t-card:hover,
[data-template-id="bladehaus-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
