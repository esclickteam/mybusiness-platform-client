import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=90",
  heroSmall:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90",
  about:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=90",
  aboutSmall:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=90",
  process1:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=90",
  process2:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=90",
  service1:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=90",
  service2:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90",
  service3:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=90",
  service4:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=90",
  team1:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=90",
  team2:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=90",
  team3:
    "https://images.unsplash.com/photo-1614289371518-722f2615943d?auto=format&fit=crop&w=900&q=90",
  contact:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=90",
  blog1:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=90",
  blog2:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=90",
  blog3:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=90",
};

export const chanelServices = [
  {
    title: "עיסוי עמוק",
    price: "₪120",
    text:
      "עיסוי עמוק לשחרור שרירים תפוסים, שיפור זרימת הדם, הפחתת עומס והחזרת תחושת איזון ורוגע לגוף.",
    image: chanelImages.service1,
  },
  {
    title: "טיפול פנים זוהר",
    price: "₪180",
    text:
      "טיפול פנים מנקה ומזין שמחזיר לעור מראה רענן, חלק, נקי וזוהר באופן טבעי.",
    image: chanelImages.service2,
  },
  {
    title: "עיסוי ארומתרפי",
    price: "₪140",
    text:
      "עיסוי בשמנים טבעיים להרגעת הגוף והנפש, הפחתת מתח ושיפור תחושת הרוגע הכללית.",
    image: chanelImages.service3,
  },
  {
    title: "טיפול הרפיה",
    price: "₪150",
    text:
      "טיפול מרגיע להפחתת סטרס, שחרור הגוף, איזון פנימי ותחושת שלווה עמוקה.",
    image: chanelImages.service4,
  },
];

export const chanelPrices = [
  {
    number: "01",
    title: "עיסוי הרפיה",
    text: "מרגיע את הגוף, משחרר מתח ומחזיר תחושת שלווה",
    price: "₪120",
    image: chanelImages.service1,
  },
  {
    number: "02",
    title: "עיסוי שוודי",
    text: "מרפה שרירים, מפחית עומס ומשפר תחושה כללית",
    price: "₪150",
    image: chanelImages.service3,
  },
  {
    number: "03",
    title: "טיפול ארומתרפי",
    text: "שמנים טבעיים להרגעת הגוף והנפש",
    price: "₪140",
    image: chanelImages.blog1,
  },
  {
    number: "04",
    title: "טיפול פנים",
    text: "ניקוי, הזנה והחזרת זוהר טבעי לעור",
    price: "₪180",
    image: chanelImages.service2,
  },
  {
    number: "05",
    title: "פילינג גוף",
    text: "הסרת תאים מתים, ריכוך והחלקת העור",
    price: "₪110",
    image: chanelImages.aboutSmall,
  },
];

export const chanelTeam = [
  {
    name: "סופיה מיטשל",
    role: "מטפלת ספא",
    image: chanelImages.team1,
  },
  {
    name: "הארפר קולינס",
    role: "מומחית להרפיה",
    image: chanelImages.team3,
  },
  {
    name: "מיה תומפסון",
    role: "מומחית לעיסוי",
    image: chanelImages.team2,
  },
];

export const chanelFaq = [
  {
    question: "אילו טיפולים קיימים בספא?",
    answer:
      "אנחנו מציעים עיסויים, טיפולי פנים, טיפולי גוף, ארומתרפיה וטיפולי הרפיה שמיועדים להחזיר לגוף ולנפש תחושת רוגע ורעננות.",
  },
  {
    question: "איך קובעים תור?",
    answer:
      "אפשר לקבוע תור דרך טופס ההזמנה באתר, דרך היומן של ביזאפלי או באמצעות יצירת קשר ישירה עם הספא.",
  },
  {
    question: "האם אתם משתמשים במוצרים טבעיים?",
    answer:
      "כן. הטיפולים מבוססים על מוצרים איכותיים ונעימים לעור, שמתאימים לחוויית ספא רגועה ובטוחה.",
  },
  {
    question: "מה קורה בביקור הראשון?",
    answer:
      "בביקור הראשון נכיר את ההעדפות שלך, נבין איזה טיפול מתאים לך ונלווה אותך לאורך כל החוויה.",
  },
  {
    question: "אפשר לקבוע תור אונליין?",
    answer:
      "כן. אפשר להשאיר בקשה דרך הטופס, ובהמשך לחבר את זה ליומן האמיתי של ביזאפלי עם שעות פנויות.",
  },
];

