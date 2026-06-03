import type { PageTemplate } from "../types";
import { defaultWebsiteHtml } from "../grapes/canvasTheme";

const images = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  softBeauty:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  business:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90",
  food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=90",
  coach:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
  event:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=90",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=90",
  realEstate:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=90",
  creative:
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=90",
};

function template(
  id: string,
  name: string,
  category: string,
  description: string,
  preview: string,
  html: string
): PageTemplate {
  return {
    id,
    name,
    category,
    description,
    preview,
    html,
  };
}

function navHtml({
  logo,
  title,
  subtitle,
  links,
}: {
  logo: string;
  title: string;
  subtitle: string;
  links: string[];
}) {
  return `
<header class="biz-nav">
  <div class="biz-brand">
    <div class="biz-logo">${logo}</div>
    <div>
      <p class="biz-brand-title">${title}</p>
      <p class="biz-brand-subtitle">${subtitle}</p>
    </div>
  </div>

  <nav class="biz-nav-links">
    ${links.map((link) => `<a>${link}</a>`).join("")}
  </nav>
</header>
`;
}

function servicesGridHtml({
  kicker = "שירותים",
  title = "השירותים שלנו",
  services,
}: {
  kicker?: string;
  title?: string;
  services: { icon: string; title: string; text: string; price?: string }[];
}) {
  return `
<section class="biz-section" data-bizuply-block="services">
  <p class="biz-section-kicker">${kicker}</p>
  <h2 class="biz-section-title">${title}</h2>

  <div class="biz-grid-3">
    ${services
      .map(
        (service) => `
      <article class="biz-card">
        <div class="biz-card-icon">${service.icon}</div>
        <h3 class="biz-card-title">${service.title}</h3>
        <p class="biz-card-text">${service.text}</p>
        ${
          service.price
            ? `<div class="biz-price-row"><span>החל מ־</span><span class="biz-price">${service.price}</span></div>`
            : ""
        }
      </article>
    `
      )
      .join("")}
  </div>
</section>
`;
}

function galleryHtml({
  image1 = images.softBeauty,
  image2 = images.salon,
  image3 = images.beauty,
  image4 = images.product,
}: {
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
}) {
  return `
<section class="biz-section">
  <p class="biz-section-kicker">גלריה</p>
  <h2 class="biz-section-title">עבודות אחרונות</h2>

  <div class="biz-grid-4">
    <img class="biz-gallery-img" src="${image1}" />
    <img class="biz-gallery-img" src="${image2}" />
    <img class="biz-gallery-img" src="${image3}" />
    <img class="biz-gallery-img" src="${image4}" />
  </div>
</section>
`;
}

function leadFormHtml({
  dark = false,
  title = "השאירו פרטים",
  text = "נחזור אליכם בהקדם.",
}: {
  dark?: boolean;
  title?: string;
  text?: string;
}) {
  if (dark) {
    return `
<section class="biz-section" data-bizuply-block="lead-form">
  <div class="biz-dark-section">
    <h2 class="biz-section-title" style="color:#fff;">${title}</h2>
    <p class="biz-section-text" style="color:rgba(255,255,255,0.72);">${text}</p>

    <form class="biz-form" style="max-width:760px;margin-left:auto;margin-right:auto;">
      <input class="biz-input" placeholder="שם מלא" />
      <input class="biz-input" placeholder="טלפון" />
      <input class="biz-input" placeholder="אימייל" />
      <textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea>
      <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
    </form>
  </div>
</section>
`;
  }

  return `
<section class="biz-section" data-bizuply-block="lead-form">
  <div class="biz-hero-card" style="max-width:820px;margin:auto;">
    <p class="biz-section-kicker">יצירת קשר</p>
    <h2 class="biz-section-title">${title}</h2>
    <p class="biz-section-text">${text}</p>

    <form class="biz-form">
      <input class="biz-input" placeholder="שם מלא" />
      <input class="biz-input" placeholder="טלפון" />
      <input class="biz-input" placeholder="אימייל" />
      <textarea class="biz-textarea" placeholder="במה אפשר לעזור?"></textarea>
      <button class="biz-btn biz-btn-primary" type="button">שליחה</button>
    </form>
  </div>
</section>
`;
}

