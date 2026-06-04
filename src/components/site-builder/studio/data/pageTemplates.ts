import type { PageTemplate } from "../types";

const images = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=90",
  softBeauty:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=90",
  business:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=90",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90",
  coach:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
  event:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=90",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=90",
  realEstate:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=90",
  creative:
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=90",
  wedding:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=90",
  spa:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=90",
  tech:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=90",
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

type ServiceItem = {
  icon: string;
  title: string;
  text: string;
  price?: string;
};

type ProductItem = {
  title: string;
  text: string;
  price: string;
  image: string;
};

const basePageClass =
  "min-h-screen bg-[var(--biz-bg,#fbf8ff)] text-[var(--biz-text,#0f172a)] antialiased overflow-hidden";

const sectionClass = "relative mx-auto w-full max-w-[1240px] px-6 py-24 md:px-10";
const wideSectionClass = "relative mx-auto w-full max-w-[1380px] px-6 py-24 md:px-10";

function navHtml({
  logo,
  title,
  subtitle,
  links,
  cta = "צור קשר",
}: {
  logo: string;
  title: string;
  subtitle: string;
  links: string[];
  cta?: string;
}) {
  return `
<header class="sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] items-center justify-between gap-5 rounded-[28px] border border-white/70 bg-white/85 px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
  <div class="flex items-center gap-3">
    <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--biz-primary,#7c3aed)] to-[var(--biz-accent,#ec4899)] text-lg font-black text-white shadow-xl shadow-violet-200">
      ${logo}
    </div>
    <div>
      <p class="m-0 text-base font-black leading-5 text-slate-950">${title}</p>
      <p class="m-0 mt-1 text-xs font-bold leading-4 text-slate-400">${subtitle}</p>
    </div>
  </div>

  <nav class="hidden items-center gap-2 lg:flex">
    ${links
      .map(
        (link) => `
      <a class="rounded-full px-4 py-2 text-sm font-black text-slate-500 transition hover:bg-violet-50 hover:text-[var(--biz-primary,#7c3aed)]">
        ${link}
      </a>`
      )
      .join("")}
  </nav>

  <a class="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[var(--biz-primary,#7c3aed)]">
    ${cta}
  </a>
</header>
`;
}

function pill(text: string, extra = "") {
  return `<div class="mb-5 inline-flex rounded-full bg-white/85 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7c3aed)] shadow-sm ring-1 ring-violet-100 ${extra}">${text}</div>`;
}

function actionButtons(primary = "קביעת תור", secondary = "צור קשר") {
  return `
<div class="mt-9 flex flex-wrap gap-4">
  <a class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7c3aed)] to-[var(--biz-accent,#ec4899)] px-8 text-sm font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1">
    ${primary}
  </a>
  <a class="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-1 hover:border-violet-200 hover:text-[var(--biz-primary,#7c3aed)]">
    ${secondary}
  </a>
</div>`;
}

function heroSplit({
  kicker,
  title,
  text,
  image,
  primary = "קביעת תור",
  secondary = "צור קשר",
  dark = false,
  reverse = false,
}: {
  kicker: string;
  title: string;
  text: string;
  image: string;
  primary?: string;
  secondary?: string;
  dark?: boolean;
  reverse?: boolean;
}) {
  const textBlock = `
<div class="${dark ? "text-white" : ""}">
  ${pill(kicker, dark ? "bg-white/10 text-white ring-white/10" : "")}
  <h1 class="m-0 max-w-[760px] text-5xl font-black leading-[0.95] tracking-[-0.06em] ${dark ? "text-white" : "text-slate-950"} md:text-7xl">
    ${title}
  </h1>
  <p class="mt-6 max-w-[680px] text-lg font-bold leading-9 ${dark ? "text-white/72" : "text-slate-500"} md:text-xl md:leading-10">
    ${text}
  </p>
  ${actionButtons(primary, secondary)}
</div>`;

  const imageBlock = `
<div class="relative">
  <div class="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-[var(--biz-primary,#7c3aed)]/20 to-[var(--biz-accent,#ec4899)]/20 blur-2xl"></div>
  <div class="relative overflow-hidden rounded-[44px] border border-white/70 bg-white p-3 shadow-[0_34px_120px_rgba(15,23,42,0.16)]">
    <img class="h-[430px] w-full rounded-[32px] object-cover md:h-[580px]" src="${image}" alt="" />
  </div>
</div>`;

  return `
<section class="${wideSectionClass}">
  <div class="${dark ? "rounded-[54px] bg-slate-950 p-8 md:p-14 shadow-[0_44px_160px_rgba(15,23,42,0.26)]" : ""}">
    <div class="grid items-center gap-12 lg:grid-cols-2">
      ${reverse ? imageBlock + textBlock : textBlock + imageBlock}
    </div>
  </div>
</section>`;
}

