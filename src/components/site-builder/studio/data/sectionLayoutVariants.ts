export type SectionKind =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "store"
  | "booking"
  | "reviews"
  | "contact"
  | "club"
  | "basic";

export type SectionLayoutVariant = {
  id: string;
  kind: SectionKind;
  title: string;
  description: string;
  previewLabel: string;
  badge: string;
  html: string;
};

const img = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  hair:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  office:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
  people:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
};

const sectionName: Record<SectionKind, string> = {
  hero: "ראשי",
  about: "אודות",
  services: "שירותים",
  gallery: "גלריה",
  store: "חנות",
  booking: "תיאום תורים",
  reviews: "ביקורות",
  contact: "יצירת קשר",
  club: "מועדון לקוחות",
  basic: "סקשן חופשי",
};

function variant(
  id: string,
  kind: SectionKind,
  title: string,
  description: string,
  previewLabel: string,
  badge: string,
  html: string
): SectionLayoutVariant {
  return {
    id,
    kind,
    title,
    description,
    previewLabel,
    badge,
    html,
  };
}

function imageCard(src: string, extra = "") {
  return `
    <div
      class="group relative overflow-hidden rounded-[32px] bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)] ${extra}"
      data-editable-image-card="true"
    >
      <img
        src="${src}"
        alt=""
        class="h-full min-h-[280px] w-full rounded-[24px] object-cover transition duration-500 group-hover:scale-[1.03]"
        data-editable-image="true"
      />
      <div class="pointer-events-none absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
        תמונה ניתנת להחלפה
      </div>
    </div>
  `;
}

function addImageDropBox() {
  return `
    <div
      class="flex min-h-[260px] cursor-pointer items-center justify-center rounded-[32px] border-2 border-dashed border-violet-200 bg-violet-50/70 p-8 text-center transition hover:bg-violet-100"
      data-image-drop-zone="true"
    >
      <div>
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg">
          +
        </div>
        <p class="text-lg font-black text-slate-900">הוספת תמונה</p>
        <p class="mt-2 text-sm font-bold leading-6 text-slate-500">
          כאן אפשר לגרור תמונה / להחליף תמונה / להפוך לרקע
        </p>
      </div>
    </div>
  `;
}

function sectionShell(kind: SectionKind, inner: string, extra = "") {
  return `
<section
  class="relative mx-auto w-full max-w-[1240px] px-8 py-24 ${extra}"
  data-section-kind="${kind}"
>
  ${inner}
</section>
`;
}

function bgSection(kind: SectionKind, src: string, inner: string) {
  return `
<section
  class="relative mx-auto my-10 min-h-[680px] w-full max-w-[1320px] overflow-hidden rounded-[48px] bg-slate-950 bg-cover bg-center px-10 py-24 shadow-[0_40px_140px_rgba(15,23,42,0.22)]"
  style="background-image:linear-gradient(135deg,rgba(2,6,23,.68),rgba(2,6,23,.22)),url('${src}')"
  data-section-kind="${kind}"
  data-background-editable="true"
>
  ${inner}
</section>
`;
}

function titleBlock(kind: SectionKind, align: "center" | "right" = "center") {
  const isCenter = align === "center";

  return `
    <div class="${isCenter ? "mx-auto text-center" : "text-right"} max-w-[820px]">
      <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">
        ${sectionName[kind]}
      </p>
      <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">
        ${sectionName[kind]} בעיצוב מקצועי
      </h2>
      <p class="mt-5 text-lg font-bold leading-9 text-slate-500">
        אפשר לערוך טקסט, צבעים, תמונות, רקעים, פינות, ריווח, כפתורים וכל חלק בסקשן.
      </p>
    </div>
  `;
}

function actions() {
  return `
    <div class="mt-9 flex flex-wrap gap-4">
      <a class="inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-8 text-sm font-black text-white shadow-xl shadow-violet-200">
        קביעת תור
      </a>
      <a class="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg">
        מידע נוסף
      </a>
    </div>
  `;
}

function card(title: string, text: string, icon = "✦") {
  return `
    <article class="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
      <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 text-lg font-black text-white">
        ${icon}
      </div>
      <h3 class="text-2xl font-black text-slate-950">${title}</h3>
      <p class="mt-3 text-sm font-bold leading-7 text-slate-500">${text}</p>
    </article>
  `;
}

/* =====================================================
   HERO — 10 מבנים
===================================================== */

