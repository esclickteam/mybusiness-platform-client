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
  { id: "home", label: "Home", path: "/", slug: "/" },
  { id: "about", label: "About", path: "/about", slug: "/about" },
  {
    id: "properties",
    label: "Properties",
    path: "/properties",
    slug: "/properties",
  },
  { id: "services", label: "Services", path: "/services", slug: "/services" },
  { id: "blog", label: "Blog", path: "/blog", slug: "/blog" },
  { id: "contact", label: "Contact", path: "/contact", slug: "/contact" },
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

function renderStackedTitle(title: string) {
  const words = splitTitle(title);
  if (words.length <= 1) return title;

  return (
    <>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          {word}
          {index < words.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

function renderHeroTitle(title: string) {
  const words = splitTitle(title);
  if (words.length <= 2) return renderStackedTitle(title);

  return (
    <>
      {words.slice(0, 2).join(" ")}
      <br />
      {words.slice(2).join(" ")}
    </>
  );
}

function NadlanistStyle() {
  return (
    <style>{`
      @keyframes nadlanist-fade-up {
        from { opacity: 0; transform: translate3d(0, 34px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes nadlanist-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @keyframes nadlanist-marquee-reverse {
        from { transform: translateX(-50%); }
        to { transform: translateX(0); }
      }

      @keyframes nadlanist-float {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
        50% { transform: translate3d(0, -18px, 0) rotate(2deg); }
      }

      @keyframes nadlanist-pulse-ring {
        0% { transform: scale(.92); opacity: .75; }
        70% { transform: scale(1.15); opacity: .05; }
        100% { transform: scale(.92); opacity: 0; }
      }

      .nadlanist-fade-up {
        animation: nadlanist-fade-up .8s cubic-bezier(.2,.75,.2,1) both;
      }

      .nadlanist-marquee {
        animation: nadlanist-marquee 26s linear infinite;
      }

      .nadlanist-marquee-reverse {
        animation: nadlanist-marquee-reverse 30s linear infinite;
      }

      .nadlanist-float {
        animation: nadlanist-float 5.5s ease-in-out infinite;
      }

      .nadlanist-pulse-ring {
        animation: nadlanist-pulse-ring 2.7s ease-out infinite;
      }
    `}</style>
  );
}

function Button({
  children,
  onClick,
  variant = "light",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "light" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-4 text-xs font-black uppercase tracking-[0.18em] transition-all duration-500",
        variant === "light" &&
          "bg-[#f6efe3] text-[#10100e] hover:bg-[#d8b36a]",
        variant === "ghost" &&
          "border border-white/15 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/10"
      )}
    >
      <span>{children}</span>
      <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/65">
      <span className="text-[#d8b36a]">✦</span>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-5xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.08em] text-[#f6efe3] sm:text-7xl lg:text-8xl">
        {title}
      </h2>
      {text && (
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
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
      dir="ltr"
      data-template-id="nadlanist-framion-inspired"
      className={cx(
        "min-h-screen bg-[#10100e] text-[#f6efe3]",
        "selection:bg-[#f6efe3] selection:text-[#10100e]",
        isPreview && "h-full overflow-y-auto"
      )}
    >
      <NadlanistStyle />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div className="absolute left-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#d8b36a]/10 blur-3xl" />
        <div className="absolute bottom-[-18rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-white/10 blur-3xl" />
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10100e]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white text-[#10100e]">
            <span className="absolute inset-0 bg-[#d8b36a] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative text-sm font-black tracking-[-0.08em]">
              {data.brand.logo}
            </span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.35em]">
            {data.brand.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as NadlanistPageId)}
              className={cx(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300",
                page === item.id
                  ? "bg-[#f6efe3] text-[#10100e]"
                  : "text-white/62 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPage("contact")}
          className="group relative overflow-hidden rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-500 hover:border-[#d8b36a]/80"
        >
          <span className="absolute inset-0 translate-y-full bg-[#d8b36a] transition-transform duration-500 group-hover:translate-y-0" />
          <span className="relative group-hover:text-[#10100e]">
            Private Call
          </span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden">
        {navItems.map((item: any) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPage(item.id as NadlanistPageId)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em]",
              page === item.id
                ? "border-[#f6efe3] bg-[#f6efe3] text-[#10100e]"
                : "border-white/10 bg-white/[0.04] text-white/65"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-4">
      <div
        className={cx(
          "flex w-max items-center gap-5 whitespace-nowrap",
          reverse ? "nadlanist-marquee-reverse" : "nadlanist-marquee"
        )}
      >
        {doubled.map((item, index) => (
          <React.Fragment key={`${item}-${index}`}>
            <span className="text-xl font-black uppercase tracking-[-0.04em] text-white/80 sm:text-3xl">
              {item}
            </span>
            <span className="text-[#d8b36a]">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
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
    <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
        <div className="nadlanist-fade-up relative z-10">
          <div className="mb-8 flex flex-wrap gap-3">
            {chips.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/62"
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="max-w-6xl text-[15vw] font-black uppercase leading-[0.78] tracking-[-0.12em] text-[#f6efe3] sm:text-[12vw] lg:text-[8.6vw]">
            {renderHeroTitle(hero.title)}
          </h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-xl text-lg leading-8 text-white/62">
              {hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setPage("properties")}>
                {hero.primaryButton}
              </Button>
              <Button variant="ghost" onClick={() => setPage("contact")}>
                {hero.secondaryButton}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 lg:min-h-[720px]">
          <div className="absolute left-6 top-6 z-20 rounded-full bg-[#d8b36a] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]">
            {hero.badge}
          </div>

          <div className="absolute -left-8 bottom-16 z-20 hidden rotate-[-8deg] rounded-[2rem] border border-white/10 bg-[#10100e]/85 p-4 backdrop-blur-xl sm:block">
            <div className="text-5xl font-black tracking-[-0.08em]">
              {hero.statNumber}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">
              {hero.statLabel}
            </div>
          </div>

          <div className="nadlanist-float absolute right-5 top-28 z-20 flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl">
            <span className="text-center text-[10px] font-black uppercase leading-4 tracking-[0.18em]">
              {String(hero.floatingLabel || "Book Tour")
                .split(/\s+/)
                .map((word, index) => (
                  <React.Fragment key={`${word}-${index}`}>
                    {word}
                    {index === 0 && <br />}
                  </React.Fragment>
                ))}
            </span>
            <span className="nadlanist-pulse-ring absolute inset-0 rounded-full border border-[#d8b36a]" />
          </div>

          <img
            src={hero.image || data.images.hero}
            alt={hero.imageTitle}
            className="h-full min-h-[532px] w-full rounded-[1.55rem] object-cover grayscale transition duration-700 hover:scale-[1.03] hover:grayscale-0 lg:min-h-[692px]"
          />

          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-b-[1.55rem] bg-gradient-to-t from-[#10100e] via-[#10100e]/45 to-transparent p-8">
            <div className="text-3xl font-black uppercase leading-none tracking-[-0.07em] sm:text-5xl">
              {hero.imageTitle}
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
      <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 sm:p-6">
        <div className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-white/45">
          {data.partners.eyebrow}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((item) => (
            <div
              key={item}
              className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-[#10100e]/50 text-sm font-black uppercase tracking-[0.25em] text-white/42 transition duration-500 hover:bg-white hover:text-[#10100e]"
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <div>
            <h2 className="text-[16vw] font-black uppercase leading-[0.78] tracking-[-0.12em] text-[#f6efe3] sm:text-[12vw] lg:text-[8.4vw]">
              {renderStackedTitle(data.manifesto.title)}
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="mb-8 h-16 w-16 rounded-full bg-[#d8b36a] p-4 text-center text-2xl text-[#10100e]">
              ◆
            </div>
            <p className="text-xl leading-9 text-white/66">
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="relative h-[360px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute left-5 top-5 rounded-full bg-[#f6efe3] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]">
                  0{index + 1}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-4xl font-black uppercase tracking-[-0.07em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/56">{item.text}</p>
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow={data.propertiesSection.eyebrow}
            title={renderStackedTitle(data.propertiesSection.title)}
            text={data.propertiesSection.text}
          />

          {showButton && (
            <div className="pb-3">
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
                "group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]",
                index % 2 === 1 && "lg:translate-y-16"
              )}
            >
              <div className="relative h-[470px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#10100e] via-transparent to-transparent" />

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]">
                    {item.tag}
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                    {item.location}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {safeArray(item.details, []).map((detail) => (
                      <span
                        key={detail}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-5xl font-black uppercase tracking-[-0.08em]">
                      {item.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setPage("contact")}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d8b36a] text-xl font-black text-[#10100e] transition duration-500 group-hover:rotate-[-35deg]"
                      aria-label={`Request details for ${item.title}`}
                    >
                      →
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow={data.reviewsSection.eyebrow}
          title={renderStackedTitle(data.reviewsSection.title)}
          text={data.reviewsSection.text}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="rounded-[2rem] border border-white/10 bg-[#f6efe3] p-7 text-[#10100e] transition duration-500 hover:-translate-y-2 hover:bg-[#d8b36a]"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-5xl font-black tracking-[-0.08em]">
                  {item.rating}
                </span>
                <span className="text-5xl leading-none">“</span>
              </div>

              <p className="text-xl font-semibold leading-9">{item.quote}</p>

              <div className="mt-10 border-t border-black/10 pt-5">
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 transition duration-500 hover:-translate-y-2 hover:bg-white/[0.08]"
            >
              <div className="mb-12 text-xs font-black uppercase tracking-[0.25em] text-[#d8b36a]">
                {item.step}
              </div>
              <h3 className="text-3xl font-black uppercase leading-none tracking-[-0.06em]">
                {item.title}
              </h3>
              <p className="mt-5 leading-7 text-white/56">{item.text}</p>
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.65fr_1fr]">
        <div>
          <SectionTitle
            eyebrow={data.faqSection.eyebrow}
            title={renderStackedTitle(data.faqSection.title)}
            text={data.faqSection.text}
          />
          <Button variant="ghost" onClick={() => setPage("contact")}>
            {data.faqSection.button}
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((item, index) => (
            <details
              key={`${item.q}-${index}`}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-xl font-black tracking-[-0.04em]">
                <span>
                  {index + 1}. {item.q}
                </span>
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 max-w-3xl leading-8 text-white/58">{item.a}</p>
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
    <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#f6efe3] p-6 text-[#10100e] sm:p-10 lg:p-14">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#10100e] p-6 text-[#f6efe3] sm:p-10">
          <img
            src={data.cta.image || data.images.heroAlt}
            alt={data.cta.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10100e] via-[#10100e]/50 to-transparent" />

          <div className="relative z-10 flex min-h-[460px] flex-col justify-end">
            <h2 className="max-w-6xl text-[14vw] font-black uppercase leading-[0.78] tracking-[-0.12em] sm:text-[10vw] lg:text-[7.2vw]">
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
      <Marquee items={safeArray(data.marquee, nadlanistDefaultData.marquee)} />
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3">
          <img
            src={data.about.image || data.images.portrait}
            alt={data.about.title}
            className="h-[680px] w-full rounded-[1.5rem] object-cover grayscale"
          />
        </div>

        <div>
          <Eyebrow>{data.about.eyebrow}</Eyebrow>
          <h1 className="text-[16vw] font-black uppercase leading-[0.76] tracking-[-0.12em] sm:text-[11vw] lg:text-[7.8vw]">
            {renderStackedTitle(data.about.title)}
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/62">
            {data.about.text}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1500px] gap-4 sm:grid-cols-3">
        {stats.map(([num, label]) => (
          <div
            key={label}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
          >
            <div className="text-7xl font-black tracking-[-0.1em]">{num}</div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-white/45">
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
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow={data.propertiesSection.eyebrow}
            title={renderStackedTitle(data.propertiesSection.title)}
            text={data.propertiesSection.text}
          />
        </div>
      </section>
      <Properties setPage={setPage} data={data} showButton={false} />
      <Marquee
        reverse
        items={[
          "Private Pricing",
          "Qualified Buyers",
          "Luxury Homes",
          "Market Strategy",
          "Personal Advisory",
        ]}
      />
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
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="h-[340px] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-7">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#d8b36a]">
                  {post.date}
                </div>
                <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.06em]">
                  {post.title}
                </h2>
                <p className="mt-5 leading-7 text-white/55">
                  A short article preview that can connect to your blog system
                  later.
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
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Eyebrow>{data.contact.eyebrow}</Eyebrow>
          <h1 className="text-[16vw] font-black uppercase leading-[0.76] tracking-[-0.12em] sm:text-[11vw] lg:text-[7.8vw]">
            {renderStackedTitle(data.contact.title)}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-white/62">
            {data.contact.text}
          </p>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          {[
            ["Name", "Your name"],
            ["Email", "hello@email.com"],
            ["Interest", "Buying, selling, consultation..."],
          ].map(([label, placeholder]) => (
            <label key={label} className="mb-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/45">
                {label}
              </span>
              <input
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-[#10100e] px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#d8b36a]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/45">
              Message
            </span>
            <textarea
              rows={6}
              placeholder="Tell us what you are looking for..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#10100e] px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#d8b36a]"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-[#d8b36a] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#10100e] transition hover:bg-[#f6efe3]"
          >
            {data.contact.button} →
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
    <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <button
            type="button"
            onClick={() => setPage("home")}
            className="text-5xl font-black uppercase leading-none tracking-[-0.09em] transition hover:text-[#d8b36a]"
          >
            {data.brand.name} ®
          </button>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/46">
            {data.footer.text}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {navItems.map((item: any, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as NadlanistPageId)}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/52 transition hover:border-[#d8b36a] hover:text-[#d8b36a]"
            >
              {item.label} 0{index + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={scrollTop}
            className="rounded-full bg-[#f6efe3] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]"
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