export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: rtl;
  background: #fff9f5;
  color: #2b1b15;
  font-family:
    Assistant,
    Heebo,
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  overflow-x: hidden;
  font-synthesis: none;
  text-rendering: geometricPrecision;
}

[data-template-id="chanel"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="chanel"] img {
  display: block;
  max-width: 100%;
}

.apsora-site {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 0%, rgba(184, 78, 97, 0.08), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(43, 27, 21, 0.07), transparent 28%),
    linear-gradient(180deg, #fffaf7 0%, #fff6f0 44%, #fffaf7 100%);
  color: #2b1b15;
}

.apsora-container {
  width: min(1170px, calc(100% - 48px));
  margin-inline: auto;
}

/* HEADER */
.apsora-header {
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(255, 249, 245, 0.78);
  border-bottom: 1px solid rgba(43, 27, 21, 0.08);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  transition:
    background-color .55s cubic-bezier(.22,1,.36,1),
    box-shadow .55s cubic-bezier(.22,1,.36,1),
    border-color .55s cubic-bezier(.22,1,.36,1),
    transform .55s cubic-bezier(.22,1,.36,1);
}

.apsora-header.is-scrolled {
  background: rgba(255, 249, 245, 0.92);
  border-bottom-color: rgba(43, 27, 21, 0.1);
  box-shadow: 0 18px 70px rgba(43, 27, 21, 0.09);
}

.apsora-nav {
  direction: ltr;
  width: min(1170px, calc(100% - 48px));
  height: 86px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: 185px minmax(0, 1fr) 185px;
  align-items: center;
  column-gap: 28px;
}

.apsora-logo {
  grid-column: 3;
  justify-self: end;
  direction: ltr;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 45px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.095em;
  color: #261812;
}

.apsora-menu {
  grid-column: 2;
  justify-self: center;
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  color: rgba(43, 27, 21, 0.68);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
}

.apsora-menu a {
  position: relative;
  transition:
    color .45s cubic-bezier(.22,1,.36,1),
    transform .45s cubic-bezier(.22,1,.36,1);
}

.apsora-menu a::after {
  content: "";
  position: absolute;
  right: 0;
  left: 0;
  bottom: -9px;
  height: 1px;
  background: #b84e61;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform .45s cubic-bezier(.22,1,.36,1);
}

.apsora-menu a:hover {
  color: #2b1b15;
  transform: translateY(-1px);
}

.apsora-menu a:hover::after {
  transform: scaleX(1);
}

.apsora-nav-cta {
  grid-column: 1;
  justify-self: start;
  direction: rtl;
  min-width: 150px;
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #b84e61;
  color: #fff !important;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 18px 48px rgba(184, 78, 97, 0.22);
  transition:
    background .45s cubic-bezier(.22,1,.36,1),
    transform .45s cubic-bezier(.22,1,.36,1),
    box-shadow .45s cubic-bezier(.22,1,.36,1);
}

.apsora-nav-cta:hover {
  background: #a94254;
  transform: translateY(-4px);
  box-shadow: 0 26px 70px rgba(184, 78, 97, 0.34);
}

/* HERO */
.apsora-hero {
  position: relative;
  background: #171716;
  overflow: hidden;
  min-height: 92vh;
  isolation: isolate;
}

.apsora-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 249, 245, 0.28), transparent 34%),
    radial-gradient(circle at 78% 12%, rgba(184, 78, 97, 0.17), transparent 32%),
    linear-gradient(90deg, rgba(23, 23, 22, 0.70), rgba(23, 23, 22, 0.25) 46%, rgba(23, 23, 22, 0.08));
}

.apsora-hero::after {
  content: "";
  position: absolute;
  z-index: 3;
  pointer-events: none;
  inset: auto 6vw 7vh auto;
  width: min(38vw, 520px);
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  border: 1px solid rgba(255, 249, 245, 0.18);
  background: radial-gradient(circle, rgba(255, 249, 245, 0.12), transparent 68%);
}

.apsora-hero-image {
  position: relative;
  height: 92vh;
  min-height: 680px;
  width: 100%;
  overflow: hidden;
  border-bottom: none;
  background:
    linear-gradient(135deg, #211715, #ead9d4);
}

.apsora-hero-image::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(23, 23, 22, 0.05), rgba(23, 23, 22, 0.22)),
    radial-gradient(circle at 72% 20%, rgba(255,255,255,.18), transparent 32%);
}

.apsora-hero-image::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 0%, rgba(23,23,22,.12) 74%, rgba(255,249,245,.96) 100%);
}

.apsora-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 44%;
  transform: scale(1.08);
  filter: brightness(.78) contrast(1.08) saturate(.92);
  will-change: transform;
}

