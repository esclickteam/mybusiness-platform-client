export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: rtl;
  background: #ffffff;
  color: #2a1b16;
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
  background: #ffffff;
  color: #2a1b16;
}

.chanel-container {
  width: min(1230px, calc(100% - 56px));
  margin-inline: auto;
}

.chanel-home-header {
  position: sticky;
  top: 0;
  z-index: 80;
  height: 88px;
  background: rgba(255, 250, 247, 0.94);
  border-bottom: 1px solid rgba(42, 27, 22, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.chanel-home-nav {
  width: min(1230px, calc(100% - 56px));
  height: 88px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 220px;
  align-items: center;
}

.chanel-home-logo {
  grid-column: 3;
  justify-self: end;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.11em;
  color: #2a1b16;
}

.chanel-home-menu {
  grid-column: 2;
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 54px;
  color: rgba(42, 27, 22, 0.62);
  font-size: 13px;
  font-weight: 850;
}

.chanel-home-book-nav {
  grid-column: 1;
  justify-self: start;
  min-width: 150px;
  min-height: 58px;
  border-radius: 999px;
  background: #2a1b16;
  color: #fff8f4 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: 26px;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 22px 65px rgba(42, 27, 22, 0.16);
}

.chanel-hero {
  position: relative;
  height: 34vh;
  min-height: 290px;
  overflow: hidden;
  background: #c85a6d;
}

.chanel-hero-bg {
  position: absolute;
  inset: 0;
}

.chanel-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 45%;
  filter: saturate(0.94) contrast(1.03);
  transform: scale(1.08);
}

.chanel-hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(133, 44, 65, 0.65), rgba(195, 90, 105, 0.34), rgba(255, 255, 255, 0.08)),
    radial-gradient(circle at 26% 24%, rgba(255,255,255,.28), transparent 28rem);
}

.chanel-ticker-strip {
  height: 56px;
  overflow: hidden;
  background: #9e4258;
  color: #fff;
  display: flex;
  align-items: center;
}

.chanel-ticker-track {
  display: flex;
  min-width: max-content;
  align-items: center;
  gap: 42px;
  font-size: 13px;
  font-weight: 800;
  animation: chanelTicker 42s linear infinite;
}

.chanel-ticker-track b {
  font-size: 22px;
  line-height: 1;
  color: #fff8f4;
}

@keyframes chanelTicker {
  from { transform: translateX(0); }
  to { transform: translateX(33.333%); }
}

.chanel-about {
  position: relative;
  padding: 112px 0 92px;
  background: #fff;
}

.chanel-about-grid {
  display: grid;
  grid-template-columns: 240px minmax(340px, 520px) minmax(360px, 1fr);
  gap: 42px;
  align-items: end;
}

.chanel-about-badge {
  grid-column: 3;
  align-self: start;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid rgba(42, 27, 22, 0.1);
  border-radius: 999px;
  color: rgba(42, 27, 22, 0.6);
  background: #fff;
  font-size: 13px;
}

.chanel-about-badge span,
.chanel-section-heading span,
.chanel-contact-form > span {
  color: #c95268;
}

.chanel-about-copy {
  grid-column: 3;
  align-self: center;
}

.chanel-about-copy h1 {
  margin: 0;
  max-width: 760px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(58px, 6.6vw, 98px);
  line-height: 0.91;
  font-weight: 500;
  letter-spacing: -0.085em;
}

.chanel-about-copy p {
  width: min(610px, 100%);
  margin: 28px 0 0;
  color: rgba(42, 27, 22, 0.54);
  font-size: 18px;
  line-height: 1.85;
  font-weight: 750;
}

.chanel-red-button {
  grid-column: 3;
  justify-self: start;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  border-radius: 8px;
  background: #c95268;
  color: #fff !important;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 22px 60px rgba(201, 82, 104, 0.18);
}

.chanel-about-image {
  grid-column: 2;
  grid-row: 2 / span 2;
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 8px;
  background: #f5ebe8;
}

.chanel-about-image img,
.chanel-process-image img,
.chanel-therapy-image img,
.chanel-team-image img,
.chanel-price-image img,
.chanel-faq-media img,
.chanel-contact-image img,
.chanel-blog-card img,
.chanel-footer-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chanel-about-image button {
  position: absolute;
  left: 22px;
  bottom: 22px;
  width: 54px;
  height: 54px;
  border: 0;
  border-radius: 999px;
  background: #c95268;
  color: #fff;
  font-weight: 900;
}

