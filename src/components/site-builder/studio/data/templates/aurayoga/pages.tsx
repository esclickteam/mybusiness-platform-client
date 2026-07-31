import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { aurayogaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { aurayogaEditorCss } from "./editorCss";

export const aurayogaPages = [{ id: "home", label: "בית", slug: "/" }];

type AurayogaPagesProps = {
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
  return data?.[key] ?? (aurayogaDefaultData as Record<string, any>)[key] ?? "";
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
      { threshold: 0.32 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data }: { data: Record<string, any> }) {
  const links = [
    [getValue(data, "navClasses"), "#classes"],
    [getValue(data, "navSchedule"), "#schedule"],
    [getValue(data, "navTeachers"), "#teachers"],
    [getValue(data, "navContact"), "#join"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:px-8">
      <div className="aura-glass mx-auto flex max-w-7xl items-center justify-between border border-white/12 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        <a href="#" className="flex items-center gap-3" aria-label={getValue(data, "brandName")}>
          <span className="grid h-11 w-11 place-items-center border border-[var(--p)]/50 bg-white/8 text-sm font-bold text-[var(--p)]">{getValue(data, "logoText")}</span>
          <span className="t-display text-3xl font-semibold tracking-wide text-white">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/72 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="aura-nav-link">
              {label}
            </a>
          ))}
        </nav>
        <a href="#join" className="border border-[var(--p)]/60 bg-[var(--p)]/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--p)] hover:text-[var(--dark)]">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="aura-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[#1C1526]/60 to-[#1C1526]/30" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--bg)]/70 to-transparent" />
      <div className="aura-orb aura-orb-one" />
      <div className="aura-orb aura-orb-two" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <Reveal variant="up" className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <p className="t-display aura-brand mt-6 text-7xl font-semibold leading-[0.82] text-white md:text-[8.5rem] lg:text-[11rem]">
            {getValue(data, "brandName")}
          </p>
          <h1 className="mt-8 max-w-3xl whitespace-pre-line text-3xl font-light leading-tight text-white md:text-5xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#join" className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)] transition hover:bg-white">{getValue(data, "heroPrimaryButton")}</a>
            <a href="#classes" className="border border-white/25 px-8 py-4 text-sm font-semibold text-white transition hover:border-[var(--p)] hover:text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Classes({ data }: { data: Record<string, any> }) {
  const classes = [
    [getValue(data, "classOneTitle"), getValue(data, "classOneText"), getValue(data, "classOneMeta"), getValue(data, "classOneImage")],
    [getValue(data, "classTwoTitle"), getValue(data, "classTwoText"), getValue(data, "classTwoMeta"), getValue(data, "classTwoImage")],
    [getValue(data, "classThreeTitle"), getValue(data, "classThreeText"), getValue(data, "classThreeMeta"), getValue(data, "classThreeImage")],
    [getValue(data, "classFourTitle"), getValue(data, "classFourText"), getValue(data, "classFourMeta"), getValue(data, "classFourImage")],
  ];

  return (
    <section id="classes" data-template-section-type="services" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "classesEyebrow")}</p>
            <h2 className="t-display mt-4 text-5xl font-semibold leading-none text-white md:text-7xl">{getValue(data, "sectionClassesTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionClassesText")}</p>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {classes.map(([title, text, meta, image], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="aura-class-card aspect-square overflow-hidden border border-white/12 bg-[var(--surface)]">
                <img src={image} alt="" className="h-[48%] w-full object-cover" />
                <div className="flex h-[52%] flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--p)]">{meta}</p>
                    <h3 className="t-display mt-4 text-3xl font-semibold leading-tight text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountBand({ target, suffix, label, delayMs }: { target: number; suffix: string; label: string; delayMs: number }) {
  const { ref, visible } = useInViewOnce();
  const value = useCountUp(target, visible, 1400);

  return (
    <Reveal delayMs={delayMs} variant="scale">
      <div ref={ref} className="aura-count-band border border-[var(--p)]/25 bg-white/[0.04] px-7 py-8 backdrop-blur-md">
        <p className="t-display text-6xl font-semibold leading-none text-[var(--p)] md:text-7xl">
          {value}
          {suffix}
        </p>
        <p className="mt-3 text-sm font-medium leading-6 text-white/76">{label}</p>
      </div>
    </Reveal>
  );
}

function Benefits({ data }: { data: Record<string, any> }) {
  const bands = [
    [getValue(data, "benefitOneTitle"), getValue(data, "benefitOneText")],
    [getValue(data, "benefitTwoTitle"), getValue(data, "benefitTwoText")],
    [getValue(data, "benefitThreeTitle"), getValue(data, "benefitThreeText")],
  ];

  return (
    <section data-template-section-type="features" className="relative overflow-hidden bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="aura-soft-line top-20" />
      <div className="aura-soft-line bottom-24" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "benefitsEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-tight text-white md:text-7xl">{getValue(data, "sectionBenefitsTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionBenefitsText")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <CountBand target={12} suffix="+" label={getValue(data, "statOneLabel")} delayMs={0} />
            <CountBand target={38} suffix="" label={getValue(data, "statTwoLabel")} delayMs={90} />
            <CountBand target={96} suffix="%" label={getValue(data, "statThreeLabel")} delayMs={180} />
          </div>
        </Reveal>
        <div className="space-y-5">
          {bands.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 110} variant={index % 2 ? "left" : "right"}>
              <article className="aura-floating-band border border-white/10 bg-[var(--surface)]/80 p-7 shadow-2xl shadow-black/20 backdrop-blur-md md:p-9" style={{ marginInlineStart: `${index * 7}%` }}>
                <h3 className="t-display text-2xl sm:text-4xl font-semibold text-white">{title}</h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Schedule({ data }: { data: Record<string, any> }) {
  const rows = [
    [getValue(data, "scheduleOneDay"), getValue(data, "scheduleOneTime"), getValue(data, "scheduleOneClass"), getValue(data, "scheduleOneTeacher")],
    [getValue(data, "scheduleTwoDay"), getValue(data, "scheduleTwoTime"), getValue(data, "scheduleTwoClass"), getValue(data, "scheduleTwoTeacher")],
    [getValue(data, "scheduleThreeDay"), getValue(data, "scheduleThreeTime"), getValue(data, "scheduleThreeClass"), getValue(data, "scheduleThreeTeacher")],
    [getValue(data, "scheduleFourDay"), getValue(data, "scheduleFourTime"), getValue(data, "scheduleFourClass"), getValue(data, "scheduleFourTeacher")],
  ];

  return (
    <section id="schedule" data-template-section-type="schedule" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "scheduleEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-none text-white md:text-7xl">{getValue(data, "sectionScheduleTitle")}</h2>
        </Reveal>
        <div className="mt-14 border-y border-white/14">
          {rows.map(([day, time, title, teacher], index) => (
            <Reveal key={`${day}-${time}`} delayMs={index * 80} variant="up">
              <div className="aura-schedule-row grid gap-4 border-b border-white/10 py-7 last:border-b-0 md:grid-cols-[0.8fr_0.8fr_1.4fr_1fr] md:items-center">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--p)]">{day}</p>
                <p className="t-display text-2xl sm:text-4xl font-semibold text-white">{time}</p>
                <p className="text-xl font-semibold text-white">{title}</p>
                <p className="text-sm leading-6 text-[var(--muted)]">{teacher}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Teachers({ data }: { data: Record<string, any> }) {
  const teachers = [
    [getValue(data, "teacherOneName"), getValue(data, "teacherOneRole"), getValue(data, "teacherOneImage")],
    [getValue(data, "teacherTwoName"), getValue(data, "teacherTwoRole"), getValue(data, "teacherTwoImage")],
    [getValue(data, "teacherThreeName"), getValue(data, "teacherThreeRole"), getValue(data, "teacherThreeImage")],
  ];

  return (
    <section id="teachers" data-template-section-type="team" className="bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "teachersEyebrow")}</p>
            <h2 className="t-display mt-4 text-5xl font-semibold leading-none text-white md:text-7xl">{getValue(data, "sectionTeachersTitle")}</h2>
          </div>
          <p className="max-w-lg text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionTeachersText")}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {teachers.map(([name, role, image], index) => (
            <Reveal key={name} delayMs={index * 120} variant="scale">
              <article className="aura-teacher-card border-2 border-[var(--p)]/55 bg-[var(--surface)] p-4">
                <img src={image} alt="" className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <h3 className="t-display text-2xl sm:text-4xl font-semibold text-white">{name}</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--p)]">{role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RetreatCta({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="cta" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-white/12 bg-[var(--surface)] lg:grid-cols-2">
        <Reveal variant="right" className="relative min-h-[440px]">
          <img src={getValue(data, "retreatImage")} alt="" className="aura-retreat-image absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/70 to-transparent" />
        </Reveal>
        <Reveal variant="left" className="flex items-center p-8 md:p-12 lg:p-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "retreatEyebrow")}</p>
            <h2 className="t-display mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">{getValue(data, "retreatTitle")}</h2>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "retreatText")}</p>
            <a href="#join" className="mt-9 inline-flex bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)] transition hover:bg-white">{getValue(data, "retreatButton")}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName")],
  ];

  return (
    <section data-template-section-type="testimonials" className="relative overflow-hidden bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="aura-quote-bg">”</div>
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "testimonialsEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-none text-white md:text-7xl">{getValue(data, "sectionTestimonialsTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map(([text, name], index) => (
            <Reveal key={name} delayMs={index * 120} variant="up">
              <blockquote className="aura-review min-h-[320px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <p className="t-display text-3xl md:text-7xl font-semibold leading-none text-[var(--p)]">”</p>
                <p className="mt-8 text-2xl font-light leading-10 text-white">{text}</p>
                <footer className="mt-10 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinForm({ data }: { data: Record<string, any> }) {
  return (
    <section id="join" data-template-section-type="contact" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 border border-[var(--p)]/25 bg-[var(--surface)]/80 p-7 backdrop-blur-md md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
        <Reveal variant="right">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-semibold leading-tight text-white md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-medium text-white/72">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4" data-bizuply-block="lead-form" data-bizuply-form-id="aurayoga-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  aria-label="שם מלא" placeholder="שם מלא" className="aura-input border border-white/12 bg-[var(--dark)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  aria-label="טלפון" placeholder="טלפון" className="aura-input border border-white/12 bg-[var(--dark)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <input name="email" data-bizuply-form-field-id="email" type="email" autoComplete="email"  aria-label="אימייל" placeholder="אימייל" className="aura-input border border-white/12 bg-[var(--dark)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <textarea name="message" data-bizuply-form-field-id="message"  aria-label="מה תרצו לתרגל" placeholder="מה תרצו לתרגל?" rows={4} className="aura-input border border-white/12 bg-[var(--dark)] px-5 py-4 text-white outline-none focus:border-[var(--p)]" />
            <button type="submit" className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)] transition hover:bg-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function FooterCta({ data }: { data: Record<string, any> }) {
  return (
    <footer data-template-section-type="footer" className="aura-footer-gradient px-5 py-16 lg:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="t-display text-5xl font-semibold text-white md:text-7xl">{getValue(data, "ctaTitle")}</p>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/76">{getValue(data, "ctaText")}</p>
        </div>
        <a href="#join" className="border border-white/60 bg-white/10 px-9 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[var(--dark)]">{getValue(data, "ctaButton")}</a>
      </Reveal>
    </footer>
  );
}

export default function AurayogaPages({
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
}: AurayogaPagesProps) {
  const mergedData = useMemo(() => ({ ...aurayogaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  const pageContent = (
    <>
      <Header data={mergedData} />
      <Hero data={mergedData} />
      <Classes data={mergedData} />
      <Benefits data={mergedData} />
      <Schedule data={mergedData} />
      <Teachers data={mergedData} />
      <RetreatCta data={mergedData} />
      <Testimonials data={mergedData} />
      <JoinForm data={mergedData} />
      <FooterCta data={mergedData} />
    </>
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "aurayoga-preview" : "aurayoga"} className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <style dangerouslySetInnerHTML={{ __html: aurayogaEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: pageContent }]} />
    </div>
  );
}