/* TICKER - REMOVED */
.apsora-ticker,
.apsora-ticker-track,
.apsora-ticker span,
.apsora-flower.apsora-ticker-flower {
  display: none !important;
}

.apsora-ticker {
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

.apsora-ticker-track {
  animation: none !important;
}

@keyframes apsoraTicker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.333%);
  }
}

/* SHARED */
.apsora-pill {
  width: max-content;
  min-height: 35px;
  padding: 0 17px;
  border: 1px solid rgba(43, 27, 21, 0.12);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.78);
  color: rgba(43, 27, 21, 0.62);
  font-size: 13px;
  font-weight: 850;
  box-shadow: 0 12px 34px rgba(43, 27, 21, 0.05);
  backdrop-filter: blur(14px);
}

.apsora-pill .apsora-flower {
  color: #b84e61;
  font-size: 16px;
}

.apsora-pill.is-dark {
  background: rgba(255, 255, 255, 0.055);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.78);
  box-shadow: none;
}

.apsora-red-button {
  min-height: 55px;
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #b84e61;
  color: #fff !important;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .02em;
  box-shadow: 0 18px 44px rgba(184, 78, 97, 0.22);
  transition:
    background .45s cubic-bezier(.22,1,.36,1),
    transform .45s cubic-bezier(.22,1,.36,1),
    box-shadow .45s cubic-bezier(.22,1,.36,1);
}

.apsora-red-button:hover {
  background: #a94254;
  transform: translateY(-4px);
  box-shadow: 0 28px 72px rgba(184, 78, 97, 0.34);
}

.apsora-about-main h1,
.apsora-section-title h2,
.apsora-services-title h2,
.apsora-faq-content h2,
.apsora-contact-content h2,
.apsora-simple-page h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5.4vw, 78px);
  line-height: .98;
  font-weight: 500;
  letter-spacing: -0.075em;
  color: #2b1b15;
  text-wrap: balance;
}

/* ABOUT */
.apsora-about {
  padding: 112px 0 78px;
  background:
    radial-gradient(circle at 12% 12%, rgba(184, 78, 97, 0.06), transparent 30%),
    #fffaf7;
}

.apsora-about-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  column-gap: 72px;
}

.apsora-about-side {
  display: flex;
  align-items: end;
  justify-content: start;
  padding-bottom: 86px;
}

.apsora-about-main {
  max-width: 790px;
}

.apsora-about-main > .apsora-pill {
  margin-bottom: 28px;
}

.apsora-about-cards {
  margin-top: 46px;
  display: grid;
  grid-template-columns: minmax(280px, 1.05fr) minmax(260px, .95fr);
  gap: 28px;
  align-items: stretch;
}

.apsora-about-media {
  position: relative;
  min-height: 285px;
  overflow: hidden;
  border-radius: 18px;
  background: #f6e2df;
  box-shadow: 0 28px 80px rgba(43, 27, 21, 0.11);
}

.apsora-about-media img,
.apsora-therapy-image img,
.apsora-team-image img,
.apsora-price-image img,
.apsora-faq-art img,
.apsora-contact-image img,
.apsora-blog-card img,
.apsora-footer-strip img,
.apsora-process-image img,
.apsora-gallery-item img,
.apsora-booking-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform .85s cubic-bezier(.22,1,.36,1),
    filter .85s cubic-bezier(.22,1,.36,1);
}

.apsora-about-media span {
  position: absolute;
  inset-inline-end: 20px;
  bottom: 18px;
  width: 39px;
  height: 39px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #b84e61;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
}

.apsora-about-stat-card {
  min-height: 285px;
  padding: 36px;
  border: 1px solid rgba(43, 27, 21, 0.10);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 24px 70px rgba(43, 27, 21, 0.06);
  backdrop-filter: blur(16px);
}

.apsora-about-stat-card > p {
  margin: 0;
  max-width: 430px;
  color: rgba(43, 27, 21, 0.56);
  font-size: 15px;
  line-height: 1.8;
  font-weight: 650;
}

.apsora-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid rgba(43, 27, 21, 0.1);
}

.apsora-stat-grid div {
  padding-top: 26px;
}

.apsora-stat-grid div + div {
  padding-inline-start: 30px;
  border-inline-start: 1px solid rgba(43, 27, 21, 0.1);
}

.apsora-stat-grid strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.08em;
}

.apsora-stat-grid span {
  display: block;
  margin-top: 8px;
  color: rgba(43, 27, 21, 0.54);
  font-size: 12px;
  line-height: 1.45;
  font-weight: 750;
}

