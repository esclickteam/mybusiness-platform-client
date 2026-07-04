export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: rtl;
  background: #fff8f3;
  color: #241711;
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
  background: #fff8f3;
  color: #241711;
}

.chanel-home-container {
  width: min(1180px, calc(100% - 44px));
  margin-inline: auto;
}

.chanel-kicker {
  margin: 0;
  color: #c95660;
  font-size: 11px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chanel-home-header {
  position: sticky;
  top: 0;
  z-index: 80;
  height: 76px;
  background: rgba(255, 248, 243, 0.9);
  border-bottom: 1px solid rgba(36, 23, 17, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.chanel-home-nav {
  width: min(1180px, calc(100% - 44px));
  height: 76px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: 170px 1fr 170px;
  align-items: center;
  gap: 22px;
}

.chanel-home-logo {
  justify-self: end;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.09em;
  color: #241711;
}

.chanel-home-menu {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 38px;
  color: rgba(36, 23, 17, 0.63);
  font-size: 12px;
  font-weight: 900;
}

.chanel-home-book-nav,
.chanel-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border-radius: 999px;
  background: #c95660;
  color: #ffffff !important;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 950;
  box-shadow: 0 18px 40px rgba(201, 86, 96, 0.21);
}

.chanel-home-book-nav {
  justify-self: start;
  min-width: 132px;
  background: #241711;
  box-shadow: 0 18px 42px rgba(36, 23, 17, 0.15);
}

/* HERO - no text over images */
.chanel-hero-section {
  padding: 70px 0 58px;
  background:
    radial-gradient(circle at 50% 0%, rgba(201, 86, 96, 0.08), transparent 34rem),
    #fff8f3;
}

.chanel-hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr minmax(280px, 390px) 0.78fr;
  gap: 42px;
  align-items: center;
  min-height: 610px;
}

.chanel-hero-left {
  align-self: center;
  max-width: 530px;
}

.chanel-hero-left h1 {
  margin: 18px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(54px, 6.1vw, 92px);
  line-height: 0.94;
  font-weight: 500;
  letter-spacing: -0.075em;
  color: #241711;
}

.chanel-hero-left > p:not(.chanel-kicker) {
  max-width: 420px;
  margin: 26px 0 0;
  color: rgba(36, 23, 17, 0.56);
  font-size: 16px;
  line-height: 1.9;
  font-weight: 700;
}

.chanel-hero-left .chanel-primary-btn {
  margin-top: 30px;
}

.chanel-hero-visual {
  position: relative;
  width: 100%;
  min-height: 450px;
  overflow: hidden;
  background: #f2dfda;
  box-shadow: 0 28px 90px rgba(36, 23, 17, 0.12);
}

.chanel-hero-visual img {
  width: 100%;
  height: 100%;
  min-height: 450px;
  object-fit: cover;
}

.chanel-hero-visual span {
  position: absolute;
  left: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: #c95660;
}

.chanel-hero-stats {
  align-self: end;
  display: grid;
  gap: 20px;
  padding-bottom: 50px;
}

.chanel-hero-stats div {
  border-top: 1px solid rgba(36, 23, 17, 0.12);
  padding-top: 20px;
}

.chanel-hero-stats strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 48px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.08em;
}

.chanel-hero-stats p {
  margin: 10px 0 0;
  color: rgba(36, 23, 17, 0.5);
  font-size: 12px;
  font-weight: 850;
}

.chanel-partners-row {
  margin-top: 22px;
  border-top: 1px solid rgba(36, 23, 17, 0.12);
  border-bottom: 1px solid rgba(36, 23, 17, 0.12);
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  color: rgba(36, 23, 17, 0.44);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  letter-spacing: -0.06em;
}

.chanel-section-center {
  width: min(760px, calc(100% - 44px));
  margin: 0 auto 70px;
  text-align: center;
}

.chanel-section-center h2,
.chanel-dark-title h2,
.chanel-faq-grid h2,
.chanel-contact-form h2,
.chanel-footer-main h2,
.chanel-simple-page h1 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 76px);
  line-height: 0.94;
  font-weight: 500;
  letter-spacing: -0.075em;
}

