import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=90",
  hero2:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=90",
  about:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=90",
  process1:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=90",
  process2:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=90",
  process3:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=90",
  therapy1:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=90",
  therapy2:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1100&q=90",
  therapy3:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1100&q=90",
  therapy4:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1100&q=90",
  specialist1:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=90",
  specialist2:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=90",
  specialist3:
    "https://images.unsplash.com/photo-1614289371518-722f2615943d?auto=format&fit=crop&w=900&q=90",
  specialist4:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90",
  faqMain:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=90",
  contact:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=90",
  blog1:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=90",
  blog2:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=90",
  blog3:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=90",
};

const treatments = [
  "עיסוי הרפיה",
  "טיפול פנים",
  "עיסוי עמוק",
  "עיסוי ארומתרפי",
  "טיפול וולנס",
  "פילינג גוף",
];

const partners = ["Bloom", "Serenity", "IPSUM", "Wellness", "Glow", "Care"];

export const chanelServices = [
  {
    title: "טיפול פנים מרגיע",
    text: "ניקוי עדין, הזנה ולחות לעור רענן וזוהר.",
    price: "₪180",
    time: "50 דקות",
    image: chanelImages.therapy1,
  },
  {
    title: "עיסוי עמוק",
    text: "שחרור שרירים תפוסים והפחתת עומס מהגוף.",
    price: "₪150",
    time: "60 דקות",
    image: chanelImages.therapy2,
  },
  {
    title: "ארומתרפיה",
    text: "שמנים טבעיים לחוויה רגועה ומאוזנת.",
    price: "₪140",
    time: "45 דקות",
    image: chanelImages.therapy3,
  },
  {
    title: "טקס הרפיה",
    text: "חוויה מלאה שמשלבת מגע, ריח ושקט.",
    price: "₪220",
    time: "75 דקות",
    image: chanelImages.therapy4,
  },
];

export const chanelPrices = [
  { number: "01", title: "עיסוי הרפיה", duration: "45 דקות", price: "₪120", image: chanelImages.therapy2 },
  { number: "02", title: "טיפול פנים", duration: "50 דקות", price: "₪180", image: chanelImages.therapy1 },
  { number: "03", title: "עיסוי ארומתרפי", duration: "60 דקות", price: "₪140", image: chanelImages.therapy3 },
  { number: "04", title: "טקס ספא זוגי", duration: "90 דקות", price: "₪320", image: chanelImages.therapy4 },
  { number: "05", title: "פילינג גוף", duration: "35 דקות", price: "₪110", image: chanelImages.process2 },
];

export const chanelTeam = [
  { name: "נועה ריד", role: "מומחית עיסוי", image: chanelImages.specialist1 },
  { name: "מאיה כהן", role: "מטפלת פנים", image: chanelImages.specialist2 },
  { name: "ליה דניאל", role: "מומחית וולנס", image: chanelImages.specialist3 },
  { name: "שירה לוי", role: "מטפלת ספא", image: chanelImages.specialist4 },
];

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="chanel-home-header">
  <div class="chanel-home-nav">
    <a data-gjs-type="text" data-editable-link="true" href="#home" class="chanel-home-logo">Chanel</a>

    <nav class="chanel-home-menu">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#about">אודות</a>
      <a data-editable-link="true" href="#services">טיפולים</a>
      <a data-editable-link="true" href="#prices">מחירים</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-editable-link="true" href="#booking" class="chanel-home-book-nav">קביעת תור</a>
  </div>
</header>`;
}

function treatmentTickerHtml() {
  return `
<section data-section-kind="ticker" data-section-title="Treatments ticker" class="chanel-ticker-strip">
  <div class="chanel-ticker-track">
    ${[...treatments, ...treatments, ...treatments]
      .map((item) => `<span data-gjs-type="text">${item}</span><b>✱</b>`)
      .join("")}
  </div>
</section>`;
}

function partnersHtml() {
  return `
<div class="chanel-partners-row">
  ${partners.map((item) => `<span data-gjs-type="text">${item}</span>`).join("")}
</div>`;
}

function processHtml() {
  const items = [
    { n: "01", title: "ייעוץ והתאמה", text: "מבינים את הגוף, העור והתחושה שאת רוצה לקבל.", image: chanelImages.process1 },
    { n: "02", title: "הכנה ורוגע", text: "כניסה לקצב רגוע, נשימה שקטה והכנת העור לטיפול.", image: chanelImages.process2 },
    { n: "03", title: "טיפול מדויק", text: "מגע מקצועי, מוצרים איכותיים ותשומת לב לפרטים.", image: chanelImages.process3 },
  ];

  return items
    .map(
      (item) => `
