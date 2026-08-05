export const neuralisEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
[data-template-id="neuralis"], [data-template-id="neuralis"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #22D3EE;
  --p2: #0EA5E9;
  --bg: #050816;
  --surface: #0B1224;
  --surface2: #0F1B31;
  --text: #E8F7FF;
  --muted: #8BA3B8;
  --line: rgba(34, 211, 238, 0.22);
  --dark: #02040A;
  font-family: "IBM Plex Sans Hebrew", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 12% 10%, rgba(34, 211, 238, 0.11), transparent 32rem),
    radial-gradient(circle at 92% 18%, rgba(14, 165, 233, 0.12), transparent 28rem),
    var(--bg);
}
[data-template-id="neuralis"] .neuralis-display,
[data-template-id="neuralis"] .neuralis-display {
  font-family: "Space Grotesk", "IBM Plex Sans Hebrew", sans-serif;
  letter-spacing: -0.06em;
}
[data-template-id="neuralis"] .neuralis-grid,
[data-template-id="neuralis"] .neuralis-grid {
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.055) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.2), transparent);
}
[data-template-id="neuralis"] .neuralis-orb,
[data-template-id="neuralis"] .neuralis-orb {
  animation: neuralisFloat 9s ease-in-out infinite;
  filter: blur(1px);
}
[data-template-id="neuralis"] .neuralis-orb:nth-child(2),
[data-template-id="neuralis"] .neuralis-orb:nth-child(2) {
  animation-delay: -3.4s;
  animation-duration: 11s;
}
[data-template-id="neuralis"] .neuralis-orb:nth-child(3),
[data-template-id="neuralis"] .neuralis-orb:nth-child(3) {
  animation-delay: -6s;
  animation-duration: 13s;
}
[data-template-id="neuralis"] .neuralis-marquee,
[data-template-id="neuralis"] .neuralis-marquee {
  animation: neuralisMarquee 28s linear infinite;
}
[data-template-id="neuralis"] .neuralis-card,
[data-template-id="neuralis"] .neuralis-card {
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.28);
}
[data-template-id="neuralis"] .neuralis-card::before,
[data-template-id="neuralis"] .neuralis-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.22), transparent 38%, rgba(14, 165, 233, 0.12));
  opacity: 0;
  transition: opacity 420ms ease;
}
[data-template-id="neuralis"] .neuralis-card:hover::before,
[data-template-id="neuralis"] .neuralis-card:hover::before {
  opacity: 1;
}
[data-template-id="neuralis"] .neuralis-scan,
[data-template-id="neuralis"] .neuralis-scan {
  position: relative;
  overflow: hidden;
}
[data-template-id="neuralis"] .neuralis-scan::after,
[data-template-id="neuralis"] .neuralis-scan::after {
  content: "";
  position: absolute;
  inset: -35% 0 auto 0;
  height: 36%;
  background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.18), transparent);
  animation: neuralisScan 4.8s ease-in-out infinite;
}
[data-template-id="neuralis"] .neuralis-footer-glow,
[data-template-id="neuralis"] .neuralis-footer-glow {
  box-shadow: 0 -28px 120px rgba(34, 211, 238, 0.18);
}
@keyframes neuralisFloat {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  45% { transform: translate3d(-22px, 26px, 0) scale(1.08); }
  70% { transform: translate3d(18px, -14px, 0) scale(0.96); }
}
@keyframes neuralisMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes neuralisScan {
  0%, 100% { transform: translateY(-20%); opacity: 0; }
  25%, 70% { opacity: 1; }
  100% { transform: translateY(390%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="neuralis"] .neuralis-orb,
  [data-template-id="neuralis"] .neuralis-orb,
  [data-template-id="neuralis"] .neuralis-marquee,
  [data-template-id="neuralis"] .neuralis-marquee,
  [data-template-id="neuralis"] .neuralis-scan::after,
  [data-template-id="neuralis"] .neuralis-scan::after {
    animation: none;
  }
}

[data-template-id="neuralis"] .text-center,
[data-template-id="neuralis"] .text-center {
  text-align: center;
}
`;
