import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Gem,
  Menu,
  MousePointer2,
  Palette,
  Plus,
  Quote,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from "lucide-react";

import {
  launchoraDefaultData,
  type LaunchoraDefaultData,
} from "./defaultData";

type LaunchoraPageId = "home";

type LaunchoraPagesProps = {
  initialPage?: LaunchoraPageId;
  mode?: "preview" | "editor" | "live";
  data?: Partial<LaunchoraDefaultData>;
};

type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  result: string;
  image: string;
  imageKey: keyof LaunchoraDefaultData;
  dark?: boolean;
};

type ServiceItem = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type ProcessStep = {
  step: string;
  title: string;
  text: string;
};

type Testimonial = {
  name: string;
  role: string;
  text: string;
  featured: boolean;
};

type PricingPlan = {
  name: string;
  desc: string;
  price: string;
  label: string;
  cta: string;
  featured: boolean;
  features: string[];
};

type FaqItem = {
  q: string;
  a: string;
};

function getSiteData(data?: Partial<LaunchoraDefaultData>): LaunchoraDefaultData {
  return {
    ...launchoraDefaultData,
    ...(data || {}),
  };
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();

  return (
    <div
      ref={ref}
      className={`launchora-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return <ArrowRight size={17} className={`rotate-180 ${className}`} />;
}

function clampNumber(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerpNumber(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutCubic(value: number) {
  const t = clampNumber(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(value: number) {
  const t = clampNumber(value, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window === "undefined" ? 1440 : window.innerWidth,
    height: typeof window === "undefined" ? 900 : window.innerHeight,
  }));

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

function getLaunchoraScrollParent(node: HTMLElement): HTMLElement | Window {
  const markedParent = node.closest<HTMLElement>("[data-launchora-scroll-root='true']");

  if (markedParent) {
    return markedParent;
  }

  let parent = node.parentElement;

  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const canScroll = /(auto|scroll|overlay)/.test(overflowY);

    if (canScroll && parent.scrollHeight > parent.clientHeight + 2) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window;
}

function getScrollViewport(scrollParent: HTMLElement | Window) {
  if (!(scrollParent instanceof HTMLElement)) {
    return {
      top: 0,
      width: window.innerWidth || 1440,
      height: window.innerHeight || 900,
    };
  }

  const rect = scrollParent.getBoundingClientRect();

  return {
    top: rect.top,
    width: scrollParent.clientWidth || rect.width || 1440,
    height: scrollParent.clientHeight || rect.height || 900,
  };
}

function usePinnedScrollProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 1440 : window.innerWidth,
    height: typeof window === "undefined" ? 900 : window.innerHeight,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;
    let cleanupScroll: (() => void) | null = null;
    let lastProgress = -1;
    let lastWidth = -1;
    let lastHeight = -1;

    function measure() {
      const node = ref.current;
      if (!node) return;

      const scrollParent = getLaunchoraScrollParent(node);
      const scrollViewport = getScrollViewport(scrollParent);
      const rect = node.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - scrollViewport.height);

      /*
        חשוב לעורך ול-Preview:
        מחשבים לפי קונטיינר הגלילה האמיתי, לא לפי window בלבד.
        ככה האפקט עובד גם כשהעמוד יושב בתוך div עם overflow:auto.
      */
      const raw = (scrollViewport.top - rect.top) / scrollableDistance;
      const next = clampNumber(raw, 0, 1);

      if (Math.abs(next - lastProgress) > 0.001) {
        lastProgress = next;
        setProgress(next);
      }

      if (
        Math.abs(scrollViewport.width - lastWidth) > 1 ||
        Math.abs(scrollViewport.height - lastHeight) > 1
      ) {
        lastWidth = scrollViewport.width;
        lastHeight = scrollViewport.height;
        setViewport({
          width: scrollViewport.width,
          height: scrollViewport.height,
        });
      }
    }

    function requestMeasure() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    }

    function attachListeners() {
      const node = ref.current;
      if (!node) {
        requestMeasure();
        return;
      }

      const scrollParent = getLaunchoraScrollParent(node);

      const scrollTarget: EventTarget = scrollParent === window ? window : scrollParent;
      scrollTarget.addEventListener("scroll", requestMeasure, { passive: true });
      window.addEventListener("resize", requestMeasure);

      cleanupScroll = () => {
        scrollTarget.removeEventListener("scroll", requestMeasure);
        window.removeEventListener("resize", requestMeasure);
      };

      requestMeasure();
    }

    const attachFrame = window.requestAnimationFrame(attachListeners);

    return () => {
      window.cancelAnimationFrame(attachFrame);
      if (frame) window.cancelAnimationFrame(frame);
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return { ref, progress, viewport };
}

function AvatarStack() {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  ];

  return (
    <div className="flex items-center">
      {avatars.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
          style={{ marginRight: index === 0 ? 0 : -10 }}
        />
      ))}
    </div>
  );
}

function HeroVisual({ siteData }: { siteData: LaunchoraDefaultData }) {
  const steps = [
    siteData.heroDashboardStepOne,
    siteData.heroDashboardStepTwo,
    siteData.heroDashboardStepThree,
    siteData.heroDashboardStepFour,
  ];

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[610px] lg:h-[520px]">
      <div className="absolute inset-8 rounded-full bg-[#dfe7ff] blur-3xl" />

      <div className="launchora-float-slow absolute right-2 top-16 z-10 h-64 w-48 rotate-[8deg] overflow-hidden rounded-[2rem] bg-black p-5 text-white shadow-2xl sm:right-10 sm:h-80 sm:w-60">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Sparkles size={14} />
          סטודיו דיגיטל
        </div>

        <p
          className="mt-10 text-4xl font-black leading-[0.9] tracking-[-0.06em]"
          data-edit-field="heroCardTitle"
          data-field-key="heroCardTitle"
        >
          {siteData.heroCardTitle}
        </p>

        <div className="mt-8 space-y-3">
          <div className="h-2 w-28 rounded-full bg-white/30" />
          <div className="h-2 w-36 rounded-full bg-white/20" />
          <div className="h-2 w-20 rounded-full bg-white/20" />
        </div>
      </div>

      <div
        className="launchora-float absolute left-0 top-9 h-72 w-56 rotate-[-7deg] overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5 sm:left-8 sm:h-96 sm:w-72"
        data-visual-editable="true"
        data-visual-edit-id="hero.imageCard"
        data-visual-edit-type="image"
        data-visual-edit-label="תמונה ראשית"
        data-visual-container-button="true"
        data-visual-delete-parent="true"
        data-edit-field="heroImage"
        data-field-key="heroImage"
        data-image-field="heroImage"
        data-edit-type="image"
      >
        <img
          src={siteData.heroImage}
          alt=""
          className="h-full w-full object-cover"
          data-visual-editable="true"
          data-visual-edit-id="hero.image"
          data-visual-edit-type="image"
          data-visual-edit-label="תמונה ראשית"
          data-edit-field="heroImage"
          data-field-key="heroImage"
          data-image-field="heroImage"
          data-edit-type="image"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-5 right-5 left-5">
          <p
            className="text-xs font-medium text-white/70"
            data-edit-field="heroCaseStudyLabel"
          >
            {siteData.heroCaseStudyLabel}
          </p>
          <p
            className="mt-1 text-xl font-bold leading-tight text-white"
            data-edit-field="heroCaseStudyTitle"
          >
            {siteData.heroCaseStudyTitle}
          </p>
        </div>
      </div>

      <div className="launchora-float-main absolute bottom-2 right-12 z-20 w-[82%] rounded-[2rem] bg-white p-5 shadow-[0_35px_100px_rgba(15,23,42,0.18)] ring-1 ring-black/5 sm:right-24 sm:w-[430px] sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Gem size={15} />
            </span>
            <div>
              <p className="text-sm font-bold">{siteData.heroDashboardBrand}</p>
              <p className="text-[11px] text-neutral-400">
                {siteData.heroDashboardLabel}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-bold text-[#5277ff]">
            {siteData.heroDashboardBadge}
          </span>
        </div>

        <div className="rounded-3xl bg-[#f7f7f6] p-4">
          <div className="mb-4 flex items-center justify-between text-[11px] text-neutral-400">
            <span>מסלול משתמש</span>
            <span>המרה</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {steps.map((label, index) => (
              <div key={label} className="rounded-2xl bg-white p-3 shadow-sm">
                <div
                  className={`mb-6 h-2 rounded-full ${
                    index === 0
                      ? "bg-black"
                      : index === 1
                        ? "bg-[#5277ff]"
                        : "bg-neutral-300"
                  }`}
                />
                <p className="text-[10px] font-semibold text-neutral-700">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-neutral-100 p-4">
          <div>
            <p className="text-[11px] text-neutral-400">
              {siteData.heroDashboardMetricLabel}
            </p>
            <p className="mt-1 text-lg font-black">
              {siteData.heroDashboardMetricValue}
            </p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">
            <Clock3 size={16} />
          </div>
        </div>
      </div>

      <div className="launchora-chip absolute bottom-24 right-2 z-30 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-bold text-neutral-700 shadow-xl backdrop-blur">
        <Target size={15} className="text-[#5277ff]" />
        {siteData.heroChipOneText}
      </div>

      <div className="launchora-chip-reverse absolute left-2 top-5 z-30 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-bold text-neutral-700 shadow-xl backdrop-blur">
        <Zap size={15} className="text-[#5277ff]" />
        {siteData.heroChipTwoText}
      </div>
    </div>
  );
}

function SocialProofBar({
  siteData,
  brands,
}: {
  siteData: LaunchoraDefaultData;
  brands: string[];
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-10 pt-2 sm:px-8 sm:pb-12">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr] lg:items-center lg:p-5">
            <div className="rounded-[1.5rem] bg-[#f8f8f7] px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-center gap-4">
                <AvatarStack />

                <div>
                  <div className="mb-1 flex items-center gap-1 text-black">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className="fill-black text-black"
                      />
                    ))}
                  </div>

                  <p
                    className="text-sm font-black text-neutral-950"
                    data-edit-field="socialProofTitle"
                  >
                    {siteData.socialProofTitle}
                  </p>
                  <p
                    className="text-xs text-neutral-500"
                    data-edit-field="socialProofSubtitle"
                  >
                    {siteData.socialProofSubtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />

              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {brands.map((brand, index) => (
                  <div
                    key={`${brand}-${index}`}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-[#fbfbfa] px-5 py-3 text-sm font-bold text-neutral-700 transition duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:bg-white hover:text-neutral-950"
                  >
                    {index % 2 === 0 ? (
                      <Sparkles size={14} className="text-[#5277ff]" />
                    ) : (
                      <Zap size={14} className="text-[#5277ff]" />
                    )}
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectModal({
  project,
  siteData,
  onClose,
}: {
  project: Project | null;
  siteData: LaunchoraDefaultData;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-3 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/90 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold text-neutral-400">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-1 text-xl font-black text-neutral-950">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-black hover:text-white"
            aria-label="סגירת חלון"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_.9fr] lg:p-8">
          <div
            className="overflow-hidden rounded-[1.5rem] bg-neutral-100"
            data-visual-editable="true"
            data-visual-edit-id={`project.${String(project.imageKey)}.modalCard`}
            data-visual-edit-type="image"
            data-visual-edit-label={`${project.title} - תמונה`}
            data-visual-container-button="true"
            data-visual-delete-parent="true"
            data-edit-field={project.imageKey}
            data-field-key={project.imageKey}
            data-image-field={project.imageKey}
            data-edit-type="image"
          >
            <img
              src={project.image}
              alt=""
              className="h-[300px] w-full object-cover sm:h-[430px]"
              data-visual-editable="true"
              data-visual-edit-id={`project.${String(project.imageKey)}.modal`}
              data-visual-edit-type="image"
              data-visual-edit-label={`${project.title} - תמונה`}
              data-edit-field={project.imageKey}
              data-field-key={project.imageKey}
              data-image-field={project.imageKey}
              data-edit-type="image"
            />
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-3xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-5xl">
                {project.subtitle}
              </p>
              <p className="mt-5 text-base leading-8 text-neutral-600">
                {project.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-black p-6 text-white">
              <p className="text-xs font-bold text-white/50">
                {siteData.projectModalResultLabel}
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.04em]">
                {project.result}
              </p>
            </div>

            <a
              href="#contact"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full bg-[#5277ff] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {siteData.projectModalCta}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroWorkMotion({
  siteData,
  brands,
  projects,
  onOpen,
}: {
  siteData: LaunchoraDefaultData;
  brands: string[];
  projects: Project[];
  onOpen: (project: Project) => void;
}) {
  const windowSize = useWindowSize();
  const { ref, progress, viewport } = usePinnedScrollProgress();

  const width = viewport.width || windowSize.width;
  const height = viewport.height || windowSize.height;

  const cards = projects.slice(0, 4);
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <>
        <section id="top" className="relative overflow-hidden bg-[#fbfbfa]">
          <div className="launchora-grid-bg absolute inset-0 opacity-70" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-10 pt-14 sm:px-8">
            <div>
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-700 shadow-sm"
                data-edit-field="heroEyebrow"
              >
                <span className="h-2 w-2 rounded-full bg-[#5277ff]" />
                {siteData.heroEyebrow}
              </div>

              <h1
                className="max-w-[690px] text-[58px] font-black leading-[0.86] tracking-[-0.085em] text-neutral-950 sm:text-[86px]"
                data-edit-field="heroTitle"
              >
                {siteData.heroTitle}
              </h1>

              <p
                className="mt-8 max-w-xl text-lg leading-8 text-neutral-600"
                data-edit-field="heroSubtitle"
              >
                {siteData.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-black px-7 text-sm font-black text-white shadow-xl shadow-black/15"
                  style={{ color: "#fff" }}
                >
                  {siteData.heroPrimaryButton}
                  <ArrowIcon />
                </a>

                <a
                  href="#pricing"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-7 text-sm font-black text-neutral-950"
                >
                  {siteData.heroSecondaryButton}
                  <ChevronDown size={17} />
                </a>
              </div>
            </div>

            <div className="grid gap-5">
              {cards.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  siteData={siteData}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </div>
        </section>

        <SocialProofBar siteData={siteData} brands={brands} />
      </>
    );
  }

  /*
    אפקט לפי ההקלטה:
    1. בהתחלה: Hero רגיל + ערימת 4 כרטיסים בצד.
    2. בגלילה: הערימה עצמה נגררת למטה, לא מוחלפת בגריד אחר.
    3. תוך כדי ירידה: הכרטיסים נפתחים מ-stack ל-2x2.
    4. הכותרת "עבודות נבחרות" עולה מתחת, והכרטיסים מתיישבים עליה כמו ב-LaunchNow.
  */
  const safeHeight = Math.max(720, height || 900);
  const isTablet = width < 1180;

  const heroOut = easeInOutCubic((progress - 0.12) / 0.28);
  const proofOut = easeInOutCubic((progress - 0.16) / 0.22);
  const titleIn = easeOutCubic((progress - 0.28) / 0.22);
  const cardTravel = easeInOutCubic((progress - 0.18) / 0.62);
  const cardSpread = easeInOutCubic((progress - 0.36) / 0.42);
  const contentIn = easeOutCubic((progress - 0.48) / 0.28);

  const stackHeight = isTablet
    ? Math.max(220, Math.min(255, safeHeight * 0.32))
    : Math.max(285, Math.min(360, safeHeight * 0.4));

  const finalHeight = isTablet
    ? Math.max(180, Math.min(215, safeHeight * 0.26))
    : Math.max(215, Math.min(270, safeHeight * 0.3));

  const cardHeight = lerpNumber(stackHeight, finalHeight, cardSpread);
  const cardWidth = cardHeight * 1.72;

  const gridGapX = cardWidth + (isTablet ? 30 : 44);
  const gridGapY = cardHeight + (isTablet ? 24 : 34);

  /*
    מיקום יחסי למרכז המסך:
    start = הערימה בהירו, מימין.
    end = גריד מתחת לכותרת Latest Projects.
  */
  const startCenterX = isTablet ? -215 : -355;
  const startCenterY = isTablet ? -95 : -115;

  const endCenterX = 0;
  const endCenterY = isTablet ? 150 : 178;

  const centerX = lerpNumber(startCenterX, endCenterX, cardTravel);
  const centerY = lerpNumber(startCenterY, endCenterY, cardTravel);

  const stackStart = [
    { x: 0, y: 0, rotate: 4.2, scale: 1, z: 80 },
    { x: -94, y: 25, rotate: -8.6, scale: 0.92, z: 70 },
    { x: 122, y: 35, rotate: 8.1, scale: 0.88, z: 60 },
    { x: 22, y: -70, rotate: -3.4, scale: 0.84, z: 50 },
  ];

  /*
    סדר RTL: הכרטיס הראשון בצד ימין למעלה.
  */
  const gridEnd = [
    { x: gridGapX / 2, y: -gridGapY / 2, rotate: 0 },
    { x: -gridGapX / 2, y: -gridGapY / 2, rotate: 0 },
    { x: gridGapX / 2, y: gridGapY / 2, rotate: 0 },
    { x: -gridGapX / 2, y: gridGapY / 2, rotate: 0 },
  ];

  return (
    <section
      ref={ref}
      className="relative h-[285vh] overflow-visible bg-[#fbfbfa]"
      data-launchora-hero-work-motion="true"
    >
      <div className="sticky top-0 h-screen min-h-[720px] overflow-hidden bg-[#fbfbfa]">
        <div className="launchora-grid-bg absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-[-14%] h-[540px] w-[920px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="relative mx-auto h-full w-full max-w-7xl px-5 sm:px-8">
          <div
            id="top"
            className="absolute right-0 top-[9%] z-10 max-w-[610px]"
            style={{
              opacity: lerpNumber(1, 0, heroOut),
              transform: `translateY(${lerpNumber(0, -86, heroOut)}px) scale(${lerpNumber(1, 0.965, heroOut)})`,
              pointerEvents: heroOut > 0.82 ? "none" : "auto",
            }}
          >
            <div
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-700 shadow-sm"
              data-edit-field="heroEyebrow"
            >
              <span className="h-2 w-2 rounded-full bg-[#5277ff]" />
              {siteData.heroEyebrow}
            </div>

            <h1
              className="max-w-[700px] text-[64px] font-black leading-[0.86] tracking-[-0.085em] text-neutral-950 lg:text-[104px]"
              data-edit-field="heroTitle"
            >
              {siteData.heroTitle}
            </h1>

            <p
              className="mt-7 max-w-xl text-lg leading-8 text-neutral-600"
              data-edit-field="heroSubtitle"
            >
              {siteData.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#work"
                className="launchora-shine relative flex h-14 w-fit items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-7 text-sm font-black text-white shadow-xl shadow-black/15"
                data-edit-field="heroPrimaryButton"
                style={{ color: "#fff" }}
              >
                {siteData.heroPrimaryButton}
                <ArrowIcon />
              </a>

              <a
                href="#pricing"
                className="flex h-14 w-fit items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-7 text-sm font-black text-neutral-950 shadow-sm"
                data-edit-field="heroSecondaryButton"
              >
                {siteData.heroSecondaryButton}
                <ChevronDown size={17} />
              </a>
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-[7%] z-10"
            style={{
              opacity: lerpNumber(1, 0, proofOut),
              transform: `translateY(${lerpNumber(0, -42, proofOut)}px)`,
              pointerEvents: proofOut > 0.82 ? "none" : "auto",
            }}
          >
            <div className="mx-auto max-w-7xl">
              <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white/90 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="relative min-w-0">
                    <div className="flex gap-3 overflow-hidden">
                      {brands.slice(0, 8).map((brand, index) => (
                        <div
                          key={`${brand}-${index}`}
                          className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-[#fbfbfa] px-5 py-3 text-sm font-bold text-neutral-700"
                        >
                          {index % 2 === 0 ? (
                            <Sparkles size={14} className="text-[#5277ff]" />
                          ) : (
                            <Zap size={14} className="text-[#5277ff]" />
                          )}
                          {brand}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-[#f8f8f7] px-5 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <AvatarStack />
                      <div>
                        <div className="mb-1 flex items-center gap-1 text-black">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              className="fill-black text-black"
                            />
                          ))}
                        </div>
                        <p className="text-sm font-black text-neutral-950">
                          {siteData.socialProofTitle}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {siteData.socialProofSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="work"
            className="absolute right-0 top-[8%] z-20 max-w-[940px]"
            style={{
              opacity: titleIn,
              transform: `translateY(${lerpNumber(120, 0, titleIn)}px)`,
            }}
          >
            <p className="mb-4 text-sm font-black text-[#5277ff]">
              {siteData.workKicker}
            </p>

            <h2 className="text-[54px] font-black leading-[0.9] tracking-[-0.08em] text-neutral-950 lg:text-[86px]">
              {siteData.workTitle}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-500">
              {siteData.workText}
            </p>
          </div>

          <div
            className="absolute right-1/2 top-1/2 z-30"
            style={{
              transform: `translate(50%, -50%) translate(${centerX}px, ${centerY}px)`,
            }}
          >
            {cards.map((project, index) => {
              const start = stackStart[index] || stackStart[0];
              const end = gridEnd[index] || gridEnd[0];

              const x = lerpNumber(start.x, end.x, cardSpread);
              const y = lerpNumber(start.y, end.y, cardSpread);
              const rotate = lerpNumber(start.rotate, end.rotate, cardSpread);
              const scale = lerpNumber(start.scale, 1, cardSpread);
              const contentOpacity = lerpNumber(0.08, 1, contentIn);
              const contentY = lerpNumber(18, 0, contentIn);
              const zIndex = start.z;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={(event) => {
                    const isEditorMode =
                      event.currentTarget.closest("[data-mode='editor']") ||
                      event.currentTarget.closest("[data-editor='true']") ||
                      event.currentTarget.closest("[data-visual-template-canvas='true']");

                    if (isEditorMode) {
                      event.preventDefault();
                      event.stopPropagation();
                      return;
                    }

                    onOpen(project);
                  }}
                  className="group absolute overflow-hidden rounded-[1.6rem] bg-black text-right shadow-[0_24px_90px_rgba(15,23,42,0.25)] ring-1 ring-black/5"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transform: `translate(calc(50% + ${x - cardWidth / 2}px), calc(-50% + ${y - cardHeight / 2}px)) rotate(${rotate}deg) scale(${scale})`,
                    transformOrigin: "50% 50%",
                    willChange: "transform, width, height",
                  }}
                  data-visual-editable="true"
                  data-visual-edit-id={`project.${String(project.imageKey)}`}
                  data-visual-edit-type="image"
                  data-visual-edit-label={`${project.title} - תמונה`}
                  data-visual-container-button="true"
                  data-visual-delete-parent="true"
                  data-edit-field={project.imageKey}
                  data-field-key={project.imageKey}
                  data-image-field={project.imageKey}
                  data-edit-type="image"
                >
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    data-visual-editable="true"
                    data-visual-edit-id={`project.${String(project.imageKey)}.img`}
                    data-visual-edit-type="image"
                    data-visual-edit-label={`${project.title} - תמונה`}
                    data-edit-field={project.imageKey}
                    data-field-key={project.imageKey}
                    data-image-field={project.imageKey}
                    data-edit-type="image"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/78 via-black/20 to-transparent" />

                  <div
                    className="pointer-events-none absolute top-4 right-4 left-4 flex items-center justify-between gap-2"
                    style={{
                      opacity: contentOpacity,
                      transform: `translateY(${contentY}px)`,
                    }}
                  >
                    <span className="rounded-full bg-white/92 px-3.5 py-2 text-[11px] font-black text-black backdrop-blur">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-black/72 px-3.5 py-2 text-[11px] font-black text-white backdrop-blur">
                      {project.year}
                    </span>
                  </div>

                  <div
                    className="pointer-events-none absolute bottom-5 right-5 left-5"
                    style={{
                      opacity: contentOpacity,
                      transform: `translateY(${contentY}px)`,
                    }}
                  >
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-black text-black shadow-lg">
                      {siteData.projectViewButton}
                      <ArrowIcon />
                    </div>

                    <h3 className="text-3xl font-black leading-[0.92] tracking-[-0.065em] text-white">
                      {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/80">
                      {project.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  siteData,
  onOpen,
}: {
  project: Project;
  index: number;
  siteData: LaunchoraDefaultData;
  onOpen: (project: Project) => void;
}) {
  function handleProjectClick(event: React.MouseEvent<HTMLButtonElement>) {
    const isEditorMode =
      event.currentTarget.closest("[data-mode='editor']") ||
      event.currentTarget.closest("[data-editor='true']") ||
      event.currentTarget.closest("[data-visual-template-canvas='true']");

    if (isEditorMode) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onOpen(project);
  }

  return (
    <Reveal delay={index * 90}>
      <button
        type="button"
        onClick={handleProjectClick}
        className={`group block w-full overflow-hidden rounded-[2rem] text-right shadow-sm ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
          project.dark ? "bg-black text-white" : "bg-white text-neutral-950"
        }`}
        data-visual-editable="true"
        data-visual-edit-id={`project.${String(project.imageKey)}`}
        data-visual-edit-type="image"
        data-visual-edit-label={`${project.title} - תמונה`}
        data-visual-container-button="true"
        data-visual-delete-parent="true"
        data-edit-field={project.imageKey}
        data-field-key={project.imageKey}
        data-image-field={project.imageKey}
        data-edit-type="image"
      >
        <div className="relative h-[360px] overflow-hidden sm:h-[460px]">
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            data-visual-editable="true"
            data-visual-edit-id={`project.${String(project.imageKey)}.img`}
            data-visual-edit-type="image"
            data-visual-edit-label={`${project.title} - תמונה`}
            data-edit-field={project.imageKey}
            data-field-key={project.imageKey}
            data-image-field={project.imageKey}
            data-edit-type="image"
          />

          <div
            className={`pointer-events-none absolute inset-0 ${
              project.dark
                ? "bg-gradient-to-t from-black via-black/25 to-transparent"
                : "bg-gradient-to-t from-black/65 via-black/10 to-transparent"
            }`}
          />

          <div className="pointer-events-none absolute top-5 right-5 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-black backdrop-blur">
              {project.category}
            </span>
            <span className="rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur">
              {project.year}
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-6 right-6 left-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg transition duration-300 group-hover:-translate-y-1">
              {siteData.projectViewButton}
              <ArrowIcon />
            </div>
            <h3 className="max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl">
              {project.title}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
              {project.subtitle}
            </p>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  const Icon = service.icon;

  return (
    <Reveal delay={index * 80}>
      <article className="group h-full rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-black/20 hover:shadow-2xl">
        <div className="mb-10 flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2ff] text-[#5277ff] transition duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white">
            <Icon size={20} />
          </span>
          <ArrowIcon className="text-neutral-400 transition duration-500 group-hover:-translate-x-1 group-hover:text-black" />
        </div>

        <h3 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
          {service.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-neutral-500">
          {service.desc}
        </p>
      </article>
    </Reveal>
  );
}

function TestimonialCard({
  item,
  index,
}: {
  item: Testimonial;
  index: number;
}) {
  if (item.featured) {
    return (
      <Reveal delay={index * 90} className="lg:col-span-2">
        <article className="relative h-full overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,119,255,.35),transparent_32%)]" />
          <Quote size={42} className="relative z-10 text-white/50" />
          <p className="relative z-10 mt-5 text-2xl font-bold leading-tight tracking-[-0.04em] sm:text-3xl">
            {item.text}
          </p>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="mt-1 text-sm text-white/50">{item.role}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={16}
                  className="fill-white text-white"
                />
              ))}
            </div>
          </div>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delay={index * 90}>
      <article className="h-full rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
        <Quote size={30} className="text-neutral-200" />
        <p className="mt-5 text-base font-semibold leading-8 text-neutral-900">
          {item.text}
        </p>
        <div className="mt-10">
          <p className="font-bold text-neutral-950">{item.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{item.role}</p>
        </div>
      </article>
    </Reveal>
  );
}

function PricingCard({
  plan,
  index,
  popularLabel,
}: {
  plan: PricingPlan;
  index: number;
  popularLabel: string;
}) {
  return (
    <Reveal delay={index * 100}>
      <article
        className={`relative h-full overflow-hidden rounded-[2rem] p-7 shadow-sm ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
          plan.featured ? "bg-black text-white" : "bg-white text-neutral-950"
        }`}
      >
        {plan.featured && (
          <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            {popularLabel}
          </div>
        )}

        <div className="max-w-md">
          <h3 className="text-2xl font-black tracking-[-0.05em]">
            {plan.name}
          </h3>
          <p
            className={`mt-3 text-sm leading-7 ${
              plan.featured ? "text-white/60" : "text-neutral-500"
            }`}
          >
            {plan.desc}
          </p>
        </div>

        <div className="mt-10">
          <p className="text-5xl font-black tracking-[-0.07em]">
            {plan.price}
          </p>
          <p
            className={`mt-2 text-sm ${
              plan.featured ? "text-white/50" : "text-neutral-500"
            }`}
          >
            {plan.label}
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check
                size={17}
                className={plan.featured ? "text-white" : "text-black"}
              />
              <span
                className={plan.featured ? "text-white/75" : "text-neutral-700"}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`mt-10 flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black transition duration-300 hover:-translate-y-1 ${
            plan.featured
              ? "bg-white text-black hover:shadow-2xl"
              : "bg-black text-white hover:shadow-xl"
          }`}
        >
          {plan.cta}
          <ArrowIcon />
        </a>
      </article>
    </Reveal>
  );
}

function FAQItem({
  item,
  defaultOpen = false,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-right text-base font-black text-neutral-950 transition hover:bg-neutral-50"
      >
        <span>{item.q}</span>
        <Plus
          size={18}
          className={`shrink-0 transition duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-7 text-neutral-500">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  text,
  action,
}: {
  kicker?: string;
  title: string;
  text?: string;
  action?: string;
}) {
  return (
    <Reveal>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
        <div>
          {kicker && (
            <p className="mb-3 text-sm font-black text-[#5277ff]">{kicker}</p>
          )}
          <h2 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] text-neutral-950 sm:text-6xl">
            {title}
          </h2>
        </div>

        {(text || action) && (
          <div className="max-w-md">
            {text && (
              <p className="text-base leading-8 text-neutral-500">{text}</p>
            )}
            {action && (
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-neutral-950"
              >
                {action}
                <ArrowIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function LaunchoraPages({
  initialPage = "home",
  mode = "preview",
  data,
}: LaunchoraPagesProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const page = useMemo(() => initialPage, [initialPage]);
  const siteData = useMemo(() => getSiteData(data), [data]);

  const navItems = useMemo(
    () => [
      { label: siteData.navWork || "עבודות", href: "#work" },
      { label: siteData.navServices || "שירותים", href: "#services" },
      { label: siteData.navProcess || "תהליך", href: "#process" },
      { label: siteData.navPricing || "מחירון", href: "#pricing" },
      { label: siteData.navFaq || "שאלות", href: "#faq" },
    ],
    [siteData],
  );

  const socialProofBrands = useMemo(
    () =>
      [
        siteData.socialProofBrandOne,
        siteData.socialProofBrandTwo,
        siteData.socialProofBrandThree,
        siteData.socialProofBrandFour,
        siteData.socialProofBrandFive,
        siteData.socialProofBrandSix,
        siteData.socialProofBrandSeven,
        siteData.socialProofBrandEight,
        siteData.socialProofBrandNine,
        siteData.socialProofBrandTen,
      ].filter(Boolean),
    [siteData],
  );

  const projects = useMemo<Project[]>(
    () => [
      {
        id: "clearbank",
        title: siteData.projectOneTitle,
        subtitle: siteData.projectOneSubtitle,
        category: siteData.projectOneCategory,
        year: siteData.projectOneYear,
        description: siteData.projectOneDescription,
        result: siteData.projectOneResult,
        image: siteData.projectOneImage,
        imageKey: "projectOneImage",
      },
      {
        id: "velora",
        title: siteData.projectTwoTitle,
        subtitle: siteData.projectTwoSubtitle,
        category: siteData.projectTwoCategory,
        year: siteData.projectTwoYear,
        description: siteData.projectTwoDescription,
        result: siteData.projectTwoResult,
        image: siteData.projectTwoImage,
        imageKey: "projectTwoImage",
        dark: true,
      },
      {
        id: "harmen",
        title: siteData.projectThreeTitle,
        subtitle: siteData.projectThreeSubtitle,
        category: siteData.projectThreeCategory,
        year: siteData.projectThreeYear,
        description: siteData.projectThreeDescription,
        result: siteData.projectThreeResult,
        image: siteData.projectThreeImage,
        imageKey: "projectThreeImage",
      },
      {
        id: "northline",
        title: siteData.projectFourTitle,
        subtitle: siteData.projectFourSubtitle,
        category: siteData.projectFourCategory,
        year: siteData.projectFourYear,
        description: siteData.projectFourDescription,
        result: siteData.projectFourResult,
        image: siteData.projectFourImage,
        imageKey: "projectFourImage",
      },
    ],
    [siteData],
  );

  const services = useMemo<ServiceItem[]>(
    () => [
      {
        title: siteData.serviceOneTitle,
        desc: siteData.serviceOneText,
        icon: Target,
      },
      {
        title: siteData.serviceTwoTitle,
        desc: siteData.serviceTwoText,
        icon: Palette,
      },
      {
        title: siteData.serviceThreeTitle,
        desc: siteData.serviceThreeText,
        icon: MousePointer2,
      },
      {
        title: siteData.serviceFourTitle,
        desc: siteData.serviceFourText,
        icon: Code2,
      },
    ],
    [siteData],
  );

  const processSteps = useMemo<ProcessStep[]>(
    () => [
      {
        step: siteData.processOneStep,
        title: siteData.processOneTitle,
        text: siteData.processOneText,
      },
      {
        step: siteData.processTwoStep,
        title: siteData.processTwoTitle,
        text: siteData.processTwoText,
      },
      {
        step: siteData.processThreeStep,
        title: siteData.processThreeTitle,
        text: siteData.processThreeText,
      },
      {
        step: siteData.processFourStep,
        title: siteData.processFourTitle,
        text: siteData.processFourText,
      },
    ],
    [siteData],
  );

  const testimonials = useMemo<Testimonial[]>(
    () => [
      {
        name: siteData.testimonialOneName,
        role: siteData.testimonialOneRole,
        text: siteData.testimonialOneText,
        featured: true,
      },
      {
        name: siteData.testimonialTwoName,
        role: siteData.testimonialTwoRole,
        text: siteData.testimonialTwoText,
        featured: false,
      },
      {
        name: siteData.testimonialThreeName,
        role: siteData.testimonialThreeRole,
        text: siteData.testimonialThreeText,
        featured: false,
      },
    ],
    [siteData],
  );

  const pricing = useMemo<PricingPlan[]>(
    () => [
      {
        name: siteData.planOneName,
        desc: siteData.planOneDesc,
        price: siteData.planOnePrice,
        label: siteData.planOneLabel,
        cta: siteData.planOneButton,
        featured: true,
        features: [
          siteData.planOneFeatureOne,
          siteData.planOneFeatureTwo,
          siteData.planOneFeatureThree,
          siteData.planOneFeatureFour,
          siteData.planOneFeatureFive,
        ],
      },
      {
        name: siteData.planTwoName,
        desc: siteData.planTwoDesc,
        price: siteData.planTwoPrice,
        label: siteData.planTwoLabel,
        cta: siteData.planTwoButton,
        featured: false,
        features: [
          siteData.planTwoFeatureOne,
          siteData.planTwoFeatureTwo,
          siteData.planTwoFeatureThree,
          siteData.planTwoFeatureFour,
          siteData.planTwoFeatureFive,
        ],
      },
    ],
    [siteData],
  );

  const faqs = useMemo<FaqItem[]>(
    () => [
      {
        q: siteData.faqOneQuestion,
        a: siteData.faqOneAnswer,
      },
      {
        q: siteData.faqTwoQuestion,
        a: siteData.faqTwoAnswer,
      },
      {
        q: siteData.faqThreeQuestion,
        a: siteData.faqThreeAnswer,
      },
      {
        q: siteData.faqFourQuestion,
        a: siteData.faqFourAnswer,
      },
    ],
    [siteData],
  );

  if (page !== "home") return null;

  return (
    <main
      dir="rtl"
      className="launchora-root min-h-screen overflow-x-hidden bg-[#fbfbfa] text-neutral-950"
      data-template="launchora"
      data-mode={mode}
    >
      <style>{`
        .launchora-root {
          --launchora-blue: #5277ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          scroll-behavior: smooth;
        }

        .launchora-reveal {
          opacity: 0;
          transform: translateY(28px) scale(.985);
          transition:
            opacity 760ms cubic-bezier(.2,.8,.2,1),
            transform 760ms cubic-bezier(.2,.8,.2,1);
          will-change: opacity, transform;
        }

        .launchora-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        @keyframes launchoraFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-7deg); }
          50% { transform: translate3d(0, -16px, 0) rotate(-4deg); }
        }

        @keyframes launchoraFloatMain {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }

        @keyframes launchoraFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(8deg); }
          50% { transform: translate3d(0, 14px, 0) rotate(5deg); }
        }

        @keyframes launchoraChip {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-10px, -8px, 0); }
        }

        @keyframes launchoraChipReverse {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(10px, -8px, 0); }
        }

        @keyframes launchoraGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }

        @keyframes launchoraShine {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .launchora-float { animation: launchoraFloat 7s ease-in-out infinite; }
        .launchora-float-main { animation: launchoraFloatMain 6.5s ease-in-out infinite; }
        .launchora-float-slow { animation: launchoraFloatSlow 8s ease-in-out infinite; }
        .launchora-chip { animation: launchoraChip 5.5s ease-in-out infinite; }
        .launchora-chip-reverse { animation: launchoraChipReverse 5.8s ease-in-out infinite; }

        .launchora-grid-bg {
          background-image:
            linear-gradient(to right, rgba(15,23,42,.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,.045) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: launchoraGridMove 22s linear infinite;
        }

        .launchora-shine::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
          transform: translateX(100%);
        }

        .launchora-shine:hover::before {
          animation: launchoraShine 900ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .launchora-reveal,
          .launchora-float,
          .launchora-float-main,
          .launchora-float-slow,
          .launchora-chip,
          .launchora-chip-reverse,
          .launchora-grid-bg {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }

          .launchora-root {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <ProjectModal
        project={selectedProject}
        siteData={siteData}
        onClose={() => setSelectedProject(null)}
      />

      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfbfa]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white shadow-lg shadow-black/10">
              <Gem size={18} />
            </span>
            <span
              className="hidden text-sm font-black tracking-[-0.03em] sm:block"
              data-edit-field="brandName"
            >
              {siteData.brandName}
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-neutral-600 transition hover:text-neutral-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="launchora-shine relative hidden h-12 items-center gap-3 overflow-hidden rounded-full bg-black px-6 text-sm font-black text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:flex"
            >
              בואו נדבר
              <ArrowIcon />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 bg-white lg:hidden"
              aria-label="פתיחת תפריט"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm lg:hidden">
            <div className="mr-auto h-full w-[86%] max-w-sm bg-white p-6 shadow-2xl">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-lg font-black">{siteData.brandName}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
                  aria-label="סגירת תפריט"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-black hover:bg-neutral-50"
                  >
                    {item.label}
                    <ArrowIcon />
                  </a>
                ))}
              </div>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black text-white"
              >
                {siteData.mobileStickyButton}
                <ArrowIcon />
              </a>
            </div>
          </div>
        )}
      </header>

      <HeroWorkMotion
        siteData={siteData}
        brands={socialProofBrands}
        projects={projects}
        onOpen={setSelectedProject}
      />

      <section id="services" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker={siteData.servicesKicker}
          title={siteData.servicesTitle}
          text={siteData.servicesText}
          action={siteData.servicesAction}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker={siteData.processKicker}
          title={siteData.processTitle}
          text={siteData.processText}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          {processSteps.map((item, index) => (
            <Reveal key={item.step} delay={index * 80}>
              <article className="group h-full rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <p className="text-sm font-black text-[#5277ff]">{item.step}</p>
                <h3 className="mt-8 text-2xl font-black tracking-[-0.05em] text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="sticky top-28 rounded-[2rem] bg-black p-8 text-white shadow-2xl">
              <p className="text-sm font-black text-white/50">
                {siteData.aboutKicker}
              </p>
              <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.07em]">
                {siteData.aboutTitle}
              </h2>
              <p className="mt-6 text-base leading-8 text-white/60">
                {siteData.aboutText}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {testimonials.map((item, index) => (
              <TestimonialCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker={siteData.pricingKicker}
          title={siteData.pricingTitle}
          text={siteData.pricingText}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {pricing.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              popularLabel={siteData.planPopularLabel}
            />
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker={siteData.faqKicker}
          title={siteData.faqTitle}
          text={siteData.faqText}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 70}>
              <FAQItem item={item} defaultOpen={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-5 pb-24 pt-14 sm:px-8 lg:pb-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.3rem] bg-black p-8 text-white shadow-2xl sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(82,119,255,.42),transparent_30%)]" />
            <div className="absolute bottom-[-90px] left-[-70px] h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute bottom-[-120px] left-[90px] h-80 w-80 rounded-full border border-[#5277ff]/25" />
            <div className="absolute top-[-130px] right-[-130px] h-80 w-80 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <div>
                <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70">
                  {siteData.finalCtaKicker}
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                  {siteData.finalCtaTitle}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                  {siteData.finalCtaText}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <a
                  href="#top"
                  className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-black transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {siteData.finalCtaButton}
                  <ArrowIcon />
                </a>

                <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4">
                  <AvatarStack />
                  <p className="text-xs leading-5 text-white/60">
                    {siteData.finalCtaMiniText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-full bg-black p-2 shadow-2xl lg:hidden">
        <a
          href="#contact"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-black text-black"
        >
          {siteData.mobileStickyButton}
          <ArrowIcon />
        </a>
      </div>
    </main>
  );
}