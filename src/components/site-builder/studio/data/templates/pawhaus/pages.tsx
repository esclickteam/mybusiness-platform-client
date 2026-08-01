import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { pawhausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { pawhausEditorCss } from "./editorCss";

export const pawhausPages = [{ id: "home", label: "בית", slug: "/" }];

type PawhausPagesProps = {
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
  return data?.[key] ?? (pawhausDefaultData as Record<string, any>)[key] ?? "";
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
      { threshold: 0.24, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data }: { data: Record<string, any> }) {
  const navItems = [
    [getValue(data, "navServices"), "#services"],
    [getValue(data, "navDaycare"), "#daycare"],
    [getValue(data, "navGrooming"), "#grooming"],
    [getValue(data, "navTeam"), "#team"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-[var(--p)]/18 bg-[var(--bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-[var(--text)]">
          <span className="grid h-11 w-11 place-items-center bg-[var(--p)] text-lg font-black text-white shadow-[0_12px_28px_rgba(245,158,11,0.28)]">{getValue(data, "logoText")}</span>
          <span className="t-serif text-3xl font-black tracking-[-0.04em]">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--muted)] lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-[var(--p)]">{label}</a>
          ))}
        </nav>
        <a href="#booking" className="bg-[var(--dark)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--p)]">
          {getValue(data, "navBooking")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative overflow-hidden bg-[var(--bg)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="pawhaus-paw-print absolute -left-24 top-24 h-72 w-72 border-[34px] border-[var(--p)]/10" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <Reveal variant="right" className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="t-serif pawhaus-brand-pop mt-5 text-6xl font-black leading-[0.92] tracking-[-0.06em] text-[var(--dark)] md:text-8xl lg:text-[9.5rem]">
            {getValue(data, "brandName")}
          </h1>
          <h2 className="mt-7 max-w-3xl whitespace-pre-line text-4xl font-black leading-tight text-[var(--text)] md:text-6xl">
            {getValue(data, "heroTitle")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#booking" className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white shadow-[0_18px_42px_rgba(245,158,11,0.28)] transition hover:bg-[var(--dark)]">
              {getValue(data, "heroPrimaryButton")}
            </a>
            <a href="#services" className="border border-[var(--p)] bg-white/70 px-8 py-4 text-sm font-black text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="relative min-h-[560px]">
            <div className="absolute left-0 top-0 h-[78%] w-[78%] bg-[var(--p)]" />
            <img src={getValue(data, "heroImage")} alt="" className="pawhaus-hero-photo absolute right-0 top-8 h-[78%] w-[82%] object-cover shadow-[0_35px_100px_rgba(69,45,12,0.18)]" />
            <div className="pawhaus-float-card absolute bottom-0 right-8 w-64 border border-[var(--p)]/20 bg-white p-4 shadow-[0_22px_60px_rgba(69,45,12,0.14)]">
              <img src={getValue(data, "heroAltImage")} alt="" className="h-28 w-full object-cover" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">{getValue(data, "heroBadge")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText"), getValue(data, "serviceOneMeta")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText"), getValue(data, "serviceTwoMeta")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText"), getValue(data, "serviceThreeMeta")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText"), getValue(data, "serviceFourMeta")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
            <h2 className="t-serif mt-3 text-5xl font-black leading-none tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionTwoText")}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, text, meta], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="pawhaus-service-card flex aspect-square h-full flex-col justify-between border border-[var(--p)]/18 bg-[var(--bg)] p-6 shadow-[0_18px_50px_rgba(69,45,12,0.06)]">
                <span className="block h-2 w-full bg-[var(--p)]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">0{index + 1}</p>
                  <h3 className="t-serif mt-4 text-3xl font-black tracking-[-0.04em] text-[var(--dark)]">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <p className="border-t border-[var(--p)]/20 pt-4 text-sm font-black text-[var(--p)]">{meta}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DaycareMosaic({ data }: { data: Record<string, any> }) {
  return (
    <section id="daycare" data-template-section-type="daycare" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal variant="right" className="min-h-[560px] bg-white p-4 shadow-[0_24px_70px_rgba(69,45,12,0.08)]">
          <img src={getValue(data, "mosaicPrimaryImage")} alt="" className="h-full min-h-[520px] w-full object-cover" />
        </Reveal>
        <div className="grid gap-5">
          <Reveal variant="left">
            <div className="border border-[var(--p)]/20 bg-white p-8">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "mosaicEyebrow")}</p>
              <h2 className="t-serif mt-4 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionThreeTitle")}</h2>
              <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "sectionThreeText")}</p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {[getValue(data, "mosaicSecondaryImage"), getValue(data, "mosaicThirdImage")].map((image, index) => (
              <Reveal key={image} delayMs={index * 100} variant="scale">
                <img src={image} alt="" className="aspect-square w-full object-cover" />
              </Reveal>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [getValue(data, "featureOneTitle"), getValue(data, "featureOneText")],
              [getValue(data, "featureTwoTitle"), getValue(data, "featureTwoText")],
            ].map(([title, text], index) => (
              <Reveal key={title} delayMs={index * 110}>
                <article className="h-full bg-[var(--p)] p-6 text-white">
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/80">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountStat({ target, label, suffix = "", delayMs = 0 }: { target: number; label: string; suffix?: string; delayMs?: number }) {
  const { ref, visible } = useInViewOnce();
  const value = useCountUp(target, visible, 1450);

  return (
    <div ref={ref}>
      <Reveal delayMs={delayMs} variant="scale">
        <div className="pawhaus-stat-tile aspect-square border border-white/15 bg-white/10 p-6 text-white backdrop-blur">
          <p className="t-serif text-5xl font-black tracking-[-0.06em] md:text-7xl">{value.toLocaleString("he-IL")}{suffix}</p>
          <p className="mt-5 text-sm font-bold leading-7 text-white/78">{label}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [toNumber(getValue(data, "statOneValue")), getValue(data, "statOneLabel"), "+"],
    [toNumber(getValue(data, "statTwoValue")), getValue(data, "statTwoLabel"), ""],
    [toNumber(getValue(data, "statThreeValue")), getValue(data, "statThreeLabel"), ""],
    [toNumber(getValue(data, "statFourValue")), getValue(data, "statFourLabel"), "%"],
  ] as const;

  return (
    <section data-template-section-type="stats" className="relative overflow-hidden bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="pawhaus-amber-orb absolute -right-28 top-12 h-80 w-80 bg-[var(--p)]/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "statsEyebrow")}</p>
          <h2 className="t-serif mt-4 text-5xl font-black leading-none tracking-[-0.05em] text-white md:text-7xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(([target, label, suffix], index) => (
            <CountStat key={label} target={target} label={label} suffix={suffix} delayMs={index * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Grooming({ data }: { data: Record<string, any> }) {
  return (
    <section id="grooming" data-template-section-type="grooming" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "groomingEyebrow")}</p>
          <h2 className="t-serif mt-4 text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionFiveTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionFiveText")}</p>
          <a href="#booking" className="mt-8 inline-block bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</a>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="pawhaus-before-after relative grid min-h-[500px] grid-cols-1 sm:grid-cols-2 overflow-hidden border-[10px] border-[var(--bg)] shadow-[0_28px_80px_rgba(69,45,12,0.14)]">
            <div className="relative">
              <img src={getValue(data, "beforeImage")} alt="" className="h-full w-full object-cover" />
              <span className="absolute right-4 top-4 bg-[var(--dark)] px-4 py-2 text-xs font-black text-white">{getValue(data, "beforeLabel")}</span>
            </div>
            <div className="relative">
              <img src={getValue(data, "afterImage")} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 bg-[var(--p)] px-4 py-2 text-xs font-black text-white">{getValue(data, "afterLabel")}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const caregivers = [
    [getValue(data, "caregiverOneName"), getValue(data, "caregiverOneRole"), getValue(data, "caregiverOneImage")],
    [getValue(data, "caregiverTwoName"), getValue(data, "caregiverTwoRole"), getValue(data, "caregiverTwoImage")],
    [getValue(data, "caregiverThreeName"), getValue(data, "caregiverThreeRole"), getValue(data, "caregiverThreeImage")],
  ];

  return (
    <section id="team" data-template-section-type="team" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="t-serif mt-4 text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {caregivers.map(([name, role, image], index) => (
            <Reveal key={name} delayMs={index * 110} variant="up">
              <article className="pawhaus-team-card bg-white p-4 shadow-[0_20px_60px_rgba(69,45,12,0.08)]">
                <img src={image} alt="" className="aspect-[4/5] w-full object-cover" />
                <div className="border-t-8 border-[var(--p)] bg-white px-4 py-5">
                  <h3 className="text-2xl font-black text-[var(--dark)]">{name}</h3>
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">{role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="reviews" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "reviewsEyebrow")}</p>
            <h2 className="t-serif mt-4 text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionSevenTitle")}</h2>
          </div>
          <span className="hidden h-1 w-48 bg-[var(--p)] md:block" />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up">
              <blockquote className="h-full bg-[var(--bg)] p-7 shadow-[0_16px_48px_rgba(69,45,12,0.06)]">
                <p className="t-serif text-3xl md:text-6xl font-black leading-none text-[var(--p)]">"</p>
                <p className="mt-2 text-lg font-bold leading-8 text-[var(--dark)]">{text}</p>
                <footer className="mt-8 border-t border-[var(--p)]/20 pt-5">
                  <p className="font-black text-[var(--p)]">{name}</p>
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

