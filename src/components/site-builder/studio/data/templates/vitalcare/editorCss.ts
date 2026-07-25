export const vitalcareEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap');

[data-template-id="vitalcare"],
[data-template-id="vitalcare-preview"] {
  --vc-primary: #0D5C63;
  --vc-secondary: #0A3D42;
  --vc-accent: #B8D8D4;
  --vc-background: #F5F7F8;
  --vc-surface: #FFFFFF;
  --vc-text: #163033;
  --vc-muted: #5F6F72;
  --vc-dark: #0A1F22;
  --vc-line: rgba(13, 92, 99, 0.16);
  --vc-shadow: 0 24px 70px rgba(10, 31, 34, 0.12);
  background:
    radial-gradient(circle at 12% 8%, rgba(184, 216, 212, 0.36), transparent 30rem),
    linear-gradient(180deg, #ffffff 0%, var(--vc-background) 34%, #eef3f3 100%);
  color: var(--vc-text);
  font-family: "IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

[data-template-id="vitalcare"] .vc-display,
[data-template-id="vitalcare-preview"] .vc-display {
  font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
  letter-spacing: -0.035em;
}

[data-template-id="vitalcare"] .vc-shell,
[data-template-id="vitalcare-preview"] .vc-shell {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.94), rgba(245, 247, 248, 0.9)),
    radial-gradient(circle at 85% 18%, rgba(184, 216, 212, 0.34), transparent 24rem);
}

[data-template-id="vitalcare"] .vc-glass,
[data-template-id="vitalcare-preview"] .vc-glass {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 18px 60px rgba(10, 31, 34, 0.08);
  backdrop-filter: blur(18px);
}

@keyframes vc-fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes vc-soft-scale {
  from {
    transform: scale(1.045);
  }
  to {
    transform: scale(1);
  }
}

@keyframes vc-line {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

[data-template-id="vitalcare"] .vc-anim,
[data-template-id="vitalcare-preview"] .vc-anim {
  animation: vc-fade-up 0.82s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="vitalcare"] .vc-anim-d1,
[data-template-id="vitalcare-preview"] .vc-anim-d1 {
  animation-delay: 0.1s;
}

[data-template-id="vitalcare"] .vc-anim-d2,
[data-template-id="vitalcare-preview"] .vc-anim-d2 {
  animation-delay: 0.2s;
}

[data-template-id="vitalcare"] .vc-anim-d3,
[data-template-id="vitalcare-preview"] .vc-anim-d3 {
  animation-delay: 0.3s;
}

[data-template-id="vitalcare"] .vc-photo-motion,
[data-template-id="vitalcare-preview"] .vc-photo-motion {
  animation: vc-soft-scale 11s ease-out both;
}

[data-template-id="vitalcare"] .vc-rule,
[data-template-id="vitalcare-preview"] .vc-rule {
  transform-origin: right center;
  animation: vc-line 0.9s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="vitalcare"] .vc-input,
[data-template-id="vitalcare-preview"] .vc-input {
  border: 1px solid var(--vc-line);
  background: rgba(255, 255, 255, 0.92);
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

[data-template-id="vitalcare"] .vc-input:focus,
[data-template-id="vitalcare-preview"] .vc-input:focus {
  border-color: var(--vc-primary);
  box-shadow: 0 0 0 4px rgba(184, 216, 212, 0.42);
  background: #ffffff;
}

[data-template-id="vitalcare"] .vc-card-hover,
[data-template-id="vitalcare-preview"] .vc-card-hover {
  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
}

[data-template-id="vitalcare"] .vc-card-hover:hover,
[data-template-id="vitalcare-preview"] .vc-card-hover:hover {
  transform: translateY(-4px);
  border-color: rgba(13, 92, 99, 0.26);
  box-shadow: var(--vc-shadow);
}
`;
