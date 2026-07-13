import React from "react";

import {
  cycloraDefaultData,
  cycloraPages as cycloraPagesData,
  type CycloraCase,
  type CycloraData,
  type CycloraMediaValue,
  type CycloraPageId,
} from "./cycloraData";

export const cycloraPages = [...cycloraPagesData];

type CycloraPagesProps = {
  initialPage?: CycloraPageId | string;
  activePageId?: CycloraPageId | string;
  mode?: "preview" | "editor" | "edit" | "public" | string;
  data?: Partial<CycloraData>;
  isStudioStatic?: boolean;
};

type VisualElementType = "text" | "image" | "button" | "section" | "box";

type SharedProps = {
  data: CycloraData;
  mode: string;
};

type RevealElement = HTMLElement & {
  dataset: DOMStringMap & {
    revealed?: string;
  };
};

const REVEAL_CLASS =
  "cyclora-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100";

function buttonLabelClass(variant: "light" | "dark"): string {
  return variant === "light" ? "!text-black" : "!text-white";
}

function isEditorMode(mode: string) {
  return mode === "editor" || mode === "edit";
}

function orbitShellClass(mode: string) {
  return isEditorMode(mode)
    ? "absolute inset-0"
    : "pointer-events-none absolute inset-0";
}

function editorPointerClass(mode: string) {
  return isEditorMode(mode) ? "" : "pointer-events-none ";
}

const HERO_ORBIT_LAYOUTS = [
  {
    className:
      "left-[4%] top-[12%] w-[clamp(8.5rem,16vw,16rem)] aspect-[4/5]",
    rotate: -12,
    shift: -95,
    depth: 0.82,
  },
  {
    className:
      "right-[5%] top-[9%] w-[clamp(7.5rem,14vw,14rem)] aspect-square",
    rotate: 9,
    shift: 82,
    depth: 1.02,
  },
  {
    className:
      "left-[12%] bottom-[9%] w-[clamp(7rem,13vw,13rem)] aspect-square",
    rotate: 8,
    shift: 108,
    depth: 0.94,
  },
  {
    className:
      "right-[12%] bottom-[7%] w-[clamp(8rem,15vw,15rem)] aspect-[4/5]",
    rotate: -8,
    shift: -118,
    depth: 0.88,
  },
  {
    className:
      "left-1/2 top-[8%] hidden w-[clamp(6rem,10vw,10rem)] -translate-x-1/2 aspect-[3/4] lg:block",
    rotate: 4,
    shift: 55,
    depth: 0.72,
  },
];

const AVATAR_ORBIT_LAYOUTS = [
  "left-[4%] top-[8%]",
  "right-[8%] top-[4%]",
  "left-[12%] bottom-[5%]",
  "right-[3%] bottom-[12%]",
  "left-1/2 top-[1%] -translate-x-1/2",
  "left-1/2 bottom-[2%] -translate-x-1/2",
];

const SOCIAL_LINKS = [
  { short: "אי", label: "אינסטגרם" },
  { short: "לין", label: "לינקדאין" },
  { short: "אקס", label: "אקס" },
  { short: "פי", label: "פייסבוק" },
] as const;

const CTA_ORBIT_LAYOUTS = [
  {
    className:
      "left-[5%] top-[9%] w-[clamp(7rem,13vw,13rem)] aspect-[4/5]",
    rotate: -11,
  },
  {
    className:
      "right-[7%] top-[7%] w-[clamp(6.5rem,11vw,11rem)] aspect-square",
    rotate: 10,
  },
  {
    className:
      "left-[9%] bottom-[7%] w-[clamp(6rem,10vw,10rem)] aspect-square",
    rotate: 7,
  },
  {
    className:
      "right-[10%] bottom-[6%] w-[clamp(7rem,13vw,13rem)] aspect-[4/5]",
    rotate: -8,
  },
];

function visualProps(
  id: string,
  type: VisualElementType,
  label?: string,
): Record<string, string> {
  return {
    "data-visual-edit-id": id,
    "data-visual-edit-type": type,
    "data-visual-type": type,
    "data-visual-editable": "true",
    ...(label ? { "data-visual-edit-label": label } : {}),
  };
}

function sectionProps(
  id: string,
  label: string,
  kind: string,
): Record<string, string> {
  return {
    ...visualProps(id, "section", label),
    "data-template-section-id": id,
    "data-section-kind": kind,
    "data-section-title": label,
    "data-bizuply-block": "section",
  };
}

function safeArray<T>(
  value: readonly T[] | null | undefined,
  fallback: readonly T[] = [],
): T[] {
  return Array.isArray(value) ? [...value] : [...fallback];
}

function safeObject<T extends object>(value: unknown): Partial<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Partial<T>;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const item = value as Record<string, unknown>;
    return String(
      item.secureUrl ||
        item.secure_url ||
        item.url ||
        item.src ||
        item.originalUrl ||
        "",
    ).trim();
  }

  return "";
}

function isVideoUrl(value: unknown): boolean {
  const src = getMediaUrl(value).toLowerCase().split("?")[0].split("#")[0];
  return Boolean(
    src.includes("/video/upload/") ||
      src.endsWith(".mp4") ||
      src.endsWith(".webm") ||
      src.endsWith(".mov") ||
      src.endsWith(".m4v") ||
      src.endsWith(".ogv"),
  );
}

function resolveMedia(value: unknown, fallback: unknown): string {
  const selected = getMediaUrl(value);
  return selected || getMediaUrl(fallback);
}

