export const glinticaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Infant:wght@500;600;700&family=Mulish:wght@400;500;600;700&display=swap');

[data-template-id="glintica"],
[data-template-id="glintica-preview"] {
  --p: #D4A0A7;
  --s: #1F1A1C;
  --a: #E8C4C8;
  --bg: #1F1A1C;
  --surface: #2A2326;
  --text: #F8F1F2;
  --muted: #B5A6A9;
  --dark: #120E10;
  font-family: "Mulish", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="glintica"] .t-display,
[data-template-id="glintica-preview"] .t-display {
  font-family: "Cormorant Infant", serif;
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

[data-template-id="glintica"] .t-anim,
[data-template-id="glintica-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="glintica"] .t-d1,
[data-template-id="glintica-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="glintica"] .t-d2,
[data-template-id="glintica-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="glintica"] .t-ken,
[data-template-id="glintica-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="glintica"] .t-line,
[data-template-id="glintica-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="glintica"] .t-card,
[data-template-id="glintica-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="glintica"] .t-card:hover,
[data-template-id="glintica-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
