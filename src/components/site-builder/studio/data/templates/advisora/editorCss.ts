export const advisoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Sora:wght@400;500;600;700&display=swap');

[data-template-id="advisora"],
[data-template-id="advisora-preview"] {
  --p: #C9A227;
  --s: #0B1F3A;
  --a: #E6C65C;
  --bg: #0B1F3A;
  --surface: #132B4D;
  --text: #F4F1E8;
  --muted: #A8B3C4;
  --dark: #071428;
  font-family: "Sora", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="advisora"] .t-display,
[data-template-id="advisora-preview"] .t-display {
  font-family: "Fraunces", serif;
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

[data-template-id="advisora"] .t-anim,
[data-template-id="advisora-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="advisora"] .t-d1,
[data-template-id="advisora-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="advisora"] .t-d2,
[data-template-id="advisora-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="advisora"] .t-ken,
[data-template-id="advisora-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="advisora"] .t-line,
[data-template-id="advisora-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="advisora"] .t-card,
[data-template-id="advisora-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="advisora"] .t-card:hover,
[data-template-id="advisora-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
