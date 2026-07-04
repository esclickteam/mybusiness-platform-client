import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=90",
  heroSmall:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=90",
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
<header data-section-kind="header" data-section-title="Header" class="chanel-header">
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

function treatmentTickerHtml() {
  const items = [
    "עיסוי עמוק",
    "טיפול פנים",
    "ארומתרפיה",
    "הרפיה",
    "פילינג גוף",
    "וולנס",
    "זוהר טבעי",
    "טיפוח",
    "עיסוי עמוק",
    "טיפול פנים",
    "ארומתרפיה",
    "הרפיה",
    "פילינג גוף",
    "וולנס",
    "זוהר טבעי",
    "טיפוח",
  ];

  return `
<section data-section-kind="marquee" data-section-title="Treatments Ticker" class="chanel-ticker">
  <div class="chanel-ticker-track">
    ${items
      .map(
        (item) => `
      <div class="chanel-ticker-item">
        <span data-gjs-type="text">${item}</span>
        <i></i>
      </div>
    `,
      )
      .join("")}
  </div>
</section>
`;
}

function imageTickerHtml() {
  return `
<section data-section-kind="image-ticker" data-section-title="Image Ticker" class="chanel-image-ticker">
  <div class="chanel-image-ticker-track">
    ${[...galleryImages, ...galleryImages, ...galleryImages]
      .map(
        (image, index) => `
      <div class="chanel-image-ticker-item ${index % 2 === 0 ? "is-large" : ""}">
        <img data-gjs-type="image" src="${image}" alt="תמונת ספא ${index + 1}" />
      </div>
    `,
      )
      .join("")}
  </div>
</section>
`;
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

function processHtml() {
  const steps = [
    {
      number: "01",
      title: "ייעוץ והתאמה",
      text: "מתחילים בהבנת הצורך, סוג העור, מצב הגוף והתחושה שתרצו לקבל בסיום הטיפול.",
    },
    {
      number: "02",
      title: "הכנה ורוגע",
      text: "מכינים את הגוף והעור לטיפול, יוצרים אווירה שקטה ומתחילים בהורדת עומס.",
    },
    {
      number: "03",
      title: "טיפול מקצועי",
      text: "הטיפול עצמו מתבצע בקצב רגוע, עם מוצרים איכותיים ותשומת לב מלאה.",
    },
    {
      number: "04",
      title: "זוהר והתחדשות",
      text: "מסיימים בתחושת רעננות, איזון ורוגע, עם המלצות להמשך טיפוח בבית.",
    },
  ];

  return steps
    .map(
      (step) => `
<article class="chanel-process-card">
  <span data-gjs-type="text">${step.number}</span>
  <h3 data-gjs-type="text">${step.title}</h3>
  <p data-gjs-type="text">${step.text}</p>
</article>`,
    )
    .join("\n");
}

function teamHtml() {
  return chanelTeam
    .map(
      (member) => `
<article data-section-kind="team-card" data-section-title="${member.name}" class="chanel-team-card">
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
<article class="chanel-price-row">
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

function faqHtml() {
  return chanelFaq
    .map(
      (item, index) => `
<details class="chanel-faq-item" ${index === 0 ? "open" : ""}>
  <summary data-gjs-type="text">
    ${String(index + 1).padStart(2, "0")}. ${item.question}
  </summary>
  <p data-gjs-type="text">${item.answer}</p>
</details>`,
    )
    .join("\n");
}

function blogsHtml() {
  return chanelBlogs
    .map(
      (blog) => `
<article class="chanel-blog-card">
  <div>
    <img data-gjs-type="image" src="${blog.image}" alt="${blog.title}" />
  </div>

  <div class="chanel-blog-content">
    <span data-gjs-type="text">${blog.category}</span>
    <h3 data-gjs-type="text">${blog.title}</h3>
    <p data-gjs-type="text">${blog.date} · ${blog.readTime}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" id="home" class="chanel-site">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section id="home" data-section-kind="hero" data-section-title="Hero" class="chanel-hero">
  <div class="chanel-hero-bg-one"></div>
  <div class="chanel-hero-bg-two"></div>

  <div class="chanel-container chanel-hero-grid">
    <div class="chanel-hero-content">
      <p data-gjs-type="text" class="chanel-eyebrow">ספא • טיפוח • וולנס</p>

      <h1 data-gjs-type="text">
        חוויית ספא שמרגיעה את הגוף והנפש.
      </h1>

      <p data-gjs-type="text" class="chanel-hero-text">
        טיפולי ספא יוקרתיים, עיסויים, טיפולי פנים וארומתרפיה באווירה רגועה, נקייה ומדויקת.
      </p>

      <div class="chanel-hero-actions">
        <a data-editable-link="true" href="#booking" class="chanel-primary-btn">קביעת תור</a>
        <a data-editable-link="true" href="#services" class="chanel-secondary-btn">לצפייה בטיפולים</a>
      </div>
    </div>

    <div class="chanel-hero-media">
      <div class="chanel-hero-main-image">
        <img data-gjs-type="image" src="${chanelImages.hero}" alt="חוויית ספא" />
      </div>

      <div class="chanel-hero-small-image">
        <img data-gjs-type="image" src="${chanelImages.heroSmall}" alt="טיפול פנים" />
      </div>

      <div class="chanel-hero-badge">
        <span data-gjs-type="text">רוגע</span>
        <span data-gjs-type="text">טיפוח</span>
        <span data-gjs-type="text">זוהר</span>
      </div>
    </div>
  </div>
</section>

${treatmentTickerHtml()}

<section id="about" data-section-kind="about" data-section-title="About" class="chanel-section chanel-about">
  <div class="chanel-container">
    <div class="chanel-section-head chanel-split-head">
      <div>
        <p data-gjs-type="text" class="chanel-eyebrow">אודות הספא</p>
        <h2 data-gjs-type="text">המסע שלך לרוגע פנימי מתחיל כאן.</h2>
      </div>

      <p data-gjs-type="text">
        חוויית ספא רגועה שמחברת בין טיפוח, מקצועיות ואווירה נעימה. כל טיפול מותאם אישית לגוף, לעור ולתחושה שתרצו לקבל.
      </p>
    </div>

    <div class="chanel-about-grid">
      <div class="chanel-about-main-image">
        <img data-gjs-type="image" src="${chanelImages.about}" alt="חדר ספא" />
      </div>

      <div class="chanel-about-side">
        <div class="chanel-about-card">
          <span>▶</span>
          <p data-gjs-type="text">
            אווירה שקטה, טיפול מקצועי ומוצרים איכותיים לחוויית טיפוח עמוקה ומרגיעה.
          </p>
        </div>

        <div class="chanel-stats-grid">
          <div class="chanel-stat-card">
            <strong data-gjs-type="text">96%</strong>
            <span data-gjs-type="text">לקוחות מרוצות</span>
          </div>

          <div class="chanel-stat-card">
            <strong data-gjs-type="text">24K</strong>
            <span data-gjs-type="text">טיפולים שבוצעו</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${imageTickerHtml()}

<section data-section-kind="process" data-section-title="Work Process" class="chanel-section chanel-process">
  <div class="chanel-container">
    <div class="chanel-section-head">
      <p data-gjs-type="text" class="chanel-eyebrow">תהליך העבודה</p>
      <h2 data-gjs-type="text">דרך פשוטה להגיע לרוגע, איזון וזוהר.</h2>
    </div>

    <div class="chanel-process-grid">
      ${processHtml()}
    </div>
  </div>
</section>

<section id="services" data-section-kind="services" data-section-title="Services" class="chanel-section chanel-services">
  <div class="chanel-container">
    <div class="chanel-section-head chanel-split-head">
      <div>
        <p data-gjs-type="text" class="chanel-eyebrow">הטיפולים שלנו</p>
        <h2 data-gjs-type="text">טיפולי וולנס מרגיעים בעיצוב יוקרתי.</h2>
      </div>

      <a data-editable-link="true" href="#booking" class="chanel-primary-btn">קביעת תור</a>
    </div>

    <div class="chanel-services-grid">
      ${servicesHtml()}
    </div>
  </div>
</section>

<section id="team" data-section-kind="team" data-section-title="Team" class="chanel-section chanel-team">
  <div class="chanel-container">
    <div class="chanel-section-head chanel-center">
      <p data-gjs-type="text" class="chanel-eyebrow">הצוות שלנו</p>
      <h2 data-gjs-type="text">מומחיות ספא וטיפוח.</h2>
    </div>

    <div class="chanel-team-grid">
      ${teamHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Prices" class="chanel-section chanel-prices">
  <div class="chanel-container">
    <div class="chanel-prices-grid">
      <div class="chanel-prices-title">
        <p data-gjs-type="text" class="chanel-eyebrow">מחירון</p>
        <h2 data-gjs-type="text">מחירים ברורים לטיפולי ספא.</h2>
        <p data-gjs-type="text">
          בחרי את הטיפול שמתאים לגוף, לעור ולתחושה שלך. אפשר לשלב כמה טיפולים באותו ביקור.
        </p>
      </div>

      <div class="chanel-prices-list">
        ${pricesHtml()}
      </div>
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="chanel-section chanel-testimonials">
  <div class="chanel-container chanel-testimonials-grid">
    <div>
      <p data-gjs-type="text" class="chanel-eyebrow">לקוחות מספרות</p>
      <h2 data-gjs-type="text">החוויה מדברת דרך הלקוחות.</h2>
    </div>

    <div class="chanel-testimonial-card">
      <p data-gjs-type="text">
        “הגעתי אחרי שבוע עמוס ויצאתי רגועה לגמרי. המקום מהמם, השירות אישי והטיפול היה מדויק.”
      </p>

      <div>
        <img data-gjs-type="image" src="${chanelImages.team2}" alt="לקוחה מרוצה" />
        <div>
          <strong data-gjs-type="text">עמית לוי</strong>
          <span data-gjs-type="text">לקוחה קבועה</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section data-section-kind="faq" data-section-title="FAQ" class="chanel-section chanel-faq">
  <div class="chanel-container chanel-faq-grid">
    <div>
      <p data-gjs-type="text" class="chanel-eyebrow">שאלות נפוצות</p>
      <h2 data-gjs-type="text">לפני שקובעים תור.</h2>

      <div class="chanel-faq-image">
        <img data-gjs-type="image" src="${chanelImages.aboutSmall}" alt="שאלות נפוצות ספא" />
      </div>
    </div>

    <div class="chanel-faq-list">
      ${faqHtml()}
    </div>
  </div>
</section>

<section id="booking" data-section-kind="booking" data-section-title="Booking" class="chanel-section chanel-booking">
  <div class="chanel-container chanel-booking-grid">
    <div>
      <p data-gjs-type="text" class="chanel-eyebrow">קביעת תור</p>
      <h2 data-gjs-type="text">בחרי טיפול ושלחי בקשה לתור הבא שלך.</h2>
      <p data-gjs-type="text">
        אפשר להחליף את הטופס הזה בהמשך ליומן האמיתי של ביזאפלי עם שעות פנויות.
      </p>
    </div>

    <form class="chanel-form">
      <div class="chanel-form-grid">
        <input placeholder="שם מלא" />
        <input placeholder="טלפון" />
        <input placeholder="תאריך מועדף" />
        <input placeholder="שעה מועדפת" />
      </div>

      <select>
        <option>בחירת טיפול</option>
        <option>עיסוי עמוק</option>
        <option>טיפול פנים זוהר</option>
        <option>עיסוי ארומתרפי</option>
        <option>טיפול הרפיה</option>
      </select>

      <textarea placeholder="הודעה / בקשה מיוחדת"></textarea>

      <button type="button">שליחת בקשה</button>
    </form>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="chanel-section chanel-contact">
  <div class="chanel-container chanel-contact-grid">
    <form class="chanel-contact-form">
      <p data-gjs-type="text" class="chanel-eyebrow">צור קשר</p>
      <h2 data-gjs-type="text">רוצה לשאול משהו לפני קביעת תור?</h2>
      <p data-gjs-type="text">
        אפשר לשלוח הודעה לגבי טיפול, זמינות, חבילות ספא או התאמת טיפול.
      </p>

      <div class="chanel-form-grid">
        <input placeholder="שם מלא" />
        <input placeholder="טלפון" />
      </div>

      <input placeholder="אימייל" />
      <textarea placeholder="כתבי כאן את ההודעה שלך"></textarea>

      <button type="button">שליחת הודעה</button>
    </form>

    <div class="chanel-contact-image">
      <img data-gjs-type="image" src="${chanelImages.contact}" alt="יצירת קשר ספא" />
    </div>
  </div>
</section>

<section data-section-kind="blog" data-section-title="Blog" class="chanel-section chanel-blog">
  <div class="chanel-container">
    <div class="chanel-section-head chanel-split-head">
      <div>
        <p data-gjs-type="text" class="chanel-eyebrow">בלוג</p>
        <h2 data-gjs-type="text">טיפים ליופי, וולנס ורוגע.</h2>
      </div>
    </div>

    <div class="chanel-blog-grid">
      ${blogsHtml()}
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
    "תבנית ספא/ביוטי יוקרתית בעברית עם Hero גדול, תנועה, טיקר טיפולים, שירותים, צוות, מחירון, FAQ וטופס קביעת תור.",
  image: chanelImages.hero,
  thumbnail: chanelImages.hero,

  heroTitle: "חוויית ספא שמרגיעה את הגוף והנפש",
  heroSubtitle:
    "ספא יוקרתי לטיפולי פנים, עיסויים, ארומתרפיה וחוויית וולנס רגועה ומדויקת.",
  businessName: "Chanel Spa",

  colors: {
    primary: "#2B1B15",
    secondary: "#7B5F52",
    accent: "#C8977A",
    background: "#FBF4EE",
    surface: "#FFFFFF",
    text: "#2B1B15",
    muted: "#8D756B",
    dark: "#1B100C",
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
      variant: "chanel-hero",
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