function bookingHtml() {
  return `
<section class="biz-section" data-bizuply-block="booking">
  <div class="biz-dark-section">
    <div class="biz-split">
      <div>
        <p class="biz-pill">מחובר ליומן</p>
        <h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2>
        <p class="biz-card-text" style="color:rgba(255,255,255,0.7);font-size:18px;">
          הלקוח בוחר שירות, תאריך ושעה פנויה.
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
`;
}

function reviewsHtml() {
  return `
<section class="biz-section" data-bizuply-block="reviews">
  <p class="biz-section-kicker">ביקורות</p>
  <h2 class="biz-section-title">לקוחות מספרים</h2>

  <div class="biz-grid-3">
    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">שירות מושלם, מקצועי ומדויק.</p>
      <h3 class="biz-card-title">לקוחה מרוצה</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">חוויה מדהימה מההתחלה ועד הסוף.</p>
      <h3 class="biz-card-title">לקוח מרוצה</h3>
    </article>

    <article class="biz-card">
      <div style="color:#f59e0b;font-size:22px;">★★★★★</div>
      <p class="biz-card-text">ממליצה בחום, הכל היה ברמה גבוהה.</p>
      <h3 class="biz-card-title">לקוחה מרוצה</h3>
    </article>
  </div>
</section>
`;
}

function customerClubHtml() {
  return `
<section class="biz-section" data-bizuply-block="customer-club">
  <div style="border-radius:44px;padding:54px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;box-shadow:0 34px 110px rgba(139,92,246,0.28);">
    <h2 style="margin:0;font-size:44px;font-weight:950;">הצטרפות למועדון לקוחות</h2>
    <p style="margin:16px 0 0;font-weight:750;color:rgba(255,255,255,0.84);">
      קבלו הטבות, קופונים ועדכונים לפני כולם.
    </p>
    <a class="biz-btn" style="margin-top:26px;background:#fff;color:#111827;">הצטרפות</a>
  </div>
</section>
`;
}

function baseBusinessPage({
  logo,
  brandTitle,
  brandSubtitle,
  navLinks,
  heroKicker,
  heroTitle,
  heroText,
  heroImage,
  services,
  includeBooking = false,
  includeGallery = true,
  includeReviews = true,
  includeLeadForm = true,
  includeClub = false,
}: {
  logo: string;
  brandTitle: string;
  brandSubtitle: string;
  navLinks: string[];
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  heroImage: string;
  services: { icon: string; title: string; text: string; price?: string }[];
  includeBooking?: boolean;
  includeGallery?: boolean;
  includeReviews?: boolean;
  includeLeadForm?: boolean;
  includeClub?: boolean;
}) {
  return `
<div class="biz-page">
  ${navHtml({
    logo,
    title: brandTitle,
    subtitle: brandSubtitle,
    links: navLinks,
  })}

  <section class="biz-section-full biz-hero" data-animate="fade-up">
    <div class="biz-hero-card">
      <div class="biz-pill">${heroKicker}</div>
      <h1 class="biz-title">${heroTitle}</h1>
      <p class="biz-subtitle">${heroText}</p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>

    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="${heroImage}" />
    </div>
  </section>

  <section class="biz-section biz-split">
    <div>
      <p class="biz-section-kicker" style="margin-right:0;">אודות</p>
      <h2 class="biz-section-title" style="text-align:right;">החוויה שהלקוחות מקבלים</h2>
      <p class="biz-card-text" style="font-size:18px;">
        כאן אפשר לספר על העסק, הניסיון, הסגנון, רמת השירות והייחודיות של העסק.
      </p>
    </div>

    <div class="biz-image-card">
      <img src="${heroImage}" />
    </div>
  </section>

  ${servicesGridHtml({
    title: "השירותים שלנו",
    services,
  })}

  ${includeBooking ? bookingHtml() : ""}
  ${includeGallery ? galleryHtml({ image1: heroImage }) : ""}
  ${includeReviews ? reviewsHtml() : ""}
  ${includeClub ? customerClubHtml() : ""}
  ${includeLeadForm ? leadFormHtml({}) : ""}
</div>
`;
}

