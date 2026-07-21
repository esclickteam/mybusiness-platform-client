export const salonixEditorCss = `
[data-template-id="salonix"] {
  --salonix-primary: #000000;
  --salonix-secondary: #fc427f;
  --salonix-border: #e7e7e7;
  --salonix-muted: #909090;
}

[data-template-id="salonix"] .salonix-container {
  width: min(100%, 1200px);
  margin-inline: auto;
  padding-inline: 15px;
}

[data-template-id="salonix"] .salonix-title {
  font-size: 34px;
  line-height: 1.18;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--salonix-primary);
  text-align: center;
}

[data-template-id="salonix"] .salonix-subtitle {
  color: #000;
  font-weight: 700;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
}

[data-template-id="salonix"] .salonix-bar {
  display: block;
  height: 8px;
  width: 100px;
  background: var(--salonix-primary);
}

[data-template-id="salonix"] .salonix-nav-btn {
  transition: color 0.3s ease, font-size 0.3s ease, background-color 0.3s ease;
  padding: 15px 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

[data-template-id="salonix"] .salonix-nav-btn:hover {
  color: var(--salonix-secondary);
  font-size: 18px;
}

[data-template-id="salonix"] .salonix-nav-btn.is-active {
  background: var(--salonix-muted);
  color: #fff;
}

[data-template-id="salonix"] .salonix-hero {
  position: relative;
  overflow: hidden;
}

[data-template-id="salonix"] .salonix-hero-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 863 / 320;
}

[data-template-id="salonix"] .salonix-hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.06);
  transition:
    opacity 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 1400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;
}

[data-template-id="salonix"] .salonix-hero-slide.is-active {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
}

[data-template-id="salonix"] .salonix-hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  font-size: 28px;
  line-height: 1;
}

[data-template-id="salonix"] .salonix-hero:hover .salonix-hero-arrow {
  opacity: 1;
}

[data-template-id="salonix"] .salonix-hero-arrow:hover {
  transform: translateY(-50%) scale(1.1);
}

[data-template-id="salonix"] .salonix-hero-arrow.prev {
  right: 12px;
}

[data-template-id="salonix"] .salonix-hero-arrow.next {
  left: 12px;
}

[data-template-id="salonix"] .salonix-hero-dots {
  position: absolute;
  inset-inline: 0;
  bottom: 30px;
  z-index: 5;
  display: flex;
  justify-content: center;
  gap: 8px;
}

[data-template-id="salonix"] .salonix-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 2px #000;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.25s ease;
}

[data-template-id="salonix"] .salonix-dot.is-active {
  background: #000;
  transform: scale(1.2);
}

[data-template-id="salonix"] .salonix-service-card {
  position: relative;
  padding-inline: 15px;
  cursor: pointer;
}

[data-template-id="salonix"] .salonix-leaf-left,
[data-template-id="salonix"] .salonix-leaf-right {
  position: absolute;
  top: 0;
  width: 55%;
  height: 100%;
  pointer-events: none;
  opacity: 0.55;
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.45s ease;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

[data-template-id="salonix"] .salonix-leaf-left {
  right: 50%;
  transform: translateX(50%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cpath fill='%23fc427f33' d='M10 60c20-40 60-50 90-20-20 10-35 30-45 55-15-10-30-22-45-35z'/%3E%3C/svg%3E");
}

[data-template-id="salonix"] .salonix-leaf-right {
  left: 50%;
  transform: translateX(-50%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cpath fill='%23fc427f33' d='M110 60c-20-40-60-50-90-20 20 10 35 30 45 55 15-10 30-22 45-35z'/%3E%3C/svg%3E");
}

[data-template-id="salonix"] .salonix-service-card:hover .salonix-leaf-left {
  transform: translateX(65%);
  opacity: 0.85;
}

[data-template-id="salonix"] .salonix-service-card:hover .salonix-leaf-right {
  transform: translateX(-65%);
  opacity: 0.85;
}

[data-template-id="salonix"] .salonix-service-ring {
  aspect-ratio: 1;
  width: min(280px, 100%);
  height: min(280px, 100%);
  border: 3px solid var(--salonix-border);
  border-radius: 50px;
  overflow: hidden;
  transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.65s ease;
  margin-inline: auto;
}

@media (min-width: 768px) {
  [data-template-id="salonix"] .salonix-service-ring {
    width: 230px;
    height: 230px;
  }
}

[data-template-id="salonix"] .salonix-service-card:hover .salonix-service-ring {
  transform: scale(1.05);
  box-shadow: 0 20px 45px rgba(252, 66, 127, 0.18);
}

[data-template-id="salonix"] .salonix-service-ring img {
  transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-template-id="salonix"] .salonix-service-card:hover .salonix-service-ring img {
  transform: scale(1.1);
}

[data-template-id="salonix"] .salonix-service-label {
  position: relative;
  margin-top: 25px;
  padding-inline-start: 65px;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  color: var(--salonix-primary);
  text-align: start;
  width: 100%;
}

[data-template-id="salonix"] .salonix-service-label::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 9px;
  width: 50px;
  height: 5px;
  background: var(--salonix-primary);
}

[data-template-id="salonix"] .salonix-gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-template-id="salonix"] .salonix-gallery-item:hover {
  transform: scale(1.05);
  z-index: 2;
}

[data-template-id="salonix"] .salonix-gallery-item img {
  transition: transform 0.75s ease, filter 0.75s ease;
}

[data-template-id="salonix"] .salonix-gallery-item:hover img {
  transform: scale(1.08);
  filter: saturate(1.08);
}

[data-template-id="salonix"] .salonix-btn-dark {
  background: var(--salonix-primary);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

[data-template-id="salonix"] .salonix-btn-dark:hover {
  background: #333;
  transform: translateY(-2px);
}

[data-template-id="salonix"] .salonix-link-pink {
  color: var(--salonix-secondary);
  font-style: italic;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: inline-block;
}

[data-template-id="salonix"] .salonix-link-pink:hover {
  transform: translateX(-6px);
  opacity: 0.85;
}

[data-template-id="salonix"] .salonix-welcome-panel {
  position: relative;
  isolation: isolate;
}

[data-template-id="salonix"] .salonix-welcome-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 20% 20%, rgba(252, 66, 127, 0.12), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.06), transparent 40%);
  animation: salonixWelcomePulse 8s ease-in-out infinite;
}

@keyframes salonixWelcomePulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}

[data-template-id="salonix"] .salonix-reveal {
  opacity: 0;
  transform: translateY(36px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-template-id="salonix"] .salonix-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-template-id="salonix"] .salonix-reveal-delay-1 { transition-delay: 100ms; }
[data-template-id="salonix"] .salonix-reveal-delay-2 { transition-delay: 200ms; }
[data-template-id="salonix"] .salonix-reveal-delay-3 { transition-delay: 300ms; }

[data-template-id="salonix"] .salonix-mobile-track {
  display: flex;
  transition: transform 550ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-template-id="salonix"] .salonix-float-btn {
  border: 3px solid #fff;
  transition: all 0.3s ease;
}

[data-template-id="salonix"] .salonix-float-btn:hover {
  background: #000 !important;
  border-color: #000 !important;
  transform: translateY(-3px);
}

[data-template-id="salonix"] .salonix-scroll-top {
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.35s ease;
}

[data-template-id="salonix"] .salonix-scroll-top.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

[data-template-id="salonix"] .salonix-price-row {
  transition: background-color 0.25s ease, padding-inline-start 0.25s ease;
}

[data-template-id="salonix"] .salonix-price-row:hover {
  background: #fafafa;
  padding-inline-start: 10px;
}

[data-template-id="salonix"] .salonix-mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

[data-template-id="salonix"] .salonix-mobile-menu.is-open {
  max-height: 420px;
}

[data-template-id="salonix"] .salonix-banner {
  background: rgba(72, 72, 72, 0.72);
  color: #fff;
  text-align: center;
  padding: 28px 15px;
  font-weight: 600;
  text-transform: uppercase;
}
`;
