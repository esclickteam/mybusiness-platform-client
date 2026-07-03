import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { lunelleEditorCss } from "./editorCss";

export const lunelleImages = {
  hero:
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=90",
  manicure:
    "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=90",
  pedicure:
    "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=90",
  studio:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=90",
  nailArt:
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=1200&q=90",
  hands:
    "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=90",
  polish:
    "https://images.unsplash.com/photo-1599206676335-193c82b13c9e?auto=format&fit=crop&w=1200&q=90",
  tools:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=90",
};

export const lunelleServices = [
  {
    title: "מניקור קלאסי",
    price: "₪120",
    time: "45 דקות",
    text: "עיצוב צורה, ניקוי עדין, טיפוח קוטיקולה וגימור נקי.",
    image: lunelleImages.manicure,
  },
  {
    title: "לק ג׳ל",
    price: "₪180",
    time: "60 דקות",
    text: "מריחה מדויקת, ברק גבוה, צבע עמיד ומראה נקי.",
    image: lunelleImages.hands,
  },
  {
    title: "מבנה אנטומי",
    price: "₪230",
    time: "75 דקות",
    text: "חיזוק טבעי לציפורן, מבנה יפה ועמידות גבוהה יותר.",
    image: lunelleImages.polish,
  },
  {
    title: "פדיקור עדין",
    price: "₪190",
    time: "70 דקות",
    text: "טיפול לכף הרגל, ניקוי, שיוף וגימור אסתטי.",
    image: lunelleImages.pedicure,
  },
  {
    title: "עיצובי נייל ארט",
    price: "מ־₪30",
    time: "תוספת",
    text: "פרנץ׳, כרום, קווים עדינים, אבנים ועיצובים אישיים.",
    image: lunelleImages.nailArt,
  },
  {
    title: "הסרת ג׳ל",
    price: "₪60",
    time: "30 דקות",
    text: "הסרה עדינה ששומרת על הציפורן וסיום בשמן הזנה.",
    image: lunelleImages.tools,
  },
];

export const lunelleGallery = [
  lunelleImages.hero,
  lunelleImages.manicure,
  lunelleImages.nailArt,
  lunelleImages.hands,
  lunelleImages.pedicure,
  lunelleImages.polish,
  lunelleImages.studio,
  lunelleImages.tools,
];

export const lunelleTestimonials = [
  {
    name: "מאי",
    text: "העבודה הכי נקייה שעשו לי. הכל רגוע, מדויק והלק נשאר מושלם.",
  },
  {
    name: "שיר",
    text: "הגעתי עם תמונה והיא עשתה לי אפילו יותר יפה. עדין, נקי ויוקרתי.",
  },
  {
    name: "דניאל",
    text: "פדיקור מושלם, יחס אישי וסטודיו רגוע ברמות.",
  },
];

export const lunelleFaq = [
  {
    question: "כמה זמן מחזיק לק ג׳ל?",
    answer:
      "בדרך כלל בין שבועיים לשלושה, תלוי בציפורן, בשגרה ובשמירה על ההנחיות אחרי הטיפול.",
  },
  {
    question: "צריך להגיע עם רעיון לעיצוב?",
    answer:
      "לא חובה. אפשר להגיע בלי רעיון ונבחר יחד צבע, צורה וסגנון שמתאים לך.",
  },
  {
    question: "אפשר לקבוע תור לפדיקור בלבד?",
    answer:
      "כן. אפשר לבחור טיפול יחיד או לשלב מניקור, פדיקור ועיצוב באותו תור.",
  },
  {
    question: "האם יש הסרת ג׳ל?",
    answer:
      "כן, ההסרה נעשית בעדינות ובצורה ששומרת על הציפורן הטבעית.",
  },
];

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-50 border-b border-[#2a171c]/10 bg-[#fff7f1]/90 px-5 py-5 backdrop-blur-2xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a data-gjs-type="text" data-editable-link="true" href="#home" class="text-2xl font-black tracking-[-0.05em] text-[#2a171c]">
      Lunelle Studio
    </a>

    <nav class="hidden items-center gap-8 text-sm font-bold text-[#2a171c]/60 lg:flex">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#services">שירותים</a>
      <a data-editable-link="true" href="#gallery">גלריה</a>
      <a data-editable-link="true" href="#prices">מחירים</a>
      <a data-editable-link="true" href="#booking">קביעת תור</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2a171c] px-7 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(42,23,28,.16)]">
      קביעת תור
    </a>
  </div>
