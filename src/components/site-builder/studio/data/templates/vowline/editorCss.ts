export const vowlineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@300;400;500;600;700&display=swap');

[data-template-id="vowline"],
[data-template-id="vowline-preview"] {
  --p: #5B7C99;
  --s: #F8F4F0;
  --a: #8FA9C0;
  --bg: #F8F4F0;
  --surface: #FFFFFF;
  --text: #243040;
  --muted: #7A8490;
  --dark: #1A2430;
  font-family: "Outfit", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="vowline"] .t-display,
[data-template-id="vowline-preview"] .t-display {
  font-family: "Great Vibes", serif;
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

[data-template-id="vowline"] .t-anim,
[data-template-id="vowline-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="vowline"] .t-d1,
[data-template-id="vowline-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="vowline"] .t-d2,
[data-template-id="vowline-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="vowline"] .t-ken,
[data-template-id="vowline-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="vowline"] .t-line,
[data-template-id="vowline-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="vowline"] .t-card,
[data-template-id="vowline-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="vowline"] .t-card:hover,
[data-template-id="vowline-preview"] .t-card:hover {
  transform: translateY(-4px);
}
`;