function heroLayout(index: number) {
  const layouts = [
    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <div class="rounded-[44px] border border-white bg-white/90 p-14 shadow-[0_36px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">סטודיו פרימיום</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">יופי טבעי שמתחיל בחוויה מקצועית</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">טיפולים מתקדמים, יחס אישי ותוצאה מדויקת.</p>
          ${actions()}
        </div>
        ${imageCard(img.beauty)}
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-2">
        ${imageCard(img.hair)}
        <div class="rounded-[44px] border border-white bg-white/90 p-14 shadow-[0_36px_120px_rgba(15,23,42,0.12)]">
          <p class="mb-4 inline-flex rounded-full bg-fuchsia-50 px-5 py-2 text-sm font-black text-fuchsia-700">מבנה הפוך</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">מראה יוקרתי שמרגיש טבעי</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">תמונה בצד ימין וטקסט בצד שמאל.</p>
          ${actions()}
        </div>
      </div>
      `
    ),

    bgSection(
      "hero",
      img.salon,
      `
      <div class="max-w-[820px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-violet-700">תמונת רקע מלאה</p>
        <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-white">אתר עסקי שנראה כמו מותג פרימיום</h1>
        <p class="mt-6 text-xl font-bold leading-10 text-white/80">אפשר להפוך כל תמונה לרקע סקשן.</p>
        ${actions()}
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="mx-auto max-w-[980px] rounded-[48px] border border-slate-200 bg-white p-16 text-center shadow-[0_36px_120px_rgba(15,23,42,0.10)]">
        <p class="mx-auto mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">ממורכז נקי</p>
        <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">כותרת חזקה במרכז</h1>
        <p class="mx-auto mt-6 max-w-[720px] text-xl font-bold leading-10 text-slate-500">מבנה נקי בלי תמונה, מתאים לדפי נחיתה ומסרים חזקים.</p>
        <div class="flex justify-center">${actions()}</div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">2 תמונות</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">הצגה ויזואלית חזקה</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">מתאים ליופי, קליניקה, חנות, סטודיו ושירותים.</p>
          ${actions()}
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          ${imageCard(img.beauty)}
          ${imageCard(img.hair)}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="rounded-[48px] bg-slate-950 p-12 shadow-[0_40px_140px_rgba(15,23,42,0.22)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">כהה יוקרתי</p>
            <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-white">מותג שנראה יוקרתי</h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/70">מבנה כהה, דרמטי ומרשים.</p>
            ${actions()}
          </div>
          ${imageCard(img.clinic)}
        </div>
      </div>
      `
    ),

    bgSection(
      "hero",
      img.beauty,
      `
      <div class="grid min-h-[500px] place-items-center text-center">
        <div>
          <p class="mx-auto mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-violet-700">וידאו / מדיה</p>
          <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-white">רקע ויזואלי מלא</h1>
          <p class="mx-auto mt-6 max-w-[740px] text-xl font-bold leading-10 text-white/80">מתאים לוידאו, סליידר או תמונת אווירה.</p>
          <div class="flex justify-center">${actions()}</div>
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageCard(img.salon)}
          ${addImageDropBox()}
        </div>
        <div>
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">הוספת תמונה</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">גררי תמונה לתוך המבנה</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">יש מקום מוכן להוספת תמונה נוספת.</p>
          ${actions()}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="rounded-[48px] bg-gradient-to-l from-violet-700 to-fuchsia-600 p-16 text-white shadow-[0_40px_140px_rgba(139,92,246,0.26)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white">מוצר / שירות</p>
            <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em]">שירות מוביל שמוכר מהר</h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/80">מבנה עם מחיר, CTA ותמונה.</p>
            ${actions()}
          </div>
          ${imageCard(img.product)}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-stretch gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2 rounded-[44px] bg-white p-14 shadow-[0_30px_100px_rgba(15,23,42,0.10)]">
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">מבנה כרטיסים</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">כותרת ראשית + כרטיס צד</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">הירו שמתאים לעסקים שרוצים להציג גם פרטים מהירים.</p>
          ${actions()}
        </div>
        <div class="rounded-[44px] bg-slate-950 p-8 text-white">
          <p class="text-sm font-black text-white/60">פרטים מהירים</p>
          <h3 class="mt-3 text-3xl font-black">VIP</h3>
          <p class="mt-4 text-white/70">הטבה, מחיר, תור פנוי או מבצע.</p>
        </div>
      </div>
      `
    ),
  ];

  return layouts[index];
}

/* =====================================================
   GENERIC — 10 מבנים לכל סוג סקשן
===================================================== */

function genericLayout(kind: SectionKind, index: number) {
  const name = sectionName[kind];

  const layouts = [
    sectionShell(kind, titleBlock(kind, "center")),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>${titleBlock(kind, "right")}${actions()}</div>
        ${imageCard(img.salon)}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        ${imageCard(img.beauty)}
        <div>${titleBlock(kind, "right")}${actions()}</div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      ${titleBlock(kind, "center")}
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${card(`${name} ראשון`, "תיאור קצר שאפשר לערוך.", "1")}
        ${card(`${name} שני`, "תיאור קצר שאפשר לערוך.", "2")}
        ${card(`${name} שלישי`, "תיאור קצר שאפשר לערוך.", "3")}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <div>${titleBlock(kind, "right")}</div>
        <div class="grid gap-5 md:grid-cols-2">
          ${imageCard(img.beauty)}
          ${imageCard(img.hair)}
        </div>
      </div>
      `
    ),

    bgSection(
      kind,
      img.salon,
      `
      <div class="max-w-[760px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-violet-700">${name}</p>
        <h2 class="text-6xl font-black leading-[1] tracking-[-0.05em] text-white">${name} עם תמונת רקע</h2>
        <p class="mt-6 text-xl font-bold leading-10 text-white/80">אפשר להפוך כל תמונה לרקע הסקשן.</p>
        ${actions()}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="rounded-[48px] bg-slate-950 p-14 text-white shadow-[0_40px_140px_rgba(15,23,42,0.22)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">${name}</p>
            <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em]">${name} כהה</h2>
            <p class="mt-5 text-lg font-bold leading-9 text-white/70">מבנה כהה, יוקרתי ומודגש.</p>
          </div>
          ${imageCard(img.clinic)}
        </div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      ${titleBlock(kind, "center")}
      <div class="mt-12 flex gap-6 overflow-x-auto pb-5">
        <div class="min-w-[340px]">${card(`${name} 1`, "כרטיס קרוסלה.", "✦")}</div>
        <div class="min-w-[340px]">${card(`${name} 2`, "כרטיס קרוסלה.", "✦")}</div>
        <div class="min-w-[340px]">${card(`${name} 3`, "כרטיס קרוסלה.", "✦")}</div>
        <div class="min-w-[340px]">${card(`${name} 4`, "כרטיס קרוסלה.", "✦")}</div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="rounded-[48px] bg-gradient-to-br from-violet-50 to-white p-14 shadow-[0_28px_100px_rgba(15,23,42,0.08)]">
        ${titleBlock(kind, "center")}
        <div class="mt-10">${addImageDropBox()}</div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid gap-7 lg:grid-cols-2">
        <div class="rounded-[40px] bg-white p-10 shadow-[0_28px_90px_rgba(15,23,42,0.09)]">
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">${name}</p>
          <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">טור תוכן ראשי</h2>
          <p class="mt-5 text-lg font-bold leading-9 text-slate-500">מבנה שני טורים עם תוכן וכרטיס צד.</p>
        </div>
        <div class="rounded-[40px] bg-slate-950 p-10 text-white">
          <h3 class="text-3xl font-black">כרטיס צד</h3>
          <p class="mt-4 text-white/70">אפשר לשים מחיר, שעות, קופון, טופס או CTA.</p>
          ${actions()}
        </div>
      </div>
      `
    ),
  ];

  return layouts[index];
}

