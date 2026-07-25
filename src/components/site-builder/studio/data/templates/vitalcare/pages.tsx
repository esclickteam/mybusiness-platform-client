import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vitalcareDefaultData } from "./defaultData";
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}



function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", "border-b-2 border-[#0EA5E9]/20 bg-white shadow-sm")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={"grid h-10 w-10 place-items-center rounded-lg bg-[#0EA5E9] text-xs font-bold text-white"}>{getValue(data, "logoText")}</span>
          <span className={"text-xl font-bold text-[#0C4A6E]"}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={"hidden rounded-lg bg-[#0EA5E9] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0C4A6E] sm:inline-flex"}>
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];
  return (
    <section data-template-section-type="hero" className={"bg-white px-5 py-16 lg:px-8 lg:py-24"}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#0EA5E9]/10 px-3 py-1.5 text-xs font-semibold text-[#0EA5E9]">✓ מרפאה מוסמכת</span>
          <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-5 text-lg leading-8 text-[#64748B]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="rounded-lg bg-[#0EA5E9] px-8 py-3.5 text-sm font-semibold text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" className="rounded-lg border-2 border-[#0EA5E9] px-8 py-3.5 text-sm font-semibold text-[#0EA5E9]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img src={getValue(data, "heroImage")} alt="" className="h-[400px] w-full object-cover" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={"rounded-xl border border-[#0EA5E9]/15 bg-white p-5 text-center shadow-sm"}>
            <div className={"text-3xl font-bold text-[#0EA5E9]"}>{num}</div>
            <div className={"mt-1 text-xs text-[#64748B]"}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTwo({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText")],
  ];
  return (
    <section data-template-section-type="section-2" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionTwoTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["רפואת משפחה", "אורתופדיה", "עור ואסתטיקה", "ילדים"].map((spec) => (
          <div key={spec} className="flex items-center gap-4 rounded-xl border border-[#0EA5E9]/15 bg-white p-5 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#0EA5E9]/10 text-xl">⚕</span>
            <span className="font-semibold">{spec}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={"bg-white px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionThreeTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 gap-6">
        {[["50K+","מטופלים"],["22","רופאים"],["98%","שביעות רצון"]].map(([n,l]) => (
          <div key={l} className="rounded-2xl bg-[#0EA5E9] p-8 text-center text-white">
            <div className="text-4xl font-bold">{n}</div><div className="mt-2 text-sm text-white/80">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionFourTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {["ד״ר אבי כהן", "ד״ר מירי לוי", "ד״ר רון שפירא"].map((name) => (
          <div key={name} className="rounded-xl border border-[#0EA5E9]/15 bg-[#F0F9FF] p-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-[#0EA5E9]/20" />
            <h3 className="mt-4 font-bold">{name}</h3>
            <p className="text-sm text-[#64748B]">מומחה/ית רפואית</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={"bg-white px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionFiveTitle")}</h2>
      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-8 opacity-70">
        {["כללית", "מכבי", "מאוחדת", "לאומית", "פרטי"].map((ins) => (
          <span key={ins} className="rounded-lg border border-[#0EA5E9]/20 bg-white px-6 py-3 text-sm font-semibold">{ins}</span>
        ))}
      </div>
    </section>
  );
}

function SectionSix({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];
  return (
    <section data-template-section-type="section-6" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={"rounded-xl border border-[#0EA5E9]/15 bg-white p-8 shadow-sm"}>
            <p className="text-base leading-8">"{text}"</p>
            <div className="mt-5 border-t pt-4">
              <p className="font-bold">{name}</p>
              <p className="text-sm opacity-60">{role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionSeven({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];
  return (
    <section data-template-section-type="section-7" className={"bg-white px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={"overflow-hidden rounded-xl border border-[#0EA5E9]/15 bg-white"}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={"grid h-8 w-8 place-items-center rounded-lg bg-[#0EA5E9] text-white"}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i ? <p className="px-5 pb-5 text-sm leading-7 opacity-70">{a}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionEight({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="section-8" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <div className={"mx-auto grid max-w-7xl gap-10 rounded-2xl bg-white p-8 shadow-lg lg:grid-cols-2 lg:p-12"}>
        <div>
          <h2 className={"text-center text-3xl font-bold md:text-4xl"}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={"grid gap-4"}>
          <input className={"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"} placeholder="שם מלא" />
          <input className={"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"} placeholder="טלפון" />
          <input className={"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={"w-full rounded-lg bg-[#0EA5E9] px-7 py-4 text-sm font-semibold text-white"}>
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className={"px-5 pb-10 lg:px-8"}>
      <div className={"mx-auto max-w-7xl rounded-2xl bg-[#0C4A6E] p-10 text-center text-white lg:p-16"}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", "w-full rounded-lg bg-[#0EA5E9] px-7 py-4 text-sm font-semibold text-white")}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · Vitalcare
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={"relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"} placeholder="שם מלא" />
          <input className={"rounded-lg border border-[#0EA5E9]/20 px-5 py-4 text-right outline-none focus:border-[#0EA5E9]"} placeholder="טלפון" />
          <button type="button" className={"w-full rounded-lg bg-[#0EA5E9] px-7 py-4 text-sm font-semibold text-white"}>{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <SectionTwo data={data} />
      <SectionThree data={data} />
      <SectionFour data={data} />
      <SectionFive data={data} />
      <SectionSix data={data} />
      <SectionSeven data={data} />
      <SectionEight data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function VitalcarePages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: VitalcarePagesProps) {
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
      className={cx("min-h-screen w-full overflow-x-hidden", "bg-[#F0F9FF] font-sans text-[#0C4A6E]")}
    >
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
