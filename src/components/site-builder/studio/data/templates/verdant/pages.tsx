import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { verdantDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { verdantEditorCss } from "./editorCss";

export const verdantPages = [{ id: "home", label: "בית", slug: "/" }];

type VerdantPagesProps = {
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
  return data?.[key] ?? (verdantDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[var(--v-moss)] text-sm font-semibold tracking-[0.2em] text-[var(--v-moss)]">
            {getValue(data, "logoText")}
          </span>
          <span className="v-display text-2xl font-semibold tracking-wide text-white">
            {getValue(data, "brandName")}
          </span>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="hidden border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[var(--v-moss)] hover:bg-[var(--v-moss)] hover:text-[#0e1210] sm:inline-flex"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img
        src={getValue(data, "heroImage")}
        alt=""
        className="v-kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1210] via-[#0e1210]/55 to-[#0e1210]/25" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
        <p className="v-anim text-xs font-semibold uppercase tracking-[0.32em] text-[var(--v-moss)]">
          {getValue(data, "heroEyebrow")}
        </p>
        <h1 className="v-display v-anim v-anim-d1 mt-4 max-w-4xl whitespace-pre-line text-5xl font-semibold leading-[0.98] text-white md:text-7xl lg:text-8xl">
          {getValue(data, "heroTitle")}
        </h1>
        <div className="v-underline mt-5 h-px w-28 bg-[var(--v-moss)]" />
        <p className="v-anim v-anim-d2 mt-6 max-w-xl text-base leading-8 text-[var(--v-stone)] md:text-lg">
          {getValue(data, "heroSubtitle")}
        </p>
        <div className="v-anim v-anim-d2 mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openModal}
            className="bg-[var(--v-moss)] px-8 py-3.5 text-sm font-semibold text-[#0e1210] transition hover:bg-[var(--v-stone)]"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button
            type="button"
            onClick={openModal}
            className="border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
          >
            {getValue(data, "heroSecondaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function Properties({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "itemOneMeta"), getValue(data, "itemOneImage")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "itemTwoMeta"), getValue(data, "itemTwoImage")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "itemThreeMeta"), getValue(data, "itemThreeImage")],
  ];
  return (
    <section data-template-section-type="properties" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "sectionTwoTitle")}</h2>
          <p className="mt-4 text-[var(--v-muted)]">{getValue(data, "sectionTwoText")}</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {items.map(([title, text, meta, image]) => (
            <article key={title} className="group">
              <div className="overflow-hidden">
                <img
                  src={image}
                  alt=""
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold tracking-[0.2em] text-[var(--v-moss)]">{meta}</p>
                <h3 className="v-display mt-2 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--v-muted)]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];
  return (
    <section data-template-section-type="stats" className="border-y border-white/10 bg-[var(--v-surface)] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {stats.map(([num, label]) => (
          <div key={label} className="text-center md:text-right">
            <div className="v-display text-5xl font-semibold text-[var(--v-moss)] md:text-6xl">{num}</div>
            <div className="mt-2 text-sm tracking-[0.12em] text-[var(--v-muted)]">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Agents({ data }: { data: Record<string, any> }) {
  const agents = [
    ["שרה מזרחי", "סוכנת בכירה · תל אביב"],
    ["דוד רוזן", "מומחה יוקרה · הרצליה"],
    ["מאיה לוי", "ליווי משקיעים · מרכז"],
  ];
  return (
    <section data-template-section-type="agents" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "sectionFourTitle")}</h2>
        <p className="mt-4 max-w-2xl text-[var(--v-muted)]">{getValue(data, "sectionFourText")}</p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {agents.map(([name, role], i) => (
            <div key={name} className="relative overflow-hidden bg-[var(--v-surface)] p-8">
              <div
                className="mb-8 h-40 w-full"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg,#5c7a5e,#1a2420)"
                      : i === 1
                        ? "linear-gradient(135deg,#3d4f42,#0e1210)"
                        : "linear-gradient(135deg,#7a9a78,#243028)",
                }}
              />
              <h3 className="v-display text-2xl font-semibold">{name}</h3>
              <p className="mt-2 text-sm text-[var(--v-muted)]">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VirtualTour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="virtual-tour" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-stretch overflow-hidden lg:grid-cols-2">
        <div className="bg-[var(--v-surface)] p-10 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--v-moss)]">360°</p>
          <h2 className="v-display mt-4 text-4xl font-semibold md:text-5xl">{getValue(data, "sectionFiveTitle")}</h2>
          <p className="mt-5 max-w-md leading-8 text-[var(--v-muted)]">{getValue(data, "sectionFiveText")}</p>
          <button
            type="button"
            className="mt-8 border border-[var(--v-moss)] px-6 py-3 text-sm font-semibold text-[var(--v-moss)] transition hover:bg-[var(--v-moss)] hover:text-[#0e1210]"
          >
            התחלת סיור
          </button>
        </div>
        <div className="relative min-h-[320px]">
          <img
            src={getValue(data, "itemTwoImage")}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0e1210]/25" />
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
    <section data-template-section-type="testimonials" className="bg-[var(--v-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "sectionSixTitle")}</h2>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {reviews.map(([text, name, role]) => (
            <blockquote key={name} className="border-t border-[var(--v-moss)]/40 pt-8">
              <p className="v-display text-xl leading-9 text-[var(--v-stone)]">“{text}”</p>
              <footer className="mt-6">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-[var(--v-muted)]">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    ["01", "שיחת היכרות", "מבינים תקציב, אזור וסגנון חיים."],
    ["02", "סיורים ממוקדים", "רק נכסים שבאמת מתאימים — בלי בזבוז זמן."],
    ["03", "ליווי עד חתימה", "משא ומתן, בדיקות, וסגירה רגועה."],
  ];
  return (
    <section data-template-section-type="process" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "sectionSevenTitle")}</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map(([num, title, text]) => (
            <div key={num}>
              <div className="v-display text-2xl md:text-5xl text-[var(--v-moss)]">{num}</div>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--v-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 max-w-md text-[var(--v-muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-3 text-sm">
            <p><span className="text-[var(--v-moss)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="text-[var(--v-moss)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="text-[var(--v-moss)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-4 bg-[var(--v-surface)] p-8" data-bizuply-block="lead-form" data-bizuply-form-id="verdant-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--v-moss)]" placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--v-moss)]" placeholder="טלפון" />
          <input className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--v-moss)]" placeholder="תקציב משוער" />
          <button type="button" onClick={openModal} className="bg-[var(--v-moss)] px-7 py-4 text-sm font-semibold text-[#0e1210]">
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-white/10 px-5 pb-10 pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="v-display text-4xl font-semibold md:text-5xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--v-muted)]">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-8 bg-white px-8 py-3.5 text-sm font-semibold text-[#0e1210]">
          {getValue(data, "ctaButton")}
        </button>
        <p className="mt-12 text-xs text-[var(--v-muted)]">
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[var(--v-surface)] p-8">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-white/70">×</button>
        <h3 className="v-display text-3xl font-semibold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-form-id="verdant-contact-2" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="button" className="bg-[var(--v-moss)] py-4 text-sm font-semibold text-[#0e1210]">
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
      <Properties data={data} />
      <Stats data={data} />
      <Agents data={data} />
      <VirtualTour data={data} />
      <Testimonials data={data} />
      <Process data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function VerdantPages({
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
}: VerdantPagesProps) {
  const mergedData = useMemo(() => ({ ...verdantDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "verdant-preview" : "verdant"}
      className="min-h-screen w-full overflow-x-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: verdantEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
