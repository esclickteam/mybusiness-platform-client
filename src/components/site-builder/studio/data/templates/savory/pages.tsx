import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { savoryDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const savoryPages = [{ id: "home", label: "בית", slug: "/" }];

type SavoryPagesProps = {
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
  return data?.[key] ?? (savoryDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}



function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className={cx("sticky top-0 z-50", "border-b border-[#C45C26]/15 bg-[#FAF6F0]/95 backdrop-blur-md")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className={"grid h-10 w-10 place-items-center rounded-full bg-[#C45C26] text-lg font-bold text-white"}>{getValue(data, "logoText")}</span>
          <span className={"font-serif text-2xl font-bold italic"}>{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className={"hidden rounded-full bg-[#C45C26] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2D1810] sm:inline-flex"}>
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
    <section data-template-section-type="hero" className={"px-5 py-16 lg:px-8 lg:py-24"}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl">
          <img src={getValue(data, "heroImage")} alt="" className="h-[420px] w-full object-cover" />
        </div>
        <div className="rounded-3xl bg-[#2D1810] p-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8A849]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="mt-4 whitespace-pre-line font-serif text-5xl font-bold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-5 text-white/70">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 grid gap-3">
            <input className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50" placeholder="תאריך" />
            <input className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50" placeholder="מספר אורחים" />
            <button type="button" onClick={openModal} className="rounded-xl bg-[#C45C26] py-3.5 font-semibold">{getValue(data, "heroPrimaryButton")}</button>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map(([num, label]) => (
          <div key={label} className={"rounded-2xl bg-[#2D1810]/5 p-5 text-center"}>
            <div className={"text-3xl font-bold text-[#C45C26]"}>{num}</div>
            <div className={"mt-1 text-xs text-[#8B7355]"}>{label}</div>
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
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionTwoTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-4xl gap-0 divide-y divide-[#C45C26]/20 border border-[#C45C26]/20">
        {items.map(([title, text], i) => (
          <article key={title} className="flex items-center justify-between gap-6 p-6">
            <div><h3 className="text-xl font-bold">{title}</h3><p className="mt-1 text-sm text-[#8B7355]">{text}</p></div>
            <span className="font-serif text-2xl font-bold text-[#C45C26]">₪{[89,124,68][i]}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionThree({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-3" className={"bg-[#2D1810] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionThreeTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="h-80 rounded-3xl bg-gradient-to-br from-[#C45C26]/30 to-[#E8A849]/20" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#E8A849]">השף</p>
          <h3 className="mt-4 font-serif text-3xl font-bold">שף יונתן לוי</h3>
          <p className="mt-4 leading-8 text-white/70">15 שנות ניסיון במסעדות מишלן ברחבי אירופה. מביא לישראל את הטעמים האותנטיים של הים התיכון.</p>
        </div>
      </div>
    </section>
  );
}

function SectionFour({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-4" className={"px-5 py-20 lg:px-8 lg:py-28"}>
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionFourTitle")}</h2>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {[1,2,3,4].map((n) => (
          <div key={n} className={cx("rounded-2xl bg-gradient-to-br from-[#C45C26]/20 to-[#E8A849]/10", n === 1 ? "col-span-2 row-span-2 h-64" : "h-32")} />
        ))}
      </div>
    </section>
  );
}

function SectionFive({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="section-5" className={"bg-[#2D1810] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionFiveTitle")}</h2>
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#C45C26]/20 bg-[#FAF6F0] p-10 text-center text-[#2D1810]">
        <div className="text-[#E8A849]">★★★★★</div>
        <p className="mt-4 font-serif text-xl italic">"חוויה קולינרית שלא שוכחים"</p>
        <p className="mt-4 text-sm text-[#8B7355]">אירועים פרטיים · עד 40 אורחים · תפריט מותאם</p>
        <button type="button" className="mt-6 rounded-full bg-[#C45C26] px-8 py-3 font-semibold text-white">פרטים נוספים</button>
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
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionSixTitle")}</h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(([text, name, role], i) => (
          <article key={i} className={"rounded-3xl bg-[#FAF6F0] p-8 text-[#2D1810]"}>
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
    <section data-template-section-type="section-7" className={"bg-[#2D1810] px-5 py-20 text-white lg:px-8 lg:py-28"}>
      <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "sectionSevenTitle")}</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className={"rounded-2xl bg-[#FAF6F0]/10"}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
              <span className="font-bold">{q}</span>
              <span className={"grid h-8 w-8 place-items-center rounded-full bg-[#C45C26] text-white"}>{open === i ? "−" : "+"}</span>
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
          <h2 className={"text-center font-serif text-4xl font-bold md:text-5xl"}>{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 opacity-70">{getValue(data, "contactText")}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p><strong>טלפון:</strong> {getValue(data, "phone")}</p>
            <p><strong>אימייל:</strong> {getValue(data, "email")}</p>
            <p><strong>כתובת:</strong> {getValue(data, "address")}</p>
          </div>
        </div>
        <form className={"grid gap-4 rounded-3xl bg-[#FAF6F0] p-8 text-[#2D1810]"}>
          <input className={"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"} placeholder="שם מלא" />
          <input className={"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"} placeholder="טלפון" />
          <input className={"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"} placeholder="אימייל" />
          <button type="button" onClick={openModal} className={"w-full rounded-xl bg-[#C45C26] px-7 py-4 text-sm font-semibold text-white"}>
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
      <div className={"mx-auto max-w-7xl rounded-3xl bg-[#C45C26] p-10 text-center text-white lg:p-16"}>
        <h2 className="text-3xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mt-4 opacity-80">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className={cx("mt-8", "w-full rounded-xl bg-[#C45C26] px-7 py-4 text-sm font-semibold text-white")}>
          {getValue(data, "ctaButton")}
        </button>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} {getValue(data, "brandName")} · Savory
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className={"relative w-full max-w-md rounded-3xl bg-white p-8 text-[#2D1810]"}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="text-2xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className={"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"} placeholder="שם מלא" />
          <input className={"rounded-xl border border-[#C45C26]/20 px-5 py-4 text-right outline-none focus:border-[#C45C26]"} placeholder="טלפון" />
          <button type="button" className={"w-full rounded-xl bg-[#C45C26] px-7 py-4 text-sm font-semibold text-white"}>{getValue(data, "contactButton")}</button>
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

export default function SavoryPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: SavoryPagesProps) {
  const mergedData = useMemo(() => ({ ...savoryDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "savory-preview" : "savory"}
      className={cx("min-h-screen w-full overflow-x-hidden", "bg-[#FAF6F0] font-sans text-[#2D1810]")}
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
