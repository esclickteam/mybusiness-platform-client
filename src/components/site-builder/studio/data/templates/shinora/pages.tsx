import React, { useEffect, useMemo, useRef, useState } from "react";
import { shinoraDefaultData, type ShinoraTemplateData } from "./defaultData";

export const shinoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "pricing", label: "מחירון", slug: "/pricing" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "blog", label: "בלוג", slug: "/blog" },
  { id: "contact", label: "ייעוץ", slug: "/contact" },
];

type PageKey = (typeof shinoraPages)[number]["id"];

type ShinoraPagesProps = {
  data?: ShinoraTemplateData | Record<string, any>;
  page?: PageKey | string;
  pageId?: PageKey | string;
  activePage?: PageKey | string;
  currentPage?: PageKey | string;
  initialPage?: PageKey | string;
  mode?: "preview" | "editor" | "published" | string;
  onNavigate?: (pageId: string) => void;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function getPageKey(props: ShinoraPagesProps): PageKey {
  const raw = String(
    props.page ||
      props.pageId ||
      props.activePage ||
      props.currentPage ||
      props.initialPage ||
      "home",
  )
    .replace(/^\//, "")
    .trim();

  const key = raw === "" ? "home" : raw;

  return shinoraPages.some((page) => page.id === key)
    ? (key as PageKey)
    : "home";
}

function navigateTo(pageId: string, onNavigate?: (pageId: string) => void) {
  if (onNavigate) {
    onNavigate(pageId);
    return;
  }

  const target = shinoraPages.find((page) => page.id === pageId);
  if (typeof window !== "undefined" && target) {
    window.history.pushState({}, "", target.slug);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className,
  delay = "delay-0",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: "delay-0" | "delay-75" | "delay-100" | "delay-150" | "delay-200" | "delay-300" | "delay-500";
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={cx(
        "transition-all duration-[900ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        delay,
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-black tracking-tight",
        dark
          ? "border-white/15 bg-white/10 text-[#f8dfca]"
          : "border-[#e4cbb8] bg-white/70 text-[#8b5e47] shadow-sm shadow-[#5e321b]/5",
      )}
    >
      <span className={cx("h-2 w-2 rounded-full", dark ? "bg-[#f8dfca]" : "bg-[#b78563]")} />
      {children}
    </div>
  );
}

function ArrowButton({
  children,
  variant = "dark",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "dark" | "light" | "ghost";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300 active:scale-95",
        variant === "dark" &&
          "bg-[#251815] text-white shadow-xl shadow-[#251815]/20 hover:-translate-y-0.5 hover:bg-[#3d2923]",
        variant === "light" &&
          "border border-[#e0c5af] bg-white/80 text-[#251815] hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" && "bg-[#f6e8dc] text-[#734c39] hover:bg-[#eddbcd]",
      )}
    >
      <span>{children}</span>
      <span className="mr-2 transition duration-300 group-hover:-translate-x-1">←</span>
    </button>
  );
}

