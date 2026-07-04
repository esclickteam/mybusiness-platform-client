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
  background: #eee9dd;
  color: #1c2420;
  font-family: Assistant, Heebo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --lex-scroll-y: 0px;
  --lex-image-y: 0px;
}

[data-template-id="lexora"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="lexora"] button {
  font-family: inherit;
}

[data-template-id="lexora"] img {
  display: block;
  max-width: 100%;
}

@keyframes lexMarquee {
  from { transform: translate3d(0,0,0); }
  to { transform: translate3d(50%,0,0); }
}

@keyframes lexFloat {
  0%, 100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(0,-16px,0); }
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
    radial-gradient(circle at 8% 12%, rgba(185,155,107,.16), transparent 25%),
    linear-gradient(180deg, #eee9dd 0%, #fbf7ef 42%, #eee9dd 100%);
}

.lex-container {
  width: min(1320px, calc(100% - 48px));
  margin-inline: auto;
}

[data-lex-reveal="true"] {
  opacity: 0;
  transform: translate3d(0, 42px, 0);
  filter: blur(10px);
  transition:
    opacity 900ms cubic-bezier(.16,1,.3,1),
    transform 900ms cubic-bezier(.16,1,.3,1),
    filter 900ms cubic-bezier(.16,1,.3,1);
}

[data-lex-reveal="true"].is-visible {
  opacity: 1;
  transform: translate3d(0,0,0);
  filter: blur(0);
}

.lex-header {
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: 40;
  padding: 22px 0 0;
}

.lex-header-inner {
  min-height: 76px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
  padding: 0 24px;
  border: 1px solid rgba(28,36,32,.12);
  border-radius: 999px;
  background: rgba(251,247,239,.84);
  box-shadow: 0 18px 70px rgba(28,36,32,.1);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
}

.lex-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0;
  cursor: pointer;
  text-align: inherit;
}

.lex-brand-mark {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #1c2420;
  color: #d8c08b;
  font-size: 15px;
  font-weight: 950;
}

.lex-brand-name {
  color: #1c2420;
  font-size: 22px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.lex-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
  color: rgba(28,36,32,.72);
  font-size: 14px;
  font-weight: 850;
}

.lex-nav a,
.lex-nav button,
.lex-footer nav a,
.lex-footer nav button {
  position: relative;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  cursor: pointer;
  text-align: inherit;
  transition: color 280ms ease;
}

.lex-nav a::after,
.lex-nav button::after,
.lex-footer nav a::after,
.lex-footer nav button::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -8px;
  width: 0;
  height: 2px;
  border-radius: 99px;
  background: #9c7a45;
  transition: width 280ms ease;
}

.lex-nav a:hover,
.lex-nav button:hover,
.lex-nav a[data-active="true"],
.lex-nav button[data-active="true"],
.lex-footer nav a:hover,
.lex-footer nav button:hover,
.lex-footer nav a[data-active="true"],
.lex-footer nav button[data-active="true"] {
  color: #9c7a45;
}

.lex-nav a:hover::after,
.lex-nav button:hover::after,
.lex-nav a[data-active="true"]::after,
.lex-nav button[data-active="true"]::after,
.lex-footer nav a:hover::after,
.lex-footer nav button:hover::after,
.lex-footer nav a[data-active="true"]::after,
.lex-footer nav button[data-active="true"]::after {
  width: 100%;
}

.lex-header-cta,
.lex-btn-primary,
.lex-btn-secondary {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: max-content;
  border-radius: 999px;
  border: 0;
  font-weight: 950;
  cursor: pointer;
  transition: transform 300ms ease, background 300ms ease, color 300ms ease;
}

.lex-header-cta {
  min-height: 48px;
  padding: 0 22px;
  background: #d8c08b;
  color: #1c2420;
  font-size: 14px;
}

.lex-header-cta::before,
.lex-btn-primary::before {
  content: "";
  position: absolute;
  inset-block: -40%;
  width: 38px;
  background: rgba(255,255,255,.55);
  filter: blur(7px);
  animation: lexShine 4.8s ease-in-out infinite;
}

.lex-header-cta:hover,
.lex-btn-primary:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-hero {
  position: relative;
  padding: 148px 0 88px;
}

.lex-hero-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 26px;
}

.lex-hero-kicker,
.lex-page-kicker,
.lex-eyebrow,
.lex-eyebrow-light {
  color: #9c7a45;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .18em;
}

.lex-eyebrow-light {
  color: #d8c08b;
}

