import type {
  ReadyWebsiteBlock,
  ReadyWebsiteEditorPage,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

export const velmoraProducts = [
  {
    id: "linen-coat",
    ref: "REF. VLM-24001",
    title: "מעיל פשתן נקי",
    subtitle: "גזרה ישרה, בד טבעי, מראה על־זמני",
    price: "₪520",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "white-dress",
    ref: "REF. VLM-24002",
    title: "שמלת ערב רכה",
    subtitle: "בד נשפך, קו נקי, מתאים לאירוע או ערב",
    price: "₪340",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "atelier-shirt",
    ref: "REF. VLM-24003",
    title: "חולצת אטלייה לבנה",
    subtitle: "פריט בסיס איכותי למלתחה מדויקת",
    price: "₪190",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "black-set",
    ref: "REF. VLM-24004",
    title: "סט שחור מחויט",
    subtitle: "שכבות נקיות, גזרה חדה, מראה מקצועי",
    price: "₪460",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "leather-bag",
    ref: "REF. VLM-24005",
    title: "תיק עור קלאסי",
    subtitle: "אקססורי נקי שמשלים כל לוק",
    price: "₪260",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "cream-look",
    ref: "REF. VLM-24006",
    title: "לוק שמנת מלא",
    subtitle: "סטיילינג רגוע, טבעי ונקי",
    price: "₪390",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
  },
];

export const velmoraGallery = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=90",
];

export const velmoraProjects = [
  {
    title: "קולקציית קיץ 2025",
    text: "קולקציה נקייה עם בדים טבעיים, צבעים רכים וגזרות שמתאימות לשימוש יום־יומי.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=90",
  },
  {
    title: "סטיילינג אישי",
    text: "שירות התאמת פריטים לפי סגנון, צורך, מבנה גוף ואירועים קרובים.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=90",
  },
  {
    title: "קולקציית ערב",
    text: "פריטים אלגנטיים בגוונים עמוקים, גזרות מחויטות ובדים נעימים.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=90",
  },
];

export const velmoraPalette: ReadyWebsitePalette = {
  primary: "#2F241B",
  secondary: "#6D5A49",
  accent: "#B88A52",
  background: "#F6F2EA",
  surface: "#FFFFFF",
  text: "#27231F",
  muted: "#756B60",
  dark: "#17120D",
};

export const velmoraCss = `
:root {
  --velmora-primary: #2F241B;
  --velmora-secondary: #6D5A49;
  --velmora-accent: #B88A52;
  --velmora-bg: #F6F2EA;
  --velmora-surface: #FFFFFF;
  --velmora-text: #27231F;
  --velmora-muted: #756B60;
  --velmora-dark: #17120D;
}

body {
  margin: 0;
}

.velmora-site {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--velmora-bg);
  color: var(--velmora-text);
  font-family: Inter, Assistant, Arial, sans-serif;
}

.velmora-serif {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 400;
  letter-spacing: -0.06em;
}

.velmora-link,
.velmora-button {
  cursor: pointer;
}

.velmora-reveal-up {
  animation: velmoraRevealUp 0.85s cubic-bezier(.2,.8,.2,1) both;
}

.velmora-reveal-delay-1 { animation-delay: 0.08s; }
.velmora-reveal-delay-2 { animation-delay: 0.16s; }
.velmora-reveal-delay-3 { animation-delay: 0.24s; }

.velmora-float-soft {
  animation: velmoraFloatSoft 5.4s ease-in-out infinite;
}

.velmora-float-soft-delay {
  animation: velmoraFloatSoft 5.4s ease-in-out infinite;
  animation-delay: 0.8s;
}

.velmora-soft-pulse {
  animation: velmoraSoftPulse 5.6s ease-in-out infinite;
}

.velmora-marquee-track {
  animation: velmoraMarquee 30s linear infinite;
}

.velmora-product-card img,
.velmora-collection-card img,
.velmora-lookbook-card img {
  transition: transform .75s cubic-bezier(.2,.8,.2,1), filter .75s ease;
}

.velmora-product-card:hover img,
.velmora-collection-card:hover img,
.velmora-lookbook-card:hover img {
  transform: scale(1.055);
  filter: saturate(1.06) contrast(1.03);
}

@keyframes velmoraRevealUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes velmoraFloatSoft {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(-1deg); }
}

@keyframes velmoraSoftPulse {
  0%, 100% { opacity: .55; transform: scale(1); }
  50% { opacity: .9; transform: scale(1.08); }
}

@keyframes velmoraMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

[data-section-kind] {
  scroll-margin-top: 120px;
}
`;

