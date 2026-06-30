import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplate,
  ReadyWebsiteTemplateSeed,
} from "../data/readyWebsiteTypes";

type DesignPreset = {
  page: string;
  surface: string;
  soft: string;
  dark: string;
  primaryText: string;
  mutedText: string;
  accentText: string;
  primaryBg: string;
  secondaryBg: string;
  accentBg: string;
  accentSoft: string;
  border: string;
  ring: string;
  button: string;
  ghostButton: string;
  darkMode: boolean;
};

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

const servicePrices = ["₪180", "₪320", "₪590"];

function getDesignPreset(seed: ReadyWebsiteTemplateSeed): DesignPreset {
  const key = `${seed.category} ${seed.layout}`.toLowerCase();

  if (
    key.includes("dark") ||
    key.includes("barber") ||
    key.includes("tattoo") ||
    key.includes("auto")
  ) {
    return {
      page: "bg-slate-950 text-white",
      surface: "bg-slate-900 text-white",
      soft: "bg-slate-800",
      dark: "bg-slate-950",
      primaryText: "text-white",
      mutedText: "text-slate-300",
      accentText: "text-amber-300",
      primaryBg: "bg-slate-950",
      secondaryBg: "bg-slate-800",
      accentBg: "bg-amber-400",
      accentSoft: "bg-amber-400/15",
      border: "border-white/10",
      ring: "ring-white/10",
      button: "bg-amber-400 text-slate-950 hover:bg-amber-300",
      ghostButton: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
      darkMode: true,
    };
  }

  if (
    key.includes("beauty") ||
    key.includes("makeup") ||
    key.includes("spa") ||
    key.includes("rose")
  ) {
    return {
      page: "bg-rose-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-rose-100",
      dark: "bg-rose-950",
      primaryText: "text-rose-950",
      mutedText: "text-slate-600",
      accentText: "text-rose-600",
      primaryBg: "bg-rose-700",
      secondaryBg: "bg-pink-500",
      accentBg: "bg-rose-500",
      accentSoft: "bg-rose-100",
      border: "border-rose-100",
      ring: "ring-rose-100",
      button: "bg-rose-700 text-white hover:bg-rose-800",
      ghostButton: "border border-rose-200 bg-white text-rose-800 hover:bg-rose-50",
      darkMode: false,
    };
  }

  if (
    key.includes("clinic") ||
    key.includes("dental") ||
    key.includes("health")
  ) {
    return {
      page: "bg-teal-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-teal-100",
      dark: "bg-teal-950",
      primaryText: "text-teal-950",
      mutedText: "text-slate-600",
      accentText: "text-teal-700",
      primaryBg: "bg-teal-700",
      secondaryBg: "bg-cyan-500",
      accentBg: "bg-teal-500",
      accentSoft: "bg-teal-100",
      border: "border-teal-100",
      ring: "ring-teal-100",
      button: "bg-teal-700 text-white hover:bg-teal-800",
      ghostButton: "border border-teal-200 bg-white text-teal-800 hover:bg-teal-50",
      darkMode: false,
    };
  }

  if (
    key.includes("food") ||
    key.includes("restaurant") ||
    key.includes("catering")
  ) {
    return {
      page: "bg-orange-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-orange-100",
      dark: "bg-orange-950",
      primaryText: "text-orange-950",
      mutedText: "text-slate-600",
      accentText: "text-orange-700",
      primaryBg: "bg-orange-800",
      secondaryBg: "bg-orange-600",
      accentBg: "bg-orange-500",
      accentSoft: "bg-orange-100",
      border: "border-orange-100",
      ring: "ring-orange-100",
      button: "bg-orange-700 text-white hover:bg-orange-800",
      ghostButton: "border border-orange-200 bg-white text-orange-800 hover:bg-orange-50",
      darkMode: false,
    };
  }

  if (
    key.includes("fitness") ||
    key.includes("garden") ||
    key.includes("organic") ||
    key.includes("yoga")
  ) {
    return {
      page: "bg-lime-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-lime-100",
      dark: "bg-lime-950",
      primaryText: "text-lime-950",
      mutedText: "text-slate-600",
      accentText: "text-lime-700",
      primaryBg: "bg-lime-700",
      secondaryBg: "bg-green-600",
      accentBg: "bg-lime-400",
      accentSoft: "bg-lime-100",
      border: "border-lime-100",
      ring: "ring-lime-100",
      button: "bg-lime-700 text-white hover:bg-lime-800",
      ghostButton: "border border-lime-200 bg-white text-lime-800 hover:bg-lime-50",
      darkMode: false,
    };
  }

  if (
    key.includes("law") ||
    key.includes("legal") ||
    key.includes("luxury") ||
    key.includes("jewelry") ||
    key.includes("gold")
  ) {
    return {
      page: "bg-amber-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-amber-100",
      dark: "bg-slate-950",
      primaryText: "text-slate-950",
      mutedText: "text-slate-600",
      accentText: "text-amber-700",
      primaryBg: "bg-slate-950",
      secondaryBg: "bg-amber-700",
      accentBg: "bg-amber-500",
      accentSoft: "bg-amber-100",
      border: "border-amber-100",
      ring: "ring-amber-100",
      button: "bg-slate-950 text-white hover:bg-amber-700",
      ghostButton: "border border-amber-200 bg-white text-slate-950 hover:bg-amber-50",
      darkMode: false,
    };
  }

  if (
    key.includes("agency") ||
    key.includes("course") ||
    key.includes("club") ||
    key.includes("saas") ||
    key.includes("purple")
  ) {
    return {
      page: "bg-violet-50 text-slate-950",
      surface: "bg-white text-slate-950",
      soft: "bg-violet-100",
      dark: "bg-violet-950",
      primaryText: "text-violet-950",
      mutedText: "text-slate-600",
      accentText: "text-violet-700",
      primaryBg: "bg-violet-700",
      secondaryBg: "bg-fuchsia-600",
      accentBg: "bg-violet-500",
      accentSoft: "bg-violet-100",
      border: "border-violet-100",
      ring: "ring-violet-100",
      button: "bg-violet-700 text-white hover:bg-violet-800",
      ghostButton: "border border-violet-200 bg-white text-violet-800 hover:bg-violet-50",
      darkMode: false,
    };
  }

  return {
    page: "bg-slate-50 text-slate-950",
    surface: "bg-white text-slate-950",
    soft: "bg-slate-100",
    dark: "bg-slate-950",
    primaryText: "text-slate-950",
    mutedText: "text-slate-600",
    accentText: "text-sky-700",
    primaryBg: "bg-slate-950",
    secondaryBg: "bg-sky-600",
    accentBg: "bg-sky-500",
    accentSoft: "bg-sky-100",
    border: "border-slate-200",
    ring: "ring-slate-100",
    button: "bg-slate-950 text-white hover:bg-sky-700",
    ghostButton: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    darkMode: false,
  };
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function titleBlock(block: ReadyWebsiteBlock, eyebrow: string, preset: DesignPreset) {
  const description = block.subtitle || block.text || "";

  return `
    <div class="mb-10 text-center">
      <span class="mb-4 inline-flex rounded-full ${preset.accentSoft} px-4 py-2 text-sm font-black ${preset.accentText}">
        ${safe(eyebrow)}
      </span>
      <h2 class="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-[-0.06em] ${preset.primaryText} md:text-6xl">
        ${safe(block.title)}
      </h2>
      ${
        description
          ? `<p class="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 ${preset.mutedText}">${safe(description)}</p>`
          : ""
      }
    </div>
  `;
}

function renderHeader(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed, preset: DesignPreset) {
  const menu = ["בית", "שירותים", "גלריה", "תורים", "צור קשר"];

  if (block.variant.includes("center")) {
    return `
      <header ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 px-6 py-7">
        <nav class="hidden items-center gap-2 md:flex">
          ${menu
            .slice(0, 2)
            .map(
              (item) =>
                `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.mutedText} hover:${preset.accentText}">${safe(item)}</a>`
            )
            .join("")}
        </nav>

        <a href="#" class="rounded-full ${preset.surface} px-7 py-4 text-2xl font-black tracking-[-0.06em] ${preset.primaryText} shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
          ${safe(template.niche)}
        </a>

        <nav class="hidden items-center gap-2 md:flex">
          ${menu
            .slice(2)
            .map(
              (item) =>
                `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.mutedText} hover:${preset.accentText}">${safe(item)}</a>`
            )
            .join("")}
        </nav>
      </header>
    `;
  }

  if (block.variant.includes("side")) {
    return `
      <header ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-5 px-6 py-7 md:grid-cols-[1fr_auto_auto]">
        <div>
          <a href="#" class="text-3xl font-black tracking-[-0.07em] ${preset.primaryText}">
            ${safe(template.niche)}
          </a>
          <p class="mt-1 text-sm font-bold ${preset.mutedText}">אתר עסקי מוכן לעבודה</p>
        </div>

        <nav class="flex flex-wrap items-center gap-2 rounded-[26px] ${preset.surface} p-2 shadow-lg shadow-slate-200/60 ring-1 ${preset.ring}">
          ${menu
            .map(
              (item) =>
                `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.mutedText} hover:${preset.accentText}">${safe(item)}</a>`
            )
            .join("")}
        </nav>

        <a class="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}" href="#booking">
          קביעת תור
        </a>
      </header>
    `;
  }

  return `
    <header ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-7">
      <a href="#" class="text-3xl font-black tracking-[-0.07em] ${preset.primaryText}">
        ${safe(template.niche)}
      </a>

      <nav class="hidden items-center gap-2 md:flex">
        ${menu
          .map(
            (item) =>
              `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.mutedText} hover:${preset.accentText}">${safe(item)}</a>`
          )
          .join("")}
      </nav>

      <a class="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}" href="#contact">
        צור קשר
      </a>
    </header>
  `;
}

function renderHero(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed, preset: DesignPreset) {
  const image = safe(block.image || template.image);

  if (block.variant.includes("fullscreen")) {
    return `
      <section ${sectionAttrs(block)} class="relative isolate min-h-[720px] overflow-hidden">
        <img src="${image}" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent"></div>

        <div class="mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-6 py-24">
          <div class="max-w-4xl">
            <span class="mb-5 inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-black text-white ring-1 ring-white/20">
              ${safe(template.niche)}
            </span>

            <h1 class="max-w-4xl text-6xl font-black leading-[0.92] tracking-[-0.09em] text-white md:text-8xl">
              ${safe(template.heroTitle)}
            </h1>

            <p class="mt-7 max-w-2xl text-xl font-bold leading-9 text-white/82">
              ${safe(template.heroSubtitle)}
            </p>

            <div class="mt-9 flex flex-wrap gap-3">
              <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-base font-black text-slate-950 transition hover:bg-slate-100">
                קביעת תור
              </a>
              <a href="#gallery" class="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-base font-black text-white backdrop-blur transition hover:bg-white/15">
                צפייה בעבודות
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  if (block.variant.includes("offer")) {
    return `
      <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1.1fr_0.75fr]">
        <div>
          <span class="mb-5 inline-flex rounded-full ${preset.accentSoft} px-5 py-2 text-sm font-black ${preset.accentText}">
            ${safe(template.niche)}
          </span>

          <h1 class="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.09em] ${preset.primaryText} md:text-8xl">
            ${safe(template.heroTitle)}
          </h1>

          <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.mutedText}">
            ${safe(template.heroSubtitle)}
          </p>

          <div class="mt-9 flex flex-wrap gap-3">
            <a href="#lead" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">
              אני רוצה פרטים
            </a>
            <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghostButton}">
              שירותים
            </a>
          </div>
        </div>

        <aside class="relative overflow-hidden rounded-[44px] ${preset.surface} p-9 shadow-2xl shadow-slate-200/70 ring-1 ${preset.ring}">
          <div class="absolute -left-20 -top-20 h-44 w-44 rounded-full ${preset.accentSoft} blur-3xl"></div>
          <small class="relative text-sm font-black ${preset.accentText}">מבצע השקה</small>
          <h2 class="relative mt-4 text-4xl font-black tracking-[-0.07em] ${preset.primaryText}">
            חבילת אתר עסקי
          </h2>
          <b class="relative mt-5 block text-7xl font-black tracking-[-0.1em] ${preset.accentText}">
            ₪2,000
          </b>
          <p class="relative mt-4 text-base font-bold leading-7 ${preset.mutedText}">
            כולל אתר, יומן, טופס לידים, חנות וסקשנים מוכנים לעריכה.
          </p>
        </aside>
      </section>
    `;
  }

  if (block.variant.includes("cards")) {
    return `
      <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.95fr]">
        <div>
          <span class="mb-5 inline-flex rounded-full ${preset.accentSoft} px-5 py-2 text-sm font-black ${preset.accentText}">
            ${safe(template.niche)}
          </span>

          <h1 class="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.09em] ${preset.primaryText} md:text-8xl">
            ${safe(template.heroTitle)}
          </h1>

          <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.mutedText}">
            ${safe(template.heroSubtitle)}
          </p>

          <div class="mt-9 flex flex-wrap gap-3">
            <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">
              קביעת תור
            </a>
            <a href="#contact" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghostButton}">
              שיחה עם העסק
            </a>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <article class="rounded-[32px] ${preset.surface} p-7 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
            <b class="block text-6xl font-black tracking-[-0.09em] ${preset.primaryText}">24/7</b>
            <small class="mt-2 block text-sm font-black ${preset.mutedText}">איסוף לידים</small>
          </article>

          <article class="rounded-[32px] ${preset.surface} p-7 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
            <b class="block text-6xl font-black tracking-[-0.09em] ${preset.accentText}">98%</b>
            <small class="mt-2 block text-sm font-black ${preset.mutedText}">חווית משתמש</small>
          </article>

          <img src="${image}" alt="" class="col-span-2 h-[360px] w-full rounded-[38px] object-cover shadow-2xl shadow-slate-300/60" />
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.95fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.accentSoft} px-5 py-2 text-sm font-black ${preset.accentText}">
          ${safe(template.niche)}
        </span>

        <h1 class="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.09em] ${preset.primaryText} md:text-8xl">
          ${safe(template.heroTitle)}
        </h1>

        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.mutedText}">
          ${safe(template.heroSubtitle)}
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">
            קביעת תור
          </a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghostButton}">
            לשירותים
          </a>
        </div>
      </div>

      <img src="${image}" alt="" class="h-[520px] w-full rounded-[46px] object-cover shadow-2xl shadow-slate-300/60" />
    </section>
  `;
}