/* =====================================================
   STORE — 10 מבנים
===================================================== */

function storeLayout(index: number) {
  const base = genericLayout("store", index);

  const layouts = [
    sectionShell(
      "store",
      `
      ${titleBlock("store", "center")}
      <div class="mt-12 grid gap-6 md:grid-cols-3" data-bizuply-block="products">
        ${productCard("מוצר ראשון", "₪129", img.product)}
        ${productCard("מוצר שני", "₪99", img.store)}
        ${productCard("מוצר שלישי", "₪249", img.hair)}
      </div>
      `
    ),

    sectionShell(
      "store",
      `
      <div class="grid items-center gap-12 lg:grid-cols-2" data-bizuply-block="products">
        ${imageCard(img.product)}
        <div>
          <p class="mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-sm font-black text-violet-700">מוצר מוביל</p>
          <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">מוצר פרימיום</h2>
          <p class="mt-5 text-lg font-bold leading-9 text-slate-500">מוצר אחד גדול עם מחיר וכפתור רכישה.</p>
          <div class="mt-8 flex items-center gap-4">
            <a class="rounded-2xl bg-violet-700 px-8 py-4 text-sm font-black text-white">הוספה לסל</a>
            <span class="rounded-full bg-violet-50 px-5 py-3 text-sm font-black text-violet-700">₪249</span>
          </div>
        </div>
      </div>
      `
    ),
  ];

  return layouts[index] || base;
}

function productCard(title: string, price: string, src: string) {
  return `
    <article class="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      ${imageCard(src, "shadow-none")}
      <h3 class="mt-6 text-2xl font-black text-slate-950">${title}</h3>
      <p class="mt-2 text-sm font-bold leading-7 text-slate-500">תיאור קצר של המוצר.</p>
      <div class="mt-6 flex items-center justify-between gap-3">
        <a class="rounded-2xl bg-violet-700 px-5 py-3 text-xs font-black text-white">הוספה לסל</a>
        <span class="rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">${price}</span>
      </div>
    </article>
  `;
}