export const chanelBlogs = [
  {
    category: "יופי וזוהר",
    title: "איך עיסוי מקצועי עוזר להפחית עומס בגוף",
    date: "24 במאי 2026",
    readTime: "5 דקות קריאה",
    image: chanelImages.blog1,
  },
  {
    category: "וולנס וטיפוח",
    title: "היתרונות של ארומתרפיה להרגעת הגוף והנפש",
    date: "24 במאי 2026",
    readTime: "5 דקות קריאה",
    image: chanelImages.blog2,
  },
  {
    category: "טיפולי ספא",
    title: "איך טיפולי ספא תורמים לאיזון, רוגע וזוהר טבעי",
    date: "24 במאי 2026",
    readTime: "9 דקות קריאה",
    image: chanelImages.blog3,
  },
];

const galleryImages = [
  chanelImages.hero,
  chanelImages.heroSmall,
  chanelImages.about,
  chanelImages.aboutSmall,
  chanelImages.process1,
  chanelImages.process2,
  chanelImages.service2,
  chanelImages.service3,
  chanelImages.contact,
];

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="chanel-header chanel-home-header">
  <div class="chanel-nav-wrap">
    <a data-gjs-type="text" data-editable-link="true" href="#home" class="chanel-logo">
      Chanel
    </a>

    <nav class="chanel-nav">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#about">אודות</a>
      <a data-editable-link="true" href="#services">טיפולים</a>
      <a data-editable-link="true" href="#prices">מחירים</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-editable-link="true" href="#booking" class="chanel-nav-btn">
      קביעת תור
    </a>
  </div>
</header>
`;
}

function footerHtml() {
  return `
<footer data-section-kind="footer" data-section-title="Footer" class="chanel-footer">
  <div class="chanel-footer-gallery">
    ${[...galleryImages, ...galleryImages]
      .map(
        (image) => `
        <div class="chanel-footer-ticker-item">
          <img data-gjs-type="image" src="${image}" alt="גלריית ספא" />
          <span>↗</span>
        </div>
      `,
      )
      .join("")}
  </div>

  <div class="chanel-container chanel-footer-main">
    <div>
      <h2 data-gjs-type="text" class="chanel-footer-title">הצטרפו לניוזלטר שלנו.</h2>

      <div class="chanel-newsletter">
        <input placeholder="כתובת אימייל" />
        <button type="button">הרשמה</button>
      </div>
    </div>

    <div class="chanel-footer-grid">
      <div>
        <p data-gjs-type="text" class="chanel-footer-heading">ניווט</p>
        <a data-editable-link="true" href="#about">אודות</a>
        <a data-editable-link="true" href="#services">טיפולים</a>
        <a data-editable-link="true" href="#team">צוות</a>
        <a data-editable-link="true" href="#contact">צור קשר</a>
      </div>

      <div>
        <p data-gjs-type="text" class="chanel-footer-heading">שעות פעילות</p>
        <p data-gjs-type="text">ראשון עד חמישי: 09:00–19:00</p>
        <p data-gjs-type="text">שישי: 09:00–14:00</p>
        <p data-gjs-type="text">שבת: סגור</p>
      </div>

      <div>
        <p data-gjs-type="text" class="chanel-footer-brand">Chanel</p>
        <p data-gjs-type="text">© כל הזכויות שמורות 2026</p>
        <p data-gjs-type="text">נבנה באמצעות BizUply</p>
      </div>
    </div>
  </div>
</footer>
`;
}

function teamHtml() {
  return chanelTeam
    .map(
      (member) => `
<article data-section-kind="team-card" data-section-title="${member.name}" class="chanel-team-card chanel-home-team-card">
  <div>
    <img data-gjs-type="image" src="${member.image}" alt="${member.name}" />
  </div>
  <h3 data-gjs-type="text">${member.name}</h3>
  <p data-gjs-type="text">${member.role}</p>
