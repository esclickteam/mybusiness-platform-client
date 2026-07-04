export const wantravelEditorCss = `
[data-template-id="wantravel"],
[data-template-id="wantravel"] * {
  box-sizing: border-box;
}

[data-template-id="wantravel"] {
  direction: rtl;
  min-height: 100vh;
  overflow-x: hidden;
  background: #f4ecdf;
  color: #13261f;
  font-family: Assistant, Heebo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --wan-hero-shift: 0px;
  --wan-card-shift: 0px;
  --wan-image-shift: 0px;
}

[data-template-id="wantravel"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="wantravel"] img {
  display: block;
  max-width: 100%;
}

@keyframes wanHeroZoom {
  from {
    transform: translate3d(0, 0, 0) scale(1.13);
    filter: saturate(0.85) contrast(0.95);
  }
  to {
    transform: translate3d(0, var(--wan-hero-shift), 0) scale(1.04);
    filter: saturate(1.08) contrast(1.04);
  }
}

@keyframes wanFloatSoft {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(-1.5deg);
  }
  50% {
    transform: translate3d(0, -18px, 0) rotate(1deg);
  }
}

@keyframes wanFloatReverse {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(1.5deg);
  }
  50% {
    transform: translate3d(0, 18px, 0) rotate(-1deg);
  }
}

@keyframes wanMarquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(50%, 0, 0);
  }
}

@keyframes wanPulse {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.62;
    transform: scale(1.18);
  }
}

@keyframes wanShine {
  0% {
    transform: translateX(140%) rotate(18deg);
  }
  100% {
    transform: translateX(-180%) rotate(18deg);
  }
}

.wan-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 14% 9%, rgba(183,119,47,0.16), transparent 28%),
    radial-gradient(circle at 80% 12%, rgba(24,57,47,0.13), transparent 26%),
    linear-gradient(180deg, #f4ecdf 0%, #fff8ef 42%, #f4ecdf 100%);
}

.wan-container {
  width: min(1280px, calc(100% - 48px));
  margin-inline: auto;
}

[data-wan-reveal="true"] {
  opacity: 0;
  transform: translate3d(0, 44px, 0) scale(0.985);
  filter: blur(12px);
  transition:
    opacity 950ms cubic-bezier(.16, 1, .3, 1),
    transform 950ms cubic-bezier(.16, 1, .3, 1),
    filter 950ms cubic-bezier(.16, 1, .3, 1);
}

[data-wan-reveal="true"].is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  filter: blur(0);
}

.wan-header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 80;
  padding: 18px 28px 0;
}

.wan-header-inner {
  width: min(1280px, 100%);
  min-height: 72px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 12px 18px 12px 26px;
  border: 1px solid rgba(255,255,255,0.46);
  border-radius: 999px;
  background: rgba(250,244,232,0.76);
  box-shadow: 0 18px 70px rgba(19,38,31,0.13);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.wan-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.wan-brand-mark {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #13261f;
  color: #f3d28d;
  font-size: 15px;
  font-weight: 950;
  box-shadow: 0 14px 34px rgba(19,38,31,0.26);
}

.wan-brand-name {
  color: #13261f;
  font-size: 22px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.wan-nav {
  display: flex;
  align-items: center;
  gap: 34px;
  color: rgba(19,38,31,0.75);
  font-size: 14px;
  font-weight: 850;
}

.wan-nav a {
  position: relative;
  transition: color 280ms ease;
}

.wan-nav a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -8px;
  width: 0;
  height: 2px;
  border-radius: 99px;
  background: #b6772f;
  transition: width 280ms ease;
}

.wan-nav a:hover {
  color: #b6772f;
}

.wan-nav a:hover::after {
  width: 100%;
}

.wan-header-cta {
  position: relative;
  min-width: max-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 47px;
  padding: 0 22px;
  overflow: hidden;
  border-radius: 999px;
  background: #13261f;
  color: #ffffff;
  font-size: 14px;
  font-weight: 950;
  box-shadow: 0 16px 45px rgba(19,38,31,0.25);
  transition: transform 300ms ease, background 300ms ease;
}

.wan-header-cta::before {
  content: "";
  position: absolute;
  inset-block: -40%;
  width: 38px;
  background: rgba(255,255,255,0.38);
  filter: blur(7px);
  animation: wanShine 4.5s ease-in-out infinite;
}

.wan-header-cta:hover {
  transform: translateY(-3px);
  background: #b6772f;
}

.wan-hero {
  position: relative;
  min-height: 1040px;
  overflow: hidden;
  padding: 150px 0 58px;
}

.wan-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.wan-hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: wanHeroZoom 1800ms cubic-bezier(.16,1,.3,1) both;
}

.wan-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(19,38,31,0.78) 0%, rgba(19,38,31,0.46) 39%, rgba(19,38,31,0.06) 100%),
    linear-gradient(180deg, rgba(19,38,31,0.35) 0%, rgba(19,38,31,0.04) 52%, #f4ecdf 100%);
}

.wan-hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0);
  background-size: 18px 18px;
  mix-blend-mode: overlay;
}

.wan-hero-orb {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(8px);
  animation: wanPulse 6.4s ease-in-out infinite;
  pointer-events: none;
}

.wan-hero-orb-one {
  width: 250px;
  height: 250px;
  right: 7%;
  top: 22%;
  background: rgba(243,210,141,0.42);
}

.wan-hero-orb-two {
  width: 180px;
  height: 180px;
  left: 16%;
  bottom: 20%;
  background: rgba(255,255,255,0.28);
  animation-delay: 1.2s;
}

.wan-hero-grid {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 70px;
  align-items: center;
  min-height: 735px;
}

.wan-hero-content {
  max-width: 760px;
}

.wan-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 17px;
  border: 1px solid rgba(255,255,255,0.32);
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  color: #ffffff;
  font-size: 13px;
  font-weight: 950;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.wan-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #f3d28d;
  box-shadow: 0 0 0 7px rgba(243,210,141,0.16);
}

.wan-hero-title {
  margin: 28px 0 0;
  display: grid;
  gap: 0;
  color: #ffffff;
  font-size: clamp(58px, 8.8vw, 126px);
  line-height: 0.82;
  letter-spacing: -0.085em;
  font-weight: 950;
}

.wan-hero-title span {
  display: block;
}

.wan-hero-title span:nth-child(2) {
  padding-inline-start: 54px;
}

.wan-hero-title span:nth-child(3) {
  color: #f3d28d;
}

.wan-hero-text {
  max-width: 650px;
  margin: 34px 0 0;
  color: rgba(255,255,255,0.88);
  font-size: 20px;
  line-height: 1.9;
  font-weight: 760;
}

.wan-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 40px;
}

.wan-btn-primary,
.wan-btn-secondary {
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 0 29px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 950;
  transition:
    transform 320ms cubic-bezier(.16,1,.3,1),
    background 320ms ease,
    color 320ms ease,
    border-color 320ms ease;
}

.wan-btn-primary {
  background: #f3d28d;
  color: #13261f;
  box-shadow: 0 22px 70px rgba(243,210,141,0.24);
}

.wan-btn-primary span {
  transition: transform 320ms ease;
}

.wan-btn-primary:hover {
  transform: translateY(-5px);
  background: #ffffff;
}

.wan-btn-primary:hover span {
  transform: translateX(-5px);
}

.wan-btn-secondary {
  border: 1px solid rgba(255,255,255,0.42);
  background: rgba(255,255,255,0.12);
  color: #ffffff;
  backdrop-filter: blur(14px);
}

.wan-btn-secondary:hover {
  transform: translateY(-5px);
  background: #ffffff;
  color: #13261f;
}

.wan-hero-showcase {
  position: relative;
  min-height: 650px;
}

.wan-showcase-main {
  position: absolute;
  left: 42px;
  top: 18px;
  width: 390px;
  height: 540px;
  overflow: hidden;
  border-radius: 46px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.32);
  background: rgba(255,255,255,0.16);
  box-shadow: 0 35px 100px rgba(0,0,0,0.24);
  backdrop-filter: blur(18px);
  animation: wanFloatSoft 8s ease-in-out infinite;
}

.wan-showcase-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 36px;
  transform: translate3d(0, var(--wan-image-shift), 0) scale(1.08);
}

.wan-showcase-label {
  position: absolute;
  right: 28px;
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 15px;
  border-radius: 999px;
  background: rgba(255,255,255,0.82);
  color: #13261f;
  backdrop-filter: blur(14px);
}

.wan-showcase-label span {
  color: #b6772f;
  font-weight: 950;
}

.wan-showcase-label strong {
  font-size: 13px;
  font-weight: 950;
}

.wan-showcase-card {
  position: absolute;
  right: 0;
  bottom: 58px;
  width: 365px;
  padding: 31px;
  border-radius: 36px;
  border: 1px solid rgba(255,255,255,0.44);
  background: rgba(255,248,234,0.92);
  color: #13261f;
  box-shadow: 0 28px 90px rgba(0,0,0,0.2);
  backdrop-filter: blur(26px);
  transform: translate3d(0, var(--wan-card-shift), 0);
}

.wan-showcase-card p {
  margin: 0;
  color: #b6772f;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 950;
}

.wan-showcase-card h3 {
  margin: 13px 0 0;
  color: #13261f;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -0.05em;
  font-weight: 950;
}

.wan-showcase-card span {
  display: block;
  margin-top: 16px;
  color: #536158;
  font-size: 14px;
  line-height: 1.9;
  font-weight: 760;
}

.wan-mini-card {
  position: absolute;
  width: 150px;
  min-height: 118px;
  padding: 18px;
  border-radius: 28px;
  background: rgba(19,38,31,0.78);
  border: 1px solid rgba(255,255,255,0.16);
  color: #ffffff;
  box-shadow: 0 24px 70px rgba(0,0,0,0.23);
  backdrop-filter: blur(18px);
}

.wan-mini-card strong {
  display: block;
  color: #f3d28d;
  font-size: 34px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.wan-mini-card span {
  display: block;
  margin-top: 8px;
  color: rgba(255,255,255,0.78);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 850;
}

.wan-mini-card-one {
  right: 32px;
  top: 86px;
  animation: wanFloatReverse 7s ease-in-out infinite;
}

.wan-mini-card-two {
  left: 8px;
  bottom: 28px;
  animation: wanFloatSoft 7.4s ease-in-out infinite;
}

.wan-search-wrap {
  position: relative;
  z-index: 4;
  margin-top: -38px;
}

.wan-search-card {
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.9fr auto;
  gap: 0;
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(255,255,255,0.62);
  background: rgba(255,250,241,0.88);
  box-shadow: 0 28px 90px rgba(19,38,31,0.18);
  backdrop-filter: blur(24px);
}

.wan-search-item {
  padding: 25px 28px;
  border-left: 1px solid rgba(19,38,31,0.1);
}

.wan-search-item span {
  display: block;
  color: #92714b;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.08em;
}

.wan-search-item strong {
  display: block;
  margin-top: 8px;
  color: #13261f;
  font-size: 17px;
  font-weight: 950;
}

.wan-search-button {
  display: grid;
  place-items: center;
  min-width: 170px;
  background: #13261f;
  color: #ffffff;
  font-size: 15px;
  font-weight: 950;
  transition: background 280ms ease;
}

.wan-search-button:hover {
  background: #b6772f;
}

.wan-marquee-section {
  overflow: hidden;
  padding: 22px 0;
  background: #13261f;
  color: #f3d28d;
}

.wan-marquee-track {
  width: max-content;
  display: flex;
  align-items: center;
  gap: 30px;
  white-space: nowrap;
  animation: wanMarquee 28s linear infinite;
}

.wan-marquee-track span {
  font-size: 14px;
  font-weight: 950;
  letter-spacing: 0.28em;
}

.wan-marquee-track i {
  color: rgba(255,255,255,0.55);
  font-style: normal;
}

.wan-section {
  padding: 120px 0;
}

.wan-section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 44px;
  margin-bottom: 56px;
}

.wan-section-head-light .wan-section-title,
.wan-section-head-light .wan-section-text {
  color: #ffffff;
}

.wan-eyebrow-dark,
.wan-eyebrow-light-solid {
  display: inline-flex;
  align-items: center;
  color: #b6772f;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.16em;
}

.wan-eyebrow-light-solid {
  color: #f3d28d;
}

.wan-section-title {
  max-width: 760px;
  margin: 16px 0 0;
  color: #13261f;
  font-size: clamp(42px, 5.1vw, 70px);
  line-height: 0.96;
  letter-spacing: -0.065em;
  font-weight: 950;
}

.wan-section-text {
  max-width: 560px;
  margin: 0;
  color: #526158;
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.wan-destination-zone {
  position: relative;
}

.wan-destination-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 0.9fr;
  grid-auto-rows: 292px;
  gap: 22px;
}

.wan-destination-card {
  position: relative;
  overflow: hidden;
  border-radius: 38px;
  min-height: 292px;
  background: #13261f;
  box-shadow: 0 24px 70px rgba(19,38,31,0.12);
  transition:
    transform 520ms cubic-bezier(.16,1,.3,1),
    box-shadow 520ms cubic-bezier(.16,1,.3,1);
}

.wan-destination-card-large {
  grid-row: span 2;
}

.wan-destination-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 900ms cubic-bezier(.16,1,.3,1),
    filter 900ms ease;
}

.wan-destination-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 34px 100px rgba(19,38,31,0.2);
}

.wan-destination-card:hover img {
  transform: scale(1.12);
  filter: saturate(1.14) contrast(1.08);
}

.wan-destination-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.72));
}

.wan-destination-top {
  position: absolute;
  inset-inline: 22px;
  top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wan-destination-top span {
  border-radius: 999px;
  background: rgba(255,255,255,0.82);
  color: #13261f;
  padding: 9px 15px;
  font-size: 12px;
  font-weight: 950;
  backdrop-filter: blur(14px);
}

.wan-destination-top b {
  color: rgba(255,255,255,0.78);
  font-size: 13px;
  font-weight: 950;
}

.wan-destination-body {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  padding: 28px;
  color: #ffffff;
}

.wan-destination-body h3 {
  margin: 0;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.05em;
  font-weight: 950;
}

.wan-destination-body p {
  margin: 9px 0 0;
  color: rgba(255,255,255,0.78);
  font-size: 15px;
  font-weight: 850;
}

.wan-packages-section {
  background:
    radial-gradient(circle at 15% 10%, rgba(243,210,141,0.15), transparent 28%),
    radial-gradient(circle at 86% 10%, rgba(255,255,255,0.12), transparent 26%),
    #13261f;
  color: #ffffff;
}

.wan-packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.wan-package-card {
  overflow: hidden;
  border-radius: 38px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.075);
  box-shadow: 0 24px 80px rgba(0,0,0,0.21);
  backdrop-filter: blur(12px);
  transition:
    transform 500ms cubic-bezier(.16,1,.3,1),
    background 500ms ease;
}

.wan-package-card:hover {
  transform: translateY(-12px);
  background: rgba(255,255,255,0.12);
}

.wan-package-image {
  position: relative;
  height: 310px;
  overflow: hidden;
}

.wan-package-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms cubic-bezier(.16,1,.3,1);
}

.wan-package-card:hover .wan-package-image img {
  transform: scale(1.1);
}

.wan-package-price {
  position: absolute;
  right: 22px;
  bottom: 22px;
  border-radius: 999px;
  background: #f3d28d;
  color: #13261f;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 950;
}

.wan-package-body {
  padding: 28px;
}

.wan-package-index {
  color: #f3d28d;
  font-size: 13px;
  font-weight: 950;
}

.wan-package-body h3 {
  margin: 14px 0 0;
  color: #ffffff;
  font-size: 28px;
  line-height: 1.08;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.wan-package-body p {
  margin: 10px 0 0;
  color: rgba(255,255,255,0.68);
  font-size: 14px;
  font-weight: 850;
}

.wan-package-body ul {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.wan-package-body li {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,0.84);
  font-size: 14px;
  font-weight: 800;
}

.wan-package-body li span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f3d28d;
}

.wan-package-body a {
  margin-top: 28px;
  display: inline-flex;
  color: #f3d28d;
  font-size: 14px;
  font-weight: 950;
  transition: transform 280ms ease, color 280ms ease;
}

.wan-package-body a:hover {
  color: #ffffff;
  transform: translateX(-5px);
}

.wan-editorial-section {
  position: relative;
  padding: 120px 0;
  overflow: hidden;
  background: #fff8ef;
}

.wan-editorial-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 70px;
  align-items: center;
}

.wan-editorial-copy span {
  color: #b6772f;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.wan-editorial-copy h2 {
  max-width: 560px;
  margin: 18px 0 0;
  color: #13261f;
  font-size: clamp(42px, 5vw, 68px);
  line-height: 0.98;
  letter-spacing: -0.065em;
  font-weight: 950;
}

.wan-editorial-copy p {
  max-width: 520px;
  margin: 26px 0 0;
  color: #526158;
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.wan-editorial-images {
  position: relative;
  min-height: 620px;
}

.wan-editorial-image {
  position: absolute;
  overflow: hidden;
  border-radius: 44px;
  box-shadow: 0 30px 90px rgba(19,38,31,0.16);
}

.wan-editorial-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wan-editorial-image-one {
  right: 0;
  top: 20px;
  width: 58%;
  height: 520px;
  animation: wanFloatSoft 8.2s ease-in-out infinite;
}

.wan-editorial-image-two {
  left: 0;
  bottom: 0;
  width: 50%;
  height: 360px;
  border: 10px solid #fff8ef;
  animation: wanFloatReverse 7.8s ease-in-out infinite;
}

.wan-process-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 70px;
  align-items: flex-start;
}

.wan-sticky-copy {
  position: sticky;
  top: 130px;
}

.wan-sticky-copy .wan-section-text {
  margin-top: 26px;
}

.wan-steps {
  display: grid;
  gap: 20px;
}

.wan-step {
  display: grid;
  grid-template-columns: 115px 1fr;
  gap: 28px;
  align-items: start;
  padding: 34px;
  border-radius: 36px;
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(19,38,31,0.07);
  box-shadow: 0 22px 70px rgba(19,38,31,0.09);
  backdrop-filter: blur(14px);
  transition: transform 380ms ease, box-shadow 380ms ease;
}

.wan-step:hover {
  transform: translateY(-7px);
  box-shadow: 0 30px 90px rgba(19,38,31,0.15);
}

.wan-step > span {
  color: #b6772f;
  font-size: 50px;
  line-height: 0.9;
  letter-spacing: -0.08em;
  font-weight: 950;
}

.wan-step h3 {
  margin: 0;
  color: #13261f;
  font-size: 29px;
  line-height: 1.1;
  letter-spacing: -0.05em;
  font-weight: 950;
}

.wan-step p {
  margin: 13px 0 0;
  color: #526158;
  font-size: 16px;
  line-height: 1.85;
  font-weight: 750;
}

.wan-reviews-section {
  background:
    radial-gradient(circle at 20% 15%, rgba(183,119,47,0.11), transparent 28%),
    #f8f0e3;
}

.wan-center-head {
  max-width: 820px;
  margin: 0 auto 56px;
  text-align: center;
}

.wan-center-head .wan-section-title {
  margin-inline: auto;
}

.wan-reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.wan-review-card {
  padding: 38px;
  border-radius: 38px;
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(19,38,31,0.07);
  box-shadow: 0 24px 80px rgba(19,38,31,0.09);
  transition: transform 380ms ease, box-shadow 380ms ease;
}

.wan-review-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 30px 90px rgba(19,38,31,0.15);
}

.wan-stars {
  color: #b6772f;
  letter-spacing: 3px;
  font-size: 18px;
  margin-bottom: 20px;
}

.wan-review-card p {
  margin: 0;
  color: #39483f;
  font-size: 20px;
  line-height: 1.9;
  font-weight: 760;
}

.wan-review-card strong {
  display: block;
  margin-top: 26px;
  color: #13261f;
  font-size: 17px;
  font-weight: 950;
}

.wan-review-card span {
  display: block;
  margin-top: 7px;
  color: #7a867e;
  font-size: 13px;
  font-weight: 850;
}

.wan-booking {
  padding: 120px 0;
}

.wan-booking-card {
  display: grid;
  grid-template-columns: 1fr 0.92fr;
  gap: 54px;
  align-items: center;
  overflow: hidden;
  border-radius: 48px;
  padding: 52px;
  background:
    radial-gradient(circle at 16% 13%, rgba(243,210,141,0.22), transparent 30%),
    radial-gradient(circle at 90% 18%, rgba(255,255,255,0.1), transparent 28%),
    #13261f;
  color: #ffffff;
  box-shadow: 0 34px 110px rgba(19,38,31,0.28);
}

.wan-booking-copy h2 {
  max-width: 600px;
  margin: 18px 0 0;
  color: #ffffff;
  font-size: clamp(44px, 5.2vw, 72px);
  line-height: 0.96;
  letter-spacing: -0.07em;
  font-weight: 950;
}

.wan-booking-copy p {
  max-width: 550px;
  margin: 26px 0 0;
  color: rgba(255,255,255,0.78);
  font-size: 17px;
  line-height: 1.95;
  font-weight: 760;
}

.wan-booking-notes {
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.wan-booking-notes div {
  padding: 22px;
  border-radius: 27px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.08);
}

.wan-booking-notes span {
  display: block;
  color: rgba(255,255,255,0.66);
  font-size: 13px;
  font-weight: 850;
}

.wan-booking-notes strong {
  display: block;
  margin-top: 8px;
  color: #ffffff;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 950;
}

.wan-form {
  padding: 31px;
  border-radius: 36px;
  background: #fff8ef;
  color: #13261f;
  box-shadow: 0 24px 80px rgba(0,0,0,0.18);
}

.wan-form label {
  display: block;
  margin-bottom: 16px;
}

.wan-form label span {
  display: block;
  margin-bottom: 8px;
  color: #13261f;
  font-size: 14px;
  font-weight: 950;
}

.wan-form input,
.wan-form textarea {
  width: 100%;
  border: 1px solid #ded6ca;
  outline: none;
  border-radius: 21px;
  background: #ffffff;
  color: #13261f;
  padding: 15px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 750;
  transition:
    border-color 280ms ease,
    box-shadow 280ms ease,
    transform 280ms ease;
}

.wan-form textarea {
  min-height: 130px;
  resize: vertical;
}

.wan-form input:focus,
.wan-form textarea:focus {
  border-color: #b6772f;
  box-shadow: 0 0 0 5px rgba(183,119,47,0.1);
  transform: translateY(-2px);
}

.wan-form button {
  width: 100%;
  min-height: 58px;
  border: 0;
  border-radius: 999px;
  background: #13261f;
  color: #ffffff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 300ms ease, background 300ms ease;
}

.wan-form button:hover {
  transform: translateY(-4px);
  background: #b6772f;
}

.wan-footer {
  padding: 38px 0;
  border-top: 1px solid rgba(19,38,31,0.09);
  background: #f4ecdf;
}

.wan-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.wan-footer strong {
  display: block;
  color: #13261f;
  font-size: 22px;
  line-height: 1;
  font-weight: 950;
}

.wan-footer p {
  margin: 8px 0 0;
  color: #6c776f;
  font-size: 14px;
  font-weight: 750;
}

.wan-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: #4d5a52;
  font-size: 14px;
  font-weight: 850;
}

.wan-footer nav a {
  transition: color 260ms ease;
}

.wan-footer nav a:hover {
  color: #b6772f;
}

@media (max-width: 1120px) {
  .wan-nav {
    display: none;
  }

  .wan-hero {
    min-height: auto;
  }

  .wan-hero-grid,
  .wan-editorial-grid,
  .wan-process-grid,
  .wan-booking-card {
    grid-template-columns: 1fr;
  }

  .wan-hero-showcase {
    display: none;
  }

  .wan-search-card {
    grid-template-columns: 1fr 1fr;
  }

  .wan-search-button {
    min-height: 70px;
  }

  .wan-destination-layout,
  .wan-packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wan-destination-card-large {
    grid-row: auto;
  }

  .wan-section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .wan-editorial-images {
    min-height: 560px;
  }
}

@media (max-width: 760px) {
  .wan-container {
    width: min(100% - 28px, 1280px);
  }

  .wan-header {
    padding: 12px 12px 0;
  }

  .wan-header-inner {
    min-height: 62px;
    padding: 9px 10px 9px 14px;
  }

  .wan-brand-mark {
    width: 38px;
    height: 38px;
    font-size: 13px;
  }

  .wan-brand-name {
    font-size: 18px;
  }

  .wan-header-cta {
    min-height: 42px;
    padding: 0 15px;
    font-size: 12px;
  }

  .wan-hero {
    padding-top: 116px;
    padding-bottom: 48px;
  }

  .wan-hero-grid {
    min-height: auto;
  }

  .wan-hero-title {
    font-size: clamp(48px, 16vw, 76px);
    letter-spacing: -0.075em;
  }

  .wan-hero-title span:nth-child(2) {
    padding-inline-start: 28px;
  }

  .wan-hero-text {
    font-size: 17px;
    line-height: 1.8;
  }

  .wan-hero-actions {
    flex-direction: column;
  }

  .wan-btn-primary,
  .wan-btn-secondary {
    width: 100%;
  }

  .wan-search-wrap {
    margin-top: 28px;
  }

  .wan-search-card,
  .wan-destination-layout,
  .wan-packages-grid,
  .wan-reviews-grid,
  .wan-booking-notes {
    grid-template-columns: 1fr;
  }

  .wan-search-item {
    border-left: 0;
    border-bottom: 1px solid rgba(19,38,31,0.1);
  }

  .wan-section,
  .wan-editorial-section,
  .wan-booking {
    padding: 76px 0;
  }

  .wan-section-title,
  .wan-editorial-copy h2,
  .wan-booking-copy h2 {
    font-size: clamp(36px, 12vw, 50px);
  }

  .wan-section-text,
  .wan-editorial-copy p,
  .wan-booking-copy p {
    font-size: 16px;
  }

  .wan-editorial-images {
    min-height: 480px;
  }

  .wan-editorial-image-one {
    width: 76%;
    height: 390px;
  }

  .wan-editorial-image-two {
    width: 62%;
    height: 260px;
  }

  .wan-step {
    grid-template-columns: 1fr;
    padding: 26px;
  }

  .wan-booking-card {
    padding: 24px;
    border-radius: 32px;
  }

  .wan-form {
    padding: 22px;
    border-radius: 28px;
  }

  .wan-footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;