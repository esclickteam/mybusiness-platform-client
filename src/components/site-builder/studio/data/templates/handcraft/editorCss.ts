export const handcraftEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600;700;800&display=swap');

[data-template-id="handcraft"],
[data-template-id="handcraft-preview"] {
  --h-primary: #C56A3A;
  --h-secondary: #2B2F33;
  --h-accent: #D4895A;
  --h-background: #F4F2EE;
  --h-surface: #FFFFFF;
  --h-text: #1C1E20;
  --h-muted: #6B6F74;
  --h-dark: #16181A;
  --h-line: rgba(28, 30, 32, 0.16);
  --h-line-dark: rgba(244, 242, 238, 0.16);
  background: var(--h-background);
  color: var(--h-text);
  font-family: "Work Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

[data-template-id="handcraft"] *,
[data-template-id="handcraft-preview"] * {
  box-sizing: border-box;
}

[data-template-id="handcraft"] img,
[data-template-id="handcraft-preview"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="handcraft"] .h-display,
[data-template-id="handcraft-preview"] .h-display {
  font-family: "Archivo Black", "Work Sans", Arial, sans-serif;
  letter-spacing: -0.065em;
  text-transform: uppercase;
}

[data-template-id="handcraft"] .h-grid,
[data-template-id="handcraft-preview"] .h-grid {
  background-image:
    linear-gradient(rgba(197, 106, 58, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(197, 106, 58, 0.16) 1px, transparent 1px);
  background-size: 72px 72px;
}

[data-template-id="handcraft"] .h-copper-line,
[data-template-id="handcraft-preview"] .h-copper-line {
  position: relative;
}

[data-template-id="handcraft"] .h-copper-line::before,
[data-template-id="handcraft-preview"] .h-copper-line::before {
  background: var(--h-primary);
  content: "";
  height: 3px;
  position: absolute;
  right: 0;
  top: 0;
  transform-origin: right center;
  width: 72px;
}

@keyframes h-slide-fade {
  from {
    opacity: 0;
    transform: translate3d(34px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes h-rise-fade {
  from {
    opacity: 0;
    transform: translate3d(0, 26px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes h-line-cut {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes h-image-settle {
  from {
    transform: scale(1.04);
  }
  to {
    transform: scale(1);
  }
}

[data-template-id="handcraft"] .h-anim,
[data-template-id="handcraft-preview"] .h-anim {
  animation: h-slide-fade 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-template-id="handcraft"] .h-rise,
[data-template-id="handcraft-preview"] .h-rise {
  animation: h-rise-fade 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-template-id="handcraft"] .h-anim-d1,
[data-template-id="handcraft-preview"] .h-anim-d1 {
  animation-delay: 0.12s;
}

[data-template-id="handcraft"] .h-anim-d2,
[data-template-id="handcraft-preview"] .h-anim-d2 {
  animation-delay: 0.22s;
}

[data-template-id="handcraft"] .h-line-anim,
[data-template-id="handcraft-preview"] .h-line-anim {
  animation: h-line-cut 0.9s 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: right center;
}

[data-template-id="handcraft"] .h-image-anim,
[data-template-id="handcraft-preview"] .h-image-anim {
  animation: h-image-settle 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-template-id="handcraft"] .h-section,
[data-template-id="handcraft-preview"] .h-section {
  border-top: 1px solid var(--h-line);
}

[data-template-id="handcraft"] .h-dark-section,
[data-template-id="handcraft-preview"] .h-dark-section {
  background: var(--h-secondary);
  color: var(--h-background);
}

[data-template-id="handcraft"] .h-input,
[data-template-id="handcraft-preview"] .h-input {
  background: transparent;
  border: 1px solid rgba(244, 242, 238, 0.28);
  color: var(--h-background);
  outline: none;
}

[data-template-id="handcraft"] .h-input:focus,
[data-template-id="handcraft-preview"] .h-input:focus {
  border-color: var(--h-primary);
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="handcraft"] .h-anim,
  [data-template-id="handcraft-preview"] .h-anim,
  [data-template-id="handcraft"] .h-rise,
  [data-template-id="handcraft-preview"] .h-rise,
  [data-template-id="handcraft"] .h-line-anim,
  [data-template-id="handcraft-preview"] .h-line-anim,
  [data-template-id="handcraft"] .h-image-anim,
  [data-template-id="handcraft-preview"] .h-image-anim {
    animation: none;
  }
}
`;
