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

const CHANEL_HERO_IMAGE =
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2600&q=92";

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
    background:
      radial-gradient(circle at 12% 0%, rgba(190, 86, 106, 0.10), transparent 34%),
      radial-gradient(circle at 90% 12%, rgba(126, 86, 64, 0.10), transparent 32%),
      #fff9f5;
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
    background:
      radial-gradient(circle at top left, rgba(190, 86, 106, 0.09), transparent 30%),
      linear-gradient(180deg, #fffaf7 0%, #fff6f1 48%, #fffaf7 100%);
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
      radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.42), transparent 24%),
      radial-gradient(circle at 82% 34%, rgba(190, 86, 106, 0.07), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(43, 27, 21, 0.05), transparent 34%);
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
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 78px), 0)
      scale(var(--apsora-scale, .965));
    filter: blur(var(--apsora-blur, 14px));
    transition: none !important;
  }

  .apsora-template-root .apsora-text-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(0, var(--apsora-y, 68px), 0)
      skewY(var(--apsora-skew, 1.3deg));
    filter: blur(var(--apsora-blur, 13px));
    transition: none !important;
  }

  .apsora-template-root .apsora-motion-done {
    opacity: 1;
    filter: blur(0px);
  }

  /*
    HERO חדש — יותר נקי, יוקרתי, עם תמונת פתיחה אחרת
  */
  .apsora-template-root [data-apsora-hero],
  .apsora-template-root .apsora-hero,
  .apsora-template-root .hero,
  .apsora-template-root section:first-of-type {
    position: relative !important;
    min-height: 92vh !important;
    overflow: hidden !important;
    isolation: isolate !important;
    background: #171716 !important;
  }

  .apsora-template-root [data-apsora-hero]::before,
  .apsora-template-root .apsora-hero::before,
  .apsora-template-root .hero::before,
  .apsora-template-root section:first-of-type::before {
    content: "" !important;
    position: absolute !important;
    inset: 0 !important;
    z-index: 1 !important;
    pointer-events: none !important;
    background:
      radial-gradient(circle at 18% 20%, rgba(255, 249, 245, 0.34), transparent 31%),
      radial-gradient(circle at 76% 14%, rgba(190, 86, 106, 0.20), transparent 28%),
      linear-gradient(90deg, rgba(23, 23, 22, 0.68), rgba(23, 23, 22, 0.22) 47%, rgba(23, 23, 22, 0.08));
  }

  .apsora-template-root [data-apsora-hero]::after,
  .apsora-template-root .apsora-hero::after,
  .apsora-template-root .hero::after,
  .apsora-template-root section:first-of-type::after {
    content: "" !important;
    position: absolute !important;
    inset: auto 6vw 7vh auto !important;
    width: 38vw !important;
    max-width: 520px !important;
    aspect-ratio: 1 / 1 !important;
    border-radius: 999px !important;
    z-index: 1 !important;
    pointer-events: none !important;
    border: 1px solid rgba(255, 249, 245, 0.18);
    background: radial-gradient(circle, rgba(255, 249, 245, 0.13), transparent 67%);
    filter: blur(0.2px);
  }

  .apsora-template-root [data-apsora-hero] > *,
  .apsora-template-root .apsora-hero > *,
  .apsora-template-root .hero > *,
  .apsora-template-root section:first-of-type > * {
    position: relative;
    z-index: 2;
  }

  .apsora-template-root [data-apsora-hero] img,
  .apsora-template-root .apsora-hero img,
  .apsora-template-root .hero img,
  .apsora-template-root section:first-of-type img {
    width: 100% !important;
    height: 100% !important;
    min-height: 92vh !important;
    object-fit: cover !important;
    object-position: center center !important;
    filter: brightness(.78) contrast(1.08) saturate(.92) !important;
    transform:
      translate3d(0, var(--apsora-hero-y, 0px), 0)
      scale(var(--apsora-hero-scale, 1.075));
    transform-origin: center;
    transition: none !important;
    will-change: transform;
    backface-visibility: hidden;
  }

  .apsora-template-root [data-apsora-hero] h1,
  .apsora-template-root .apsora-hero h1,
  .apsora-template-root .hero h1,
  .apsora-template-root section:first-of-type h1 {
    letter-spacing: -0.07em;
    text-wrap: balance;
    text-shadow: 0 20px 70px rgba(0, 0, 0, 0.34);
  }

  .apsora-template-root [data-apsora-hero] p,
  .apsora-template-root .apsora-hero p,
  .apsora-template-root .hero p,
  .apsora-template-root section:first-of-type p {
    text-wrap: pretty;
  }

  /*
    הסרת הפס הורוד עם הכיתוב החוזר
  */
  .apsora-template-root .apsora-ticker,
  .apsora-template-root .apsora-marquee,
  .apsora-template-root .apsora-strip,
  .apsora-template-root .apsora-running-line,
  .apsora-template-root [data-apsora-ticker],
  .apsora-template-root [data-apsora-marquee],
  .apsora-template-root [class*="ticker"],
  .apsora-template-root [class*="marquee"],
  .apsora-template-root [class*="running"],
  .apsora-template-root .apsora-strip-hidden {
    display: none !important;
  }

  /*
    Header יותר יוקרתי
  */
  .apsora-template-root .apsora-header {
    transition:
      background-color .45s cubic-bezier(.22,1,.36,1),
      box-shadow .45s cubic-bezier(.22,1,.36,1),
      border-color .45s cubic-bezier(.22,1,.36,1),
      transform .45s cubic-bezier(.22,1,.36,1),
      backdrop-filter .45s cubic-bezier(.22,1,.36,1);
  }

  .apsora-template-root .apsora-header.is-scrolled {
    background: rgba(255, 249, 245, 0.86) !important;
    border-bottom-color: rgba(43, 27, 21, 0.08) !important;
    box-shadow: 0 18px 60px rgba(43, 27, 21, 0.09) !important;
    backdrop-filter: blur(18px);
  }

  /*
    Cards / Sections — תחושה יותר פרימיום
  */
  .apsora-template-root article,
  .apsora-template-root .apsora-card,
  .apsora-template-root .service-card,
  .apsora-template-root .price-card,
  .apsora-template-root .testimonial-card,
  .apsora-template-root .gallery-card,
  .apsora-template-root .apsora-therapy-card,
  .apsora-template-root .apsora-team-card {
    transform-origin: center;
    transition:
      transform .55s cubic-bezier(.22,1,.36,1),
      box-shadow .55s cubic-bezier(.22,1,.36,1),
      border-color .55s cubic-bezier(.22,1,.36,1),
      filter .55s cubic-bezier(.22,1,.36,1),
      background-color .55s cubic-bezier(.22,1,.36,1) !important;
  }

  .apsora-template-root article:hover,
  .apsora-template-root .apsora-card:hover,
  .apsora-template-root .service-card:hover,
  .apsora-template-root .price-card:hover,
  .apsora-template-root .testimonial-card:hover,
  .apsora-template-root .gallery-card:hover,
  .apsora-template-root .apsora-therapy-card:hover,
  .apsora-template-root .apsora-team-card:hover {
    transform: translate3d(0, -10px, 0);
    filter: saturate(1.04);
  }

  .apsora-template-root a,
  .apsora-template-root button {
    transform-origin: center;
    transition:
      transform .38s cubic-bezier(.22,1,.36,1),
      box-shadow .38s cubic-bezier(.22,1,.36,1),
      background-color .38s cubic-bezier(.22,1,.36,1),
      border-color .38s cubic-bezier(.22,1,.36,1),
      color .38s cubic-bezier(.22,1,.36,1) !important;
  }

  .apsora-template-root a:hover,
  .apsora-template-root button:hover {
    transform: translate3d(0, -3px, 0);
  }

  .apsora-template-root img {
    transform-origin: center;
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

  /*
    Scrollbar נקי
  */
  .apsora-scroll-shell::-webkit-scrollbar {
    width: 10px;
  }

  .apsora-scroll-shell::-webkit-scrollbar-track {
    background: #fff4ee;
  }

  .apsora-scroll-shell::-webkit-scrollbar-thumb {
    background: rgba(43, 27, 21, 0.22);
    border-radius: 999px;
    border: 3px solid #fff4ee;
  }

  .apsora-scroll-shell::-webkit-scrollbar-thumb:hover {
    background: rgba(43, 27, 21, 0.34);
  }

  @media (max-width: 768px) {
    .apsora-template-root [data-apsora-hero],
    .apsora-template-root .apsora-hero,
    .apsora-template-root .hero,
    .apsora-template-root section:first-of-type {
      min-height: 86vh !important;
    }

    .apsora-template-root [data-apsora-hero] img,
    .apsora-template-root .apsora-hero img,
    .apsora-template-root .hero img,
    .apsora-template-root section:first-of-type img {
      min-height: 86vh !important;
      object-position: center center !important;
    }

    .apsora-template-root [data-apsora-hero]::after,
    .apsora-template-root .apsora-hero::after,
    .apsora-template-root .hero::after,
    .apsora-template-root section:first-of-type::after {
      width: 72vw !important;
      inset: auto -12vw 5vh auto !important;
    }
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

  const baseY = type === "text" ? 68 : 78;
  const startY = Number(element.dataset.motionY || baseY);
  const startScale = Number(
    element.dataset.motionScale || (type === "text" ? 1 : 0.965),
  );
  const startBlur = Number(
    element.dataset.motionBlur || (type === "text" ? 13 : 14),
  );

  let startX = Number(element.dataset.motionX || 0);

  if (type === "left") startX = -82;
  if (type === "right") startX = 82;
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
    if (typeof window === "undefined") return;

    const image = new Image();
    image.src = CHANEL_HERO_IMAGE;
  }, []);

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

    /*
      החלפת תמונת Hero + הסרת הפס הורוד Runtime.
      זה לא דורש לשנות עכשיו את chanelData.
    */
    const heroElement =
      root.querySelector<HTMLElement>("[data-apsora-hero]") ||
      root.querySelector<HTMLElement>(".apsora-hero") ||
      root.querySelector<HTMLElement>(".hero") ||
      root.querySelector<HTMLElement>("section:first-of-type");

    if (heroElement) {
      heroElement.setAttribute("data-apsora-hero", "true");

      const heroImage =
        heroElement.querySelector<HTMLImageElement>("img") ||
        root.querySelector<HTMLImageElement>("section:first-of-type img");

      if (heroImage) {
        heroImage.src = CHANEL_HERO_IMAGE;
        heroImage.removeAttribute("srcset");
        heroImage.loading = "eager";
        heroImage.decoding = "async";
        heroImage.alt = heroImage.alt || "טיפולי יופי וספא";
      }
    }

    const tickerLikeElements = Array.from(
      root.querySelectorAll<HTMLElement>("section, div, aside"),
    );

    tickerLikeElements.forEach((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      const rect = element.getBoundingClientRect();

      const looksLikePinkTicker =
        text.includes("ארומתרפיה") &&
        text.includes("טיפולי פנים") &&
        text.includes("פילינג גוף") &&
        text.length > 70 &&
        rect.height <= 160;

      const hasManyStars = (text.match(/\*/g) || []).length >= 3;
      const hasShortTickerHeight = rect.height > 0 && rect.height <= 160;

      if ((looksLikePinkTicker || hasManyStars) && hasShortTickerHeight) {
        element.classList.add("apsora-strip-hidden");
      }
    });

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    /*
      מוסיף data-apsora-motion גם לאלמנטים שאין להם,
      כדי שכל התבנית תרגיש חיה ולא סטטית.
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
      if (element.classList.contains("apsora-strip-hidden")) return;
      if (element.closest(".apsora-strip-hidden")) return;

      if (!element.dataset.apsoraMotion) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className.toString();

        const isText =
          ["h1", "h2", "h3", "p", "span"].includes(tagName) ||
          className.includes("title") ||
          className.includes("text");

        element.dataset.apsoraMotion = isText
          ? "text"
          : getMotionTypeByIndex(index);

        element.dataset.motionDelay = String(Math.min((index % 6) * 0.028, 0.15));
      }
    });

    const motionElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-apsora-motion]"),
    ).filter((element) => !element.closest(".apsora-strip-hidden"));

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
      heroElement ||
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

        const start = viewportHeight * 1.04;
        const end = viewportHeight * 0.24;
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

        hero.style.setProperty("--apsora-hero-y", `${progress * 58}px`);
        hero.style.setProperty(
          "--apsora-hero-scale",
          String(1.07 + progress * 0.055),
        );
      }
    }

    function animate() {
      if (!running) return;

      if (!reduceMotion) {
        calculateTargets();

        states.forEach((state) => {
          state.current = lerp(state.current, state.target, 0.105);

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
        const y = Math.max(-30, Math.min(30, progress * -46));

        img.style.setProperty("--apsora-parallax-y", `${y}px`);
        img.style.setProperty("--apsora-parallax-scale", "1.095");
      });

      if (testimonialTrack) {
        const rect = testimonialTrack.getBoundingClientRect();
        const top = rect.top - shellRect.top;
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight - top) / viewportHeight),
        );

        testimonialTrack.style.transform = `translate3d(${(progress - 0.5) * 24}px, 0, 0)`;
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
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        const offsetX = card.classList.contains("is-offset") ? -46 : 0;

        card.style.transform = `translate3d(${offsetX - x}px, ${-9 - y}px, 0)`;
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
        if (image) image.style.transform = "scale(1.065)";
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