function Header({
  data,
  pageKey,
  onNavigate,
}: {
  data: any;
  pageKey: PageKey;
  onNavigate?: (pageId: string) => void;
}) {
  const mainNav = [
    ["home", data.navHome],
    ["about", data.navAbout],
    ["services", data.navServices],
    ["pricing", data.navPricing],
    ["gallery", data.navGallery],
    ["shop", data.navShop],
    ["blog", data.navBlog],
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#ead7c8]/80 bg-[#fff8f2]/90 backdrop-blur-2xl"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => navigateTo("home", onNavigate)}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#241612] text-lg font-black text-white shadow-xl shadow-[#2b1710]/20 transition duration-300 group-hover:rotate-6">
            {data.logoText}
          </span>
          <span>
            <span className="block text-2xl font-black leading-none tracking-[-0.04em] text-[#241612]">
              {data.brandName}
            </span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.22em] text-[#a7765b]">
              {data.salonLabel}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#ead7c8] bg-white/65 p-1 shadow-sm shadow-[#5e321b]/5 xl:flex">
          {mainNav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => navigateTo(String(id), onNavigate)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-black transition duration-300",
                pageKey === id
                  ? "bg-[#241612] text-white shadow-md shadow-[#241612]/15"
                  : "text-[#765342] hover:bg-[#f5e4d7] hover:text-[#241612]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo("shop", onNavigate)}
            className="relative hidden h-11 w-11 place-items-center rounded-full border border-[#ead7c8] bg-white/75 text-sm font-black text-[#241612] shadow-sm transition hover:-translate-y-0.5 md:grid"
            aria-label={data.cartLabel}
          >
            0
            <span className="absolute -left-1 -top-1 h-4 w-4 rounded-full bg-[#b78563]" />
          </button>
          <ArrowButton onClick={() => navigateTo("contact", onNavigate)}>
            {data.navContact}
          </ArrowButton>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-[#fff8f2]" dir="rtl">
      <div className="absolute right-0 top-0 h-[46rem] w-[46rem] rounded-full bg-[#f4d5bd]/45 blur-3xl" />
      <div className="absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#ead8c8]/80 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(92,54,37,0.09)_1px,transparent_0)] bg-[length:28px_28px] opacity-60" />

      <div className="relative mx-auto grid min-h-[860px] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative min-h-[620px]">
            <div className="absolute left-2 top-3 h-[520px] w-[68%] overflow-hidden rounded-[999px] border-[12px] border-white bg-[#efd6c3] shadow-[0_40px_120px_rgba(56,31,22,0.18)] transition duration-700 hover:scale-[1.02]">
              <img
                src={data.heroImage}
                alt="סלון יופי פרימיום"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            <div className="absolute bottom-4 right-0 h-[370px] w-[55%] overflow-hidden rounded-[48px] border-[10px] border-[#fff8f2] bg-[#e7c5ad] shadow-[0_34px_100px_rgba(56,31,22,0.2)] transition duration-700 hover:-translate-y-2">
              <img
                src={data.heroImageTwo}
                alt="טיפול שיער בסלון"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            <div className="absolute bottom-28 left-3 max-w-[240px] rounded-[34px] border border-white/70 bg-white/85 p-5 text-sm font-bold leading-7 text-[#6a4a3a] shadow-[0_28px_90px_rgba(56,31,22,0.16)] backdrop-blur transition duration-500 hover:-translate-y-1">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#b78563]">
                {data.heroBadgeTop}
              </div>
              {data.heroBadgeText}
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay="delay-100">
          <SectionLabel>{data.heroEyebrow}</SectionLabel>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-[#241612] md:text-7xl lg:text-8xl">
            {data.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-9 text-[#745344] md:text-xl">
            {data.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ArrowButton onClick={() => navigateTo("contact", onNavigate)}>
              {data.heroPrimaryButton}
            </ArrowButton>
            <ArrowButton variant="light" onClick={() => navigateTo("services", onNavigate)}>
              {data.heroSecondaryButton}
            </ArrowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SalonVideoSection({
  data,
  onNavigate,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#fff8f2] py-20" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(92,54,37,0.08)_1px,transparent_0)] bg-[length:28px_28px] opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>{data.videoEyebrow}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-[#241612] md:text-6xl">
            {data.videoSectionTitle}
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-[#745344]">
            {data.videoSectionText}
          </p>
        </Reveal>

        <Reveal delay="delay-100" className="mt-12">
          <div className="relative overflow-hidden rounded-[54px] border-[14px] border-[#e9c6ad] bg-[#241612] shadow-[0_45px_140px_rgba(56,31,22,0.18)]">
            <video
  className="aspect-[16/9] h-full min-h-[320px] w-full object-cover md:min-h-[620px]"
  poster={data.videoPoster}
  title={data.videoSectionTitle}
  controls
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
>
  <source src={data.videoUrl} type="video/mp4" />
  הדפדפן לא תומך בניגון וידאו.
</video>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#241612]/35 to-transparent" />
            <div className="pointer-events-none absolute bottom-6 right-6 rounded-full border border-white/20 bg-white/15 px-5 py-3 text-sm font-black text-white shadow-2xl backdrop-blur-md">
              {data.videoBadge}
            </div>
          </div>
        </Reveal>

        <Reveal
          delay="delay-150"
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[38px] border border-[#ead7c8] bg-white/70 p-5 shadow-sm md:flex-row"
        >
          <p className="max-w-2xl text-center text-base font-bold leading-7 text-[#6f4f40] md:text-right">
            {data.videoCtaText}
          </p>
          <ArrowButton onClick={() => navigateTo("contact", onNavigate)}>
            {data.heroPrimaryButton}
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  onNavigate,
  limit,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
  limit?: number;
}) {
  const services = typeof limit === "number" ? data.services.slice(0, limit) : data.services;

  return (
    <section className="bg-[#fffdfb] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionLabel>{data.servicesEyebrow}</SectionLabel>
            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] text-[#241612] md:text-6xl">
              {data.servicesTitle}
            </h2>
          </Reveal>
          <Reveal delay="delay-100" className="max-w-xl">
            <p className="text-lg font-medium leading-8 text-[#745344]">
              {data.servicesText}
            </p>
            <div className="mt-6">
              <ArrowButton variant="light" onClick={() => navigateTo("services", onNavigate)}>
                {data.servicesButton}
              </ArrowButton>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service: any, index: number) => (
            <Reveal
              key={`${service.title}-${index}`}
              delay={index % 3 === 1 ? "delay-100" : index % 3 === 2 ? "delay-200" : "delay-0"}
            >
              <article className="group overflow-hidden rounded-[42px] border border-[#ecd9ca] bg-[#fff8f2] shadow-[0_24px_80px_rgba(56,31,22,0.1)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_110px_rgba(56,31,22,0.16)]">
                <div className="relative h-72 overflow-hidden bg-[#e8d0bd]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-5 top-5 rounded-full bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#8b5e47] backdrop-blur">
                    {service.category}
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-black tracking-[-0.04em] text-[#241612]">
                      {service.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#241612] px-4 py-2 text-sm font-black text-white">
                      {service.price}
                    </span>
                  </div>
                  <p className="mt-4 text-base font-medium leading-8 text-[#745344]">
                    {service.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo("contact", onNavigate)}
                    className="mt-6 text-sm font-black text-[#8b5e47] transition hover:text-[#241612]"
                  >
                    לפרטי טיפול ←
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationSection({ data }: { data: any }) {
  return (
    <section className="relative overflow-hidden bg-[#241612] py-24 text-white" dir="rtl">
      <div className="absolute -right-28 top-0 h-96 w-96 rounded-full bg-[#b78563]/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#f1d0b7]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <Reveal>
          <div className="rounded-[52px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.22)] backdrop-blur md:p-10">
            <SectionLabel dark>{data.navContact}</SectionLabel>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
              {data.consultationTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/70">
              {data.consultationText}
            </p>

            <form className="mt-8 grid gap-3 md:grid-cols-2">
              <input
                className="rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white placeholder:text-white/45 outline-none transition focus:border-[#f0cdb4]"
                placeholder="שם מלא"
              />
              <input
                className="rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white placeholder:text-white/45 outline-none transition focus:border-[#f0cdb4]"
                placeholder="טלפון"
              />
              <input
                className="rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white placeholder:text-white/45 outline-none transition focus:border-[#f0cdb4] md:col-span-2"
                placeholder="איזה טיפול מעניין אותך?"
              />
              <textarea
                className="min-h-32 rounded-[32px] border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white placeholder:text-white/45 outline-none transition focus:border-[#f0cdb4] md:col-span-2"
                placeholder="ספרי לנו בקצרה מה חשוב לך"
              />
              <button
                type="button"
                className="rounded-full bg-[#f0cdb4] px-6 py-4 text-sm font-black text-[#241612] transition duration-300 hover:-translate-y-0.5 hover:bg-white md:col-span-2"
              >
                {data.consultationButton}
              </button>
            </form>
          </div>
        </Reveal>

        <Reveal delay="delay-150" className="relative min-h-[560px]">
          <div className="absolute inset-0 overflow-hidden rounded-[54px] bg-[#e6c4ac] shadow-[0_40px_120px_rgba(0,0,0,0.22)]">
            <img src={data.heroImageThree} alt="ייעוץ חינמי" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241612]/55 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-8 right-8 max-w-xs rounded-[34px] bg-white/90 p-6 text-[#241612] shadow-2xl backdrop-blur">
            <div className="text-3xl font-black">Free</div>
            <div className="mt-1 text-sm font-bold leading-6 text-[#745344]">
              ייעוץ ראשוני לפני קביעת טיפול
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhySection({
  data,
  onNavigate,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
}) {
  return (
    <section className="bg-[#fff8f2] py-24" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[54px] border-[12px] border-[#e7c7b1] bg-[#241612] shadow-[0_34px_110px_rgba(56,31,22,0.15)]">
            <video
  className="aspect-[4/5] h-[620px] w-full object-cover"
  poster={data.videoPoster}
  title={data.videoTitle}
  controls
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
>
  <source src={data.videoVerticalUrl || data.videoUrl} type="video/mp4" />
  הדפדפן לא תומך בניגון וידאו.
</video>
          </div>
        </Reveal>

        <Reveal delay="delay-100" className="flex flex-col justify-center">
          <SectionLabel>{data.whyEyebrow}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-[#241612] md:text-6xl">
            {data.whyTitle}
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-[#745344]">
            {data.whyText}
          </p>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.stats.map((stat: any) => (
              <div
                key={stat.label}
                className="rounded-[30px] border border-[#ead7c8] bg-white/75 p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl font-black text-[#241612]">{stat.value}</div>
                <div className="mt-2 text-sm font-bold leading-5 text-[#805a47]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[38px] border border-[#ead7c8] bg-white/75 p-6 shadow-sm">
            <h3 className="text-2xl font-black text-[#241612]">{data.videoTitle}</h3>
            <p className="mt-3 text-base font-medium leading-7 text-[#745344]">
              {data.videoText}
            </p>
            <div className="mt-5">
              <ArrowButton variant="ghost" onClick={() => navigateTo("gallery", onNavigate)}>
                לראות גלריה
              </ArrowButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DirectorSection({ data }: { data: any }) {
  return (
    <section className="bg-[#fffdfb] py-24" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[54px] bg-[#ead1bf] p-4 shadow-[0_34px_110px_rgba(56,31,22,0.14)]">
            <img
              src={data.directorImage}
              alt={data.directorName}
              className="h-[620px] w-full rounded-[42px] object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay="delay-100" className="flex flex-col justify-center">
          <div className="text-sm font-black uppercase tracking-[0.22em] text-[#b78563]">
            {data.directorRole}
          </div>
          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#241612] md:text-7xl">
            {data.directorName}
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#745344]">
            {data.directorText}
          </p>
          <blockquote className="mt-8 rounded-[40px] border border-[#ead7c8] bg-[#fff8f2] p-8 text-3xl font-black leading-tight tracking-[-0.04em] text-[#241612] shadow-sm">
            “{data.directorQuote}”
          </blockquote>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
            {data.stats.slice(0, 2).map((stat: any) => (
              <div key={stat.label} className="rounded-[34px] bg-[#241612] p-6 text-white">
                <div className="text-4xl font-black">{stat.value}</div>
                <div className="mt-2 text-sm font-bold text-white/65">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection({ data }: { data: any }) {
  return (
    <section className="overflow-hidden bg-[#fff8f2] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>{data.navTestimonials}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-[#241612] md:text-6xl">
            {data.testimonialsTitle}
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-[#745344]">
            {data.testimonialsText}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {data.testimonials.map((item: any, index: number) => (
            <Reveal
              key={`${item.name}-${index}`}
              delay={
                index === 1
                  ? "delay-100"
                  : index === 2
                    ? "delay-200"
                    : index === 3
                      ? "delay-300"
                      : "delay-0"
              }
            >
              <article className="h-full rounded-[40px] border border-[#ead7c8] bg-white/75 p-6 shadow-[0_20px_70px_rgba(56,31,22,0.08)] transition duration-300 hover:-translate-y-2">
                <p className="text-base font-bold leading-8 text-[#614334]">“{item.quote}”</p>
                <div className="mt-8 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="font-black text-[#241612]">{item.name}</div>
                    <div className="text-sm font-bold text-[#9a6b52]">{item.role}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border border-[#dec1aa] bg-white text-xl font-black text-[#241612] transition hover:-translate-y-1"
          >
            →
          </button>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#241612] text-xl font-black text-white transition hover:-translate-y-1"
          >
            ←
          </button>
        </div>
      </div>
    </section>
  );
}

function PartnersSection({ data }: { data: any }) {
  return (
    <section className="border-y border-[#ead7c8] bg-[#fffdfb] py-10" dir="rtl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 lg:px-8">
        {data.partners.map((partner: string) => (
          <div
            key={partner}
            className="rounded-full border border-[#ead7c8] bg-[#fff8f2] px-7 py-3 text-sm font-black tracking-[0.2em] text-[#9a6b52] transition hover:bg-[#241612] hover:text-white"
          >
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogSection({
  data,
  onNavigate,
  limit = 3,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
  limit?: number;
}) {
  return (
    <section className="bg-[#fffdfb] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionLabel>{data.navBlog}</SectionLabel>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-[#241612] md:text-6xl">
              {data.blogTitle}
            </h2>
          </Reveal>
          <Reveal delay="delay-100">
            <ArrowButton variant="light" onClick={() => navigateTo("blog", onNavigate)}>
              {data.blogButton}
            </ArrowButton>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {data.posts.slice(0, limit).map((post: any, index: number) => (
            <Reveal key={post.title} delay={index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-0"}>
              <article className="group overflow-hidden rounded-[42px] border border-[#ead7c8] bg-[#fff8f2] shadow-[0_20px_70px_rgba(56,31,22,0.08)] transition duration-500 hover:-translate-y-2">
                <div className="h-72 overflow-hidden bg-[#e9d1bf]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-7">
                  <div className="text-sm font-black text-[#b78563]">{post.date}</div>
                  <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#241612]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base font-medium leading-7 text-[#745344]">
                    {post.text}
                  </p>
                  <button type="button" className="mt-5 text-sm font-black text-[#8b5e47] hover:text-[#241612]">
                    לקריאה ←
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: any }) {
  return (
    <section className="bg-[#fff8f2] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <SectionLabel>{data.navGallery}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[#241612] md:text-6xl">
            גלריית טיפולים ואווירה
          </h2>
        </Reveal>
        <div className="grid auto-rows-[260px] gap-4 md:grid-cols-4">
          {data.gallery.map((image: string, index: number) => (
            <Reveal
              key={image}
              delay={index % 4 === 1 ? "delay-100" : index % 4 === 2 ? "delay-200" : "delay-0"}
              className={cx(index === 0 && "md:col-span-2 md:row-span-2", index === 5 && "md:col-span-2")}
            >
              <div className="group h-full overflow-hidden rounded-[38px] bg-[#e7c7b1] shadow-[0_20px_70px_rgba(56,31,22,0.08)]">
                <img
                  src={image}
                  alt="גלריית סלון"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ data }: { data: any }) {
  return (
    <section className="bg-[#fffdfb] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <SectionLabel>{data.navPricing}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[#241612] md:text-6xl">
            מחירון וחבילות
          </h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {data.pricing.map((plan: any, index: number) => (
            <Reveal key={plan.title} delay={index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-0"}>
              <article
                className={cx(
                  "rounded-[42px] border p-8 shadow-[0_20px_70px_rgba(56,31,22,0.08)]",
                  plan.featured
                    ? "border-[#241612] bg-[#241612] text-white"
                    : "border-[#ead7c8] bg-[#fff8f2] text-[#241612]",
                )}
              >
                <div className="text-lg font-black">{plan.title}</div>
                <div className="mt-5 text-5xl font-black tracking-[-0.05em]">{plan.price}</div>
                <p className={cx("mt-4 text-base font-medium leading-7", plan.featured ? "text-white/70" : "text-[#745344]")}>
                  {plan.description}
                </p>
                <ul className="mt-7 space-y-3">
                  {plan.items.map((item: string) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold">
                      <span className={cx("h-2 w-2 rounded-full", plan.featured ? "bg-[#f0cdb4]" : "bg-[#b78563]")} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ data }: { data: any }) {
  return (
    <section className="bg-[#fff8f2] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <SectionLabel>{data.navShop}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[#241612] md:text-6xl">
            חנות מוצרי טיפוח
          </h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {data.products.map((product: any, index: number) => (
            <Reveal key={product.name} delay={index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-0"}>
              <article className="group overflow-hidden rounded-[42px] border border-[#ead7c8] bg-white/75 shadow-[0_20px_70px_rgba(56,31,22,0.08)] transition hover:-translate-y-2">
                <div className="h-80 overflow-hidden bg-[#e9d1bf]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-between p-7">
                  <div>
                    <h3 className="text-2xl font-black text-[#241612]">{product.name}</h3>
                    <div className="mt-1 text-sm font-bold text-[#9a6b52]">Premium care</div>
                  </div>
                  <div className="rounded-full bg-[#241612] px-4 py-2 text-sm font-black text-white">
                    {product.price}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ data }: { data: any }) {
  return (
    <section className="bg-[#fff8f2] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <SectionLabel>{data.navTeam}</SectionLabel>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[#241612] md:text-6xl">
            הצוות המקצועי
          </h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {data.team.map((member: any, index: number) => (
            <Reveal key={member.name} delay={index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-0"}>
              <article className="group overflow-hidden rounded-[42px] bg-[#ead1bf] shadow-[0_24px_80px_rgba(56,31,22,0.1)]">
                <div className="h-[440px] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="bg-white/80 p-7">
                  <h3 className="text-2xl font-black text-[#241612]">{member.name}</h3>
                  <p className="mt-1 text-sm font-bold text-[#9a6b52]">{member.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({
  data,
  onNavigate,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
}) {
  const navGroups = [
    { title: data.navDemos, items: [["home", "Home 1"], ["about", data.navAbout], ["gallery", data.navGallery]] },
    { title: data.navServices, items: [["services", "עיצוב גבות"], ["services", "מניקור"], ["services", "תספורות"]] },
    { title: data.navAbout, items: [["team", data.navTeam], ["pricing", data.navPricing], ["shop", data.navShop]] },
    { title: "Info", items: [["gallery", data.navGallery], ["contact", data.navContact], ["blog", data.navBlog]] },
  ];

  return (
    <footer className="bg-[#241612] py-16 text-white" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.2fr_1.4fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f0cdb4] text-lg font-black text-[#241612]">
              {data.logoText}
            </div>
            <div>
              <div className="text-2xl font-black">{data.brandName}</div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#f0cdb4]">
                {data.footerSalon}
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-base font-medium leading-8 text-white/65">
            {data.footerText}
          </p>
          <div className="mt-6 text-sm font-bold text-white/75">{data.phone}</div>
          <div className="mt-2 text-sm font-bold text-white/75">{data.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-black text-[#f0cdb4]">{group.title}</h4>
              <div className="mt-4 space-y-3">
                {group.items.map(([id, label]) => (
                  <button
                    key={`${group.title}-${label}`}
                    type="button"
                    onClick={() => navigateTo(id, onNavigate)}
                    className="block text-sm font-bold text-white/65 transition hover:text-white"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.06] p-6">
          <h4 className="text-xl font-black">{data.newsletterTitle}</h4>
          <p className="mt-2 text-sm font-medium leading-7 text-white/60">
            {data.newsletterText}
          </p>
          <div className="mt-5 flex rounded-full border border-white/10 bg-white/10 p-1">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-white placeholder:text-white/35 outline-none"
              placeholder="אימייל"
            />
            <button
              type="button"
              className="rounded-full bg-[#f0cdb4] px-5 py-3 text-sm font-black text-[#241612]"
            >
              שליחה
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-sm font-bold text-white/45 lg:px-8">
        © Shinora. All Rights Reserved.
      </div>
    </footer>
  );
}

function PageHero({ data, title, text }: { data: any; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden bg-[#fff8f2] py-24" dir="rtl">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#f4d5bd]/55 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionLabel>{data.brandName}</SectionLabel>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-[-0.06em] text-[#241612] md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#745344]">
          {text}
        </p>
      </div>
    </section>
  );
}

function HomePage({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <>
      <Hero data={data} onNavigate={onNavigate} />
      <SalonVideoSection data={data} onNavigate={onNavigate} />
      <ServicesSection data={data} onNavigate={onNavigate} limit={3} />
      <ConsultationSection data={data} />
      <WhySection data={data} onNavigate={onNavigate} />
      <DirectorSection data={data} />
      <TestimonialsSection data={data} />
      <PartnersSection data={data} />
      <BlogSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function AboutPage({ data }: { data: any }) {
  return (
    <>
      <PageHero data={data} title="מי אנחנו" text={data.introText} />
      <WhySection data={data} />
      <DirectorSection data={data} />
      <TeamSection data={data} />
      <TestimonialsSection data={data} />
    </>
  );
}

function ServicesPage({
  data,
  onNavigate,
}: {
  data: any;
  onNavigate?: (pageId: string) => void;
}) {
  return (
    <>
      <PageHero data={data} title="כל השירותים" text={data.servicesText} />
      <ServicesSection data={data} onNavigate={onNavigate} />
      <ConsultationSection data={data} />
    </>
  );
}

function ContactPage({ data }: { data: any }) {
  return (
    <>
      <PageHero data={data} title="ייעוץ וקביעת תור" text={data.consultationText} />
      <ConsultationSection data={data} />
    </>
  );
}

function CurrentPage({
  pageKey,
  data,
  onNavigate,
}: {
  pageKey: PageKey;
  data: any;
  onNavigate?: (pageId: string) => void;
}) {
  if (pageKey === "about") return <AboutPage data={data} />;
  if (pageKey === "services") return <ServicesPage data={data} onNavigate={onNavigate} />;

  if (pageKey === "pricing") {
    return (
      <>
        <PageHero data={data} title="מחירון" text="חבילות ברורות לטיפולים, אירועים ותחזוקה חודשית." />
        <PricingSection data={data} />
      </>
    );
  }

  if (pageKey === "gallery") {
    return (
      <>
        <PageHero data={data} title="גלריה" text="תמונות אווירה, טיפולים ותוצאות מתוך הסלון." />
        <GallerySection data={data} />
      </>
    );
  }

  if (pageKey === "shop") {
    return (
      <>
        <PageHero data={data} title="חנות" text="מוצרי טיפוח משלימים לחוויית סלון גם בבית." />
        <ProductsSection data={data} />
      </>
    );
  }

  if (pageKey === "blog") {
    return (
      <>
        <PageHero data={data} title="בלוג" text="טיפים, מדריכים ורעיונות לטיפוח, שיער ואיפור." />
        <BlogSection data={data} onNavigate={onNavigate} limit={data.posts.length} />
      </>
    );
  }

  if (pageKey === "contact") return <ContactPage data={data} />;

  return <HomePage data={data} onNavigate={onNavigate} />;
}

export default function ShinoraPages(props: ShinoraPagesProps) {
  const pageKey = getPageKey(props);
  const data = useMemo(() => ({ ...shinoraDefaultData, ...(props.data || {}) }), [props.data]);

  return (
    <main className="min-h-screen bg-[#fff8f2] font-sans text-[#241612]" dir="rtl">
      <Header data={data} pageKey={pageKey} onNavigate={props.onNavigate} />
      <CurrentPage pageKey={pageKey} data={data} onNavigate={props.onNavigate} />
      <Footer data={data} onNavigate={props.onNavigate} />
    </main>
  );
}