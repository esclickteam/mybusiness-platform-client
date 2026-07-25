export const numerisEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,600;7..72,700&family=Figtree:wght@400;500;600;700&display=swap');

[data-template-id="numeris"],
[data-template-id="numeris-preview"] {
  --p: #0F6E56;
  --s: #F3F6F4;
  --a: #1D9B75;
  --bg: #F3F6F4;
  --surface: #FFFFFF;
  --text: #143028;
  --muted: #5E7268;
  --dark: #0B241C;
  font-family: "Figtree", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="numeris"] .t-display,
[data-template-id="numeris-preview"] .t-display {
  font-family: "Literata", serif;
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

[data-template-id="numeris"] .t-anim,
[data-template-id="numeris-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="numeris"] .t-d1,
[data-template-id="numeris-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="numeris"] .t-d2,
[data-template-id="numeris-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="numeris"] .t-ken,
[data-template-id="numeris-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="numeris"] .t-line,
[data-template-id="numeris-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="numeris"] .t-card,
[data-template-id="numeris-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="numeris"] .t-card:hover,
[data-template-id="numeris-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
