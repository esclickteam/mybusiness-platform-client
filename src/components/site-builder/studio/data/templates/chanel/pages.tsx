import React from "react";
import { chanelEditorCss } from "./chanelEditorCss";
import { chanelEditorPages } from "./chanelData";

export type ChanelPageId =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "prices"
  | "booking"
  | "contact";

export const chanelPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "טיפולים", slug: "/services" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "prices", label: "מחירים", slug: "/prices" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
] as const;

type Props = {
  initialPage?: ChanelPageId | string;
  isStudioStatic?: boolean;
  mode?: "preview" | "editor" | "public";
};

const pageAliases: Record<string, ChanelPageId> = {
  "": "home",
  "/": "home",
  home: "home",
  "#home": "home",
  בית: "home",
  about: "about",
  "#about": "about",
  אודות: "about",
  services: "services",
  "#services": "services",
  טיפולים: "services",
  gallery: "gallery",
  "#gallery": "gallery",
  גלריה: "gallery",
  prices: "prices",
  pricing: "prices",
  "#pricing": "prices",
  "#prices": "prices",
  מחירים: "prices",
  booking: "booking",
  "#booking": "booking",
  "קביעת תור": "booking",
  contact: "contact",
  "#contact": "contact",
  "צור קשר": "contact",
};

const runtimeCss = `
  [data-template-id="chanel"] {
    overflow: hidden !important;
  }

  .apsora-runtime-page {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    background: #fff9f5;
    color: #2b1b15;
  }

  .apsora-scroll-shell {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background: #fff9f5;
  }

  .apsora-template-root {
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    isolation: isolate;
  }

  .apsora-template-root [data-apsora-motion],
  .apsora-template-root .apsora-pill,
  .apsora-template-root .apsora-price-row,
  .apsora-template-root .apsora-footer-image {
    will-change: opacity, transform, filter;
  }

  .apsora-template-root .apsora-motion-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 88px), 0)
      scale(var(--apsora-scale, .965));
    filter: blur(var(--apsora-blur, 14px));
    transition: none !important;
  }

  .apsora-template-root .apsora-text-ready {
    opacity: var(--apsora-opacity, 0);
    transform: translate3d(0, var(--apsora-y, 82px), 0);
    filter: blur(var(--apsora-blur, 12px));
    transition: none !important;
  }

  .apsora-template-root .apsora-hero-motion img {
    transform:
      translate3d(0, var(--apsora-hero-y, 0px), 0)
      scale(var(--apsora-hero-scale, 1.045));
    transition: none !important;
    will-change: transform;
  }

  .apsora-template-root a:hover,
  .apsora-template-root button:hover,
  .apsora-template-root article:hover,
  .apsora-template-root img:hover {
    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .apsora-template-root *,
    .apsora-template-root *::before,
    .apsora-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }
`;

function normalizePageInput(value: unknown): ChanelPageId {
  const raw = String(value ?? "home").trim();
  if (pageAliases[raw]) return pageAliases[raw];
  const clean = raw.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  return pageAliases[clean] || "home";
}

