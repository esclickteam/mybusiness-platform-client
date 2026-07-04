import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=90",
  heroMini:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=90",
  cardOne:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=850&q=90",
  cardTwo:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=850&q=90",
  cardThree:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=850&q=90",
  serviceOne:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1100&q=90",
  serviceTwo:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=90",
  serviceThree:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1100&q=90",
  serviceFour:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1100&q=90",
  teamOne:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=90",
  teamTwo:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=90",
  teamThree:
    "https://images.unsplash.com/photo-1614289371518-722f2615943d?auto=format&fit=crop&w=900&q=90",
  teamFour:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=90",
  faq:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=90",
  contact:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=90",
  blogOne:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=90",
  blogTwo:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=90",
  blogThree:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=90",
};

const partners = ["Aroma", "Wellness", "IPSUM", "Signature", "Glowhaus"];

export const chanelJourneyCards = [
  {
    number: "01",
    title: "ייעוץ והרגעה",
    text: "שיחה קצרה להבנת הגוף, העור והתחושה שאת רוצה לקבל בסוף הטיפול.",
    image: chanelImages.cardOne,
  },
  {
    number: "02",
    title: "ניקוי והכנה",
    text: "הכנת העור והגוף עם מגע עדין, נשימה רגועה ומוצרים איכותיים.",
    image: chanelImages.cardTwo,
  },
  {
    number: "03",
    title: "טיפול מדויק",
    text: "טיפול מקצועי שמתקדם בקצב נעים, בלי עומס ובלי תחושה מלאכותית.",
    image: chanelImages.cardThree,
  },
  {
    number: "04",
    title: "זוהר ושקט",
    text: "סיום רגוע עם תחושת קלילות, עור רך וחוויה שממשיכה גם אחרי היציאה.",
    image: chanelImages.heroMini,
  },
];

export const chanelServices = [
  {
    title: "Deep Massage",
    he: "עיסוי עמוק",
    price: "₪180",
    text: "עיסוי איטי ומדויק לשחרור עומסים והחזרת קלילות לגוף.",
    image: chanelImages.serviceOne,
    details: ["60 דקות", "שמנים חמימים"],
  },
  {
    title: "Radiance Facial",
    he: "טיפול פנים זוהר",
    price: "₪220",
    text: "ניקוי, הזנה ולחות למראה עור רך, נקי ומואר.",
    image: chanelImages.serviceTwo,
    details: ["75 דקות", "מסכת הזנה"],
  },
  {
    title: "Aroma Massage",
    he: "עיסוי ארומתרפי",
    price: "₪160",
    text: "שמנים טבעיים וניחוחות עדינים לחוויה רגועה ומאוזנת.",
    image: chanelImages.serviceThree,
    details: ["50 דקות", "שמנים טבעיים"],
  },
];

export const chanelPrices = [
  { number: "01", title: "Relaxation massage", he: "עיסוי הרפיה", price: "₪120", image: chanelImages.serviceThree },
  { number: "02", title: "Swedish massage", he: "עיסוי שוודי", price: "₪150", image: chanelImages.serviceOne, featured: true },
  { number: "03", title: "Aromatherapy massage", he: "עיסוי ארומתרפי", price: "₪160", image: chanelImages.serviceFour },
  { number: "04", title: "Facial care", he: "טיפול פנים", price: "₪220", image: chanelImages.cardOne },
];

export const chanelTeam = [
  { name: "Mia Thompson", role: "Spa Therapist", image: chanelImages.teamOne },
  { name: "Harper Collins", role: "Wellness Expert", image: chanelImages.teamTwo },
  { name: "Sophia Mitchell", role: "Facial Specialist", image: chanelImages.teamThree },
  { name: "Naomi Reed", role: "Massage Expert", image: chanelImages.teamFour },
];

const faqItems = [
  "כמה זמן מראש כדאי לקבוע תור?",
  "האם ניתן לשלב כמה טיפולים יחד?",
  "האם הטיפול מתאים לעור רגיש?",
  "אפשר לרכוש שובר מתנה?",
  "כמה זמן נמשך טיפול פנים?",
];

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="chanel-home-header">
  <div class="chanel-home-nav">
    <a data-gjs-type="text" data-editable-link="true" href="#booking" class="chanel-home-book-nav">קביעת תור</a>

    <nav class="chanel-home-menu">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#journey">אודות</a>
      <a data-editable-link="true" href="#services">טיפולים</a>
      <a data-editable-link="true" href="#pricing">מחירים</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-gjs-type="text" data-editable-link="true" href="#home" class="chanel-home-logo">Chanel</a>
  </div>
