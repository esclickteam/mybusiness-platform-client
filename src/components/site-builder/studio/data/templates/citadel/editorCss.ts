export const citadelEditorCss = `
[data-template-id="citadel"],
[data-template-id="citadel-preview"] {
  --citadel-bg: #030a06;
  --citadel-surface: #071510;
  --citadel-panel: rgba(7, 21, 16, 0.9);
  --citadel-accent: #39ff14;
  --citadel-text: #d7ffd9;
  --citadel-muted: #7fad85;
  --citadel-border: rgba(57, 255, 20, 0.15);
}

[data-template-id="citadel"] [data-rect-reveal],
[data-template-id="citadel-preview"] [data-rect-reveal] {
  will-change: transform, opacity;
}

@keyframes rect-slide-in-left {
  from { transform: translateX(40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes rect-slide-in-right {
  from { transform: translateX(-40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes rect-rise {
  from { transform: translateY(32px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes rect-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes rect-scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.rect-animate-rise {
  animation: rect-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.rect-animate-left {
  animation: rect-slide-in-left 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.rect-animate-right {
  animation: rect-slide-in-right 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.rect-marquee-track {
  animation: rect-marquee 28s linear infinite;
}

.citadel-grid {
  background-image:
    linear-gradient(rgba(57, 255, 20, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(57, 255, 20, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
}

.citadel-panel {
  position: relative;
  background: linear-gradient(180deg, rgba(9, 22, 14, 0.9), rgba(3, 10, 6, 0.96));
  box-shadow: inset 0 0 0 1px rgba(57, 255, 20, 0.04);
}

.citadel-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(57, 255, 20, 0.06), transparent 22%, transparent 78%, rgba(57, 255, 20, 0.05));
}

.citadel-screen::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0) 24%),
    repeating-linear-gradient(
      to bottom,
      rgba(57, 255, 20, 0.06) 0,
      rgba(57, 255, 20, 0.06) 1px,
      transparent 1px,
      transparent 4px
    );
  mix-blend-mode: screen;
  opacity: 0.45;
}

.citadel-scan-band {
  background: linear-gradient(to bottom, transparent, rgba(57, 255, 20, 0.38), transparent);
  animation: rect-scan 6s linear infinite;
}

.citadel-marquee-item {
  border-color: rgba(57, 255, 20, 0.22);
}

.citadel-code-line {
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.18);
}

[data-template-id="citadel"] input::placeholder,
[data-template-id="citadel"] textarea::placeholder,
[data-template-id="citadel-preview"] input::placeholder,
[data-template-id="citadel-preview"] textarea::placeholder {
  color: rgba(215, 255, 217, 0.46);
}
`;