.chanel-journey-section {
  padding: 96px 0 110px;
  background: #ffffff;
}

.chanel-journey-grid {
  position: relative;
  min-height: 560px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;
}

.chanel-journey-card {
  background: #fbf6f2;
  border: 1px solid rgba(36, 23, 17, 0.07);
  min-height: 260px;
}

.chanel-journey-card:nth-child(2),
.chanel-journey-card:nth-child(4) {
  margin-top: 105px;
}

.chanel-journey-card:nth-child(3) {
  margin-top: 42px;
}

.chanel-journey-image {
  height: 150px;
  overflow: hidden;
  background: #f1ddd7;
}

.chanel-journey-image img,
.chanel-service-image img,
.chanel-team-image img,
.chanel-price-image img,
.chanel-faq-image-stack img,
.chanel-contact-image img,
.chanel-blog-card img,
.chanel-footer-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chanel-journey-copy {
  padding: 24px;
}

.chanel-journey-copy span,
.chanel-price-number {
  color: #c95660;
  font-size: 12px;
  font-weight: 950;
}

.chanel-journey-copy h3 {
  margin: 18px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-journey-copy p {
  margin: 12px 0 0;
  color: rgba(36, 23, 17, 0.55);
  line-height: 1.75;
  font-size: 14px;
  font-weight: 650;
}

.chanel-services-section,
.chanel-testimonials-section,
.chanel-footer {
  background: #181514;
  color: #ffffff;
}

.chanel-services-section {
  padding: 105px 0 120px;
  overflow: hidden;
}

.chanel-dark-title {
  width: min(650px, 100%);
  margin: 0 auto 64px;
  text-align: center;
}

.chanel-services-list {
  width: min(880px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 18px;
}

.chanel-service-row {
  display: grid;
  grid-template-columns: 250px 1fr 92px;
  gap: 26px;
  align-items: center;
  padding: 18px;
  background: #fffaf6;
  color: #241711;
  border-radius: 9px;
}

.chanel-service-image {
  height: 190px;
  overflow: hidden;
  background: #ead6d0;
}

.chanel-service-copy h3 {
  margin: 12px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.chanel-service-copy > p:not(.chanel-kicker) {
  margin: 14px 0 0;
  color: rgba(36, 23, 17, 0.58);
  line-height: 1.75;
  font-weight: 650;
}

.chanel-service-meta {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.chanel-service-meta span {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f3e7e2;
  color: rgba(36, 23, 17, 0.68);
  font-size: 12px;
  font-weight: 850;
}

.chanel-service-row > strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-team-section,
.chanel-pricing-section,
.chanel-faq-section,
.chanel-contact-section,
.chanel-blog-section,
.chanel-simple-page {
  padding: 105px 0;
  background: #ffffff;
}

.chanel-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.chanel-team-card:nth-child(2),
.chanel-team-card:nth-child(4) {
  margin-top: 80px;
}

.chanel-team-image {
  height: 335px;
  overflow: hidden;
  background: #ead6d0;
}

.chanel-team-info {
  padding-top: 18px;
  text-align: center;
}

.chanel-team-info h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-team-info p {
  margin: 8px 0 0;
  color: rgba(36, 23, 17, 0.52);
  font-size: 13px;
  font-weight: 800;
}

.chanel-pricing-list {
  width: min(880px, calc(100% - 44px));
  margin-inline: auto;
}

.chanel-price-row {
  position: relative;
  display: grid;
  grid-template-columns: 70px 1fr 96px 92px;
  gap: 22px;
  align-items: center;
  padding: 22px 26px;
  border-bottom: 1px solid rgba(36, 23, 17, 0.1);
}

.chanel-price-row.is-featured {
  background: #bd4f59;
  color: #ffffff;
}

.chanel-price-row.is-featured .chanel-price-number,
.chanel-price-row.is-featured p {
  color: rgba(255, 255, 255, 0.76);
}

.chanel-price-title h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.065em;
}

.chanel-price-title p {
  margin: 8px 0 0;
  color: rgba(36, 23, 17, 0.54);
  font-size: 13px;
  font-weight: 750;
}

.chanel-price-image {
  width: 92px;
  height: 92px;
  overflow: hidden;
  border-radius: 999px;
  background: #ead6d0;
}

.chanel-price-row strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-testimonials-section {
  padding: 100px 0 120px;
  overflow: hidden;
}

.chanel-testimonials-track {
  display: flex;
  gap: 22px;
  width: max-content;
  padding-inline: max(22px, calc((100vw - 1180px) / 2));
}

.chanel-testimonials-track article {
  width: 420px;
  min-height: 230px;
  padding: 28px;
  background: #fffaf6;
  color: #241711;
}

.chanel-testimonials-track span {
  color: #c95660;
  font-weight: 950;
}

.chanel-testimonials-track h3 {
  margin: 18px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  line-height: 1.16;
  font-weight: 500;
  letter-spacing: -0.05em;
}

.chanel-testimonials-track p {
  margin: 28px 0 0;
  color: rgba(36, 23, 17, 0.58);
  font-weight: 850;
}

.chanel-faq-grid,
.chanel-contact-grid {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 70px;
  align-items: center;
}

.chanel-faq-image-stack {
  position: relative;
  min-height: 460px;
}

.chanel-faq-image-stack img {
  position: absolute;
  object-fit: cover;
  box-shadow: 0 22px 70px rgba(36, 23, 17, 0.12);
}

.chanel-faq-image-stack img:nth-child(1) {
  width: 300px;
  height: 360px;
  right: 60px;
  top: 50px;
}

.chanel-faq-image-stack img:nth-child(2) {
  width: 150px;
  height: 140px;
  left: 54px;
  top: 10px;
}

.chanel-faq-image-stack img:nth-child(3) {
  width: 130px;
  height: 120px;
  left: 100px;
  bottom: 30px;
}

.chanel-faq-list {
  margin-top: 36px;
  display: grid;
}

.chanel-faq-row {
  display: grid;
  grid-template-columns: 44px 1fr 34px;
  gap: 18px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid rgba(36, 23, 17, 0.11);
}

.chanel-faq-row span {
  color: #c95660;
  font-size: 12px;
  font-weight: 950;
}

.chanel-faq-row h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: rgba(36, 23, 17, 0.78);
}

.chanel-faq-row button {
  border: none;
  width: 34px;
  height: 34px;
  background: #c95660;
  color: #fff;
  cursor: pointer;
}

.chanel-contact-image {
  height: 470px;
  overflow: hidden;
  background: #ead6d0;
}

.chanel-contact-form {
  padding: 36px;
  background: #fffaf6;
  border: 1px solid rgba(36, 23, 17, 0.08);
  box-shadow: 0 24px 80px rgba(36, 23, 17, 0.08);
}

.chanel-contact-form > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 22px;
}

.chanel-contact-form input,
.chanel-contact-form select,
.chanel-contact-form textarea,
.chanel-newsletter-form input {
  width: 100%;
  border: 1px solid rgba(36, 23, 17, 0.12);
  background: #ffffff;
  color: #241711;
  padding: 15px 16px;
  font: inherit;
  font-weight: 750;
  outline: none;
}

.chanel-contact-form > input,
.chanel-contact-form select,
.chanel-contact-form textarea {
  margin-top: 12px;
}

.chanel-contact-form textarea {
  min-height: 130px;
  resize: vertical;
}

.chanel-contact-form button,
.chanel-newsletter-form button {
  width: 100%;
  min-height: 52px;
  margin-top: 14px;
  border: none;
  background: #c95660;
  color: #ffffff;
  font: inherit;
  font-weight: 950;
  cursor: pointer;
}

.chanel-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.chanel-blog-card > div {
  height: 210px;
  overflow: hidden;
  background: #ead6d0;
}

.chanel-blog-card .chanel-kicker {
  margin-top: 20px;
}

.chanel-blog-card h3 {
  margin: 12px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.055em;
}

.chanel-footer {
  overflow: hidden;
  padding-top: 0;
}

.chanel-footer-strip {
  display: flex;
  gap: 8px;
  overflow: hidden;
}

.chanel-footer-strip div {
  width: 185px;
  height: 112px;
  flex: 0 0 auto;
  background: #ead6d0;
}

.chanel-footer-main {
  padding: 70px 0 46px;
  display: grid;
  grid-template-columns: 1fr 1.08fr;
  gap: 70px;
}

.chanel-newsletter-form {
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 128px;
  gap: 10px;
}

.chanel-newsletter-form input {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.14);
}

