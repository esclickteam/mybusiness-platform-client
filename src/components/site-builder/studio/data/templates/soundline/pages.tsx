import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { soundlineDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { soundlineEditorCss } from "./editorCss";

export const soundlinePages = [{ id: "home", label: "בית", slug: "/" }];

type SoundlinePagesProps = {
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
  return data?.[key] ?? (soundlineDefaultData as Record<string, any>)[key] ?? "";
}

function useInViewOnce() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.34 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data }: { data: Record<string, any> }) {
  const links = [
    [getValue(data, "navPrograms"), "#programs"],
    [getValue(data, "navTeachers"), "#teachers"],
    [getValue(data, "navEvents"), "#events"],
    [getValue(data, "navEnroll"), "#enroll"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--bg)] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-3" aria-label={getValue(data, "brandName")}>
          <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-black">{getValue(data, "logoText")}</span>
          <span className="t-display text-4xl leading-none tracking-wide">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.22em] text-white/66 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="sound-nav-link">
              {label}
            </a>
          ))}
        </nav>
        <a href="#enroll" className="bg-[var(--p)] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-black">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[92svh] overflow-hidden bg-[var(--bg)]">
      <img src={getValue(data, "heroImage")} alt="" className="sound-ken absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/68 to-black/18" />
      <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-black via-black/72 to-transparent" />
      <div className="sound-vinyl absolute bottom-16 left-[8vw] hidden h-44 w-44 border-[18px] border-black bg-[var(--p)] lg:block" />
      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-end gap-10 px-5 pb-16 pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-24">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="t-display sound-hero-title mt-5 whitespace-pre-line text-[5.5rem] uppercase leading-[0.78] text-white md:text-[9rem] lg:text-[12rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-semibold leading-8 text-white/78 md:text-xl">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#enroll" className="bg-[var(--p)] px-9 py-4 text-sm font-black uppercase tracking-[0.18em] text-black">{getValue(data, "heroPrimaryButton")}</a>
            <a href="#programs" className="border border-white/35 px-9 py-4 text-sm font-black uppercase tracking-[0.18em] text-white hover:border-[var(--p)] hover:text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</a>
          </div>
        </Reveal>
        <Reveal delayMs={180} variant="left" className="hidden border border-[var(--p)]/60 bg-black/60 p-5 backdrop-blur md:block">
          <p className="t-display text-7xl uppercase leading-none text-[var(--p)]">{getValue(data, "heroSideTitle")}</p>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.24em] text-white/70">{getValue(data, "heroSideText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Programs({ data }: { data: Record<string, any> }) {
  const programs = [
    [getValue(data, "programOneTitle"), getValue(data, "programOneText"), getValue(data, "programOneMeta")],
    [getValue(data, "programTwoTitle"), getValue(data, "programTwoText"), getValue(data, "programTwoMeta")],
    [getValue(data, "programThreeTitle"), getValue(data, "programThreeText"), getValue(data, "programThreeMeta")],
    [getValue(data, "programFourTitle"), getValue(data, "programFourText"), getValue(data, "programFourMeta")],
  ];

  return (
    <section id="programs" data-template-section-type="services" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "programsEyebrow")}</p>
            <h2 className="t-display mt-4 text-6xl uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionProgramsTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg font-semibold leading-8 text-[var(--muted)]">{getValue(data, "sectionProgramsText")}</p>
        </Reveal>
        <div className="mt-14 space-y-4">
          {programs.map(([title, text, meta], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="sound-program-row border-2 border-[var(--p)] px-5 py-6 md:px-8 md:py-7">
                <div className="grid gap-5 md:grid-cols-[0.22fr_1fr_0.45fr] md:items-center">
                  <p className="t-display text-6xl leading-none text-[var(--p)]">0{index + 1}</p>
                  <div>
                    <h3 className="t-display text-5xl uppercase leading-none text-white md:text-7xl">{title}</h3>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)] md:text-left">{meta}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GenreMarquee({ data }: { data: Record<string, any> }) {
  const genres = String(getValue(data, "genres")).split("|");
  const loop = [...genres, ...genres, ...genres];

  return (
    <section data-template-section-type="marquee" className="overflow-hidden border-y border-[var(--p)] bg-[var(--p)] py-6 text-black">
      <div className="sound-marquee-track flex w-max items-center gap-8">
        {loop.map((genre, index) => (
          <span key={`${genre}-${index}`} className="t-display text-6xl uppercase leading-none md:text-8xl">
            {genre}
          </span>
        ))}
      </div>
    </section>
  );
}