.lex-hero-title {
  max-width: 1190px;
  margin: 0;
  color: #1c2420;
  font-size: clamp(70px, 10.8vw, 176px);
  line-height: .82;
  letter-spacing: -.09em;
  font-weight: 950;
}

.lex-hero-summary {
  display: grid;
  grid-template-columns: minmax(260px, 600px) auto;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  margin-top: 4px;
}

.lex-hero-summary p {
  margin: 0;
  color: #59645e;
  font-size: 18px;
  line-height: 1.85;
  font-weight: 760;
}

.lex-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.lex-btn-primary,
.lex-btn-secondary {
  min-height: 58px;
  padding: 0 28px;
  font-size: 15px;
}

.lex-btn-primary {
  background: #d8c08b;
  color: #1c2420;
  box-shadow: 0 22px 70px rgba(216,192,139,.24);
}

.lex-btn-secondary {
  border: 1px solid rgba(28,36,32,.18);
  background: rgba(255,255,255,.38);
  color: #1c2420;
}

.lex-btn-secondary:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-hero-image-wrap {
  position: relative;
  height: 620px;
  overflow: hidden;
  border-radius: 44px;
  margin-top: 54px;
  box-shadow: 0 28px 100px rgba(28,36,32,.16);
}

.lex-hero-image {
  width: 100%;
  height: 112%;
  object-fit: cover;
  transform: translate3d(0, var(--lex-image-y), 0) scale(1.04);
}

.lex-hero-image-overlay {
  position: absolute;
  left: 32px;
  bottom: 32px;
  width: min(420px, calc(100% - 64px));
  border-radius: 30px;
  padding: 26px;
  background: rgba(251,247,239,.86);
  color: #1c2420;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(28,36,32,.18);
}

.lex-hero-image-overlay span {
  display: block;
  color: #9c7a45;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .2em;
}

.lex-hero-image-overlay strong {
  display: block;
  margin-top: 12px;
  font-size: 27px;
  line-height: 1.08;
  letter-spacing: -.04em;
  font-weight: 950;
}

.lex-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid rgba(28,36,32,.14);
  border-bottom: 1px solid rgba(28,36,32,.14);
  margin-top: 54px;
}

.lex-stat {
  padding: 34px 28px;
  border-left: 1px solid rgba(28,36,32,.14);
}

.lex-stat:last-child {
  border-left: 0;
}

.lex-stat strong {
  display: block;
  color: #1c2420;
  font-size: clamp(54px, 6.4vw, 92px);
  line-height: .9;
  letter-spacing: -.08em;
  font-weight: 950;
}

.lex-stat span {
  display: block;
  margin-top: 12px;
  color: #59645e;
  font-size: 15px;
  font-weight: 850;
}

.lex-intro-section,
.lex-section,
.lex-team-section {
  padding: 112px 0;
}

.lex-intro-grid,
.lex-section-head {
  display: grid;
  grid-template-columns: 1fr minmax(260px, 520px);
  gap: 62px;
  align-items: end;
}

.lex-section-title {
  max-width: 780px;
  margin: 16px 0 0;
  color: #1c2420;
  font-size: clamp(42px, 5.3vw, 76px);
  line-height: .94;
  letter-spacing: -.07em;
  font-weight: 950;
}

