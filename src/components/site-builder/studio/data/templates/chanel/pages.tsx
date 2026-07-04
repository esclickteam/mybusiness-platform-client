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
    background: #fff9f5;
    color: #2b1b15;
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
    background: #fff9f5;
  }

  .apsora-template-root {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    isolation: isolate;
    background: transparent;
  }

  .apsora-template-root > * {
    position: relative;
    z-index: 1;
  }

  .apsora-template-root [data-apsora-motion],
  .apsora-template-root .apsora-pill,
  .apsora-template-root .apsora-price-row,
  .apsora-template-root .apsora-footer-newsletter,
  .apsora-template-root .apsora-footer-links {
    will-change: opacity, transform, filter;
    backface-visibility: hidden;
  }

  .apsora-template-root .apsora-motion-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 98px), 0)
      scale(var(--apsora-scale, .94));
    filter: blur(var(--apsora-blur, 18px));
    transition: none !important;
  }

  .apsora-template-root .apsora-text-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(0, var(--apsora-y, 92px), 0)
      skewY(var(--apsora-skew, 2deg));
    filter: blur(var(--apsora-blur, 16px));
    transition: none !important;
  }

  .apsora-template-root .apsora-motion-done {
    opacity: 1;
    filter: blur(0px);
  }

  .apsora-template-root [data-apsora-hero] img,
  .apsora-template-root .apsora-hero-motion img {
    transform:
      translate3d(0, var(--apsora-hero-y, 0px), 0)
      scale(var(--apsora-hero-scale, 1.08));
    transform-origin: center;
    transition: none !important;
    will-change: transform;
    backface-visibility: hidden;
  }

  .apsora-template-root .apsora-process-image img,
  .apsora-template-root .apsora-about-media img,
  .apsora-template-root .apsora-contact-image img,
  .apsora-template-root .apsora-booking-image img,
  .apsora-template-root .apsora-faq-art > img {
    transform:
      translate3d(0, var(--apsora-parallax-y, 0px), 0)
      scale(var(--apsora-parallax-scale, 1.08));
    will-change: transform;
  }

  .apsora-template-root .apsora-header {
    transition:
      background-color .45s cubic-bezier(.22,1,.36,1),
      box-shadow .45s cubic-bezier(.22,1,.36,1),
      border-color .45s cubic-bezier(.22,1,.36,1),
      transform .45s cubic-bezier(.22,1,.36,1);
  }

  .apsora-template-root .apsora-header.is-scrolled {
    background: rgba(255, 249, 245, 0.88);
    border-bottom-color: rgba(43, 27, 21, 0.08);
    box-shadow: 0 18px 60px rgba(43, 27, 21, 0.08);
  }

  .apsora-template-root .apsora-faq-row {
    cursor: pointer;
  }

  .apsora-template-root .apsora-faq-row strong {
    transition:
      transform .45s cubic-bezier(.22,1,.36,1),
      background-color .45s cubic-bezier(.22,1,.36,1);
  }

  .apsora-template-root .apsora-faq-row.is-open strong {
    transform: rotate(45deg);
    background: #171716;
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


function cssEscape(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
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
            `[id="${cssEscape(id)}"]`,
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
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell || typeof window === "undefined") return;

    const header = root.querySelector<HTMLElement>(".apsora-header");

    const parallaxItems = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".apsora-process-image img, .apsora-about-media img, .apsora-contact-image img, .apsora-booking-image img, .apsora-faq-art > img",
      ),
    );

    const faqRows = Array.from(
      root.querySelectorAll<HTMLElement>(".apsora-faq-row"),
    );

    const therapyCards = Array.from(
      root.querySelectorAll<HTMLElement>(".apsora-therapy-card"),
    );

    const teamCards = Array.from(
      root.querySelectorAll<HTMLElement>(".apsora-team-card"),
    );

    const priceRows = Array.from(
      root.querySelectorAll<HTMLElement>(".apsora-price-row"),
    );

    const testimonialTrack = root.querySelector<HTMLElement>(
      ".apsora-testimonial-track",
    );

    const removeCallbacks: Array<() => void> = [];

    function onScroll() {
      const shellRect = shell.getBoundingClientRect();
      const scrollTop = shell.scrollTop;
      const viewportHeight = shell.clientHeight || shellRect.height || 900;

      if (header) {
        header.classList.toggle("is-scrolled", scrollTop > 12);
      }

      parallaxItems.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const center = rect.top - shellRect.top + rect.height / 2;
        const progress = (center - viewportHeight / 2) / viewportHeight;
        const y = Math.max(-34, Math.min(34, progress * -52));

        img.style.setProperty("--apsora-parallax-y", `${y}px`);
        img.style.setProperty("--apsora-parallax-scale", "1.1");
      });

      if (testimonialTrack) {
        const rect = testimonialTrack.getBoundingClientRect();
        const top = rect.top - shellRect.top;
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight - top) / viewportHeight),
        );

        testimonialTrack.style.transform = `translate3d(${(progress - 0.5) * 34}px, 0, 0)`;
      }
    }

    faqRows.forEach((row) => {
      const onClick = () => {
        faqRows.forEach((item) => {
          if (item !== row) item.classList.remove("is-open");
        });
        row.classList.toggle("is-open");
      };

      row.addEventListener("click", onClick);
      removeCallbacks.push(() => row.removeEventListener("click", onClick));
    });

    therapyCards.forEach((card) => {
      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        const offsetX = card.classList.contains("is-offset") ? -64 : 0;

        card.style.transform = `translate3d(${offsetX - x}px, ${-10 - y}px, 0)`;
      };

      const onLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      removeCallbacks.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    teamCards.forEach((card) => {
      const image = card.querySelector<HTMLElement>(".apsora-team-image img");
      const icon = card.querySelector<HTMLElement>(".apsora-team-body span");

      const onEnter = () => {
        card.style.transform = "translate3d(0, -10px, 0)";
        if (image) image.style.transform = "scale(1.08)";
        if (icon) icon.style.transform = "rotate(45deg)";
      };

      const onLeave = () => {
        card.style.transform = "";
        if (image) image.style.transform = "";
        if (icon) icon.style.transform = "";
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      removeCallbacks.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    priceRows.forEach((row) => {
      const onEnter = () => {
        priceRows.forEach((item) => item.classList.remove("is-hovered"));
        row.classList.add("is-hovered");
      };

      row.addEventListener("mouseenter", onEnter);
      removeCallbacks.push(() => row.removeEventListener("mouseenter", onEnter));
    });

    shell.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      shell.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      removeCallbacks.forEach((remove) => remove());
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