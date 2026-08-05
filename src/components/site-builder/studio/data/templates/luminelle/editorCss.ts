export const luminelleEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');

[data-template-id="luminelle"],
[data-template-id="luminelle"] {
  --l-bg: #E8E4DF;
  --l-ink: #2A2430;
  --l-sage: #7A8B76;
  --l-sage-soft: #A8B5A3;
  --l-surface: #F4F1EC;
  --l-muted: #7A736C;
  --l-dark: #1A161C;
  --l-line: rgba(42, 36, 48, 0.14);
  --l-line-strong: rgba(42, 36, 48, 0.26);
  --l-shadow: 0 28px 80px rgba(26, 22, 28, 0.12);
  font-family: "Outfit", sans-serif;
  color: var(--l-ink);
  background: var(--l-bg);
  text-rendering: geometricPrecision;
}

[data-template-id="luminelle"] *,
[data-template-id="luminelle"] * {
  box-sizing: border-box;
}

[data-template-id="luminelle"] .l-display,
[data-template-id="luminelle"] .l-display {
  font-family: "Libre Baskerville", serif;
  letter-spacing: -0.035em;
}

[data-template-id="luminelle"] .l-kicker,
[data-template-id="luminelle"] .l-kicker {
  color: var(--l-sage);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

[data-template-id="luminelle"] .l-rule,
[data-template-id="luminelle"] .l-rule {
  background: var(--l-line);
  height: 1px;
  width: 100%;
}

[data-template-id="luminelle"] .l-button,
[data-template-id="luminelle"] .l-button {
  align-items: center;
  background: var(--l-ink);
  color: var(--l-surface);
  display: inline-flex;
  font-size: 0.86rem;
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.02em;
  min-height: 3.35rem;
  padding: 0.95rem 1.55rem;
  transition: background 260ms ease, color 260ms ease, transform 260ms ease;
}

[data-template-id="luminelle"] .l-button:hover,
[data-template-id="luminelle"] .l-button:hover {
  background: var(--l-sage);
  color: var(--l-dark);
  transform: translateY(-2px);
}

[data-template-id="luminelle"] .l-button-outline,
[data-template-id="luminelle"] .l-button-outline {
  background: transparent;
  border: 1px solid var(--l-line-strong);
  color: var(--l-ink);
}

[data-template-id="luminelle"] .l-button-outline:hover,
[data-template-id="luminelle"] .l-button-outline:hover {
  border-color: var(--l-sage);
}

[data-template-id="luminelle"] .l-input,
[data-template-id="luminelle"] .l-input {
  background: rgba(244, 241, 236, 0.74);
  border: 1px solid var(--l-line);
  color: var(--l-ink);
  min-height: 3.35rem;
  outline: none;
  padding: 0.95rem 1rem;
  text-align: right;
  transition: border-color 220ms ease, background 220ms ease;
  width: 100%;
}

[data-template-id="luminelle"] .l-input:focus,
[data-template-id="luminelle"] .l-input:focus {
  background: var(--l-surface);
  border-color: var(--l-sage);
}

[data-template-id="luminelle"] .l-input::placeholder,
[data-template-id="luminelle"] .l-input::placeholder {
  color: rgba(122, 115, 108, 0.72);
}

@keyframes l-fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes l-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes l-soft-rise {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes l-line-draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

[data-template-id="luminelle"] .l-anim,
[data-template-id="luminelle"] .l-anim {
  animation: l-fade-up 0.82s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="luminelle"] .l-anim-soft,
[data-template-id="luminelle"] .l-anim-soft {
  animation: l-soft-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="luminelle"] .l-anim-d1,
[data-template-id="luminelle"] .l-anim-d1 {
  animation-delay: 0.12s;
}

[data-template-id="luminelle"] .l-anim-d2,
[data-template-id="luminelle"] .l-anim-d2 {
  animation-delay: 0.24s;
}

[data-template-id="luminelle"] .l-anim-d3,
[data-template-id="luminelle"] .l-anim-d3 {
  animation-delay: 0.36s;
}

[data-template-id="luminelle"] .l-line-anim,
[data-template-id="luminelle"] .l-line-anim {
  transform-origin: right center;
  animation: l-line-draw 0.9s 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="luminelle"] .l-media,
[data-template-id="luminelle"] .l-media {
  background: var(--l-surface);
  box-shadow: var(--l-shadow);
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="luminelle"] .l-anim,
  [data-template-id="luminelle"] .l-anim-soft,
  [data-template-id="luminelle"] .l-line-anim,
  [data-template-id="luminelle"] .l-anim,
  [data-template-id="luminelle"] .l-anim-soft,
  [data-template-id="luminelle"] .l-line-anim {
    animation: none;
  }
}
`;
