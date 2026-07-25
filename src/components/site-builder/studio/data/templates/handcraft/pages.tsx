import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { handcraftDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const handcraftPages = [{ id: "home", label: "בית", slug: "/" }];

type HandcraftPagesProps = {
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
  return data?.[key] ?? (handcraftDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}



function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", "border-b-4 border-[#F97316] bg-[#1C1917] text-white")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={"grid h-10 w-10 place-items-center bg-[#F97316] text-lg font-black text-white"}>{getValue(data, "logoText")}</span>
          <span className={"text-xl font-black uppercase tracking-tight"}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={"hidden bg-[#F97316] px-5 py-2.5 text-sm font-black uppercase text-white sm:inline-flex"}>
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
    <section data-template-section-type="hero" className={"relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24"}>
      <div className="absolute inset-0 -z-10 bg-[#1C1917]" />
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 skew-x-[-8deg] bg-[#F97316]/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="text-white">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="whitespace-pre-line text-5xl font-black leading-[0.95] md:text-7xl">{getValue(data, "heroTitle")}</h1>
            <p className="mt-5 max-w-lg text-white/70">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={openModal} className="bg-[#F97316] px-8 py-4 text-sm font-black uppercase">{getValue(data, "heroPrimaryButton")}</button>
              <a href={"tel:" + getValue(data, "phone")} className="text-2xl font-black text-[#F97316]">{getValue(data, "phone")}</a>
            </div>
          </div>
          <div className="overflow-hidden border-4 border-[#F97316]">
            <img src={getValue(data, "heroImage")} alt="" className="h-[380px] w-full object-cover grayscale hover:grayscale-0 transition duration-500" />
          </div>
        </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={"border-2 border-[#F97316] bg-white p-5 text-center"}>
            <div className={"text-3xl font-black text-[#F97316]"}>{num}</div>
            <div className={"mt-1 text-xs font-bold uppercase text-[#78716C]"}>{label}</div>
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
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionTwoTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["אינסטלציה","חשמל","שיפוצים","מיזוג"].map((svc) => (
          <div key={svc} className="group border-2 border-[#1C1917] p-6 transition hover:border-[#F97316] hover:bg-[#F97316] hover:text-white">
            <span className="text-3xl">🔧</span>
            <h3 className="mt-4 text-lg font-black uppercase">{svc}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={"bg-[#1C1917] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionThreeTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-2">
        <div className="border-2 border-red-500/50 p-4"><div className="flex h-48 items-center justify-center bg-red-500/10 text-sm font-black uppercase text-red-500">לפני — דליפה</div></div>
        <div className="border-2 border-[#F97316] p-4"><div className="flex h-48 items-center justify-center bg-[#F97316]/10 text-sm font-black uppercase text-[#F97316]">אחרי — תוקן ✓</div></div>
      </div>
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionFourTitle")}</h2>
      <div className="mx-auto mt-12 max-w-3xl space-y-4">
        {["טכנאים מוסמכים ומבוטחים","מחיר קבוע לפני תחילת עבודה","אחריות מלאה על כל עבודה","זמינות 24/7 לקריאות דחופות"].map((item) => (
          <div key={item} className="flex items-center gap-4 border-l-4 border-[#F97316] bg-white/5 py-3 pl-4">
            <span className="text-[#F97316]">✓</span><span className="font-bold">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={"bg-[#1C1917] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionFiveTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {[["קריאה","₪199","ביקור + אבחון"],["תיקון","₪350","עד שעתיים"],["פרויקט","הצעת מחיר","שיפוץ מלא"]].map(([name, price, desc]) => (
          <div key={name} className="border-2 border-[#F97316]/30 bg-[#FAFAF9] p-6 text-[#1C1917]">
            <h3 className="text-lg font-black uppercase">{name}</h3>
            <div className="mt-3 text-3xl font-black text-[#F97316]">{price}</div>
            <p className="mt-2 text-sm text-[#78716C]">{desc}</p>
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
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={"border-2 border-[#F97316]/30 bg-[#FAFAF9] p-8 text-[#1C1917]"}>
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
    <section data-template-section-type="section-7" className={"bg-[#1C1917] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={"border-2 border-white/10 bg-white/5"}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={"grid h-8 w-8 place-items-center bg-[#F97316] font-black text-white"}>{open === i ? "−" : "+"}</span>
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
          <h2 className={"text-center text-4xl font-black uppercase md:text-5xl"}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={"grid gap-4 border-2 border-[#F97316] bg-white p-8 text-[#1C1917]"}>
          <input className={"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"} placeholder="שם מלא" />
          <input className={"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"} placeholder="טלפון" />
          <input className={"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={"w-full bg-[#F97316] px-7 py-4 text-sm font-black uppercase text-white"}>
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
      <div className={"mx-auto max-w-7xl border-4 border-[#F97316] bg-[#1C1917] p-10 text-center text-white lg:p-16"}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", "w-full bg-[#F97316] px-7 py-4 text-sm font-black uppercase text-white")}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · Handcraft
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={"relative w-full max-w-md border-4 border-[#F97316] bg-white p-8"}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"} placeholder="שם מלא" />
          <input className={"border-2 border-[#1C1917]/20 px-5 py-4 text-right outline-none focus:border-[#F97316]"} placeholder="טלפון" />
          <button type="button" className={"w-full bg-[#F97316] px-7 py-4 text-sm font-black uppercase text-white"}>{getValue(data, "contactButton")}</button>
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

export default function HandcraftPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: HandcraftPagesProps) {
  const mergedData = useMemo(() => ({ ...handcraftDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "handcraft-preview" : "handcraft"}
      className={cx("min-h-screen w-full overflow-x-hidden", "bg-[#FAFAF9] font-sans text-[#1C1917]")}
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