function productCardsHtml(limit = 6) {
  return velmoraProducts
    .slice(0, limit)
    .map(
      (product) => `
<article data-section-kind="product" data-section-title="${product.title}" class="velmora-product-card group overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_22px_65px_rgba(39,35,31,.08)]">
  <div class="overflow-hidden bg-[#EAE0D1]">
    <img data-gjs-type="image" src="${product.image}" alt="${product.title}" class="h-[370px] w-full object-cover" />
  </div>
  <div class="p-6">
    <p data-gjs-type="text" class="text-[11px] font-black uppercase tracking-[0.22em] text-black/35">${product.ref}</p>
    <h3 data-gjs-type="text" class="mt-3 text-2xl font-black text-[#27231F]">${product.title}</h3>
    <p data-gjs-type="text" class="mt-2 text-sm leading-6 text-black/50">${product.subtitle}</p>
    <div class="mt-5 flex items-center justify-between gap-4">
      <p data-gjs-type="text" class="text-lg font-black text-[#27231F]">${product.price}</p>
      <a data-editable-link="true" href="#product" class="velmora-button rounded-full bg-[#27231F] px-5 py-3 text-xs font-black text-white">צפייה</a>
    </div>
  </div>
</article>`,
    )
    .join("\n");
}

function shell(content: string) {
  return `
<main data-studio-page="true" data-bizuply-site="true" data-template-id="velmora" dir="rtl" class="velmora-site">
  <header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-50 px-4 py-4 backdrop-blur-xl" style="background:rgba(246,242,234,.88)">
    <div class="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center rounded-[18px] border border-black/10 bg-white/90 px-5 py-3 shadow-[0_18px_55px_rgba(39,35,31,.12)]">
      <nav class="hidden items-center gap-8 text-sm font-bold text-black/55 lg:flex">
        <a data-editable-link="true" href="#about" class="velmora-link hover:text-black">אודות</a>
        <a data-editable-link="true" href="#collections" class="velmora-link hover:text-black">קולקציות</a>
        <a data-editable-link="true" href="#shop" class="velmora-link hover:text-black">חנות</a>
      </nav>
      <div class="text-center">
        <div data-gjs-type="text" class="velmora-serif text-[30px] uppercase tracking-[0.08em] text-[#27231F]">ATELIER NOA</div>
        <div data-gjs-type="text" class="mt-1 text-[10px] font-black uppercase tracking-[0.30em] text-black/45">Boutique</div>
      </div>
      <nav class="hidden items-center justify-end gap-8 text-sm font-bold text-black/55 lg:flex">
        <a data-editable-link="true" href="#styling" class="velmora-link hover:text-black">סטיילינג</a>
        <a data-editable-link="true" href="#contact" class="velmora-link hover:text-black">צור קשר</a>
        <a data-editable-link="true" href="#cart" class="velmora-button rounded-full bg-[#27231F] px-5 py-3 text-white hover:bg-black">סל קניות</a>
      </nav>
    </div>
  </header>

  ${content}

  <footer data-section-kind="footer" data-section-title="Footer" class="border-t border-black/10 bg-[#E8DFCF] px-6 py-16">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
      <section>
        <div data-gjs-type="text" class="velmora-serif text-5xl uppercase tracking-[0.08em]">ATELIER NOA</div>
        <p data-gjs-type="text" class="mt-5 max-w-md text-sm leading-8 text-black/55">אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה לכל קהל יעד.</p>
      </section>
      <section><h3 data-gjs-type="text" class="mb-4 border-b border-black/10 pb-3 text-sm font-black">עמודי האתר</h3><div class="grid gap-3 text-sm text-black/55"><a data-editable-link="true">בית</a><a data-editable-link="true">אודות</a><a data-editable-link="true">חנות</a><a data-editable-link="true">קולקציות</a><a data-editable-link="true">סטיילינג</a><a data-editable-link="true">צור קשר</a></div></section>
      <section><h3 data-gjs-type="text" class="mb-4 border-b border-black/10 pb-3 text-sm font-black">מידע חשוב</h3><div class="grid gap-3 text-sm text-black/55"><a data-editable-link="true">תקנון אתר</a><a data-editable-link="true">מדיניות פרטיות</a><a data-editable-link="true">נגישות</a></div></section>
      <section><h3 data-gjs-type="text" class="mb-4 border-b border-black/10 pb-3 text-sm font-black">שירות לקוחות</h3><div class="grid gap-3 text-sm text-black/55"><a data-editable-link="true">שאלות נפוצות</a><a data-editable-link="true">משלוחים והחזרות</a><a data-editable-link="true">שירות והזמנות</a></div><a data-editable-link="true" href="#contact" class="mt-6 inline-flex rounded-full bg-[#27231F] px-5 py-3 text-sm font-bold text-white">יצירת קשר</a></section>
    </div>
  </footer>
</main>`;
}

