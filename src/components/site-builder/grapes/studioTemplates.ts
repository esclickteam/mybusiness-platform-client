export type StudioTemplate = {
  id: string;
  name: string;
  description: string;
  preview: string;
  html: string;
};

export const studioTemplates: StudioTemplate[] = [
  {
    id: "luxury-beauty",
    name: "יוקרתי",
    description: "אתר יוקרתי לעסקי יופי, קליניקות וסטודיו",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=90",
    html: `
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

  <section class="biz-section-full biz-hero">
    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90" />
    </div>

    <div class="biz-hero-card">
      <div class="biz-pill">קריית אתא · איפור קבוע וטיפולי יופי</div>
      <h1 class="biz-title">הדר עשת ביוטי</h1>
      <p class="biz-subtitle">
        איפור קבוע וטיפולי יופי בהתאמה אישית, בגימור טבעי ומדויק.
      </p>

      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <h2 class="biz-section-title">אודות</h2>
    <p class="biz-section-text">
      סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים.
      כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.
    </p>
  </section>

  <section class="biz-section">
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
`,
  },
  {
    id: "modern-clean",
    name: "מודרני",
    description: "מבנה מודרני ונקי לעסקים מקצועיים",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">B</div>
      <div>
        <p class="biz-brand-title">שם העסק</p>
        <p class="biz-brand-subtitle">תחום העסק</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>דף הבית</a>
      <a>שירותים</a>
      <a>גלריה</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full">
    <div class="biz-hero-card">
      <div class="biz-pill">עסק מקצועי · אתר חכם</div>
      <h1 class="biz-title">בונים נוכחות דיגיטלית מרשימה</h1>
      <p class="biz-subtitle">
        אתר עסקי מקצועי עם שירותים, תיאום תורים, לידים, סליקה ולקוחות.
      </p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">התחלה</a>
        <a class="biz-btn biz-btn-secondary">יצירת קשר</a>
      </div>
    </div>
  </section>
</div>
`,
  },
  {
    id: "minimal",
    name: "מינימליסטי",
    description: "עיצוב נקי, שקט ואלגנטי",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=90",
    html: `
<div class="biz-page">
  <section class="biz-section">
    <h1 class="biz-title">שם העסק שלך</h1>
    <p class="biz-subtitle">
      תיאור קצר ומדויק של העסק, השירותים והערך שהלקוחות מקבלים.
    </p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">צור קשר</a>
    </div>
  </section>
</div>
`,
  },
];