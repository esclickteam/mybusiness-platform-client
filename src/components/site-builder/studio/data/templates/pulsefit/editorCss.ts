export const pulsefitEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap');

[data-template-id="pulsefit"],
[data-template-id="pulsefit"] {
  --p: #C8FF3D;
  --s: #121212;
  --a: #E0FF7A;
  --bg: #121212;
  --surface: #1C1C1C;
  --text: #F4F4F4;
  --muted: #9A9A9A;
  --dark: #050505;
  font-family: "IBM Plex Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="pulsefit"] *,
[data-template-id="pulsefit"] * {
  border-radius: 0 !important;
}

[data-template-id="pulsefit"] .t-display,
[data-template-id="pulsefit"] .t-display {
  font-family: "Oswald", sans-serif;
}

[data-template-id="pulsefit"] a,
[data-template-id="pulsefit"] a,
[data-template-id="pulsefit"] button,
[data-template-id="pulsefit"] button {
  transition: background .22s ease, color .22s ease, border-color .22s ease, transform .22s ease;
}

[data-template-id="pulsefit"] a:hover,
[data-template-id="pulsefit"] a:hover,
[data-template-id="pulsefit"] button:hover,
[data-template-id="pulsefit"] button:hover {
  transform: translateY(-2px);
}

[data-template-id="pulsefit"] .pulsefit-hero-image,
[data-template-id="pulsefit"] .pulsefit-hero-image {
  animation: pulsefit-zoom 18s ease-out both;
  filter: contrast(1.08) saturate(.95);
}

@keyframes pulsefit-zoom {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}

[data-template-id="pulsefit"] .pulsefit-slash,
[data-template-id="pulsefit"] .pulsefit-slash {
  transform: skewX(-14deg);
  box-shadow: 18px 0 0 rgba(200, 255, 61, 0.18);
}

[data-template-id="pulsefit"] .pulsefit-program-row,
[data-template-id="pulsefit"] .pulsefit-program-row {
  position: relative;
  overflow: hidden;
  transition: color .28s ease, transform .28s ease, border-color .28s ease;
}

[data-template-id="pulsefit"] .pulsefit-program-row::before,
[data-template-id="pulsefit"] .pulsefit-program-row::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--p);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform .34s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 0;
}

[data-template-id="pulsefit"] .pulsefit-program-row > *,
[data-template-id="pulsefit"] .pulsefit-program-row > * {
  position: relative;
  z-index: 1;
}

[data-template-id="pulsefit"] .pulsefit-program-row:hover,
[data-template-id="pulsefit"] .pulsefit-program-row:hover {
  color: #000;
  transform: translateX(-8px);
}

[data-template-id="pulsefit"] .pulsefit-program-row:hover::before,
[data-template-id="pulsefit"] .pulsefit-program-row:hover::before {
  transform: scaleX(1);
}

[data-template-id="pulsefit"] .pulsefit-program-row:hover h3,
[data-template-id="pulsefit"] .pulsefit-program-row:hover h3,
[data-template-id="pulsefit"] .pulsefit-program-row:hover p,
[data-template-id="pulsefit"] .pulsefit-program-row:hover p,
[data-template-id="pulsefit"] .pulsefit-program-row:hover span,
[data-template-id="pulsefit"] .pulsefit-program-row:hover span {
  color: #000 !important;
}

[data-template-id="pulsefit"] .pulsefit-method-panel,
[data-template-id="pulsefit"] .pulsefit-method-panel {
  transition: background .28s ease, transform .28s ease, border-color .28s ease;
}

[data-template-id="pulsefit"] .pulsefit-method-panel:hover,
[data-template-id="pulsefit"] .pulsefit-method-panel:hover {
  background: #232323;
  border-color: var(--p);
  transform: translateY(-8px);
}

[data-template-id="pulsefit"] input,
[data-template-id="pulsefit"] input,
[data-template-id="pulsefit"] textarea,
[data-template-id="pulsefit"] textarea {
  font-family: "IBM Plex Sans", sans-serif;
}

[data-template-id="pulsefit"] input::placeholder,
[data-template-id="pulsefit"] input::placeholder,
[data-template-id="pulsefit"] textarea::placeholder,
[data-template-id="pulsefit"] textarea::placeholder {
  color: rgba(244, 244, 244, 0.48);
}

@media (max-width: 1023px) {
  [data-template-id="pulsefit"] .pulsefit-method-panel,
  [data-template-id="pulsefit"] .pulsefit-method-panel {
    clip-path: none !important;
  }
}
`;
