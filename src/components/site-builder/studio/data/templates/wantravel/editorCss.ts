export const wantravelEditorCss = `
[data-template-id="wantravel"],
[data-template-id="wantravel"] * {
  box-sizing: border-box;
}

[data-template-id="wantravel"] {
  direction: rtl;
  min-height: 100vh;
  overflow-x: hidden;
  background: #f7f1e7;
  color: #1f2a24;
  font-family: Assistant, Heebo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

[data-template-id="wantravel"] a {
  color: inherit;
  text-decoration: none;
}

[data-template-id="wantravel"] img {
  display: block;
  max-width: 100%;
}

@keyframes wanFadeUp {
  from {
    opacity: 0;
    transform: translateY(34px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wanFadeScale {
  from {
    opacity: 0;
    transform: scale(1.045);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes wanFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

@keyframes wanMarqueeRtl {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}

@keyframes wanPulseGlow {
  0%, 100% {
    opacity: 0.42;
    transform: scale(1);
  }
  50% {
    opacity: 0.72;
    transform: scale(1.08);
  }
}

.wan-page {
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 8%, rgba(247, 217, 155, 0.24), transparent 28%),
    linear-gradient(180deg, #f7f1e7 0%, #fff8ef 48%, #f7f1e7 100%);
}

.wan-container {
  width: min(1280px, calc(100% - 40px));
  margin-inline: auto;
}

.wan-reveal {
  opacity: 0;
  animation: wanFadeUp 0.95s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.wan-scale {
  opacity: 0;
  animation: wanFadeScale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.wan-float {
  animation: wanFloat 7s ease-in-out infinite;
}

.wan-header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 50;
  padding: 18px 28px 0;
}

.wan-header-inner {
  width: min(1280px, 100%);
  margin-inline: auto;
  min-height: 70px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  background: rgba(253, 248, 239, 0.82);
  box-shadow: 0 16px 50px rgba(31, 42, 36, 0.12);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 12px 18px 12px 26px;
}

.wan-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.wan-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #18392f;
  color: #f7d99b;
  font-size: 15px;
  font-weight: 950;
  box-shadow: 0 12px 32px rgba(24, 57, 47, 0.22);
}

.wan-brand-name {
  color: #18392f;
  font-size: 21px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.wan-nav {
  display: flex;
  align-items: center;
  gap: 34px;
  color: rgba(47, 64, 56, 0.82);
  font-size: 14px;
  font-weight: 850;
}

.wan-nav a {
  transition: color 0.28s ease, transform 0.28s ease;
}

.wan-nav a:hover {
  color: #b6772f;
  transform: translateY(-1px);
}

.wan-header-cta,
.wan-btn-primary,
.wan-btn-secondary,
.wan-card-link,
.wan-submit {
  cursor: pointer;
  border: 0;
  font-family: inherit;
}

.wan-header-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: max-content;
  border-radius: 999px;
  background: #18392f;
  color: #ffffff;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 950;
  box-shadow: 0 14px 40px rgba(24, 57, 47, 0.24);
  transition: transform 0.3s ease, background 0.3s ease;
}

.wan-header-cta:hover {
  transform: translateY(-2px);
  background: #b6772f;
}

.wan-hero {
  position: relative;
  min-height: 980px;
  overflow: hidden;
  padding: 142px 0 80px;
}

.wan-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.wan-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wan-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 16%, rgba(247, 217, 155, 0.36), transparent 30%),
    radial-gradient(circle at 80% 27%, rgba(255, 255, 255, 0.22), transparent 25%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.13) 44%, #f7f1e7 100%);
}

.wan-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  gap: 48px;
  align-items: end;
  min-height: 720px;
}

.wan-hero-content {
  max-width: 790px;
  padding-top: 80px;
}

.wan-eyebrow-light,
.wan-eyebrow-dark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.02em;
}

.wan-eyebrow-light {
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.wan-eyebrow-dark {
  color: #b6772f;
  padding: 0;
  border-radius: 0;
}

.wan-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f7d99b;
}

.wan-hero-title {
  max-width: 920px;
  margin: 26px 0 0;
  color: #ffffff;
  font-size: clamp(54px, 8vw, 116px);
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 950;
}

.wan-hero-text {
  max-width: 680px;
  margin: 30px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 20px;
  line-height: 1.85;
  font-weight: 750;
}

.wan-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 38px;
}

.wan-btn-primary,
.wan-btn-secondary {
  min-height: 56px;
  border-radius: 999px;
  padding: 0 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 950;
  transition: transform 0.32s ease, background 0.32s ease, color 0.32s ease, border-color 0.32s ease;
}

.wan-btn-primary {
  background: #f7d99b;
  color: #18392f;
  box-shadow: 0 18px 60px rgba(247, 217, 155, 0.24);
}

.wan-btn-primary:hover {
  transform: translateY(-4px);
  background: #ffffff;
}

.wan-btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.wan-btn-secondary:hover {
  transform: translateY(-4px);
  background: #ffffff;
  color: #18392f;
}

.wan-hero-visual {
  position: relative;
  min-height: 610px;
}

.wan-floating-image {
  position: absolute;
  left: 0;
  top: 50px;
  width: min(350px, 48%);
  overflow: hidden;
  border-radius: 42px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.18);
  padding: 12px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(16, 31, 24, 0.2);
}

.wan-floating-image img {
  width: 100%;
  height: 440px;
  object-fit: cover;
  border-radius: 32px;
}

.wan-floating-card {
  position: absolute;
  right: 0;
  bottom: 20px;
  width: min(360px, 58%);
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 248, 234, 0.94);
  color: #18392f;
  padding: 28px;
  box-shadow: 0 24px 80px rgba(16, 31, 24, 0.22);
  backdrop-filter: blur(22px);
}

.wan-floating-card-kicker {
  margin: 0;
  color: #b6772f;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.28em;
}

.wan-floating-card h3 {
  margin: 14px 0 0;
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -0.045em;
  font-weight: 950;
}

.wan-floating-card p:last-child {
  margin: 16px 0 0;
  color: #516158;
  font-size: 14px;
  line-height: 1.9;
  font-weight: 750;
}

.wan-stats {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: -70px;
}

.wan-stat {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.66);
  box-shadow: 0 20px 60px rgba(31, 42, 36, 0.1);
  backdrop-filter: blur(20px);
  padding: 24px;
}

.wan-stat-value {
  color: #18392f;
  font-size: 38px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.wan-stat-label {
  margin-top: 8px;
  color: #617168;
  font-size: 14px;
  font-weight: 850;
}

.wan-marquee-wrap {
  position: relative;
  z-index: 4;
  margin-top: 24px;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid rgba(24, 57, 47, 0.1);
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(16px);
  padding: 15px 22px;
}

.wan-marquee {
  display: flex;
  width: max-content;
  gap: 34px;
  align-items: center;
  color: #18392f;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.25em;
  white-space: nowrap;
  animation: wanMarqueeRtl 28s linear infinite;
}

.wan-section {
  padding: 112px 0;
}

.wan-section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 34px;
  margin-bottom: 54px;
}

.wan-section-title {
  max-width: 760px;
  margin: 16px 0 0;
  color: #18392f;
  font-size: clamp(38px, 4.7vw, 62px);
  line-height: 1.02;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.wan-section-text {
  max-width: 570px;
  margin: 0;
  color: #546259;
  font-size: 16px;
  line-height: 1.95;
  font-weight: 750;
}

.wan-destinations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.wan-destination-card {
  position: relative;
  overflow: hidden;
  min-height: 388px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 55px rgba(28, 43, 35, 0.08);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.wan-destination-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 80px rgba(28, 43, 35, 0.15);
}

.wan-destination-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.wan-destination-card:hover img {
  transform: scale(1.1);
}

.wan-destination-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.62));
}

.wan-destination-tag {
  position: absolute;
  top: 18px;
  right: 18px;
  border-radius: 999px;
  background: rgba(255,255,255,0.86);
  color: #18392f;
  padding: 9px 15px;
  font-size: 12px;
  font-weight: 950;
  backdrop-filter: blur(14px);
}

.wan-destination-body {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  padding: 26px;
  color: #ffffff;
}

.wan-destination-body h3 {
  margin: 0;
  font-size: 28px;
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.wan-destination-body p {
  margin: 8px 0 0;
  color: rgba(255,255,255,0.82);
  font-size: 14px;
  font-weight: 850;
}

.wan-packages-section {
  background:
    radial-gradient(circle at 14% 18%, rgba(247, 217, 155, 0.15), transparent 28%),
    radial-gradient(circle at 84% 18%, rgba(255,255,255,0.1), transparent 24%),
    #18392f;
  color: #ffffff;
}

.wan-packages-section .wan-section-title,
.wan-packages-section .wan-section-text {
  color: #ffffff;
}

.wan-packages-section .wan-section-text {
  color: rgba(255, 255, 255, 0.74);
}

.wan-packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.wan-package-card {
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.075);
  box-shadow: 0 22px 60px rgba(0,0,0,0.18);
  backdrop-filter: blur(10px);
  transition: transform 0.45s ease, background 0.45s ease;
}

.wan-package-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.11);
}

.wan-package-image {
  height: 282px;
  overflow: hidden;
}

.wan-package-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.wan-package-card:hover .wan-package-image img {
  transform: scale(1.07);
}

.wan-package-body {
  padding: 26px;
}

.wan-package-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
}

.wan-package-title {
  margin: 0;
  font-size: 25px;
  line-height: 1.12;
  letter-spacing: -0.04em;
  font-weight: 950;
}

.wan-package-location {
  margin: 10px 0 0;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  line-height: 1.5;
  font-weight: 850;
}

.wan-package-price {
  min-width: max-content;
  border-radius: 999px;
  background: #f7d99b;
  color: #18392f;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 950;
}

.wan-package-list {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.wan-package-list li {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,0.84);
  font-size: 14px;
  font-weight: 800;
}

.wan-list-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f7d99b;
}

.wan-card-link {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  color: #ffffff;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 950;
  transition: transform 0.32s ease, background 0.32s ease, color 0.32s ease;
}

.wan-card-link:hover {
  transform: translateY(-3px);
  background: #ffffff;
  color: #18392f;
}

.wan-process-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 58px;
  align-items: flex-start;
}

.wan-steps {
  display: grid;
  gap: 18px;
}

.wan-step {
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(29,43,35,0.08);
  padding: 28px;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.wan-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 28px 70px rgba(29,43,35,0.12);
}

.wan-step-row {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.wan-step-number {
  color: #b6772f;
  font-size: 42px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.06em;
}

.wan-step h3 {
  margin: 0;
  color: #18392f;
  font-size: 26px;
  line-height: 1.12;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.wan-step p {
  margin: 12px 0 0;
  color: #5a685f;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 740;
}

.wan-reviews-section {
  background: #fdf8ef;
}

.wan-center {
  text-align: center;
  justify-content: center;
}

.wan-center .wan-section-title {
  margin-inline: auto;
}

.wan-reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.wan-review-card {
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 55px rgba(28,43,35,0.08);
  padding: 34px;
}

.wan-stars {
  display: flex;
  gap: 3px;
  color: #b6772f;
  font-size: 18px;
  margin-bottom: 18px;
}

.wan-review-text {
  margin: 0;
  color: #48554d;
  font-size: 19px;
  line-height: 1.9;
  font-weight: 760;
}

.wan-review-name {
  margin: 24px 0 0;
  color: #18392f;
  font-size: 17px;
  font-weight: 950;
}

.wan-review-role {
  margin: 6px 0 0;
  color: #7a867e;
  font-size: 13px;
  font-weight: 850;
}

.wan-booking {
  padding: 112px 0;
}

.wan-booking-card {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 44px;
  border-radius: 44px;
  background:
    radial-gradient(circle at 12% 12%, rgba(247, 217, 155, 0.18), transparent 28%),
    #18392f;
  color: #ffffff;
  box-shadow: 0 28px 90px rgba(24,57,47,0.28);
  padding: 44px;
}

.wan-booking-card .wan-section-title,
.wan-booking-card .wan-section-text {
  color: #ffffff;
}

.wan-booking-card .wan-section-text {
  color: rgba(255,255,255,0.78);
}

.wan-booking-notes {
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.wan-booking-note {
  border-radius: 26px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.08);
  padding: 22px;
}

.wan-booking-note span {
  display: block;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 850;
}

.wan-booking-note strong {
  display: block;
  margin-top: 8px;
  color: #ffffff;
  font-size: 19px;
  line-height: 1.35;
  font-weight: 950;
}

.wan-form {
  border-radius: 34px;
  background: #ffffff;
  color: #18392f;
  box-shadow: 0 18px 50px rgba(0,0,0,0.12);
  padding: 30px;
}

.wan-form-grid {
  display: grid;
  gap: 16px;
}

.wan-field label {
  display: block;
  margin-bottom: 8px;
  color: #18392f;
  font-size: 14px;
  font-weight: 950;
}

.wan-input,
.wan-textarea {
  width: 100%;
  border: 1px solid #d9ddd7;
  outline: none;
  border-radius: 20px;
  background: #fbfbf9;
  color: #18392f;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  transition: border-color 0.28s ease, box-shadow 0.28s ease, background 0.28s ease;
}

.wan-textarea {
  min-height: 132px;
  resize: vertical;
}

.wan-input:focus,
.wan-textarea:focus {
  border-color: #b6772f;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(182, 119, 47, 0.1);
}

.wan-submit {
  width: 100%;
  margin-top: 4px;
  min-height: 58px;
  border-radius: 999px;
  background: #18392f;
  color: #ffffff;
  font-size: 16px;
  font-weight: 950;
  transition: transform 0.32s ease, background 0.32s ease;
}

.wan-submit:hover {
  transform: translateY(-3px);
  background: #b6772f;
}

.wan-footer {
  border-top: 1px solid #e9e0d3;
  padding: 34px 0;
}

.wan-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.wan-footer-brand {
  color: #18392f;
  font-size: 20px;
  line-height: 1;
  font-weight: 950;
}

.wan-footer-text {
  margin-top: 8px;
  color: #68756d;
  font-size: 14px;
  font-weight: 750;
}

.wan-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: #4d5a52;
  font-size: 14px;
  font-weight: 850;
}

.wan-footer-links a {
  transition: color 0.28s ease;
}

.wan-footer-links a:hover {
  color: #b6772f;
}

@media (max-width: 1100px) {
  .wan-nav {
    display: none;
  }

  .wan-hero-grid,
  .wan-process-grid,
  .wan-booking-card {
    grid-template-columns: 1fr;
  }

  .wan-hero {
    min-height: auto;
  }

  .wan-hero-grid {
    min-height: auto;
  }

  .wan-hero-visual {
    display: none;
  }

  .wan-stats,
  .wan-destinations-grid,
  .wan-packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wan-section-head {
    align-items: flex-start;
    flex-direction: column;
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
  }

  .wan-brand-name {
    font-size: 18px;
  }

  .wan-header-cta {
    padding: 12px 15px;
    font-size: 12px;
  }

  .wan-hero {
    padding-top: 112px;
    padding-bottom: 58px;
  }

  .wan-hero-title {
    font-size: clamp(46px, 14vw, 72px);
    letter-spacing: -0.065em;
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

  .wan-stats,
  .wan-destinations-grid,
  .wan-packages-grid,
  .wan-reviews-grid,
  .wan-booking-notes {
    grid-template-columns: 1fr;
  }

  .wan-section {
    padding: 76px 0;
  }

  .wan-section-title {
    font-size: clamp(34px, 11vw, 48px);
  }

  .wan-destination-card {
    min-height: 340px;
  }

  .wan-step-row {
    flex-direction: column;
    gap: 18px;
  }

  .wan-booking {
    padding: 76px 0;
  }

  .wan-booking-card {
    border-radius: 30px;
    padding: 24px;
  }

  .wan-form {
    border-radius: 26px;
    padding: 22px;
  }

  .wan-footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;