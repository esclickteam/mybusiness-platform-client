import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplate,
  ReadyWebsiteTemplateSeed,
} from "../data/readyWebsiteTypes";

function safe(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function blockDomId(block: ReadyWebsiteBlock) {
  return `${block.type}-${block.id}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function sectionAttrs(block: ReadyWebsiteBlock) {
  const id = blockDomId(block);

  return `
    id="${safe(id)}"
    data-section-kind="${safe(block.type)}"
    data-section-title="${safe(block.title)}"
    data-bizuply-block="${safe(block.type)}"
    data-bizuply-variant="${safe(block.variant)}"
    data-studio-section-id="${safe(id)}"
  `;
}

const demoImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
];

function titleBlock(block: ReadyWebsiteBlock, eyebrow = "Bizuply") {
  const description = block.subtitle || block.text || "";

  return `
    <div class="bzw-title">
      <span>${safe(eyebrow)}</span>
      <h2>${safe(block.title)}</h2>
      ${description ? `<p>${safe(description)}</p>` : ""}
    </div>
  `;
}

function renderHeader(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed) {
  const menu = ["בית", "שירותים", "גלריה", "תורים", "צור קשר"];

  if (block.variant.includes("center")) {
    return `
      <header ${sectionAttrs(block)} class="bzw-header bzw-header-center">
        <nav>
          ${menu
            .slice(0, 2)
            .map((item) => `<a href="#">${safe(item)}</a>`)
            .join("")}
        </nav>

        <strong>${safe(template.niche)}</strong>

        <nav>
          ${menu
            .slice(2)
            .map((item) => `<a href="#">${safe(item)}</a>`)
            .join("")}
        </nav>
      </header>
    `;
  }

  if (block.variant.includes("side")) {
    return `
      <header ${sectionAttrs(block)} class="bzw-header bzw-header-side">
        <div>
          <strong>${safe(template.niche)}</strong>
          <small>אתר עסקי מוכן לעבודה</small>
        </div>

        <nav>
          ${menu.map((item) => `<a href="#">${safe(item)}</a>`).join("")}
        </nav>

        <a class="bzw-main-btn" href="#booking">קביעת תור</a>
      </header>
    `;
  }

  return `
    <header ${sectionAttrs(block)} class="bzw-header">
      <strong>${safe(template.niche)}</strong>

      <nav>
        ${menu.map((item) => `<a href="#">${safe(item)}</a>`).join("")}
      </nav>

      <a class="bzw-main-btn" href="#contact">צור קשר</a>
    </header>
  `;
}

function renderHero(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed) {
  const image = safe(block.image || template.image);

  if (block.variant.includes("fullscreen")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-hero-full">
        <div class="bzw-hero-bg" style="background-image:url('${image}')"></div>

        <div class="bzw-hero-overlay">
          <span>${safe(template.niche)}</span>
          <h1>${safe(template.heroTitle)}</h1>
          <p>${safe(template.heroSubtitle)}</p>

          <div class="bzw-actions">
            <a href="#booking">קביעת תור</a>
            <a class="ghost" href="#gallery">צפייה בעבודות</a>
          </div>
        </div>
      </section>
    `;
  }

  if (block.variant.includes("offer")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-hero-offer">
        <div>
          <span>${safe(template.niche)}</span>
          <h1>${safe(template.heroTitle)}</h1>
          <p>${safe(template.heroSubtitle)}</p>

          <div class="bzw-actions">
            <a href="#lead">אני רוצה פרטים</a>
            <a class="ghost" href="#services">שירותים</a>
          </div>
        </div>

        <aside>
          <small>מבצע השקה</small>
          <h2>חבילת אתר עסקי</h2>
          <b>₪2,000</b>
          <p>כולל אתר, יומן, טופס לידים, חנות וסקשנים מוכנים לעריכה.</p>
        </aside>
      </section>
    `;
  }

  if (block.variant.includes("cards")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-hero-cards">
        <div>
          <span>${safe(template.niche)}</span>
          <h1>${safe(template.heroTitle)}</h1>
          <p>${safe(template.heroSubtitle)}</p>

          <div class="bzw-actions">
            <a href="#booking">קביעת תור</a>
            <a class="ghost" href="#contact">שיחה עם העסק</a>
          </div>
        </div>

        <div class="bzw-floating-cards">
          <article>
            <b>24/7</b>
            <small>איסוף לידים</small>
          </article>

          <article>
            <b>98%</b>
            <small>חווית משתמש</small>
          </article>

          <article class="photo" style="background-image:url('${image}')"></article>
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-hero-split">
      <div>
        <span>${safe(template.niche)}</span>
        <h1>${safe(template.heroTitle)}</h1>
        <p>${safe(template.heroSubtitle)}</p>

        <div class="bzw-actions">
          <a href="#booking">קביעת תור</a>
          <a class="ghost" href="#services">לשירותים</a>
        </div>
      </div>

      <figure class="bzw-hero-image" style="background-image:url('${image}')"></figure>
    </section>
  `;
}

function renderServices(block: ReadyWebsiteBlock) {
  const items = block.items?.length
    ? block.items
    : ["שירות פרימיום", "ייעוץ אישי", "ליווי מלא"];

  if (block.variant.includes("list")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-services-list">
        ${titleBlock(block, "שירותים")}

        <div>
          ${items
            .map(
              (item, index) => `
                <article>
                  <span>0${index + 1}</span>

                  <div>
                    <h3>${safe(item)}</h3>
                    <p>תיאור שירות מקצועי שהעסק יכול לערוך בקלות.</p>
                  </div>

                  <b>${["₪180", "₪320", "₪590"][index % 3]}</b>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  if (block.variant.includes("timeline")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-services-timeline">
        ${titleBlock(block, "תהליך עבודה")}

        <div>
          ${items
            .map(
              (item, index) => `
                <article>
                  <span>${index + 1}</span>

                  <div>
                    <h3>${safe(item)}</h3>
                    <p>שלב ברור בחווית הלקוח, עם הסבר קצר ופעולה.</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-services-grid">
      ${titleBlock(block, "שירותים")}

      <div>
        ${items
          .map(
            (item, index) => `
              <article>
                <i>${["✦", "◈", "●"][index % 3]}</i>
                <h3>${safe(item)}</h3>
                <p>בלוק שירות מוכן לעריכה עם טקסט, מחיר וכפתור פעולה.</p>
                <a href="#booking">בחר שירות</a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderGallery(block: ReadyWebsiteBlock) {
  if (block.variant.includes("masonry")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-gallery-masonry">
        ${titleBlock(block, "גלריה")}

        <div>
          ${demoImages
            .map(
              (image, index) => `
                <figure
                  class="tall-${index % 3}"
                  style="background-image:url('${image}')"
                ></figure>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  if (block.variant.includes("slider")) {
    return `
      <section ${sectionAttrs(block)} class="bzw-section bzw-gallery-slider">
        ${titleBlock(block, "עבודות אחרונות")}

        <div>
          ${demoImages
            .slice(0, 5)
            .map(
              (image) => `
                <figure style="background-image:url('${image}')"></figure>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-gallery-grid">
      ${titleBlock(block, "גלריה")}

      <div>
        ${demoImages
          .slice(0, 6)
          .map(
            (image) => `
              <figure style="background-image:url('${image}')"></figure>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBooking(block: ReadyWebsiteBlock) {
  const days = Array.from(
    { length: 14 },
    (_, index) =>
      `<button class="${[1, 4, 8, 11].includes(index) ? "active" : ""}">${
        index + 1
      }</button>`
  ).join("");

  const times = ["09:00", "10:30", "12:00", "14:30", "17:00", "19:00"];

  if (block.variant.includes("wide")) {
    return `
      <section ${sectionAttrs(block)} id="booking" class="bzw-section bzw-booking-wide">
        <div>
          ${titleBlock(block, "יומן מחובר")}
        </div>

        <div
          class="bzw-calendar"
          data-bizuply-widget="booking-calendar"
          data-api="/api/businesses/{{businessId}}/availability"
          data-services-api="/api/businesses/{{businessId}}/services"
          data-appointments-api="/api/businesses/{{businessId}}/appointments"
        >
          <h3>בחרו תאריך ושעה</h3>

          <div class="days">${days}</div>

          <div class="times">
            ${times.map((time) => `<button>${time}</button>`).join("")}
          </div>

          <a href="#">אישור תור</a>
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} id="booking" class="bzw-section bzw-booking-card">
      ${titleBlock(block, "קביעת תור")}

      <div
        class="bzw-calendar"
        data-bizuply-widget="booking-calendar"
        data-api="/api/businesses/{{businessId}}/availability"
        data-services-api="/api/businesses/{{businessId}}/services"
        data-appointments-api="/api/businesses/{{businessId}}/appointments"
      >
        <h3>שעות פנויות</h3>

        <div class="days">${days}</div>

        <div class="times">
          ${times.map((time) => `<button>${time}</button>`).join("")}
        </div>

        <a href="#">קבעו עכשיו</a>
      </div>
    </section>
  `;
}

function renderStore(block: ReadyWebsiteBlock) {
  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-store">
      ${titleBlock(block, "חנות מחוברת")}

      <div
        data-bizuply-widget="products"
        data-api="/api/businesses/{{businessId}}/products"
      >
        ${["מוצר מוביל", "מוצר פרימיום", "מארז מתנה"]
          .map(
            (product, index) => `
              <article>
                <div class="product-image"></div>
                <h3>${safe(product)}</h3>
                <p>תיאור מוצר קצר שניתן להחליף.</p>
                <b>${["₪99", "₪149", "₪249"][index]}</b>
                <a href="#">הוסף לעגלה</a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderLead(block: ReadyWebsiteBlock) {
  return `
    <section ${sectionAttrs(block)} id="lead" class="bzw-section bzw-lead">
      <div>
        ${titleBlock(block, "לידים")}
      </div>

      <form
        data-bizuply-widget="lead-form"
        data-api="/api/businesses/{{businessId}}/leads"
      >
        <input placeholder="שם מלא" />
        <input placeholder="טלפון" />
        <textarea placeholder="מה תרצו לדעת?"></textarea>
        <button type="button">שליחת פרטים</button>
      </form>
    </section>
  `;
}

function renderReviews(block: ReadyWebsiteBlock) {
  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-reviews">
      ${titleBlock(block, "המלצות")}

      <div
        data-bizuply-widget="reviews"
        data-api="/api/businesses/{{businessId}}/reviews"
      >
        ${["חוויה מעולה ומקצועית", "הכל ברור ונוח", "שירות מהיר ומדויק"]
          .map(
            (text) => `
              <article>
                <b>★★★★★</b>
                <p>${safe(text)}</p>
                <small>לקוח מרוצה</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFaq(block: ReadyWebsiteBlock) {
  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-faq">
      ${titleBlock(block, "שאלות נפוצות")}

      ${["איך קובעים תור?", "האם אפשר לערוך את האתר?", "האם זה מותאם לנייד?"]
        .map(
          (question) => `
            <details open>
              <summary>${safe(question)}</summary>
              <p>כן. כל התוכן, התמונות והבלוקים ניתנים לעריכה מלאה.</p>
            </details>
          `
        )
        .join("")}
    </section>
  `;
}

function renderContact(block: ReadyWebsiteBlock) {
  if (block.variant.includes("map")) {
    return `
      <section ${sectionAttrs(block)} id="contact" class="bzw-section bzw-contact-map">
        <div>
          ${titleBlock(block, "יצירת קשר")}
        </div>

        <div class="map">מפה / אזורי שירות</div>

        <form>
          <input placeholder="שם" />
          <input placeholder="טלפון" />
          <button type="button">שליחה</button>
        </form>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} id="contact" class="bzw-section bzw-contact">
      ${titleBlock(block, "יצירת קשר")}

      <div>
        <a href="#">WhatsApp</a>
        <a href="#">טלפון</a>
        <a href="#">Instagram</a>
      </div>
    </section>
  `;
}

function renderFooter(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed) {
  return `
    <footer ${sectionAttrs(block)} class="bzw-footer">
      <strong>${safe(template.niche)}</strong>

      <p>אתר עסקי חכם עם תורים, לידים, חנות, ביקורות וסקשנים מוכנים.</p>

      <nav>
        <a href="#">תנאים</a>
        <a href="#">פרטיות</a>
        <a href="#">צור קשר</a>
      </nav>
    </footer>
  `;
}

function renderGeneric(block: ReadyWebsiteBlock) {
  return `
    <section ${sectionAttrs(block)} class="bzw-section bzw-generic">
      ${titleBlock(block, block.type)}

      <div>
        ${[1, 2, 3]
          .map(
            (index) => `
              <article>
                <span>0${index}</span>
                <h3>${safe(block.title)}</h3>
                <p>${safe(block.text || "תוכן דמו מקצועי להחלפה.")}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBlock(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed) {
  if (block.type === "header") return renderHeader(block, template);
  if (block.type === "hero") return renderHero(block, template);
  if (block.type === "booking") return renderBooking(block);
  if (block.type === "store") return renderStore(block);
  if (block.type === "lead") return renderLead(block);
  if (block.type === "faq") return renderFaq(block);
  if (block.type === "contact") return renderContact(block);
  if (block.type === "footer") return renderFooter(block, template);

  if (block.type === "reviews" || block.type === "testimonials") {
    return renderReviews(block);
  }

  if (
    [
      "services",
      "pricing",
      "process",
      "programs",
      "packages",
      "benefits",
      "areas",
      "emergency",
      "menu",
      "listings",
      "projects",
      "collection",
      "course",
    ].includes(block.type)
  ) {
    return renderServices(block);
  }

  if (
    [
      "gallery",
      "team",
      "clients",
      "results",
      "map",
      "about",
      "story",
      "doctor",
      "artist",
      "offers",
      "trust",
    ].includes(block.type)
  ) {
    return renderGallery(block);
  }

  return renderGeneric(block);
}

export function buildReadyWebsiteCss(palette: ReadyWebsitePalette) {
  return `
    :root {
      --bzw-primary: ${palette.primary};
      --bzw-secondary: ${palette.secondary};
      --bzw-accent: ${palette.accent};
      --bzw-bg: ${palette.background};
      --bzw-surface: ${palette.surface};
      --bzw-text: ${palette.text};
      --bzw-muted: ${palette.muted};
      --bzw-dark: ${palette.dark};
    }

    body {
      margin: 0;
      background: var(--bzw-bg);
      color: var(--bzw-text);
      font-family: Assistant, Heebo, Arial, sans-serif;
    }

    .bzw-site {
      direction: rtl;
      min-height: 100vh;
      background: var(--bzw-bg);
      color: var(--bzw-text);
      font-family: Assistant, Heebo, Arial, sans-serif;
      overflow: hidden;
    }

    .bzw-site * {
      box-sizing: border-box;
    }

    .bzw-site a,
    .bzw-site button {
      font-family: inherit;
      cursor: pointer;
    }

    .bzw-header {
      width: min(1120px, calc(100% - 44px));
      margin: 0 auto;
      padding: 24px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .bzw-header strong {
      font-size: 28px;
      font-weight: 1000;
      color: var(--bzw-primary);
      letter-spacing: -0.06em;
    }

    .bzw-header small {
      display: block;
      margin-top: 4px;
      color: var(--bzw-muted);
      font-weight: 800;
    }

    .bzw-header nav {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }

    .bzw-header nav a {
      text-decoration: none;
      font-size: 13px;
      font-weight: 900;
      color: var(--bzw-muted);
      background: rgba(255, 255, 255, 0.74);
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 999px;
      padding: 9px 13px;
    }

    .bzw-header-center {
      justify-content: center;
    }

    .bzw-header-center strong {
      padding: 14px 24px;
      background: #fff;
      border-radius: 999px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
    }

    .bzw-header-side {
      align-items: flex-start;
    }

    .bzw-header-side nav {
      flex-direction: column;
      align-items: stretch;
      background: #fff;
      padding: 12px;
      border-radius: 26px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
    }

    .bzw-main-btn,
    .bzw-actions a,
    .bzw-services-grid a,
    .bzw-store a,
    .bzw-calendar a,
    .bzw-lead button,
    .bzw-contact-map button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 0;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--bzw-primary), var(--bzw-secondary));
      color: #fff;
      font-weight: 1000;
      padding: 12px 22px;
      text-decoration: none;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.13);
    }

    .bzw-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 26px;
    }

    .bzw-actions .ghost {
      background: #fff;
      color: var(--bzw-primary);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: none;
    }

    .bzw-section {
      width: min(1120px, calc(100% - 44px));
      margin: 0 auto;
      padding: 48px 0;
    }

    .bzw-title {
      margin-bottom: 26px;
    }

    .bzw-title span,
    .bzw-hero-split span,
    .bzw-hero-cards span,
    .bzw-hero-offer span,
    .bzw-hero-overlay span {
      display: inline-flex;
      margin-bottom: 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.78);
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 8px 13px;
      color: var(--bzw-accent);
      font-weight: 1000;
      font-size: 13px;
    }

    .bzw-title h2 {
      margin: 0;
      color: var(--bzw-primary);
      font-size: clamp(30px, 4vw, 58px);
      letter-spacing: -0.07em;
      line-height: 1;
    }

    .bzw-title p,
    .bzw-site p {
      color: var(--bzw-muted);
      font-weight: 800;
      line-height: 1.8;
    }

    .bzw-site h1 {
      margin: 0;
      color: var(--bzw-primary);
      font-size: clamp(42px, 7vw, 96px);
      line-height: 0.92;
      letter-spacing: -0.09em;
    }

    .bzw-site h3 {
      margin: 0 0 8px;
      color: var(--bzw-primary);
      font-size: 22px;
      letter-spacing: -0.04em;
    }

    .bzw-hero-split {
      display: grid;
      grid-template-columns: 1.02fr 0.98fr;
      gap: 34px;
      align-items: center;
      padding-top: 54px;
      padding-bottom: 74px;
    }

    .bzw-hero-image,
    .bzw-hero-cards .photo {
      margin: 0;
      min-height: 460px;
      border-radius: 42px;
      background-size: cover;
      background-position: center;
      box-shadow: 0 28px 80px rgba(15, 23, 42, 0.16);
    }

    .bzw-hero-full {
      position: relative;
      width: 100%;
      min-height: 690px;
      margin: 0;
      padding: 0;
      display: grid;
      place-items: center;
      text-align: center;
    }

    .bzw-hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
    }

    .bzw-hero-bg:after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(0,0,0,.76), rgba(0,0,0,.2));
    }

    .bzw-hero-overlay {
      position: relative;
      width: min(960px, calc(100% - 44px));
      color: #fff;
    }

    .bzw-hero-overlay h1,
    .bzw-hero-overlay p {
      color: #fff;
    }

    .bzw-hero-cards {
      display: grid;
      grid-template-columns: 1fr 0.9fr;
      gap: 30px;
      align-items: center;
    }

    .bzw-floating-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .bzw-floating-cards article {
      min-height: 160px;
      border-radius: 30px;
      background: #fff;
      padding: 24px;
      box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
    }

    .bzw-floating-cards b {
      display: block;
      font-size: 48px;
      color: var(--bzw-primary);
      letter-spacing: -0.06em;
    }

    .bzw-floating-cards small {
      font-weight: 900;
      color: var(--bzw-muted);
    }

    .bzw-floating-cards .photo {
      grid-column: 1 / -1;
    }

    .bzw-hero-offer {
      display: grid;
      grid-template-columns: 1.1fr 0.7fr;
      gap: 28px;
      align-items: center;
    }

    .bzw-hero-offer aside {
      border-radius: 40px;
      background: #fff;
      padding: 34px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
    }

    .bzw-hero-offer aside b {
      display: block;
      font-size: 58px;
      color: var(--bzw-accent);
      letter-spacing: -0.08em;
    }

    .bzw-services-grid > div,
    .bzw-store > div,
    .bzw-reviews > div,
    .bzw-generic > div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .bzw-services-grid article,
    .bzw-store article,
    .bzw-reviews article,
    .bzw-generic article,
    .bzw-services-list article {
      background: #fff;
      border-radius: 28px;
      padding: 24px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.07);
    }

    .bzw-services-grid i {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 18px;
      background: var(--bzw-bg);
      color: var(--bzw-accent);
      font-style: normal;
      font-weight: 1000;
      margin-bottom: 14px;
    }

    .bzw-services-list > div {
      display: grid;
      gap: 14px;
    }

    .bzw-services-list article {
      display: grid;
      grid-template-columns: 70px 1fr auto;
      align-items: center;
      gap: 14px;
    }

    .bzw-services-list span,
    .bzw-services-timeline span,
    .bzw-generic span {
      color: var(--bzw-accent);
      font-size: 32px;
      font-weight: 1000;
    }

    .bzw-services-list b {
      color: var(--bzw-primary);
      font-size: 22px;
    }

    .bzw-services-timeline article {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(15, 23, 42, 0.1);
    }

    .bzw-gallery-grid > div,
    .bzw-gallery-masonry > div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .bzw-gallery-grid figure,
    .bzw-gallery-masonry figure,
    .bzw-gallery-slider figure {
      margin: 0;
      min-height: 220px;
      border-radius: 30px;
      background-size: cover;
      background-position: center;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
    }

    .bzw-gallery-masonry .tall-1 {
      min-height: 340px;
    }

    .bzw-gallery-slider > div {
      display: flex;
      gap: 16px;
      overflow: hidden;
    }

    .bzw-gallery-slider figure {
      min-width: 290px;
    }

    .bzw-booking-card,
    .bzw-booking-wide {
      display: grid;
      grid-template-columns: 0.8fr 1fr;
      gap: 24px;
      align-items: center;
    }

    .bzw-booking-wide {
      grid-template-columns: 0.65fr 1.35fr;
    }

    .bzw-calendar {
      background: #fff;
      border-radius: 34px;
      padding: 24px;
      box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .bzw-calendar .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }

    .bzw-calendar .days button,
    .bzw-calendar .times button {
      border: 0;
      background: var(--bzw-bg);
      color: var(--bzw-primary);
      border-radius: 999px;
      padding: 11px;
      font-weight: 1000;
    }

    .bzw-calendar .days button.active,
    .bzw-calendar .times button:hover {
      background: var(--bzw-primary);
      color: #fff;
    }

    .bzw-calendar .times {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .bzw-calendar a {
      width: 100%;
      margin-top: 16px;
    }

    .bzw-store article .product-image {
      height: 130px;
      border-radius: 22px;
      background: linear-gradient(135deg, var(--bzw-bg), #fff);
      margin-bottom: 16px;
    }

    .bzw-store b {
      display: block;
      color: var(--bzw-accent);
      font-size: 25px;
      margin-bottom: 12px;
    }

    .bzw-lead {
      display: grid;
      grid-template-columns: 1fr 0.9fr;
      gap: 24px;
      align-items: center;
      background: linear-gradient(135deg, var(--bzw-primary), var(--bzw-secondary));
      border-radius: 42px;
      padding: 38px;
      color: #fff;
    }

    .bzw-lead .bzw-title h2,
    .bzw-lead .bzw-title p {
      color: #fff;
    }

    .bzw-lead form,
    .bzw-contact-map form {
      display: grid;
      gap: 10px;
      background: #fff;
      border-radius: 30px;
      padding: 18px;
    }

    .bzw-lead input,
    .bzw-lead textarea,
    .bzw-contact-map input {
      width: 100%;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 16px;
      padding: 14px;
      font-family: inherit;
      font-weight: 800;
    }

    .bzw-faq details {
      background: #fff;
      border-radius: 22px;
      margin: 10px 0;
      padding: 18px;
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .bzw-faq summary {
      cursor: pointer;
      font-weight: 1000;
      color: var(--bzw-primary);
    }

    .bzw-contact {
      padding-bottom: 64px;
      text-align: center;
    }

    .bzw-contact > div {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .bzw-contact a {
      background: #fff;
      border-radius: 999px;
      padding: 13px 22px;
      font-weight: 1000;
      color: var(--bzw-primary);
      text-decoration: none;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.11);
    }

    .bzw-contact-map {
      display: grid;
      grid-template-columns: 0.7fr 1fr 0.8fr;
      gap: 18px;
      align-items: stretch;
    }

    .bzw-contact-map .map {
      border-radius: 30px;
      background: linear-gradient(135deg, var(--bzw-primary), var(--bzw-accent));
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 1000;
    }

    .bzw-footer {
      width: min(1120px, calc(100% - 44px));
      margin: 0 auto;
      padding: 34px 0 54px;
      border-top: 1px solid rgba(15, 23, 42, 0.08);
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      flex-wrap: wrap;
    }

    .bzw-footer strong {
      color: var(--bzw-primary);
      font-size: 24px;
      font-weight: 1000;
    }

    .bzw-footer nav {
      display: flex;
      gap: 12px;
    }

    .bzw-footer a {
      color: var(--bzw-muted);
      font-weight: 900;
      text-decoration: none;
    }

    .bzw-layout-dark,
    .bzw-layout-darkSplit,
    .bzw-layout-darkGallery {
      background: #070a12;
      color: #fff;
    }

    .bzw-layout-dark h1,
    .bzw-layout-darkSplit h1,
    .bzw-layout-darkGallery h1,
    .bzw-layout-dark h2,
    .bzw-layout-darkSplit h2,
    .bzw-layout-darkGallery h2,
    .bzw-layout-dark .bzw-header strong,
    .bzw-layout-darkSplit .bzw-header strong,
    .bzw-layout-darkGallery .bzw-header strong {
      color: #fff;
    }

    .bzw-layout-bold .bzw-hero-split,
    .bzw-layout-offer .bzw-hero-offer {
      width: 100%;
      padding-inline: max(22px, calc((100% - 1120px) / 2));
      background: linear-gradient(135deg, var(--bzw-primary), var(--bzw-accent));
      border-radius: 0 0 60px 60px;
    }

    .bzw-layout-bold .bzw-hero-split h1,
    .bzw-layout-bold .bzw-hero-split p,
    .bzw-layout-bold .bzw-hero-split span {
      color: #fff;
    }

    @media (max-width: 900px) {
      .bzw-header,
      .bzw-hero-split,
      .bzw-hero-cards,
      .bzw-hero-offer,
      .bzw-booking-card,
      .bzw-booking-wide,
      .bzw-lead,
      .bzw-contact-map {
        grid-template-columns: 1fr;
        flex-direction: column;
      }

      .bzw-services-grid > div,
      .bzw-store > div,
      .bzw-reviews > div,
      .bzw-generic > div,
      .bzw-gallery-grid > div,
      .bzw-gallery-masonry > div {
        grid-template-columns: 1fr;
      }

      .bzw-services-list article {
        grid-template-columns: 1fr;
      }

      .bzw-hero-image,
      .bzw-hero-cards .photo {
        min-height: 300px;
      }
    }
  `;
}

export function buildReadyWebsiteHtml(seed: ReadyWebsiteTemplateSeed) {
  return `
    <main
      dir="rtl"
      class="bzw-site bzw-layout-${safe(seed.layout)}"
      data-bizuply-site="true"
      data-template-id="${safe(seed.id)}"
      style="
        --bzw-primary:${seed.palette.primary};
        --bzw-secondary:${seed.palette.secondary};
        --bzw-accent:${seed.palette.accent};
        --bzw-bg:${seed.palette.background};
        --bzw-surface:${seed.palette.surface};
        --bzw-text:${seed.palette.text};
        --bzw-muted:${seed.palette.muted};
        --bzw-dark:${seed.palette.dark};
      "
    >
      ${seed.blocks.map((block) => renderBlock(block, seed)).join("")}
    </main>
  `;
}

export function buildReadyWebsiteTemplate(
  seed: ReadyWebsiteTemplateSeed
): ReadyWebsiteTemplate {
  const html = buildReadyWebsiteHtml(seed);
  const css = buildReadyWebsiteCss(seed.palette);

  return {
    ...seed,
    html,
    css,
    preview: html,
  };
}