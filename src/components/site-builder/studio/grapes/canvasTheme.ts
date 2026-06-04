import type { ThemePalette } from "../types";

export function createCanvasCss(palette?: ThemePalette) {
  const primary = palette?.colors.primary || "#7C3AED";
  const secondary = palette?.colors.secondary || "#F3E8FF";
  const accent = palette?.colors.accent || "#EC4899";
  const background = palette?.colors.background || "#FFF7FD";
  const text = palette?.colors.text || "#171321";
  const muted = palette?.colors.muted || "#64748B";
  const headingFont = palette?.font.heading || "Heebo";
  const bodyFont = palette?.font.body || "Assistant";

  return `
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800;900&family=Heebo:wght@300;400;600;700;800;900&family=Rubik:wght@400;600;700;800;900&family=Alef:wght@400;700&family=Varela+Round&family=Noto+Sans+Hebrew:wght@400;600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&family=DM+Sans:wght@400;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&family=Lora:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap");

:root,
[data-bizuply-page="true"],
.biz-page {
  --biz-primary: ${primary};
  --biz-secondary: ${secondary};
  --biz-accent: ${accent};
  --biz-bg: ${background};
  --biz-text: ${text};
  --biz-muted: ${muted};

  --biz-heading-font: "${headingFont}", "Heebo", Arial, sans-serif;
  --biz-body-font: "${bodyFont}", "Assistant", Arial, sans-serif;

  --biz-white: #ffffff;
  --biz-black: #020617;
  --biz-border: color-mix(in srgb, var(--biz-primary) 14%, #e2e8f0);
  --biz-soft: color-mix(in srgb, var(--biz-secondary) 62%, #ffffff);
  --biz-primary-soft: color-mix(in srgb, var(--biz-primary) 13%, #ffffff);
  --biz-accent-soft: color-mix(in srgb, var(--biz-accent) 13%, #ffffff);

  --biz-radius-sm: 18px;
  --biz-radius-md: 28px;
  --biz-radius-lg: 42px;
  --biz-radius-xl: 56px;

  --biz-shadow-soft: 0 24px 80px rgba(15,23,42,0.08);
  --biz-shadow-medium: 0 34px 105px rgba(15,23,42,0.13);
  --biz-shadow-strong: 0 44px 140px rgba(15,23,42,0.16);
  --biz-shadow-color: 0 28px 90px color-mix(in srgb, var(--biz-primary) 28%, transparent);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  direction: rtl;
  font-family: var(--biz-body-font);
  color: var(--biz-text);
  background: var(--biz-bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

button,
input,
textarea,
select {
  font-family: inherit;
}

img,
video,
iframe {
  max-width: 100%;
}

.biz-page,
[data-bizuply-page="true"] {
  min-height: 100vh;
  overflow: hidden;
  color: var(--biz-text);
  font-family: var(--biz-body-font);
  background:
    radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--biz-primary) 16%, transparent), transparent 34%),
    radial-gradient(circle at 88% 20%, color-mix(in srgb, var(--biz-accent) 12%, transparent), transparent 32%),
    linear-gradient(135deg, var(--biz-bg) 0%, #ffffff 48%, color-mix(in srgb, var(--biz-secondary) 42%, #ffffff) 100%);
}

.biz-page *,
[data-bizuply-page="true"] * {
  font-family: inherit;
}

/* =====================================================
   GLOBAL THEME OVERRIDES
   These rules make palette + fonts affect old and new blocks
===================================================== */

.biz-page h1,
.biz-page h2,
.biz-page h3,
.biz-page h4,
.biz-page .biz-title,
.biz-page .biz-section-title,
.biz-page .biz-card-title,
[data-bizuply-page="true"] h1,
[data-bizuply-page="true"] h2,
[data-bizuply-page="true"] h3,
[data-bizuply-page="true"] h4 {
  font-family: var(--biz-heading-font);
  color: var(--biz-text);
}

.biz-page p,
.biz-page span,
.biz-page li,
.biz-page input,
.biz-page textarea,
.biz-page button,
.biz-page a,
[data-bizuply-page="true"] p,
[data-bizuply-page="true"] span,
[data-bizuply-page="true"] li,
[data-bizuply-page="true"] input,
[data-bizuply-page="true"] textarea,
[data-bizuply-page="true"] button,
[data-bizuply-page="true"] a {
  font-family: var(--biz-body-font);
}

/* =====================================================
   NAV
===================================================== */

.biz-nav {
  width: min(1240px, calc(100% - 32px));
  min-height: 82px;
  margin: 16px auto 0;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(26px);
  border: 1px solid rgba(226,232,240,0.82);
  border-radius: 28px;
  position: sticky;
  top: 14px;
  z-index: 20;
  box-shadow: 0 18px 70px rgba(15,23,42,0.08);
}

.biz-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.biz-logo {
  width: 54px;
  height: 54px;
  border-radius: 21px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--biz-primary), var(--biz-accent));
  color: #fff;
  font-weight: 950;
  box-shadow: var(--biz-shadow-color);
}

.biz-brand-title {
  margin: 0;
  font-weight: 950;
  font-size: 18px;
  color: var(--biz-text);
}

.biz-brand-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  font-weight: 800;
  color: var(--biz-muted);
}

.biz-nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--biz-muted);
  font-size: 14px;
  font-weight: 850;
}

.biz-nav-links a {
  cursor: pointer;
  transition: 0.22s ease;
  border-radius: 999px;
  padding: 10px 14px;
}

.biz-nav-links a:hover {
  color: var(--biz-primary);
  background: var(--biz-primary-soft);
  transform: translateY(-1px);
}

/* =====================================================
   LAYOUT
===================================================== */

.biz-section {
  max-width: 1240px;
  margin: 0 auto;
  padding: 96px 32px;
}

.biz-section-wide {
  max-width: 1380px;
  margin: 0 auto;
  padding: 104px 40px;
}

.biz-section-full {
  max-width: 1380px;
  margin: 0 auto;
  padding: 104px 40px;
}

.biz-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 58px;
  align-items: center;
}

.biz-grid-2,
.biz-grid-3,
.biz-grid-4 {
  margin-top: 48px;
  display: grid;
  gap: 24px;
}

.biz-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.biz-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.biz-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* =====================================================
   HERO
===================================================== */

.biz-hero {
  min-height: 710px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: 70px;
}

.biz-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--biz-radius-xl);
  padding: 74px;
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(255,255,255,0.96);
  box-shadow: var(--biz-shadow-strong);
  backdrop-filter: blur(30px);
}

.biz-hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--biz-accent) 20%, transparent), transparent 28%),
    radial-gradient(circle at 8% 82%, color-mix(in srgb, var(--biz-primary) 16%, transparent), transparent 36%);
}

.biz-hero-card > * {
  position: relative;
  z-index: 1;
}

.biz-hero-image-wrap {
  position: relative;
  border-radius: var(--biz-radius-xl);
  padding: 15px;
  background: #fff;
  box-shadow: var(--biz-shadow-strong);
}

.biz-hero-image-wrap::before {
  content: "";
  position: absolute;
  inset: -28px;
  border-radius: 68px;
  background: color-mix(in srgb, var(--biz-primary) 20%, transparent);
  filter: blur(38px);
  z-index: -1;
}

.biz-hero-image {
  display: block;
  width: 100%;
  height: 560px;
  object-fit: cover;
  border-radius: 40px;
}

/* =====================================================
   TYPOGRAPHY
===================================================== */

.biz-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--biz-border);
  padding: 10px 18px;
  color: var(--biz-primary);
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 14px 36px rgba(15,23,42,0.07);
}

.biz-title {
  position: relative;
  margin: 26px 0 0;
  font-family: var(--biz-heading-font);
  font-size: clamp(52px, 6vw, 92px);
  line-height: 0.94;
  letter-spacing: -0.058em;
  font-weight: 950;
  color: var(--biz-text);
}

.biz-subtitle {
  position: relative;
  max-width: 680px;
  margin: 26px 0 0;
  color: var(--biz-muted);
  font-size: 21px;
  line-height: 1.82;
  font-weight: 760;
}

.biz-section-kicker {
  margin: 0 auto 14px;
  width: fit-content;
  color: var(--biz-primary);
  font-weight: 950;
  font-size: 13px;
}

.biz-section-title {
  margin: 0;
  text-align: center;
  font-family: var(--biz-heading-font);
  font-size: clamp(36px, 4vw, 62px);
  line-height: 1.05;
  letter-spacing: -0.045em;
  font-weight: 950;
  color: var(--biz-text);
}

.biz-section-text {
  max-width: 820px;
  margin: 24px auto 0;
  text-align: center;
  color: var(--biz-muted);
  font-size: 18px;
  line-height: 1.95;
  font-weight: 720;
}

/* =====================================================
   BUTTONS
===================================================== */

.biz-actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 38px;
}

.biz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 0 32px;
  border-radius: 20px;
  font-weight: 950;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.25s ease;
  user-select: none;
}

.biz-btn:hover {
  transform: translateY(-3px);
}

.biz-btn-primary {
  background: linear-gradient(135deg, var(--biz-primary), var(--biz-accent));
  color: #fff;
  box-shadow: var(--biz-shadow-color);
}

.biz-btn-secondary {
  background: #fff;
  color: var(--biz-text);
  border-color: var(--biz-border);
  box-shadow: 0 16px 40px rgba(15,23,42,0.08);
}

/* =====================================================
   CARDS / IMAGES
===================================================== */

.biz-card {
  border-radius: 34px;
  padding: 32px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(226,232,240,0.95);
  box-shadow: var(--biz-shadow-soft);
  transition: 0.25s ease;
}

.biz-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--biz-shadow-medium);
}

.biz-card-icon {
  width: 58px;
  height: 58px;
  border-radius: 22px;
  background: linear-gradient(135deg, var(--biz-primary), var(--biz-accent));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 950;
  margin-bottom: 24px;
  box-shadow: var(--biz-shadow-color);
}

.biz-card-title {
  margin: 0;
  font-size: 23px;
  line-height: 1.25;
  font-weight: 950;
  color: var(--biz-text);
}

.biz-card-text {
  margin: 13px 0 0;
  color: var(--biz-muted);
  font-size: 15px;
  line-height: 1.78;
  font-weight: 720;
}

.biz-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 26px;
  color: var(--biz-muted);
  font-weight: 850;
}

.biz-price {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  background: var(--biz-secondary);
  color: var(--biz-primary);
  padding: 9px 16px;
  font-size: 14px;
  font-weight: 950;
}

.biz-image-card {
  border-radius: 42px;
  overflow: hidden;
  background: #fff;
  padding: 12px;
  box-shadow: 0 36px 110px rgba(15,23,42,0.14);
}

.biz-image-card img {
  display: block;
  width: 100%;
  height: 440px;
  object-fit: cover;
  border-radius: 32px;
}

.biz-gallery-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 32px;
  box-shadow: 0 26px 82px rgba(15,23,42,0.13);
  transition: 0.25s ease;
}

.biz-gallery-img:hover {
  transform: scale(1.025);
}

/* =====================================================
   SPECIAL SECTIONS
===================================================== */

.biz-dark-section {
  background:
    radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--biz-primary) 40%, transparent), transparent 34%),
    radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--biz-accent) 28%, transparent), transparent 32%),
    linear-gradient(135deg, #020617, #111827);
  color: #fff;
  border-radius: var(--biz-radius-xl);
  padding: 70px;
  box-shadow: 0 44px 150px rgba(2,6,23,0.36);
}

.biz-dark-section .biz-section-title,
.biz-dark-section .biz-card-title {
  color: #fff;
}

.biz-dark-section .biz-card-text,
.biz-dark-section .biz-section-text {
  color: rgba(255,255,255,0.72);
}

.biz-strip-soft {
  border-radius: var(--biz-radius-xl);
  padding: 72px;
  background:
    radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--biz-primary) 12%, transparent), transparent 32%),
    linear-gradient(135deg, #ffffff, color-mix(in srgb, var(--biz-secondary) 55%, #ffffff));
  box-shadow: var(--biz-shadow-soft);
}

.biz-bg-image {
  position: relative;
  overflow: hidden;
  color: #fff;
  border-radius: var(--biz-radius-xl);
  padding: 104px 60px;
  background-size: cover;
  background-position: center;
  box-shadow: var(--biz-shadow-strong);
}

.biz-bg-image::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(2,6,23,0.58), rgba(2,6,23,0.22)),
    radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--biz-primary) 32%, transparent), transparent 35%);
}

.biz-bg-image > * {
  position: relative;
  z-index: 1;
}

.biz-floating-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #fff;
  color: var(--biz-primary);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 14px 34px rgba(15,23,42,0.08);
}

/* =====================================================
   BOOKING / FORMS / STORE
===================================================== */

.biz-booking-box {
  background: #fff;
  color: var(--biz-text);
  border-radius: 36px;
  padding: 32px;
  box-shadow: 0 32px 100px rgba(2,6,23,0.26);
}

.biz-time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.biz-time {
  border: 1px solid var(--biz-secondary);
  background: var(--biz-secondary);
  color: var(--biz-primary);
  border-radius: 21px;
  padding: 16px;
  text-align: center;
  font-weight: 950;
  transition: 0.2s ease;
}

.biz-time:hover {
  background: var(--biz-primary);
  color: #fff;
  transform: translateY(-2px);
}

.biz-form {
  display: grid;
  gap: 15px;
  margin-top: 30px;
}

.biz-input,
.biz-textarea {
  width: 100%;
  border-radius: 21px;
  border: 1px solid #e2e8f0;
  padding: 0 18px;
  font-weight: 800;
  background: #fff;
  color: var(--biz-text);
  outline: none;
}

.biz-input:focus,
.biz-textarea:focus {
  border-color: var(--biz-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--biz-primary) 16%, transparent);
}

.biz-input {
  min-height: 56px;
}

.biz-textarea {
  min-height: 136px;
  padding-top: 18px;
  resize: vertical;
}

/* =====================================================
   CAROUSEL / MARQUEE / COUNTERS
===================================================== */

.biz-carousel {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 10px 4px 18px;
}

.biz-carousel > * {
  scroll-snap-align: start;
  min-width: 340px;
}

.biz-carousel::-webkit-scrollbar {
  height: 8px;
}

.biz-carousel::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 999px;
}

.biz-carousel::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--biz-primary) 50%, #cbd5e1);
  border-radius: 999px;
}

.biz-marquee {
  overflow: hidden;
  white-space: nowrap;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  color: var(--biz-primary);
  font-size: 30px;
  font-weight: 950;
}

.biz-marquee span {
  display: inline-block;
  padding-left: 44px;
  animation: biz-marquee 18s linear infinite;
}

@keyframes biz-marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(50%);
  }
}

.biz-counter {
  text-align: center;
  border-radius: 34px;
  background: #fff;
  padding: 38px;
  box-shadow: var(--biz-shadow-soft);
}

.biz-counter strong {
  display: block;
  font-size: 50px;
  color: var(--biz-primary);
  font-weight: 950;
}

/* =====================================================
   FOOTER
===================================================== */

.biz-footer {
  background: #020617;
  color: #fff;
  padding: 62px 78px;
}

.biz-footer-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 1fr);
}

.biz-footer-card {
  background: rgba(255,255,255,0.08);
  border-radius: 28px;
  padding: 26px;
}

/* =====================================================
   ANIMATIONS
===================================================== */

[data-animate="fade-up"] {
  animation: biz-fade-up 0.85s ease both;
}

[data-animate="zoom-in"] {
  animation: biz-zoom-in 0.75s ease both;
}

[data-animate="slide-right"] {
  animation: biz-slide-right 0.8s ease both;
}

[data-animate="blur-reveal"] {
  animation: biz-blur-reveal 0.9s ease both;
}

[data-animate="float-soft"] {
  animation: biz-float-soft 3.2s ease-in-out infinite;
}

[data-animate="pulse-soft"] {
  animation: biz-pulse-soft 2.4s ease-in-out infinite;
}

@keyframes biz-fade-up {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes biz-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes biz-slide-right {
  from {
    opacity: 0;
    transform: translateX(38px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes biz-blur-reveal {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@keyframes biz-float-soft {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes biz-pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.035);
  }
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 900px) {
  .biz-nav {
    width: calc(100% - 24px);
    min-height: 74px;
    padding: 12px 14px;
    top: 10px;
  }

  .biz-nav-links {
    display: none;
  }

  .biz-section,
  .biz-section-wide,
  .biz-section-full {
    padding: 58px 20px;
  }

  .biz-hero,
  .biz-split {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .biz-hero-card {
    padding: 36px;
    border-radius: 34px;
  }

  .biz-title {
    font-size: 48px;
  }

  .biz-subtitle {
    font-size: 18px;
  }

  .biz-hero-image {
    height: 370px;
  }

  .biz-grid-2,
  .biz-grid-3,
  .biz-grid-4,
  .biz-footer-grid {
    grid-template-columns: 1fr;
  }

  .biz-dark-section,
  .biz-strip-soft,
  .biz-bg-image {
    padding: 36px;
    border-radius: 34px;
  }

  .biz-time-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .biz-carousel > * {
    min-width: 280px;
  }
}
`;
}