/* =====================================================
   BOOKING — 10 מבנים
===================================================== */

function bookingLayout(index: number) {
  const base = genericLayout("booking", index);

  const layouts = [
    sectionShell(
      "booking",
      `
      ${titleBlock("booking", "center")}
      <div class="mx-auto mt-12 max-w-[860px] rounded-[40px] bg-white p-8 shadow-[0_28px_100px_rgba(15,23,42,0.10)]" data-bizuply-block="booking">
        <div class="grid gap-4 sm:grid-cols-3">
          ${["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
            .map(
              (time) =>
                `<button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700 hover:bg-violet-700 hover:text-white">${time}</button>`
            )
            .join("")}
        </div>
      </div>
      `
    ),

    sectionShell(
      "booking",
      `
      <div class="rounded-[48px] bg-slate-950 p-14 text-white" data-bizuply-block="booking">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">מחובר ליומן</p>
            <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em]">קובעים תור אונליין</h2>
            <p class="mt-5 text-lg font-bold leading-9 text-white/70">בחירת שירות, תאריך ושעה פנויה.</p>
          </div>
          <div class="rounded-[34px] bg-white p-7">
            <div class="grid gap-4 sm:grid-cols-2">
              ${["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
                .map(
                  (time) =>
                    `<button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">${time}</button>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
  ];

  return layouts[index] || base;
}

/* =====================================================
   EXPORT
===================================================== */

const kinds: SectionKind[] = [
  "hero",
  "about",
  "services",
  "gallery",
  "store",
  "booking",
  "reviews",
  "contact",
  "club",
  "basic",
];

const titles: Record<SectionKind, string[]> = {
  hero: [
    "טקסט + תמונה",
    "תמונה + טקסט",
    "תמונת רקע מלאה",
    "ממורכז נקי",
    "שתי תמונות",
    "כהה יוקרתי",
    "וידאו / מדיה",
    "הוספת תמונה",
    "מוצר / שירות",
    "כרטיס צד",
  ],
  about: [
    "אודות ממורכז",
    "אודות עם תמונה",
    "תמונה + טקסט",
    "3 כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך + תמונה",
    "שני טורים",
  ],
  services: [
    "שירותים ממורכז",
    "שירותים עם תמונה",
    "תמונה + שירותים",
    "3 כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
  gallery: [
    "גלריה ממורכזת",
    "גלריה עם תמונה",
    "תמונה + גלריה",
    "גריד",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "Featured",
  ],
  store: [
    "גריד מוצרים",
    "מוצר מרכזי",
    "חנות עם תמונה",
    "3 מוצרים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "מבצע",
  ],
  booking: [
    "שעות פנויות",
    "יומן כהה",
    "תורים עם תמונה",
    "כרטיסי תורים",
    "2 אזורים",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "טופס תור",
  ],
  reviews: [
    "ביקורות ממורכז",
    "ביקורות עם תמונה",
    "תמונה + ביקורות",
    "3 ביקורות",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
  contact: [
    "טופס מרכזי",
    "טופס עם תמונה",
    "תמונה + טופס",
    "כרטיסי קשר",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "טופס רחב",
  ],
  club: [
    "מועדון ממורכז",
    "מועדון עם תמונה",
    "תמונה + מועדון",
    "הטבות",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "קופון",
  ],
  basic: [
    "בסיסי ממורכז",
    "בסיסי עם תמונה",
    "תמונה + טקסט",
    "כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
};

export const sectionLayoutVariants: SectionLayoutVariant[] = kinds.flatMap(
  (kind) =>
    Array.from({ length: 10 }, (_, index) => {
      const html =
        kind === "hero"
          ? heroLayout(index)
          : kind === "store"
            ? storeLayout(index)
            : kind === "booking"
              ? bookingLayout(index)
              : genericLayout(kind, index);

      return variant(
        `${kind}-layout-${index + 1}`,
        kind,
        titles[kind][index],
        `מבנה ${index + 1} מתוך 10 לסקשן ${sectionName[kind]} — כולל עריכת טקסט, תמונות, רקעים, צבעים ופינות.`,
        titles[kind][index],
        index === 5
          ? "רקע"
          : index === 7
            ? "קרוסלה"
            : index === 8
              ? "הוספת תמונה"
              : index === 0
                ? "מומלץ"
                : "מבנה",
        html
      );
    })
);

export function getSectionLayoutVariants(kind: SectionKind) {
  return sectionLayoutVariants.filter((variant) => variant.kind === kind);
}