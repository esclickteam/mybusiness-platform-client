import type { PageTemplate } from "../types";
import { defaultWebsiteHtml } from "../grapes/canvasTheme";

export const pageTemplates: PageTemplate[] = [
  {
    id: "beauty-luxury",
    name: "Luxury Beauty",
    category: "יופי וקליניקות",
    description: "תבנית פרימיום לעסקי יופי, איפור קבוע וקליניקות",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=90",
    html: defaultWebsiteHtml,
  },
  {
    id: "beauty-soft",
    name: "Soft Beauty",
    category: "יופי וקליניקות",
    description: "עיצוב עדין, נשי וממיר",
    preview:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90",
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
      <a>דף הבית</a><a>שירותים</a><a>גלריה</a><a>צור קשר</a>
    </nav>
  </header>
  <section class="biz-section-full">
    <div class="biz-bg-image" style="background-image:url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90');">
      <p class="biz-section-kicker" style="color:#fff;">סטודיו פרימיום</p>
      <h1 class="biz-title" style="color:#fff;max-width:850px;">יופי טבעי שמתחיל בחוויה מקצועית</h1>
      <p class="biz-subtitle" style="color:rgba(255,255,255,0.82);">
        טיפולים מתקדמים, יחס אישי ותוצאה מדויקת שמרגישה טבעית.
      </p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>
  </section>
</div>
`,
  },
  {
    id: "clinic-clean",
    name: "Clinic Clean",
    category: "קליניקות",
    description: "תבנית נקייה ומקצועית לקליניקות ושירותים",
    preview:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand"><div class="biz-logo">C</div><div><p class="biz-brand-title">Clinic Pro</p><p class="biz-brand-subtitle">קליניקה מקצועית</p></div></div>
    <nav class="biz-nav-links"><a>בית</a><a>שירותים</a><a>צוות</a><a>צור קשר</a></nav>
  </header>
  <section class="biz-section-wide biz-split">
    <div>
      <div class="biz-pill">קליניקה מקצועית</div>
      <h1 class="biz-title">טיפול אישי ברמה הגבוהה ביותר</h1>
      <p class="biz-subtitle">מערכת תורים, שירותים, טפסים ולידים — הכל מחובר לעסק.</p>
      <div class="biz-actions"><a class="biz-btn biz-btn-primary">קביעת תור</a><a class="biz-btn biz-btn-secondary">מידע נוסף</a></div>
    </div>
    <div class="biz-image-card">
      <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>
</div>
`,
  },
  {
    id: "store-premium",
    name: "Premium Store",
    category: "חנויות",
    description: "תבנית מכירתית עם מוצרים וסליקה",
    preview:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand"><div class="biz-logo">S</div><div><p class="biz-brand-title">Boutique Store</p><p class="biz-brand-subtitle">חנות פרימיום</p></div></div>
    <nav class="biz-nav-links"><a>בית</a><a>מוצרים</a><a>מבצעים</a><a>צור קשר</a></nav>
  </header>
  <section class="biz-section-full biz-hero">
    <div class="biz-hero-card">
      <div class="biz-pill">חנות אונליין</div>
      <h1 class="biz-title">מוצרים שנראים מעולה ונמכרים מהר</h1>
      <p class="biz-subtitle">קטלוג מוצרים, סליקה, מבצעים ומועדון לקוחות.</p>
      <div class="biz-actions"><a class="biz-btn biz-btn-primary">לרכישה</a><a class="biz-btn biz-btn-secondary">המוצרים שלנו</a></div>
    </div>
    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>
</div>
`,
  },
  {
    id: "service-pro",
    name: "Service Pro",
    category: "נותני שירות",
    description: "אתר מקצועי לנותני שירות עם לידים ותורים",
    preview:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand"><div class="biz-logo">P</div><div><p class="biz-brand-title">Business Pro</p><p class="biz-brand-subtitle">נותן שירות מקצועי</p></div></div>
    <nav class="biz-nav-links"><a>בית</a><a>שירותים</a><a>לקוחות</a><a>צור קשר</a></nav>
  </header>
  <section class="biz-section-wide">
    <div class="biz-hero-card" style="text-align:center;">
      <div class="biz-pill">עסק מקצועי</div>
      <h1 class="biz-title">אתר עסקי שמביא לקוחות</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">לידים, תיאום תורים, שירותים ומעקב CRM — במקום אחד.</p>
      <div class="biz-actions" style="justify-content:center;"><a class="biz-btn biz-btn-primary">קבלת הצעת מחיר</a><a class="biz-btn biz-btn-secondary">צור קשר</a></div>
    </div>
  </section>
</div>
`,
  },
];