<article class="chanel-process-card">
  <div class="chanel-process-text">
    <span data-gjs-type="text">STEP - ${item.n}</span>
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.text}</p>
  </div>
  <div class="chanel-process-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>
</article>`,
    )
    .join("");
}

function servicesHtml() {
  return chanelServices
    .map(
      (item) => `
<article class="chanel-therapy-card">
  <div class="chanel-therapy-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>
  <div class="chanel-therapy-content">
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.text}</p>
    <div class="chanel-therapy-meta">
      <span data-gjs-type="text">${item.time}</span>
      <strong data-gjs-type="text">${item.price}</strong>
    </div>
  </div>
</article>`,
    )
    .join("");
}

function teamHtml() {
  return chanelTeam
    .map(
      (member) => `
<article class="chanel-team-card">
  <div class="chanel-team-image">
    <img data-gjs-type="image" src="${member.image}" alt="${member.name}" />
  </div>
  <h3 data-gjs-type="text">${member.name}</h3>
  <p data-gjs-type="text">${member.role}</p>
</article>`,
    )
    .join("");
}

function pricingHtml() {
  return chanelPrices
    .map(
      (item, index) => `
<article class="chanel-price-row ${index === 1 ? "is-featured" : ""}">
  <span data-gjs-type="text" class="chanel-price-number">${item.number}</span>
  <div class="chanel-price-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>
  <div class="chanel-price-main">
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.duration}</p>
  </div>
  <strong data-gjs-type="text">${item.price}</strong>
</article>`,
    )
    .join("");
}

function testimonialsHtml() {
  const items = [
    "חוויה שקטה, נקייה ומקצועית. יצאתי רגועה לגמרי.",
    "הטיפול היה מדויק והאווירה מרגישה כמו ספא יוקרתי.",
    "שירות מהמם, עיצוב רגוע וטיפול פנים מושלם.",
    "המקום הכי נעים לקחת בו הפסקה אמיתית מהיום.",
  ];

  return items
    .map(
      (text, index) => `
<article class="chanel-testimonial-card">
  <span data-gjs-type="text">CLIENT REVIEW</span>
  <p data-gjs-type="text">${text}</p>
  <div>
    <strong data-gjs-type="text">לקוחה ${index + 1}</strong>
    <small data-gjs-type="text">טיפול וולנס</small>
  </div>
</article>`,
    )
    .join("");
}

function faqHtml() {
  const items = [
    ["כמה זמן נמשך טיפול פנים?", "בדרך כלל 45–60 דקות, בהתאם לסוג הטיפול וההתאמה האישית."],
    ["האם צריך להגיע עם הכנה מראש?", "לא. מומלץ להגיע כמה דקות לפני כדי להתחיל את החוויה ברוגע."],
    ["אפשר לשלב כמה טיפולים?", "כן, אפשר לבנות חבילת ספא אישית לפי הצורך."],
    ["איך קובעים תור?", "משאירים פרטים בטופס ונחזור אלייך לאישור מועד."],
  ];

  return items
    .map(
      ([question, answer], index) => `
<details class="chanel-faq-item" ${index === 0 ? "open" : ""}>
  <summary><span data-gjs-type="text">${question}</span><b>+</b></summary>
  <p data-gjs-type="text">${answer}</p>
</details>`,
    )
    .join("");
}

function blogHtml() {
  const items = [
    { title: "איך לבחור טיפול שמתאים לעור", image: chanelImages.blog1 },
    { title: "היתרונות של עיסוי ארומתרפי", image: chanelImages.blog2 },
    { title: "שגרת וולנס רגועה לשבוע עמוס", image: chanelImages.blog3 },
  ];

  return items
    .map(
      (item) => `
<article class="chanel-blog-card">
  <div><img data-gjs-type="image" src="${item.image}" alt="${item.title}" /></div>
  <span data-gjs-type="text">BLOG</span>
  <h3 data-gjs-type="text">${item.title}</h3>
</article>`,
    )
    .join("");
}

function footerHtml() {
  const stripImages = [
    chanelImages.therapy1,
    chanelImages.therapy2,
    chanelImages.therapy3,
    chanelImages.process1,
    chanelImages.blog1,
    chanelImages.therapy4,
    chanelImages.therapy1,
    chanelImages.therapy2,
    chanelImages.therapy3,
    chanelImages.process1,
  ];

  return `
