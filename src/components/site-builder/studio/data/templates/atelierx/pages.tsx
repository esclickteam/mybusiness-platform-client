import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { atelierxDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { atelierxEditorCss } from "./editorCss";

export const atelierxPages = [{ id: "home", label: "בית", slug: "/" }];

type AtelierxPagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (atelierxDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data }: { data: Record<string, any> }) {
  const navItems = [
    [getValue(data, "navLookbook"), "#lookbook"],
    [getValue(data, "navCollections"), "#collections"],
    [getValue(data, "navStory"), "#story"],
    [getValue(data, "navServices"), "#services"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-baseline gap-3 text-black">
          <span className="t-display text-3xl font-black tracking-[-0.04em]">{getValue(data, "brandName")}</span>
          <span className="h-px w-10 bg-[var(--a)]" />
        </a>
        <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.24em] text-black/55 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-[var(--a)]">{label}</a>
          ))}
        </nav>
        <a href="#contact" className="border border-black px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:border-[var(--a)] hover:bg-[var(--a)] hover:text-white">
          {getValue(data, "navContact")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative min-h-[94svh] overflow-hidden bg-black">
      <img src={getValue(data, "heroImage")} alt="" className="atelierx-hero-image absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/42 to-black/10" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/80 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[94svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 text-white lg:px-8 lg:pb-24">
        <Reveal variant="right" className="max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-white/70">{getValue(data, "heroEyebrow")}</p>
          <h1 className="atelierx-title t-display mt-5 text-7xl font-black leading-[0.8] tracking-[-0.08em] md:text-9xl lg:text-[12rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <span className="atelierx-red-rule mt-7 block h-px w-full max-w-3xl bg-[var(--a)]" />
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.6fr] md:items-end">
            <p className="max-w-2xl text-xl leading-8 text-white/80">{getValue(data, "heroSubtitle")}</p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a href="#contact" className="bg-[var(--a)] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">{getValue(data, "heroPrimaryButton")}</a>
              <a href="#lookbook" className="border border-white/45 px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">{getValue(data, "heroSecondaryButton")}</a>
            </div>
          </div>
        </Reveal>
        <p className="absolute left-5 top-28 hidden -rotate-90 text-xs font-black uppercase tracking-[0.32em] text-white/55 md:block lg:left-8">
          {getValue(data, "heroCaption")}
        </p>
      </div>
    </section>
  );
}

