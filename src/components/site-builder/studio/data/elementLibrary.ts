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

const images = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  beautySoft:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
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
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=90",
};

function element(
  id: string,
  label: string,
  description: string,
  icon: string,
  category: ElementCategory,
  html: string
): StudioElement {
  return {
    id,
    label,
    description,
    icon,
    category,
    html,
  };
}

export const studioElements: StudioElement[] = [
  /* =====================================================
     TEXT
  ===================================================== */

  element(
    "text-h1",
    "כותרת ענקית",
    "כותרת ראשית גדולה לעמוד פתיחה",
    "H1",
    "text",
    `<h1 class="biz-title">כותרת ראשית מרשימה</h1>`
  ),

  element(
    "text-h2",
    "כותרת סקשן",
    "כותרת גדולה לאזור באתר",
    "H2",
    "text",
    `<h2 class="biz-section-title">כותרת סקשן</h2>`
  ),

  element(
    "text-h3",
    "כותרת קטנה",
    "כותרת לכרטיס, שירות או מוצר",
    "H3",
    "text",
    `<h3 class="biz-card-title">כותרת קטנה</h3>`
  ),

  element(
    "text-paragraph",
    "פסקה",
    "טקסט הסבר מקצועי",
    "¶",
    "text",
    `<p class="biz-section-text">הקלידי כאן טקסט מקצועי שמתאר את העסק, השירות או ההצעה שלך.</p>`
  ),

  element(
    "text-kicker",
    "תגית קטנה",
    "טקסט קטן מעל כותרת",
    "•",
    "text",
    `<p class="biz-section-kicker">כותרת קטנה</p>`
  ),

  element(
    "text-pill",
    "תגית Pill",
    "תגית מעוגלת מעל כותרת",
    "P",
    "text",
    `<div class="biz-pill">עסק מקצועי · אתר חכם</div>`
  ),

  element(
    "text-highlight",
    "טקסט מודגש",
    "משפט גדול ומודגש",
    "!",
    "text",
    `<p style="font-size:28px;line-height:1.35;font-weight:950;color:var(--biz-text);">משפט מודגש שמושך תשומת לב ומעביר מסר חזק.</p>`
  ),

  element(
    "text-quote",
    "ציטוט",
    "ציטוט לקוח או משפט השראה",
    "”",
    "text",
    `<blockquote class="biz-card" style="font-size:24px;line-height:1.65;font-weight:850;">“חוויה מקצועית, מדויקת ויוקרתית מהרגע הראשון.”</blockquote>`
  ),

  element(
    "text-marquee",
    "טקסט זז",
    "שורת טקסט נעה לרוחב האתר",
    "↔",
    "text",
    `<div class="biz-marquee"><span>מבצע מיוחד · קביעת תור אונליין · שירות מקצועי · חוויית לקוח פרימיום · </span></div>`
  ),

  /* =====================================================
     IMAGE
  ===================================================== */

  element(
    "image-basic",
    "תמונה",
    "תמונה רגילה עם מסגרת פרימיום",
    "▧",
    "image",
    `<div class="biz-image-card"><img src="${images.beautySoft}" /></div>`
  ),

  element(
    "image-rounded",
    "תמונה עגולה",
    "תמונה עגולה לפרופיל / בעל עסק",
    "◯",
    "image",
    `<img src="${images.salon}" style="width:260px;height:260px;object-fit:cover;border-radius:999px;box-shadow:0 28px 90px rgba(15,23,42,0.15);" />`
  ),

  element(
    "image-wide",
    "תמונה רחבה",
    "תמונה רחבה לראש סקשן",
    "▭",
    "image",
    `<div class="biz-image-card"><img style="height:360px;" src="${images.beauty}" /></div>`
  ),

  element(
    "image-background-card",
    "כרטיס תמונת רקע",
    "בלוק עם תמונה כרקע וטקסט מעל",
    "▧",
    "image",
    `<div class="biz-bg-image" style="background-image:url('${images.beautySoft}');"><h2 class="biz-section-title" style="color:#fff;">תמונה כרקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.84);">אפשר לשנות תמונה, צבע, overlay ופינות.</p></div>`
  ),

  element(
    "image-before-after",
    "לפני / אחרי",
    "מבנה השוואה לפני ואחרי",
    "⇄",
    "image",
    `<section class="biz-section"><h2 class="biz-section-title">לפני ואחרי</h2><div class="biz-grid-2"><div class="biz-image-card"><img src="${images.beautySoft}" /><p class="biz-card-text">לפני</p></div><div class="biz-image-card"><img src="${images.salon}" /><p class="biz-card-text">אחרי</p></div></div></section>`
  ),

  /* =====================================================
     BUTTONS
  ===================================================== */

  element(
    "button-primary",
    "כפתור ראשי",
    "כפתור פעולה מרכזי",
    "●",
    "button",
    `<a class="biz-btn biz-btn-primary">כפתור פעולה</a>`
  ),

  element(
    "button-secondary",
    "כפתור משני",
    "כפתור פעולה רגוע יותר",
    "○",
    "button",
    `<a class="biz-btn biz-btn-secondary">כפתור משני</a>`
  ),

  element(
    "button-double",
    "שני כפתורים",
    "שני כפתורי פעולה יחד",
    "◉",
    "button",
    `<div class="biz-actions"><a class="biz-btn biz-btn-primary">קביעת תור</a><a class="biz-btn biz-btn-secondary">שליחת הודעה</a></div>`
  ),

  element(
    "button-whatsapp",
    "כפתור וואטסאפ",
    "שליחת הודעה בוואטסאפ",
    "☎",
    "button",
    `<a class="biz-btn biz-btn-primary" href="https://wa.me/972500000000">שליחה בוואטסאפ</a>`
  ),

  element(
    "button-phone",
    "כפתור שיחה",
    "כפתור התקשרות מהירה",
    "☏",
    "button",
    `<a class="biz-btn biz-btn-secondary" href="tel:0500000000">התקשרו עכשיו</a>`
  ),

  element(
    "button-floating",
    "כפתור צף",
    "כפתור צף בתחתית האתר",
    "↗",
    "button",
    `<a class="biz-btn biz-btn-primary" style="position:fixed;left:28px;bottom:28px;z-index:999;border-radius:999px;">וואטסאפ</a>`
  ),

  /* =====================================================
     STRIP / SECTIONS
  ===================================================== */

  element(
    "strip-light",
    "סקציה בהירה",
    "סקציה בסיסית נקייה",
    "▭",
    "strip",
    `<section class="biz-section"><h2 class="biz-section-title">סקציה חדשה</h2><p class="biz-section-text">טקסט הסבר קצר.</p></section>`
  ),

  element(
    "strip-soft",
    "סקציה רכה",
    "סקציה עם רקע רך וצל",
    "▱",
    "strip",
    `<section class="biz-section"><div class="biz-strip-soft"><h2 class="biz-section-title">סקציה רכה ומעוצבת</h2><p class="biz-section-text">אפשר לשנות צבעים, רקע, פינות, ריווח ותמונה.</p></div></section>`
  ),

  element(
    "strip-dark",
    "סקציה כהה",
    "סקציה כהה יוקרתית",
    "◼",
    "strip",
    `<section class="biz-section"><div class="biz-dark-section"><h2 class="biz-section-title" style="color:#fff;">סקציה כהה</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.72);">טקסט על רקע כהה.</p></div></section>`
  ),

  element(
    "strip-background-image",
    "סקציה עם תמונת רקע",
    "סקציה עם תמונת רקע ו־overlay",
    "▧",
    "strip",
    `<section class="biz-section"><div class="biz-bg-image" style="background-image:url('${images.beautySoft}');"><h2 class="biz-section-title" style="color:#fff;">סקציה עם תמונת רקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.82);">אפשר לשנות תמונה, overlay, צבעים וריווחים.</p></div></section>`
  ),

  element(
    "strip-split",
    "סקציה חצויה",
    "טקסט בצד ותמונה בצד",
    "▥",
    "strip",
    `<section class="biz-section biz-split"><div><p class="biz-section-kicker" style="margin-right:0;">כותרת קטנה</p><h2 class="biz-section-title" style="text-align:right;">סקציה חצויה</h2><p class="biz-card-text" style="font-size:18px;">טקסט בצד אחד ותמונה בצד השני.</p></div><div class="biz-image-card"><img src="${images.salon}" /></div></section>`
  ),

  /* =====================================================
     DECORATIVE
  ===================================================== */

  element(
    "decor-divider",
    "קו מפריד",
    "קו מעבר עדין בין אזורים",
    "—",
    "decorative",
    `<div style="height:1px;width:100%;background:linear-gradient(90deg,transparent,var(--biz-primary),transparent);margin:42px 0;"></div>`
  ),

  element(
    "decor-spacer",
    "רווח",
    "רווח אנכי בין אלמנטים",
    "↕",
    "decorative",
    `<div style="height:80px;"></div>`
  ),

  element(
    "decor-gradient-orb",
    "עיגול גרדיאנט",
    "אלמנט דקורטיבי צבעוני",
    "●",
    "decorative",
    `<div style="width:180px;height:180px;border-radius:999px;background:linear-gradient(135deg,var(--biz-primary),var(--biz-accent));filter:blur(2px);opacity:.75;"></div>`
  ),

  element(
    "decor-badge",
    "תגית צפה",
    "תגית קטנה דקורטיבית",
    "✦",
    "decorative",
    `<div class="biz-floating-badge">חדש · פרימיום</div>`
  ),

  /* =====================================================
     BOX
  ===================================================== */

  element(
    "box-card",
    "כרטיס",
    "כרטיס מידע בסיסי",
    "□",
    "box",
    `<article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">כרטיס מידע</h3><p class="biz-card-text">טקסט קצר בתוך כרטיס מעוצב.</p></article>`
  ),

  element(
    "box-price",
    "כרטיס מחיר",
    "כרטיס שירות עם מחיר",
    "₪",
    "box",
    `<article class="biz-card"><h3 class="biz-card-title">חבילה מקצועית</h3><p class="biz-card-text">תיאור קצר של החבילה או השירות.</p><div class="biz-price-row"><span>החל מ־</span><span class="biz-price">₪350</span></div><a class="biz-btn biz-btn-primary" style="margin-top:22px;">בחירה</a></article>`
  ),

  element(
    "box-feature",
    "כרטיס יתרון",
    "כרטיס יתרון לבניית אמון",
    "✓",
    "box",
    `<article class="biz-card"><div class="biz-card-icon">✓</div><h3 class="biz-card-title">יתרון מרכזי</h3><p class="biz-card-text">משפט קצר שמסביר למה כדאי לבחור בעסק.</p></article>`
  ),

  element(
    "box-contact",
    "כרטיס יצירת קשר",
    "טלפון, וואטסאפ ופרטי קשר",
    "☎",
    "box",
    `<article class="biz-card"><div class="biz-card-icon">☎</div><h3 class="biz-card-title">דברו איתנו</h3><p class="biz-card-text">050-0000000</p><a class="biz-btn biz-btn-primary" style="margin-top:20px;">שליחת הודעה</a></article>`
  ),

  /* =====================================================
     GALLERY
  ===================================================== */

  element(
    "gallery-grid",
    "גלריה גריד",
    "גלריית תמונות מסודרת",
    "▦",
    "gallery",
    `<section class="biz-section"><h2 class="biz-section-title">גלריה</h2><div class="biz-grid-4"><img class="biz-gallery-img" src="${images.beautySoft}"/><img class="biz-gallery-img" src="${images.salon}"/><img class="biz-gallery-img" src="${images.beauty}"/><img class="biz-gallery-img" src="${images.product}"/></div></section>`
  ),

  element(
    "gallery-carousel",
    "קרוסלת תמונות",
    "גלריה נגללת לרוחב",
    "↔",
    "gallery",
    `<section class="biz-section"><h2 class="biz-section-title">קרוסלה</h2><div class="biz-carousel"><img class="biz-gallery-img" src="${images.beautySoft}"/><img class="biz-gallery-img" src="${images.salon}"/><img class="biz-gallery-img" src="${images.beauty}"/></div></section>`
  ),

  element(
    "gallery-featured",
    "גלריה תמונה גדולה",
    "תמונה גדולה לצד תמונות קטנות",
    "▥",
    "gallery",
    `<section class="biz-section"><h2 class="biz-section-title">תצוגת עבודות</h2><div class="biz-split" style="margin-top:44px;"><div class="biz-image-card"><img src="${images.beautySoft}" /></div><div class="biz-grid-2" style="margin-top:0;"><img class="biz-gallery-img" src="${images.salon}"/><img class="biz-gallery-img" src="${images.beauty}"/><img class="biz-gallery-img" src="${images.product}"/><img class="biz-gallery-img" src="${images.office}"/></div></div></section>`
  ),

  /* =====================================================
     MENU
  ===================================================== */

  element(
    "menu-simple",
    "תפריט פשוט",
    "קישורי ניווט בלבד",
    "☰",
    "menu",
    `<nav class="biz-nav-links"><a>דף הבית</a><a>אודות</a><a>שירותים</a><a>גלריה</a><a>צור קשר</a></nav>`
  ),

  element(
    "menu-header",
    "Header מלא",
    "לוגו, שם עסק ותפריט",
    "▤",
    "menu",
    `<header class="biz-nav"><div class="biz-brand"><div class="biz-logo">B</div><div><p class="biz-brand-title">שם העסק</p><p class="biz-brand-subtitle">תחום העסק</p></div></div><nav class="biz-nav-links"><a>בית</a><a>אודות</a><a>שירותים</a><a>צור קשר</a></nav></header>`
  ),

  /* =====================================================
     FORMS
  ===================================================== */

  element(
    "form-lead",
    "טופס ליד",
    "טופס פנייה ל־CRM",
    "▤",
    "forms",
    `<section class="biz-section"><h2 class="biz-section-title">השאירו פרטים</h2><p class="biz-section-text">נחזור אליכם בהקדם.</p><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="אימייל"/><textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea><button class="biz-btn biz-btn-primary" type="button">שליחה</button></form></section>`
  ),

  element(
    "form-newsletter",
    "ניוזלטר",
    "טופס הרשמה לעדכונים",
    "✉",
    "forms",
    `<section class="biz-section"><div class="biz-strip-soft" style="text-align:center;"><h2 class="biz-section-title">הצטרפות לעדכונים</h2><p class="biz-section-text">קבלו עדכונים, מבצעים והטבות.</p><form class="biz-form" style="max-width:620px;margin-left:auto;margin-right:auto;"><input class="biz-input" placeholder="אימייל"/><button class="biz-btn biz-btn-primary" type="button">הרשמה</button></form></div></section>`
  ),

  element(
    "form-booking-request",
    "בקשת תור",
    "טופס בקשת תור ידני",
    "◷",
    "forms",
    `<section class="biz-section"><h2 class="biz-section-title">בקשת תור</h2><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="שירות רצוי"/><input class="biz-input" placeholder="תאריך מועדף"/><button class="biz-btn biz-btn-primary" type="button">שליחת בקשה</button></form></section>`
  ),

  /* =====================================================
     VIDEO
  ===================================================== */

  element(
    "video-youtube",
    "וידאו YouTube",
    "הטמעת סרטון יוטיוב",
    "▶",
    "video",
    `<section class="biz-section"><div class="biz-image-card"><iframe width="100%" height="460" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" style="border:0;border-radius:28px;" allowfullscreen></iframe></div></section>`
  ),

  element(
    "video-background",
    "וידאו רקע",
    "סקשן שנראה כמו וידאו רקע",
    "▶",
    "video",
    `<section class="biz-section"><div class="biz-bg-image" style="background-image:url('${images.beautySoft}');"><h2 class="biz-section-title" style="color:#fff;">סקשן וידאו רקע</h2><p class="biz-section-text" style="color:rgba(255,255,255,0.84);">כאן אפשר להחליף לוידאו אמיתי בהמשך.</p></div></section>`
  ),

  /* =====================================================
     INTERACTIVE
  ===================================================== */

  element(
    "interactive-accordion",
    "שאלות נפתחות",
    "FAQ עם פתיחה וסגירה",
    "?",
    "interactive",
    `<section class="biz-section"><h2 class="biz-section-title">שאלות נפוצות</h2><div class="biz-grid-2"><details class="biz-card" open><summary class="biz-card-title">איך קובעים תור?</summary><p class="biz-card-text">לוחצים על קביעת תור ובוחרים זמן פנוי.</p></details><details class="biz-card"><summary class="biz-card-title">האם אפשר לשלם באתר?</summary><p class="biz-card-text">כן, ניתן לחבר סליקה לעסק.</p></details></div></section>`
  ),

  element(
    "interactive-tabs",
    "Tabs",
    "טאבים להצגת תוכן",
    "▥",
    "interactive",
    `<section class="biz-section"><div class="biz-strip-soft"><div class="biz-actions"><a class="biz-btn biz-btn-primary">טאב ראשון</a><a class="biz-btn biz-btn-secondary">טאב שני</a><a class="biz-btn biz-btn-secondary">טאב שלישי</a></div><h2 class="biz-section-title" style="margin-top:34px;">תוכן הטאב</h2><p class="biz-section-text">אפשר להשתמש בזה להצגת שירותים, תוכניות או שלבים.</p></div></section>`
  ),

  element(
    "interactive-counters",
    "מספרים עולים",
    "מספרים ליצירת אמון",
    "123",
    "interactive",
    `<section class="biz-section"><div class="biz-grid-3"><div class="biz-counter"><strong>500+</strong><span>לקוחות מרוצים</span></div><div class="biz-counter"><strong>7</strong><span>שנות ניסיון</span></div><div class="biz-counter"><strong>98%</strong><span>שביעות רצון</span></div></div></section>`
  ),

  element(
    "interactive-popup-box",
    "פופאפ בסיסי",
    "כרטיס הודעה או קופון",
    "□",
    "interactive",
    `<div class="biz-card" style="max-width:460px;margin:auto;text-align:center;"><div class="biz-card-icon" style="margin-left:auto;margin-right:auto;">✦</div><h3 class="biz-card-title">פופאפ / הודעה</h3><p class="biz-card-text">אפשר להשתמש כקופון, הודעה או קריאה לפעולה.</p><a class="biz-btn biz-btn-primary" style="margin-top:20px;">הבנתי</a></div>`
  ),

  /* =====================================================
     LIST
  ===================================================== */

  element(
    "list-checks",
    "רשימת יתרונות",
    "רשימה עם סימוני וי",
    "✓",
    "list",
    `<ul class="biz-card" style="list-style:none;display:grid;gap:14px;"><li>✓ יתרון ראשון של העסק</li><li>✓ יתרון שני שמחזק אמון</li><li>✓ יתרון שלישי שמוביל לפעולה</li></ul>`
  ),

  element(
    "list-steps",
    "שלבי תהליך",
    "3 שלבים ברורים ללקוח",
    "1",
    "list",
    `<section class="biz-section"><h2 class="biz-section-title">איך זה עובד?</h2><div class="biz-grid-3"><article class="biz-card"><div class="biz-card-icon">1</div><h3 class="biz-card-title">שיחה</h3><p class="biz-card-text">מכירים את הצורך.</p></article><article class="biz-card"><div class="biz-card-icon">2</div><h3 class="biz-card-title">התאמה</h3><p class="biz-card-text">בונים פתרון מתאים.</p></article><article class="biz-card"><div class="biz-card-icon">3</div><h3 class="biz-card-title">ביצוע</h3><p class="biz-card-text">יוצאים לדרך.</p></article></div></section>`
  ),

  /* =====================================================
     EMBED
  ===================================================== */

  element(
    "embed-map",
    "מפה",
    "הטמעת Google Maps",
    "⌖",
    "embed",
    `<section class="biz-section"><div class="biz-image-card"><iframe src="https://www.google.com/maps?q=Tel%20Aviv&output=embed" width="100%" height="420" style="border:0;border-radius:28px;" loading="lazy"></iframe></div></section>`
  ),

  element(
    "embed-html",
    "Embed HTML",
    "מקום לקוד חיצוני",
    "</>",
    "embed",
    `<div class="biz-card"><h3 class="biz-card-title">Embed</h3><p class="biz-card-text">כאן אפשר לשים קוד חיצוני בהמשך.</p></div>`
  ),

  /* =====================================================
     SOCIAL
  ===================================================== */

  element(
    "social-row",
    "קישורי סושיאל",
    "אינסטגרם, פייסבוק וטיקטוק",
    "↗",
    "social",
    `<div class="biz-actions"><a class="biz-btn biz-btn-secondary">Instagram</a><a class="biz-btn biz-btn-secondary">Facebook</a><a class="biz-btn biz-btn-secondary">TikTok</a></div>`
  ),

  element(
    "social-card",
    "כרטיס סושיאל",
    "כרטיס מעקב ברשתות",
    "#",
    "social",
    `<article class="biz-card"><h3 class="biz-card-title">עקבו אחרינו</h3><p class="biz-card-text">הישארו מעודכנים ברשתות החברתיות.</p><div class="biz-actions"><a class="biz-btn biz-btn-secondary">Instagram</a><a class="biz-btn biz-btn-secondary">Facebook</a></div></article>`
  ),

  /* =====================================================
     PAYMENTS
  ===================================================== */

  element(
    "payments-box",
    "תשלום",
    "בלוק תשלום מאובטח",
    "₪",
    "payments",
    `<article class="biz-card"><h3 class="biz-card-title">תשלום מאובטח</h3><p class="biz-card-text">חיבור לסליקה של העסק.</p><a class="biz-btn biz-btn-primary">לתשלום</a></article>`
  ),

  element(
    "payments-deposit",
    "מקדמה לתור",
    "גביית מקדמה לפני תור",
    "₪",
    "payments",
    `<article class="biz-card"><h3 class="biz-card-title">תשלום מקדמה</h3><p class="biz-card-text">אפשר לחבר גביית מקדמה לפני קביעת תור.</p><div class="biz-price-row"><span>מקדמה</span><span class="biz-price">₪100</span></div><a class="biz-btn biz-btn-primary" style="margin-top:20px;">תשלום מקדמה</a></article>`
  ),

  /* =====================================================
     STORE
  ===================================================== */

  element(
    "store-product-card",
    "מוצר",
    "כרטיס מוצר בודד",
    "◈",
    "store",
    `<article class="biz-card"><div class="biz-image-card" style="padding:8px;margin-bottom:20px;"><img style="height:220px;" src="${images.product}" /></div><h3 class="biz-card-title">שם מוצר</h3><p class="biz-card-text">תיאור קצר של המוצר.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div></article>`
  ),

  element(
    "store-products-grid",
    "גריד מוצרים",
    "3 מוצרים לרכישה",
    "▦",
    "store",
    `<section class="biz-section" data-bizuply-block="products"><h2 class="biz-section-title">מוצרים לרכישה</h2><div class="biz-grid-3"><article class="biz-card"><h3 class="biz-card-title">מוצר ראשון</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪129</span></article><article class="biz-card"><h3 class="biz-card-title">מוצר שני</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪99</span></article><article class="biz-card"><h3 class="biz-card-title">מוצר שלישי</h3><p class="biz-card-text">תיאור מוצר.</p><span class="biz-price">₪249</span></article></div></section>`
  ),

  /* =====================================================
     BOOKINGS
  ===================================================== */

  element(
    "booking-times",
    "שעות פנויות",
    "בחירת שעה פנויה",
    "◷",
    "bookings",
    `<section class="biz-section" data-bizuply-block="booking"><h2 class="biz-section-title">בחרו שעה פנויה</h2><div class="biz-booking-box" style="margin-top:44px;"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></section>`
  ),

  element(
    "booking-dark",
    "תיאום תורים כהה",
    "תיאום תורים בעיצוב כהה",
    "◷",
    "bookings",
    `<section class="biz-section" data-bizuply-block="booking"><div class="biz-dark-section"><div class="biz-split"><div><p class="biz-pill">מחובר ליומן</p><h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור ישירות מהאתר</h2><p class="biz-card-text" style="color:rgba(255,255,255,0.7);">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="biz-booking-box"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></div></div></section>`
  ),

  /* =====================================================
     BIZUPLY SMART
  ===================================================== */

  element(
    "bizuply-services",
    "שירותים מהעסק",
    "יוחלף בהמשך בשירותי העסק",
    "B",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="services"><h2 class="biz-section-title">השירותים שלי</h2><div class="biz-grid-3"><article class="biz-card"><div class="biz-card-icon">✦</div><h3 class="biz-card-title">שירות מהמערכת</h3><p class="biz-card-text">יוחלף אוטומטית בשירותי העסק.</p><div class="biz-price-row"><span>60 דקות</span><span class="biz-price">₪350</span></div></article></div></section>`
  ),

  element(
    "bizuply-booking",
    "תיאום תורים",
    "בלוק תורים חכם",
    "◷",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="booking"><div class="biz-dark-section"><div class="biz-split"><div><p class="biz-pill">מחובר ליומן</p><h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור ישירות מהאתר</h2><p class="biz-card-text" style="color:rgba(255,255,255,0.7);">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="biz-booking-box"><div class="biz-time-grid"><div class="biz-time">09:00</div><div class="biz-time">10:30</div><div class="biz-time">12:00</div><div class="biz-time">14:00</div><div class="biz-time">16:30</div><div class="biz-time">18:00</div></div></div></div></div></section>`
  ),

  element(
    "bizuply-products",
    "מוצרים מהחנות",
    "יוחלף בהמשך במוצרי העסק",
    "◈",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="products"><h2 class="biz-section-title">מוצרים מהחנות</h2><div class="biz-grid-3"><article class="biz-card"><h3 class="biz-card-title">מוצר מהמערכת</h3><p class="biz-card-text">יוחלף אוטומטית במוצרי העסק.</p><div class="biz-price-row"><a class="biz-btn biz-btn-primary">הוספה לסל</a><span class="biz-price">₪129</span></div></article></div></section>`
  ),

  element(
    "bizuply-lead-form",
    "טופס ל־CRM",
    "כל ליד ייכנס למערכת",
    "✉",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="lead-form"><div class="biz-hero-card" style="max-width:820px;margin:auto;"><h2 class="biz-section-title">השאירו פרטים</h2><p class="biz-section-text">כל ליד ייכנס ל־CRM של העסק.</p><form class="biz-form"><input class="biz-input" placeholder="שם מלא"/><input class="biz-input" placeholder="טלפון"/><input class="biz-input" placeholder="אימייל"/><textarea class="biz-textarea" placeholder="הודעה"></textarea><button class="biz-btn biz-btn-primary" type="button">שליחה</button></form></div></section>`
  ),

  element(
    "bizuply-reviews",
    "ביקורות מהמערכת",
    "ביקורות לקוחות מהמערכת",
    "★",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="reviews"><h2 class="biz-section-title">ביקורות לקוחות</h2><div class="biz-grid-3"><article class="biz-card"><div style="color:#f59e0b;font-size:22px;">★★★★★</div><p class="biz-card-text">ביקורת מהמערכת תופיע כאן.</p><h3 class="biz-card-title">לקוחה</h3></article></div></section>`
  ),

  element(
    "bizuply-club",
    "מועדון לקוחות",
    "הרשמה למועדון לקוחות וקופונים",
    "♛",
    "bizuply",
    `<section class="biz-section" data-bizuply-block="customer-club"><div style="border-radius:42px;padding:48px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 30px 100px rgba(139,92,246,0.28);"><h2 style="margin:0;font-size:42px;font-weight:950;">הצטרפות למועדון לקוחות</h2><p style="margin:14px 0 0;font-weight:700;color:rgba(255,255,255,0.82);">קבלו הטבות, קופונים ועדכונים מהעסק.</p><a class="biz-btn" style="margin-top:24px;background:#fff;color:#111827;">הצטרפות</a></div></section>`
  ),
];