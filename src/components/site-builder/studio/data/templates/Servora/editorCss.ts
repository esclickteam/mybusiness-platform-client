export const servoraEditorCss = `
[data-template-id="servora"],
[data-template-id="servora"] * {
  box-sizing: border-box;
}

[data-template-id="servora"] {
  --servora-bg: #fff7ed;
  --servora-cream: #fffaf3;
  --servora-surface: #ffffff;
  --servora-ink: #111827;
  --servora-dark: #07111f;
  --servora-muted: #6b7280;
  --servora-line: rgba(17, 24, 39, 0.12);
  --servora-orange: #ff6a1a;
  --servora-orange-dark: #ea580c;
  --servora-yellow: #ffd166;
  --servora-blue: #0ea5e9;
  --servora-green: #22c55e;
  --servora-radius-xl: 34px;
  --servora-radius-lg: 24px;
  --servora-radius-md: 18px;
  direction: rtl;
  width: 100%;
  min-height: 100%;
  color: var(--servora-ink);
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 106, 26, 0.18), transparent 30%),
    radial-gradient(circle at 92% 12%, rgba(14, 165, 233, 0.14), transparent 28%),
    linear-gradient(180deg, #fffaf3 0%, #fff7ed 44%, #ffffff 100%);
  font-family:
    "Heebo",
    "Assistant",
    "Rubik",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  overflow-x: hidden;
}

[data-template-id="servora"] button,
[data-template-id="servora"] input,
[data-template-id="servora"] textarea,
[data-template-id="servora"] select {
  font: inherit;
}

[data-template-id="servora"] button {
  border: 0;
}

[data-template-id="servora"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="servora"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="servora"] .servora-page {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

[data-template-id="servora"] .servora-shell {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

[data-template-id="servora"] .servora-header {
  position: sticky;
  top: 0;
  z-index: 60;
  padding: 16px 0 10px;
  background: linear-gradient(
    180deg,
    rgba(255, 247, 237, 0.96),
    rgba(255, 247, 237, 0.72)
  );
  backdrop-filter: blur(20px);
}

[data-template-id="servora"] .servora-header-inner {
  min-height: 74px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.86);
  box-shadow:
    0 24px 80px rgba(17, 24, 39, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 12px 14px 12px 22px;
}

[data-template-id="servora"] .servora-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 190px;
  cursor: pointer;
  background: transparent;
  color: inherit;
}

[data-template-id="servora"] .servora-brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(
      135deg,
      var(--servora-orange),
      #ffb703 55%,
      var(--servora-yellow)
    );
  color: #1f1308;
  font-weight: 1000;
  letter-spacing: -0.05em;
  box-shadow: 0 16px 36px rgba(255, 106, 26, 0.30);
}

[data-template-id="servora"] .servora-brand-name {
  display: block;
  font-size: 1.08rem;
  font-weight: 1000;
  line-height: 1;
  letter-spacing: -0.045em;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-brand-label {
  display: block;
  margin-top: 5px;
  color: var(--servora-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

[data-template-id="servora"] .servora-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

[data-template-id="servora"] .servora-nav-link {
  position: relative;
  padding: 11px 15px;
  border-radius: 999px;
  color: rgba(17, 24, 39, 0.72);
  background: transparent;
  cursor: pointer;
  font-weight: 800;
  white-space: nowrap;
  transition:
    color 0.24s ease,
    background 0.24s ease,
    transform 0.24s ease;
}

[data-template-id="servora"] .servora-nav-link::after {
  content: "";
  position: absolute;
  right: 18px;
  left: 18px;
  bottom: 7px;
  height: 2px;
  border-radius: 999px;
  background: var(--servora-orange);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.25s ease;
}

[data-template-id="servora"] .servora-nav-link:hover,
[data-template-id="servora"] .servora-nav-link.is-active {
  color: var(--servora-dark);
  background: rgba(255, 106, 26, 0.13);
}

[data-template-id="servora"] .servora-nav-link:hover::after,
[data-template-id="servora"] .servora-nav-link.is-active::after {
  transform: scaleX(1);
}

[data-template-id="servora"] .servora-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

[data-template-id="servora"] .servora-phone-pill {
  min-height: 48px;
  border-radius: 999px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--servora-dark);
  background: rgba(255, 247, 237, 0.90);
  border: 1px solid rgba(255, 106, 26, 0.18);
  font-weight: 950;
  white-space: nowrap;
}

[data-template-id="servora"] .servora-phone-pill span {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 106, 26, 0.14);
}

[data-template-id="servora"] .servora-header-cta {
  min-width: 170px;
  justify-content: center;
}

[data-template-id="servora"] .servora-btn {
  position: relative;
  min-height: 52px;
  border-radius: 999px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 950;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

[data-template-id="servora"] .servora-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent,
    rgba(255, 255, 255, 0.42),
    transparent
  );
  transform: translateX(115%);
  transition: transform 0.65s ease;
}

[data-template-id="servora"] .servora-btn:hover::before {
  transform: translateX(-115%);
}

[data-template-id="servora"] .servora-btn:hover {
  transform: translateY(-3px);
}

[data-template-id="servora"] .servora-btn-primary {
  color: #ffffff;
  background:
    linear-gradient(135deg, var(--servora-dark), #16243a 52%, #26364f);
  box-shadow: 0 22px 54px rgba(17, 24, 39, 0.26);
}

[data-template-id="servora"] .servora-btn-orange {
  color: #1d1208;
  background:
    linear-gradient(
      135deg,
      var(--servora-orange),
      #ffb703 58%,
      var(--servora-yellow)
    );
  box-shadow: 0 22px 54px rgba(255, 106, 26, 0.24);
}

[data-template-id="servora"] .servora-btn-outline {
  border: 1px solid rgba(17, 24, 39, 0.12);
  background: rgba(255, 255, 255, 0.68);
  color: var(--servora-ink);
}

[data-template-id="servora"] .servora-hero {
  position: relative;
  padding: 76px 0 82px;
  overflow: hidden;
}

[data-template-id="servora"] .servora-handyman-hero {
  padding-top: 64px;
  padding-bottom: 78px;
}

[data-template-id="servora"] .servora-hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 106, 26, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 106, 26, 0.06) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, #000, transparent 82%);
  pointer-events: none;
}

[data-template-id="servora"] .servora-hero-glow {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 999px;
  filter: blur(24px);
  pointer-events: none;
}

[data-template-id="servora"] .servora-hero-glow-one {
  top: -170px;
  right: 4vw;
  background: radial-gradient(circle, rgba(255, 106, 26, 0.26), transparent 64%);
}

[data-template-id="servora"] .servora-hero-glow-two {
  left: -190px;
  bottom: 30px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.16), transparent 66%);
}

[data-template-id="servora"] .servora-hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(380px, 0.98fr);
  gap: 44px;
  align-items: center;
}

[data-template-id="servora"] .servora-handyman-hero-grid {
  grid-template-columns: minmax(0, 0.82fr) minmax(560px, 1.18fr);
  gap: 34px;
}

[data-template-id="servora"] .servora-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  border: 1px solid rgba(255, 106, 26, 0.38);
  border-radius: 999px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.72);
  color: #c2410c;
  font-size: 0.88rem;
  font-weight: 950;
  box-shadow: 0 16px 44px rgba(17, 24, 39, 0.06);
}

[data-template-id="servora"] .servora-eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--servora-orange);
  box-shadow: 0 0 0 6px rgba(255, 106, 26, 0.15);
  flex: 0 0 auto;
}

[data-template-id="servora"] .servora-hero-title {
  margin: 24px 0 0;
  max-width: 830px;
  font-size: clamp(3.5rem, 7.2vw, 7.4rem);
  line-height: 0.86;
  letter-spacing: -0.095em;
  font-weight: 1000;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-highlight {
  display: block;
  background:
    linear-gradient(
      90deg,
      var(--servora-orange),
      #f59e0b 48%,
      #0ea5e9
    );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

[data-template-id="servora"] .servora-hero-text {
  margin: 26px 0 0;
  max-width: 650px;
  font-size: 1.12rem;
  line-height: 1.85;
  color: var(--servora-muted);
  font-weight: 560;
}

[data-template-id="servora"] .servora-hero-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 13px;
}

[data-template-id="servora"] .servora-trust-row {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

[data-template-id="servora"] .servora-trust-item {
  min-height: 42px;
  border-radius: 999px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(17, 24, 39, 0.09);
  box-shadow: 0 18px 44px rgba(17, 24, 39, 0.06);
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-trust-item span {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #1d1208;
  background: linear-gradient(135deg, var(--servora-orange), var(--servora-yellow));
  font-weight: 1000;
}

[data-template-id="servora"] .servora-trust-item strong {
  font-size: 0.88rem;
  font-weight: 950;
}

[data-template-id="servora"] .servora-hero-note {
  margin-top: 26px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(17, 24, 39, 0.76);
  font-weight: 850;
}

[data-template-id="servora"] .servora-status-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--servora-green);
  box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.13);
  animation: servoraPulse 1.8s ease-in-out infinite;
}

[data-template-id="servora"] .servora-hero-media {
  position: relative;
  min-height: 650px;
}

[data-template-id="servora"] .servora-wide-hero-media {
  min-height: 690px;
}

[data-template-id="servora"] .servora-media-card {
  position: absolute;
  inset: 20px 0 20px 34px;
  border-radius: 46px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 42px 100px rgba(17, 24, 39, 0.20);
  transform: rotate(-2deg);
  isolation: isolate;
  cursor: pointer;
}

[data-template-id="servora"] .servora-handyman-media {
  inset: 0;
  border-radius: 44px;
}

[data-template-id="servora"] .servora-wide-media-card {
  inset: 0;
  min-height: 690px;
  transform: rotate(-1.4deg);
  border-radius: 48px;
}

[data-template-id="servora"] .servora-media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 28%, rgba(7, 17, 31, 0.66)),
    radial-gradient(circle at 20% 20%, rgba(255, 106, 26, 0.18), transparent 38%);
}

[data-template-id="servora"] .servora-media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.85s ease;
}

[data-template-id="servora"] .servora-media-card:hover img {
  transform: scale(1.11);
}

[data-template-id="servora"] .servora-request-card {
  position: relative;
  border-radius: 28px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow:
    0 34px 90px rgba(17, 24, 39, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
}

[data-template-id="servora"] .servora-request-card-float {
  position: absolute;
  z-index: 8;
  right: clamp(18px, 4vw, 54px);
  bottom: 26px;
  width: min(430px, 46%);
  animation: servoraFloat 6s ease-in-out infinite;
  cursor: move;
}

[data-template-id="servora"] .servora-request-card-head {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 17px;
}

[data-template-id="servora"] .servora-request-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, var(--servora-orange), #ffb703);
  box-shadow: 0 18px 42px rgba(255, 106, 26, 0.25);
  font-size: 1.35rem;
}

[data-template-id="servora"] .servora-request-card h3 {
  margin: 0;
  color: var(--servora-dark);
  font-size: 1.18rem;
  letter-spacing: -0.04em;
}

[data-template-id="servora"] .servora-request-card p {
  margin: 5px 0 0;
  color: var(--servora-muted);
  font-size: 0.92rem;
  line-height: 1.45;
  font-weight: 700;
}

[data-template-id="servora"] .servora-request-form {
  display: grid;
  gap: 10px;
}

[data-template-id="servora"] .servora-request-form input,
[data-template-id="servora"] .servora-request-form select {
  width: 100%;
  min-height: 50px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 16px;
  padding: 0 14px;
  background: rgba(255, 250, 243, 0.82);
  color: var(--servora-ink);
  outline: none;
  direction: rtl;
  text-align: right;
  transition:
    border-color 0.24s ease,
    box-shadow 0.24s ease,
    background 0.24s ease;
}

[data-template-id="servora"] .servora-request-form input::placeholder {
  direction: rtl;
  text-align: right;
  color: rgba(17, 24, 39, 0.42);
}

[data-template-id="servora"] .servora-request-form input[type="tel"] {
  direction: rtl;
  text-align: right;
  unicode-bidi: plaintext;
}

[data-template-id="servora"] .servora-request-form input[type="tel"]::placeholder {
  direction: rtl;
  text-align: right;
}

[data-template-id="servora"] .servora-request-form input:focus,
[data-template-id="servora"] .servora-request-form select:focus {
  border-color: rgba(255, 106, 26, 0.72);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(255, 106, 26, 0.13);
}

[data-template-id="servora"] .servora-request-submit {
  width: 100%;
  min-height: 50px;
}

[data-template-id="servora"] .servora-floating-rating-card {
  position: absolute;
  z-index: 7;
  right: -38px;
  top: 132px;
  width: 245px;
  border-radius: 28px;
  padding: 22px;
  color: var(--servora-dark);
  background: rgba(255, 255, 255, 0.90);
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow: 0 28px 78px rgba(17, 24, 39, 0.16);
  backdrop-filter: blur(18px);
  pointer-events: none;
}

[data-template-id="servora"] .servora-small-rating-card {
  width: 250px;
}

[data-template-id="servora"] .servora-rating-stars {
  display: block;
  color: #f59e0b;
  letter-spacing: 0.04em;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-floating-rating-card strong {
  display: block;
  margin-top: 8px;
  color: var(--servora-dark);
  font-size: 1.05rem;
}

[data-template-id="servora"] .servora-floating-rating-card p {
  margin: 6px 0 0;
  color: var(--servora-muted);
  line-height: 1.55;
  font-weight: 700;
  font-size: 0.9rem;
}

[data-template-id="servora"] .servora-trust-strip {
  position: relative;
  z-index: 2;
  margin-top: -28px;
  padding: 0 0 44px;
}

[data-template-id="servora"] .servora-trust-strip-inner {
  border-radius: 28px;
  padding: 18px 22px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(17, 24, 39, 0.09);
  box-shadow: 0 26px 80px rgba(17, 24, 39, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

[data-template-id="servora"] .servora-trust-strip-title {
  color: var(--servora-dark);
  font-weight: 950;
  white-space: nowrap;
}

[data-template-id="servora"] .servora-logo-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
}

[data-template-id="servora"] .servora-logo-pill {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: rgba(17, 24, 39, 0.78);
  background: rgba(255, 247, 237, 0.88);
  border: 1px solid rgba(255, 106, 26, 0.13);
  font-weight: 900;
}

[data-template-id="servora"] .servora-section {
  padding: 92px 0;
  position: relative;
}

[data-template-id="servora"] .servora-section-tight {
  padding: 66px 0;
}

[data-template-id="servora"] .servora-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 34px;
}

[data-template-id="servora"] .servora-section-title {
  margin: 15px 0 0;
  max-width: 790px;
  font-size: clamp(2.3rem, 4.5vw, 4.8rem);
  line-height: 0.96;
  letter-spacing: -0.075em;
  font-weight: 1000;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-section-text {
  max-width: 520px;
  color: var(--servora-muted);
  line-height: 1.85;
  font-weight: 560;
}

[data-template-id="servora"] .servora-intro-section {
  padding-top: 58px;
}

[data-template-id="servora"] .servora-intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 22px;
  align-items: stretch;
}

[data-template-id="servora"] .servora-intro-copy {
  border-radius: 40px;
  padding: clamp(30px, 5vw, 58px);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(17, 24, 39, 0.09);
  box-shadow: 0 30px 90px rgba(17, 24, 39, 0.08);
}

[data-template-id="servora"] .servora-intro-card {
  border-radius: 40px;
  padding: 34px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 350px;
  color: #ffffff;
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 106, 26, 0.32), transparent 35%),
    linear-gradient(135deg, #07111f, #1f2937);
  box-shadow: 0 36px 90px rgba(17, 24, 39, 0.22);
}

[data-template-id="servora"] .servora-intro-card strong {
  display: block;
  font-size: clamp(4rem, 7vw, 6rem);
  line-height: 0.85;
  letter-spacing: -0.08em;
}

[data-template-id="servora"] .servora-intro-card span {
  display: block;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.15rem;
  font-weight: 950;
}

[data-template-id="servora"] .servora-intro-card p {
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.70);
  line-height: 1.7;
  font-weight: 650;
}

[data-template-id="servora"] .servora-stats-wrap {
  position: relative;
  border-radius: 44px;
  padding: 42px;
  background:
    radial-gradient(circle at 12% 8%, rgba(255, 106, 26, 0.16), transparent 30%),
    radial-gradient(circle at 94% 100%, rgba(14, 165, 233, 0.10), transparent 32%),
    rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 38px 110px rgba(17, 24, 39, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
  overflow: hidden;
}

[data-template-id="servora"] .servora-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="servora"] .servora-stat {
  position: relative;
  min-height: 230px;
  border-radius: 32px;
  padding: 30px 26px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.78));
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow:
    0 28px 80px rgba(17, 24, 39, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  overflow: hidden;
  animation: servoraCardEnter 0.82s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="servora"] .servora-stat-number {
  position: relative;
  z-index: 1;
  display: block;
  color: var(--servora-dark);
  font-size: clamp(2.55rem, 4.2vw, 4.35rem);
  line-height: 0.9;
  letter-spacing: -0.075em;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-counter-value {
  display: inline-block;
}

[data-template-id="servora"] .servora-counter-value.is-done {
  animation: servoraNumberPop 0.72s both cubic-bezier(0.16, 1.25, 0.3, 1);
}

[data-template-id="servora"] .servora-stat-label {
  position: relative;
  z-index: 1;
  max-width: 180px;
  color: #667085;
  font-size: clamp(1rem, 1.25vw, 1.12rem);
  line-height: 1.55;
  font-weight: 900;
}

[data-template-id="servora"] .servora-services-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="servora"] .servora-handyman-services-grid {
  gap: 20px;
}

[data-template-id="servora"] .servora-service-card {
  position: relative;
  min-height: 310px;
  border-radius: 34px;
  border: 1px solid rgba(17, 24, 39, 0.10);
  background:
    radial-gradient(circle at 18% 12%, rgba(255, 106, 26, 0.10), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.66));
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 85px rgba(17, 24, 39, 0.08);
  overflow: hidden;
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease,
    background 0.32s ease;
}

[data-template-id="servora"] .servora-service-card:hover {
  transform: translateY(-12px) rotate(-0.6deg);
  border-color: rgba(255, 106, 26, 0.48);
  background: #ffffff;
  box-shadow: 0 42px 100px rgba(255, 106, 26, 0.13);
}

[data-template-id="servora"] .servora-service-icon {
  position: relative;
  z-index: 1;
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background: rgba(255, 106, 26, 0.13);
  color: #c2410c;
  display: grid;
  place-items: center;
  font-weight: 1000;
  font-size: 1.5rem;
}

[data-template-id="servora"] .servora-service-card h3 {
  position: relative;
  z-index: 1;
  margin: 28px 0 12px;
  font-size: 1.46rem;
  letter-spacing: -0.04em;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-service-card p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--servora-muted);
  line-height: 1.75;
  font-weight: 560;
}

[data-template-id="servora"] .servora-service-arrow {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  min-height: 48px;
  border-radius: 999px;
  padding: 0 16px;
  background: rgba(255, 106, 26, 0.10);
  color: #9a3412;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  font-weight: 950;
}

[data-template-id="servora"] .servora-service-arrow:hover {
  background: linear-gradient(135deg, var(--servora-orange), #ffb703);
  color: #1d1208;
}

[data-template-id="servora"] .servora-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 28px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 26px 78px rgba(17, 24, 39, 0.07);
}

[data-template-id="servora"] .servora-area-pill {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  background: rgba(255, 106, 26, 0.10);
  color: #9a3412;
  display: inline-flex;
  align-items: center;
  font-weight: 900;
}

[data-template-id="servora"] .servora-project-grid,
[data-template-id="servora"] .servora-feature-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 26px;
  align-items: stretch;
}

[data-template-id="servora"] .servora-feature-section {
  padding-top: 78px;
  padding-bottom: 78px;
}

[data-template-id="servora"] .servora-project-image,
[data-template-id="servora"] .servora-feature-image {
  position: relative;
  min-height: 520px;
  border-radius: 42px;
  overflow: hidden;
  box-shadow: 0 36px 90px rgba(17, 24, 39, 0.16);
  cursor: pointer;
  isolation: isolate;
}

[data-template-id="servora"] .servora-project-image::after,
[data-template-id="servora"] .servora-feature-image::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, transparent, rgba(7, 17, 31, 0.52)),
    radial-gradient(circle at 18% 18%, rgba(255, 106, 26, 0.18), transparent 38%);
  pointer-events: none;
}

[data-template-id="servora"] .servora-project-image img,
[data-template-id="servora"] .servora-feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-template-id="servora"] .servora-feature-image-badge {
  position: absolute;
  z-index: 3;
  right: 28px;
  bottom: 28px;
  width: 168px;
  border-radius: 28px;
  padding: 20px;
  color: var(--servora-dark);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 28px 72px rgba(17, 24, 39, 0.16);
  backdrop-filter: blur(18px);
  pointer-events: none;
}

[data-template-id="servora"] .servora-feature-image-badge strong {
  display: block;
  font-size: 2.6rem;
  line-height: 0.9;
  letter-spacing: -0.07em;
}

[data-template-id="servora"] .servora-feature-image-badge span {
  display: block;
  margin-top: 8px;
  color: var(--servora-muted);
  font-weight: 900;
}

[data-template-id="servora"] .servora-project-card,
[data-template-id="servora"] .servora-feature-content {
  border-radius: 42px;
  padding: clamp(28px, 5vw, 54px);
  color: #ffffff;
  background:
    radial-gradient(circle at 14% 12%, rgba(255, 106, 26, 0.25), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(14, 165, 233, 0.18), transparent 31%),
    linear-gradient(135deg, #07111f, #111827 52%, #26364f);
  box-shadow: 0 36px 90px rgba(17, 24, 39, 0.22);
}

[data-template-id="servora"] .servora-project-card h2,
[data-template-id="servora"] .servora-feature-content h2 {
  margin: 18px 0;
  font-size: clamp(2.1rem, 4vw, 4.1rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

[data-template-id="servora"] .servora-project-card p,
[data-template-id="servora"] .servora-feature-content p {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.9;
  font-weight: 560;
}

[data-template-id="servora"] .servora-check-list {
  display: grid;
  gap: 12px;
  margin-top: 25px;
}

[data-template-id="servora"] .servora-check {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255, 255, 255, 0.90);
  font-weight: 850;
}

[data-template-id="servora"] .servora-check::before {
  content: "✓";
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: var(--servora-orange);
  color: #1f1308;
  display: grid;
  place-items: center;
  font-weight: 1000;
  flex: 0 0 auto;
}

[data-template-id="servora"] .servora-feature-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

[data-template-id="servora"] .servora-process {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="servora"] .servora-step {
  position: relative;
  border: 1px solid rgba(17, 24, 39, 0.10);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.72);
  padding: 30px;
  min-height: 260px;
  overflow: hidden;
  box-shadow: 0 28px 80px rgba(17, 24, 39, 0.07);
}

[data-template-id="servora"] .servora-step-number {
  position: relative;
  z-index: 1;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #1d1208;
  background: linear-gradient(135deg, var(--servora-orange), #ffb703);
  box-shadow: 0 18px 44px rgba(255, 106, 26, 0.18);
  font-size: 0.95rem;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-step h3 {
  position: relative;
  z-index: 1;
  margin: 42px 0 13px;
  font-size: 1.6rem;
  letter-spacing: -0.05em;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-step p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--servora-muted);
  line-height: 1.76;
  font-weight: 560;
}

[data-template-id="servora"] .servora-pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="servora"] .servora-handyman-pricing-grid {
  align-items: stretch;
}

[data-template-id="servora"] .servora-price-card {
  position: relative;
  border-radius: 34px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 28px 80px rgba(17, 24, 39, 0.07);
}

[data-template-id="servora"] .servora-handyman-price-card {
  min-height: 410px;
  display: flex;
  flex-direction: column;
}

[data-template-id="servora"] .servora-price-card.is-popular {
  border-color: rgba(255, 106, 26, 0.54);
  background:
    radial-gradient(circle at 18% 12%, rgba(255, 106, 26, 0.13), transparent 34%),
    rgba(255, 255, 255, 0.92);
  transform: translateY(-10px);
}

[data-template-id="servora"] .servora-popular-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  min-height: 34px;
  padding: 0 13px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--servora-orange), #ffb703);
  color: #1d1208 !important;
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-price-card strong {
  display: block;
  color: var(--servora-dark);
  font-size: 2.4rem;
  line-height: 1;
  letter-spacing: -0.06em;
  margin-top: 20px;
}

[data-template-id="servora"] .servora-price-card span {
  color: #ea580c;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-price-card p {
  color: var(--servora-muted);
  line-height: 1.7;
  font-weight: 560;
}

[data-template-id="servora"] .servora-price-features {
  display: grid;
  gap: 10px;
  margin: 18px 0 24px;
  padding: 0;
  list-style: none;
}

[data-template-id="servora"] .servora-price-features li {
  display: flex;
  align-items: center;
  gap: 9px;
  color: rgba(17, 24, 39, 0.74);
  font-weight: 800;
}

[data-template-id="servora"] .servora-price-features li::before {
  content: "✓";
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
  font-weight: 1000;
  flex: 0 0 auto;
}

[data-template-id="servora"] .servora-handyman-price-card .servora-btn {
  width: 100%;
  margin-top: auto;
}

[data-template-id="servora"] .servora-testimonials {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
}

[data-template-id="servora"] .servora-testimonial-main {
  border-radius: 42px;
  color: #ffffff;
  padding: clamp(30px, 5vw, 58px);
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 106, 26, 0.22), transparent 34%),
    linear-gradient(135deg, #07111f, #1f2937);
  box-shadow: 0 36px 90px rgba(17, 24, 39, 0.22);
}

[data-template-id="servora"] .servora-testimonial-main p {
  margin: 18px 0 0;
  font-size: clamp(1.55rem, 3vw, 2.9rem);
  line-height: 1.25;
  letter-spacing: -0.045em;
  font-weight: 900;
}

[data-template-id="servora"] .servora-testimonial-person {
  margin-top: 34px;
}

[data-template-id="servora"] .servora-testimonial-person strong {
  display: block;
  font-size: 1.1rem;
}

[data-template-id="servora"] .servora-testimonial-person span {
  display: block;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.66);
}

[data-template-id="servora"] .servora-testimonial-list {
  display: grid;
  gap: 18px;
}

[data-template-id="servora"] .servora-mini-testimonial {
  border-radius: 30px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 26px 70px rgba(17, 24, 39, 0.06);
}

[data-template-id="servora"] .servora-mini-testimonial p {
  margin: 12px 0 0;
  color: var(--servora-muted);
  line-height: 1.75;
  font-weight: 560;
}

[data-template-id="servora"] .servora-mini-testimonial strong {
  display: block;
  margin-top: 18px;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-faq {
  display: grid;
  gap: 14px;
}

[data-template-id="servora"] .servora-faq-item {
  border-radius: 26px;
  padding: 25px 28px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 24px 70px rgba(17, 24, 39, 0.05);
}

[data-template-id="servora"] .servora-faq-item h3 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-faq-item p {
  margin: 11px 0 0;
  color: var(--servora-muted);
  line-height: 1.76;
}

[data-template-id="servora"] .servora-cta {
  border-radius: 44px;
  color: #ffffff;
  padding: clamp(34px, 6vw, 70px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 106, 26, 0.30), transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(14, 165, 233, 0.16), transparent 32%),
    linear-gradient(135deg, #07111f, #111827 52%, #26364f);
  box-shadow: 0 42px 115px rgba(17, 24, 39, 0.24);
}

[data-template-id="servora"] .servora-handyman-cta {
  position: relative;
  overflow: hidden;
}

[data-template-id="servora"] .servora-cta h2 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(2.2rem, 5vw, 4.8rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

[data-template-id="servora"] .servora-cta p {
  margin: 18px 0 0;
  max-width: 650px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.8;
}

[data-template-id="servora"] .servora-cta-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

[data-template-id="servora"] .servora-contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(380px, 1.1fr);
  gap: 24px;
  align-items: start;
}

[data-template-id="servora"] .servora-contact-panel,
[data-template-id="servora"] .servora-form-card {
  border-radius: 38px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 30px 85px rgba(17, 24, 39, 0.08);
}

[data-template-id="servora"] .servora-contact-panel {
  padding: 38px;
}

[data-template-id="servora"] .servora-contact-info {
  display: grid;
  gap: 13px;
  margin-top: 28px;
}

[data-template-id="servora"] .servora-info-line {
  border-radius: 20px;
  background: rgba(255, 247, 237, 0.86);
  border: 1px solid rgba(17, 24, 39, 0.08);
  padding: 16px 18px;
}

[data-template-id="servora"] .servora-info-line span {
  display: block;
  color: var(--servora-muted);
  font-size: 0.86rem;
  font-weight: 850;
}

[data-template-id="servora"] .servora-info-line strong {
  display: block;
  margin-top: 4px;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-form-card {
  padding: 24px;
}

[data-template-id="servora"] .servora-form-card .servora-request-card {
  box-shadow: none;
  border-radius: 28px;
  background: transparent;
  border: 0;
  padding: 0;
}

[data-template-id="servora"] .servora-footer {
  padding: 34px 0 46px;
}

[data-template-id="servora"] .servora-footer-inner {
  border-top: 1px solid rgba(17, 24, 39, 0.10);
  padding-top: 24px;
  color: var(--servora-muted);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  font-weight: 750;
}

[data-template-id="servora"] .servora-footer-brand {
  display: grid;
  gap: 5px;
}

[data-template-id="servora"] .servora-footer-brand strong {
  color: var(--servora-dark);
  font-size: 1.08rem;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-footer-brand span {
  color: var(--servora-muted);
  font-size: 0.92rem;
}

[data-template-id="servora"] .servora-footer-contact {
  display: grid;
  justify-items: end;
  gap: 5px;
}

[data-template-id="servora"] .servora-footer-contact strong {
  color: var(--servora-dark);
  font-size: 1.05rem;
}

[data-template-id="servora"] .servora-footer-bottom {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(17, 24, 39, 0.08);
  color: var(--servora-muted);
  font-weight: 750;
  font-size: 0.92rem;
}

[data-template-id="servora"] .servora-page-hero {
  padding: 72px 0 34px;
}

[data-template-id="servora"] .servora-page-hero-inner {
  border-radius: 44px;
  background:
    radial-gradient(circle at 20% 10%, rgba(255, 106, 26, 0.20), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.50));
  border: 1px solid rgba(255, 255, 255, 0.82);
  padding: clamp(34px, 6vw, 72px);
  box-shadow: 0 30px 90px rgba(17, 24, 39, 0.08);
}

[data-template-id="servora"] .servora-page-title {
  margin: 18px 0 0;
  max-width: 880px;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-page-text {
  margin: 24px 0 0;
  max-width: 720px;
  color: var(--servora-muted);
  font-size: 1.1rem;
  line-height: 1.85;
}

[data-template-id="servora"] .servora-reveal {
  animation: servoraFadeUp 0.82s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="servora"] .servora-delay-1 {
  animation-delay: 0.04s;
}

[data-template-id="servora"] .servora-delay-2 {
  animation-delay: 0.12s;
}

[data-template-id="servora"] .servora-delay-3 {
  animation-delay: 0.20s;
}

[data-template-id="servora"] .servora-delay-4 {
  animation-delay: 0.28s;
}

[data-template-id="servora"] .servora-media-card::after,
[data-template-id="servora"] .servora-project-image::after,
[data-template-id="servora"] .servora-feature-image::after {
  pointer-events: none !important;
}

[data-template-id="servora"] .servora-tool-badge,
[data-template-id="servora"] .servora-emergency-card,
[data-template-id="servora"] .servora-quote-card,
[data-template-id="servora"] .servora-floating-rating-card,
[data-template-id="servora"] .servora-feature-image-badge {
  pointer-events: none !important;
}

/* FREE MOVE SUPPORT FOR EDITOR */
[data-template-id="servora"] .servora-free-move-element {
  cursor: move;
  will-change: top, right, bottom, left, transform;
}

[data-template-id="servora"] .servora-free-move-element:hover {
  outline: 2px dashed rgba(37, 99, 235, 0.65);
  outline-offset: 6px;
}

[data-template-id="servora"][data-template-mode="editor"] .servora-request-card-float,
[data-template-id="servora"] .gjs-selected.servora-request-card-float {
  animation: none !important;
  transform: none !important;
}

[data-template-id="servora"][data-template-mode="editor"] .servora-request-card-float {
  pointer-events: auto !important;
}

@keyframes servoraFadeUp {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    filter: blur(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes servoraCardEnter {
  from {
    opacity: 0;
    transform: translateY(42px) scale(0.94);
    filter: blur(12px);
  }

  62% {
    opacity: 1;
    transform: translateY(-8px) scale(1.018);
    filter: blur(0);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes servoraNumberPop {
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.72);
    filter: blur(8px);
  }

  58% {
    opacity: 1;
    transform: translateY(-10px) scale(1.18);
    filter: blur(0);
  }

  78% {
    transform: translateY(4px) scale(0.96);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes servoraFloat {
  0%, 100% {
    transform: translateY(0) rotate(1deg);
  }

  50% {
    transform: translateY(-15px) rotate(-1.4deg);
  }
}

@keyframes servoraPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(0.72);
    opacity: 0.72;
  }
}

@media (max-width: 1080px) {
  [data-template-id="servora"] .servora-header-inner {
    border-radius: 28px;
    flex-wrap: wrap;
  }

  [data-template-id="servora"] .servora-header-actions {
    margin-inline-start: auto;
  }

  [data-template-id="servora"] .servora-phone-pill {
    display: none;
  }

  [data-template-id="servora"] .servora-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 4px 0;
  }

  [data-template-id="servora"] .servora-hero-grid,
  [data-template-id="servora"] .servora-handyman-hero-grid,
  [data-template-id="servora"] .servora-project-grid,
  [data-template-id="servora"] .servora-feature-grid,
  [data-template-id="servora"] .servora-testimonials,
  [data-template-id="servora"] .servora-contact-grid,
  [data-template-id="servora"] .servora-intro-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-hero-media {
    min-height: 620px;
  }

  [data-template-id="servora"] .servora-media-card,
  [data-template-id="servora"] .servora-handyman-media,
  [data-template-id="servora"] .servora-wide-media-card {
    inset: 0;
  }

  [data-template-id="servora"] .servora-request-card-float {
    right: 22px;
    bottom: 22px;
  }

  [data-template-id="servora"] .servora-services-grid,
  [data-template-id="servora"] .servora-pricing-grid,
  [data-template-id="servora"] .servora-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-template-id="servora"] .servora-process {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-cta {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-trust-strip-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  [data-template-id="servora"] .servora-trust-strip-title {
    white-space: normal;
  }

  [data-template-id="servora"] .servora-footer-inner {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-footer-contact {
    justify-items: start;
  }
}

@media (max-width: 720px) {
  [data-template-id="servora"] .servora-shell {
    width: min(100% - 24px, 1180px);
  }

  [data-template-id="servora"] .servora-header {
    padding-top: 10px;
  }

  [data-template-id="servora"] .servora-header-inner {
    padding: 12px;
  }

  [data-template-id="servora"] .servora-brand {
    min-width: auto;
  }

  [data-template-id="servora"] .servora-brand-label {
    display: none;
  }

  [data-template-id="servora"] .servora-header-cta {
    display: none;
  }

  [data-template-id="servora"] .servora-hero {
    padding-top: 42px;
  }

  [data-template-id="servora"] .servora-hero-title,
  [data-template-id="servora"] .servora-page-title {
    font-size: clamp(3.2rem, 17vw, 5rem);
  }

  [data-template-id="servora"] .servora-hero-actions {
    align-items: stretch;
  }

  [data-template-id="servora"] .servora-hero-actions .servora-btn {
    width: 100%;
  }

  [data-template-id="servora"] .servora-trust-row {
    display: grid;
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-hero-media {
    min-height: 690px;
  }

  [data-template-id="servora"] .servora-media-card,
  [data-template-id="servora"] .servora-handyman-media,
  [data-template-id="servora"] .servora-wide-media-card {
    inset: 0 0 210px 0;
    transform: none;
    border-radius: 34px;
    min-height: auto;
  }

  [data-template-id="servora"] .servora-request-card-float {
    right: 12px;
    left: 12px;
    bottom: 0;
    width: auto;
  }

  [data-template-id="servora"] .servora-floating-rating-card {
    right: 18px;
    top: 38px;
    width: 220px;
  }

  [data-template-id="servora"] .servora-trust-strip {
    margin-top: 0;
  }

  [data-template-id="servora"] .servora-logo-strip {
    width: 100%;
  }

  [data-template-id="servora"] .servora-logo-pill {
    flex: 1 1 auto;
    justify-content: center;
  }

  [data-template-id="servora"] .servora-stats-wrap {
    padding: 18px;
    border-radius: 30px;
  }

  [data-template-id="servora"] .servora-stats,
  [data-template-id="servora"] .servora-services-grid,
  [data-template-id="servora"] .servora-pricing-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-stat {
    min-height: 200px;
    border-radius: 28px;
  }

  [data-template-id="servora"] .servora-stat-number {
    font-size: clamp(3rem, 15vw, 4.4rem);
  }

  [data-template-id="servora"] .servora-project-image,
  [data-template-id="servora"] .servora-feature-image {
    min-height: 390px;
  }

  [data-template-id="servora"] .servora-feature-image-badge {
    right: 18px;
    bottom: 18px;
  }

  [data-template-id="servora"] .servora-section {
    padding: 64px 0;
  }

  [data-template-id="servora"] .servora-section-head {
    display: block;
  }

  [data-template-id="servora"] .servora-section-title {
    font-size: clamp(2.45rem, 11vw, 4rem);
  }

  [data-template-id="servora"] .servora-intro-card {
    min-height: 280px;
  }

  [data-template-id="servora"] .servora-cta-actions,
  [data-template-id="servora"] .servora-feature-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-cta-actions .servora-btn,
  [data-template-id="servora"] .servora-feature-actions .servora-btn {
    width: 100%;
  }

  [data-template-id="servora"] .servora-footer-inner {
    display: grid;
  }
}
`;