export const velmoraHomeHtml = shell(`
<section id="hero" data-section-kind="hero" data-section-title="Hero" class="relative overflow-hidden px-6 pb-20 pt-24">
  <div class="velmora-soft-pulse absolute -right-20 top-24 h-[360px] w-[360px] rounded-full bg-[#D9C4A6] blur-[90px]"></div>
  <div class="velmora-soft-pulse absolute -left-20 top-[330px] h-[300px] w-[300px] rounded-full bg-[#B88A52]/45 blur-[90px]"></div>
  <div class="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
    <div class="text-right">
      <p data-gjs-type="text" class="velmora-reveal-up text-sm font-black uppercase tracking-[0.28em] text-black/40">בוטיק אופנה · סטיילינג אישי · קולקציות נבחרות</p>
      <h1 data-gjs-type="text" class="velmora-serif velmora-reveal-up velmora-reveal-delay-1 mt-7 max-w-3xl text-[76px] leading-[0.9] text-[#2F241B] md:text-[116px]">אופנה שמרגישה בדיוק נכון</h1>
      <p data-gjs-type="text" class="velmora-reveal-up velmora-reveal-delay-2 mt-7 max-w-2xl text-lg leading-9 text-black/55">בוטיק אופנה נקי, יוקרתי וגמיש לעריכה מלאה בתוך BizUply — עם חנות, קולקציות, מוצרים, גלריה וטפסים.</p>
      <div class="velmora-reveal-up velmora-reveal-delay-3 mt-9 flex flex-wrap gap-3">
        <a data-editable-link="true" href="#shop" class="velmora-button rounded-full bg-[#27231F] px-8 py-4 text-sm font-black text-white shadow-xl shadow-black/10">לכל הקולקציות</a>
        <a data-editable-link="true" href="#styling" class="velmora-button rounded-full border border-black/15 bg-white/65 px-8 py-4 text-sm font-black text-[#27231F]">ייעוץ סטיילינג</a>
      </div>
    </div>

    <div class="relative min-h-[650px]">
      <img data-gjs-type="image" src="${velmoraGallery[1]}" class="velmora-float-soft absolute right-0 top-20 h-[360px] w-[250px] rounded-t-[130px] object-cover shadow-[0_35px_95px_rgba(39,35,31,.22)]" />
      <img data-gjs-type="image" src="${velmoraGallery[0]}" class="velmora-float-soft-delay absolute left-0 top-0 h-[620px] w-[430px] rounded-b-[150px] rounded-t-[34px] object-cover shadow-[0_45px_120px_rgba(39,35,31,.24)]" />
      <div class="absolute bottom-10 right-24 max-w-[260px] rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(39,35,31,.18)] backdrop-blur-xl">
        <p data-gjs-type="text" class="text-[11px] font-black uppercase tracking-[0.22em] text-black/35">New Drop</p>
        <h3 data-gjs-type="text" class="velmora-serif mt-2 text-4xl text-[#2F241B]">קולקציה חדשה</h3>
        <p data-gjs-type="text" class="mt-3 text-sm leading-6 text-black/55">פריטים נקיים ליום־יום, לאירועים ולסטיילינג אישי.</p>
      </div>
    </div>
  </div>
</section>

<section id="collections" data-section-kind="collection" data-section-title="Collections" class="bg-white px-6 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">Collections</p><h2 data-gjs-type="text" class="velmora-serif mt-4 text-6xl text-[#2F241B]">קולקציות שנבחרו בקפידה</h2></div>
      <a data-editable-link="true" href="#shop" class="rounded-full border border-black/15 px-6 py-3 text-sm font-black">מעבר לחנות</a>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      ${velmoraProjects
        .map(
          (project) => `<article data-section-kind="projects" data-section-title="${project.title}" class="velmora-collection-card overflow-hidden rounded-[32px] bg-[#F6F2EA] shadow-sm"><div class="overflow-hidden"><img data-gjs-type="image" src="${project.image}" class="h-[430px] w-full object-cover" /></div><div class="p-7"><h3 data-gjs-type="text" class="velmora-serif text-4xl text-[#2F241B]">${project.title}</h3><p data-gjs-type="text" class="mt-4 text-sm leading-7 text-black/55">${project.text}</p></div></article>`,
        )
        .join("\n")}
    </div>
  </div>
</section>

<section id="shop" data-section-kind="store" data-section-title="Products" class="bg-[#F6F2EA] px-6 py-24">
  <div class="mx-auto max-w-7xl">
    <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">Shop</p>
    <h2 data-gjs-type="text" class="velmora-serif mt-4 text-6xl text-[#2F241B]">מוצרים נבחרים</h2>
    <div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">${productCardsHtml(6)}</div>
  </div>
</section>

<section id="lookbook" data-section-kind="gallery" data-section-title="Lookbook" class="overflow-hidden bg-white py-24">
  <div class="px-6"><h2 data-gjs-type="text" class="velmora-serif mx-auto max-w-7xl text-6xl text-[#2F241B]">Lookbook בתנועה</h2></div>
  <div class="mt-12 overflow-hidden"><div class="velmora-marquee-track flex w-max gap-5 px-6">${[...velmoraGallery, ...velmoraGallery]
    .map(
      (image) => `<img data-gjs-type="image" class="velmora-lookbook-card h-[370px] w-[265px] shrink-0 rounded-[28px] object-cover shadow-lg" src="${image}" />`,
    )
    .join("\n")}</div></div>
</section>

<section id="about" data-section-kind="about" data-section-title="About" class="grid min-h-[760px] bg-[#F6F2EA] lg:grid-cols-2">
  <div class="flex flex-col justify-between px-8 py-20 lg:px-16"><div><p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">About</p><h2 data-gjs-type="text" class="velmora-serif mt-8 max-w-xl text-6xl leading-tight text-[#2F241B]">סגנון שמתחיל בפרטים הקטנים</h2></div><div class="grid gap-8 text-base leading-8 text-black/55 md:grid-cols-2"><p data-gjs-type="text">כאן אפשר לערוך את סיפור המותג, החזון והסגנון של העסק.</p><p data-gjs-type="text">העמוד בנוי מבלוקים שניתנים לבחירה, שינוי, מחיקה ושכפול.</p></div></div>
  <img data-gjs-type="image" class="h-full min-h-[620px] w-full object-cover" src="${velmoraGallery[5]}" />
</section>

<section id="features" data-section-kind="benefits" data-section-title="Features" class="bg-white px-6 py-24">
  <div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
    ${["משלוחים מהירים", "סטיילינג אישי", "חנות מלאה"].map((item, index) => `<article class="rounded-[28px] border border-black/10 bg-[#F6F2EA] p-8"><p class="text-sm font-black text-black/35">0${index + 1}</p><h3 data-gjs-type="text" class="velmora-serif mt-5 text-4xl text-[#2F241B]">${item}</h3><p data-gjs-type="text" class="mt-4 text-sm leading-7 text-black/55">בלוק יתרון לעריכה מלאה, מתאים להצגת ערך מוסף של העסק.</p></article>`).join("\n")}
  </div>
</section>

<section id="faq" data-section-kind="faq" data-section-title="FAQ" class="bg-[#F6F2EA] px-6 py-24">
  <div class="mx-auto max-w-4xl"><p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">FAQ</p><h2 data-gjs-type="text" class="velmora-serif mt-4 text-6xl text-[#2F241B]">שאלות נפוצות</h2><div class="mt-10 grid gap-4">${["איך מזמינים?", "האם אפשר להחליף מידה?", "האם יש סטיילינג אישי?"].map((q) => `<details class="rounded-[24px] border border-black/10 bg-white p-6"><summary data-gjs-type="text" class="cursor-pointer text-lg font-black">${q}</summary><p data-gjs-type="text" class="mt-4 text-sm leading-7 text-black/55">כאן עורכים תשובה מלאה לשאלה.</p></details>`).join("\n")}</div></div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="bg-white px-6 py-24">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">Contact</p><h2 data-gjs-type="text" class="velmora-serif mt-5 text-6xl text-[#2F241B]">יצירת קשר</h2><p data-gjs-type="text" class="mt-6 text-lg leading-9 text-black/55">אפשר לערוך כאן פרטי עסק, טופס, שעות פעילות וקישורים.</p></div><form class="grid gap-4 rounded-[28px] border border-black/10 bg-[#F6F2EA] p-7"><input class="h-14 rounded-xl border border-black/10 bg-white px-4 text-sm" placeholder="שם מלא" /><input class="h-14 rounded-xl border border-black/10 bg-white px-4 text-sm" placeholder="טלפון" /><input class="h-14 rounded-xl border border-black/10 bg-white px-4 text-sm" placeholder="אימייל" /><textarea class="min-h-[140px] rounded-xl border border-black/10 bg-white p-4 text-sm" placeholder="הודעה"></textarea><button class="h-14 rounded-xl bg-[#27231F] font-black text-white">שליחה</button></form></div>
</section>`);

