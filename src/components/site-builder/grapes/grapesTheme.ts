export const bizuplyCanvasCss = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  color: #0f172a;
  background: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}

.biz-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 10%, rgba(124, 58, 237, 0.12), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #f8f5ff 55%, #ffffff 100%);
}

.biz-nav {
  height: 82px;
  padding: 0 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(22px);
  border-bottom: 1px solid rgba(226,232,240,0.7);
  position: sticky;
  top: 0;
  z-index: 10;
}

.biz-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.biz-logo {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  color: #fff;
  font-weight: 900;
  box-shadow: 0 18px 40px rgba(124,58,237,0.24);
}

.biz-brand-title {
  font-size: 16px;
  font-weight: 900;
  margin: 0;
}

.biz-brand-subtitle {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin: 3px 0 0;
}

.biz-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  font-weight: 800;
  color: #475569;
}

.biz-section {
  max-width: 1180px;
  margin: 0 auto;
  padding: 88px 32px;
}

.biz-section-full {
  padding: 96px 72px;
}

.biz-hero {
  min-height: 680px;
  display: grid;
  align-items: center;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 64px;
}

.biz-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 42px;
  padding: 64px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 40px 130px rgba(15,23,42,0.12);
  backdrop-filter: blur(28px);
}

.biz-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 9px 16px;
  color: #6d28d9;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 12px 30px rgba(15,23,42,0.06);
}

.biz-title {
  margin: 22px 0 0;
  font-size: clamp(46px, 6vw, 86px);
  line-height: 0.96;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.biz-subtitle {
  margin: 24px 0 0;
  max-width: 650px;
  color: #475569;
  font-size: 20px;
  line-height: 1.75;
  font-weight: 650;
}

.biz-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.biz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 18px;
  font-weight: 950;
  border: 1px solid transparent;
  cursor: pointer;
}

.biz-btn-primary {
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  color: #fff;
  box-shadow: 0 22px 48px rgba(124,58,237,0.28);
}

.biz-btn-secondary {
  background: #fff;
  color: #0f172a;
  border-color: #e2e8f0;
  box-shadow: 0 14px 34px rgba(15,23,42,0.08);
}

.biz-hero-image-wrap {
  border-radius: 42px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 40px 130px rgba(15,23,42,0.16);
}

.biz-hero-image {
  width: 100%;
  height: 520px;
  object-fit: cover;
  border-radius: 32px;
  display: block;
}

.biz-section-title {
  text-align: center;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 950;
  margin: 0;
}

.biz-section-text {
  max-width: 780px;
  margin: 20px auto 0;
  text-align: center;
  color: #475569;
  font-size: 18px;
  line-height: 1.85;
  font-weight: 650;
}

.biz-grid-3 {
  margin-top: 42px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.biz-grid-4 {
  margin-top: 42px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.biz-card {
  border-radius: 30px;
  padding: 28px;
  background: #fff;
  border: 1px solid #eef2f7;
  box-shadow: 0 22px 70px rgba(15,23,42,0.08);
}

.biz-card-icon {
  width: 54px;
  height: 54px;
  border-radius: 20px;
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 950;
  margin-bottom: 22px;
}

.biz-card-title {
  font-size: 21px;
  line-height: 1.25;
  margin: 0;
  font-weight: 950;
}

.biz-card-text {
  margin: 12px 0 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.7;
  font-weight: 650;
}

.biz-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
}

.biz-price {
  border-radius: 999px;
  background: #f3e8ff;
  color: #6d28d9;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 950;
}

.biz-gallery-img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: 0 22px 70px rgba(15,23,42,0.12);
}

.biz-dark-section {
  background: #020617;
  color: #fff;
  border-radius: 42px;
  padding: 64px;
  box-shadow: 0 38px 120px rgba(2,6,23,0.35);
}

.biz-booking-box {
  background: #fff;
  color: #0f172a;
  border-radius: 32px;
  padding: 28px;
  box-shadow: 0 28px 90px rgba(2,6,23,0.25);
}

.biz-time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.biz-time {
  border: 1px solid #ede9fe;
  background: #f5f3ff;
  color: #6d28d9;
  border-radius: 18px;
  padding: 14px;
  text-align: center;
  font-weight: 950;
}

.biz-form {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

.biz-input {
  min-height: 52px;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 0 18px;
  font-weight: 700;
}

.biz-textarea {
  min-height: 130px;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 18px;
  font-weight: 700;
  resize: vertical;
}

.biz-footer {
  background: #020617;
  color: #fff;
  padding: 54px 72px;
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
  border-radius: 24px;
  padding: 22px;
}

@media (max-width: 900px) {
  .biz-nav {
    padding: 0 24px;
  }

  .biz-nav-links {
    display: none;
  }

  .biz-section,
  .biz-section-full {
    padding: 56px 20px;
  }

  .biz-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .biz-hero-card {
    padding: 32px;
    border-radius: 30px;
  }

  .biz-hero-image {
    height: 360px;
  }

  .biz-grid-3,
  .biz-grid-4,
  .biz-footer-grid {
    grid-template-columns: 1fr;
  }

  .biz-dark-section {
    padding: 32px;
    border-radius: 30px;
  }
}
`;

export const defaultBizuplyHtml = `
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
      <a href="#">דף הבית</a>
      <a href="#">אודות</a>
      <a href="#">שירותים</a>
      <a href="#">גלריה</a>
      <a href="#">תורים</a>
      <a href="#">צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full biz-hero">
    <div class="biz-hero-card">
      <div class="biz-pill">קריית אתא · איפור קבוע וטיפולי יופי</div>
      <h1 class="biz-title">הדר עשת ביוטי</h1>
      <p class="biz-subtitle">איפור קבוע וטיפולי יופי בהתאמה אישית, בגימור טבעי ומדויק.</p>

      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary" href="#">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary" href="#">שליחת הודעה</a>
      </div>
    </div>

    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>

  <section class="biz-section">
    <h2 class="biz-section-title">קצת על העסק</h2>
    <p class="biz-section-text">
      סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים.
      כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.
    </p>
  </section>

  <section class="biz-section">
    <h2 class="biz-section-title">השירותים שלנו</h2>

    <div class="biz-grid-3">
      <article class="biz-card" data-bizuply-source="services">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">איפור קבוע בגבות</h3>
        <p class="biz-card-text">עיצוב גבות טבעי ומדויק בהתאמה למבנה הפנים.</p>
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