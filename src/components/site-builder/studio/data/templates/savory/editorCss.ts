export const savoryEditorCss = `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

[data-template-id^="savory"] {
  --s-primary: #E8A317;
  --s-secondary: #12100E;
  --s-accent: #F0C75E;
  --s-bg: #12100E;
  --s-surface: #1C1916;
  --s-surface-2: #24201B;
  --s-text: #F5F0E8;
  --s-muted: #A39E94;
  --s-dark: #0A0908;
  --s-line: rgba(245, 240, 232, 0.12);
  --s-line-strong: rgba(232, 163, 23, 0.36);
  --s-font-body: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --s-font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  background: var(--s-bg);
  color: var(--s-text);
  font-family: var(--s-font-body);
  text-rendering: geometricPrecision;
}

[data-template-id^="savory"] * {
  box-sizing: border-box;
}

[data-template-id^="savory"] .s-display {
  font-family: var(--s-font-display);
  letter-spacing: -0.035em;
}

[data-template-id^="savory"] .s-body {
  font-family: var(--s-font-body);
}

[data-template-id^="savory"] .s-latin {
  direction: ltr;
  unicode-bidi: isolate;
}

[data-template-id^="savory"] .s-section-kicker {
  color: var(--s-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

[data-template-id^="savory"] .s-fade-up {
  animation: savoryFadeUp 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id^="savory"] .s-delay-1 {
  animation-delay: 120ms;
}

[data-template-id^="savory"] .s-delay-2 {
  animation-delay: 240ms;
}

[data-template-id^="savory"] .s-delay-3 {
  animation-delay: 360ms;
}

[data-template-id^="savory"] .s-underline-grow {
  position: relative;
}

[data-template-id^="savory"] .s-underline-grow::after {
  background: var(--s-primary);
  bottom: -0.34rem;
  content: "";
  height: 1px;
  inset-inline-start: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  width: 100%;
}

[data-template-id^="savory"] .s-underline-grow:hover::after,
[data-template-id^="savory"] .s-underline-grow:focus-visible::after {
  transform: scaleX(1);
}

[data-template-id^="savory"] .s-image-scale {
  overflow: hidden;
}

[data-template-id^="savory"] .s-image-scale img {
  transform: scale(1.01);
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

[data-template-id^="savory"] .s-image-scale:hover img {
  filter: saturate(1.05);
  transform: scale(1.055);
}

[data-template-id^="savory"] .s-hero-image {
  animation: savoryHeroScale 1400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id^="savory"] .s-button-primary {
  background: var(--s-primary);
  color: var(--s-dark);
  font-weight: 800;
  transition: background 220ms ease, color 220ms ease, transform 220ms ease;
}

[data-template-id^="savory"] .s-button-primary:hover {
  background: var(--s-accent);
  transform: translateY(-1px);
}

[data-template-id^="savory"] .s-button-secondary {
  border: 1px solid rgba(245, 240, 232, 0.28);
  color: var(--s-text);
  font-weight: 700;
  transition: border-color 220ms ease, color 220ms ease, transform 220ms ease;
}

[data-template-id^="savory"] .s-button-secondary:hover {
  border-color: var(--s-primary);
  color: var(--s-primary);
  transform: translateY(-1px);
}

[data-template-id^="savory"] input,
[data-template-id^="savory"] textarea,
[data-template-id^="savory"] select {
  font-family: var(--s-font-body);
}

[data-template-id^="savory"] ::selection {
  background: rgba(232, 163, 23, 0.28);
  color: var(--s-text);
}

@keyframes savoryFadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes savoryHeroScale {
  from {
    opacity: 0.88;
    transform: scale(1.035);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id^="savory"] .s-fade-up,
  [data-template-id^="savory"] .s-hero-image {
    animation: none;
  }

  [data-template-id^="savory"] .s-image-scale img,
  [data-template-id^="savory"] .s-button-primary,
  [data-template-id^="savory"] .s-button-secondary,
  [data-template-id^="savory"] .s-underline-grow::after {
    transition: none;
  }
}`;
