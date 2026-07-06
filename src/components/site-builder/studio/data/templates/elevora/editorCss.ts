export const elevoraEditorCss = `
[data-template-id="elevora"],
[data-template-id="elevora"] * {
  box-sizing: border-box;
}

[data-template-id="elevora"] {
  --elevora-bg: #f3f8ff;
  --elevora-surface: #ffffff;
  --elevora-dark: #050816;
  --elevora-text: #0b1020;
  --elevora-muted: #64748b;
  --elevora-line: rgba(15, 23, 42, 0.12);
  --elevora-cyan: #00c2ff;
  --elevora-blue: #2563eb;
  --elevora-blue-dark: #1e3a8a;
  --elevora-coral: #ff6b4a;
  --elevora-soft: #dbeafe;
  --elevora-radius-xl: 34px;
  --elevora-radius-lg: 24px;
  --elevora-radius-md: 18px;
  direction: rtl;
  width: 100%;
  min-height: 100%;
  background:
    radial-gradient(circle at 86% 4%, rgba(0, 194, 255, 0.20), transparent 30%),
    radial-gradient(circle at 12% 92%, rgba(37, 99, 235, 0.13), transparent 34%),
    linear-gradient(180deg, #fbfdff 0%, #f3f8ff 48%, #ffffff 100%);
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
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-shell {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

[data-template-id="elevora"] .elevora-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 18px 0 10px;
  background: linear-gradient(180deg, rgba(243, 248, 255, 0.96), rgba(243, 248, 255, 0.72));
  backdrop-filter: blur(20px);
}

[data-template-id="elevora"] .elevora-header-inner {
  min-height: 72px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.95);
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
  min-width: 190px;
  cursor: pointer;
  background: transparent;
  color: inherit;
}

[data-template-id="elevora"] .elevora-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00c2ff, #dbeafe 52%, #2563eb);
  color: #050816;
  display: grid;
  place-items: center;
  font-weight: 950;
  letter-spacing: -0.03em;
  box-shadow: 0 14px 32px rgba(0, 194, 255, 0.28);
}

[data-template-id="elevora"] .elevora-brand-name {
  display: block;
  font-size: 1.05rem;
  font-weight: 950;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #050816;
}

[data-template-id="elevora"] .elevora-brand-label {
  display: block;
  margin-top: 5px;
  color: var(--elevora-muted);
  font-size: 0.78rem;
  font-weight: 700;
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
  transition:
    color 0.24s ease,
    background 0.24s ease,
    transform 0.24s ease;
}

[data-template-id="elevora"] .elevora-nav-link::after {
  content: "";
  position: absolute;
  right: 18px;
  left: 18px;
  bottom: 7px;
  height: 2px;
  border-radius: 999px;
  background: #00c2ff;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.25s ease;
}

[data-template-id="elevora"] .elevora-nav-link:hover,
[data-template-id="elevora"] .elevora-nav-link.is-active {
  color: #050816;
  background: rgba(0, 194, 255, 0.13);
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
  min-height: 50px;
  border-radius: 999px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 900;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

[data-template-id="elevora"] .elevora-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent, rgba(255,255,255,0.42), transparent);
  transform: translateX(115%);
  transition: transform 0.65s ease;
}

[data-template-id="elevora"] .elevora-btn:hover::before {
  transform: translateX(-115%);
}

[data-template-id="elevora"] .elevora-btn:hover {
  transform: translateY(-3px);
}

[data-template-id="elevora"] .elevora-btn-primary {
  background: linear-gradient(135deg, #050816, #111827 52%, #1e3a8a);
  color: #ffffff;
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.26);
}

[data-template-id="elevora"] .elevora-btn-primary:hover {
  box-shadow: 0 28px 70px rgba(37, 99, 235, 0.26);
}

[data-template-id="elevora"] .elevora-btn-gold {
  background: linear-gradient(135deg, #00c2ff, #bfdbfe 56%, #ff6b4a);
  color: #050816;
  box-shadow: 0 22px 54px rgba(0, 194, 255, 0.22);
}

[data-template-id="elevora"] .elevora-btn-outline {
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.62);
  color: #0b1020;
}

[data-template-id="elevora"] .elevora-hero {
  position: relative;
  padding: 78px 0 78px;
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.055) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, #000, transparent 82%);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-hero-glow {
  position: absolute;
  width: 460px;
  height: 460px;
  border-radius: 999px;
  filter: blur(22px);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-hero-glow-one {
  top: -160px;
  right: 4vw;
  background: radial-gradient(circle, rgba(0, 194, 255, 0.26), transparent 64%);
}

[data-template-id="elevora"] .elevora-hero-glow-two {
  left: -180px;
  bottom: 30px;
  background: radial-gradient(circle, rgba(255, 107, 74, 0.14), transparent 66%);
}

[data-template-id="elevora"] .elevora-hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
  gap: 44px;
  align-items: center;
}

[data-template-id="elevora"] .elevora-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  border: 1px solid rgba(0, 194, 255, 0.44);
  border-radius: 999px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.68);
  color: #1d4ed8;
  font-size: 0.88rem;
  font-weight: 950;
  box-shadow: 0 16px 44px rgba(15, 23, 42, 0.06);
}

[data-template-id="elevora"] .elevora-eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00c2ff;
  box-shadow: 0 0 0 6px rgba(0, 194, 255, 0.16);
}

[data-template-id="elevora"] .elevora-hero-title {
  margin: 24px 0 0;
  max-width: 780px;
  font-size: clamp(3.4rem, 7.5vw, 7.4rem);
  line-height: 0.86;
  letter-spacing: -0.095em;
  font-weight: 950;
  color: #050816;
}

[data-template-id="elevora"] .elevora-highlight {
  display: block;
  background: linear-gradient(90deg, #2563eb, #00c2ff 54%, #ff6b4a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

[data-template-id="elevora"] .elevora-hero-text {
  margin: 26px 0 0;
  max-width: 650px;
  font-size: 1.12rem;
  line-height: 1.85;
  color: var(--elevora-muted);
  font-weight: 560;
}

[data-template-id="elevora"] .elevora-hero-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 13px;
}

[data-template-id="elevora"] .elevora-hero-note {
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(11, 16, 32, 0.74);
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-hero-avatars {
  display: flex;
  align-items: center;
}

[data-template-id="elevora"] .elevora-avatar {
  width: 38px;
  height: 38px;
  margin-inline-start: -10px;
  border-radius: 50%;
  border: 3px solid #f3f8ff;
  background: linear-gradient(135deg, rgba(0, 194, 255, 0.92), rgba(37, 99, 235, 0.95));
}

[data-template-id="elevora"] .elevora-avatar:first-child {
  margin-inline-start: 0;
}

[data-template-id="elevora"] .elevora-hero-media {
  position: relative;
  min-height: 640px;
}

[data-template-id="elevora"] .elevora-media-card {
  position: absolute;
  inset: 26px 0 26px 34px;
  border-radius: 46px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.72);
  box-shadow: 0 42px 100px rgba(15, 23, 42, 0.20);
  transform: rotate(-2.2deg);
  isolation: isolate;
}

[data-template-id="elevora"] .elevora-media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 30%, rgba(7, 10, 26, 0.58)),
    radial-gradient(circle at 20% 20%, rgba(0, 194, 255, 0.20), transparent 38%);
  z-index: 1;
}

[data-template-id="elevora"] .elevora-media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.85s ease;
}

[data-template-id="elevora"] .elevora-media-card:hover img {
  transform: scale(1.11);
}

[data-template-id="elevora"] .elevora-floating-badge {
  position: absolute;
  right: -18px;
  bottom: 54px;
  z-index: 5;
  width: 210px;
  min-height: 145px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255,255,255,0.78);
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(16px);
  padding: 22px;
  animation: elevoraFloat 5.5s ease-in-out infinite;
}

[data-template-id="elevora"] .elevora-floating-badge strong {
  display: block;
  color: #050816;
  font-size: 2.2rem;
  line-height: 1;
  letter-spacing: -0.05em;
}

[data-template-id="elevora"] .elevora-floating-badge span {
  display: block;
  margin-top: 9px;
  color: var(--elevora-muted);
  line-height: 1.5;
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-orbit {
  position: absolute;
  left: 0;
  top: 38px;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffffff, #00c2ff 55%, #2563eb);
  box-shadow: 0 25px 65px rgba(0, 194, 255, 0.28);
  z-index: 6;
  animation: elevoraOrbit 8s linear infinite;
}

[data-template-id="elevora"] .elevora-dashboard-card {
  position: absolute;
  left: 10px;
  bottom: 18px;
  z-index: 6;
  width: 270px;
  border-radius: 28px;
  padding: 18px;
  background:
    radial-gradient(circle at 18% 18%, rgba(0, 194, 255, 0.22), transparent 36%),
    linear-gradient(135deg, rgba(5, 8, 22, 0.94), rgba(30, 58, 138, 0.88));
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 34px 90px rgba(15, 23, 42, 0.26);
  backdrop-filter: blur(18px);
  color: #ffffff;
  animation: elevoraDashboardFloat 6.5s ease-in-out infinite;
}

[data-template-id="elevora"] .elevora-dashboard-top,
[data-template-id="elevora"] .elevora-dashboard-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

[data-template-id="elevora"] .elevora-dashboard-top span,
[data-template-id="elevora"] .elevora-dashboard-bottom span {
  color: rgba(255,255,255,0.66);
  font-size: 0.78rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-dashboard-top strong,
[data-template-id="elevora"] .elevora-dashboard-bottom strong {
  color: #ffffff;
  font-size: 1rem;
}

[data-template-id="elevora"] .elevora-dashboard-chart {
  height: 108px;
  display: flex;
  align-items: end;
  gap: 8px;
  margin: 22px 0;
}

[data-template-id="elevora"] .elevora-dashboard-chart span {
  flex: 1;
  border-radius: 999px 999px 8px 8px;
  background: linear-gradient(180deg, #00c2ff, #2563eb);
  box-shadow: 0 0 22px rgba(0, 194, 255, 0.24);
}

[data-template-id="elevora"] .elevora-mini-kpi {
  position: absolute;
  z-index: 7;
  border-radius: 22px;
  padding: 15px 17px;
  min-width: 135px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(255,255,255,0.76);
  box-shadow: 0 22px 70px rgba(15,23,42,0.14);
  backdrop-filter: blur(14px);
}

[data-template-id="elevora"] .elevora-mini-kpi span {
  display: block;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-mini-kpi strong {
  display: block;
  margin-top: 4px;
  color: #050816;
  font-size: 1.45rem;
  letter-spacing: -0.06em;
}

[data-template-id="elevora"] .elevora-mini-kpi-one {
  top: 92px;
  right: 8px;
  animation: elevoraFloat 6s ease-in-out infinite;
}

[data-template-id="elevora"] .elevora-mini-kpi-two {
  top: 176px;
  left: -12px;
  animation: elevoraFloat 6.4s ease-in-out infinite reverse;
}

[data-template-id="elevora"] .elevora-section {
  padding: 92px 0;
  position: relative;
}

[data-template-id="elevora"] .elevora-section-tight {
  padding: 64px 0;
}

[data-template-id="elevora"] .elevora-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 34px;
}

[data-template-id="elevora"] .elevora-section-title {
  margin: 15px 0 0;
  max-width: 760px;
  font-size: clamp(2.3rem, 4.5vw, 4.7rem);
  line-height: 0.96;
  letter-spacing: -0.07em;
  font-weight: 950;
  color: #050816;
}

[data-template-id="elevora"] .elevora-section-text {
  max-width: 520px;
  color: var(--elevora-muted);
  line-height: 1.85;
  font-weight: 560;
}

[data-template-id="elevora"] .elevora-results-strip {
  padding: 82px 0 70px;
}

[data-template-id="elevora"] .elevora-results-strip .elevora-shell {
  position: relative;
  border-radius: 44px;
  padding: 42px;
  background:
    radial-gradient(circle at 12% 8%, rgba(0, 194, 255, 0.18), transparent 28%),
    radial-gradient(circle at 94% 100%, rgba(255, 107, 74, 0.10), transparent 30%),
    rgba(255, 255, 255, 0.64);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 38px 110px rgba(15, 23, 42, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

[data-template-id="elevora"] .elevora-results-strip .elevora-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.055) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-stats-only {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="elevora"] .elevora-stat {
  position: relative;
  min-height: 260px;
  border-radius: 34px;
  padding: 34px 28px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78));
  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow:
    0 28px 80px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;
  overflow: hidden;
  transform-origin: center bottom;
  animation: elevoraCardEnter 0.82s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="elevora"] .elevora-stat::before {
  content: "";
  position: absolute;
  width: 170px;
  height: 170px;
  inset-inline-end: -80px;
  top: -80px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 194, 255, 0.20), transparent 67%);
  transition: transform 0.45s ease, opacity 0.45s ease;
}

[data-template-id="elevora"] .elevora-stat::after {
  content: "";
  position: absolute;
  inset: auto 24px 24px auto;
  width: 52px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #00c2ff, #2563eb, #ff6b4a);
  opacity: 0.9;
}

[data-template-id="elevora"] .elevora-stat:hover {
  transform: translateY(-12px) scale(1.018);
  border-color: rgba(0, 194, 255, 0.44);
  box-shadow:
    0 42px 115px rgba(37, 99, 235, 0.16),
    inset 0 1px 0 rgba(255,255,255,1);
}

[data-template-id="elevora"] .elevora-stat:hover::before {
  transform: scale(1.28);
  opacity: 1;
}

[data-template-id="elevora"] .elevora-stat-number {
  position: relative;
  z-index: 1;
  display: block;
  color: #050816;
  font-size: clamp(2.75rem, 4.8vw, 4.8rem);
  line-height: 0.9;
  letter-spacing: -0.075em;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-counter-value {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform, filter, opacity;
}

[data-template-id="elevora"] .elevora-counter-value.is-done {
  animation: elevoraNumberPop 0.72s both cubic-bezier(0.16, 1.25, 0.3, 1);
}

[data-template-id="elevora"] .elevora-stat:hover .elevora-counter-value {
  animation: elevoraNumberBounce 0.72s both cubic-bezier(0.16, 1.25, 0.3, 1);
}

[data-template-id="elevora"] .elevora-stat-label {
  position: relative;
  z-index: 1;
  max-width: 180px;
  color: #667085;
  font-size: clamp(1rem, 1.35vw, 1.22rem);
  line-height: 1.55;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
}

[data-template-id="elevora"] .elevora-service-card {
  position: relative;
  min-height: 310px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 34px;
  background:
    radial-gradient(circle at 20% 12%, rgba(0, 194, 255, 0.10), transparent 34%),
    linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.66));
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 85px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease,
    background 0.32s ease;
}

[data-template-id="elevora"] .elevora-service-card:hover {
  transform: translateY(-12px) rotate(-0.6deg);
  border-color: rgba(0, 194, 255, 0.50);
  background: #ffffff;
  box-shadow: 0 40px 100px rgba(37, 99, 235, 0.15);
}

[data-template-id="elevora"] .elevora-service-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background: rgba(0, 194, 255, 0.13);
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-service-card h3 {
  margin: 28px 0 12px;
  font-size: 1.42rem;
  letter-spacing: -0.04em;
  color: #050816;
}

[data-template-id="elevora"] .elevora-service-card p {
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.75;
  font-weight: 560;
}

[data-template-id="elevora"] .elevora-about-grid {
  display: grid;
  grid-template-columns: minmax(360px, 0.95fr) minmax(0, 1.05fr);
  gap: 38px;
  align-items: center;
}

[data-template-id="elevora"] .elevora-about-image {
  position: relative;
  height: 560px;
  border-radius: 42px;
  overflow: hidden;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.16);
}

[data-template-id="elevora"] .elevora-about-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(7, 10, 26, 0.44));
}

[data-template-id="elevora"] .elevora-about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

[data-template-id="elevora"] .elevora-about-image:hover img {
  transform: scale(1.07);
}

[data-template-id="elevora"] .elevora-about-floating {
  position: absolute;
  z-index: 3;
  border-radius: 22px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(255,255,255,0.74);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
  padding: 15px 17px;
  backdrop-filter: blur(14px);
}

[data-template-id="elevora"] .elevora-about-floating span {
  display: block;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-about-floating strong {
  display: block;
  margin-top: 4px;
  color: #050816;
  font-size: 1.05rem;
}

[data-template-id="elevora"] .elevora-about-floating-one {
  right: 24px;
  top: 28px;
}

[data-template-id="elevora"] .elevora-about-floating-two {
  left: 24px;
  bottom: 28px;
}

[data-template-id="elevora"] .elevora-about-card {
  border-radius: 42px;
  background:
    radial-gradient(circle at 14% 12%, rgba(0, 194, 255, 0.22), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(255, 107, 74, 0.18), transparent 31%),
    linear-gradient(135deg, #050816, #0b1020 52%, #1e3a8a);
  color: #ffffff;
  padding: clamp(28px, 5vw, 54px);
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.22);
}

[data-template-id="elevora"] .elevora-about-card .elevora-eyebrow {
  background: rgba(255,255,255,0.08);
  color: #dbeafe;
  border-color: rgba(0, 194, 255, 0.35);
}

[data-template-id="elevora"] .elevora-about-card h2 {
  margin: 18px 0 18px;
  font-size: clamp(2.1rem, 4vw, 4.1rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

[data-template-id="elevora"] .elevora-about-card p {
  color: rgba(255,255,255,0.72);
  line-height: 1.9;
  font-weight: 560;
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
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #00c2ff;
  color: #050816;
  display: grid;
  place-items: center;
  font-weight: 950;
  flex: 0 0 auto;
}

[data-template-id="elevora"] .elevora-process {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

[data-template-id="elevora"] .elevora-step {
  position: relative;
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 34px;
  background: rgba(255,255,255,0.72);
  padding: 30px;
  min-height: 260px;
  overflow: hidden;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.07);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

[data-template-id="elevora"] .elevora-step::before {
  content: "";
  position: absolute;
  width: 150px;
  height: 150px;
  left: -45px;
  top: -45px;
  border-radius: 50%;
  background: rgba(0, 194, 255, 0.13);
  transition: transform 0.35s ease;
}

[data-template-id="elevora"] .elevora-step:hover {
  transform: translateY(-9px);
  border-color: rgba(0, 194, 255, 0.50);
  box-shadow: 0 32px 90px rgba(37, 99, 235, 0.14);
}

[data-template-id="elevora"] .elevora-step:hover::before {
  transform: scale(1.25);
}

[data-template-id="elevora"] .elevora-step-number {
  position: relative;
  z-index: 1;
  color: #2563eb;
  font-size: 0.92rem;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-step h3 {
  position: relative;
  z-index: 1;
  margin: 42px 0 13px;
  font-size: 1.6rem;
  letter-spacing: -0.05em;
  color: #050816;
}

[data-template-id="elevora"] .elevora-step p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.76;
  font-weight: 560;
}

[data-template-id="elevora"] .elevora-testimonials {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
  align-items: stretch;
}

[data-template-id="elevora"] .elevora-testimonial-main {
  border-radius: 42px;
  background:
    radial-gradient(circle at 12% 18%, rgba(0, 194, 255, 0.22), transparent 34%),
    linear-gradient(135deg, #050816, #172554);
  color: #ffffff;
  padding: clamp(30px, 5vw, 58px);
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.22);
}

[data-template-id="elevora"] .elevora-testimonial-main p {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 3rem);
  line-height: 1.25;
  letter-spacing: -0.045em;
  font-weight: 850;
}

[data-template-id="elevora"] .elevora-testimonial-person {
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
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 30px;
  background: rgba(255,255,255,0.72);
  padding: 28px;
  box-shadow: 0 26px 70px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

[data-template-id="elevora"] .elevora-mini-testimonial:hover {
  transform: translateY(-7px);
  background: #ffffff;
  box-shadow: 0 30px 84px rgba(37, 99, 235, 0.12);
}

[data-template-id="elevora"] .elevora-mini-testimonial p {
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.75;
  font-weight: 560;
}

[data-template-id="elevora"] .elevora-mini-testimonial strong {
  display: block;
  margin-top: 18px;
  color: #050816;
}

[data-template-id="elevora"] .elevora-faq {
  display: grid;
  gap: 14px;
}

[data-template-id="elevora"] .elevora-faq-item {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 26px;
  background: rgba(255,255,255,0.72);
  padding: 25px 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

[data-template-id="elevora"] .elevora-faq-item:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 194, 255, 0.48);
  box-shadow: 0 24px 78px rgba(37, 99, 235, 0.10);
}

[data-template-id="elevora"] .elevora-faq-item h3 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  color: #050816;
}

[data-template-id="elevora"] .elevora-faq-item p {
  margin: 11px 0 0;
  color: var(--elevora-muted);
  line-height: 1.76;
}

[data-template-id="elevora"] .elevora-cta {
  border-radius: 44px;
  background:
    radial-gradient(circle at 15% 20%, rgba(0, 194, 255, 0.28), transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(255, 107, 74, 0.20), transparent 32%),
    linear-gradient(135deg, #050816, #0b1020 52%, #1e3a8a);
  color: #ffffff;
  padding: clamp(34px, 6vw, 70px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  box-shadow: 0 42px 115px rgba(15, 23, 42, 0.24);
}

[data-template-id="elevora"] .elevora-cta h2 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(2.2rem, 5vw, 4.8rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

[data-template-id="elevora"] .elevora-cta p {
  margin: 18px 0 0;
  max-width: 650px;
  color: rgba(255,255,255,0.72);
  line-height: 1.8;
}

[data-template-id="elevora"] .elevora-contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(380px, 1.1fr);
  gap: 24px;
  align-items: start;
}

[data-template-id="elevora"] .elevora-contact-panel,
[data-template-id="elevora"] .elevora-form-card {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 38px;
  background: rgba(255,255,255,0.72);
  box-shadow: 0 30px 85px rgba(15, 23, 42, 0.08);
}

[data-template-id="elevora"] .elevora-contact-panel {
  padding: 38px;
}

[data-template-id="elevora"] .elevora-contact-info {
  display: grid;
  gap: 13px;
  margin-top: 28px;
}

[data-template-id="elevora"] .elevora-info-line {
  border-radius: 20px;
  background: rgba(243, 248, 255, 0.86);
  border: 1px solid rgba(15,23,42,0.08);
  padding: 16px 18px;
}

[data-template-id="elevora"] .elevora-info-line span {
  display: block;
  color: var(--elevora-muted);
  font-size: 0.86rem;
  font-weight: 850;
}

[data-template-id="elevora"] .elevora-info-line strong {
  display: block;
  margin-top: 4px;
  color: #050816;
}

[data-template-id="elevora"] .elevora-form-card {
  padding: 24px;
}

[data-template-id="elevora"] .elevora-form {
  display: grid;
  gap: 13px;
}

[data-template-id="elevora"] .elevora-field {
  display: grid;
  gap: 7px;
}

[data-template-id="elevora"] .elevora-field label {
  font-weight: 900;
  color: #050816;
}

[data-template-id="elevora"] .elevora-field input,
[data-template-id="elevora"] .elevora-field textarea {
  width: 100%;
  border: 1px solid rgba(15,23,42,0.13);
  border-radius: 18px;
  min-height: 54px;
  padding: 0 16px;
  background: rgba(255,255,255,0.88);
  color: var(--elevora-text);
  outline: none;
  transition:
    border-color 0.24s ease,
    box-shadow 0.24s ease,
    background 0.24s ease;
}

[data-template-id="elevora"] .elevora-field textarea {
  min-height: 140px;
  resize: vertical;
  padding-top: 14px;
}

[data-template-id="elevora"] .elevora-field input:focus,
[data-template-id="elevora"] .elevora-field textarea:focus {
  border-color: rgba(0, 194, 255, 0.72);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 194, 255, 0.14);
}

[data-template-id="elevora"] .elevora-footer {
  padding: 34px 0 46px;
}

[data-template-id="elevora"] .elevora-footer-inner {
  border-top: 1px solid rgba(15, 23, 42, 0.10);
  padding-top: 24px;
  color: var(--elevora-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  font-weight: 750;
}

[data-template-id="elevora"] .elevora-page-hero {
  padding: 72px 0 34px;
}

[data-template-id="elevora"] .elevora-page-hero-inner {
  border-radius: 44px;
  background:
    radial-gradient(circle at 20% 10%, rgba(0,194,255,0.20), transparent 34%),
    linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,255,255,0.48));
  border: 1px solid rgba(255,255,255,0.82);
  padding: clamp(34px, 6vw, 72px);
  box-shadow: 0 30px 90px rgba(15,23,42,0.08);
}

[data-template-id="elevora"] .elevora-page-title {
  margin: 18px 0 0;
  max-width: 860px;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
  color: #050816;
}

[data-template-id="elevora"] .elevora-page-text {
  margin: 24px 0 0;
  max-width: 720px;
  color: var(--elevora-muted);
  font-size: 1.1rem;
  line-height: 1.85;
}

[data-template-id="elevora"] .elevora-reveal {
  animation: elevoraFadeUp 0.82s both cubic-bezier(0.18, 0.82, 0.22, 1);
}

[data-template-id="elevora"] .elevora-delay-1 {
  animation-delay: 0.04s;
}

[data-template-id="elevora"] .elevora-delay-2 {
  animation-delay: 0.12s;
}

[data-template-id="elevora"] .elevora-delay-3 {
  animation-delay: 0.20s;
}

[data-template-id="elevora"] .elevora-delay-4 {
  animation-delay: 0.28s;
}

/* safety: hide any old blue panel from previous version */
[data-template-id="elevora"] .elevora-results-panel,
[data-template-id="elevora"] .elevora-performance-panel,
[data-template-id="elevora"] .elevora-performance-card,
[data-template-id="elevora"] .elevora-stats-feature,
[data-template-id="elevora"] .elevora-stats-intro,
[data-template-id="elevora"] .elevora-metrics-side,
[data-template-id="elevora"] .elevora-dashboard-side,
[data-template-id="elevora"] .elevora-blue-card {
  display: none !important;
}

@keyframes elevoraFadeUp {
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

@keyframes elevoraCardEnter {
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

@keyframes elevoraNumberPop {
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

@keyframes elevoraNumberBounce {
  0% {
    transform: translateY(0) scale(1);
  }

  34% {
    transform: translateY(-14px) scale(1.16);
  }

  62% {
    transform: translateY(3px) scale(0.98);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes elevoraFloat {
  0%, 100% {
    transform: translateY(0) rotate(1deg);
  }

  50% {
    transform: translateY(-15px) rotate(-1.4deg);
  }
}

@keyframes elevoraDashboardFloat {
  0%, 100% {
    transform: translateY(0) rotate(1.5deg);
  }

  50% {
    transform: translateY(-18px) rotate(-1deg);
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

@media (max-width: 1080px) {
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
  [data-template-id="elevora"] .elevora-contact-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-hero-media {
    min-height: 560px;
  }

  [data-template-id="elevora"] .elevora-media-card {
    inset: 0;
  }

  [data-template-id="elevora"] .elevora-dashboard-card {
    left: 20px;
    bottom: 20px;
  }

  [data-template-id="elevora"] .elevora-services-grid,
  [data-template-id="elevora"] .elevora-stats-only {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-template-id="elevora"] .elevora-process {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-cta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  [data-template-id="elevora"] .elevora-shell {
    width: min(100% - 24px, 1180px);
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
    padding-top: 42px;
  }

  [data-template-id="elevora"] .elevora-hero-title,
  [data-template-id="elevora"] .elevora-page-title {
    font-size: clamp(3.2rem, 17vw, 5rem);
  }

  [data-template-id="elevora"] .elevora-hero-actions {
    align-items: stretch;
  }

  [data-template-id="elevora"] .elevora-hero-actions .elevora-btn {
    width: 100%;
    justify-content: center;
  }

  [data-template-id="elevora"] .elevora-hero-media {
    min-height: 480px;
  }

  [data-template-id="elevora"] .elevora-orbit {
    width: 78px;
    height: 78px;
  }

  [data-template-id="elevora"] .elevora-floating-badge {
    right: 12px;
    bottom: 18px;
    width: 180px;
  }

  [data-template-id="elevora"] .elevora-dashboard-card,
  [data-template-id="elevora"] .elevora-mini-kpi {
    display: none;
  }

  [data-template-id="elevora"] .elevora-results-strip .elevora-shell {
    padding: 18px;
    border-radius: 30px;
  }

  [data-template-id="elevora"] .elevora-stats-only,
  [data-template-id="elevora"] .elevora-services-grid {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-stat {
    min-height: 210px;
    border-radius: 28px;
  }

  [data-template-id="elevora"] .elevora-stat-number {
  font-size: clamp(3rem, 15vw, 4.3rem);
}

  [data-template-id="elevora"] .elevora-about-image {
    height: 390px;
  }

  [data-template-id="elevora"] .elevora-section {
    padding: 64px 0;
  }

  [data-template-id="elevora"] .elevora-section-head {
    display: block;
  }

  [data-template-id="elevora"] .elevora-footer-inner {
    display: grid;
  }
}


/* Editor image click fix — does not change visual effects */
[data-template-id="elevora"] .elevora-media-card,
[data-template-id="elevora"] .elevora-about-image {
  cursor: pointer;
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
[data-template-id="elevora"] .elevora-floating-badge,
[data-template-id="elevora"] .elevora-dashboard-card,
[data-template-id="elevora"] .elevora-mini-kpi,
[data-template-id="elevora"] .elevora-about-floating {
  pointer-events: none !important;
}

`;