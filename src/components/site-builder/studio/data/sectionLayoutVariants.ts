export type SectionKind =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "store"
  | "booking"
  | "reviews"
  | "contact"
  | "club"
  | "basic";

export type SectionLayoutVariant = {
  id: string;
  kind: SectionKind;
  title: string;
  description: string;
  previewLabel: string;
  html: string;
};

const img = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  hair:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
};

function variant(
  id: string,
  kind: SectionKind,
  title: string,
  description: string,
  previewLabel: string,
  html: string
): SectionLayoutVariant {
  return { id, kind, title, description, previewLabel, html };
}

export const sectionLayoutVariants: SectionLayoutVariant[] = [
  /* =========================
     HERO
  ========================= */

  variant(
    "hero-split-image-right",
    "hero",
    "טקסט + תמונה",
    "טקסט בצד אחד ותמונה בצד שני",
    "Split",
    `
<section class="biz-section-full biz-hero" data-section-kind="hero">
  <div class="biz-hero-card">
    <div class="biz-pill">סטודיו פרימיום</div>
    <h1 class="biz-title">יופי טבעי שמתחיל בחוויה מקצועית</h1>
    <p class="biz-subtitle">טיפולים מתקדמים, יחס אישי ותוצאה מדויקת שמרגישה טבעית.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">צור קשר</a>
    </div>
  </div>

  <div class="biz-hero-image-wrap">
    <img class="biz-hero-image" src="${img.beauty}" />
  </div>
</section>
`
  ),

  variant(
    "hero-image-left",
    "hero",
    "תמונה שמאל וטקסט ימין",
    "אותו הירו אבל הפוך",
    "Reverse",
    `
<section class="biz-section-full biz-hero" data-section-kind="hero">
  <div class="biz-hero-image-wrap">
    <img class="biz-hero-image" src="${img.hair}" />
  </div>

  <div class="biz-hero-card">
    <div class="biz-pill">טיפול אישי ומדויק</div>
    <h1 class="biz-title">מראה טבעי שמרגיש יוקרתי</h1>
    <p class="biz-subtitle">אתר פרימיום שמציג את העסק בצורה מקצועית ומובילה לפניות.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
    </div>
  </div>
</section>
`
  ),

  variant(
    "hero-background-image",
    "hero",
    "תמונת רקע מלאה",
    "הירו עם תמונת רקע וטקסט מעל",
    "Background",
    `
<section class="biz-section" data-section-kind="hero">
  <div class="biz-bg-image" style="background-image:url('${img.salon}');">
    <div class="biz-pill">ברוכים הבאים</div>
    <h1 class="biz-title" style="color:#fff;max-width:850px;">אתר עסקי שנראה כמו מותג פרימיום</h1>
    <p class="biz-subtitle" style="color:rgba(255,255,255,.84);">אפשר להחליף תמונה, לשנות צבע, לשנות טקסט ולהוסיף כפתורים.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">קביעת תור</a>
      <a class="biz-btn biz-btn-secondary">מידע נוסף</a>
    </div>
  </div>
</section>
`
  ),

  variant(
    "hero-video-style",
    "hero",
    "וידאו / רקע מדיה",
    "מבנה שמתאים לוידאו או תמונת רקע",
    "Video",
    `
<section class="biz-section" data-section-kind="hero">
  <div class="biz-bg-image" style="background-image:url('${img.beauty}');min-height:620px;display:flex;align-items:center;">
    <div style="max-width:760px;">
      <div class="biz-pill">וידאו רקע</div>
      <h1 class="biz-title" style="color:#fff;">חוויה ויזואלית חזקה כבר בכניסה</h1>
      <p class="biz-subtitle" style="color:rgba(255,255,255,.84);">אפשר להחליף לוידאו בהמשך או להשאיר תמונת רקע.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">התחלה</a>
        <a class="biz-btn biz-btn-secondary">צפייה בגלריה</a>
      </div>
    </div>
  </div>
</section>
`
  ),

  /* =========================
     ABOUT
  ========================= */

  variant(
    "about-centered",
    "about",
    "אודות ממורכז",
    "כותרת וטקסט במרכז",
    "Centered",
    `
<section class="biz-section" data-section-kind="about">
  <p class="biz-section-kicker">אודות</p>
  <h2 class="biz-section-title">קצת על העסק</h2>
  <p class="biz-section-text">
    כאן אפשר לספר על העסק, הניסיון, הסגנון, השירות ומה מיוחד בחוויה שהלקוח מקבל.
  </p>
</section>
`
  ),

  variant(
    "about-split-image",
    "about",
    "אודות עם תמונה",
    "טקסט בצד ותמונה בצד",
    "Split",
    `
<section class="biz-section biz-split" data-section-kind="about">
  <div>
    <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
    <h2 class="biz-section-title" style="text-align:right;">החוויה שהלקוחות מקבלים</h2>
    <p class="biz-card-text" style="font-size:18px;">
      כאן אפשר לכתוב על העסק, המקצועיות, השירות, הניסיון והייחודיות.
    </p>
  </div>

  <div class="biz-image-card">
    <img src="${img.salon}" />
  </div>
</section>
`
  ),

  variant(
    "about-two-images",
    "about",
    "אודות עם 2 תמונות",
    "טקסט + שתי תמונות",
    "2 Images",
    `
<section class="biz-section" data-section-kind="about">
  <div class="biz-split">
    <div>
      <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
      <h2 class="biz-section-title" style="text-align:right;">מקצועיות, יחס אישי ותוצאה מדויקת</h2>
      <p class="biz-card-text" style="font-size:18px;">מבנה שמתאים לעסק שרוצה להציג אווירה, תהליך ותוצאה.</p>
    </div>

    <div class="biz-grid-2" style="margin-top:0;">
      <div class="biz-image-card"><img src="${img.beauty}" /></div>
      <div class="biz-image-card"><img src="${img.hair}" /></div>
    </div>
  </div>
</section>
`
  ),

  variant(
    "about-wide-image",
    "about",
    "תמונה רחבה",
    "טקסט מעל תמונה רחבה",
    "Wide",
    `
<section class="biz-section" data-section-kind="about">
  <p class="biz-section-kicker">אודות</p>
  <h2 class="biz-section-title">הסיפור של העסק</h2>
  <p class="biz-section-text">מבנה עם תמונה רחבה מתחת לטקסט.</p>

  <div class="biz-image-card" style="margin-top:44px;">
    <img style="height:520px;" src="${img.salon}" />
  </div>
</section>
`
  ),

  /* =========================
     SERVICES
  ========================= */

  variant(
    "services-cards-3",
    "services",
    "3 כרטיסים",
    "שירותים בכרטיסים",
    "Cards",
    `
<section class="biz-section" data-section-kind="services" data-bizuply-block="services">
  <p class="biz-section-kicker">שירותים</p>
  <h2 class="biz-section-title">השירותים שלנו</h2>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות ראשון</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות שני</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row"><span>90 דקות</span><span class="biz-price">₪850</span></div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">✦</div>
      <h3 class="biz-card-title">שירות שלישי</h3>
      <p class="biz-card-text">תיאור קצר של השירות.</p>
      <div class="biz-price-row"><span>45 דקות</span><span class="biz-price">₪250</span></div>
    </article>
  </div>
</section>
`
  ),

  variant(
    "services-list-wide",
    "services",
    "רשימת שירותים רחבה",
    "שירותים בשורות רחבות",
    "List",
    `
<section class="biz-section" data-section-kind="services" data-bizuply-block="services">
  <p class="biz-section-kicker">שירותים</p>
  <h2 class="biz-section-title">בחרו שירות</h2>

  <div style="display:grid;gap:18px;margin-top:46px;">
    <article class="biz-card">
      <div class="biz-price-row">
        <div>
          <h3 class="biz-card-title">איפור קבוע</h3>
          <p class="biz-card-text">תיאור קצר של השירות.</p>
        </div>
        <span class="biz-price">₪850</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-price-row">
        <div>
          <h3 class="biz-card-title">טיפול פנים</h3>
          <p class="biz-card-text">תיאור קצר של השירות.</p>
        </div>
        <span class="biz-price">₪350</span>
      </div>
    </article>
  </div>
</section>
`
  ),

  variant(
    "services-carousel",
    "services",
    "קרוסלת שירותים",
    "שירותים נגללים לרוחב",
    "Carousel",
    `
<section class="biz-section" data-section-kind="services" data-bizuply-block="services">
  <p class="biz-section-kicker">שירותים</p>
  <h2 class="biz-section-title">השירותים שלנו</h2>

  <div class="biz-carousel" style="margin-top:44px;">
    <article class="biz-card"><div class="biz-card-icon">1</div><h3 class="biz-card-title">שירות ראשון</h3><p class="biz-card-text">תיאור קצר.</p></article>
    <article class="biz-card"><div class="biz-card-icon">2</div><h3 class="biz-card-title">שירות שני</h3><p class="biz-card-text">תיאור קצר.</p></article>
    <article class="biz-card"><div class="biz-card-icon">3</div><h3 class="biz-card-title">שירות שלישי</h3><p class="biz-card-text">תיאור קצר.</p></article>
  </div>
</section>
`
  ),

  /* =========================
     GALLERY
  ========================= */

  variant(
    "gallery-grid-4",
    "gallery",
    "גריד 4 תמונות",
    "גלריה רגילה",
    "Grid",
    `
<section class="biz-section" data-section-kind="gallery">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">עבודות אחרונות</h2>

  <div class="biz-grid-4">
    <img class="biz-gallery-img" src="${img.beauty}" />
    <img class="biz-gallery-img" src="${img.hair}" />
    <img class="biz-gallery-img" src="${img.salon}" />
    <img class="biz-gallery-img" src="${img.product}" />
  </div>
</section>
`
  ),

  variant(
    "gallery-featured",
    "gallery",
    "תמונה גדולה + קטנות",
    "תמונה מרכזית לצד תמונות קטנות",
    "Featured",
    `
<section class="biz-section" data-section-kind="gallery">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">עבודות נבחרות</h2>

  <div class="biz-split" style="margin-top:44px;">
    <div class="biz-image-card"><img src="${img.beauty}" /></div>
    <div class="biz-grid-2" style="margin-top:0;">
      <img class="biz-gallery-img" src="${img.hair}" />
      <img class="biz-gallery-img" src="${img.salon}" />
      <img class="biz-gallery-img" src="${img.product}" />
      <img class="biz-gallery-img" src="${img.beauty}" />
    </div>
  </div>
</section>
`
  ),

  variant(
    "gallery-carousel",
    "gallery",
    "קרוסלה",
    "גלריה נגללת",
    "Carousel",
    `
<section class="biz-section" data-section-kind="gallery">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">גלריה נגללת</h2>

  <div class="biz-carousel" style="margin-top:44px;">
    <img class="biz-gallery-img" src="${img.beauty}" />
    <img class="biz-gallery-img" src="${img.hair}" />
    <img class="biz-gallery-img" src="${img.salon}" />
    <img class="biz-gallery-img" src="${img.product}" />
  </div>
</section>
`
  ),

  /* =========================
     STORE
  ========================= */

  variant(
    "store-grid",
    "store",
    "גריד מוצרים",
    "3 מוצרים בכרטיסים",
    "Grid",
    `
<section class="biz-section" data-section-kind="store" data-bizuply-block="products">
  <p class="biz-section-kicker">חנות</p>
  <h2 class="biz-section-title">מוצרים לרכישה</h2>

  <div class="biz-grid-3">
    <article class="biz-card"><div class="biz-image-card"><img src="${img.product}" /></div><h3 class="biz-card-title">מוצר ראשון</h3><p class="biz-card-text">תיאור מוצר.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div></article>
    <article class="biz-card"><div class="biz-image-card"><img src="${img.store}" /></div><h3 class="biz-card-title">מוצר שני</h3><p class="biz-card-text">תיאור מוצר.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪99</span></div></article>
    <article class="biz-card"><div class="biz-image-card"><img src="${img.hair}" /></div><h3 class="biz-card-title">מוצר שלישי</h3><p class="biz-card-text">תיאור מוצר.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪249</span></div></article>
  </div>
</section>
`
  ),

  variant(
    "store-featured-product",
    "store",
    "מוצר מרכזי",
    "מוצר אחד גדול עם פרטים",
    "Featured",
    `
<section class="biz-section biz-split" data-section-kind="store" data-bizuply-block="products">
  <div class="biz-image-card">
    <img src="${img.product}" />
  </div>

  <div>
    <p class="biz-section-kicker" style="margin-right:0;">מוצר מוביל</p>
    <h2 class="biz-section-title" style="text-align:right;">מוצר פרימיום לעסק</h2>
    <p class="biz-card-text" style="font-size:18px;">תיאור מוצר, יתרונות, מחיר וכפתור רכישה.</p>
    <div class="biz-actions">
      <a class="biz-btn biz-btn-primary">הוספה לסל</a>
      <span class="biz-price">₪249</span>
    </div>
  </div>
</section>
`
  ),

  /* =========================
     BOOKING
  ========================= */

  variant(
    "booking-times",
    "booking",
    "שעות פנויות",
    "בחירת שעות בכרטיס",
    "Times",
    `
<section class="biz-section" data-section-kind="booking" data-bizuply-block="booking">
  <p class="biz-section-kicker">תיאום תורים</p>
  <h2 class="biz-section-title">בחרו שעה פנויה</h2>

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
`
  ),

  variant(
    "booking-dark-split",
    "booking",
    "יומן כהה",
    "טקסט + שעות על רקע כהה",
    "Dark",
    `
<section class="biz-section" data-section-kind="booking" data-bizuply-block="booking">
  <div class="biz-dark-section">
    <div class="biz-split">
      <div>
        <p class="biz-pill">מחובר ליומן</p>
        <h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2>
        <p class="biz-card-text" style="color:rgba(255,255,255,.72);font-size:18px;">הלקוח בוחר שירות, תאריך ושעה פנויה.</p>
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
`
  ),
];

export function getSectionLayoutVariants(kind: SectionKind) {
  return sectionLayoutVariants.filter((variant) => variant.kind === kind);
}