export const defaultCanvasCss = createCanvasCss();

export const defaultWebsiteHtml = `
<div class="biz-page" data-bizuply-page="true">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">B</div>
      <div>
        <p class="biz-brand-title">שם העסק</p>
        <p class="biz-brand-subtitle">תחום העסק</p>
      </div>
    </div>

    <nav class="biz-nav-links">
      <a>דף הבית</a>
      <a>אודות</a>
      <a>שירותים</a>
      <a>גלריה</a>
      <a>מוצרים</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full biz-hero" data-animate="fade-up">
    <div class="biz-hero-card">
      <div class="biz-pill">עסק מקצועי · אתר חכם</div>
      <h1 class="biz-title">אתר עסקי שנראה כמו מותג פרימיום</h1>
      <p class="biz-subtitle">
        הציגו שירותים, תורים, מוצרים, לידים ותוכן שיווקי במקום אחד — עם עיצוב מקצועי שניתן לעריכה מלאה.
      </p>
      <div class="biz-actions">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>

    <div class="biz-hero-image-wrap">
      <img class="biz-hero-image" src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90" />
    </div>
  </section>

  <section class="biz-section">
    <p class="biz-section-kicker">אודות</p>
    <h2 class="biz-section-title">קצת על העסק</h2>
    <p class="biz-section-text">
      כאן אפשר לספר על העסק, הניסיון, השירותים והערך שהלקוחות מקבלים. כל טקסט, צבע, תמונה וכפתור ניתן לעריכה.
    </p>
  </section>

  <section class="biz-section" data-bizuply-block="services">
    <p class="biz-section-kicker">שירותים</p>
    <h2 class="biz-section-title">השירותים שלנו</h2>
    <div class="biz-grid-3">
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">שירות ראשון</h3>
        <p class="biz-card-text">תיאור קצר של השירות ומה הלקוח מקבל.</p>
        <div class="biz-price-row">
          <span>60 דקות</span>
          <span class="biz-price">₪350</span>
        </div>
      </article>

      <article class="biz-card">
        <div class="biz-card-icon">✓</div>
        <h3 class="biz-card-title">שירות שני</h3>
        <p class="biz-card-text">תיאור קצר של השירות ומה הלקוח מקבל.</p>
        <div class="biz-price-row">
          <span>90 דקות</span>
          <span class="biz-price">₪550</span>
        </div>
      </article>

      <article class="biz-card">
        <div class="biz-card-icon">★</div>
        <h3 class="biz-card-title">שירות שלישי</h3>
        <p class="biz-card-text">תיאור קצר של השירות ומה הלקוח מקבל.</p>
        <div class="biz-price-row">
          <span>ייעוץ</span>
          <span class="biz-price">₪150</span>
        </div>
      </article>
    </div>
  </section>

  <section class="biz-section" data-bizuply-block="booking">
    <div class="biz-dark-section">
      <div class="biz-split">
        <div>
          <p class="biz-pill">מחובר ליומן</p>
          <h2 class="biz-section-title" style="color:#fff;text-align:right;">קובעים תור אונליין</h2>
          <p class="biz-card-text" style="color:rgba(255,255,255,0.72);font-size:18px;">
            הלקוח בוחר שירות, תאריך ושעה פנויה — ישירות מהאתר.
          </p>
        </div>

        <div class="biz-booking-box">
          <div class="biz-time-grid">
            <div class="biz-time">09:00</div>
            <div class="biz-time">10:30</div>
            <div class="biz-time">12:00</div>
            <div class="biz-time">14:00</div>
            <div class="biz-time">16:30</div>
            <div class="biz-time">18:00</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
`;