<footer data-section-kind="footer" data-section-title="Footer" class="chanel-footer">
  <div class="chanel-footer-strip">
    ${stripImages.map((image) => `<img data-gjs-type="image" src="${image}" alt="גלריית טיפולים" />`).join("")}
  </div>

  <div class="chanel-container chanel-footer-grid">
    <div class="chanel-footer-newsletter">
      <h2 data-gjs-type="text">הצטרפי לעדכונים שלנו.</h2>
      <form>
        <input placeholder="כתובת אימייל" />
        <button type="button">הרשמה</button>
      </form>
    </div>

    <div class="chanel-footer-cols">
      <div>
        <strong data-gjs-type="text">ניווט</strong>
        <a data-editable-link="true" href="#about">אודות</a>
        <a data-editable-link="true" href="#services">טיפולים</a>
        <a data-editable-link="true" href="#prices">מחירים</a>
      </div>
      <div>
        <strong data-gjs-type="text">שעות פעילות</strong>
        <p data-gjs-type="text">א׳–ה׳ 09:00–19:00</p>
        <p data-gjs-type="text">ו׳ 09:00–14:00</p>
      </div>
      <div>
        <strong data-gjs-type="text">יצירת קשר</strong>
        <p data-gjs-type="text">050-0000000</p>
        <p data-gjs-type="text">hello@example.com</p>
      </div>
    </div>
  </div>

  <div class="chanel-footer-word" data-gjs-type="text">WELLNESS</div>
