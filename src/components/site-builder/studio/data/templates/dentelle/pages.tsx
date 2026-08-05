import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { dentelleDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { dentelleEditorCss } from "./editorCss";

export const dentellePages = [{ id: "home", label: "בית", slug: "/" }];

type DentellePagesProps = {
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
  const value = data?.[key];
  if (value === undefined || value === null || value === "") {
    return (dentelleDefaultData as Record<string, any>)[key] ?? "";
  }
  return value;
}

function getImage(data: Record<string, any>, key: string) {
  return String(getValue(data, key) || (dentelleDefaultData as Record<string, any>)[key]);
}

function getNumber(data: Record<string, any>, key: string) {
  const parsed = Number(getValue(data, key));
  return Number.isFinite(parsed) ? parsed : 0;
}

function TrustCounter({
  target,
  label,
  suffix = "",
  delayMs = 0,
}: {
  target: number;
  label: string;
  suffix?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const value = useCountUp(target, active, 1350);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delayMs={delayMs} variant="scale">
      <div ref={ref} className="de-badge flex aspect-square flex-col justify-between border border-[var(--p)]/30 p-5">
        <strong className="de-display text-4xl font-bold tracking-[-0.05em] text-[var(--dark)] md:text-6xl">
          {value}
          {suffix}
        </strong>
        <p className="text-sm font-semibold leading-6 text-[var(--muted)]">{label}</p>
      </div>
    </Reveal>
  );
}

function Header({ data }: { data: Record<string, any> }) {
  const links = [
    [getValue(data, "navTreatments"), "#treatments"],
    [getValue(data, "navDoctors"), "#doctors"],
    [getValue(data, "navComfort"), "#comfort"],
    [getValue(data, "navAppointment"), "#appointment"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/94 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">{getValue(data, "logoText")}</span>
          <span className="de-display text-3xl font-semibold tracking-[-0.05em] text-[var(--dark)]">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--muted)] lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-[var(--p)]">
              {label}
            </a>
          ))}
        </nav>
        <a href="#appointment" className="border border-[var(--p)] bg-white px-5 py-2.5 text-sm font-black text-[var(--dark)] transition hover:bg-[var(--p)] hover:text-white">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="bg-[var(--bg)] px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal variant="right" className="order-2 lg:order-1">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="de-display mt-5 text-[clamp(4.2rem,13vw,11rem)] font-semibold leading-[0.82] tracking-[-0.1em] text-[var(--dark)]">
            {getValue(data, "brandName")}
          </h1>
          <span className="de-underline mt-5 block h-2 w-52 bg-[var(--p)]" />
          <h2 className="mt-8 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[var(--dark)] md:text-6xl">{getValue(data, "heroTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#appointment" className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white shadow-[0_20px_70px_rgba(45,212,191,0.25)] transition hover:-translate-y-1 hover:bg-[var(--dark)]">
              {getValue(data, "heroPrimaryButton")}
            </a>
            <a href="#treatments" className="border border-slate-300 bg-white px-8 py-4 text-sm font-black text-[var(--dark)] transition hover:border-[var(--p)] hover:text-[var(--p)]">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={140} className="order-1 lg:order-2">
          <div className="de-hero-frame de-teal-glow relative overflow-hidden border border-[var(--p)]/28 bg-white p-4">
            <div className="aspect-[4/5] overflow-hidden bg-slate-100 md:aspect-[5/4] lg:aspect-[4/5]">
              <img src={getImage(data, "heroImage")} alt="" className="de-hero-image h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-8 right-8 max-w-[260px] border border-[var(--p)]/35 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <span className="block h-1 w-20 bg-[var(--p)]" />
              <p className="mt-4 text-sm font-extrabold leading-6 text-[var(--dark)]">{getValue(data, "heroBadge")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustBadges({ data }: { data: Record<string, any> }) {
  const badges = [
    [getNumber(data, "trustOneNumber"), getValue(data, "trustOneLabel"), "+"],
    [getNumber(data, "trustTwoNumber"), getValue(data, "trustTwoLabel"), "+"],
    [getNumber(data, "trustThreeNumber"), getValue(data, "trustThreeLabel"), "%"],
    [getNumber(data, "trustFourNumber"), getValue(data, "trustFourLabel"), ""],
  ] as const;

  return (
    <section data-template-section-type="trust" className="bg-white px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
        {badges.map(([target, label, suffix], index) => (
          <TrustCounter key={label} target={target} label={label} suffix={suffix} delayMs={index * 90} />
        ))}
      </div>
    </section>
  );
}

function Treatments({ data }: { data: Record<string, any> }) {
  const treatments = [
    [getValue(data, "treatmentOneTitle"), getValue(data, "treatmentOneText"), getValue(data, "treatmentOnePrice")],
    [getValue(data, "treatmentTwoTitle"), getValue(data, "treatmentTwoText"), getValue(data, "treatmentTwoPrice")],
    [getValue(data, "treatmentThreeTitle"), getValue(data, "treatmentThreeText"), getValue(data, "treatmentThreePrice")],
    [getValue(data, "treatmentFourTitle"), getValue(data, "treatmentFourText"), getValue(data, "treatmentFourPrice")],
  ];

  return (
    <section id="treatments" data-template-section-type="treatments" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "treatmentsEyebrow")}</p>
          <h2 className="de-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--dark)] md:text-7xl">{getValue(data, "treatmentsTitle")}</h2>
        </Reveal>
        <div className="mt-14 border-y border-slate-200 bg-white">
          {treatments.map(([title, text, price], index) => (
            <Reveal key={title} delayMs={index * 85}>
              <article className="grid gap-4 border-t border-slate-200 px-5 py-7 first:border-t-0 md:grid-cols-[0.65fr_1fr_0.5fr] md:items-center md:px-8">
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--dark)]">{title}</h3>
                <div className="grid gap-3 md:grid-cols-[1fr_0.28fr] md:items-center">
                  <p className="text-sm leading-7 text-[var(--muted)]">{text}</p>
                  <span className="de-dot-leader hidden h-4 md:block" />
                </div>
                <strong className="text-right text-lg font-black text-[var(--p)] md:text-xl">{price}</strong>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ data }: { data: Record<string, any> }) {
  const [selected, setSelected] = useState<"before" | "after">("after");
  const image = selected === "before" ? getImage(data, "beforeImage") : getImage(data, "afterImage");
  const label = selected === "before" ? getValue(data, "beforeLabel") : getValue(data, "afterLabel");

  return (
    <section data-template-section-type="before-after" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "beforeAfterEyebrow")}</p>
          <h2 className="de-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--dark)] md:text-6xl">{getValue(data, "beforeAfterTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "beforeAfterText")}</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 border border-[var(--p)]/35 bg-[var(--bg)] p-1">
            {(["before", "after"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelected(mode)}
                className={["px-5 py-3 text-sm font-black transition", selected === mode ? "bg-[var(--p)] text-white" : "text-[var(--muted)] hover:text-[var(--dark)]"].join(" ")}
              >
                {mode === "before" ? getValue(data, "beforeLabel") : getValue(data, "afterLabel")}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="grid gap-4 md:grid-cols-[1fr_0.36fr]">
            <div className="de-image-hover relative aspect-[5/4] overflow-hidden border border-slate-200 bg-slate-100">
              <img src={image} alt="" className="de-img h-full w-full object-cover" />
              <span className="absolute right-5 top-5 bg-white px-4 py-2 text-xs font-black text-[var(--p)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">{label}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <button type="button" onClick={() => setSelected("before")} className="de-image-hover aspect-square overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getImage(data, "beforeImage")} alt="" className="de-img h-full w-full object-cover" />
              </button>
              <button type="button" onClick={() => setSelected("after")} className="de-image-hover aspect-square overflow-hidden border border-[var(--p)] bg-slate-100">
                <img src={getImage(data, "afterImage")} alt="" className="de-img h-full w-full object-cover" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Doctors({ data }: { data: Record<string, any> }) {
  const doctors = [
    [getValue(data, "doctorOneName"), getValue(data, "doctorOneRole"), getImage(data, "doctorOneImage")],
    [getValue(data, "doctorTwoName"), getValue(data, "doctorTwoRole"), getImage(data, "doctorTwoImage")],
    [getValue(data, "doctorThreeName"), getValue(data, "doctorThreeRole"), getImage(data, "doctorThreeImage")],
    [getValue(data, "doctorFourName"), getValue(data, "doctorFourRole"), getImage(data, "doctorFourImage")],
  ];

  return (
    <section id="doctors" data-template-section-type="doctors" className="bg-[var(--bg)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "doctorsEyebrow")}</p>
          <h2 className="de-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--dark)] md:text-7xl">{getValue(data, "doctorsTitle")}</h2>
        </Reveal>
      </div>
      <div className="de-portrait-strip mt-12 flex gap-5 overflow-x-auto px-5 pb-4 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {doctors.map(([name, role, image], index) => (
          <Reveal key={name} delayMs={index * 95} variant="scale" className="shrink-0">
            <article className="de-doctor-card w-[260px] border border-slate-200 bg-white p-4 md:w-[310px]">
              <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                <img src={image} alt="" className="de-img h-full w-full object-cover" />
              </div>
              <div className="pt-5">
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--dark)]">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{role}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ComfortTech({ data }: { data: Record<string, any> }) {
  const features = [
    [getValue(data, "comfortOneTitle"), getValue(data, "comfortOneText"), getImage(data, "comfortOneImage")],
    [getValue(data, "comfortTwoTitle"), getValue(data, "comfortTwoText"), getImage(data, "comfortTwoImage")],
  ];

  return (
    <section id="comfort" data-template-section-type="comfort-tech" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "comfortEyebrow")}</p>
          <h2 className="de-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--dark)] md:text-7xl">{getValue(data, "comfortTitle")}</h2>
        </Reveal>
        <div className="mt-14 space-y-8">
          {features.map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 120} variant={index % 2 === 0 ? "right" : "left"}>
              <article className={["grid gap-6 border border-slate-200 bg-[var(--bg)] p-4 lg:grid-cols-2 lg:items-center lg:p-6", index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""].join(" ")}>
                <div className="de-image-hover aspect-square overflow-hidden bg-slate-100">
                  <img src={image} alt="" className="de-img h-full w-full object-cover" />
                </div>
                <div className="p-4 md:p-8">
                  <span className="block h-1 w-24 bg-[var(--p)]" />
                  <h3 className="de-display mt-7 text-4xl font-semibold tracking-[-0.05em] text-[var(--dark)] md:text-6xl">{title}</h3>
                  <p className="mt-5 text-base leading-8 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const quotes = [
    [getValue(data, "testimonialOneText"), getValue(data, "testimonialOneName")],
    [getValue(data, "testimonialTwoText"), getValue(data, "testimonialTwoName")],
    [getValue(data, "testimonialThreeText"), getValue(data, "testimonialThreeName")],
  ];

  return (
    <section data-template-section-type="testimonials" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "testimonialsEyebrow")}</p>
          <h2 className="de-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--dark)] md:text-7xl">{getValue(data, "testimonialsTitle")}</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {quotes.map(([text, name], index) => (
            <Reveal key={name} delayMs={index * 110} variant="scale">
              <article className="de-quote flex aspect-square flex-col justify-between border border-[var(--p)]/35 bg-white p-7">
                <span className="de-display text-3xl md:text-7xl leading-none text-[var(--p)]">“</span>
                <p className="text-base font-semibold leading-8 text-[var(--dark)]">{text}</p>
                <strong className="text-sm font-black text-[var(--p)]">{name}</strong>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Appointment({ data }: { data: Record<string, any> }) {
  return (
    <section id="appointment" data-template-section-type="appointment" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactTitle")}</p>
          <h2 className="de-display mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--dark)] md:text-8xl">{getValue(data, "appointmentTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "appointmentText")}</p>
          <div className="mt-8 border-r-4 border-[var(--p)] pr-5 text-sm font-bold leading-7 text-[var(--dark)]">
            {getValue(data, "phone")}<br />
            {getValue(data, "email")}<br />
            {getValue(data, "address")}
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={140}>
          <form className="de-teal-glow flex min-h-[560px] flex-col justify-between border border-[var(--p)]/30 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:aspect-square lg:p-10" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="dentelle-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <div>
              <h3 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--dark)]">{getValue(data, "contactText")}</h3>
              <div className="mt-8 grid gap-4">
                <input className="de-field px-4 py-4" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
                <input className="de-field px-4 py-4" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
                <input className="de-field px-4 py-4" placeholder="טיפול שמעניין אתכם"  name="other" data-bizuply-form-field-id="other" />
                <textarea className="de-field min-h-[130px] px-4 py-4" placeholder="מה חשוב לנו לדעת לפני השיחה?"  name="other_2" data-bizuply-form-field-id="other_2"></textarea>
              </div>
            </div>
            <button type="submit" className="mt-6 bg-[var(--p)] px-8 py-4 text-sm font-black text-white transition hover:bg-[var(--dark)]">
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
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <Reveal variant="right">
          <h2 className="de-display text-5xl font-semibold leading-[0.94] tracking-[-0.06em] md:text-8xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/82">{getValue(data, "ctaText")}</p>
        </Reveal>
        <Reveal variant="left" delayMs={120} className="flex flex-col gap-5 lg:items-end">
          <a href="#appointment" className="border-2 border-white bg-white px-9 py-4 text-center text-sm font-black text-[var(--p)] transition hover:bg-transparent hover:text-white">
            {getValue(data, "ctaButton")}
          </a>
          <p className="text-sm font-bold">{getValue(data, "email")} / {getValue(data, "phone")}</p>
        </Reveal>
      </div>
    </footer>
  );
}

export default function DentellePages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: DentellePagesProps) {
  const mergedData = useMemo(() => ({ ...dentelleDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id="dentelle" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: dentelleEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: (
        <>
          <Header data={mergedData} />
          <Hero data={mergedData} />
          <TrustBadges data={mergedData} />
          <Treatments data={mergedData} />
          <BeforeAfter data={mergedData} />
          <Doctors data={mergedData} />
          <ComfortTech data={mergedData} />
          <Testimonials data={mergedData} />
          <Appointment data={mergedData} />
          <Footer data={mergedData} />
        </>
      ) }]} />
    </div>
  );
}