function Lookbook({ data }: { data: Record<string, any> }) {
  const frames = [
    [getValue(data, "lookbookOneImage"), getValue(data, "lookbookOneTitle")],
    [getValue(data, "lookbookTwoImage"), getValue(data, "lookbookTwoTitle")],
    [getValue(data, "lookbookThreeImage"), getValue(data, "lookbookThreeTitle")],
    [getValue(data, "lookbookFourImage"), getValue(data, "lookbookFourTitle")],
    [getValue(data, "lookbookFiveImage"), getValue(data, "lookbookFiveTitle")],
    [getValue(data, "lookbookSixImage"), getValue(data, "lookbookSixTitle")],
  ];

  return (
    <section id="lookbook" data-template-section-type="lookbook" className="bg-white py-24 lg:py-28">
      <div className="px-5 lg:px-8">
        <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "lookbookEyebrow")}</p>
            <h2 className="t-display mt-4 max-w-4xl text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <span className="h-1 w-36 bg-[var(--a)]" />
        </Reveal>
      </div>
      <div className="mt-12 overflow-x-auto px-5 lg:px-8">
        <div className="atelierx-film-track flex w-max gap-5 pb-4">
          {frames.map(([image, title], index) => (
            <Reveal key={title} delayMs={index * 70} variant="scale">
              <article className="group w-[260px] shrink-0 border border-black bg-white p-3 md:w-[340px]">
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img src={image} alt="" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  <span className="absolute right-3 top-3 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-black">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-black uppercase tracking-[0.28em] text-black">{title}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Collections({ data }: { data: Record<string, any> }) {
  const collections = [
    [getValue(data, "collectionOneTitle"), getValue(data, "collectionOneImage")],
    [getValue(data, "collectionTwoTitle"), getValue(data, "collectionTwoImage")],
    [getValue(data, "collectionThreeTitle"), getValue(data, "collectionThreeImage")],
    [getValue(data, "collectionFourTitle"), getValue(data, "collectionFourImage")],
  ];

  return (
    <section id="collections" data-template-section-type="collections" className="bg-black px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "collectionsEyebrow")}</p>
          <h2 className="t-display mt-4 max-w-4xl text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{getValue(data, "sectionThreeTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map(([title, image], index) => (
            <Reveal key={title} delayMs={index * 90} variant={index % 2 === 0 ? "right" : "left"}>
              <article className="group relative aspect-square overflow-hidden bg-white">
                <img src={image} alt="" className="h-full w-full object-cover opacity-80 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <h3 className="t-display absolute bottom-6 right-6 max-w-[80%] text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{title}</h3>
                <span className="absolute left-6 top-6 h-20 w-px bg-[var(--a)]" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrivalMarquee({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="drop" className="overflow-hidden bg-white py-16">
      <div className="atelierx-marquee border-y border-black py-4">
        <div className="atelierx-marquee-track flex w-max gap-10 text-5xl font-black uppercase leading-none tracking-[-0.05em] md:text-7xl">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>{getValue(data, "marqueeText")}</span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-16 grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.68fr_1.32fr] lg:px-8 lg:items-end">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "dropEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <p className="border-r-4 border-[var(--a)] pr-6 text-2xl font-black leading-10 text-black md:text-4xl">{getValue(data, "sectionFourText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function EditorialStory({ data }: { data: Record<string, any> }) {
  const stories = [
    [getValue(data, "storyOneTitle"), getValue(data, "storyOneText"), getValue(data, "storyOneImage")],
    [getValue(data, "storyTwoTitle"), getValue(data, "storyTwoText"), getValue(data, "storyTwoImage")],
  ];

  return (
    <section id="story" data-template-section-type="story" className="bg-[#F7F7F7] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "storyEyebrow")}</p>
          <h2 className="t-display mt-4 max-w-5xl text-5xl font-black leading-none tracking-[-0.06em] md:text-8xl">{getValue(data, "sectionFiveTitle")}</h2>
        </Reveal>
        <div className="space-y-16">
          {stories.map(([title, text, image], index) => (
            <Reveal key={title} variant={index === 0 ? "right" : "left"}>
              <article className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative">
                  <img src={image} alt="" className="aspect-[5/4] w-full object-cover grayscale" />
                  <span className="absolute -bottom-5 right-8 bg-[var(--a)] px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white">story 0{index + 1}</span>
                </div>
                <div className="bg-white p-8 md:p-12">
                  <h3 className="t-display text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{title}</h3>
                  <p className="mt-8 max-w-xl text-xl font-semibold leading-9 text-black/70">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesList({ data }: { data: Record<string, any> }) {
  const rows = [
    [getValue(data, "sizeServiceOneTitle"), getValue(data, "sizeServiceOneText")],
    [getValue(data, "sizeServiceTwoTitle"), getValue(data, "sizeServiceTwoText")],
    [getValue(data, "sizeServiceThreeTitle"), getValue(data, "sizeServiceThreeText")],
    [getValue(data, "sizeServiceFourTitle"), getValue(data, "sizeServiceFourText")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "serviceEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="border-t border-black">
          {rows.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 80} variant="up">
              <div className="grid gap-5 border-b border-black py-7 md:grid-cols-[0.2fr_0.42fr_1fr] md:items-baseline">
                <span className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">0{index + 1}</span>
                <h3 className="t-display text-4xl font-black tracking-[-0.06em] md:text-6xl">{title}</h3>
                <p className="text-xl font-semibold leading-8 text-black/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Press({ data }: { data: Record<string, any> }) {
  const quotes = [
    [getValue(data, "pressOneQuote"), getValue(data, "pressOneName")],
    [getValue(data, "pressTwoQuote"), getValue(data, "pressTwoName")],
    [getValue(data, "pressThreeQuote"), getValue(data, "pressThreeName")],
  ];

  return (
    <section data-template-section-type="press" className="bg-black px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "pressEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">{getValue(data, "sectionSevenTitle")}</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {quotes.map(([quote, name], index) => (
            <Reveal key={name} delayMs={index * 100} variant="scale">
              <blockquote className="h-full border border-white/22 p-8">
                <span className="block h-1 w-16 bg-[var(--a)]" />
                <p className="mt-8 text-2xl font-black leading-10">"{quote}"</p>
                <footer className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-white/55">{name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section id="contact" data-template-section-type="contact" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-4 text-6xl font-black leading-none tracking-[-0.07em] md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-7 max-w-xl text-xl font-semibold leading-9 text-black/65">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-black uppercase tracking-[0.16em] text-black">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="border border-black p-6 md:p-8" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="atelierx-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <div className="grid gap-4 md:grid-cols-2">
              <input aria-label="שם מלא" className="border-b border-black bg-transparent px-0 py-4 text-sm font-bold outline-none focus:border-[var(--a)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              <input aria-label="טלפון" className="border-b border-black bg-transparent px-0 py-4 text-sm font-bold outline-none focus:border-[var(--a)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input aria-label="מידה" className="border-b border-black bg-transparent px-0 py-4 text-sm font-bold outline-none focus:border-[var(--a)]" placeholder="מידה"  name="other" data-bizuply-form-field-id="other" />
              <input aria-label="מועד רצוי" className="border-b border-black bg-transparent px-0 py-4 text-sm font-bold outline-none focus:border-[var(--a)]" placeholder="מועד רצוי"  name="other_2" data-bizuply-form-field-id="other_2" />
            </div>
            <textarea aria-label="מה מחפשים" className="mt-6 min-h-36 w-full border-b border-black bg-transparent px-0 py-4 text-sm font-bold outline-none focus:border-[var(--a)]" placeholder="מה תרצו למדוד או לאיזה אירוע?"  name="other_3" data-bizuply-form-field-id="other_3"></textarea>
            <button type="submit" className="mt-8 w-full bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-[var(--a)]">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-template-section-type="footer" className="bg-black text-white">
      <div className="h-2 bg-[var(--a)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <h2 className="t-display text-7xl font-black leading-none tracking-[-0.08em] md:text-9xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-white/62">{getValue(data, "ctaText")}</p>
        </div>
        <a href="#contact" className="border border-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-[var(--a)] hover:bg-[var(--a)]">
          {getValue(data, "ctaButton")}
        </a>
      </div>
    </footer>
  );
}

export default function AtelierxPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: AtelierxPagesProps) {
  const mergedData = useMemo(() => ({ ...atelierxDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id="atelierx" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: atelierxEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: (
        <>
          <Header data={mergedData} />
          <Hero data={mergedData} />
          <Lookbook data={mergedData} />
          <Collections data={mergedData} />
          <ArrivalMarquee data={mergedData} />
          <EditorialStory data={mergedData} />
          <ServicesList data={mergedData} />
          <Press data={mergedData} />
          <Contact data={mergedData} />
          <Footer data={mergedData} />
        </>
      ) }]} />
    </div>
  );
}
