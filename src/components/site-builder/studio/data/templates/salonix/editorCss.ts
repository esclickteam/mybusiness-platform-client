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

[data-template-id="salonix"] .salonix-custom-title {
  font-size: 34px;
  line-height: 1.176471;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--salonix-primary);
  text-align: center;
}

[data-template-id="salonix"] .salonix-sub-title {
  color: #000;
  font-weight: 700;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
}

[data-template-id="salonix"] .salonix-accent-bar {
  display: block;
  height: 8px;
  width: 100px;
  background: var(--salonix-primary);
}

[data-template-id="salonix"] .salonix-nav-link {
  transition: all 0.3s ease;
  padding: 15px 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}

[data-template-id="salonix"] .salonix-nav-link:hover {
  color: var(--salonix-secondary) !important;
  font-size: 20px;
}

[data-template-id="salonix"] .salonix-nav-link.is-active {
  background: var(--salonix-muted);
  color: #fff !important;
}

[data-template-id="salonix"] .salonix-mobile-nav-link {
  border: 1px solid var(--salonix-primary);
  padding: 14px 38px;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 26px;
  transition: all 0.3s ease;
}

[data-template-id="salonix"] .salonix-mobile-nav-link.is-active {
  background: var(--salonix-secondary);
  color: #fff;
  border-color: var(--salonix-secondary);
}

[data-template-id="salonix"] .salonix-mobile-nav-link:not(.is-active):hover {
  background: var(--salonix-secondary);
  color: #fff;
}

[data-template-id="salonix"] .salonix-section-hero {
  position: relative;
  width: 100%;
}

[data-template-id="salonix"] .salonix-hero-viewport {
  overflow: hidden;
  width: 100%;
  position: relative;
}

[data-template-id="salonix"] .salonix-hero-track {
  display: flex;
  transition: transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

[data-template-id="salonix"] .salonix-hero-slide {
  min-width: 100%;
  flex-shrink: 0;
}

[data-template-id="salonix"] .salonix-hero-slide img {
  width: 100%;
  aspect-ratio: 863 / 320;
  object-fit: cover;
  cursor: pointer;
}

[data-template-id="salonix"] .salonix-hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-out, transform 0.2s ease;
  width: 50px;
  height: 50px;
  border: none;
  background: transparent;
  padding: 0;
}

[data-template-id="salonix"] .salonix-section-hero:hover .salonix-hero-arrow {
  opacity: 1;
}

[data-template-id="salonix"] .salonix-hero-arrow:hover {
  transform: translateY(-50%) scale(1.08);
}

[data-template-id="salonix"] .salonix-hero-arrow.prev {
  left: 0;
}

[data-template-id="salonix"] .salonix-hero-arrow.next {
  right: 0;
}

[data-template-id="salonix"] .salonix-hero-dots {
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

[data-template-id="salonix"] .salonix-dot {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 2px solid #fff;
  box-shadow: 0 0 2px #000;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.25s ease;
  padding: 0;
}

[data-template-id="salonix"] .salonix-dot.is-active {
  background: #000;
  transform: scale(1.15);
}

[data-template-id="salonix"] .salonix-hover-item {
  position: relative;
  height: 100%;
  width: 100%;
  padding-inline: 15px;
}

[data-template-id="salonix"] .salonix-hover-item:hover {
  cursor: pointer;
}

[data-template-id="salonix"] .salonix-bg-hover-left,
[data-template-id="salonix"] .salonix-bg-hover-right {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  overflow: visible;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

[data-template-id="salonix"] .salonix-bg-hover-left {
  left: 50%;
  transform: translateX(-50%);
}

[data-template-id="salonix"] .salonix-bg-hover-right {
  right: 50%;
  transform: translateX(50%);
}

[data-template-id="salonix"] .salonix-hover-item:hover .salonix-bg-hover-left {
  transform: translateX(-65%);
}

[data-template-id="salonix"] .salonix-hover-item:hover .salonix-bg-hover-right {
  transform: translateX(65%);
}

[data-template-id="salonix"] .salonix-service-ring {
  aspect-ratio: 1 / 1;
  border: 3px solid var(--salonix-border);
  border-radius: 50px;
  overflow: hidden;
  width: 360px;
  height: 360px;
  max-width: 100%;
  transition: transform 0.6s ease, box-shadow 0.6s ease;
}

@media (min-width: 768px) {
  [data-template-id="salonix"] .salonix-service-ring {
    width: 230px;
    height: 230px;
  }
}

[data-template-id="salonix"] .salonix-hover-item:hover .salonix-service-ring {
  transform: scale(1.04);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

[data-template-id="salonix"] .salonix-service-ring img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

[data-template-id="salonix"] .salonix-hover-item:hover .salonix-service-ring img {
  transform: scale(1.08);
}

[data-template-id="salonix"] .salonix-title-service {
  position: relative;
  width: 100%;
  margin-top: 25px;
  padding-inline-start: 65px;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  color: var(--salonix-primary);
  text-align: start;
}

[data-template-id="salonix"] .salonix-title-service::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 9px;
  width: 50px;
  height: 5px;
  background: var(--salonix-primary);
}

[data-template-id="salonix"] .hover_transform_item {
  transition: all 0.6s ease;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
}

[data-template-id="salonix"] .hover_transform_item:hover {
  transform: scale(1.05);
  transition-duration: 0.7s;
}

[data-template-id="salonix"] .hover_transform_item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-template-id="salonix"] .salonix-view-more {
  background-color: var(--salonix-primary);
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

[data-template-id="salonix"] .salonix-view-more:hover {
  background-color: #333;
  transform: translateY(-2px);
}

[data-template-id="salonix"] .salonix-view-more-link {
  color: var(--salonix-secondary);
  font-style: italic;
  font-weight: 400;
  text-decoration: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: inline-block;
}

[data-template-id="salonix"] .salonix-view-more-link:hover {
  opacity: 0.85;
  transform: translateX(-4px);
}

[data-template-id="salonix"] .salonix-welcome-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

[data-template-id="salonix"] .salonix-mobile-track {
  display: flex;
  transition: transform 550ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-template-id="salonix"] .salonix-mobile-menu-wrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

[data-template-id="salonix"] .salonix-mobile-menu-wrap.is-open {
  max-height: 480px;
}

[data-template-id="salonix"] .custom_hover {
  transition: all 0.3s ease;
}

[data-template-id="salonix"] .custom_hover:hover {
  background-color: #000 !important;
  border-color: #000 !important;
}

[data-template-id="salonix"] .salonix-google-maps {
  height: 450px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

[data-template-id="salonix"] .salonix-google-maps iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 768px) {
  [data-template-id="salonix"] .salonix-google-maps {
    height: 400px;
  }
}

[data-template-id="salonix"] .salonix-footer-panel {
  background-position: center;
  background-size: cover;
  padding-top: 50px;
  padding-bottom: 30px;
}

[data-template-id="salonix"] .salonix-scroll-top {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

[data-template-id="salonix"] .salonix-scroll-top.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

[data-template-id="salonix"] .salonix-service-page-ring {
  aspect-ratio: 1;
  border: 3px solid var(--salonix-primary);
  border-radius: 9999px;
  overflow: hidden;
  width: 234px;
  height: 234px;
  margin-inline: auto;
}

@media (min-width: 1024px) {
  [data-template-id="salonix"] .salonix-service-page-ring {
    width: 314px;
    height: 314px;
  }
}

[data-template-id="salonix"] .salonix-price-line {
  transition: background-color 0.25s ease;
}

[data-template-id="salonix"] .salonix-price-line:hover {
  background: #fafafa;
}
`;
