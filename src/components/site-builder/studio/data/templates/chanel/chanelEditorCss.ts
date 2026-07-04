export const chanelEditorCss = `
[data-template-id="chanel"],
[data-template-id="chanel"] * {
  box-sizing: border-box;
}

[data-template-id="chanel"] {
  direction: rtl;
  background: #fbf4ee;
  color: #2b1b15;
  font-family: Assistant, Heebo, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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

.chanel-site {
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 4%, rgba(200,151,122,.28), transparent 34rem),
    radial-gradient(circle at 92% 15%, rgba(255,255,255,.85), transparent 28rem),
    linear-gradient(180deg, #fbf4ee 0%, #fffaf7 46%, #fbf4ee 100%);
  color: #2b1b15;
}

.chanel-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}

/* HEADER */
.chanel-header {
  position: sticky;
  top: 0;
  z-index: 80;
  border-bottom: 1px solid rgba(43,27,21,.10);
  background: rgba(251,244,238,.82);
  backdrop-filter: blur(22px);
}

.chanel-nav-wrap {
  width: min(1180px, calc(100% - 40px));
  min-height: 88px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.chanel-logo {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -.08em;
  color: #2b1b15;
}

.chanel-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  color: rgba(43,27,21,.62);
  font-size: 14px;
  font-weight: 800;
}

.chanel-nav a {
  transition: color .25s ease, transform .25s ease;
}

.chanel-nav a:hover {
  color: #2b1b15;
  transform: translateY(-2px);
}

.chanel-nav-btn,
.chanel-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 999px;
  background: #2b1b15;
  color: #fffaf7;
  font-size: 14px;
  font-weight: 900;
  border: 1px solid rgba(43,27,21,.18);
  box-shadow: 0 20px 48px rgba(43,27,21,.18);
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}

.chanel-nav-btn:hover,
.chanel-primary-btn:hover {
  transform: translateY(-3px);
  background: #c8977a;
  box-shadow: 0 24px 60px rgba(43,27,21,.22);
}

.chanel-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  color: #2b1b15;
  font-size: 14px;
  font-weight: 900;
  border: 1px solid rgba(43,27,21,.12);
  box-shadow: 0 16px 40px rgba(43,27,21,.08);
}

/* GLOBAL */
.chanel-section {
  position: relative;
  padding: 112px 0;
}

.chanel-eyebrow {
  margin: 0;
  color: #7b5f52;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 950;
  letter-spacing: .24em;
  text-transform: uppercase;
}

.chanel-section-head {
  max-width: 840px;
  margin-bottom: 58px;
}

.chanel-section-head h2,
.chanel-prices-title h2,
.chanel-testimonials h2,
.chanel-faq h2,
.chanel-booking h2,
.chanel-contact h2,
.chanel-simple-page h1 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  line-height: .9;
  letter-spacing: -.065em;
  color: #2b1b15;
  font-size: clamp(48px, 7vw, 86px);
}

.chanel-split-head {
  max-width: none;
  display: grid;
  grid-template-columns: 1fr .82fr;
  align-items: end;
  gap: 60px;
}

.chanel-split-head > p {
  margin: 0;
  color: rgba(43,27,21,.62);
  font-size: 19px;
  line-height: 1.9;
  font-weight: 600;
}

.chanel-center {
  margin-inline: auto;
  text-align: center;
}

/* HERO - APSORA STYLE */
.chanel-hero {
  position: relative;
  overflow: hidden;
  padding: 82px 0 96px;
}

.chanel-hero-bg-one,
.chanel-hero-bg-two {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(70px);
}

.chanel-hero-bg-one {
  width: 440px;
  height: 440px;
  right: -150px;
  top: -120px;
  background: rgba(200,151,122,.30);
}

.chanel-hero-bg-two {
  width: 500px;
  height: 500px;
  left: -180px;
  bottom: -180px;
  background: rgba(43,27,21,.10);
}

.chanel-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: .92fr 1.08fr;
  align-items: center;
  gap: 66px;
}

.chanel-hero-content h1 {
  margin: 22px 0 0;
  max-width: 720px;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  font-size: clamp(70px, 9vw, 134px);
  line-height: .82;
  letter-spacing: -.085em;
  color: #2b1b15;
}

.chanel-hero-text {
  margin: 30px 0 0;
  max-width: 580px;
  color: rgba(43,27,21,.64);
  font-size: 20px;
  line-height: 1.9;
  font-weight: 600;
}

.chanel-hero-actions {
  margin-top: 38px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.chanel-hero-media {
  position: relative;
  min-height: 640px;
}

.chanel-hero-main-image {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  width: 78%;
  height: 560px;
  overflow: hidden;
  border-radius: 46px;
  background: #ead9cf;
  box-shadow: 0 42px 110px rgba(43,27,21,.20);
}

.chanel-hero-main-image img,
.chanel-hero-small-image img,
.chanel-about-main-image img,
.chanel-service-image img,
.chanel-team-card img,
.chanel-contact-image img,
.chanel-blog-card img,
.chanel-faq-image img,
.chanel-image-ticker-item img,
.chanel-footer-ticker-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .9s cubic-bezier(.16,1,.3,1), filter .9s ease;
}

.chanel-hero-main-image:hover img,
.chanel-hero-small-image:hover img,
.chanel-about-main-image:hover img,
.chanel-service-card:hover img,
.chanel-team-card:hover img,
.chanel-contact-image:hover img,
.chanel-blog-card:hover img {
  transform: scale(1.07);
  filter: saturate(1.06) contrast(1.04);
}

.chanel-hero-small-image {
  position: absolute;
  inset-inline-end: 0;
  bottom: 34px;
  width: 42%;
  height: 300px;
  overflow: hidden;
  border-radius: 36px;
  border: 10px solid #fbf4ee;
  background: #ead9cf;
  box-shadow: 0 28px 90px rgba(43,27,21,.18);
}

.chanel-hero-badge {
  position: absolute;
  inset-inline-end: 12%;
  top: 43%;
  width: 138px;
  height: 138px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  text-align: center;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(43,27,21,.12);
  backdrop-filter: blur(20px);
  color: #2b1b15;
  font-weight: 950;
  font-size: 13px;
  box-shadow: 0 22px 70px rgba(43,27,21,.12);
  animation: chanelSpin 18s linear infinite;
}

.chanel-hero-badge span {
  display: block;
}

@keyframes chanelSpin {
  to {
    transform: rotate(360deg);
  }
}

/* TEXT TICKER */
.chanel-ticker {
  overflow: hidden;
  border-top: 1px solid rgba(43,27,21,.12);
  border-bottom: 1px solid rgba(43,27,21,.12);
  background: rgba(255,255,255,.55);
}

.chanel-ticker-track {
  display: inline-flex;
  min-width: max-content;
  align-items: center;
  gap: 36px;
  padding: 28px 0;
  animation: chanelTicker 26s linear infinite;
}

.chanel-ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 36px;
  white-space: nowrap;
}

.chanel-ticker-item span {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1;
  font-weight: 500;
  letter-spacing: -.065em;
  color: #2b1b15;
}

.chanel-ticker-item i {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #c8977a;
}

@keyframes chanelTicker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}

/* ABOUT */
.chanel-about-grid {
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 30px;
  align-items: stretch;
}

.chanel-about-main-image {
  height: 620px;
  overflow: hidden;
  border-radius: 42px;
  background: #ead9cf;
  box-shadow: 0 30px 95px rgba(43,27,21,.12);
}

.chanel-about-side {
  display: grid;
  gap: 30px;
}

.chanel-about-card {
  border-radius: 38px;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(43,27,21,.10);
  padding: 38px;
  box-shadow: 0 26px 80px rgba(43,27,21,.08);
}

.chanel-about-card span {
  width: 76px;
  height: 76px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #2b1b15;
  color: #fff;
  margin-bottom: 34px;
}

.chanel-about-card p {
  margin: 0;
  color: rgba(43,27,21,.68);
  font-size: 19px;
  line-height: 1.9;
  font-weight: 650;
}

.chanel-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chanel-stat-card {
  border-radius: 34px;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(43,27,21,.10);
  padding: 34px 28px;
  box-shadow: 0 24px 70px rgba(43,27,21,.07);
}

.chanel-stat-card strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 58px;
  line-height: 1;
  letter-spacing: -.075em;
  color: #2b1b15;
}

.chanel-stat-card span {
  display: block;
  margin-top: 14px;
  color: rgba(43,27,21,.58);
  font-weight: 850;
}

/* IMAGE TICKER */
.chanel-image-ticker {
  overflow: hidden;
  padding: 20px 0;
  background: #fbf4ee;
}

.chanel-image-ticker-track {
  display: inline-flex;
  min-width: max-content;
  gap: 22px;
  animation: chanelImageTicker 34s linear infinite;
}

.chanel-image-ticker-item {
  width: 300px;
  height: 210px;
  overflow: hidden;
  border-radius: 30px;
  background: #ead9cf;
}

.chanel-image-ticker-item.is-large {
  width: 380px;
}

@keyframes chanelImageTicker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}

/* PROCESS */
.chanel-process {
  background: #fffaf7;
}

.chanel-process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.chanel-process-card {
  min-height: 285px;
  padding: 34px;
  border-radius: 34px;
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(43,27,21,.10);
  box-shadow: 0 24px 70px rgba(43,27,21,.07);
}

.chanel-process-card span {
  display: inline-flex;
  color: #c8977a;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .18em;
}

.chanel-process-card h3 {
  margin: 52px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: .98;
  letter-spacing: -.055em;
  color: #2b1b15;
}

.chanel-process-card p {
  margin: 18px 0 0;
  color: rgba(43,27,21,.60);
  font-size: 15px;
  line-height: 1.8;
  font-weight: 650;
}

/* SERVICES */
.chanel-services {
  background: #2b1b15;
  color: white;
}

.chanel-services .chanel-eyebrow {
  color: #c8977a;
}

.chanel-services .chanel-section-head h2 {
  color: white;
}

.chanel-services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.chanel-service-card {
  overflow: hidden;
  border-radius: 40px;
  background: #fffaf7;
  color: #2b1b15;
  box-shadow: 0 30px 90px rgba(0,0,0,.18);
}

.chanel-service-image {
  height: 360px;
  overflow: hidden;
  background: #ead9cf;
}

.chanel-service-content {
  padding: 34px;
}

.chanel-service-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.chanel-service-top span {
  color: #c8977a;
  font-weight: 950;
  letter-spacing: .16em;
}

.chanel-service-top strong {
  border-radius: 999px;
  padding: 10px 16px;
  background: #fbf4ee;
  color: #7b5f52;
  font-weight: 950;
}

.chanel-service-card h3 {
  margin: 26px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  line-height: .95;
  letter-spacing: -.065em;
}

.chanel-service-card p {
  margin: 18px 0 0;
  color: rgba(43,27,21,.64);
  font-size: 16px;
  line-height: 1.85;
  font-weight: 650;
}

.chanel-service-card a {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  color: #2b1b15;
}

.chanel-service-card a span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #2b1b15;
  color: #fff;
}

/* TEAM */
.chanel-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.chanel-team-card {
  text-align: center;
}

.chanel-team-card > div {
  height: 470px;
  overflow: hidden;
  border-radius: 40px;
  background: #ead9cf;
  box-shadow: 0 26px 80px rgba(43,27,21,.10);
}

.chanel-team-card h3 {
  margin: 26px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -.06em;
}

.chanel-team-card p {
  margin: 10px 0 0;
  color: #7b5f52;
  font-weight: 800;
}

/* PRICES */
.chanel-prices {
  background: #fffaf7;
}

.chanel-prices-grid {
  display: grid;
  grid-template-columns: .78fr 1.22fr;
  gap: 70px;
}

.chanel-prices-title {
  position: sticky;
  top: 120px;
  align-self: start;
}

.chanel-prices-title p:last-child {
  margin: 24px 0 0;
  color: rgba(43,27,21,.62);
  font-size: 18px;
  line-height: 1.9;
  font-weight: 650;
}

.chanel-prices-list {
  display: grid;
}

.chanel-price-row {
  display: grid;
  grid-template-columns: 74px 1fr 104px 110px;
  align-items: center;
  gap: 24px;
  padding: 26px 0;
  border-bottom: 1px solid rgba(43,27,21,.13);
}

.chanel-price-number {
  color: #c8977a;
  font-weight: 950;
}

.chanel-price-main h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  line-height: .95;
  letter-spacing: -.06em;
}

.chanel-price-main p {
  margin: 8px 0 0;
  color: rgba(43,27,21,.58);
  font-weight: 650;
}

.chanel-price-image {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  overflow: hidden;
  background: #ead9cf;
}

.chanel-price-row strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  letter-spacing: -.06em;
}

/* TESTIMONIAL */
.chanel-testimonials-grid {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  align-items: center;
  gap: 60px;
}

.chanel-testimonial-card {
  border-radius: 42px;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(43,27,21,.10);
  padding: 48px;
  box-shadow: 0 30px 95px rgba(43,27,21,.09);
}

.chanel-testimonial-card > p {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(34px, 4vw, 58px);
  line-height: 1.05;
  letter-spacing: -.06em;
}

.chanel-testimonial-card > div {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.chanel-testimonial-card img {
  width: 68px;
  height: 68px;
  border-radius: 999px;
  object-fit: cover;
}

.chanel-testimonial-card strong {
  display: block;
  font-weight: 950;
}

.chanel-testimonial-card span {
  display: block;
  margin-top: 4px;
  color: #7b5f52;
  font-weight: 700;
}

/* FAQ */
.chanel-faq {
  background: #2b1b15;
  color: white;
}

.chanel-faq .chanel-eyebrow {
  color: #c8977a;
}

.chanel-faq h2 {
  color: white;
}

.chanel-faq-grid {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 60px;
}

.chanel-faq-image {
  margin-top: 36px;
  height: 430px;
  overflow: hidden;
  border-radius: 40px;
  background: #ead9cf;
}

.chanel-faq-list {
  display: grid;
  gap: 14px;
}

.chanel-faq-item {
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.10);
  padding: 24px 26px;
  backdrop-filter: blur(14px);
}

.chanel-faq-item[open] {
  background: #fffaf7;
  color: #2b1b15;
}

.chanel-faq-item summary {
  cursor: pointer;
  list-style: none;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -.05em;
}

.chanel-faq-item summary::-webkit-details-marker {
  display: none;
}

.chanel-faq-item p {
  margin: 16px 0 0;
  color: currentColor;
  opacity: .72;
  line-height: 1.8;
  font-weight: 650;
}

/* BOOKING / CONTACT */
.chanel-booking {
  background: #2b1b15;
  color: white;
}

.chanel-booking .chanel-eyebrow {
  color: #c8977a;
}

.chanel-booking h2,
.chanel-booking p {
  color: white;
}

.chanel-booking-grid,
.chanel-contact-grid {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 60px;
  align-items: stretch;
}

.chanel-booking p,
.chanel-contact-form > p:not(.chanel-eyebrow) {
  margin-top: 22px;
  font-size: 18px;
  line-height: 1.9;
  font-weight: 650;
  color: rgba(255,255,255,.62);
}

.chanel-form,
.chanel-contact-form {
  border-radius: 42px;
  background: #fffaf7;
  color: #2b1b15;
  padding: 38px;
  box-shadow: 0 34px 110px rgba(0,0,0,.22);
}

.chanel-contact-form {
  background: white;
  box-shadow: 0 30px 95px rgba(43,27,21,.09);
}

.chanel-contact-form > p:not(.chanel-eyebrow) {
  color: rgba(43,27,21,.62);
}

.chanel-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.chanel-form input,
.chanel-form select,
.chanel-form textarea,
.chanel-contact-form input,
.chanel-contact-form select,
.chanel-contact-form textarea,
.chanel-newsletter input {
  width: 100%;
  border: 1px solid rgba(43,27,21,.12);
  background: #fbf4ee;
  color: #2b1b15;
  border-radius: 18px;
  padding: 16px 18px;
  outline: none;
  font: inherit;
  font-weight: 750;
}

.chanel-form select,
.chanel-form textarea,
.chanel-contact-form > input,
.chanel-contact-form textarea {
  margin-top: 14px;
}

.chanel-form textarea,
.chanel-contact-form textarea {
  min-height: 150px;
  resize: vertical;
}

.chanel-form button,
.chanel-contact-form button,
.chanel-newsletter button {
  width: 100%;
  min-height: 56px;
  margin-top: 16px;
  border: none;
  border-radius: 999px;
  background: #2b1b15;
  color: white;
  font: inherit;
  font-weight: 950;
  cursor: pointer;
}

.chanel-contact-image {
  min-height: 650px;
  overflow: hidden;
  border-radius: 42px;
  background: #ead9cf;
  box-shadow: 0 30px 95px rgba(43,27,21,.10);
}

/* BLOG */
.chanel-blog {
  background: #fffaf7;
}

.chanel-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.chanel-blog-card {
  overflow: hidden;
  border-radius: 38px;
  background: white;
  border: 1px solid rgba(43,27,21,.10);
  box-shadow: 0 26px 80px rgba(43,27,21,.08);
}

.chanel-blog-card > div:first-child {
  height: 270px;
  overflow: hidden;
  background: #ead9cf;
}

.chanel-blog-content {
  padding: 28px;
}

.chanel-blog-content span {
  color: #c8977a;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .14em;
}

.chanel-blog-content h3 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  line-height: 1.05;
  letter-spacing: -.055em;
}

.chanel-blog-content p {
  margin: 18px 0 0;
  color: rgba(43,27,21,.55);
  font-weight: 700;
}

/* FOOTER */
.chanel-footer {
  overflow: hidden;
  background: #2b1b15;
  color: white;
}

.chanel-footer-gallery {
  display: inline-flex;
  min-width: max-content;
  gap: 20px;
  padding: 34px 0;
  animation: chanelFooterTicker 42s linear infinite;
}

.chanel-footer-ticker-item {
  position: relative;
  width: 290px;
  height: 210px;
  overflow: hidden;
  border-radius: 28px;
  background: #ead9cf;
}

.chanel-footer-ticker-item span {
  position: absolute;
  inset-inline-start: 14px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: white;
  color: #2b1b15;
  font-weight: 950;
}

@keyframes chanelFooterTicker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}

.chanel-footer-main {
  padding: 80px 0 60px;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 70px;
  border-top: 1px solid rgba(255,255,255,.12);
}

.chanel-footer-title {
  margin: 0;
  max-width: 560px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 76px);
  line-height: .92;
  letter-spacing: -.07em;
  color: white;
}

.chanel-newsletter {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 12px;
}

.chanel-newsletter input {
  background: rgba(255,255,255,.10);
  color: white;
  border-color: rgba(255,255,255,.14);
}

.chanel-newsletter button {
  margin: 0;
  background: #c8977a;
}

.chanel-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

.chanel-footer-grid > div {
  display: grid;
  align-content: start;
  gap: 12px;
  color: rgba(255,255,255,.62);
  font-weight: 650;
}

.chanel-footer-heading {
  margin: 0 0 10px;
  color: white;
  font-weight: 950;
}

.chanel-footer-brand {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  color: white;
  font-size: 36px;
  letter-spacing: -.08em;
}

/* SIMPLE PAGES */
.chanel-simple-grid {
  display: grid;
  grid-template-columns: .72fr 1.28fr;
  gap: 42px;
}

.chanel-simple-grid aside,
.chanel-simple-grid main {
  border-radius: 40px;
  background: white;
  border: 1px solid rgba(43,27,21,.10);
  padding: 38px;
  box-shadow: 0 26px 80px rgba(43,27,21,.08);
}

.chanel-simple-grid aside {
  align-self: start;
  position: sticky;
  top: 120px;
}

.chanel-simple-grid aside > p:not(.chanel-eyebrow) {
  margin-top: 22px;
  color: rgba(43,27,21,.62);
  font-size: 18px;
  line-height: 1.9;
  font-weight: 650;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .chanel-hero-grid,
  .chanel-split-head,
  .chanel-about-grid,
  .chanel-prices-grid,
  .chanel-testimonials-grid,
  .chanel-faq-grid,
  .chanel-booking-grid,
  .chanel-contact-grid,
  .chanel-footer-main,
  .chanel-simple-grid {
    grid-template-columns: 1fr;
  }

  .chanel-process-grid,
  .chanel-team-grid,
  .chanel-blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chanel-prices-title,
  .chanel-simple-grid aside {
    position: static;
  }

  .chanel-hero-content {
    text-align: center;
  }

  .chanel-hero-content h1,
  .chanel-hero-text {
    margin-inline: auto;
  }

  .chanel-hero-actions {
    justify-content: center;
  }
}

@media (max-width: 760px) {
  .chanel-container,
  .chanel-nav-wrap {
    width: min(100% - 28px, 1180px);
  }

  .chanel-nav {
    display: none;
  }

  .chanel-nav-wrap {
    min-height: 76px;
  }

  .chanel-nav-btn {
    min-height: 46px;
    padding: 0 18px;
    font-size: 12px;
  }

  .chanel-section {
    padding: 76px 0;
  }

  .chanel-hero {
    padding: 54px 0 72px;
  }

  .chanel-hero-content h1 {
    font-size: 64px;
  }

  .chanel-hero-media {
    min-height: 480px;
  }

  .chanel-hero-main-image {
    width: 86%;
    height: 420px;
  }

  .chanel-hero-small-image {
    width: 50%;
    height: 210px;
    border-width: 7px;
  }

  .chanel-hero-badge {
    width: 110px;
    height: 110px;
    font-size: 11px;
  }

  .chanel-services-grid,
  .chanel-process-grid,
  .chanel-team-grid,
  .chanel-blog-grid,
  .chanel-footer-grid,
  .chanel-form-grid {
    grid-template-columns: 1fr;
  }

  .chanel-price-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .chanel-price-image {
    width: 84px;
    height: 84px;
  }

  .chanel-about-main-image,
  .chanel-contact-image,
  .chanel-faq-image {
    height: 420px;
    min-height: 420px;
  }

  .chanel-footer-main {
    padding: 58px 0 46px;
  }

  .chanel-newsletter {
    grid-template-columns: 1fr;
  }
}
  /* APSORA HOME OVERRIDE */
.chanel-home-hero {
  position: relative;
  min-height: 760px;
  overflow: hidden;
  background: #c85c68;
  color: #fff;
}

.chanel-home-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.chanel-home-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: .78;
  transform: scale(1.03);
  animation: chanelHeroZoom 10s ease-in-out infinite alternate;
}

.chanel-home-hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(90deg, rgba(88, 18, 32, .42), rgba(200, 92, 104, .22), rgba(255, 255, 255, .06)),
    radial-gradient(circle at 40% 30%, rgba(255, 255, 255, .18), transparent 32rem);
}

.chanel-home-hero-inner {
  position: relative;
  z-index: 3;
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  min-height: 760px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.chanel-home-hero-top {
  width: min(720px, 100%);
  padding-top: 58px;
}

.chanel-home-eyebrow,
.chanel-home-small-label {
  margin: 0;
  color: #b74d57;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .22em;
  text-transform: uppercase;
}

.chanel-home-hero .chanel-home-eyebrow {
  color: rgba(255,255,255,.92);
}

.chanel-home-hero h1 {
  margin: 22px 0 0;
  max-width: 720px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(64px, 9vw, 132px);
  line-height: .84;
  font-weight: 500;
  letter-spacing: -.08em;
  color: #fff;
  text-shadow: 0 20px 80px rgba(74,18,28,.25);
  animation: chanelHeroTextIn .9s cubic-bezier(.16,1,.3,1) both;
}

.chanel-home-hero p:not(.chanel-home-eyebrow) {
  margin: 28px 0 0;
  max-width: 520px;
  color: rgba(255,255,255,.88);
  font-size: 18px;
  line-height: 1.8;
  font-weight: 600;
  animation: chanelHeroTextIn 1.1s cubic-bezier(.16,1,.3,1) both;
}

.chanel-home-red-btn {
  margin-top: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 999px;
  background: #b94b56;
  color: #fff;
  font-weight: 900;
  box-shadow: 0 22px 52px rgba(87, 20, 30, .28);
  animation: chanelHeroTextIn 1.25s cubic-bezier(.16,1,.3,1) both;
}

@keyframes chanelHeroZoom {
  from {
    transform: scale(1.03);
  }
  to {
    transform: scale(1.1);
  }
}

@keyframes chanelHeroTextIn {
  from {
    opacity: 0;
    transform: translateY(34px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* INTRO */
.chanel-home-intro {
  position: relative;
  background: #fff;
  padding: 96px 0 76px;
}

.chanel-home-intro-line {
  position: absolute;
  top: 0;
  inset-inline: 0;
  height: 1px;
  background: rgba(43,27,21,.12);
}

.chanel-home-intro-grid {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 74px;
  align-items: center;
}

.chanel-home-intro-title h2 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(42px, 5.8vw, 76px);
  line-height: .95;
  letter-spacing: -.065em;
  font-weight: 500;
  color: #2b1b15;
}

.chanel-home-intro-card {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: stretch;
}

.chanel-home-intro-image {
  height: 300px;
  overflow: hidden;
  border-radius: 6px;
  background: #f2d5d4;
}

.chanel-home-intro-image img,
.chanel-home-process-image img,
.chanel-home-service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chanel-home-intro-text-card {
  padding: 34px;
  background: #faf6f3;
  border: 1px solid rgba(43,27,21,.08);
}

.chanel-home-intro-text-card p {
  margin: 0;
  color: rgba(43,27,21,.62);
  line-height: 1.8;
  font-weight: 650;
}

.chanel-home-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 42px;
}

.chanel-home-stats strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  letter-spacing: -.06em;
  color: #2b1b15;
}

.chanel-home-stats span {
  display: block;
  margin-top: 6px;
  color: rgba(43,27,21,.54);
  font-weight: 700;
}

.chanel-home-logo-row {
  width: min(1180px, calc(100% - 40px));
  margin: 70px auto 0;
  display: flex;
  justify-content: space-between;
  gap: 36px;
  color: rgba(43,27,21,.34);
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -.04em;
}

/* PROCESS */
.chanel-home-process {
  background: #fff;
  padding: 100px 0 120px;
}

.chanel-home-section-title {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 62px;
}

.chanel-home-section-title h2 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 6vw, 84px);
  line-height: .92;
  letter-spacing: -.07em;
  font-weight: 500;
  color: #2b1b15;
}

.chanel-home-process-layout {
  position: relative;
  min-height: 660px;
}

.chanel-home-process-card {
  position: absolute;
  width: 300px;
  min-height: 220px;
  background: #f7f3f0;
  padding: 32px;
  box-shadow: 0 24px 80px rgba(43,27,21,.07);
}

.chanel-home-process-card span {
  color: rgba(43,27,21,.35);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .18em;
}

.chanel-home-process-card h3 {
  margin: 50px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  line-height: 1;
  letter-spacing: -.055em;
  color: #2b1b15;
}

.chanel-home-process-card p {
  margin: 12px 0 0;
  color: rgba(43,27,21,.58);
  line-height: 1.75;
  font-size: 14px;
  font-weight: 650;
}

.chanel-home-process-image {
  position: absolute;
  overflow: hidden;
  background: #f2d5d4;
}

.chanel-home-process-image.image-one {
  width: 310px;
  height: 350px;
  right: 330px;
  top: 170px;
}

.chanel-home-process-image.image-two {
  width: 330px;
  height: 310px;
  left: 80px;
  bottom: 0;
}

.chanel-home-process-card.card-one {
  right: 0;
  top: 110px;
}

.chanel-home-process-card.card-two {
  left: 330px;
  top: 20px;
}

.chanel-home-process-card.card-three {
  left: 0;
  bottom: 70px;
}

/* SERVICES BLACK SECTION */
.chanel-home-services {
  background: #171413;
  color: #fff;
  padding: 110px 0 120px;
  overflow: hidden;
}

.chanel-home-services-head {
  max-width: 620px;
  text-align: center;
  margin: 0 auto 66px;
}

.chanel-home-services-head .chanel-home-small-label {
  color: #c85c68;
}

.chanel-home-services-head h2 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 74px);
  line-height: .95;
  letter-spacing: -.065em;
  font-weight: 500;
  color: #fff;
}

.chanel-home-service-showcase {
  display: grid;
  gap: 34px;
}

.chanel-home-service-card {
  width: min(760px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr 1.08fr;
  background: #fff;
  color: #2b1b15;
  border-radius: 8px;
  overflow: hidden;
  padding: 14px;
  box-shadow: 0 30px 90px rgba(0,0,0,.30);
}

.chanel-home-service-card:not(.is-active) {
  opacity: .92;
}

.chanel-home-service-image {
  min-height: 330px;
  overflow: hidden;
  border-radius: 6px;
}

.chanel-home-service-info {
  padding: 34px;
}

.chanel-home-service-info h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -.06em;
}

.chanel-home-service-info p {
  margin: 18px 0 0;
  color: rgba(43,27,21,.6);
  line-height: 1.8;
  font-weight: 650;
}

.chanel-home-care-list {
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  color: rgba(43,27,21,.72);
  font-weight: 800;
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
  font-size: 34px;
  letter-spacing: -.06em;
}

.chanel-home-service-bottom a {
  border-radius: 999px;
  background: #b94b56;
  color: #fff;
  padding: 13px 20px;
  font-weight: 900;
}

/* TEAM / PRICING / TESTIMONIAL QUICK */
.chanel-home-team,
.chanel-home-pricing {
  background: #fff;
  padding: 105px 0;
}

.chanel-home-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.chanel-home-pricing {
  background: #faf6f3;
}

.chanel-home-pricing-grid {
  display: grid;
  grid-template-columns: .75fr 1.25fr;
  gap: 70px;
}

.chanel-home-pricing-grid h2 {
  margin: 14px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 78px);
  line-height: .92;
  letter-spacing: -.07em;
  font-weight: 500;
}

.chanel-home-testimonials {
  background: #171413;
  color: #fff;
  padding: 110px 0 130px;
}

.chanel-home-testimonials .chanel-home-small-label {
  color: #c85c68;
}

.chanel-home-testimonials h2 {
  color: #fff;
}

.chanel-home-testimonials-row {
  display: flex;
  gap: 24px;
  overflow: hidden;
}

.chanel-home-testimonials-row article {
  min-width: 360px;
  background: #fff;
  color: #2b1b15;
  padding: 28px;
}

.chanel-home-testimonials-row span {
  color: #c85c68;
  font-weight: 900;
  font-size: 12px;
}

.chanel-home-testimonials-row h3 {
  margin: 18px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -.055em;
}

.chanel-home-testimonials-row p {
  margin: 22px 0 0;
  color: rgba(43,27,21,.6);
  font-weight: 800;
}

/* MOBILE */
@media (max-width: 1000px) {
  .chanel-home-intro-grid,
  .chanel-home-intro-card,
  .chanel-home-service-card,
  .chanel-home-pricing-grid {
    grid-template-columns: 1fr;
  }

  .chanel-home-process-layout {
    min-height: auto;
    display: grid;
    gap: 20px;
  }

  .chanel-home-process-card,
  .chanel-home-process-image,
  .chanel-home-process-image.image-one,
  .chanel-home-process-image.image-two,
  .chanel-home-process-card.card-one,
  .chanel-home-process-card.card-two,
  .chanel-home-process-card.card-three {
    position: static;
    width: 100%;
  }

  .chanel-home-process-image {
    height: 320px;
  }

  .chanel-home-team-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .chanel-home-hero,
  .chanel-home-hero-inner {
    min-height: 650px;
  }

  .chanel-home-hero h1 {
    font-size: 58px;
  }

  .chanel-home-logo-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .chanel-home-stats {
    grid-template-columns: 1fr;
  }
}
`;
