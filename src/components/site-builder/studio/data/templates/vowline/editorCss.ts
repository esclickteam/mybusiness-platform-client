export const vowlineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@300;400;500;600;700;800&display=swap');

[data-template-id="vowline"],
[data-template-id="vowline-preview"] {
  --p: #5B7C99;
  --s: #F8F4F0;
  --a: #AFC0D0;
  --bg: #F8F4F0;
  --surface: #FFFFFF;
  --text: #243040;
  --muted: #7A8490;
  --dark: #1A2430;
  font-family: "Outfit", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="vowline"] article,
[data-template-id="vowline"] form,
[data-template-id="vowline"] input,
[data-template-id="vowline"] textarea,
[data-template-id="vowline"] button,
[data-template-id="vowline-preview"] article,
[data-template-id="vowline-preview"] form,
[data-template-id="vowline-preview"] input,
[data-template-id="vowline-preview"] textarea,
[data-template-id="vowline-preview"] button {
  border-radius: 0;
}

[data-template-id="vowline"] .t-script,
[data-template-id="vowline-preview"] .t-script {
  font-family: "Great Vibes", cursive;
  font-weight: 400;
}

@keyframes vowline-romance-zoom {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}

@keyframes vowline-script-arrive {
  from { opacity: 0; transform: translateY(18px) scale(.94); letter-spacing: .05em; }
  to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: 0; }
}

@keyframes vowline-headline-arrive {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes vowline-kicker-in {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes vowline-line-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(91, 124, 153, 0); }
  50% { box-shadow: 0 0 24px rgba(91, 124, 153, .18); }
}

[data-template-id="vowline"] .t-romance-zoom,
[data-template-id="vowline-preview"] .t-romance-zoom {
  animation: vowline-romance-zoom 18s ease-out both;
}

[data-template-id="vowline"] .t-hero-kicker,
[data-template-id="vowline-preview"] .t-hero-kicker {
  animation: vowline-kicker-in .8s .1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="vowline"] .t-script-arrive,
[data-template-id="vowline-preview"] .t-script-arrive {
  animation: vowline-script-arrive 1.1s .18s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="vowline"] .t-headline-arrive,
[data-template-id="vowline-preview"] .t-headline-arrive {
  animation: vowline-headline-arrive .9s .42s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="vowline"] .t-soft-card,
[data-template-id="vowline-preview"] .t-soft-card {
  transition: transform .45s ease, box-shadow .45s ease;
}

[data-template-id="vowline"] .t-soft-card:hover,
[data-template-id="vowline-preview"] .t-soft-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 70px rgba(91, 124, 153, .18);
}

[data-template-id="vowline"] .t-step-circle,
[data-template-id="vowline-preview"] .t-step-circle {
  border-radius: 9999px !important;
  animation: vowline-line-glow 2.8s ease-in-out infinite;
}

[data-template-id="vowline"] input,
[data-template-id="vowline"] textarea,
[data-template-id="vowline-preview"] input,
[data-template-id="vowline-preview"] textarea {
  font-family: "Outfit", sans-serif;
}
`;
