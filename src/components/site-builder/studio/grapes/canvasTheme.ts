import type { ThemePalette } from "../types";

export function createCanvasCss(palette?: ThemePalette) {
  const primary = palette?.colors.primary || "#8B5CF6";
  const secondary = palette?.colors.secondary || "#F3E8FF";
  const accent = palette?.colors.accent || "#EC4899";
  const background = palette?.colors.background || "#FFF7FD";
  const text = palette?.colors.text || "#1F1B2E";
  const muted = palette?.colors.muted || "#64748B";
  const headingFont = palette?.font.heading || "Heebo";
  const bodyFont = palette?.font.body || "Assistant";

  return `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800;900&family=Heebo:wght@300;400;600;700;800;900&family=Rubik:wght@400;600;700;800;900&family=Alef:wght@400;700&family=Varela+Round&family=Noto+Sans+Hebrew:wght@400;600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&family=DM+Sans:wght@400;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&family=Lora:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  direction: rtl;
  font-family: "${bodyFont}", Arial, sans-serif;
  color: ${text};
  background: ${background};
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
}

.biz-page {
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 14% 12%, ${secondary} 0%, transparent 34%),
    linear-gradient(135deg, ${background} 0%, #ffffff 55%, ${background} 100%);
}

.biz-nav {
  min-height: 86px;
  padding: 0 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.86);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(226,232,240,0.75);
  position: sticky;
  top: 0;
  z-index: 20;
}

.biz-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.biz-logo {
  width: 52px;
  height: 52px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, ${primary}, ${accent});
  color: #fff;
  font-weight: 950;
  box-shadow: 0 20px 50px ${primary}3d;
}

.biz-brand-title {
  margin: 0;
  font-weight: 950;
  font-size: 17px;
  color: ${text};
}

.biz-brand-subtitle {
  margin: 3px 0 0;
  font-size: 12px;
  font-weight: 800;
  color: ${muted};
}

.biz-nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
  color: ${muted};
  font-size: 14px;
  font-weight: 850;
}

.biz-section {
  max-width: 1180px;
  margin: 0 auto;
  padding: 90px 32px;
}

.biz-section-wide {
  max-width: 1320px;
  margin: 0 auto;
  padding: 96px 40px;
}

.biz-section-full {
  padding: 98px 76px;
}

.biz-hero {
  min-height: 690px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: 64px;
}

.biz-hero-card {
  position: relative;
  border-radius: 46px;
  padding: 68px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(255,255,255,0.95);
  box-shadow: 0 44px 140px rgba(15,23,42,0.12);
  backdrop-filter: blur(28px);
}

.biz-hero-card:before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    radial-gradient(circle at 85% 18%, ${accent}22, transparent 28%),
    radial-gradient(circle at 8% 82%, ${primary}18, transparent 34%);
}

.biz-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 10px 17px;
  color: ${primary};
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 14px 34px rgba(15,23,42,0.07);
}

.biz-title {
  position: relative;
  margin: 24px 0 0;
  font-family: "${headingFont}", Arial, sans-serif;
  font-size: clamp(48px, 6vw, 88px);
  line-height: 0.95;
  letter-spacing: -0.055em;
  font-weight: 950;
  color: ${text};
}

.biz-subtitle {
  position: relative;
  max-width: 650px;
  margin: 24px 0 0;
  color: ${muted};
  font-size: 20px;
  line-height: 1.78;
  font-weight: 750;
}

.biz-actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.biz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 30px;
  border-radius: 19px;
  font-weight: 950;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.25s ease;
}

.biz-btn:hover {
  transform: translateY(-3px);
}

.biz-btn-primary {
  background: linear-gradient(135deg, ${primary}, ${accent});
  color: #fff;
  box-shadow: 0 24px 54px ${primary}40;
}

.biz-btn-secondary {
  background: #fff;
  color: ${text};
  border-color: #e2e8f0;
  box-shadow: 0 16px 38px rgba(15,23,42,0.08);
}

.biz-hero-image-wrap {
  position: relative;
  border-radius: 46px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 44px 140px rgba(15,23,42,0.16);
}

.biz-hero-image-wrap:before {
  content: "";
  position: absolute;
  inset: -24px;
  border-radius: 58px;
  background: ${primary}22;
  filter: blur(35px);
  z-index: -1;
}

.biz-hero-image {
  display: block;
  width: 100%;
  height: 540px;
  object-fit: cover;
  border-radius: 34px;
}

.biz-section-title {
  margin: 0;
  text-align: center;
  font-family: "${headingFont}", Arial, sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 950;
  color: ${text};
}

.biz-section-kicker {
  margin: 0 auto 14px;
  width: fit-content;
  color: ${primary};
  font-weight: 950;
  font-size: 13px;
}

.biz-section-text {
  max-width: 780px;
  margin: 22px auto 0;
  text-align: center;
  color: ${muted};
  font-size: 18px;
  line-height: 1.9;
  font-weight: 700;
}

.biz-grid-2,
.biz-grid-3,
.biz-grid-4 {
  margin-top: 44px;
  display: grid;
  gap: 22px;
}

.biz-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.biz-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.biz-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.biz-card {
  border-radius: 32px;
  padding: 30px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(226,232,240,0.9);
  box-shadow: 0 24px 76px rgba(15,23,42,0.08);
  transition: 0.25s ease;
}

.biz-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 32px 100px rgba(15,23,42,0.12);
}

.biz-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 21px;
  background: linear-gradient(135deg, ${primary}, ${accent});
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 950;
  margin-bottom: 23px;
  box-shadow: 0 18px 45px ${primary}35;
}

.biz-card-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 950;
  color: ${text};
}

.biz-card-text {
  margin: 12px 0 0;
  color: ${muted};
  font-size: 15px;
  line-height: 1.75;
  font-weight: 700;
}

.biz-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  color: ${muted};
  font-weight: 850;
}

.biz-price {
  border-radius: 999px;
  background: ${secondary};
  color: ${primary};
  padding: 9px 15px;
  font-size: 14px;
  font-weight: 950;
}

.biz-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 54px;
  align-items: center;
}

.biz-image-card {
  border-radius: 38px;
  overflow: hidden;
  background: #fff;
  padding: 12px;
  box-shadow: 0 34px 100px rgba(15,23,42,0.13);
}

.biz-image-card img {
  display: block;
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 28px;
}

.biz-gallery-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 30px;
  box-shadow: 0 24px 76px rgba(15,23,42,0.12);
}

.biz-dark-section {
  background:
    radial-gradient(circle at 12% 20%, ${primary}45, transparent 34%),
    linear-gradient(135deg, #020617, #111827);
  color: #fff;
  border-radius: 46px;
  padding: 66px;
  box-shadow: 0 42px 140px rgba(2,6,23,0.35);
}

.biz-booking-box {
  background: #fff;
  color: ${text};
  border-radius: 34px;
  padding: 30px;
  box-shadow: 0 30px 95px rgba(2,6,23,0.25);
}

.biz-time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
}

.biz-time {
  border: 1px solid ${secondary};
  background: ${secondary};
  color: ${primary};
  border-radius: 20px;
  padding: 15px;
  text-align: center;
  font-weight: 950;
}

.biz-form {
  display: grid;
  gap: 15px;
  margin-top: 30px;
}

.biz-input,
.biz-textarea {
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 0 18px;
  font-weight: 800;
  background: #fff;
  color: ${text};
}

.biz-input {
  min-height: 54px;
}

.biz-textarea {
  min-height: 132px;
  padding-top: 18px;
  resize: vertical;
}

.biz-carousel {
  display: flex;
  gap: 22px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 14px;
}

.biz-carousel > * {
  scroll-snap-align: start;
  min-width: 330px;
}

.biz-marquee {
  overflow: hidden;
  white-space: nowrap;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 18px 0;
  color: ${primary};
  font-size: 28px;
  font-weight: 950;
}

.biz-marquee span {
  display: inline-block;
  padding-left: 40px;
  animation: biz-marquee 18s linear infinite;
}

@keyframes biz-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(50%); }
}

.biz-counter {
  text-align: center;
  border-radius: 30px;
  background: #fff;
  padding: 34px;
  box-shadow: 0 24px 76px rgba(15,23,42,0.08);
}

.biz-counter strong {
  display: block;
  font-size: 46px;
  color: ${primary};
  font-weight: 950;
}

.biz-footer {
  background: #020617;
  color: #fff;
  padding: 58px 76px;
}

.biz-footer-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 22px;
  grid-template-columns: repeat(4, 1fr);
}

.biz-footer-card {
  background: rgba(255,255,255,0.08);
  border-radius: 26px;
  padding: 24px;
}

.biz-bg-image {
  position: relative;
  overflow: hidden;
  color: #fff;
  border-radius: 46px;
  padding: 96px 56px;
  background-size: cover;
  background-position: center;
}

.biz-bg-image:before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(2,6,23,0.45);
}

.biz-bg-image > * {
  position: relative;
  z-index: 1;
}

[data-animate="fade-up"] {
  animation: biz-fade-up 0.8s ease both;
}

[data-animate="zoom-in"] {
  animation: biz-zoom-in 0.7s ease both;
}

@keyframes biz-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes biz-zoom-in {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 900px) {
  .biz-nav {
    padding: 0 22px;
  }

  .biz-nav-links {
    display: none;
  }

  .biz-section,
  .biz-section-wide,
  .biz-section-full {
    padding: 58px 20px;
  }

  .biz-hero,
  .biz-split {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .biz-hero-card {
    padding: 34px;
    border-radius: 32px;
  }

  .biz-title {
    font-size: 46px;
  }

  .biz-hero-image {
    height: 360px;
  }

  .biz-grid-2,
  .biz-grid-3,
  .biz-grid-4,
  .biz-footer-grid {
    grid-template-columns: 1fr;
  }

  .biz-dark-section {
    padding: 34px;
    border-radius: 32px;
  }
}
`;
}

