import type { Editor } from "grapesjs";

export function registerBizuplyBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  bm.add("biz-hero-luxury", {
    label: "Hero יוקרתי",
    category: "Bizuply",
    media: "✨",
    content: `
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
`,
  });

  bm.add("biz-about", {
    label: "אודות",
    category: "Bizuply",
    media: "📝",
    content: `
<section class="biz-section">
  <h2 class="biz-section-title">קצת על העסק</h2>
  <p class="biz-section-text">
    סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים.
    כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.
  </p>
</section>
`,
  });

  bm.add("biz-services", {
    label: "שירותים מהעסק",
    category: "Bizuply Smart",
    media: "💎",
    content: `
<section class="biz-section" data-bizuply-block="services">
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
`,
  });

  bm.add("biz-products", {
    label: "מוצרים וסליקה",
    category: "Bizuply Smart",
    media: "🛒",
    content: `
<section class="biz-section" data-bizuply-block="products">
  <h2 class="biz-section-title">מוצרים לרכישה</h2>
  <div class="biz-grid-3">
    <article class="biz-card">
      <div class="biz-card-icon">🛍</div>
      <h3 class="biz-card-title">סרום טיפוח</h3>
      <p class="biz-card-text">סרום עדין לשגרת טיפוח יומית.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary" href="#">הוספה לסל</a>
        <span class="biz-price">₪129</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">🛍</div>
      <h3 class="biz-card-title">קרם לחות</h3>
      <p class="biz-card-text">קרם לחות מקצועי לעור רך וזוהר.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary" href="#">הוספה לסל</a>
        <span class="biz-price">₪99</span>
      </div>
    </article>

    <article class="biz-card">
      <div class="biz-card-icon">🛍</div>
      <h3 class="biz-card-title">ערכת טיפוח</h3>
      <p class="biz-card-text">ערכת מוצרים מלאה לשגרת טיפוח.</p>
      <div class="biz-price-row">
        <a class="biz-btn biz-btn-primary" href="#">הוספה לסל</a>
        <span class="biz-price">₪249</span>
      </div>
    </article>
  </div>
</section>
`,
  });

  bm.add("biz-gallery", {
    label: "גלריה",
    category: "Bizuply",
    media: "🖼",
    content: `
<section class="biz-section">
  <h2 class="biz-section-title">גלריה</h2>
  <div class="biz-grid-4">
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90" />
    <img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90" />
  </div>
</section>
`,
  });

  bm.add("biz-reviews", {
    label: "ביקורות",
    category: "Bizuply Smart",
    media: "⭐",
    content: `
<section class="biz-section" data-bizuply-block="reviews">
  <h2 class="biz-section-title">ביקורות לקוחות</h2>
  <div class="biz-grid-3">
    <article class="biz-card">
      <div style="color:#f59e0b;font-size:20px;">★★★★★</div>
      <p class="biz-card-text">שירות מקצועי, יחס אישי ותוצאה מושלמת. ממליצה בחום!</p>
      <h3 class="biz-card-title">מיכל לוי</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:20px;">★★★★★</div>
      <p class="biz-card-text">חוויה מהממת, המקום נקי, נעים והתוצאה בדיוק כמו שרציתי.</p>
      <h3 class="biz-card-title">נועה כהן</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:20px;">★★★★★</div>
      <p class="biz-card-text">מקצועית, סבלנית ומדויקת. יצא טבעי ויפה.</p>
      <h3 class="biz-card-title">דנה ישראלי</h3>
    </article>
  </div>
</section>
`,
  });

  bm.add("biz-booking", {
    label: "תיאום תורים",
    category: "Bizuply Smart",
    media: "📅",
    content: `
<section class="biz-section">
  <div class="biz-dark-section" data-bizuply-block="booking">
    <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:42px;align-items:center;">
      <div>
        <p class="biz-pill">מחובר ליומן של Bizuply</p>
        <h2 class="biz-section-title" style="text-align:right;color:#fff;margin-top:22px;">קובעים תור ישירות מהאתר</h2>
        <p class="biz-card-text" style="color:rgba(255,255,255,0.7);font-size:17px;">
          הלקוח בוחר שירות, תאריך ושעה. הפגישה נכנסת אוטומטית ליומן ול־CRM.
        </p>
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
  });

  bm.add("biz-lead-form", {
    label: "טופס ליד",
    category: "Bizuply Smart",
    media: "📩",
    content: `
<section class="biz-section" data-bizuply-block="lead-form">
  <h2 class="biz-section-title">השאירו פרטים</h2>
  <p class="biz-section-text">נחזור אליכם עם פרטים נוספים ותיאום המשך.</p>

  <form class="biz-form">
    <input class="biz-input" placeholder="שם מלא" />
    <input class="biz-input" placeholder="טלפון" />
    <input class="biz-input" placeholder="אימייל" />
    <textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea>
    <button class="biz-btn biz-btn-primary" type="button">שליחת ליד</button>
  </form>
</section>
`,
  });

  bm.add("biz-club", {
    label: "מועדון לקוחות",
    category: "Bizuply Smart",
    media: "👑",
    content: `
<section class="biz-section" data-bizuply-block="customer-club">
  <div style="border-radius:42px;padding:46px;background:linear-gradient(135deg,#7c3aed,#d946ef);color:#fff;box-shadow:0 30px 110px rgba(124,58,237,0.24);">
    <h2 style="margin:0;font-size:38px;line-height:1.1;font-weight:950;">הצטרפות למועדון לקוחות</h2>
    <p style="margin:14px 0 0;color:rgba(255,255,255,0.82);font-weight:700;">קבלו עדכונים, הטבות וקופונים מהעסק.</p>
    <a class="biz-btn" style="margin-top:24px;background:#fff;color:#0f172a;" href="#">הצטרפות</a>
  </div>
</section>
`,
  });

  bm.add("biz-contact", {
    label: "יצירת קשר",
    category: "Bizuply",
    media: "☎️",
    content: `
<footer class="biz-footer">
  <div class="biz-footer-grid">
    <div class="biz-footer-card">
      <p>טלפון</p>
      <strong>050-0000000</strong>
    </div>
    <div class="biz-footer-card">
      <p>וואטסאפ</p>
      <strong>050-0000000</strong>
    </div>
    <div class="biz-footer-card">
      <p>אימייל</p>
      <strong>hello@business.com</strong>
    </div>
    <div class="biz-footer-card">
      <p>כתובת</p>
      <strong>קריית אתא</strong>
    </div>
  </div>
</footer>
`,
  });
}