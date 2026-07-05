export const elevoraEditorCss = `
[data-template-id="elevora"],
[data-template-id="elevora"] * {
  box-sizing: border-box;
}

[data-template-id="elevora"] {
  --elevora-bg: #f3f8ff;
  --elevora-surface: #ffffff;
  --elevora-dark: #070a1a;
  --elevora-text: #0b1020;
  --elevora-muted: #64748b;
  --elevora-line: rgba(15, 23, 42, 0.12);
  --elevora-gold: #00c2ff;
  --elevora-gold-dark: #2563eb;
  --elevora-green: #1d4ed8;
  --elevora-soft: #dbeafe;
  --elevora-coral: #ff6b4a;
  --elevora-radius-xl: 34px;
  --elevora-radius-lg: 24px;
  --elevora-radius-md: 18px;
  direction: rtl;
  width: 100%;
  min-height: 100%;
  background:
    radial-gradient(circle at top right, rgba(0, 194, 255, 0.22), transparent 30%),
    radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.14), transparent 32%),
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
  background: linear-gradient(180deg, rgba(246, 241, 231, 0.96), rgba(246, 241, 231, 0.78));
  backdrop-filter: blur(18px);
}

[data-template-id="elevora"] .elevora-header-inner {
  min-height: 72px;
  border: 1px solid var(--elevora-line);
  background: rgba(255, 255, 255, 0.74);
  border-radius: 999px;
  box-shadow: 0 20px 70px rgba(9, 19, 14, 0.08);
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
}

[data-template-id="elevora"] .elevora-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background:
    linear-gradient(135deg, var(--elevora-gold), #f4d995 52%, var(--elevora-gold-dark));
  color: var(--elevora-dark);
  display: grid;
  place-items: center;
  font-weight: 900;
  letter-spacing: -0.03em;
  box-shadow: 0 14px 30px rgba(216, 181, 109, 0.36);
}

[data-template-id="elevora"] .elevora-brand-name {
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
}

[data-template-id="elevora"] .elevora-brand-label {
  margin-top: 5px;
  color: var(--elevora-muted);
  font-size: 0.78rem;
  font-weight: 600;
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
  color: rgba(19, 35, 27, 0.74);
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
  background: var(--elevora-gold);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.25s ease;
}

[data-template-id="elevora"] .elevora-nav-link:hover,
[data-template-id="elevora"] .elevora-nav-link.is-active {
  color: var(--elevora-dark);
  background: rgba(216, 181, 109, 0.15);
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
  min-height: 48px;
  border-radius: 999px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 850;
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
  background: linear-gradient(110deg, transparent, rgba(255,255,255,0.35), transparent);
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
  background: var(--elevora-dark);
  color: #fffaf0;
  box-shadow: 0 20px 45px rgba(9, 19, 14, 0.24);
}

[data-template-id="elevora"] .elevora-btn-primary:hover {
  box-shadow: 0 25px 65px rgba(9, 19, 14, 0.3);
}

[data-template-id="elevora"] .elevora-btn-gold {
  background: linear-gradient(135deg, var(--elevora-gold), #f4d995);
  color: var(--elevora-dark);
  box-shadow: 0 20px 45px rgba(216, 181, 109, 0.3);
}

[data-template-id="elevora"] .elevora-btn-outline {
  border: 1px solid var(--elevora-line);
  background: rgba(255, 255, 255, 0.5);
  color: var(--elevora-text);
}

[data-template-id="elevora"] .elevora-hero {
  position: relative;
  padding: 72px 0 70px;
}

[data-template-id="elevora"] .elevora-hero::before {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  top: -170px;
  left: -180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 181, 109, 0.34), transparent 67%);
  pointer-events: none;
}

[data-template-id="elevora"] .elevora-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
  gap: 44px;
  align-items: center;
}

[data-template-id="elevora"] .elevora-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  border: 1px solid rgba(216, 181, 109, 0.5);
  border-radius: 999px;
  padding: 0 13px;
  background: rgba(255, 255, 255, 0.54);
  color: var(--elevora-green);
  font-size: 0.88rem;
  font-weight: 900;
}

[data-template-id="elevora"] .elevora-eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--elevora-gold);
  box-shadow: 0 0 0 6px rgba(216, 181, 109, 0.18);
}

[data-template-id="elevora"] .elevora-hero-title {
  margin: 24px 0 0;
  max-width: 760px;
  font-size: clamp(3rem, 7vw, 6.8rem);
  line-height: 0.9;
  letter-spacing: -0.085em;
  font-weight: 950;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-highlight {
  display: block;
  color: var(--elevora-green);
}

[data-template-id="elevora"] .elevora-hero-text {
  margin: 26px 0 0;
  max-width: 650px;
  font-size: 1.12rem;
  line-height: 1.85;
  color: var(--elevora-muted);
  font-weight: 520;
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
  color: rgba(19, 35, 27, 0.75);
  font-weight: 750;
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
  border: 3px solid var(--elevora-bg);
  background:
    linear-gradient(135deg, rgba(216, 181, 109, 0.9), rgba(49, 71, 57, 0.95));
}

[data-template-id="elevora"] .elevora-avatar:first-child {
  margin-inline-start: 0;
}

[data-template-id="elevora"] .elevora-hero-media {
  position: relative;
  min-height: 620px;
}

[data-template-id="elevora"] .elevora-media-card {
  position: absolute;
  inset: 0 0 0 34px;
  border-radius: 44px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.64);
  box-shadow: 0 42px 90px rgba(9, 19, 14, 0.22);
  transform: rotate(-1.5deg);
  isolation: isolate;
}

[data-template-id="elevora"] .elevora-media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 30%, rgba(9, 19, 14, 0.58)),
    radial-gradient(circle at 20% 20%, rgba(216, 181, 109, 0.22), transparent 38%);
  z-index: 1;
}

[data-template-id="elevora"] .elevora-media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 0.85s ease;
}

[data-template-id="elevora"] .elevora-media-card:hover img {
  transform: scale(1.1);
}

[data-template-id="elevora"] .elevora-floating-badge {
  position: absolute;
  right: -18px;
  bottom: 44px;
  z-index: 3;
  width: 210px;
  min-height: 145px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255,255,255,0.7);
  box-shadow: 0 30px 70px rgba(9, 19, 14, 0.18);
  backdrop-filter: blur(16px);
  padding: 22px;
  animation: elevoraFloat 5.5s ease-in-out infinite;
}

[data-template-id="elevora"] .elevora-floating-badge strong {
  display: block;
  color: var(--elevora-dark);
  font-size: 2.2rem;
  line-height: 1;
  letter-spacing: -0.05em;
}

[data-template-id="elevora"] .elevora-floating-badge span {
  display: block;
  margin-top: 9px;
  color: var(--elevora-muted);
  line-height: 1.5;
  font-weight: 750;
}

[data-template-id="elevora"] .elevora-orbit {
  position: absolute;
  left: 0;
  top: 38px;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, #fff6da, var(--elevora-gold) 55%, var(--elevora-gold-dark));
  box-shadow: 0 25px 65px rgba(216, 181, 109, 0.34);
  z-index: 4;
  animation: elevoraOrbit 8s linear infinite;
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
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-section-text {
  max-width: 520px;
  color: var(--elevora-muted);
  line-height: 1.85;
  font-weight: 530;
}

[data-template-id="elevora"] .elevora-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

[data-template-id="elevora"] .elevora-stat {
  border: 1px solid var(--elevora-line);
  border-radius: 28px;
  background: rgba(255,255,255,0.58);
  padding: 27px 24px;
  box-shadow: 0 22px 60px rgba(9, 19, 14, 0.06);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    background 0.28s ease;
}

[data-template-id="elevora"] .elevora-stat:hover {
  transform: translateY(-7px);
  background: rgba(255,255,255,0.82);
  box-shadow: 0 28px 75px rgba(9, 19, 14, 0.1);
}

[data-template-id="elevora"] .elevora-stat strong {
  display: block;
  color: var(--elevora-dark);
  font-size: clamp(2rem, 4vw, 3.25rem);
  letter-spacing: -0.06em;
  line-height: 1;
}

[data-template-id="elevora"] .elevora-stat span {
  display: block;
  margin-top: 10px;
  color: var(--elevora-muted);
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
}

[data-template-id="elevora"] .elevora-service-card {
  min-height: 290px;
  border: 1px solid var(--elevora-line);
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.5));
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 85px rgba(9, 19, 14, 0.07);
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease,
    background 0.32s ease;
}

[data-template-id="elevora"] .elevora-service-card:hover {
  transform: translateY(-10px) rotate(-0.6deg);
  border-color: rgba(216, 181, 109, 0.52);
  background: #fffdf7;
  box-shadow: 0 40px 95px rgba(9, 19, 14, 0.13);
}

[data-template-id="elevora"] .elevora-service-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: rgba(216, 181, 109, 0.2);
  color: var(--elevora-green);
  display: grid;
  place-items: center;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-service-card h3 {
  margin: 28px 0 12px;
  font-size: 1.42rem;
  letter-spacing: -0.04em;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-service-card p {
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.75;
  font-weight: 520;
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
  box-shadow: 0 36px 90px rgba(9, 19, 14, 0.18);
}

[data-template-id="elevora"] .elevora-about-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(9,19,14,0.42));
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

[data-template-id="elevora"] .elevora-about-card {
  border-radius: 42px;
  background: var(--elevora-dark);
  color: #fffaf0;
  padding: clamp(28px, 5vw, 54px);
  box-shadow: 0 36px 90px rgba(9, 19, 14, 0.2);
}

[data-template-id="elevora"] .elevora-about-card .elevora-eyebrow {
  background: rgba(255,255,255,0.08);
  color: #fff2cf;
  border-color: rgba(216, 181, 109, 0.35);
}

[data-template-id="elevora"] .elevora-about-card h2 {
  margin: 18px 0 18px;
  font-size: clamp(2.1rem, 4vw, 4.1rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

[data-template-id="elevora"] .elevora-about-card p {
  color: rgba(255,250,240,0.72);
  line-height: 1.9;
  font-weight: 520;
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
  color: rgba(255,250,240,0.9);
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-check::before {
  content: "✓";
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--elevora-gold);
  color: var(--elevora-dark);
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
  border: 1px solid var(--elevora-line);
  border-radius: 34px;
  background: rgba(255,255,255,0.62);
  padding: 30px;
  min-height: 260px;
  overflow: hidden;
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
  background: rgba(216, 181, 109, 0.14);
  transition: transform 0.35s ease;
}

[data-template-id="elevora"] .elevora-step:hover {
  transform: translateY(-9px);
  border-color: rgba(216, 181, 109, 0.5);
  box-shadow: 0 32px 85px rgba(9, 19, 14, 0.11);
}

[data-template-id="elevora"] .elevora-step:hover::before {
  transform: scale(1.25);
}

[data-template-id="elevora"] .elevora-step-number {
  position: relative;
  z-index: 1;
  color: var(--elevora-gold-dark);
  font-size: 0.92rem;
  font-weight: 950;
}

[data-template-id="elevora"] .elevora-step h3 {
  position: relative;
  z-index: 1;
  margin: 42px 0 13px;
  font-size: 1.6rem;
  letter-spacing: -0.05em;
}

[data-template-id="elevora"] .elevora-step p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.76;
  font-weight: 520;
}

[data-template-id="elevora"] .elevora-testimonials {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
  align-items: stretch;
}

[data-template-id="elevora"] .elevora-testimonial-main {
  border-radius: 42px;
  background: var(--elevora-green);
  color: #fffaf0;
  padding: clamp(30px, 5vw, 58px);
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 36px 90px rgba(9, 19, 14, 0.18);
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
  color: rgba(255,250,240,0.66);
}

[data-template-id="elevora"] .elevora-testimonial-list {
  display: grid;
  gap: 18px;
}

[data-template-id="elevora"] .elevora-mini-testimonial {
  border: 1px solid var(--elevora-line);
  border-radius: 30px;
  background: rgba(255,255,255,0.65);
  padding: 28px;
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

[data-template-id="elevora"] .elevora-mini-testimonial:hover {
  transform: translateY(-7px);
  background: #fffdf8;
  box-shadow: 0 26px 70px rgba(9, 19, 14, 0.09);
}

[data-template-id="elevora"] .elevora-mini-testimonial p {
  margin: 0;
  color: var(--elevora-muted);
  line-height: 1.75;
  font-weight: 540;
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
  border: 1px solid var(--elevora-line);
  border-radius: 26px;
  background: rgba(255,255,255,0.66);
  padding: 25px 28px;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

[data-template-id="elevora"] .elevora-faq-item:hover {
  transform: translateY(-5px);
  border-color: rgba(216, 181, 109, 0.48);
  box-shadow: 0 24px 70px rgba(9, 19, 14, 0.08);
}

[data-template-id="elevora"] .elevora-faq-item h3 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
}

[data-template-id="elevora"] .elevora-faq-item p {
  margin: 11px 0 0;
  color: var(--elevora-muted);
  line-height: 1.76;
}

[data-template-id="elevora"] .elevora-cta {
  border-radius: 44px;
  background:
    radial-gradient(circle at 15% 20%, rgba(216, 181, 109, 0.35), transparent 30%),
    linear-gradient(135deg, var(--elevora-dark), #203528);
  color: #fffaf0;
  padding: clamp(34px, 6vw, 70px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  box-shadow: 0 40px 110px rgba(9, 19, 14, 0.22);
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
  color: rgba(255,250,240,0.72);
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
  border: 1px solid var(--elevora-line);
  border-radius: 38px;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 30px 85px rgba(9, 19, 14, 0.08);
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
  background: rgba(246,241,231,0.86);
  border: 1px solid rgba(19,35,27,0.08);
  padding: 16px 18px;
}

[data-template-id="elevora"] .elevora-info-line span {
  display: block;
  color: var(--elevora-muted);
  font-size: 0.86rem;
  font-weight: 800;
}

[data-template-id="elevora"] .elevora-info-line strong {
  display: block;
  margin-top: 4px;
  color: var(--elevora-dark);
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
  font-weight: 850;
  color: var(--elevora-dark);
}

[data-template-id="elevora"] .elevora-field input,
[data-template-id="elevora"] .elevora-field textarea {
  width: 100%;
  border: 1px solid rgba(19,35,27,0.13);
  border-radius: 18px;
  min-height: 54px;
  padding: 0 16px;
  background: rgba(255,255,255,0.85);
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
  border-color: rgba(216,181,109,0.72);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(216,181,109,0.14);
}

[data-template-id="elevora"] .elevora-footer {
  padding: 34px 0 46px;
}

[data-template-id="elevora"] .elevora-footer-inner {
  border-top: 1px solid var(--elevora-line);
  padding-top: 24px;
  color: var(--elevora-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  font-weight: 700;
}

[data-template-id="elevora"] .elevora-page-hero {
  padding: 72px 0 34px;
}

[data-template-id="elevora"] .elevora-page-hero-inner {
  border-radius: 44px;
  background:
    radial-gradient(circle at 20% 10%, rgba(216,181,109,0.33), transparent 34%),
    linear-gradient(135deg, rgba(255,255,255,0.76), rgba(255,255,255,0.42));
  border: 1px solid var(--elevora-line);
  padding: clamp(34px, 6vw, 72px);
  box-shadow: 0 30px 90px rgba(9,19,14,0.08);
}

[data-template-id="elevora"] .elevora-page-title {
  margin: 18px 0 0;
  max-width: 860px;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
  color: var(--elevora-dark);
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
    filter: blur(6px);
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
    transform: translateY(-15px) rotate(-1.4deg);
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

  [data-template-id="elevora"] .elevora-services-grid,
  [data-template-id="elevora"] .elevora-stats {
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
    min-height: 430px;
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

  [data-template-id="elevora"] .elevora-section {
    padding: 64px 0;
  }

  [data-template-id="elevora"] .elevora-section-head {
    display: block;
  }

  [data-template-id="elevora"] .elevora-services-grid,
  [data-template-id="elevora"] .elevora-stats {
    grid-template-columns: 1fr;
  }

  [data-template-id="elevora"] .elevora-about-image {
    height: 390px;
  }

  [data-template-id="elevora"] .elevora-footer-inner {
    display: grid;
  }
}

/* Elevora blue/cyan business palette override — keeps the same layout, only changes the visual identity */
[data-template-id="elevora"] {
  background:
    radial-gradient(circle at 86% 4%, rgba(0, 194, 255, 0.20), transparent 30%),
    radial-gradient(circle at 12% 92%, rgba(37, 99, 235, 0.13), transparent 34%),
    linear-gradient(180deg, #fbfdff 0%, #f3f8ff 48%, #ffffff 100%) !important;
}

[data-template-id="elevora"] .elevora-header {
  background: linear-gradient(180deg, rgba(243, 248, 255, 0.96), rgba(243, 248, 255, 0.78)) !important;
}

[data-template-id="elevora"] .elevora-header-inner,
[data-template-id="elevora"] .elevora-stat,
[data-template-id="elevora"] .elevora-service-card,
[data-template-id="elevora"] .elevora-step,
[data-template-id="elevora"] .elevora-mini-testimonial,
[data-template-id="elevora"] .elevora-faq-item,
[data-template-id="elevora"] .elevora-contact-panel,
[data-template-id="elevora"] .elevora-form-card {
  border-color: rgba(15, 23, 42, 0.12) !important;
  background: rgba(255, 255, 255, 0.74) !important;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08) !important;
}

[data-template-id="elevora"] .elevora-brand-mark {
  background: linear-gradient(135deg, #00c2ff, #dbeafe 52%, #2563eb) !important;
  color: #070a1a !important;
  box-shadow: 0 14px 32px rgba(0, 194, 255, 0.28) !important;
}

[data-template-id="elevora"] .elevora-nav-link {
  color: rgba(11, 16, 32, 0.72) !important;
}

[data-template-id="elevora"] .elevora-nav-link::after {
  background: #00c2ff !important;
}

[data-template-id="elevora"] .elevora-nav-link:hover,
[data-template-id="elevora"] .elevora-nav-link.is-active {
  background: rgba(0, 194, 255, 0.13) !important;
  color: #070a1a !important;
}

[data-template-id="elevora"] .elevora-btn-primary {
  background: linear-gradient(135deg, #070a1a, #111827 52%, #1e3a8a) !important;
  color: #ffffff !important;
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.26) !important;
}

[data-template-id="elevora"] .elevora-btn-primary:hover {
  box-shadow: 0 28px 70px rgba(37, 99, 235, 0.26) !important;
}

[data-template-id="elevora"] .elevora-btn-gold {
  background: linear-gradient(135deg, #00c2ff, #bfdbfe 56%, #ff6b4a) !important;
  color: #070a1a !important;
  box-shadow: 0 22px 54px rgba(0, 194, 255, 0.22) !important;
}

[data-template-id="elevora"] .elevora-btn-outline {
  border-color: rgba(15, 23, 42, 0.12) !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: #0b1020 !important;
}

[data-template-id="elevora"] .elevora-hero::before {
  background: radial-gradient(circle, rgba(0, 194, 255, 0.24), transparent 67%) !important;
}

[data-template-id="elevora"] .elevora-eyebrow {
  border-color: rgba(0, 194, 255, 0.44) !important;
  background: rgba(255, 255, 255, 0.68) !important;
  color: #1d4ed8 !important;
}

[data-template-id="elevora"] .elevora-eyebrow::before {
  background: #00c2ff !important;
  box-shadow: 0 0 0 6px rgba(0, 194, 255, 0.16) !important;
}

[data-template-id="elevora"] .elevora-highlight {
  color: #1d4ed8 !important;
}

[data-template-id="elevora"] .elevora-hero-note {
  color: rgba(11, 16, 32, 0.74) !important;
}

[data-template-id="elevora"] .elevora-avatar {
  border-color: #f3f8ff !important;
  background: linear-gradient(135deg, rgba(0, 194, 255, 0.92), rgba(37, 99, 235, 0.95)) !important;
}

[data-template-id="elevora"] .elevora-media-card {
  box-shadow: 0 42px 90px rgba(15, 23, 42, 0.20) !important;
}

[data-template-id="elevora"] .elevora-media-card::after {
  background:
    linear-gradient(180deg, transparent 30%, rgba(7, 10, 26, 0.58)),
    radial-gradient(circle at 20% 20%, rgba(0, 194, 255, 0.20), transparent 38%) !important;
}

[data-template-id="elevora"] .elevora-floating-badge {
  background: rgba(255, 255, 255, 0.86) !important;
  border-color: rgba(255, 255, 255, 0.76) !important;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.15) !important;
}

[data-template-id="elevora"] .elevora-orbit {
  background: radial-gradient(circle at 35% 35%, #ffffff, #00c2ff 55%, #2563eb) !important;
  box-shadow: 0 25px 65px rgba(0, 194, 255, 0.28) !important;
}

[data-template-id="elevora"] .elevora-service-icon {
  background: rgba(0, 194, 255, 0.13) !important;
  color: #1d4ed8 !important;
}

[data-template-id="elevora"] .elevora-service-card:hover,
[data-template-id="elevora"] .elevora-step:hover,
[data-template-id="elevora"] .elevora-faq-item:hover {
  border-color: rgba(0, 194, 255, 0.50) !important;
  background: #ffffff !important;
  box-shadow: 0 38px 100px rgba(15, 23, 42, 0.12) !important;
}

[data-template-id="elevora"] .elevora-about-image {
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.16) !important;
}

[data-template-id="elevora"] .elevora-about-image::after {
  background: linear-gradient(180deg, transparent, rgba(7, 10, 26, 0.44)) !important;
}

[data-template-id="elevora"] .elevora-about-card {
  background:
    radial-gradient(circle at 14% 12%, rgba(0, 194, 255, 0.22), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(255, 107, 74, 0.18), transparent 31%),
    linear-gradient(135deg, #070a1a, #0b1020 48%, #172554) !important;
  color: #ffffff !important;
}

[data-template-id="elevora"] .elevora-about-card .elevora-eyebrow {
  color: #dbeafe !important;
  border-color: rgba(0, 194, 255, 0.35) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

[data-template-id="elevora"] .elevora-check::before {
  background: #00c2ff !important;
  color: #070a1a !important;
}

[data-template-id="elevora"] .elevora-step::before {
  background: rgba(0, 194, 255, 0.13) !important;
}

[data-template-id="elevora"] .elevora-step-number {
  color: #0284c7 !important;
}

[data-template-id="elevora"] .elevora-testimonial-main {
  background:
    radial-gradient(circle at 12% 18%, rgba(0, 194, 255, 0.22), transparent 34%),
    radial-gradient(circle at 84% 86%, rgba(255, 107, 74, 0.16), transparent 31%),
    linear-gradient(135deg, #0b1020, #172554) !important;
  color: #ffffff !important;
}

[data-template-id="elevora"] .elevora-mini-testimonial:hover {
  background: #ffffff !important;
  box-shadow: 0 26px 70px rgba(15, 23, 42, 0.10) !important;
}

[data-template-id="elevora"] .elevora-cta {
  background:
    radial-gradient(circle at 15% 20%, rgba(0, 194, 255, 0.26), transparent 30%),
    radial-gradient(circle at 85% 88%, rgba(255, 107, 74, 0.18), transparent 32%),
    linear-gradient(135deg, #070a1a, #0b1020 52%, #1e3a8a) !important;
  color: #ffffff !important;
}

[data-template-id="elevora"] .elevora-info-line {
  background: rgba(243, 248, 255, 0.88) !important;
  border-color: rgba(15, 23, 42, 0.08) !important;
}

[data-template-id="elevora"] .elevora-field input,
[data-template-id="elevora"] .elevora-field textarea {
  border-color: rgba(15, 23, 42, 0.13) !important;
  background: rgba(255, 255, 255, 0.88) !important;
}

[data-template-id="elevora"] .elevora-field input:focus,
[data-template-id="elevora"] .elevora-field textarea:focus {
  border-color: rgba(0, 194, 255, 0.72) !important;
  box-shadow: 0 0 0 4px rgba(0, 194, 255, 0.14) !important;
}

[data-template-id="elevora"] .elevora-page-hero-inner {
  background:
    radial-gradient(circle at 20% 10%, rgba(0, 194, 255, 0.24), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(255, 107, 74, 0.12), transparent 30%),
    linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.52)) !important;
}

`;