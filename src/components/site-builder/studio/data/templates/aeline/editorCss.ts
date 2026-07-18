export const aelineEditorCss = `
[data-template-id="aeline"],
[data-template-id="aeline"] * {
  box-sizing: border-box;
}

[data-template-id="aeline"] {
  position: relative;
  background: #ffffff;
  color: #111111;
  font-family: Inter, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
  overflow-x: hidden;
  overflow-y: visible;
}

/*
  ההידר חייב להיות מעוגן לשורש התבנית — אחרת בעורך הוא
  נצמד לאב מרוחק ונעלם מחוץ לקנבס, בעוד שבצפייה הוא כן נראה.
*/
[data-template-id="aeline"] > header,
[data-visual-template-canvas="true"] [data-template-id="aeline"] > header {
  position: absolute !important;
  inset-inline: 0 !important;
  top: 0 !important;
  z-index: 50 !important;
  width: 100%;
}

[data-template-id="aeline"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="aeline"] button,
[data-template-id="aeline"] a {
  cursor: pointer;
}

[data-template-id="aeline"] section {
  max-width: 100%;
}

[data-template-id="aeline"] [data-section-kind] {
  scroll-margin-top: 120px;
}

/* ===============================
   EDITOR SELECTION HELPERS
================================ */

[data-template-id="aeline"] [data-visual-editable="true"] {
  outline-offset: 4px;
}

[data-template-id="aeline"] [data-visual-editable="true"][data-visual-hovered="true"] {
  outline: 1px dashed rgba(255, 255, 255, 0.72) !important;
  outline-offset: 5px !important;
}

[data-template-id="aeline"] [data-visual-editable="true"][data-visual-selected="true"] {
  outline: none !important;
  box-shadow: none !important;
}

/* Better selection on bright/white sections */
[data-template-id="aeline"] section:not(:first-child) [data-visual-editable="true"][data-visual-hovered="true"] {
  outline: 1px dashed rgba(0, 0, 0, 0.36) !important;
}

/* Prevent accidental text/image dragging weirdness inside editor */
[data-template-id="aeline"] img,
[data-template-id="aeline"] button,
[data-template-id="aeline"] a {
  user-select: none;
}

/* ===============================
   HERO SKY / CLOUD EXPERIENCE
================================ */

[data-template-id="aeline"] .aeline-cloud {
  pointer-events: none;
  will-change: transform, opacity;
  filter: blur(28px);
  animation: aelineCloudFloat 13s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-cloud-one {
  animation-duration: 16s;
  animation-delay: 0s;
}

[data-template-id="aeline"] .aeline-cloud-two {
  animation-duration: 19s;
  animation-delay: -4s;
}

[data-template-id="aeline"] .aeline-cloud-three {
  animation-duration: 22s;
  animation-delay: -8s;
}

/* ===============================
   HERO 3D ROTATING CAROUSEL
================================ */

[data-template-id="aeline"] .aeline-hero-carousel {
  perspective: 1200px;
  transform-style: preserve-3d;
  overflow: visible;
}

[data-template-id="aeline"] .aeline-hero-ring {
  transform-style: preserve-3d;
  animation: aelineHeroRotate 26s linear infinite;
  will-change: transform;
}

[data-template-id="aeline"] .aeline-hero-carousel:hover .aeline-hero-ring {
  animation-play-state: paused;
}

[data-template-id="aeline"] .aeline-hero-ring-card {
  transform-style: preserve-3d;
  backface-visibility: visible;
  will-change: transform;
  transform:
    translate(-50%, -50%)
    rotateY(var(--aeline-angle))
    translateZ(var(--aeline-z));
}

[data-template-id="aeline"] .aeline-hero-ring-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.38),
    transparent 42%,
    rgba(255,255,255,0.12)
  );
}

[data-template-id="aeline"] .aeline-hero-ring-card:hover {
  z-index: 50;
}

/* ===============================
   FLOATING CARDS
================================ */

[data-template-id="aeline"] .aeline-float-card {
  will-change: transform;
  animation: aelineFloatCard 6.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-card-orbit {
  will-change: transform;
  animation: aelineCardOrbit 7.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-card-orbit:nth-child(2n) {
  animation-duration: 8.8s;
}

[data-template-id="aeline"] .aeline-card-orbit:nth-child(3n) {
  animation-duration: 9.6s;
}

/* Old class support */
[data-template-id="aeline"] .aeline-orb {
  animation: aelineFloatCard 5.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-orb-delay {
  animation: aelineFloatCard 6.5s ease-in-out infinite;
  animation-delay: 0.8s;
}

/* ===============================
   MARQUEE
================================ */

[data-template-id="aeline"] .aeline-marquee-track {
  animation: aelineMarquee 34s linear infinite;
  will-change: transform;
}

[data-template-id="aeline"] .aeline-marquee-track:hover {
  animation-play-state: paused;
}

/* ===============================
   PREMIUM HOVER FEEL
================================ */

[data-template-id="aeline"] article,
[data-template-id="aeline"] button,
[data-template-id="aeline"] img {
  backface-visibility: hidden;
}

[data-template-id="aeline"] article {
  will-change: transform;
}

[data-template-id="aeline"] button {
  will-change: transform, box-shadow, background-color, color;
}

/* Smooth image zoom where Tailwind hover exists */
[data-template-id="aeline"] article:hover img {
  transform-origin: center;
}

/* ===============================
   REVEAL UTILS
================================ */

[data-template-id="aeline"] .aeline-reveal-up {
  animation: aelineRevealUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-template-id="aeline"] .aeline-soft-zoom {
  animation: aelineSoftZoom 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-template-id="aeline"] .aeline-pulse-soft {
  animation: aelinePulseSoft 4.6s ease-in-out infinite;
}

/* ===============================
   RESPONSIVE POLISH
================================ */

@media (max-width: 1024px) {
  [data-template-id="aeline"] .aeline-cloud {
    opacity: 0.72;
  }

  [data-template-id="aeline"] .aeline-hero-carousel {
    perspective: 900px;
  }

  [data-template-id="aeline"] .aeline-hero-ring-card {
    --aeline-z: 340px !important;
  }
}

@media (max-width: 900px) {
  [data-template-id="aeline"] .aeline-hero-carousel {
    height: 190px;
    perspective: none;
    overflow: hidden;
  }

  [data-template-id="aeline"] .aeline-hero-ring {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    display: flex;
    width: max-content;
    height: auto;
    transform: none !important;
    animation: aelineMobileCardSlide 24s linear infinite;
    gap: 14px;
    padding-inline: 12px;
  }

  [data-template-id="aeline"] .aeline-hero-ring-card {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    flex: 0 0 168px;
    transform: none !important;
  }
}

@media (max-width: 768px) {
  [data-template-id="aeline"] {
    overflow-x: hidden;
  }

  [data-template-id="aeline"] .aeline-card-orbit {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    display: inline-block;
    margin: 6px;
    transform: none !important;
  }

  [data-template-id="aeline"] .aeline-cloud {
    filter: blur(22px);
  }
}

/* ===============================
   KEYFRAMES
================================ */

@keyframes aelineHeroRotate {
  from {
    transform: translate(-50%, -50%) rotateY(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotateY(-360deg);
  }
}

@keyframes aelineMobileCardSlide {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes aelineFloatCard {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(var(--aeline-rotate, 0deg));
  }

  50% {
    transform: translate3d(0, -16px, 0) rotate(calc(var(--aeline-rotate, 0deg) + 1.4deg));
  }
}

@keyframes aelineCardOrbit {
  0%, 100% {
    margin-top: 0;
  }

  50% {
    margin-top: -14px;
  }
}

@keyframes aelineCloudFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.72;
  }

  50% {
    transform: translate3d(42px, -18px, 0) scale(1.08);
    opacity: 0.92;
  }
}

@keyframes aelineMarquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes aelineRevealUp {
  from {
    opacity: 0;
    transform: translateY(34px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aelineSoftZoom {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes aelinePulseSoft {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.82;
    transform: scale(1.025);
  }
}
`;