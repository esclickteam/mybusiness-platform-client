import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vowlineDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { vowlineEditorCss } from "./editorCss";

export const vowlinePages = [{ id: "home", label: "בית", slug: "/" }];

type VowlinePagesProps = {
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
  return data?.[key] ?? (vowlineDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const navItems = [
    getValue(data, "navPackages"),
    getValue(data, "navGallery"),
    getValue(data, "navStories"),
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50 border-b border-[var(--p)]/15 bg-[#F8F4F0]/86 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[var(--p)] bg-white/45 text-sm font-bold text-[var(--p)]">
            {getValue(data, "logoText")}
          </span>
          <span className="t-script text-2xl sm:text-4xl leading-none text-[var(--p)]">{getValue(data, "brandName")}</span>
        </div>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--dark)]/62 lg:flex">
          {navItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <button
          type="button"
          onClick={openModal}
          className="bg-white/65 px-5 py-2.5 text-sm font-semibold text-[var(--p)] shadow-[0_10px_30px_rgba(91,124,153,0.12)] ring-1 ring-[var(--p)]/25 transition hover:bg-[var(--p)] hover:text-white"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[#F8F4F0]">
      <img src={getValue(data, "heroImage")} alt="" className="t-romance-zoom absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#F8F4F0]/34" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4F0]/75 via-[#F8F4F0]/18 to-[#F8F4F0]/88" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pt-24 text-center">
        <p className="t-hero-kicker text-xs font-bold uppercase tracking-[0.36em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
        <h1 className="t-script t-script-arrive mt-5 text-7xl leading-none text-[var(--p)] sm:text-8xl lg:text-[10rem]">
          {getValue(data, "brandName")}
        </h1>
        <h2 className="t-headline-arrive mt-5 max-w-3xl whitespace-pre-line text-3xl font-semibold leading-tight text-[var(--dark)] md:text-5xl">
          {getValue(data, "heroTitle")}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">{getValue(data, "heroSubtitle")}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(91,124,153,0.28)]">
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button type="button" className="border border-[var(--p)] bg-white/45 px-8 py-3.5 text-sm font-semibold text-[var(--p)]">
            {getValue(data, "heroSecondaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function Packages({ data }: { data: Record<string, any> }) {
  const packages = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "packageOneDetail")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "packageTwoDetail")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "packageThreeDetail")],
  ];

  return (
    <section data-template-section-type="packages" className="bg-[#F8F4F0] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "packagesEyebrow")}</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--dark)] md:text-6xl">{getValue(data, "sectionTwoTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "packagesIntro")}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {packages.map(([title, text, detail], index) => (
            <Reveal key={title} delayMs={index * 110}>
              <article className="t-soft-card flex aspect-square h-full flex-col justify-between bg-white/78 p-7 shadow-[0_18px_50px_rgba(91,124,153,0.12)] ring-1 ring-[var(--p)]/12">
                <span className="block h-1 w-full bg-[var(--p)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--p)]">0{index + 1}</p>
                  <h3 className="mt-5 text-3xl font-semibold text-[var(--dark)]">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <p className="border-t border-[var(--p)]/15 pt-4 text-sm font-semibold text-[var(--p)]">{detail}</p>
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
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
    getValue(data, "galleryFiveImage"),
  ];

  return (
    <section data-template-section-type="gallery" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="t-script mt-2 text-6xl leading-none text-[var(--p)] md:text-8xl">{getValue(data, "sectionThreeTitle")}</h2>
          </div>
          <p className="text-base leading-8 text-[var(--muted)]">{getValue(data, "galleryText")}</p>
        </Reveal>
        <div className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-6">
          {images.map((image, index) => {
            const spans = [
              "md:col-span-3 md:row-span-2",
              "md:col-span-2 md:row-span-1",
              "md:col-span-1 md:row-span-2",
              "md:col-span-2 md:row-span-1",
              "md:col-span-3 md:row-span-1",
            ];
            return (
              <Reveal key={image} delayMs={index * 90} variant="scale" className={spans[index]}>
                <div className="h-full overflow-hidden bg-[#F8F4F0]">
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
              </Reveal>
            );
          })}
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
    <section data-template-section-type="process" className="bg-[#F8F4F0] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--dark)] md:text-6xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="relative mt-16 grid gap-10 md:grid-cols-4">
          <span className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-[var(--p)]/45 md:block" />
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 120} className="relative text-center">
              <div className="t-step-circle mx-auto grid h-24 w-24 place-items-center border border-[var(--p)] bg-white text-2xl font-bold text-[var(--p)] shadow-[0_16px_45px_rgba(91,124,153,0.18)]">
                0{index + 1}
              </div>
              <h3 className="mt-7 text-xl font-semibold text-[var(--dark)]">{title}</h3>
              <p className="mx-auto mt-3 max-w-[230px] text-sm leading-7 text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vendors({ data }: { data: Record<string, any> }) {
  const vendors = [
    getValue(data, "vendorOne"),
    getValue(data, "vendorTwo"),
    getValue(data, "vendorThree"),
    getValue(data, "vendorFour"),
    getValue(data, "vendorFive"),
    getValue(data, "vendorSix"),
  ];

  return (
    <section data-template-section-type="vendors" className="bg-white py-12">
      <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="border-y border-[var(--p)]/20 py-6">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionFiveTitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--dark)]/55">
            {vendors.map((vendor) => (
              <span key={vendor}>{vendor}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function LoveStories({ data }: { data: Record<string, any> }) {
  const stories = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
  ];

  return (
    <section data-template-section-type="love-stories" className="bg-[#F8F4F0] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "storiesEyebrow")}</p>
          <h2 className="t-script mt-2 text-6xl leading-none text-[var(--p)] md:text-8xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {stories.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 130} variant={index === 0 ? "right" : "left"}>
              <blockquote className="h-full bg-white p-8 shadow-[0_22px_60px_rgba(91,124,153,0.12)] ring-1 ring-[var(--p)]/12 lg:p-12">
                <span className="t-script text-3xl md:text-7xl leading-none text-[var(--p)]" style={{ opacity: 0.4 }}>love</span>
                <p className="mt-4 text-xl leading-9 text-[var(--dark)]">"{text}"</p>
                <footer className="mt-10 border-t border-[var(--p)]/20 pt-5">
                  <p className="font-bold text-[var(--p)]">{name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
    [getValue(data, "faqFourQuestion"), getValue(data, "faqFourAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "faqEyebrow")}</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--dark)] md:text-6xl">{getValue(data, "sectionSevenTitle")}</h2>
          <p className="mt-5 max-w-sm text-base leading-8 text-[var(--muted)]">{getValue(data, "faqIntro")}</p>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="space-y-3">
            {faqs.map(([q, a], index) => (
              <div key={q} className="bg-[#F8F4F0] ring-1 ring-[var(--p)]/12">
                <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 p-5 text-right">
                  <span className="text-lg font-semibold text-[var(--dark)]">{q}</span>
                  <span className="grid h-9 w-9 place-items-center bg-white text-xl text-[var(--p)]">{open === index ? "−" : "+"}</span>
                </button>
                {open === index ? <p className="px-5 pb-6 text-sm leading-8 text-[var(--muted)]">{a}</p> : null}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="bg-[#F8F4F0] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 bg-white p-6 shadow-[0_22px_70px_rgba(91,124,153,0.14)] lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--dark)] md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 max-w-md text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-9 grid gap-3 text-sm text-[var(--dark)]/72">
            <p><span className="font-bold text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="font-bold text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="font-bold text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4 bg-[#F8F4F0] p-6 lg:p-8" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="vowline-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--p)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--p)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--p)]" placeholder="תאריך משוער"  name="date" data-bizuply-form-field-id="date" />
            <textarea className="min-h-32 border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--p)]" placeholder="איך אתם מדמיינים את היום?"  name="other" data-bizuply-form-field-id="other"></textarea>
            <button type="submit" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-white">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[#F8F4F0] px-5 pb-10 lg:px-8">
      <Reveal className="mx-auto max-w-7xl bg-[var(--p)] p-9 text-center text-white lg:p-16">
        <p className="t-script text-6xl leading-none md:text-8xl">{getValue(data, "brandName")}</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold md:text-5xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/78">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-8 bg-white px-9 py-3.5 text-sm font-bold text-[var(--p)]">
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#1A2430]/55 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#F8F4F0] p-8 shadow-[0_24px_80px_rgba(26,36,48,0.24)]">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--muted)]">×</button>
        <h3 className="t-script text-3xl md:text-6xl leading-none text-[var(--p)]">{getValue(data, "brandName")}</h3>
        <p className="mt-3 text-lg font-semibold text-[var(--dark)]">{getValue(data, "contactTitle")}</p>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="vowline-contact-2" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border border-[var(--p)]/20 bg-white px-5 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border border-[var(--p)]/20 bg-white px-5 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
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
      <Packages data={data} />
      <Gallery data={data} />
      <Process data={data} />
      <Vendors data={data} />
      <LoveStories data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function VowlinePages(props: VowlinePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...vowlineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vowline-preview" : "vowline"} className="min-h-screen w-full overflow-x-hidden bg-[#F8F4F0]">
      <style dangerouslySetInnerHTML={{ __html: vowlineEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
