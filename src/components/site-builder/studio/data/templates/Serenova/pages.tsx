import React, { useMemo, useState } from "react";
import { serenovaDefaultData } from "./defaultData";

export const serenovaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "pricing", label: "מחירון", slug: "/pricing" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "blog", label: "מאמרים", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type SerenovaPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (serenovaDefaultData as Record<string, any>)[key] ?? "";
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={["mx-auto max-w-3xl", center ? "text-center" : "text-right"].join(" ")}>
      <p className="mb-4 inline-flex rounded-full border border-[#24352d]/15 bg-white/60 px-4 py-2 text-sm font-medium text-[#5e765f] shadow-sm backdrop-blur">
        {eyebrow}
      </p>

      <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#20342a] md:text-6xl">
        {title}
      </h2>

      {text ? <p className="mt-5 text-lg leading-8 text-[#536157]">{text}</p> : null}
    </div>
  );
}

function Header({
  data,
  currentPage,
  setCurrentPage,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}) {
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["pricing", getValue(data, "navPricing")],
    ["gallery", getValue(data, "navGallery")],
    ["blog", getValue(data, "navBlog")],
    ["contact", getValue(data, "navContact")],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#24352d]/10 bg-[#f8f2e8]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          onClick={() => setCurrentPage("home")}
          className="group flex items-center gap-3 text-right"
          type="button"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#24352d] text-lg font-semibold text-[#f8f2e8] shadow-lg shadow-[#24352d]/20 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-semibold tracking-[-0.03em] text-[#20342a]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#24352d]/10 bg-white/45 p-1 shadow-sm backdrop-blur lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              type="button"
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition duration-300",
                currentPage === id
                  ? "bg-[#24352d] text-[#f8f2e8] shadow-md"
                  : "text-[#405246] hover:bg-white/90 hover:text-[#20342a]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setCurrentPage("contact")}
          type="button"
          className="rounded-full bg-[#b78f65] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b78f65]/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const chips = ["שיחה רגועה", "חוויה יוקרתית", "UX ברור", "עיצוב שמייצר אמון"];

  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-32 lg:pt-20">
      <div className="absolute left-[6%] top-20 h-56 w-56 rounded-full bg-[#abc5a6]/35 blur-3xl" />
      <div className="absolute bottom-16 right-[8%] h-72 w-72 rounded-full bg-[#d2bc99]/35 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-44 w-44 rounded-full bg-white/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-[#24352d]/15 bg-white/60 px-4 py-2 text-sm font-medium text-[#5e765f] shadow-sm backdrop-blur">
            {getValue(data, "heroEyebrow")}
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#20342a] md:text-7xl lg:text-8xl">
            {getValue(data, "heroTitle")}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#536157] md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#24352d]/10 bg-white/55 px-4 py-2 text-sm font-medium text-[#405246] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="rounded-full bg-[#24352d] px-7 py-4 text-base font-semibold text-[#f8f2e8] shadow-2xl shadow-[#24352d]/15 transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-full border border-[#24352d]/15 bg-white/60 px-7 py-4 text-base font-semibold text-[#24352d] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
              [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
              [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
            ].map(([num, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-[#24352d]/10 bg-white/60 p-4 text-center shadow-2xl shadow-[#24352d]/10 backdrop-blur transition duration-500 hover:-translate-y-2 hover:bg-white/80"
              >
                <div className="text-2xl font-semibold text-[#20342a]">{num}</div>
                <div className="mt-1 text-xs font-medium text-[#68766b]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[620px]">
          <div className="group absolute right-0 top-0 z-10 w-[82%] overflow-hidden rounded-[42px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#24352d]/15 backdrop-blur">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[610px] w-full rounded-[34px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[34px] bg-gradient-to-t from-[#24352d]/35 via-transparent to-transparent" />
          </div>

          <div className="group absolute left-0 top-16 z-20 w-[42%] overflow-hidden rounded-[34px] border border-white/80 bg-white/70 p-3 shadow-2xl shadow-[#24352d]/15 backdrop-blur">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[250px] w-full rounded-[26px] object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute bottom-8 right-8 z-30 max-w-[270px] rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-[#24352d]/15 backdrop-blur-xl transition duration-500 hover:-translate-y-2">
            <p className="text-sm font-semibold text-[#20342a]">
              {getValue(data, "heroCardTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#68766b]">
              {getValue(data, "heroCardText")}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#abc5a6]" />
              <span className="text-xs font-semibold text-[#5f6c62]">חוויה אישית ונעימה</span>
            </div>
          </div>

          <div className="absolute left-[18%] bottom-28 z-30 grid h-28 w-28 place-items-center rounded-full bg-[#24352d] text-center text-[#f8f2e8] shadow-2xl shadow-[#24352d]/25 transition duration-500 hover:scale-105">
            <div>
              <div className="text-xs opacity-70">Serenova</div>
              <div className="text-2xl font-semibold tracking-[-0.05em]">UX</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const bullets = [
    "מבנה שמוביל את הלקוח בלי עומס",
    "תחושה רגועה אבל פרימיום",
    "תמונות עם שכבות ועומק",
    "כרטיסים חיים ולא גנריים",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
        <div className="relative">
          <div className="group overflow-hidden rounded-[40px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#24352d]/10">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[560px] w-full rounded-[32px] object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-8 right-6 max-w-[260px] rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-[#24352d]/15 backdrop-blur-xl">
            <div className="text-4xl font-semibold tracking-[-0.06em] text-[#20342a]">01</div>
            <p className="mt-2 text-sm leading-6 text-[#5f6c62]">
              לא עוד תבנית שטוחה — כאן יש היררכיה, עומק ותנועה דרך Hover ו־Sticky.
            </p>
          </div>
        </div>

        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {bullets.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[#24352d]/10 bg-white/60 p-5 text-[#405246] shadow-2xl shadow-[#24352d]/8 backdrop-blur transition duration-500 hover:-translate-y-2 hover:bg-white/80"
              >
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#abc5a6]/40 text-[#24352d]">
                  ✓
                </span>
                <p className="text-base font-semibold leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "servicesEyebrow")}
          title={getValue(data, "servicesTitle")}
          text="כרטיסים עם עומק, hover, שינוי רקע ותחושה הרבה יותר יוקרתית."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article
              key={title}
              className={[
                "group relative overflow-hidden rounded-[36px] border border-[#24352d]/10 bg-white/60 p-7 shadow-2xl shadow-[#24352d]/8 backdrop-blur transition duration-500 hover:-translate-y-3 hover:bg-white/85 hover:shadow-[#24352d]/15",
                index === 1 || index === 2 ? "lg:translate-y-10" : "",
              ].join(" ")}
            >
              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#abc5a6]/0 blur-3xl transition duration-500 group-hover:bg-[#abc5a6]/30" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#d2bc99]/0 blur-3xl transition duration-500 group-hover:bg-[#d2bc99]/30" />

              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#24352d] text-sm font-semibold text-[#f8f2e8] shadow-lg shadow-[#24352d]/20">
                    0{index + 1}
                  </span>
                  <span className="rounded-full border border-[#24352d]/10 bg-white/55 px-3 py-1 text-xs font-medium text-[#6a766e]">
                    שירות
                  </span>
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#20342a]">
                  {title}
                </h3>

                <p className="mt-4 max-w-xl text-base leading-7 text-[#5f6c62]">
                  {text}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#24352d]/10 pt-5">
                  <span className="text-sm font-semibold text-[#b78f65]">
                    מתאים לעמוד מכירה רגוע
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#24352d]/8 text-[#24352d] transition duration-300 group-hover:bg-[#24352d] group-hover:text-[#f8f2e8]">
                    ↗
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: Record<string, any> }) {
  const process = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.82fr_1.18fr]">
        <div className="h-fit lg:sticky lg:top-28">
          <SectionTitle
            eyebrow={getValue(data, "processEyebrow")}
            title={getValue(data, "processTitle")}
            text="החלק הזה עובד כ־sticky storytelling: הכותרת נשארת והשלבים זורמים לידה."
          />

          <div className="mt-8 rounded-[32px] border border-[#24352d]/10 bg-[#24352d] p-6 text-[#f8f2e8] shadow-2xl shadow-[#24352d]/15">
            <p className="text-sm opacity-70">UX Flow</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              מסע משתמש ברור, יפה ולא משעמם.
            </h3>
          </div>
        </div>

        <div className="relative space-y-5">
          <div className="absolute right-7 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#abc5a6] via-[#d2bc99] to-transparent lg:block" />

          {process.map(([title, text], index) => (
            <div
              key={title}
              className="group relative rounded-[36px] border border-[#24352d]/10 bg-white/65 p-8 shadow-2xl shadow-[#24352d]/8 backdrop-blur transition duration-500 hover:-translate-y-2 hover:bg-white/85"
            >
              <div className="absolute right-5 top-9 hidden h-5 w-5 rounded-full border-4 border-[#f8f2e8] bg-[#24352d] shadow-lg lg:block" />

              <div className="mb-7 text-6xl font-semibold tracking-[-0.08em] text-[#abc5a6] transition duration-500 group-hover:text-[#b78f65]">
                0{index + 1}
              </div>

              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#20342a]">
                {title}
              </h3>

              <p className="mt-4 text-lg leading-8 text-[#5f6c62]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ data }: { data: Record<string, any> }) {
  const plans = [
    [getValue(data, "priceOneName"), getValue(data, "priceOnePrice"), getValue(data, "priceOneText")],
    [getValue(data, "priceTwoName"), getValue(data, "priceTwoPrice"), getValue(data, "priceTwoText")],
    [getValue(data, "priceThreeName"), getValue(data, "priceThreePrice"), getValue(data, "priceThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "pricingEyebrow")}
          title={getValue(data, "pricingTitle")}
          text="המסלול המרכזי מודגש, והשאר נשארים נקיים וברורים."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, text], index) => (
            <article
              key={name}
              className={[
                "rounded-[36px] border p-7 shadow-2xl transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "border-[#24352d] bg-[#24352d] text-[#f8f2e8] shadow-[#24352d]/25"
                  : "border-[#24352d]/10 bg-white/60 text-[#20342a] shadow-[#24352d]/8 backdrop-blur hover:bg-white/85",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{name}</h3>
                {index === 1 ? (
                  <span className="rounded-full bg-[#f8f2e8] px-3 py-1 text-xs font-semibold text-[#24352d]">
                    מומלץ
                  </span>
                ) : null}
              </div>

              <div className="mt-8 text-5xl font-semibold tracking-[-0.06em]">{price}</div>

              <p className={["mt-5 leading-7", index === 1 ? "text-[#f8f2e8]/75" : "text-[#5f6c62]"].join(" ")}>
                {text}
              </p>

              <ul className={["mt-7 space-y-3 text-sm", index === 1 ? "text-[#f8f2e8]/80" : "text-[#5f6c62]"].join(" ")}>
                <li>• עיצוב רספונסיבי</li>
                <li>• אזורי תוכן ברורים</li>
                <li>• חוויית משתמש נקייה</li>
              </ul>

              <button
                type="button"
                className={[
                  "mt-9 w-full rounded-full px-6 py-4 text-sm font-semibold transition duration-300",
                  index === 1
                    ? "bg-[#f8f2e8] text-[#24352d] hover:-translate-y-0.5"
                    : "bg-[#24352d] text-[#f8f2e8] hover:-translate-y-0.5",
                ].join(" ")}
              >
                בחירת מסלול
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: Record<string, any> }) {
  const items = [
    { src: getValue(data, "galleryImageOne"), title: "מרחב רגוע", cls: "lg:col-span-2 lg:row-span-2", h: "h-[420px] lg:h-full" },
    { src: getValue(data, "galleryImageTwo"), title: "אווירה אישית", cls: "", h: "h-[280px]" },
    { src: getValue(data, "galleryImageThree"), title: "חוויה נקייה", cls: "", h: "h-[280px]" },
    { src: getValue(data, "galleryImageFour"), title: "מראה פרימיום", cls: "lg:col-span-2", h: "h-[300px]" },
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "galleryEyebrow")}
          title={getValue(data, "galleryTitle")}
          text="במקום ארבע תמונות רגילות — גריד מגזיני עם שכבות ו־hover."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-4 lg:grid-rows-[280px_280px_300px]">
          {items.map((item) => (
            <div
              key={item.src}
              className={`group overflow-hidden rounded-[36px] border border-white/80 bg-white/50 p-3 shadow-2xl shadow-[#24352d]/10 transition duration-500 hover:-translate-y-2 ${item.cls}`}
            >
              <div className="relative h-full overflow-hidden rounded-[28px]">
                <img
                  src={item.src}
                  alt=""
                  className={`w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105 ${item.h}`}
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-[#24352d]/75 px-4 py-3 text-[#f8f2e8] backdrop-blur-md">
                  <div className="text-sm opacity-70">Serenova</div>
                  <div className="text-lg font-semibold">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ data }: { data: Record<string, any> }) {
  const posts = [
    [getValue(data, "postOneTitle"), getValue(data, "postOneText")],
    [getValue(data, "postTwoTitle"), getValue(data, "postTwoText")],
    [getValue(data, "postThreeTitle"), getValue(data, "postThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "blogEyebrow")}
          title={getValue(data, "blogTitle")}
          text="כרטיסי תוכן עם בר התקדמות קטן כדי לשבור את השעמום."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {posts.map(([title, text], index) => (
            <article
              key={title}
              className="group rounded-[36px] border border-[#24352d]/10 bg-white/60 p-7 shadow-2xl shadow-[#24352d]/8 backdrop-blur transition duration-500 hover:-translate-y-3 hover:bg-white/85"
            >
              <div className="mb-7 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#b78f65]">מאמר 0{index + 1}</p>
                <span className="rounded-full border border-[#24352d]/10 bg-white/55 px-3 py-1 text-xs font-medium text-[#6a766e]">
                  Insights
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#20342a]">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-[#5f6c62]">{text}</p>

              <div className="mt-7 h-1 w-full overflow-hidden rounded-full bg-[#24352d]/10">
                <div
                  className="h-full rounded-full bg-[#abc5a6] transition-all duration-700 group-hover:bg-[#b78f65]"
                  style={{ width: `${58 + index * 15}%` }}
                />
              </div>

              <button
                type="button"
                className="mt-8 rounded-full border border-[#24352d]/15 px-5 py-3 text-sm font-semibold text-[#24352d] transition duration-300 hover:bg-white"
              >
                לקריאה
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);

  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <SectionTitle
          eyebrow={getValue(data, "faqEyebrow")}
          title={getValue(data, "faqTitle")}
          text="אקורדיון רך עם פתיחה חלקה ב־Tailwind בלבד."
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-[30px] border border-[#24352d]/10 bg-white/60 shadow-xl shadow-[#24352d]/6 backdrop-blur transition duration-300 hover:bg-white/80"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-xl font-semibold tracking-[-0.03em] text-[#20342a]">
                    {question}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#24352d] text-lg text-[#f8f2e8]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={[
                    "grid transition-all duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-7 text-[#5f6c62]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: Record<string, any> }) {
  const infoCards = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["מיקום", getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[46px] border border-[#24352d]/10 bg-[#24352d] text-[#f8f2e8] shadow-2xl shadow-[#24352d]/20 lg:grid-cols-[.92fr_1.08fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              {getValue(data, "contactEyebrow")}
            </p>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              {getValue(data, "contactTitle")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#f8f2e8]/75">
              {getValue(data, "contactText")}
            </p>

            <div className="mt-10 grid gap-3">
              {infoCards.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition duration-300 hover:bg-white/10"
                >
                  <div className="text-xs font-medium text-[#f8f2e8]/60">{label}</div>
                  <div className="mt-1 text-base font-semibold text-[#f8f2e8]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className="m-4 rounded-[38px] bg-[#f8f2e8] p-5 text-[#20342a] shadow-inner lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b78f65]" placeholder="שם מלא" />
            <input className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b78f65]" placeholder="טלפון" />
            <input className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b78f65]" placeholder="אימייל" />
            <textarea className="min-h-36 rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b78f65]" placeholder="מה תרצו לשאול?" />

            <button
              type="button"
              className="rounded-full bg-[#b78f65] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b78f65]/20 transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "contactButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CtaFooter({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[46px] border border-[#24352d]/10 bg-white/55 p-8 shadow-2xl shadow-[#24352d]/10 backdrop-blur lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#20342a] md:text-6xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6c62]">
              {getValue(data, "ctaText")}
            </p>
          </div>

          <div className="rounded-[34px] border border-[#24352d]/10 bg-[#24352d] p-6 text-[#f8f2e8] shadow-xl shadow-[#24352d]/15">
            <div className="text-sm opacity-70">Serenova Experience</div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              יותר חוויה. פחות שעמום.
            </div>

            <button
              type="button"
              onClick={() => goTo("contact")}
              className="mt-6 rounded-full bg-[#f8f2e8] px-8 py-4 text-base font-semibold text-[#24352d] transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "ctaButton")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#24352d]/10 pt-8 text-sm text-[#68766b] md:flex-row">
        <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
        <p>תבנית Serenova · Bizuply Studio</p>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <ProcessSection data={data} />
      <PricingSection data={data} />
      <GallerySection data={data} />
      <BlogSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} />
      <CtaFooter data={data} goTo={goTo} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <AboutSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    pricing: <PricingSection data={data} />,
    gallery: <GallerySection data={data} />,
    blog: <BlogSection data={data} />,
    contact: <ContactSection data={data} />,
  };

  return (
    <>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#24352d]/15 bg-white/55 px-4 py-2 text-sm font-medium text-[#5e765f]">
            {getValue(data, "brandName")}
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.06em] text-[#20342a] md:text-7xl">
            {type === "about" && getValue(data, "navAbout")}
            {type === "services" && getValue(data, "navServices")}
            {type === "pricing" && getValue(data, "navPricing")}
            {type === "gallery" && getValue(data, "navGallery")}
            {type === "blog" && getValue(data, "navBlog")}
            {type === "contact" && getValue(data, "navContact")}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}
      <CtaFooter data={data} goTo={goTo} />
    </>
  );
}

export default function SerenovaPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: SerenovaPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...serenovaDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const [currentPage, setCurrentPage] = useState(page || initialPage || "home");

  function goTo(nextPage: string) {
    setCurrentPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "serenova-preview" : "serenova"}
      className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(171,197,166,0.34),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(210,188,153,0.28),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(171,197,166,0.18),transparent_24%),linear-gradient(180deg,#f8f2e8_0%,#f3ecdf_48%,#eef2eb_100%)] font-sans"
    >
      <Header data={mergedData} currentPage={currentPage} setCurrentPage={goTo} />

      {currentPage === "home" ? (
        <HomePage data={mergedData} goTo={goTo} />
      ) : (
        <SimplePage data={mergedData} type={currentPage} goTo={goTo} />
      )}
    </div>
  );
}