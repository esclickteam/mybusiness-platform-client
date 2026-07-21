export const gridlineEditorCss = `
[data-template-id="gridline"] {
  --gala-primary: #000000;
  --gala-secondary: #fc427f;
  --gala-white: #ffffff;
  --gala-border: #e7e7e7;
  --gala-muted: #909090;
  scroll-behavior: smooth;
}

[data-template-id="gridline"] * {
  -webkit-font-smoothing: antialiased;
}

[data-template-id="gridline"] .gala-container {
  width: min(100%, 1200px);
  margin-inline: auto;
  padding-inline: 15px;
}

[data-template-id="gridline"] .gala-custom-title {
  font-size: 34px;
  line-height: 1.176471;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--gala-primary);
  text-align: center;
}

[data-template-id="gridline"] .gala-sub-title {
  color: #000;
  font-weight: 700;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
}

[data-template-id="gridline"] .gala-accent-bar {
  display: block;
  height: 8px;
  width: 100px;
  background: var(--gala-primary);
}

[data-template-id="gridline"] .gala-nav-link {
  transition: all 0.3s ease;
  padding: 15px 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}

[data-template-id="gridline"] .gala-nav-link:hover {
  color: var(--gala-secondary);
  font-size: 20px;
}

[data-template-id="gridline"] .gala-nav-link.is-active {
  background: var(--gala-muted);
  color: #fff;
}

[data-template-id="gridline"] .gala-section-hero {
  position: relative;
  overflow: hidden;
}

[data-template-id="gridline"] .gala-hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.03);
  transition:
    opacity 900ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 1200ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

[data-template-id="gridline"] .gala-hero-slide.is-active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  position: relative;
}

[data-template-id="gridline"] .gala-hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-out, transform 0.2s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  border: none;
}

[data-template-id="gridline"] .gala-section-hero:hover .gala-hero-arrow {
  opacity: 1;
}

[data-template-id="gridline"] .gala-hero-arrow:hover {
  transform: translateY(-50%) scale(1.08);
}

[data-template-id="gridline"] .gala-hero-arrow.prev {
  left: 12px;
}

[data-template-id="gridline"] .gala-hero-arrow.next {
  right: 12px;
}

[data-template-id="gridline"] .gala-hero-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

[data-template-id="gridline"] .gala-dot {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 2px solid #fff;
  box-shadow: 0 0 2px #000;
  cursor: pointer;
  background: transparent;
  transition: background-color 0.25s ease, transform 0.25s ease;
}

[data-template-id="gridline"] .gala-dot.is-active {
  background: #000;
  transform: scale(1.15);
}

[data-template-id="gridline"] .gala-hover-item {
  position: relative;
  cursor: pointer;
}

[data-template-id="gridline"] .gala-bg-hover-left,
[data-template-id="gridline"] .gala-bg-hover-right {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  overflow: visible;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

[data-template-id="gridline"] .gala-bg-hover-left {
  left: 50%;
  transform: translateX(-50%);
}

[data-template-id="gridline"] .gala-bg-hover-right {
  right: 50%;
  transform: translateX(50%);
}

[data-template-id="gridline"] .gala-hover-item:hover .gala-bg-hover-left {
  transform: translateX(-65%);
}

[data-template-id="gridline"] .gala-hover-item:hover .gala-bg-hover-right {
  transform: translateX(65%);
}

[data-template-id="gridline"] .gala-service-circle {
  aspect-ratio: 1 / 1;
  border: 3px solid var(--gala-border);
  border-radius: 50px;
  overflow: hidden;
  width: min(360px, 100%);
  height: min(360px, 100%);
  transition: transform 0.6s ease, box-shadow 0.6s ease;
}

@media (min-width: 768px) {
  [data-template-id="gridline"] .gala-service-circle {
    width: 230px;
    height: 230px;
  }
}

[data-template-id="gridline"] .gala-hover-item:hover .gala-service-circle {
  transform: scale(1.04);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}

[data-template-id="gridline"] .gala-service-circle img {
  transition: transform 0.7s ease;
}

[data-template-id="gridline"] .gala-hover-item:hover .gala-service-circle img {
  transform: scale(1.08);
}

[data-template-id="gridline"] .gala-title-service {
  position: relative;
  width: 100%;
  padding-left: 65px;
  margin-top: 25px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  color: var(--gala-primary);
}

[data-template-id="gridline"] .gala-title-service::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 50px;
  height: 5px;
  background: var(--gala-primary);
}

[data-template-id="gridline"] .gala-hover-transform {
  transition: all 0.6s ease;
  overflow: hidden;
}

[data-template-id="gridline"] .gala-hover-transform:hover {
  transform: scale(1.05);
  transition-duration: 0.7s;
}

[data-template-id="gridline"] .gala-view-more {
  background: var(--gala-primary);
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

[data-template-id="gridline"] .gala-view-more:hover {
  background: #333;
  transform: translateY(-2px);
}

[data-template-id="gridline"] .gala-view-more-link {
  font-style: italic;
  color: var(--gala-secondary);
  text-decoration: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

[data-template-id="gridline"] .gala-view-more-link:hover {
  opacity: 0.85;
  transform: translateX(4px);
}

[data-template-id="gridline"] .gala-welcome-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.95;
}

[data-template-id="gridline"] .gala-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-template-id="gridline"] .gala-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-template-id="gridline"] .gala-custom-hover {
  transition: all 0.3s ease;
}

[data-template-id="gridline"] .gala-custom-hover:hover {
  background-color: #000 !important;
  border-color: #000 !important;
}

[data-template-id="gridline"] .gala-mobile-nav {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

[data-template-id="gridline"] .gala-mobile-nav.is-open {
  max-height: 480px;
}

[data-template-id="gridline"] .gala-service-track {
  display: flex;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-template-id="gridline"] .gala-price-row {
  border-bottom: 1px solid #ececec;
  transition: background-color 0.25s ease, padding-left 0.25s ease;
}

[data-template-id="gridline"] .gala-price-row:hover {
  background: #fafafa;
  padding-left: 8px;
}

[data-template-id="gridline"] .gala-scroll-top {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

[data-template-id="gridline"] .gala-scroll-top.is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-template-id="gridline"] .gala-scroll-top:not(.is-visible) {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}

[data-template-id="gridline"] .gala-breadcrumb {
  background: rgba(72, 72, 72, 0.7);
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
  padding: 28px 15px;
}
`;