</header>
`;
}

function footerHtml() {
  return `
<footer data-section-kind="footer" data-section-title="Footer" class="bg-[#2a171c] px-6 py-14 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
    <div>
      <p data-gjs-type="text" class="text-3xl font-black tracking-[-0.05em]">Lunelle Studio</p>
      <p data-gjs-type="text" class="mt-4 max-w-md text-sm leading-7 text-white/60">
        סטודיו בוטיק למניקור, פדיקור, לק ג׳ל ועיצובי ציפורניים עדינים.
      </p>
    </div>

    <div>
      <p data-gjs-type="text" class="font-black">ניווט</p>
      <div class="mt-4 grid gap-3 text-sm text-white/60">
        <a data-editable-link="true" href="#services">שירותים</a>
        <a data-editable-link="true" href="#gallery">גלריה</a>
        <a data-editable-link="true" href="#prices">מחירים</a>
        <a data-editable-link="true" href="#booking">קביעת תור</a>
      </div>
    </div>

    <div>
      <p data-gjs-type="text" class="font-black">יצירת קשר</p>
      <div class="mt-4 grid gap-3 text-sm text-white/60">
        <p data-gjs-type="text">052-0000000</p>
        <p data-gjs-type="text">hello@lunelle-studio.com</p>
        <p data-gjs-type="text">ראשון עד חמישי, 09:00-19:00</p>
      </div>
    </div>
  </div>
</footer>
`;
}

function servicesCardsHtml() {
  return lunelleServices
    .map(
      (service) => `
<article data-section-kind="service-card" data-section-title="${service.title}" class="lunelle-card lunelle-shine overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]">
  <div class="overflow-hidden bg-[#f1d7dc]">
    <img data-gjs-type="image" src="${service.image}" alt="${service.title}" class="lunelle-image-hover h-[300px] w-full object-cover" />
  </div>
  <div class="p-7">
    <div class="flex items-start justify-between gap-4">
      <h3 data-gjs-type="text" class="text-2xl font-black tracking-[-0.04em] text-[#2a171c]">${service.title}</h3>
      <div class="shrink-0 rounded-full bg-[#fff1e7] px-4 py-2 text-sm font-black text-[#8a4f5f]">${service.price}</div>
    </div>
    <p data-gjs-type="text" class="mt-2 text-xs font-black tracking-[0.16em] text-[#2a171c]/40">${service.time}</p>
    <p data-gjs-type="text" class="mt-4 text-sm leading-7 text-[#2a171c]/60">${service.text}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function galleryHtml() {
  return lunelleGallery
    .map(
      (image, index) => `
<div data-section-kind="gallery-image" data-section-title="Gallery ${index + 1}" class="lunelle-card lunelle-shine overflow-hidden rounded-[34px] bg-[#f0d8dc] ${
        index % 3 === 0 ? "md:row-span-2" : ""
      }">
  <img data-gjs-type="image" src="${image}" alt="Lunelle gallery ${
        index + 1
      }" class="lunelle-image-hover h-full min-h-[260px] w-full object-cover" />
</div>`,
    )
    .join("\n");
}

function testimonialsHtml() {
  return lunelleTestimonials
    .map(
      (item) => `
<article class="lunelle-card lunelle-shine rounded-[34px] border border-[#2a171c]/10 bg-white p-8 shadow-[0_24px_60px_rgba(42,23,28,.07)]">
  <p data-gjs-type="text" class="text-5xl leading-none text-[#d6a24a]">״</p>
  <p data-gjs-type="text" class="mt-4 text-lg leading-8 text-[#2a171c]/70">${item.text}</p>
  <p data-gjs-type="text" class="mt-6 font-black text-[#2a171c]">${item.name}</p>
</article>`,
    )
    .join("\n");
}

