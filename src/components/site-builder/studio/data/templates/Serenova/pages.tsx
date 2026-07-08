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
    <div
      className={[
        "serenova-reveal mx-auto max-w-3xl",
        center ? "text-center" : "text-right",
      ].join(" ")}
    >
      <p className="mb-4 inline-flex rounded-full border border-[#24352d]/15 bg-white/55 px-4 py-2 text-sm font-medium text-[#5e765f]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#20342a] md:text-6xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-lg leading-8 text-[#536157]">{text}</p>
      ) : null}
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-3 text-right"
          type="button"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#24352d] text-lg font-semibold text-[#f8f2e8]">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-semibold tracking-[-0.03em] text-[#20342a]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#24352d]/10 bg-white/45 p-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              type="button"
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                currentPage === id
                  ? "bg-[#24352d] text-[#f8f2e8]"
                  : "text-[#405246] hover:bg-white/80",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setCurrentPage("contact")}
          type="button"
          className="rounded-full bg-[#b78f65] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b78f65]/20 transition hover:-translate-y-0.5"
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
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute left-8 top-20 h-44 w-44 rounded-full bg-[#abc5a6]/30 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-[#d2bc99]/35 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
        <div className="serenova-reveal">
          <p className="mb-5 inline-flex rounded-full border border-[#24352d]/15 bg-white/55 px-4 py-2 text-sm font-medium text-[#5e765f]">
            {getValue(data, "heroEyebrow")}
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#20342a] md:text-7xl lg:text-8xl">
            {getValue(data, "heroTitle")}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#536157] md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="rounded-full bg-[#24352d] px-7 py-4 text-base font-semibold text-[#f8f2e8] shadow-2xl shadow-[#24352d]/15 transition hover:-translate-y-0.5"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-full border border-[#24352d]/15 bg-white/50 px-7 py-4 text-base font-semibold text-[#24352d] transition hover:bg-white"
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
                className="serenova-soft-card rounded-3xl p-4 text-center"
              >
                <div className="text-2xl font-semibold text-[#20342a]">{num}</div>
                <div className="mt-1 text-xs font-medium text-[#68766b]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="serenova-reveal serenova-reveal-delay-2 relative">
          <div className="serenova-image-mask overflow-hidden rounded-[34px] border border-white/70 bg-white/40 p-3 shadow-2xl shadow-[#24352d]/15">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[560px] w-full rounded-[28px] object-cover"
            />
          </div>

          <div className="serenova-float serenova-soft-card absolute bottom-8 right-6 max-w-[245px] rounded-[28px] p-5">
            <p className="text-sm font-semibold text-[#20342a]">
              {getValue(data, "heroCardTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#68766b]">
              {getValue(data, "heroCardText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "טיפול אישי",
    "ייעוץ רגשי",
    "ליווי זוגי",
    "סדנאות",
    "קליניקה פרטית",
    "אונליין",
    "קואצ׳ינג",
    "Wellness",
  ];

  return (
    <div className="overflow-hidden border-y border-[#24352d]/10 bg-[#24352d] py-5 text-[#f8f2e8]">
      <div className="serenova-marquee gap-10">
        {[...items, ...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="text-xl font-medium tracking-[-0.03em] opacity-90"
          >
            {item}
            <span className="mx-8 text-[#b78f65]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div className="serenova-reveal overflow-hidden rounded-[34px] border border-white/70 bg-white/45 p-3 shadow-2xl shadow-[#24352d]/10">
          <img
            src={getValue(data, "aboutImage")}
            alt=""
            className="h-[520px] w-full rounded-[28px] object-cover"
          />
        </div>

        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {[
              "עיצוב רגוע שמייצר אמון",
              "מבנה שמוביל להשארת פרטים",
              "מתאים לקליניקות ויועצים",
              "רספונסיבי ונקי בכל מסך",
            ].map((item, index) => (
              <div
                key={item}
                className={`serenova-reveal serenova-reveal-delay-${
                  index + 1
                } serenova-soft-card rounded-3xl p-5 text-[#405246]`}
              >
                <span className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-[#abc5a6]/40 text-[#24352d]">
                  ✓
                </span>
                <p className="text-base font-semibold">{item}</p>
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
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article
              key={title}
              className={[
                "serenova-reveal serenova-soft-card group rounded-[34px] p-7 transition duration-500 hover:-translate-y-2 hover:bg-white/75",
                index === 1 || index === 2 ? "lg:translate-y-10" : "",
              ].join(" ")}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#24352d] text-[#f8f2e8]">
                  0{index + 1}
                </span>
                <span className="h-px flex-1 bg-[#24352d]/10" />
              </div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#20342a]">
                {title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#5f6c62]">
                {text}
              </p>
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
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="serenova-sticky-card h-fit">
          <SectionTitle
            eyebrow={getValue(data, "processEyebrow")}
            title={getValue(data, "processTitle")}
          />
        </div>

        <div className="space-y-5">
          {process.map(([title, text], index) => (
            <div
              key={title}
              className="serenova-reveal serenova-soft-card rounded-[34px] p-8"
            >
              <div className="mb-8 text-6xl font-semibold tracking-[-0.08em] text-[#abc5a6]">
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
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, text], index) => (
            <article
              key={name}
              className={[
                "serenova-reveal rounded-[34px] border p-7 shadow-2xl transition duration-500 hover:-translate-y-2",
                index === 1
                  ? "border-[#24352d] bg-[#24352d] text-[#f8f2e8] shadow-[#24352d]/20"
                  : "border-[#24352d]/10 bg-white/55 text-[#20342a] shadow-[#24352d]/8",
              ].join(" ")}
            >
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                {name}
              </h3>
              <div className="mt-8 text-5xl font-semibold tracking-[-0.06em]">
                {price}
              </div>
              <p
                className={[
                  "mt-5 leading-7",
                  index === 1 ? "text-[#f8f2e8]/75" : "text-[#5f6c62]",
                ].join(" ")}
              >
                {text}
              </p>
              <button
                type="button"
                className={[
                  "mt-9 w-full rounded-full px-6 py-4 text-sm font-semibold",
                  index === 1
                    ? "bg-[#f8f2e8] text-[#24352d]"
                    : "bg-[#24352d] text-[#f8f2e8]",
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
  const images = [
    getValue(data, "galleryImageOne"),
    getValue(data, "galleryImageTwo"),
    getValue(data, "galleryImageThree"),
    getValue(data, "galleryImageFour"),
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "galleryEyebrow")}
          title={getValue(data, "galleryTitle")}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image}
              className={[
                "serenova-reveal group overflow-hidden rounded-[34px] border border-white/70 bg-white/50 p-3 shadow-2xl shadow-[#24352d]/10",
                index % 2 === 1 ? "lg:mt-14" : "",
              ].join(" ")}
            >
              <img
                src={image}
                alt=""
                className="h-[380px] w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105"
              />
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
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {posts.map(([title, text], index) => (
            <article
              key={title}
              className="serenova-reveal serenova-soft-card rounded-[34px] p-7"
            >
              <p className="mb-8 text-sm font-semibold text-[#b78f65]">
                מאמר 0{index + 1}
              </p>
              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#20342a]">
                {title}
              </h3>
              <p className="mt-4 leading-7 text-[#5f6c62]">{text}</p>
              <button
                type="button"
                className="mt-8 rounded-full border border-[#24352d]/15 px-5 py-3 text-sm font-semibold text-[#24352d]"
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
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => (
            <div
              key={question}
              className="serenova-reveal overflow-hidden rounded-[28px] border border-[#24352d]/10 bg-white/55"
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-6 p-6 text-right"
              >
                <span className="text-xl font-semibold tracking-[-0.03em] text-[#20342a]">
                  {question}
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#24352d] text-[#f8f2e8]">
                  {open === index ? "−" : "+"}
                </span>
              </button>
              {open === index ? (
                <p className="px-6 pb-6 text-base leading-7 text-[#5f6c62]">
                  {answer}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[42px] border border-[#24352d]/10 bg-[#24352d] text-[#f8f2e8] shadow-2xl shadow-[#24352d]/20 lg:grid-cols-[.9fr_1.1fr]">
        <div className="p-8 lg:p-12">
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            {getValue(data, "contactEyebrow")}
          </p>
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
            {getValue(data, "contactTitle")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#f8f2e8]/75">
            {getValue(data, "contactText")}
          </p>

          <div className="mt-10 space-y-3 text-[#f8f2e8]/80">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>

        <form className="m-4 rounded-[34px] bg-[#f8f2e8] p-5 text-[#20342a] lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 outline-none"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 outline-none"
              placeholder="טלפון"
            />
            <input
              className="rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 outline-none"
              placeholder="אימייל"
            />
            <textarea
              className="min-h-36 rounded-2xl border border-[#24352d]/10 bg-white px-5 py-4 outline-none"
              placeholder="מה תרצו לשאול?"
            />
            <button
              type="button"
              className="rounded-full bg-[#b78f65] px-7 py-4 text-base font-semibold text-white"
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
      <div className="mx-auto max-w-7xl rounded-[42px] border border-[#24352d]/10 bg-white/50 p-8 text-center shadow-2xl shadow-[#24352d]/10 lg:p-14">
        <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#20342a] md:text-6xl">
          {getValue(data, "ctaTitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f6c62]">
          {getValue(data, "ctaText")}
        </p>
        <button
          type="button"
          onClick={() => goTo("contact")}
          className="mt-9 rounded-full bg-[#24352d] px-8 py-4 text-base font-semibold text-[#f8f2e8]"
        >
          {getValue(data, "ctaButton")}
        </button>
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
      <Marquee />
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
    [data]
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
      className="serenova-shell min-h-screen w-full overflow-x-hidden font-sans"
    >
      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
      />

      {currentPage === "home" ? (
        <HomePage data={mergedData} goTo={goTo} />
      ) : (
        <SimplePage data={mergedData} type={currentPage} goTo={goTo} />
      )}
    </div>
  );
}