.apsora-brand-row {
  width: min(1170px, calc(100% - 48px));
  margin: 76px auto 0;
  padding-top: 36px;
  border-top: 1px solid rgba(43, 27, 21, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  color: #171716;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -0.08em;
}

/* PROCESS / TEAM / PRICING / FAQ / CONTACT */
.apsora-process,
.apsora-team,
.apsora-pricing,
.apsora-faq,
.apsora-contact,
.apsora-blog,
.apsora-gallery-page,
.apsora-booking-page,
.apsora-simple-page {
  padding: 112px 0;
  background: #fffaf7;
  overflow: hidden;
}

.apsora-process,
.apsora-pricing,
.apsora-blog,
.apsora-booking-page {
  background:
    radial-gradient(circle at 86% 10%, rgba(184, 78, 97, 0.055), transparent 32%),
    #fffaf7;
}

.apsora-team,
.apsora-faq,
.apsora-contact,
.apsora-gallery-page,
.apsora-simple-page {
  background: #ffffff;
}

.apsora-section-title,
.apsora-services-title {
  text-align: center;
  display: grid;
  justify-items: center;
}

.apsora-section-title .apsora-pill,
.apsora-services-title .apsora-pill {
  margin-bottom: 24px;
}

.apsora-process-layout {
  position: relative;
  min-height: 610px;
  margin-top: 86px;
}

.apsora-process-card {
  position: absolute;
  width: 255px;
  min-height: 205px;
  padding: 30px;
  border: 1px solid rgba(43, 27, 21, 0.09);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 22px 70px rgba(43, 27, 21, 0.06);
  backdrop-filter: blur(16px);
}

.apsora-process-card span,
.apsora-price-number,
.apsora-blog-card span,
.apsora-testimonial-card span {
  color: rgba(43, 27, 21, 0.48);
  font-size: 12px;
  font-weight: 850;
}

.apsora-process-card h3 {
  margin: 72px 0 0;
  font-size: 19px;
  line-height: 1.2;
  font-weight: 800;
  color: #2b1b15;
}

.apsora-process-card p {
  margin: 14px 0 0;
  color: rgba(43, 27, 21, 0.52);
  font-size: 13px;
  line-height: 1.7;
  font-weight: 600;
}

.apsora-process-image {
  position: absolute;
  overflow: hidden;
  border-radius: 18px;
  background: #f2d7d3;
  box-shadow: 0 28px 80px rgba(43, 27, 21, 0.12);
}

.apsora-process-card.card-one { top: 20px; right: 0; }
.apsora-process-image.image-one { top: 220px; right: 0; width: 255px; height: 160px; }
.apsora-process-card.card-two { top: 76px; right: 320px; }
.apsora-process-image.image-two { top: 28px; left: 206px; width: 260px; height: 350px; }
.apsora-process-card.card-three { bottom: 24px; left: 0; }

/* SERVICES DARK */
.apsora-services {
  position: relative;
  padding: 118px 0 132px;
  background:
    radial-gradient(circle at 20% 8%, rgba(184, 78, 97, 0.20), transparent 32%),
    radial-gradient(circle at 80% 22%, rgba(255, 255, 255, 0.06), transparent 28%),
    #171716;
  color: #fff;
  overflow: hidden;
}

.apsora-services::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255,255,255,.02), transparent 45%),
    radial-gradient(circle at 50% 100%, rgba(255, 249, 245, 0.06), transparent 40%);
}

.apsora-services > * {
  position: relative;
  z-index: 1;
}

.apsora-services-title h2,
.apsora-section-title.is-dark h2 {
  color: #fff;
}

.apsora-therapy-list {
  margin-top: 72px;
  display: grid;
  gap: 26px;
}

