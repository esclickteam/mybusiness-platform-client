import type { PageTemplate } from "../types";
import { defaultWebsiteHtml } from "../grapes/canvasTheme";

export const pageTemplates: PageTemplate[] = [
  {
    id: "beauty-luxury-full",
    name: "Luxury Beauty Pro",
    category: "יופי וקליניקות",
    description: "תבנית יוקרתית מלאה לעסקי יופי, איפור קבוע וקליניקות",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=90",
    html: defaultWebsiteHtml,
  },

  {
    id: "beauty-soft-editorial",
    name: "Soft Editorial Beauty",
    category: "יופי וקליניקות",
    description: "תבנית נשית, עדינה, פרימיום ומכירתית",
    preview:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">B</div>
      <div>
        <p class="biz-brand-title">סטודיו יופי</p>
        <p class="biz-brand-subtitle">טיפולי יופי בהתאמה אישית</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>דף הבית</a>
      <a>אודות</a>
      <a>שירותים</a>
      <a>גלריה</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section">
    <div class="biz-bg-image" data-animate="blur-reveal" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=90');">
      <p class="biz-pill">סטודיו פרימיום</p>
      <h1 class="biz-title" style="color:#fff;max-width:880px;">יופי טבעי שמתחיל בחוויה מקצועית</h1>
      <p class="biz-subtitle" style="color:rgba(255,255,255,0.84);">
        טיפולים מתקדמים, יחס אישי ותוצאה מדויקת שמרגישה טבעית.
      </p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
      </div>
    </div>
  </section>

  <section class="biz-section biz-split">
    <div>
      <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
      <h2 class="biz-section-title" style="text-align:right;">גישה אישית, תוצאה יוקרתית</h2>
      <p class="biz-card-text" style="font-size:18px;">
        כאן אפשר לספר על העסק, הניסיון, הסגנון, רמת השירות והחוויה שהלקוחה מקבלת.
      </p>
    </div>
    <div class="biz-image-card">
      <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=90" />
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">שירותים</p>
    <h2 class="biz-section-title">השירותים הפופולריים</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">איפור קבוע</h3><p class="biz-card-text">תוצאה טבעית ומדויקת.</p><div class="biz-price-row"><span>90 דקות</span><span class="biz-price">₪850</span></div></article>
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">טיפולי פנים</h3><p class="biz-card-text">טיפול מקצועי לעור זוהר.</p><div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div></article>
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">ייעוץ אישי</h3><p class="biz-card-text">התאמה מלאה לפני טיפול.</p><div class="biz-price-row"><span>30 דקות</span><span class="biz-price">₪150</span></div></article>
    </div>
  </section>

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
</div>
`,
  },

  {
    id: "clinic-clean-pro",
    name: "Clinic Clean Pro",
    category: "קליניקות",
    description: "תבנית נקייה, רפואית ומקצועית לקליניקות",
    preview:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">C</div>
      <div>
        <p class="biz-brand-title">Clinic Pro</p>
        <p class="biz-brand-subtitle">קליניקה מקצועית</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>בית</a>
      <a>שירותים</a>
      <a>צוות</a>
      <a>תורים</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-wide biz-split">
    <div>
      <div class="biz-pill">קליניקה מקצועית</div>
      <h1 class="biz-title">טיפול אישי ברמה הגבוהה ביותר</h1>
      <p class="biz-subtitle">מערכת תורים, שירותים, טפסים ולידים — הכל מחובר לעסק.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">מידע נוסף</a>
      </div>
    </div>

    <div class="biz-image-card">
      <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">שירותי הקליניקה</p>
    <h2 class="biz-section-title">טיפולים ושירותים</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><div class="biz-card-icon">01</div><h3 class="biz-card-title">אבחון מקצועי</h3><p class="biz-card-text">פגישת אבחון והתאמה אישית.</p></article>
      <article class="biz-card"><div class="biz-card-icon">02</div><h3 class="biz-card-title">טיפול מתקדם</h3><p class="biz-card-text">תהליך מקצועי ומדויק.</p></article>
      <article class="biz-card"><div class="biz-card-icon">03</div><h3 class="biz-card-title">מעקב אישי</h3><p class="biz-card-text">ליווי והמשכיות לאחר הטיפול.</p></article>
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="booking">
    <div class="biz-dark-section">
      <div class="biz-split">
        <div>
          <p class="biz-pill">מחובר ליומן</p>
          <h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2>
          <p class="biz-card-text" style="color:rgba(255,255,255,0.7);font-size:18px;">בחירת שירות, תאריך ושעה פנויה.</p>
        </div>
        <div class="biz-booking-box">
          <div class="biz-time-grid">
            <div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div>
            <div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },

  {
    id: "store-premium-commerce",
    name: "Premium Store",
    category: "חנויות",
    description: "תבנית חנות מלאה עם מוצרים, סליקה ומועדון לקוחות",
    preview:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">S</div>
      <div>
        <p class="biz-brand-title">Boutique Store</p>
        <p class="biz-brand-subtitle">חנות פרימיום</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>בית</a>
      <a>מוצרים</a>
      <a>מבצעים</a>
      <a>מועדון</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full biz-hero">
    <div class="biz-hero-card">
      <div class="biz-pill">חנות אונליין</div>
      <h1 class="biz-title">מוצרים שנראים מעולה ונמכרים מהר</h1>
      <p class="biz-subtitle">קטלוג מוצרים, סליקה, מבצעים ומועדון לקוחות.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">לרכישה</a>
        <a class="biz-btn biz-btn-secondary">המוצרים שלנו</a>
      </div>
    </div>
    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="products">
    <p class="biz-section-kicker">מוצרים</p>
    <h2 class="biz-section-title">מוצרים נבחרים</h2>
    <div class="biz-grid-3">
      <article class="biz-card">
        <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
          <img style="height:220px;" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=90" />
        </div>
        <h3 class="biz-card-title">מוצר ראשון</h3>
        <p class="biz-card-text">תיאור קצר ומכירתי.</p>
        <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div>
      </article>

      <article class="biz-card">
        <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
          <img style="height:220px;" src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=90" />
        </div>
        <h3 class="biz-card-title">מוצר שני</h3>
        <p class="biz-card-text">תיאור קצר ומכירתי.</p>
        <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪99</span></div>
      </article>

      <article class="biz-card">
        <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
          <img style="height:220px;" src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=90" />
        </div>
        <h3 class="biz-card-title">מוצר שלישי</h3>
        <p class="biz-card-text">תיאור קצר ומכירתי.</p>
        <div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪249</span></div>
      </article>
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="customer-club">
    <div style="border-radius:44px;padding:54px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 34px 110px rgba(139,92,246,0.28);">
      <h2 style="margin:0;font-size:44px;font-weight:950;">הצטרפות למועדון לקוחות</h2>
      <p style="margin:16px 0 0;font-weight:750;color:rgba(255,255,255,0.84);">קבלו הטבות, קופונים ועדכונים לפני כולם.</p>
      <a class="biz-btn" style="margin-top:26px;background:#fff;color:#111827;">הצטרפות</a>
    </div>
  </section>
</div>
`,
  },

  {
    id: "service-pro-leads",
    name: "Service Pro",
    category: "נותני שירות",
    description: "אתר מקצועי לנותני שירות עם לידים, שירותים ותורים",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">P</div>
      <div>
        <p class="biz-brand-title">Business Pro</p>
        <p class="biz-brand-subtitle">נותן שירות מקצועי</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>בית</a>
      <a>שירותים</a>
      <a>לקוחות</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-wide">
    <div class="biz-hero-card" style="text-align:center;">
      <div class="biz-pill">עסק מקצועי</div>
      <h1 class="biz-title">אתר עסקי שמביא לקוחות</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">
        לידים, תיאום תורים, שירותים ומעקב CRM — במקום אחד.
      </p>
      <div class="biz-actions" style="justify-content:center;">
        <a class="biz-btn biz-btn-primary">קבלת הצעת מחיר</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">השירותים שלנו</p>
    <h2 class="biz-section-title">פתרונות לעסק שלך</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות ראשון</h3><p class="biz-card-text">תיאור קצר של השירות.</p></article>
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שני</h3><p class="biz-card-text">תיאור קצר של השירות.</p></article>
      <article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שלישי</h3><p class="biz-card-text">תיאור קצר של השירות.</p></article>
    </div>
  </section>

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
</div>
`,
  },

  {
    id: "restaurant-modern",
    name: "Restaurant Modern",
    category: "מסעדות ואוכל",
    description: "תבנית מודרנית למסעדות, בתי קפה וקייטרינג",
    preview:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">R</div>
      <div>
        <p class="biz-brand-title">Restaurant</p>
        <p class="biz-brand-subtitle">חוויה קולינרית</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>בית</a>
      <a>תפריט</a>
      <a>אירועים</a>
      <a>הזמנות</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section">
    <div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90');">
      <p class="biz-pill">מסעדה · אירועים · משלוחים</p>
      <h1 class="biz-title" style="color:#fff;max-width:850px;">חוויה קולינרית שנראית מעולה כבר באתר</h1>
      <p class="biz-subtitle" style="color:rgba(255,255,255,0.84);">הציגו תפריט, מנות, הזמנות, אירועים ויצירת קשר.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">הזמנת שולחן</a>
        <a class="biz-btn biz-btn-secondary">צפייה בתפריט</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">מנות נבחרות</p>
    <h2 class="biz-section-title">התפריט שלנו</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><h3 class="biz-card-title">מנה ראשונה</h3><p class="biz-card-text">תיאור קצר ומגרה.</p><span class="biz-price">₪68</span></article>
      <article class="biz-card"><h3 class="biz-card-title">מנה עיקרית</h3><p class="biz-card-text">תיאור קצר ומגרה.</p><span class="biz-price">₪118</span></article>
      <article class="biz-card"><h3 class="biz-card-title">קינוח</h3><p class="biz-card-text">תיאור קצר ומגרה.</p><span class="biz-price">₪48</span></article>
    </div>
  </section>
</div>
`,
  },

  {
    id: "coach-modern",
    name: "Coach Modern",
    category: "מאמנים ויועצים",
    description: "תבנית אישית למאמנים, יועצים ומנטורים",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">M</div>
      <div>
        <p class="biz-brand-title">Mentor Pro</p>
        <p class="biz-brand-subtitle">ליווי אישי ועסקי</p>
      </div>
    </div>
    <nav class="biz-nav-links">
      <a>בית</a>
      <a>תהליך</a>
      <a>המלצות</a>
      <a>תיאום שיחה</a>
    </nav>
  </header>

  <section class="biz-section-wide biz-split">
    <div>
      <p class="biz-section-kicker" style="margin-right:0;">ליווי מקצועי</p>
      <h1 class="biz-title">להתקדם עם תהליך ברור ומדויק</h1>
      <p class="biz-subtitle">אתר שמציג מומחיות, תהליך, המלצות וטופס לידים.</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">תיאום שיחת ייעוץ</a>
        <a class="biz-btn biz-btn-secondary">איך זה עובד?</a>
      </div>
    </div>
    <div class="biz-image-card">
      <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">התהליך</p>
    <h2 class="biz-section-title">איך מתחילים?</h2>
    <div class="biz-grid-3">
      <article class="biz-card"><div class="biz-card-icon">1</div><h3 class="biz-card-title">שיחת היכרות</h3><p class="biz-card-text">מגדירים מטרות וצורך.</p></article>
      <article class="biz-card"><div class="biz-card-icon">2</div><h3 class="biz-card-title">תוכנית פעולה</h3><p class="biz-card-text">בונים תהליך מותאם.</p></article>
      <article class="biz-card"><div class="biz-card-icon">3</div><h3 class="biz-card-title">ליווי ומעקב</h3><p class="biz-card-text">מתקדמים צעד אחרי צעד.</p></article>
    </div>
  </section>
</div>
`,
  },

  {
    id: "landing-page-sale",
    name: "Landing Page Sale",
    category: "דפי נחיתה",
    description: "דף נחיתה ממיר למבצע, שירות או השקה",
    preview:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=90",
    html: `
<div class="biz-page">
  <section class="biz-section-wide">
    <div class="biz-hero-card" style="text-align:center;">
      <div class="biz-pill">מבצע מיוחד</div>
      <h1 class="biz-title">כותרת מכירתית חזקה שמובילה לפעולה</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">
        משפט קצר שמסביר את ההצעה, למי היא מתאימה ולמה כדאי לפעול עכשיו.
      </p>
      <div class="biz-actions" style="justify-content:center;">
        <a class="biz-btn biz-btn-primary">אני רוצה להצטרף</a>
        <a class="biz-btn biz-btn-secondary">מידע נוסף</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <div class="biz-grid-3">
      <article class="biz-card"><div class="biz-card-icon">✓</div><h3 class="biz-card-title">יתרון ראשון</h3><p class="biz-card-text">למה זה טוב ללקוח.</p></article>
      <article class="biz-card"><div class="biz-card-icon">✓</div><h3 class="biz-card-title">יתרון שני</h3><p class="biz-card-text">מה הערך המרכזי.</p></article>
      <article class="biz-card"><div class="biz-card-icon">✓</div><h3 class="biz-card-title">יתרון שלישי</h3><p class="biz-card-text">למה לבחור עכשיו.</p></article>
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="lead-form">
    <div class="biz-dark-section">
      <h2 class="biz-section-title" style="color:#fff;">השאירו פרטים</h2>
      <form class="biz-form" style="max-width:760px;margin-left:auto;margin-right:auto;">
        <input class="biz-input" placeholder="שם מלא" />
        <input class="biz-input" placeholder="טלפון" />
        <input class="biz-input" placeholder="אימייל" />
        <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
      </form>
    </div>
  </section>
</div>
`,
  },

  {
    id: "minimal-onepage",
    name: "Minimal One Page",
    category: "כללי",
    description: "תבנית מינימליסטית, נקייה ומהירה לעריכה",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
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
      <a>בית</a>
      <a>אודות</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section" style="min-height:720px;display:flex;align-items:center;justify-content:center;text-align:center;">
    <div>
      <div class="biz-pill">עסק מקצועי · אתר חכם</div>
      <h1 class="biz-title">שם העסק שלך</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">
        תיאור קצר ומדויק של העסק, השירותים והערך שהלקוחות מקבלים.
      </p>
      <div class="biz-actions" style="justify-content:center;">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <div class="biz-strip-soft">
      <h2 class="biz-section-title">קצת עלינו</h2>
      <p class="biz-section-text">כאן אפשר לערוך טקסט, צבעים, רקע, תמונות, כפתורים וסקשנים.</p>
    </div>
  </section>
</div>
`,
  },
];