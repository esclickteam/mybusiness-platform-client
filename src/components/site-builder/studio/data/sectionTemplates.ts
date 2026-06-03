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
  {
    id: "welcome-split",
    category: "welcome",
    title: "הירו תמונה וטקסט",
    description: "פתיחה יוקרתית עם תמונה וכפתורים",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section-full biz-hero"><div class="biz-hero-image-wrap"><img class="biz-hero-image" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90"/></div><div class="biz-hero-card"><div class="biz-pill">עסק מקצועי · אתר חכם</div><h1 class="biz-title">כותרת ראשית מרשימה</h1><p class="biz-subtitle">תיאור קצר ומכירתי שמסביר את הערך של העסק.</p><div class="biz-actions"><a class="biz-btn biz-btn-primary">קביעת תור</a><a class="biz-btn biz-btn-secondary">צור קשר</a></div></div></section>`,
  },
  {
    id: "welcome-bg",
    category: "welcome",
    title: "הירו תמונת רקע",
    description: "סקשן פתיחה עם תמונת רקע ו־overlay",
    preview:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section"><div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');"><div class="biz-pill">ברוכים הבאים</div><h1 class="biz-title" style="color:#fff;">כותרת על תמונת רקע</h1><p class="biz-subtitle" style="color:rgba(255,255,255,0.84);">אפשר לשנות תמונה, צבע, overlay ואנימציה.</p><div class="biz-actions"><a class="biz-btn biz-btn-primary">התחלה</a></div></div></section>`,
  },
  {
    id: "about-split",
    category: "about",
    title: "אודות עם תמונה",
    description: "טקסט אודות לצד תמונה",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section biz-split"><div><p class="biz-section-kicker">אודות</p><h2 class="biz-section-title" style="text-align:right;">קצת על העסק</h2><p class="biz-card-text" style="font-size:18px;">ספרו כאן על העסק, הניסיון, השירותים והייחודיות שלכם.</p></div><div class="biz-image-card"><img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=90"/></div></section>`,
  },
  {
    id: "services-cards",
    category: "services",
    title: "שירותים בכרטיסים",
    description: "גריד שירותים עם מחיר וזמן",
    preview:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section"><p class="biz-section-kicker">שירותים</p><h2 class="biz-section-title">השירותים שלי</h2><div class="biz-grid-3"><article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות ראשון</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div></article><article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שני</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>90 דקות</span><span class="biz-price">₪850</span></div></article><article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות שלישי</h3><p class="biz-card-text">תיאור קצר של השירות.</p><div class="biz-price-row"><span>45 דקות</span><span class="biz-price">₪250</span></div></article></div></section>`,
  },
  {
    id: "gallery-masonry",
    category: "gallery",
    title: "גלריה יוקרתית",
    description: "תמונות עבודות בגריד",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section"><p class="biz-section-kicker">גלריה</p><h2 class="biz-section-title">עבודות אחרונות</h2><div class="biz-grid-4"><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90"/></div></section>`,
  },
  {
    id: "reviews-carousel",
    category: "testimonials",
    title: "ביקורות קרוסלה",
    description: "ביקורות לקוחות בסליידר",
    preview:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section"><p class="biz-section-kicker">ביקורות</p><h2 class="biz-section-title">לקוחות מספרים</h2><div class="biz-carousel"><article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">שירות מושלם ותוצאה מדהימה!</p><h3 class="biz-card-title">מיכל</h3></article><article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">מקצועית, מדויקת וסבלנית.</p><h3 class="biz-card-title">נועה</h3></article><article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">חוויה מעולה מההתחלה ועד הסוף.</p><h3 class="biz-card-title">דנה</h3></article></div></section>`,
  },
  {
    id: "contact-form",
    category: "contact",
    title: "צור קשר",
    description: "טופס יצירת קשר מלא",
    preview:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section biz-split"><div><p class="biz-section-kicker">צור קשר</p><h2 class="biz-section-title" style="text-align:right;">נשמח לשמוע ממך</h2><p class="biz-card-text">השאירו פרטים ונחזור אליכם בהקדם.</p></div><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="אימייל"/><textarea class="biz-textarea" placeholder="הודעה"></textarea><button class="biz-btn biz-btn-primary" type="button">שליחה</button></form></section>`,
  },
  {
    id: "booking-smart",
    category: "bookings",
    title: "תיאום תורים",
    description: "בלוק תורים חכם",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section" data-bizuply-block="booking"><div class="biz-dark-section"><div class="biz-split"><div><p class="biz-pill">מחובר ליומן</p><h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2><p class="biz-card-text" style="color:rgba(255,255,255,0.7);">הלקוח בוחר שירות, תאריך ושעה פנויה.</p></div><div class="biz-booking-box"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></div></div></section>`,
  },
  {
    id: "club-gradient",
    category: "club",
    title: "מועדון לקוחות",
    description: "הרשמה להטבות וקופונים",
    preview:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=90",
    html: `<section class="biz-section"><div style="border-radius:44px;padding:54px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 34px 110px rgba(139,92,246,0.28);"><h2 style="margin:0;font-size:44px;font-weight:950;">הצטרפות למועדון לקוחות</h2><p style="margin:16px 0 0;font-weight:750;color:rgba(255,255,255,0.84);">קבלו הטבות, קופונים ועדכונים מהעסק.</p><a class="biz-btn" style="margin-top:26px;background:#fff;color:#111827;">הצטרפות</a></div></section>`,
  },
];