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
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2600&q=92";

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
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
  }

  .apsora-runtime-page {
    width: 100%;
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 0%, rgba(190, 86, 106, 0.10), transparent 34%),
      radial-gradient(circle at 90% 12%, rgba(126, 86, 64, 0.10), transparent 32%),
      #fff9f5;
    color: #2b1b15;
    font-synthesis: none;
    text-rendering: geometricPrecision;
  }

  [data-template-mode="preview"].apsora-runtime-page,
  [data-template-mode="public"].apsora-runtime-page {
    height: 100vh;
    overflow: hidden;
  }

  [data-template-mode="editor"].apsora-runtime-page {
    height: auto;
    overflow: visible;
  }

  .apsora-scroll-shell {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background:
      radial-gradient(circle at top left, rgba(190, 86, 106, 0.09), transparent 30%),
      linear-gradient(180deg, #fffaf7 0%, #fff6f1 48%, #fffaf7 100%);
  }

  [data-template-mode="preview"] .apsora-scroll-shell,
  [data-template-mode="public"] .apsora-scroll-shell {
    height: 100vh;
    overflow-y: auto;
  }

  [data-template-mode="editor"] .apsora-scroll-shell {
    height: auto;
    overflow-y: visible;
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
    will-change: opacity, transform;
    backface-visibility: hidden;
  }

  .apsora-template-root .apsora-motion-ready {
    opacity: var(--apsora-opacity, 0);
    transform:
      translate3d(var(--apsora-x, 0px), var(--apsora-y, 46px), 0)
      scale(var(--apsora-scale, .985));
    filter: none !important;
    transition: none !important;
  }

  .apsora-template-root .apsora-text-ready {
    opacity: var(--apsora-opacity, 0);
    transform: translate3d(0, var(--apsora-y, 38px), 0);
    filter: none !important;
    transition: none !important;
  }

  .apsora-template-root .apsora-motion-done {
    opacity: 1;
    filter: none !important;
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
    filter: none !important;
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
    filter: brightness(.86) contrast(1.03) saturate(.96) !important;
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

  .apsora-template-root .apsora-hero-content {
    position: absolute !important;
    inset-inline-start: max(6vw, 32px) !important;
    top: 50% !important;
    z-index: 5 !important;
    width: min(650px, calc(100% - 56px)) !important;
    transform: translate3d(0, -48%, 0) !important;
    color: #fff !important;
    display: grid !important;
    gap: 22px !important;
    pointer-events: auto !important;
  }

  .apsora-template-root .apsora-hero-kicker {
    width: max-content;
    min-height: 38px;
    padding: 0 16px;
    border: 1px solid rgba(255,255,255,.22);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.82);
    font-size: 13px;
    font-weight: 900;
    backdrop-filter: blur(18px);
  }

  .apsora-template-root .apsora-hero-title {
    margin: 0 !important;
    max-width: 760px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(56px, 8.4vw, 128px) !important;
    line-height: .88 !important;
    font-weight: 500 !important;
    letter-spacing: -0.09em !important;
    color: #fff !important;
  }

  .apsora-template-root .apsora-hero-subtitle {
    margin: 0 !important;
    max-width: 560px;
    color: rgba(255,255,255,.78) !important;
    font-size: clamp(15px, 1.35vw, 19px) !important;
    line-height: 1.8 !important;
    font-weight: 650 !important;
  }

  .apsora-template-root .apsora-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 8px;
  }

  .apsora-template-root .apsora-hero-primary,
  .apsora-template-root .apsora-hero-secondary {
    min-height: 58px;
    padding: 0 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 950;
  }

  .apsora-template-root .apsora-hero-primary {
    background: #fff;
    color: #171716 !important;
    box-shadow: 0 24px 70px rgba(0,0,0,.22);
  }

  .apsora-template-root .apsora-hero-secondary {
    border: 1px solid rgba(255,255,255,.28);
    background: rgba(255,255,255,.08);
    color: #fff !important;
    backdrop-filter: blur(16px);
  }

  .apsora-template-root .apsora-hero-floating {
    position: absolute !important;
    z-index: 4 !important;
    overflow: hidden !important;
    border: 1px solid rgba(255,255,255,.22);
    border-radius: 28px !important;
    box-shadow: 0 28px 90px rgba(0,0,0,.25);
    background: rgba(255,255,255,.08);
    transform:
      translate3d(var(--apsora-float-x, 0px), var(--apsora-float-y, 0px), 0)
      rotate(var(--apsora-float-r, 0deg)) !important;
    will-change: transform;
  }

  .apsora-template-root .apsora-hero-floating img {
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    object-fit: cover !important;
    filter: brightness(.99) contrast(1.02) saturate(.98) !important;
    transform: scale(1.08) !important;
  }

  .apsora-template-root .apsora-hero-floating.is-one {
    width: clamp(128px, 15vw, 230px) !important;
    height: clamp(158px, 20vw, 295px) !important;
    inset-inline-end: 9vw !important;
    top: 17vh !important;
    --apsora-float-r: 7deg;
  }

  .apsora-template-root .apsora-hero-floating.is-two {
    width: clamp(112px, 13vw, 190px) !important;
    height: clamp(112px, 13vw, 190px) !important;
    inset-inline-end: 25vw !important;
    bottom: 9vh !important;
    border-radius: 999px !important;
    --apsora-float-r: -8deg;
  }

  .apsora-template-root .apsora-hero-stat {
    position: absolute !important;
    z-index: 5 !important;
    inset-inline-end: 8vw !important;
    bottom: 9vh !important;
    min-width: 178px !important;
    padding: 20px 22px !important;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 24px !important;
    background: rgba(255,255,255,.1);
    color: #fff;
    backdrop-filter: blur(20px);
    box-shadow: 0 22px 70px rgba(0,0,0,.2);
  }

  .apsora-template-root .apsora-hero-stat strong {
    display: block;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 44px;
    line-height: .9;
    letter-spacing: -.08em;
  }

  .apsora-template-root .apsora-hero-stat span {
    display: block;
    margin-top: 8px;
    color: rgba(255,255,255,.72);
    font-size: 12px;
    line-height: 1.45;
    font-weight: 850;
  }

  .apsora-template-root .apsora-soft-ticker {
    height: 72px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-block: 1px solid rgba(43,27,21,.08);
    background:
      linear-gradient(90deg, rgba(255,255,255,.74), rgba(255,246,241,.92), rgba(255,255,255,.74));
    color: rgba(43,27,21,.72);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  }

  .apsora-template-root .apsora-soft-ticker-track {
    direction: ltr;
    min-width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 34px;
    animation: chanelSoftTicker 31s linear infinite;
    will-change: transform;
  }

  .apsora-template-root .apsora-soft-ticker span:not(.apsora-flower) {
    direction: rtl;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: .02em;
  }

  .apsora-template-root .apsora-soft-ticker .apsora-flower {
    color: #b84e61;
    font-size: 19px;
  }

  @keyframes chanelSoftTicker {
    from { transform: translateX(0); }
    to { transform: translateX(-33.333%); }
  }

  /*
    הסרת הפס הורוד הישן בלבד.
    הפס החדש .apsora-soft-ticker נשאר פעיל ועדין יותר.
  */
  .apsora-template-root .apsora-ticker:not(.apsora-soft-ticker),
  .apsora-template-root .apsora-marquee,
  .apsora-template-root .apsora-strip,
  .apsora-template-root .apsora-running-line,
  .apsora-template-root [data-apsora-ticker]:not(.apsora-soft-ticker),
  .apsora-template-root [data-apsora-marquee],
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

    .apsora-template-root .apsora-hero-content {
      inset-inline-start: 20px !important;
      width: calc(100% - 40px) !important;
      top: 54% !important;
      gap: 16px !important;
    }

    .apsora-template-root .apsora-hero-title {
      font-size: clamp(48px, 16vw, 78px) !important;
    }

    .apsora-template-root .apsora-hero-subtitle {
      max-width: 92% !important;
      font-size: 14px !important;
    }

    .apsora-template-root .apsora-hero-floating,
    .apsora-template-root .apsora-hero-stat {
      display: none !important;
    }

    .apsora-template-root .apsora-soft-ticker {
      height: 58px;
    }
  }



  /* WOW / Apsora-like scroll interaction layer */
  .apsora-template-root.chanel-wow-ready section {
    transform-style: preserve-3d;
  }

  .apsora-template-root .apsora-hero-wow {
    height: 100vh !important;
    min-height: 760px !important;
  }

  .apsora-template-root .apsora-hero-image {
    height: 100vh !important;
    min-height: 760px !important;
  }

  .apsora-template-root .apsora-hero-content {
    position: absolute !important;
    inset-inline-start: max(6vw, 32px) !important;
    top: 50% !important;
    z-index: 7 !important;
    width: min(720px, calc(100% - 56px)) !important;
    transform:
      translate3d(
        calc(var(--chanel-hero-content-x, 0) * 1px),
        calc(-50% + (var(--chanel-hero-content-y, 0) * 1px)),
        0
      ) !important;
    opacity: var(--chanel-hero-content-opacity, 1) !important;
    filter: none !important;
    color: #fff !important;
    display: grid !important;
    gap: 22px !important;
    pointer-events: auto !important;
    will-change: transform, opacity, filter;
  }

  .apsora-template-root .apsora-hero-kicker {
    width: max-content;
    min-height: 38px;
    padding: 0 16px;
    border: 1px solid rgba(255,255,255,.22);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.84) !important;
    font-size: 13px;
    font-weight: 900;
    backdrop-filter: blur(18px);
  }

  .apsora-template-root .apsora-hero-title {
    margin: 0 !important;
    max-width: 790px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(58px, 8.8vw, 138px) !important;
    line-height: .86 !important;
    font-weight: 500 !important;
    letter-spacing: -0.095em !important;
    color: #fff !important;
    text-shadow: 0 24px 90px rgba(0,0,0,.36);
  }

  .apsora-template-root .apsora-hero-subtitle {
    margin: 0 !important;
    max-width: 580px;
    color: rgba(255,255,255,.78) !important;
    font-size: clamp(15px, 1.35vw, 19px) !important;
    line-height: 1.86 !important;
    font-weight: 650 !important;
  }

  .apsora-template-root .apsora-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 8px;
  }

  .apsora-template-root .apsora-hero-primary,
  .apsora-template-root .apsora-hero-secondary {
    min-height: 58px;
    padding: 0 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 950;
  }

  .apsora-template-root .apsora-hero-primary {
    background: #fff;
    color: #171716 !important;
    box-shadow: 0 24px 70px rgba(0,0,0,.22);
  }

  .apsora-template-root .apsora-hero-secondary {
    border: 1px solid rgba(255,255,255,.28);
    background: rgba(255,255,255,.08);
    color: #fff !important;
    backdrop-filter: blur(16px);
  }

  .apsora-template-root .apsora-hero-floating {
    position: absolute !important;
    z-index: 6 !important;
    overflow: hidden !important;
    border: 1px solid rgba(255,255,255,.22);
    border-radius: 28px !important;
    box-shadow: 0 28px 90px rgba(0,0,0,.25);
    background: rgba(255,255,255,.08);
    opacity: var(--chanel-float-opacity, 1) !important;
    transform:
      translate3d(var(--apsora-float-x, 0px), var(--apsora-float-y, 0px), 0)
      rotate(var(--apsora-float-r, 0deg))
      scale(var(--apsora-float-scale, 1)) !important;
    will-change: transform, opacity;
  }

  .apsora-template-root .apsora-hero-floating img {
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    object-fit: cover !important;
    filter: brightness(.99) contrast(1.02) saturate(.98) !important;
    transform: scale(1.08) !important;
  }

  .apsora-template-root .apsora-hero-floating.is-one {
    width: clamp(128px, 15vw, 230px) !important;
    height: clamp(158px, 20vw, 295px) !important;
    inset-inline-end: 9vw !important;
    top: 17vh !important;
    --apsora-float-r: 7deg;
  }

  .apsora-template-root .apsora-hero-floating.is-two {
    width: clamp(112px, 13vw, 190px) !important;
    height: clamp(112px, 13vw, 190px) !important;
    inset-inline-end: 25vw !important;
    bottom: 9vh !important;
    border-radius: 999px !important;
    --apsora-float-r: -8deg;
  }

  .apsora-template-root .apsora-hero-stat {
    position: absolute !important;
    z-index: 7 !important;
    inset-inline-end: 8vw !important;
    bottom: 9vh !important;
    min-width: 178px !important;
    padding: 20px 22px !important;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 24px !important;
    background: rgba(255,255,255,.1);
    color: #fff;
    backdrop-filter: blur(20px);
    box-shadow: 0 22px 70px rgba(0,0,0,.2);
    opacity: var(--chanel-stat-opacity, 1) !important;
    transform: translate3d(0, var(--chanel-stat-y, 0px), 0) !important;
    will-change: transform, opacity;
  }

  .apsora-template-root .apsora-hero-stat strong {
    display: block;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 44px;
    line-height: .9;
    letter-spacing: -.08em;
  }

  .apsora-template-root .apsora-hero-stat span {
    display: block;
    margin-top: 8px;
    color: rgba(255,255,255,.72);
    font-size: 12px;
    line-height: 1.45;
    font-weight: 850;
  }

  .apsora-template-root .apsora-soft-ticker {
    height: 72px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-block: 1px solid rgba(43,27,21,.08);
    background:
      linear-gradient(90deg, rgba(255,255,255,.74), rgba(255,246,241,.92), rgba(255,255,255,.74));
    color: rgba(43,27,21,.72);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  }

  .apsora-template-root .apsora-soft-ticker-track {
    direction: ltr;
    min-width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 34px;
    animation: chanelSoftTicker 31s linear infinite;
    will-change: transform;
  }

  .apsora-template-root .apsora-soft-ticker span:not(.apsora-flower) {
    direction: rtl;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: .02em;
  }

  .apsora-template-root .apsora-soft-ticker .apsora-flower {
    color: #b84e61;
    font-size: 19px;
  }

  .apsora-template-root .apsora-section-inview .apsora-section-title,
  .apsora-template-root .apsora-section-inview .apsora-services-title {
    transform: translate3d(0, calc((1 - var(--chanel-section-progress, 1)) * 40px), 0);
  }

  .apsora-template-root .apsora-testimonial-track {
    will-change: transform;
  }

  @keyframes chanelSoftTicker {
    from { transform: translateX(0); }
    to { transform: translateX(-33.333%); }
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

  const baseY = type === "text" ? 38 : 52;
  const startY = Number(element.dataset.motionY || baseY);
  const startScale = Number(
    element.dataset.motionScale || (type === "text" ? 0.992 : 0.982),
  );
  const startBlur = 0;

  let startX = Number(element.dataset.motionX || 0);

  if (type === "left") startX = -62;
  if (type === "right") startX = 62;
  if (type === "up") startX = 0;
  if (type === "text") startX = 0;

  element.style.setProperty("--apsora-opacity", String(eased));
  element.style.setProperty("--apsora-x", `${startX * (1 - eased)}px`);
  element.style.setProperty("--apsora-y", `${startY * (1 - eased)}px`);
  element.style.setProperty(
    "--apsora-scale",
    String(startScale + (1 - startScale) * eased),
  );
  element.style.setProperty("--apsora-blur", "0px");

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

type ChanelScrollRuntime = {
  target: HTMLElement;
  rect: DOMRect;
  scrollTop: number;
  viewportHeight: number;
};

function getChanelEditorCanvas(root: HTMLElement, mode: Props["mode"]) {
  if (mode !== "editor") return null;

  return root.closest("[data-visual-template-canvas='true']") as HTMLElement | null;
}

function getChanelScrollTarget(
  root: HTMLElement,
  shell: HTMLElement,
  mode: Props["mode"],
) {
  const editorCanvas = getChanelEditorCanvas(root, mode);

  if (editorCanvas && editorCanvas.scrollHeight > editorCanvas.clientHeight) {
    return editorCanvas;
  }

  return shell;
}

function getChanelScrollRuntime(
  root: HTMLElement,
  shell: HTMLElement,
  mode: Props["mode"],
): ChanelScrollRuntime {
  const target = getChanelScrollTarget(root, shell, mode);
  const rect = target.getBoundingClientRect();
  const viewportHeight = target.clientHeight || rect.height || window.innerHeight || 900;

  return {
    target,
    rect,
    scrollTop: target.scrollTop || 0,
    viewportHeight,
  };
}

function addChanelScrollListeners(
  root: HTMLElement,
  shell: HTMLElement,
  mode: Props["mode"],
  callback: () => void,
) {
  const target = getChanelScrollTarget(root, shell, mode);
  const targets = Array.from(new Set<HTMLElement>([target, shell]));

  targets.forEach((item) => {
    item.addEventListener("scroll", callback, { passive: true });
  });

  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);

  return () => {
    targets.forEach((item) => {
      item.removeEventListener("scroll", callback);
    });

    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function scrollChanelTo(
  root: HTMLElement,
  shell: HTMLElement,
  mode: Props["mode"],
  top: number,
  behavior: ScrollBehavior = "smooth",
) {
  const target = getChanelScrollTarget(root, shell, mode);

  target.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
}

function getChanelTargetTop(
  root: HTMLElement,
  shell: HTMLElement,
  mode: Props["mode"],
  targetElement: HTMLElement,
  offset = 76,
) {
  const runtime = getChanelScrollRuntime(root, shell, mode);
  const targetRect = targetElement.getBoundingClientRect();

  return runtime.scrollTop + targetRect.top - runtime.rect.top - offset;
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

            const nextTop = getChanelTargetTop(root, shell, mode, samePageTarget, 76);

            scrollChanelTo(root, shell, mode, nextTop, "smooth");

            return;
          }
        }

        if (isStudioStatic) return;

        event.preventDefault();
        setActivePage(normalizePageInput(cleanHref));
        scrollChanelTo(root, shell, mode, 0, "smooth");
        return;
      }

      const nextPage = normalizePageInput(cleanHref);

      if (nextPage && nextPage !== pageToRender) {
        if (isStudioStatic) return;

        event.preventDefault();
        setActivePage(nextPage);
        requestAnimationFrame(() => {
          scrollChanelTo(root, shell, mode, 0, "smooth");
        });
      }
    }

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic, mode]);

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
      if (element.classList.contains("apsora-soft-ticker")) return;
      if (element.closest(".apsora-soft-ticker")) return;

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
      ".apsora-hero-content > *",
      ".apsora-hero-floating",
      ".apsora-hero-stat",
      ".apsora-soft-ticker",
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

        element.dataset.motionDelay = String(Math.min((index % 6) * 0.055, 0.28));
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
      const { rect: shellRect, viewportHeight } = getChanelScrollRuntime(root, shell, mode);

      states.forEach((state) => {
        const rect = state.element.getBoundingClientRect();
        const top = rect.top - shellRect.top;

        const start = viewportHeight * 1.05;
        const end = viewportHeight * 0.10;
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

        hero.style.setProperty("--apsora-hero-y", `${progress * 32}px`);
        hero.style.setProperty(
          "--apsora-hero-scale",
          String(1.045 + progress * 0.035),
        );
      }
    }

    function animate() {
      if (!running) return;

      if (!reduceMotion) {
        calculateTargets();

        states.forEach((state) => {
          state.current = lerp(state.current, state.target, 0.044);

          if (Math.abs(state.target - state.current) < 0.001) {
            state.current = state.target;
          }

          applyMotion(state);
        });
      }

      frame = window.requestAnimationFrame(animate);
    }

    const removeScrollListeners = addChanelScrollListeners(
      root,
      shell,
      mode,
      calculateTargets,
    );

    requestAnimationFrame(calculateTargets);
    setTimeout(calculateTargets, 80);
    setTimeout(calculateTargets, 240);
    calculateTargets();
    frame = window.requestAnimationFrame(animate);

    return () => {
      running = false;
      removeScrollListeners();
      window.cancelAnimationFrame(frame);
    };
  }, [pageToRender, mode]);

  React.useEffect(() => {
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell || typeof window === "undefined") return;

    const header = root.querySelector<HTMLElement>(".apsora-header");

    const parallaxItems = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".apsora-process-image img, .apsora-about-media img, .apsora-contact-image img, .apsora-booking-image img, .apsora-faq-art > img, .apsora-gallery-item img",
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
      const { rect: shellRect, scrollTop, viewportHeight } = getChanelScrollRuntime(root, shell, mode);

      if (header) {
        header.classList.toggle("is-scrolled", scrollTop > 12);
      }

      parallaxItems.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const center = rect.top - shellRect.top + rect.height / 2;
        const progress = (center - viewportHeight / 2) / viewportHeight;
        const y = Math.max(-16, Math.min(16, progress * -24));

        img.style.setProperty("--apsora-parallax-y", `${y}px`);
        img.style.setProperty("--apsora-parallax-scale", "1.045");
      });

      const heroFloaters = Array.from(
        root.querySelectorAll<HTMLElement>(".apsora-hero-floating, .apsora-hero-stat"),
      );

      heroFloaters.forEach((item, index) => {
        const progress = Math.max(0, Math.min(1, scrollTop / Math.max(1, viewportHeight)));
        const direction = index % 2 === 0 ? 1 : -1;
        item.style.setProperty("--apsora-float-y", `${progress * 30 * direction}px`);
        item.style.setProperty("--apsora-float-x", `${progress * 8 * -direction}px`);
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

    const removeScrollListeners = addChanelScrollListeners(root, shell, mode, onScroll);

    requestAnimationFrame(onScroll);
    setTimeout(onScroll, 80);
    setTimeout(onScroll, 240);
    onScroll();

    return () => {
      removeScrollListeners();
      removeCallbacks.forEach((remove) => remove());
    };
  }, [pageToRender, mode]);


  React.useEffect(() => {
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell || typeof window === "undefined") return;

    root.classList.add("chanel-wow-ready");

    const hero =
      root.querySelector<HTMLElement>(".apsora-hero-wow") ||
      root.querySelector<HTMLElement>(".apsora-hero") ||
      root.querySelector<HTMLElement>("[data-apsora-hero]") ||
      root.querySelector<HTMLElement>("section:first-of-type");

    const heroImage =
      hero?.querySelector<HTMLElement>(".apsora-hero-image img") ||
      hero?.querySelector<HTMLElement>("img");

    const heroContent = hero?.querySelector<HTMLElement>(".apsora-hero-content");
    const heroFloatOne = hero?.querySelector<HTMLElement>(".apsora-hero-floating.is-one");
    const heroFloatTwo = hero?.querySelector<HTMLElement>(".apsora-hero-floating.is-two");
    const heroStat = hero?.querySelector<HTMLElement>(".apsora-hero-stat");
    const testimonialTrack = root.querySelector<HTMLElement>(".apsora-testimonial-track");
    const softTickerTrack = root.querySelector<HTMLElement>(".apsora-soft-ticker-track");

    const sections = Array.from(root.querySelectorAll<HTMLElement>("section"));
    const galleryItems = Array.from(root.querySelectorAll<HTMLElement>(".apsora-gallery-item"));
    const processCards = Array.from(root.querySelectorAll<HTMLElement>(".apsora-process-card"));
    const therapyCards = Array.from(root.querySelectorAll<HTMLElement>(".apsora-therapy-card"));
    const teamCards = Array.from(root.querySelectorAll<HTMLElement>(".apsora-team-card"));

    let frame = 0;
    let rafActive = true;

    function setNumberVar(element: HTMLElement | null | undefined, name: string, value: number) {
      if (!element) return;
      element.style.setProperty(name, String(Number(value.toFixed(4))));
    }

    function setPxVar(element: HTMLElement | null | undefined, name: string, value: number) {
      if (!element) return;
      element.style.setProperty(name, `${Number(value.toFixed(2))}px`);
    }

    function tick() {
      if (!rafActive) return;

      const { rect: shellRect, scrollTop, viewportHeight } = getChanelScrollRuntime(root, shell, mode);

      if (hero) {
        const heroHeight = Math.max(hero.offsetHeight || viewportHeight, viewportHeight);
        const heroProgress = clamp(scrollTop / heroHeight, 0, 1);
        setPxVar(hero, "--apsora-hero-y", heroProgress * 46);
        setNumberVar(hero, "--apsora-hero-scale", 1.045 + heroProgress * 0.035);

        if (heroImage) {
          heroImage.style.transform = `translate3d(0, ${heroProgress * 46}px, 0) scale(${1.045 + heroProgress * 0.035})`;
        }

        if (heroContent) {
          setNumberVar(heroContent, "--chanel-hero-content-opacity", 1 - heroProgress * 0.52);
          setNumberVar(heroContent, "--chanel-hero-content-blur", 0);
          setNumberVar(heroContent, "--chanel-hero-content-x", heroProgress * -12);
          setNumberVar(heroContent, "--chanel-hero-content-y", heroProgress * 34);
        }

        if (heroFloatOne) {
          setPxVar(heroFloatOne, "--apsora-float-x", heroProgress * -32);
          setPxVar(heroFloatOne, "--apsora-float-y", heroProgress * 54 + Math.sin(scrollTop * 0.006) * 4);
          setNumberVar(heroFloatOne, "--apsora-float-scale", 1 + heroProgress * 0.025);
          setNumberVar(heroFloatOne, "--chanel-float-opacity", 1 - heroProgress * 0.64);
        }

        if (heroFloatTwo) {
          setPxVar(heroFloatTwo, "--apsora-float-x", heroProgress * 40);
          setPxVar(heroFloatTwo, "--apsora-float-y", heroProgress * -38 + Math.cos(scrollTop * 0.006) * 4);
          setNumberVar(heroFloatTwo, "--apsora-float-scale", 1 + heroProgress * 0.03);
          setNumberVar(heroFloatTwo, "--chanel-float-opacity", 1 - heroProgress * 0.58);
        }

        if (heroStat) {
          setPxVar(heroStat, "--chanel-stat-y", heroProgress * 38);
          setNumberVar(heroStat, "--chanel-stat-opacity", 1 - heroProgress * 0.72);
        }
      }

      if (softTickerTrack) {
        softTickerTrack.style.transform = `translate3d(${-(scrollTop % 420) * 0.18}px, 0, 0)`;
      }

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top - shellRect.top;
        const progress = clamp((viewportHeight * 0.92 - top) / (viewportHeight * 0.72), 0, 1);
        section.classList.toggle("apsora-section-inview", progress > 0.08);
        setNumberVar(section, "--chanel-section-progress", easeOutExpo(progress));

        if (progress > 0.08) {
          section.style.setProperty("--chanel-section-index", String(index));
        }
      });

      galleryItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top - shellRect.top + rect.height / 2;
        const progress = (center - viewportHeight / 2) / viewportHeight;
        const y = Math.max(-18, Math.min(18, progress * -28));
        const img = item.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `translate3d(0, ${y}px, 0) scale(${1.035 + (index % 3) * 0.006})`;
      });

      processCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp((viewportHeight - (rect.top - shellRect.top)) / viewportHeight, 0, 1);
        const y = (1 - easeOutExpo(progress)) * (index % 2 ? 12 : -12);
        card.style.setProperty("--chanel-card-y", `${y}px`);
      });

      therapyCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp((viewportHeight - (rect.top - shellRect.top)) / viewportHeight, 0, 1);
        const x = (1 - easeOutExpo(progress)) * (index % 2 ? 36 : -36);
        card.style.setProperty("--chanel-therapy-x", `${x}px`);
      });

      teamCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp((viewportHeight - (rect.top - shellRect.top)) / viewportHeight, 0, 1);
        card.style.setProperty("--chanel-team-delay", `${index * 0.035}`);
        card.style.setProperty("--chanel-team-progress", String(easeOutExpo(progress)));
      });

      if (testimonialTrack) {
        const rect = testimonialTrack.getBoundingClientRect();
        const top = rect.top - shellRect.top;
        const progress = clamp((viewportHeight - top) / (viewportHeight + rect.height), 0, 1);
        const travel = Math.min(70, Math.max(28, testimonialTrack.scrollWidth - testimonialTrack.clientWidth));
        testimonialTrack.style.transform = `translate3d(${(0.5 - progress) * travel}px, 0, 0)`;
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => {
      rafActive = false;
      window.cancelAnimationFrame(frame);
      root.classList.remove("chanel-wow-ready");
    };
  }, [pageToRender, mode]);

  React.useEffect(() => {
    const root = rootRef.current;
    const shell = scrollRef.current;
    if (!root || !shell) return;

    scrollChanelTo(root, shell, mode, 0, "auto");
  }, [pageToRender, mode]);

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