function heroCentered({
  kicker,
  title,
  text,
  image,
}: {
  kicker: string;
  title: string;
  text: string;
  image: string;
}) {
  return `
<section class="${wideSectionClass}">
  <div class="relative min-h-[720px] overflow-hidden rounded-[58px] bg-slate-950 px-6 py-24 shadow-[0_50px_170px_rgba(15,23,42,0.28)] md:px-14">
    <img class="absolute inset-0 h-full w-full object-cover opacity-55" src="${image}" alt="" />
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-950/45 to-[var(--biz-primary,#7c3aed)]/40"></div>
    <div class="relative z-10 mx-auto grid min-h-[520px] max-w-[900px] place-items-center text-center">
      <div>
        ${pill(kicker, "bg-white/15 text-white ring-white/20")}
        <h1 class="m-0 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white md:text-8xl">${title}</h1>
        <p class="mx-auto mt-7 max-w-[740px] text-xl font-bold leading-10 text-white/82">${text}</p>
        <div class="flex justify-center">${actionButtons("אני רוצה להתחיל", "מידע נוסף")}</div>
      </div>
    </div>
  </div>
</section>`;
}

function sectionTitle(kickerText: string, title: string, text: string) {
  return `
<div class="mx-auto mb-12 max-w-[860px] text-center">
  ${pill(kickerText)}
  <h2 class="m-0 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 md:text-6xl">${title}</h2>
  <p class="mx-auto mt-5 max-w-[720px] text-lg font-bold leading-9 text-slate-500">${text}</p>
</div>`;
}

function servicesGrid({
  kicker = "שירותים",
  title = "השירותים שלנו",
  text = "כרטיסי שירות ברורים עם מחיר, תיאור וכפתור פעולה.",
  services,
}: {
  kicker?: string;
  title?: string;
  text?: string;
  services: ServiceItem[];
}) {
  return `
<section class="${sectionClass}" data-bizuply-block="services">
  ${sectionTitle(kicker, title, text)}
  <div class="grid gap-6 md:grid-cols-3">
    ${services
      .map(
        (service) => `
    <article class="group rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_34px_120px_rgba(124,58,237,0.14)]">
      <div class="mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[var(--biz-primary,#7c3aed)] to-[var(--biz-accent,#ec4899)] text-lg font-black text-white shadow-xl shadow-violet-200">
        ${service.icon}
      </div>
      <h3 class="m-0 text-2xl font-black tracking-[-0.03em] text-slate-950">${service.title}</h3>
      <p class="mt-4 text-sm font-bold leading-7 text-slate-500">${service.text}</p>
      ${
        service.price
          ? `<div class="mt-7 flex items-center justify-between gap-3 rounded-2xl bg-violet-50 px-4 py-3">
              <span class="text-xs font-black text-slate-500">החל מ־</span>
              <span class="text-lg font-black text-[var(--biz-primary,#7c3aed)]">${service.price}</span>
            </div>`
          : ""
      }
    </article>`
      )
      .join("")}
  </div>
</section>`;
}

