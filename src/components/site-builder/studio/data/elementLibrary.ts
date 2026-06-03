import type { ElementCategory, StudioElement } from "../types";

export const elementCategories: {
  key: ElementCategory;
  label: string;
  icon: string;
}[] = [
  { key: "text", label: "טקסט", icon: "T" },
  { key: "image", label: "תמונה", icon: "▧" },
  { key: "button", label: "כפתור", icon: "◉" },
  { key: "strip", label: "סקציה", icon: "▭" },
  { key: "decorative", label: "עיצוב", icon: "✦" },
  { key: "box", label: "קופסה", icon: "□" },
  { key: "gallery", label: "גלריה", icon: "▦" },
  { key: "menu", label: "תפריט", icon: "☰" },
  { key: "forms", label: "טפסים", icon: "▤" },
  { key: "video", label: "וידאו", icon: "▶" },
  { key: "interactive", label: "אינטראקטיבי", icon: "✺" },
  { key: "list", label: "רשימות", icon: "≡" },
  { key: "embed", label: "Embed", icon: "</>" },
  { key: "social", label: "סושיאל", icon: "↗" },
  { key: "payments", label: "תשלומים", icon: "₪" },
  { key: "store", label: "חנות", icon: "◈" },
  { key: "bookings", label: "תורים", icon: "◷" },
  { key: "bizuply", label: "Bizuply", icon: "B" },
];