</article>`,
    )
    .join("\n");
}

function pricesHtml() {
  return chanelPrices
    .map(
      (item) => `
<article class="chanel-price-row chanel-home-price-row">
  <div class="chanel-price-number" data-gjs-type="text">(${item.number})</div>

  <div class="chanel-price-main">
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.text}</p>
  </div>

  <div class="chanel-price-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>

  <strong data-gjs-type="text">${item.price}</strong>
</article>`,
    )
    .join("\n");
}

function servicesHtml() {
  return chanelServices
    .map(
      (service, index) => `
<article data-section-kind="service-card" data-section-title="${service.title}" class="chanel-service-card">
  <div class="chanel-service-image">
    <img data-gjs-type="image" src="${service.image}" alt="${service.title}" />
  </div>

  <div class="chanel-service-content">
    <div class="chanel-service-top">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${service.price}</strong>
    </div>

    <h3 data-gjs-type="text">${service.title}</h3>
    <p data-gjs-type="text">${service.text}</p>

    <a data-editable-link="true" href="#booking">
      לפרטי הטיפול
      <span>↗</span>
    </a>
  </div>
</article>`,
    )
    .join("\n");
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" id="home" class="chanel-site chanel-home-site">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section id="home" data-section-kind="hero" data-section-title="Hero" class="chanel-home-hero">
  <div class="chanel-home-hero-bg">
    <img data-gjs-type="image" src="${chanelImages.heroSmall}" alt="ספא יוקרתי" />
  </div>

  <div class="chanel-home-hero-overlay"></div>

  <div class="chanel-home-hero-inner">
    <div class="chanel-home-hero-content">
      <p data-gjs-type="text" class="chanel-home-eyebrow">טיפול • רוגע • זוהר</p>

      <h1 data-gjs-type="text">
        חוויית ספא שמחזירה לגוף ולנפש את השקט.
      </h1>

      <p data-gjs-type="text">
        טיפולי פנים, עיסויים, ארומתרפיה וטיפולי וולנס באווירה יוקרתית, רגועה ומדויקת.
      </p>

      <a data-editable-link="true" href="#booking" class="chanel-home-red-btn">
        קביעת תור
      </a>
    </div>
  </div>
</section>

<section id="about" class="chanel-home-intro" data-section-kind="about" data-section-title="Intro">
  <div class="chanel-home-intro-line"></div>

  <div class="chanel-container chanel-home-intro-grid">
    <div class="chanel-home-intro-title">
      <p data-gjs-type="text" class="chanel-home-small-label">אודות</p>

      <h2 data-gjs-type="text">
        המסע שלך לרוגע פנימי מתחיל כאן עם טיפולים מרגיעים, טיפול מקצועי וחוויית ספא יוקרתית.
      </h2>
    </div>

    <div class="chanel-home-intro-card">
      <div class="chanel-home-intro-image">
        <img data-gjs-type="image" src="${chanelImages.aboutSmall}" alt="טיפול ספא" />
      </div>

      <div class="chanel-home-intro-text-card">
        <p data-gjs-type="text">
          כאן כל טיפול מותאם אישית לגוף, לעור ולתחושה שתרצי לקבל בסוף החוויה.
        </p>

        <div class="chanel-home-stats">
          <div>
            <strong data-gjs-type="text">₪74K</strong>
            <span data-gjs-type="text">טיפולים ושירותים</span>
          </div>

          <div>
            <strong data-gjs-type="text">96%</strong>
            <span data-gjs-type="text">לקוחות מרוצות</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="chanel-home-logo-row">
    <span data-gjs-type="text">Apsora</span>
    <span data-gjs-type="text">Wellness</span>
    <span data-gjs-type="text">Beauty</span>
    <span data-gjs-type="text">Relax</span>
    <span data-gjs-type="text">Glow</span>
  </div>
</section>

<section class="chanel-home-process" data-section-kind="process" data-section-title="Process">
  <div class="chanel-container">
    <div class="chanel-home-section-title">
      <p data-gjs-type="text" class="chanel-home-small-label">תהליך העבודה</p>
      <h2 data-gjs-type="text">דרך פשוטה להגיע לרוגע, איזון וזוהר.</h2>
    </div>

    <div class="chanel-home-process-layout">
      <div class="chanel-home-process-card card-one">
        <span data-gjs-type="text">01</span>
        <h3 data-gjs-type="text">ייעוץ והתאמה</h3>
        <p data-gjs-type="text">
          נבין מה הגוף והעור צריכים ונבחר טיפול שמתאים בדיוק לחוויה הרצויה.
        </p>
      </div>

      <div class="chanel-home-process-image image-one">
        <img data-gjs-type="image" src="${chanelImages.service2}" alt="טיפול פנים" />
      </div>

      <div class="chanel-home-process-card card-two">
        <span data-gjs-type="text">02</span>
        <h3 data-gjs-type="text">הכנה ורוגע</h3>
        <p data-gjs-type="text">
          מכינים את העור והגוף לטיפול, באווירה שקטה שמורידה עומס ומתח.
        </p>
      </div>

      <div class="chanel-home-process-image image-two">
        <img data-gjs-type="image" src="${chanelImages.about}" alt="חדר ספא" />
      </div>

      <div class="chanel-home-process-card card-three">
        <span data-gjs-type="text">03</span>
        <h3 data-gjs-type="text">טיפול מקצועי</h3>
        <p data-gjs-type="text">
          טיפול מדויק, רגוע ונעים עם מוצרים איכותיים ותשומת לב לפרטים הקטנים.
        </p>
      </div>
    </div>
  </div>
</section>

<section id="services" class="chanel-home-services" data-section-kind="services" data-section-title="Services">
  <div class="chanel-container">
    <div class="chanel-home-services-head">
      <p data-gjs-type="text" class="chanel-home-small-label">הטיפולים שלנו</p>
      <h2 data-gjs-type="text">טיפולי וולנס מרגיעים בעיצוב יוקרתי.</h2>
    </div>

    <div class="chanel-home-service-showcase">
      <article class="chanel-home-service-card is-active">
        <div class="chanel-home-service-image">
          <img data-gjs-type="image" src="${chanelImages.service2}" alt="טיפול פנים" />
        </div>

        <div class="chanel-home-service-info">
          <h3 data-gjs-type="text">טיפול פנים זוהר</h3>
          <p data-gjs-type="text">
            טיפול פנים מנקה ומזין שמחזיר לעור מראה רענן, חלק וזוהר.
          </p>

          <div class="chanel-home-care-list">
            <span data-gjs-type="text">ניקוי עמוק</span>
            <span data-gjs-type="text">הזנה לעור</span>
            <span data-gjs-type="text">מראה רענן</span>
            <span data-gjs-type="text">זוהר טבעי</span>
          </div>

          <div class="chanel-home-service-bottom">
            <strong data-gjs-type="text">₪180</strong>
            <a data-editable-link="true" href="#booking">קביעת תור</a>
          </div>
        </div>
      </article>

      <article class="chanel-home-service-card">
        <div class="chanel-home-service-image">
          <img data-gjs-type="image" src="${chanelImages.service1}" alt="עיסוי עמוק" />
        </div>

        <div class="chanel-home-service-info">
          <h3 data-gjs-type="text">עיסוי עמוק</h3>
          <p data-gjs-type="text">
            טיפול לשחרור שרירים תפוסים, הורדת עומס והחזרת תחושת קלילות.
          </p>

          <div class="chanel-home-care-list">
            <span data-gjs-type="text">שחרור שרירים</span>
            <span data-gjs-type="text">הפחתת עומס</span>
            <span data-gjs-type="text">רוגע לגוף</span>
            <span data-gjs-type="text">איזון פנימי</span>
          </div>

          <div class="chanel-home-service-bottom">
            <strong data-gjs-type="text">₪120</strong>
            <a data-editable-link="true" href="#booking">קביעת תור</a>
          </div>
        </div>
      </article>

      <article class="chanel-home-service-card">
        <div class="chanel-home-service-image">
          <img data-gjs-type="image" src="${chanelImages.service3}" alt="ארומתרפיה" />
        </div>

        <div class="chanel-home-service-info">
          <h3 data-gjs-type="text">עיסוי ארומתרפי</h3>
          <p data-gjs-type="text">
            שמנים טבעיים להרגעת הגוף והנפש, שיפור התחושה והפחתת מתח.
          </p>

          <div class="chanel-home-care-list">
            <span data-gjs-type="text">שמנים טבעיים</span>
            <span data-gjs-type="text">רוגע נפשי</span>
            <span data-gjs-type="text">חוויית ספא</span>
            <span data-gjs-type="text">איזון</span>
          </div>

          <div class="chanel-home-service-bottom">
            <strong data-gjs-type="text">₪140</strong>
            <a data-editable-link="true" href="#booking">קביעת תור</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<section id="team" class="chanel-home-team" data-section-kind="team" data-section-title="Team">
  <div class="chanel-container">
    <div class="chanel-home-section-title">
      <p data-gjs-type="text" class="chanel-home-small-label">הצוות שלנו</p>
      <h2 data-gjs-type="text">מומחיות ספא וטיפוח.</h2>
    </div>

    <div class="chanel-home-team-grid">
      ${teamHtml()}
    </div>
  </div>
</section>

<section id="prices" class="chanel-home-pricing" data-section-kind="prices" data-section-title="Prices">
  <div class="chanel-container chanel-home-pricing-grid">
    <div>
      <p data-gjs-type="text" class="chanel-home-small-label">מחירון</p>
      <h2 data-gjs-type="text">מחירים ברורים לטיפולי ספא.</h2>
    </div>

    <div class="chanel-home-pricing-list">
      ${pricesHtml()}
    </div>
  </div>
</section>

<section class="chanel-home-testimonials" data-section-kind="testimonials" data-section-title="Testimonials">
  <div class="chanel-container">
    <div class="chanel-home-section-title">
      <p data-gjs-type="text" class="chanel-home-small-label">לקוחות מספרות</p>
      <h2 data-gjs-type="text">החוויה מדברת דרך הלקוחות.</h2>
    </div>

    <div class="chanel-home-testimonials-row">
      <article>
        <span data-gjs-type="text">חוות דעת</span>
        <h3 data-gjs-type="text">הגעתי אחרי שבוע עמוס ויצאתי רגועה לגמרי.</h3>
        <p data-gjs-type="text">עמית לוי</p>
      </article>

      <article>
        <span data-gjs-type="text">חוות דעת</span>
        <h3 data-gjs-type="text">העיצוב, הטיפול והשירות מרגישים ממש כמו ספא יוקרתי.</h3>
        <p data-gjs-type="text">שיר כהן</p>
      </article>

      <article>
        <span data-gjs-type="text">חוות דעת</span>
        <h3 data-gjs-type="text">הטיפול פנים היה מושלם והעור נראה זוהר כבר באותו יום.</h3>
        <p data-gjs-type="text">נועה רוזן</p>
      </article>
    </div>
  </div>
</section>
`);
}

