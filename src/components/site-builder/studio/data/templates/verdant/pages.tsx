import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { verdantDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}



function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", "border-b border-[#B8956B]/20 bg-[#F7F3ED]/95 backdrop-blur-md")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={"grid h-10 w-10 place-items-center rounded-none border-2 border-[#B8956B] text-lg font-bold text-[#B8956B]"}>{getValue(data, "logoText")}</span>
          <span className={"text-xl font-bold tracking-wide"}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={"hidden rounded-none border-2 border-[#B8956B] bg-[#B8956B] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1C1C1C] sm:inline-flex"}>
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
    <section data-template-section-type="hero" className={"relative px-5 py-20 lg:px-8 lg:py-32"}>
      <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B8956B]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B6560]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="border-2 border-[#B8956B] bg-[#B8956B] px-8 py-3.5 text-sm font-semibold text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" className="border-2 border-[#1C1C1C] px-8 py-3.5 text-sm font-semibold">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden">
          <img src={getValue(data, "heroImage")} alt="" className="h-[480px] w-full object-cover" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={"border border-[#B8956B]/30 bg-white p-5 text-center"}>
            <div className={"text-3xl font-bold text-[#B8956B]"}>{num}</div>
            <div className={"mt-1 text-xs text-[#6B6560]"}>{label}</div>
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
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionTwoTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
        {items.map(([title, text]) => (
          <article key={title} className="group overflow-hidden border border-[#B8956B]/20 bg-white transition hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-[#B8956B]/20 to-[#F7F3ED]" />
            <div className="p-6">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6B6560]">{text}</p>
              <p className="mt-4 text-sm font-bold text-[#B8956B]">₪4,200,000 · 5 חד׳ · 180 מ״ר</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={"bg-white px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionThreeTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-3 gap-8 text-center">
        {[["₪2.4B","נכסים שנמכרו"],["340+","לקוחות"],["15","שנות ניסיון"]].map(([n,l]) => (
          <div key={l}><div className="text-5xl font-bold text-[#B8956B]">{n}</div><div className="mt-2 text-sm text-[#6B6560]">{l}</div></div>
        ))}
      </div>
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionFourTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
        {["שרה מ.", "דוד ר.", "מאיה ל."].map((name) => (
          <div key={name} className="text-center">
            <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-[#B8956B] to-[#D4AF7A]" />
            <h3 className="mt-4 text-lg font-bold">{name}</h3>
            <p className="text-sm text-[#6B6560]">סוכן/ת נדל״ן בכיר/ה</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={"bg-white px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionFiveTitle")}</h2>
      <div className="mx-auto mt-12 max-w-4xl overflow-hidden border border-[#B8956B]/30">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#1C1C1C] p-10 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8956B]">360° Virtual Tour</p>
            <h3 className="mt-4 text-2xl font-bold">סיירו בנכס מהבית</h3>
            <p className="mt-3 text-sm text-white/70">חוויה אינטראקטיבית מלאה — כל חדר, כל זווית.</p>
            <button type="button" className="mt-6 w-fit border border-[#B8956B] px-6 py-3 text-sm font-semibold text-[#B8956B]">התחל סיור</button>
          </div>
          <div className="h-64 bg-gradient-to-br from-[#B8956B]/40 to-[#F7F3ED] lg:h-auto" />
        </div>
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
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={"border border-[#B8956B]/20 bg-[#F7F3ED] p-8"}>
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
      <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={"border border-[#B8956B]/20 bg-white"}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={"grid h-8 w-8 place-items-center border border-[#B8956B] text-[#B8956B]"}>{open === i ? "−" : "+"}</span>
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
      <div className={"mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"}>
        <div>
          <h2 className={"text-center text-4xl font-bold md:text-5xl"}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={"grid gap-4 rounded-none border border-[#B8956B]/20 bg-white p-8"}>
          <input className={"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"} placeholder="שם מלא" />
          <input className={"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"} placeholder="טלפון" />
          <input className={"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={"w-full border-2 border-[#B8956B] bg-[#B8956B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1C1C1C]"}>
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
      <div className={"mx-auto max-w-7xl border-2 border-[#B8956B] bg-[#1C1C1C] p-10 text-center text-white lg:p-16"}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", "w-full border-2 border-[#B8956B] bg-[#B8956B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1C1C1C]")}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · Verdant
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={"relative w-full max-w-md border-2 border-[#B8956B] bg-white p-8"}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"} placeholder="שם מלא" />
          <input className={"rounded-none border border-[#B8956B]/30 px-5 py-4 text-right outline-none focus:border-[#B8956B]"} placeholder="טלפון" />
          <button type="button" className={"w-full border-2 border-[#B8956B] bg-[#B8956B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1C1C1C]"}>{getValue(data, "contactButton")}</button>
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

export default function VerdantPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: VerdantPagesProps) {
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
      className={cx("min-h-screen w-full overflow-x-hidden", "bg-[#F7F3ED] font-serif text-[#1C1C1C]")}
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