function aboutSplit({
  image,
  title = "החוויה שהלקוחות מקבלים",
  text = "כאן אפשר לספר על העסק, הניסיון, הסגנון, רמת השירות והייחודיות. כל טקסט, תמונה, צבע וכפתור ניתן לעריכה מלאה.",
}: {
  image: string;
  title?: string;
  text?: string;
}) {
  return `
<section class="${sectionClass}">
  <div class="grid items-center gap-12 lg:grid-cols-2">
    <div>
      ${pill("אודות")}
      <h2 class="m-0 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 md:text-6xl">${title}</h2>
      <p class="mt-6 text-lg font-bold leading-9 text-slate-500">${text}</p>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-3xl bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
          <p class="m-0 text-3xl font-black text-[var(--biz-primary,#7c3aed)]">500+</p>
          <p class="m-0 mt-1 text-sm font-bold text-slate-500">לקוחות</p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
          <p class="m-0 text-3xl font-black text-[var(--biz-primary,#7c3aed)]">98%</p>
          <p class="m-0 mt-1 text-sm font-bold text-slate-500">שביעות רצון</p>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-[44px] bg-white p-3 shadow-[0_34px_120px_rgba(15,23,42,0.14)]">
      <img class="h-[520px] w-full rounded-[32px] object-cover" src="${image}" alt="" />
    </div>
  </div>
</section>`;
}

function galleryGrid({
  image1,
  image2 = images.salon,
  image3 = images.beauty,
  image4 = images.product,
}: {
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
}) {
  return `
<section class="${sectionClass}" data-bizuply-block="gallery">
  ${sectionTitle("גלריה", "תצוגה ויזואלית שמוכרת יותר", "גריד תמונות מקצועי להצגת עבודות, מוצרים, מקום העסק או אווירה.")}
  <div class="grid gap-5 md:grid-cols-4">
    <img class="h-[420px] rounded-[34px] object-cover shadow-[0_24px_90px_rgba(15,23,42,0.11)] md:col-span-2 md:row-span-2 md:h-full" src="${image1}" alt="" />
    <img class="h-[240px] rounded-[34px] object-cover shadow-[0_24px_90px_rgba(15,23,42,0.08)]" src="${image2}" alt="" />
    <img class="h-[240px] rounded-[34px] object-cover shadow-[0_24px_90px_rgba(15,23,42,0.08)]" src="${image3}" alt="" />
    <img class="h-[240px] rounded-[34px] object-cover shadow-[0_24px_90px_rgba(15,23,42,0.08)] md:col-span-2" src="${image4}" alt="" />
  </div>
</section>`;
}

function reviewsSection() {
  return `
<section class="${sectionClass}" data-bizuply-block="reviews">
  ${sectionTitle("ביקורות", "לקוחות מספרים", "אזור ביקורות שמחזק אמון ומעודד לקוחות לפנות.")}
  <div class="grid gap-6 md:grid-cols-3">
    ${["שירות מושלם, מקצועי ומדויק.", "חוויה מדהימה מההתחלה ועד הסוף.", "הכל היה ברור, נעים וברמה גבוהה."]
      .map(
        (review, index) => `
    <article class="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
      <div class="text-2xl text-amber-400">★★★★★</div>
      <p class="mt-5 text-lg font-extrabold leading-8 text-slate-700">“${review}”</p>
      <div class="mt-7 flex items-center gap-3">
        <div class="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-sm font-black text-[var(--biz-primary,#7c3aed)]">0${index + 1}</div>
        <div>
          <p class="m-0 text-sm font-black text-slate-950">לקוחה מרוצה</p>
          <p class="m-0 mt-1 text-xs font-bold text-slate-400">ביקורת מאומתת</p>
        </div>
      </div>
    </article>`
      )
      .join("")}
  </div>
</section>`;
}