.apsora-therapy-card {
  width: min(760px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 285px 1fr;
  gap: 0;
  padding: 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  color: #2b1b15;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.25);
}

.apsora-therapy-card.is-offset {
  transform: translateX(-64px);
}

.apsora-therapy-image {
  min-height: 225px;
  overflow: hidden;
  border-radius: 16px;
  background: #f2d7d3;
}

.apsora-therapy-content {
  padding: 30px 34px;
}

.apsora-therapy-content h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.apsora-therapy-content p {
  margin: 20px 0 0;
  color: rgba(43, 27, 21, 0.58);
  font-size: 14px;
  line-height: 1.78;
  font-weight: 650;
}

.apsora-therapy-meta {
  margin-top: 34px;
  padding-top: 20px;
  border-top: 1px solid rgba(43, 27, 21, .12);
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: #b84e61;
  font-weight: 900;
}

/* TEAM */
.apsora-team-grid {
  margin-top: 70px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.apsora-team-card {
  min-width: 0;
}

.apsora-team-image {
  height: 355px;
  overflow: hidden;
  background: #f2d7d3;
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(43, 27, 21, 0.10);
}

.apsora-team-body {
  padding-top: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 18px;
  align-items: start;
}

.apsora-team-body h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.apsora-team-body p {
  grid-column: 1;
  margin: 0;
  color: rgba(43, 27, 21, .55);
  font-weight: 850;
}

.apsora-team-body span {
  grid-column: 2;
  grid-row: 1 / span 2;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(43, 27, 21, .12);
  border-radius: 999px;
  display: grid;
  place-items: center;
  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    background-color .45s cubic-bezier(.22,1,.36,1),
    color .45s cubic-bezier(.22,1,.36,1);
}

/* PRICING */
.apsora-price-list {
  margin: 72px auto 0;
  width: min(900px, 100%);
  display: grid;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 28px 90px rgba(43, 27, 21, 0.07);
  border: 1px solid rgba(43, 27, 21, .08);
  background: #fff;
}

.apsora-price-row {
  position: relative;
  display: grid;
  grid-template-columns: 80px 1fr 90px 100px;
  gap: 24px;
  align-items: center;
  min-height: 86px;
  padding: 17px 24px;
  border-top: 1px solid rgba(43, 27, 21, .08);
  background: #fff;
  transition:
    background-color .5s cubic-bezier(.22,1,.36,1),
    color .5s cubic-bezier(.22,1,.36,1),
    transform .5s cubic-bezier(.22,1,.36,1);
}

.apsora-price-row:first-child {
  border-top: none;
}

.apsora-price-row:last-child {
  border-bottom: none;
}

.apsora-price-row.is-active,
.apsora-price-row:hover,
.apsora-price-row.is-hovered {
  background: #b84e61;
  color: #fff;
}

.apsora-price-row.is-active .apsora-price-number,
.apsora-price-row.is-active p,
.apsora-price-row:hover .apsora-price-number,
.apsora-price-row:hover p,
.apsora-price-row.is-hovered .apsora-price-number,
.apsora-price-row.is-hovered p {
  color: rgba(255, 255, 255, .76);
}

.apsora-price-main h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.apsora-price-main p {
  margin: 8px 0 0;
  color: rgba(43, 27, 21, .52);
  font-size: 12px;
  font-weight: 650;
}

.apsora-price-image {
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 999px;
  background: #f2d7d3;
}

.apsora-price-row strong {
  justify-self: end;
  font-weight: 950;
}

/* TESTIMONIALS */
.apsora-testimonials {
  position: relative;
  padding: 118px 0;
  background:
    radial-gradient(circle at 16% 18%, rgba(184, 78, 97, 0.18), transparent 30%),
    radial-gradient(circle at 92% 30%, rgba(255, 255, 255, 0.07), transparent 28%),
    #171716;
  color: #fff;
  overflow: hidden;
}

.apsora-testimonial-track {
  width: min(1380px, calc(100% - 48px));
  margin: 68px auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(270px, 1fr));
  gap: 24px;
  transition: transform .8s cubic-bezier(.22,1,.36,1);
}

.apsora-testimonial-card {
  min-height: 245px;
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.95);
  color: #2b1b15;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
}

.apsora-testimonial-card p {
  margin: 22px 0 0;
  color: rgba(43, 27, 21, .58);
  font-size: 14px;
  line-height: 1.75;
  font-weight: 650;
}

.apsora-testimonial-card strong {
  display: block;
  margin-top: 28px;
  color: #2b1b15;
}

/* FAQ / CONTACT */
.apsora-faq-grid,
.apsora-contact-grid,
.apsora-booking-grid {
  display: grid;
  grid-template-columns: .95fr 1.05fr;
  gap: 70px;
  align-items: center;
}

.apsora-faq-art {
  position: relative;
  min-height: 480px;
}

.apsora-faq-art > img {
  position: absolute;
  top: 80px;
  right: 80px;
  width: 300px;
  height: 380px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 28px 90px rgba(43, 27, 21, 0.12);
}

.apsora-faq-art .mini {
  position: absolute;
  width: 92px;
  height: 92px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(43, 27, 21, 0.12);
}

.apsora-faq-art .mini.one { top: 0; left: 120px; }
.apsora-faq-art .mini.two { top: 170px; left: 0; }
.apsora-faq-art .mini.three { bottom: 28px; left: 170px; }

.apsora-faq-content > .apsora-pill,
.apsora-contact-content > .apsora-pill,
.apsora-booking-content > .apsora-pill {
  margin-bottom: 22px;
}

.apsora-faq-list {
  margin-top: 44px;
  border-top: 1px solid rgba(43, 27, 21, .1);
}