function mergeData(data?: Partial<CycloraData>): CycloraData {
  const incoming = safeObject<CycloraData>(data);
  const defaultHero = cycloraDefaultData.hero;
  const incomingHero = safeObject<CycloraData["hero"]>(incoming.hero);
  const incomingCta = safeObject<CycloraData["cta"]>(incoming.cta);
  const incomingFooter = safeObject<CycloraData["footer"]>(incoming.footer);

  return {
    ...cycloraDefaultData,
    ...incoming,
    brand: {
      ...cycloraDefaultData.brand,
      ...safeObject<CycloraData["brand"]>(incoming.brand),
    },
    hero: {
      ...defaultHero,
      ...incomingHero,
      orbitMedia: safeArray<CycloraMediaValue>(
        incomingHero.orbitMedia,
        defaultHero.orbitMedia,
      ).map((item, index) =>
        resolveMedia(
          item,
          defaultHero.orbitMedia[index] || defaultHero.orbitMedia[0],
        ),
      ),
    },
    strategyProof: {
      ...cycloraDefaultData.strategyProof,
      ...safeObject<CycloraData["strategyProof"]>(incoming.strategyProof),
    },
    strategyHeading: {
      ...cycloraDefaultData.strategyHeading,
      ...safeObject<CycloraData["strategyHeading"]>(
        incoming.strategyHeading,
      ),
    },
    workHeading: {
      ...cycloraDefaultData.workHeading,
      ...safeObject<CycloraData["workHeading"]>(incoming.workHeading),
    },
    testimonialHeading: {
      ...cycloraDefaultData.testimonialHeading,
      ...safeObject<CycloraData["testimonialHeading"]>(
        incoming.testimonialHeading,
      ),
    },
    pricingHeading: {
      ...cycloraDefaultData.pricingHeading,
      ...safeObject<CycloraData["pricingHeading"]>(incoming.pricingHeading),
    },
    faqHeading: {
      ...cycloraDefaultData.faqHeading,
      ...safeObject<CycloraData["faqHeading"]>(incoming.faqHeading),
    },
    cta: {
      ...cycloraDefaultData.cta,
      ...incomingCta,
      orbitMedia: safeArray<CycloraMediaValue>(
        incomingCta.orbitMedia,
        cycloraDefaultData.cta.orbitMedia,
      ).map((item, index) =>
        resolveMedia(
          item,
          cycloraDefaultData.cta.orbitMedia[index] ||
            cycloraDefaultData.cta.orbitMedia[0],
        ),
      ),
    },
    footer: {
      ...cycloraDefaultData.footer,
      ...incomingFooter,
      links: safeArray(
        incomingFooter.links,
        cycloraDefaultData.footer.links,
      ),
    },
    nav: safeArray(incoming.nav, cycloraDefaultData.nav),
    strategies: safeArray(
      incoming.strategies,
      cycloraDefaultData.strategies,
    ),
    cases: safeArray(incoming.cases, cycloraDefaultData.cases).map(
      (item, index) => {
        const fallbackCase =
          cycloraDefaultData.cases[
            index % Math.max(1, cycloraDefaultData.cases.length)
          ];

        return {
          ...fallbackCase,
          ...item,
          image: resolveMedia(item?.image, fallbackCase?.image),
        };
      },
    ),
    testimonials: safeArray(
      incoming.testimonials,
      cycloraDefaultData.testimonials,
    ).map((item, index) => {
      const fallbackTestimonial =
        cycloraDefaultData.testimonials[
          index % Math.max(1, cycloraDefaultData.testimonials.length)
        ];

      return {
        ...fallbackTestimonial,
        ...item,
        avatar: resolveMedia(item?.avatar, fallbackTestimonial?.avatar),
      };
    }),
    plans: safeArray(incoming.plans, cycloraDefaultData.plans),
    faq: safeArray(incoming.faq, cycloraDefaultData.faq),
  };
}

function MediaElement({
  value,
  fallback,
  field,
  alt,
  className,
  decorative = false,
}: {
  value: unknown;
  fallback?: unknown;
  field: string;
  alt: string;
  className?: string;
  decorative?: boolean;
}) {
  const src = resolveMedia(value, fallback);
  if (!src) return null;

  const mediaType = isVideoUrl(src) ? "video" : "image";
  const common = {
    className,
    ...visualProps(field, "image", alt),
    "data-editable": "image",
    "data-field": field,
    "data-image-field": field,
    "data-media-field": field,
    "data-visual-image-field": field,
    "data-visual-media-type": mediaType,
    "data-resource-type": mediaType,
    "data-visual-current-src": src,
  } as Record<string, any>;

  if (mediaType === "video") {
    return (
      <video
        {...common}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : alt}
      />
    );
  }

  return (
    <img
      {...common}
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
    />
  );
}

function useRevealRuntime(rootRef: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const elements = Array.from(
      root.querySelectorAll<RevealElement>(".cyclora-reveal"),
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.revealed = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as RevealElement;
          element.dataset.revealed = "true";
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => {
      if (!element.dataset.revealed) element.dataset.revealed = "false";
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [rootRef]);
}

function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  let parent = node?.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
}

function useHeroProgress(
  heroRef: React.RefObject<HTMLElement | null>,
  mode: string,
): number {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isEditorMode(mode)) {
      setProgress(0);
      return;
    }

    const hero = heroRef.current;
    if (!hero || typeof window === "undefined") return;

    const scroller = getScrollParent(hero);
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const viewport =
        scroller === window
          ? window.innerHeight
          : (scroller as HTMLElement).clientHeight;
      const distance = Math.max(1, hero.offsetHeight - viewport);
      const nextProgress = Math.max(0, Math.min(1, -rect.top / distance));
      setProgress((current) =>
        Math.abs(current - nextProgress) > 0.001 ? nextProgress : current,
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      scroller.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [heroRef, mode]);

  return isEditorMode(mode) ? 0 : progress;
}

