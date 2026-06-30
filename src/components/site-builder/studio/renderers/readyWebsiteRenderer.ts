import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplate,
  ReadyWebsiteTemplateSeed,
} from "../data/readyWebsiteTypes";

type DesignPreset = {
  page: string;
  section: string;
  surface: string;
  surface2: string;
  soft: string;
  text: string;
  muted: string;
  accentText: string;
  button: string;
  ghost: string;
  chip: string;
  border: string;
  ring: string;
  dark: boolean;
};

const demoImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80",
];

const servicePrices = ["₪180", "₪320", "₪590", "₪790"];

function safe(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function blockDomId(block: ReadyWebsiteBlock) {
  return `${block.type}-${block.id}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function sectionAttrs(block: ReadyWebsiteBlock, anchorId?: string) {
  const id = anchorId || blockDomId(block);

  return `
    id="${safe(id)}"
    data-section-kind="${safe(block.type)}"
    data-section-title="${safe(block.title)}"
    data-bizuply-block="${safe(block.type)}"
    data-bizuply-variant="${safe(block.variant)}"
    data-studio-section-id="${safe(blockDomId(block))}"
  `;
}

function layoutKey(seed: ReadyWebsiteTemplateSeed) {
  return `${seed.category} ${seed.layout} ${seed.niche}`.toLowerCase();
}

function getPreset(seed: ReadyWebsiteTemplateSeed): DesignPreset {
  const key = layoutKey(seed);

  if (
    key.includes("dark") ||
    key.includes("barber") ||
    key.includes("tattoo") ||
    key.includes("auto")
  ) {
    return {
      page: "bg-[#070A12] text-white",
      section: "bg-[#070A12]",
      surface: "bg-slate-900 text-white",
      surface2: "bg-slate-800 text-white",
      soft: "bg-white/10",
      text: "text-white",
      muted: "text-slate-300",
      accentText: "text-amber-300",
      button: "bg-amber-400 text-slate-950 hover:bg-amber-300",
      ghost: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
      chip: "bg-white/10 text-white ring-1 ring-white/15",
      border: "border-white/10",
      ring: "ring-white/10",
      dark: true,
    };
  }

  if (
    key.includes("beauty") ||
    key.includes("makeup") ||
    key.includes("spa") ||
    key.includes("rose")
  ) {
    return {
      page: "bg-[#FFF1F7] text-slate-950",
      section: "bg-[#FFF1F7]",
      surface: "bg-white text-slate-950",
      surface2: "bg-rose-50 text-slate-950",
      soft: "bg-rose-100",
      text: "text-rose-950",
      muted: "text-slate-600",
      accentText: "text-rose-600",
      button: "bg-rose-700 text-white hover:bg-rose-800",
      ghost: "border border-rose-200 bg-white text-rose-800 hover:bg-rose-50",
      chip: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
      border: "border-rose-100",
      ring: "ring-rose-100",
      dark: false,
    };
  }

  if (
    key.includes("clinic") ||
    key.includes("dental") ||
    key.includes("health")
  ) {
    return {
      page: "bg-[#F0FDFA] text-slate-950",
      section: "bg-[#F0FDFA]",
      surface: "bg-white text-slate-950",
      surface2: "bg-teal-50 text-slate-950",
      soft: "bg-teal-100",
      text: "text-teal-950",
      muted: "text-slate-600",
      accentText: "text-teal-700",
      button: "bg-teal-700 text-white hover:bg-teal-800",
      ghost: "border border-teal-200 bg-white text-teal-800 hover:bg-teal-50",
      chip: "bg-teal-100 text-teal-800 ring-1 ring-teal-200",
      border: "border-teal-100",
      ring: "ring-teal-100",
      dark: false,
    };
  }

  if (
    key.includes("restaurant") ||
    key.includes("food") ||
    key.includes("catering")
  ) {
    return {
      page: "bg-[#FFF7ED] text-slate-950",
      section: "bg-[#FFF7ED]",
      surface: "bg-white text-slate-950",
      surface2: "bg-orange-50 text-slate-950",
      soft: "bg-orange-100",
      text: "text-orange-950",
      muted: "text-slate-600",
      accentText: "text-orange-700",
      button: "bg-orange-700 text-white hover:bg-orange-800",
      ghost: "border border-orange-200 bg-white text-orange-800 hover:bg-orange-50",
      chip: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
      border: "border-orange-100",
      ring: "ring-orange-100",
      dark: false,
    };
  }

  if (
    key.includes("fitness") ||
    key.includes("garden") ||
    key.includes("organic") ||
    key.includes("yoga")
  ) {
    return {
      page: "bg-[#F7FEE7] text-slate-950",
      section: "bg-[#F7FEE7]",
      surface: "bg-white text-slate-950",
      surface2: "bg-lime-50 text-slate-950",
      soft: "bg-lime-100",
      text: "text-lime-950",
      muted: "text-slate-600",
      accentText: "text-lime-700",
      button: "bg-lime-700 text-white hover:bg-lime-800",
      ghost: "border border-lime-200 bg-white text-lime-800 hover:bg-lime-50",
      chip: "bg-lime-100 text-lime-800 ring-1 ring-lime-200",
      border: "border-lime-100",
      ring: "ring-lime-100",
      dark: false,
    };
  }

  if (
    key.includes("law") ||
    key.includes("legal") ||
    key.includes("luxury") ||
    key.includes("jewelry") ||
    key.includes("gold") ||
    key.includes("hotel")
  ) {
    return {
      page: "bg-[#FFFBEB] text-slate-950",
      section: "bg-[#FFFBEB]",
      surface: "bg-white text-slate-950",
      surface2: "bg-amber-50 text-slate-950",
      soft: "bg-amber-100",
      text: "text-slate-950",
      muted: "text-slate-600",
      accentText: "text-amber-700",
      button: "bg-slate-950 text-white hover:bg-amber-700",
      ghost: "border border-amber-200 bg-white text-slate-950 hover:bg-amber-50",
      chip: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
      border: "border-amber-100",
      ring: "ring-amber-100",
      dark: false,
    };
  }

  if (
    key.includes("agency") ||
    key.includes("course") ||
    key.includes("club") ||
    key.includes("saas") ||
    key.includes("coaching")
  ) {
    return {
      page: "bg-[#F5F3FF] text-slate-950",
      section: "bg-[#F5F3FF]",
      surface: "bg-white text-slate-950",
      surface2: "bg-violet-50 text-slate-950",
      soft: "bg-violet-100",
      text: "text-violet-950",
      muted: "text-slate-600",
      accentText: "text-violet-700",
      button: "bg-violet-700 text-white hover:bg-violet-800",
      ghost: "border border-violet-200 bg-white text-violet-800 hover:bg-violet-50",
      chip: "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
      border: "border-violet-100",
      ring: "ring-violet-100",
      dark: false,
    };
  }

  return {
    page: "bg-slate-50 text-slate-950",
    section: "bg-slate-50",
    surface: "bg-white text-slate-950",
    surface2: "bg-slate-100 text-slate-950",
    soft: "bg-slate-100",
    text: "text-slate-950",
    muted: "text-slate-600",
    accentText: "text-sky-700",
    button: "bg-slate-950 text-white hover:bg-sky-700",
    ghost: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    chip: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
    border: "border-slate-200",
    ring: "ring-slate-100",
    dark: false,
  };
}

function imageFor(seed: ReadyWebsiteTemplateSeed, index = 0) {
  return safe(seed.image || demoImages[index % demoImages.length]);
}

function itemsFor(block: ReadyWebsiteBlock, fallback: string[]) {
  return block.items?.length ? block.items : fallback;
}

function titleBlock(
  block: ReadyWebsiteBlock,
  eyebrow: string,
  preset: DesignPreset,
  align: "center" | "right" | "left" = "center"
) {
  const description = block.subtitle || block.text || "";
  const alignClass =
    align === "center" ? "text-center" : align === "left" ? "text-left" : "text-right";
  const maxClass = align === "center" ? "mx-auto" : "";

  return `
    <div class="mb-10 ${alignClass}">
      <span class="mb-4 inline-flex rounded-full ${preset.chip} px-4 py-2 text-sm font-black">
        ${safe(eyebrow)}
      </span>
      <h2 class="${maxClass} max-w-3xl text-4xl font-black leading-tight tracking-[-0.06em] ${preset.text} md:text-6xl">
        ${safe(block.title)}
      </h2>
      ${
        description
          ? `<p class="${maxClass} mt-4 max-w-2xl text-lg font-bold leading-8 ${preset.muted}">${safe(description)}</p>`
          : ""
      }
    </div>
  `;
}

function renderHeader(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const menu = ["בית", "שירותים", "גלריה", "תורים", "צור קשר"];

  if (block.variant.includes("center")) {
    return `
      <header ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 px-6 py-7">
        <nav class="hidden items-center gap-2 md:flex">
          ${menu.slice(0, 2).map((item) => `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.muted}">${safe(item)}</a>`).join("")}
        </nav>
        <a href="#" class="rounded-full ${preset.surface} px-7 py-4 text-2xl font-black tracking-[-0.06em] ${preset.text} shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
          ${safe(seed.niche)}
        </a>
        <nav class="hidden items-center gap-2 md:flex">
          ${menu.slice(2).map((item) => `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.muted}">${safe(item)}</a>`).join("")}
        </nav>
      </header>
    `;
  }

  if (block.variant.includes("side")) {
    return `
      <header ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-5 px-6 py-7 md:grid-cols-[1fr_auto_auto]">
        <div>
          <a href="#" class="text-3xl font-black tracking-[-0.07em] ${preset.text}">${safe(seed.niche)}</a>
          <p class="mt-1 text-sm font-bold ${preset.muted}">אתר עסקי מוכן לעבודה</p>
        </div>

        <nav class="flex flex-wrap items-center gap-2 rounded-[26px] ${preset.surface} p-2 shadow-lg shadow-slate-200/20 ring-1 ${preset.ring}">
          ${menu.map((item) => `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.muted}">${safe(item)}</a>`).join("")}
        </nav>

        <a class="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}" href="#booking">
          קביעת תור
        </a>
      </header>
    `;
  }

  return `
    <header ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-7">
      <a href="#" class="text-3xl font-black tracking-[-0.07em] ${preset.text}">${safe(seed.niche)}</a>

      <nav class="hidden items-center gap-2 md:flex">
        ${menu.map((item) => `<a href="#" class="rounded-full px-4 py-2 text-sm font-black ${preset.muted}">${safe(item)}</a>`).join("")}
      </nav>

      <a class="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}" href="#contact">
        צור קשר
      </a>
    </header>
  `;
}

function renderHero(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const key = layoutKey(seed);

  if (key.includes("foodmenu") || key.includes("restaurant") || key.includes("catering")) {
    return renderHeroFood(block, seed, preset);
  }

  if (key.includes("masonry") || key.includes("portfolio") || key.includes("photographer")) {
    return renderHeroPortfolio(block, seed, preset);
  }

  if (key.includes("catalog") || key.includes("jewelry") || key.includes("store")) {
    return renderHeroStore(block, seed, preset);
  }

  if (key.includes("calendarfirst") || key.includes("clinic") || key.includes("dental")) {
    return renderHeroCalendar(block, seed, preset);
  }

  if (key.includes("dark") || key.includes("barber") || key.includes("tattoo") || key.includes("auto")) {
    return renderHeroDark(block, seed, preset);
  }

  if (key.includes("offer") || key.includes("course") || key.includes("club")) {
    return renderHeroOffer(block, seed, preset);
  }

  if (key.includes("magazine") || key.includes("editorial") || key.includes("minimal")) {
    return renderHeroEditorial(block, seed, preset);
  }

  if (key.includes("luxury") || block.variant.includes("fullscreen")) {
    return renderHeroLuxury(block, seed, preset);
  }

  if (key.includes("dashboard") || key.includes("case") || key.includes("tech") || block.variant.includes("cards")) {
    return renderHeroDashboard(block, seed, preset);
  }

  return renderHeroSplit(block, seed, preset);
}

function renderHeroEditorial(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 0);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-16 lg:grid-cols-[0.88fr_1.12fr]">
      <div class="flex min-h-[560px] flex-col justify-between rounded-[46px] ${preset.surface} p-8 shadow-2xl shadow-slate-200/30 ring-1 ${preset.ring}">
        <div>
          <span class="mb-6 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
          <h1 class="text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        </div>

        <div>
          <p class="mt-7 text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">קביעת תור</a>
            <a href="#gallery" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">גלריה</a>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <img src="${image}" alt="" class="col-span-2 h-[420px] w-full rounded-[46px] object-cover shadow-2xl shadow-slate-300/30" />
        <div class="rounded-[34px] bg-slate-950 p-7 text-white">
          <b class="text-5xl font-black tracking-[-0.08em]">01</b>
          <p class="mt-4 text-sm font-bold leading-6 text-white/80">עיצוב מגזיני עם תמונות גדולות.</p>
        </div>
        <div class="rounded-[34px] ${preset.soft} p-7">
          <b class="text-5xl font-black tracking-[-0.08em] ${preset.accentText}">02</b>
          <p class="mt-4 text-sm font-bold leading-6 ${preset.muted}">סקשנים רכים וזרימה יוקרתית.</p>
        </div>
      </div>
    </section>
  `;
}

function renderHeroLuxury(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  _preset: DesignPreset
) {
  const image = imageFor(seed, 1);

  return `
    <section ${sectionAttrs(block)} class="relative isolate min-h-[760px] overflow-hidden">
      <img src="${image}" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent"></div>

      <div class="mx-auto flex min-h-[760px] w-full max-w-7xl items-center px-6 py-24">
        <div class="max-w-4xl">
          <span class="mb-5 inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-black text-white ring-1 ring-white/20">${safe(seed.niche)}</span>
          <h1 class="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.09em] text-white md:text-8xl">${safe(seed.heroTitle)}</h1>
          <p class="mt-7 max-w-2xl text-xl font-bold leading-9 text-white/82">${safe(seed.heroSubtitle)}</p>

          <div class="mt-9 flex flex-wrap gap-3">
            <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-base font-black text-slate-950 transition hover:bg-slate-100">קביעת תור</a>
            <a href="#gallery" class="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-base font-black text-white backdrop-blur transition hover:bg-white/15">צפייה בעבודות</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHeroDark(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 2);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] text-white md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 text-slate-300">${safe(seed.heroSubtitle)}</p>

        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">קביעת תור</a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">מחירון</a>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <img src="${image}" alt="" class="col-span-2 h-[390px] w-full rounded-[40px] object-cover shadow-2xl shadow-black/40" />
        <article class="rounded-[30px] bg-white/10 p-7 ring-1 ring-white/10">
          <b class="text-5xl font-black tracking-[-0.08em] text-amber-300">24/7</b>
          <p class="mt-3 text-sm font-bold text-slate-300">זמינות ולידים</p>
        </article>
        <article class="rounded-[30px] bg-amber-400 p-7 text-slate-950">
          <b class="text-5xl font-black tracking-[-0.08em]">VIP</b>
          <p class="mt-3 text-sm font-black">חוויה פרימיום</p>
        </article>
      </div>
    </section>
  `;
}

function renderHeroCalendar(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">בדיקת זמינות</a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">טיפולים</a>
        </div>
      </div>

      <div class="rounded-[42px] ${preset.surface} p-6 shadow-2xl shadow-slate-200/40 ring-1 ${preset.ring}">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-3xl font-black tracking-[-0.06em] ${preset.text}">שעות פנויות</h3>
          <span class="rounded-full ${preset.chip} px-4 py-2 text-xs font-black">Live</span>
        </div>

        <div class="grid grid-cols-7 gap-2">
          ${Array.from({ length: 14 }, (_, index) => `<button class="h-12 rounded-full text-sm font-black ${[2, 5, 8, 11].includes(index) ? preset.button : preset.soft + " " + preset.text}">${index + 1}</button>`).join("")}
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2">
          ${["09:00", "11:30", "14:00", "16:00", "18:30", "20:00"].map((time) => `<button class="h-12 rounded-full ${preset.soft} text-sm font-black ${preset.text}">${time}</button>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderHeroFood(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 5);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
      <div class="rounded-[50px] bg-orange-950 p-9 text-white shadow-2xl shadow-orange-200/30">
        <span class="mb-5 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-orange-100 ring-1 ring-white/15">${safe(seed.niche)}</span>
        <h1 class="text-6xl font-black leading-[0.9] tracking-[-0.09em] text-white md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 text-orange-100/80">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full bg-orange-400 px-7 text-base font-black text-orange-950 transition hover:bg-orange-300">הזמנת מקום</a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 text-base font-black text-white transition hover:bg-white/15">לתפריט</a>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <img src="${image}" alt="" class="col-span-2 h-[360px] w-full rounded-[46px] object-cover shadow-2xl shadow-orange-200/40" />
        <div class="rounded-[34px] bg-white p-6 shadow-xl shadow-orange-200/30">
          <p class="text-sm font-black text-orange-700">מנה מומלצת</p>
          <b class="mt-2 block text-4xl font-black tracking-[-0.07em] text-orange-950">₪89</b>
        </div>
        <div class="rounded-[34px] bg-orange-400 p-6 text-orange-950 shadow-xl shadow-orange-200/30">
          <p class="text-sm font-black">מבצע השבוע</p>
          <b class="mt-2 block text-4xl font-black tracking-[-0.07em]">1+1</b>
        </div>
      </div>
    </section>
  `;
}

function renderHeroPortfolio(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-16">
      <div class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
          <h1 class="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.1em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        </div>
        <p class="max-w-md text-lg font-bold leading-8 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
      </div>

      <div class="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
        ${demoImages.slice(0, 8).map((image, index) => `
          <figure class="${index === 0 ? "col-span-2 row-span-2" : ""} overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/30">
            <img src="${image}" alt="" class="h-full w-full object-cover" />
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHeroStore(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 9);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#store" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">לקטלוג</a>
          <a href="#lead" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">פרטים</a>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <img src="${image}" alt="" class="col-span-2 h-[320px] w-full rounded-[46px] object-cover shadow-2xl shadow-slate-300/30" />
        ${["חדש", "מבצע"].map((label, index) => `
          <article class="rounded-[30px] ${index === 0 ? preset.surface : preset.soft} p-6 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
            <p class="text-sm font-black ${preset.accentText}">${label}</p>
            <b class="mt-3 block text-4xl font-black tracking-[-0.07em] ${preset.text}">₪${index === 0 ? "149" : "99"}</b>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHeroOffer(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1.1fr_0.75fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#lead" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">אני רוצה פרטים</a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">שירותים</a>
        </div>
      </div>

      <aside class="relative overflow-hidden rounded-[44px] ${preset.surface} p-9 shadow-2xl shadow-slate-200/30 ring-1 ${preset.ring}">
        <small class="text-sm font-black ${preset.accentText}">מבצע השקה</small>
        <h2 class="mt-4 text-4xl font-black tracking-[-0.07em] ${preset.text}">חבילת אתר עסקי</h2>
        <b class="mt-5 block text-7xl font-black tracking-[-0.1em] ${preset.accentText}">₪2,000</b>
        <p class="mt-4 text-base font-bold leading-7 ${preset.muted}">כולל אתר, יומן, טופס לידים, חנות וסקשנים מוכנים לעריכה.</p>
      </aside>
    </section>
  `;
}

function renderHeroDashboard(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 3);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.95fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">קביעת תור</a>
          <a href="#contact" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">שיחה עם העסק</a>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <article class="rounded-[32px] ${preset.surface} p-7 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
          <b class="block text-6xl font-black tracking-[-0.09em] ${preset.text}">24/7</b>
          <small class="mt-2 block text-sm font-black ${preset.muted}">איסוף לידים</small>
        </article>
        <article class="rounded-[32px] ${preset.surface} p-7 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
          <b class="block text-6xl font-black tracking-[-0.09em] ${preset.accentText}">98%</b>
          <small class="mt-2 block text-sm font-black ${preset.muted}">חווית משתמש</small>
        </article>
        <img src="${image}" alt="" class="col-span-2 h-[360px] w-full rounded-[38px] object-cover shadow-2xl shadow-slate-300/30" />
      </div>
    </section>
  `;
}

function renderHeroSplit(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  const image = imageFor(seed, 4);

  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.95fr]">
      <div>
        <span class="mb-5 inline-flex rounded-full ${preset.chip} px-5 py-2 text-sm font-black">${safe(seed.niche)}</span>
        <h1 class="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.09em] ${preset.text} md:text-8xl">${safe(seed.heroTitle)}</h1>
        <p class="mt-7 max-w-2xl text-xl font-bold leading-9 ${preset.muted}">${safe(seed.heroSubtitle)}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="#booking" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">קביעת תור</a>
          <a href="#services" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">לשירותים</a>
        </div>
      </div>

      <img src="${image}" alt="" class="h-[520px] w-full rounded-[46px] object-cover shadow-2xl shadow-slate-300/30" />
    </section>
  `;
}

function renderServices(block: ReadyWebsiteBlock, preset: DesignPreset) {
  if (block.type === "pricing" || block.type === "packages") {
    return renderPriceCards(block, preset);
  }

  if (block.variant.includes("list")) {
    return renderServiceList(block, preset);
  }

  if (
    block.variant.includes("timeline") ||
    block.type === "process" ||
    block.type === "course"
  ) {
    return renderTimeline(block, preset);
  }

  return renderServiceCards(block, preset);
}

function renderServiceCards(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const items = itemsFor(block, ["שירות פרימיום", "ייעוץ אישי", "ליווי מלא"]);

  return `
    <section ${sectionAttrs(block, block.type === "services" ? "services" : undefined)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "שירותים", preset)}

      <div class="grid gap-5 md:grid-cols-3">
        ${items.map((item, index) => `
          <article class="group rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring} transition hover:-translate-y-1 hover:shadow-2xl">
            <div class="mb-6 grid h-16 w-16 place-items-center rounded-3xl ${index % 2 === 0 ? "bg-slate-950" : "bg-sky-600"} text-2xl font-black text-white">${["✦", "◈", "●"][index % 3]}</div>
            <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.text}">${safe(item)}</h3>
            <p class="mt-3 text-base font-bold leading-7 ${preset.muted}">בלוק שירות מוכן לעריכה עם טקסט, מחיר וכפתור פעולה.</p>
            <a href="#booking" class="mt-6 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition ${preset.button}">בחר שירות</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderServiceList(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const items = itemsFor(block, ["שירות פרימיום", "ייעוץ אישי", "ליווי מלא"]);

  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "שירותים", preset, "right")}

      <div class="grid gap-4">
        ${items.map((item, index) => `
          <article class="grid grid-cols-1 items-center gap-5 rounded-[30px] ${preset.surface} p-6 shadow-lg shadow-slate-200/30 ring-1 ${preset.ring} md:grid-cols-[90px_1fr_auto]">
            <span class="text-5xl font-black tracking-[-0.08em] ${preset.accentText}">0${index + 1}</span>
            <div>
              <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.text}">${safe(item)}</h3>
              <p class="mt-2 text-base font-bold leading-7 ${preset.muted}">תיאור שירות מקצועי שהעסק יכול לערוך בקלות.</p>
            </div>
            <b class="text-3xl font-black tracking-[-0.06em] ${preset.text}">${servicePrices[index % servicePrices.length]}</b>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTimeline(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const items = itemsFor(block, ["שלב ראשון", "שלב שני", "שלב שלישי"]);

  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "תהליך עבודה", preset)}

      <div class="relative mx-auto max-w-4xl">
        <div class="absolute right-6 top-0 hidden h-full w-px bg-slate-300 md:block"></div>

        <div class="grid gap-5">
          ${items.map((item, index) => `
            <article class="relative grid grid-cols-[60px_1fr] gap-5 rounded-[30px] ${preset.surface} p-6 shadow-lg shadow-slate-200/30 ring-1 ${preset.ring}">
              <span class="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-xl font-black text-white">${index + 1}</span>
              <div>
                <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.text}">${safe(item)}</h3>
                <p class="mt-2 text-base font-bold leading-7 ${preset.muted}">שלב ברור בחווית הלקוח, עם הסבר קצר ופעולה.</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderPriceCards(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const items = itemsFor(block, ["בסיסי", "פרימיום", "VIP"]);

  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "מסלולים", preset)}

      <div class="grid gap-5 md:grid-cols-3">
        ${items.map((item, index) => `
          <article class="${index === 1 ? "scale-[1.02] bg-slate-950 text-white" : preset.surface} rounded-[36px] p-7 shadow-2xl shadow-slate-200/30 ring-1 ${preset.ring}">
            <p class="text-sm font-black ${index === 1 ? "text-white/70" : preset.accentText}">מסלול ${index + 1}</p>
            <h3 class="mt-3 text-3xl font-black tracking-[-0.05em] ${index === 1 ? "text-white" : preset.text}">${safe(item)}</h3>
            <b class="mt-5 block text-5xl font-black tracking-[-0.08em] ${index === 1 ? "text-white" : preset.text}">${["₪99", "₪249", "₪499"][index % 3]}</b>
            <p class="mt-4 text-sm font-bold leading-6 ${index === 1 ? "text-white/70" : preset.muted}">חבילה מוכנה לעריכה עם יתרונות וכפתור פעולה.</p>
            <a href="#lead" class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-black transition ${index === 1 ? "bg-white text-slate-950 hover:bg-slate-100" : preset.button}">בחירת מסלול</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGallery(block: ReadyWebsiteBlock, preset: DesignPreset) {
  if (["about", "story", "doctor", "artist", "team", "clients", "trust"].includes(block.type)) {
    return renderAboutSplit(block, preset);
  }

  if (block.variant.includes("masonry") || block.type === "projects" || block.type === "results") {
    return renderMasonry(block, preset);
  }

  if (block.variant.includes("slider")) {
    return renderSlider(block, preset);
  }

  return renderImageGrid(block, preset);
}

function renderMasonry(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block, block.type === "gallery" ? "gallery" : undefined)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "גלריה", preset)}

      <div class="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-3">
        ${demoImages.map((image, index) => `
          <figure class="${index % 3 === 1 ? "md:row-span-2" : ""} overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/30">
            <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSlider(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block, block.type === "gallery" ? "gallery" : undefined)} class="w-full overflow-hidden py-20">
      <div class="mx-auto w-full max-w-7xl px-6">${titleBlock(block, "עבודות אחרונות", preset)}</div>
      <div class="flex gap-5 overflow-x-auto px-6 pb-4">
        ${demoImages.slice(0, 5).map((image) => `
          <figure class="h-[330px] min-w-[360px] overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/30">
            <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function renderImageGrid(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block, block.type === "gallery" ? "gallery" : undefined)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "גלריה", preset)}

      <div class="grid gap-4 md:grid-cols-3">
        ${demoImages.slice(0, 6).map((image) => `
          <figure class="h-[260px] overflow-hidden rounded-[34px] shadow-xl shadow-slate-200/30">
            <img src="${image}" alt="" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAboutSplit(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[0.9fr_1.1fr]">
      <div class="grid grid-cols-2 gap-4">
        <img src="${demoImages[0]}" alt="" class="h-72 w-full rounded-[34px] object-cover shadow-xl shadow-slate-200/30" />
        <img src="${demoImages[2]}" alt="" class="mt-16 h-72 w-full rounded-[34px] object-cover shadow-xl shadow-slate-200/30" />
      </div>

      <div>
        ${titleBlock(block, "אודות", preset, "right")}
        <div class="grid gap-3">
          ${["מותג עם נראות מקצועית", "חווית לקוח ברורה", "חיבור לתורים ולידים"].map((item) => `
            <div class="rounded-2xl ${preset.surface} p-5 shadow-lg shadow-slate-200/30 ring-1 ${preset.ring}">
              <p class="text-lg font-black ${preset.text}">${safe(item)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderBooking(block: ReadyWebsiteBlock, preset: DesignPreset) {
  const days = Array.from(
    { length: 14 },
    (_, index) =>
      `<button type="button" class="h-11 rounded-full text-sm font-black ${[1, 4, 8, 11].includes(index) ? preset.button : `${preset.soft} ${preset.text}`}">${index + 1}</button>`
  ).join("");

  const times = ["09:00", "10:30", "12:00", "14:30", "17:00", "19:00"];

  const calendar = `
    <div
      class="rounded-[38px] ${preset.surface} p-7 shadow-2xl shadow-slate-200/40 ring-1 ${preset.ring}"
      data-bizuply-widget="booking-calendar"
      data-api="/api/businesses/{{businessId}}/availability"
      data-services-api="/api/businesses/{{businessId}}/services"
      data-appointments-api="/api/businesses/{{businessId}}/appointments"
    >
      <h3 class="text-3xl font-black tracking-[-0.05em] ${preset.text}">בחרו תאריך ושעה</h3>
      <div class="mt-6 grid grid-cols-7 gap-2">${days}</div>
      <div class="mt-5 flex flex-wrap gap-2">
        ${times.map((time) => `<button type="button" class="h-11 rounded-full ${preset.soft} px-5 text-sm font-black ${preset.text}">${time}</button>`).join("")}
      </div>
      <a href="#" class="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full text-base font-black transition ${preset.button}">אישור תור</a>
    </div>
  `;

  if (block.variant.includes("wide")) {
    return `
      <section ${sectionAttrs(block, "booking")} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[0.75fr_1.25fr]">
        <div>${titleBlock(block, "יומן מחובר", preset, "right")}</div>
        ${calendar}
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block, "booking")} class="mx-auto w-full max-w-5xl px-6 py-20">
      ${titleBlock(block, "קביעת תור", preset)}
      ${calendar}
    </section>
  `;
}

function renderStore(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block, "store")} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, "חנות מחוברת", preset)}

      <div class="grid gap-5 md:grid-cols-3" data-bizuply-widget="products" data-api="/api/businesses/{{businessId}}/products">
        ${["מוצר מוביל", "מוצר פרימיום", "מארז מתנה"].map((product, index) => `
          <article class="rounded-[34px] ${preset.surface} p-6 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
            <div class="mb-5 h-40 rounded-[26px] ${index % 2 === 0 ? preset.soft : preset.surface2}"></div>
            <h3 class="text-2xl font-black tracking-[-0.04em] ${preset.text}">${safe(product)}</h3>
            <p class="mt-2 text-base font-bold leading-7 ${preset.muted}">תיאור מוצר קצר שניתן להחליף.</p>
            <b class="mt-4 block text-3xl font-black tracking-[-0.06em] ${preset.accentText}">${["₪99", "₪149", "₪249"][index]}</b>
            <a href="#" class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-black transition ${preset.button}">הוסף לעגלה</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderLead(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block, "lead")} class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[1fr_0.9fr]">
      <div class="rounded-[44px] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-300/30">
        <span class="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white">לידים</span>
        <h2 class="text-5xl font-black leading-tight tracking-[-0.07em] text-white">${safe(block.title)}</h2>
        <p class="mt-4 text-lg font-bold leading-8 text-white/75">השאירו פרטים והעסק יחזור אליכם עם מענה מסודר ומהיר.</p>
      </div>

      <form class="grid gap-3 rounded-[38px] ${preset.surface} p-6 shadow-2xl shadow-slate-200/40 ring-1 ${preset.ring}" data-bizuply-widget="lead-form" data-api="/api/businesses/{{businessId}}/leads">
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

      <div class="grid gap-5 md:grid-cols-3" data-bizuply-widget="reviews" data-api="/api/businesses/{{businessId}}/reviews">
        ${["חוויה מעולה ומקצועית", "הכל ברור ונוח", "שירות מהיר ומדויק"].map((text) => `
          <article class="rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
            <b class="text-xl ${preset.accentText}">★★★★★</b>
            <p class="mt-4 text-lg font-black leading-8 ${preset.text}">${safe(text)}</p>
            <small class="mt-5 block text-sm font-bold ${preset.muted}">לקוח מרוצה</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFaq(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-4xl px-6 py-20">
      ${titleBlock(block, "שאלות נפוצות", preset)}
      <div class="grid gap-3">
        ${["איך קובעים תור?", "האם אפשר לערוך את האתר?", "האם זה מותאם לנייד?"].map((question) => `
          <details open class="rounded-[26px] ${preset.surface} p-5 shadow-lg shadow-slate-200/30 ring-1 ${preset.ring}">
            <summary class="cursor-pointer text-lg font-black ${preset.text}">${safe(question)}</summary>
            <p class="mt-3 text-base font-bold leading-7 ${preset.muted}">כן. כל התוכן, התמונות והבלוקים ניתנים לעריכה מלאה.</p>
          </details>
        `).join("")}
      </div>
    </section>
  `;
}

function renderContact(block: ReadyWebsiteBlock, preset: DesignPreset) {
  if (block.variant.includes("map")) {
    return `
      <section ${sectionAttrs(block, "contact")} class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-6 py-20 md:grid-cols-[0.75fr_1fr_0.8fr]">
        <div>${titleBlock(block, "יצירת קשר", preset, "right")}</div>
        <div class="grid min-h-[320px] place-items-center rounded-[38px] bg-slate-950 p-8 text-center text-2xl font-black text-white shadow-2xl shadow-slate-300/30">מפה / אזורי שירות</div>
        <form class="grid gap-3 rounded-[38px] ${preset.surface} p-6 shadow-2xl shadow-slate-200/40 ring-1 ${preset.ring}">
          <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="שם" />
          <input class="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-300" placeholder="טלפון" />
          <button type="button" class="h-14 rounded-full text-base font-black transition ${preset.button}">שליחה</button>
        </form>
      </section>
    `;
  }

  return `
    <section ${sectionAttrs(block, "contact")} class="mx-auto w-full max-w-5xl px-6 py-20 text-center">
      ${titleBlock(block, "יצירת קשר", preset)}
      <div class="flex flex-wrap justify-center gap-3">
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.button}">WhatsApp</a>
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">טלפון</a>
        <a href="#" class="inline-flex h-14 items-center justify-center rounded-full px-7 text-base font-black transition ${preset.ghost}">Instagram</a>
      </div>
    </section>
  `;
}

function renderFooter(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  return `
    <footer ${sectionAttrs(block)} class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 border-t ${preset.border} px-6 py-10">
      <strong class="text-3xl font-black tracking-[-0.07em] ${preset.text}">${safe(seed.niche)}</strong>
      <p class="max-w-xl text-sm font-bold leading-6 ${preset.muted}">אתר עסקי חכם עם תורים, לידים, חנות, ביקורות וסקשנים מוכנים.</p>
      <nav class="flex gap-4">
        <a href="#" class="text-sm font-black ${preset.muted}">תנאים</a>
        <a href="#" class="text-sm font-black ${preset.muted}">פרטיות</a>
        <a href="#" class="text-sm font-black ${preset.muted}">צור קשר</a>
      </nav>
    </footer>
  `;
}

function renderGeneric(block: ReadyWebsiteBlock, preset: DesignPreset) {
  return `
    <section ${sectionAttrs(block)} class="mx-auto w-full max-w-7xl px-6 py-20">
      ${titleBlock(block, block.type, preset)}
      <div class="grid gap-5 md:grid-cols-3">
        ${[1, 2, 3].map((index) => `
          <article class="rounded-[34px] ${preset.surface} p-7 shadow-xl shadow-slate-200/30 ring-1 ${preset.ring}">
            <span class="text-4xl font-black tracking-[-0.07em] ${preset.accentText}">0${index}</span>
            <h3 class="mt-4 text-2xl font-black tracking-[-0.04em] ${preset.text}">${safe(block.title)}</h3>
            <p class="mt-3 text-base font-bold leading-7 ${preset.muted}">${safe(block.text || "תוכן דמו מקצועי להחלפה.")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBlock(
  block: ReadyWebsiteBlock,
  seed: ReadyWebsiteTemplateSeed,
  preset: DesignPreset
) {
  if (block.type === "header") return renderHeader(block, seed, preset);
  if (block.type === "hero") return renderHero(block, seed, preset);
  if (block.type === "booking") return renderBooking(block, preset);
  if (block.type === "store") return renderStore(block, preset);
  if (block.type === "lead") return renderLead(block, preset);
  if (block.type === "faq") return renderFaq(block, preset);
  if (block.type === "contact") return renderContact(block, preset);
  if (block.type === "footer") return renderFooter(block, seed, preset);

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

export function buildReadyWebsiteCss(_palette: ReadyWebsitePalette) {
  return "";
}

export function buildReadyWebsiteHtml(seed: ReadyWebsiteTemplateSeed) {
  const preset = getPreset(seed);

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
