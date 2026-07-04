import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2400&q=92",
  about:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1500&q=90",
  aboutSmall:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=90",
  processFace:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90",
  processRoom:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=90",
  therapyOne:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=90",
  therapyTwo:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=90",
  therapyThree:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=90",
  therapyFour:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  teamOne:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1000&q=90",
  teamTwo:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1000&q=90",
  teamThree:
    "https://images.unsplash.com/photo-1614289371518-722f2615943d?auto=format&fit=crop&w=1000&q=90",
  testimonialOne:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=90",
  testimonialTwo:
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=90",
  faq:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1300&q=90",
  contact:
    "https://images.unsplash.com/photo-1512310604669-443f26c35f52?auto=format&fit=crop&w=1400&q=90",
  blogOne:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=90",
  blogTwo:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=90",
  blogThree:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=90",
};

export const chanelTreatments = [
  "עיסוי הרפיה",
  "עיסוי עמוק",
  "עיסוי שוודי",
  "טיפול פנים",
  "פילינג גוף",
  "טיפול וולנס",
  "ארומתרפיה",
];

export const chanelTherapies = [
  {
    title: "Deep Massage",
    description:
      "טיפול עמוק ואיטי לשחרור עומס, איזון הגוף והחזרת תחושת קלילות.",
    image: chanelImages.therapyOne,
    time: "60 דקות",
    price: "₪150",
  },
  {
    title: "Radiance Facial",
    description:
      "טיפול פנים עדין ומדויק שמעניק לעור מראה נקי, רגוע וזוהר.",
    image: chanelImages.therapyTwo,
    time: "50 דקות",
    price: "₪180",
  },
  {
    title: "Aroma Massage",
    description:
      "שמנים טבעיים, מגע רגוע וקצב טיפול שמאפשר לגוף להירגע באמת.",
    image: chanelImages.therapyThree,
    time: "70 דקות",
    price: "₪170",
  },
  {
    title: "Relaxation Therapy",
    description:
      "חוויה מלאה של רוגע, נשימה ושחרור עם אווירה נקייה ומדויקת.",
    image: chanelImages.therapyFour,
    time: "45 דקות",
    price: "₪120",
  },
];

export const chanelTeam = [
  {
    name: "מיה תומפסון",
    role: "Massage Expert",
    image: chanelImages.teamOne,
  },
  {
    name: "נאומי ריד",
    role: "Facial Specialist",
    image: chanelImages.teamTwo,
  },
  {
    name: "הארפר קולינס",
    role: "Spa Therapist",
    image: chanelImages.teamThree,
  },
];

export const chanelPrices = [
  {
    number: "01",
    title: "Relaxation Massage",
    text: "Calm body and mind",
    price: "₪120",
    image: chanelImages.therapyOne,
  },
  {
    number: "02",
    title: "Swedish Massage",
    text: "Soft pressure therapy",
    price: "₪150",
    image: chanelImages.therapyTwo,
    active: true,
  },
  {
    number: "03",
    title: "Aromatherapy Massage",
    text: "Natural oils and balance",
    price: "₪170",
    image: chanelImages.therapyThree,
  },
  {
    number: "04",
    title: "Facial Care",
    text: "Clean glow and hydration",
    price: "₪180",
    image: chanelImages.processFace,
  },
  {
    number: "05",
    title: "Wellness Therapy",
    text: "A full relaxing ritual",
    price: "₪220",
    image: chanelImages.processRoom,
  },
];

const logoItems = ["Logipsum", "Ipsum", "Logoipsum", "Brand", "Wellness"];

function flower() {
  return `<span class="apsora-flower" aria-hidden="true">✱</span>`;
}

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="apsora-header">
  <div class="apsora-nav">
    <a data-editable-link="true" href="#booking" class="apsora-nav-cta">קביעת תור</a>

    <nav class="apsora-menu" aria-label="Main navigation">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#about">אודות</a>
      <a data-editable-link="true" href="#services">טיפולים</a>
      <a data-editable-link="true" href="#prices">מחירים</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-gjs-type="text" data-editable-link="true" href="#home" class="apsora-logo">Apsora</a>
  </div>
</header>
`;
}

function treatmentTickerHtml() {
  const items = [...chanelTreatments, ...chanelTreatments, ...chanelTreatments];

  return `
