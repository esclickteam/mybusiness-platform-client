import React, { useEffect, useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { domoraDefaultData, type DomoraDefaultData } from "./defaultData";

export type DomoraPageId =
  | "home"
  | "properties"
  | "articles"
  | "testimonials"
  | "faq"
  | "contact";

type DomoraPagesProps = {
  initialPage?: DomoraPageId | string;
  mode?: "preview" | "editor" | "site" | string;
  data?: Partial<DomoraDefaultData>;
  defaultData?: Partial<DomoraDefaultData>;
  templateData?: Partial<DomoraDefaultData>;
  siteData?: Partial<DomoraDefaultData>;
  content?: Partial<DomoraDefaultData>;
};

export const domoraPages = [
  { id: "home", label: "בית", path: "/", slug: "/" },
  { id: "properties", label: "נכסים", path: "/properties", slug: "/properties" },
  { id: "articles", label: "מאמרים", path: "/articles", slug: "/articles" },
  {
    id: "testimonials",
    label: "המלצות",
    path: "/testimonials",
    slug: "/testimonials",
  },
  { id: "faq", label: "שאלות", path: "/faq", slug: "/faq" },
  { id: "contact", label: "יצירת קשר", path: "/contact", slug: "/contact" },
] as const;

type DomoraData = DomoraDefaultData;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=90";

const HERO_CUTOUT_IMAGE = "/images/domora/hero-house-cutout.png";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.src = FALLBACK_IMAGE;
}

function handleHeroImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.dataset.heroHidden === "true") return;

  image.dataset.heroHidden = "true";
  image.style.display = "none";
}

function scrollTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function getSafePage(page?: string): DomoraPageId {
  const valid = domoraPages.some((item) => item.id === page);
  return valid ? (page as DomoraPageId) : "home";
}

function safeArray<T>(value: T[] | readonly T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? [...value] : fallback;
}

function mergeDomoraData(
  ...sources: Array<Partial<DomoraDefaultData> | undefined>
) {
  const merged: any = {
    ...domoraDefaultData,
    brand: { ...domoraDefaultData.brand },
    images: { ...domoraDefaultData.images },
    hero: { ...domoraDefaultData.hero },
    essence: { ...domoraDefaultData.essence },
    propertiesSection: { ...domoraDefaultData.propertiesSection },
    gallery: { ...domoraDefaultData.gallery },
    articlesSection: { ...domoraDefaultData.articlesSection },
    testimonialsSection: { ...domoraDefaultData.testimonialsSection },
    faqSection: { ...domoraDefaultData.faqSection },
    cta: { ...domoraDefaultData.cta },
    contact: { ...domoraDefaultData.contact },
    footer: { ...domoraDefaultData.footer },
  };

  sources.filter(Boolean).forEach((source: any) => {
    Object.entries(source).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof merged[key] === "object" &&
        !Array.isArray(merged[key])
      ) {
        merged[key] = { ...merged[key], ...value };
      } else if (value !== undefined && value !== null) {
        merged[key] = value;
      }
    });
  });

  return merged as DomoraData;
}

function DomoraStyle() {
  return (
    <style>{`
      @keyframes domora-fade-up {
        from { opacity: 0; transform: translate3d(0, 26px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes domora-float {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(0, -12px, 0); }
      }

      .domora-fade-up {
        animation: domora-fade-up .75s cubic-bezier(.2,.75,.2,1) both;
      }

      .domora-float {
        animation: domora-float 5.5s ease-in-out infinite;
      }
    `}</style>
  );
}