export function createChanelSimplePageHtml(
  title: string,
  eyebrow: string,
  text: string,
  section: string,
) {
  return pageShell(`
<section data-section-kind="${section}" data-section-title="${title}" class="chanel-section chanel-simple-page">
  <div class="chanel-container chanel-simple-grid">
    <aside>
      <p data-gjs-type="text" class="chanel-eyebrow">${eyebrow}</p>
      <h1 data-gjs-type="text">${title}</h1>
      <p data-gjs-type="text">${text}</p>
    </aside>

    <main>
      <div class="chanel-services-grid">
        ${servicesHtml()}
      </div>
    </main>
  </div>
</section>
`);
}

export const chanelEditorPages = [
  {
    id: "home",
    slug: "/",
    title: "בית",
    type: "home",
    isHome: true,
    html: createChanelHomeHtml(),
    css: chanelEditorCss,
  },
  {
    id: "about",
    slug: "/about",
    title: "אודות",
    type: "about",
    html: createChanelSimplePageHtml(
      "אודות הספא",
      "אודות",
      "ספא יוקרתי לטיפולי פנים, עיסויים, הרפיה וחוויית וולנס רגועה ומדויקת.",
      "about",
    ),
    css: chanelEditorCss,
  },
  {
    id: "services",
    slug: "/services",
    title: "טיפולים",
    type: "services",
    html: createChanelSimplePageHtml(
      "הטיפולים שלנו",
      "טיפולים",
      "עיסוי עמוק, טיפול פנים, ארומתרפיה, טיפול הרפיה ופילינג גוף.",
      "services",
    ),
    css: chanelEditorCss,
  },
  {
    id: "gallery",
    slug: "/gallery",
    title: "גלריה",
    type: "gallery",
    html: createChanelSimplePageHtml(
      "גלריית ספא",
      "גלריה",
      "תמונות אווירה, טיפולים, מוצרי טיפוח וחוויית ספא רגועה.",
      "gallery",
    ),
    css: chanelEditorCss,
  },
  {
    id: "prices",
    slug: "/prices",
    title: "מחירים",
    type: "pricing",
    html: createChanelSimplePageHtml(
      "מחירון טיפולים",
      "מחירים",
      "מחירים ברורים לטיפולי ספא עם אפשרות לשלב כמה טיפולים באותו ביקור.",
      "prices",
    ),
    css: chanelEditorCss,
  },
  {
    id: "booking",
    slug: "/booking",
    title: "קביעת תור",
    type: "booking",
    html: createChanelSimplePageHtml(
      "קביעת תור",
      "קביעת תור",
      "בחירת טיפול, תאריך ושעה מועדפים ושליחת בקשה לתור.",
      "booking",
    ),
    css: chanelEditorCss,
  },
  {
    id: "contact",
    slug: "/contact",
    title: "צור קשר",
    type: "contact",
    html: createChanelSimplePageHtml(
      "צור קשר",
      "צור קשר",
      "שאלות, זמינות, חבילות ספא והתאמת טיפול אישי.",
      "contact",
    ),
    css: chanelEditorCss,
  },
];

