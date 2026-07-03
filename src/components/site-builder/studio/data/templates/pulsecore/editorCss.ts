export const pulsecoreEditorCss = `
[data-template-id="pulsecore"],
[data-template-id="pulsecore"] * {
  box-sizing: border-box;
}

[data-template-id="pulsecore"] {
  background: #080808;
  color: #ffffff;
  font-family: Inter, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

[data-template-id="pulsecore"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="pulsecore"] button,
[data-template-id="pulsecore"] a {
  cursor: pointer;
}

[data-template-id="pulsecore"] [data-section-kind] {
  scroll-margin-top: 120px;
}

/* EDITOR VISUAL STATES */

[data-template-id="pulsecore"] [data-visual-editable="true"] {
  outline-offset: 4px;
}

[data-template-id="pulsecore"] [data-visual-editable="true"][data-visual-hovered="true"] {
  outline: 1px dashed rgba(215, 255, 54, 0.8) !important;
  outline-offset: 5px !important;
}

[data-template-id="pulsecore"] [data-visual-editable="true"][data-visual-selected="true"] {
  outline: none !important;
  box-shadow: none !important;
}

/* HERO EFFECTS */

[data-template-id="pulsecore"] .pulsecore-grid-bg {
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 58px 58px;
  animation: pulsecoreGridMove 18s linear infinite;
}

[data-template-id="pulsecore"] .pulsecore-orb {
  pointer-events: none;
  will-change: transform, opacity;
  animation: pulsecoreOrbFloat 9s ease-in-out infinite;
}

[data-template-id="pulsecore"] .pulsecore-orb-delay {
  animation-delay: -3s;
  animation-duration: 12s;
}

[data-template-id="pulsecore"] .pulsecore-hero-card {
  will-change: transform;
  animation: pulsecoreHeroCard 5.5s ease-in-out infinite;
}

[data-template-id="pulsecore"] .pulsecore-hero-card:nth-child(2n) {
  animation-delay: -1.2s;
  animation-duration: 6.5s;
}

[data-template-id="pulsecore"] .pulsecore-hero-card:nth-child(3n) {
  animation-delay: -2.4s;
  animation-duration: 7.2s;
}

[data-template-id="pulsecore"] .pulsecore-marquee-track {
  animation: pulsecoreMarquee 28s linear infinite;
  will-change: transform;
}

[data-template-id="pulsecore"] .pulsecore-marquee-track:hover {
  animation-play-state: paused;
}

/* 3D FLOAT RING */

[data-template-id="pulsecore"] .pulsecore-3d-scene {
  perspective: 1100px;
  transform-style: preserve-3d;
}

[data-template-id="pulsecore"] .pulsecore-3d-ring {
  transform-style: preserve-3d;
  animation: pulsecoreRingRotate 24s linear infinite;
  will-change: transform;
}

[data-template-id="pulsecore"] .pulsecore-3d-scene:hover .pulsecore-3d-ring {
  animation-play-state: paused;
}

[data-template-id="pulsecore"] .pulsecore-3d-card {
  transform-style: preserve-3d;
  backface-visibility: visible;
  transform:
    translate(-50%, -50%)
    rotateY(var(--pulsecore-angle))
    translateZ(var(--pulsecore-z));
}

[data-template-id="pulsecore"] .pulsecore-3d-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.25),
    transparent 45%,
    rgba(215,255,54,0.14)
  );
}

/* HOVER EXPERIENCE */

[data-template-id="pulsecore"] article,
[data-template-id="pulsecore"] button,
[data-template-id="pulsecore"] img {
  backface-visibility: hidden;
}

[data-template-id="pulsecore"] article {
  will-change: transform;
}

[data-template-id="pulsecore"] button {
  will-change: transform, box-shadow;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  [data-template-id="pulsecore"] .pulsecore-3d-scene {
    height: 210px;
    overflow: hidden;
    perspective: none;
  }

  [data-template-id="pulsecore"] .pulsecore-3d-ring {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    display: flex;
    width: max-content;
    height: auto;
    transform: none !important;
    animation: pulsecoreMobileSlide 22s linear infinite;
    gap: 14px;
    padding-inline: 12px;
  }

  [data-template-id="pulsecore"] .pulsecore-3d-card {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    flex: 0 0 170px;
    transform: none !important;
  }
}

/* KEYFRAMES */

@keyframes pulsecoreGridMove {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 116px 116px;
  }
}

@keyframes pulsecoreOrbFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.78;
  }

  50% {
    transform: translate3d(34px, -24px, 0) scale(1.08);
    opacity: 1;
  }
}

@keyframes pulsecoreHeroCard {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(var(--pulsecore-rotate, 0deg));
  }

  50% {
    transform: translate3d(0, -18px, 0) rotate(calc(var(--pulsecore-rotate, 0deg) + 2deg));
  }
}

@keyframes pulsecoreMarquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes pulsecoreRingRotate {
  from {
    transform: translate(-50%, -50%) rotateY(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotateY(-360deg);
  }
}

@keyframes pulsecoreMobileSlide {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
`;