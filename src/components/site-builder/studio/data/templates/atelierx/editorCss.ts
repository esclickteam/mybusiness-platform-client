export const atelierxEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

[data-template-id="atelierx"],
[data-template-id="atelierx-preview"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #111111;
  --a: #E11D48;
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --text: #111111;
  --muted: #737373;
  --dark: #0A0A0A;
  font-family: "Inter Tight", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="atelierx"] *,
[data-template-id="atelierx-preview"] * {
  scroll-behavior: smooth;
}

[data-template-id="atelierx"] article,
[data-template-id="atelierx"] form,
[data-template-id="atelierx"] input,
[data-template-id="atelierx"] textarea,
[data-template-id="atelierx"] button,
[data-template-id="atelierx"] img,
[data-template-id="atelierx"] a,
[data-template-id="atelierx-preview"] article,
[data-template-id="atelierx-preview"] form,
[data-template-id="atelierx-preview"] input,
[data-template-id="atelierx-preview"] textarea,
[data-template-id="atelierx-preview"] button,
[data-template-id="atelierx-preview"] img,
[data-template-id="atelierx-preview"] a {
  border-radius: 0;
}

[data-template-id="atelierx"] .t-display,
[data-template-id="atelierx-preview"] .t-display {
  font-family: "Playfair Display", serif;
}

@keyframes atelierx-hero-zoom {
  from { transform: scale(1.12); filter: grayscale(1); }
  to { transform: scale(1); filter: grayscale(.1); }
}

@keyframes atelierx-title-in {
  from { opacity: 0; transform: translateY(34px); letter-spacing: -.02em; }
  to { opacity: 1; transform: translateY(0); letter-spacing: -.08em; }
}

@keyframes atelierx-rule-grow {
  from { transform: scaleX(0); transform-origin: right; }
  to { transform: scaleX(1); transform-origin: right; }
}

@keyframes atelierx-film-drift {
  0% { transform: translateX(0); }
  50% { transform: translateX(32px); }
  100% { transform: translateX(0); }
}

@keyframes atelierx-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

[data-template-id="atelierx"] .atelierx-hero-image,
[data-template-id="atelierx-preview"] .atelierx-hero-image {
  animation: atelierx-hero-zoom 14s ease-out both;
}

[data-template-id="atelierx"] .atelierx-title,
[data-template-id="atelierx-preview"] .atelierx-title {
  animation: atelierx-title-in 1s .1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="atelierx"] .atelierx-red-rule,
[data-template-id="atelierx-preview"] .atelierx-red-rule {
  animation: atelierx-rule-grow .95s .55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="atelierx"] .atelierx-film-track,
[data-template-id="atelierx-preview"] .atelierx-film-track {
  animation: atelierx-film-drift 5.5s ease-in-out infinite;
}

[data-template-id="atelierx"] .atelierx-marquee-track,
[data-template-id="atelierx-preview"] .atelierx-marquee-track {
  animation: atelierx-marquee 22s linear infinite;
}

[data-template-id="atelierx"] input,
[data-template-id="atelierx"] textarea,
[data-template-id="atelierx-preview"] input,
[data-template-id="atelierx-preview"] textarea {
  font-family: "Inter Tight", sans-serif;
}

[data-template-id="atelierx"] .text-center,
[data-template-id="atelierx-preview"] .text-center {
  text-align: center;
}
`;