.chanel-newsletter-form button {
  margin: 0;
}

.chanel-footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.chanel-footer-links div {
  display: grid;
  gap: 11px;
  color: rgba(255, 255, 255, 0.56);
  font-weight: 650;
}

.chanel-footer-links strong {
  color: #ffffff;
}

.chanel-footer-brand {
  margin: 18px 0 -12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(86px, 17vw, 230px);
  line-height: 0.8;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.chanel-simple-page {
  min-height: 72vh;
}

.chanel-simple-page p:not(.chanel-kicker) {
  max-width: 680px;
  margin-top: 24px;
  color: rgba(36, 23, 17, 0.6);
  line-height: 1.9;
  font-size: 18px;
  font-weight: 700;
}

/* Runtime motion support: actual motion is calculated in pages.tsx */
.chanel-template-root .chanel-scroll-motion-item,
.chanel-template-root .chanel-motion-image img,
.chanel-template-root .chanel-hero-visual img,
.chanel-template-root .chanel-hero-inner,
.chanel-template-root .chanel-testimonials-track {
  transition: none !important;
}

.chanel-template-root article:hover,
.chanel-template-root a:hover,
.chanel-template-root button:hover,
.chanel-template-root form:hover {
  transform: none !important;
}

@media (max-width: 1080px) {
  .chanel-home-nav {
    grid-template-columns: 1fr auto;
  }

  .chanel-home-menu {
    display: none;
  }

  .chanel-hero-grid,
  .chanel-faq-grid,
  .chanel-contact-grid,
  .chanel-footer-main {
    grid-template-columns: 1fr;
  }

  .chanel-journey-grid,
  .chanel-team-grid,
  .chanel-blog-grid {
    grid-template-columns: 1fr 1fr;
  }

  .chanel-journey-card:nth-child(n),
  .chanel-team-card:nth-child(n) {
    margin-top: 0;
  }

  .chanel-service-row {
    grid-template-columns: 220px 1fr;
  }

  .chanel-service-row > strong {
    grid-column: 2;
  }
}

@media (max-width: 760px) {
  .chanel-home-header,
  .chanel-home-nav {
    height: 68px;
  }

  .chanel-home-nav,
  .chanel-home-container,
  .chanel-section-center,
  .chanel-pricing-list {
    width: min(100% - 28px, 1180px);
  }

  .chanel-home-logo {
    font-size: 31px;
  }

  .chanel-home-book-nav {
    min-height: 42px;
    min-width: 110px;
    padding: 0 16px;
  }

  .chanel-hero-section,
  .chanel-journey-section,
  .chanel-services-section,
  .chanel-team-section,
  .chanel-pricing-section,
  .chanel-faq-section,
  .chanel-contact-section,
  .chanel-blog-section {
    padding: 72px 0;
  }

  .chanel-hero-grid {
    min-height: auto;
    gap: 28px;
  }

  .chanel-hero-left h1 {
    font-size: 52px;
  }

  .chanel-hero-visual,
  .chanel-hero-visual img,
  .chanel-contact-image {
    min-height: 360px;
    height: 360px;
  }

  .chanel-hero-stats {
    padding-bottom: 0;
  }

  .chanel-partners-row {
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 0;
  }

  .chanel-journey-grid,
  .chanel-team-grid,
  .chanel-blog-grid,
  .chanel-footer-links,
  .chanel-newsletter-form,
  .chanel-contact-form > div {
    grid-template-columns: 1fr;
  }

  .chanel-service-row {
    grid-template-columns: 1fr;
  }

  .chanel-service-row > strong {
    grid-column: auto;
  }

  .chanel-price-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .chanel-faq-image-stack {
    min-height: 340px;
  }

  .chanel-faq-image-stack img:nth-child(1) {
    width: 240px;
    height: 300px;
    right: 20px;
  }
}
`;