.apsora-faq-row {
  display: grid;
  grid-template-columns: 52px 1fr 34px;
  align-items: center;
  gap: 22px;
  padding: 21px 0;
  border-bottom: 1px solid rgba(43, 27, 21, .1);
  cursor: pointer;
}

.apsora-faq-row span {
  color: rgba(43, 27, 21, .45);
  font-size: 13px;
  font-weight: 850;
}

.apsora-faq-row p {
  margin: 0;
  color: rgba(43, 27, 21, .7);
  font-weight: 800;
}

.apsora-faq-row strong {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: #b84e61;
  color: #fff;
  border-radius: 999px;
  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    background-color .45s cubic-bezier(.22,1,.36,1);
}

.apsora-faq-row.is-open strong {
  transform: rotate(45deg);
  background: #171716;
}

.apsora-contact-image,
.apsora-booking-image {
  height: 440px;
  overflow: hidden;
  background: #f2d7d3;
  border-radius: 24px;
  box-shadow: 0 28px 90px rgba(43, 27, 21, 0.12);
}

.apsora-contact-form,
.apsora-booking-form {
  margin-top: 42px;
  padding: 22px;
  border: 1px solid rgba(43, 27, 21, .08);
  border-bottom: 6px solid #b84e61;
  border-radius: 24px;
  background: rgba(255, 255, 255, .74);
  box-shadow: 0 24px 70px rgba(43, 27, 21, 0.06);
  backdrop-filter: blur(16px);
}

.apsora-contact-form .two,
.apsora-booking-form .two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.apsora-contact-form input,
.apsora-contact-form select,
.apsora-contact-form textarea,
.apsora-booking-form input,
.apsora-booking-form select,
.apsora-booking-form textarea,
.apsora-footer-newsletter input {
  width: 100%;
  min-height: 54px;
  border: 1px solid rgba(43, 27, 21, .1);
  background: #fff;
  color: #2b1b15;
  padding: 0 18px;
  outline: none;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  border-radius: 14px;
  transition:
    border-color .35s cubic-bezier(.22,1,.36,1),
    box-shadow .35s cubic-bezier(.22,1,.36,1),
    background-color .35s cubic-bezier(.22,1,.36,1);
}

.apsora-contact-form input:focus,
.apsora-contact-form select:focus,
.apsora-contact-form textarea:focus,
.apsora-booking-form input:focus,
.apsora-booking-form select:focus,
.apsora-booking-form textarea:focus,
.apsora-footer-newsletter input:focus {
  border-color: rgba(184, 78, 97, .45);
  box-shadow: 0 0 0 4px rgba(184, 78, 97, .09);
}

.apsora-contact-form textarea,
.apsora-booking-form textarea {
  min-height: 132px;
  padding-top: 17px;
  resize: vertical;
}

.apsora-contact-form button,
.apsora-booking-form button,
.apsora-footer-newsletter button {
  width: 100%;
  min-height: 54px;
  margin-top: 12px;
  border: none;
  background: #b84e61;
  color: #fff;
  font: inherit;
  font-weight: 950;
  cursor: pointer;
  border-radius: 999px;
  transition:
    background .45s cubic-bezier(.22,1,.36,1),
    transform .45s cubic-bezier(.22,1,.36,1),
    box-shadow .45s cubic-bezier(.22,1,.36,1);
}

.apsora-contact-form button:hover,
.apsora-booking-form button:hover,
.apsora-footer-newsletter button:hover {
  background: #a94254;
  transform: translateY(-4px);
  box-shadow: 0 24px 64px rgba(184, 78, 97, 0.30);
}