function Button({
  children,
  onClick,
  variant = "dark",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "dark" | "light" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold transition duration-300",
        variant === "dark" &&
          "bg-[#151d20] text-white shadow-lg shadow-black/10 hover:bg-[#263033]",
        variant === "light" &&
          "bg-white text-[#151d20] shadow-lg shadow-black/10 hover:bg-[#f3f3f0]",
        variant === "ghost" &&
          "border border-white/16 bg-white/10 text-white backdrop-blur hover:bg-white/18",
      )}
    >
      {children}
    </button>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  dark = false,
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={cx(
        "mb-12",
        center ? "mx-auto max-w-4xl text-center" : "max-w-4xl text-right",
      )}
    >
      {eyebrow && (
        <div
          className={cx(
            "mb-4 text-sm font-medium",
            dark ? "text-white/58" : "text-[#72777b]",
          )}
        >
          {eyebrow}
        </div>
      )}

      <h2
        className={cx(
          "text-[clamp(2.3rem,4.6vw,5.5rem)] font-light leading-[1.02] tracking-[-0.06em]",
          dark ? "text-white" : "text-[#151d20]",
        )}
      >
        {title}
      </h2>

      {text && (
        <p
          className={cx(
            "mt-5 text-lg leading-8",
            center && "mx-auto max-w-2xl",
            dark ? "text-white/62" : "text-[#6d7378]",
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function Shell({
  page,
  setPage,
  mode,
  data,
  children,
}: {
  page: DomoraPageId;
  setPage: (page: DomoraPageId) => void;
  mode?: string;
  data: DomoraData;
  children: React.ReactNode;
}) {
  const isPreview = mode === "preview";

  return (
    <div
      dir="rtl"
      data-template-id="domora-cetfar-inspired"
      className={cx(
        "min-h-screen bg-[#f5f5f2] text-[#151d20]",
        "selection:bg-[#151d20] selection:text-white",
        isPreview && "h-full overflow-y-auto",
      )}
    >
      <DomoraStyle />
      <Header page={page} setPage={setPage} data={data} />
      <main data-template-page-id={page}>{children}</main>
      <Footer setPage={setPage} data={data} />
    </div>
  );
}

function Header({
  page,
  setPage,
  data,
}: {
  page: DomoraPageId;
  setPage: (page: DomoraPageId) => void;
  data: DomoraData;
}) {
  const navItems = safeArray(data.navigation, domoraDefaultData.navigation);

  return (
    <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1420px] items-center justify-between rounded-full bg-[#151d20] px-5 py-4 text-white shadow-2xl shadow-black/15">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="flex items-center gap-3"
        >
          <span className="text-2xl font-semibold tracking-[-0.04em]">
            {data.brand.name}
          </span>
          <span className="text-xs text-white/45">®</span>
        </button>

        <nav className="hidden items-center rounded-full bg-white/[0.035] px-3 py-2 md:flex">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as DomoraPageId)}
              className={cx(
                "rounded-full px-5 py-3 text-sm transition duration-300",
                page === item.id
                  ? "bg-white text-[#151d20]"
                  : "text-white/72 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPage("contact")}
          className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#151d20] transition hover:bg-[#e9e2d2]"
        >
          יצירת קשר
        </button>
      </div>
    </header>
  );
}

function Hero({
  setPage,
  data,
}: {
  setPage: (page: DomoraPageId) => void;
  data: DomoraData;
}) {
  const hero = data.hero;

  const heroImage =
    hero.cutoutImage || data.images.heroCutout || hero.image || HERO_CUTOUT_IMAGE;

  return (
    <section className="-mt-24 relative isolate overflow-hidden bg-[#11191c] px-4 pb-0 pt-40 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-4 h-[360px] w-[850px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute left-1/2 top-[380px] h-[440px] w-[1180px] -translate-x-1/2 rounded-full bg-[#193440]/55 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#11191c] via-[#11191c]/80 to-transparent" />
      </div>

      <div className="relative z-20 mx-auto max-w-[1500px]">
        <div className="domora-fade-up mx-auto max-w-[1120px] text-center">
          <div className="mb-5 text-sm font-medium tracking-wide text-white/60">
            {hero.eyebrow}
          </div>

          <h1 className="mx-auto max-w-[1220px] text-[clamp(3rem,6.3vw,7.2rem)] font-light leading-[0.96] tracking-[-0.075em] text-white">
            {hero.title}
            <span className="mx-3 inline-block font-serif italic tracking-[-0.055em] text-white/95">
              {hero.italic}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[760px] text-[16px] leading-8 text-white/68 sm:text-[18px]">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="light" onClick={() => setPage("properties")}>
              {hero.primaryButton}
            </Button>
            <Button variant="ghost" onClick={() => setPage("contact")}>
              {hero.secondaryButton}
            </Button>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-12 flex min-h-[390px] items-end justify-center sm:mt-14 sm:min-h-[520px] lg:min-h-[650px]">
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[190px] w-[82vw] max-w-[1180px] -translate-x-1/2 rounded-[100%] bg-black/28 blur-2xl" />

          <img
            src={heroImage}
            alt={hero.title}
            onError={handleHeroImageError}
            className="pointer-events-none relative z-10 h-auto max-h-[680px] w-auto max-w-[min(94vw,1240px)] object-contain object-bottom drop-shadow-[0_45px_85px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  );
}

function Essence({ data }: { data: DomoraData }) {
  const cards = safeArray(data.essence.cards, domoraDefaultData.essence.cards);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        <SectionIntro
          eyebrow={data.essence.eyebrow}
          title={data.essence.title}
          text={data.essence.text}
          center
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className="rounded-[2rem] bg-white p-7 text-right shadow-xl shadow-black/[0.04] transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#151d20] text-sm text-white">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-2xl font-light tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className="mt-4 leading-7 text-[#6d7378]">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Properties({
  data,
  setPage,
}: {
  data: DomoraData;
  setPage: (page: DomoraPageId) => void;
}) {
  const properties = safeArray(data.properties, domoraDefaultData.properties);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-end">
          <SectionIntro
            eyebrow={data.propertiesSection.eyebrow}
            title={data.propertiesSection.title}
            text={data.propertiesSection.text}
          />

          <div className="mb-12 flex justify-start lg:justify-end">
            <Button variant="dark" onClick={() => setPage("contact")}>
              לתיאום שיחה
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {properties.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="group overflow-hidden rounded-[2.2rem] bg-white shadow-xl shadow-black/[0.05]"
            >
              <div className="relative h-[430px] overflow-hidden">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

                <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold">
                  {item.tag}
                </div>

                <div className="absolute bottom-5 right-5 text-right text-white">
                  <h3 className="text-3xl font-light tracking-[-0.05em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-white/75">{item.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 p-5">
                {safeArray(item.details, []).map((detail) => (
                  <span
                    key={detail}
                    className="rounded-full bg-[#f2f2ef] px-4 py-2 text-xs text-[#6d7378]"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: DomoraData }) {
  const images = safeArray(data.gallery.images, domoraDefaultData.gallery.images);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_0.45fr] lg:items-end">
          <SectionIntro
            eyebrow={data.gallery.eyebrow}
            title={data.gallery.title}
            text={data.gallery.text}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src={images[0] || FALLBACK_IMAGE}
              alt={data.gallery.title}
              onError={handleImageError}
              className="h-[560px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="grid gap-5">
            {images.slice(1, 3).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-[2rem]"
              >
                <img
                  src={image || FALLBACK_IMAGE}
                  alt={`${data.gallery.title} ${index + 1}`}
                  onError={handleImageError}
                  className="h-[270px] w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Articles({ data }: { data: DomoraData }) {
  const articles = safeArray(data.articles, domoraDefaultData.articles);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        <SectionIntro
          eyebrow={data.articlesSection.eyebrow}
          title={data.articlesSection.title}
          text={data.articlesSection.text}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={`${article.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] bg-[#f5f5f2]"
            >
              <div className="h-[310px] overflow-hidden">
                <img
                  src={article.image || FALLBACK_IMAGE}
                  alt={article.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7 text-right">
                <div className="mb-5 flex items-center justify-between text-sm text-[#85898d]">
                  <span>{article.date}</span>
                  <span>{article.category}</span>
                </div>
                <h3 className="text-3xl font-light leading-tight tracking-[-0.05em]">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: DomoraData }) {
  const testimonials = safeArray(
    data.testimonials,
    domoraDefaultData.testimonials,
  );

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        <SectionIntro
          eyebrow={data.testimonialsSection.eyebrow}
          title={data.testimonialsSection.title}
          text={data.testimonialsSection.text}
          center
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="rounded-[2rem] bg-white p-8 text-right shadow-xl shadow-black/[0.04]"
            >
              <div className="mb-4 text-xl text-[#ff8a1f]">{item.rating}</div>
              <p className="text-xl leading-9 text-[#5f666b]">{item.quote}</p>
              <div className="mt-8 border-t border-black/5 pt-5">
                <div className="text-xl font-semibold">{item.name}</div>
                <div className="mt-1 text-[#85898d]">{item.handle}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ data }: { data: DomoraData }) {
  const faqs = safeArray(data.faq, domoraDefaultData.faq);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[0.7fr_1fr]">
        <SectionIntro
          eyebrow={data.faqSection.eyebrow}
          title={data.faqSection.title}
          text={data.faqSection.text}
        />

        <div className="rounded-[2rem] bg-white p-4 shadow-xl shadow-black/[0.04]">
          {faqs.map((item, index) => (
            <details
              key={`${item.q}-${index}`}
              className="group border-b border-black/5 px-4 py-5 last:border-b-0"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-right text-xl font-light tracking-[-0.03em]">
                <span>{item.q}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f1ee] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-right leading-8 text-[#6d7378]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({
  data,
  setPage,
}: {
  data: DomoraData;
  setPage: (page: DomoraPageId) => void;
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1450px] overflow-hidden rounded-[3rem] bg-[#151d20] text-white lg:grid-cols-[0.85fr_1fr]">
        <div className="p-8 text-right sm:p-12 lg:p-16">
          <div className="mb-5 text-white/55">{data.cta.eyebrow}</div>
          <h2 className="text-[clamp(2.6rem,5vw,5.8rem)] font-light leading-[1] tracking-[-0.065em]">
            {data.cta.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            {data.cta.text}
          </p>
          <div className="mt-8">
            <Button variant="light" onClick={() => setPage("contact")}>
              {data.cta.button}
            </Button>
          </div>
        </div>

        <img
          src={data.cta.image || FALLBACK_IMAGE}
          alt={data.cta.title}
          onError={handleImageError}
          className="h-[520px] w-full object-cover"
        />
      </div>
    </section>
  );
}

function ContactPage({ data }: { data: DomoraData }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[0.8fr_0.7fr]">
        <div className="text-right">
          <div className="mb-5 text-[#85898d]">{data.contact.eyebrow}</div>
          <h1 className="text-[clamp(3rem,6vw,6.8rem)] font-light leading-[0.95] tracking-[-0.07em]">
            {data.contact.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-[#6d7378]">
            {data.contact.text}
          </p>
        </div>

        <form
          dir="rtl"
          className="rounded-[2rem] bg-white p-6 text-right shadow-xl shadow-black/[0.04]"
        >
          {[
            ["שם", "השם שלך"],
            ["טלפון", "050-0000000"],
            ["עניין", "קנייה, מכירה, ייעוץ..."],
          ].map(([label, placeholder]) => (
            <label key={label} className="mb-5 block">
              <span className="mb-2 block text-sm text-[#85898d]">{label}</span>
              <input
                placeholder={placeholder}
                className="w-full rounded-2xl border border-black/5 bg-[#f5f5f2] px-5 py-4 outline-none transition placeholder:text-[#9a9fa3] focus:border-[#151d20]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm text-[#85898d]">הודעה</span>
            <textarea
              rows={5}
              placeholder="ספרו בקצרה מה אתם מחפשים..."
              className="w-full resize-none rounded-2xl border border-black/5 bg-[#f5f5f2] px-5 py-4 outline-none transition placeholder:text-[#9a9fa3] focus:border-[#151d20]"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-[#151d20] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2a3336]"
          >
            {data.contact.button}
          </button>
        </form>
      </div>
    </section>
  );
}

function HomePage({
  data,
  setPage,
}: {
  data: DomoraData;
  setPage: (page: DomoraPageId) => void;
}) {
  return (
    <>
      <Hero data={data} setPage={setPage} />
      <Essence data={data} />
      <Properties data={data} setPage={setPage} />
      <Gallery data={data} />
      <Articles data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Cta data={data} setPage={setPage} />
    </>
  );
}

function Footer({
  setPage,
  data,
}: {
  setPage: (page: DomoraPageId) => void;
  data: DomoraData;
}) {
  const navItems = safeArray(data.navigation, domoraDefaultData.navigation);

  return (
    <footer className="border-t border-black/5 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="text-right">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="text-3xl font-semibold tracking-[-0.05em]"
          >
            {data.brand.name}
          </button>
          <p className="mt-3 max-w-md text-[#6d7378]">{data.footer.text}</p>
          <p className="mt-3 text-sm text-[#9a9fa3]">{data.footer.rights}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as DomoraPageId)}
              className="rounded-full border border-black/5 px-4 py-2 text-sm text-[#6d7378] transition hover:bg-[#151d20] hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function DomoraPages({
  initialPage = "home",
  mode = "site",
  data,
  defaultData,
  templateData,
  siteData,
  content,
}: DomoraPagesProps) {
  const [page, setPageState] = useState<DomoraPageId>(getSafePage(initialPage));

  const resolvedData = useMemo(
    () => mergeDomoraData(defaultData, templateData, siteData, content, data),
    [content, data, defaultData, siteData, templateData],
  );

  useEffect(() => {
    setPageState(getSafePage(initialPage));
  }, [initialPage]);

  const setPage = useMemo(
    () => (nextPage: DomoraPageId) => {
      setPageState(nextPage);
      scrollTop();
    },
    [],
  );

  return (
    <Shell page={page} setPage={setPage} mode={mode} data={resolvedData}>
      <VisualPageStack
        activePageId={page}
        pages={[
          {
            id: "home",
            content: <HomePage data={resolvedData} setPage={setPage} />,
          },
          {
            id: "properties",
            content: (
              <>
                <Properties data={resolvedData} setPage={setPage} />
                <Gallery data={resolvedData} />
                <Cta data={resolvedData} setPage={setPage} />
              </>
            ),
          },
          { id: "articles", content: <Articles data={resolvedData} /> },
          {
            id: "testimonials",
            content: <Testimonials data={resolvedData} />,
          },
          { id: "faq", content: <Faq data={resolvedData} /> },
          { id: "contact", content: <ContactPage data={resolvedData} /> },
        ]}
      />
    </Shell>
  );
}