</header>`;
}

function partnersHtml() {
  return partners.map((item) => `<span data-gjs-type="text">${item}</span>`).join("");
}

function journeyCardsHtml() {
  return chanelJourneyCards
    .map(
      (item, index) => `
<article class="chanel-journey-card chanel-motion-${index + 1}">
  <div class="chanel-journey-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>
  <div class="chanel-journey-copy">
    <span data-gjs-type="text">${item.number}</span>
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.text}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function servicesHtml() {
  return chanelServices
    .map(
      (service) => `
<article class="chanel-service-row">
  <div class="chanel-service-image">
    <img data-gjs-type="image" src="${service.image}" alt="${service.title}" />
  </div>
  <div class="chanel-service-copy">
    <p data-gjs-type="text" class="chanel-kicker">${service.he}</p>
    <h3 data-gjs-type="text">${service.title}</h3>
    <p data-gjs-type="text">${service.text}</p>
    <div class="chanel-service-meta">
      ${service.details.map((detail) => `<span data-gjs-type="text">${detail}</span>`).join("")}
    </div>
  </div>
  <strong data-gjs-type="text">${service.price}</strong>
</article>`,
    )
    .join("\n");
}

function teamHtml() {
  return chanelTeam
    .map(
      (member) => `
<article class="chanel-team-card">
  <div class="chanel-team-image">
    <img data-gjs-type="image" src="${member.image}" alt="${member.name}" />
  </div>
  <div class="chanel-team-info">
    <h3 data-gjs-type="text">${member.name}</h3>
    <p data-gjs-type="text">${member.role}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function pricingHtml() {
  return chanelPrices
    .map(
      (item) => `
<article class="chanel-price-row ${item.featured ? "is-featured" : ""}">
  <span data-gjs-type="text" class="chanel-price-number">${item.number}</span>
  <div class="chanel-price-title">
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.he}</p>
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
  return faqItems
    .map(
      (item, index) => `
<article class="chanel-faq-row">
  <span data-gjs-type="text">0${index + 1}</span>
  <h3 data-gjs-type="text">${item}</h3>
  <button type="button" aria-label="פתיחה">+</button>
</article>`,
    )
    .join("\n");
}

function blogHtml() {
  return [
    { title: "איך להאריך את תחושת הרוגע אחרי טיפול", image: chanelImages.blogOne },
    { title: "ההבדל בין עיסוי עמוק לעיסוי שוודי", image: chanelImages.blogTwo },
    { title: "טיפול פנים שמתאים לעור עייף", image: chanelImages.blogThree },
  ]
    .map(
      (item) => `
<article class="chanel-blog-card">
  <div><img data-gjs-type="image" src="${item.image}" alt="${item.title}" /></div>
  <p data-gjs-type="text" class="chanel-kicker">Blog</p>
  <h3 data-gjs-type="text">${item.title}</h3>
</article>`,
    )
    .join("\n");
}

