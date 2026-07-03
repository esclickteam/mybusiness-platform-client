import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { lunelleEditorCss } from "./editorCss";

export const lunelleImages = {
  hero:
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1500&q=90",
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
    text: "עיצוב צורה, ניקוי עדין, טיפוח קוטיקולה ומראה נקי ומטופח.",
    image: lunelleImages.manicure,
  },
  {
    title: "לק ג׳ל",
    price: "₪180",
    time: "60 דקות",
    text: "מריחה מדויקת, ברק גבוה, צבע עמיד וגימור נקי.",
    image: lunelleImages.hands,
  },
  {
    title: "מבנה אנטומי",
    price: "₪230",
    time: "75 דקות",
    text: "חיזוק טבעי לציפורן, מראה אלגנטי ועמידות גבוהה יותר.",
    image: lunelleImages.polish,
  },
  {
    title: "פדיקור טיפולי",
    price: "₪190",
    time: "70 דקות",
    text: "ריכוך, ניקוי, שיוף, טיפוח כף הרגל וגימור מושלם.",
    image: lunelleImages.pedicure,
  },
  {
    title: "עיצובי נייל ארט",
    price: "החל מ־₪30",
    time: "תוספת",
    text: "פרנץ׳, כרום, אבנים עדינות, קווים דקים ועיצובים מיוחדים.",
    image: lunelleImages.nailArt,
  },
  {
    title: "הסרת ג׳ל",
    price: "₪60",
    time: "30 דקות",
    text: "הסרה עדינה עם שמירה על הציפורן וסיום בשמן הזנה.",
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

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-50 border-b border-[#2a171c]/10 bg-[#fff7f1]/90 px-5 py-4 backdrop-blur-2xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a data-gjs-type="text" data-editable-link="true" href="#home" class="text-2xl font-black tracking-[-0.05em] text-[#2a171c]">
      Lunelle Studio
    </a>

    <nav class="hidden items-center gap-7 text-sm font-bold text-[#2a171c]/65 lg:flex">
      <a data-editable-link="true" href="#home">בית</a>
      <a data-editable-link="true" href="#services">שירותים</a>
      <a data-editable-link="true" href="#gallery">גלריה</a>
      <a data-editable-link="true" href="#prices">מחירים</a>
      <a data-editable-link="true" href="#booking">הזמנות</a>
      <a data-editable-link="true" href="#contact">צור קשר</a>
    </nav>

    <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2a171c] px-6 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(42,23,28,.2)]">
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
<article data-section-kind="service-card" data-section-title="${service.title}" class="lunelle-card overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]">
  <div class="overflow-hidden bg-[#f1d7dc]">
    <img data-gjs-type="image" src="${service.image}" alt="${service.title}" class="lunelle-image-hover h-[300px] w-full object-cover" />
  </div>
  <div class="p-7">
    <div class="flex items-center justify-between gap-4">
      <h3 data-gjs-type="text" class="text-2xl font-black tracking-[-0.04em] text-[#2a171c]">${service.title}</h3>
      <p data-gjs-type="text" class="rounded-full bg-[#fff1e7] px-4 py-2 text-sm font-black text-[#8a4f5f]">${service.price}</p>
    </div>
    <p data-gjs-type="text" class="mt-2 text-xs font-black uppercase tracking-[0.22em] text-[#2a171c]/35">${service.time}</p>
    <p data-gjs-type="text" class="mt-4 text-sm leading-7 text-[#2a171c]/55">${service.text}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function galleryHtml() {
  return lunelleGallery
    .map(
      (image, index) => `
<div data-section-kind="gallery-image" data-section-title="Gallery ${index + 1}" class="lunelle-card overflow-hidden rounded-[34px] bg-[#f0d8dc] ${
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
<article class="rounded-[34px] border border-[#2a171c]/10 bg-white p-8 shadow-[0_24px_60px_rgba(42,23,28,.07)]">
  <p data-gjs-type="text" class="text-5xl leading-none text-[#d6a24a]">״</p>
  <p data-gjs-type="text" class="mt-4 text-lg leading-8 text-[#2a171c]/70">${item.text}</p>
  <p data-gjs-type="text" class="mt-6 font-black text-[#2a171c]">${item.name}</p>
</article>`,
    )
    .join("\n");
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
<section data-section-kind="hero" data-section-title="Hero" class="relative overflow-hidden px-5 py-16 lg:py-24">
  <div class="absolute -right-20 top-20 h-64 w-64 rounded-full bg-[#e8b8c1]/40 blur-3xl lunelle-pulse"></div>
  <div class="absolute bottom-10 left-[-100px] h-72 w-72 rounded-full bg-[#d6a24a]/20 blur-3xl lunelle-pulse"></div>

  <div class="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.88fr]">
    <div class="lunelle-reveal">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.35em] text-[#8a4f5f]">
        סטודיו בוטיק לציפורניים
      </p>
      <h1 data-gjs-type="text" class="lunelle-serif mt-6 max-w-4xl text-6xl font-black leading-[.95] tracking-[-0.08em] text-[#2a171c] md:text-8xl">
        ציפורניים נקיות, עדינות ומדויקות שמתאימות בדיוק אלייך.
      </h1>
      <p data-gjs-type="text" class="mt-7 max-w-2xl text-lg leading-9 text-[#2a171c]/60">
        מניקור, פדיקור, לק ג׳ל, מבנה אנטומי ועיצובי נייל ארט עדינים בסטודיו שקט, אישי ומוקפד.
      </p>

      <div class="mt-9 flex flex-wrap gap-4">
        <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2a171c] px-8 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(42,23,28,.22)]">
          קביעת תור
        </a>
        <a data-editable-link="true" href="#services" class="rounded-full border border-[#2a171c]/15 bg-white px-8 py-4 text-sm font-black text-[#2a171c]">
          צפייה בשירותים
        </a>
      </div>

      <div class="mt-10 grid max-w-xl grid-cols-3 gap-3">
        <div class="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(42,23,28,.07)]">
          <p data-gjs-type="text" class="text-3xl font-black">7+</p>
          <p data-gjs-type="text" class="mt-1 text-xs font-bold text-[#2a171c]/45">שנות ניסיון</p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(42,23,28,.07)]">
          <p data-gjs-type="text" class="text-3xl font-black">1:1</p>
          <p data-gjs-type="text" class="mt-1 text-xs font-bold text-[#2a171c]/45">תור פרטי</p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(42,23,28,.07)]">
          <p data-gjs-type="text" class="text-3xl font-black">4.9</p>
          <p data-gjs-type="text" class="mt-1 text-xs font-bold text-[#2a171c]/45">דירוג לקוחות</p>
        </div>
      </div>
    </div>

    <div class="relative lunelle-float">
      <div class="absolute -right-5 -top-5 rounded-full bg-[#2a171c] px-6 py-4 text-sm font-black text-white shadow-2xl">
        Gel • Mani • Pedi
      </div>
      <div class="overflow-hidden rounded-[46px] border-10 border-white bg-[#f1d7dc] shadow-[0_35px_90px_rgba(42,23,28,.18)]">
        <img data-gjs-type="image" src="${lunelleImages.hero}" alt="Lunelle Studio manicure" class="h-[620px] w-full object-cover" />
      </div>
    </div>
  </div>
