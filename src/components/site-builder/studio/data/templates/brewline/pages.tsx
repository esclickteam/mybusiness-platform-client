import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { brewlineDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { brewlineEditorCss } from "./editorCss";

export const brewlinePages = [{ id: "home", label: "בית", slug: "/" }];

type BrewlinePagesProps = {
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
  return data?.[key] ?? (brewlineDefaultData as Record<string, any>)[key] ?? "";
}

function CountBadge({ target, label, suffix = "", delayMs = 0 }: { target: number; label: string; suffix?: string; delayMs?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const value = useCountUp(target, enabled, 1400);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delayMs={delayMs} variant="scale">
      <div ref={ref} className="bl-count-card aspect-square border border-[var(--clay)]/45 bg-[#241B15]/92 p-5 text-center shadow-2xl shadow-black/20">
        <span className="t-serif block text-6xl leading-none text-[var(--cream)] md:text-7xl">{value}{suffix}</span>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.26em] text-[var(--muted)]">{label}</p>
      </div>
    </Reveal>
  );
}

function Header({ data, goHome }: { data: Record<string, any>; goHome: () => void }) {
  const links = [
    [getValue(data, "navMenu"), "#menu"],
    [getValue(data, "navOrigins"), "#origins"],
    [getValue(data, "navHours"), "#hours"],
    [getValue(data, "navContact"), "#contact"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1A1410]/72 text-[var(--cream)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={goHome} className="group flex items-center gap-3 text-right" aria-label={getValue(data, "brandName")}>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--clay)] bg-[var(--clay)]/18 text-sm font-black text-[var(--cream)] transition group-hover:bg-[var(--clay)]">{getValue(data, "logoText")}</span>
          <span className="t-serif text-3xl leading-none tracking-tight">{getValue(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/72 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="bl-nav-link transition hover:text-[var(--cream)]">
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="rounded-full border border-[var(--clay)] bg-[var(--clay)] px-5 py-3 text-sm font-bold text-[#1A1410] transition hover:bg-[var(--cream)]">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--espresso)]">
      <img src={getValue(data, "heroImage")} alt="" className="bl-ken absolute inset-0 h-full w-full object-cover opacity-72" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(139,94,60,0.42),transparent_32%),linear-gradient(90deg,#1A1410_0%,rgba(26,20,16,0.88)_34%,rgba(26,20,16,0.34)_100%)]" />
      <div className="bl-bean-orbit absolute left-[10%] top-[18%] hidden h-32 w-32 rounded-full border border-[var(--clay)]/45 lg:block" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
        <Reveal variant="right" className="max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.48em] text-[var(--clay)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="t-serif mt-5 text-[22vw] leading-[0.76] tracking-[-0.08em] text-[var(--cream)] md:text-[15vw] lg:text-[12rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <div className="mt-8 grid gap-6 border-y border-white/18 py-6 lg:grid-cols-[0.95fr_1fr] lg:items-end">
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">{getValue(data, "heroSubtitle")}</p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href="#menu" className="rounded-full bg-[var(--cream)] px-8 py-4 text-sm font-black text-[var(--espresso)] transition hover:bg-[var(--clay)] hover:text-white">
                {getValue(data, "heroSecondaryButton")}
              </a>
              <a href="#contact" className="rounded-full border border-white/28 px-8 py-4 text-sm font-bold text-white transition hover:border-[var(--clay)] hover:text-[var(--clay)]">
                {getValue(data, "heroPrimaryButton")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Menu({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "menuOneName"), getValue(data, "menuOneText"), getValue(data, "menuOnePrice")],
    [getValue(data, "menuTwoName"), getValue(data, "menuTwoText"), getValue(data, "menuTwoPrice")],
    [getValue(data, "menuThreeName"), getValue(data, "menuThreeText"), getValue(data, "menuThreePrice")],
    [getValue(data, "menuFourName"), getValue(data, "menuFourText"), getValue(data, "menuFourPrice")],
    [getValue(data, "menuFiveName"), getValue(data, "menuFiveText"), getValue(data, "menuFivePrice")],
  ];

  return (
    <section id="menu" data-template-section-type="menu" className="bg-[var(--cream)] px-5 py-24 text-[var(--espresso)] lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[var(--clay)]">{getValue(data, "menuEyebrow")}</p>
            <h2 className="t-serif mt-3 text-6xl leading-none tracking-[-0.05em] md:text-8xl">{getValue(data, "sectionMenuTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#5E4A3D]">{getValue(data, "menuIntro")}</p>
        </Reveal>
        <div className="mt-12 border-y-2 border-[var(--espresso)]">
          {items.map(([name, text, price], index) => (
            <Reveal key={name} delayMs={index * 80} variant="up">
              <article className="bl-menu-row grid gap-3 border-b border-[var(--espresso)]/20 py-7 last:border-b-0 md:grid-cols-[1fr_1.25fr_auto] md:items-end">
                <h3 className="t-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">{name}</h3>
                <p className="max-w-xl text-sm font-semibold leading-7 text-[#6B5749]">{text}</p>
                <strong className="t-serif text-right text-3xl md:text-6xl leading-none text-[var(--clay)]">{price}</strong>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Origins({ data }: { data: Record<string, any> }) {
  const cards = [
    [getValue(data, "originOneTitle"), getValue(data, "originOneText"), getValue(data, "originOneImage")],
    [getValue(data, "originTwoTitle"), getValue(data, "originTwoText"), getValue(data, "originTwoImage")],
    [getValue(data, "originThreeTitle"), getValue(data, "originThreeText"), getValue(data, "originThreeImage")],
  ];

  return (
    <section id="origins" data-template-section-type="origins" className="bg-[var(--espresso)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--clay)]">{getValue(data, "originsEyebrow")}</p>
            <h2 className="t-serif mt-3 text-6xl leading-none tracking-[-0.05em] text-[var(--cream)] md:text-8xl">{getValue(data, "sectionOriginsTitle")}</h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-7 text-[var(--muted)]">{getValue(data, "originsIntro")}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {cards.map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 110} variant="scale">
              <article className="group relative aspect-square overflow-hidden border border-white/14 bg-[var(--surface)]">
                <img src={image} alt="" className="h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-xs font-black uppercase tracking-[0.28em] text-[var(--clay)]">מקור 0{index + 1}</span>
                  <h3 className="t-serif mt-2 text-2xl md:text-5xl leading-none text-[var(--cream)]">{title}</h3>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/72">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrewMethods({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "methodOneTitle"), getValue(data, "methodOneText")],
    [getValue(data, "methodTwoTitle"), getValue(data, "methodTwoText")],
    [getValue(data, "methodThreeTitle"), getValue(data, "methodThreeText")],
    [getValue(data, "methodFourTitle"), getValue(data, "methodFourText")],
  ];

  return (
    <section data-template-section-type="process" className="overflow-hidden bg-[#120D0A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-serif text-6xl leading-none tracking-[-0.05em] text-[var(--cream)] md:text-8xl">{getValue(data, "sectionMethodsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="bl-step-card relative min-h-[300px] border border-[var(--clay)]/35 bg-[var(--surface)] p-6">
                <span className="t-serif text-3xl md:text-7xl leading-none text-[var(--clay)]/55">0{index + 1}</span>
                <h3 className="t-serif mt-10 text-2xl sm:text-4xl leading-none text-[var(--cream)]">{title}</h3>
                <p className="mt-5 text-sm font-medium leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Atmosphere({ data }: { data: Record<string, any> }) {
  const images = [
    [getValue(data, "galleryOneImage"), getValue(data, "galleryOneTitle")],
    [getValue(data, "galleryTwoImage"), getValue(data, "galleryTwoTitle")],
    [getValue(data, "galleryThreeImage"), getValue(data, "galleryThreeTitle")],
    [getValue(data, "galleryFourImage"), getValue(data, "galleryFourTitle")],
  ];

  return (
    <section data-template-section-type="gallery" className="bg-[var(--cream)] px-5 py-24 text-[var(--espresso)] lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-[var(--clay)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="t-serif mt-3 text-6xl leading-none tracking-[-0.05em] md:text-8xl">{getValue(data, "sectionGalleryTitle")}</h2>
        </Reveal>
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[260px]">
          {images.map(([image, title], index) => (
            <Reveal key={title} delayMs={index * 90} variant={index === 0 ? "right" : "up"} className={index === 0 ? "md:col-span-2 md:row-span-2" : index === 3 ? "md:col-span-2" : ""}>
              <figure className="group relative h-full overflow-hidden bg-[var(--espresso)]">
                <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <figcaption className="absolute bottom-4 right-4 rounded-full bg-[var(--cream)]/90 px-4 py-2 text-xs font-black text-[var(--espresso)] backdrop-blur">
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

function HoursLocation({ data }: { data: Record<string, any> }) {
  return (
    <section id="hours" data-template-section-type="hours" className="bg-[var(--espresso)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--clay)]">{getValue(data, "hoursEyebrow")}</p>
          <h2 className="t-serif mt-3 whitespace-pre-line text-[18vw] leading-[0.82] tracking-[-0.08em] text-[var(--cream)] md:text-[10rem] lg:text-[13rem]">{getValue(data, "hoursTitle")}</h2>
          <p className="mt-8 max-w-2xl text-2xl leading-10 text-[var(--muted)]">{getValue(data, "address")}</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CountBadge target={7} suffix="/7" label={getValue(data, "countOneLabel")} />
          <CountBadge target={42} label={getValue(data, "countTwoLabel")} delayMs={100} />
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName")],
  ];

  return (
    <section data-template-section-type="reviews" className="bg-[#120D0A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="border-b border-white/14 pb-8">
          <h2 className="t-serif text-6xl leading-none tracking-[-0.05em] text-[var(--cream)] md:text-8xl">{getValue(data, "sectionReviewsTitle")}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up">
              <blockquote className="aspect-square border border-white/14 bg-[var(--surface)] p-7">
                <span className="t-serif text-3xl md:text-7xl leading-none text-[var(--clay)]">”</span>
                <p className="mt-5 text-lg leading-8 text-[var(--cream)]">{text}</p>
                <footer className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-[var(--clay)]">{name}</footer>
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
    <section id="contact" data-template-section-type="contact" className="bg-[var(--cream)] px-5 py-24 text-[var(--espresso)] lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="right" className="bg-[var(--clay)] p-8 text-white lg:p-12">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-white/70">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-serif mt-4 text-6xl leading-none tracking-[-0.05em] md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/78">{getValue(data, "contactText")}</p>
          <div className="mt-10 border-t border-white/25 pt-6">
            <p className="t-serif text-2xl md:text-5xl leading-none">{getValue(data, "phone")}</p>
            <p className="mt-3 text-sm font-bold text-white/70">{getValue(data, "email")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4 border border-[var(--espresso)]/15 bg-white p-6 shadow-[0_24px_80px_rgba(26,20,16,0.1)] lg:p-10" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="brewline-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="border border-[var(--espresso)]/18 bg-[var(--cream)] px-5 py-4 text-right outline-none transition placeholder:text-[#7D6758]/65 focus:border-[var(--clay)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className="border border-[var(--espresso)]/18 bg-[var(--cream)] px-5 py-4 text-right outline-none transition placeholder:text-[#7D6758]/65 focus:border-[var(--clay)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className="border border-[var(--espresso)]/18 bg-[var(--cream)] px-5 py-4 text-right outline-none transition placeholder:text-[#7D6758]/65 focus:border-[var(--clay)]" placeholder="אירוע / כמות אורחים"  name="guests" data-bizuply-form-field-id="guests" />
            <textarea className="min-h-[140px] border border-[var(--espresso)]/18 bg-[var(--cream)] px-5 py-4 text-right outline-none transition placeholder:text-[#7D6758]/65 focus:border-[var(--clay)]" placeholder="ספרו לנו על הקייטרינג או הביקור שתרצו"  name="message" data-bizuply-form-field-id="message"></textarea>
            <button type="submit" className="bg-[var(--espresso)] px-8 py-4 text-sm font-black text-white transition hover:bg-[var(--clay)]">
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
    <footer data-template-section-type="footer" className="bg-[var(--clay)] px-5 py-16 text-[#1A1410] lg:px-8">
      <Reveal className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="t-serif text-7xl leading-none tracking-[-0.06em] md:text-9xl">{getValue(data, "ctaTitle")}</p>
          <p className="mt-4 max-w-xl text-lg font-semibold text-[#1A1410]/72">{getValue(data, "ctaText")}</p>
        </div>
        <a href="#contact" className="rounded-full border-2 border-[#1A1410] px-9 py-4 text-sm font-black uppercase tracking-[0.24em] transition hover:bg-[#1A1410] hover:text-[var(--cream)]">
          {getValue(data, "ctaButton")}
        </a>
      </Reveal>
    </footer>
  );
}

export default function BrewlinePages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: BrewlinePagesProps) {
  const mergedData = useMemo(() => ({ ...brewlineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  const content = (
    <>
      <Header data={mergedData} goHome={() => goTo("home")} />
      <Hero data={mergedData} />
      <Menu data={mergedData} />
      <Origins data={mergedData} />
      <BrewMethods data={mergedData} />
      <Atmosphere data={mergedData} />
      <HoursLocation data={mergedData} />
      <Reviews data={mergedData} />
      <Contact data={mergedData} />
      <Footer data={mergedData} />
    </>
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "brewline-preview" : "brewline"} className="min-h-screen w-full overflow-x-hidden bg-[var(--espresso)]">
      <style dangerouslySetInnerHTML={{ __html: brewlineEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content }]} />
    </div>
  );
}
