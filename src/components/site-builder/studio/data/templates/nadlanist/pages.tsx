import React, { useEffect, useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85";

function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.src = FALLBACK_IMAGE;
}

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

function renderStackedTitle(title: string) {
  return String(title || "");
}

function renderHeroTitle(title: string) {
  return String(title || "");
}

function NadlanistStyle() {
  return (
    <style>{`
      @keyframes nadlanist-fade-up {
        from { opacity: 0; transform: translate3d(0, 24px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes nadlanist-float {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
        50% { transform: translate3d(0, -12px, 0) rotate(2deg); }
      }

      @keyframes nadlanist-pulse-ring {
        0% { transform: scale(.92); opacity: .5; }
        70% { transform: scale(1.13); opacity: .06; }
        100% { transform: scale(.92); opacity: 0; }
      }

      .nadlanist-fade-up {
        animation: nadlanist-fade-up .7s cubic-bezier(.2,.75,.2,1) both;
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
  variant?: "gold" | "ghost" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center rounded-full px-6 py-4 text-[12px] font-black uppercase tracking-[0.16em] transition-all duration-500",
        variant === "gold" &&
          "bg-[#c9a85f] text-[#071426] shadow-lg shadow-[#c9a85f]/20 hover:bg-[#e0bf78]",
        variant === "ghost" &&
          "border border-white/14 bg-white/[0.04] text-white hover:border-[#c9a85f]/70 hover:bg-white/10",
        variant === "dark" &&
          "bg-[#071426] text-white hover:bg-[#10243e]",
      )}
    >
      <span>{children}</span>
      <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-1">
        ←
      </span>
    </button>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/68">
      <span className="text-[#c9a85f]">✦</span>
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
    <div className="mb-11 max-w-none text-right">
      <Eyebrow>{eyebrow}</Eyebrow>

      <h2 className="whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.6rem)] font-black uppercase leading-[1.08] tracking-[-0.04em] text-white">
        {title}
      </h2>

      {text && (
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
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
        "min-h-screen bg-[#06101f] text-white",
        "selection:bg-[#c9a85f] selection:text-[#071426]",
        isPreview && "h-full overflow-y-auto",
      )}
    >
      <NadlanistStyle />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
        <div className="absolute right-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#c9a85f]/10 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#2f6fb3]/10 blur-3xl" />
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
    nadlanistDefaultData.navigation,
  ).filter((item: any) =>
    nadlanistPages.some((pageItem) => pageItem.id === item.id),
  );

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b border-white/10 bg-[#06101f]/84 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white text-[#071426]">
            <span className="absolute inset-0 bg-[#c9a85f] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative text-sm font-black tracking-[-0.08em]">
              {data.brand.logo}
            </span>
          </span>

          <span className="text-sm font-black uppercase tracking-[0.28em] text-white">
            {data.brand.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm shadow-black/10 lg:flex">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id as NadlanistPageId)}
              className={cx(
                "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300",
                page === item.id
                  ? "bg-white text-[#071426]"
                  : "text-white/58 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPage("contact")}
          className="rounded-full bg-[#c9a85f] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071426] transition hover:bg-white"
        >
          שיחה פרטית
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden">
        {navItems.map((item: any) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPage(item.id as NadlanistPageId)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em]",
              page === item.id
                ? "border-white bg-white text-[#071426]"
                : "border-white/10 bg-white/[0.05] text-white/65",
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
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a182c] p-4 shadow-2xl shadow-black/35 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[500px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#06101f] p-3 lg:min-h-[620px]">
            <div className="absolute right-6 top-6 z-20 rounded-full bg-[#c9a85f] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#071426]">
              {hero.badge}
            </div>

            <div className="absolute -right-5 bottom-14 z-20 hidden rotate-[5deg] rounded-[1.6rem] border border-white/10 bg-[#06101f]/82 p-4 text-white backdrop-blur-xl sm:block">
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
              <span className="nadlanist-pulse-ring absolute inset-0 rounded-full border border-[#c9a85f]" />
            </div>

            <img
              src={hero.image || data.images.hero || FALLBACK_IMAGE}
              alt={hero.imageTitle}
              onError={handleImageError}
              className="h-full min-h-[476px] w-full rounded-[1.25rem] object-cover object-center grayscale transition duration-700 hover:scale-[1.03] hover:grayscale-0 lg:min-h-[596px]"
            />

            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-b-[1.25rem] bg-gradient-to-t from-[#06101f]/90 via-[#06101f]/34 to-transparent p-7">
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
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/62"
                >
                  {item}
                </span>
              ))}
            </div>

            <h1 className="max-w-none whitespace-nowrap text-[clamp(2.2rem,4.2vw,4.8rem)] font-black uppercase leading-[1.08] tracking-[-0.04em] text-white">
              {renderHeroTitle(hero.title)}
            </h1>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <p className="max-w-xl text-base leading-8 text-white/62 sm:text-lg">
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
    nadlanistDefaultData.partners.items,
  );

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-white/10 bg-[#0a182c] p-4 shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5 text-right text-xs font-black uppercase tracking-[0.22em] text-white/45">
          {data.partners.eyebrow}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((item) => (
            <div
              key={item}
              className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-[#06101f] text-sm font-black uppercase tracking-[0.14em] text-white/50 transition duration-500 hover:bg-[#c9a85f] hover:text-[#071426]"
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
            <h2 className="max-w-none whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.6rem)] font-black uppercase leading-[1.08] tracking-[-0.04em] text-white">
              {renderStackedTitle(data.manifesto.title)}
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0a182c] p-6 text-right shadow-xl shadow-black/20 sm:p-8">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a85f] text-xl text-[#071426]">
              ◆
            </div>
            <p className="text-lg leading-9 text-white/64">
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
    <section className="bg-[#081529] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a182c] text-right shadow-xl shadow-black/20"
            >
              <div className="relative h-[320px] overflow-hidden">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#071426]">
                  0{index + 1}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-black uppercase tracking-[-0.06em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/58">{item.text}</p>
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
    nadlanistDefaultData.properties,
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
                "group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a182c] shadow-xl shadow-black/20",
                index % 2 === 1 && "lg:translate-y-8",
              )}
            >
              <div className="relative h-[430px] overflow-hidden">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06101f]/82 via-[#06101f]/10 to-transparent" />

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#071426]">
                    {item.tag}
                  </span>
                  <span className="rounded-full border border-white/25 bg-[#06101f]/35 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white backdrop-blur">
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
                    <h3 className="whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.4rem)] font-black uppercase leading-[1.05] tracking-[-0.04em] text-white">
                      {item.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setPage("contact")}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c9a85f] text-xl font-black text-[#071426] transition duration-500 group-hover:rotate-[35deg]"
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
    <section className="bg-[#081529] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
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
              className="rounded-[2rem] border border-white/10 bg-[#0a182c] p-7 text-right text-white transition duration-500 hover:-translate-y-2 hover:border-[#c9a85f]/60"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-4xl font-black tracking-[-0.08em] text-[#c9a85f]">
                  {item.rating}
                </span>
                <span className="text-5xl leading-none text-white/40">“</span>
              </div>
              <p className="text-lg font-semibold leading-8 text-white/78">
                {item.quote}
              </p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="font-black uppercase tracking-[-0.03em]">
                  {item.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-white/45">
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
              className="rounded-[2rem] border border-white/10 bg-[#0a182c] p-7 text-right shadow-xl shadow-black/20 transition duration-500 hover:-translate-y-2 hover:border-[#c9a85f]/50"
            >
              <div className="mb-10 text-xs font-black uppercase tracking-[0.22em] text-[#c9a85f]">
                {item.step}
              </div>
              <h3 className="whitespace-nowrap text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-white">
                {item.title}
              </h3>
              <p className="mt-5 leading-7 text-white/58">{item.text}</p>
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
    <section className="bg-[#081529] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
              className="group rounded-[1.5rem] border border-white/10 bg-[#0a182c] p-6 shadow-sm shadow-black/10"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black tracking-[-0.03em] text-white">
                <span>
                  {index + 1}. {item.q}
                </span>
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 max-w-3xl leading-8 text-white/58">
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
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#0a182c] p-5 text-white shadow-2xl shadow-black/25 sm:p-8">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] p-6 text-right sm:p-10">
          <img
            src={data.cta.image || data.images.heroAlt || FALLBACK_IMAGE}
            alt={data.cta.title}
            onError={handleImageError}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-62 grayscale transition duration-700 hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06101f]/92 via-[#06101f]/46 to-transparent" />

          <div className="relative z-10 flex min-h-[360px] flex-col justify-end">
            <h2 className="max-w-none whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.6rem)] font-black uppercase leading-[1.08] tracking-[-0.04em]">
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
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a182c] p-3 shadow-xl shadow-black/20">
          <img
            src={data.about.image || data.images.portrait || FALLBACK_IMAGE}
            alt={data.about.title}
            onError={handleImageError}
            className="h-[560px] w-full rounded-[1.5rem] object-cover object-center grayscale transition duration-700 hover:grayscale-0"
          />
        </div>

        <div className="text-right">
          <Eyebrow>{data.about.eyebrow}</Eyebrow>
          <h1 className="max-w-none whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.6rem)] font-black uppercase leading-[1.08] tracking-[-0.04em] text-white">
            {renderStackedTitle(data.about.title)}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-9 text-white/62">
            {data.about.text}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1500px] gap-4 sm:grid-cols-3">
        {stats.map(([num, label]) => (
          <div
            key={label}
            className="rounded-[2rem] border border-white/10 bg-[#0a182c] p-8 text-right shadow-xl shadow-black/20"
          >
            <div className="text-6xl font-black tracking-[-0.1em] text-white">
              {num}
            </div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/45">
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
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a182c] text-right shadow-xl shadow-black/20"
            >
              <div className="h-[320px] overflow-hidden">
                <img
                  src={post.image || FALLBACK_IMAGE}
                  alt={post.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
              </div>
              <div className="p-7">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#c9a85f]">
                  {post.date}
                </div>
                <h2 className="whitespace-nowrap text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-white">
                  {post.title}
                </h2>
                <p className="mt-5 leading-7 text-white/55">
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

          <h1 className="max-w-none whitespace-nowrap text-[clamp(1.9rem,3.1vw,3.6rem)] font-black uppercase leading-[1.08] tracking-[-0.04em] text-white">
            {renderStackedTitle(data.contact.title)}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-white/62">
            {data.contact.text}
          </p>
        </div>

        <form
          dir="rtl"
          className="rounded-[2rem] border border-white/10 bg-[#0a182c] p-6 text-right shadow-xl shadow-black/20 sm:p-8"
        >
          {[
            ["שם", "השם שלך"],
            ["אימייל", "hello@email.com"],
            ["עניין", "קנייה, מכירה, ייעוץ..."],
          ].map(([label, placeholder]) => (
            <label key={label} className="mb-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-white/45">
                {label}
              </span>
              <input
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-[#06101f] px-5 py-4 text-right text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a85f]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-white/45">
              הודעה
            </span>
            <textarea
              rows={5}
              placeholder="ספרו בקצרה מה אתם מחפשים..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#06101f] px-5 py-4 text-right text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a85f]"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-[#c9a85f] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#071426] transition hover:bg-white"
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
    nadlanistDefaultData.navigation,
  ).filter((item: any) =>
    nadlanistPages.some((pageItem) => pageItem.id === item.id),
  );

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#030914] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="text-right">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="text-4xl font-black uppercase leading-none tracking-[-0.08em] text-white transition hover:text-[#c9a85f]"
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
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/52 transition hover:border-[#c9a85f] hover:text-[#c9a85f]"
            >
              {item.label} 0{index + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={scrollTop}
            className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#071426]"
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
    getSafePage(initialPage),
  );

  const resolvedData = useMemo(
    () => mergeNadlanistData(defaultData, templateData, siteData, content, data),
    [content, data, defaultData, siteData, templateData],
  );

  useEffect(() => {
    setPageState(getSafePage(initialPage));
  }, [initialPage]);

  const setPage = useMemo(
    () => (nextPage: NadlanistPageId) => {
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
            content: <HomePage setPage={setPage} data={resolvedData} />,
          },
          { id: "about", content: <AboutPage data={resolvedData} /> },
          {
            id: "properties",
            content: (
              <PropertiesPage setPage={setPage} data={resolvedData} />
            ),
          },
          {
            id: "services",
            content: <ServicesPage setPage={setPage} data={resolvedData} />,
          },
          { id: "blog", content: <BlogPage data={resolvedData} /> },
          { id: "contact", content: <ContactPage data={resolvedData} /> },
        ]}
      />
    </Shell>
  );
}