function storePage() {
  return `
<div class="biz-page">
  ${navHtml({
    logo: "S",
    title: "Boutique Store",
    subtitle: "חנות פרימיום",
    links: ["בית", "מוצרים", "מבצעים", "מועדון", "צור קשר"],
  })}

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
      <img class="biz-hero-image" src="${images.store}" />
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="products">
    <p class="biz-section-kicker">מוצרים</p>
    <h2 class="biz-section-title">מוצרים נבחרים</h2>

    <div class="biz-grid-3">
      ${[
        ["מוצר ראשון", images.product, "₪129"],
        ["מוצר שני", images.softBeauty, "₪99"],
        ["מוצר שלישי", images.beauty, "₪249"],
      ]
        .map(
          ([name, image, price]) => `
        <article class="biz-card">
          <div class="biz-image-card" style="padding:8px;margin-bottom:20px;">
            <img style="height:220px;" src="${image}" />
          </div>
          <h3 class="biz-card-title">${name}</h3>
          <p class="biz-card-text">תיאור קצר ומכירתי של המוצר.</p>
          <div class="biz-price-row">
            <a class="biz-btn biz-btn-primary">הוספה לסל</a>
            <span class="biz-price">${price}</span>
          </div>
        </article>
      `
        )
        .join("")}
    </div>
  </section>

  ${customerClubHtml()}
  ${reviewsHtml()}
</div>
`;
}

function landingPage() {
  return `
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
      <article class="biz-card">
        <div class="biz-card-icon">✓</div>
        <h3 class="biz-card-title">יתרון ראשון</h3>
        <p class="biz-card-text">למה זה טוב ללקוח.</p>
      </article>

      <article class="biz-card">
        <div class="biz-card-icon">✓</div>
        <h3 class="biz-card-title">יתרון שני</h3>
        <p class="biz-card-text">מה הערך המרכזי.</p>
      </article>

      <article class="biz-card">
        <div class="biz-card-icon">✓</div>
        <h3 class="biz-card-title">יתרון שלישי</h3>
        <p class="biz-card-text">למה לבחור עכשיו.</p>
      </article>
    </div>
  </section>

  ${leadFormHtml({
    dark: true,
    title: "השאירו פרטים",
    text: "כל ליד ייכנס ישירות ל־CRM של העסק.",
  })}
</div>
`;
}

