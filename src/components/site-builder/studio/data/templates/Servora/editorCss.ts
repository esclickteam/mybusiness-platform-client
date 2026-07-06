export const servoraEditorCss = `
[data-template-id="servora"],
[data-template-id="servora"] * {
  box-sizing: border-box;
}

[data-template-id="servora"] {
  --servora-bg: #fff8ef;
  --servora-surface: #ffffff;
  --servora-ink: #07111f;
  --servora-dark: #07111f;
  --servora-dark-2: #0d1b2f;
  --servora-muted: #667085;
  --servora-line: rgba(7, 17, 31, 0.12);
  --servora-orange: #ff6a1a;
  --servora-orange-2: #ff9f1c;
  --servora-yellow: #ffd166;
  --servora-green: #10b981;
  --servora-radius-xl: 34px;
  --servora-radius-lg: 24px;
  --servora-radius-md: 16px;
  direction: rtl;
  width: 100%;
  min-height: 100%;
  color: var(--servora-ink);
  background:
    radial-gradient(circle at 8% 8%, rgba(255, 106, 26, 0.12), transparent 24%),
    radial-gradient(circle at 88% 16%, rgba(255, 209, 102, 0.18), transparent 28%),
    linear-gradient(180deg, #fffaf3 0%, #fff8ef 48%, #ffffff 100%);
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
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
}

/* HEADER */
[data-template-id="servora"] .servora-header {
  position: sticky;
  top: 0;
  z-index: 90;
  padding: 16px 0 8px;
  background: linear-gradient(180deg, rgba(255, 248, 239, 0.96), rgba(255, 248, 239, 0.72));
  backdrop-filter: blur(18px);
}

[data-template-id="servora"] .servora-header-inner {
  min-height: 66px;
  border-radius: 22px;
  padding: 10px 12px 10px 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(7, 17, 31, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.09);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
}

[data-template-id="servora"] .servora-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: right;
}

[data-template-id="servora"] .servora-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #1d1208;
  background: linear-gradient(135deg, var(--servora-orange), var(--servora-yellow));
  box-shadow: 0 14px 28px rgba(255, 106, 26, 0.28);
  font-weight: 1000;
}

[data-template-id="servora"] .servora-brand-name {
  display: block;
  color: var(--servora-dark);
  font-weight: 1000;
  font-size: 1.28rem;
  letter-spacing: -0.06em;
  line-height: 1;
}

[data-template-id="servora"] .servora-brand-label {
  display: block;
  margin-top: 4px;
  color: var(--servora-muted);
  font-size: 0.76rem;
  font-weight: 800;
}

[data-template-id="servora"] .servora-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

[data-template-id="servora"] .servora-nav-link {
  padding: 10px 14px;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  color: rgba(7, 17, 31, 0.82);
  font-weight: 850;
  white-space: nowrap;
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

[data-template-id="servora"] .servora-nav-link:hover,
[data-template-id="servora"] .servora-nav-link.is-active {
  background: rgba(255, 106, 26, 0.11);
  color: var(--servora-dark);
  transform: translateY(-1px);
}

[data-template-id="servora"] .servora-header-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

[data-template-id="servora"] .servora-phone-pill {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(7, 17, 31, 0.10);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 28px rgba(7, 17, 31, 0.06);
  color: var(--servora-dark);
  font-weight: 950;
}

/* BUTTONS */
[data-template-id="servora"] .servora-btn {
  min-height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  cursor: pointer;
  font-weight: 950;
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
}

[data-template-id="servora"] .servora-btn:hover {
  transform: translateY(-2px);
}

[data-template-id="servora"] .servora-btn-orange {
  color: #1d1208;
  background: linear-gradient(135deg, var(--servora-orange), var(--servora-yellow));
  box-shadow: 0 18px 38px rgba(255, 106, 26, 0.22);
}

[data-template-id="servora"] .servora-btn-light {
  color: var(--servora-dark);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(7, 17, 31, 0.10);
}

[data-template-id="servora"] .servora-btn-dark-light {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

/* HERO */
[data-template-id="servora"] .servora-hero {
  position: relative;
  padding: 42px 0 24px;
}

[data-template-id="servora"] .servora-electric-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 106, 26, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 106, 26, 0.045) 1px, transparent 1px);
  background-size: 68px 68px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 86%);
  pointer-events: none;
}

[data-template-id="servora"] .servora-hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(640px, 1.18fr) minmax(0, 0.82fr);
  align-items: center;
  gap: 54px;
}

[data-template-id="servora"] .servora-hero-content {
  order: 1;
  max-width: 610px;
}

[data-template-id="servora"] .servora-hero-media {
  order: 2;
  position: relative;
  min-height: 520px;
  width: 100%;
}

[data-template-id="servora"] .servora-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 0 13px;
  border-radius: 999px;
  border: 1px solid rgba(255, 106, 26, 0.34);
  background: rgba(255, 255, 255, 0.78);
  color: #d9480f;
  font-size: 0.78rem;
  font-weight: 950;
}

[data-template-id="servora"] .servora-eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--servora-orange);
}

[data-template-id="servora"] .servora-hero-title {
  margin: 18px 0 0;
  color: var(--servora-dark);
  font-size: clamp(3.7rem, 6vw, 6.55rem);
  line-height: 0.93;
  letter-spacing: -0.08em;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-highlight {
  display: block;
  margin-top: 6px;
  background: linear-gradient(90deg, var(--servora-orange) 0%, #ff8a00 45%, #8a9f25 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

[data-template-id="servora"] .servora-hero-bullets {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: grid;
  gap: 9px;
  color: rgba(7, 17, 31, 0.78);
  font-weight: 850;
}

[data-template-id="servora"] .servora-hero-bullets li {
  display: flex;
  align-items: center;
  gap: 10px;
}

[data-template-id="servora"] .servora-hero-bullets li::before {
  content: "✓";
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #047857;
  background: rgba(16, 185, 129, 0.10);
  font-size: 0.86rem;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

[data-template-id="servora"] .servora-media-card {
  position: absolute;
  inset: 0;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(7, 17, 31, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.76);
  background: #ddd;
}

[data-template-id="servora"] .servora-media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(7, 17, 31, 0.45));
  pointer-events: none;
}

[data-template-id="servora"] .servora-media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

[data-template-id="servora"] .servora-rating-card {
  position: absolute;
  z-index: 9;
  top: 46px;
  right: 34px !important;
  left: auto !important;
  width: 245px;
  border-radius: 18px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(7, 17, 31, 0.08);
  box-shadow: 0 24px 50px rgba(7, 17, 31, 0.13);
  backdrop-filter: blur(14px);
}

[data-template-id="servora"] .servora-stars {
  display: block;
  color: #f59e0b;
  letter-spacing: 0.04em;
  font-weight: 1000;
  margin-bottom: 10px;
}

[data-template-id="servora"] .servora-rating-card strong {
  display: block;
  color: var(--servora-dark);
  font-size: 1.05rem;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-rating-card p {
  margin: 6px 0 0;
  color: var(--servora-muted);
  line-height: 1.5;
  font-weight: 750;
  font-size: 0.87rem;
}

[data-template-id="servora"] .servora-request-card {
  position: relative;
  border-radius: 24px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(7, 17, 31, 0.09);
  box-shadow: 0 30px 70px rgba(7, 17, 31, 0.15);
  backdrop-filter: blur(14px);
}

[data-template-id="servora"] .servora-request-card-float {
  position: absolute;
  z-index: 10;
  right: 34px !important;
  left: auto !important;
  bottom: 34px;
  width: 360px;
  max-width: calc(100% - 68px);
  animation: servoraFloat 6s ease-in-out infinite;
  cursor: move;
}

[data-template-id="servora"] .servora-request-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

[data-template-id="servora"] .servora-request-card h3 {
  margin: 0;
  color: var(--servora-dark);
  font-size: 1.22rem;
  line-height: 1.15;
  letter-spacing: -0.04em;
}

[data-template-id="servora"] .servora-request-card p {
  margin: 6px 0 0;
  color: var(--servora-muted);
  font-size: 0.86rem;
  line-height: 1.45;
  font-weight: 750;
}

[data-template-id="servora"] .servora-request-icon {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--servora-orange), var(--servora-yellow));
  box-shadow: 0 16px 30px rgba(255, 106, 26, 0.24);
  font-weight: 1000;
  flex: 0 0 auto;
}

[data-template-id="servora"] .servora-request-form {
  display: grid;
  gap: 10px;
}

[data-template-id="servora"] .servora-request-form input,
[data-template-id="servora"] .servora-request-form select {
  width: 100%;
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(7, 17, 31, 0.11);
  background: rgba(255, 250, 244, 0.86);
  padding: 0 13px;
  color: var(--servora-ink);
  outline: none;
  direction: rtl;
  text-align: right;
}

[data-template-id="servora"] .servora-request-form input::placeholder {
  direction: rtl;
  text-align: right;
  color: rgba(7, 17, 31, 0.42);
}

[data-template-id="servora"] .servora-request-form input[type="tel"] {
  direction: rtl;
  text-align: right;
  unicode-bidi: plaintext;
}

[data-template-id="servora"] .servora-request-submit {
  width: 100%;
  min-height: 44px;
  margin-top: 2px;
}

/* TRUST PILLS */
[data-template-id="servora"] .servora-trust-strip {
  padding: 16px 0 34px;
}

[data-template-id="servora"] .servora-trust-pills {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

[data-template-id="servora"] .servora-logo-pill {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(7, 17, 31, 0.10);
  color: rgba(7, 17, 31, 0.82);
  font-weight: 850;
  box-shadow: 0 12px 28px rgba(7, 17, 31, 0.05);
}

[data-template-id="servora"] .servora-logo-pill::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--servora-orange);
}

/* GENERAL */
[data-template-id="servora"] .servora-section {
  padding: 72px 0;
}

[data-template-id="servora"] .servora-section-tight {
  padding: 34px 0;
}

[data-template-id="servora"] .servora-section-head {
  max-width: 720px;
  margin: 0 auto 34px;
  text-align: center;
}

[data-template-id="servora"] .servora-section-title {
  margin: 12px 0 0;
  color: var(--servora-dark);
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.05;
  letter-spacing: -0.075em;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-section-text {
  margin: 14px auto 0;
  max-width: 650px;
  color: var(--servora-muted);
  line-height: 1.75;
  font-weight: 650;
}

/* PROOF */
[data-template-id="servora"] .servora-proof-section {
  padding-top: 18px;
  padding-bottom: 42px;
}

[data-template-id="servora"] .servora-proof-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 22px;
  align-items: stretch;
}

[data-template-id="servora"] .servora-emergency-panel {
  position: relative;
  min-height: 220px;
  border-radius: 20px;
  overflow: hidden;
  padding: 32px;
  color: #ffffff;
  background:
    radial-gradient(circle at 18% 24%, rgba(255, 106, 26, 0.32), transparent 33%),
    linear-gradient(135deg, #07111f, #0d1b2f 64%, #2c160f);
  box-shadow: 0 24px 70px rgba(7, 17, 31, 0.14);
}

[data-template-id="servora"] .servora-neon-bolt {
  display: block;
  color: var(--servora-orange);
  font-size: 4rem;
  line-height: 1;
  text-shadow: 0 0 24px rgba(255, 106, 26, 0.8);
  margin-bottom: 12px;
}

[data-template-id="servora"] .servora-emergency-panel h2,
[data-template-id="servora"] .servora-proof-card h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  line-height: 1.05;
  letter-spacing: -0.06em;
}

[data-template-id="servora"] .servora-emergency-panel p {
  margin: 14px 0 22px;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.7;
  font-weight: 650;
}

[data-template-id="servora"] .servora-dark-phone {
  display: inline-flex;
  min-height: 38px;
  padding: 0 16px;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  font-weight: 950;
}

[data-template-id="servora"] .servora-proof-card {
  min-height: 220px;
  border-radius: 20px;
  padding: 34px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(7, 17, 31, 0.09);
  box-shadow: 0 24px 70px rgba(7, 17, 31, 0.08);
}

[data-template-id="servora"] .servora-large-icon {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--servora-orange);
  background: rgba(255, 106, 26, 0.09);
  font-size: 2.6rem;
}

[data-template-id="servora"] .servora-proof-card p {
  margin: 12px 0 0;
  color: var(--servora-muted);
  line-height: 1.75;
  font-weight: 650;
}

/* STATS */
[data-template-id="servora"] .servora-stats-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background:
    radial-gradient(circle at 0% 100%, rgba(255, 106, 26, 0.32), transparent 22%),
    radial-gradient(circle at 100% 70%, rgba(255, 106, 26, 0.22), transparent 24%),
    linear-gradient(135deg, #07111f, #0b1628 55%, #2b1b19);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 24px 70px rgba(7, 17, 31, 0.16);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

[data-template-id="servora"] .servora-stat {
  position: relative;
  min-height: 146px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  text-align: center;
  color: #ffffff;
  padding: 22px 12px;
}

[data-template-id="servora"] .servora-stat:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 26px;
  bottom: 26px;
  width: 1px;
  background: rgba(255, 255, 255, 0.22);
}

[data-template-id="servora"] .servora-stat-icon {
  color: var(--servora-orange);
  font-size: 2rem;
  line-height: 1;
}

[data-template-id="servora"] .servora-stat-number {
  color: #ffffff;
  font-size: clamp(2rem, 3.6vw, 3.2rem);
  line-height: 1;
  letter-spacing: -0.055em;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-stat-label {
  color: rgba(255, 255, 255, 0.80);
  font-weight: 850;
  font-size: 0.95rem;
}

/* SERVICES */
[data-template-id="servora"] .servora-services-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

[data-template-id="servora"] .servora-service-card {
  min-height: 190px;
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(7, 17, 31, 0.10);
  box-shadow: 0 18px 46px rgba(7, 17, 31, 0.07);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

[data-template-id="servora"] .servora-service-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 106, 26, 0.34);
  box-shadow: 0 24px 58px rgba(255, 106, 26, 0.12);
}

[data-template-id="servora"] .servora-service-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: rgba(255, 106, 26, 0.10);
  color: var(--servora-orange);
  font-weight: 1000;
  margin-bottom: 18px;
}

[data-template-id="servora"] .servora-service-card h3 {
  margin: 0;
  color: var(--servora-dark);
  font-size: 1.08rem;
  letter-spacing: -0.035em;
}

[data-template-id="servora"] .servora-service-card p {
  margin: 10px 0 16px;
  color: var(--servora-muted);
  font-size: 0.88rem;
  line-height: 1.6;
  font-weight: 650;
}

[data-template-id="servora"] .servora-service-arrow {
  color: var(--servora-orange);
  background: transparent;
  cursor: pointer;
  padding: 0;
  font-weight: 950;
}

/* FEATURE */
[data-template-id="servora"] .servora-feature-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 22px;
  align-items: stretch;
}

[data-template-id="servora"] .servora-feature-content {
  border-radius: 24px;
  padding: 42px;
  color: #ffffff;
  background:
    radial-gradient(circle at 15% 8%, rgba(255, 106, 26, 0.24), transparent 32%),
    linear-gradient(135deg, #07111f, #0d1b2f 68%, #2b1b19);
  box-shadow: 0 26px 80px rgba(7, 17, 31, 0.16);
}

[data-template-id="servora"] .servora-feature-content h2 {
  margin: 16px 0;
  font-size: clamp(2rem, 4vw, 3.9rem);
  line-height: 1.04;
  letter-spacing: -0.075em;
}

[data-template-id="servora"] .servora-feature-content p {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.75;
  font-weight: 650;
}

[data-template-id="servora"] .servora-check-list {
  margin-top: 22px;
  display: grid;
  gap: 11px;
}

[data-template-id="servora"] .servora-check {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.90);
  font-weight: 850;
}

[data-template-id="servora"] .servora-check::before {
  content: "✓";
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--servora-orange);
  color: #1d1208;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-feature-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
}

[data-template-id="servora"] .servora-feature-image {
  position: relative;
  min-height: 420px;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 26px 80px rgba(7, 17, 31, 0.13);
}

[data-template-id="servora"] .servora-feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-template-id="servora"] .servora-feature-image-badge {
  position: absolute;
  left: 24px;
  bottom: 24px;
  min-width: 130px;
  border-radius: 16px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(7, 17, 31, 0.14);
}

[data-template-id="servora"] .servora-feature-image-badge strong {
  display: block;
  font-size: 1.8rem;
  color: var(--servora-dark);
  line-height: 1;
}

[data-template-id="servora"] .servora-feature-image-badge span {
  display: block;
  margin-top: 6px;
  color: var(--servora-muted);
  font-weight: 850;
}

/* PROCESS */
[data-template-id="servora"] .servora-process-line {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  align-items: start;
}

[data-template-id="servora"] .servora-step {
  position: relative;
  text-align: center;
  padding: 8px 10px;
}

[data-template-id="servora"] .servora-step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 34px;
  left: -20px;
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, rgba(7, 17, 31, 0.22), rgba(255, 106, 26, 0.6));
}

[data-template-id="servora"] .servora-step-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.82);
  color: var(--servora-orange);
  border: 1px solid rgba(7, 17, 31, 0.08);
  box-shadow: 0 14px 34px rgba(7, 17, 31, 0.07);
  font-size: 1.6rem;
}

[data-template-id="servora"] .servora-step h3 {
  margin: 0;
  color: var(--servora-dark);
  font-size: 1.05rem;
}

[data-template-id="servora"] .servora-step p {
  margin: 8px 0 0;
  color: var(--servora-muted);
  font-size: 0.86rem;
  line-height: 1.55;
  font-weight: 650;
}

/* TESTIMONIALS */
[data-template-id="servora"] .servora-testimonials-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 18px;
}

[data-template-id="servora"] .servora-testimonial-main,
[data-template-id="servora"] .servora-mini-testimonial {
  border-radius: 18px;
  padding: 26px;
  min-height: 180px;
  background: rgba(255, 255, 255, 0.80);
  border: 1px solid rgba(7, 17, 31, 0.10);
  box-shadow: 0 18px 50px rgba(7, 17, 31, 0.07);
}

[data-template-id="servora"] .servora-testimonial-main {
  color: #ffffff;
  background: linear-gradient(135deg, #07111f, #0d1b2f);
}

[data-template-id="servora"] .servora-testimonial-main p,
[data-template-id="servora"] .servora-mini-testimonial p {
  margin: 12px 0 18px;
  line-height: 1.65;
  font-weight: 750;
}

[data-template-id="servora"] .servora-mini-testimonial p {
  color: var(--servora-muted);
}

/* PRICING */
[data-template-id="servora"] .servora-pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  max-width: 860px;
  margin: 0 auto;
}

[data-template-id="servora"] .servora-price-card {
  position: relative;
  border-radius: 18px;
  padding: 26px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(7, 17, 31, 0.10);
  box-shadow: 0 20px 56px rgba(7, 17, 31, 0.08);
}

[data-template-id="servora"] .servora-price-card.is-popular {
  border-color: var(--servora-orange);
  box-shadow: 0 24px 70px rgba(255, 106, 26, 0.13);
}

[data-template-id="servora"] .servora-popular-badge {
  position: absolute;
  top: -15px;
  right: 50%;
  transform: translateX(50%);
  min-height: 30px;
  padding: 0 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--servora-orange), var(--servora-yellow));
  display: inline-flex;
  align-items: center;
  color: #1d1208;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-price-title {
  color: #d9480f;
  font-weight: 950;
}

[data-template-id="servora"] .servora-price-card strong {
  display: block;
  margin: 14px 0 8px;
  color: var(--servora-dark);
  font-size: 2.5rem;
  line-height: 1;
  letter-spacing: -0.055em;
}

[data-template-id="servora"] .servora-price-card p {
  color: var(--servora-muted);
  line-height: 1.55;
  font-weight: 650;
}

[data-template-id="servora"] .servora-price-card ul {
  padding: 0;
  margin: 16px 0 24px;
  list-style: none;
  display: grid;
  gap: 9px;
}

[data-template-id="servora"] .servora-price-card li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(7, 17, 31, 0.76);
  font-weight: 750;
}

[data-template-id="servora"] .servora-price-card li::before {
  content: "✓";
  color: #16a34a;
  font-weight: 1000;
}

[data-template-id="servora"] .servora-price-card .servora-btn {
  margin-top: auto;
}

/* FAQ */
[data-template-id="servora"] .servora-faq {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
}

[data-template-id="servora"] .servora-faq-item {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(7, 17, 31, 0.10);
  box-shadow: 0 14px 36px rgba(7, 17, 31, 0.05);
  overflow: hidden;
}

[data-template-id="servora"] .servora-faq-item summary {
  cursor: pointer;
  padding: 18px 22px;
  font-weight: 950;
  color: var(--servora-dark);
}

[data-template-id="servora"] .servora-faq-item p {
  margin: 0;
  padding: 0 22px 18px;
  color: var(--servora-muted);
  line-height: 1.65;
}

/* CTA + CONTACT */
[data-template-id="servora"] .servora-cta {
  border-radius: 20px;
  padding: 42px 50px;
  color: #ffffff;
  background:
    radial-gradient(circle at 94% 20%, rgba(255, 106, 26, 0.30), transparent 25%),
    linear-gradient(135deg, #07111f, #0d1b2f 70%, #2b1b19);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  box-shadow: 0 24px 70px rgba(7, 17, 31, 0.15);
}

[data-template-id="servora"] .servora-cta h2 {
  margin: 12px 0 0;
  font-size: clamp(2rem, 4vw, 3.7rem);
  line-height: 1;
  letter-spacing: -0.07em;
}

[data-template-id="servora"] .servora-cta p {
  color: rgba(255, 255, 255, 0.72);
  margin: 12px 0 0;
}

[data-template-id="servora"] .servora-cta-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

[data-template-id="servora"] .servora-contact-grid {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 22px;
}

[data-template-id="servora"] .servora-contact-panel,
[data-template-id="servora"] .servora-form-card {
  border-radius: 24px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(7, 17, 31, 0.10);
  box-shadow: 0 20px 56px rgba(7, 17, 31, 0.08);
}

[data-template-id="servora"] .servora-contact-panel h2 {
  margin: 0;
  color: var(--servora-dark);
  font-size: 2.4rem;
  line-height: 1.05;
  letter-spacing: -0.065em;
}

[data-template-id="servora"] .servora-contact-info {
  display: grid;
  gap: 9px;
  margin-top: 20px;
  color: var(--servora-muted);
  font-weight: 850;
}

/* FOOTER */
[data-template-id="servora"] .servora-footer {
  padding: 24px 0 44px;
}

[data-template-id="servora"] .servora-footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.85fr 0.95fr;
  gap: 30px;
  padding: 34px;
  color: #ffffff;
  background:
    radial-gradient(circle at 94% 12%, rgba(255, 106, 26, 0.24), transparent 24%),
    linear-gradient(135deg, #07111f, #0b1628 70%, #2b1b19);
  border-radius: 22px 22px 0 0;
}

[data-template-id="servora"] .servora-footer-brand,
[data-template-id="servora"] .servora-footer-contact {
  display: grid;
  gap: 10px;
  align-content: start;
}

[data-template-id="servora"] .servora-footer-brand strong {
  font-size: 1.65rem;
  line-height: 1.1;
}

[data-template-id="servora"] .servora-footer-brand span,
[data-template-id="servora"] .servora-footer-contact span {
  color: rgba(255, 255, 255, 0.70);
}

[data-template-id="servora"] .servora-footer-brand b {
  color: var(--servora-orange);
  font-size: 1.2rem;
}

[data-template-id="servora"] .servora-footer-mini-form .servora-request-card {
  box-shadow: none;
  padding: 18px;
}

[data-template-id="servora"] .servora-footer-bottom {
  min-height: 58px;
  padding: 0 28px;
  border-radius: 0 0 22px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.76);
  background: #07111f;
}

[data-template-id="servora"] .servora-footer-bottom nav {
  display: flex;
  gap: 8px;
}

[data-template-id="servora"] .servora-footer-bottom button {
  color: rgba(255, 255, 255, 0.78);
  background: transparent;
  cursor: pointer;
  font-weight: 800;
}

/* PAGE HERO */
[data-template-id="servora"] .servora-page-hero {
  padding: 58px 0 20px;
}

[data-template-id="servora"] .servora-page-hero-inner {
  border-radius: 24px;
  padding: 54px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(7, 17, 31, 0.09);
  box-shadow: 0 18px 54px rgba(7, 17, 31, 0.06);
}

[data-template-id="servora"] .servora-page-title {
  margin: 14px 0 0;
  color: var(--servora-dark);
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 0.95;
  letter-spacing: -0.08em;
}

[data-template-id="servora"] .servora-page-text {
  max-width: 720px;
  color: var(--servora-muted);
  line-height: 1.75;
}


/* HERO IMAGE FULL WIDTH FIX */
[data-template-id="servora"] .servora-hero-media,
[data-template-id="servora"] .servora-media-card {
  width: 100%;
}

[data-template-id="servora"] .servora-media-card {
  inset-inline-start: 0 !important;
  inset-inline-end: 0 !important;
}

/* EDITOR MOVE SUPPORT */
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

/* HERO FORM POSITION — MATCH MOCKUP */
[data-template-id="servora"] .servora-request-card-float {
  border-radius: 22px;
  padding: 18px;
}

[data-template-id="servora"] .servora-request-card-float .servora-request-card-head {
  gap: 10px;
  margin-bottom: 12px;
}

[data-template-id="servora"] .servora-request-card-float h3 {
  font-size: 1rem;
}

[data-template-id="servora"] .servora-request-card-float p {
  font-size: 0.78rem;
}

[data-template-id="servora"] .servora-request-card-float .servora-request-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  font-size: 1rem;
}

[data-template-id="servora"] .servora-request-card-float input,
[data-template-id="servora"] .servora-request-card-float select {
  min-height: 38px;
  border-radius: 12px;
  font-size: 0.82rem;
}

[data-template-id="servora"] .servora-request-card-float .servora-request-submit {
  min-height: 40px;
  font-size: 0.84rem;
}

/* ANIMATION */
[data-template-id="servora"] .servora-reveal {
  animation: servoraFadeUp 0.72s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="servora"] .servora-delay-1 { animation-delay: 0.08s; }
[data-template-id="servora"] .servora-delay-2 { animation-delay: 0.16s; }
[data-template-id="servora"] .servora-delay-3 { animation-delay: 0.24s; }
[data-template-id="servora"] .servora-delay-4 { animation-delay: 0.32s; }

@keyframes servoraFloat {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes servoraFadeUp {
  from { opacity: 0; transform: translateY(28px); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* RESPONSIVE */
@media (max-width: 1180px) {
  [data-template-id="servora"] .servora-hero-grid,
  [data-template-id="servora"] .servora-proof-grid,
  [data-template-id="servora"] .servora-feature-grid,
  [data-template-id="servora"] .servora-contact-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-hero-content,
  [data-template-id="servora"] .servora-hero-media {
    order: initial;
  }

  [data-template-id="servora"] .servora-hero-media {
    min-height: 560px;
    width: 100%;
  }

  [data-template-id="servora"] .servora-services-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  [data-template-id="servora"] .servora-stats-wrap,
  [data-template-id="servora"] .servora-process-line {
    grid-template-columns: repeat(3, 1fr);
  }

  [data-template-id="servora"] .servora-testimonials-grid,
  [data-template-id="servora"] .servora-pricing-grid,
  [data-template-id="servora"] .servora-footer-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-step::after {
    display: none;
  }
}

@media (max-width: 760px) {
  [data-template-id="servora"] .servora-shell {
    width: min(100% - 24px, 1280px);
  }

  [data-template-id="servora"] .servora-header-inner {
    grid-template-columns: 1fr auto;
    border-radius: 18px;
  }

  [data-template-id="servora"] .servora-nav {
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  [data-template-id="servora"] .servora-phone-pill,
  [data-template-id="servora"] .servora-header-cta {
    display: none;
  }

  [data-template-id="servora"] .servora-hero {
    padding-top: 26px;
  }

  [data-template-id="servora"] .servora-hero-title {
    font-size: clamp(3rem, 15vw, 4.8rem);
  }

  [data-template-id="servora"] .servora-hero-media {
    min-height: 650px;
  }

  [data-template-id="servora"] .servora-media-card {
    inset: 0 0 180px 0;
    width: 100%;
  }

  [data-template-id="servora"] .servora-rating-card {
    right: 14px !important;
    left: auto !important;
    top: 28px;
    width: 220px;
  }

  [data-template-id="servora"] .servora-request-card-float {
    right: 14px !important;
    left: 14px !important;
    bottom: 0;
    width: auto;
    max-width: none;
  }

  [data-template-id="servora"] .servora-proof-card {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-stats-wrap,
  [data-template-id="servora"] .servora-services-grid,
  [data-template-id="servora"] .servora-process-line,
  [data-template-id="servora"] .servora-pricing-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="servora"] .servora-stat:not(:last-child)::after {
    display: none;
  }

  [data-template-id="servora"] .servora-section {
    padding: 54px 0;
  }

  [data-template-id="servora"] .servora-cta,
  [data-template-id="servora"] .servora-footer-bottom {
    grid-template-columns: 1fr;
    display: grid;
  }

  [data-template-id="servora"] .servora-cta {
    padding: 32px;
  }
}





/* FINAL HERO IMAGE EXACT RATIO — DO NOT REMOVE */
[data-template-id="servora"] .servora-electric-hero .servora-shell {
  width: min(1760px, calc(100% - 40px)) !important;
  max-width: none !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-hero-grid {
  display: grid !important;
  grid-template-columns: minmax(920px, 1.45fr) minmax(430px, 0.55fr) !important;
  gap: clamp(42px, 5vw, 96px) !important;
  align-items: center !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-hero-media {
  order: 1 !important;
  position: relative !important;
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  aspect-ratio: 16 / 9 !important;
  height: auto !important;
  min-height: 0 !important;
  overflow: visible !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-media-card {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  max-width: none !important;
  height: 100% !important;
  min-height: 0 !important;
  border-radius: 34px !important;
  overflow: hidden !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-media-card img {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-rating-card {
  right: 56px !important;
  left: auto !important;
  top: 54px !important;
  width: 260px !important;
  max-width: calc(100% - 112px) !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-request-card-float {
  right: 56px !important;
  left: auto !important;
  bottom: 56px !important;
  width: 360px !important;
  max-width: calc(100% - 112px) !important;
  border-radius: 24px !important;
  padding: 18px !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-request-card-float .servora-request-form input,
[data-template-id="servora"] .servora-electric-hero .servora-request-card-float .servora-request-form select {
  min-height: 40px !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-request-card-float .servora-request-submit {
  min-height: 42px !important;
}

@media (max-width: 1180px) {
  [data-template-id="servora"] .servora-electric-hero .servora-shell {
    width: min(100% - 32px, 1180px) !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-hero-grid {
    grid-template-columns: 1fr !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-hero-media {
    aspect-ratio: 16 / 9 !important;
    height: auto !important;
    min-height: 0 !important;
  }
}

@media (max-width: 760px) {
  [data-template-id="servora"] .servora-electric-hero .servora-hero-media {
    aspect-ratio: auto !important;
    min-height: 680px !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-media-card {
    inset: 0 0 210px 0 !important;
    height: auto !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-rating-card {
    right: 18px !important;
    left: auto !important;
    top: 24px !important;
    width: 220px !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-request-card-float {
    right: 18px !important;
    left: 18px !important;
    bottom: 0 !important;
    width: auto !important;
    max-width: none !important;
  }
}


/* FINAL HERO SIDE SWAP — IMAGE LEFT */
[data-template-id="servora"] .servora-electric-hero .servora-hero-media {
  order: 0 !important;
}

[data-template-id="servora"] .servora-electric-hero .servora-hero-content {
  order: 1 !important;
}

@media (max-width: 1180px) {
  [data-template-id="servora"] .servora-electric-hero .servora-hero-media {
    order: 0 !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-hero-content {
    order: 1 !important;
  }
}

@media (max-width: 760px) {
  [data-template-id="servora"] .servora-electric-hero .servora-hero-content {
    order: 0 !important;
  }

  [data-template-id="servora"] .servora-electric-hero .servora-hero-media {
    order: 1 !important;
  }
}

`;
