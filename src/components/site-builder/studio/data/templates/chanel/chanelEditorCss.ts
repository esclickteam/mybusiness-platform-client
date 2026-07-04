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
  background: #fff9f5;
  color: #2b1b15;
}

.apsora-container {
  width: min(1170px, calc(100% - 48px));
  margin-inline: auto;
}

.apsora-header {
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(255, 249, 245, 0.96);
  border-bottom: 1px solid rgba(43, 27, 21, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
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
  font-size: 42px;
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
  color: rgba(43, 27, 21, 0.72);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
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
  background: #2b1b15;
  color: #fff9f5 !important;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 18px 48px rgba(43, 27, 21, 0.16);
}

.apsora-hero {
  position: relative;
  background: #fff9f5;
  overflow: hidden;
}

.apsora-hero-image {
  height: clamp(260px, 37vw, 470px);
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid rgba(184, 78, 97, .32);
}

.apsora-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 46%;
  transform: scale(1.045);
  filter: saturate(1.02) contrast(1.02);
}

.apsora-ticker {
  height: 64px;
  overflow: hidden;
  background: #b84e61;
  color: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(43, 27, 21, 0.08);
}

.apsora-ticker-track {
  direction: ltr;
  min-width: max-content;
  display: inline-flex;
  align-items: center;
  gap: 34px;
  animation: apsoraTicker 34s linear infinite;
}

.apsora-ticker span:not(.apsora-flower) {
  direction: rtl;
  font-size: 14px;
  font-weight: 950;
  white-space: nowrap;
}

.apsora-flower {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 24px;
  line-height: 1;
}

@keyframes apsoraTicker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.333%);
  }
}

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
  background: #fff;
  color: rgba(43, 27, 21, 0.62);
  font-size: 13px;
  font-weight: 850;
}

.apsora-pill .apsora-flower {
  color: #b84e61;
  font-size: 16px;
}

.apsora-pill.is-dark {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.78);
}