export const pageTemplates: PageTemplate[] = [
  template(
    "beauty-luxury-full",
    "Luxury Beauty Pro",
    "יופי וקליניקות",
    "תבנית יוקרתית מלאה לעסקי יופי, איפור קבוע וקליניקות",
    images.beauty,
    defaultWebsiteHtml
  ),

  template(
    "beauty-soft-editorial",
    "Soft Editorial Beauty",
    "יופי וקליניקות",
    "תבנית נשית, עדינה, פרימיום ומכירתית",
    images.softBeauty,
    baseBusinessPage({
      logo: "B",
      brandTitle: "סטודיו יופי",
      brandSubtitle: "טיפולי יופי בהתאמה אישית",
      navLinks: ["דף הבית", "אודות", "שירותים", "גלריה", "צור קשר"],
      heroKicker: "סטודיו פרימיום",
      heroTitle: "יופי טבעי שמתחיל בחוויה מקצועית",
      heroText: "טיפולים מתקדמים, יחס אישי ותוצאה מדויקת שמרגישה טבעית.",
      heroImage: images.softBeauty,
      includeBooking: true,
      includeClub: true,
      services: [
        {
          icon: "✦",
          title: "איפור קבוע",
          text: "תוצאה טבעית ומדויקת.",
          price: "₪850",
        },
        {
          icon: "✦",
          title: "טיפולי פנים",
          text: "טיפול מקצועי לעור זוהר.",
          price: "₪350",
        },
        {
          icon: "✦",
          title: "ייעוץ אישי",
          text: "התאמה מלאה לפני טיפול.",
          price: "₪150",
        },
      ],
    })
  ),

  template(
    "clinic-clean-pro",
    "Clinic Clean Pro",
    "קליניקות",
    "תבנית נקייה, רפואית ומקצועית לקליניקות",
    images.clinic,
    baseBusinessPage({
      logo: "C",
      brandTitle: "Clinic Pro",
      brandSubtitle: "קליניקה מקצועית",
      navLinks: ["בית", "שירותים", "צוות", "תורים", "צור קשר"],
      heroKicker: "קליניקה מקצועית",
      heroTitle: "טיפול אישי ברמה הגבוהה ביותר",
      heroText: "מערכת תורים, שירותים, טפסים ולידים — הכל מחובר לעסק.",
      heroImage: images.clinic,
      includeBooking: true,
      services: [
        {
          icon: "01",
          title: "אבחון מקצועי",
          text: "פגישת אבחון והתאמה אישית.",
        },
        {
          icon: "02",
          title: "טיפול מתקדם",
          text: "תהליך מקצועי ומדויק.",
        },
        {
          icon: "03",
          title: "מעקב אישי",
          text: "ליווי והמשכיות לאחר הטיפול.",
        },
      ],
    })
  ),

  template(
    "store-premium-commerce",
    "Premium Store",
    "חנויות",
    "תבנית חנות מלאה עם מוצרים, סליקה ומועדון לקוחות",
    images.store,
    storePage()
  ),

  template(
    "service-pro-leads",
    "Service Pro",
    "נותני שירות",
    "אתר מקצועי לנותני שירות עם לידים, שירותים ותורים",
    images.business,
    baseBusinessPage({
      logo: "P",
      brandTitle: "Business Pro",
      brandSubtitle: "נותן שירות מקצועי",
      navLinks: ["בית", "שירותים", "לקוחות", "צור קשר"],
      heroKicker: "עסק מקצועי",
      heroTitle: "אתר עסקי שמביא לקוחות",
      heroText: "לידים, תיאום תורים, שירותים ומעקב CRM — במקום אחד.",
      heroImage: images.business,
      includeBooking: true,
      services: [
        {
          icon: "✦",
          title: "שירות ראשון",
          text: "תיאור קצר של השירות.",
        },
        {
          icon: "✦",
          title: "שירות שני",
          text: "תיאור קצר של השירות.",
        },
        {
          icon: "✦",
          title: "שירות שלישי",
          text: "תיאור קצר של השירות.",
        },
      ],
    })
  ),

  template(
    "restaurant-modern",
    "Restaurant Modern",
    "מסעדות ואוכל",
    "תבנית מודרנית למסעדות, בתי קפה וקייטרינג",
    images.food,
    baseBusinessPage({
      logo: "R",
      brandTitle: "Restaurant",
      brandSubtitle: "חוויה קולינרית",
      navLinks: ["בית", "תפריט", "אירועים", "הזמנות", "צור קשר"],
      heroKicker: "מסעדה · אירועים · משלוחים",
      heroTitle: "חוויה קולינרית שנראית מעולה כבר באתר",
      heroText: "הציגו תפריט, מנות, הזמנות, אירועים ויצירת קשר.",
      heroImage: images.food,
      includeBooking: false,
      includeClub: true,
      services: [
        {
          icon: "🍽",
          title: "מנה ראשונה",
          text: "תיאור קצר ומגרה.",
          price: "₪68",
        },
        {
          icon: "🔥",
          title: "מנה עיקרית",
          text: "תיאור קצר ומגרה.",
          price: "₪118",
        },
        {
          icon: "★",
          title: "קינוח",
          text: "תיאור קצר ומגרה.",
          price: "₪48",
        },
      ],
    })
  ),

  template(
    "coach-modern",
    "Coach Modern",
    "מאמנים ויועצים",
    "תבנית אישית למאמנים, יועצים ומנטורים",
    images.coach,
    baseBusinessPage({
      logo: "M",
      brandTitle: "Mentor Pro",
      brandSubtitle: "ליווי אישי ועסקי",
      navLinks: ["בית", "תהליך", "המלצות", "תיאום שיחה"],
      heroKicker: "ליווי מקצועי",
      heroTitle: "להתקדם עם תהליך ברור ומדויק",
      heroText: "אתר שמציג מומחיות, תהליך, המלצות וטופס לידים.",
      heroImage: images.coach,
      includeBooking: true,
      services: [
        {
          icon: "1",
          title: "שיחת היכרות",
          text: "מגדירים מטרות וצורך.",
        },
        {
          icon: "2",
          title: "תוכנית פעולה",
          text: "בונים תהליך מותאם.",
        },
        {
          icon: "3",
          title: "ליווי ומעקב",
          text: "מתקדמים צעד אחרי צעד.",
        },
      ],
    })
  ),

  template(
    "fitness-premium",
    "Fitness Premium",
    "כושר ובריאות",
    "תבנית למאמני כושר, סטודיו, פילאטיס ואימונים אישיים",
    images.fitness,
    baseBusinessPage({
      logo: "F",
      brandTitle: "Fitness Pro",
      brandSubtitle: "אימונים אישיים וסטודיו",
      navLinks: ["בית", "אימונים", "תוכניות", "תורים", "צור קשר"],
      heroKicker: "כושר · בריאות · תוצאות",
      heroTitle: "להרגיש חזקים יותר, בכל שבוע מחדש",
      heroText: "תיאום אימונים, תוכניות אישיות, מעקב לקוחות ולידים.",
      heroImage: images.fitness,
      includeBooking: true,
      services: [
        {
          icon: "💪",
          title: "אימון אישי",
          text: "אימון מותאם אישית לפי מטרה.",
          price: "₪180",
        },
        {
          icon: "⚡",
          title: "תוכנית חודשית",
          text: "ליווי קבוע ומעקב התקדמות.",
          price: "₪650",
        },
        {
          icon: "★",
          title: "ייעוץ ראשוני",
          text: "פגישת התאמה ובניית מטרות.",
          price: "₪120",
        },
      ],
    })
  ),

  template(
    "event-production",
    "Event Production",
    "אירועים והפקות",
    "תבנית לאולמות, מפיקי אירועים וספקים",
    images.event,
    baseBusinessPage({
      logo: "E",
      brandTitle: "Event Studio",
      brandSubtitle: "הפקות ואירועים",
      navLinks: ["בית", "שירותים", "גלריה", "חבילות", "צור קשר"],
      heroKicker: "אירועים · עיצוב · הפקה",
      heroTitle: "אירועים שנראים מדויק מהפרט הראשון",
      heroText: "הציגו חבילות, גלריה, המלצות וטופס לידים להפקות.",
      heroImage: images.event,
      includeBooking: false,
      services: [
        {
          icon: "✦",
          title: "הפקת אירוע",
          text: "ניהול מלא של האירוע מתחילתו ועד סופו.",
        },
        {
          icon: "♛",
          title: "עיצוב קונספט",
          text: "עיצוב חוויה ויזואלית מותאמת.",
        },
        {
          icon: "✓",
          title: "ניהול ספקים",
          text: "תיאום וניהול ספקים מקצועי.",
        },
      ],
    })
  ),

  template(
    "real-estate-modern",
    "Real Estate Modern",
    "נדלן",
    "תבנית למתווכים, יועצי נדלן ונכסים",
    images.realEstate,
    baseBusinessPage({
      logo: "R",
      brandTitle: "Real Estate Pro",
      brandSubtitle: "נדלן ונכסים",
      navLinks: ["בית", "נכסים", "אודות", "המלצות", "צור קשר"],
      heroKicker: "נכסים · ייעוץ · מכירה",
      heroTitle: "מציגים נכסים בצורה שמוכרת יותר",
      heroText: "אתר מקצועי עם לידים, גלריה, נכסים והמלצות.",
      heroImage: images.realEstate,
      includeBooking: false,
      services: [
        {
          icon: "⌂",
          title: "שיווק נכס",
          text: "הצגת נכס בצורה מקצועית ומכירתית.",
        },
        {
          icon: "₪",
          title: "הערכת מחיר",
          text: "ייעוץ והערכת שווי ראשונית.",
        },
        {
          icon: "✦",
          title: "ליווי עסקה",
          text: "ליווי מלא עד סגירה.",
        },
      ],
    })
  ),

  template(
    "creative-studio",
    "Creative Studio",
    "קריאייטיב ועיצוב",
    "תבנית לצלמים, מעצבים, סטודיו ויוצרי תוכן",
    images.creative,
    baseBusinessPage({
      logo: "C",
      brandTitle: "Creative Studio",
      brandSubtitle: "עיצוב, צילום וקריאייטיב",
      navLinks: ["בית", "פורטפוליו", "שירותים", "לקוחות", "צור קשר"],
      heroKicker: "Creative · Design · Studio",
      heroTitle: "פורטפוליו שנראה כמו מותג פרימיום",
      heroText: "הציגו עבודות, שירותים, לקוחות וטופס פנייה.",
      heroImage: images.creative,
      includeBooking: false,
      services: [
        {
          icon: "✦",
          title: "עיצוב מותג",
          text: "שפה ויזואלית מלאה לעסק.",
        },
        {
          icon: "▧",
          title: "צילום תוכן",
          text: "תוכן ויזואלי לרשתות ולאתר.",
        },
        {
          icon: "↗",
          title: "קמפיין קריאייטיב",
          text: "רעיון, עיצוב וביצוע.",
        },
      ],
    })
  ),

  template(
    "landing-page-sale",
    "Landing Page Sale",
    "דפי נחיתה",
    "דף נחיתה ממיר למבצע, שירות או השקה",
    images.office,
    landingPage()
  ),

  template(
    "minimal-onepage",
    "Minimal One Page",
    "כללי",
    "תבנית מינימליסטית, נקייה ומהירה לעריכה",
    images.office,
    `
<div class="biz-page">
  ${navHtml({
    logo: "B",
    title: "שם העסק",
    subtitle: "תחום העסק",
    links: ["בית", "אודות", "צור קשר"],
  })}

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
      <p class="biz-section-text">
        כאן אפשר לערוך טקסט, צבעים, רקע, תמונות, כפתורים וסקשנים.
      </p>
    </div>
  </section>
</div>
`
  ),

  template(
    "dark-premium",
    "Dark Premium",
    "פרימיום",
    "תבנית כהה, דרמטית ומודרנית",
    images.business,
    `
<div class="biz-page">
  <section class="biz-section">
    <div class="biz-dark-section">
      <div class="biz-split">
        <div>
          <p class="biz-pill">Premium</p>
          <h1 class="biz-section-title" style="color:#fff;text-align:right;">
            אתר עסקי יוקרתי
          </h1>
          <p class="biz-card-text" style="color:rgba(255,255,255,0.72);font-size:18px;">
            תבנית כהה ומודרנית לעסק שרוצה להתבלט.
          </p>
          <div class="biz-actions">
            <a class="biz-btn biz-btn-primary">התחלה</a>
            <a class="biz-btn biz-btn-secondary">צור קשר</a>
          </div>
        </div>

        <div class="biz-booking-box">
          <h3 class="biz-card-title">הצעה מיוחדת</h3>
          <p class="biz-card-text">הציגו מסר מרכזי, שירות מוביל או מבצע.</p>
          <a class="biz-btn biz-btn-primary" style="margin-top:22px;">אני רוצה להתחיל</a>
        </div>
      </div>
    </div>
  </section>

  ${servicesGridHtml({
    kicker: "מה מקבלים",
    title: "מבנה פרימיום לעסק שלך",
    services: [
      {
        icon: "✦",
        title: "עיצוב יוקרתי",
        text: "מראה מקצועי ומרשים.",
      },
      {
        icon: "✓",
        title: "הנעה לפעולה",
        text: "כפתורים וטפסים שמובילים לפנייה.",
      },
      {
        icon: "★",
        title: "אמון לקוחות",
        text: "ביקורות, שירותים ופרטים ברורים.",
      },
    ],
  })}

  ${leadFormHtml({ dark: true })}
</div>
`
  ),
];