<div class="apsora-ticker" data-section-kind="ticker" data-section-title="Treatment Ticker">
  <div class="apsora-ticker-track">
    ${items
      .map((item) => `<span data-gjs-type="text">${item}</span>${flower()}`)
      .join("\n")}
  </div>
</div>`;
}

function brandRowHtml() {
  return `
<div class="apsora-brand-row" data-apsora-motion="up" data-motion-delay=".08">
  ${logoItems.map((item) => `<span data-gjs-type="text">${item}</span>`).join("\n")}
</div>`;
}

function therapyCardsHtml() {
  return chanelTherapies
    .map(
      (therapy, index) => `
<article class="apsora-therapy-card ${index % 2 ? "is-offset" : ""}" data-apsora-motion="${index % 2 ? "right" : "left"}" data-motion-delay=".${index + 1}0">
  <div class="apsora-therapy-image">
    <img data-gjs-type="image" src="${therapy.image}" alt="${therapy.title}" />
  </div>

  <div class="apsora-therapy-content">
    <h3 data-gjs-type="text">${therapy.title}</h3>
    <p data-gjs-type="text">${therapy.description}</p>

    <div class="apsora-therapy-meta">
      <span data-gjs-type="text">${therapy.time}</span>
      <strong data-gjs-type="text">${therapy.price}</strong>
    </div>
  </div>
</article>`,
    )
    .join("\n");
}

function teamCardsHtml() {
  return chanelTeam
    .map(
      (member, index) => `
<article class="apsora-team-card" data-apsora-motion="up" data-motion-delay=".${index + 1}2">
  <div class="apsora-team-image">
    <img data-gjs-type="image" src="${member.image}" alt="${member.name}" />
  </div>
  <div class="apsora-team-body">
    <h3 data-gjs-type="text">${member.name}</h3>
    <p data-gjs-type="text">${member.role}</p>
    <span data-gjs-type="text">↗</span>
  </div>
</article>`,
    )
    .join("\n");
}

function priceRowsHtml() {
  return chanelPrices
    .map(
      (item, index) => `
<article class="apsora-price-row ${item.active ? "is-active" : ""}" data-apsora-motion="up" data-motion-delay=".${index + 1}0">
  <span class="apsora-price-number" data-gjs-type="text">${item.number}</span>
  <div class="apsora-price-main">
    <h3 data-gjs-type="text">${item.title}</h3>
    <p data-gjs-type="text">${item.text}</p>
  </div>
  <div class="apsora-price-image">
    <img data-gjs-type="image" src="${item.image}" alt="${item.title}" />
  </div>
  <strong data-gjs-type="text">${item.price}</strong>
</article>`,
    )
    .join("\n");
}

function testimonialsHtml() {
  const items = [
    [
      "Amazing Service",
      "חוויה שקטה, מקצועית ומדויקת. הכל הרגיש נקי ויוקרתי.",
      "דניאל לוי",
    ],
    [
      "Perfect Therapy",
      "נכנסתי עמוסה ויצאתי רגועה לגמרי. טיפול ברמה גבוהה.",
      "רומי אברהם",
    ],
    [
      "Beautiful Space",
      "העיצוב, השירות והטיפול הרגישו כמו ספא בוטיק אמיתי.",
      "נועה כהן",
    ],
    [
      "Highly Recommend",
      "טיפול פנים מצוין והעור נראה זוהר כבר באותו יום.",
      "ליה בר",
    ],
  ];

  return items
    .map(
      ([title, text, name], index) => `
<article class="apsora-testimonial-card" data-apsora-motion="up" data-motion-delay=".${index + 1}1">
  <span data-gjs-type="text">${title}</span>
  <p data-gjs-type="text">${text}</p>
  <strong data-gjs-type="text">${name}</strong>
</article>`,
    )
    .join("\n");
}

function faqRowsHtml() {
  const rows = [
    "איך בוחרים את הטיפול המתאים?",
    "כמה זמן אורך טיפול ספא?",
    "האם אפשר לשלב כמה טיפולים?",
    "מתי מומלץ להגיע לפני התור?",
    "איך קובעים תור חדש?",
  ];

  return rows
    .map(
      (row, index) => `
<div class="apsora-faq-row" data-apsora-motion="right" data-motion-delay=".${index + 1}0">
  <span data-gjs-type="text">0${index + 1}</span>
  <p data-gjs-type="text">${row}</p>
  <strong data-gjs-type="text">+</strong>
