import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { luminelleDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const luminellePages = [{ id: "home", label: "בית", slug: "/" }];

type LuminellePagesProps = {
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
  return data?.[key] ?? (luminelleDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}



function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", "bg-[#FDF8F6]/80 backdrop-blur-xl")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={"grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#D4A5A5] to-[#F5E6E0] text-sm font-bold text-[#3D2C2E]"}>{getValue(data, "logoText")}</span>
          <span className={"text-xl font-light tracking-[0.15em] uppercase"}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={"hidden rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#D4A5A5]/30 sm:inline-flex"}>
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
    <section data-template-section-type="hero" className={"relative px-5 py-24 text-center lg:px-8 lg:py-36"}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F5E6E0]/60 to-transparent" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A5A5]">{getValue(data, "heroEyebrow")}</p>
        <h1 className="mx-auto max-w-3xl whitespace-pre-line text-5xl font-light leading-[1.1] md:text-7xl">{getValue(data, "heroTitle")}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#9B8585]">{getValue(data, "heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openModal} className="rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-8 py-3.5 text-sm font-semibold text-white shadow-lg">{getValue(data, "heroPrimaryButton")}</button>
          <button type="button" className="rounded-full border border-[#D4A5A5]/40 px-8 py-3.5 text-sm font-semibold">{getValue(data, "heroSecondaryButton")}</button>
        </div>
        <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-[40px] shadow-2xl shadow-[#D4A5A5]/20">
          <img src={getValue(data, "heroImage")} alt="" className="h-72 w-full object-cover md:h-96" />
        </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={"rounded-[28px] bg-white p-5 text-center shadow-sm"}>
            <div className={"text-3xl font-light text-[#D4A5A5]"}>{num}</div>
            <div className={"mt-1 text-xs text-[#9B8585]"}>{label}</div>
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
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionTwoTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {items.map(([title, text]) => (
          <article key={title} className="rounded-[32px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#F5E6E0]" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#9B8585]">{text}</p>
            <p className="mt-4 text-sm font-semibold text-[#D4A5A5]">מ-₪180</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={"bg-gradient-to-b from-[#F5E6E0]/40 to-transparent px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionThreeTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] bg-[#9B8585]/20 p-2"><div className="flex h-64 items-center justify-center rounded-[28px] bg-[#e8ddd8] text-sm text-[#9B8585]">לפני</div></div>
        <div className="rounded-[32px] bg-[#D4A5A5]/20 p-2"><div className="flex h-64 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#F5E6E0] to-[#D4A5A5]/30 text-sm font-semibold text-[#3D2C2E]">אחרי ✨</div></div>
      </div>
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionFourTitle")}</h2>
      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-6">
        {["Kerastase","Olaplex","Moroccanoil","Davines"].map((brand) => (
          <div key={brand} className="rounded-[24px] border border-[#D4A5A5]/20 bg-white px-8 py-6 text-center shadow-sm">
            <p className="font-semibold">{brand}</p><p className="mt-1 text-xs text-[#9B8585]">מוצר פרימיום</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={"bg-gradient-to-b from-[#F5E6E0]/40 to-transparent px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionFiveTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {["נועה", "שירה", "מאיה"].map((name) => (
          <div key={name} className="text-center">
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-[#D4A5A5] to-[#F5E6E0]" />
            <h3 className="mt-4 font-semibold">{name}</h3>
            <p className="text-sm text-[#9B8585]">מעצב/ת ראשי/ת</p>
          </div>
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
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={"rounded-[28px] bg-white p-8 shadow-sm"}>
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
    <section data-template-section-type="section-7" className={"bg-gradient-to-b from-[#F5E6E0]/40 to-transparent px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={"overflow-hidden rounded-[24px] bg-white shadow-sm"}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={"grid h-8 w-8 place-items-center rounded-full bg-[#D4A5A5]/20 text-[#D4A5A5]"}>{open === i ? "−" : "+"}</span>
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
      <div className={"mx-auto grid max-w-5xl gap-10 lg:grid-cols-2"}>
        <div>
          <h2 className={"text-center text-4xl font-light md:text-5xl"}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={"grid gap-4 rounded-[32px] bg-white p-8 shadow-lg"}>
          <input className={"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"} placeholder="שם מלא" />
          <input className={"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"} placeholder="טלפון" />
          <input className={"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={"w-full rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-7 py-4 text-sm font-semibold text-white"}>
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
      <div className={"mx-auto max-w-5xl rounded-[40px] bg-gradient-to-r from-[#D4A5A5] to-[#c49090] p-10 text-center text-white lg:p-16"}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", "w-full rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-7 py-4 text-sm font-semibold text-white")}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · Luminelle
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={"relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl"}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"} placeholder="שם מלא" />
          <input className={"rounded-2xl border border-[#D4A5A5]/20 px-5 py-4 text-right outline-none focus:border-[#D4A5A5]"} placeholder="טלפון" />
          <button type="button" className={"w-full rounded-full bg-gradient-to-r from-[#D4A5A5] to-[#c49090] px-7 py-4 text-sm font-semibold text-white"}>{getValue(data, "contactButton")}</button>
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

export default function LuminellePages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: LuminellePagesProps) {
  const mergedData = useMemo(() => ({ ...luminelleDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "luminelle-preview" : "luminelle"}
      className={cx("min-h-screen w-full overflow-x-hidden", "bg-[#FDF8F6] font-sans text-[#3D2C2E]")}
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
