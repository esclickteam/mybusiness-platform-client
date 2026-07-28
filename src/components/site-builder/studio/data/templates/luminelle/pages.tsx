import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { luminelleDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { luminelleEditorCss } from "./editorCss";

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

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="sticky top-0 z-50 border-b border-[var(--l-line)] bg-[var(--l-bg)]/92 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-[var(--l-ink)] text-xs font-bold tracking-[0.22em]">
            {getValue(data, "logoText")}
          </span>
          <span className="l-display text-2xl font-bold leading-none">{getValue(data, "brandName")}</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--l-muted)] lg:flex">
          <a href="#treatments" className="transition hover:text-[var(--l-ink)]">
            {getValue(data, "navServices")}
          </a>
          <a href="#team" className="transition hover:text-[var(--l-ink)]">
            {getValue(data, "navAbout")}
          </a>
          <a href="#booking" className="transition hover:text-[var(--l-ink)]">
            {getValue(data, "navContact")}
          </a>
        </nav>
        <button type="button" onClick={openModal} className="l-button hidden sm:inline-flex">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="flex min-h-[62svh] flex-col justify-center py-16 lg:min-h-[calc(100svh-84px)] lg:py-24">
          <p className="l-display l-anim text-5xl font-bold leading-none text-[var(--l-ink)] md:text-7xl">
            {getValue(data, "brandName")}
          </p>
          <div className="l-line-anim mt-8 h-px w-24 bg-[var(--l-sage)]" />
          <h1 className="l-display l-anim l-anim-d1 mt-8 max-w-3xl text-4xl font-bold leading-[1.12] md:text-6xl lg:text-7xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="l-anim l-anim-d2 mt-7 max-w-xl text-lg leading-8 text-[var(--l-muted)]">
            {getValue(data, "heroSubtitle")}
          </p>
          <div className="l-anim l-anim-d3 mt-10">
            <button type="button" onClick={openModal} className="l-button">
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
        <div className="l-anim-soft l-anim-d1 relative -mx-5 min-h-[460px] lg:-ml-8 lg:mr-0 lg:min-h-[calc(100svh-84px)]">
          <img
            src={getValue(data, "heroImage")}
            alt=""
            className="h-full min-h-[460px] w-full object-cover lg:min-h-[calc(100svh-84px)]"
          />
        </div>
      </div>
    </section>
  );
}

