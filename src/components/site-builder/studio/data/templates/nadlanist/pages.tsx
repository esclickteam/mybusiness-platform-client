import React, { useEffect, useMemo, useState } from "react";
import {
  nadlanistDefaultData,
  type NadlanistDefaultData,
} from "./defaultData";

export type NadlanistPageId =
  | "home"
  | "about"
  | "properties"
  | "services"
  | "blog"
  | "contact";

type NadlanistPagesProps = {
  initialPage?: NadlanistPageId | string;
  mode?: "preview" | "editor" | "site" | string;
  data?: Partial<NadlanistDefaultData>;
  defaultData?: Partial<NadlanistDefaultData>;
  templateData?: Partial<NadlanistDefaultData>;
  siteData?: Partial<NadlanistDefaultData>;
  content?: Partial<NadlanistDefaultData>;
};

export const nadlanistPages = [
  { id: "home", label: "בית", path: "/", slug: "/" },
  { id: "about", label: "אודות", path: "/about", slug: "/about" },
  { id: "properties", label: "נכסים", path: "/properties", slug: "/properties" },
  { id: "services", label: "שירותים", path: "/services", slug: "/services" },
  { id: "blog", label: "מגזין", path: "/blog", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", path: "/contact", slug: "/contact" },
] as const;

type NadlanistData = NadlanistDefaultData;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scrollTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function getSafePage(page?: string): NadlanistPageId {
  const valid = nadlanistPages.some((item) => item.id === page);
  return valid ? (page as NadlanistPageId) : "home";
}

function safeArray<T>(value: T[] | readonly T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? [...value] : fallback;
}

function mergeNadlanistData(
  ...sources: Array<Partial<NadlanistDefaultData> | undefined>
) {
  const merged: any = {
    ...nadlanistDefaultData,
    brand: { ...nadlanistDefaultData.brand },
    images: { ...nadlanistDefaultData.images },
    hero: { ...nadlanistDefaultData.hero },
    partners: { ...nadlanistDefaultData.partners },
    manifesto: { ...nadlanistDefaultData.manifesto },
    servicesSection: { ...nadlanistDefaultData.servicesSection },
    propertiesSection: { ...nadlanistDefaultData.propertiesSection },
    reviewsSection: { ...nadlanistDefaultData.reviewsSection },
    processSection: { ...nadlanistDefaultData.processSection },
    faqSection: { ...nadlanistDefaultData.faqSection },
    cta: { ...nadlanistDefaultData.cta },
    about: { ...nadlanistDefaultData.about },
    blog: { ...nadlanistDefaultData.blog },
    contact: { ...nadlanistDefaultData.contact },
    footer: { ...nadlanistDefaultData.footer },
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

  return merged as NadlanistData;
}

function splitTitle(title: string) {
  return String(title || "")
    .split(/\s+/)
    .filter(Boolean);
}

function renderTitleLines(title: string, wordsPerLine = 3) {
  const words = splitTitle(title);

  if (words.length <= wordsPerLine) return title;

  const lines: string[] = [];

  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(words.slice(index, index + wordsPerLine).join(" "));
  }

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

function renderStackedTitle(title: string) {
  return renderTitleLines(title, 3);
}

function renderHeroTitle(title: string) {
  return renderTitleLines(title, 2);
}

function NadlanistStyle() {
  return (
    <style>{`
      @keyframes nadlanist-fade-up {
        from { opacity: 0; transform: translate3d(0, 26px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes nadlanist-float {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
        50% { transform: translate3d(0, -14px, 0) rotate(2deg); }
      }

      @keyframes nadlanist-pulse-ring {
        0% { transform: scale(.92); opacity: .48; }
        70% { transform: scale(1.14); opacity: .06; }
        100% { transform: scale(.92); opacity: 0; }
      }

      .nadlanist-fade-up {
        animation: nadlanist-fade-up .75s cubic-bezier(.2,.75,.2,1) both;
      }

      .nadlanist-float {
        animation: nadlanist-float 5.5s ease-in-out infinite;
      }

      .nadlanist-pulse-ring {
        animation: nadlanist-pulse-ring 2.8s ease-out infinite;
      }
    `}</style>
  );
}

function Button({
  children,
  onClick,
  variant = "gold",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "gold" | "navy" | "ghost" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center rounded-full px-6 py-4 text-[12px] font-black uppercase tracking-[0.16em] transition-all duration-500",
        variant === "gold" &&
          "bg-[#c8a45d] text-[#071426] shadow-lg shadow-[#c8a45d]/20 hover:bg-[#e0bd74]",
        variant === "navy" &&
          "bg-[#071426] text-white shadow-lg shadow-[#071426]/15 hover:bg-[#10243e]",
        variant === "ghost" &&
          "border border-[#071426]/15 bg-white/60 text-[#071426] hover:border-[#c8a45d] hover:bg-white",
        variant === "light" &&
          "bg-white text-[#071426] shadow-lg shadow-black/5 hover:bg-[#f3eee4]"
      )}
    >
      <span>{children}</span>
      <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-1">
        ←
      </span>
    </button>
  );
}