function useSmoothLinks(
  rootRef: React.RefObject<HTMLElement | null>,
  mode: string,
) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    if (mode === "editor" || mode === "edit") return;

    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );

    const onClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href") || "";
      if (href === "#" || href.length < 2) return;
      const target = root.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    links.forEach((link) => link.addEventListener("click", onClick));
    return () => {
      links.forEach((link) => link.removeEventListener("click", onClick));
    };
  }, [rootRef, mode]);
}

export default function CycloraPages({
  initialPage = "home",
  activePageId,
  mode = "preview",
  data,
}: CycloraPagesProps = {}) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const heroRef = React.useRef<HTMLElement | null>(null);
  const templateData = React.useMemo(() => mergeData(data), [data]);
  const pageId = String(activePageId || initialPage || "home");
  const heroProgress = useHeroProgress(heroRef, mode);

  useRevealRuntime(rootRef);
  useSmoothLinks(rootRef, mode);

  return (
    <main
      ref={rootRef}
      id="top"
      dir="rtl"
      data-template-id="cyclora"
      data-template-mode={mode}
      data-template-page-id={pageId}
      data-studio-page="true"
      data-bizuply-site="true"
      className="relative min-h-screen w-full overflow-x-clip bg-[#050505] text-white antialiased [font-family:Inter,Arial,sans-serif] selection:bg-white selection:text-black"
    >
      <TopNotch />
      <Header data={templateData} mode={mode} />
      <HeroSection
        ref={heroRef}
        data={templateData}
        mode={mode}
        progress={heroProgress}
      />
      <StrategySection data={templateData} mode={mode} />
      <WorkSection data={templateData} mode={mode} />
      <TestimonialsSection data={templateData} mode={mode} />
      <PricingSection data={templateData} mode={mode} />
      <FaqSection data={templateData} mode={mode} />
      <CtaSection data={templateData} mode={mode} />
      <Footer data={templateData} mode={mode} />
    </main>
  );
}

function TopNotch() {
  return (
    <div
      className="pointer-events-none fixed left-1/2 top-0 z-[70] flex h-6 w-32 -translate-x-1/2 items-start justify-center rounded-b-3xl bg-black md:w-40"
      aria-hidden="true"
    >
      <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-white/50" />
      <span className="ml-2 mt-2 block h-1.5 w-8 rounded-full bg-white/20" />
    </div>
  );
}