function renderServices(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const items = block.items?.length
    ? block.items
    : ["שירות פרימיום", "ייעוץ אישי", "ליווי מלא"];

  if (block.variant.includes("list")) {
    return `
      <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
        ${titleBlock(block, "שירותים", preset)}

        <div class="grid gap-4">
          ${items
            .map(
              (item, index) => `
                <article class="grid grid-cols-1 items-center gap-5 rounded-[30px] ${preset.surface} p-6 shadow-lg shadow-slate-200/60 ring-1 ${preset.ring} md:grid-cols-[90px_1fr_auto]">
                  <span class="text-5xl font-black tracking-[-0.08em] ${preset.accentText}">0${index + 1}</span>

                  <div>
                    <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.primaryText}">${safe(item)}</h3>
                    <p class="mt-2 text-base font-bold leading-7 ${preset.mutedText}">תיאור שירות מקצועי שהעסק יכול לערוך בקלות.</p>
                  </div>

                  <b class="text-3xl font-black tracking-[-0.06em] ${preset.primaryText}">
                    ${servicePrices[index % servicePrices.length]}
                  </b>
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
      <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
        ${titleBlock(block, "תהליך עבודה", preset)}

        <div class="relative mx-auto max-w-4xl">
          <div class="absolute right-6 top-0 hidden h-full w-px ${preset.accentBg} md:block"></div>

          <div class="grid gap-5">
            ${items
              .map(
                (item, index) => `
                  <article class="relative grid grid-cols-[60px_1fr] gap-5 rounded-[30px] ${preset.surface} p-6 shadow-lg shadow-slate-200/60 ring-1 ${preset.ring}">
                    <span class="grid h-12 w-12 place-items-center rounded-2xl ${preset.primaryBg} text-xl font-black text-white">
                      ${index + 1}
                    </span>

                    <div>
                      <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.primaryText}">${safe(item)}</h3>
                      <p class="mt-2 text-base font-bold leading-7 ${preset.mutedText}">שלב ברור בחווית הלקוח, עם הסבר קצר ופעולה.</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "שירותים", preset)}

      <div class="grid gap-5 md:grid-cols-3">
        ${items
          .map(
            (item, index) => `
              <article class="group rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring} transition hover:-translate-y-1 hover:shadow-2xl">
                <div class="mb-6 grid h-16 w-16 place-items-center rounded-3xl ${index % 2 === 0 ? preset.primaryBg : preset.accentBg} text-2xl font-black text-white">
                  ${["✦", "◈", "●"][index % 3]}
                </div>

                <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.primaryText}">${safe(item)}</h3>
                <p class="mt-3 text-base font-bold leading-7 ${preset.mutedText}">בלוק שירות מוכן לעריכה עם טקסט, מחיר וכפתור פעולה.</p>
                <a href="#booking" class="mt-6 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}">
                  בחר שירות
                </a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderGallery(block: ReadyWebsiteBlock, preset: DesignPreset) {
  if (block.variant.includes("masonry")) {
    return `
      <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
        ${titleBlock(block, "גלריה", preset)}

        <div class="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-3">
          ${demoImages
            .map(
              (image, index) => `
                <figure class="${index % 3 === 1 ? "md:row-span-2" : ""} overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/60">
                  <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </figure>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  if (block.variant.includes("slider")) {
    return `
      <section ${sectionAttrs(block)} class="w-full overflow-hidden py-20">
        <div class="mx-auto w-full max-w-7xl px-6">
          ${titleBlock(block, "עבודות אחרונות", preset)}
        </div>

        <div class="flex gap-5 overflow-x-auto px-6 pb-4">
          ${demoImages
            .slice(0, 5)
            .map(
              (image) => `
                <figure class="h-[330px] min-w-[360px] overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/60">
                  <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </figure>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "גלריה", preset)}

      <div class="grid gap-4 md:grid-cols-3">
        ${demoImages
          .slice(0, 6)
          .map(
            (image) => `
              <figure class="h-[260px] overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/60">
                <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </figure>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBooking(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const days = Array.from(
    { length: 14 },
    (_, index) =>
      `<button type="button" class="h-11 rounded-full text-sm font-black ${
        [1, 4, 8, 11].includes(index)
          ? `${preset.primaryBg} text-white`
          : `${preset.soft} ${preset.primaryText}`
      }">${index + 1}</button>`
  ).join("");

  const times = ["09:00", "10:30", "12:00", "14:30", "17:00", "19:00"];

  const calendar = `
    <div
      class="rounded-[38px] ${preset.surface} p-7 shadow-2xl shadow-slate-200/70 ring-1 ${preset.ring}"
      data-bizuply-widget="booking-calendar"
      data-api="/api/businesses/{{businessId}}/availability"
      data-services-api="/api/businesses/{{businessId}}/services"
      data-appointments-api="/api/businesses/{{businessId}}/appointments"
    >
      <h3 class="text-3xl font-black tracking-[-0.05em] ${preset.primaryText}">בחרו תאריך ושעה</h3>

      <div class="mt-6 grid grid-cols-7 gap-2">${days}</div>

      <div class="mt-5 flex flex-wrap gap-2">
        ${times
          .map(
            (time) =>
              `<button type="button" class="h-11 rounded-full ${preset.soft} px-5 text-sm font-black ${preset.primaryText} hover:${preset.primaryBg} hover:text-white">${time}</button>`
          )
          .join("")}
      </div>

      <a href="#" class="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full text-base font-black transition ${preset.button}">
        אישור תור
      </a>
    </div>
  `;

  if (block.variant.includes("wide")) {
    return `
      <section ${sectionAttrs(block)} id="booking" class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[0.75fr_1.25fr]">
        <div>
          ${titleBlock(block, "יומן מחובר", preset)}
        </div>

        ${calendar}
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} id="booking" class="mx-auto w-full max-w-5xl px-6 py-20">
      ${titleBlock(block, "קביעת תור", preset)}
      ${calendar}
    </section>
  `;
}

function renderStore(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "חנות מחוברת", preset)}

      <div
        class="grid gap-5 md:grid-cols-3"
        data-bizuply-widget="products"
        data-api="/api/businesses/{{businessId}}/products"
      >
        ${["מוצר מוביל", "מוצר פרימיום", "מארז מתנה"]
          .map(
            (product, index) => `
              <article class="rounded-[34px] ${preset.surface} p-6 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
                <div class="mb-5 h-40 rounded-[26px] ${index % 2 === 0 ? preset.soft : preset.accentSoft}"></div>
                <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.primaryText}">${safe(product)}</h3>
                <p class="mt-2 text-base font-bold leading-7 ${preset.mutedText}">תיאור מוצר קצר שניתן להחליף.</p>
                <b class="mt-4 block text-3xl font-black tracking-[-0.06em] ${preset.accentText}">${["₪99", "₪149", "₪249"][index]}</b>
                <a href="#" class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-black transition ${preset.button}">
                  הוסף לעגלה
                </a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderLead(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} id="lead" class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.9fr]">
      <div class="rounded-[44px] ${preset.primaryBg} p-10 text-white shadow-2xl shadow-slate-300/50">
        <span class="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white">לידים</span>
        <h2 class="text-5xl font-black leading-tight tracking-[-0.07em] text-white">
          ${safe(block.title)}
        </h2>
        <p class="mt-4 text-lg font-bold leading-8 text-white/75">
          השאירו פרטים והעסק יחזור אליכם עם מענה מסודר ומהיר.
        </p>
      </div>

      <form
        class="grid gap-3 rounded-[38px] ${preset.surface} p-6 shadow-2xl shadow-slate-200/70 ring-1 ${preset.ring}"
        data-bizuply-widget="lead-form"
        data-api="/api/businesses/{{businessId}}/leads"
      >
        <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="שם מלא" />
        <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="טלפון" />
        <textarea class="min-h-32 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="מה תרצו לדעת?"></textarea>
        <button type="button" class="h-14 rounded-full text-base font-black transition ${preset.button}">שליחת פרטים</button>
      </form>
    </section>
  `;
}

function renderReviews(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "המלצות", preset)}

      <div
        class="grid gap-5 md:grid-cols-3"
        data-bizuply-widget="reviews"
        data-api="/api/businesses/{{businessId}}/reviews"
      >
        ${["חוויה מעולה ומקצועית", "הכל ברור ונוח", "שירות מהיר ומדויק"]
          .map(
            (text) => `
              <article class="rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
                <b class="text-xl ${preset.accentText}">★★★★★</b>
                <p class="mt-4 text-lg font-black leading-8 ${preset.primaryText}">${safe(text)}</p>
                <small class="mt-5 block text-sm font-bold ${preset.mutedText}">לקוח מרוצה</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFaq(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-4xl px-6 py-20">
      ${titleBlock(block, "שאלות נפוצות", preset)}

      <div class="grid gap-3">
        ${["איך קובעים תור?", "האם אפשר לערוך את האתר?", "האם זה מותאם לנייד?"]
          .map(
            (question) => `
              <details open class="rounded-[26px] ${preset.surface} p-5 shadow-lg shadow-slate-200/60 ring-1 ${preset.ring}">
                <summary class="cursor-pointer text-lg font-black ${preset.primaryText}">${safe(question)}</summary>
                <p class="mt-3 text-base font-bold leading-7 ${preset.mutedText}">כן. כל התוכן, התמונות והבלוקים ניתנים לעריכה מלאה.</p>
              </details>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderContact(block: ReadyWebsiteBlock, preset: DesignPreset) {
  if (block.variant.includes("map")) {
    return `
      <section ${sectionAttrs(block)} id="contact" class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-6 py-20 md:grid-cols-[0.75fr_1fr_0.8fr]">
        <div>${titleBlock(block, "יצירת קשר", preset)}</div>

        <div class="grid min-h-[320px] place-items-center rounded-[38px] ${preset.primaryBg} p-8 text-center text-2xl font-black text-white shadow-2xl shadow-slate-300/50">
          מפה / אזורי שירות
        </div>

        <form class="grid gap-3 rounded-[38px] ${preset.surface} p-6 shadow-2xl shadow-slate-200/70 ring-1 ${preset.ring}">
          <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="שם" />
          <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="טלפון" />
          <button type="button" class="h-14 rounded-full text-base font-black transition ${preset.button}">שליחה</button>
        </form>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block)} id="contact" class="mx-auto w-full max-w-5xl px-6 py-20 text-center">
      ${titleBlock(block, "יצירת קשר", preset)}

      <div class="flex flex-wrap justify-center gap-3">
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">WhatsApp</a>
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghostButton}">טלפון</a>
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghostButton}">Instagram</a>
      </div>
    </section>
  `;
}

function renderFooter(block: ReadyWebsiteBlock, template: ReadyWebsiteTemplateSeed, preset: DesignPreset) {
  return `
    <footer ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 border-t ${preset.border} px-6 py-10">
      <strong class="text-3xl font-black tracking-[-0.07em] ${preset.primaryText}">
        ${safe(template.niche)}
      </strong>

      <p class="max-w-xl text-sm font-bold leading-6 ${preset.mutedText}">
        אתר עסקי חכם עם תורים, לידים, חנות, ביקורות וסקשנים מוכנים.
      </p>

      <nav class="flex gap-4">
        <a href="#" class="text-sm font-black ${preset.mutedText} hover:${preset.accentText}">תנאים</a>
        <a href="#" class="text-sm font-black ${preset.mutedText} hover:${preset.accentText}">פרטיות</a>
        <a href="#" class="text-sm font-black ${preset.mutedText} hover:${preset.accentText}">צור קשר</a>
      </nav>
    </footer>
  `;
}

function renderGeneric(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, block.type, preset)}

      <div class="grid gap-5 md:grid-cols-3">
        ${[1, 2, 3]
          .map(
            (index) => `
              <article class="rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/60 ring-1 ${preset.ring}">
                <span class="text-4xl font-black tracking-[-0.07em] ${preset.accentText}">0${index}</span>
                <h3 class="mt-4 text-2xl font-black tracking-[-0.04em] ${preset.primaryText}">${safe(block.title)}</h3>
                <p class="mt-3 text-base font-bold leading-7 ${preset.mutedText}">${safe(block.text || "תוכן דמו מקצועי להחלפה.")}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBlock(
  block: ReadyWebsiteBlock,
  template: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  if (block.type === "header") return renderHeader(block, template, preset);
  if (block.type === "hero") return renderHero(block, template, preset);
  if (block.type === "booking") return renderBooking(block, preset);
  if (block.type === "store") return renderStore(block, preset);
  if (block.type === "lead") return renderLead(block, preset);
  if (block.type === "faq") return renderFaq(block, preset);
  if (block.type === "contact") return renderContact(block, preset);
  if (block.type === "footer") return renderFooter(block, template, preset);

  if (block.type === "reviews" || block.type === "testimonials") {
    return renderReviews(block, preset);
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
    return renderServices(block, preset);
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
    return renderGallery(block, preset);
  }

  return renderGeneric(block, preset);
}

/**
 * TSX + Tailwind בלבד:
 * אין כאן CSS string.
 * אין style tags.
 * אין inline style.
 * הפונקציה נשארת כדי לא לשבור את WebsiteStudioPage.tsx,
 * אבל היא מחזירה מחרוזת ריקה.
 */
export function buildReadyWebsiteCss(_palette: ReadyWebsitePalette) {
  return "";
}

export function buildReadyWebsiteHtml(seed: ReadyWebsiteTemplateSeed) {
  const preset = getDesignPreset(seed);

  return `
    <main
      dir="rtl"
      class="${cx(
        "min-h-screen overflow-hidden antialiased",
        preset.page
      )}"
      data-bizuply-site="true"
      data-template-id="${safe(seed.id)}"
    >
      ${seed.blocks.map((block) => renderBlock(block, seed, preset)).join("")}
    </main>
  `;
}

export function buildReadyWebsiteTemplate(
  seed: ReadyWebsiteTemplateSeed
): ReadyWebsiteTemplate {
  const html = buildReadyWebsiteHtml(seed);

  return {
    ...seed,
    html,
    css: "",
    preview: html,
  };
}
