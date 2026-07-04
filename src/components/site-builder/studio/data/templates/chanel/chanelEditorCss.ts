export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: rtl;
  background: #fff7f2;
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
}

[data-template-id="chanel"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="chanel"] img {
  display: block;
  max-width: 100%;
}

.chanel-home-site {
  min-height: 100vh;
  overflow-x: hidden;
  background: #fff7f2;
  color: #2b1b15;
}

.chanel-home-container,
.chanel-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}

/* HEADER */
.chanel-home-header,
.chanel-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 86px;
  background: rgba(255, 247, 242, 0.94);
  border-bottom: 1px solid rgba(43, 27, 21, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.chanel-home-nav,
.chanel-nav-wrap {
  width: min(1180px, calc(100% - 40px));
  height: 86px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  align-items: center;
  gap: 24px;
}

.chanel-home-logo,
.chanel-logo {
  justify-self: start;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.09em;
  color: #2b1b15;
}

.chanel-home-menu,
.chanel-nav {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 42px;
  color: rgba(43, 27, 21, 0.72);
  font-size: 13px;
  font-weight: 900;
}

.chanel-home-menu a,
.chanel-nav a {
  color: inherit;
}

.chanel-home-book-nav,
.chanel-nav-btn {
  justify-self: end;
  min-width: 138px;
  min-height: 54px;
  border-radius: 999px;
  background: #2b1b15;
  color: #fff7f2 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 18px 42px rgba(43, 27, 21, 0.18);
}

/* HERO */
.chanel-home-hero {
  position: relative;
  min-height: calc(100vh - 86px);
  overflow: hidden;
  background: #c85c68;
  color: #ffffff;
}

.chanel-home-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.chanel-home-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
  transform: scale(1.04);
}

.chanel-home-hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(
      90deg,
      rgba(80, 18, 28, 0.72) 0%,
      rgba(150, 58, 70, 0.42) 42%,
      rgba(255, 210, 205, 0.16) 100%
    ),
    radial-gradient(
      circle at 18% 40%,
      rgba(255, 255, 255, 0.2),
      transparent 32rem
    );
}

.chanel-home-hero-inner {
  position: relative;
  z-index: 3;
  width: min(1180px, calc(100% - 40px));
  min-height: calc(100vh - 86px);
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 92px 0 78px;
}

.chanel-home-hero-content {
  width: min(760px, 100%);
  text-align: right;
}

.chanel-home-eyebrow,
.chanel-home-small-label {
  margin: 0;
  color: #b94d5a;
  font-size: 12px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.chanel-home-hero .chanel-home-eyebrow {
  color: rgba(255, 255, 255, 0.94);
}

.chanel-home-hero h1 {
  margin: 24px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(64px, 8.6vw, 126px);
  line-height: 0.84;
  font-weight: 500;
  letter-spacing: -0.085em;
  color: #ffffff;
  text-shadow: 0 24px 90px rgba(70, 16, 25, 0.34);
}

.chanel-home-hero p:not(.chanel-home-eyebrow):not(.chanel-home-scroll-hint p) {
  margin: 30px 0 0;
  width: min(560px, 100%);
  color: rgba(255, 255, 255, 0.92);
  font-size: 19px;
  line-height: 1.9;
  font-weight: 700;
}

.chanel-home-hero-actions {
  margin-top: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.chanel-home-red-btn,
.chanel-home-outline-btn {
  min-height: 56px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  font-size: 14px;
  font-weight: 950;
}

.chanel-home-red-btn {
  background: #b94d5a;
  color: #ffffff !important;
  box-shadow: 0 24px 58px rgba(75, 16, 25, 0.34);
}

.chanel-home-outline-btn {
  border: 1px solid rgba(255, 255, 255, 0.46);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.chanel-home-scroll-hint {
  position: absolute;
  left: 0;
  bottom: 46px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 850;
}

.chanel-home-scroll-hint span {
  width: 36px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  position: relative;
}

.chanel-home-scroll-hint span::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #ffffff;
  transform: translateX(-50%);
  animation: chanelHomeScrollDot 1.7s ease-in-out infinite;
}

@keyframes chanelHomeScrollDot {
  0% {
    opacity: 0;
    transform: translate(-50%, 0);
  }

  35% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, 22px);
  }
}

/* INTRO */
.chanel-home-intro {
  position: relative;
  padding: 104px 0 78px;
  background: #ffffff;
}