function Teachers({ data }: { data: Record<string, any> }) {
  const teachers = [
    [getValue(data, "teacherOneName"), getValue(data, "teacherOneRole"), getValue(data, "teacherOneImage")],
    [getValue(data, "teacherTwoName"), getValue(data, "teacherTwoRole"), getValue(data, "teacherTwoImage")],
    [getValue(data, "teacherThreeName"), getValue(data, "teacherThreeRole"), getValue(data, "teacherThreeImage")],
    [getValue(data, "teacherFourName"), getValue(data, "teacherFourRole"), getValue(data, "teacherFourImage")],
  ];

  return (
    <section id="teachers" data-template-section-type="team" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "teachersEyebrow")}</p>
            <h2 className="t-display mt-4 text-6xl uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionTeachersTitle")}</h2>
          </div>
          <p className="max-w-xl text-lg font-semibold leading-8 text-[var(--muted)]">{getValue(data, "sectionTeachersText")}</p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {teachers.map(([name, role, image], index) => (
            <Reveal key={name} delayMs={index * 100} variant="scale">
              <article className="sound-teacher-strip relative h-[520px] overflow-hidden border border-white/14 bg-black">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="t-display text-5xl uppercase leading-none text-white">{name}</h3>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">{role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events({ data }: { data: Record<string, any> }) {
  const events = [
    [getValue(data, "eventOneDate"), getValue(data, "eventOneTitle"), getValue(data, "eventOneText")],
    [getValue(data, "eventTwoDate"), getValue(data, "eventTwoTitle"), getValue(data, "eventTwoText")],
    [getValue(data, "eventThreeDate"), getValue(data, "eventThreeTitle"), getValue(data, "eventThreeText")],
  ];

  return (
    <section id="events" data-template-section-type="events" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "eventsEyebrow")}</p>
          <h2 className="t-display mt-4 text-6xl uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionEventsTitle")}</h2>
        </Reveal>
        <div className="mt-14 border-t border-white/14">
          {events.map(([date, title, text], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="sound-event-row grid gap-5 border-b border-white/14 py-8 md:grid-cols-[0.32fr_1fr] md:items-center">
                <p className="t-display text-7xl uppercase leading-none text-[var(--p)]">{date}</p>
                <div>
                  <h3 className="t-display text-5xl uppercase leading-none text-white md:text-6xl">{title}</h3>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterCard({ target, suffix, label, delayMs }: { target: number; suffix: string; label: string; delayMs: number }) {
  const { ref, visible } = useInViewOnce();
  const value = useCountUp(target, visible, 1300);

  return (
    <Reveal delayMs={delayMs} variant="up">
      <div ref={ref} className="sound-counter border-2 border-[var(--p)] bg-black p-7">
        <p className="t-display text-8xl uppercase leading-none text-[var(--p)] md:text-[8.5rem]">
          {value}
          {suffix}
        </p>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-white/76">{label}</p>
      </div>
    </Reveal>
  );
}

function Results({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-24 text-black lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-display text-7xl uppercase leading-none md:text-[10rem]">{getValue(data, "sectionResultsTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <CounterCard target={620} suffix="+" label={getValue(data, "resultOneLabel")} delayMs={0} />
          <CounterCard target={86} suffix="" label={getValue(data, "resultTwoLabel")} delayMs={100} />
          <CounterCard target={11} suffix="" label={getValue(data, "resultThreeLabel")} delayMs={200} />
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const images = [getValue(data, "galleryOneImage"), getValue(data, "galleryTwoImage"), getValue(data, "galleryThreeImage")];

  return (
    <section data-template-section-type="gallery" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="t-display mt-4 text-6xl uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionGalleryTitle")}</h2>
          </div>
          <p className="max-w-lg text-lg font-semibold leading-8 text-[var(--muted)]">{getValue(data, "sectionGalleryText")}</p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <Reveal key={image} delayMs={index * 100} variant="scale">
              <div className="sound-gallery-strip h-[520px] overflow-hidden border border-white/12 bg-black">
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnrollForm({ data }: { data: Record<string, any> }) {
  return (
    <section id="enroll" data-template-section-type="contact" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 border-2 border-[var(--p)] bg-black p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-4 text-6xl uppercase leading-none text-white md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg font-semibold leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-black uppercase tracking-[0.18em] text-white/70">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal delayMs={130} variant="left">
          <form className="grid gap-4">
            <input aria-label="שם מלא" placeholder="שם מלא" className="sound-input border border-white/18 bg-[var(--surface)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <input aria-label="טלפון" placeholder="טלפון" className="sound-input border border-white/18 bg-[var(--surface)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <select aria-label="מסלול" className="sound-input border border-white/18 bg-[var(--surface)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" defaultValue="">
              <option value="" disabled>בחרו מסלול</option>
              <option>גיטרה / בס</option>
              <option>פסנתר / קלידים</option>
              <option>פיתוח קול</option>
              <option>הפקה אלקטרונית</option>
            </select>
            <textarea aria-label="ספרו על המטרה שלכם" placeholder="ספרו על המטרה שלכם" rows={4} className="sound-input border border-white/18 bg-[var(--surface)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <button type="submit" className="bg-[var(--p)] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function FooterCta({ data }: { data: Record<string, any> }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--bg)] px-5 pb-16 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border-2 border-[var(--p)] p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-display text-7xl uppercase leading-none text-white md:text-[9rem]">{getValue(data, "ctaTitle")}</p>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-[var(--muted)]">{getValue(data, "ctaText")}</p>
          </div>
          <a href="#enroll" className="border-2 border-[var(--p)] px-9 py-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--p)] hover:bg-[var(--p)] hover:text-black">{getValue(data, "ctaButton")}</a>
        </div>
      </Reveal>
    </footer>
  );
}

export default function SoundlinePages({
  initialPage = "home",
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
  page,
  pageId,
  initialPageId,
  activePageId,
  currentPageId,
}: SoundlinePagesProps) {
  const mergedData = useMemo(() => ({ ...soundlineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  const pageContent = (
    <>
      <Header data={mergedData} />
      <Hero data={mergedData} />
      <Programs data={mergedData} />
      <GenreMarquee data={mergedData} />
      <Teachers data={mergedData} />
      <Events data={mergedData} />
      <Results data={mergedData} />
      <Gallery data={mergedData} />
      <EnrollForm data={mergedData} />
      <FooterCta data={mergedData} />
    </>
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "soundline-preview" : "soundline"} className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <style dangerouslySetInnerHTML={{ __html: soundlineEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: pageContent }]} />
    </div>
  );
}