export const rectTemplateEditorCssBase = `
[data-rect-reveal] {
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

@keyframes rect-pulse-bar {
  0%, 100% { transform: scaleX(0.35); opacity: 0.35; }
  50% { transform: scaleX(1); opacity: 1; }
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

.rect-scan-line {
  animation: rect-scan 6s linear infinite;
}

.rect-pulse-bar {
  animation: rect-pulse-bar 2.4s ease-in-out infinite;
  transform-origin: left center;
}
`;
