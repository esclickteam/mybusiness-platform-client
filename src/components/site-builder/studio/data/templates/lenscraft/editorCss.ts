export const lenscraftEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@400;500;600;700&display=swap');

[data-template-id="lenscraft"],
[data-template-id="lenscraft-preview"] {
  --p: #E11D48;
  --s: #0F0F10;
  --a: #FB7185;
  --bg: #0F0F10;
  --surface: #18181B;
  --text: #FAFAFA;
  --muted: #A1A1AA;
  --dark: #09090B;
  font-family: "Inter Tight", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="lenscraft"] .t-display,
[data-template-id="lenscraft-preview"] .t-display {
  font-family: "Space Grotesk", serif;
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

[data-template-id="lenscraft"] .t-anim,
[data-template-id="lenscraft-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="lenscraft"] .t-d1,
[data-template-id="lenscraft-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="lenscraft"] .t-d2,
[data-template-id="lenscraft-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="lenscraft"] .t-ken,
[data-template-id="lenscraft-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="lenscraft"] .t-line,
[data-template-id="lenscraft-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="lenscraft"] .t-card,
[data-template-id="lenscraft-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="lenscraft"] .t-card:hover,
[data-template-id="lenscraft-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