/* GALLERY */
.apsora-gallery-grid {
  margin-top: 68px;
  display: grid;
  grid-template-columns: 1.1fr .9fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.apsora-gallery-item {
  min-height: 330px;
  overflow: hidden;
  background: #f2d7d3;
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(43, 27, 21, 0.09);
}

.apsora-gallery-item.is-tall {
  min-height: 520px;
}

.apsora-gallery-item.is-small {
  min-height: 245px;
}

/* BLOG */
.apsora-blog-grid {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.apsora-blog-card {
  min-height: 220px;
  padding: 26px;
  border: 1px solid rgba(43, 27, 21, .09);
  border-radius: 24px;
  background: rgba(255, 255, 255, .74);
  display: grid;
  grid-template-columns: 1fr 92px;
  grid-template-rows: auto 1fr;
  gap: 16px;
  align-items: end;
  box-shadow: 0 24px 70px rgba(43, 27, 21, 0.06);
}

.apsora-blog-card h3 {
  grid-column: 1;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.055em;
}

.apsora-blog-card div {
  grid-column: 2;
  grid-row: 1 / span 2;
  width: 92px;
  height: 92px;
  overflow: hidden;
  align-self: end;
  border-radius: 22px;
}

/* FOOTER */
.apsora-footer {
  background:
    radial-gradient(circle at 16% 10%, rgba(184, 78, 97, 0.18), transparent 30%),
    #171716;
  color: #fff;
  overflow: hidden;
}

.apsora-footer-strip {
  position: relative;
  display: flex;
  width: max-content;
  min-width: 200%;
  height: 116px;
  overflow: hidden;
  animation: apsoraFooterMarquee 38s linear infinite;
}

.apsora-footer-strip img {
  width: 150px;
  min-width: 150px;
  height: 116px;
  flex: 0 0 150px;
  object-fit: cover;
}

.apsora-footer-main {
  width: min(1170px, calc(100% - 48px));
  margin-inline: auto;
  padding: 58px 0 72px;
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 70px;
}

.apsora-footer-newsletter p {
  margin: 0 0 18px;
  color: rgba(255,255,255,.86);
  font-size: 18px;
  font-weight: 750;
}

.apsora-footer-newsletter div {
  display: grid;
  grid-template-columns: 1fr 130px;
  gap: 10px;
}

.apsora-footer-newsletter input {
  border-color: rgba(255, 255, 255, .16);
  background: rgba(255, 255, 255, .08);
  color: #fff;
}

.apsora-footer-newsletter button {
  margin: 0;
}

.apsora-footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

.apsora-footer-links div {
  display: grid;
  align-content: start;
  gap: 10px;
  color: rgba(255,255,255,.58);
  font-size: 14px;
  font-weight: 650;
}

.apsora-footer-links strong {
  color: #fff;
}

.apsora-simple-page {
  min-height: 76vh;
}

.apsora-simple-page h1 {
  margin-top: 22px;
}

.apsora-simple-page p:not(.apsora-pill p) {
  max-width: 680px;
  margin: 28px 0 0;
  color: rgba(43, 27, 21, .62);
  font-size: 18px;
  line-height: 1.8;
  font-weight: 650;
}

/* LUXURY MOTION */
.apsora-site a,
.apsora-site button,
.apsora-site article,
.apsora-site img,
.apsora-therapy-card,
.apsora-team-card,
.apsora-blog-card,
.apsora-price-row,
.apsora-testimonial-card,
.apsora-red-button,
.apsora-nav-cta,
.apsora-team-body span,
.apsora-contact-form button,
.apsora-booking-form button,
.apsora-footer-newsletter button,
.apsora-process-card,
.apsora-gallery-item,
.apsora-about-stat-card,
.apsora-about-media {
  transition:
    transform .72s cubic-bezier(.22, 1, .36, 1),
    opacity .72s cubic-bezier(.22, 1, .36, 1),
    filter .72s cubic-bezier(.22, 1, .36, 1),
    background-color .72s cubic-bezier(.22, 1, .36, 1),
    color .72s cubic-bezier(.22, 1, .36, 1),
    border-color .72s cubic-bezier(.22, 1, .36, 1),
    box-shadow .72s cubic-bezier(.22, 1, .36, 1) !important;
}

.apsora-therapy-card,
.apsora-team-card,
.apsora-blog-card,
.apsora-testimonial-card,
.apsora-price-row,
.apsora-process-card,
.apsora-gallery-item,
.apsora-about-stat-card,
.apsora-about-media {
  will-change: transform;
}

.apsora-therapy-card:hover,
.apsora-team-card:hover,
.apsora-blog-card:hover,
.apsora-testimonial-card:hover,
.apsora-process-card:hover,
.apsora-gallery-item:hover,
.apsora-about-stat-card:hover,
.apsora-about-media:hover {
  transform: translateY(-10px);
}

.apsora-therapy-image,
.apsora-team-image,
.apsora-blog-card div,
.apsora-price-image,
.apsora-about-media,
.apsora-process-image,
.apsora-contact-image,
.apsora-booking-image,
.apsora-faq-art .mini,
.apsora-gallery-item {
  overflow: hidden;
}

.apsora-therapy-card:hover img,
.apsora-team-card:hover img,
.apsora-blog-card:hover img,
.apsora-price-row:hover img,
.apsora-about-media:hover img,
.apsora-process-image:hover img,
.apsora-contact-image:hover img,
.apsora-booking-image:hover img,
.apsora-faq-art .mini:hover img,
.apsora-gallery-item:hover img {
  transform: scale(1.08) !important;
  filter: saturate(1.04) contrast(1.03);
}

.apsora-team-card:hover .apsora-team-body span {
  transform: rotate(45deg);
  background: #b84e61;
  color: #fff;
  border-color: #b84e61;
}

@keyframes apsoraFooterMarquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* RESPONSIVE */
@media (max-width: 1060px) {
  .apsora-nav {
    grid-template-columns: 150px 1fr 150px;
  }

  .apsora-menu {
    gap: 26px;
  }

  .apsora-about-grid,
  .apsora-faq-grid,
  .apsora-contact-grid,
  .apsora-booking-grid,
  .apsora-footer-main {
    grid-template-columns: 1fr;
  }

  .apsora-about-side {
    padding: 0;
  }

  .apsora-about-main {
    max-width: none;
  }

  .apsora-process-layout {
    min-height: auto;
    display: grid;
    gap: 20px;
  }

  .apsora-process-card,
  .apsora-process-image,
  .apsora-process-card.card-one,
  .apsora-process-card.card-two,
  .apsora-process-card.card-three,
  .apsora-process-image.image-one,
  .apsora-process-image.image-two {
    position: static;
    width: 100%;
    height: auto;
  }

  .apsora-process-image {
    height: 280px;
  }

  .apsora-testimonial-track,
  .apsora-team-grid,
  .apsora-blog-grid {
    grid-template-columns: 1fr;
  }

  .apsora-gallery-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .apsora-container,
  .apsora-nav,
  .apsora-footer-main,
  .apsora-brand-row {
    width: min(100% - 28px, 1170px);
  }

  .apsora-nav {
    height: 74px;
    grid-template-columns: auto 1fr auto;
  }

  .apsora-logo {
    font-size: 34px;
  }

  .apsora-menu {
    display: none;
  }

  .apsora-nav-cta {
    min-width: 116px;
    min-height: 46px;
    font-size: 12px;
  }

  .apsora-hero {
    min-height: 86vh;
  }

  .apsora-hero-image {
    height: 86vh;
    min-height: 520px;
  }

  .apsora-hero-image img {
    object-position: center center;
  }

  .apsora-hero::after {
    width: 72vw;
    inset: auto -12vw 5vh auto;
  }

  .apsora-about,
  .apsora-process,
  .apsora-team,
  .apsora-pricing,
  .apsora-faq,
  .apsora-contact,
  .apsora-blog,
  .apsora-services,
  .apsora-gallery-page,
  .apsora-booking-page,
  .apsora-simple-page {
    padding: 78px 0;
  }

  .apsora-about-main h1,
  .apsora-section-title h2,
  .apsora-services-title h2,
  .apsora-faq-content h2,
  .apsora-contact-content h2,
  .apsora-simple-page h1 {
    font-size: 43px;
  }

  .apsora-about-cards,
  .apsora-therapy-card,
  .apsora-price-row,
  .apsora-contact-form .two,
  .apsora-booking-form .two,
  .apsora-footer-newsletter div,
  .apsora-footer-links,
  .apsora-gallery-grid {
    grid-template-columns: 1fr;
  }

  .apsora-therapy-card.is-offset {
    transform: none;
  }

  .apsora-price-row {
    gap: 14px;
  }

  .apsora-brand-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .apsora-faq-art {
    min-height: 360px;
  }

  .apsora-faq-art > img {
    right: 0;
    top: 50px;
    width: 240px;
    height: 300px;
  }

  .apsora-gallery-item,
  .apsora-gallery-item.is-tall,
  .apsora-gallery-item.is-small {
    min-height: 320px;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="chanel"] *,
  [data-template-id="chanel"] *::before,
  [data-template-id="chanel"] *::after {
    animation: none !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   CHANEL WOW EFFECTS - Apsora-like original interaction layer
   ========================================================= */
.apsora-hero-wow {
  height: 100vh;
  min-height: 760px;
}

.apsora-hero-wow .apsora-hero-image {
  height: 100vh;
  min-height: 760px;
}

.apsora-hero-content {
  position: absolute;
  inset-inline-start: max(6vw, 32px);
  top: 50%;
  z-index: 7;
  width: min(720px, calc(100% - 56px));
  transform: translate3d(0, -50%, 0);
  color: #fff;
  display: grid;
  gap: 22px;
  pointer-events: auto;
}

.apsora-hero-kicker {
  width: max-content;
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.84);
  font-size: 13px;
  font-weight: 900;
  backdrop-filter: blur(18px);
}

.apsora-hero-title {
  margin: 0;
  max-width: 790px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(58px, 8.8vw, 138px);
  line-height: .86;
  font-weight: 500;
  letter-spacing: -0.095em;
  color: #fff;
  text-shadow: 0 24px 90px rgba(0,0,0,.36);
}

.apsora-hero-subtitle {
  margin: 0;
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: clamp(15px, 1.35vw, 19px);
  line-height: 1.86;
  font-weight: 650;
}

.apsora-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-top: 8px;
}

.apsora-hero-primary,
.apsora-hero-secondary {
  min-height: 58px;
  padding: 0 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 950;
}

.apsora-hero-primary {
  background: #fff;
  color: #171716 !important;
  box-shadow: 0 24px 70px rgba(0,0,0,.22);
}

.apsora-hero-secondary {
  border: 1px solid rgba(255,255,255,.28);
  background: rgba(255,255,255,.08);
  color: #fff !important;
  backdrop-filter: blur(16px);
}

.apsora-hero-floating {
  position: absolute;
  z-index: 6;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 28px;
  box-shadow: 0 28px 90px rgba(0,0,0,.25);
  background: rgba(255,255,255,.08);
  transform: translate3d(var(--apsora-float-x, 0px), var(--apsora-float-y, 0px), 0) rotate(var(--apsora-float-r, 0deg)) scale(var(--apsora-float-scale, 1));
  will-change: transform, opacity;
}

.apsora-hero-floating img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(.96) contrast(1.04) saturate(.96);
  transform: scale(1.08);
}

.apsora-hero-floating.is-one {
  width: clamp(128px, 15vw, 230px);
  height: clamp(158px, 20vw, 295px);
  inset-inline-end: 9vw;
  top: 17vh;
  --apsora-float-r: 7deg;
}

.apsora-hero-floating.is-two {
  width: clamp(112px, 13vw, 190px);
  height: clamp(112px, 13vw, 190px);
  inset-inline-end: 25vw;
  bottom: 9vh;
  border-radius: 999px;
  --apsora-float-r: -8deg;
}

.apsora-hero-stat {
  position: absolute;
  z-index: 7;
  inset-inline-end: 8vw;
  bottom: 9vh;
  min-width: 178px;
  padding: 20px 22px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 24px;
  background: rgba(255,255,255,.1);
  color: #fff;
  backdrop-filter: blur(20px);
  box-shadow: 0 22px 70px rgba(0,0,0,.2);
}

.apsora-hero-stat strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 44px;
  line-height: .9;
  letter-spacing: -.08em;
}

