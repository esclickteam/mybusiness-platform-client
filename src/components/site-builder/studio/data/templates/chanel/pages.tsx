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
  "/about": "about",
  "#about": "about",
  אודות: "about",

  services: "services",
  "/services": "services",
  "#services": "services",
  treatments: "services",
  "/treatments": "services",
  טיפולים: "services",

  gallery: "gallery",
  "/gallery": "gallery",
  "#gallery": "gallery",
  גלריה: "gallery",

  prices: "prices",
  "/prices": "prices",
  pricing: "prices",
  "/pricing": "prices",
  "#pricing": "prices",
  "#prices": "prices",
  מחירים: "prices",

  booking: "booking",
  "/booking": "booking",
  "#booking": "booking",
  "קביעת תור": "booking",

  contact: "contact",
  "/contact": "contact",
  "#contact": "contact",
  "צור קשר": "contact",
};

const runtimeCss = `
  [data-template-id="chanel"],
  [data-template-id="chanel"] * {
    box-sizing: border-box;
  }

  [data-template-id="chanel"] {
  overflow: hidden !important;
  width: 100%;
  height: 100%;
}

  .apsora-runtime-page {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    background: var(--apsora-bg);
    color: var(--apsora-ink);
    font-synthesis: none;
    text-rendering: geometricPrecision;
  }

  .apsora-scroll-shell {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background:
      radial-gradient(circle at 16% 0%, rgba(168, 71, 79, 0.08), transparent 28%),
      linear-gradient(180deg, #fffaf7 0%, #ffffff 42%, #fffaf7 100%);
  }

  .apsora-template-root {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    isolation: isolate;
    background: transparent;
  }

  .apsora-template-root::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      linear-gradient(90deg, rgba(36, 22, 18, 0.035) 1px, transparent 1px),
      linear-gradient(180deg, rgba(36, 22, 18, 0.025) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,.25), transparent 64%);
  }

  .apsora-template-root > * {
    position: relative;
    z-index: 1;
  }

  /*
    Header — חלק מהאתר, לא על העורך.
    תופס גם header רגיל וגם קלאסים של התבנית.
  */
  .apsora-template-root header,
  .apsora-template-root .apsora-header,
  .apsora-template-root .chanel-header,
  .apsora-template-root .site-header,
  .apsora-template-root .template-header {
    position: sticky !important;
    top: 0 !important;
    z-index: 50 !important;
    width: 100% !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;
    background: rgba(36, 22, 18, 0.72) !important;
    backdrop-filter: blur(22px) saturate(135%) !important;
    -webkit-backdrop-filter: blur(22px) saturate(135%) !important;
    box-shadow: 0 18px 60px rgba(36, 22, 18, 0.10) !important;
  }

  .apsora-template-root header a,
  .apsora-template-root .apsora-header a,
  .apsora-template-root .chanel-header a,
  .apsora-template-root .site-header a,
  .apsora-template-root .template-header a {
    color: rgba(255, 255, 255, 0.92) !important;
    text-decoration: none !important;
    transition:
      color 420ms cubic-bezier(.16,1,.3,1),
      opacity 420ms cubic-bezier(.16,1,.3,1) !important;
  }

  .apsora-template-root header a:hover,
  .apsora-template-root .apsora-header a:hover,
  .apsora-template-root .chanel-header a:hover,
  .apsora-template-root .site-header a:hover,
  .apsora-template-root .template-header a:hover {
    color: #ffffff !important;
    opacity: 1 !important;
  }

  /*
    Hero — כמו בווידאו: תמונה גדולה, תחושה יוקרתית, תנועה עדינה.
  */
  .apsora-template-root [data-apsora-hero],
  .apsora-template-root .apsora-hero,
  .apsora-template-root .hero,
  .apsora-template-root section:first-of-type {
    position: relative;
    overflow: hidden;
  }

  .apsora-template-root [data-apsora-hero] img,
  .apsora-template-root .apsora-hero img,
  .apsora-template-root .hero img,
  .apsora-template-root section:first-of-type img {
    transform:
      translate3d(0, var(--apsora-hero-y, 0px), 0)
      scale(var(--apsora-hero-scale, 1.045));
    transform-origin: center;
    transition: none !important;
    will-change: transform;
    backface-visibility: hidden;
  }

  .apsora-template-root [data-apsora-hero]::after,
  .apsora-template-root .apsora-hero::after,
  .apsora-template-root .hero::after,
  .apsora-template-root section:first-of-type::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(36, 22, 18, 0.24), transparent 48%),
      radial-gradient(circle at 72% 12%, rgba(255,255,255,.18), transparent 30%);
    opacity: .75;
    mix-blend-mode: multiply;
  }

  /*
    כפתורים — לא שחורים, יין-ורוד כמו בתנועה ששלחת.
  */
  .apsora-template-root button,
  .apsora-template-root .button,
  .apsora-template-root .btn,
  .apsora-template-root a[class*="button"],
  .apsora-template-root a[class*="btn"],
  .apsora-template-root .apsora-btn,
  .apsora-template-root .apsora-button {
    border-radius: 0 !important;
    background: var(--apsora-wine) !important;
    color: #fff !important;
    border: 1px solid rgba(168, 71, 79, 0.38) !important;
    box-shadow: 0 18px 36px rgba(168, 71, 79, 0.18) !important;
    transition:
      background 420ms cubic-bezier(.16,1,.3,1),
      box-shadow 420ms cubic-bezier(.16,1,.3,1),
      transform 420ms cubic-bezier(.16,1,.3,1) !important;
  }

  .apsora-template-root button:hover,
  .apsora-template-root .button:hover,
  .apsora-template-root .btn:hover,
  .apsora-template-root a[class*="button"]:hover,
  .apsora-template-root a[class*="btn"]:hover,
  .apsora-template-root .apsora-btn:hover,
  .apsora-template-root .apsora-button:hover {
    background: var(--apsora-wine-2) !important;
    box-shadow: 0 24px 52px rgba(168, 71, 79, 0.24) !important;
    transform: translate3d(0, -2px, 0) !important;
  }

  /*
    Cards / Blocks — מרובע, נקי, יוקרתי.
  */
  .apsora-template-root article,
  .apsora-template-root .card,
  .apsora-template-root .apsora-card,
  .apsora-template-root .service-card,
  .apsora-template-root .price-card,
  .apsora-template-root .testimonial-card,
  .apsora-template-root .gallery-card {
    border-radius: var(--apsora-radius) !important;
    border: 1px solid var(--apsora-line) !important;
    background: rgba(255, 255, 255, 0.92) !important;
    box-shadow: 0 24px 70px rgba(36, 22, 18, 0.075) !important;
    transform-origin: center;
  }

  .apsora-template-root article img,
  .apsora-template-root .card img,
  .apsora-template-root .apsora-card img,
  .apsora-template-root .service-card img,
  .apsora-template-root .price-card img,
  .apsora-template-root .testimonial-card img,
  .apsora-template-root .gallery-card img {
    border-radius: 0 !important;
  }

  /*
    סקשנים שחורים כמו באמצע הווידאו.
  */
  .apsora-template-root .apsora-dark-section,
  .apsora-template-root .dark-section,
  .apsora-template-root section[data-theme="dark"],
  .apsora-template-root section[class*="dark"] {
    background:
      radial-gradient(circle at 12% 18%, rgba(168, 71, 79, 0.10), transparent 26%),
      #111111 !important;
    color: #ffffff !important;
  }

  .apsora-template-root .apsora-dark-section *,
  .apsora-template-root .dark-section *,
  .apsora-template-root section[data-theme="dark"] *,
  .apsora-template-root section[class*="dark"] * {
    color: inherit;
  }

  /*
    Motion state
  */
  .apsora-template-root [data-apsora-motion],
  .apsora-template-root .apsora-pill,
  .apsora-template-root .apsora-price-row,
  .apsora-template-root .apsora-footer-image,
  .apsora-template-root article,
  .apsora-template-root .card,
  .apsora-template-root .apsora-card {
    will-change: opacity, transform, filter;
    backface-visibility: hidden;
  }

  .apsora-template-root .apsora-motion-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 104px), 0)
      scale(var(--apsora-scale, .955));
    filter: blur(var(--apsora-blur, 18px));
    transition: none !important;
  }

  .apsora-template-root .apsora-text-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 86px), 0)
      scale(var(--apsora-scale, 1));
    filter: blur(var(--apsora-blur, 16px));
    transition: none !important;
  }

  .apsora-template-root .apsora-motion-done {
    opacity: 1;
    filter: blur(0px);
  }

  /*
    Gallery / Images — נותן תחושה של Webflow.
  */
  .apsora-template-root img {
    max-width: 100%;
    object-fit: cover;
  }

  .apsora-template-root .apsora-gallery,
  .apsora-template-root .gallery,
  .apsora-template-root [class*="gallery"] {
    perspective: 1200px;
  }

  /*
    טפסים
  */
  .apsora-template-root input,
  .apsora-template-root textarea,
  .apsora-template-root select {
    border-radius: 0 !important;
    border: 1px solid rgba(36, 22, 18, 0.14) !important;
    background: rgba(255, 255, 255, 0.92) !important;
    color: var(--apsora-ink) !important;
    outline: none !important;
    transition:
      border-color 280ms ease,
      box-shadow 280ms ease,
      background 280ms ease !important;
  }

  .apsora-template-root a,
.apsora-template-root button,
.apsora-template-root article,
.apsora-template-root img {
  transform-origin: center;
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

  const clean = raw
    .replace(windowSafeOrigin(), "")
    .replace(/[?#].*$/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  return pageAliases[clean] || "home";
}

function windowSafeOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
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
  once: boolean;
};

function getMotionTypeByIndex(index: number) {
  const types = ["up", "right", "up", "left", "text", "up"];
  return types[index % types.length];
}

function applyMotion(state: MotionState) {
  const element = state.element;
  const eased = easeOutExpo(state.current);
  const type = state.type;

  const baseY = type === "text" ? 86 : 104;
  const startY = Number(element.dataset.motionY || baseY);
  const startScale = Number(
    element.dataset.motionScale || (type === "text" ? 1 : 0.955),
  );
  const startBlur = Number(
    element.dataset.motionBlur || (type === "text" ? 16 : 18),
  );

  let startX = Number(element.dataset.motionX || 0);

  if (type === "left") startX = -112;
  if (type === "right") startX = 112;
  if (type === "up") startX = 0;
  if (type === "text") startX = 0;

  element.style.setProperty("--apsora-opacity", String(eased));
  element.style.setProperty("--apsora-x", `${startX * (1 - eased)}px`);
  element.style.setProperty("--apsora-y", `${startY * (1 - eased)}px`);
  element.style.setProperty(
    "--apsora-scale",
    String(startScale + (1 - startScale) * eased),
  );
  element.style.setProperty("--apsora-blur", `${startBlur * (1 - eased)}px`);

  if (eased > 0.985) {
    element.classList.add("apsora-motion-done");
  } else {
    element.classList.remove("apsora-motion-done");
  }
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff9f5] px-6 text-[#2b1b15]"
    >
      <div className="max-w-xl border border-[#2b1b15]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(43,27,21,.12)]">
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
  mode = "public",
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

    const links = root.querySelectorAll<HTMLAnchorElement>("a[href]");

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";
      const cleanHref = href.trim();

      if (
        !cleanHref ||
        cleanHref.startsWith("mailto:") ||
        cleanHref.startsWith("tel:") ||
        cleanHref.startsWith("https://") ||
        cleanHref.startsWith("http://") ||
        cleanHref.startsWith("whatsapp:") ||
        cleanHref.startsWith("sms:")
      ) {
        return;
      }

      if (cleanHref.startsWith("#")) {
        const id = cleanHref.replace("#", "").trim();

        if (id) {
          const samePageTarget = root.querySelector<HTMLElement>(
            `[id="${CSS.escape(id)}"]`,
          );

          if (samePageTarget) {
            event.preventDefault();

            const shellRect = shell.getBoundingClientRect();
            const targetRect = samePageTarget.getBoundingClientRect();
            const nextTop = shell.scrollTop + targetRect.top - shellRect.top - 76;

            shell.scrollTo({
              top: Math.max(0, nextTop),
              behavior: "smooth",
            });

            return;
          }
        }

        if (isStudioStatic) return;

        event.preventDefault();
        setActivePage(normalizePageInput(cleanHref));
        shell.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const nextPage = normalizePageInput(cleanHref);

      if (nextPage && nextPage !== pageToRender) {
        if (isStudioStatic) return;

        event.preventDefault();
        setActivePage(nextPage);
        requestAnimationFrame(() => {
          shell.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
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
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    /*
      מוסיף data-apsora-motion גם לאלמנטים שאין להם,
      כדי שהתבנית תרגיש כמו הווידאו גם אם ב־HTML חסרים attributes.
    */
    const autoMotionSelectors = [
      "section > h1",
      "section > h2",
      "section > h3",
      "section p",
      "section article",
      "section .card",
      "section .apsora-card",
      "section .service-card",
      "section .price-card",
      "section .testimonial-card",
      "section .gallery-card",
      "section img",
      ".apsora-pill",
      ".apsora-price-row",
      ".apsora-footer-image",
    ].join(",");

    const autoElements = Array.from(
      root.querySelectorAll<HTMLElement>(autoMotionSelectors),
    );

    autoElements.forEach((element, index) => {
      if (!element.dataset.apsoraMotion) {
        const tagName = element.tagName.toLowerCase();
        const isText =
          ["h1", "h2", "h3", "p", "span"].includes(tagName) ||
          element.className.toString().includes("title") ||
          element.className.toString().includes("text");

        element.dataset.apsoraMotion = isText
          ? "text"
          : getMotionTypeByIndex(index);

        element.dataset.motionDelay = String(Math.min((index % 5) * 0.035, 0.16));
      }
    });

    const motionElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-apsora-motion]"),
    );

    const states: MotionState[] = motionElements.map((element) => {
      const type = element.dataset.apsoraMotion || "up";

      element.classList.add(
        type === "text" ? "apsora-text-ready" : "apsora-motion-ready",
      );

      const delay = Number(element.dataset.motionDelay || 0);

      const state: MotionState = {
        element,
        current: reduceMotion ? 1 : 0,
        target: reduceMotion ? 1 : 0,
        delay,
        type,
        once: element.dataset.motionOnce === "true",
      };

      applyMotion(state);
      return state;
    });

    const hero =
      root.querySelector<HTMLElement>("[data-apsora-hero]") ||
      root.querySelector<HTMLElement>(".apsora-hero") ||
      root.querySelector<HTMLElement>(".hero") ||
      root.querySelector<HTMLElement>("section:first-of-type");

    if (hero) {
      hero.setAttribute("data-apsora-hero", "true");
    }

    let frame = 0;
    let running = true;

    function calculateTargets() {
      const shellRect = shell.getBoundingClientRect();
      const viewportHeight = shell.clientHeight || shellRect.height || 900;

      states.forEach((state) => {
        const rect = state.element.getBoundingClientRect();
        const top = rect.top - shellRect.top;

        const start = viewportHeight * 1.08;
        const end = viewportHeight * 0.22;
        const raw = (start - top) / (start - end) - state.delay;
        const nextTarget = clamp(raw);

        state.target = state.once
          ? Math.max(state.target, nextTarget)
          : nextTarget;
      });

      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const top = heroRect.top - shellRect.top;
        const progress = clamp(Math.abs(top) / Math.max(1, viewportHeight));

        hero.style.setProperty("--apsora-hero-y", `${progress * 78}px`);
        hero.style.setProperty(
          "--apsora-hero-scale",
          String(1.045 + progress * 0.055),
        );
      }
    }

    function animate() {
      if (!running) return;

      if (!reduceMotion) {
        calculateTargets();

        states.forEach((state) => {
          state.current = lerp(state.current, state.target, 0.092);

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
      window.cancelAnimationFrame(frame);
    };
  }, [pageToRender]);

  React.useEffect(() => {
    const shell = scrollRef.current;
    if (!shell) return;

    shell.scrollTo({ top: 0, behavior: "auto" });
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main
      dir="rtl"
      data-template-id="chanel"
      data-template-mode={mode}
      className="apsora-runtime-page"
    >
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