function infoPage(title: string, eyebrow: string) {
  return shell(`<section data-section-kind="basic" data-section-title="${title}" class="bg-[#F6F2EA] px-6 py-24"><div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]"><aside class="h-fit rounded-[28px] border border-black/10 bg-white/70 p-6 shadow-xl"><p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.22em] text-black/35">${eyebrow}</p><h1 data-gjs-type="text" class="velmora-serif mt-4 text-5xl text-[#2F241B]">${title}</h1><p data-gjs-type="text" class="mt-4 text-sm leading-7 text-black/55">עמוד דוגמה לעריכה מלאה בעורך.</p></aside><article class="rounded-[28px] border border-black/10 bg-white p-10 shadow-xl"><p data-gjs-type="text" class="text-sm tracking-[0.26em] text-black/40">${eyebrow}</p><h2 data-gjs-type="text" class="velmora-serif mt-5 text-6xl text-[#2F241B]">${title}</h2><p data-gjs-type="text" class="mt-8 max-w-3xl text-lg leading-9 text-black/60">כאן מחליפים את התוכן לטקסט אמיתי של העסק. המבנה כולל כותרת, פתיח, סעיפים, כרטיסים וכפתורי מעבר.</p>${["כללי", "פרטים חשובים", "יצירת קשר", "עדכון אחרון"].map((item, i) => `<section data-section-kind="basic" data-section-title="${item}" class="mt-8 border-t border-black/10 pt-7"><h3 data-gjs-type="text" class="velmora-serif text-4xl">${i + 1}. ${item}</h3><p data-gjs-type="text" class="mt-4 leading-8 text-black/55">טקסט דוגמה בלבד. ניתן לערוך, למחוק, לשכפל ולהוסיף בלוקים נוספים.</p></section>`).join("")}</article></div></section>`);
}

