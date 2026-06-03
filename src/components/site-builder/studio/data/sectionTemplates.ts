import type { SectionCategory, SectionTemplate } from "../types";

export const sectionCategories: { key: SectionCategory; label: string }[] = [
  { key: "welcome", label: "Welcome / הירו" },
  { key: "about", label: "אודות" },
  { key: "services", label: "שירותים" },
  { key: "gallery", label: "גלריה" },
  { key: "testimonials", label: "ביקורות" },
  { key: "contact", label: "יצירת קשר" },
  { key: "store", label: "חנות" },
  { key: "bookings", label: "תורים" },
  { key: "forms", label: "טפסים" },
  { key: "club", label: "מועדון לקוחות" },
  { key: "basic", label: "בסיסי" },
];

export const sectionTemplates: SectionTemplate[] = [
  /* =====================================================
     WELCOME / HERO
  ===================================================== */
  {
    id: "welcome-luxury-split",
    category: "welcome",
    title: "הירו יוקרתי תמונה וטקסט",
    description: "פתיחה פרימיום עם תמונה, כותרת גדולה וכפתורים",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section-full biz-hero" data-animate="fade-up">
  <div class="biz-hero-image-wrap">
    <img class="biz-hero-image" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90" />
  </div>

  <div class="biz-hero-card">
    <div class="biz-pill">עסק מקצועי · אתר חכם</div>
    <h1 class="biz-title">כותרת ראשית מרשימה</h1>
    <p class="biz-subtitle">תיאור קצר ומכירתי שמסביר ללקוח למה לבחור דווקא בעסק הזה.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">צור קשר</a>
    </div>
  </div>
</section>
`,
  },
  {
    id: "welcome-background-image",
    category: "welcome",
    title: "הירו תמונת רקע",
    description: "סקשן פתיחה עם תמונת רקע, overlay וכפתור",
    preview:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-bg-image" data-animate="blur-reveal" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');">
    <div class="biz-pill">ברוכים הבאים</div>
    <h1 class="biz-title" style="color:#fff;max-width:820px;">כותרת על תמונת רקע</h1>
    <p class="biz-subtitle" style="color:rgba(255,255,255,0.84);">אפשר לשנות תמונה, צבע, overlay, פינות, ריווח ואנימציה.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">התחלה</a>
      <a class="biz-btn biz-btn-secondary">מידע נוסף</a>
    </div>
  </div>
</section>
`,
  },
  {
    id: "welcome-centered-glass",
    category: "welcome",
    title: "הירו ממורכז Glass",
    description: "פתיחה נקייה ומרכזית עם כרטיס זכוכית",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section-wide">
  <div class="biz-hero-card" data-animate="zoom-in" style="text-align:center;margin:auto;max-width:980px;">
    <div class="biz-pill">סטודיו מקצועי · חוויה אישית</div>
    <h1 class="biz-title">אתר עסקי שנראה פרימיום</h1>
    <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">כותרת חזקה, מסר ברור וכפתורי פעולה שמובילים את הלקוח לפעולה.</p>
    <div class="biz-actions" style="justify-content:center;">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
    </div>
  </div>
</section>
`,
  },
  {
    id: "welcome-editorial",
    category: "welcome",
    title: "הירו Editorial",
    description: "מבנה אופנתי עם תמונה גדולה וטקסט נקי",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section-wide biz-split" data-animate="fade-up">
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">Premium Studio</p>
    <h1 class="biz-title">נוכחות דיגיטלית שמרגישה יוקרתית</h1>
    <p class="biz-subtitle">מבנה שמתאים לעסק שרוצה להיראות ברמה גבוהה כבר מהרגע הראשון.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">התחלה</a>
      <a class="biz-btn biz-btn-secondary">צפייה בשירותים</a>
    </div>
  </div>

  <div class="biz-image-card">
    <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=90" />
  </div>
</section>
`,
  },
  {
    id: "welcome-dark-premium",
    category: "welcome",
    title: "הירו כהה פרימיום",
    description: "פתיחה דרמטית לעסקים יוקרתיים",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-dark-section" data-animate="fade-up">
    <div class="biz-split">
      <div>
        <p class="biz-pill">Premium Website</p>
        <h1 class="biz-section-title" style="text-align:right;color:#fff;">אתר עסקי שמרגיש יוקרתי</h1>
        <p class="biz-card-text" style="color:rgba(255,255,255,0.76);font-size:18px;">
          מתאים לעסקים שרוצים מראה דרמטי, יוקרתי ומבדל.
        </p>
        <div class="biz-actions">
          <a class="biz-btn biz-btn-primary">קביעת תור</a>
          <a class="biz-btn biz-btn-secondary">צור קשר</a>
        </div>
      </div>

      <div class="biz-booking-box">
        <h3 class="biz-card-title">הפעולה הבאה</h3>
        <p class="biz-card-text">הובילו את הלקוח להשארת פרטים או קביעת תור.</p>
        <a class="biz-btn biz-btn-primary" style="margin-top:22px;">אני רוצה להתחיל</a>
      </div>
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     ABOUT
  ===================================================== */
  {
    id: "about-split-image",
    category: "about",
    title: "אודות עם תמונה",
    description: "טקסט אודות לצד תמונה",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section biz-split">
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
    <h2 class="biz-section-title" style="text-align:right;">קצת על העסק</h2>
    <p class="biz-card-text" style="font-size:18px;">
      ספרו כאן על העסק, הניסיון, השירותים, הסגנון והייחודיות שלכם.
    </p>
  </div>

  <div class="biz-image-card">
    <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=90" />
  </div>
</section>
`,
  },
  {
    id: "about-values-cards",
    category: "about",
    title: "אודות עם ערכים",
    description: "שלושה כרטיסי ערך שמסבירים למה לבחור בעסק",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">למה לבחור בנו</p>
  <h2 class="biz-section-title">העסק בנוי סביב חוויה מקצועית</h2>
  <p class="biz-section-text">שלושה מסרים קצרים שמחזקים אמון ומסבירים את היתרון שלכם.</p>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div class="biz-card-icon">01</div>
      <h3 class="biz-card-title">מקצועיות</h3>
      <p class="biz-card-text">עבודה מדויקת, תהליך ברור ותוצאה איכותית.</p>
    </article>
    <article class="biz-card">
      <div class="biz-card-icon">02</div>
      <h3 class="biz-card-title">יחס אישי</h3>
      <p class="biz-card-text">התאמה מלאה לצורך, לסגנון ולמטרה של הלקוח.</p>
    </article>
    <article class="biz-card">
      <div class="biz-card-icon">03</div>
      <h3 class="biz-card-title">זמינות</h3>
      <p class="biz-card-text">אפשר להשאיר פרטים, לשלוח הודעה או לקבוע תור אונליין.</p>
    </article>
  </div>
</section>
`,
  },
  {
    id: "about-story-soft",
    category: "about",
    title: "סיפור העסק",
    description: "סקשן טקסטואלי רך ומעוצב",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-strip-soft">
    <p class="biz-section-kicker">הסיפור שלנו</p>
    <h2 class="biz-section-title">עסק שנבנה מתוך אהבה למקצוע</h2>
    <p class="biz-section-text">
      כאן אפשר לספר על הדרך, הניסיון, הגישה המקצועית והחוויה שהלקוחות מקבלים.
      זה סקשן מצוין לבניית אמון.
    </p>
  </div>
</section>
`,
  },

  /* =====================================================
     SERVICES
  ===================================================== */
  {
    id: "services-cards-3",
    category: "services",
    title: "שירותים בכרטיסים",
    description: "גריד שירותים עם מחיר וזמן",
    preview:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="services">
  <p class="biz-section-kicker">שירותים</p>
  <h2 class="biz-section-title">השירותים שלי</h2>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות ראשון</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row">
        <span>60 דקות</span>
        <span class="biz-price">₪350</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות שני</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row">
        <span>90 דקות</span>
        <span class="biz-price">₪850</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות שלישי</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row">
        <span>45 דקות</span>
        <span class="biz-price">₪250</span>
      </div>
    </article>
  </div>
</section>
`,
  },
  {
    id: "services-list-premium",
    category: "services",
    title: "שירותים ברשימה יוקרתית",
    description: "רשימת שירותים אופקית ונקייה",
    preview:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">מה אנחנו מציעים</p>
  <h2 class="biz-section-title">שירותים מובילים</h2>

  <div style="margin-top:44px;display:grid;gap:16px;">
    <article class="biz-card" style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
      <div>
        <h3 class="biz-card-title">שירות פרימיום</h3>
        <p class="biz-card-text">תיאור קצר וברור של השירות.</p>
      </div>
      <span class="biz-price">₪450</span>
    </article>

    <article class="biz-card" style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
      <div>
        <h3 class="biz-card-title">שירות מתקדם</h3>
        <p class="biz-card-text">תיאור קצר וברור של השירות.</p>
      </div>
      <span class="biz-price">₪650</span>
    </article>

    <article class="biz-card" style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
      <div>
        <h3 class="biz-card-title">פגישת ייעוץ</h3>
        <p class="biz-card-text">התחלה קלה לפני בחירת השירות.</p>
      </div>
      <span class="biz-price">₪250</span>
    </article>
  </div>
</section>
`,
  },
  {
    id: "services-dark",
    category: "services",
    title: "שירותים כהה",
    description: "סקשן שירותים כהה עם כרטיסים לבנים",
    preview:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-dark-section">
    <p class="biz-pill">שירותים</p>
    <h2 class="biz-section-title" style="text-align:right;color:#fff;margin-top:24px;">מה אפשר להזמין?</h2>

    <div class="biz-grid-3">
      <article class="biz-card">
        <h3 class="biz-card-title">שירות ראשון</h3>
        <p class="biz-card-text">תיאור השירות.</p>
        <span class="biz-price">₪350</span>
      </article>
      <article class="biz-card">
        <h3 class="biz-card-title">שירות שני</h3>
        <p class="biz-card-text">תיאור השירות.</p>
        <span class="biz-price">₪550</span>
      </article>
      <article class="biz-card">
        <h3 class="biz-card-title">שירות שלישי</h3>
        <p class="biz-card-text">תיאור השירות.</p>
        <span class="biz-price">₪850</span>
      </article>
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     GALLERY
  ===================================================== */
  {
    id: "gallery-grid-4",
    category: "gallery",
    title: "גלריה 4 תמונות",
    description: "תמונות עבודות בגריד נקי",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">עבודות אחרונות</h2>
  <div class="biz-grid-4">
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90" />
  </div>
</section>
`,
  },
  {
    id: "gallery-carousel",
    category: "gallery",
    title: "קרוסלת גלריה",
    description: "גלריה אופקית נגללת",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">לפני ואחרי / עבודות</h2>

  <div class="biz-carousel">
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90" />
  </div>
</section>
`,
  },
  {
    id: "gallery-featured",
    category: "gallery",
    title: "גלריה תמונה גדולה",
    description: "תמונה ראשית גדולה ולצידה תמונות קטנות",
    preview:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">תצוגת עבודות</h2>

  <div class="biz-split" style="margin-top:44px;">
    <div class="biz-image-card">
      <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=90" />
    </div>

    <div class="biz-grid-2" style="margin-top:0;">
      <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" />
      <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90" />
      <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90" />
      <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=90" />
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     TESTIMONIALS
  ===================================================== */
  {
    id: "reviews-cards",
    category: "testimonials",
    title: "ביקורות בכרטיסים",
    description: "ביקורות לקוחות בגריד",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="reviews">
  <p class="biz-section-kicker">ביקורות</p>
  <h2 class="biz-section-title">לקוחות מספרים</h2>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">שירות מושלם ותוצאה מדהימה!</p>
      <h3 class="biz-card-title">מיכל</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">מקצועית, מדויקת וסבלנית.</p>
      <h3 class="biz-card-title">נועה</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">חוויה מעולה מההתחלה ועד הסוף.</p>
      <h3 class="biz-card-title">דנה</h3>
    </article>
  </div>
</section>
`,
  },
  {
    id: "reviews-carousel-premium",
    category: "testimonials",
    title: "ביקורות קרוסלה",
    description: "ביקורות נגללות בסגנון פרימיום",
    preview:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">המלצות</p>
  <h2 class="biz-section-title">מה הלקוחות אומרים?</h2>

  <div class="biz-carousel">
    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">החוויה הייתה מקצועית, נעימה והתוצאה בדיוק כמו שרציתי.</p>
      <h3 class="biz-card-title">לקוחה מרוצה</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">שירות ברמה גבוהה מאוד, ממליצה בחום.</p>
      <h3 class="biz-card-title">לקוחה מרוצה</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">מקצועיות, סבלנות ויחס אישי לאורך כל הדרך.</p>
      <h3 class="biz-card-title">לקוחה מרוצה</h3>
    </article>
  </div>
</section>
`,
  },

  /* =====================================================
     CONTACT
  ===================================================== */
  {
    id: "contact-form-split",
    category: "contact",
    title: "טופס צור קשר",
    description: "טופס יצירת קשר מלא לצד טקסט",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section biz-split">
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">צור קשר</p>
    <h2 class="biz-section-title" style="text-align:right;">נשמח לשמוע ממך</h2>
    <p class="biz-card-text" style="font-size:18px;">השאירו פרטים ונחזור אליכם בהקדם.</p>
  </div>

  <form class="biz-form">
    <input class="biz-input" placeholder="שם מלא" />
    <input class="biz-input" placeholder="טלפון" />
    <input class="biz-input" placeholder="אימייל" />
    <textarea class="biz-textarea" placeholder="הודעה"></textarea>
    <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
  </form>
</section>
`,
  },
  {
    id: "contact-cards",
    category: "contact",
    title: "כרטיסי יצירת קשר",
    description: "טלפון, וואטסאפ, מייל וכתובת",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <p class="biz-section-kicker">יצירת קשר</p>
  <h2 class="biz-section-title">אפשר לפנות אלינו בכל דרך</h2>

  <div class="biz-grid-4">
    <article class="biz-card">
      <div class="biz-card-icon">☎</div>
      <h3 class="biz-card-title">טלפון</h3>
      <p class="biz-card-text">050-0000000</p>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">✉</div>
      <h3 class="biz-card-title">אימייל</h3>
      <p class="biz-card-text">hello@business.com</p>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">☘</div>
      <h3 class="biz-card-title">וואטסאפ</h3>
      <p class="biz-card-text">שליחת הודעה מהירה</p>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">⌂</div>
      <h3 class="biz-card-title">כתובת</h3>
      <p class="biz-card-text">קריית אתא</p>
    </article>
  </div>
</section>
`,
  },

  /* =====================================================
     STORE
  ===================================================== */
  {
    id: "store-products-grid",
    category: "store",
    title: "חנות מוצרים",
    description: "מוצרים עם מחיר וכפתור רכישה",
    preview:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="products">
  <p class="biz-section-kicker">חנות</p>
  <h2 class="biz-section-title">מוצרים לרכישה</h2>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
        <img style="height:220px;" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=90" />
      </div>
      <h3 class="biz-card-title">מוצר ראשון</h3>
      <p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary">הוספה לסל</a>
        <span class="biz-price">₪129</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
        <img style="height:220px;" src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=90" />
      </div>
      <h3 class="biz-card-title">מוצר שני</h3>
      <p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary">הוספה לסל</a>
        <span class="biz-price">₪99</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
        <img style="height:220px;" src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=90" />
      </div>
      <h3 class="biz-card-title">מוצר שלישי</h3>
      <p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary">הוספה לסל</a>
        <span class="biz-price">₪249</span>
      </div>
    </article>
  </div>
</section>
`,
  },
  {
    id: "store-featured-product",
    category: "store",
    title: "מוצר מוביל",
    description: "מוצר אחד גדול עם תמונה וכפתור",
    preview:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section biz-split">
  <div class="biz-image-card">
    <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=90" />
  </div>

  <div>
    <p class="biz-section-kicker" style="margin-right:0;">מוצר מומלץ</p>
    <h2 class="biz-section-title" style="text-align:right;">מוצר הדגל של העסק</h2>
    <p class="biz-card-text" style="font-size:18px;">תיאור קצר, מקצועי ומכירתי של המוצר.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">רכישה עכשיו</a>
      <span class="biz-price">₪249</span>
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     BOOKINGS
  ===================================================== */
  {
    id: "booking-smart-dark",
    category: "bookings",
    title: "תיאום תורים כהה",
    description: "בלוק תורים חכם עם שעות פנויות",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="booking">
  <div class="biz-dark-section">
    <div class="biz-split">
      <div>
        <p class="biz-pill">מחובר ליומן</p>
        <h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2>
        <p class="biz-card-text" style="color:rgba(255,255,255,0.7);font-size:18px;">הלקוח בוחר שירות, תאריך ושעה פנויה.</p>
      </div>

      <div class="biz-booking-box">
        <div class="biz-time-grid">
          <div class="biz-time">09:00</div>
          <div class="biz-time">10:30</div>
          <div class="biz-time">12:00</div>
          <div class="biz-time">14:00</div>
          <div class="biz-time">16:30</div>
          <div class="biz-time">18:00</div>
        </div>
      </div>
    </div>
  </div>
</section>
`,
  },
  {
    id: "booking-light-cards",
    category: "bookings",
    title: "תורים בהיר",
    description: "בלוק תורים נקי ובהיר",
    preview:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="booking">
  <p class="biz-section-kicker">תיאום תורים</p>
  <h2 class="biz-section-title">בחרו שעה פנויה</h2>
  <p class="biz-section-text">הזמנת תור מהירה מתוך האתר.</p>

  <div class="biz-booking-box" style="margin-top:44px;">
    <div class="biz-time-grid">
      <div class="biz-time">09:00</div>
      <div class="biz-time">10:30</div>
      <div class="biz-time">12:00</div>
      <div class="biz-time">14:00</div>
      <div class="biz-time">16:30</div>
      <div class="biz-time">18:00</div>
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     FORMS
  ===================================================== */
  {
    id: "form-lead-centered",
    category: "forms",
    title: "טופס ליד ממורכז",
    description: "טופס לידים שמתחבר ל־CRM",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="lead-form">
  <div class="biz-hero-card" style="max-width:820px;margin:auto;">
    <p class="biz-section-kicker">השאירו פרטים</p>
    <h2 class="biz-section-title">נחזור אליכם בהקדם</h2>

    <form class="biz-form">
      <input class="biz-input" placeholder="שם מלא" />
      <input class="biz-input" placeholder="טלפון" />
      <input class="biz-input" placeholder="אימייל" />
      <textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea>
      <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
    </form>
  </div>
</section>
`,
  },
  {
    id: "form-dark",
    category: "forms",
    title: "טופס כהה",
    description: "טופס פרימיום על רקע כהה",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="lead-form">
  <div class="biz-dark-section">
    <h2 class="biz-section-title" style="color:#fff;">השאירו פרטים</h2>
    <p class="biz-section-text" style="color:rgba(255,255,255,0.72);">כל ליד ייכנס למערכת ה־CRM של העסק.</p>

    <form class="biz-form" style="max-width:760px;margin-left:auto;margin-right:auto;">
      <input class="biz-input" placeholder="שם מלא" />
      <input class="biz-input" placeholder="טלפון" />
      <input class="biz-input" placeholder="אימייל" />
      <textarea class="biz-textarea" placeholder="הודעה"></textarea>
      <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
    </form>
  </div>
</section>
`,
  },

  /* =====================================================
     CLUB
  ===================================================== */
  {
    id: "club-gradient",
    category: "club",
    title: "מועדון לקוחות גרדיאנט",
    description: "הרשמה להטבות וקופונים",
    preview:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="customer-club">
  <div style="border-radius:44px;padding:54px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 34px 110px rgba(139,92,246,0.28);">
    <h2 style="margin:0;font-size:44px;font-weight:950;">הצטרפות למועדון לקוחות</h2>
    <p style="margin:16px 0 0;font-weight:750;color:rgba(255,255,255,0.84);">קבלו הטבות, קופונים ועדכונים מהעסק.</p>
    <a class="biz-btn" style="margin-top:26px;background:#fff;color:#111827;">הצטרפות</a>
  </div>
</section>
`,
  },
  {
    id: "club-coupon-card",
    category: "club",
    title: "קופון מועדון",
    description: "סקשן מועדון עם קופון הנחה",
    preview:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section" data-bizuply-block="customer-club">
  <div class="biz-strip-soft">
    <div class="biz-split">
      <div>
        <p class="biz-section-kicker" style="margin-right:0;">מועדון לקוחות</p>
        <h2 class="biz-section-title" style="text-align:right;">קבלו הטבות לפני כולם</h2>
        <p class="biz-card-text" style="font-size:18px;">הרשמה למועדון לקוחות, קופונים ועדכונים.</p>
      </div>
      <div class="biz-card" style="text-align:center;">
        <p class="biz-card-text">קוד קופון</p>
        <h3 class="biz-title" style="font-size:44px;margin-top:8px;">VIP10</h3>
        <a class="biz-btn biz-btn-primary" style="margin-top:22px;">הצטרפות</a>
      </div>
    </div>
  </div>
</section>
`,
  },

  /* =====================================================
     BASIC
  ===================================================== */
  {
    id: "basic-empty-section",
    category: "basic",
    title: "סקשן ריק",
    description: "התחלה נקייה לבנייה חופשית",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-strip-soft">
    <h2 class="biz-section-title">סקשן חדש</h2>
    <p class="biz-section-text">התחילי לערוך כאן טקסט, צבעים, רקע, תמונה או כל אלמנט אחר.</p>
  </div>
</section>
`,
  },
  {
    id: "basic-counters",
    category: "basic",
    title: "מספרים עולים",
    description: "סטטיסטיקות ואמון",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `
<section class="biz-section">
  <div class="biz-grid-3">
    <div class="biz-counter">
      <strong>500+</strong>
      <span>לקוחות מרוצים</span>
    </div>
    <div class="biz-counter">
      <strong>7</strong>
      <span>שנות ניסיון</span>
    </div>
    <div class="biz-counter">
      <strong>98%</strong>
      <span>שביעות רצון</span>
    </div>
  </div>
</section>
`,
  },
  {
    id: "basic-marquee",
    category: "basic",
    title: "טקסט זז",
    description: "Marquee למבצעים / מסרים",
    preview:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=90",
    html: `
<section>
  <div class="biz-marquee">
    <span>מבצע מיוחד · קביעת תור אונליין · שירות מקצועי · חוויית לקוח פרימיום · </span>
  </div>
</section>
`,
  },
];