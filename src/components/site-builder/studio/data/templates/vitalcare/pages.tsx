import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vitalcareDefaultData } from "./defaultData";
import { vitalcareEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const vitalcarePages = [{ id: "home", label: "בית", slug: "/" }];

type VitalcarePagesProps = {
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
  return data?.[key] ?? (vitalcareDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const navItems = [
    [getValue(data, "navHome"), "#top"],
    [getValue(data, "navSpecialties"), "#specialties"],
    [getValue(data, "navDoctors"), "#doctors"],
    [getValue(data, "navInsurance"), "#insurance"],
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="fixed inset-x-0 top-0 z-50 px-4 py-4 lg:px-8"
    >
      <div className="vc-glass mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-2xl px-4 py-3 lg:px-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--vc-primary)] text-xs font-semibold tracking-[0.2em] text-white">
            {getValue(data, "logoText")}
          </span>
          <span className="vc-display text-2xl font-semibold text-[var(--vc-secondary)]">
            {getValue(data, "brandName")}
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--vc-muted)] lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-[var(--vc-primary)]">
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={openModal}
          className="rounded-xl bg-[var(--vc-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--vc-secondary)]"
        >
          {getValue(data, "navContact")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="top" data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--vc-dark)]">
      <img
        src={getValue(data, "heroImage")}
        alt=""
        className="vc-photo-motion absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[rgba(10,31,34,0.82)] via-[rgba(10,31,34,0.5)] to-[rgba(10,31,34,0.16)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,34,0.55)] via-transparent to-[rgba(10,31,34,0.12)]" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-14 pt-32 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <p className="vc-display vc-anim text-5xl font-semibold leading-none text-white md:text-7xl lg:text-8xl">
            {getValue(data, "brandName")}
          </p>
          <div className="vc-rule mt-5 h-px w-36 bg-[var(--vc-accent)]" />
          <p className="vc-anim vc-anim-d1 mt-7 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--vc-accent)]">
            {getValue(data, "heroEyebrow")}
          </p>
          <h1 className="vc-display vc-anim vc-anim-d2 mt-5 max-w-3xl whitespace-pre-line text-4xl font-semibold leading-[1.05] text-white md:text-6xl lg:text-7xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="vc-anim vc-anim-d3 mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            {getValue(data, "heroSubtitle")}
          </p>
          <button
            type="button"
            onClick={openModal}
            className="vc-anim vc-anim-d3 mt-9 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-[var(--vc-secondary)] transition hover:bg-[var(--vc-accent)]"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="vc-anim text-xs font-semibold uppercase tracking-[0.28em] text-[var(--vc-primary)]">{eyebrow}</p>
      <h2 className="vc-display vc-anim vc-anim-d1 mt-4 text-4xl font-semibold leading-tight text-[var(--vc-text)] md:text-5xl">
        {title}
      </h2>
      {text ? <p className="vc-anim vc-anim-d2 mt-5 text-base leading-8 text-[var(--vc-muted)]">{text}</p> : null}
    </div>
  );
}