export const velmoraShopHtml = shell(`<section id="shop" data-section-kind="store" data-section-title="Shop Page" class="bg-[#F6F2EA] px-6 py-24"><div class="mx-auto max-w-7xl"><p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.22em] text-black/35">Shop</p><h1 data-gjs-type="text" class="velmora-serif mt-5 text-7xl text-[#2F241B]">חנות</h1><p data-gjs-type="text" class="mt-6 max-w-2xl text-lg leading-9 text-black/55">עמוד חנות מלא לדוגמה עם מוצרים, מחירים ותמונות להחלפה.</p><div class="mt-12 grid gap-6 md:grid-cols-3 xl:grid-cols-4">${productCardsHtml(6)}${productCardsHtml(6)}</div></div></section>`);

export const velmoraEditorPages: ReadyWebsiteEditorPage[] = [
  { id: "home", title: "דף הבית", slug: "", type: "home", isHome: true, html: velmoraHomeHtml, css: velmoraCss },
  { id: "shop", title: "חנות", slug: "shop", type: "store", html: velmoraShopHtml, css: velmoraCss },
  { id: "product", title: "עמוד מוצר", slug: "product", type: "product", html: infoPage("עמוד מוצר", "PRODUCT"), css: velmoraCss },
  { id: "about", title: "אודות", slug: "about", type: "about", html: infoPage("אודות", "ABOUT"), css: velmoraCss },
  { id: "collections", title: "קולקציות", slug: "collections", type: "gallery", html: infoPage("קולקציות", "COLLECTIONS"), css: velmoraCss },
  { id: "styling", title: "סטיילינג", slug: "styling", type: "service", html: infoPage("סטיילינג אישי", "CUSTOM"), css: velmoraCss },
  { id: "contact", title: "צור קשר", slug: "contact", type: "contact", html: infoPage("צור קשר", "CONTACT"), css: velmoraCss },
  { id: "cart", title: "סל קניות", slug: "cart", type: "blank", html: infoPage("סל קניות", "CART"), css: velmoraCss },
  { id: "terms", title: "תקנון אתר", slug: "terms", type: "blank", html: infoPage("תקנון אתר", "TERMS"), css: velmoraCss },
  { id: "privacy", title: "מדיניות פרטיות", slug: "privacy", type: "blank", html: infoPage("מדיניות פרטיות", "PRIVACY"), css: velmoraCss },
  { id: "accessibility", title: "נגישות", slug: "accessibility", type: "blank", html: infoPage("נגישות", "ACCESSIBILITY"), css: velmoraCss },
  { id: "faq", title: "שאלות נפוצות", slug: "faq", type: "blank", html: infoPage("שאלות נפוצות", "FAQ"), css: velmoraCss },
  { id: "shipping", title: "משלוחים והחזרות", slug: "shipping", type: "blank", html: infoPage("משלוחים והחזרות", "SHIPPING"), css: velmoraCss },
  { id: "orders", title: "שירות והזמנות", slug: "orders", type: "blank", html: infoPage("שירות והזמנות", "ORDERS"), css: velmoraCss },
];