.lex-section-text {
  margin: 0;
  color: #59645e;
  font-size: 17px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-intro-text-card {
  border-radius: 32px;
  padding: 32px;
  background: rgba(255,255,255,.52);
  border: 1px solid rgba(28,36,32,.08);
  box-shadow: 0 20px 70px rgba(28,36,32,.08);
}

.lex-intro-text-card p {
  margin: 0;
  color: #59645e;
  font-size: 17px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-intro-text-card a,
.lex-intro-text-card button {
  display: inline-flex;
  margin-top: 24px;
  border: 0;
  background: transparent;
  color: #9c7a45;
  padding: 0;
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
}

.lex-image-band {
  padding: 0 0 112px;
}

.lex-band-image {
  height: 560px;
  overflow: hidden;
  border-radius: 44px;
  box-shadow: 0 28px 100px rgba(28,36,32,.14);
}

.lex-band-image img {
  width: 100%;
  height: 112%;
  object-fit: cover;
  transform: translate3d(0, var(--lex-image-y), 0) scale(1.04);
}

.lex-services-section {
  background: #1c2420;
  color: #ffffff;
}

.lex-services-section .lex-section-title,
.lex-services-section .lex-section-text {
  color: #ffffff;
}

.lex-services-section .lex-section-text {
  color: rgba(255,255,255,.72);
}

.lex-services-list {
  margin-top: 58px;
  border-top: 1px solid rgba(255,255,255,.14);
}

.lex-service-row {
  border-bottom: 1px solid rgba(255,255,255,.14);
}

.lex-service-row-link {
  display: grid;
  grid-template-columns: 90px 1fr 180px 90px;
  gap: 28px;
  align-items: center;
  width: 100%;
  min-height: 170px;
  padding: 28px 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: inherit;
  transition: transform 320ms ease, background 320ms ease;
}

.lex-service-row-link:hover {
  transform: translateX(-8px);
}

.lex-service-number {
  color: #d8c08b;
  font-size: 18px;
  font-weight: 950;
}

.lex-service-main h3 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1;
  letter-spacing: -.055em;
  font-weight: 950;
}

.lex-service-main p {
  max-width: 680px;
  margin: 14px 0 0;
  color: rgba(255,255,255,.7);
  font-size: 15px;
  line-height: 1.75;
  font-weight: 740;
}

.lex-service-row strong {
  color: #d8c08b;
  font-size: 15px;
  font-weight: 950;
}

.lex-service-row em {
  justify-self: end;
  font-style: normal;
  color: #ffffff;
  font-size: 14px;
  font-weight: 950;
}

.lex-cases-list {
  display: grid;
  gap: 28px;
  margin-top: 58px;
}

.lex-case-card {
  display: grid;
  grid-template-columns: .95fr 1.05fr;
  overflow: hidden;
  border-radius: 44px;
  background: rgba(255,255,255,.64);
  border: 1px solid rgba(28,36,32,.08);
  box-shadow: 0 24px 90px rgba(28,36,32,.1);
}

.lex-case-image {
  min-height: 480px;
  overflow: hidden;
}

.lex-case-image img {
  width: 100%;
  height: 112%;
  object-fit: cover;
  transition: transform 900ms cubic-bezier(.16,1,.3,1);
}

.lex-case-card:hover .lex-case-image img {
  transform: scale(1.08);
}

.lex-case-content {
  padding: 46px;
}

.lex-case-top {
  display: flex;
  gap: 12px;
  color: #9c7a45;
  font-size: 13px;
  font-weight: 950;
}

.lex-case-content h3 {
  max-width: 620px;
  margin: 18px 0 0;
  color: #1c2420;
  font-size: clamp(34px, 4.4vw, 64px);
  line-height: .92;
  letter-spacing: -.07em;
  font-weight: 950;
}

.lex-case-content p {
  max-width: 620px;
  margin: 24px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-case-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 34px;
}

.lex-case-info div {
  border-radius: 22px;
  padding: 18px;
  background: #eee9dd;
}

.lex-case-info span {
  display: block;
  color: #7a837d;
  font-size: 12px;
  font-weight: 850;
}

.lex-case-info strong {
  display: block;
  margin-top: 7px;
  color: #1c2420;
  font-size: 15px;
  font-weight: 950;
}

.lex-case-content a,
.lex-case-content button {
  display: inline-flex;
  margin-top: 32px;
  border: 0;
  border-radius: 999px;
  background: #d8c08b;
  color: #1c2420;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 280ms ease, background 280ms ease;
}

.lex-case-content a:hover,
.lex-case-content button:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-split {
  display: grid;
  grid-template-columns: .88fr 1.12fr;
  gap: 74px;
  align-items: start;
}

.lex-sticky-copy {
  position: sticky;
  top: 120px;
}

.lex-sticky-copy .lex-section-text {
  margin-top: 24px;
}

.lex-process-list {
  display: grid;
  border-top: 1px solid rgba(28,36,32,.14);
}

.lex-process-row {
  display: grid;
  grid-template-columns: 105px 1fr;
  gap: 28px;
  padding: 34px 0;
  border-bottom: 1px solid rgba(28,36,32,.14);
}

.lex-process-row > span {
  color: #9c7a45;
  font-size: 42px;
  line-height: .95;
  letter-spacing: -.06em;
  font-weight: 950;
}

.lex-process-row h3 {
  margin: 0;
  color: #1c2420;
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -.05em;
  font-weight: 950;
}

.lex-process-row p {
  max-width: 660px;
  margin: 12px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.85;
  font-weight: 760;
}

.lex-about-strip {
  padding: 112px 0;
  background: #fbf7ef;
}

.lex-about-grid {
  display: grid;
  grid-template-columns: .96fr 1.04fr;
  gap: 72px;
  align-items: center;
}

.lex-about-image {
  height: 590px;
  overflow: hidden;
  border-radius: 44px;
  box-shadow: 0 28px 100px rgba(28,36,32,.14);
  animation: lexFloat 8.2s ease-in-out infinite;
}

.lex-about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lex-about-copy h2 {
  margin: 16px 0 0;
  color: #1c2420;
  font-size: clamp(42px, 5.3vw, 76px);
  line-height: .94;
  letter-spacing: -.07em;
  font-weight: 950;
}

.lex-about-copy p {
  max-width: 600px;
  margin: 26px 0 0;
  color: #59645e;
  font-size: 17px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-about-copy a,
.lex-about-copy button {
  display: inline-flex;
  margin-top: 30px;
  border: 0;
  border-radius: 999px;
  background: #d8c08b;
  color: #1c2420;
  padding: 15px 24px;
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 280ms ease, background 280ms ease;
}

.lex-about-copy a:hover,
.lex-about-copy button:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-team-section {
  background: #fbf7ef;
}

.lex-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.lex-team-card {
  overflow: hidden;
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 22px 80px rgba(28,36,32,.1);
}

.lex-team-card img {
  width: 100%;
  height: 390px;
  object-fit: cover;
}

.lex-team-card div {
  padding: 24px;
}

.lex-team-card h3 {
  margin: 0;
  color: #1c2420;
  font-size: 26px;
  letter-spacing: -.04em;
  font-weight: 950;
}

.lex-team-card p {
  margin: 8px 0 0;
  color: #59645e;
  font-size: 14px;
  font-weight: 850;
}

.lex-team-card span {
  display: inline-flex;
  margin-top: 18px;
  color: #9c7a45;
  font-size: 14px;
  font-weight: 950;
}

.lex-faq-section {
  background: #fbf7ef;
}

.lex-center-head {
  max-width: 850px;
  margin: 0 auto 58px;
  text-align: center;
}

.lex-center-head .lex-section-title {
  margin-inline: auto;
}

.lex-faq-list {
  display: grid;
  border-top: 1px solid rgba(28,36,32,.14);
}

.lex-faq-item {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 30px;
  padding: 30px 0;
  border-bottom: 1px solid rgba(28,36,32,.14);
}

.lex-faq-item > span {
  color: #9c7a45;
  font-size: 24px;
  font-weight: 950;
}

.lex-faq-item h3 {
  margin: 0;
  color: #1c2420;
  font-size: 28px;
  letter-spacing: -.045em;
  font-weight: 950;
}

.lex-faq-item p {
  max-width: 820px;
  margin: 12px 0 0;
  color: #59645e;
  font-size: 16px;
  line-height: 1.85;
  font-weight: 760;
}

.lex-consultation {
  padding: 112px 0;
}

.lex-consultation-card {
  display: grid;
  grid-template-columns: 1fr .9fr;
  gap: 64px;
  align-items: start;
  border-radius: 48px;
  padding: 56px;
  background: #1c2420;
  color: #ffffff;
  box-shadow: 0 34px 110px rgba(28,36,32,.28);
}

.lex-consultation-copy h2 {
  max-width: 680px;
  margin: 18px 0 0;
  color: #ffffff;
  font-size: clamp(46px, 5.8vw, 86px);
  line-height: .9;
  letter-spacing: -.08em;
  font-weight: 950;
}

.lex-consultation-copy p {
  max-width: 560px;
  margin: 28px 0 0;
  color: rgba(255,255,255,.74);
  font-size: 17px;
  line-height: 1.9;
  font-weight: 760;
}

.lex-form {
  padding: 32px;
  border-radius: 34px;
  background: #fbf7ef;
  color: #1c2420;
}

.lex-form label {
  display: block;
  margin-bottom: 16px;
}

.lex-form label span {
  display: block;
  margin-bottom: 8px;
  color: #1c2420;
  font-size: 14px;
  font-weight: 950;
}

.lex-form input,
.lex-form textarea {
  width: 100%;
  border: 1px solid #ded6ca;
  outline: none;
  border-radius: 18px;
  background: #ffffff;
  color: #1c2420;
  padding: 15px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 760;
  transition: border-color 260ms ease, box-shadow 260ms ease;
}

.lex-form textarea {
  min-height: 132px;
  resize: vertical;
}

.lex-form input:focus,
.lex-form textarea:focus {
  border-color: #9c7a45;
  box-shadow: 0 0 0 5px rgba(156,122,69,.1);
}

.lex-form button {
  width: 100%;
  min-height: 58px;
  border: 0;
  border-radius: 999px;
  background: #d8c08b;
  color: #1c2420;
  font-family: inherit;
  font-size: 16px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 280ms ease, background 280ms ease;
}

.lex-form button:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.lex-inner-page {
  padding-top: 104px;
}

.lex-page-hero {
  padding: 104px 0 92px;
}

.lex-page-hero h1 {
  max-width: 1120px;
  margin: 18px 0 0;
  color: #1c2420;
  font-size: clamp(60px, 9.2vw, 146px);
  line-height: .82;
  letter-spacing: -.09em;
  font-weight: 950;
}

.lex-page-hero p {
  max-width: 640px;
  margin: 28px 0 0;
  color: #59645e;
  font-size: 18px;
  line-height: 1.85;
  font-weight: 760;
}

.lex-footer {
  padding: 38px 0;
  border-top: 1px solid rgba(28,36,32,.12);
  background: #eee9dd;
}

.lex-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.lex-footer strong {
  display: block;
  color: #1c2420;
  font-size: 22px;
  font-weight: 950;
}

.lex-footer p {
  margin: 8px 0 0;
  color: #59645e;
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

  .lex-hero-summary,
  .lex-intro-grid,
  .lex-section-head,
  .lex-case-card,
  .lex-split,
  .lex-about-grid,
  .lex-consultation-card {
    grid-template-columns: 1fr;
  }

  .lex-service-row-link {
    grid-template-columns: 70px 1fr;
  }

  .lex-service-row strong,
  .lex-service-row em {
    grid-column: 2;
    justify-self: start;
  }

  .lex-team-grid {
    grid-template-columns: 1fr;
  }

  .lex-case-info {
    grid-template-columns: 1fr;
  }

  .lex-hero-image-wrap {
    height: 520px;
  }

  .lex-band-image {
    height: 460px;
  }
}

@media (max-width: 760px) {
  .lex-container {
    width: min(100% - 28px, 1320px);
  }

  .lex-header {
    padding-top: 12px;
  }

  .lex-header-inner {
    min-height: 62px;
    padding: 0 12px;
  }

  .lex-brand-mark {
    width: 38px;
    height: 38px;
  }

  .lex-brand-name {
    font-size: 18px;
  }

  .lex-header-cta {
    min-height: 42px;
    padding: 0 14px;
    font-size: 12px;
  }

  .lex-hero {
    padding-top: 112px;
    padding-bottom: 64px;
  }

  .lex-hero-title,
  .lex-page-hero h1 {
    font-size: clamp(48px, 16vw, 76px);
  }

  .lex-hero-summary p,
  .lex-page-hero p {
    font-size: 16px;
  }

  .lex-hero-actions {
    flex-direction: column;
  }

  .lex-btn-primary,
  .lex-btn-secondary {
    width: 100%;
  }

  .lex-hero-image-wrap {
    height: 360px;
    border-radius: 28px;
  }

  .lex-hero-image-overlay {
    left: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
    border-radius: 22px;
    padding: 18px;
  }

  .lex-hero-image-overlay strong {
    font-size: 21px;
  }

  .lex-stats-row {
    grid-template-columns: 1fr;
  }

  .lex-stat {
    border-left: 0;
    border-bottom: 1px solid rgba(28,36,32,.14);
  }

  .lex-stat:last-child {
    border-bottom: 0;
  }

  .lex-intro-section,
  .lex-section,
  .lex-team-section,
  .lex-about-strip,
  .lex-consultation {
    padding: 76px 0;
  }

  .lex-section-title,
  .lex-about-copy h2,
  .lex-consultation-copy h2 {
    font-size: clamp(36px, 12vw, 50px);
  }

  .lex-band-image {
    height: 330px;
    border-radius: 28px;
  }

  .lex-service-row-link {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 24px 0;
  }

  .lex-service-row strong,
  .lex-service-row em {
    grid-column: auto;
  }

  .lex-case-image {
    min-height: 300px;
  }

  .lex-case-content {
    padding: 24px;
  }

  .lex-process-row,
  .lex-faq-item {
    grid-template-columns: 1fr;
  }

  .lex-about-image {
    height: 360px;
    border-radius: 28px;
  }

  .lex-consultation-card {
    padding: 24px;
    border-radius: 30px;
  }

  .lex-form {
    padding: 22px;
    border-radius: 24px;
  }

  .lex-footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;