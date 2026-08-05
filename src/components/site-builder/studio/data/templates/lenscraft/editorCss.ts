export const lenscraftEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

[data-template-id="lenscraft"],
[data-template-id="lenscraft"] {
  --p: #E11D48;
  --s: #0F0F10;
  --a: #FB7185;
  --bg: #0F0F10;
  --surface: #18181B;
  --text: #FAFAFA;
  --muted: #A1A1AA;
  --dark: #09090B;
  font-family: "Space Grotesk", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}

[data-template-id="lenscraft"] *,
[data-template-id="lenscraft"] * {
  border-radius: 0 !important;
}

@keyframes lc-hero-drift {
  0% { transform: scale(1.08) translateX(0); }
  100% { transform: scale(1.16) translateX(-2.5%); }
}

@keyframes lc-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

@keyframes lc-flicker {
  0%, 100% { opacity: .16; transform: translateY(0); }
  50% { opacity: .32; transform: translateY(-8px); }
}

[data-template-id="lenscraft"] .lc-hero-image,
[data-template-id="lenscraft"] .lc-hero-image {
  animation: lc-hero-drift 18s ease-in-out infinite alternate;
}

[data-template-id="lenscraft"] .lc-filmstrip,
[data-template-id="lenscraft"] .lc-filmstrip {
  scrollbar-width: thin;
  scrollbar-color: var(--p) #09090B;
  background-image:
    linear-gradient(90deg, rgba(225,29,72,.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 80px 100%, 12px 100%;
}

[data-template-id="lenscraft"] .lc-filmstrip::before,
[data-template-id="lenscraft"] .lc-filmstrip::before,
[data-template-id="lenscraft"] .lc-filmstrip::after,
[data-template-id="lenscraft"] .lc-filmstrip::after {
  content: "";
  flex: 0 0 1px;
}

[data-template-id="lenscraft"] .lc-package-strip,
[data-template-id="lenscraft"] .lc-package-strip {
  position: relative;
  overflow: hidden;
}

[data-template-id="lenscraft"] .lc-package-strip::before,
[data-template-id="lenscraft"] .lc-package-strip::before,
[data-template-id="lenscraft"] .lc-package-strip::after,
[data-template-id="lenscraft"] .lc-package-strip::after {
  content: "";
  position: absolute;
  inset-block: 0;
  width: 12px;
  background-image: radial-gradient(circle, var(--p) 2px, transparent 2.5px);
  background-size: 12px 20px;
  animation: lc-flicker 2.8s ease-in-out infinite;
}

[data-template-id="lenscraft"] .lc-package-strip::before,
[data-template-id="lenscraft"] .lc-package-strip::before {
  right: 0;
}

[data-template-id="lenscraft"] .lc-package-strip::after,
[data-template-id="lenscraft"] .lc-package-strip::after {
  left: 0;
}

[data-template-id="lenscraft"] .lc-marquee,
[data-template-id="lenscraft"] .lc-marquee {
  animation: lc-marquee 24s linear infinite;
}

[data-template-id="lenscraft"] .lc-marquee:hover,
[data-template-id="lenscraft"] .lc-marquee:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="lenscraft"] .lc-hero-image,
  [data-template-id="lenscraft"] .lc-hero-image,
  [data-template-id="lenscraft"] .lc-marquee,
  [data-template-id="lenscraft"] .lc-marquee,
  [data-template-id="lenscraft"] .lc-package-strip::before,
  [data-template-id="lenscraft"] .lc-package-strip::before,
  [data-template-id="lenscraft"] .lc-package-strip::after,
  [data-template-id="lenscraft"] .lc-package-strip::after {
    animation: none;
  }
}
`;