.chanel-home-intro::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: rgba(43, 27, 21, 0.1);
}

.chanel-home-intro-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: 78px;
}

.chanel-home-intro-title h2,
.chanel-home-section-title h2,
.chanel-home-services-head h2,
.chanel-home-pricing-grid h2,
.chanel-home-booking h2,
.chanel-home-simple-page h1 {
  margin: 16px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(46px, 6vw, 82px);
  line-height: 0.94;
  font-weight: 500;
  letter-spacing: -0.07em;
  color: #2b1b15;
}

.chanel-home-intro-card {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: stretch;
}

.chanel-home-intro-image {
  min-height: 320px;
  overflow: hidden;
  border-radius: 7px;
  background: #f2d5d4;
}

.chanel-home-intro-image img,
.chanel-home-process-image img,
.chanel-home-service-image img,
.chanel-home-team-card img,
.chanel-home-price-thumb img,
.chanel-home-footer-image img,
.chanel-price-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chanel-home-intro-text-card {
  padding: 34px;
  background: #faf4f0;
  border: 1px solid rgba(43, 27, 21, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chanel-home-intro-text-card p {
  margin: 0;
  color: rgba(43, 27, 21, 0.64);
  font-size: 17px;
  line-height: 1.85;
  font-weight: 650;
}

.chanel-home-stats {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.chanel-home-stats strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 44px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.07em;
  color: #2b1b15;
}

.chanel-home-stats span {
  display: block;
  margin-top: 8px;
  color: rgba(43, 27, 21, 0.55);
  font-size: 13px;
  font-weight: 850;
}

.chanel-home-logo-row {
  width: min(1180px, calc(100% - 40px));
  margin: 76px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 36px;
  color: rgba(43, 27, 21, 0.28);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(22px, 3vw, 34px);
  letter-spacing: -0.06em;
}

/* SECTION TITLES */
.chanel-home-section-title {
  max-width: 820px;
  margin: 0 auto 64px;
  text-align: center;
}

/* PROCESS */
.chanel-home-process {
  padding: 112px 0 128px;
  background: #ffffff;
  overflow: hidden;
}

.chanel-home-process-layout {
  position: relative;
  min-height: 690px;
}

.chanel-home-process-card {
  position: absolute;
  width: 310px;
  min-height: 230px;
  padding: 32px;
  background: #f7f1ee;
  border: 1px solid rgba(43, 27, 21, 0.06);
  box-shadow: 0 24px 80px rgba(43, 27, 21, 0.07);
}

.chanel-home-process-card span {
  color: rgba(43, 27, 21, 0.35);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.chanel-home-process-card h3 {
  margin: 52px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.06em;
  color: #2b1b15;
}

.chanel-home-process-card p {
  margin: 14px 0 0;
  color: rgba(43, 27, 21, 0.6);
  font-size: 14px;
  line-height: 1.78;
  font-weight: 650;
}

.chanel-home-process-image {
  position: absolute;
  overflow: hidden;
  background: #f2d5d4;
  box-shadow: 0 24px 80px rgba(43, 27, 21, 0.09);
}

.chanel-home-process-card.card-one {
  right: 0;
  top: 128px;
}

.chanel-home-process-card.card-two {
  left: 345px;
  top: 30px;
}

.chanel-home-process-card.card-three {
  left: 0;
  bottom: 88px;
}

.chanel-home-process-image.image-one {
  right: 345px;
  top: 188px;
  width: 310px;
  height: 360px;
}

.chanel-home-process-image.image-two {
  left: 90px;
  bottom: 0;
  width: 330px;
  height: 315px;
}

/* SERVICES */
.chanel-home-services {
  padding: 112px 0 122px;
  background: #171413;
  color: #ffffff;
  overflow: hidden;
}

.chanel-home-services .chanel-home-small-label,
.chanel-home-testimonials .chanel-home-small-label,
.chanel-home-booking .chanel-home-small-label {
  color: #c85c68;
}

.chanel-home-services-head {
  max-width: 690px;
  margin: 0 auto 68px;
  text-align: center;
}

.chanel-home-services-head h2,
.chanel-home-testimonials h2,
.chanel-home-booking h2 {
  color: #ffffff;
}

.chanel-home-service-showcase {
  display: grid;
  gap: 34px;
}

.chanel-home-service-card {
  width: min(780px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 0;
  padding: 14px;
  background: #fffaf7;
  color: #2b1b15;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 32px 95px rgba(0, 0, 0, 0.28);
}

.chanel-home-service-card:nth-child(2) {
  transform: translateX(-54px);
  opacity: 0.92;
}

.chanel-home-service-card:nth-child(3) {
  transform: translateX(54px);
  opacity: 0.92;
}

.chanel-home-service-image {
  min-height: 340px;
  overflow: hidden;
  border-radius: 6px;
  background: #f2d5d4;
}

.chanel-home-service-info {
  padding: 34px;
}

.chanel-home-service-info h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.chanel-home-service-info p {
  margin: 18px 0 0;
  color: rgba(43, 27, 21, 0.62);
  font-size: 16px;
  line-height: 1.82;
  font-weight: 650;
}

.chanel-home-care-list {
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 18px;
  color: rgba(43, 27, 21, 0.74);
  font-size: 14px;
  font-weight: 850;
}

.chanel-home-care-list span::before {
  content: "•";
  color: #c85c68;
  margin-inline-end: 8px;
}

.chanel-home-service-bottom {
  margin-top: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chanel-home-service-bottom strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 36px;
  font-weight: 500;
  letter-spacing: -0.07em;
}

.chanel-home-service-bottom a {
  border-radius: 999px;
  background: #b94d5a;
  color: #ffffff !important;
  padding: 13px 22px;
  font-size: 14px;
  font-weight: 950;
}

/* TEAM */
.chanel-home-team {
  padding: 108px 0;
  background: #ffffff;
}

.chanel-home-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.chanel-home-team-card {
  text-align: center;
}

.chanel-home-team-card > div {
  height: 470px;
  overflow: hidden;
  background: #f2d5d4;
}

.chanel-home-team-card h3 {
  margin: 24px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.chanel-home-team-card p {
  margin: 9px 0 0;
  color: rgba(43, 27, 21, 0.56);
  font-weight: 850;
}

/* PRICING */
.chanel-home-pricing {
  padding: 110px 0;
  background: #faf4f0;
}

.chanel-home-pricing-grid {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 72px;
  align-items: start;
}

.chanel-home-pricing-grid > div:first-child {
  position: sticky;
  top: 120px;
}

.chanel-home-pricing-grid > div:first-child > p:not(.chanel-home-small-label) {
  margin: 24px 0 0;
  color: rgba(43, 27, 21, 0.62);
  font-size: 18px;
  line-height: 1.85;
  font-weight: 650;
}

.chanel-home-pricing-list {
  display: grid;
}

.chanel-home-price-row,
.chanel-price-row {
  display: grid;
  grid-template-columns: 78px 1fr 96px 110px;
  gap: 24px;
  align-items: center;
  padding: 26px 0;
  border-bottom: 1px solid rgba(43, 27, 21, 0.12);
}

.chanel-home-price-row > span,
.chanel-price-number {
  color: #b94d5a;
  font-weight: 950;
}

.chanel-home-price-row h3,
.chanel-price-main h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.chanel-home-price-row p,
.chanel-price-main p {
  margin: 8px 0 0;
  color: rgba(43, 27, 21, 0.58);
  font-weight: 650;
}

.chanel-home-price-thumb,
.chanel-price-image {
  width: 86px;
  height: 86px;
  overflow: hidden;
  border-radius: 999px;
  background: #f2d5d4;
}

.chanel-home-price-row strong,
.chanel-price-row strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.07em;
}

/* TESTIMONIALS */
.chanel-home-testimonials {
  padding: 112px 0 128px;
  background: #171413;
  color: #ffffff;
}

.chanel-home-testimonials-row {
  display: flex;
  gap: 24px;
  overflow: hidden;
}

.chanel-home-testimonials-row article {
  min-width: 360px;
  padding: 30px;
  background: #fffaf7;
  color: #2b1b15;
}

.chanel-home-testimonials-row span {
  color: #b94d5a;
  font-size: 12px;
  font-weight: 950;
}

.chanel-home-testimonials-row h3 {
  margin: 18px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-home-testimonials-row p {
  margin: 22px 0 0;
  color: rgba(43, 27, 21, 0.58);
  font-weight: 850;
}

/* BOOKING */
.chanel-home-booking {
  padding: 112px 0;
  background: #171413;
  color: #ffffff;
}

.chanel-home-booking-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 64px;
  align-items: start;
}

.chanel-home-booking-grid > div > p:not(.chanel-home-small-label) {
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 18px;
  line-height: 1.85;
  font-weight: 650;
}

.chanel-home-form {
  padding: 38px;
  background: #fffaf7;
  color: #2b1b15;
  box-shadow: 0 34px 100px rgba(0, 0, 0, 0.22);
}

.chanel-home-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.chanel-home-form input,
.chanel-home-form select,
.chanel-home-form textarea,
.chanel-home-newsletter input {
  width: 100%;
  border: 1px solid rgba(43, 27, 21, 0.12);
  background: #fff7f2;
  color: #2b1b15;
  padding: 16px 18px;
  outline: none;
  font: inherit;
  font-weight: 800;
}

.chanel-home-form > input,
.chanel-home-form select,
.chanel-home-form textarea {
  margin-top: 14px;
}

.chanel-home-form textarea {
  min-height: 150px;
  resize: vertical;
}

.chanel-home-form button,
.chanel-home-newsletter button {
  width: 100%;
  min-height: 56px;
  margin-top: 16px;
  border: none;
  background: #b94d5a;
  color: #ffffff;
  font: inherit;
  font-weight: 950;
  cursor: pointer;
}

/* FOOTER */
.chanel-home-footer,
.chanel-footer {
  overflow: hidden;
  background: #171413;
  color: #ffffff;
}

.chanel-home-footer-ticker,
.chanel-footer-gallery {
  display: inline-flex;
  min-width: max-content;
  gap: 20px;
  padding: 34px 0;
  animation: chanelHomeFooterTicker 42s linear infinite;
}

.chanel-home-footer-image,
.chanel-footer-ticker-item {
  position: relative;
  width: 286px;
  height: 210px;
  overflow: hidden;
  background: #f2d5d4;
}

.chanel-home-footer-image span,
.chanel-footer-ticker-item span {
  position: absolute;
  inset-inline-start: 14px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #ffffff;
  color: #2b1b15;
  font-weight: 950;
}

.chanel-footer-ticker-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes chanelHomeFooterTicker {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(50%);
  }
}

.chanel-home-footer-main,
.chanel-footer-main {
  padding: 78px 0 58px;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 72px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.chanel-home-footer-main h2,
.chanel-footer-title {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 76px);
  line-height: 0.92;
  font-weight: 500;
  letter-spacing: -0.07em;
}

.chanel-home-newsletter,
.chanel-newsletter {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 12px;
}

.chanel-home-newsletter input,
.chanel-newsletter input {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.14);
}

.chanel-home-newsletter button,
.chanel-newsletter button {
  margin: 0;
}

.chanel-home-footer-grid,
.chanel-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

.chanel-home-footer-grid > div,
.chanel-footer-grid > div {
  display: grid;
  align-content: start;
  gap: 12px;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 650;
}

.chanel-home-footer-grid strong,
.chanel-footer-heading,
.chanel-footer-brand {
  color: #ffffff;
}

/* SIMPLE PAGES */
.chanel-home-simple-page,
.chanel-simple-page {
  min-height: 72vh;
  padding: 120px 0;
  background: #fff7f2;
}

.chanel-home-simple-page h1,
.chanel-simple-page h1 {
  max-width: 820px;
}

.chanel-home-simple-page p:not(.chanel-home-small-label),
.chanel-simple-page p:not(.chanel-home-small-label) {
  max-width: 680px;
  margin-top: 24px;
  color: rgba(43, 27, 21, 0.62);
  font-size: 18px;
  line-height: 1.85;
  font-weight: 650;
}

/* REMOVE OLD EFFECTS */
.chanel-template-root .chanel-shine::before,
.chanel-template-root .chanel-image-glow::after {
  display: none !important;
  content: none !important;
}

.chanel-template-root .chanel-soft-float {
  animation: none !important;
}

.chanel-template-root .chanel-magnetic {
  transform: none !important;
}

.chanel-template-root article:hover,
.chanel-template-root form:hover,
.chanel-template-root .chanel-card:hover,
.chanel-template-root .chanel-service-card:hover,
.chanel-template-root .chanel-team-card:hover,
.chanel-template-root .chanel-blog-card:hover,
.chanel-template-root .chanel-process-card:hover,
.chanel-template-root .chanel-price-row:hover {
  transform: none !important;
}

/* RESPONSIVE */
@media (max-width: 1080px) {
  .chanel-home-nav,
  .chanel-nav-wrap {
    grid-template-columns: 1fr auto;
  }

  .chanel-home-menu,
  .chanel-nav {
    display: none;
  }

  .chanel-home-book-nav,
  .chanel-nav-btn {
    justify-self: end;
  }

  .chanel-home-intro-grid,
  .chanel-home-intro-card,
  .chanel-home-pricing-grid,
  .chanel-home-booking-grid,
  .chanel-home-footer-main,
  .chanel-footer-main {
    grid-template-columns: 1fr;
  }

  .chanel-home-pricing-grid > div:first-child {
    position: static;
  }

  .chanel-home-process-layout {
    min-height: auto;
    display: grid;
    gap: 22px;
  }

  .chanel-home-process-card,
  .chanel-home-process-card.card-one,
  .chanel-home-process-card.card-two,
  .chanel-home-process-card.card-three,
  .chanel-home-process-image,
  .chanel-home-process-image.image-one,
  .chanel-home-process-image.image-two {
    position: static;
    width: 100%;
  }

  .chanel-home-process-image {
    height: 340px;
  }

  .chanel-home-service-card,
  .chanel-home-service-card:nth-child(2),
  .chanel-home-service-card:nth-child(3) {
    transform: none;
  }

  .chanel-home-team-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .chanel-home-header,
  .chanel-home-nav,
  .chanel-header,
  .chanel-nav-wrap {
    height: 76px;
  }

  .chanel-home-nav,
  .chanel-nav-wrap,
  .chanel-home-container,
  .chanel-container,
  .chanel-home-hero-inner,
  .chanel-home-logo-row {
    width: min(100% - 28px, 1180px);
  }

  .chanel-home-logo,
  .chanel-logo {
    font-size: 32px;
  }

  .chanel-home-book-nav,
  .chanel-nav-btn {
    min-width: 110px;
    min-height: 46px;
    padding: 0 16px;
    font-size: 12px;
  }

  .chanel-home-hero,
  .chanel-home-hero-inner {
    min-height: 680px;
  }

  .chanel-home-hero-inner {
    padding: 62px 0 54px;
  }

  .chanel-home-hero h1 {
    font-size: 56px;
  }

  .chanel-home-hero p:not(.chanel-home-eyebrow):not(.chanel-home-scroll-hint p) {
    font-size: 16px;
  }

  .chanel-home-hero-actions {
    display: grid;
    width: 100%;
  }

  .chanel-home-scroll-hint {
    display: none;
  }

  .chanel-home-intro,
  .chanel-home-process,
  .chanel-home-services,
  .chanel-home-team,
  .chanel-home-pricing,
  .chanel-home-testimonials,
  .chanel-home-booking {
    padding: 76px 0;
  }

  .chanel-home-intro-title h2,
  .chanel-home-section-title h2,
  .chanel-home-services-head h2,
  .chanel-home-pricing-grid h2,
  .chanel-home-booking h2 {
    font-size: 44px;
  }

  .chanel-home-logo-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .chanel-home-stats,
  .chanel-home-form-grid,
  .chanel-home-footer-grid,
  .chanel-footer-grid,
  .chanel-home-newsletter,
  .chanel-newsletter {
    grid-template-columns: 1fr;
  }

  .chanel-home-service-card {
    grid-template-columns: 1fr;
  }

  .chanel-home-service-image {
    min-height: 280px;
  }

  .chanel-home-care-list {
    grid-template-columns: 1fr;
  }

  .chanel-home-price-row,
  .chanel-price-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .chanel-home-price-thumb,
  .chanel-price-image {
    width: 80px;
    height: 80px;
  }

  .chanel-home-testimonials-row {
    display: grid;
  }

  .chanel-home-testimonials-row article {
    min-width: 0;
  }
}
  /* SCROLL MOTION SUPPORT */
.chanel-template-root .chanel-motion-item {
  transition: none !important;
}

.chanel-template-root .chanel-motion-hero {
  transition: none !important;
}

.chanel-template-root .chanel-home-hero-content {
  transition: none !important;
}

/* fix preview/editor scroll */
[data-template-id="chanel"] {
  overflow-y: visible !important;
}

.chanel-template-root,
.chanel-home-site {
  overflow-y: visible !important;
}

/* אין אפקטים בעכבר */
.chanel-template-root *:hover {
  animation-play-state: running;
}
`;