function faqHtml() {
  return lunelleFaq
    .map(
      (item) => `
<article class="lunelle-card rounded-[30px] border border-[#2a171c]/10 bg-white p-7 shadow-[0_18px_55px_rgba(42,23,28,.06)]">
  <p data-gjs-type="text" class="text-xl font-black tracking-[-0.04em] text-[#2a171c]">${item.question}</p>
  <p data-gjs-type="text" class="mt-4 text-sm leading-7 text-[#2a171c]/60">${item.answer}</p>
</article>`,
    )
    .join("\n");
}

function pricesHtml() {
  return lunelleServices
    .map(
      (item, index) => `
<article class="lunelle-card group relative overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white p-7 shadow-[0_24px_75px_rgba(42,23,28,.07)]">
  <div class="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#e8b8c1]/25 blur-2xl transition group-hover:scale-125"></div>

  <div class="relative z-10">
    <div class="flex items-start justify-between gap-4">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1e7] text-sm font-black text-[#8a4f5f]">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <div class="rounded-full bg-[#2a171c] px-5 py-2 text-lg font-black text-white shadow-[0_14px_35px_rgba(42,23,28,.16)]">
        ${item.price}
      </div>
    </div>

    <h3 data-gjs-type="text" class="mt-7 text-3xl font-black tracking-[-0.05em] text-[#2a171c]">
      ${item.title}
    </h3>

    <p data-gjs-type="text" class="mt-3 text-sm font-black text-[#8a4f5f]">
      ${item.time}
    </p>

    <p data-gjs-type="text" class="mt-5 text-sm leading-7 text-[#2a171c]/58">
      ${item.text}
    </p>

    <a data-editable-link="true" href="#booking" class="mt-7 inline-flex rounded-full border border-[#2a171c]/12 bg-[#fff7f1] px-6 py-3 text-sm font-black text-[#2a171c] transition hover:bg-[#2a171c] hover:text-white">
      לבחור טיפול
    </a>
  </div>
</article>`,
    )
    .join("\n");
}