function Header({ data }: SharedProps) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-5 text-white sm:px-6 lg:px-10"
      {...sectionProps("global.header", "כותרת עליונה", "header")}
    >
      <a
        className="flex items-center gap-2 text-base font-black uppercase tracking-[0.18em] sm:text-lg"
        href="#top"
        data-editable="link"
        {...visualProps("brand.name", "button", "לוגו")}
      >
        <span
          data-editable="text"
          {...visualProps("brand.name.text", "text", "שם המותג")}
        >
          {data.brand.name}
        </span>
        <i className="not-italic" aria-hidden="true">
          ✦
        </i>
      </a>

      <nav
        className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] md:flex"
        aria-label="ניווט ראשי"
      >
        {safeArray(data.nav).map((item, index) => (
          <a
            key={`${item.href}-${index}`}
            href={item.href}
            className="relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
            data-editable="link"
            {...visualProps(
              `nav.${index}.label`,
              "button",
              `קישור ניווט ${index + 1}`,
            )}
          >
            <span data-editable="text">{item.label}</span>
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="rounded-full border border-white/70 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-black sm:px-5 sm:py-2.5"
        data-editable="link"
        {...visualProps("global.header.cta", "button", "כפתור יצירת קשר")}
      >
        <span
          className={buttonLabelClass("dark")}
          data-editable="text"
          {...visualProps("global.header.cta", "text", "טקסט כפתור יצירת קשר")}
        >
          בואו נדבר
        </span>
      </a>
    </header>
  );
}

type HeroSectionProps = SharedProps & {
  progress: number;
};

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ data, mode, progress }, ref) {
    const contentOpacity = Math.max(0, 1 - progress * 1.35);
    const orbitOpacity = Math.max(0, 1 - Math.max(0, progress - 0.65) * 2.7);
    const wipeOpacity = Math.max(0, Math.min(1, (progress - 0.22) / 0.72));
    const wipeScale = 0.16 + progress * 4.9;

    return (
      <section
        ref={ref}
        className="relative min-h-[220vh] bg-[#050505]"
        {...sectionProps("home.hero", "אזור פתיחה", "hero")}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#050505_0%,#090909_100%)]"
          data-visual-background-layer="true"
          {...visualProps("home.hero.background", "box", "רקע אזור פתיחה")}
        >
          <div
            className={orbitShellClass(mode)}
            data-visual-editor-layer="orbit"
            aria-label="גלריית מדיה מרחפת"
            style={{ opacity: orbitOpacity }}
          >
            {safeArray(data.hero.orbitMedia).map((item, index) => {
              const layout =
                HERO_ORBIT_LAYOUTS[index % HERO_ORBIT_LAYOUTS.length];
              const verticalShift = progress * layout.shift;
              const scale = 1 + progress * 0.16 * layout.depth;
              const rotate = layout.rotate + progress * layout.rotate * -0.55;

              return (
                <div
                  key={`hero-orbit-${index}`}
                  className={`absolute overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 p-1 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm ${layout.className}`}
                  style={{
                    transform: `translate3d(0, ${verticalShift}px, 0) rotate(${rotate}deg) scale(${scale})`,
                    transition: "opacity 220ms ease-out",
                  }}
                >
                  <MediaElement
                    value={item}
                    fallback={cycloraDefaultData.hero.orbitMedia[index]}
                    field={`hero.orbitMedia.${index}`}
                    alt={`מדיה מרחפת ${index + 1}`}
                    className="h-full w-full rounded-[1.45rem] object-cover"
                    decorative={!isEditorMode(mode)}
                  />
                </div>
              );
            })}
          </div>

          <div
            className={`${editorPointerClass(mode)}absolute inset-0 z-[35] flex flex-col items-center justify-center px-5 text-center sm:px-8`}
            data-visual-no-background="true"
            {...visualProps("hero.marquee.wrap", "box", "כותרת מרכזית")}
          >
            <h1
              className="text-balance text-[clamp(3.2rem,11vw,8.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-white"
              data-editable="text"
              {...visualProps("hero.marquee", "text", "כותרת ענקית")}
            >
              {data.hero.marquee}{" "}
              <span className="text-white/35" aria-hidden="true">
                ✦
              </span>
            </h1>

            <p
              className="mt-5 text-[11px] font-black uppercase tracking-[0.36em] text-white/60 sm:text-xs"
              data-editable="text"
              {...visualProps("hero.title", "text", "כותרת פתיחה")}
            >
              {data.hero.title}
            </p>

            <p
              className="mt-4 max-w-3xl text-balance text-[clamp(1.35rem,3vw,2.25rem)] font-black leading-tight tracking-[-0.04em] text-white/90"
              data-editable="text"
              {...visualProps("hero.accent", "text", "הדגשת כותרת")}
            >
              {data.hero.accent}
            </p>

            <p
              className="mt-4 max-w-2xl text-balance text-sm leading-7 text-white/55 sm:text-base sm:leading-8"
              data-editable="text"
              {...visualProps(
                "hero.description",
                "text",
                "תיאור פתיחה",
              )}
            >
              {data.hero.description}
            </p>
          </div>

          <div
            className="relative z-30 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-end px-5 pb-10 pt-32 sm:px-8 lg:px-12"
            style={{
              opacity: contentOpacity,
              transform: `translate3d(0, ${(-progress * 70).toFixed(2)}px, 0)`,
              willChange: "transform, opacity",
            }}
          >
            <div className="grid grid-cols-2 items-end gap-5 md:grid-cols-4">
              <div className="hidden h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-[9px] font-black uppercase tracking-[0.18em] text-white/60 md:flex">
                <span>{data.hero.scrollLabel}</span>
              </div>

              <p
                className="max-w-xs text-xs leading-6 text-white/65"
                data-editable="text"
                {...visualProps("hero.microcopy", "text", "טקסט משלים")}
              >
                {data.hero.microcopy}
              </p>

              <div
                className="hidden items-center justify-center gap-2 md:flex"
                aria-label="רשתות חברתיות"
              >
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href="#contact"
                    aria-label={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-[10px] font-black text-white transition-colors duration-300 hover:bg-white hover:text-black"
                  >
                    {link.short}
                  </a>
                ))}
              </div>

              <div className="col-span-1 flex justify-self-end gap-3">
                <a
                  href="#strategy"
                  className="rounded-full border border-white/60 bg-transparent px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 sm:px-6 sm:py-3.5"
                  data-editable="link"
                  {...visualProps(
                    "hero.secondaryButton",
                    "button",
                    "כפתור משני",
                  )}
                >
                  <span
                    className={buttonLabelClass("dark")}
                    data-editable="text"
                  >
                    {data.hero.secondaryButton}
                  </span>
                </a>
                <a
                  href="#contact"
                  className="rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-transform duration-300 hover:-translate-y-1 sm:px-7 sm:py-4"
                  data-editable="link"
                  {...visualProps(
                    "hero.primaryButton",
                    "button",
                    "כפתור ראשי",
                  )}
                >
                  <span
                    className={buttonLabelClass("light")}
                    data-editable="text"
                  >
                    {data.hero.primaryButton}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-40 flex h-[44vmin] w-[44vmin] items-center justify-center rounded-full bg-[#f2efe7] text-[10px] font-black uppercase tracking-[0.22em] text-black shadow-[0_0_100px_rgba(242,239,231,0.28)]"
            style={{
              opacity: wipeOpacity,
              transform: `translate(-50%, -50%) scale(${wipeScale})`,
              willChange: "transform, opacity",
            }}
            aria-hidden="true"
          >
            <span style={{ opacity: Math.max(0, 1 - progress * 2.4) }}>
              {data.hero.scrollLabel}
            </span>
          </div>
        </div>
      </section>
    );
  },
);

