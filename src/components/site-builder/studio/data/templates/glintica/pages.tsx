import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { glinticaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { CrmBookingMount } from "../shared/CrmBookingMount";
import { glinticaEditorCss } from "./editorCss";

export const glinticaPages = [{ id: "home", label: "בית", slug: "/" }];

type GlinticaPagesProps = {
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
  return data?.[key] ?? (glinticaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1F1A1C]/35 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="gl-mark grid h-11 w-11 place-items-center text-sm font-bold">{getValue(data, "logoText")}</span>
          <div>
            <span className="t-display block text-3xl font-semibold leading-none">{getValue(data, "brandName")}</span>
            <span className="block text-[10px] tracking-[0.36em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</span>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-xs tracking-[0.22em] text-white/70 lg:flex">
          <a href="#glintica-services" className="transition hover:text-[var(--p)]">{getValue(data, "navServices")}</a>
          <a href="#glintica-gallery" className="transition hover:text-[var(--p)]">{getValue(data, "navGallery")}</a>
          <a href="#glintica-booking" className="transition hover:text-[var(--p)]">{getValue(data, "navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="gl-button hidden px-6 py-3 text-xs font-bold tracking-[0.22em] sm:inline-flex">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative grid min-h-[100svh] place-items-center overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="gl-hero-image absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(212,160,167,0.12),transparent_34%),linear-gradient(180deg,rgba(31,26,28,0.2),rgba(31,26,28,0.84)_72%,#1F1A1C)]" />
      <div className="gl-petal gl-petal-one" />
      <div className="gl-petal gl-petal-two" />
      <Reveal className="relative z-10 mx-auto max-w-6xl px-5 pt-24 text-center" variant="scale">
        <p className="text-xs font-bold tracking-[0.48em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
        <h1 className="t-display gl-hero-title mt-6 whitespace-pre-line text-[22vw] font-semibold leading-[0.76] md:text-[15vw] lg:text-[10.5rem]">
          {getValue(data, "brandName")}
        </h1>
        <div className="gl-rose-underline mx-auto mt-5 h-px w-64 max-w-[62vw]" />
        <h2 className="t-display mx-auto mt-8 max-w-4xl whitespace-pre-line text-5xl font-semibold leading-[0.95] md:text-7xl">
          {getValue(data, "heroTitle")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">{getValue(data, "heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={openModal} className="gl-button px-9 py-4 text-sm font-bold tracking-[0.2em]">
            {getValue(data, "heroPrimaryButton")}
          </button>
          <a href="#glintica-before-after" className="border border-white/30 px-9 py-4 text-sm font-bold tracking-[0.2em] text-white transition hover:border-[var(--p)] hover:text-[var(--p)]">
            {getValue(data, "heroSecondaryButton")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "itemOneTitle"), getValue(data, "serviceOneDetail"), getValue(data, "serviceOnePrice")],
    [getValue(data, "itemTwoTitle"), getValue(data, "serviceTwoDetail"), getValue(data, "serviceTwoPrice")],
    [getValue(data, "itemThreeTitle"), getValue(data, "serviceThreeDetail"), getValue(data, "serviceThreePrice")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourDetail"), getValue(data, "serviceFourPrice")],
  ];

  return (
    <section id="glintica-services" data-template-section-type="services" className="relative px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto max-w-5xl">
        <p className="text-xs font-bold tracking-[0.42em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
        <h2 className="t-display mt-4 max-w-3xl text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
        <div className="mt-14 border-y border-[var(--p)]/30">
          {services.map(([title, detail, price], index) => (
            <Reveal key={title} delayMs={index * 90} variant="right">
              <article className="gl-price-row grid gap-4 border-b border-[var(--p)]/15 py-7 last:border-b-0 md:grid-cols-[1fr_minmax(120px,1.3fr)_auto] md:items-end">
                <div>
                  <span className="text-xs tracking-[0.32em] text-[var(--p)]">0{index + 1}</span>
                  <h3 className="t-display mt-1 text-2xl sm:text-4xl font-semibold">{title}</h3>
                </div>
                <div className="gl-dots hidden md:block" />
                <div className="text-left md:text-right">
                  <p className="mb-2 text-sm leading-6 text-[var(--muted)]">{detail}</p>
                  <p className="t-display text-2xl sm:text-4xl font-semibold text-[var(--p)]">{price}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function BeforeAfter({ data }: { data: Record<string, any> }) {
  const [compare, setCompare] = useState(50);

  function updateFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const raw = ((bounds.right - event.clientX) / bounds.width) * 100;
    setCompare(Math.min(68, Math.max(32, Math.round(raw))));
  }

  return (
    <section id="glintica-before-after" data-template-section-type="before-after" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.42em] text-[var(--p)]">{getValue(data, "beforeAfterEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "sectionThreeTitle")}</h2>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "beforeAfterText")}</p>
          <div className="mt-8 flex gap-3">
            {[40, 50, 62].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCompare(value)}
                className="border border-[var(--p)]/30 px-4 py-2 text-xs tracking-[0.22em] text-[var(--p)] transition hover:bg-[var(--p)] hover:text-[var(--dark)]"
              >
                {value === 40 ? "לפני" : value === 50 ? "חצי" : "אחרי"}
              </button>
            ))}
          </div>
        </div>
        <div
          className="gl-compare relative grid min-h-[560px] cursor-ew-resize overflow-hidden border border-[var(--p)]/25"
          style={{ gridTemplateColumns: `${compare}% ${100 - compare}%` }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 1) updateFromPointer(event);
          }}
        >
          <figure className="relative overflow-hidden">
            <img src={getValue(data, "beforeImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="absolute bottom-5 right-5 bg-[#1F1A1C]/80 px-4 py-2 text-xs tracking-[0.26em] text-[var(--p)] backdrop-blur">לפני</figcaption>
          </figure>
          <figure className="relative overflow-hidden border-r border-[var(--p)]">
            <img src={getValue(data, "afterImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="absolute bottom-5 left-5 bg-[var(--p)] px-4 py-2 text-xs font-bold tracking-[0.26em] text-[var(--dark)]">אחרי</figcaption>
          </figure>
          <div className="pointer-events-none absolute inset-y-0" style={{ right: `${compare}%` }}>
            <span className="absolute top-1/2 grid h-16 w-16 -translate-y-1/2 translate-x-1/2 place-items-center border border-[var(--p)] bg-[#1F1A1C]/80 text-[var(--p)] backdrop-blur">
              ↔
            </span>
          </div>
          <input
            aria-label="השוואת לפני ואחרי"
            className="gl-range absolute inset-x-10 bottom-8"
            type="range"
            min="32"
            max="68"
            value={compare}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompare(Number(event.target.value))}
          />
        </div>
      </Reveal>
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
    <section data-template-section-type="packages" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.42em] text-[var(--p)]">{getValue(data, "packagesEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map(([title, price, text], index) => (
            <Reveal key={title} delayMs={index * 120} variant="up">
              <article className="gl-tier t-card relative flex aspect-square flex-col justify-between overflow-hidden border border-[var(--p)]/25 bg-[#251F22] p-8">
                <div className="gl-tier-bar absolute inset-x-0 top-0 h-2 bg-[var(--p)]" />
                <span className="t-display text-3xl md:text-7xl font-semibold text-white/10">0{index + 1}</span>
                <div>
                  <h3 className="t-display text-2xl md:text-5xl font-semibold">{title}</h3>
                  <p className="mt-4 min-h-[84px] text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <p className="t-display text-2xl md:text-5xl font-semibold text-[var(--p)]">{price}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const images = [
    [getValue(data, "galleryOneImage"), "lg:row-span-2"],
    [getValue(data, "galleryTwoImage"), ""],
    [getValue(data, "galleryThreeImage"), "lg:col-span-2"],
    [getValue(data, "galleryFourImage"), ""],
    [getValue(data, "galleryFiveImage"), "lg:row-span-2"],
  ];

  return (
    <section id="glintica-gallery" data-template-section-type="gallery" className="bg-[#171315] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.42em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="t-display mt-4 text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "sectionFiveTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">{getValue(data, "galleryText")}</p>
        </Reveal>
        <div className="mt-14 grid auto-rows-[230px] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {images.map(([src, span], index) => (
            <Reveal key={`${src}-${index}`} delayMs={index * 80} variant={index % 2 ? "left" : "right"}>
              <figure className={`gl-masonry group relative h-full overflow-hidden border border-[var(--p)]/20 ${span}`}>
                <img src={src} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1F1A1C]/80 px-5 py-4 text-xs tracking-[0.28em] text-[var(--p)] backdrop-blur transition duration-500 group-hover:translate-y-0">
                  {getValue(data, "brandName")} / 0{index + 1}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto max-w-5xl text-center" variant="scale">
        <span className="t-display block text-[12rem] leading-[0.55] text-[var(--p)]/55">"</span>
        <blockquote className="t-display mt-2 text-4xl font-semibold leading-tight md:text-6xl">
          {getValue(data, "reviewOneText")}
        </blockquote>
        <footer className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-5 border-t border-[var(--p)]/25 pt-8">
          <div className="h-px flex-1 bg-[var(--p)]/35" />
          <div>
            <p className="font-bold text-[var(--p)]">{getValue(data, "reviewOneName")}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{getValue(data, "reviewOneRole")}</p>
          </div>
          <div className="h-px flex-1 bg-[var(--p)]/35" />
        </footer>
      </Reveal>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <h2 className="t-display text-center text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "sectionSevenTitle")}</h2>
        <div className="mt-12 border-t border-[var(--p)]/25">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="border-b border-[var(--p)]/25">
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-6 text-right">
                <span className="t-display text-3xl font-semibold">{question}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-[var(--p)]/40 text-[var(--p)]">{open === index ? "-" : "+"}</span>
              </button>
              <div className={`grid transition-all duration-500 ${open === index ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden text-sm leading-7 text-[var(--muted)]">{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Booking({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="glintica-booking" data-template-section-type="booking" className="px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-[0.42em] text-[var(--p)]">{getValue(data, "bookingEyebrow")}</p>
        <h2 className="t-display mt-4 text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "contactTitle")}</h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
        <CrmBookingMount className="mx-auto mt-10 min-h-[420px] w-full border border-[var(--p)]/25 bg-[#251F22]/70 p-3" accent="#d4a0a7" />
        <form className="mt-6 grid gap-4 border border-[var(--p)]/25 bg-[#251F22]/70 p-6 text-right md:p-9" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="glintica-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border-b border-[var(--p)]/25 bg-transparent px-1 py-4 text-right outline-none transition placeholder:text-white/35 focus:border-[var(--p)]" placeholder="שם מלא" name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border-b border-[var(--p)]/25 bg-transparent px-1 py-4 text-right outline-none transition placeholder:text-white/35 focus:border-[var(--p)]" placeholder="טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <input className="border-b border-[var(--p)]/25 bg-transparent px-1 py-4 text-right outline-none transition placeholder:text-white/35 focus:border-[var(--p)]" placeholder="תאריך האירוע" name="date" data-bizuply-form-field-id="date" />
          <textarea className="min-h-[120px] border-b border-[var(--p)]/25 bg-transparent px-1 py-4 text-right outline-none transition placeholder:text-white/35 focus:border-[var(--p)]" placeholder="מה תרצי שנדע?" name="message" data-bizuply-form-field-id="message"></textarea>
          <button type="submit" className="gl-button mt-3 px-8 py-4 text-sm font-bold tracking-[0.22em]">
            {getValue(data, "contactButton")}
          </button>
        </form>
        <div className="mt-8 space-y-2 text-sm text-[var(--muted)]">
          <p><span className="text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
          <p><span className="text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
          <p><span className="text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="px-5 pb-10 pt-10 lg:px-8">
      <Reveal className="mx-auto max-w-7xl overflow-hidden border border-[var(--p)]/30 bg-[radial-gradient(circle_at_18%_20%,rgba(212,160,167,0.45),transparent_26%),linear-gradient(135deg,#2A2326,#1F1A1C_58%,#D4A0A7)] p-10 text-center md:p-16" variant="scale">
        <p className="text-xs font-bold tracking-[0.46em] text-white/75">{getValue(data, "footerEyebrow")}</p>
        <h2 className="t-display mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-none md:text-7xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/75">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-9 border border-white bg-white px-9 py-4 text-sm font-bold tracking-[0.22em] text-[#1F1A1C] transition hover:bg-transparent hover:text-white">
          {getValue(data, "ctaButton")}
        </button>
      </Reveal>
      <p className="mt-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--surface)] p-8">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--p)]">x</button>
        <h3 className="t-display text-2xl sm:text-4xl font-semibold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="glintica-contact-2" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <button type="submit" className="gl-button py-4 text-sm font-bold tracking-[0.22em]">{getValue(data, "contactButton")}</button>
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
      <BeforeAfter data={data} />
      <Packages data={data} />
      <Gallery data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Booking data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function GlinticaPages(props: GlinticaPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...glinticaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id="glintica" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: glinticaEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