function marqueeHtml() {
  const items = [
    "צבעים עדינים",
    "גימור נקי",
    "נייל ארט",
    "פדיקור",
    "מניקור",
    "לק ג׳ל",
    "סטודיו בוטיק",
    "תור אישי",
  ];

  return `
<section data-section-kind="marquee" data-section-title="Marquee" class="overflow-hidden border-y border-[#2a171c]/10 bg-white py-6">
  <div class="lunelle-marquee-track">
    ${items
      .concat(items)
      .map(
        (item) => `
<span data-gjs-type="text" class="mx-8 text-5xl font-black tracking-[-0.06em] text-[#2a171c]/20 md:text-7xl">
  ${item}
</span>`,
      )
      .join("\n")}
  </div>
</section>
`;
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="lunelle" id="home" class="min-h-screen bg-[#fff7f1] text-[#2a171c]">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createLunelleHomeHtml() {
  return pageShell(`
<section data-section-kind="hero" data-section-title="Hero" class="relative overflow-hidden bg-[#fff7f1] px-5 pb-24 pt-20 lg:pb-28 lg:pt-24">
  <div class="pointer-events-none absolute right-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#f2c7cf]/45 blur-3xl lunelle-pulse"></div>
  <div class="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[440px] w-[440px] rounded-full bg-[#e8b8c1]/30 blur-3xl lunelle-pulse"></div>

  <div class="mx-auto max-w-7xl">
    <div class="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
      <div class="order-2 lg:order-1">
        <div class="relative mx-auto max-w-[560px]">
          <div class="absolute -right-8 top-10 z-20 hidden rounded-full bg-[#2a171c] px-6 py-4 text-sm font-black text-white shadow-[0_22px_60px_rgba(42,23,28,.24)] md:block">
            ג׳ל • מניקור • פדיקור
          </div>

          <div class="absolute -left-8 bottom-14 z-20 hidden rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-[0_24px_70px_rgba(42,23,28,.16)] backdrop-blur-2xl md:block">
            <p data-gjs-type="text" class="text-[10px] font-black tracking-[0.22em] text-[#8a4f5f]">התור הפנוי הקרוב</p>
            <p data-gjs-type="text" class="mt-2 text-2xl font-black tracking-[-0.04em] text-[#2a171c]">היום 18:30</p>
          </div>

          <div class="lunelle-card lunelle-shine overflow-hidden rounded-[46px] border-[10px] border-white bg-[#f1d7dc] shadow-[0_35px_100px_rgba(42,23,28,.18)]">
            <img data-gjs-type="image" src="${lunelleImages.hero}" alt="Lunelle Studio manicure" class="lunelle-image-hover h-[650px] w-full object-cover" />
          </div>

          <div class="absolute -bottom-10 right-16 hidden w-[210px] overflow-hidden rounded-[34px] border-[8px] border-white bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.18)] lg:block">
            <img data-gjs-type="image" src="${lunelleImages.nailArt}" alt="Nail art detail" class="lunelle-image-hover h-[220px] w-full object-cover" />
          </div>
        </div>
      </div>

      <div class="order-1 text-center lg:order-2 lg:text-right">
        <p data-gjs-type="text" class="text-xs font-black tracking-[0.36em] text-[#8a4f5f]">
          סטודיו בוטיק לציפורניים
        </p>

        <h1 data-gjs-type="text" class="lunelle-serif mx-auto mt-6 max-w-4xl text-[64px] font-black leading-[0.86] tracking-[-0.085em] text-[#2a171c] md:text-[104px] lg:mx-0">
          ציפורניים עדינות שמרגישות בדיוק כמוך.
        </h1>

        <p data-gjs-type="text" class="mx-auto mt-8 max-w-xl text-lg leading-9 text-[#2a171c]/60 lg:mx-0">
          עיצובי ציפורניים נקיים ועדינים שמשקפים את הסגנון, האנרגיה והיומיום שלך.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
          <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2a171c] px-9 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(42,23,28,.22)]">
            קביעת תור
          </a>

          <a data-editable-link="true" href="#gallery" class="rounded-full border border-[#2a171c]/12 bg-white px-9 py-4 text-sm font-black text-[#2a171c] shadow-[0_14px_35px_rgba(42,23,28,.06)]">
            צפייה בעבודות
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

${marqueeHtml()}

<section id="services" data-section-kind="services" data-section-title="Services" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-8 lg:grid-cols-[.72fr_1fr] lg:items-end">
      <div>
        <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
          השירותים שלנו
        </p>
        <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black leading-[.9] tracking-[-0.06em] text-[#2a171c] md:text-7xl">
          טיפוח ציפורניים רך, אישי ומדויק.
        </h2>
      </div>
      <p data-gjs-type="text" class="max-w-2xl text-lg leading-8 text-[#2a171c]/60">
        טיפולי מניקור, פדיקור, לק ג׳ל ונייל ארט בעבודה עדינה, נקייה ומותאמת אישית.
      </p>
    </div>

    <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${servicesCardsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="about" data-section-title="About" class="bg-[#fff7f1] px-5 py-24">
  <div class="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
        על הסטודיו
      </p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-5 text-5xl font-black leading-[.92] tracking-[-0.06em] text-[#2a171c] md:text-7xl">
        מרחב רגוע לציפורניים שנראות טבעי, נקי ויוקרתי.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-[#2a171c]/60">
        סטודיו שקט, נקי ואישי לציפורניים. כל תור מוקדש לך בלבד, עם התאמת צבע, צורה וסגנון לפי מה שאת אוהבת.
      </p>

      <div class="mt-9 grid gap-4 md:grid-cols-2">
        <div class="lunelle-card rounded-[30px] border border-[#2a171c]/10 bg-white p-7 shadow-[0_20px_65px_rgba(42,23,28,.06)]">
          <p data-gjs-type="text" class="text-xl font-black text-[#2a171c]">כלים נקיים</p>
          <p data-gjs-type="text" class="mt-3 text-sm leading-7 text-[#2a171c]/60">כלים נקיים, עבודה עדינה וסביבת טיפול מסודרת.</p>
        </div>

        <div class="lunelle-card rounded-[30px] border border-[#2a171c]/10 bg-white p-7 shadow-[0_20px_65px_rgba(42,23,28,.06)]">
          <p data-gjs-type="text" class="text-xl font-black text-[#2a171c]">סגנון אישי</p>
          <p data-gjs-type="text" class="mt-3 text-sm leading-7 text-[#2a171c]/60">בחירת צבע, צורה ועיצוב לפי הסגנון שלך.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <div class="lunelle-card overflow-hidden rounded-[38px] bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.12)]">
        <img data-gjs-type="image" src="${lunelleImages.studio}" alt="Nail studio" class="lunelle-image-hover h-[520px] w-full object-cover" />
      </div>
      <div class="lunelle-card mt-14 overflow-hidden rounded-[38px] bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.12)]">
        <img data-gjs-type="image" src="${lunelleImages.tools}" alt="Nail tools" class="lunelle-image-hover h-[520px] w-full object-cover" />
      </div>
    </div>
  </div>
</section>

<section id="gallery" data-section-kind="gallery" data-section-title="Gallery" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
          גלריה
        </p>
        <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2a171c] md:text-7xl">
          עבודות אחרונות.
        </h2>
      </div>
      <p data-gjs-type="text" class="max-w-md text-sm leading-7 text-[#2a171c]/60">
        צבעים רכים, גימור נקי, פרנץ׳ עדין, כרום ועיצובי נייל ארט קטנים.
      </p>
    </div>

    <div class="mt-12 grid auto-rows-[280px] gap-5 md:grid-cols-4">
      ${galleryHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Prices" class="bg-[#fff1e7] px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-3xl text-center">
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
        מחירון
      </p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2a171c] md:text-7xl">
        מחירים ברורים ונעימים לעין.
      </h2>
      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2a171c]/60">
        בחרי את הטיפול שמתאים לך, ואפשר גם לשלב כמה טיפולים באותו תור.
      </p>
    </div>

    <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      ${pricesHtml()}
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-3xl">
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
        לקוחות מספרות
      </p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2a171c] md:text-7xl">
        באות בשביל הציפורניים, נשארות בשביל השקט.
      </h2>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${testimonialsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="faq" data-section-title="FAQ" class="bg-[#fff7f1] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
        שאלות נפוצות
      </p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2a171c] md:text-7xl">
        לפני שקובעים תור.
      </h2>
    </div>
    <div class="grid gap-4">
      ${faqHtml()}
    </div>
  </div>
</section>

<section id="booking" data-section-kind="booking" data-section-title="Booking" class="bg-[#2a171c] px-5 py-24 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#d6a24a]">
        קביעת תור
      </p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
        בחרי טיפול ושלחי בקשה לתור הבא שלך.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-white/60">
        אפשר להחליף את הטופס הזה אחר כך ליומן האמיתי של ביזאפלי עם שעות פנויות.
      </p>
    </div>

    <form class="lunelle-card rounded-[38px] border border-white/10 bg-white p-7 text-[#2a171c] shadow-[0_25px_80px_rgba(0,0,0,.22)]">
      <div class="grid gap-4 md:grid-cols-2">
        <input placeholder="שם מלא" class="rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="טלפון" class="rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="תאריך מועדף" class="rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="שעה מועדפת" class="rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
      </div>

      <select class="mt-4 w-full rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none">
        <option>בחירת טיפול</option>
        <option>מניקור קלאסי</option>
        <option>לק ג׳ל</option>
        <option>מבנה אנטומי</option>
        <option>פדיקור עדין</option>
        <option>עיצובי נייל ארט</option>
      </select>

      <textarea placeholder="הודעה / השראה / בקשה מיוחדת" class="mt-4 min-h-[150px] w-full rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none"></textarea>

      <button type="button" class="mt-5 w-full rounded-full bg-[#2a171c] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(42,23,28,.18)]">
        שליחת בקשה
      </button>
    </form>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="bg-[#fff7f1] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.8fr]">
    <form class="lunelle-card rounded-[40px] bg-white p-10 shadow-[0_25px_80px_rgba(42,23,28,.08)]">
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">
        צור קשר
      </p>

      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2a171c]">
        יש לך שאלה לפני קביעת תור?
      </h2>

      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2a171c]/60">
        אפשר לשלוח הודעה לגבי טיפול, עיצוב, זמינות או התאמת צבעים.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <input placeholder="שם מלא" class="rounded-3xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="טלפון" class="rounded-3xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />
      </div>

      <input placeholder="אימייל" class="mt-4 w-full rounded-3xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none" />

      <textarea placeholder="כתבי כאן את ההודעה שלך" class="mt-4 min-h-[170px] w-full rounded-3xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none"></textarea>

      <button type="button" class="mt-5 w-full rounded-full bg-[#2a171c] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(42,23,28,.18)]">
        שליחת הודעה
      </button>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl bg-[#fff7f1] p-5">
          <p data-gjs-type="text" class="text-sm font-black">טלפון</p>
          <p data-gjs-type="text" class="mt-1 text-[#2a171c]/55">052-0000000</p>
        </div>
        <div class="rounded-3xl bg-[#fff7f1] p-5">
          <p data-gjs-type="text" class="text-sm font-black">אימייל</p>
          <p data-gjs-type="text" class="mt-1 text-[#2a171c]/55">hello@lunelle-studio.com</p>
        </div>
      </div>
    </form>

    <img data-gjs-type="image" src="${lunelleImages.studio}" alt="Lunelle studio" class="lunelle-image-hover h-full min-h-[620px] rounded-[40px] object-cover shadow-[0_25px_80px_rgba(42,23,28,.12)]" />
  </div>
</section>
`);
}

export function createLunelleSimplePageHtml(
  title: string,
  eyebrow: string,
  text: string,
  section: string,
) {
  return pageShell(`
<section data-section-kind="${section}" data-section-title="${title}" class="px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1fr]">
    <aside class="h-fit rounded-[38px] border border-[#2a171c]/10 bg-white p-8 shadow-[0_25px_70px_rgba(42,23,28,.08)]">
      <p data-gjs-type="text" class="text-xs font-black tracking-[0.32em] text-[#8a4f5f]">${eyebrow}</p>
      <h1 data-gjs-type="text" class="lunelle-serif mt-5 text-6xl font-black leading-[.95] tracking-[-0.07em] text-[#2a171c]">
        ${title}
      </h1>
      <p data-gjs-type="text" class="mt-6 text-lg leading-8 text-[#2a171c]/60">
        ${text}
      </p>
    </aside>

    <main class="rounded-[38px] border border-[#2a171c]/10 bg-white p-8 shadow-[0_25px_70px_rgba(42,23,28,.08)]">
      <div class="grid gap-6 md:grid-cols-2">
        ${servicesCardsHtml()}
      </div>
    </main>
  </div>
</section>
`);
}

export const lunelleEditorPages = [
  {
    id: "home",
    slug: "/",
    title: "בית",
    type: "home",
    isHome: true,
    html: createLunelleHomeHtml(),
    css: lunelleEditorCss,
  },
  {
    id: "about",
    slug: "/about",
    title: "אודות",
    type: "about",
    html: createLunelleSimplePageHtml(
      "אודות הסטודיו",
      "אודות",
      "סטודיו פרטי לציפורניים, מניקור, פדיקור וטיפוח עם חוויה רגועה ואישית.",
      "about",
    ),
    css: lunelleEditorCss,
  },
  {
    id: "services",
    slug: "/services",
    title: "שירותים",
    type: "services",
    html: createLunelleSimplePageHtml(
      "השירותים שלנו",
      "שירותים",
      "מניקור, לק ג׳ל, מבנה אנטומי, פדיקור, הסרה ועיצובי נייל ארט.",
      "services",
    ),
    css: lunelleEditorCss,
  },
  {
    id: "gallery",
    slug: "/gallery",
    title: "גלריה",
    type: "gallery",
    html: createLunelleSimplePageHtml(
      "גלריית עבודות",
      "גלריה",
      "עבודות אחרונות, צבעים רכים, פרנץ׳, כרום ועיצובים עדינים.",
      "gallery",
    ),
    css: lunelleEditorCss,
  },
  {
    id: "prices",
    slug: "/prices",
    title: "מחירים",
    type: "pricing",
    html: createLunelleSimplePageHtml(
      "מחירון",
      "מחירים",
      "מחירים ברורים לכל טיפול עם אפשרות להוספת עיצוב אישי.",
      "prices",
    ),
    css: lunelleEditorCss,
  },
  {
    id: "booking",
    slug: "/booking",
    title: "קביעת תור",
    type: "booking",
    html: createLunelleSimplePageHtml(
      "קביעת תור",
      "קביעת תור",
      "בחירת טיפול, תאריך ושעה מועדפים ושליחת בקשה לתור.",
      "booking",
    ),
    css: lunelleEditorCss,
  },
  {
    id: "contact",
    slug: "/contact",
    title: "צור קשר",
    type: "contact",
    html: createLunelleSimplePageHtml(
      "צור קשר",
      "צור קשר",
      "שאלות, זמינות, השראות לעיצובים ותיאום טיפולים.",
      "contact",
    ),
    css: lunelleEditorCss,
  },
];

export const lunelleSeed = {
  id: "lunelle",
  key: "lunelle",
  rendererKey: "lunelle",
  renderMode: "registry",
  editorMode: "renderer",

  name: "Lunelle",
  category: "beauty",
  description:
    "תבנית מקורית מלאה לבונת ציפורניים, מניקור, פדיקור, לק ג׳ל, מחירון, גלריה וקביעת תורים.",
  image: lunelleImages.hero,
  thumbnail: lunelleImages.hero,

  heroTitle: "ציפורניים עדינות שמרגישות בדיוק כמוך",
  heroSubtitle:
    "סטודיו בוטיק למניקור, פדיקור, לק ג׳ל ועיצובי ציפורניים עדינים.",
  businessName: "Lunelle Studio",

  colors: {
    primary: "#8A4F5F",
    secondary: "#E8B8C1",
    accent: "#D6A24A",
    background: "#FFF7F1",
    surface: "#FFFFFF",
    text: "#2A171C",
    muted: "#8D6F76",
    dark: "#2A171C",
  },

  editor: {
    slug: "lunelle",
    activePageId: "home",
    css: lunelleEditorCss,
    pages: lunelleEditorPages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      type: page.type,
      isHome: Boolean(page.isHome),
      html: page.html,
      css: page.css || lunelleEditorCss,
    })),
  },

  pages: lunelleEditorPages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    type: page.type,
    isHome: Boolean(page.isHome),
    html: page.html,
    css: page.css || lunelleEditorCss,
  })),

  blocks: [
    {
      id: "lunelle-header",
      type: "header",
      variant: "lunelle-boutique",
      title: "Header",
      html: navHtml(),
    },
    {
      id: "lunelle-hero",
      type: "hero",
      variant: "lunelle-hero",
      title: "Hero",
      html: createLunelleHomeHtml(),
    },
    {
      id: "lunelle-footer",
      type: "footer",
      variant: "lunelle-footer",
      title: "Footer",
      html: footerHtml(),
    },
  ],

  css: lunelleEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;