function SectionHeading({
  eyebrow,
  title,
  accent,
  scope,
  light = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  scope: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-5xl">
      <span
        className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${
          light
            ? "border-white/20 text-white/55"
            : "border-black/15 text-black/55"
        }`}
        data-editable="text"
        {...visualProps(`${scope}.eyebrow`, "text", "תגית כותרת")}
      >
        <i className="h-1.5 w-1.5 rounded-full bg-current not-italic" />
        {eyebrow}
      </span>

      <h2
        className={`text-balance text-[clamp(2.8rem,7vw,7.5rem)] font-black leading-[0.9] tracking-[-0.07em] ${
          light ? "text-white" : "text-black"
        }`}
      >
        <span
          data-editable="text"
          {...visualProps(`${scope}.title`, "text", "כותרת")}
        >
          {title}
        </span>{" "}
        <em
          className={`not-italic ${light ? "text-white/35" : "text-black/30"}`}
          data-editable="text"
          {...visualProps(`${scope}.accent`, "text", "הדגשה")}
        >
          {accent}
        </em>
      </h2>
    </div>
  );
}

function DotSphere({ index = 0 }: { index?: number }) {
  const gradients = [
    "radial-gradient(circle, rgba(0,0,0,.95) 0 1.25px, transparent 1.45px)",
    "radial-gradient(circle, rgba(0,0,0,.8) 0 1.1px, transparent 1.35px)",
    "radial-gradient(circle, rgba(0,0,0,.9) 0 1.35px, transparent 1.6px)",
  ];

  return (
    <div
      className="absolute bottom-5 left-5 h-32 w-32 rounded-full opacity-70 sm:h-40 sm:w-40"
      style={{
        backgroundImage: gradients[index % gradients.length],
        backgroundSize: `${7 + (index % 3)}px ${7 + (index % 3)}px`,
        WebkitMaskImage:
          "radial-gradient(circle at 50% 45%, black 36%, rgba(0,0,0,.85) 54%, transparent 74%)",
        maskImage:
          "radial-gradient(circle at 50% 45%, black 36%, rgba(0,0,0,.85) 54%, transparent 74%)",
      }}
      aria-hidden="true"
    />
  );
}

function StrategySection({ data, mode }: SharedProps) {
  return (
    <section
      id="strategy"
      className="relative z-20 -mt-[10vh] overflow-hidden rounded-t-[3rem] bg-[#f2efe7] pb-32 pt-28 text-black sm:rounded-t-[5rem] sm:pb-40 sm:pt-36"
      {...sectionProps("home.strategy", "Solutions", "services")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <span className="absolute left-1/2 top-7 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.24em] text-black/35">
          {data.hero.scrollLabel}
        </span>

        <SectionHeading
          eyebrow={data.strategyHeading.eyebrow}
          title={data.strategyHeading.title}
          accent={data.strategyHeading.accent}
          scope="strategyHeading"
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[minmax(18rem,auto)]">
          <article
            data-revealed="false"
            className={`${REVEAL_CLASS} relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-black p-7 text-white md:col-span-2 xl:col-span-5 xl:row-span-1 sm:p-9`}
          >
            <div className="flex -space-x-3 space-x-reverse">
              {safeArray(data.testimonials)
                .slice(0, 4)
                .map((item, index) => (
                  <MediaElement
                    key={`proof-avatar-${index}`}
                    value={item.avatar}
                    field={`testimonials.${index}.avatar`}
                    alt={`לקוח ${index + 1}`}
                    className="h-12 w-12 rounded-full border-2 border-black object-cover"
                  />
                ))}
            </div>
            <p
              className="max-w-sm text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl"
              data-editable="text"
              {...visualProps("strategyProof.text", "text", "טקסט הוכחה")}
            >
              {data.strategyProof.text}
            </p>
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          </article>

          {safeArray(data.strategies).map((item, index) => {
            const gridClass =
              index === 0
                ? "xl:col-span-4"
                : index === 1
                  ? "xl:col-span-3"
                  : index === 2
                    ? "xl:col-span-7"
                    : "xl:col-span-5";

            return (
              <article
                key={`strategy-${index}`}
                data-revealed="false"
                className={`${REVEAL_CLASS} ${gridClass} relative min-h-[18rem] overflow-hidden rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.06)] sm:p-9`}
                style={{ transitionDelay: `${Math.min(index + 1, 4) * 90}ms` }}
                {...visualProps(
                  `strategies.${index}.card`,
                  "section",
                  `כרטיס פתרון ${index + 1}`,
                )}
              >
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35"
                  data-editable="text"
                  {...visualProps(
                    `strategies.${index}.eyebrow`,
                    "text",
                    `תגית פתרון ${index + 1}`,
                  )}
                >
                  {item.eyebrow}
                </span>

                <h3
                  className="relative z-10 mt-5 max-w-md text-3xl font-black leading-[0.98] tracking-[-0.045em] sm:text-4xl"
                  data-editable="text"
                  {...visualProps(
                    `strategies.${index}.title`,
                    "text",
                    `כותרת פתרון ${index + 1}`,
                  )}
                >
                  {item.title}
                </h3>

                <p
                  className="relative z-10 mt-5 max-w-md text-sm leading-7 text-black/55"
                  data-editable="text"
                  {...visualProps(
                    `strategies.${index}.description`,
                    "text",
                    `תיאור פתרון ${index + 1}`,
                  )}
                >
                  {item.description}
                </p>

                <DotSphere index={index} />

                {item.metric ? (
                  <strong
                    className="absolute bottom-7 right-7 z-10 text-4xl font-black tracking-[-0.06em] sm:text-5xl"
                    data-editable="text"
                    {...visualProps(
                      `strategies.${index}.metric`,
                      "text",
                      `מדד פתרון ${index + 1}`,
                    )}
                  >
                    {item.metric}
                  </strong>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data, mode }: SharedProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const panelRefs = React.useRef<Array<HTMLElement | null>>([]);
  const cases = safeArray<CycloraCase>(data.cases);
  const active = cases[activeIndex] || cases[0];

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const refs = panelRefs.current.filter(Boolean) as HTMLElement[];
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(
          (visible.target as HTMLElement).dataset.caseIndex || 0,
        );
        setActiveIndex(index);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    refs.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [mode, cases.length]);

  return (
    <section
      id="work"
      className="relative bg-[#050505] py-28 text-white sm:py-36"
      {...sectionProps("home.work", "עבודות נבחרות", "gallery")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={data.workHeading.eyebrow}
            title={data.workHeading.title}
            accent={data.workHeading.accent}
            scope="workHeading"
            light
          />
          <div className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
            <div
              data-editable="text"
              {...visualProps("workHeading.proofLabel", "text", "תווית הוכחה")}
            >
              {data.workHeading.proofLabel}
            </div>
            <div
              className="mt-1"
              data-editable="text"
              {...visualProps("workHeading.proofMeta", "text", "מטא הוכחה")}
            >
              {data.workHeading.proofMeta}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20">
        {active ? (
          <div className={`${editorPointerClass(mode)}sticky top-[20vh] z-30 mx-auto -mb-[24rem] flex h-[24rem] w-[min(88vw,30rem)] flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-black/65 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:h-[30rem] sm:w-[min(74vw,38rem)]`}>
            <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
              <span
                data-editable="text"
                {...visualProps(
                  `cases.${activeIndex}.eyebrow`,
                  "text",
                  "תגית פרויקט פעיל",
                )}
              >
                {active.eyebrow}
              </span>
              <span>
                {String(activeIndex + 1).padStart(2, "0")}/
                {String(cases.length).padStart(2, "0")}
              </span>
            </div>

            <MediaElement
              value={active.image}
              fallback={cycloraDefaultData.cases[activeIndex]?.image}
              field={`cases.${activeIndex}.image`}
              alt={active.title}
              className="min-h-0 flex-1 rounded-[1.45rem] object-cover"
            />

            <strong
              className="px-2 pb-2 pt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl"
              data-editable="text"
              {...visualProps(
                `cases.${activeIndex}.title`,
                "text",
                "שם הפרויקט הפעיל",
              )}
            >
              {active.title}
            </strong>
          </div>
        ) : null}

        <div className="space-y-10 px-4 sm:px-8 lg:px-12">
          {cases.map((item, index) => (
            <article
              key={`case-panel-${index}`}
              ref={(element) => {
                panelRefs.current[index] = element;
              }}
              data-case-index={index}
              className="relative mx-auto min-h-[88vh] max-w-[1500px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5"
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              {...visualProps(
                `cases.${index}.panel`,
                "section",
                `פרויקט ${index + 1}`,
              )}
            >
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 sm:p-8">
                <span
                  data-editable="text"
                  {...visualProps(
                    `cases.${index}.category`,
                    "text",
                    `קטגוריית פרויקט ${index + 1}`,
                  )}
                >
                  {item.category}
                </span>
                <span
                  data-editable="text"
                  {...visualProps(
                    `cases.${index}.year`,
                    "text",
                    `שנת פרויקט ${index + 1}`,
                  )}
                >
                  {item.year}
                </span>
              </div>

              <MediaElement
                value={item.image}
                fallback={cycloraDefaultData.cases[index]?.image}
                field={`cases.${index}.image`}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/5 to-black/55" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data, mode }: SharedProps) {
  const testimonials = safeArray(data.testimonials);
  const [index, setIndex] = React.useState(0);
  const length = Math.max(1, testimonials.length);
  const first = testimonials[index % length];
  const second = testimonials[(index + 1) % length];

  const move = (direction: number) => {
    setIndex((current) => (current + direction + length) % length);
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden rounded-t-[3rem] bg-[#f2efe7] pb-32 pt-28 text-black sm:rounded-t-[5rem] sm:pb-40 sm:pt-36"
      {...sectionProps("home.testimonials", "המלצות", "testimonials")}
    >
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow={data.testimonialHeading.eyebrow}
          title={data.testimonialHeading.title}
          accent={data.testimonialHeading.accent}
          scope="testimonialHeading"
        />

        <div
          className={`${orbitShellClass(mode)} hidden lg:block`}
          data-visual-editor-layer="orbit"
          aria-hidden={!isEditorMode(mode)}
        >
          {testimonials.slice(0, AVATAR_ORBIT_LAYOUTS.length).map((item, avatarIndex) => (
            <div
              key={`orbit-avatar-${avatarIndex}`}
              className={`absolute flex items-center gap-2 rounded-full border border-black/10 bg-white/80 p-1.5 pr-3 shadow-lg backdrop-blur-sm ${AVATAR_ORBIT_LAYOUTS[avatarIndex]}`}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-black/45">
                {item.badge}
              </span>
              <MediaElement
                value={item.avatar}
                field={`testimonials.${avatarIndex}.avatar`}
                alt={item.name}
                className="h-10 w-10 rounded-full object-cover"
                decorative={!isEditorMode(mode)}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-24 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[first, second].map((item, cardIndex) => {
            if (!item) return null;
            const realIndex = (index + cardIndex) % testimonials.length;

            return (
              <article
                key={`${item.name}-${cardIndex}`}
                data-revealed="false"
                className={`${REVEAL_CLASS} flex min-h-[25rem] flex-col justify-between rounded-[2rem] bg-white p-7 shadow-[0_25px_90px_rgba(0,0,0,0.07)] sm:p-10`}
                {...visualProps(
                  `testimonials.${realIndex}.card`,
                  "section",
                  `כרטיס המלצה ${realIndex + 1}`,
                )}
              >
                <div className="text-sm tracking-[0.25em]" aria-label="5 כוכבים">
                  ★★★★★
                </div>

                <blockquote
                  className="my-10 text-balance text-2xl font-black leading-tight tracking-[-0.04em] sm:text-4xl"
                  data-editable="text"
                  {...visualProps(
                    `testimonials.${realIndex}.quote`,
                    "text",
                    `המלצה ${realIndex + 1}`,
                  )}
                >
                  “{item.quote}”
                </blockquote>

                <div className="flex items-center gap-4">
                  <MediaElement
                    value={item.avatar}
                    field={`testimonials.${realIndex}.avatar`}
                    alt={item.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <strong
                      className="block text-sm font-black"
                      data-editable="text"
                      {...visualProps(
                        `testimonials.${realIndex}.name`,
                        "text",
                        `שם ממליץ ${realIndex + 1}`,
                      )}
                    >
                      {item.name}
                    </strong>
                    <span
                      className="mt-1 block text-xs text-black/45"
                      data-editable="text"
                      {...visualProps(
                        `testimonials.${realIndex}.role`,
                        "text",
                        `תפקיד ממליץ ${realIndex + 1}`,
                      )}
                    >
                      {item.role}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="המלצה קודמת"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white text-lg text-black transition-colors duration-300 hover:bg-black hover:text-white"
            {...visualProps("home.testimonials.previous", "button", "הקודם")}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="המלצה הבאה"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white text-lg text-black transition-colors duration-300 hover:bg-black hover:text-white"
            {...visualProps("home.testimonials.next", "button", "הבא")}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ data }: SharedProps) {
  return (
    <section
      id="pricing"
      className="bg-[#050505] py-28 text-white sm:py-36"
      {...sectionProps("home.pricing", "מחירים", "pricing")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow={data.pricingHeading.eyebrow}
          title={data.pricingHeading.title}
          accent={data.pricingHeading.accent}
          scope="pricingHeading"
          light
        />

        <div className="mt-16 grid grid-cols-1 gap-4 lg:mx-auto lg:max-w-5xl lg:grid-cols-2">
          {safeArray(data.plans).map((plan, index) => (
            <article
              key={`plan-${index}`}
              data-revealed="false"
              className={`${REVEAL_CLASS} relative flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] border p-7 sm:p-9 ${
                plan.featured
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/[0.035] text-white"
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
              {...visualProps(
                `plans.${index}.card`,
                "section",
                `תוכנית ${index + 1}`,
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  data-editable="text"
                  {...visualProps(`plans.${index}.name`, "text", "שם תוכנית")}
                >
                  {plan.name}
                </span>
                <em
                  className={`rounded-full border px-3 py-1 text-[9px] font-black not-italic uppercase tracking-[0.16em] ${
                    plan.featured
                      ? "border-black/15 text-black/50"
                      : "border-white/20 text-white/45"
                  }`}
                  data-editable="text"
                  {...visualProps(`plans.${index}.tag`, "text", "תגית תוכנית")}
                >
                  {plan.tag}
                </em>
              </div>

              <div className="mt-12 flex items-end gap-2">
                <strong
                  className="text-6xl font-black leading-none tracking-[-0.08em] sm:text-7xl"
                  data-editable="text"
                  {...visualProps(`plans.${index}.price`, "text", "מחיר")}
                >
                  {plan.price}
                </strong>
                <span
                  className={`pb-2 text-xs ${
                    plan.featured ? "text-black/45" : "text-white/45"
                  }`}
                  data-editable="text"
                  {...visualProps(
                    `plans.${index}.suffix`,
                    "text",
                    "סיומת מחיר",
                  )}
                >
                  {plan.suffix}
                </span>
              </div>

              <p
                className={`mt-6 text-sm leading-7 ${
                  plan.featured ? "text-black/55" : "text-white/50"
                }`}
                data-editable="text"
                {...visualProps(
                  `plans.${index}.description`,
                  "text",
                  "תיאור תוכנית",
                )}
              >
                {plan.description}
              </p>

              <div
                className={`my-7 h-px ${
                  plan.featured ? "bg-black/10" : "bg-white/10"
                }`}
              />

              <small
                className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                  plan.featured ? "text-black/40" : "text-white/40"
                }`}
              >
                כולל:
              </small>

              <ul className="mt-5 space-y-3">
                {safeArray(plan.features).map((feature, featureIndex) => (
                  <li
                    key={`plan-${index}-feature-${featureIndex}`}
                    className="flex items-start gap-3 text-sm leading-6"
                    data-editable="text"
                    {...visualProps(
                      `plans.${index}.features.${featureIndex}`,
                      "text",
                      `תכונה ${featureIndex + 1}`,
                    )}
                  >
                    <span className="mt-0.5 text-xs">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.16em] transition-transform duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "bg-black shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                    : "bg-white shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
                }`}
                data-editable="link"
                {...visualProps(
                  `plans.${index}.button`,
                  "button",
                  "כפתור תוכנית",
                )}
              >
                <span
                  className={buttonLabelClass(plan.featured ? "dark" : "light")}
                  data-editable="text"
                >
                  {plan.button}
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: SharedProps) {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section
      id="faq"
      className="border-t border-white/10 bg-[#050505] pb-32 pt-24 text-white sm:pb-40 sm:pt-32"
      {...sectionProps("home.faq", "שאלות ותשובות", "faq")}
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow={data.faqHeading.eyebrow}
            title={data.faqHeading.title}
            accent={data.faqHeading.accent}
            scope="faqHeading"
            light
          />
        </div>

        <div className="border-t border-white/15">
          {safeArray(data.faq).map((item, index) => {
            const isOpen = open === index;

            return (
              <article
                key={`faq-${index}`}
                className="border-b border-white/15"
                {...visualProps(
                  `faq.${index}.item`,
                  "section",
                  `שאלה ${index + 1}`,
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-5 py-6 text-right sm:py-8"
                  {...visualProps(
                    `faq.${index}.question.button`,
                    "button",
                    `פתיחת שאלה ${index + 1}`,
                  )}
                >
                  <span
                    className="text-xl font-black leading-tight tracking-[-0.03em] sm:text-2xl"
                    data-editable="text"
                    {...visualProps(
                      `faq.${index}.question`,
                      "text",
                      `שאלה ${index + 1}`,
                    )}
                  >
                    <span className="ml-4 text-xs text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.question}
                  </span>
                  <i
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl not-italic transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </i>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className="max-w-2xl pb-8 pr-10 text-sm leading-7 text-white/50 sm:pr-14 sm:text-base sm:leading-8"
                      data-editable="text"
                      {...visualProps(
                        `faq.${index}.answer`,
                        "text",
                        `תשובה ${index + 1}`,
                      )}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data, mode }: SharedProps) {
  return (
    <section
      id="contact"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden rounded-t-[3rem] bg-[#f2efe7] px-5 py-28 text-black sm:rounded-t-[5rem] sm:px-8 sm:py-36"
      {...sectionProps("home.cta", "קריאה לפעולה", "cta")}
    >
      <div
        className={orbitShellClass(mode)}
        data-visual-editor-layer="orbit"
        aria-hidden={!isEditorMode(mode)}
      >
        {safeArray(data.cta.orbitMedia).map((item, index) => {
          const layout = CTA_ORBIT_LAYOUTS[index % CTA_ORBIT_LAYOUTS.length];

          return (
            <div
              key={`cta-media-${index}`}
              className={`absolute overflow-hidden rounded-[1.5rem] border border-black/10 bg-white p-1 shadow-[0_25px_70px_rgba(0,0,0,0.12)] ${layout.className}`}
              style={{ transform: `rotate(${layout.rotate}deg)` }}
            >
              <MediaElement
                value={item}
                fallback={cycloraDefaultData.cta.orbitMedia[index]}
                field={`cta.orbitMedia.${index}`}
                alt={`מדיה קריאה לפעולה ${index + 1}`}
                className="h-full w-full rounded-[1.2rem] object-cover"
                decorative={!isEditorMode(mode)}
              />
            </div>
          );
        })}
      </div>

      <div
        data-revealed="false"
        className={`${REVEAL_CLASS} relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center`}
      >
        <span
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-black/50"
          data-editable="text"
          {...visualProps("cta.eyebrow", "text", "תגית קריאה לפעולה")}
        >
          <i className="h-1.5 w-1.5 rounded-full bg-black not-italic" />
          {data.cta.eyebrow}
        </span>

        <h2 className="text-balance text-[clamp(3rem,8vw,8.5rem)] font-black leading-[0.86] tracking-[-0.075em]">
          <span
            data-editable="text"
            {...visualProps("cta.title", "text", "כותרת קריאה לפעולה")}
          >
            {data.cta.title}
          </span>{" "}
          <em
            className="text-black/25 not-italic"
            data-editable="text"
            {...visualProps(
              "cta.accent",
              "text",
              "הדגשת קריאה לפעולה",
            )}
          >
            {data.cta.accent}
          </em>
        </h2>

        <p
          className="mt-7 max-w-2xl text-balance text-sm leading-7 text-black/55 sm:text-base sm:leading-8"
          data-editable="text"
          {...visualProps(
            "cta.description",
            "text",
            "תיאור קריאה לפעולה",
          )}
        >
          {data.cta.description}
        </p>

        <a
          href={`mailto:${data.brand.email}`}
          className="mt-9 inline-flex items-center justify-center rounded-full bg-black px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1"
          data-editable="link"
          {...visualProps("cta.button", "button", "כפתור קריאה לפעולה")}
        >
          <span className={buttonLabelClass("dark")} data-editable="text">
            {data.cta.button}
          </span>
        </a>
      </div>
    </section>
  );
}

function Footer({ data }: SharedProps) {
  return (
    <footer
      className="relative overflow-hidden bg-[#050505] pb-0 pt-20 text-white"
      {...sectionProps("global.footer", "תחתית האתר", "footer")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-14 border-b border-white/15 pb-16 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-2xl font-black uppercase tracking-[0.16em]"
            >
              <span
                data-editable="text"
                {...visualProps(
                  "footer.brandName",
                  "text",
                  "שם מותג בתחתית",
                )}
              >
                {data.brand.name}
              </span>
              <i className="not-italic" aria-hidden="true">
                ✦
              </i>
            </a>

            <p
              className="mt-6 max-w-xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8"
              data-editable="text"
              {...visualProps(
                "footer.description",
                "text",
                "תיאור תחתית",
              )}
            >
              {data.footer.description}
            </p>

            <div className="mt-8 flex gap-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href="#contact"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[10px] font-black transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  {link.short}
                </a>
              ))}
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-7 gap-y-4 text-sm lg:grid-cols-1"
            aria-label="ניווט תחתון"
          >
            {safeArray(data.footer.links).map((item, index) => (
              <a
                key={`footer-link-${index}`}
                href={item.href}
                className="text-white/55 transition-colors duration-300 hover:text-white"
                data-editable="link"
                {...visualProps(
                  `footer.links.${index}.label`,
                  "button",
                  `קישור תחתון ${index + 1}`,
                )}
              >
                <span data-editable="text">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span
            data-editable="text"
            {...visualProps(
              "footer.copyright",
              "text",
              "זכויות יוצרים",
            )}
          >
            {data.footer.copyright}
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${data.brand.email}`}>{data.brand.email}</a>
            <a href={`tel:${data.brand.phone}`}>{data.brand.phone}</a>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none overflow-hidden border-t border-white/10 py-4 text-center text-[clamp(4rem,15vw,15rem)] font-black uppercase leading-[0.75] tracking-[0.2em] text-white/[0.05]"
        aria-hidden="true"
      >
        ✦ ✦ ✦ ✦ ✦
      </div>
    </footer>
  );
}
