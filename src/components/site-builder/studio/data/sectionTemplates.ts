/*
  Bizuply Website Studio — Section Templates
  Full professional section library.
  Replace: studio/data/sectionTemplates.ts
*/

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

const images = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  makeup:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
  business:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90",
  people:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
  food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=90",
};

function template(
  id: string,
  category: SectionCategory,
  title: string,
  description: string,
  preview: string,
  html: string
): SectionTemplate {
  return {
    id,
    category,
    title,
    description,
    preview,
    html,
  };
}

/* =====================================================
   WELCOME / HERO — 10 מבנים
===================================================== */

const welcomeTemplates: SectionTemplate[] = [
  template(
    "welcome-01-luxury-split",
    "welcome",
    "הירו יוקרתי תמונה וטקסט",
    "תמונה גדולה, כותרת חזקה וכפתורי פעולה",
    images.beauty,
    `
<section class="biz-section-full biz-hero" data-animate="fade-up">
  <div class="biz-hero-image-wrap">
    <img class="biz-hero-image" src="${images.beauty}" />
  </div>
  <div class="biz-hero-card">
    <div class="biz-pill">עסק מקצועי · אתר חכם</div>
    <h1 class="biz-title">כותרת ראשית מרשימה</h1>
    <p class="biz-subtitle">תיאור קצר ומכירתי שמסביר למה לבחור דווקא בעסק הזה.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">צור קשר</a>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-02-background",
    "welcome",
    "הירו תמונת רקע",
    "רקע תמונה מלא עם Overlay וכפתורים",
    images.makeup,
    `
<section class="biz-section">
  <div class="biz-bg-image" data-animate="blur-reveal" style="background-image:url('${images.makeup}');">
    <div class="biz-pill">ברוכים הבאים</div>
    <h1 class="biz-title" style="color:#fff;max-width:850px;">כותרת על תמונת רקע</h1>
    <p class="biz-subtitle" style="color:rgba(255,255,255,.84);">אפשר לשנות תמונה, צבע, Overlay, פינות ואנימציה.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">התחלה</a>
      <a class="biz-btn biz-btn-secondary">מידע נוסף</a>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-03-centered-glass",
    "welcome",
    "הירו ממורכז Glass",
    "כרטיס זכוכית יוקרתי במרכז",
    images.salon,
    `
<section class="biz-section-wide">
  <div class="biz-hero-card" data-animate="zoom-in" style="text-align:center;margin:auto;max-width:980px;">
    <div class="biz-pill">סטודיו מקצועי · חוויה אישית</div>
    <h1 class="biz-title">אתר עסקי שנראה פרימיום</h1>
    <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">כותרת חזקה, מסר ברור וכפתורי פעולה שמובילים את הלקוח.</p>
    <div class="biz-actions" style="justify-content:center;">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-04-editorial",
    "welcome",
    "הירו Editorial",
    "מראה אופנתי עם טקסט ותמונה גדולה",
    images.salon,
    `
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
    <img src="${images.salon}" />
  </div>
</section>`
  ),

  template(
    "welcome-05-dark",
    "welcome",
    "הירו כהה פרימיום",
    "סקשן פתיחה דרמטי ויוקרתי",
    images.business,
    `
<section class="biz-section">
  <div class="biz-dark-section" data-animate="fade-up">
    <div class="biz-split">
      <div>
        <p class="biz-pill">Premium Website</p>
        <h1 class="biz-section-title" style="text-align:right;color:#fff;">אתר עסקי שמרגיש יוקרתי</h1>
        <p class="biz-card-text" style="color:rgba(255,255,255,.76);font-size:18px;">מתאים לעסקים שרוצים מראה דרמטי, יוקרתי ומבדל.</p>
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
</section>`
  ),

  template(
    "welcome-06-minimal",
    "welcome",
    "הירו מינימליסטי",
    "נקי, לבן, אלגנטי ומהיר לעריכה",
    images.office,
    `
<section class="biz-section" style="min-height:720px;display:flex;align-items:center;justify-content:center;text-align:center;">
  <div>
    <div class="biz-pill">עסק מקצועי · אתר נקי</div>
    <h1 class="biz-title">שם העסק שלך</h1>
    <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">משפט קצר ומדויק שמסביר מה העסק עושה ולמה כדאי לבחור בו.</p>
    <div class="biz-actions" style="justify-content:center;">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">צור קשר</a>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-07-product",
    "welcome",
    "הירו מוצר",
    "מתאים לחנות או מוצר מוביל",
    images.product,
    `
<section class="biz-section-wide biz-split">
  <div class="biz-image-card">
    <img src="${images.product}" />
  </div>
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">מוצר מוביל</p>
    <h1 class="biz-title">מוצר שנראה מעולה ונמכר מהר</h1>
    <p class="biz-subtitle">הציגו מוצר, מחיר, יתרונות וכפתור רכישה ברור.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">רכישה עכשיו</a>
      <span class="biz-price">₪249</span>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-08-booking-first",
    "welcome",
    "הירו ממוקד תורים",
    "פתיחה שמובילה ישר לקביעת תור",
    images.clinic,
    `
<section class="biz-section">
  <div class="biz-dark-section">
    <div class="biz-split">
      <div>
        <p class="biz-pill">מחובר ליומן</p>
        <h1 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור ישירות מהאתר</h1>
        <p class="biz-card-text" style="color:rgba(255,255,255,.72);font-size:18px;">הלקוח בוחר שירות, תאריך ושעה פנויה.</p>
      </div>
      <div class="biz-booking-box">
        <div class="biz-time-grid">
          <div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div>
          <div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div>
        </div>
      </div>
    </div>
  </div>
</section>`
  ),

  template(
    "welcome-09-lead-first",
    "welcome",
    "הירו עם טופס ליד",
    "פתיחה עם טופס שמכניס לידים",
    images.business,
    `
<section class="biz-section-wide biz-split">
  <div>
    <div class="biz-pill">CRM מחובר</div>
    <h1 class="biz-title">הופכים מבקרים ללידים</h1>
    <p class="biz-subtitle">טופס קצר וברור שמכניס כל פנייה למערכת.</p>
  </div>
  <form class="biz-form biz-card">
    <input class="biz-input" placeholder="שם מלא" />
    <input class="biz-input" placeholder="טלפון" />
    <input class="biz-input" placeholder="אימייל" />
    <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
  </form>
</section>`
  ),

  template(
    "welcome-10-restaurant",
    "welcome",
    "הירו למסעדה / אוכל",
    "תמונה גדולה, תפריט והזמנה",
    images.food,
    `
<section class="biz-section">
  <div class="biz-bg-image" style="background-image:url('${images.food}');">
    <p class="biz-pill">מסעדה · אירועים · משלוחים</p>
    <h1 class="biz-title" style="color:#fff;max-width:850px;">חוויה קולינרית שנראית מעולה כבר באתר</h1>
    <p class="biz-subtitle" style="color:rgba(255,255,255,.84);">הציגו תפריט, מנות, הזמנות, אירועים ויצירת קשר.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">הזמנת שולחן</a>
      <a class="biz-btn biz-btn-secondary">צפייה בתפריט</a>
    </div>
  </div>
</section>`
  ),
];

/* =====================================================
   ABOUT — 10 מבנים
===================================================== */

const aboutTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  const variants = [
    {
      title: "אודות עם תמונה",
      html: `
<section class="biz-section biz-split">
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
    <h2 class="biz-section-title" style="text-align:right;">קצת על העסק</h2>
    <p class="biz-card-text" style="font-size:18px;">ספרו על העסק, הניסיון, הסגנון והחוויה שהלקוח מקבל.</p>
  </div>
  <div class="biz-image-card"><img src="${images.salon}" /></div>
</section>`,
    },
    {
      title: "אודות עם 3 ערכים",
      html: `
<section class="biz-section">
  <p class="biz-section-kicker">למה לבחור בנו</p>
  <h2 class="biz-section-title">העסק בנוי סביב חוויה מקצועית</h2>
  <div class="biz-grid-3">
    <article class="biz-card"><div class="biz-card-icon">01</div><h3 class="biz-card-title">מקצועיות</h3><p class="biz-card-text">עבודה מדויקת ותוצאה איכותית.</p></article>
    <article class="biz-card"><div class="biz-card-icon">02</div><h3 class="biz-card-title">יחס אישי</h3><p class="biz-card-text">התאמה מלאה לצורך ולסגנון.</p></article>
    <article class="biz-card"><div class="biz-card-icon">03</div><h3 class="biz-card-title">זמינות</h3><p class="biz-card-text">תקשורת מהירה ותהליך ברור.</p></article>
  </div>
</section>`,
    },
    {
      title: "סיפור העסק",
      html: `
<section class="biz-section">
  <div class="biz-strip-soft">
    <p class="biz-section-kicker">הסיפור שלנו</p>
    <h2 class="biz-section-title">עסק שנבנה מתוך אהבה למקצוע</h2>
    <p class="biz-section-text">כאן אפשר לספר על הדרך, הניסיון, הגישה המקצועית והערך שהלקוחות מקבלים.</p>
  </div>
</section>`,
    },
  ];

  const variant = variants[index % variants.length];

  return template(
    `about-${String(n).padStart(2, "0")}`,
    "about",
    `${variant.title} ${n}`,
    "מבנה אודות לבחירה ועריכה",
    [images.salon, images.business, images.office][index % 3],
    variant.html
  );
});

/* =====================================================
   SERVICES — 10 מבנים
===================================================== */

const servicesTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  const htmlOptions = [
    `
<section class="biz-section" data-bizuply-block="services">
  <p class="biz-section-kicker">שירותים</p>
  <h2 class="biz-section-title">השירותים שלי</h2>
  <div class="biz-grid-3">
    <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות ראשון</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div></article>
    <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שני</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>90 דקות</span><span class="biz-price">₪850</span></div></article>
    <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שלישי</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>45 דקות</span><span class="biz-price">₪250</span></div></article>
  </div>
</section>`,
    `
<section class="biz-section">
  <p class="biz-section-kicker">מה אנחנו מציעים</p>
  <h2 class="biz-section-title">שירותים מובילים</h2>
  <div style="margin-top:44px;display:grid;gap:16px;">
    <article class="biz-card" style="display:flex;align-items:center;justify-content:space-between;gap:24px;"><div><h3 class="biz-card-title">שירות פרימיום</h3><p class="biz-card-text">תיאור קצר וברור של השירות.</p></div><span class="biz-price">₪450</span></article>
    <article class="biz-card" style="display:flex;align-items:center;justify-content:space-between;gap:24px;"><div><h3 class="biz-card-title">שירות מתקדם</h3><p class="biz-card-text">תיאור קצר וברור של השירות.</p></div><span class="biz-price">₪650</span></article>
  </div>
</section>`,
    `
<section class="biz-section">
  <div class="biz-dark-section">
    <p class="biz-pill">שירותים</p>
    <h2 class="biz-section-title" style="text-align:right;color:#fff;margin-top:24px;">מה אפשר להזמין?</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><h3 class="biz-card-title">שירות ראשון</h3><p class="biz-card-text">תיאור השירות.</p><span class="biz-price">₪350</span></article>
      <article class="biz-card"><h3 class="biz-card-title">שירות שני</h3><p class="biz-card-text">תיאור השירות.</p><span class="biz-price">₪550</span></article>
      <article class="biz-card"><h3 class="biz-card-title">שירות שלישי</h3><p class="biz-card-text">תיאור השירות.</p><span class="biz-price">₪850</span></article>
    </div>
  </div>
</section>`,
  ];

  return template(
    `services-${String(n).padStart(2, "0")}`,
    "services",
    `מבנה שירותים ${n}`,
    "כרטיסי שירותים, רשימות, מחירים וזמנים",
    [images.beauty, images.clinic, images.salon][index % 3],
    htmlOptions[index % htmlOptions.length]
  );
});

/* =====================================================
   GALLERY — 10 מבנים
===================================================== */

const galleryTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  const galleryHtml = [
    `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">עבודות אחרונות</h2>
  <div class="biz-grid-4">
    <img class="biz-gallery-img" src="${images.makeup}" />
    <img class="biz-gallery-img" src="${images.salon}" />
    <img class="biz-gallery-img" src="${images.beauty}" />
    <img class="biz-gallery-img" src="${images.product}" />
  </div>
</section>`,
    `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">לפני ואחרי / עבודות</h2>
  <div class="biz-carousel">
    <img class="biz-gallery-img" src="${images.makeup}" />
    <img class="biz-gallery-img" src="${images.salon}" />
    <img class="biz-gallery-img" src="${images.beauty}" />
    <img class="biz-gallery-img" src="${images.product}" />
  </div>
</section>`,
    `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">תצוגת עבודות</h2>
  <div class="biz-split" style="margin-top:44px;">
    <div class="biz-image-card"><img src="${images.makeup}" /></div>
    <div class="biz-grid-2" style="margin-top:0;">
      <img class="biz-gallery-img" src="${images.salon}" />
      <img class="biz-gallery-img" src="${images.beauty}" />
      <img class="biz-gallery-img" src="${images.product}" />
      <img class="biz-gallery-img" src="${images.office}" />
    </div>
  </div>
</section>`,
  ];

  return template(
    `gallery-${String(n).padStart(2, "0")}`,
    "gallery",
    `מבנה גלריה ${n}`,
    "גריד, קרוסלה, תמונה מובילה ומבני גלריה שונים",
    [images.makeup, images.salon, images.beauty][index % 3],
    galleryHtml[index % galleryHtml.length]
  );
});

/* =====================================================
   TESTIMONIALS — 10 מבנים
===================================================== */

const testimonialsTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  return template(
    `testimonials-${String(n).padStart(2, "0")}`,
    "testimonials",
    `מבנה ביקורות ${n}`,
    "ביקורות לקוחות בכרטיסים / קרוסלה",
    images.people,
    `
<section class="biz-section" data-bizuply-block="reviews">
  <p class="biz-section-kicker">ביקורות</p>
  <h2 class="biz-section-title">לקוחות מספרים</h2>
  <div class="${index % 2 === 0 ? "biz-grid-3" : "biz-carousel"}">
    <article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">שירות מושלם ותוצאה מדהימה!</p><h3 class="biz-card-title">מיכל</h3></article>
    <article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">מקצועית, מדויקת וסבלנית.</p><h3 class="biz-card-title">נועה</h3></article>
    <article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">חוויה מעולה מההתחלה ועד הסוף.</p><h3 class="biz-card-title">דנה</h3></article>
  </div>
</section>`
  );
});

/* =====================================================
   CONTACT — 10 מבנים
===================================================== */

const contactTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  const html = index % 2 === 0
    ? `
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
</section>`
    : `
<section class="biz-section">
  <p class="biz-section-kicker">יצירת קשר</p>
  <h2 class="biz-section-title">אפשר לפנות אלינו בכל דרך</h2>
  <div class="biz-grid-4">
    <article class="biz-card"><div class="biz-card-icon">☎</div><h3 class="biz-card-title">טלפון</h3><p class="biz-card-text">050-0000000</p></article>
    <article class="biz-card"><div class="biz-card-icon">✉</div><h3 class="biz-card-title">אימייל</h3><p class="biz-card-text">hello@business.com</p></article>
    <article class="biz-card"><div class="biz-card-icon">☘</div><h3 class="biz-card-title">וואטסאפ</h3><p class="biz-card-text">שליחת הודעה מהירה</p></article>
    <article class="biz-card"><div class="biz-card-icon">⌂</div><h3 class="biz-card-title">כתובת</h3><p class="biz-card-text">קריית אתא</p></article>
  </div>
</section>`;

  return template(
    `contact-${String(n).padStart(2, "0")}`,
    "contact",
    `מבנה יצירת קשר ${n}`,
    "טופס, כרטיסי קשר, וואטסאפ ופרטי עסק",
    images.office,
    html
  );
});

/* =====================================================
   STORE — 10 מבנים
===================================================== */

const storeTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  return template(
    `store-${String(n).padStart(2, "0")}`,
    "store",
    `מבנה חנות ${n}`,
    "מוצרים, מחיר, הוספה לסל וסליקה",
    [images.store, images.product][index % 2],
    `
<section class="biz-section" data-bizuply-block="products">
  <p class="biz-section-kicker">חנות</p>
  <h2 class="biz-section-title">${index % 2 === 0 ? "מוצרים לרכישה" : "מוצרים נבחרים"}</h2>
  <div class="${index % 3 === 0 ? "biz-carousel" : "biz-grid-3"}">
    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;"><img style="height:220px;" src="${images.product}" /></div>
      <h3 class="biz-card-title">מוצר ראשון</h3><p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div>
    </article>
    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;"><img style="height:220px;" src="${images.store}" /></div>
      <h3 class="biz-card-title">מוצר שני</h3><p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪99</span></div>
    </article>
    <article class="biz-card">
      <div class="biz-image-card" style="padding:8px;margin-bottom:20px;"><img style="height:220px;" src="${images.beauty}" /></div>
      <h3 class="biz-card-title">מוצר שלישי</h3><p class="biz-card-text">תיאור קצר של המוצר.</p>
      <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪249</span></div>
    </article>
  </div>
</section>`
  );
});

/* =====================================================
   BOOKINGS — 10 מבנים
===================================================== */

const bookingsTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  return template(
    `bookings-${String(n).padStart(2, "0")}`,
    "bookings",
    `מבנה תיאום תורים ${n}`,
    "יומן, שעות פנויות, שירותים ותיאום",
    images.clinic,
    `
<section class="biz-section" data-bizuply-block="booking">
  <div class="${index % 2 === 0 ? "biz-dark-section" : "biz-strip-soft"}">
    <div class="biz-split">
      <div>
        <p class="biz-pill">מחובר ליומן</p>
        <h2 class="biz-section-title" style="text-align:right;${index % 2 === 0 ? "color:#fff;" : ""}">קובעים תור אונליין</h2>
        <p class="biz-card-text" style="font-size:18px;${index % 2 === 0 ? "color:rgba(255,255,255,.72);" : ""}">הלקוח בוחר שירות, תאריך ושעה פנויה.</p>
      </div>
      <div class="biz-booking-box">
        <div class="biz-time-grid">
          <div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div>
          <div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div>
        </div>
      </div>
    </div>
  </div>
</section>`
  );
});

/* =====================================================
   FORMS — 10 מבנים
===================================================== */

const formsTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  return template(
    `forms-${String(n).padStart(2, "0")}`,
    "forms",
    `מבנה טופס ${n}`,
    "טפסי לידים, יצירת קשר, מועדון וניוזלטר",
    images.business,
    `
<section class="biz-section" data-bizuply-block="lead-form">
  <div class="${index % 2 === 0 ? "biz-hero-card" : "biz-dark-section"}" style="max-width:${index % 2 === 0 ? "820px" : "100%"};margin:auto;">
    <p class="biz-section-kicker" style="${index % 2 !== 0 ? "color:#fff;" : ""}">השאירו פרטים</p>
    <h2 class="biz-section-title" style="${index % 2 !== 0 ? "color:#fff;" : ""}">נחזור אליכם בהקדם</h2>
    <form class="biz-form" style="max-width:760px;margin-left:auto;margin-right:auto;">
      <input class="biz-input" placeholder="שם מלא" />
      <input class="biz-input" placeholder="טלפון" />
      <input class="biz-input" placeholder="אימייל" />
      <textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea>
      <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
    </form>
  </div>
</section>`
  );
});

/* =====================================================
   CLUB — 10 מבנים
===================================================== */

const clubTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  return template(
    `club-${String(n).padStart(2, "0")}`,
    "club",
    `מבנה מועדון לקוחות ${n}`,
    "קופונים, הרשמות, VIP והטבות",
    images.people,
    index % 2 === 0
      ? `
<section class="biz-section" data-bizuply-block="customer-club">
  <div style="border-radius:44px;padding:54px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 34px 110px rgba(139,92,246,.28);">
    <h2 style="margin:0;font-size:44px;font-weight:950;">הצטרפות למועדון לקוחות</h2>
    <p style="margin:16px 0 0;font-weight:750;color:rgba(255,255,255,.84);">קבלו הטבות, קופונים ועדכונים מהעסק.</p>
    <a class="biz-btn" style="margin-top:26px;background:#fff;color:#111827;">הצטרפות</a>
  </div>
</section>`
      : `
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
</section>`
  );
});

/* =====================================================
   BASIC — 10 מבנים
===================================================== */

const basicTemplates: SectionTemplate[] = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;

  const basics = [
    `
<section class="biz-section">
  <div class="biz-strip-soft">
    <h2 class="biz-section-title">סקשן חדש</h2>
    <p class="biz-section-text">התחילי לערוך כאן טקסט, צבעים, רקע, תמונה או כל אלמנט אחר.</p>
  </div>
</section>`,
    `
<section class="biz-section">
  <div class="biz-grid-3">
    <div class="biz-counter"><strong>500+</strong><span>לקוחות מרוצים</span></div>
    <div class="biz-counter"><strong>7</strong><span>שנות ניסיון</span></div>
    <div class="biz-counter"><strong>98%</strong><span>שביעות רצון</span></div>
  </div>
</section>`,
    `
<section>
  <div class="biz-marquee">
    <span>מבצע מיוחד · קביעת תור אונליין · שירות מקצועי · חוויית לקוח פרימיום · </span>
  </div>
</section>`,
  ];

  return template(
    `basic-${String(n).padStart(2, "0")}`,
    "basic",
    `מבנה בסיסי ${n}`,
    "סקשן ריק, מספרים, טקסט זז ועוד",
    images.office,
    basics[index % basics.length]
  );
});

export const sectionTemplates: SectionTemplate[] = [
  ...welcomeTemplates,
  ...aboutTemplates,
  ...servicesTemplates,
  ...galleryTemplates,
  ...testimonialsTemplates,
  ...contactTemplates,
  ...storeTemplates,
  ...bookingsTemplates,
  ...formsTemplates,
  ...clubTemplates,
  ...basicTemplates,
];