</div>`,
    )
    .join("\n");
}

function blogCardsHtml() {
  const blogs = [
    ["How Massage Therapy Relieves Body Stress", chanelImages.blogOne],
    ["Benefits of Aromatherapy for Mind Relaxation", chanelImages.blogTwo],
    ["Skin Care Rituals for a Natural Glow", chanelImages.blogThree],
  ];

  return blogs
    .map(
      ([title, image], index) => `
<article class="apsora-blog-card" data-apsora-motion="up" data-motion-delay=".${index + 1}1">
  <span data-gjs-type="text">Wellness</span>
  <h3 data-gjs-type="text">${title}</h3>
  <div>
    <img data-gjs-type="image" src="${image}" alt="${title}" />
  </div>
</article>`,
    )
    .join("\n");
}

function galleryHtml() {
  const images = [
    chanelImages.about,
    chanelImages.therapyOne,
    chanelImages.therapyTwo,
    chanelImages.processRoom,
    chanelImages.processFace,
    chanelImages.contact,
  ];

  return `
<section id="gallery" data-section-kind="gallery" data-section-title="Gallery" class="apsora-gallery-page">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Gallery</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Spa Gallery</h2>
    </div>

    <div class="apsora-gallery-grid">
      ${images
        .map(
          (image, index) => `
      <div class="apsora-gallery-item ${index === 1 || index === 4 ? "is-tall" : index === 2 ? "is-small" : ""}" data-apsora-motion="up" data-motion-delay=".${index + 1}0">
        <img data-gjs-type="image" src="${image}" alt="Spa gallery ${index + 1}" />
      </div>`,
        )
        .join("\n")}
    </div>
  </div>
</section>
`;
}

function bookingHtml() {
  return `
<section id="booking" data-section-kind="booking" data-section-title="Booking" class="apsora-booking-page">
  <div class="apsora-container apsora-booking-grid">
    <div class="apsora-booking-image" data-apsora-motion="left">
      <img data-gjs-type="image" src="${chanelImages.therapyTwo}" alt="Book spa appointment" />
    </div>

    <div class="apsora-booking-content">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Booking</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Book Appointment</h2>

      <form class="apsora-booking-form" data-apsora-motion="right" data-motion-delay=".12">
        <div class="two">
          <input placeholder="Name" />
          <input placeholder="Phone" />
        </div>
        <div class="two">
          <input placeholder="Preferred Date" />
          <select>
            <option>Select Treatment</option>
            <option>Deep Massage</option>
            <option>Radiance Facial</option>
            <option>Aroma Massage</option>
            <option>Relaxation Therapy</option>
          </select>
        </div>
        <textarea placeholder="Message"></textarea>
        <button type="button">Send Booking Request</button>
      </form>
    </div>
  </div>
</section>
`;
}

function footerHtml() {
  const images = [
    chanelImages.blogOne,
    chanelImages.blogTwo,
    chanelImages.blogThree,
    chanelImages.about,
    chanelImages.processFace,
    chanelImages.therapyTwo,
    chanelImages.blogOne,
    chanelImages.blogTwo,
    chanelImages.blogThree,
    chanelImages.about,
  ];

  return `
<footer data-section-kind="footer" data-section-title="Footer" class="apsora-footer">
  <div class="apsora-footer-strip">
    ${images
      .map(
        (image) =>
          `<img data-gjs-type="image" src="${image}" alt="גלריית ספא" />`,
      )
      .join("\n")}
  </div>

  <div class="apsora-footer-main">
    <div class="apsora-footer-newsletter" data-apsora-motion="up">
      <p data-gjs-type="text">Subscribe to Our Newsletter.</p>
      <div>
        <input placeholder="Email address" />
        <button type="button">Subscribe</button>
      </div>
    </div>

    <div class="apsora-footer-links" data-apsora-motion="up" data-motion-delay=".12">
      <div>
        <strong data-gjs-type="text">Menu</strong>
        <a data-editable-link="true" href="#about">About</a>
        <a data-editable-link="true" href="#services">Services</a>
        <a data-editable-link="true" href="#prices">Pricing</a>
      </div>
      <div>
        <strong data-gjs-type="text">Utility Pages</strong>
        <a data-editable-link="true" href="#contact">Contact</a>
        <a data-editable-link="true" href="#faq">FAQ</a>
        <a data-editable-link="true" href="#blog">Blog</a>
      </div>
      <div>
        <strong data-gjs-type="text">Work Hours</strong>
        <p data-gjs-type="text">Sun - Thu: 09:00 - 19:00</p>
        <p data-gjs-type="text">Friday: 09:00 - 14:00</p>
      </div>
    </div>
  </div>