.chanel-about-stats {
  grid-column: 1;
  grid-row: 2 / span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  align-self: stretch;
  padding: 34px;
  border: 1px solid rgba(42, 27, 22, 0.1);
  border-radius: 8px;
  background: #fff;
}

.chanel-about-stats > p {
  grid-column: 1 / -1;
  margin: 0 0 42px;
  color: rgba(42, 27, 22, 0.52);
  line-height: 1.85;
  font-weight: 700;
}

.chanel-about-stats div + div {
  border-right: 1px solid rgba(42, 27, 22, 0.12);
  padding-right: 26px;
}

.chanel-about-stats strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 44px;
  font-weight: 500;
  letter-spacing: -0.08em;
}

.chanel-about-stats span {
  display: block;
  margin-top: 8px;
  color: rgba(42, 27, 22, 0.48);
  font-size: 12px;
  font-weight: 800;
}

.chanel-partners-row {
  width: min(1230px, calc(100% - 56px));
  margin: 74px auto 0;
  padding-top: 34px;
  border-top: 1px solid rgba(42, 27, 22, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  color: rgba(42, 27, 22, 0.76);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(20px, 3vw, 36px);
  letter-spacing: -0.08em;
}

.chanel-process,
.chanel-team,
.chanel-pricing,
.chanel-faq,
.chanel-blog,
.chanel-simple-page {
  padding: 118px 0;
  background: #fff;
}

.chanel-section-heading {
  width: min(680px, 100%);
  margin: 0 auto 72px;
  text-align: center;
}

.chanel-section-heading.align-start {
  margin-inline: 0;
  text-align: right;
}

.chanel-section-heading span,
.chanel-contact-form > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .18em;
  text-transform: uppercase;
}

.chanel-section-heading h2,
.chanel-contact-form h2,
.chanel-simple-page h1 {
  margin: 16px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(46px, 5vw, 74px);
  line-height: .94;
  font-weight: 500;
  letter-spacing: -0.08em;
}

.chanel-process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: start;
}

.chanel-process-card {
  background: #f7f4f2;
  border: 1px solid rgba(42, 27, 22, .08);
  border-radius: 8px;
  overflow: hidden;
}

.chanel-process-card:nth-child(2) { margin-top: 74px; }
.chanel-process-card:nth-child(3) { margin-top: 148px; }

.chanel-process-text {
  min-height: 230px;
  padding: 34px;
}

.chanel-process-text span {
  color: rgba(42, 27, 22, .45);
  font-size: 12px;
  font-weight: 950;
}

