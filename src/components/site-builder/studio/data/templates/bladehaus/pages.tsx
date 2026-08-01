import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { bladehausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { bladehausEditorCss } from "./editorCss";

export const bladehausPages = [{ id: "home", label: "בית", slug: "/" }];

type BladehausPagesProps = {
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
  return data?.[key] ?? (bladehausDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50 border-b-2 border-[var(--a)] bg-[#111]/95"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 py-4 lg:px-8">
        <nav className="hidden justify-start gap-7 text-xs font-bold uppercase tracking-[0.24em] text-white/70 lg:flex">
          <a href="#bladehaus-services" className="hover:text-[var(--a)]">{getValue(data, "navServices")}</a>
          <a href="#bladehaus-team" className="hover:text-[var(--a)]">{getValue(data, "navAbout")}</a>
        </nav>
        <div className="flex items-center justify-center gap-3">
          <span className="bh-mark grid h-11 w-11 place-items-center text-xl font-bold">{getValue(data, "logoText")}</span>
          <span className="t-display text-2xl sm:text-4xl leading-none tracking-wide text-white">{getValue(data, "brandName")}</span>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={openModal} className="bh-outline px-5 py-2.5 text-xs font-bold uppercase tracking-[0.22em]">
            {getValue(data, "heroPrimaryButton")}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[#050505]">
      <img src={getValue(data, "heroImage")} alt="" className="bh-hero-image absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#111_0%,rgba(17,17,17,0.82)_34%,rgba(17,17,17,0.18)_72%),linear-gradient(180deg,rgba(0,0,0,0.25),#111_95%)]" />
      <div className="bh-crosshair absolute left-8 top-28 hidden h-[70vh] w-px bg-[var(--a)]/45 lg:block" />
      <Reveal className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 lg:px-8" variant="right">
        <p className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--a)]">{getValue(data, "heroEyebrow")}</p>
        <h1 className="t-display bh-hero-type mt-4 max-w-6xl whitespace-pre-line text-[24vw] leading-[0.72] tracking-wide text-white md:text-[17vw] lg:text-[13rem]">
          {getValue(data, "heroTitle")}
        </h1>
        <div className="mt-8 grid gap-6 border-y border-white/20 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="max-w-2xl text-lg font-medium leading-8 text-white/72">{getValue(data, "heroSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-[0.22em] text-black transition hover:bg-[var(--a)]">
              {getValue(data, "heroPrimaryButton")}
            </button>
            <a href="#bladehaus-services" className="bg-[var(--a)] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.22em] text-black transition hover:bg-white">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "serviceOnePrice")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "serviceTwoPrice")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "serviceThreePrice")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText"), getValue(data, "serviceFourPrice")],
  ];

  return (
    <section id="bladehaus-services" data-template-section-type="services" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 border-b border-[var(--a)] pb-8 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-[var(--a)]">{getValue(data, "servicesEyebrow")}</p>
            <h2 className="t-display mt-3 text-7xl leading-none text-white md:text-8xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-2xl text-xl font-semibold uppercase leading-8 tracking-wide text-white/72">{getValue(data, "servicesIntro")}</p>
        </Reveal>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, text, price], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="bh-price-panel t-card group flex min-h-[310px] flex-col justify-between border border-white/20 bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="t-display text-3xl md:text-6xl leading-none text-white/20">0{index + 1}</span>
                  <span className="bh-chrome px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">Chrome</span>
                </div>
                <div>
                  <h3 className="t-display text-2xl md:text-5xl leading-none text-white">{title}</h3>
                  <p className="mt-4 min-h-[56px] text-sm font-medium leading-6 text-white/58">{text}</p>
                </div>
                <div className="mt-7 flex items-end justify-between border-t border-white/15 pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">מחיר</span>
                  <span className="t-display text-3xl md:text-6xl leading-none text-[var(--a)]">{price}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const team = [
    [getValue(data, "barberOneName"), getValue(data, "barberOneRole"), getValue(data, "barberOneImage")],
    [getValue(data, "barberTwoName"), getValue(data, "barberTwoRole"), getValue(data, "barberTwoImage")],
    [getValue(data, "barberThreeName"), getValue(data, "barberThreeRole"), getValue(data, "barberThreeImage")],
  ];

  return (
    <section id="bladehaus-team" data-template-section-type="team" className="bg-[#080808] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-[var(--a)]">{getValue(data, "teamEyebrow")}</p>
            <h2 className="t-display mt-3 text-7xl leading-none text-white md:text-8xl">{getValue(data, "sectionThreeTitle")}</h2>
          </div>
          <p className="max-w-md text-sm font-semibold uppercase leading-7 tracking-wide text-white/55">{getValue(data, "teamText")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {team.map(([name, role, image], index) => (
            <Reveal key={name} delayMs={index * 120} variant={index === 1 ? "scale" : "up"}>
              <article className="bh-strip group relative min-h-[640px] overflow-hidden border border-white/15">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
                <div className="absolute bottom-0 right-0 w-full border-t-2 border-[var(--a)] bg-[var(--a)] px-6 py-5 text-black">
                  <span className="text-xs font-black uppercase tracking-[0.28em]">0{index + 1}</span>
                  <h3 className="t-display mt-1 text-2xl md:text-5xl leading-none">{name}</h3>
                  <p className="font-bold uppercase tracking-[0.18em]">{role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceMarquee({ data }: { data: Record<string, any> }) {
  const words = [
    getValue(data, "marqueeOne"),
    getValue(data, "marqueeTwo"),
    getValue(data, "marqueeThree"),
    getValue(data, "marqueeFour"),
    getValue(data, "marqueeFive"),
  ];
  const loop = [...words, ...words, ...words];

  return (
    <section data-template-section-type="marquee" className="overflow-hidden border-y-2 border-[var(--a)] bg-[var(--a)] py-4 text-black">
      <Reveal variant="fade">
        <div className="bh-marquee flex w-max items-center gap-6">
          {loop.map((word, index) => (
            <React.Fragment key={`${word}-${index}`}>
              <span className="t-display text-6xl leading-none tracking-wide md:text-8xl">{word}</span>
              <span className="h-3 w-3 bg-black" />
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const images = [
    [getValue(data, "galleryOneImage"), getValue(data, "galleryOneTitle")],
    [getValue(data, "galleryTwoImage"), getValue(data, "galleryTwoTitle")],
    [getValue(data, "galleryThreeImage"), getValue(data, "galleryThreeTitle")],
  ];

  return (
    <section data-template-section-type="gallery" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end">
          <h2 className="t-display text-7xl leading-none text-white md:text-8xl">{getValue(data, "sectionFiveTitle")}</h2>
          <p className="max-w-xl justify-self-end text-sm font-semibold uppercase leading-7 tracking-wide text-white/55">{getValue(data, "galleryText")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {images.map(([src, title], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <figure className="bh-gallery-column group relative h-[680px] overflow-hidden border border-white/15">
                <img src={src} alt="" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <figcaption className="absolute inset-x-0 top-0 border-b border-[var(--a)] bg-black/75 px-5 py-4 text-xs font-black uppercase tracking-[0.3em] text-[var(--a)] backdrop-blur">
                  {title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hours({ data }: { data: Record<string, any> }) {
  const hours = [
    [getValue(data, "hoursOneDays"), getValue(data, "hoursOneTime")],
    [getValue(data, "hoursTwoDays"), getValue(data, "hoursTwoTime")],
    [getValue(data, "hoursThreeDays"), getValue(data, "hoursThreeTime")],
  ];

  return (
    <section data-template-section-type="hours" className="bg-white px-5 py-24 text-black lg:px-8 lg:py-32">
      <Reveal className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-[var(--a)]">{getValue(data, "hoursEyebrow")}</p>
        <h2 className="t-display mt-3 text-8xl leading-none md:text-[11rem]">{getValue(data, "sectionSevenTitle")}</h2>
        <div className="mt-10 border-y-4 border-black">
          {hours.map(([days, time]) => (
            <div key={days} className="grid gap-3 border-b-2 border-black py-6 last:border-b-0 md:grid-cols-[1fr_auto] md:items-end">
              <span className="t-display text-6xl leading-none md:text-8xl">{days}</span>
              <span className="t-display text-6xl leading-none text-[var(--a)] md:text-8xl">{time}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Reviews({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName")],
    [getValue(data, "reviewFourText"), getValue(data, "reviewFourName")],
  ];

  return (
    <section data-template-section-type="reviews" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="border-b border-white/20 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-[var(--a)]">{getValue(data, "reviewsEyebrow")}</p>
          <h2 className="t-display mt-3 text-7xl leading-none text-white md:text-8xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map(([quote, name], index) => (
            <Reveal key={name} delayMs={index * 80} variant={index % 2 ? "left" : "right"}>
              <blockquote className="bh-review t-card flex aspect-square flex-col justify-between border border-white/15 bg-[var(--surface)] p-6">
                <span className="t-display text-3xl md:text-7xl leading-none text-[var(--a)]">"</span>
                <p className="text-2xl font-black uppercase leading-8 tracking-wide text-white">{quote}</p>
                <footer className="border-t border-white/15 pt-4 text-xs font-bold uppercase tracking-[0.24em] text-white/55">{name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="bladehaus-booking" data-template-section-type="booking" className="bg-[#070707] px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-[var(--a)]">{getValue(data, "bookingEyebrow")}</p>
          <h2 className="t-display mt-3 text-7xl leading-none text-white md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <a href={`tel:${getValue(data, "phone")}`} className="t-display mt-8 block break-words text-[17vw] leading-[0.8] text-[var(--a)] md:text-[8rem]">
            {getValue(data, "phone")}
          </a>
          <p className="mt-6 max-w-lg text-sm font-semibold uppercase leading-7 tracking-wide text-white/58">{getValue(data, "contactText")}</p>
        </div>
        <form className="grid gap-4 border-2 border-[var(--a)] bg-black p-6 md:p-9" data-bizuply-block="lead-form" data-bizuply-form-id="bladehaus-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/20 bg-[#111] px-5 py-4 text-right font-bold uppercase tracking-wide text-white outline-none focus:border-[var(--a)]" placeholder="שם מלא" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/20 bg-[#111] px-5 py-4 text-right font-bold uppercase tracking-wide text-white outline-none focus:border-[var(--a)]" placeholder="טלפון" />
          </div>
          <input name="service" data-bizuply-form-field-id="service"  className="border border-white/20 bg-[#111] px-5 py-4 text-right font-bold uppercase tracking-wide text-white outline-none focus:border-[var(--a)]" placeholder="שירות מבוקש" />
          <textarea name="message" data-bizuply-form-field-id="message"  className="min-h-[150px] border border-white/20 bg-[#111] px-5 py-4 text-right font-bold uppercase tracking-wide text-white outline-none focus:border-[var(--a)]" placeholder="יום ושעה מועדפים" />
          <button type="button" onClick={openModal} className="bg-[var(--a)] px-8 py-5 text-sm font-black uppercase tracking-[0.28em] text-black transition hover:bg-white">
            {getValue(data, "contactButton")}
          </button>
        </form>
      </Reveal>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-black px-5 pb-10 pt-12 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border-2 border-[var(--a)] p-8 text-center md:p-14" variant="scale">
        <p className="text-xs font-black uppercase tracking-[0.5em] text-[var(--a)]">{getValue(data, "footerEyebrow")}</p>
        <h2 className="t-display mx-auto mt-4 max-w-5xl text-7xl leading-none text-white md:text-9xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-6 max-w-xl text-sm font-semibold uppercase leading-7 tracking-wide text-white/58">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-9 border-2 border-[var(--a)] px-10 py-4 text-sm font-black uppercase tracking-[0.28em] text-[var(--a)] transition hover:bg-[var(--a)] hover:text-black">
          {getValue(data, "ctaButton")}
        </button>
      </Reveal>
      <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.25em] text-white/35">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border-2 border-[var(--a)] bg-black p-8">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl font-black text-[var(--a)]">x</button>
        <h3 className="t-display text-3xl md:text-6xl leading-none text-white">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-form-id="bladehaus-contact-2" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/20 bg-[#111] px-5 py-4 text-right font-bold text-white outline-none focus:border-[var(--a)]" placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/20 bg-[#111] px-5 py-4 text-right font-bold text-white outline-none focus:border-[var(--a)]" placeholder="טלפון" />
          <button type="submit" className="bg-[var(--a)] py-4 text-sm font-black uppercase tracking-[0.26em] text-black">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Services data={data} />
      <Team data={data} />
      <ServiceMarquee data={data} />
      <Gallery data={data} />
      <Hours data={data} />
      <Reviews data={data} />
      <Booking data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function BladehausPages(props: BladehausPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...bladehausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "bladehaus-preview" : "bladehaus"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: bladehausEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