</footer>`;
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" id="home" class="apsora-site">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section id="home" data-section-kind="hero" data-section-title="Hero" class="apsora-hero">
  <div class="apsora-hero-image" data-apsora-hero="true">
    <img data-gjs-type="image" src="${chanelImages.hero}" alt="Spa treatment" />
  </div>
</section>

${treatmentTickerHtml()}

<section id="about" data-section-kind="about" data-section-title="About" class="apsora-about">
  <div class="apsora-container apsora-about-grid">
    <div class="apsora-about-side" data-apsora-motion="left" data-motion-delay=".06">
      <a data-editable-link="true" href="#contact" class="apsora-red-button">MORE ABOUT US</a>
    </div>

    <div class="apsora-about-main">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">About Us</span></div>
      <h1 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">
        Your journey to inner peace begins here with calming treatments, expert care, and a truly relaxing spa experience
      </h1>

      <div class="apsora-about-cards">
        <div class="apsora-about-media" data-apsora-motion="left" data-motion-delay=".14">
          <img data-gjs-type="image" src="${chanelImages.about}" alt="Relaxing massage" />
          <span data-gjs-type="text">Ⅱ</span>
        </div>

        <div class="apsora-about-stat-card" data-apsora-motion="right" data-motion-delay=".2">
          <p data-gjs-type="text">Relax and unwind with soothing spa treatments designed to refresh your body, calm your mind, and restore balance and beauty within.</p>
          <div class="apsora-stat-grid">
            <div>
              <strong data-gjs-type="text">$74M</strong>
              <span data-gjs-type="text">Driving growth with strategy.</span>
            </div>
            <div>
              <strong data-gjs-type="text">96%</strong>
              <span data-gjs-type="text">Our happy Clients worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${brandRowHtml()}
</section>

<section data-section-kind="process" data-section-title="Work Process" class="apsora-process">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Work Process</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">A simple journey to<br />achieve wellness</h2>
    </div>

    <div class="apsora-process-layout">
      <article class="apsora-process-card card-one" data-apsora-motion="up" data-motion-delay=".08">
        <span data-gjs-type="text">(STEP - 01)</span>
        <h3 data-gjs-type="text">Consult & Relax</h3>
        <p data-gjs-type="text">Personalized consultation to understand your needs and comfort.</p>
      </article>

      <div class="apsora-process-image image-one" data-apsora-motion="up" data-motion-delay=".14">
        <img data-gjs-type="image" src="${chanelImages.processFace}" alt="Facial therapy" />
      </div>

      <article class="apsora-process-card card-two" data-apsora-motion="up" data-motion-delay=".2">
        <span data-gjs-type="text">(STEP - 02)</span>
        <h3 data-gjs-type="text">Choose & Prep</h3>
        <p data-gjs-type="text">Select a treatment and prepare your body and mind for calm.</p>
      </article>

      <div class="apsora-process-image image-two" data-apsora-motion="right" data-motion-delay=".26">
        <img data-gjs-type="image" src="${chanelImages.processRoom}" alt="Spa room" />
      </div>

      <article class="apsora-process-card card-three" data-apsora-motion="left" data-motion-delay=".32">
        <span data-gjs-type="text">(STEP - 03)</span>
        <h3 data-gjs-type="text">Refresh & Glow</h3>
        <p data-gjs-type="text">Leave feeling restored, lighter, and beautifully refreshed.</p>
      </article>
    </div>
  </div>
</section>

<section id="services" data-section-kind="services" data-section-title="Services" class="apsora-services">
  <div class="apsora-container">
    <div class="apsora-services-title">
      <div class="apsora-pill is-dark" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Our Treatments</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Relaxing Wellness<br />Therapy Session</h2>
    </div>

    <div class="apsora-therapy-list">
      ${therapyCardsHtml()}
    </div>
  </div>
</section>

<section id="team" data-section-kind="team" data-section-title="Team" class="apsora-team">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Spa Specialists</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Spa Specialists</h2>
    </div>

    <div class="apsora-team-grid">
      ${teamCardsHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Pricing" class="apsora-pricing">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Pricing</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Apsora Pricing Plans</h2>
    </div>

    <div class="apsora-price-list">
      ${priceRowsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="apsora-testimonials">
  <div class="apsora-container">
    <div class="apsora-section-title is-dark">
      <div class="apsora-pill is-dark" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Testimonials</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Success Validated by<br />Clients</h2>
    </div>
  </div>

  <div class="apsora-testimonial-track">
    ${testimonialsHtml()}
  </div>
</section>

<section id="faq" data-section-kind="faq" data-section-title="FAQ" class="apsora-faq">
  <div class="apsora-container apsora-faq-grid">
    <div class="apsora-faq-art" data-apsora-motion="left">
      <img data-gjs-type="image" src="${chanelImages.faq}" alt="Facial care" />
      <div class="mini one"><img data-gjs-type="image" src="${chanelImages.aboutSmall}" alt="Spa" /></div>
      <div class="mini two"><img data-gjs-type="image" src="${chanelImages.processFace}" alt="Spa" /></div>
      <div class="mini three"><img data-gjs-type="image" src="${chanelImages.therapyThree}" alt="Spa" /></div>
    </div>

    <div class="apsora-faq-content">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">FAQ</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Frequently Asked Questions</h2>
      <div class="apsora-faq-list">
        ${faqRowsHtml()}
      </div>
    </div>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="apsora-contact">
  <div class="apsora-container apsora-contact-grid">
    <div class="apsora-contact-image" data-apsora-motion="left">
      <img data-gjs-type="image" src="${chanelImages.contact}" alt="Spa contact" />
    </div>

    <div class="apsora-contact-content">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Contact Us</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Get in Touch Today!</h2>
      <form class="apsora-contact-form" data-apsora-motion="right" data-motion-delay=".12">
        <div class="two">
          <input placeholder="Name" />
          <input placeholder="Email" />
        </div>
        <div class="two">
          <input placeholder="Phone" />
          <select><option>Select Service</option><option>Deep Massage</option><option>Facial Care</option></select>
        </div>
        <textarea placeholder="Message"></textarea>
        <button type="button">Send Message</button>
      </form>
    </div>
  </div>
</section>

<section id="blog" data-section-kind="blog" data-section-title="Blog" class="apsora-blog">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Blog</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Beauty & Wellness Blog</h2>
    </div>
    <div class="apsora-blog-grid">
      ${blogCardsHtml()}
    </div>
  </div>
</section>
`);
}