</footer>`;
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" id="chanel-root" class="chanel-home-site">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section id="home" data-section-kind="hero" data-section-title="Hero" class="chanel-hero">
  <div class="chanel-hero-bg">
    <img data-gjs-type="image" src="${chanelImages.hero}" alt="טיפול ספא רגוע" />
  </div>
</section>

${treatmentTickerHtml()}

<section id="about" data-section-kind="about" data-section-title="About" class="chanel-about">
  <div class="chanel-container chanel-about-grid">
    <div class="chanel-about-badge"><span>✱</span><b data-gjs-type="text">אודות</b></div>

    <div class="chanel-about-copy">
      <h1 data-gjs-type="text">המסע שלך לרוגע פנימי מתחיל כאן.</h1>
      <p data-gjs-type="text">טיפולי ספא, עיסוי וטיפוח בקצב רגוע, נקי ויוקרתי — בלי עומס ובלי טקסט על תמונות.</p>
    </div>

    <a data-editable-link="true" href="#booking" class="chanel-red-button">קביעת תור</a>

    <div class="chanel-about-image">
      <img data-gjs-type="image" src="${chanelImages.about}" alt="טיפול ספא" />
      <button type="button" aria-label="pause">Ⅱ</button>
    </div>

    <div class="chanel-about-stats">
      <p data-gjs-type="text">טיפול רגוע שמחזיר איזון לגוף ולעור, באווירה נקייה ומדויקת.</p>
      <div>
        <strong data-gjs-type="text">74K</strong>
        <span data-gjs-type="text">טיפולים שבוצעו</span>
      </div>
      <div>
        <strong data-gjs-type="text">96%</strong>
        <span data-gjs-type="text">לקוחות מרוצות</span>
      </div>
    </div>
  </div>

  ${partnersHtml()}
</section>

<section data-section-kind="process" data-section-title="Process" class="chanel-process">
  <div class="chanel-container">
    <div class="chanel-section-heading">
      <span data-gjs-type="text">✱ תהליך העבודה</span>
      <h2 data-gjs-type="text">דרך פשוטה להגיע לוולנס.</h2>
    </div>

    <div class="chanel-process-grid">
      ${processHtml()}
    </div>
  </div>
</section>

<section id="services" data-section-kind="services" data-section-title="Services" class="chanel-therapies">
  <div class="chanel-container">
    <div class="chanel-section-heading is-dark">
      <span data-gjs-type="text">✱ הטיפולים שלנו</span>
      <h2 data-gjs-type="text">טיפולי וולנס מרגיעים.</h2>
    </div>

    <div class="chanel-therapy-list">
      ${servicesHtml()}
    </div>
  </div>
</section>

<section id="team" data-section-kind="team" data-section-title="Team" class="chanel-team">
  <div class="chanel-container">
    <div class="chanel-section-heading">
      <span data-gjs-type="text">✱ צוות</span>
      <h2 data-gjs-type="text">מומחיות ספא וטיפול.</h2>
    </div>

    <div class="chanel-team-grid">
      ${teamHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Prices" class="chanel-pricing">
  <div class="chanel-container">
    <div class="chanel-section-heading">
      <span data-gjs-type="text">✱ מחירון</span>
      <h2 data-gjs-type="text">מחירי טיפולים.</h2>
    </div>

    <div class="chanel-price-list">
      ${pricingHtml()}
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="chanel-testimonials">
  <div class="chanel-container">
    <div class="chanel-section-heading is-dark">
      <span data-gjs-type="text">✱ המלצות</span>
      <h2 data-gjs-type="text">לקוחות מספרות.</h2>
    </div>

    <div class="chanel-testimonial-track">
      ${testimonialsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="faq" data-section-title="FAQ" class="chanel-faq">
  <div class="chanel-container chanel-faq-grid">
    <div class="chanel-faq-media">
      <img data-gjs-type="image" src="${chanelImages.faqMain}" alt="שאלות נפוצות" />
      <a data-editable-link="true" href="#booking">קביעת תור</a>
    </div>

    <div>
      <div class="chanel-section-heading align-start">
        <span data-gjs-type="text">✱ שאלות</span>
        <h2 data-gjs-type="text">שאלות נפוצות.</h2>
      </div>
      ${faqHtml()}
    </div>
  </div>
</section>

<section id="booking" data-section-kind="booking" data-section-title="Booking" class="chanel-contact">
  <div class="chanel-container chanel-contact-grid">
    <form class="chanel-contact-form">
      <span data-gjs-type="text">CONTACT US</span>
      <h2 data-gjs-type="text">צרי קשר עוד היום.</h2>
      <div class="chanel-form-row">
        <input placeholder="שם מלא" />
        <input placeholder="טלפון" />
      </div>
      <input placeholder="אימייל" />
      <select><option>בחירת טיפול</option><option>טיפול פנים</option><option>עיסוי עמוק</option></select>
      <textarea placeholder="הודעה"></textarea>
      <button type="button">שליחת בקשה</button>
    </form>

    <div class="chanel-contact-image">
      <img data-gjs-type="image" src="${chanelImages.contact}" alt="יצירת קשר" />
    </div>
  </div>
</section>

<section data-section-kind="blog" data-section-title="Blog" class="chanel-blog">
  <div class="chanel-container">
    <div class="chanel-section-heading">
      <span data-gjs-type="text">✱ בלוג</span>
      <h2 data-gjs-type="text">טיפים לעור ולוולנס.</h2>
    </div>
    <div class="chanel-blog-grid">
      ${blogHtml()}
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
<section data-section-kind="${section}" data-section-title="${title}" class="chanel-simple-page">
  <div class="chanel-container">
    <span data-gjs-type="text">✱ ${eyebrow}</span>
    <h1 data-gjs-type="text">${title}</h1>
    <p data-gjs-type="text">${text}</p>
  </div>
</section>`);
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
      "אודות",
      "אודות",
      "עמוד אודות נקי שממשיך את אותו עיצוב ותנועה של עמוד הבית.",
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
      "טיפולים",
      "טיפולים",
      "טיפולי פנים, עיסויים, ארומתרפיה וטקסי ספא רגועים.",
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
      "גלריה",
      "גלריה",
      "תמונות אווירה וטיפולים בסגנון נקי ויוקרתי.",
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
      "מחירים",
      "מחירון",
      "מחירים ברורים לטיפולי ספא, עיסוי וטיפוח.",
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
      "תור",
      "בחירת טיפול ושליחת בקשה לתור.",
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
      "שאלות, חבילות וזמינות לתורים.",
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
    "תבנית ספא/ביוטי מקורית בסגנון Apsora: לבנה, נקייה, כרטיסים, מחירון, שאלות, יצירת קשר ותנועה לפי גלילה.",
  image: chanelImages.hero,
  thumbnail: chanelImages.hero,

  heroTitle: "המסע שלך לרוגע פנימי מתחיל כאן",
  heroSubtitle: "טיפולי ספא, עיסוי וטיפוח בקצב רגוע ונקי.",
  businessName: "Chanel Spa",

  colors: {
    primary: "#2A1B16",
    secondary: "#7B6760",
    accent: "#C95268",
    background: "#FFFFFF",
    surface: "#F8F2EF",
    text: "#2A1B16",
    muted: "#8B7A73",
    dark: "#11100F",
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
      variant: "chanel-home-header",
      title: "Header",
      html: navHtml(),
    },
    {
      id: "chanel-home",
      type: "hero",
      variant: "chanel-apsora-inspired-home",
      title: "Home",
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