function Eyebrow({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cx(
        "mb-5 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]",
        dark
          ? "border-white/15 bg-white/10 text-white/72"
          : "border-[#071426]/10 bg-white/70 text-[#071426]/65"
      )}
    >
      <span className="text-[#c8a45d]">✦</span>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-12 max-w-4xl text-right">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>

      <h2
        className={cx(
          "text-[clamp(2.5rem,5vw,5.6rem)] font-black uppercase leading-[0.95] tracking-[-0.07em]",
          dark ? "text-white" : "text-[#071426]"
        )}
      >
        {title}
      </h2>

      {text && (
        <p
          className={cx(
            "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
            dark ? "text-white/66" : "text-[#465467]"
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
  page: NadlanistPageId;
  setPage: (page: NadlanistPageId) => void;
  mode?: string;
  data: NadlanistData;
  children: React.ReactNode;
}) {
  const isPreview = mode === "preview";

  return (
    <div
      dir="rtl"
      data-template-id="nadlanist-framion-inspired"
      className={cx(
        "min-h-screen bg-[#eef1f4] text-[#071426]",
        "selection:bg-[#c8a45d] selection:text-[#071426]",
        isPreview && "h-full overflow-y-auto"
      )}
    >
      <NadlanistStyle />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
        <div className="absolute right-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#c8a45d]/20 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#071426]/8 blur-3xl" />
      </div>

      <Header page={page} setPage={setPage} data={data} />
      <main className="relative z-10">{children}</main>
      <Footer setPage={setPage} data={data} />
    </div>
  );
}

function Header({
  page,
  setPage,
  data,
}: {
  page: NadlanistPageId;
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  const navItems = safeArray(
    data.navigation,
    nadlanistDefaultData.navigation
  ).filter((item: any) =>
    nadlanistPages.some((pageItem) => pageItem.id === item.id)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#071426]/10 bg-[#eef1f4]/84 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#071426] text-white">
            <span className="absolute inset-0 bg-[#c8a45d] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative text-sm font-black tracking-[-0.08em] group-hover:text-[#071426]">
              {data.brand.logo}
            </span>
          </span>
          <span className="text-sm font-black uppercase tracking-[0.28em] text-[#071426]">
            {data.brand.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#071426]/10 bg-white/70 p-1 shadow-sm shadow-black/5 lg:flex">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as NadlanistPageId)}
              className={cx(
                "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300",
                page === item.id
                  ? "bg-[#071426] text-white"
                  : "text-[#071426]/58 hover:bg-[#f3eee4] hover:text-[#071426]"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPage("contact")}
          className="rounded-full bg-[#071426] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#c8a45d] hover:text-[#071426]"
        >
          שיחה פרטית
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-[#071426]/10 px-4 py-3 lg:hidden">
        {navItems.map((item: any) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPage(item.id as NadlanistPageId)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em]",
              page === item.id
                ? "border-[#071426] bg-[#071426] text-white"
                : "border-[#071426]/10 bg-white/70 text-[#071426]/65"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Hero({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  const hero = data.hero;
  const chips = safeArray(hero.chips, nadlanistDefaultData.hero.chips);

  return (
    <section className="px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2.2rem] border border-[#071426]/10 bg-white p-4 shadow-2xl shadow-[#071426]/10 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative min-h-[500px] overflow-hidden rounded-[1.6rem] bg-[#071426] p-3 lg:min-h-[630px]">
            <div className="absolute right-6 top-6 z-20 rounded-full bg-[#c8a45d] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#071426]">
              {hero.badge}
            </div>

            <div className="absolute -right-5 bottom-14 z-20 hidden rotate-[5deg] rounded-[1.6rem] border border-white/15 bg-[#071426]/82 p-4 text-white backdrop-blur-xl sm:block">
              <div className="text-4xl font-black tracking-[-0.08em]">
                {hero.statNumber}
              </div>
              <div className="mt-1 max-w-[130px] text-[10px] uppercase leading-4 tracking-[0.2em] text-white/62">
                {hero.statLabel}
              </div>
            </div>

            <div className="nadlanist-float absolute left-5 top-28 z-20 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-xl">
              <span className="text-center text-[10px] font-black uppercase leading-4 tracking-[0.18em]">
                {String(hero.floatingLabel || "תיאום סיור")
                  .split(/\s+/)
                  .map((word, index) => (
                    <React.Fragment key={`${word}-${index}`}>
                      {word}
                      {index === 0 && <br />}
                    </React.Fragment>
                  ))}
              </span>
              <span className="nadlanist-pulse-ring absolute inset-0 rounded-full border border-[#c8a45d]" />
            </div>

            <img
              src={hero.image || data.images.hero}
              alt={hero.imageTitle}
              className="h-full min-h-[476px] w-full rounded-[1.25rem] object-cover object-center grayscale transition duration-700 hover:scale-[1.03] hover:grayscale-0 lg:min-h-[606px]"
            />

            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-b-[1.25rem] bg-gradient-to-t from-[#071426]/90 via-[#071426]/35 to-transparent p-7">
              <div className="text-2xl font-black uppercase leading-none tracking-[-0.05em] text-white sm:text-3xl">
                {hero.imageTitle}
              </div>
            </div>
          </div>

          <div className="nadlanist-fade-up py-4 text-right lg:py-10">
            <div className="mb-8 flex flex-wrap justify-start gap-3">
              {chips.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#071426]/10 bg-[#eef1f4] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#071426]/62"
                >
                  {item}
                </span>
              ))}
            </div>

            <h1 className="max-w-5xl text-[clamp(3.7rem,7vw,7.4rem)] font-black uppercase leading-[0.9] tracking-[-0.1em] text-[#071426]">
              {renderHeroTitle(hero.title)}
            </h1>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <p className="max-w-xl text-base leading-8 text-[#465467] sm:text-lg">
                {hero.subtitle}
              </p>

              <div className="flex flex-wrap justify-start gap-3">
                <Button onClick={() => setPage("properties")}>
                  {hero.primaryButton}
                </Button>
                <Button variant="ghost" onClick={() => setPage("contact")}>
                  {hero.secondaryButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Partners({ data }: { data: NadlanistData }) {
  const partners = safeArray(
    data.partners.items,
    nadlanistDefaultData.partners.items
  );

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-[#071426]/10 bg-white/80 p-4 shadow-xl shadow-[#071426]/5 sm:p-6">
        <div className="mb-5 text-right text-xs font-black uppercase tracking-[0.22em] text-[#071426]/50">
          {data.partners.eyebrow}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((item) => (
            <div
              key={item}
              className="flex h-20 items-center justify-center rounded-2xl border border-[#071426]/10 bg-[#eef1f4] text-sm font-black uppercase tracking-[0.14em] text-[#071426]/55 transition duration-500 hover:bg-[#071426] hover:text-white"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div className="text-right">
            <h2 className="max-w-5xl text-[clamp(2.9rem,5.2vw,5.8rem)] font-black uppercase leading-[0.95] tracking-[-0.08em] text-[#071426]">
              {renderStackedTitle(data.manifesto.title)}
            </h2>
          </div>

          <div className="rounded-[2rem] border border-[#071426]/10 bg-white p-6 text-right shadow-xl shadow-[#071426]/6 sm:p-8">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a45d] text-xl text-[#071426]">
              ◆
            </div>
            <p className="text-lg leading-9 text-[#465467]">
              {data.manifesto.text}
            </p>
            <div className="mt-8">
              <Button variant="ghost" onClick={() => setPage("about")}>
                {data.manifesto.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: NadlanistData }) {
  const services = safeArray(data.services, nadlanistDefaultData.services);

  return (
    <section className="bg-[#f7f8fa] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow={data.servicesSection.eyebrow}
          title={renderStackedTitle(data.servicesSection.title)}
          text={data.servicesSection.text}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-[#071426]/10 bg-white text-right shadow-xl shadow-[#071426]/6"
            >
              <div className="relative h-[320px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#071426]">
                  0{index + 1}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-black uppercase tracking-[-0.06em] text-[#071426]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-[#465467]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Properties({
  setPage,
  data,
  showButton = true,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
  showButton?: boolean;
}) {
  const properties = safeArray(
    data.properties,
    nadlanistDefaultData.properties
  );

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow={data.propertiesSection.eyebrow}
            title={renderStackedTitle(data.propertiesSection.title)}
            text={data.propertiesSection.text}
          />

          {showButton && (
            <div className="pb-2">
              <Button variant="ghost" onClick={() => setPage("properties")}>
                {data.propertiesSection.button}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {properties.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={cx(
                "group overflow-hidden rounded-[2rem] border border-[#071426]/10 bg-white shadow-xl shadow-[#071426]/8",
                index % 2 === 1 && "lg:translate-y-8"
              )}
            >
              <div className="relative h-[430px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/76 via-[#071426]/10 to-transparent" />

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#071426]">
                    {item.tag}
                  </span>
                  <span className="rounded-full border border-white/25 bg-[#071426]/35 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white backdrop-blur">
                    {item.location}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-right">
                  <div className="mb-4 flex flex-wrap justify-start gap-2">
                    {safeArray(item.details, []).map((detail) => (
                      <span
                        key={detail}
                        className="rounded-full border border-white/20 bg-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-[clamp(2.2rem,4.2vw,3.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                      {item.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setPage("contact")}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c8a45d] text-xl font-black text-[#071426] transition duration-500 group-hover:rotate-[35deg]"
                    >
                      ←
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: NadlanistData }) {
  const reviews = safeArray(data.reviews, nadlanistDefaultData.reviews);

  return (
    <section className="bg-[#071426] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow={data.reviewsSection.eyebrow}
          title={renderStackedTitle(data.reviewsSection.title)}
          text={data.reviewsSection.text}
          dark
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="rounded-[2rem] border border-white/10 bg-white p-7 text-right text-[#071426] transition duration-500 hover:-translate-y-2 hover:bg-[#c8a45d]"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-4xl font-black tracking-[-0.08em]">
                  {item.rating}
                </span>
                <span className="text-5xl leading-none">“</span>
              </div>
              <p className="text-lg font-semibold leading-8">{item.quote}</p>
              <div className="mt-8 border-t border-black/10 pt-5">
                <div className="font-black uppercase tracking-[-0.03em]">
                  {item.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-black/55">
                  {item.role}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: NadlanistData }) {
  const process = safeArray(data.process, nadlanistDefaultData.process);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow={data.processSection.eyebrow}
          title={renderStackedTitle(data.processSection.title)}
          text={data.processSection.text}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          {process.map((item) => (
            <article
              key={item.step}
              className="rounded-[2rem] border border-[#071426]/10 bg-white p-7 text-right shadow-xl shadow-[#071426]/6 transition duration-500 hover:-translate-y-2"
            >
              <div className="mb-10 text-xs font-black uppercase tracking-[0.22em] text-[#c8a45d]">
                {item.step}
              </div>
              <h3 className="text-2xl font-black uppercase leading-none tracking-[-0.05em] text-[#071426]">
                {item.title}
              </h3>
              <p className="mt-5 leading-7 text-[#465467]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  const faqs = safeArray(data.faq, nadlanistDefaultData.faq);

  return (
    <section className="bg-[#f7f8fa] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.65fr_1fr]">
        <div className="text-right">
          <SectionTitle
            eyebrow={data.faqSection.eyebrow}
            title={renderStackedTitle(data.faqSection.title)}
            text={data.faqSection.text}
          />
          <Button variant="ghost" onClick={() => setPage("contact")}>
            {data.faqSection.button}
          </Button>
        </div>

        <div className="space-y-3 text-right">
          {faqs.map((item, index) => (
            <details
              key={`${item.q}-${index}`}
              className="group rounded-[1.5rem] border border-[#071426]/10 bg-white p-6 shadow-sm shadow-black/5"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black tracking-[-0.03em] text-[#071426]">
                <span>
                  {index + 1}. {item.q}
                </span>
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 max-w-3xl leading-8 text-[#465467]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCta({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2.5rem] border border-[#071426]/10 bg-[#071426] p-5 text-white shadow-2xl shadow-[#071426]/20 sm:p-8">
        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] p-6 text-right sm:p-10">
          <img
            src={data.cta.image || data.images.heroAlt}
            alt={data.cta.title}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-65 grayscale transition duration-700 hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/90 via-[#071426]/42 to-transparent" />

          <div className="relative z-10 flex min-h-[370px] flex-col justify-end">
            <h2 className="max-w-5xl text-[clamp(2.9rem,5.2vw,5.8rem)] font-black uppercase leading-[0.95] tracking-[-0.08em]">
              {renderStackedTitle(data.cta.title)}
            </h2>
            <div className="mt-8">
              <Button onClick={() => setPage("contact")}>
                {data.cta.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  return (
    <>
      <Hero setPage={setPage} data={data} />
      <Partners data={data} />
      <Manifesto setPage={setPage} data={data} />
      <Services data={data} />
      <Properties setPage={setPage} data={data} />
      <Reviews data={data} />
      <Process data={data} />
      <Faq setPage={setPage} data={data} />
      <BigCta setPage={setPage} data={data} />
    </>
  );
}

function AboutPage({ data }: { data: NadlanistData }) {
  const stats = safeArray(data.about.stats, nadlanistDefaultData.about.stats);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.8fr_1fr] lg:items-end">
        <div className="overflow-hidden rounded-[2rem] border border-[#071426]/10 bg-white p-3 shadow-xl shadow-[#071426]/8">
          <img
            src={data.about.image || data.images.portrait}
            alt={data.about.title}
            className="h-[560px] w-full rounded-[1.5rem] object-cover object-center grayscale transition duration-700 hover:grayscale-0"
          />
        </div>

        <div className="text-right">
          <Eyebrow>{data.about.eyebrow}</Eyebrow>
          <h1 className="text-[clamp(2.9rem,5.2vw,5.8rem)] font-black uppercase leading-[0.95] tracking-[-0.08em] text-[#071426]">
            {renderStackedTitle(data.about.title)}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-9 text-[#465467]">
            {data.about.text}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1500px] gap-4 sm:grid-cols-3">
        {stats.map(([num, label]) => (
          <div
            key={label}
            className="rounded-[2rem] border border-[#071426]/10 bg-white p-8 text-right shadow-xl shadow-[#071426]/6"
          >
            <div className="text-6xl font-black tracking-[-0.1em] text-[#071426]">
              {num}
            </div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#071426]/45">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PropertiesPage({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow={data.propertiesSection.eyebrow}
            title={renderStackedTitle(data.propertiesSection.title)}
            text={data.propertiesSection.text}
          />
        </div>
      </section>

      <Properties setPage={setPage} data={data} showButton={false} />
    </>
  );
}

function ServicesPage({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow={data.servicesSection.eyebrow}
            title={renderStackedTitle(data.servicesSection.title)}
            text={data.servicesSection.text}
          />
        </div>
      </section>

      <Services data={data} />
      <Process data={data} />
      <Faq setPage={setPage} data={data} />
    </>
  );
}

function BlogPage({ data }: { data: NadlanistData }) {
  const posts = safeArray(data.blog.posts, nadlanistDefaultData.blog.posts);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow={data.blog.eyebrow}
          title={renderStackedTitle(data.blog.title)}
          text={data.blog.text}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={`${post.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-[#071426]/10 bg-white text-right shadow-xl shadow-[#071426]/6"
            >
              <div className="h-[320px] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
              </div>
              <div className="p-7">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#c8a45d]">
                  {post.date}
                </div>
                <h2 className="text-2xl font-black uppercase leading-none tracking-[-0.05em] text-[#071426]">
                  {post.title}
                </h2>
                <p className="mt-5 leading-7 text-[#465467]">
                  תקציר קצר שיכול להתחבר בהמשך למערכת הבלוג שלך.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage({ data }: { data: NadlanistData }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_.75fr]">
        <div className="text-right">
          <Eyebrow>{data.contact.eyebrow}</Eyebrow>

          <h1 className="text-[clamp(2.9rem,5.2vw,5.8rem)] font-black uppercase leading-[0.95] tracking-[-0.08em] text-[#071426]">
            {renderStackedTitle(data.contact.title)}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-[#465467]">
            {data.contact.text}
          </p>
        </div>

        <form
          dir="rtl"
          className="rounded-[2rem] border border-[#071426]/10 bg-white p-6 text-right shadow-xl shadow-[#071426]/6 sm:p-8"
        >
          {[
            ["שם", "השם שלך"],
            ["אימייל", "hello@email.com"],
            ["עניין", "קנייה, מכירה, ייעוץ..."],
          ].map(([label, placeholder]) => (
            <label key={label} className="mb-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#071426]/45">
                {label}
              </span>
              <input
                placeholder={placeholder}
                className="w-full rounded-2xl border border-[#071426]/10 bg-[#eef1f4] px-5 py-4 text-right text-[#071426] outline-none transition placeholder:text-[#071426]/30 focus:border-[#c8a45d]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#071426]/45">
              הודעה
            </span>
            <textarea
              rows={5}
              placeholder="ספרו בקצרה מה אתם מחפשים..."
              className="w-full resize-none rounded-2xl border border-[#071426]/10 bg-[#eef1f4] px-5 py-4 text-right text-[#071426] outline-none transition placeholder:text-[#071426]/30 focus:border-[#c8a45d]"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-[#c8a45d] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#071426] transition hover:bg-[#071426] hover:text-white"
          >
            {data.contact.button} ←
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({
  setPage,
  data,
}: {
  setPage: (page: NadlanistPageId) => void;
  data: NadlanistData;
}) {
  const navItems = safeArray(
    data.navigation,
    nadlanistDefaultData.navigation
  ).filter((item: any) =>
    nadlanistPages.some((pageItem) => pageItem.id === item.id)
  );

  return (
    <footer className="relative z-10 border-t border-[#071426]/10 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="text-right">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="text-4xl font-black uppercase leading-none tracking-[-0.08em] text-[#071426] transition hover:text-[#c8a45d]"
          >
            {data.brand.name} ®
          </button>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#465467]">
            {data.footer.text}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {navItems.map((item: any, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as NadlanistPageId)}
              className="rounded-full border border-[#071426]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#071426]/55 transition hover:border-[#c8a45d] hover:text-[#071426]"
            >
              {item.label} 0{index + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={scrollTop}
            className="rounded-full bg-[#071426] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white"
          >
            {data.footer.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function NadlanistPages({
  initialPage = "home",
  mode = "site",
  data,
  defaultData,
  templateData,
  siteData,
  content,
}: NadlanistPagesProps) {
  const [page, setPageState] = useState<NadlanistPageId>(
    getSafePage(initialPage)
  );

  const resolvedData = useMemo(
    () => mergeNadlanistData(defaultData, templateData, siteData, content, data),
    [content, data, defaultData, siteData, templateData]
  );

  useEffect(() => {
    setPageState(getSafePage(initialPage));
  }, [initialPage]);

  const setPage = useMemo(
    () => (nextPage: NadlanistPageId) => {
      setPageState(nextPage);
      scrollTop();
    },
    []
  );

  return (
    <Shell page={page} setPage={setPage} mode={mode} data={resolvedData}>
      {page === "home" && <HomePage setPage={setPage} data={resolvedData} />}
      {page === "about" && <AboutPage data={resolvedData} />}
      {page === "properties" && (
        <PropertiesPage setPage={setPage} data={resolvedData} />
      )}
      {page === "services" && (
        <ServicesPage setPage={setPage} data={resolvedData} />
      )}
      {page === "blog" && <BlogPage data={resolvedData} />}
      {page === "contact" && <ContactPage data={resolvedData} />}
    </Shell>
  );
}