</section>

<section id="services" data-section-kind="services" data-section-title="Services" class="px-5 py-20">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-3xl">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">השירותים שלנו</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
        כל מה שהציפורניים שלך צריכות במקום אחד.
      </h2>
      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2a171c]/60">
        טיפול מדויק לידיים ולרגליים, גימור נקי, צבעים רכים ועיצובים שמתאימים ליומיום ולאירועים.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${servicesCardsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="about" data-section-title="About" class="bg-[#2a171c] px-5 py-20 text-white">
  <div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1fr]">
    <div class="grid grid-cols-2 gap-4">
      <img data-gjs-type="image" src="${lunelleImages.studio}" alt="Nail studio" class="h-[420px] rounded-[34px] object-cover" />
      <img data-gjs-type="image" src="${lunelleImages.tools}" alt="Nail tools" class="mt-16 h-[420px] rounded-[34px] object-cover" />
    </div>

    <div>
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#d6a24a]">חוויה רגועה</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
        לא עוד סלון עמוס. תור שקט, נקי ואישי.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-white/65">
        Lunelle נבנתה בשביל לקוחות שרוצות תוצאה יוקרתית בלי רעש, לחץ או עומס. כל תור מוקדש לך בלבד, עם התאמת צבע, צורה וסגנון.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div class="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p data-gjs-type="text" class="font-black">סטריליות וניקיון</p>
          <p data-gjs-type="text" class="mt-2 text-sm leading-7 text-white/55">כלים נקיים, עבודה עדינה וסביבת טיפול מסודרת.</p>
        </div>
        <div class="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p data-gjs-type="text" class="font-black">התאמה אישית</p>
          <p data-gjs-type="text" class="mt-2 text-sm leading-7 text-white/55">בחירת צבע, צורה ועיצוב לפי הסגנון שלך.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="gallery" data-section-kind="gallery" data-section-title="Gallery" class="px-5 py-20">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">גלריה</p>
        <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
          עבודות אחרונות.
        </h2>
      </div>
      <p data-gjs-type="text" class="max-w-md text-sm leading-7 text-[#2a171c]/55">
        צבעים רכים, גימור נקי, פרנץ׳ עדין, כרום ועיצובי נייל ארט קטנים.
      </p>
    </div>

    <div class="mt-12 grid auto-rows-[260px] gap-5 md:grid-cols-4">
      ${galleryHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Prices" class="bg-[#fff1e7] px-5 py-20">
  <div class="mx-auto max-w-5xl">
    <div class="text-center">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">מחירים</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
        מחירון ברור לפני שמזמינים.
      </h2>
    </div>

    <div class="mt-12 overflow-hidden rounded-[38px] border border-[#2a171c]/10 bg-white shadow-[0_25px_80px_rgba(42,23,28,.08)]">
      ${lunelleServices
        .map(
          (item) => `
<div class="grid gap-4 border-b border-[#2a171c]/10 p-7 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
  <div>
    <p data-gjs-type="text" class="text-xl font-black text-[#2a171c]">${item.title}</p>
    <p data-gjs-type="text" class="mt-2 text-sm text-[#2a171c]/50">${item.text}</p>
  </div>
  <p data-gjs-type="text" class="text-sm font-black text-[#8a4f5f]">${item.time}</p>
  <p data-gjs-type="text" class="text-2xl font-black text-[#2a171c]">${item.price}</p>
</div>`,
        )
        .join("\n")}
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="px-5 py-20">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-3xl">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">לקוחות מספרות</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
        באות בשביל הציפורניים, נשארות בשביל השקט.
      </h2>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${testimonialsHtml()}
    </div>
  </div>
</section>

<section id="booking" data-section-kind="booking" data-section-title="Booking" class="bg-[#2a171c] px-5 py-20 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#d6a24a]">קביעת תור</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
        בחרי טיפול, השאירי פרטים ונחזור אלייך.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-white/60">
        אפשר להחליף את הטופס הזה אחר כך ליומן האמיתי של ביזאפלי עם שעות פנויות.
      </p>
    </div>

    <form class="rounded-[38px] border border-white/10 bg-white p-7 text-[#2a171c] shadow-[0_25px_80px_rgba(0,0,0,.22)]">
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
        <option>פדיקור</option>
        <option>נייל ארט</option>
      </select>
      <textarea placeholder="הערות / השראה / בקשה מיוחדת" class="mt-4 min-h-[130px] w-full rounded-2xl border border-[#2a171c]/10 bg-[#fff7f1] px-5 py-4 text-sm font-bold outline-none"></textarea>
      <button type="button" class="mt-5 w-full rounded-full bg-[#2a171c] px-8 py-4 text-sm font-black text-white">
        שליחת בקשה לתור
      </button>
    </form>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="px-5 py-20">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.8fr]">
    <div class="rounded-[40px] bg-white p-10 shadow-[0_25px_80px_rgba(42,23,28,.08)]">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">צור קשר</p>
      <h2 data-gjs-type="text" class="lunelle-serif mt-4 text-5xl font-black tracking-[-0.06em]">
        יש לך שאלה לפני קביעת תור?
      </h2>
      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2a171c]/60">
        אפשר לשלוח הודעה לגבי טיפול, עיצוב, זמינות או התאמת צבעים.
      </p>

      <div class="mt-8 grid gap-4">
        <div class="rounded-3xl bg-[#fff7f1] p-5">
          <p data-gjs-type="text" class="text-sm font-black">טלפון</p>
          <p data-gjs-type="text" class="mt-1 text-[#2a171c]/55">052-0000000</p>
        </div>
        <div class="rounded-3xl bg-[#fff7f1] p-5">
          <p data-gjs-type="text" class="text-sm font-black">אימייל</p>
          <p data-gjs-type="text" class="mt-1 text-[#2a171c]/55">hello@lunelle-studio.com</p>
        </div>
      </div>
    </div>

    <img data-gjs-type="image" src="${lunelleImages.studio}" alt="Lunelle studio" class="h-full min-h-[520px] rounded-[40px] object-cover shadow-[0_25px_80px_rgba(42,23,28,.12)]" />
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
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#8a4f5f]">${eyebrow}</p>
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
      "ABOUT",
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
      "SERVICES",
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
      "GALLERY",
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
      "PRICES",
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
      "BOOKING",
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
      "CONTACT",
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

  heroTitle: "ציפורניים נקיות, עדינות ומדויקות",
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
    pages: lunelleEditorPages,
  },

  pages: lunelleEditorPages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    type: page.type,
    isHome: Boolean(page.isHome),
  })),

  blocks: [],
  css: lunelleEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;