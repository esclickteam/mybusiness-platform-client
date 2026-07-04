export const lexoraEditorCss = `
[data-template-id="lexora"],
[data-template-id="lexora"] * {
  box-sizing: border-box;
}

[data-template-id="lexora"] {
  direction: rtl;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: visible;
  background: #ede7dc;
  color: #18231f;
  font-family: Assistant, Heebo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --lex-hero-shift: 0px;
  --lex-card-shift: 0px;
  --lex-image-shift: 0px;
}

[data-template-id="lexora"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="lexora"] img {
  display: block;
  max-width: 100%;
}

@keyframes lexHeroZoom {
  from {
    transform: translate3d(0, 0, 0) scale(1.13);
    filter: saturate(.88) contrast(.94);
  }
  to {
    transform: translate3d(0, var(--lex-hero-shift), 0) scale(1.04);
    filter: saturate(1.06) contrast(1.03);
  }
}

@keyframes lexFloat {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
  50% { transform: translate3d(0, -18px, 0) rotate(1deg); }
}

@keyframes lexFloatReverse {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(1deg); }
  50% { transform: translate3d(0, 16px, 0) rotate(-1deg); }
}

@keyframes lexShine {
  0% { transform: translateX(140%) rotate(18deg); }
  100% { transform: translateX(-180%) rotate(18deg); }
}

.lex-page {
  position: relative;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(circle at 14% 8%, rgba(182,144,93,.14), transparent 28%),
    radial-gradient(circle at 86% 12%, rgba(30,42,37,.12), transparent 24%),
    linear-gradient(180deg, #ede7dc 0%, #fbf7ee 45%, #ede7dc 100%);
}

.lex-container {
  width: min(1280px, calc(100% - 48px));
  margin-inline: auto;
}

[data-lex-reveal="true"] {
  opacity: 0;
  transform: translate3d(0, 46px, 0) scale(.985);
  filter: blur(12px);
  transition:
    opacity 950ms cubic-bezier(.16,1,.3,1),
    transform 950ms cubic-bezier(.16,1,.3,1),
    filter 950ms cubic-bezier(.16,1,.3,1);
}

[data-lex-reveal="true"].is-visible {
  opacity: 1;
  transform: translate3d(0,0,0) scale(1);
  filter: blur(0);
}

.lex-header {
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: 40;
  padding: 18px 28px 0;
}

.lex-header-inner {
  width: min(1280px, 100%);
  min-height: 72px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 12px 18px 12px 26px;
  border: 1px solid rgba(255,255,255,.46);
  border-radius: 999px;
  background: rgba(251,247,238,.86);
  box-shadow: 0 18px 70px rgba(24,35,31,.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.lex-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.lex-brand-name {
  color: #18231f;
  font-size: 22px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -.05em;
}

.lex-brand-mark {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #18231f;
  color: #d8bb82;
  font-size: 15px;
  font-weight: 950;
  box-shadow: 0 14px 34px rgba(24,35,31,.24);
}

.lex-nav {
  display: flex;
  align-items: center;
  gap: 34px;
  color: rgba(24,35,31,.74);
  font-size: 14px;
  font-weight: 850;
}

.lex-nav a,
.lex-footer nav a {
  position: relative;
  transition: color 280ms ease;
}

.lex-nav a::after,
.lex-footer nav a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -8px;
  width: 0;
  height: 2px;
  border-radius: 99px;
  background: #a77d48;
  transition: width 280ms ease;
}

.lex-nav a:hover,
.lex-nav a[data-active="true"],
.lex-footer nav a:hover,
.lex-footer nav a[data-active="true"] {
  color: #a77d48;
}

.lex-nav a:hover::after,
.lex-nav a[data-active="true"]::after,
.lex-footer nav a:hover::after,
.lex-footer nav a[data-active="true"]::after {
  width: 100%;
}

.lex-header-cta,
.lex-btn-primary,
.lex-btn-secondary {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: max-content;
  overflow: hidden;
  border-radius: 999px;
  font-weight: 950;
  transition: transform 300ms ease, background 300ms ease, color 300ms ease;
}

.lex-header-cta {
  min-height: 47px;
  padding: 0 22px;
  background: #d8bb82;
  color: #18231f;
  font-size: 14px;
  box-shadow: 0 16px 45px rgba(216,187,130,.22);
}

.lex-header-cta::before,
.lex-btn-primary::before {
  content: "";
  position: absolute;
  inset-block: -40%;
  width: 38px;
  background: rgba(255,255,255,.52);
  filter: blur(7px);
  animation: lexShine 4.6s ease-in-out infinite;
}

.lex-header-cta:hover,
.lex-btn-primary:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-hero {
  position: relative;
  min-height: 1040px;
  overflow: hidden;
  padding: 150px 0 80px;
}

.lex-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.lex-hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: lexHeroZoom 1800ms cubic-bezier(.16,1,.3,1) both;
}

.lex-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(24,35,31,.86) 0%, rgba(24,35,31,.56) 42%, rgba(24,35,31,.08) 100%),
    linear-gradient(180deg, rgba(24,35,31,.3) 0%, rgba(24,35,31,.06) 55%, #ede7dc 100%);
}

.lex-hero-noise {
  position: absolute;
  inset: 0;
  opacity: .18;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.28) 1px, transparent 0);
  background-size: 18px 18px;
  mix-blend-mode: overlay;
}

.lex-hero-grid {
  position: relative;
  z-index: 3;
  min-height: 745px;
  display: grid;
  grid-template-columns: 1fr .82fr;
  gap: 76px;
  align-items: center;
}

.lex-hero-content {
  max-width: 810px;
}

.lex-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 17px;
  border: 1px solid rgba(255,255,255,.32);
  border-radius: 999px;
  background: rgba(255,255,255,.14);
  color: #ffffff;
  font-size: 13px;
  font-weight: 950;
  backdrop-filter: blur(16px);
}

.lex-hero-kicker i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #d8bb82;
  box-shadow: 0 0 0 7px rgba(216,187,130,.16);
}

.lex-hero-title {
  margin: 28px 0 0;
  display: grid;
  color: #ffffff;
  font-size: clamp(58px, 8.5vw, 124px);
  line-height: .82;
  letter-spacing: -.085em;
  font-weight: 950;
}

.lex-hero-title span {
  display: block;
}

.lex-hero-title span:nth-child(2) {
  padding-inline-start: 52px;
}

.lex-hero-title span:nth-child(3) {
  color: #d8bb82;
}

.lex-hero-text {
  max-width: 680px;
  margin: 34px 0 0;
  color: rgba(255,255,255,.88);
  font-size: 20px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 40px;
}

.lex-btn-primary,
.lex-btn-secondary {
  min-height: 58px;
  padding: 0 29px;
  font-size: 16px;
}

.lex-btn-primary {
  background: #d8bb82;
  color: #18231f;
  box-shadow: 0 22px 70px rgba(216,187,130,.24);
}

.lex-btn-secondary {
  border: 1px solid rgba(255,255,255,.42);
  background: rgba(255,255,255,.12);
  color: #ffffff;
  backdrop-filter: blur(14px);
}

.lex-btn-secondary:hover {
  transform: translateY(-4px);
  background: #ffffff;
  color: #18231f;
}

.lex-hero-side {
  position: relative;
  min-height: 620px;
}

.lex-hero-portrait {
  position: absolute;
  left: 40px;
  top: 24px;
  width: 390px;
  height: 520px;
  overflow: hidden;
  border-radius: 46px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,.32);
  background: rgba(255,255,255,.16);
  box-shadow: 0 35px 100px rgba(0,0,0,.24);
  backdrop-filter: blur(18px);
  animation: lexFloat 8s ease-in-out infinite;
}

.lex-hero-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 36px;
  transform: translate3d(0, var(--lex-image-shift), 0) scale(1.08);
}

.lex-hero-portrait div {
  position: absolute;
  right: 28px;
  bottom: 28px;
  border-radius: 22px;
  background: rgba(255,255,255,.86);
  color: #18231f;
  padding: 14px 16px;
  backdrop-filter: blur(14px);
}

.lex-hero-portrait strong,
.lex-hero-portrait span {
  display: block;
}

.lex-hero-portrait strong {
  font-size: 15px;
  font-weight: 950;
}

.lex-hero-portrait span {
  margin-top: 4px;
  color: #647068;
  font-size: 12px;
  font-weight: 850;
}

.lex-hero-stats-card {
  position: absolute;
  right: 0;
  bottom: 58px;
  width: 370px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-radius: 36px;
  border: 1px solid rgba(255,255,255,.42);
  background: rgba(251,247,238,.92);
  color: #18231f;
  box-shadow: 0 28px 90px rgba(0,0,0,.2);
  backdrop-filter: blur(26px);
  transform: translate3d(0, var(--lex-card-shift), 0);
}

.lex-hero-stats-card div {
  padding: 24px 18px;
  border-left: 1px solid rgba(24,35,31,.1);
}

.lex-hero-stats-card div:last-child {
  border-left: 0;
}

.lex-hero-stats-card strong {
  display: block;
  color: #a77d48;
  font-size: 31px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -.05em;
}

.lex-hero-stats-card span {
  display: block;
  margin-top: 9px;
  color: #5c6861;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 850;
}

.lex-scroll-label {
  position: absolute;
  right: 48px;
  bottom: 88px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,.78);
  font-size: 13px;
  font-weight: 850;
  writing-mode: vertical-rl;
}

.lex-scroll-label i {
  width: 1px;
  height: 70px;
  background: linear-gradient(180deg, #d8bb82, transparent);
}

.lex-intro-section,
.lex-section {
  padding: 120px 0;
}

.lex-intro-grid,
.lex-section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
}

.lex-eyebrow,
.lex-eyebrow-light {
  color: #a77d48;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .16em;
}

.lex-eyebrow-light {
  color: #d8bb82;
}

.lex-section-title {
  max-width: 820px;
  margin: 16px 0 0;
  color: #18231f;
  font-size: clamp(42px, 5.1vw, 70px);
  line-height: .96;
  letter-spacing: -.065em;
  font-weight: 950;
}

.lex-section-text {
  max-width: 570px;
  margin: 0;
  color: #59645e;
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.lex-services-section {
  background:
    radial-gradient(circle at 15% 10%, rgba(216,187,130,.13), transparent 28%),
    #18231f;
  color: #ffffff;
}

.lex-services-section .lex-section-title,
.lex-services-section .lex-section-text {
  color: #ffffff;
}

.lex-services-section .lex-section-text {
  color: rgba(255,255,255,.72);
}

.lex-services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-top: 56px;
}

.lex-service-card {
  min-height: 356px;
}

.lex-service-link {
  height: 100%;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  overflow: hidden;
  border-radius: 38px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.075);
  box-shadow: 0 24px 80px rgba(0,0,0,.2);
  backdrop-filter: blur(12px);
  transition: transform 500ms cubic-bezier(.16,1,.3,1), background 500ms ease;
}

.lex-service-link:hover {
  transform: translateY(-10px);
  background: rgba(255,255,255,.12);
}

.lex-service-content {
  padding: 30px;
}

.lex-service-content span {
  color: #d8bb82;
  font-size: 13px;
  font-weight: 950;
}

.lex-service-content h3 {
  margin: 16px 0 0;
  color: #ffffff;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -.055em;
  font-weight: 950;
}

.lex-service-content p {
  margin: 16px 0 0;
  color: rgba(255,255,255,.75);
  font-size: 15px;
  line-height: 1.75;
  font-weight: 740;
}

.lex-service-content strong {
  display: block;
  margin-top: 22px;
  color: #d8bb82;
  font-size: 15px;
  font-weight: 950;
}

.lex-service-content em {
  display: inline-flex;
  margin-top: 26px;
  color: #ffffff;
  font-style: normal;
  font-size: 14px;
  font-weight: 950;
}

.lex-service-image {
  overflow: hidden;
}

.lex-service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms cubic-bezier(.16,1,.3,1);
}

.lex-service-link:hover .lex-service-image img {
  transform: scale(1.1);
}

.lex-cases-list {
  display: grid;
  gap: 24px;
  margin-top: 56px;
}

.lex-case-card {
  display: grid;
  grid-template-columns: .92fr 1.08fr;
  overflow: hidden;
  border-radius: 42px;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(24,35,31,.08);
  box-shadow: 0 24px 80px rgba(24,35,31,.1);
}

.lex-case-image {
  min-height: 420px;
  overflow: hidden;
}

.lex-case-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms cubic-bezier(.16,1,.3,1);
}

.lex-case-card:hover .lex-case-image img {
  transform: scale(1.08);
}

.lex-case-content {
  padding: 42px;
}

.lex-case-meta {
  display: flex;
  gap: 12px;
  color: #a77d48;
  font-size: 13px;
  font-weight: 950;
}

.lex-case-content h3 {
  max-width: 620px;
  margin: 18px 0 0;
  color: #18231f;
  font-size: clamp(32px, 4vw, 54px);
  line-height: .98;
  letter-spacing: -.065em;
  font-weight: 950;
}

.lex-case-content p {
  max-width: 620px;
  margin: 22px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-case-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 30px;
}

.lex-case-details div {
  border-radius: 22px;
  background: #f3eee4;
  padding: 18px;
}

.lex-case-details span {
  display: block;
  color: #7e867f;
  font-size: 12px;
  font-weight: 850;
}

.lex-case-details strong {
  display: block;
  margin-top: 7px;
  color: #18231f;
  font-size: 16px;
  font-weight: 950;
}

.lex-case-content a {
  display: inline-flex;
  margin-top: 30px;
  border-radius: 999px;
  background: #d8bb82;
  color: #18231f;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 950;
  transition: transform 280ms ease, background 280ms ease;
}

.lex-case-content a:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-process-grid {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 72px;
  align-items: flex-start;
}

.lex-sticky-copy {
  position: sticky;
  top: 130px;
}

.lex-sticky-copy .lex-section-text {
  margin-top: 26px;
}

.lex-steps {
  display: grid;
  gap: 20px;
}

.lex-step {
  display: grid;
  grid-template-columns: 115px 1fr;
  gap: 28px;
  align-items: start;
  padding: 34px;
  border-radius: 36px;
  background: rgba(255,255,255,.84);
  border: 1px solid rgba(24,35,31,.07);
  box-shadow: 0 22px 70px rgba(24,35,31,.09);
  backdrop-filter: blur(14px);
  transition: transform 380ms ease, box-shadow 380ms ease;
}

.lex-step:hover {
  transform: translateY(-7px);
  box-shadow: 0 30px 90px rgba(24,35,31,.15);
}

.lex-step > span {
  color: #a77d48;
  font-size: 50px;
  line-height: .9;
  letter-spacing: -.08em;
  font-weight: 950;
}

.lex-step h3 {
  margin: 0;
  color: #18231f;
  font-size: 29px;
  line-height: 1.1;
  letter-spacing: -.05em;
  font-weight: 950;
}

.lex-step p {
  margin: 13px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.85;
  font-weight: 750;
}

.lex-about-strip {
  padding: 120px 0;
  background: #fbf7ee;
}

.lex-about-grid {
  display: grid;
  grid-template-columns: .96fr 1.04fr;
  gap: 70px;
  align-items: center;
}

.lex-about-image {
  height: 560px;
  overflow: hidden;
  border-radius: 46px;
  box-shadow: 0 30px 90px rgba(24,35,31,.16);
  animation: lexFloat 8.2s ease-in-out infinite;
}

.lex-about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lex-about-copy h2 {
  margin: 18px 0 0;
  color: #18231f;
  font-size: clamp(42px, 5vw, 68px);
  line-height: .98;
  letter-spacing: -.065em;
  font-weight: 950;
}

.lex-about-copy p {
  max-width: 560px;
  margin: 26px 0 0;
  color: #59645e;
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.lex-about-copy a {
  display: inline-flex;
  margin-top: 30px;
  border-radius: 999px;
  background: #d8bb82;
  color: #18231f;
  padding: 15px 24px;
  font-size: 14px;
  font-weight: 950;
  transition: transform 280ms ease, background 280ms ease;
}

.lex-about-copy a:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-consultation {
  padding: 120px 0;
}

.lex-consultation-card {
  display: grid;
  grid-template-columns: 1fr .92fr;
  gap: 54px;
  align-items: center;
  overflow: hidden;
  border-radius: 48px;
  padding: 52px;
  background:
    radial-gradient(circle at 16% 13%, rgba(216,187,130,.2), transparent 30%),
    #18231f;
  color: #ffffff;
  box-shadow: 0 34px 110px rgba(24,35,31,.28);
}

.lex-consultation-copy h2 {
  max-width: 610px;
  margin: 18px 0 0;
  color: #ffffff;
  font-size: clamp(44px, 5.2vw, 72px);
  line-height: .96;
  letter-spacing: -.07em;
  font-weight: 950;
}

.lex-consultation-copy p {
  max-width: 560px;
  margin: 26px 0 0;
  color: rgba(255,255,255,.78);
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.lex-form {
  padding: 31px;
  border-radius: 36px;
  background: #fbf7ee;
  color: #18231f;
  box-shadow: 0 24px 80px rgba(0,0,0,.18);
}

.lex-form label {
  display: block;
  margin-bottom: 16px;
}

.lex-form label span {
  display: block;
  margin-bottom: 8px;
  color: #18231f;
  font-size: 14px;
  font-weight: 950;
}

.lex-form input,
.lex-form textarea {
  width: 100%;
  border: 1px solid #ded6ca;
  outline: none;
  border-radius: 21px;
  background: #ffffff;
  color: #18231f;
  padding: 15px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 750;
  transition: border-color 280ms ease, box-shadow 280ms ease, transform 280ms ease;
}

.lex-form textarea {
  min-height: 130px;
  resize: vertical;
}

.lex-form input:focus,
.lex-form textarea:focus {
  border-color: #a77d48;
  box-shadow: 0 0 0 5px rgba(167,125,72,.1);
  transform: translateY(-2px);
}

.lex-form button {
  width: 100%;
  min-height: 58px;
  border: 0;
  border-radius: 999px;
  background: #d8bb82;
  color: #18231f;
  font-family: inherit;
  font-size: 16px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 300ms ease, background 300ms ease;
}

.lex-form button:hover {
  transform: translateY(-4px);
  background: #ffffff;
}

.lex-inner-page {
  padding-top: 108px;
}

.lex-page-hero {
  padding: 96px 0 104px;
  background:
    radial-gradient(circle at 16% 16%, rgba(167,125,72,.16), transparent 28%),
    linear-gradient(180deg, #fbf7ee 0%, #ede7dc 100%);
}

.lex-page-hero-soft {
  background:
    radial-gradient(circle at 80% 12%, rgba(24,35,31,.12), transparent 28%),
    linear-gradient(180deg, #ede7dc 0%, #fbf7ee 100%);
}

.lex-page-hero-grid {
  display: grid;
  grid-template-columns: .95fr 1.05fr;
  gap: 64px;
  align-items: center;
}

.lex-page-hero h1 {
  max-width: 790px;
  margin: 18px 0 0;
  color: #18231f;
  font-size: clamp(52px, 6.2vw, 92px);
  line-height: .88;
  letter-spacing: -.08em;
  font-weight: 950;
}

.lex-page-hero p {
  max-width: 590px;
  margin: 30px 0 0;
  color: #59645e;
  font-size: 18px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-page-hero-image {
  height: 540px;
  overflow: hidden;
  border-radius: 46px;
  box-shadow: 0 30px 90px rgba(24,35,31,.16);
}

.lex-page-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lex-faq-section {
  background: #fbf7ee;
}

.lex-center-head {
  max-width: 820px;
  margin: 0 auto 56px;
  text-align: center;
}

.lex-center-head .lex-section-title {
  margin-inline: auto;
}

.lex-faq-list {
  display: grid;
  gap: 18px;
}

.lex-faq-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  padding: 28px;
  border-radius: 32px;
  background: #ffffff;
  border: 1px solid rgba(24,35,31,.07);
  box-shadow: 0 22px 70px rgba(24,35,31,.08);
}

.lex-faq-item > span {
  color: #a77d48;
  font-size: 34px;
  line-height: 1;
  font-weight: 950;
}

.lex-faq-item h3 {
  margin: 0;
  color: #18231f;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 950;
}

.lex-faq-item p {
  margin: 12px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.85;
  font-weight: 750;
}

.lex-footer {
  padding: 38px 0;
  border-top: 1px solid rgba(24,35,31,.09);
  background: #ede7dc;
}

.lex-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.lex-footer strong {
  display: block;
  color: #18231f;
  font-size: 22px;
  line-height: 1;
  font-weight: 950;
}

.lex-footer p {
  margin: 8px 0 0;
  color: #6b746e;
  font-size: 14px;
  font-weight: 750;
}

.lex-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: #4f5b54;
  font-size: 14px;
  font-weight: 850;
}

@media (max-width: 1120px) {
  .lex-nav {
    display: none;
  }

  .lex-hero {
    min-height: auto;
  }

  .lex-hero-grid,
  .lex-intro-grid,
  .lex-section-head,
  .lex-process-grid,
  .lex-about-grid,
  .lex-consultation-card,
  .lex-page-hero-grid,
  .lex-case-card {
    grid-template-columns: 1fr;
  }

  .lex-hero-side {
    display: none;
  }

  .lex-services-grid {
    grid-template-columns: 1fr;
  }

  .lex-service-link {
    grid-template-columns: 1fr;
  }

  .lex-service-image {
    height: 280px;
  }

  .lex-scroll-label {
    display: none;
  }
}

@media (max-width: 760px) {
  .lex-container {
    width: min(100% - 28px, 1280px);
  }

  .lex-header {
    padding: 12px 12px 0;
  }

  .lex-header-inner {
    min-height: 62px;
    padding: 9px 10px 9px 14px;
  }

  .lex-brand-mark {
    width: 38px;
    height: 38px;
    font-size: 13px;
  }

  .lex-brand-name {
    font-size: 18px;
  }

  .lex-header-cta {
    min-height: 42px;
    padding: 0 15px;
    font-size: 12px;
  }

  .lex-hero {
    padding-top: 116px;
    padding-bottom: 58px;
  }

  .lex-hero-grid {
    min-height: auto;
  }

  .lex-hero-title {
    font-size: clamp(48px, 16vw, 76px);
    letter-spacing: -.075em;
  }

  .lex-hero-title span:nth-child(2) {
    padding-inline-start: 28px;
  }

  .lex-hero-text {
    font-size: 17px;
    line-height: 1.8;
  }

  .lex-hero-actions {
    flex-direction: column;
  }

  .lex-btn-primary,
  .lex-btn-secondary {
    width: 100%;
  }

  .lex-intro-section,
  .lex-section,
  .lex-about-strip,
  .lex-consultation {
    padding: 76px 0;
  }

  .lex-section-title,
  .lex-about-copy h2,
  .lex-consultation-copy h2 {
    font-size: clamp(36px, 12vw, 50px);
  }

  .lex-section-text,
  .lex-about-copy p,
  .lex-consultation-copy p {
    font-size: 16px;
  }

  .lex-service-link {
    border-radius: 30px;
  }

  .lex-case-content {
    padding: 26px;
  }

  .lex-case-image {
    min-height: 300px;
  }

  .lex-case-details {
    grid-template-columns: 1fr;
  }

  .lex-step {
    grid-template-columns: 1fr;
    padding: 26px;
  }

  .lex-about-image {
    height: 380px;
    border-radius: 32px;
  }

  .lex-consultation-card {
    padding: 24px;
    border-radius: 32px;
  }

  .lex-form {
    padding: 22px;
    border-radius: 28px;
  }

  .lex-inner-page {
    padding-top: 84px;
  }

  .lex-page-hero {
    padding: 76px 0;
  }

  .lex-page-hero h1 {
    font-size: clamp(42px, 14vw, 62px);
  }

  .lex-page-hero p {
    font-size: 16px;
  }

  .lex-page-hero-image {
    height: 360px;
    border-radius: 32px;
  }

  .lex-faq-item {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .lex-footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;