function BookingForm({ data }: { data: Record<string, any> }) {
  return (
    <section id="booking" data-template-section-type="contact" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 border border-[var(--p)]/20 bg-white p-6 shadow-[0_24px_80px_rgba(69,45,12,0.08)] lg:grid-cols-[0.82fr_1.18fr] lg:p-10">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-serif mt-4 text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold text-[var(--dark)]">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4" data-bizuply-block="lead-form" data-bizuply-form-id="pawhaus-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  aria-label="שם מלא" className="border border-[var(--p)]/20 bg-[var(--bg)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
              <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  aria-label="טלפון" className="border border-[var(--p)]/20 bg-[var(--bg)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" placeholder="טלפון" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  aria-label="שם החיה" className="border border-[var(--p)]/20 bg-[var(--bg)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" placeholder="שם החיה" />
              <input aria-label="סוג וגיל" className="border border-[var(--p)]/20 bg-[var(--bg)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" placeholder="כלב / חתול וגיל" />
            </div>
            <textarea name="message" data-bizuply-form-field-id="message"  aria-label="מה חשוב לדעת" className="min-h-36 border border-[var(--p)]/20 bg-[var(--bg)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" placeholder="מה חשוב לנו לדעת לפני ההגעה?" />
            <button type="button" className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white transition hover:bg-[var(--dark)]">
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
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="t-serif text-2xl md:text-5xl font-black tracking-[-0.05em]">{getValue(data, "brandName")}</p>
          <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight md:text-5xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/82">{getValue(data, "ctaText")}</p>
        </div>
        <a href="#booking" className="bg-white px-8 py-4 text-sm font-black text-[var(--p)] shadow-[0_18px_45px_rgba(69,45,12,0.16)]">
          {getValue(data, "ctaButton")}
        </a>
      </div>
    </footer>
  );
}

export default function PawhausPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: PawhausPagesProps) {
  const mergedData = useMemo(() => ({ ...pawhausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "pawhaus-preview" : "pawhaus"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: pawhausEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: (
        <>
          <Header data={mergedData} />
          <Hero data={mergedData} />
          <Services data={mergedData} />
          <DaycareMosaic data={mergedData} />
          <Stats data={mergedData} />
          <Grooming data={mergedData} />
          <Team data={mergedData} />
          <Reviews data={mergedData} />
          <BookingForm data={mergedData} />
          <Footer data={mergedData} />
        </>
      ) }]} />
    </div>
  );
}