.chanel-process-text h3 {
  margin: 72px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-process-text p {
  margin: 14px 0 0;
  color: rgba(42, 27, 22, .55);
  line-height: 1.7;
  font-weight: 700;
}

.chanel-process-image {
  height: 220px;
  overflow: hidden;
}

.chanel-therapies,
.chanel-testimonials,
.chanel-footer {
  background: #11100f;
  color: #fff;
}

.chanel-therapies {
  padding: 128px 0;
  overflow: hidden;
}

.chanel-section-heading.is-dark h2 {
  color: #fff;
}

.chanel-therapy-list {
  display: grid;
  gap: 22px;
}

.chanel-therapy-card {
  width: min(920px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 0;
  padding: 14px;
  border-radius: 12px;
  background: #fff;
  color: #2a1b16;
}

.chanel-therapy-card:nth-child(even) {
  transform: translateX(-64px);
}

.chanel-therapy-card:nth-child(odd) {
  transform: translateX(64px);
}

.chanel-therapy-image {
  height: 230px;
  overflow: hidden;
  border-radius: 8px;
}

.chanel-therapy-content {
  padding: 32px 34px;
}

.chanel-therapy-content h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-therapy-content p {
  margin: 16px 0 0;
  color: rgba(42, 27, 22, .56);
  line-height: 1.75;
  font-weight: 700;
}

.chanel-therapy-meta {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c95268;
  font-weight: 950;
}

.chanel-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.chanel-team-image {
  height: 330px;
  overflow: hidden;
  background: #f4edeb;
}

.chanel-team-card h3 {
  margin: 20px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-team-card p {
  margin: 8px 0 0;
  color: rgba(42, 27, 22, .52);
  font-weight: 850;
}

.chanel-price-list {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(42, 27, 22, 0.12);
}

.chanel-price-row {
  min-height: 118px;
  display: grid;
  grid-template-columns: 90px 112px 1fr 120px;
  gap: 28px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid rgba(42, 27, 22, 0.12);
  color: #2a1b16;
}

.chanel-price-row.is-featured {
  padding-inline: 22px;
  background: #c95268;
  color: #fff;
}

.chanel-price-number {
  color: #c95268;
  font-weight: 950;
}

.chanel-price-row.is-featured .chanel-price-number,
.chanel-price-row.is-featured p {
  color: rgba(255,255,255,.78);
}

.chanel-price-image {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  overflow: hidden;
  background: #f4edeb;
}

.chanel-price-main h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-price-main p {
  margin: 7px 0 0;
  color: rgba(42, 27, 22, .52);
  font-weight: 700;
}

.chanel-price-row strong {
  justify-self: end;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-testimonials {
  padding: 122px 0;
  overflow: hidden;
}

.chanel-testimonial-track {
  display: flex;
  gap: 24px;
  min-width: max-content;
}

.chanel-testimonial-card {
  width: 390px;
  min-height: 250px;
  padding: 28px;
  background: #fff;
  color: #2a1b16;
}

.chanel-testimonial-card span {
  color: #c95268;
  font-size: 11px;
  font-weight: 950;
}

.chanel-testimonial-card p {
  margin: 24px 0 38px;
  font-size: 18px;
  line-height: 1.65;
  color: rgba(42, 27, 22, .58);
  font-weight: 700;
}

.chanel-testimonial-card strong,
.chanel-testimonial-card small {
  display: block;
}

.chanel-faq-grid,
.chanel-contact-grid {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 88px;
  align-items: center;
}

.chanel-faq-media {
  display: grid;
  gap: 24px;
}

.chanel-faq-media img {
  height: 420px;
  object-position: center;
}

.chanel-faq-media a {
  justify-self: start;
  border-radius: 8px;
  background: #c95268;
  color: #fff !important;
  padding: 16px 24px;
  font-weight: 950;
}

.chanel-faq-item {
  border-bottom: 1px solid rgba(42, 27, 22, .12);
}

.chanel-faq-item summary {
  list-style: none;
  cursor: pointer;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-weight: 900;
}

.chanel-faq-item summary::-webkit-details-marker {
  display: none;
}

.chanel-faq-item b {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: #c95268;
  color: #fff;
}

.chanel-faq-item p {
  margin: 0 0 24px;
  color: rgba(42, 27, 22, .58);
  line-height: 1.75;
  font-weight: 700;
}

.chanel-contact {
  padding: 118px 0;
  background: #fff;
}

.chanel-contact-form {
  padding: 54px;
  background: #fbf5f2;
}

.chanel-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.chanel-contact-form input,
.chanel-contact-form select,
.chanel-contact-form textarea,
.chanel-footer-newsletter input {
  width: 100%;
  border: 1px solid rgba(42, 27, 22, .12);
  background: #fff;
  color: #2a1b16;
  padding: 17px 18px;
  outline: none;
  font: inherit;
  font-weight: 750;
}

.chanel-contact-form > input,
.chanel-contact-form select,
.chanel-contact-form textarea {
  margin-top: 14px;
}

.chanel-contact-form textarea {
  min-height: 150px;
  resize: vertical;
}

.chanel-contact-form button,
.chanel-footer-newsletter button {
  width: 100%;
  min-height: 56px;
  margin-top: 14px;
  border: 0;
  background: #c95268;
  color: #fff;
  font: inherit;
  font-weight: 950;
  cursor: pointer;
}

.chanel-contact-image {
  height: 430px;
  overflow: hidden;
}

.chanel-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.chanel-blog-card > div {
  height: 210px;
  overflow: hidden;
}

.chanel-blog-card span {
  display: block;
  margin-top: 18px;
  color: #c95268;
  font-size: 11px;
  font-weight: 950;
}

.chanel-blog-card h3 {
  margin: 10px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.06em;
}

.chanel-footer {
  overflow: hidden;
  padding-bottom: 38px;
}

.chanel-footer-strip {
  display: flex;
  gap: 14px;
  padding: 0 0 58px;
  min-width: max-content;
  animation: chanelFooterStrip 44s linear infinite;
}

.chanel-footer-strip img {
  width: 210px;
  height: 148px;
}

@keyframes chanelFooterStrip {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

.chanel-footer-grid {
  display: grid;
  grid-template-columns: .95fr 1.05fr;
  gap: 78px;
  padding-top: 20px;
}

.chanel-footer-newsletter h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(42px, 4.8vw, 68px);
  line-height: .94;
  font-weight: 500;
  letter-spacing: -0.08em;
}

.chanel-footer-newsletter form {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 10px;
}

.chanel-footer-newsletter input {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.14);
  color: #fff;
}

.chanel-footer-newsletter button {
  margin: 0;
}

.chanel-footer-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

.chanel-footer-cols > div {
  display: grid;
  align-content: start;
  gap: 12px;
  color: rgba(255,255,255,.58);
  font-weight: 700;
}

.chanel-footer-cols strong {
  color: #fff;
}

.chanel-footer-cols p {
  margin: 0;
}

.chanel-footer-word {
  margin-top: 50px;
  text-align: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(80px, 16vw, 245px);
  line-height: .8;
  letter-spacing: .18em;
  color: rgba(255,255,255,.08);
  direction: ltr;
}

.chanel-simple-page {
  min-height: 76vh;
}

.chanel-simple-page h1 {
  max-width: 820px;
}

.chanel-simple-page p {
  max-width: 660px;
  color: rgba(42,27,22,.58);
  font-size: 18px;
  line-height: 1.85;
  font-weight: 700;
}

@media (max-width: 1080px) {
  .chanel-home-nav {
    grid-template-columns: 170px 1fr 170px;
  }

  .chanel-home-menu {
    gap: 24px;
  }

  .chanel-about-grid,
  .chanel-faq-grid,
  .chanel-contact-grid,
  .chanel-footer-grid {
    grid-template-columns: 1fr;
  }

  .chanel-about-badge,
  .chanel-about-copy,
  .chanel-red-button,
  .chanel-about-image,
  .chanel-about-stats {
    grid-column: auto;
    grid-row: auto;
  }

  .chanel-process-grid,
  .chanel-team-grid,
  .chanel-blog-grid {
    grid-template-columns: 1fr 1fr;
  }

  .chanel-process-card:nth-child(2),
  .chanel-process-card:nth-child(3) {
    margin-top: 0;
  }

  .chanel-therapy-card,
  .chanel-therapy-card:nth-child(even),
  .chanel-therapy-card:nth-child(odd) {
    transform: none;
  }
}

@media (max-width: 760px) {
  .chanel-container,
  .chanel-home-nav,
  .chanel-partners-row {
    width: min(100% - 28px, 1230px);
  }

  .chanel-home-header,
  .chanel-home-nav {
    height: 76px;
  }

  .chanel-home-nav {
    grid-template-columns: 1fr 1fr;
  }

  .chanel-home-logo {
    grid-column: 2;
    font-size: 32px;
  }

  .chanel-home-menu {
    display: none;
  }

  .chanel-home-book-nav {
    grid-column: 1;
    min-width: 118px;
    min-height: 46px;
    padding-inline: 18px;
  }

  .chanel-hero {
    min-height: 220px;
    height: 28vh;
  }

  .chanel-about,
  .chanel-process,
  .chanel-team,
  .chanel-pricing,
  .chanel-faq,
  .chanel-blog,
  .chanel-contact,
  .chanel-therapies,
  .chanel-testimonials,
  .chanel-simple-page {
    padding: 78px 0;
  }

  .chanel-about-copy h1,
  .chanel-section-heading h2,
  .chanel-contact-form h2 {
    font-size: 44px;
  }

  .chanel-about-image,
  .chanel-contact-image,
  .chanel-faq-media img {
    height: 300px;
  }

  .chanel-about-stats,
  .chanel-process-grid,
  .chanel-therapy-card,
  .chanel-team-grid,
  .chanel-price-row,
  .chanel-form-row,
  .chanel-blog-grid,
  .chanel-footer-cols,
  .chanel-footer-newsletter form {
    grid-template-columns: 1fr;
  }

  .chanel-therapy-card {
    width: 100%;
  }

  .chanel-therapy-image {
    height: 250px;
  }

  .chanel-price-row strong {
    justify-self: start;
  }
}
`;