export const studioElements: StudioElement[] = [
  /* =====================================================
     TEXT
  ===================================================== */
  {
    id: "text-h1",
    label: "כותרת ענקית",
    icon: "H1",
    category: "text",
    html: `<h1 class="biz-title">כותרת ראשית מרשימה</h1>`,
  },
  {
    id: "text-h2",
    label: "כותרת סקשן",
    icon: "H2",
    category: "text",
    html: `<h2 class="biz-section-title">כותרת סקשן</h2>`,
  },
  {
    id: "text-h3",
    label: "כותרת קטנה",
    icon: "H3",
    category: "text",
    html: `<h3 class="biz-card-title">כותרת קטנה</h3>`,
  },
  {
    id: "text-paragraph",
    label: "פסקה",
    icon: "¶",
    category: "text",
    html: `<p class="biz-section-text">הקלידי כאן טקסט מקצועי שמתאר את העסק, השירות או ההצעה שלך.</p>`,
  },
  {
    id: "text-kicker",
    label: "תגית קטנה",
    icon: "•",
    category: "text",
    html: `<p class="biz-section-kicker">כותרת קטנה</p>`,
  },
  {
    id: "text-pill",
    label: "תגית Pill",
    icon: "P",
    category: "text",
    html: `<div class="biz-pill">עסק מקצועי · אתר חכם</div>`,
  },
  {
    id: "text-highlight",
    label: "טקסט מודגש",
    icon: "!",
    category: "text",
    html: `<p style="font-size:28px;line-height:1.35;font-weight:950;color:var(--biz-text);">משפט מודגש שמושך תשומת לב ומעביר מסר חזק.</p>`,
  },
  {
    id: "text-quote",
    label: "ציטוט",
    icon: "”",
    category: "text",
    html: `<blockquote class="biz-card" style="font-size:24px;line-height:1.65;font-weight:850;">“חוויה מקצועית, מדויקת ויוקרתית מהרגע הראשון.”</blockquote>`,
  },
  {
    id: "text-marquee",
    label: "טקסט זז",
    icon: "↔",
    category: "text",
    html: `<div class="biz-marquee"><span>מבצע מיוחד · קביעת תור אונליין · שירות מקצועי · חוויית לקוח פרימיום · </span></div>`,
  },

  /* =====================================================
     IMAGE
  ===================================================== */
  {
    id: "image-basic",
    label: "תמונה",
    icon: "▧",
    category: "image",
    html: `<div class="biz-image-card"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90" /></div>`,
  },
  {
    id: "image-rounded",
    label: "תמונה עגולה",
    icon: "◯",
    category: "image",
    html: `<img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" style="width:260px;height:260px;object-fit:cover;border-radius:999px;box-shadow:0 28px 90px rgba(15,23,42,0.15);" />`,
  },
  {
    id: "image-wide",
    label: "תמונה רחבה",
    icon: "▭",
    category: "image",
    html: `<div class="biz-image-card"><img style="height:360px;" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90" /></div>`,
  },
  {
    id: "image-background-card",
    label: "כרטיס תמונת רקע",
    icon: "▧",
    category: "image",
    html: `<div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');"><h2 class="biz-section-title" style="color:#fff;">תמונה כרקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.84);">אפשר לשנות תמונה, צבע, overlay ופינות.</p></div>`,
  },
  {
    id: "image-before-after",
    label: "לפני / אחרי",
    icon: "⇄",
    category: "image",
    html: `<section class="biz-section"><h2 class="biz-section-title">לפני ואחרי</h2><div class="biz-grid-2"><div class="biz-image-card"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90" /><p class="biz-card-text">לפני</p></div><div class="biz-image-card"><img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90" /><p class="biz-card-text">אחרי</p></div></div></section>`,
  },

  /* =====================================================
     BUTTONS
  ===================================================== */
  {
    id: "button-primary",
    label: "כפתור ראשי",
    icon: "●",
    category: "button",
    html: `<a class="biz-btn biz-btn-primary">כפתור פעולה</a>`,
  },
  {
    id: "button-secondary",
    label: "כפתור משני",
    icon: "○",
    category: "button",
    html: `<a class="biz-btn biz-btn-secondary">כפתור משני</a>`,
  },
  {
    id: "button-double",
    label: "שני כפתורים",
    icon: "◉",
    category: "button",
    html: `<div class="biz-actions"><a class="biz-btn biz-btn-primary">קביעת תור</a><a class="biz-btn biz-btn-secondary">שליחת הודעה</a></div>`,
  },
  {
    id: "button-whatsapp",
    label: "כפתור וואטסאפ",
    icon: "☎",
    category: "button",
    html: `<a class="biz-btn biz-btn-primary" href="https://wa.me/972500000000">שליחה בוואטסאפ</a>`,
  },
  {
    id: "button-phone",
    label: "כפתור שיחה",
    icon: "☏",
    category: "button",
    html: `<a class="biz-btn biz-btn-secondary" href="tel:0500000000">התקשרו עכשיו</a>`,
  },
  {
    id: "button-floating",
    label: "כפתור צף",
    icon: "↗",
    category: "button",
    html: `<a class="biz-btn biz-btn-primary" style="position:fixed;left:28px;bottom:28px;z-index:999;border-radius:999px;">וואטסאפ</a>`,
  },

  /* =====================================================
     STRIP / SECTIONS
  ===================================================== */
  {
    id: "strip-light",
    label: "סקציה בהירה",
    icon: "▭",
    category: "strip",
    html: `<section class="biz-section"><h2 class="biz-section-title">סקציה חדשה</h2><p class="biz-section-text">טקסט הסבר קצר.</p></section>`,
  },
  {
    id: "strip-soft",
    label: "סקציה רכה",
    icon: "▱",
    category: "strip",
    html: `<section class="biz-section"><div class="biz-strip-soft"><h2 class="biz-section-title">סקציה רכה ומעוצבת</h2><p class="biz-section-text">אפשר לשנות צבעים, רקע, פינות, ריווח ותמונה.</p></div></section>`,
  },
  {
    id: "strip-dark",
    label: "סקציה כהה",
    icon: "◼",
    category: "strip",
    html: `<section class="biz-section"><div class="biz-dark-section"><h2 class="biz-section-title" style="color:#fff;">סקציה כהה</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.72);">טקסט על רקע כהה.</p></div></section>`,
  },
  {
    id: "strip-background-image",
    label: "סקציה עם תמונת רקע",
    icon: "▧",
    category: "strip",
    html: `<section class="biz-section"><div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');"><h2 class="biz-section-title" style="color:#fff;">סקציה עם תמונת רקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.82);">אפשר לשנות תמונה, overlay, צבעים וריווחים.</p></div></section>`,
  },
  {
    id: "strip-split",
    label: "סקציה חצויה",
    icon: "▥",
    category: "strip",
    html: `<section class="biz-section biz-split"><div><p class="biz-section-kicker" style="margin-right:0;">כותרת קטנה</p><h2 class="biz-section-title" style="text-align:right;">סקציה חצויה</h2><p class="biz-card-text" style="font-size:18px;">טקסט בצד אחד ותמונה בצד השני.</p></div><div class="biz-image-card"><img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=90" /></div></section>`,
  },

  /* =====================================================
     DECORATIVE
  ===================================================== */
  {
    id: "decor-divider",
    label: "קו מפריד",
    icon: "—",
    category: "decorative",
    html: `<div style="height:1px;width:100%;background:linear-gradient(90deg,transparent,var(--biz-primary),transparent);margin:42px 0;"></div>`,
  },
  {
    id: "decor-spacer",
    label: "רווח",
    icon: "↕",
    category: "decorative",
    html: `<div style="height:80px;"></div>`,
  },
  {
    id: "decor-gradient-orb",
    label: "עיגול גרדיאנט",
    icon: "●",
    category: "decorative",
    html: `<div style="width:180px;height:180px;border-radius:999px;background:linear-gradient(135deg,var(--biz-primary),var(--biz-accent));filter:blur(2px);opacity:.75;"></div>`,
  },
  {
    id: "decor-badge",
    label: "תגית צפה",
    icon: "✦",
    category: "decorative",
    html: `<div class="biz-floating-badge">חדש · פרימיום</div>`,
  },

  /* =====================================================
     BOX
  ===================================================== */
  {
    id: "box-card",
    label: "כרטיס",
    icon: "□",
    category: "box",
    html: `<article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">כרטיס מידע</h3><p class="biz-card-text">טקסט קצר בתוך כרטיס מעוצב.</p></article>`,
  },
  {
    id: "box-price",
    label: "כרטיס מחיר",
    icon: "₪",
    category: "box",
    html: `<article class="biz-card"><h3 class="biz-card-title">חבילה מקצועית</h3><p class="biz-card-text">תיאור קצר של החבילה או השירות.</p><div class="biz-price-row"><span>החל מ־</span><span class="biz-price">₪350</span></div><a class="biz-btn biz-btn-primary" style="margin-top:22px;">בחירה</a></article>`,
  },
  {
    id: "box-feature",
    label: "כרטיס יתרון",
    icon: "✓",
    category: "box",
    html: `<article class="biz-card"><div class="biz-card-icon">✓</div><h3 class="biz-card-title">יתרון מרכזי</h3><p class="biz-card-text">משפט קצר שמסביר למה כדאי לבחור בעסק.</p></article>`,
  },
  {
    id: "box-contact",
    label: "כרטיס יצירת קשר",
    icon: "☎",
    category: "box",
    html: `<article class="biz-card"><div class="biz-card-icon">☎</div><h3 class="biz-card-title">דברו איתנו</h3><p class="biz-card-text">050-0000000</p><a class="biz-btn biz-btn-primary" style="margin-top:20px;">שליחת הודעה</a></article>`,
  },

  /* =====================================================
     GALLERY
  ===================================================== */
  {
    id: "gallery-grid",
    label: "גלריה גריד",
    icon: "▦",
    category: "gallery",
    html: `<section class="biz-section"><h2 class="biz-section-title">גלריה</h2><div class="biz-grid-4"><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90"/></div></section>`,
  },
  {
    id: "gallery-carousel",
    label: "קרוסלת תמונות",
    icon: "↔",
    category: "gallery",
    html: `<section class="biz-section"><h2 class="biz-section-title">קרוסלה</h2><div class="biz-carousel"><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90"/></div></section>`,
  },
  {
    id: "gallery-featured",
    label: "גלריה תמונה גדולה",
    icon: "▥",
    category: "gallery",
    html: `<section class="biz-section"><h2 class="biz-section-title">תצוגת עבודות</h2><div class="biz-split" style="margin-top:44px;"><div class="biz-image-card"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=90" /></div><div class="biz-grid-2" style="margin-top:0;"><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90"/><img class="biz-gallery-img" src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=90"/></div></div></section>`,
  },

  /* =====================================================
     MENU
  ===================================================== */
  {
    id: "menu-simple",
    label: "תפריט פשוט",
    icon: "☰",
    category: "menu",
    html: `<nav class="biz-nav-links"><a>דף הבית</a><a>אודות</a><a>שירותים</a><a>גלריה</a><a>צור קשר</a></nav>`,
  },
  {
    id: "menu-header",
    label: "Header מלא",
    icon: "▤",
    category: "menu",
    html: `<header class="biz-nav"><div class="biz-brand"><div class="biz-logo">B</div><div><p class="biz-brand-title">שם העסק</p><p class="biz-brand-subtitle">תחום העסק</p></div></div><nav class="biz-nav-links"><a>בית</a><a>אודות</a><a>שירותים</a><a>צור קשר</a></nav></header>`,
  },

  /* =====================================================
     FORMS
  ===================================================== */
  {
    id: "form-lead",
    label: "טופס ליד",
    icon: "▤",
    category: "forms",
    html: `<section class="biz-section"><h2 class="biz-section-title">השאירו פרטים</h2><p class="biz-section-text">נחזור אליכם בהקדם.</p><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="אימייל"/><textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea><button class="biz-btn biz-btn-primary" type="button">שליחה</button></form></section>`,
  },
  {
    id: "form-newsletter",
    label: "ניוזלטר",
    icon: "✉",
    category: "forms",
    html: `<section class="biz-section"><div class="biz-strip-soft" style="text-align:center;"><h2 class="biz-section-title">הצטרפות לעדכונים</h2><p class="biz-section-text">קבלו עדכונים, מבצעים והטבות.</p><form class="biz-form" style="max-width:620px;margin-left:auto;margin-right:auto;"><input class="biz-input" placeholder="אימייל"/><button class="biz-btn biz-btn-primary" type="button">הרשמה</button></form></div></section>`,
  },
  {
    id: "form-booking-request",
    label: "בקשת תור",
    icon: "◷",
    category: "forms",
    html: `<section class="biz-section"><h2 class="biz-section-title">בקשת תור</h2><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="שירות רצוי"/><input class="biz-input" placeholder="תאריך מועדף"/><button class="biz-btn biz-btn-primary" type="button">שליחת בקשה</button></form></section>`,
  },

  /* =====================================================
     VIDEO
  ===================================================== */
  {
    id: "video-youtube",
    label: "וידאו YouTube",
    icon: "▶",
    category: "video",
    html: `<section class="biz-section"><div class="biz-image-card"><iframe width="100%" height="460" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" style="border:0;border-radius:28px;" allowfullscreen></iframe></div></section>`,
  },
  {
    id: "video-background",
    label: "וידאו רקע",
    icon: "▶",
    category: "video",
    html: `<section class="biz-section"><div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');"><h2 class="biz-section-title" style="color:#fff;">סקשן וידאו רקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.84);">כאן אפשר להחליף לוידאו אמיתי בהמשך.</p></div></section>`,
  },

  /* =====================================================
     INTERACTIVE
  ===================================================== */
  {
    id: "interactive-accordion",
    label: "שאלות נפתחות",
    icon: "?",
    category: "interactive",
    html: `<section class="biz-section"><h2 class="biz-section-title">שאלות נפוצות</h2><div class="biz-grid-2"><details class="biz-card" open><summary class="biz-card-title">איך קובעים תור?</summary><p class="biz-card-text">לוחצים על קביעת תור ובוחרים זמן פנוי.</p></details><details class="biz-card"><summary class="biz-card-title">האם אפשר לשלם באתר?</summary><p class="biz-card-text">כן, ניתן לחבר סליקה לעסק.</p></details></div></section>`,
  },
  {
    id: "interactive-tabs",
    label: "Tabs",
    icon: "▥",
    category: "interactive",
    html: `<section class="biz-section"><div class="biz-strip-soft"><div class="biz-actions"><a class="biz-btn biz-btn-primary">טאב ראשון</a><a class="biz-btn biz-btn-secondary">טאב שני</a><a class="biz-btn biz-btn-secondary">טאב שלישי</a></div><h2 class="biz-section-title" style="margin-top:34px;">תוכן הטאב</h2><p class="biz-section-text">אפשר להשתמש בזה להצגת שירותים, תוכניות או שלבים.</p></div></section>`,
  },
  {
    id: "interactive-counters",
    label: "מספרים עולים",
    icon: "123",
    category: "interactive",
    html: `<section class="biz-section"><div class="biz-grid-3"><div class="biz-counter"><strong>500+</strong><span>לקוחות מרוצים</span></div><div class="biz-counter"><strong>7</strong><span>שנות ניסיון</span></div><div class="biz-counter"><strong>98%</strong><span>שביעות רצון</span></div></div></section>`,
  },
  {
    id: "interactive-popup-box",
    label: "פופאפ בסיסי",
    icon: "□",
    category: "interactive",
    html: `<div class="biz-card" style="max-width:460px;margin:auto;text-align:center;"><div class="biz-card-icon" style="margin-left:auto;margin-right:auto;">✦</div><h3 class="biz-card-title">פופאפ / הודעה</h3><p class="biz-card-text">אפשר להשתמש כקופון, הודעה או קריאה לפעולה.</p><a class="biz-btn biz-btn-primary" style="margin-top:20px;">הבנתי</a></div>`,
  },

  /* =====================================================
     LIST
  ===================================================== */
  {
    id: "list-checks",
    label: "רשימת יתרונות",
    icon: "✓",
    category: "list",
    html: `<ul class="biz-card" style="list-style:none;display:grid;gap:14px;"><li>✓ יתרון ראשון של העסק</li><li>✓ יתרון שני שמחזק אמון</li><li>✓ יתרון שלישי שמוביל לפעולה</li></ul>`,
  },
  {
    id: "list-steps",
    label: "שלבי תהליך",
    icon: "1",
    category: "list",
    html: `<section class="biz-section"><h2 class="biz-section-title">איך זה עובד?</h2><div class="biz-grid-3"><article class="biz-card"><div class="biz-card-icon">1</div><h3 class="biz-card-title">שיחה</h3><p class="biz-card-text">מכירים את הצורך.</p></article><article class="biz-card"><div class="biz-card-icon">2</div><h3 class="biz-card-title">התאמה</h3><p class="biz-card-text">בונים פתרון מתאים.</p></article><article class="biz-card"><div class="biz-card-icon">3</div><h3 class="biz-card-title">ביצוע</h3><p class="biz-card-text">יוצאים לדרך.</p></article></div></section>`,
  },

  /* =====================================================
     EMBED
  ===================================================== */
  {
    id: "embed-map",
    label: "מפה",
    icon: "⌖",
    category: "embed",
    html: `<section class="biz-section"><div class="biz-image-card"><iframe src="https://www.google.com/maps?q=Tel%20Aviv&output=embed" width="100%" height="420" style="border:0;border-radius:28px;" loading="lazy"></iframe></div></section>`,
  },
  {
    id: "embed-html",
    label: "Embed HTML",
    icon: "</>",
    category: "embed",
    html: `<div class="biz-card"><h3 class="biz-card-title">Embed</h3><p class="biz-card-text">כאן אפשר לשים קוד חיצוני בהמשך.</p></div>`,
  },

  /* =====================================================
     SOCIAL
  ===================================================== */
  {
    id: "social-row",
    label: "קישורי סושיאל",
    icon: "↗",
    category: "social",
    html: `<div class="biz-actions"><a class="biz-btn biz-btn-secondary">Instagram</a><a class="biz-btn biz-btn-secondary">Facebook</a><a class="biz-btn biz-btn-secondary">TikTok</a></div>`,
  },
  {
    id: "social-card",
    label: "כרטיס סושיאל",
    icon: "#",
    category: "social",
    html: `<article class="biz-card"><h3 class="biz-card-title">עקבו אחרינו</h3><p class="biz-card-text">הישארו מעודכנים ברשתות החברתיות.</p><div class="biz-actions"><a class="biz-btn biz-btn-secondary">Instagram</a><a class="biz-btn biz-btn-secondary">Facebook</a></div></article>`,
  },

  /* =====================================================
     PAYMENTS
  ===================================================== */
  {
    id: "payments-box",
    label: "תשלום",
    icon: "₪",
    category: "payments",
    html: `<article class="biz-card"><h3 class="biz-card-title">תשלום מאובטח</h3><p class="biz-card-text">חיבור לסליקה של העסק.</p><a class="biz-btn biz-btn-primary">לתשלום</a></article>`,
  },
  {
    id: "payments-deposit",
    label: "מקדמה לתור",
    icon: "₪",
    category: "payments",
    html: `<article class="biz-card"><h3 class="biz-card-title">תשלום מקדמה</h3><p class="biz-card-text">אפשר לחבר גביית מקדמה לפני קביעת תור.</p><div class="biz-price-row"><span>מקדמה</span><span class="biz-price">₪100</span></div><a class="biz-btn biz-btn-primary" style="margin-top:20px;">תשלום מקדמה</a></article>`,
  },

  /* =====================================================
     STORE
  ===================================================== */
  {
    id: "store-product-card",
    label: "מוצר",
    icon: "◈",
    category: "store",
    html: `<article class="biz-card"><div class="biz-image-card" style="padding:8px;margin-bottom:20px;"><img style="height:220px;" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=90" /></div><h3 class="biz-card-title">שם מוצר</h3><p class="biz-card-text">תיאור קצר של המוצר.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div></article>`,
  },
  {
    id: "store-products-grid",
    label: "גריד מוצרים",
    icon: "▦",
    category: "store",
    html: `<section class="biz-section" data-bizuply-block="products"><h2 class="biz-section-title">מוצרים לרכישה</h2><div class="biz-grid-3"><article class="biz-card"><h3 class="biz-card-title">מוצר ראשון</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪129</span></article><article class="biz-card"><h3 class="biz-card-title">מוצר שני</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪99</span></article><article class="biz-card"><h3 class="biz-card-title">מוצר שלישי</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪249</span></article></div></section>`,
  },

  /* =====================================================
     BOOKINGS
  ===================================================== */
  {
    id: "booking-times",
    label: "שעות פנויות",
    icon: "◷",
    category: "bookings",
    html: `<section class="biz-section" data-bizuply-block="booking"><h2 class="biz-section-title">בחרו שעה פנויה</h2><div class="biz-booking-box" style="margin-top:44px;"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></section>`,
  },
  {
    id: "booking-dark",
    label: "תיאום תורים כהה",
    icon: "◷",
    category: "bookings",
    html: `<section class="biz-section" data-bizuply-block="booking"><div class="biz-dark-section"><div class="biz-split"><div><p class="biz-pill">מחובר ליומן</p><h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור ישירות מהאתר</h2><p class="biz-card-text" style="color:rgba(255,255,255,0.7);">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="biz-booking-box"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></div></div></section>`,
  },

  /* =====================================================
     BIZUPLY SMART
  ===================================================== */
  {
    id: "bizuply-services",
    label: "שירותים מהעסק",
    icon: "B",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="services"><h2 class="biz-section-title">השירותים שלי</h2><div class="biz-grid-3"><article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות מהמערכת</h3><p class="biz-card-text">יוחלף אוטומטית בשירותי העסק.</p><div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div></article></div></section>`,
  },
  {
    id: "bizuply-booking",
    label: "תיאום תורים",
    icon: "◷",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="booking"><div class="biz-dark-section"><div class="biz-split"><div><p class="biz-pill">מחובר ליומן</p><h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור ישירות מהאתר</h2><p class="biz-card-text" style="color:rgba(255,255,255,0.7);">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="biz-booking-box"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></div></div></section>`,
  },
  {
    id: "bizuply-products",
    label: "מוצרים מהחנות",
    icon: "◈",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="products"><h2 class="biz-section-title">מוצרים מהחנות</h2><div class="biz-grid-3"><article class="biz-card"><h3 class="biz-card-title">מוצר מהמערכת</h3><p class="biz-card-text">יוחלף אוטומטית במוצרי העסק.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div></article></div></section>`,
  },
  {
    id: "bizuply-lead-form",
    label: "טופס ל־CRM",
    icon: "✉",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="lead-form"><div class="biz-hero-card" style="max-width:820px;margin:auto;"><h2 class="biz-section-title">השאירו פרטים</h2><p class="biz-section-text">כל ליד ייכנס ל־CRM של העסק.</p><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="אימייל"/><textarea class="biz-textarea" placeholder="הודעה"></textarea><button class="biz-btn biz-btn-primary" type="button">שליחה</button></form></div></section>`,
  },
  {
    id: "bizuply-reviews",
    label: "ביקורות מהמערכת",
    icon: "★",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="reviews"><h2 class="biz-section-title">ביקורות לקוחות</h2><div class="biz-grid-3"><article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">ביקורת מהמערכת תופיע כאן.</p><h3 class="biz-card-title">לקוחה</h3></article></div></section>`,
  },
  {
    id: "bizuply-club",
    label: "מועדון לקוחות",
    icon: "♛",
    category: "bizuply",
    html: `<section class="biz-section" data-bizuply-block="customer-club"><div style="border-radius:42px;padding:48px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 30px 100px rgba(139,92,246,0.28);"><h2 style="margin:0;font-size:42px;font-weight:950;">הצטרפות למועדון לקוחות</h2><p style="margin:14px 0 0;font-weight:700;color:rgba(255,255,255,0.82);">קבלו הטבות, קופונים ועדכונים מהעסק.</p><a class="biz-btn" style="margin-top:24px;background:#fff;color:#111827;">הצטרפות</a></div></section>`,
  },
];