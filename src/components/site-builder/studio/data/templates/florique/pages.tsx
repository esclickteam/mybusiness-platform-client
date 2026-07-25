import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { floriqueDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { floriqueEditorCss } from "./editorCss";
import { Reveal, useCountUp } from "../shared/Reveal";

export const floriquePages = [{ id: "home", label: "בית", slug: "/" }];

type FloriquePagesProps = {
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
  return data?.[key] ?? (floriqueDefaultData as Record<string, any>)[key] ?? "";
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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data }: { data: Record<string, any> }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-rose-200/70 bg-[#fff7fb]/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-end gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[var(--p)] bg-white text-sm font-black text-[var(--p)]">{getValue(data, "logoText")}</span>
          <span className="florique-script text-5xl leading-none text-[var(--p)]">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.24em] text-[#7e355b] lg:flex">
          <a href="#occasions" className="transition hover:text-[var(--p)]">{getValue(data, "navOccasions")}</a>
          <a href="#bouquets" className="transition hover:text-[var(--p)]">{getValue(data, "navBouquets")}</a>
          <a href="#gallery" className="transition hover:text-[var(--p)]">{getValue(data, "navGallery")}</a>
          <a href="#order" className="transition hover:text-[var(--p)]">{getValue(data, "navOrder")}</a>
        </nav>
        <a href="#order" className="bg-[var(--p)] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_42px_rgba(225,29,140,0.22)] transition hover:-translate-y-1">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function BloomCounter({ target, label, suffix = "", delayMs = 0 }: { target: number; label: string; suffix?: string; delayMs?: number }) {
  const { ref, visible } = useInViewOnce();
  const value = useCountUp(target, visible, 1200);

  return (
    <div ref={ref}>
      <Reveal delayMs={delayMs} variant="scale">
        <div className="aspect-square border border-[var(--line)] bg-white/75 p-5 text-center shadow-[0_22px_55px_rgba(225,29,140,0.10)]">
          <p className="florique-script text-6xl leading-none text-[var(--p)]">{value}{suffix}</p>
          <p className="mt-3 text-sm font-bold leading-6 text-[var(--muted)]">{label}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  const metricOne = Number(getValue(data, "heroMetricOneValue")) || 120;
  const metricTwo = Number(getValue(data, "heroMetricTwoValue")) || 24;

  return (
    <section id="top" data-template-section-type="hero" className="relative min-h-[94svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#fff7fb]/96 via-[#fff7fb]/74 to-[#3b1028]/18" />
      <div className="pointer-events-none absolute inset-0">
        <span className="florique-petal absolute right-[7%] top-[16%] h-28 w-20 rounded-full bg-pink-200/60 blur-sm" />
        <span className="florique-petal absolute left-[18%] top-[26%] h-24 w-16 rounded-full bg-rose-300/45 blur-sm" />
        <span className="florique-petal absolute bottom-[18%] right-[38%] h-20 w-14 rounded-full bg-white/60 blur-sm" />
      </div>
      <div className="relative z-10 mx-auto grid min-h-[94svh] max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <Reveal variant="right">
          <p className="inline-flex border border-[var(--line)] bg-white/62 px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="florique-script mt-7 text-[7.5rem] leading-[0.72] text-[var(--p)] md:text-[11rem] lg:text-[13rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="mt-7 max-w-2xl text-2xl font-semibold leading-10 text-[var(--text)] md:text-4xl">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#order" className="bg-[var(--p)] px-9 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_20px_50px_rgba(225,29,140,0.25)] transition hover:-translate-y-1">
              {getValue(data, "heroPrimaryButton")}
            </a>
            <a href="#gallery" className="border border-[var(--p)] bg-white/52 px-9 py-4 text-sm font-black uppercase tracking-[0.18em] text-[var(--p)] transition hover:-translate-y-1">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="florique-soft-float relative mx-auto max-w-md border border-white/70 bg-white/46 p-4 shadow-[0_30px_90px_rgba(225,29,140,0.18)] backdrop-blur">
            <img src={getValue(data, "heroSmallImage")} alt="" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute -bottom-8 -right-8 bg-white px-8 py-6 shadow-[0_20px_60px_rgba(225,29,140,0.18)]">
              <p className="florique-script text-5xl leading-none text-[var(--p)]">fresh today</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">seasonal stems</p>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="relative z-20 mx-auto -mt-28 grid max-w-md grid-cols-2 gap-3 px-5 pb-10 md:max-w-xl">
        <BloomCounter target={metricOne} label={getValue(data, "heroMetricOneLabel")} />
        <BloomCounter target={metricTwo} label={getValue(data, "heroMetricTwoLabel")} suffix="h" delayMs={90} />
      </div>
    </section>
  );
}

function Occasions({ data }: { data: Record<string, any> }) {
  const occasions = [
    [getValue(data, "occasionOneTitle"), getValue(data, "occasionOneText"), getValue(data, "occasionOneImage")],
    [getValue(data, "occasionTwoTitle"), getValue(data, "occasionTwoText"), getValue(data, "occasionTwoImage")],
    [getValue(data, "occasionThreeTitle"), getValue(data, "occasionThreeText"), getValue(data, "occasionThreeImage")],
  ];

  return (
    <section id="occasions" data-template-section-type="occasions" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "occasionsEyebrow")}</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight text-[var(--text)] md:text-7xl">{getValue(data, "occasionsTitle")}</h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {occasions.map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="florique-card group relative aspect-square overflow-hidden bg-white">
                <img src={image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b1028]/78 via-[#3b1028]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="florique-script text-5xl leading-none">{title}</p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/82">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BouquetMosaic({ data }: { data: Record<string, any> }) {
  const bouquets = [
    [getValue(data, "bouquetOneName"), getValue(data, "bouquetOnePrice"), getValue(data, "bouquetOneText"), getValue(data, "bouquetOneImage")],
    [getValue(data, "bouquetTwoName"), getValue(data, "bouquetTwoPrice"), getValue(data, "bouquetTwoText"), getValue(data, "bouquetTwoImage")],
    [getValue(data, "bouquetThreeName"), getValue(data, "bouquetThreePrice"), getValue(data, "bouquetThreeText"), getValue(data, "bouquetThreeImage")],
    [getValue(data, "bouquetFourName"), getValue(data, "bouquetFourPrice"), getValue(data, "bouquetFourText"), getValue(data, "bouquetFourImage")],
  ];

  return (
    <section id="bouquets" data-template-section-type="products" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "bouquetsEyebrow")}</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "bouquetsTitle")}</h2>
            </div>
            <p className="florique-script text-6xl leading-none text-[var(--p)]">signature</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bouquets.map(([name, price, text, image], index) => (
            <Reveal key={name} delayMs={index * 90} variant="scale" className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
              <article className={`florique-card group relative flex flex-col justify-end overflow-hidden bg-[#fff7fb] ${index === 0 ? "aspect-[16/10] lg:aspect-[16/11]" : "aspect-square"}`}>
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/48 to-transparent" />
                <div className="relative z-10 p-7 text-right">
                  <div className="mb-4 inline-flex bg-[var(--p)] px-4 py-2 text-sm font-black text-white">{price}</div>
                  <h3 className="florique-script text-5xl leading-none text-[var(--p)]">{name}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section data-template-section-type="process" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          <span className="florique-line absolute left-[12%] right-[12%] top-12 hidden h-px md:block" />
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="relative text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[var(--p)] bg-white text-2xl font-black text-[var(--p)] shadow-[0_18px_55px_rgba(225,29,140,0.16)]">
                  0{index + 1}
                </div>
                <h3 className="mt-7 text-2xl font-bold text-[var(--text)]">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
    getValue(data, "galleryFiveImage"),
  ];

  return (
    <section id="gallery" data-template-section-type="gallery" className="bg-[#fffdf7] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "galleryTitle")}</h2>
            <p className="mt-6 text-base font-semibold leading-8 text-[var(--muted)]">{getValue(data, "galleryText")}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-6 md:grid-rows-2">
          <Reveal variant="scale" className="col-span-2 md:col-span-3">
            <div className="overflow-hidden">
              <img src={images[0]} alt="" className="aspect-[4/3] h-full w-full object-cover md:aspect-[5/3]" />
            </div>
          </Reveal>
          <Reveal variant="scale" delayMs={80} className="col-span-1 md:col-span-3">
            <div className="overflow-hidden">
              <img src={images[1]} alt="" className="aspect-[4/3] h-full w-full object-cover md:aspect-[5/3]" />
            </div>
          </Reveal>
          <Reveal variant="scale" delayMs={140} className="col-span-1 md:col-span-2">
            <div className="overflow-hidden">
              <img src={images[2]} alt="" className="aspect-square h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal variant="scale" delayMs={200} className="col-span-1 md:col-span-2">
            <div className="overflow-hidden">
              <img src={images[3]} alt="" className="aspect-square h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal variant="scale" delayMs={260} className="col-span-2 md:col-span-2">
            <div className="overflow-hidden">
              <img src={images[4]} alt="" className="aspect-square h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Subscription({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8">
      <Reveal>
        <div className="mx-auto grid max-w-7xl gap-8 bg-[var(--p)] p-8 text-white md:p-12 lg:grid-cols-[1fr_0.55fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-white/70">{getValue(data, "subscriptionEyebrow")}</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "subscriptionTitle")}</h2>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/82">{getValue(data, "subscriptionText")}</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <a href="#order" className="bg-white px-9 py-5 text-sm font-black uppercase tracking-[0.2em] text-[var(--p)] shadow-[0_20px_60px_rgba(59,16,40,0.18)]">
              {getValue(data, "subscriptionButton")}
            </a>
          </div>
        </div>
      </Reveal>
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
        <Reveal>
          <p className="text-center text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "reviewEyebrow")}</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-center text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "reviewsTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up">
              <blockquote className="flex aspect-square flex-col justify-between border border-[var(--line)] bg-white p-7 shadow-[0_24px_60px_rgba(225,29,140,0.10)]">
                <p className="text-xl font-semibold leading-9 text-[var(--text)]">"{text}"</p>
                <footer>
                  <p className="florique-script text-5xl leading-none text-[var(--p)]">{name}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)]">{role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderForm({ data }: { data: Record<string, any> }) {
  return (
    <section id="order" data-template-section-type="contact" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 border border-[var(--line)] bg-[#fff7fb] p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 text-base font-semibold leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-black text-[var(--text)]">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="border border-[var(--line)] bg-white px-5 py-4 text-right outline-none placeholder:text-[#9D6B85]/60 focus:border-[var(--p)]" placeholder="שם מלא" />
              <input className="border border-[var(--line)] bg-white px-5 py-4 text-right outline-none placeholder:text-[#9D6B85]/60 focus:border-[var(--p)]" placeholder="טלפון" />
            </div>
            <input className="border border-[var(--line)] bg-white px-5 py-4 text-right outline-none placeholder:text-[#9D6B85]/60 focus:border-[var(--p)]" placeholder="אירוע או סיבה למשלוח" />
            <input className="border border-[var(--line)] bg-white px-5 py-4 text-right outline-none placeholder:text-[#9D6B85]/60 focus:border-[var(--p)]" placeholder="תקציב וגוונים מועדפים" />
            <textarea className="min-h-32 border border-[var(--line)] bg-white px-5 py-4 text-right outline-none placeholder:text-[#9D6B85]/60 focus:border-[var(--p)]" placeholder="ברכה, כתובת ושעה רצויה" />
            <button type="button" className="bg-[var(--p)] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-1">
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
    <footer data-template-section-type="footer" className="relative overflow-hidden bg-[#3b1028] px-5 py-20 text-white lg:px-8">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#E11D8C]/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="florique-script text-8xl leading-none text-pink-200">{getValue(data, "brandName")}</p>
          <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-tight md:text-8xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/72">{getValue(data, "ctaText")}</p>
          <a href="#order" className="mt-10 inline-flex bg-[var(--p)] px-9 py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_20px_70px_rgba(225,29,140,0.32)]">
            {getValue(data, "ctaButton")}
          </a>
        </Reveal>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/55 md:flex-row">
          <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
          <p>{getValue(data, "email")} · {getValue(data, "phone")}</p>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <Hero data={data} />
      <Occasions data={data} />
      <BouquetMosaic data={data} />
      <Process data={data} />
      <Gallery data={data} />
      <Subscription data={data} />
      <Testimonials data={data} />
      <OrderForm data={data} />
      <Footer data={data} />
    </>
  );
}

export default function FloriquePages(props: FloriquePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...floriqueDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "florique-preview" : "florique"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: floriqueEditorCss }} />
      <Header data={mergedData} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: <HomePage data={mergedData} /> }]} />
    </div>
  );
}