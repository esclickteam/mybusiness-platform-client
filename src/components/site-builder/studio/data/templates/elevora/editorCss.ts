export const elevoraEditorCss = `
[data-template-id="elevora"],
[data-template-id="elevora"] * {
  box-sizing: border-box;
}

[data-template-id="elevora"] {
  --elevora-bg: #eef6ff;
  --elevora-surface: #ffffff;
  --elevora-dark: #050816;
  --elevora-ink: #070a1a;
  --elevora-text: #0b1020;
  --elevora-muted: #64748b;
  --elevora-line: rgba(15, 23, 42, 0.12);
  --elevora-blue: #2563eb;
  --elevora-cyan: #00c2ff;
  --elevora-sky: #38bdf8;
  --elevora-coral: #ff6b4a;
  --elevora-lime: #a3ff12;
  --elevora-soft: #dbeafe;
  --elevora-radius-xl: 38px;
  --elevora-radius-lg: 28px;
  --elevora-radius-md: 18px;
  direction: rtl;
  width: 100%;
  min-height: 100%;
  background:
    radial-gradient(circle at 86% 4%, rgba(0, 194, 255, 0.24), transparent 30%),
    radial-gradient(circle at 8% 24%, rgba(255, 107, 74, 0.11), transparent 25%),
    radial-gradient(circle at 14% 92%, rgba(37, 99, 235, 0.15), transparent 35%),
    linear-gradient(180deg, #fbfdff 0%, #f1f7ff 45%, #ffffff 100%);
  color: var(--elevora-text);
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
  font-synthesis: none;
  text-rendering: geometricPrecision;
}

[data-template-id="elevora"]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.62;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.075) 1px, transparent 1px);
  background-size: 58px 58px;
  mask-image: radial-gradient(circle at 50% 0%, black, transparent 72%);
}

[data-template-id="elevora"] button,
[data-template-id="elevora"] input,
[data-template-id="elevora"] textarea {
  font: inherit;
}

[data-template-id="elevora"] button {
  border: 0;
}

[data-template-id="elevora"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="elevora"] img {
  max-width: 100%;
  display: block;
}

[data-template-id="elevora"] .elevora-page {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-shell {
  width: min(1200px, calc(100% - 42px));
  margin: 0 auto;
}

[data-template-id="elevora"] .elevora-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 16px 0 10px;
  background: linear-gradient(180deg, rgba(238, 246, 255, 0.92), rgba(238, 246, 255, 0.62));
  backdrop-filter: blur(20px);
}

[data-template-id="elevora"] .elevora-header-inner {
  min-height: 74px;
  border: 1px solid rgba(255,255,255,0.72);
  background:
    linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,255,255,0.54));
  border-radius: 999px;
  box-shadow:
    0 24px 90px rgba(15, 23, 42, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 12px 14px 12px 20px;
}

[data-template-id="elevora"] .elevora-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 196px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

[data-template-id="elevora"] .elevora-brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 20% 20%, #ffffff, transparent 30%),
    linear-gradient(135deg, var(--elevora-cyan), #dbeafe 45%, var(--elevora-blue));
  color: var(--elevora-dark);
  display: grid;
  place-items: center;
  font-weight: 950;
  letter-spacing: -0.04em;
  box-shadow:
    0 18px 38px rgba(0, 194, 255, 0.27),
    inset 0 1px 0 rgba(255,255,255,0.75);
}

[data-template-id="elevora"] .elevora-brand-name {
  display: block;
  font-size: 1.06rem;
  font-weight: 950;
  line-height: 1;
  letter-spacing: -0.05em;
}

[data-template-id="elevora"] .elevora-brand-label {
  display: block;
  margin-top: 6px;
  color: var(--elevora-muted);
  font-size: 0.78rem;
  font-weight: 750;
}

[data-template-id="elevora"] .elevora-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

[data-template-id="elevora"] .elevora-nav-link {
  position: relative;
  padding: 11px 15px;
  border-radius: 999px;
  color: rgba(11, 16, 32, 0.72);
  background: transparent;
  cursor: pointer;
  font-weight: 850;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

[data-template-id="elevora"] .elevora-nav-link::after {
  content: "";
  position: absolute;
  right: 18px;
  left: 18px;
  bottom: 7px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--elevora-cyan), var(--elevora-coral));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.28s ease;
}

[data-template-id="elevora"] .elevora-nav-link:hover,
[data-template-id="elevora"] .elevora-nav-link.is-active {
  color: var(--elevora-dark);
  background: rgba(0, 194, 255, 0.12);
}

[data-template-id="elevora"] .elevora-nav-link:hover::after,
[data-template-id="elevora"] .elevora-nav-link.is-active::after {
  transform: scaleX(1);
}

[data-template-id="elevora"] .elevora-header-cta {
  min-width: 176px;
  justify-content: center;
}

[data-template-id="elevora"] .elevora-btn {
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
  isolation: isolate;
  transition:
    transform 0.26s ease,
    box-shadow 0.26s ease,
    border-color 0.26s ease,
    background 0.26s ease;
}

[data-template-id="elevora"] .elevora-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(110deg, transparent, rgba(255,255,255,0.42), transparent);
  transform: translateX(115%);
  transition: transform 0.75s ease;
}

[data-template-id="elevora"] .elevora-btn:hover::before {
  transform: translateX(-115%);
}

[data-template-id="elevora"] .elevora-btn:hover {
  transform: translateY(-4px);
}

[data-template-id="elevora"] .elevora-btn-primary {
  background:
    radial-gradient(circle at 20% 0%, rgba(0, 194, 255, 0.34), transparent 36%),
    linear-gradient(135deg, #050816, #111827 54%, #1e3a8a);
  color: #ffffff;
  box-shadow: 0 24px 58px rgba(15, 23, 42, 0.28);
}

[data-template-id="elevora"] .elevora-btn-primary:hover {
  box-shadow: 0 32px 82px rgba(37, 99, 235, 0.30);
}

[data-template-id="elevora"] .elevora-btn-gold {
  background:
    radial-gradient(circle at 18% 0%, rgba(255,255,255,0.64), transparent 38%),
    linear-gradient(135deg, var(--elevora-cyan), #bfdbfe 52%, var(--elevora-coral));
  color: #050816;
  box-shadow: 0 24px 58px rgba(0, 194, 255, 0.24);
}

[data-template-id="elevora"] .elevora-btn-outline,
[data-template-id="elevora"] .elevora-btn-glass {
  border: 1px solid rgba(255,255,255,0.72);
  background: rgba(255, 255, 255, 0.58);
  color: var(--elevora-text);
  backdrop-filter: blur(16px);
}

[data-template-id="elevora"] .elevora-hero {
  position: relative;
  padding: 86px 0 76px;
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-hero::before {
  content: "";
  position: absolute;
  width: 640px;
  height: 640px;
  top: -240px;
  left: -190px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 194, 255, 0.28), transparent 65%);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-hero::after {
  content: "";
  position: absolute;
  inset: 44px 3vw auto auto;
  width: min(46vw, 650px);
  height: 520px;
  border-radius: 42px;
  background:
    radial-gradient(circle at 20% 18%, rgba(0,194,255,0.22), transparent 30%),
    linear-gradient(135deg, rgba(5,8,22,0.96), rgba(15,23,42,0.84));
  box-shadow: 0 55px 160px rgba(15,23,42,0.22);
  transform: rotate(-4deg);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 0.96fr) minmax(410px, 1.04fr);
  gap: 52px;
  align-items: center;
}

[data-template-id="elevora"] .elevora-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  border: 1px solid rgba(0, 194, 255, 0.42);
  border-radius: 999px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.68);
  color: var(--elevora-blue);
  font-size: 0.88rem;
  font-weight: 950;
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.06);
}

[data-template-id="elevora"] .elevora-eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--elevora-cyan);
  box-shadow: 0 0 0 6px rgba(0, 194, 255, 0.16);
}

[data-template-id="elevora"] .elevora-hero-title {
  margin: 24px 0 0;
  max-width: 790px;
  font-size: clamp(3.35rem, 7.6vw, 7.65rem);
  line-height: 0.86;
  letter-spacing: -0.095em;
  font-weight: 980;
  color: var(--elevora-dark);
  text-wrap: balance;
}

[data-template-id="elevora"] .elevora-highlight {
  display: block;
  background: linear-gradient(90deg, var(--elevora-blue), var(--elevora-cyan) 56%, var(--elevora-coral));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

[data-template-id="elevora"] .elevora-hero-text {
  margin: 28px 0 0;
  max-width: 650px;
  font-size: 1.13rem;
  line-height: 1.9;
  color: var(--elevora-muted);
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-hero-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 13px;
}

[data-template-id="elevora"] .elevora-hero-trust {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 610px;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 24px;
  background: rgba(255,255,255,0.58);
  padding: 12px 14px;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 56px rgba(15,23,42,0.07);
}

[data-template-id="elevora"] .elevora-hero-avatars {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

[data-template-id="elevora"] .elevora-avatar {
  width: 38px;
  height: 38px;
  margin-inline-start: -10px;
  border-radius: 50%;
  border: 3px solid #f3f8ff;
  background:
    linear-gradient(135deg, rgba(0, 194, 255, 0.92), rgba(37, 99, 235, 0.95));
  box-shadow: 0 10px 20px rgba(15,23,42,0.16);
}

[data-template-id="elevora"] .elevora-avatar:first-child {
  margin-inline-start: 0;
}

[data-template-id="elevora"] .elevora-avatar-plus {
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 950;
  background: linear-gradient(135deg, var(--elevora-coral), #fb7185);
}

[data-template-id="elevora"] .elevora-trust-copy strong,
[data-template-id="elevora"] .elevora-trust-copy span {
  display: block;
}

[data-template-id="elevora"] .elevora-trust-copy strong {
  color: var(--elevora-dark);
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-trust-copy span {
  margin-top: 4px;
  color: var(--elevora-muted);
  font-size: 0.9rem;
  line-height: 1.55;
  font-weight: 700;
}

[data-template-id="elevora"] .elevora-hero-media {
  position: relative;
  min-height: 650px;
}

[data-template-id="elevora"] .elevora-media-card {
  position: absolute;
  inset: 32px 28px 28px 72px;
  border-radius: 48px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.72);
  box-shadow:
    0 52px 120px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255,255,255,0.7);
  transform: rotate(-2.4deg);
  isolation: isolate;
  background: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 28%, rgba(5, 8, 22, 0.72)),
    radial-gradient(circle at 18% 18%, rgba(0, 194, 255, 0.25), transparent 38%);
  z-index: 1;
}

[data-template-id="elevora"] .elevora-media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.9s cubic-bezier(.22,1,.36,1);
}

[data-template-id="elevora"] .elevora-media-card:hover img {
  transform: scale(1.12);
}

[data-template-id="elevora"] .elevora-media-overlay {
  position: absolute;
  right: 26px;
  left: 26px;
  bottom: 26px;
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  color: #fff;
}

[data-template-id="elevora"] .elevora-media-overlay span {
  max-width: 170px;
  color: rgba(255,255,255,0.72);
  font-size: 0.82rem;
  line-height: 1.45;
  font-weight: 850;
}

[data-template-id="elevora"] .elevora-media-overlay strong {
  font-size: 1.45rem;
  letter-spacing: -0.05em;
}

[data-template-id="elevora"] .elevora-dashboard-card {
  position: absolute;
  right: -4px;
  top: 58px;
  z-index: 5;
  width: 280px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.64);
  background: rgba(255,255,255,0.78);
  box-shadow: 0 34px 90px rgba(15,23,42,0.18);
  backdrop-filter: blur(22px);
  padding: 20px;
  animation: elevoraFloat 5.8s ease-in-out infinite;
}

[data-template-id="elevora"] .elevora-dash-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

[data-template-id="elevora"] .elevora-dash-top span {
  color: var(--elevora-muted);
  font-weight: 900;
  font-size: 0.82rem;
}

[data-template-id="elevora"] .elevora-dash-top strong {
  color: var(--elevora-dark);
  font-size: 2.15rem;
  line-height: 1;
  letter-spacing: -0.08em;
}

[data-template-id="elevora"] .elevora-dash-bars {
  height: 120px;
  margin-top: 18px;
  display: flex;
  align-items: end;
  gap: 10px;
  padding: 14px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(219,234,254,0.55), rgba(255,255,255,0.7));
}

[data-template-id="elevora"] .elevora-dash-bars span {
  flex: 1;
  border-radius: 999px 999px 8px 8px;
  background: linear-gradient(180deg, var(--elevora-cyan), var(--elevora-blue));
  box-shadow: 0 10px 24px rgba(37,99,235,0.22);
}

[data-template-id="elevora"] .elevora-dash-flow {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

[data-template-id="elevora"] .elevora-flow-node {
  min-height: 30px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  background: rgba(15,23,42,0.06);
  color: var(--elevora-muted);
  font-size: 0.75rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-flow-node.is-active {
  background: var(--elevora-dark);
  color: #fff;
}

[data-template-id="elevora"] .elevora-flow-line {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--elevora-blue), var(--elevora-cyan));
}

[data-template-id="elevora"] .elevora-floating-badge,
[data-template-id="elevora"] .elevora-kpi-card {
  position: absolute;
  z-index: 6;
  border: 1px solid rgba(255,255,255,0.68);
  background: rgba(255,255,255,0.82);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.17);
  backdrop-filter: blur(20px);
}

[data-template-id="elevora"] .elevora-floating-badge {
  left: 0;
  bottom: 78px;
  width: 214px;
  min-height: 146px;
  border-radius: 30px;
  padding: 22px;
  animation: elevoraFloat 6.4s ease-in-out infinite reverse;
}

[data-template-id="elevora"] .elevora-floating-badge strong,
[data-template-id="elevora"] .elevora-kpi-card strong {
  display: block;
  color: var(--elevora-dark);
  font-size: 2.3rem;
  line-height: 1;
  letter-spacing: -0.07em;
}

[data-template-id="elevora"] .elevora-floating-badge span,
[data-template-id="elevora"] .elevora-kpi-card span {
  display: block;
  margin-top: 9px;
  color: var(--elevora-muted);
  line-height: 1.45;
  font-weight: 850;
  font-size: 0.82rem;
}

[data-template-id="elevora"] .elevora-kpi-card {
  min-width: 154px;
  border-radius: 24px;
  padding: 18px 20px;
}

[data-template-id="elevora"] .elevora-kpi-card.is-one {
  top: 20px;
  left: 48px;
}

[data-template-id="elevora"] .elevora-kpi-card.is-two {
  right: 28px;
  bottom: 34px;
}

[data-template-id="elevora"] .elevora-orbit {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 4;
  background:
    radial-gradient(circle at 35% 35%, #ffffff, var(--elevora-cyan) 55%, var(--elevora-blue));
  box-shadow: 0 25px 65px rgba(0, 194, 255, 0.28);
  animation: elevoraOrbit 8s linear infinite;
}

[data-template-id="elevora"] .elevora-orbit-one {
  left: 22px;
  top: 28px;
  width: 110px;
  height: 110px;
}

[data-template-id="elevora"] .elevora-orbit-two {
  right: 18px;
  bottom: 160px;
  width: 58px;
  height: 58px;
  opacity: 0.8;
  animation-duration: 11s;
  animation-direction: reverse;
}

[data-template-id="elevora"] .elevora-section {
  padding: 96px 0;
  position: relative;
}

[data-template-id="elevora"] .elevora-section-tight {
  padding: 62px 0 86px;
  position: relative;
}

[data-template-id="elevora"] .elevora-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 34px;
  margin-bottom: 38px;
}

[data-template-id="elevora"] .elevora-section-title {
  margin: 15px 0 0;
  max-width: 820px;
  font-size: clamp(2.45rem, 4.7vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.08em;
  font-weight: 980;
  color: var(--elevora-dark);
  text-wrap: balance;
}

[data-template-id="elevora"] .elevora-section-text {
  max-width: 530px;
  color: var(--elevora-muted);
  line-height: 1.9;
  font-weight: 650;
}

[data-template-id="elevora"] .elevora-metrics-board {
  position: relative;
  border-radius: 42px;
  border: 1px solid rgba(255,255,255,0.75);
  background:
    radial-gradient(circle at 10% 10%, rgba(0,194,255,0.16), transparent 28%),
    linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.56));
  box-shadow: 0 38px 100px rgba(15,23,42,0.10);
  backdrop-filter: blur(20px);
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);
  gap: 18px;
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-metrics-board::after {
  content: "";
  position: absolute;
  inset-inline-start: -110px;
  bottom: -120px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255,107,74,0.12);
  filter: blur(8px);
}

[data-template-id="elevora"] .elevora-metrics-copy {
  position: relative;
  z-index: 1;
  min-height: 100%;
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 0%, rgba(0,194,255,0.22), transparent 34%),
    linear-gradient(135deg, var(--elevora-dark), #111827 62%, #1e3a8a);
  color: #fff;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

[data-template-id="elevora"] .elevora-metrics-copy .elevora-eyebrow {
  width: max-content;
  background: rgba(255,255,255,0.09);
  border-color: rgba(255,255,255,0.18);
  color: #dbeafe;
  box-shadow: none;
}

[data-template-id="elevora"] .elevora-metrics-copy h2 {
  margin: 34px 0 0;
  font-size: clamp(1.8rem, 3vw, 3.1rem);
  line-height: 1;
  letter-spacing: -0.07em;
}

[data-template-id="elevora"] .elevora-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

[data-template-id="elevora"] .elevora-stat {
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 28px;
  background: rgba(255,255,255,0.74);
  padding: 27px 24px;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
}

[data-template-id="elevora"] .elevora-stat:hover {
  transform: translateY(-8px);
  background: #ffffff;
  box-shadow: 0 30px 80px rgba(37, 99, 235, 0.13);
}

[data-template-id="elevora"] .elevora-stat strong {
  display: block;
  color: var(--elevora-dark);
  font-size: clamp(2rem, 4vw, 3.35rem);
  letter-spacing: -0.07em;
  line-height: 1;
}

[data-template-id="elevora"] .elevora-stat span {
  display: block;
  margin-top: 10px;
  color: var(--elevora-muted);
  font-weight: 850;
  line-height: 1.45;
}

[data-template-id="elevora"] .elevora-services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="elevora"] .elevora-service-card {
  position: relative;
  min-height: 330px;
  border: 1px solid rgba(255,255,255,0.74);
  border-radius: 34px;
  background:
    radial-gradient(circle at 20% 0%, rgba(0,194,255,0.14), transparent 32%),
    linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.56));
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 85px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(.22,1,.36,1),
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease;
}

[data-template-id="elevora"] .elevora-service-card::before {
  content: "";
  position: absolute;
  inset: auto -40px -70px auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(37,99,235,0.09);
  transition: transform 0.35s ease;
}

[data-template-id="elevora"] .elevora-service-card:hover {
  transform: translateY(-12px) rotate(-0.8deg);
  border-color: rgba(0, 194, 255, 0.52);
  background: #ffffff;
  box-shadow: 0 42px 105px rgba(37, 99, 235, 0.15);
}

[data-template-id="elevora"] .elevora-service-card:hover::before {
  transform: scale(1.32);
}

[data-template-id="elevora"] .elevora-service-topline {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

[data-template-id="elevora"] .elevora-service-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background:
    radial-gradient(circle at 25% 20%, #fff, transparent 34%),
    linear-gradient(135deg, rgba(0,194,255,0.25), rgba(37,99,235,0.16));
  color: var(--elevora-blue);
  display: grid;
  place-items: center;
  font-weight: 980;
}

[data-template-id="elevora"] .elevora-service-chip {
  min-height: 30px;
  border-radius: 999px;
  background: rgba(15,23,42,0.06);
  color: var(--elevora-muted);
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  font-size: 0.74rem;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-service-card h3 {
  position: relative;
  z-index: 1;
  margin: 30px 0 12px;
  font-size: 1.46rem;
  letter-spacing: -0.05em;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-service-card p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.78;
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-service-link {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  min-height: 46px;
  border-radius: 999px;
  background: rgba(15,23,42,0.06);
  color: var(--elevora-dark);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 950;
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}

[data-template-id="elevora"] .elevora-service-link:hover {
  transform: translateY(-3px);
  background: var(--elevora-dark);
  color: #fff;
}

[data-template-id="elevora"] .elevora-about-grid {
  display: grid;
  grid-template-columns: minmax(360px, 0.94fr) minmax(0, 1.06fr);
  gap: 40px;
  align-items: center;
}

[data-template-id="elevora"] .elevora-about-visual {
  position: relative;
}

[data-template-id="elevora"] .elevora-about-image {
  position: relative;
  height: 590px;
  border-radius: 46px;
  overflow: hidden;
  box-shadow: 0 42px 105px rgba(15, 23, 42, 0.18);
  background: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-about-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent, rgba(5,8,22,0.52)),
    radial-gradient(circle at 20% 20%, rgba(0,194,255,0.22), transparent 34%);
}

[data-template-id="elevora"] .elevora-about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 0.85s ease;
}

[data-template-id="elevora"] .elevora-about-image:hover img {
  transform: scale(1.1);
}

[data-template-id="elevora"] .elevora-about-floating {
  position: absolute;
  z-index: 3;
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 24px;
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 70px rgba(15,23,42,0.15);
  padding: 17px 19px;
  min-width: 168px;
}

[data-template-id="elevora"] .elevora-about-floating.is-top {
  top: 36px;
  right: -18px;
}

[data-template-id="elevora"] .elevora-about-floating.is-bottom {
  left: -18px;
  bottom: 40px;
}

[data-template-id="elevora"] .elevora-about-floating strong,
[data-template-id="elevora"] .elevora-about-floating span {
  display: block;
}

[data-template-id="elevora"] .elevora-about-floating strong {
  color: var(--elevora-dark);
  font-size: 1.4rem;
  letter-spacing: -0.06em;
}

[data-template-id="elevora"] .elevora-about-floating span {
  margin-top: 5px;
  color: var(--elevora-muted);
  font-weight: 850;
  font-size: 0.82rem;
}

[data-template-id="elevora"] .elevora-about-card {
  border-radius: 46px;
  background:
    radial-gradient(circle at 14% 12%, rgba(0, 194, 255, 0.24), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(255, 107, 74, 0.18), transparent 31%),
    linear-gradient(135deg, #050816, #0b1020 48%, #172554);
  color: #ffffff;
  padding: clamp(30px, 5vw, 58px);
  box-shadow: 0 42px 110px rgba(15, 23, 42, 0.24);
}

[data-template-id="elevora"] .elevora-about-card .elevora-eyebrow {
  background: rgba(255,255,255,0.08);
  color: #dbeafe;
  border-color: rgba(0, 194, 255, 0.34);
  box-shadow: none;
}

[data-template-id="elevora"] .elevora-about-card h2 {
  margin: 18px 0 18px;
  font-size: clamp(2.2rem, 4vw, 4.25rem);
  line-height: 0.98;
  letter-spacing: -0.08em;
}

[data-template-id="elevora"] .elevora-about-card p {
  color: rgba(255,255,255,0.72);
  line-height: 1.92;
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-check-list {
  display: grid;
  gap: 12px;
  margin-top: 25px;
}

[data-template-id="elevora"] .elevora-check {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,0.9);
  font-weight: 850;
}

[data-template-id="elevora"] .elevora-check::before {
  content: "✓";
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: var(--elevora-cyan);
  color: var(--elevora-dark);
  display: grid;
  place-items: center;
  font-weight: 980;
  flex: 0 0 auto;
}

[data-template-id="elevora"] .elevora-about-card .elevora-btn {
  margin-top: 30px;
}

[data-template-id="elevora"] .elevora-process {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="elevora"] .elevora-process::before {
  content: "";
  position: absolute;
  top: 37px;
  right: 9%;
  left: 9%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0,194,255,0.45), rgba(255,107,74,0.35), transparent);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-step {
  position: relative;
  border: 1px solid rgba(255,255,255,0.74);
  border-radius: 34px;
  background:
    radial-gradient(circle at 12% 0%, rgba(0,194,255,0.14), transparent 34%),
    rgba(255,255,255,0.72);
  padding: 30px;
  min-height: 270px;
  overflow: hidden;
  box-shadow: 0 28px 80px rgba(15,23,42,0.08);
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease;
}

[data-template-id="elevora"] .elevora-step::before {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  left: -45px;
  top: -45px;
  border-radius: 50%;
  background: rgba(0, 194, 255, 0.13);
  transition: transform 0.35s ease;
}

[data-template-id="elevora"] .elevora-step:hover {
  transform: translateY(-10px);
  border-color: rgba(0, 194, 255, 0.52);
  box-shadow: 0 36px 95px rgba(37, 99, 235, 0.13);
}

[data-template-id="elevora"] .elevora-step:hover::before {
  transform: scale(1.28);
}

[data-template-id="elevora"] .elevora-step-number {
  position: relative;
  z-index: 1;
  width: 54px;
  height: 54px;
  border-radius: 19px;
  background: var(--elevora-dark);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.92rem;
  font-weight: 980;
  box-shadow: 0 16px 34px rgba(15,23,42,0.18);
}

[data-template-id="elevora"] .elevora-step h3 {
  position: relative;
  z-index: 1;
  margin: 42px 0 13px;
  font-size: 1.65rem;
  letter-spacing: -0.055em;
}

[data-template-id="elevora"] .elevora-step p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.78;
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-testimonials {
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  gap: 18px;
  align-items: stretch;
}

[data-template-id="elevora"] .elevora-testimonial-main {
  position: relative;
  border-radius: 46px;
  background:
    radial-gradient(circle at 12% 18%, rgba(0,194,255,0.22), transparent 34%),
    radial-gradient(circle at 88% 82%, rgba(255,107,74,0.15), transparent 30%),
    linear-gradient(135deg, #050816, #172554);
  color: #fff;
  padding: clamp(32px, 5vw, 60px);
  min-height: 440px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 42px 110px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-quote-mark {
  position: absolute;
  left: 28px;
  top: 8px;
  font-size: 10rem;
  line-height: 1;
  color: rgba(255,255,255,0.06);
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-testimonial-main p {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(1.65rem, 3vw, 3.08rem);
  line-height: 1.25;
  letter-spacing: -0.055em;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-testimonial-person {
  position: relative;
  z-index: 1;
  margin-top: 34px;
}

[data-template-id="elevora"] .elevora-testimonial-person strong {
  display: block;
  font-size: 1.1rem;
}

[data-template-id="elevora"] .elevora-testimonial-person span {
  display: block;
  margin-top: 5px;
  color: rgba(255,255,255,0.66);
}

[data-template-id="elevora"] .elevora-testimonial-list {
  display: grid;
  gap: 18px;
}

[data-template-id="elevora"] .elevora-mini-testimonial {
  border: 1px solid rgba(255,255,255,0.74);
  border-radius: 30px;
  background: rgba(255,255,255,0.72);
  padding: 28px;
  box-shadow: 0 26px 70px rgba(15,23,42,0.07);
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

[data-template-id="elevora"] .elevora-mini-testimonial:hover {
  transform: translateY(-8px);
  background: #ffffff;
  box-shadow: 0 30px 82px rgba(37,99,235,0.12);
}

[data-template-id="elevora"] .elevora-mini-testimonial p {
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.78;
  font-weight: 650;
}

[data-template-id="elevora"] .elevora-mini-testimonial strong {
  display: block;
  margin-top: 18px;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-faq {
  display: grid;
  gap: 14px;
}

[data-template-id="elevora"] .elevora-faq-item {
  border: 1px solid rgba(255,255,255,0.74);
  border-radius: 28px;
  background: rgba(255,255,255,0.72);
  padding: 24px 26px;
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 18px;
  box-shadow: 0 24px 70px rgba(15,23,42,0.06);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease,
    background 0.28s ease;
}

[data-template-id="elevora"] .elevora-faq-item:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 194, 255, 0.50);
  background: #ffffff;
  box-shadow: 0 30px 82px rgba(37,99,235,0.11);
}

[data-template-id="elevora"] .elevora-faq-index {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  background: rgba(0,194,255,0.12);
  color: var(--elevora-blue);
  display: grid;
  place-items: center;
  font-weight: 980;
}

[data-template-id="elevora"] .elevora-faq-item h3 {
  margin: 0;
  font-size: 1.17rem;
  letter-spacing: -0.035em;
}

[data-template-id="elevora"] .elevora-faq-item p {
  margin: 11px 0 0;
  color: var(--elevora-muted);
  line-height: 1.78;
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-cta {
  border-radius: 48px;
  background:
    radial-gradient(circle at 15% 20%, rgba(0,194,255,0.28), transparent 30%),
    radial-gradient(circle at 88% 78%, rgba(255,107,74,0.18), transparent 31%),
    linear-gradient(135deg, #050816, #0b1020 52%, #1e3a8a);
  color: #ffffff;
  padding: clamp(36px, 6vw, 74px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 34px;
  align-items: center;
  box-shadow: 0 48px 125px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-cta .elevora-eyebrow {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.18);
  color: #dbeafe;
  box-shadow: none;
}

[data-template-id="elevora"] .elevora-cta h2 {
  margin: 18px 0 0;
  max-width: 790px;
  font-size: clamp(2.3rem, 5vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.085em;
}

[data-template-id="elevora"] .elevora-cta p {
  margin: 18px 0 0;
  max-width: 660px;
  color: rgba(255,255,255,0.72);
  line-height: 1.85;
  font-weight: 620;
}

[data-template-id="elevora"] .elevora-contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(390px, 1.1fr);
  gap: 24px;
  align-items: start;
}

[data-template-id="elevora"] .elevora-contact-panel,
[data-template-id="elevora"] .elevora-form-card {
  border: 1px solid rgba(255,255,255,0.74);
  border-radius: 40px;
  background: rgba(255,255,255,0.74);
  box-shadow: 0 32px 88px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}

[data-template-id="elevora"] .elevora-contact-panel {
  padding: 40px;
}

[data-template-id="elevora"] .elevora-contact-info {
  display: grid;
  gap: 13px;
  margin-top: 30px;
}

[data-template-id="elevora"] .elevora-info-line {
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(219,234,254,0.56), rgba(255,255,255,0.72));
  border: 1px solid rgba(15,23,42,0.07);
  padding: 16px 18px;
}

[data-template-id="elevora"] .elevora-info-line span {
  display: block;
  color: var(--elevora-muted);
  font-size: 0.86rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-info-line strong {
  display: block;
  margin-top: 4px;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-form-card {
  padding: 26px;
}

[data-template-id="elevora"] .elevora-form {
  display: grid;
  gap: 14px;
}

[data-template-id="elevora"] .elevora-field {
  display: grid;
  gap: 8px;
}

[data-template-id="elevora"] .elevora-field label {
  font-weight: 900;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-field input,
[data-template-id="elevora"] .elevora-field textarea {
  width: 100%;
  border: 1px solid rgba(15,23,42,0.12);
  border-radius: 20px;
  min-height: 56px;
  padding: 0 16px;
  background: rgba(255,255,255,0.88);
  color: var(--elevora-text);
  outline: none;
  transition:
    border-color 0.24s ease,
    box-shadow 0.24s ease,
    background 0.24s ease,
    transform 0.24s ease;
}

[data-template-id="elevora"] .elevora-field textarea {
  min-height: 144px;
  resize: vertical;
  padding-top: 14px;
}

[data-template-id="elevora"] .elevora-field input:focus,
[data-template-id="elevora"] .elevora-field textarea:focus {
  border-color: rgba(0,194,255,0.72);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0,194,255,0.14);
  transform: translateY(-2px);
}

[data-template-id="elevora"] .elevora-footer {
  padding: 34px 0 46px;
}

[data-template-id="elevora"] .elevora-footer-inner {
  border-top: 1px solid rgba(15,23,42,0.1);
  padding-top: 24px;
  color: var(--elevora-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-page-hero {
  padding: 76px 0 38px;
}

[data-template-id="elevora"] .elevora-page-hero-inner {
  border-radius: 48px;
  background:
    radial-gradient(circle at 18% 10%, rgba(0,194,255,0.24), transparent 34%),
    radial-gradient(circle at 88% 88%, rgba(255,107,74,0.12), transparent 30%),
    linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.54));
  border: 1px solid rgba(255,255,255,0.74);
  padding: clamp(36px, 6vw, 76px);
  box-shadow: 0 36px 100px rgba(15,23,42,0.09);
  backdrop-filter: blur(18px);
}

[data-template-id="elevora"] .elevora-page-title {
  margin: 18px 0 0;
  max-width: 900px;
  font-size: clamp(3.05rem, 7.2vw, 6.8rem);
  line-height: 0.88;
  letter-spacing: -0.095em;
  color: var(--elevora-dark);
  text-wrap: balance;
}

[data-template-id="elevora"] .elevora-page-text {
  margin: 24px 0 0;
  max-width: 730px;
  color: var(--elevora-muted);
  font-size: 1.1rem;
  line-height: 1.9;
  font-weight: 650;
}

[data-template-id="elevora"] .elevora-reveal {
  animation: elevoraFadeUp 0.9s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="elevora"] .elevora-delay-1 {
  animation-delay: 0.08s;
}

[data-template-id="elevora"] .elevora-delay-2 {
  animation-delay: 0.16s;
}

[data-template-id="elevora"] .elevora-delay-3 {
  animation-delay: 0.24s;
}

[data-template-id="elevora"] .elevora-delay-4 {
  animation-delay: 0.32s;
}

@keyframes elevoraFadeUp {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes elevoraFloat {
  0%, 100% {
    transform: translateY(0) rotate(1deg);
  }

  50% {
    transform: translateY(-16px) rotate(-1.4deg);
  }
}

@keyframes elevoraOrbit {
  from {
    transform: rotate(0deg) translateY(0);
  }

  50% {
    transform: rotate(180deg) translateY(10px);
  }

  to {
    transform: rotate(360deg) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="elevora"] *,
  [data-template-id="elevora"] *::before,
  [data-template-id="elevora"] *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 1120px) {
  [data-template-id="elevora"] .elevora-header-inner {
    border-radius: 28px;
    flex-wrap: wrap;
  }

  [data-template-id="elevora"] .elevora-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 4px 0;
  }

  [data-template-id="elevora"] .elevora-hero-grid,
  [data-template-id="elevora"] .elevora-about-grid,
  [data-template-id="elevora"] .elevora-testimonials,
  [data-template-id="elevora"] .elevora-contact-grid,
  [data-template-id="elevora"] .elevora-metrics-board {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-hero::after {
    inset: auto 4vw 70px auto;
    width: 78vw;
    height: 410px;
  }

  [data-template-id="elevora"] .elevora-hero-media {
    min-height: 620px;
  }

  [data-template-id="elevora"] .elevora-media-card {
    inset: 20px 0 30px 0;
  }

  [data-template-id="elevora"] .elevora-services-grid,
  [data-template-id="elevora"] .elevora-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-template-id="elevora"] .elevora-process {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-process::before {
    display: none;
  }

  [data-template-id="elevora"] .elevora-cta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 740px) {
  [data-template-id="elevora"] .elevora-shell {
    width: min(100% - 24px, 1200px);
  }

  [data-template-id="elevora"] .elevora-header {
    padding-top: 10px;
  }

  [data-template-id="elevora"] .elevora-header-inner {
    padding: 12px;
  }

  [data-template-id="elevora"] .elevora-brand {
    min-width: auto;
  }

  [data-template-id="elevora"] .elevora-header-cta {
    display: none;
  }

  [data-template-id="elevora"] .elevora-hero {
    padding-top: 46px;
  }

  [data-template-id="elevora"] .elevora-hero-title,
  [data-template-id="elevora"] .elevora-page-title {
    font-size: clamp(3.25rem, 17vw, 5.15rem);
  }

  [data-template-id="elevora"] .elevora-hero-actions {
    align-items: stretch;
  }

  [data-template-id="elevora"] .elevora-hero-actions .elevora-btn {
    width: 100%;
  }

  [data-template-id="elevora"] .elevora-hero-trust {
    align-items: flex-start;
  }

  [data-template-id="elevora"] .elevora-hero-media {
    min-height: 560px;
  }

  [data-template-id="elevora"] .elevora-dashboard-card {
    right: 10px;
    top: 16px;
    width: min(260px, calc(100% - 20px));
  }

  [data-template-id="elevora"] .elevora-floating-badge {
    left: 10px;
    bottom: 20px;
    width: 178px;
  }

  [data-template-id="elevora"] .elevora-kpi-card.is-one,
  [data-template-id="elevora"] .elevora-kpi-card.is-two {
    display: none;
  }

  [data-template-id="elevora"] .elevora-orbit-one {
    width: 78px;
    height: 78px;
  }

  [data-template-id="elevora"] .elevora-section {
    padding: 68px 0;
  }

  [data-template-id="elevora"] .elevora-section-head {
    display: block;
  }

  [data-template-id="elevora"] .elevora-services-grid,
  [data-template-id="elevora"] .elevora-stats {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-metrics-copy {
    min-height: 260px;
  }

  [data-template-id="elevora"] .elevora-about-image {
    height: 430px;
  }

  [data-template-id="elevora"] .elevora-about-floating {
    right: 12px !important;
    left: auto !important;
    min-width: 150px;
  }

  [data-template-id="elevora"] .elevora-about-floating.is-bottom {
    bottom: 18px;
  }

  [data-template-id="elevora"] .elevora-faq-item {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-footer-inner {
    display: grid;
  }
}

/* Editor image click fix: let the image container receive the click, not the floating UI */
[data-template-id="elevora"] .elevora-media-card,
[data-template-id="elevora"] .elevora-about-image {
  cursor: pointer;
  pointer-events: auto !important;
}

[data-template-id="elevora"] .elevora-media-card::after,
[data-template-id="elevora"] .elevora-about-image::after {
  pointer-events: none !important;
}

[data-template-id="elevora"] .elevora-media-card img,
[data-template-id="elevora"] .elevora-about-image img {
  pointer-events: auto !important;
}

[data-template-id="elevora"] .elevora-orbit,
[data-template-id="elevora"] .elevora-media-overlay,
[data-template-id="elevora"] .elevora-dashboard-card,
[data-template-id="elevora"] .elevora-floating-badge,
[data-template-id="elevora"] .elevora-kpi-card,
[data-template-id="elevora"] .elevora-about-floating {
  pointer-events: none !important;
  user-select: none;
}

`;