function bookingSection() {
  return `
<section class="${sectionClass}" data-bizuply-block="booking">
  <div class="overflow-hidden rounded-[54px] bg-slate-950 p-8 text-white shadow-[0_44px_150px_rgba(15,23,42,0.28)] md:p-14">
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        ${pill("מחובר ליומן", "bg-white/10 text-white ring-white/10")}
        <h2 class="m-0 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white md:text-6xl">קובעים תור אונליין</h2>
        <p class="mt-6 text-lg font-bold leading-9 text-white/70">הלקוח בוחר שירות, תאריך ושעה פנויה — בצורה ברורה ומהירה.</p>
      </div>

      <div class="rounded-[38px] bg-white p-6 text-slate-950 shadow-[0_24px_90px_rgba(0,0,0,0.18)]">
        <div class="mb-5 flex items-center justify-between">
          <p class="m-0 text-lg font-black">שעות פנויות</p>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">זמין היום</span>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          ${["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
            .map(
              (time) => `<button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-[var(--biz-primary,#7c3aed)] transition hover:bg-[var(--biz-primary,#7c3aed)] hover:text-white">${time}</button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function leadFormSection({
  dark = false,
  title = "השאירו פרטים",
  text = "נחזור אליכם בהקדם.",
}: {
  dark?: boolean;
  title?: string;
  text?: string;
}) {
  return `
<section class="${sectionClass}" data-bizuply-block="lead-form">
  <div class="${dark ? "bg-slate-950 text-white" : "bg-white text-slate-950"} mx-auto max-w-[900px] rounded-[48px] p-8 shadow-[0_34px_120px_rgba(15,23,42,0.12)] md:p-12">
    <div class="text-center">
      ${pill("יצירת קשר", dark ? "bg-white/10 text-white ring-white/10" : "")}
      <h2 class="m-0 text-4xl font-black tracking-[-0.045em] ${dark ? "text-white" : "text-slate-950"} md:text-6xl">${title}</h2>
      <p class="mx-auto mt-5 max-w-[620px] text-lg font-bold leading-8 ${dark ? "text-white/70" : "text-slate-500"}">${text}</p>
    </div>

    <form class="mt-9 grid gap-4">
      <input class="min-h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-violet-300" placeholder="שם מלא" />
      <input class="min-h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-violet-300" placeholder="טלפון" />
      <input class="min-h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-violet-300" placeholder="אימייל" />
      <textarea class="min-h-[130px] rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:border-violet-300" placeholder="במה אפשר לעזור?"></textarea>
      <button class="min-h-[60px] rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7c3aed)] to-[var(--biz-accent,#ec4899)] px-8 text-sm font-black text-white shadow-xl shadow-violet-200" type="button">
        שליחה
      </button>
    </form>
  </div>
</section>`;
}

function clubSection() {
  return `
<section class="${sectionClass}" data-bizuply-block="customer-club">
  <div class="relative overflow-hidden rounded-[54px] bg-gradient-to-br from-[var(--biz-primary,#7c3aed)] to-[var(--biz-accent,#ec4899)] p-10 text-white shadow-[0_44px_150px_rgba(124,58,237,0.26)] md:p-16">
    <div class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"></div>
    <div class="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
      <div>
        <p class="m-0 text-sm font-black text-white/70">מועדון לקוחות</p>
        <h2 class="m-0 mt-4 text-4xl font-black tracking-[-0.045em] md:text-6xl">הצטרפות למועדון לקוחות</h2>
        <p class="mt-5 max-w-[680px] text-lg font-bold leading-9 text-white/82">קבלו הטבות, קופונים ועדכונים לפני כולם.</p>
      </div>
      <a class="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-slate-950 shadow-xl">הצטרפות</a>
    </div>
  </div>
</section>`;
}

function footerHtml() {
  return `
<footer class="mx-auto w-full max-w-[1240px] px-6 pb-12 md:px-10">
  <div class="rounded-[34px] border border-slate-200 bg-white px-6 py-7 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <p class="m-0 text-sm font-black text-slate-950">נבנה עם Bizuply</p>
      <p class="m-0 text-xs font-bold text-slate-400">© כל הזכויות שמורות</p>
    </div>
  </div>
</footer>`;
}

function productsSection(products: ProductItem[]) {
  return `
<section class="${sectionClass}" data-bizuply-block="products">
  ${sectionTitle("חנות", "מוצרים נבחרים", "גריד מוצרים מקצועי עם תמונות, תיאור, מחיר וכפתור רכישה.")}
  <div class="grid gap-6 md:grid-cols-3">
    ${products
      .map(
        (product) => `
    <article class="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
      <img class="h-[260px] w-full rounded-[26px] object-cover" src="${product.image}" alt="" />
      <h3 class="m-0 mt-6 text-2xl font-black text-slate-950">${product.title}</h3>
      <p class="mt-3 text-sm font-bold leading-7 text-slate-500">${product.text}</p>
      <div class="mt-6 flex items-center justify-between gap-3">
        <a class="rounded-2xl bg-[var(--biz-primary,#7c3aed)] px-5 py-3 text-xs font-black text-white">הוספה לסל</a>
        <span class="rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-[var(--biz-primary,#7c3aed)]">${product.price}</span>
      </div>
    </article>`
      )
      .join("")}
  </div>
</section>`;
}

function businessPage({
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
  darkHero = false,
  centeredHero = false,
}: {
  logo: string;
  brandTitle: string;
  brandSubtitle: string;
  navLinks: string[];
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  heroImage: string;
  services: ServiceItem[];
  includeBooking?: boolean;
  includeGallery?: boolean;
  includeReviews?: boolean;
  includeLeadForm?: boolean;
  includeClub?: boolean;
  darkHero?: boolean;
  centeredHero?: boolean;
}) {
  return `
<div class="${basePageClass}" data-bizuply-page="true">
  ${navHtml({
    logo,
    title: brandTitle,
    subtitle: brandSubtitle,
    links: navLinks,
  })}

  ${
    centeredHero
      ? heroCentered({
          kicker: heroKicker,
          title: heroTitle,
          text: heroText,
          image: heroImage,
        })
      : heroSplit({
          kicker: heroKicker,
          title: heroTitle,
          text: heroText,
          image: heroImage,
          dark: darkHero,
        })
  }

  ${aboutSplit({ image: heroImage })}
  ${servicesGrid({ services })}
  ${includeBooking ? bookingSection() : ""}
  ${includeGallery ? galleryGrid({ image1: heroImage }) : ""}
  ${includeReviews ? reviewsSection() : ""}
  ${includeClub ? clubSection() : ""}
  ${includeLeadForm ? leadFormSection({}) : ""}
  ${footerHtml()}
</div>`;
}

function storePage() {
  return `
<div class="${basePageClass}" data-bizuply-page="true">
  ${navHtml({
    logo: "S",
    title: "Boutique Store",
    subtitle: "חנות פרימיום",
    links: ["בית", "מוצרים", "מבצעים", "מועדון", "צור קשר"],
    cta: "לרכישה",
  })}

  ${heroSplit({
    kicker: "חנות אונליין",
    title: "מוצרים שנראים מעולה ונמכרים מהר",
    text: "קטלוג מוצרים, סליקה, מבצעים ומועדון לקוחות — בעיצוב נקי וממיר.",
    image: images.store,
    primary: "לרכישה",
    secondary: "המוצרים שלנו",
  })}

  ${productsSection([
    {
      title: "מוצר ראשון",
      text: "תיאור קצר ומכירתי של המוצר.",
      price: "₪129",
      image: images.product,
    },
    {
      title: "מוצר שני",
      text: "תיאור קצר ומכירתי של המוצר.",
      price: "₪99",
      image: images.softBeauty,
    },
    {
      title: "מוצר שלישי",
      text: "תיאור קצר ומכירתי של המוצר.",
      price: "₪249",
      image: images.beauty,
    },
  ])}

  ${clubSection()}
  ${reviewsSection()}
  ${footerHtml()}
</div>`;
}

function landingPage() {
  return `
<div class="${basePageClass}" data-bizuply-page="true">
  ${heroCentered({
    kicker: "דף נחיתה",
    title: "כותרת מכירתית חזקה שמובילה לפעולה",
    text: "משפט קצר שמסביר את ההצעה, למי היא מתאימה ולמה כדאי לפעול עכשיו.",
    image: images.office,
  })}

  <section class="${sectionClass}">
    <div class="grid gap-6 md:grid-cols-3">
      ${["יתרון ראשון", "יתרון שני", "יתרון שלישי"]
        .map(
          (title) => `
      <article class="rounded-[34px] bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-600">✓</div>
        <h3 class="m-0 text-2xl font-black text-slate-950">${title}</h3>
        <p class="mt-3 text-sm font-bold leading-7 text-slate-500">משפט קצר שמסביר את הערך ללקוח.</p>
      </article>`
        )
        .join("")}
    </div>
  </section>

  ${leadFormSection({
    dark: true,
    title: "השאירו פרטים",
    text: "כל ליד ייכנס ישירות ל־CRM של העסק.",
  })}
  ${footerHtml()}
</div>`;
}

function darkPremiumPage() {
  return `
<div class="min-h-screen bg-slate-950 text-white antialiased overflow-hidden" data-bizuply-page="true">
  ${navHtml({
    logo: "P",
    title: "Premium Brand",
    subtitle: "מותג יוקרתי",
    links: ["בית", "שירותים", "עבודות", "צור קשר"],
  })}

  ${heroCentered({
    kicker: "Premium Experience",
    title: "אתר עסקי יוקרתי שמרגיש כמו מותג גדול",
    text: "תבנית כהה, דרמטית ומודרנית לעסק שרוצה להיראות ברמה גבוהה מאוד.",
    image: images.business,
  })}

  ${servicesGrid({
    kicker: "מה מקבלים",
    title: "מבנה פרימיום לעסק שלך",
    text: "שילוב של עיצוב יוקרתי, אמון לקוחות והנעה לפעולה.",
    services: [
      {
        icon: "✦",
        title: "עיצוב יוקרתי",
        text: "מראה מקצועי, נקי ומרשים.",
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

  ${leadFormSection({ dark: true })}
</div>`;
}

export const pageTemplates: PageTemplate[] = [
  template(
    "beauty-luxury-full",
    "Luxury Beauty Pro",
    "יופי וקליניקות",
    "תבנית יוקרתית מלאה לעסקי יופי, איפור קבוע וקליניקות",
    images.beauty,
    businessPage({
      logo: "B",
      brandTitle: "Beauty Studio",
      brandSubtitle: "סטודיו יופי פרימיום",
      navLinks: ["בית", "אודות", "שירותים", "גלריה", "צור קשר"],
      heroKicker: "סטודיו פרימיום",
      heroTitle: "יופי טבעי שמתחיל בחוויה מקצועית",
      heroText: "טיפולים מתקדמים, יחס אישי ותוצאה מדויקת שמרגישה טבעית.",
      heroImage: images.beauty,
      includeBooking: true,
      includeClub: true,
      services: [
        {
          icon: "✦",
          title: "איפור קבוע",
          text: "תוצאה טבעית ומדויקת עם התאמה אישית.",
          price: "₪850",
        },
        {
          icon: "★",
          title: "טיפולי פנים",
          text: "טיפול מקצועי לעור זוהר ובריא.",
          price: "₪350",
        },
        {
          icon: "✓",
          title: "ייעוץ אישי",
          text: "התאמה מלאה לפני כל טיפול.",
          price: "₪150",
        },
      ],
    })
  ),

  template(
    "beauty-soft-editorial",
    "Soft Editorial Beauty",
    "יופי וקליניקות",
    "תבנית נשית, עדינה, פרימיום ומכירתית",
    images.softBeauty,
    businessPage({
      logo: "S",
      brandTitle: "Soft Beauty",
      brandSubtitle: "חוויה עדינה ומקצועית",
      navLinks: ["בית", "טיפולים", "גלריה", "ביקורות", "צור קשר"],
      heroKicker: "Soft Editorial",
      heroTitle: "מראה נקי, טבעי ומדויק",
      heroText: "תבנית עדינה לעסקי יופי שרוצים לשדר יוקרה רגועה ואמון.",
      heroImage: images.softBeauty,
      includeBooking: true,
      includeClub: true,
      services: [
        {
          icon: "01",
          title: "טיפול ראשון",
          text: "תיאור שירות קצר ומקצועי.",
          price: "₪350",
        },
        {
          icon: "02",
          title: "טיפול שני",
          text: "תיאור שירות קצר ומקצועי.",
          price: "₪450",
        },
        {
          icon: "03",
          title: "ייעוץ",
          text: "פגישת התאמה ללקוחה.",
          price: "₪120",
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
    businessPage({
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
    "spa-luxury",
    "Spa Luxury",
    "ספא ובריאות",
    "תבנית רכה ויוקרתית לספא, טיפולים וחוויית wellness",
    images.spa,
    businessPage({
      logo: "W",
      brandTitle: "Wellness Spa",
      brandSubtitle: "חוויה רגועה ויוקרתית",
      navLinks: ["בית", "טיפולים", "חבילות", "תורים", "צור קשר"],
      heroKicker: "Spa · Wellness",
      heroTitle: "חוויה רגועה שמתחילה כבר באתר",
      heroText: "תבנית מושלמת לעסקי ספא, עיסוי, טיפול ורוגע.",
      heroImage: images.spa,
      includeBooking: true,
      includeClub: true,
      services: [
        { icon: "✦", title: "עיסוי אישי", text: "חוויה מותאמת אישית.", price: "₪280" },
        { icon: "♛", title: "חבילת ספא", text: "חבילת טיפול פרימיום.", price: "₪490" },
        { icon: "✓", title: "טיפול זוגי", text: "חוויה זוגית רגועה.", price: "₪620" },
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
    businessPage({
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
    businessPage({
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
    businessPage({
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
    businessPage({
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
    businessPage({
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
    businessPage({
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
    businessPage({
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
    "tech-saas",
    "Tech SaaS",
    "טכנולוגיה וסאאס",
    "תבנית מודרנית לחברות תוכנה, SaaS ומוצרים דיגיטליים",
    images.tech,
    businessPage({
      logo: "T",
      brandTitle: "Tech SaaS",
      brandSubtitle: "מערכת חכמה לעסקים",
      navLinks: ["בית", "יכולות", "מחירים", "דמו", "צור קשר"],
      heroKicker: "SaaS · Automation · CRM",
      heroTitle: "מוצר דיגיטלי שנראה כמו מערכת גדולה",
      heroText: "תבנית מקצועית להצגת פיצ׳רים, דמו, מחירים ולידים.",
      heroImage: images.tech,
      includeBooking: false,
      includeGallery: false,
      services: [
        { icon: "AI", title: "אוטומציה", text: "תהליכים חכמים לעסק." },
        { icon: "CRM", title: "ניהול לקוחות", text: "מעקב לידים ולקוחות." },
        { icon: "API", title: "חיבורים", text: "אינטגרציות למערכות חיצוניות." },
      ],
    })
  ),

  template(
    "wedding-premium",
    "Wedding Premium",
    "חתונות ואירועים",
    "תבנית יוקרתית להזמנות, אולמות, ספקים ומפיקי חתונות",
    images.wedding,
    businessPage({
      logo: "W",
      brandTitle: "Wedding Studio",
      brandSubtitle: "חתונות ואירועים",
      navLinks: ["בית", "גלריה", "חבילות", "המלצות", "צור קשר"],
      heroKicker: "Wedding · Luxury · Events",
      heroTitle: "אירוע שנראה יוקרתי מהקליק הראשון",
      heroText: "תבנית מרשימה לחתונות, ספקים, הזמנות וניהול פניות.",
      heroImage: images.wedding,
      includeBooking: false,
      includeClub: false,
      services: [
        { icon: "✦", title: "עיצוב אירוע", text: "קונספט מלא לאירוע." },
        { icon: "♛", title: "ניהול ספקים", text: "תיאום מלא של כל פרט." },
        { icon: "✓", title: "ליווי אישי", text: "מהפגישה הראשונה עד האירוע." },
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
<div class="${basePageClass}" data-bizuply-page="true">
  ${navHtml({
    logo: "B",
    title: "שם העסק",
    subtitle: "תחום העסק",
    links: ["בית", "אודות", "צור קשר"],
  })}

  <section class="${sectionClass} min-h-[720px] grid place-items-center text-center">
    <div>
      ${pill("עסק מקצועי · אתר חכם")}
      <h1 class="m-0 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-8xl">שם העסק שלך</h1>
      <p class="mx-auto mt-7 max-w-[720px] text-xl font-bold leading-10 text-slate-500">
        תיאור קצר ומדויק של העסק, השירותים והערך שהלקוחות מקבלים.
      </p>
      <div class="flex justify-center">${actionButtons("קביעת תור", "צור קשר")}</div>
    </div>
  </section>

  <section class="${sectionClass}">
    <div class="rounded-[48px] bg-white p-10 text-center shadow-[0_34px_120px_rgba(15,23,42,0.09)]">
      <h2 class="m-0 text-4xl font-black tracking-[-0.045em] text-slate-950">קצת עלינו</h2>
      <p class="mx-auto mt-5 max-w-[680px] text-lg font-bold leading-9 text-slate-500">
        כאן אפשר לערוך טקסט, צבעים, רקע, תמונות, כפתורים וסקשנים.
      </p>
    </div>
  </section>

  ${footerHtml()}
</div>`
  ),

  template(
    "dark-premium",
    "Dark Premium",
    "פרימיום",
    "תבנית כהה, דרמטית ומודרנית",
    images.business,
    darkPremiumPage()
  ),
];