function footerHtml() {
  return `
<footer data-section-kind="footer" data-section-title="Footer" class="chanel-footer">
  <div class="chanel-footer-strip">
    ${[chanelImages.cardOne, chanelImages.cardTwo, chanelImages.cardThree, chanelImages.serviceOne, chanelImages.serviceTwo, chanelImages.cardOne, chanelImages.cardTwo]
      .map((image) => `<div><img data-gjs-type="image" src="${image}" alt="Spa gallery" /></div>`)
      .join("")}
  </div>

  <div class="chanel-home-container chanel-footer-main">
    <div>
      <p data-gjs-type="text" class="chanel-kicker">Newsletter</p>
      <h2 data-gjs-type="text">הצטרפו לעדכונים שלנו.</h2>
      <form class="chanel-newsletter-form">
        <input placeholder="כתובת אימייל" />
        <button type="button">הרשמה</button>
      </form>
    </div>

    <div class="chanel-footer-links">
      <div>
        <strong data-gjs-type="text">Menu</strong>
        <a data-editable-link="true" href="#journey">אודות</a>
        <a data-editable-link="true" href="#services">טיפולים</a>
        <a data-editable-link="true" href="#pricing">מחירים</a>
      </div>
      <div>
        <strong data-gjs-type="text">Utility Pages</strong>
        <a data-editable-link="true" href="#faq">שאלות נפוצות</a>
        <a data-editable-link="true" href="#contact">צור קשר</a>
        <a data-editable-link="true" href="#blog">בלוג</a>
      </div>
      <div>
        <strong data-gjs-type="text">Work Hours</strong>
        <p data-gjs-type="text">א׳–ה׳ 09:00–19:00</p>
        <p data-gjs-type="text">ו׳ 09:00–14:00</p>
      </div>
    </div>
  </div>

  <h2 data-gjs-type="text" class="chanel-footer-brand">CHANEL</h2>
</footer>`;
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" class="chanel-home-site">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section id="home" data-section-kind="hero" data-section-title="Hero" class="chanel-hero-section">
  <div class="chanel-home-container chanel-hero-grid">
    <div class="chanel-hero-left">
      <p data-gjs-type="text" class="chanel-kicker">Welcome</p>
      <h1 data-gjs-type="text">המסע שלך לרוגע פנימי מתחיל כאן.</h1>
      <p data-gjs-type="text">טיפולי ספא, עיסוי וטיפוח בקצב רגוע, נקי ויוקרתי — בלי עומס ובלי טקסט על תמונות.</p>
      <a data-editable-link="true" href="#booking" class="chanel-primary-btn">קביעת תור</a>
    </div>

    <div class="chanel-hero-visual">
      <img data-gjs-type="image" src="${chanelImages.hero}" alt="Spa therapy" />
      <span></span>
    </div>

    <div class="chanel-hero-stats">
      <div><strong data-gjs-type="text">$74M+</strong><p data-gjs-type="text">שווי חוויות טיפול</p></div>
      <div><strong data-gjs-type="text">96%</strong><p data-gjs-type="text">לקוחות שחוזרות</p></div>
    </div>
  </div>

  <div class="chanel-home-container chanel-partners-row">
    ${partnersHtml()}
  </div>
</section>

<section id="journey" data-section-kind="journey" data-section-title="Journey" class="chanel-journey-section">
  <div class="chanel-section-center">
    <p data-gjs-type="text" class="chanel-kicker">Process</p>
    <h2 data-gjs-type="text">דרך פשוטה להגיע לרוגע.</h2>
  </div>
  <div class="chanel-home-container chanel-journey-grid">
    ${journeyCardsHtml()}
  </div>
</section>

<section id="services" data-section-kind="services" data-section-title="Services" class="chanel-services-section">
  <div class="chanel-home-container">
    <div class="chanel-dark-title">
      <p data-gjs-type="text" class="chanel-kicker">Therapy Session</p>
      <h2 data-gjs-type="text">Relaxing Wellness Therapy Session</h2>
    </div>
    <div class="chanel-services-list">
      ${servicesHtml()}
    </div>
  </div>
</section>

<section id="team" data-section-kind="team" data-section-title="Team" class="chanel-team-section">
  <div class="chanel-section-center">
    <p data-gjs-type="text" class="chanel-kicker">Experts</p>
    <h2 data-gjs-type="text">Spa Specialists</h2>
  </div>
  <div class="chanel-home-container chanel-team-grid">
    ${teamHtml()}
  </div>
</section>

<section id="pricing" data-section-kind="pricing" data-section-title="Pricing" class="chanel-pricing-section">
  <div class="chanel-section-center">
    <p data-gjs-type="text" class="chanel-kicker">Pricing</p>
    <h2 data-gjs-type="text">Chanel Pricing Plans</h2>
  </div>
  <div class="chanel-home-container chanel-pricing-list">
    ${pricingHtml()}
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="chanel-testimonials-section">
  <div class="chanel-home-container">
    <div class="chanel-dark-title">
      <p data-gjs-type="text" class="chanel-kicker">Testimonials</p>
      <h2 data-gjs-type="text">Success Validated by Clients</h2>
    </div>
  </div>
  <div class="chanel-testimonials-track">
    <article><span data-gjs-type="text">5.0</span><h3 data-gjs-type="text">The treatment felt premium, calm and very personal.</h3><p data-gjs-type="text">Daniel Levine</p></article>
    <article><span data-gjs-type="text">5.0</span><h3 data-gjs-type="text">The design, service and atmosphere are exactly what I needed.</h3><p data-gjs-type="text">Roni Azulay</p></article>
    <article><span data-gjs-type="text">5.0</span><h3 data-gjs-type="text">A quiet experience that looks and feels elegant.</h3><p data-gjs-type="text">Noa Cohen</p></article>
    <article><span data-gjs-type="text">5.0</span><h3 data-gjs-type="text">Clean, soft and professional from the first minute.</h3><p data-gjs-type="text">Maya Bar</p></article>
  </div>
</section>

<section id="faq" data-section-kind="faq" data-section-title="FAQ" class="chanel-faq-section">
  <div class="chanel-home-container chanel-faq-grid">
    <div class="chanel-faq-image-stack">
      <img data-gjs-type="image" src="${chanelImages.faq}" alt="FAQ" />
      <img data-gjs-type="image" src="${chanelImages.cardOne}" alt="Spa" />
      <img data-gjs-type="image" src="${chanelImages.cardTwo}" alt="Relax" />
    </div>
    <div>
      <p data-gjs-type="text" class="chanel-kicker">FAQ</p>
      <h2 data-gjs-type="text">Frequently Asked Questions</h2>
      <div class="chanel-faq-list">${faqHtml()}</div>
    </div>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="chanel-contact-section">
  <div class="chanel-home-container chanel-contact-grid">
    <div class="chanel-contact-image">
      <img data-gjs-type="image" src="${chanelImages.contact}" alt="Contact" />
    </div>
    <form class="chanel-contact-form">
      <p data-gjs-type="text" class="chanel-kicker">Contact Us</p>
      <h2 data-gjs-type="text">Get in Touch Today!</h2>
      <div><input placeholder="שם מלא" /><input placeholder="טלפון" /></div>
      <input placeholder="אימייל" />
      <select><option>בחירת טיפול</option><option>עיסוי עמוק</option><option>טיפול פנים</option></select>
      <textarea placeholder="הודעה"></textarea>
      <button type="button">שליחת בקשה</button>
    </form>
  </div>
</section>

<section id="blog" data-section-kind="blog" data-section-title="Blog" class="chanel-blog-section">
  <div class="chanel-section-center">
    <p data-gjs-type="text" class="chanel-kicker">Blog</p>
    <h2 data-gjs-type="text">Beauty & Wellness Blog</h2>
  </div>
  <div class="chanel-home-container chanel-blog-grid">${blogHtml()}</div>
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
  <div class="chanel-home-container">
    <p data-gjs-type="text" class="chanel-kicker">${eyebrow}</p>
    <h1 data-gjs-type="text">${title}</h1>
    <p data-gjs-type="text">${text}</p>
  </div>
</section>`);
}

export const chanelEditorPages = [
  { id: "home", slug: "/", title: "בית", type: "home", isHome: true, html: createChanelHomeHtml(), css: chanelEditorCss },
  { id: "about", slug: "/about", title: "אודות", type: "about", html: createChanelSimplePageHtml("אודות הספא", "About", "ספא יוקרתי לטיפולי פנים, עיסויים והרפיה בקו נקי ורגוע.", "about"), css: chanelEditorCss },
  { id: "services", slug: "/services", title: "טיפולים", type: "services", html: createChanelSimplePageHtml("הטיפולים שלנו", "Services", "עיסוי עמוק, טיפול פנים, ארומתרפיה וחוויות וולנס רגועות.", "services"), css: chanelEditorCss },
  { id: "gallery", slug: "/gallery", title: "גלריה", type: "gallery", html: createChanelSimplePageHtml("גלריית ספא", "Gallery", "תמונות אווירה, טיפול, מוצרי טיפוח ורגעים שקטים.", "gallery"), css: chanelEditorCss },
  { id: "prices", slug: "/prices", title: "מחירים", type: "pricing", html: createChanelSimplePageHtml("מחירון טיפולים", "Pricing", "מחירים ברורים לטיפולי ספא עם אפשרות לשילוב טיפולים.", "prices"), css: chanelEditorCss },
  { id: "booking", slug: "/booking", title: "קביעת תור", type: "booking", html: createChanelSimplePageHtml("קביעת תור", "Booking", "בחרי טיפול, תאריך ושעה מועדפים ושלחי בקשה לתור.", "booking"), css: chanelEditorCss },
  { id: "contact", slug: "/contact", title: "צור קשר", type: "contact", html: createChanelSimplePageHtml("צור קשר", "Contact", "שאלות, זמינות, חבילות ספא והתאמת טיפול אישי.", "contact"), css: chanelEditorCss },
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
    "תבנית ספא/ביוטי בסגנון Apsora עם גלילה פנימית, תנועות מבוססות גלילה ועיצוב נקי.",
  image: chanelImages.hero,
  thumbnail: chanelImages.hero,
  heroTitle: "המסע שלך לרוגע פנימי מתחיל כאן",
  heroSubtitle: "ספא יוקרתי לטיפולי פנים, עיסויים וחוויית וולנס רגועה.",
  businessName: "Chanel Spa",
  colors: {
    primary: "#241711",
    secondary: "#756157",
    accent: "#c95660",
    background: "#fff8f3",
    surface: "#ffffff",
    text: "#241711",
    muted: "#8d7b72",
    dark: "#181514",
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
    { id: "chanel-header", type: "header", variant: "chanel-home-header", title: "Header", html: navHtml() },
    { id: "chanel-hero", type: "hero", variant: "chanel-apsora-clean", title: "Hero", html: createChanelHomeHtml() },
    { id: "chanel-footer", type: "footer", variant: "chanel-footer", title: "Footer", html: footerHtml() },
  ],
  css: chanelEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;