export const chanelSeed = {
  id: "chanel",
  key: "chanel",
  rendererKey: "chanel",
  renderMode: "registry",
  editorMode: "renderer",

  name: "Chanel",
  category: "beauty",
  description:
    "תבנית ספא/ביוטי יוקרתית בעברית עם עמוד בית בסגנון Apsora, Hero גדול, תנועה, שירותים, צוות, מחירון והמלצות.",
  image: chanelImages.heroSmall,
  thumbnail: chanelImages.heroSmall,

  heroTitle: "חוויית ספא שמחזירה לגוף ולנפש את השקט",
  heroSubtitle:
    "ספא יוקרתי לטיפולי פנים, עיסויים, ארומתרפיה וחוויית וולנס רגועה ומדויקת.",
  businessName: "Chanel Spa",

  colors: {
    primary: "#2B1B15",
    secondary: "#7B5F52",
    accent: "#C85C68",
    background: "#FFF7F2",
    surface: "#FFFFFF",
    text: "#2B1B15",
    muted: "#8D756B",
    dark: "#171413",
  },

  editor: {
    slug: "chanel",
    activePageId: "home",
    css: chanelEditorCss,
    pages: chanelEditorPages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      type: page.type,
      isHome: Boolean(page.isHome),
      html: page.html,
      css: page.css || chanelEditorCss,
    })),
  },

  pages: chanelEditorPages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    type: page.type,
    isHome: Boolean(page.isHome),
    html: page.html,
    css: page.css || chanelEditorCss,
  })),

  blocks: [
    {
      id: "chanel-header",
      type: "header",
      variant: "chanel-luxury",
      title: "Header",
      html: navHtml(),
    },
    {
      id: "chanel-hero",
      type: "hero",
      variant: "chanel-apsora-home",
      title: "Hero",
      html: createChanelHomeHtml(),
    },
    {
      id: "chanel-footer",
      type: "footer",
      variant: "chanel-footer",
      title: "Footer",
      html: footerHtml(),
    },
  ],

  css: chanelEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;