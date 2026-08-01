import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { lenscraftDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { lenscraftEditorCss } from "./editorCss";

export const lenscraftPages = [{ id: "home", label: "בית", slug: "/" }];

type LenscraftPagesProps = {
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
  return data?.[key] ?? (lenscraftDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-white">
          <span className="grid h-9 w-9 place-items-center border border-[var(--p)] text-xs font-bold text-[var(--p)]">{getValue(data, "logoText")}</span>
          <span className="text-xl font-bold tracking-[-0.04em]">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 md:flex">
          <a href="#services" className="transition hover:text-[var(--p)]">{getValue(data, "navServices")}</a>
          <a href="#gallery" className="transition hover:text-[var(--p)]">גלריה</a>
          <a href="#packages" className="transition hover:text-[var(--p)]">חבילות</a>
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] px-5 py-2.5 text-sm font-bold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="lc-hero-image absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-px bg-[var(--p)]" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pt-24 lg:px-8" style={{ direction: "ltr" }}>
        <Reveal variant="right" className="w-full max-w-2xl" delayMs={80}>
          <div dir="rtl" className="border-r-2 border-[var(--p)] pr-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="mt-5 whitespace-pre-line text-5xl font-bold leading-[0.94] tracking-[-0.08em] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-white transition hover:bg-[var(--a)]">{getValue(data, "heroPrimaryButton")}</button>
              <a href="#gallery" className="border border-white/25 px-8 py-4 text-sm font-bold text-white transition hover:border-[var(--p)] hover:text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesFilmstrip({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "serviceOneImage")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "serviceTwoImage")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "serviceThreeImage")],
    [getValue(data, "itemFourTitle"), getValue(data, "itemFourText"), getValue(data, "serviceFourImage")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-[var(--bg)] px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">filmstrip</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/58">{getValue(data, "sectionTwoText")}</p>
        </Reveal>
        <div className="lc-filmstrip mt-12 flex snap-x gap-5 overflow-x-auto border-y border-white/10 py-6">
          {services.map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 90} variant="scale" className="min-w-[250px] snap-start md:min-w-[320px]">
              <article className="group relative aspect-square overflow-hidden border border-white/14 bg-[var(--surface)]">
                <img src={image} alt="" className="h-full w-full object-cover opacity-72 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-xs font-bold text-[var(--p)]">0{index + 1}</span>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.05em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedGallery({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "gallerySmallOne"),
    getValue(data, "gallerySmallTwo"),
    getValue(data, "gallerySmallThree"),
    getValue(data, "gallerySmallFour"),
  ];

  return (
    <section id="gallery" data-template-section-type="gallery" className="bg-[var(--surface)] px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">selected frames</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "sectionThreeTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal variant="right" className="min-h-[420px] overflow-hidden border border-white/12 lg:min-h-[680px]">
            <img src={getValue(data, "galleryLargeImage")} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Reveal key={image} variant="scale" delayMs={index * 80}>
                <div className="group aspect-square overflow-hidden border border-white/12">
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Packages({ data }: { data: Record<string, any> }) {
  const packages = [
    [getValue(data, "packageOneTitle"), getValue(data, "packageOnePrice"), getValue(data, "packageOneText")],
    [getValue(data, "packageTwoTitle"), getValue(data, "packageTwoPrice"), getValue(data, "packageTwoText")],
    [getValue(data, "packageThreeTitle"), getValue(data, "packageThreePrice"), getValue(data, "packageThreeText")],
  ];

  return (
    <section id="packages" data-template-section-type="packages" className="bg-[var(--bg)] px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "sectionFourTitle")}</h2>
          <p className="max-w-md text-sm leading-7 text-white/58">{getValue(data, "sectionFourText")}</p>
        </Reveal>
        <div className="mt-12 space-y-5">
          {packages.map(([title, price, text], index) => (
            <Reveal key={title} delayMs={index * 90} variant="left">
              <article className="lc-package-strip grid gap-5 border border-white/12 bg-black px-5 py-6 md:grid-cols-[0.5fr_1fr_0.38fr] md:items-center md:px-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--p)]">0{index + 1}</span>
                  <h3 className="text-2xl font-bold tracking-[-0.05em]">{title}</h3>
                </div>
                <p className="border-y border-dashed border-white/14 py-4 text-sm leading-7 text-white/64 md:border-x md:border-y-0 md:px-8 md:py-0">{text}</p>
                <div className="text-left">
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-white/42">starting</span>
                  <strong className="text-3xl text-[var(--p)]">{price}</strong>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section data-template-section-type="process" className="bg-[var(--surface)] px-5 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "sectionFiveTitle")}</h2>
        </Reveal>
        <div className="mt-12 flex overflow-x-auto border-y border-white/10">
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 80} className="min-w-[250px] flex-1">
              <article className="relative h-full px-5 py-8 md:px-7">
                {index < steps.length - 1 ? <span className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-[var(--p)] lg:block" /> : null}
                <div className="text-2xl md:text-5xl font-bold tracking-[-0.08em] text-[var(--p)]">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsMarquee({ data }: { data: Record<string, any> }) {
  const clients = [
    getValue(data, "clientOne"),
    getValue(data, "clientTwo"),
    getValue(data, "clientThree"),
    getValue(data, "clientFour"),
    getValue(data, "clientFive"),
    getValue(data, "clientSix"),
  ];
  const loop = [...clients, ...clients];

  return (
    <section data-template-section-type="clients" className="overflow-hidden border-y border-white/10 bg-[var(--bg)] py-12 text-white">
      <Reveal className="mb-8 px-5 lg:px-8">
        <h2 className="mx-auto max-w-7xl text-3xl font-bold tracking-[-0.05em]">{getValue(data, "sectionSixTitle")}</h2>
      </Reveal>
      <div className="lc-marquee flex w-max gap-4">
        {loop.map((client, index) => (
          <div key={`${client}-${index}`} className="flex min-w-[220px] items-center justify-center border border-white/12 bg-[var(--surface)] px-8 py-5 text-center text-lg font-bold text-white/76">
            <span className="ml-3 h-2 w-2 bg-[var(--p)]" />
            {client}
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole"), getValue(data, "reviewOneImage")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole"), getValue(data, "reviewTwoImage")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole"), getValue(data, "reviewThreeImage")],
  ];

  return (
    <section data-template-section-type="testimonials" className="bg-[var(--surface)] px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "sectionSevenTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1fr_0.82fr] lg:items-start">
          {reviews.map(([text, name, role, image], index) => (
            <Reveal key={name} delayMs={index * 100} variant={index === 1 ? "scale" : "up"}>
              <figure className={index === 1 ? "lg:mt-16" : ""}>
                <div className="aspect-square overflow-hidden border border-white/12">
                  <img src={image} alt="" className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0" />
                </div>
                <figcaption className="border-x border-b border-white/12 bg-black p-5">
                  <p className="text-sm leading-7 text-white/76">"{text}"</p>
                  <p className="mt-4 font-bold text-[var(--p)]">{name}</p>
                  <p className="text-xs text-white/45">{role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="bg-[var(--bg)] px-5 py-24 text-white lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl border border-white/12 lg:grid-cols-2">
        <Reveal variant="right" className="min-h-[420px]">
          <img src={getValue(data, "contactImage")} alt="" className="h-full w-full object-cover" />
        </Reveal>
        <Reveal variant="left" className="bg-[var(--surface)] p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">book a shoot</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 text-sm leading-7 text-white/62">{getValue(data, "contactText")}</p>
          <form className="mt-8 grid gap-4" data-bizuply-block="lead-form" data-bizuply-form-id="lenscraft-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/14 bg-black px-5 py-4 text-right text-white outline-none transition placeholder:text-white/32 focus:border-[var(--p)]" placeholder="שם מלא" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/14 bg-black px-5 py-4 text-right text-white outline-none transition placeholder:text-white/32 focus:border-[var(--p)]" placeholder="טלפון" />
            <input name="email" data-bizuply-form-field-id="email" type="email" autoComplete="email"  className="border border-white/14 bg-black px-5 py-4 text-right text-white outline-none transition placeholder:text-white/32 focus:border-[var(--p)]" placeholder="אימייל" />
            <textarea name="message" data-bizuply-form-field-id="message"  className="min-h-28 border border-white/14 bg-black px-5 py-4 text-right text-white outline-none transition placeholder:text-white/32 focus:border-[var(--p)]" placeholder="איזה צילום אתם צריכים?" />
            <button type="submit" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-white transition hover:bg-[var(--a)]">{getValue(data, "contactButton")}</button>
          </form>
          <div className="mt-7 grid gap-2 text-sm text-white/56">
            <p><span className="text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)] bg-black px-5 py-14 text-white lg:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-[-0.06em] md:text-6xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/58">{getValue(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-white transition hover:bg-[var(--a)]">{getValue(data, "ctaButton")}</button>
      </Reveal>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-white/36">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/78 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/40 bg-[var(--surface)] p-8 text-white">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-white/70 transition hover:text-[var(--p)]">×</button>
        <h3 className="text-3xl font-bold tracking-[-0.05em]">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-form-id="lenscraft-contact-2" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/14 bg-black px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/14 bg-black px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="טלפון" />
          <button type="submit" className="bg-[var(--p)] py-4 text-sm font-bold text-white">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <ServicesFilmstrip data={data} />
      <FeaturedGallery data={data} />
      <Packages data={data} />
      <Process data={data} />
      <ClientsMarquee data={data} />
      <Testimonials data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function LenscraftPages(props: LenscraftPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...lenscraftDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "lenscraft-preview" : "lenscraft"} className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <style dangerouslySetInnerHTML={{ __html: lenscraftEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
