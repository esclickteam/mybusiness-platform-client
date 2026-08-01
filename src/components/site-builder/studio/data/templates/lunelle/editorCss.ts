export const lunelleEditorCss = `
[data-template-id="lunelle"],
[data-template-id="lunelle"] * {
  box-sizing: border-box;
}

[data-template-id="lunelle"] {
  direction: rtl;
  background: #fff7f1;
  color: #2a171c;
  font-family: Inter, Arial, sans-serif;
  scroll-behavior: smooth;
  overflow-x: hidden;
}

[data-template-id="lunelle"] * {
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

[data-template-id="lunelle"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="lunelle"] a,
[data-template-id="lunelle"] button {
  cursor: pointer;
}

[data-template-id="lunelle"] .lunelle-serif {
  font-family: Georgia, "Times New Roman", serif;
}

/* =========================
   GENERAL SECTION BEHAVIOR
========================= */

[data-template-id="lunelle"] [data-section-kind] {
  position: relative;
  scroll-margin-top: 120px;
}

[data-template-id="lunelle"] section {
  position: relative;
}

/* =========================
   STICKY GLASS HEADER
========================= */

[data-template-id="lunelle"] [data-section-kind="header"] {
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(255, 247, 241, 0.82) !important;
  border-bottom: 1px solid rgba(42, 23, 28, 0.08);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow: 0 18px 55px rgba(42, 23, 28, 0.06);
}

/* =========================
   REVEAL / WEBFLOW FEEL
========================= */

[data-template-id="lunelle"] .lunelle-reveal {
  animation: lunelleRevealUp .9s cubic-bezier(.16,1,.3,1) both;
}

[data-template-id="lunelle"] .lunelle-auto-reveal {
  opacity: 0;
  transform: translateY(36px) scale(.985);
  filter: blur(10px);
  transition:
    opacity 900ms cubic-bezier(.16,1,.3,1),
    transform 900ms cubic-bezier(.16,1,.3,1),
    filter 900ms cubic-bezier(.16,1,.3,1);
  will-change: opacity, transform, filter;
}

[data-template-id="lunelle"] .lunelle-auto-reveal.lunelle-is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

[data-template-id="lunelle"] .lunelle-auto-reveal:nth-child(2n) {
  transition-delay: 80ms;
}

[data-template-id="lunelle"] .lunelle-auto-reveal:nth-child(3n) {
  transition-delay: 140ms;
}

[data-template-id="lunelle"] .lunelle-auto-reveal:nth-child(4n) {
  transition-delay: 200ms;
}

/* =========================
   FLOATING / SOFT MOTION
========================= */

[data-template-id="lunelle"] .lunelle-float,
[data-template-id="lunelle"] .lunelle-soft-float {
  animation: lunelleFloat 6.4s ease-in-out infinite;
  will-change: transform;
}

[data-template-id="lunelle"] .lunelle-soft-float:nth-child(2n),
[data-template-id="lunelle"] .lunelle-float:nth-child(2n) {
  animation-duration: 8.2s;
  animation-delay: -1.4s;
}

[data-template-id="lunelle"] .lunelle-soft-float:nth-child(3n),
[data-template-id="lunelle"] .lunelle-float:nth-child(3n) {
  animation-duration: 9.4s;
  animation-delay: -2.4s;
}

[data-template-id="lunelle"] .lunelle-pulse {
  animation: lunellePulse 5.2s ease-in-out infinite;
}

/* =========================
   IMAGE EFFECTS
========================= */

[data-template-id="lunelle"] img {
  transition:
    transform 850ms cubic-bezier(.16,1,.3,1),
    filter 850ms cubic-bezier(.16,1,.3,1),
    opacity 850ms cubic-bezier(.16,1,.3,1);
  will-change: transform;
}

[data-template-id="lunelle"] .lunelle-image-hover {
  transition:
    transform .85s cubic-bezier(.16,1,.3,1),
    filter .85s cubic-bezier(.16,1,.3,1),
    opacity .85s cubic-bezier(.16,1,.3,1);
}

[data-template-id="lunelle"] .lunelle-card:hover .lunelle-image-hover,
[data-template-id="lunelle"] [data-section-kind="service-card"]:hover img,
[data-template-id="lunelle"] [data-section-kind="gallery-image"]:hover img {
  transform: scale(1.075);
  filter: saturate(1.1) contrast(1.05);
}

[data-template-id="lunelle"] .lunelle-parallax-image {
  transform: translate3d(0, var(--lunelle-parallax-y, 0px), 0) scale(1.035);
}

[data-template-id="lunelle"] .lunelle-image-glow {
  position: relative;
}

[data-template-id="lunelle"] .lunelle-image-glow::after {
  content: "";
  position: absolute;
  inset: auto 12% -20px 12%;
  height: 46px;
  border-radius: 999px;
  background: rgba(138, 79, 95, .18);
  filter: blur(24px);
  pointer-events: none;
  opacity: .75;
  transition: opacity 450ms ease, transform 450ms ease;
}

[data-template-id="lunelle"] .lunelle-image-glow:hover::after {
  opacity: 1;
  transform: translateY(4px) scale(1.04);
}

/* =========================
   CARDS / HOVER LIFT
========================= */

[data-template-id="lunelle"] .lunelle-card,
[data-template-id="lunelle"] [data-section-kind="service-card"],
[data-template-id="lunelle"] [data-section-kind="gallery-image"],
[data-template-id="lunelle"] [data-section-kind="testimonials"] article {
  transition:
    transform 520ms cubic-bezier(.16,1,.3,1),
    box-shadow 520ms cubic-bezier(.16,1,.3,1),
    border-color 520ms cubic-bezier(.16,1,.3,1),
    background-color 520ms cubic-bezier(.16,1,.3,1);
  will-change: transform;
}

[data-template-id="lunelle"] .lunelle-card:hover,
[data-template-id="lunelle"] [data-section-kind="service-card"]:hover,
[data-template-id="lunelle"] [data-section-kind="gallery-image"]:hover,
[data-template-id="lunelle"] [data-section-kind="testimonials"] article:hover {
  transform: translateY(-10px);
  box-shadow: 0 32px 95px rgba(42, 23, 28, .15);
}

/* Contact: form stays above media; media never floats over inputs */
[data-template-id="lunelle"] .lunelle-contact-form,
[data-template-id="lunelle"] form[data-bizuply-block="lead-form"],
[data-template-id="lunelle"] form[data-bizuply-crm-lead="true"] {
  position: relative;
  z-index: 10;
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
  will-change: auto;
}

[data-template-id="lunelle"] .lunelle-contact-form:hover,
[data-template-id="lunelle"] form[data-bizuply-block="lead-form"]:hover,
[data-template-id="lunelle"] form[data-bizuply-crm-lead="true"]:hover {
  transform: none !important;
  box-shadow: 0 25px 80px rgba(42, 23, 28, .08);
}

[data-template-id="lunelle"] .lunelle-contact-media {
  position: relative;
  z-index: 0;
  overflow: hidden;
  isolation: isolate;
  min-height: 360px;
}

[data-template-id="lunelle"] .lunelle-contact-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: none !important;
  animation: none !important;
  max-width: none;
}

/* Gallery mosaic: every tile fills its grid area edge-to-edge */
[data-template-id="lunelle"] .lunelle-gallery-grid {
  display: grid;
}

[data-template-id="lunelle"] .lunelle-gallery-tile,
[data-template-id="lunelle"] [data-section-kind="gallery-image"] {
  position: relative;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
}

[data-template-id="lunelle"] .lunelle-gallery-tile img,
[data-template-id="lunelle"] [data-section-kind="gallery-image"] img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

/* Booking calendar must keep a solid white surface on the dark section */
[data-template-id="lunelle"] .lunelle-booking-frame,
[data-template-id="lunelle"] [data-bizuply-booking-frame="true"],
[data-template-id="lunelle"] [data-bizuply-booking-mount="true"] {
  background: #ffffff !important;
  overflow: hidden;
}

/* =========================
   SHINE EFFECT
========================= */

[data-template-id="lunelle"] .lunelle-shine {
  position: relative;
  overflow: hidden;
}

[data-template-id="lunelle"] .lunelle-shine::before {
  content: "";
  position: absolute;
  inset: -90% auto -90% -42%;
  width: 34%;
  transform: rotate(18deg);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, .58),
    transparent
  );
  opacity: 0;
  transition: opacity 280ms ease;
  pointer-events: none;
  z-index: 3;
}

[data-template-id="lunelle"] .lunelle-shine:hover::before {
  opacity: 1;
  animation: lunelleShine 900ms cubic-bezier(.16,1,.3,1);
}

/* =========================
   HERO COMPOSITION LOCK
   Keep editor + published identical:
   large image with small detail + appointment slot overlaid.
========================= */

[data-template-id="lunelle"] .lunelle-hero {
  overflow-x: clip;
  overflow-y: visible;
}

[data-template-id="lunelle"] .lunelle-hero-stage {
  display: grid;
  align-items: center;
  gap: 3.5rem;
}

[data-template-id="lunelle"] .lunelle-hero-media {
  position: relative;
  z-index: 1;
  max-width: 560px;
  margin-inline: auto;
  padding-bottom: 2.5rem;
  overflow: visible;
}

[data-template-id="lunelle"] .lunelle-hero-main {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 46px;
  border: 10px solid #ffffff;
  background: #f1d7dc;
  box-shadow: 0 35px 100px rgba(42, 23, 28, 0.18);
}

[data-template-id="lunelle"] .lunelle-hero-main img {
  display: block;
  width: 100%;
  height: 650px;
  object-fit: cover;
}

[data-template-id="lunelle"] .lunelle-hero-chip,
[data-template-id="lunelle"] .lunelle-hero-slot,
[data-template-id="lunelle"] .lunelle-hero-detail {
  position: absolute !important;
  z-index: 20 !important;
  display: none;
  pointer-events: auto;
}

[data-template-id="lunelle"] .lunelle-hero-chip {
  top: 2.5rem;
  right: -1.5rem;
  border-radius: 999px;
  background: #2a171c !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 900;
  box-shadow: 0 22px 60px rgba(42, 23, 28, 0.24);
}

[data-template-id="lunelle"] .lunelle-hero-slot {
  left: -1.5rem;
  bottom: 3.5rem;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.92) !important;
  color: #2a171c !important;
  padding: 1.25rem;
  box-shadow: 0 24px 70px rgba(42, 23, 28, 0.16);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

[data-template-id="lunelle"] .lunelle-hero-slot p {
  color: inherit;
}

[data-template-id="lunelle"] .lunelle-hero-detail {
  right: 4rem;
  bottom: -2.5rem;
  width: 210px;
  overflow: hidden;
  border-radius: 34px;
  border: 8px solid #ffffff;
  background: #f1d7dc;
  box-shadow: 0 26px 80px rgba(42, 23, 28, 0.18);
}

[data-template-id="lunelle"] .lunelle-hero-detail img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

@media (min-width: 768px) {
  [data-template-id="lunelle"] .lunelle-hero-chip,
  [data-template-id="lunelle"] .lunelle-hero-slot {
    display: block !important;
  }
}

@media (min-width: 1024px) {
  [data-template-id="lunelle"] .lunelle-hero-stage {
    grid-template-columns: 1.02fr 0.98fr;
  }

  [data-template-id="lunelle"] .lunelle-hero-media-col {
    order: 1;
  }

  [data-template-id="lunelle"] .lunelle-hero-copy {
    order: 2;
    text-align: right;
  }

  [data-template-id="lunelle"] .lunelle-hero-detail {
    display: block !important;
  }

  [data-template-id="lunelle"] .lunelle-hero-ctas {
    justify-content: flex-start;
  }
}

/* =========================
   BUTTONS / LINKS
========================= */

[data-template-id="lunelle"] a[data-editable-link="true"],
[data-template-id="lunelle"] button {
  transition:
    transform 320ms cubic-bezier(.16,1,.3,1),
    box-shadow 320ms cubic-bezier(.16,1,.3,1),
    background-color 320ms cubic-bezier(.16,1,.3,1),
    color 320ms cubic-bezier(.16,1,.3,1),
    border-color 320ms cubic-bezier(.16,1,.3,1);
  will-change: transform;
}

[data-template-id="lunelle"] a[data-editable-link="true"]:hover,
[data-template-id="lunelle"] button:hover {
  transform: translateY(-3px);
}

/* Prevent global a { color: inherit } from swallowing dark CTAs */
[data-template-id="lunelle"] .lunelle-btn-primary,
[data-template-id="lunelle"] a.lunelle-btn-primary,
[data-template-id="lunelle"] button.lunelle-btn-primary,
[data-template-id="lunelle"] a[class*="bg-[#2a171c]"],
[data-template-id="lunelle"] button[class*="bg-[#2a171c]"],
[data-template-id="lunelle"] .lunelle-hero-chip {
  background: #2a171c !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  opacity: 1 !important;
}

[data-template-id="lunelle"] .lunelle-btn-primary > *,
[data-template-id="lunelle"] a[class*="bg-[#2a171c]"] > *,
[data-template-id="lunelle"] button[class*="bg-[#2a171c]"] > * {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  opacity: 1 !important;
}

[data-template-id="lunelle"] .lunelle-btn-secondary,
[data-template-id="lunelle"] a.lunelle-btn-secondary,
[data-template-id="lunelle"] button.lunelle-btn-secondary,
[data-template-id="lunelle"] a[class*="bg-white"] {
  background: #ffffff !important;
  color: #2a171c !important;
  -webkit-text-fill-color: #2a171c !important;
}

[data-template-id="lunelle"] .lunelle-btn-secondary > *,
[data-template-id="lunelle"] a[class*="bg-white"] > * {
  color: #2a171c !important;
  -webkit-text-fill-color: #2a171c !important;
}

[data-template-id="lunelle"] a[class*="hover:bg-[#2a171c]"]:hover,
[data-template-id="lunelle"] a[class*="hover:text-white"]:hover {
  background: #2a171c !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

[data-template-id="lunelle"] footer a[data-editable-link="true"] {
  color: rgba(255, 255, 255, 0.6) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.6) !important;
  background: transparent !important;
}

[data-template-id="lunelle"] .lunelle-magnetic {
  will-change: transform;
}

/* =========================
   FORM FOCUS EFFECTS
========================= */

[data-template-id="lunelle"] input,
[data-template-id="lunelle"] textarea,
[data-template-id="lunelle"] select {
  transition:
    border-color 250ms ease,
    box-shadow 250ms ease,
    background-color 250ms ease;
}

[data-template-id="lunelle"] input:focus,
[data-template-id="lunelle"] textarea:focus,
[data-template-id="lunelle"] select:focus {
  border-color: rgba(138, 79, 95, .45) !important;
  box-shadow: 0 0 0 5px rgba(232, 184, 193, .28);
}

/* =========================
   MARQUEE
========================= */

[data-template-id="lunelle"] .lunelle-marquee {
  overflow: hidden;
  white-space: nowrap;
}

[data-template-id="lunelle"] .lunelle-marquee-track {
  display: inline-flex;
  min-width: max-content;
  gap: 2rem;
  animation: lunelleMarquee 24s linear infinite;
}

[data-template-id="lunelle"] .lunelle-marquee {
  animation: lunelleMarquee 34s linear infinite;
}

/* =========================
   PREMIUM BACKGROUND DETAILS
========================= */

[data-template-id="lunelle"] .lunelle-template-root::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 88% 12%, rgba(232, 184, 193, .28), transparent 28%),
    radial-gradient(circle at 8% 72%, rgba(214, 162, 74, .15), transparent 30%),
    linear-gradient(180deg, #fff7f1 0%, #fff1e7 100%);
}

[data-template-id="lunelle"] .lunelle-template-root::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: .2;
  background-image:
    linear-gradient(rgba(42, 23, 28, .045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42, 23, 28, .045) 1px, transparent 1px);
  background-size: 54px 54px;
}

/* =========================
   KEYFRAMES
========================= */

@keyframes lunelleRevealUp {
  from {
    opacity: 0;
    transform: translateY(34px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lunelleFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-16px) rotate(-1.2deg);
  }
}

@keyframes lunellePulse {
  0%, 100% {
    opacity: .55;
    transform: scale(1);
  }
  50% {
    opacity: .95;
    transform: scale(1.08);
  }
}

@keyframes lunelleMarquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}

@keyframes lunelleShine {
  from {
    left: -42%;
  }
  to {
    left: 120%;
  }
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  [data-template-id="lunelle"] [data-section-kind] {
    scroll-margin-top: 92px;
  }

  [data-template-id="lunelle"] .lunelle-auto-reveal {
    transform: translateY(24px) scale(.99);
  }

  [data-template-id="lunelle"] .lunelle-card:hover,
  [data-template-id="lunelle"] [data-section-kind="service-card"]:hover,
  [data-template-id="lunelle"] [data-section-kind="gallery-image"]:hover,
  [data-template-id="lunelle"] [data-section-kind="testimonials"] article:hover {
    transform: translateY(-5px);
  }

  [data-template-id="lunelle"] .lunelle-contact-form:hover,
  [data-template-id="lunelle"] form[data-bizuply-block="lead-form"]:hover,
  [data-template-id="lunelle"] form[data-bizuply-crm-lead="true"]:hover {
    transform: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="lunelle"] *,
  [data-template-id="lunelle"] *::before,
  [data-template-id="lunelle"] *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;