.apsora-about {
  padding: 104px 0 70px;
  background: #fff;
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

.apsora-red-button {
  min-height: 55px;
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #b84e61;
  color: #fff !important;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .02em;
  box-shadow: 0 18px 44px rgba(184, 78, 97, 0.2);
}

.apsora-about-main {
  max-width: 790px;
}

.apsora-about-main > .apsora-pill {
  margin-bottom: 28px;
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
  min-height: 265px;
  overflow: hidden;
  border-radius: 8px;
  background: #f6e2df;
}

.apsora-about-media img,
.apsora-therapy-image img,
.apsora-team-image img,
.apsora-price-image img,
.apsora-faq-art img,
.apsora-contact-image img,
.apsora-blog-card img,
.apsora-footer-strip img,
.apsora-process-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  min-height: 265px;
  padding: 36px;
  border: 1px solid rgba(43, 27, 21, 0.12);
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.apsora-process,
.apsora-team,
.apsora-pricing,
.apsora-faq,
.apsora-contact,
.apsora-blog,
.apsora-simple-page {
  padding: 112px 0;
  background: #fff;
  overflow: hidden;
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
  border: 1px solid rgba(43, 27, 21, 0.1);
  border-radius: 6px;
  background: #f8f8f8;
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
  font-weight: 700;
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
  border-radius: 4px;
  background: #f2d7d3;
}

.apsora-process-card.card-one { top: 20px; right: 0; }
.apsora-process-image.image-one { top: 220px; right: 0; width: 255px; height: 160px; }
.apsora-process-card.card-two { top: 76px; right: 320px; }
.apsora-process-image.image-two { top: 28px; left: 206px; width: 260px; height: 350px; }
.apsora-process-card.card-three { bottom: 24px; left: 0; }

.apsora-services {
  padding: 108px 0 124px;
  background: #171716;
  color: #fff;
  overflow: hidden;
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
  width: min(740px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 285px 1fr;
  gap: 0;
  padding: 14px;
  border-radius: 10px;
  background: #fff;
  color: #2b1b15;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.22);
}

.apsora-therapy-card.is-offset {
  transform: translateX(-64px);
}

.apsora-therapy-image {
  min-height: 225px;
  overflow: hidden;
  border-radius: 7px;
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
}

.apsora-price-list {
  margin: 72px auto 0;
  width: min(900px, 100%);
  display: grid;
}

.apsora-price-row {
  position: relative;
  display: grid;
  grid-template-columns: 80px 1fr 90px 100px;
  gap: 24px;
  align-items: center;
  min-height: 86px;
  padding: 17px 24px;
  border-top: 1px solid rgba(43, 27, 21, .1);
}

.apsora-price-row:last-child {
  border-bottom: 1px solid rgba(43, 27, 21, .1);
}

.apsora-price-row.is-active {
  background: #b84e61;
  color: #fff;
}

.apsora-price-row.is-active .apsora-price-number,
.apsora-price-row.is-active p {
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

.apsora-testimonials {
  padding: 112px 0;
  background: #171716;
  color: #fff;
  overflow: hidden;
}

.apsora-testimonial-track {
  width: min(1380px, calc(100% - 48px));
  margin: 68px auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(270px, 1fr));
  gap: 24px;
}

.apsora-testimonial-card {
  min-height: 245px;
  padding: 28px;
  background: #fff;
  color: #2b1b15;
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

.apsora-faq-grid,
.apsora-contact-grid {
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
}

.apsora-faq-art .mini {
  position: absolute;
  width: 92px;
  height: 92px;
  overflow: hidden;
}

.apsora-faq-art .mini.one { top: 0; left: 120px; }
.apsora-faq-art .mini.two { top: 170px; left: 0; }
.apsora-faq-art .mini.three { bottom: 28px; left: 170px; }

.apsora-faq-content > .apsora-pill,
.apsora-contact-content > .apsora-pill {
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
}

.apsora-contact-image {
  height: 440px;
  overflow: hidden;
  background: #f2d7d3;
}

.apsora-contact-form {
  margin-top: 42px;
  padding-bottom: 7px;
  border-bottom: 6px solid #b84e61;
}

.apsora-contact-form .two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.apsora-contact-form input,
.apsora-contact-form select,
.apsora-contact-form textarea,
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
}

.apsora-contact-form textarea {
  min-height: 132px;
  padding-top: 17px;
  resize: vertical;
}

.apsora-contact-form button,
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
}

.apsora-blog-grid {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.apsora-blog-card {
  min-height: 220px;
  padding: 26px;
  border: 1px solid rgba(43, 27, 21, .1);
  display: grid;
  grid-template-columns: 1fr 92px;
  grid-template-rows: auto 1fr;
  gap: 16px;
  align-items: end;
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
}

.apsora-footer {
  background: #171716;
  color: #fff;
  overflow: hidden;
}

.apsora-footer-strip {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  height: 116px;
  overflow: hidden;
}

.apsora-footer-strip img {
  min-width: 0;
  height: 116px;
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

/* Apsora 1:1 hover / luxury motion */
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
.apsora-nav-cta {
  transition:
    transform 0.65s cubic-bezier(.22, 1, .36, 1),
    opacity 0.65s cubic-bezier(.22, 1, .36, 1),
    filter 0.65s cubic-bezier(.22, 1, .36, 1),
    background-color 0.65s cubic-bezier(.22, 1, .36, 1),
    color 0.65s cubic-bezier(.22, 1, .36, 1),
    border-color 0.65s cubic-bezier(.22, 1, .36, 1),
    box-shadow 0.65s cubic-bezier(.22, 1, .36, 1) !important;
}

.apsora-red-button:hover,
.apsora-nav-cta:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 24px 62px rgba(184, 78, 97, 0.28);
}

.apsora-therapy-card:hover,
.apsora-team-card:hover,
.apsora-blog-card:hover,
.apsora-testimonial-card:hover {
  transform: translateY(-10px) !important;
}

.apsora-therapy-image,
.apsora-team-image,
.apsora-blog-card div,
.apsora-price-image,
.apsora-about-media,
.apsora-process-image,
.apsora-contact-image,
.apsora-faq-art .mini {
  overflow: hidden;
}

.apsora-therapy-card:hover img,
.apsora-team-card:hover img,
.apsora-blog-card:hover img,
.apsora-price-row:hover img,
.apsora-about-media:hover img,
.apsora-process-image:hover img,
.apsora-contact-image:hover img,
.apsora-faq-art .mini:hover img {
  transform: scale(1.07) !important;
}

.apsora-price-row:hover {
  background: #b84e61;
  color: #fff;
}

.apsora-price-row:hover .apsora-price-number,
.apsora-price-row:hover p {
  color: rgba(255, 255, 255, .76);
}

.apsora-menu a {
  position: relative;
}

.apsora-menu a::after {
  content: "";
  position: absolute;
  left: 0;
  right: auto;
  bottom: -8px;
  width: 0;
  height: 1px;
  background: #b84e61;
  transition: width .45s cubic-bezier(.22, 1, .36, 1);
}

.apsora-menu a:hover::after {
  width: 100%;
}

.apsora-menu a:hover {
  color: #2b1b15;
}

.apsora-footer-strip {
  position: relative;
  display: flex;
  width: max-content;
  animation: apsoraFooterMarquee 34s linear infinite;
}

@keyframes apsoraFooterMarquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

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
    font-size: 33px;
  }

  .apsora-menu {
    display: none;
  }

  .apsora-nav-cta {
    min-width: 116px;
    min-height: 46px;
    font-size: 12px;
  }

  .apsora-hero-image {
    height: 300px;
  }

  .apsora-about,
  .apsora-process,
  .apsora-team,
  .apsora-pricing,
  .apsora-faq,
  .apsora-contact,
  .apsora-blog,
  .apsora-services,
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
  .apsora-footer-newsletter div,
  .apsora-footer-links {
    grid-template-columns: 1fr;
  }

  .apsora-therapy-card.is-offset {
    transform: none;
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
}
`;