export function createChanelAboutHtml() {
  return pageShell(`
<section id="about" data-section-kind="about" data-section-title="About" class="apsora-about">
  <div class="apsora-container apsora-about-grid">
    <div class="apsora-about-side" data-apsora-motion="left" data-motion-delay=".06">
      <a data-editable-link="true" href="#contact" class="apsora-red-button">MORE ABOUT US</a>
    </div>

    <div class="apsora-about-main">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">About Us</span></div>
      <h1 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">
        Relaxing treatments, expert care, clean space, and a spa experience designed to restore calm
      </h1>

      <div class="apsora-about-cards">
        <div class="apsora-about-media" data-apsora-motion="left" data-motion-delay=".14">
          <img data-gjs-type="image" src="${chanelImages.about}" alt="Relaxing massage" />
          <span data-gjs-type="text">Ⅱ</span>
        </div>

        <div class="apsora-about-stat-card" data-apsora-motion="right" data-motion-delay=".2">
          <p data-gjs-type="text">Every treatment is built around softness, quiet, clean design and real attention to the client experience.</p>
          <div class="apsora-stat-grid">
            <div>
              <strong data-gjs-type="text">12+</strong>
              <span data-gjs-type="text">Years of experience.</span>
            </div>
            <div>
              <strong data-gjs-type="text">96%</strong>
              <span data-gjs-type="text">Happy returning clients.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${brandRowHtml()}
</section>
`);
}

export function createChanelServicesHtml() {
  return pageShell(`
<section id="services" data-section-kind="services" data-section-title="Services" class="apsora-services">
  <div class="apsora-container">
    <div class="apsora-services-title">
      <div class="apsora-pill is-dark" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Our Treatments</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Relaxing Wellness<br />Therapy Session</h2>
    </div>

    <div class="apsora-therapy-list">
      ${therapyCardsHtml()}
    </div>
  </div>
</section>
`);
}