function Treatments({ data }: { data: Record<string, any> }) {
  const treatments = [
    [
      "01",
      getValue(data, "treatmentOneTitle"),
      getValue(data, "treatmentOneText"),
      getValue(data, "treatmentOneDuration"),
      getValue(data, "treatmentOnePrice"),
    ],
    [
      "02",
      getValue(data, "treatmentTwoTitle"),
      getValue(data, "treatmentTwoText"),
      getValue(data, "treatmentTwoDuration"),
      getValue(data, "treatmentTwoPrice"),
    ],
    [
      "03",
      getValue(data, "treatmentThreeTitle"),
      getValue(data, "treatmentThreeText"),
      getValue(data, "treatmentThreeDuration"),
      getValue(data, "treatmentThreePrice"),
    ],
    [
      "04",
      getValue(data, "treatmentFourTitle"),
      getValue(data, "treatmentFourText"),
      getValue(data, "treatmentFourDuration"),
      getValue(data, "treatmentFourPrice"),
    ],
  ];

  return (
    <section id="treatments" data-template-section-type="treatments" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="l-kicker">{getValue(data, "heroEyebrow")}</p>
            <h2 className="l-display mt-5 max-w-xl text-4xl font-bold leading-tight md:text-5xl">
              {getValue(data, "sectionTwoTitle")}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-9 text-[var(--l-muted)] lg:pt-10">
            {getValue(data, "sectionTwoText")}
          </p>
        </div>

        <div className="mt-16 border-t border-[var(--l-line)]">
          {treatments.map(([number, title, text, duration, price]) => (
            <article
              key={String(title)}
              className="grid gap-5 border-b border-[var(--l-line)] py-8 transition duration-300 hover:bg-[var(--l-surface)]/55 md:grid-cols-[0.18fr_0.34fr_1fr_0.22fr] md:items-start"
            >
              <span className="l-display text-2xl text-[var(--l-sage)]">{number}</span>
              <div>
                <h3 className="text-xl font-semibold text-[var(--l-ink)]">{title}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--l-sage)]">{duration}</p>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--l-muted)] md:text-base">{text}</p>
              <p className="text-sm font-bold text-[var(--l-ink)] md:text-left">{price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Transformation({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="transformation" className="bg-[var(--l-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="l-kicker">Before / After</p>
            <h2 className="l-display mt-5 text-4xl font-bold leading-tight md:text-5xl">
              {getValue(data, "sectionThreeTitle")}
            </h2>
            <p className="mt-6 text-lg leading-9 text-[var(--l-muted)]">{getValue(data, "sectionThreeText")}</p>
            <div className="mt-10 grid gap-6 border-y border-[var(--l-line)] py-8 sm:grid-cols-2">
              <div>
                <p className="l-display text-2xl md:text-5xl font-bold text-[var(--l-sage)]">{getValue(data, "transformMetricOne")}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--l-muted)]">{getValue(data, "transformMetricOneLabel")}</p>
              </div>
              <div>
                <p className="l-display text-2xl md:text-5xl font-bold text-[var(--l-sage)]">{getValue(data, "transformMetricTwo")}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--l-muted)]">{getValue(data, "transformMetricTwoLabel")}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <figure>
              <img src={getValue(data, "beforeImage")} alt="" className="h-[430px] w-full object-cover" />
              <figcaption className="mt-4 border-t border-[var(--l-line)] pt-4 text-sm text-[var(--l-muted)]">
                {getValue(data, "transformBeforeLabel")}
              </figcaption>
            </figure>
            <figure className="md:mt-16">
              <img src={getValue(data, "afterImage")} alt="" className="h-[430px] w-full object-cover" />
              <figcaption className="mt-4 border-t border-[var(--l-line)] pt-4 text-sm font-semibold text-[var(--l-ink)]">
                {getValue(data, "transformAfterLabel")}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsStrip({ data }: { data: Record<string, any> }) {
  const products = [
    [getValue(data, "productOneName"), getValue(data, "productOneText")],
    [getValue(data, "productTwoName"), getValue(data, "productTwoText")],
    [getValue(data, "productThreeName"), getValue(data, "productThreeText")],
    [getValue(data, "productFourName"), getValue(data, "productFourText")],
    [getValue(data, "productFiveName"), getValue(data, "productFiveText")],
  ];

  return (
    <section data-template-section-type="products" className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-y border-[var(--l-line)] py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="l-kicker">Selected Care</p>
            <h2 className="l-display mt-4 text-3xl font-bold md:text-4xl">{getValue(data, "sectionFourTitle")}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--l-muted)]">{getValue(data, "sectionFourText")}</p>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {products.map(([name, text]) => (
              <div key={String(name)} className="border-r border-[var(--l-line)] pr-4">
                <p className="text-sm font-bold text-[var(--l-ink)]">{name}</p>
                <p className="mt-2 text-xs leading-5 text-[var(--l-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const team = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneBio"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoBio"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeBio"), getValue(data, "teamThreeImage")],
  ];

  return (
    <section id="team" data-template-section-type="team" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="l-kicker">The Atelier</p>
          <h2 className="l-display mt-5 text-4xl font-bold leading-tight md:text-5xl">{getValue(data, "sectionFiveTitle")}</h2>
          <p className="mt-6 text-lg leading-9 text-[var(--l-muted)]">{getValue(data, "sectionFiveText")}</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {team.map(([name, role, bio, image]) => (
            <article key={String(name)} className="group">
              <div className="overflow-hidden bg-[var(--l-surface)]">
                <img src={image} alt="" className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
              </div>
              <div className="mt-6 border-t border-[var(--l-line)] pt-5">
                <h3 className="l-display text-2xl font-bold">{name}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--l-sage)]">{role}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--l-muted)]">{bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const packages = [
    [
      getValue(data, "packageOneName"),
      getValue(data, "packageOnePrice"),
      getValue(data, "packageOneText"),
      [getValue(data, "packageOneFeatureOne"), getValue(data, "packageOneFeatureTwo"), getValue(data, "packageOneFeatureThree")],
    ],
    [
      getValue(data, "packageTwoName"),
      getValue(data, "packageTwoPrice"),
      getValue(data, "packageTwoText"),
      [getValue(data, "packageTwoFeatureOne"), getValue(data, "packageTwoFeatureTwo"), getValue(data, "packageTwoFeatureThree")],
    ],
    [
      getValue(data, "packageThreeName"),
      getValue(data, "packageThreePrice"),
      getValue(data, "packageThreeText"),
      [getValue(data, "packageThreeFeatureOne"), getValue(data, "packageThreeFeatureTwo"), getValue(data, "packageThreeFeatureThree")],
    ],
  ];

  return (
    <section data-template-section-type="pricing" className="bg-[var(--l-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="l-kicker">Packages</p>
            <h2 className="l-display mt-5 text-4xl font-bold leading-tight md:text-5xl">{getValue(data, "sectionSixTitle")}</h2>
            <p className="mt-6 text-lg leading-9 text-[var(--l-muted)]">{getValue(data, "sectionSixText")}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {packages.map(([name, price, text, features], index) => (
              <article
                key={String(name)}
                className="flex min-h-[410px] flex-col border border-[var(--l-line)] bg-[var(--l-bg)] p-7"
              >
                <p className="text-xs font-bold tracking-[0.22em] text-[var(--l-sage)]">0{index + 1}</p>
                <h3 className="l-display mt-5 text-2xl font-bold leading-tight">{name}</h3>
                <p className="mt-5 text-2xl sm:text-4xl font-bold text-[var(--l-ink)]">{price}</p>
                <p className="mt-5 text-sm leading-7 text-[var(--l-muted)]">{text}</p>
                <ul className="mt-7 space-y-3 border-t border-[var(--l-line)] pt-6 text-sm text-[var(--l-ink)]">
                  {(features as string[]).map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--l-sage)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={openModal} className="l-button l-button-outline mt-auto w-full">
                  {getValue(data, "ctaButton")}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
    [getValue(data, "faqFourQuestion"), getValue(data, "faqFourAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="l-kicker">FAQ</p>
          <h2 className="l-display mt-5 text-4xl font-bold leading-tight md:text-5xl">{getValue(data, "sectionSevenTitle")}</h2>
          <p className="mt-6 text-lg leading-9 text-[var(--l-muted)]">{getValue(data, "sectionSevenText")}</p>
        </div>
        <div className="border-t border-[var(--l-line)]">
          {faqs.map(([question, answer], index) => (
            <div key={String(question)} className="border-b border-[var(--l-line)]">
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-right"
              >
                <span className="text-lg font-semibold text-[var(--l-ink)]">{question}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--l-line-strong)] text-lg text-[var(--l-sage)]">
                  {open === index ? "−" : "+"}
                </span>
              </button>
              {open === index ? <p className="max-w-3xl pb-7 text-sm leading-8 text-[var(--l-muted)]">{answer}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="booking" data-template-section-type="booking" className="bg-[var(--l-dark)] px-5 py-24 text-[var(--l-surface)] lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="l-kicker !text-[var(--l-sage-soft)]">Booking</p>
          <h2 className="l-display mt-5 text-4xl font-bold leading-tight md:text-5xl">{getValue(data, "sectionEightTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-9 text-[#d8d2cb]">{getValue(data, "bookingIntro")}</p>
          <div className="mt-10 space-y-3 border-t border-white/12 pt-8 text-sm text-[#d8d2cb]">
            <p>
              <span className="font-bold text-[var(--l-sage-soft)]">טלפון</span> · {getValue(data, "phone")}
            </p>
            <p>
              <span className="font-bold text-[var(--l-sage-soft)]">אימייל</span> · {getValue(data, "email")}
            </p>
            <p>
              <span className="font-bold text-[var(--l-sage-soft)]">כתובת</span> · {getValue(data, "address")}
            </p>
            <p>
              <span className="font-bold text-[var(--l-sage-soft)]">שעות</span> · {getValue(data, "hours")}
            </p>
          </div>
        </div>
        <form
          className="grid gap-4 border border-white/12 bg-[#211c25] p-6 md:grid-cols-2 md:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            openModal();
          }}
        >
          <input className="l-input !border-white/14 !bg-transparent !text-[var(--l-surface)]" placeholder={getValue(data, "bookingNameLabel")} />
          <input className="l-input !border-white/14 !bg-transparent !text-[var(--l-surface)]" placeholder={getValue(data, "bookingPhoneLabel")} />
          <input
            className="l-input !border-white/14 !bg-transparent !text-[var(--l-surface)] md:col-span-2"
            placeholder={getValue(data, "bookingServiceLabel")}
          />
          <textarea
            className="l-input min-h-[150px] resize-none !border-white/14 !bg-transparent !text-[var(--l-surface)] md:col-span-2"
            placeholder={getValue(data, "bookingMessageLabel")}
          />
          <button type="submit" className="l-button md:col-span-2">
            {getValue(data, "bookingSubmitLabel")}
          </button>
        </form>
      </div>
    </section>
  );
}

function FooterCta({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-y border-[var(--l-line)] py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="l-display text-3xl font-bold text-[var(--l-ink)] md:text-5xl">{getValue(data, "ctaTitle")}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--l-muted)]">{getValue(data, "ctaText")}</p>
          </div>
          <button type="button" onClick={openModal} className="l-button w-full lg:w-auto">
            {getValue(data, "ctaButton")}
          </button>
        </div>
        <div className="flex flex-col gap-4 py-8 text-sm text-[var(--l-muted)] md:flex-row md:items-center md:justify-between">
          <p className="l-display text-2xl font-bold text-[var(--l-ink)]">{getValue(data, "brandName")}</p>
          <p>
            © {new Date().getFullYear()} {getValue(data, "brandName")} · {getValue(data, "address")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[var(--l-dark)]/72 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[var(--l-surface)] p-8 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl leading-none text-[var(--l-muted)]">
          ×
        </button>
        <p className="l-kicker">{getValue(data, "heroEyebrow")}</p>
        <h3 className="l-display mt-4 text-3xl font-bold leading-tight">{getValue(data, "contactTitle")}</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--l-muted)]">{getValue(data, "contactText")}</p>
        <form className="mt-7 grid gap-3">
          <input className="l-input" placeholder={getValue(data, "bookingNameLabel")} />
          <input className="l-input" placeholder={getValue(data, "bookingPhoneLabel")} />
          <button type="button" className="l-button mt-2 w-full">
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
      <Treatments data={data} />
      <Transformation data={data} />
      <ProductsStrip data={data} />
      <Team data={data} />
      <Pricing data={data} openModal={openModal} />
      <FAQ data={data} />
      <Booking data={data} openModal={openModal} />
      <FooterCta data={data} openModal={openModal} />
    </>
  );
}

export default function LuminellePages({
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
}: LuminellePagesProps) {
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
      className="min-h-screen w-full overflow-x-hidden bg-[var(--l-bg)] text-[var(--l-ink)]"
    >
      <style dangerouslySetInnerHTML={{ __html: luminelleEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