export const defaultCanvasCss = createCanvasCss();

export const defaultWebsiteHtml = `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">B</div>
      <div>
        <p class="biz-brand-title">הדר עשת ביוטי</p>
        <p class="biz-brand-subtitle">איפור קבוע וטיפולי יופי</p>
      </div>
    </div>

    <nav class="biz-nav-links">
      <a>דף הבית</a>
      <a>אודות</a>
      <a>שירותים</a>
      <a>גלריה</a>
      <a>מוצרים</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full biz-hero" data-animate="fade-up">
    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90" />
    </div>

    <div class="biz-hero-card">
      <div class="biz-pill">קריית אתא · איפור קבוע וטיפולי יופי</div>
      <h1 class="biz-title">הדר עשת ביוטי</h1>
      <p class="biz-subtitle">איפור קבוע וטיפולי יופי בהתאמה אישית, בגימור טבעי ומדויק.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">אודות</p>
    <h2 class="biz-section-title">קצת על העסק</h2>
    <p class="biz-section-text">
      סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים.
      כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.
    </p>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">שירותים</p>
    <h2 class="biz-section-title">השירותים שלי</h2>
    <div class="biz-grid-3">
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">איפור קבוע לגבות</h3>
        <p class="biz-card-text">עיצוב ומילוי גבות בשיטה מתקדמת.</p>
        <div class="biz-price-row">
          <span>90 דקות</span>
          <span class="biz-price">₪850</span>
        </div>
      </article>
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">טיפולי פנים</h3>
        <p class="biz-card-text">טיפול פנים מקצועי לניקוי, הזנה וזוהר.</p>
        <div class="biz-price-row">
          <span>60 דקות</span>
          <span class="biz-price">₪350</span>
        </div>
      </article>
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">הדגשת שפתיים</h3>
        <p class="biz-card-text">הדגשה עדינה וטבעית למראה אלגנטי.</p>
        <div class="biz-price-row">
          <span>90 דקות</span>
          <span class="biz-price">₪900</span>
        </div>
      </article>
    </div>
  </section>
</div>
`;