function getChanelPage(pageId: ChanelPageId) {
  return (
    chanelEditorPages.find((item) => item.id === pageId) ||
    chanelEditorPages.find((item) => item.id === "home") ||
    chanelEditorPages[0]
  );
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeOutExpo(value: number) {
  const t = clamp(value);
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

type MotionState = {
  element: HTMLElement;
  current: number;
  target: number;
  delay: number;
  type: string;
};

function applyMotion(state: MotionState) {
  const element = state.element;
  const eased = easeOutExpo(state.current);

  const type = state.type;
  const baseY = type === "text" ? 86 : 104;
  const startY = Number(element.dataset.motionY || baseY);
  const startScale = Number(element.dataset.motionScale || (type === "text" ? 1 : 0.955));
  const startBlur = Number(element.dataset.motionBlur || (type === "text" ? 16 : 18));
  let startX = Number(element.dataset.motionX || 0);

  if (type === "left") startX = -110;
  if (type === "right") startX = 110;
  if (type === "up") startX = 0;
  if (type === "text") startX = 0;

  element.style.setProperty("--apsora-opacity", String(eased));
  element.style.setProperty("--apsora-x", `${startX * (1 - eased)}px`);
  element.style.setProperty("--apsora-y", `${startY * (1 - eased)}px`);
  element.style.setProperty("--apsora-scale", String(startScale + (1 - startScale) * eased));
  element.style.setProperty("--apsora-blur", `${startBlur * (1 - eased)}px`);
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff9f5] px-6 text-[#2b1b15]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#2b1b15]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(43,27,21,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7b5f52]">
          Chanel
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#2b1b15]/60">
          העמוד קיים ברשימת הדפים, אבל ה־HTML שלו ריק בתוך chanelEditorPages.
        </p>
      </div>
    </section>
  );
}

export default function ChanelPages({
  initialPage = "home",
  isStudioStatic = false,
}: Props = {}) {
  const safeInitialPage = React.useMemo(
    () => normalizePageInput(initialPage),
    [initialPage],
  );

  const [activePage, setActivePage] =
    React.useState<ChanelPageId>(safeInitialPage);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;
  const page = getChanelPage(pageToRender);

  React.useEffect(() => {
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell) return;

    const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";
      const id = href.replace("#", "").trim();

      if (id) {
        const samePageTarget = root.querySelector<HTMLElement>(`#${id}`);
        if (samePageTarget) {
          event.preventDefault();
          const shellRect = shell.getBoundingClientRect();
          const targetRect = samePageTarget.getBoundingClientRect();
          const nextTop = shell.scrollTop + targetRect.top - shellRect.top;
          shell.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
          return;
        }
      }

      if (isStudioStatic) return;

      event.preventDefault();
      setActivePage(normalizePageInput(href));
      shell.scrollTo({ top: 0, behavior: "smooth" });
    }

    links.forEach((link) => link.addEventListener("click", handleClick));
    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic]);

  React.useEffect(() => {
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell || typeof window === "undefined") return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const motionElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-apsora-motion]"),
    );

    const states: MotionState[] = motionElements.map((element) => {
      const type = element.dataset.apsoraMotion || "up";
      element.classList.add(type === "text" ? "apsora-text-ready" : "apsora-motion-ready");

      const delay = Number(element.dataset.motionDelay || 0);
      const state = {
        element,
        current: reduceMotion ? 1 : 0,
        target: reduceMotion ? 1 : 0,
        delay,
        type,
      };

      applyMotion(state);
      return state;
    });

    const hero = root.querySelector<HTMLElement>("[data-apsora-hero]");
    hero?.classList.add("apsora-hero-motion");

    let frame = 0;
    let running = true;

    function calculateTargets() {
      const shellRect = shell.getBoundingClientRect();
      const viewportHeight = shell.clientHeight || shellRect.height || 900;

      states.forEach((state) => {
        const rect = state.element.getBoundingClientRect();
        const top = rect.top - shellRect.top;
        const start = viewportHeight * 1.05;
        const end = viewportHeight * 0.28;
        const raw = (start - top) / (start - end) - state.delay;
        state.target = clamp(raw);
      });

      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const top = heroRect.top - shellRect.top;
        const progress = clamp(Math.abs(top) / Math.max(1, viewportHeight));
        hero.style.setProperty("--apsora-hero-y", `${progress * 70}px`);
        hero.style.setProperty("--apsora-hero-scale", String(1.045 + progress * 0.05));
      }
    }

    function animate() {
      if (!running) return;

      if (!reduceMotion) {
        calculateTargets();

        states.forEach((state) => {
          state.current = lerp(state.current, state.target, 0.095);
          if (Math.abs(state.target - state.current) < 0.001) {
            state.current = state.target;
          }
          applyMotion(state);
        });
      }

      frame = window.requestAnimationFrame(animate);
    }

    shell.addEventListener("scroll", calculateTargets, { passive: true });
    window.addEventListener("resize", calculateTargets);
    calculateTargets();
    frame = window.requestAnimationFrame(animate);

    return () => {
      running = false;
      shell.removeEventListener("scroll", calculateTargets);
      window.removeEventListener("resize", calculateTargets);
      cancelAnimationFrame(frame);
    };
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main dir="rtl" data-template-id="chanel" className="apsora-runtime-page">
      <style>{chanelEditorCss}</style>
      <style>{runtimeCss}</style>

      <div ref={scrollRef} className="apsora-scroll-shell">
        {html ? (
          <div
            ref={rootRef}
            className="apsora-template-root"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <ChanelEmptyState />
        )}
      </div>
    </main>
  );
}