function Specialties({ data }: { data: Record<string, any> }) {
  const specialties = [
    [getValue(data, "specialtyOneTitle"), getValue(data, "specialtyOneText")],
    [getValue(data, "specialtyTwoTitle"), getValue(data, "specialtyTwoText")],
    [getValue(data, "specialtyThreeTitle"), getValue(data, "specialtyThreeText")],
    [getValue(data, "specialtyFourTitle"), getValue(data, "specialtyFourText")],
    [getValue(data, "specialtyFiveTitle"), getValue(data, "specialtyFiveText")],
    [getValue(data, "specialtySixTitle"), getValue(data, "specialtySixText")],
  ];

  return (
    <section id="specialties" data-template-section-type="specialties" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "sectionTwoEyebrow")}
          title={getValue(data, "sectionTwoTitle")}
          text={getValue(data, "sectionTwoText")}
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {specialties.map(([title, text], index) => (
            <article
              key={title}
              className="vc-card-hover rounded-2xl border border-[var(--vc-line)] bg-[var(--vc-surface)] p-7"
            >
              <div className="text-sm font-semibold tracking-[0.24em] text-[var(--vc-primary)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-7 text-xl font-semibold text-[var(--vc-text)]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--vc-muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
    [getValue(data, "heroStatFour"), getValue(data, "heroStatFourLabel")],
  ];

  return (
    <section data-template-section-type="stats" className="bg-[var(--vc-secondary)] px-5 py-20 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.55fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--vc-accent)]">
            {getValue(data, "sectionThreeEyebrow")}
          </p>
          <h2 className="vc-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {getValue(data, "sectionThreeTitle")}
          </h2>
          <p className="mt-5 max-w-md leading-8 text-white/70">{getValue(data, "sectionThreeText")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([num, label]) => (
            <div key={label} className="border-t border-white/20 pt-6">
              <div className="vc-display text-4xl font-semibold text-[var(--vc-accent)] md:text-5xl">{num}</div>
              <div className="mt-3 text-sm leading-6 text-white/75">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Doctors({ data }: { data: Record<string, any> }) {
  const doctors = [
    [
      getValue(data, "doctorOneName"),
      getValue(data, "doctorOneRole"),
      getValue(data, "doctorOneText"),
      getValue(data, "doctorOneImage"),
    ],
    [
      getValue(data, "doctorTwoName"),
      getValue(data, "doctorTwoRole"),
      getValue(data, "doctorTwoText"),
      getValue(data, "doctorTwoImage"),
    ],
    [
      getValue(data, "doctorThreeName"),
      getValue(data, "doctorThreeRole"),
      getValue(data, "doctorThreeText"),
      getValue(data, "doctorThreeImage"),
    ],
  ];

  return (
    <section id="doctors" data-template-section-type="doctors" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--vc-primary)]">
              {getValue(data, "sectionFourEyebrow")}
            </p>
            <h2 className="vc-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {getValue(data, "sectionFourTitle")}
            </h2>
          </div>
          <p className="max-w-2xl leading-8 text-[var(--vc-muted)]">{getValue(data, "sectionFourText")}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {doctors.map(([name, role, text, image]) => (
            <article
              key={name}
              className="vc-card-hover overflow-hidden rounded-3xl border border-[var(--vc-line)] bg-[var(--vc-surface)]"
            >
              <img src={image} alt="" className="h-80 w-full object-cover" />
              <div className="p-7">
                <h3 className="vc-display text-3xl font-semibold text-[var(--vc-text)]">{name}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--vc-primary)]">{role}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--vc-muted)]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsurancePartners({ data }: { data: Record<string, any> }) {
  const partners = [
    getValue(data, "insuranceOne"),
    getValue(data, "insuranceTwo"),
    getValue(data, "insuranceThree"),
    getValue(data, "insuranceFour"),
    getValue(data, "insuranceFive"),
    getValue(data, "insuranceSix"),
  ];

  return (
    <section id="insurance" data-template-section-type="insurance" className="vc-shell px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "sectionFiveEyebrow")}
          title={getValue(data, "sectionFiveTitle")}
          text={getValue(data, "sectionFiveText")}
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner}
              className="rounded-2xl border border-[var(--vc-line)] bg-white px-5 py-6 text-center text-sm font-semibold text-[var(--vc-secondary)] shadow-[0_12px_34px_rgba(10,31,34,0.05)]"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow={getValue(data, "sectionSixEyebrow")} title={getValue(data, "sectionSixTitle")} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map(([text, name, role]) => (
            <blockquote
              key={name}
              className="vc-card-hover rounded-3xl border border-[var(--vc-line)] bg-[var(--vc-surface)] p-8"
            >
              <div className="h-px w-16 bg-[var(--vc-accent)]" />
              <p className="mt-7 text-lg leading-9 text-[var(--vc-text)]">״{text}״</p>
              <footer className="mt-8 border-t border-[var(--vc-line)] pt-5">
                <p className="font-semibold text-[var(--vc-text)]">{name}</p>
                <p className="mt-1 text-sm text-[var(--vc-muted)]">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function MedicalFaq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
    [getValue(data, "faqFourQuestion"), getValue(data, "faqFourAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="bg-[var(--vc-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.4fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--vc-primary)]">
            {getValue(data, "sectionSevenEyebrow")}
          </p>
          <h2 className="vc-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {getValue(data, "sectionSevenTitle")}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="rounded-2xl border border-[var(--vc-line)] bg-[var(--vc-background)]">
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-right"
              >
                <span className="text-base font-semibold text-[var(--vc-text)]">{question}</span>
                <span className="text-2xl leading-none text-[var(--vc-primary)]">{open === index ? "-" : "+"}</span>
              </button>
              {open === index ? (
                <p className="px-6 pb-6 text-sm leading-7 text-[var(--vc-muted)]">{answer}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppointmentForm({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="appointment" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--vc-line)] bg-[var(--vc-surface)] shadow-[var(--vc-shadow)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[var(--vc-secondary)] p-8 text-white md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--vc-accent)]">
            {getValue(data, "sectionEightEyebrow")}
          </p>
          <h2 className="vc-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {getValue(data, "sectionEightTitle")}
          </h2>
          <p className="mt-6 max-w-md leading-8 text-white/75">{getValue(data, "contactText")}</p>
          <div className="mt-10 space-y-4 text-sm text-white/75">
            <p>
              <span className="font-semibold text-white">טלפון</span> · {getValue(data, "phone")}
            </p>
            <p>
              <span className="font-semibold text-white">אימייל</span> · {getValue(data, "email")}
            </p>
            <p>
              <span className="font-semibold text-white">כתובת</span> · {getValue(data, "address")}
            </p>
            <p>
              <span className="font-semibold text-white">שעות פעילות</span> · {getValue(data, "hours")}
            </p>
          </div>
        </div>
        <form className="grid content-center gap-4 p-8 md:p-12">
          <h3 className="vc-display text-3xl font-semibold text-[var(--vc-text)]">{getValue(data, "contactTitle")}</h3>
          <input className="vc-input rounded-xl px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="vc-input rounded-xl px-5 py-4 text-right outline-none" placeholder="טלפון לחזרה" />
          <input className="vc-input rounded-xl px-5 py-4 text-right outline-none" placeholder="אימייל" />
          <select className="vc-input rounded-xl px-5 py-4 text-right text-[var(--vc-muted)] outline-none">
            <option>תחום רפואי מבוקש</option>
            <option>רפואת משפחה ופנימית</option>
            <option>קרדיולוגיה מניעתית</option>
            <option>אורתופדיה וכאב</option>
            <option>רפואת ילדים</option>
          </select>
          <button
            type="button"
            onClick={openModal}
            className="mt-2 rounded-xl bg-[var(--vc-primary)] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[var(--vc-secondary)]"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </section>
  );
}

function FooterCta({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[var(--vc-dark)] px-7 py-14 text-center text-white md:px-12 md:py-20">
        <p className="vc-display text-3xl font-semibold text-[var(--vc-accent)]">{getValue(data, "brandName")}</p>
        <h2 className="vc-display mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {getValue(data, "ctaTitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/70">{getValue(data, "ctaText")}</p>
        <button
          type="button"
          onClick={openModal}
          className="mt-9 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-[var(--vc-secondary)] transition hover:bg-[var(--vc-accent)]"
        >
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[var(--vc-line)] py-8 text-sm text-[var(--vc-muted)] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>{getValue(data, "address")}</p>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(10,31,34,0.72)] px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-[var(--vc-shadow)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 text-2xl leading-none text-[var(--vc-muted)]"
          aria-label="סגירה"
        >
          ×
        </button>
        <h3 className="vc-display text-3xl font-semibold text-[var(--vc-text)]">{getValue(data, "contactTitle")}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--vc-muted)]">{getValue(data, "contactText")}</p>
        <form className="mt-6 grid gap-3">
          <input className="vc-input rounded-xl px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="vc-input rounded-xl px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button
            type="button"
            className="rounded-xl bg-[var(--vc-primary)] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[var(--vc-secondary)]"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Specialties data={data} />
      <TrustStats data={data} />
      <Doctors data={data} />
      <InsurancePartners data={data} />
      <Testimonials data={data} />
      <MedicalFaq data={data} />
      <AppointmentForm data={data} openModal={openModal} />
      <FooterCta data={data} openModal={openModal} />
    </>
  );
}

export default function VitalcarePages({
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
}: VitalcarePagesProps) {
  const mergedData = useMemo(() => ({ ...vitalcareDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "vitalcare-preview" : "vitalcare"}
      className="min-h-screen w-full overflow-x-hidden bg-[var(--vc-background)] text-[var(--vc-text)]"
    >
      <style dangerouslySetInnerHTML={{ __html: vitalcareEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
