export const markoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&display=swap');

[data-template-id="markora"],
[data-template-id="markora-preview"] {
  --p: #FF2D55;
  --s: #0A0A0B;
  --a: #FF6B8A;
  --bg: #0A0A0B;
  --surface: #141416;
  --text: #F7F7F8;
  --muted: #9B9BA3;
  --dark: #050505;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="markora"] .t-display,
[data-template-id="markora-preview"] .t-display {
  font-family: "Syne", serif;
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

[data-template-id="markora"] .t-anim,
[data-template-id="markora-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="markora"] .t-d1,
[data-template-id="markora-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="markora"] .t-d2,
[data-template-id="markora-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="markora"] .t-ken,
[data-template-id="markora-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="markora"] .t-line,
[data-template-id="markora-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="markora"] .t-card,
[data-template-id="markora-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="markora"] .t-card:hover,
[data-template-id="markora-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