export const velmoraBlocks: ReadyWebsiteBlock[] = [
  { id: "header", type: "header", variant: "luxury-centered", title: "Header" },
  { id: "hero", type: "hero", variant: "fashion-editorial", title: "Hero" },
  { id: "collections", type: "collection", variant: "editorial-cards", title: "Collections" },
  { id: "shop", type: "store", variant: "product-grid", title: "Shop" },
  { id: "lookbook", type: "gallery", variant: "moving-marquee", title: "Lookbook" },
  { id: "about", type: "about", variant: "split-image", title: "About" },
  { id: "features", type: "benefits", variant: "three-cards", title: "Features" },
  { id: "faq", type: "faq", variant: "accordion", title: "FAQ" },
  { id: "contact", type: "contact", variant: "form", title: "Contact" },
  { id: "footer", type: "footer", variant: "columns", title: "Footer" },
];

export const velmoraSeed: ReadyWebsiteTemplateSeed = {
  id: "velmora",
  name: "Velmora",
  category: "fashion",
  description: "תבנית בוטיק אופנה יוקרתית עם חנות, קולקציות, לוקבוק ועמודי מידע.",
  niche: "Fashion Boutique",
  layout: "Editorial Ecommerce",
  image:
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=90",
  heroTitle: "אופנה שמרגישה בדיוק נכון",
  heroSubtitle:
    "בוטיק אופנה נקי, יוקרתי וגמיש לעריכה מלאה בתוך BizUply — עם חנות, קולקציות, מוצרים, גלריה וטפסים.",
  palette: velmoraPalette,
  blocks: velmoraBlocks,
  html: velmoraHomeHtml,
  css: velmoraCss,
  preview: velmoraHomeHtml,
  editor: {
    css: velmoraCss,
    pages: velmoraEditorPages,
  },
};