export function createChanelPricesHtml() {
  return pageShell(`
<section id="prices" data-section-kind="prices" data-section-title="Pricing" class="apsora-pricing">
  <div class="apsora-container">
    <div class="apsora-section-title">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Pricing</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Apsora Pricing Plans</h2>
    </div>

    <div class="apsora-price-list">
      ${priceRowsHtml()}
    </div>
  </div>
</section>
`);
}

export function createChanelGalleryPageHtml() {
  return pageShell(galleryHtml());
}

export function createChanelBookingPageHtml() {
  return pageShell(bookingHtml());
}

export function createChanelContactHtml() {
  return pageShell(`
<section id="contact" data-section-kind="contact" data-section-title="Contact" class="apsora-contact">
  <div class="apsora-container apsora-contact-grid">
    <div class="apsora-contact-image" data-apsora-motion="left">
      <img data-gjs-type="image" src="${chanelImages.contact}" alt="Spa contact" />
    </div>

    <div class="apsora-contact-content">
      <div class="apsora-pill" data-apsora-motion="up">${flower()}<span data-gjs-type="text">Contact Us</span></div>
      <h2 data-gjs-type="text" data-apsora-motion="text" data-motion-delay=".08">Get in Touch Today!</h2>
      <form class="apsora-contact-form" data-apsora-motion="right" data-motion-delay=".12">
        <div class="two">
          <input placeholder="Name" />
          <input placeholder="Email" />
        </div>
        <div class="two">
          <input placeholder="Phone" />
          <select><option>Select Service</option><option>Deep Massage</option><option>Facial Care</option></select>
        </div>
        <textarea placeholder="Message"></textarea>
        <button type="button">Send Message</button>
      </form>
    </div>
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
    html: createChanelAboutHtml(),
    css: chanelEditorCss,
  },
  {
    id: "services",
    slug: "/services",
    title: "טיפולים",
    type: "services",
    html: createChanelServicesHtml(),
    css: chanelEditorCss,
  },
  {
    id: "gallery",
    slug: "/gallery",
    title: "גלריה",
    type: "gallery",
    html: createChanelGalleryPageHtml(),
    css: chanelEditorCss,
  },
  {
    id: "prices",
    slug: "/prices",
    title: "מחירים",
    type: "pricing",
    html: createChanelPricesHtml(),
    css: chanelEditorCss,
  },
  {
    id: "booking",
    slug: "/booking",
    title: "קביעת תור",
    type: "booking",
    html: createChanelBookingPageHtml(),
    css: chanelEditorCss,
  },
  {
    id: "contact",
    slug: "/contact",
    title: "צור קשר",
    type: "contact",
    html: createChanelContactHtml(),
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
    "תבנית ספא/ביוטי בסגנון Apsora עם Hero גדול, פס טיפולים נע, Services כהה, Pricing, Gallery, Booking, Contact ותנועה בגלילה.",
  image: chanelImages.hero,
  thumbnail: chanelImages.hero,

  heroTitle: "Your journey to inner peace begins here",
  heroSubtitle:
    "Calming treatments, expert care, and a relaxing spa experience.",
  businessName: "Apsora",

  colors: {
    primary: "#2B1B15",
    secondary: "#7B5F52",
    accent: "#B84E61",
    background: "#FFF9F5",
    surface: "#FFFFFF",
    text: "#2B1B15",
    muted: "#8D756B",
    dark: "#171716",
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
      variant: "apsora-header",
      title: "Header",
      html: navHtml(),
    },
    {
      id: "chanel-home",
      type: "hero",
      variant: "apsora-home-page",
      title: "Home Page",
      html: createChanelHomeHtml(),
    },
    {
      id: "chanel-gallery",
      type: "gallery",
      variant: "apsora-gallery",
      title: "Gallery",
      html: galleryHtml(),
    },
    {
      id: "chanel-booking",
      type: "booking",
      variant: "apsora-booking",
      title: "Booking",
      html: bookingHtml(),
    },
    {
      id: "chanel-footer",
      type: "footer",
      variant: "apsora-footer",
      title: "Footer",
      html: footerHtml(),
    },
  ],

  css: chanelEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;