.apsora-hero-stat span {
  display: block;
  margin-top: 8px;
  color: rgba(255,255,255,.72);
  font-size: 12px;
  line-height: 1.45;
  font-weight: 850;
}

.apsora-soft-ticker {
  height: 72px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-block: 1px solid rgba(43,27,21,.08);
  background: linear-gradient(90deg, rgba(255,255,255,.74), rgba(255,246,241,.92), rgba(255,255,255,.74));
  color: rgba(43,27,21,.72);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
}

.apsora-soft-ticker-track {
  direction: ltr;
  min-width: max-content;
  display: inline-flex;
  align-items: center;
  gap: 34px;
  animation: chanelSoftTicker 31s linear infinite;
  will-change: transform;
}

.apsora-soft-ticker span:not(.apsora-flower) {
  direction: rtl;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .02em;
}

.apsora-soft-ticker .apsora-flower {
  color: #b84e61;
  font-size: 19px;
}

@keyframes chanelSoftTicker {
  from { transform: translateX(0); }
  to { transform: translateX(-33.333%); }
}

.apsora-process-card {
  transform: translate3d(0, var(--chanel-card-y, 0px), 0);
}

.apsora-therapy-card {
  transform: translate3d(var(--chanel-therapy-x, 0px), 0, 0);
}

.apsora-therapy-card.is-offset {
  transform: translate3d(calc(var(--chanel-therapy-x, 0px) - 64px), 0, 0);
}

.apsora-section-inview .apsora-section-title,
.apsora-section-inview .apsora-services-title {
  transform: translate3d(0, calc((1 - var(--chanel-section-progress, 1)) * 40px), 0);
}

.apsora-testimonial-track {
  will-change: transform;
}

@media (max-width: 760px) {
  .apsora-hero-content {
    inset-inline-start: 20px;
    width: calc(100% - 40px);
    top: 54%;
    gap: 16px;
  }

  .apsora-hero-title {
    font-size: clamp(48px, 16vw, 78px);
  }

  .apsora-hero-subtitle {
    max-width: 92%;
    font-size: 14px;
  }

  .apsora-hero-floating.is-one {
    width: 112px;
    height: 146px;
    inset-inline-end: 18px;
    top: 90px;
    opacity: .76;
  }

  .apsora-hero-floating.is-two,
  .apsora-hero-stat {
    display: none;
  }
}

`;