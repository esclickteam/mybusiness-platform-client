export const archoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
[data-template-id="archora"], [data-template-id="archora"] {
  /* wow-rtl-align */
  --p: #D4FF00;
  --bg: #111111;
  --surface: #1A1A1A;
  --text: #F5F5F0;
  --muted: #9A9A92;
  --dark: #0A0A0A;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
  text-align: right;
}
[data-template-id="archora"] .text-center,
[data-template-id="archora"] .text-center {
  text-align: center;
}
[data-template-id="archora"] *, [data-template-id="archora"] * {
  border-radius: 0 !important;
}
[data-template-id="archora"] .ar-latin,
[data-template-id="archora"] .ar-latin {
  font-family: "Space Grotesk", "Heebo", sans-serif;
  letter-spacing: -0.04em;
}
[data-template-id="archora"] .ar-display,
[data-template-id="archora"] .ar-display {
  font-family: "Heebo", sans-serif;
  letter-spacing: -0.02em;
}
[data-template-id="archora"] .ar-hero-image, [data-template-id="archora"] .ar-hero-image {
  animation: archoraKenBurns 22s ease-in-out infinite alternate;
  transform-origin: center;
}
[data-template-id="archora"] .ar-slash, [data-template-id="archora"] .ar-slash {
  animation: archoraSlash 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
[data-template-id="archora"] .ar-marquee-track, [data-template-id="archora"] .ar-marquee-track {
  animation: archoraMarquee 24s linear infinite;
  will-change: transform;
}
[data-template-id="archora"] .ar-marquee-track:hover, [data-template-id="archora"] .ar-marquee-track:hover {
  animation-play-state: paused;
}
[data-template-id="archora"] .ar-project-img, [data-template-id="archora"] .ar-project-img {
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 900ms ease;
}
[data-template-id="archora"] .ar-project-card:hover .ar-project-img,
[data-template-id="archora"] .ar-project-card:hover .ar-project-img {
  transform: scale(1.08);
  filter: saturate(1.12) contrast(1.05);
}
[data-template-id="archora"] .ar-service-panel, [data-template-id="archora"] .ar-service-panel {
  background:
    linear-gradient(135deg, rgba(212, 255, 0, 0.12), transparent 34%),
    linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%);
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1), border-color 500ms ease;
}
[data-template-id="archora"] .ar-service-panel:hover,
[data-template-id="archora"] .ar-service-panel:hover {
  transform: translateY(-8px);
  border-color: var(--p);
}
[data-template-id="archora"] .ar-grid-noise, [data-template-id="archora"] .ar-grid-noise {
  background-image:
    linear-gradient(rgba(212,255,0,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,255,0,0.08) 1px, transparent 1px);
  background-size: 72px 72px;
}
[data-template-id="archora"] .ar-timeline-line, [data-template-id="archora"] .ar-timeline-line {
  background: linear-gradient(180deg, transparent, var(--p), transparent);
}
[data-template-id="archora"] .ar-node, [data-template-id="archora"] .ar-node {
  box-shadow: 0 0 0 0 rgba(212, 255, 0, 0.5);
  animation: archoraNodePulse 2.8s ease-in-out infinite;
}
[data-template-id="archora"] .ar-field, [data-template-id="archora"] .ar-field {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(245, 245, 240, 0.18);
  color: var(--text);
  text-align: right;
}
[data-template-id="archora"] .ar-field::placeholder,
[data-template-id="archora"] .ar-field::placeholder {
  color: rgba(245, 245, 240, 0.45);
}
[data-template-id="archora"] .ar-cta-btn,
[data-template-id="archora"] .ar-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  background: #111111;
  color: var(--p);
  border: 3px solid #111111;
  font-weight: 800;
  letter-spacing: 0.04em;
  transition: background 250ms ease, color 250ms ease, transform 250ms ease;
}
[data-template-id="archora"] .ar-cta-btn:hover,
[data-template-id="archora"] .ar-cta-btn:hover {
  background: transparent;
  color: #111111;
  transform: translateY(-2px);
}

@keyframes archoraKenBurns {
  0% { transform: scale(1) translate3d(0, 0, 0); }
  100% { transform: scale(1.14) translate3d(-2.5%, 2%, 0); }
}
@keyframes archoraSlash {
  0% { transform: scaleY(0) rotate(12deg); opacity: 0; }
  100% { transform: scaleY(1) rotate(12deg); opacity: 1; }
}
@keyframes archoraMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes archoraNodePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 255, 0, 0.48); }
  50% { box-shadow: 0 0 0 16px rgba(212, 255, 0, 0); }
}
`;
