export const markoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');

[data-template-id="markora"],
[data-template-id="markora-preview"] {
  --p: #FF2D55;
  --s: #0A0A0B;
  --a: #FF6B8A;
  --bg: #0A0A0B;
  --surface: #141416;
  --text: #F7F7F8;
  --muted: #A5A5AD;
  --dark: #050505;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="markora"] *,
[data-template-id="markora-preview"] * {
  border-radius: 0 !important;
}

[data-template-id="markora"] .t-display,
[data-template-id="markora-preview"] .t-display {
  font-family: "Syne", sans-serif;
}

@keyframes markora-ken-burns {
  0% { transform: scale(1.14) translate3d(-2%, 2%, 0); }
  100% { transform: scale(1.01) translate3d(2%, -2%, 0); }
}

@keyframes markora-hero-hit {
  from { opacity: 0; transform: translateY(34px) skewX(-4deg); }
  to { opacity: 1; transform: translateY(0) skewX(0); }
}

@keyframes markora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(33.333%); }
}

[data-template-id="markora"] .m-ken,
[data-template-id="markora-preview"] .m-ken {
  animation: markora-ken-burns 16s ease-out both;
  transform-origin: center;
}

[data-template-id="markora"] .m-hero-in,
[data-template-id="markora-preview"] .m-hero-in {
  animation: markora-hero-hit .8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="markora"] .m-d1,
[data-template-id="markora-preview"] .m-d1 { animation-delay: .1s; }
[data-template-id="markora"] .m-d2,
[data-template-id="markora-preview"] .m-d2 { animation-delay: .2s; }
[data-template-id="markora"] .m-d3,
[data-template-id="markora-preview"] .m-d3 { animation-delay: .32s; }

[data-template-id="markora"] .m-hero-grid,
[data-template-id="markora-preview"] .m-hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, .08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .08) 1px, transparent 1px);
  background-size: 54px 54px;
}

[data-template-id="markora"] .m-diagonal,
[data-template-id="markora-preview"] .m-diagonal {
  transform: rotate(14deg);
}

[data-template-id="markora"] .m-chaos,
[data-template-id="markora-preview"] .m-chaos {
  text-shadow: 10px 0 0 rgba(255, 45, 85, .48), -8px 0 0 rgba(255, 255, 255, .08);
}

[data-template-id="markora"] .m-nav-link,
[data-template-id="markora-preview"] .m-nav-link,
[data-template-id="markora"] .m-inline-link,
[data-template-id="markora-preview"] .m-inline-link {
  position: relative;
  transition: color .25s ease;
}

[data-template-id="markora"] .m-nav-link::after,
[data-template-id="markora-preview"] .m-nav-link::after,
[data-template-id="markora"] .m-inline-link::after,
[data-template-id="markora-preview"] .m-inline-link::after {
  position: absolute;
  right: 0;
  bottom: -.25rem;
  width: 100%;
  height: 3px;
  content: "";
  background: var(--p);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform .28s cubic-bezier(0.22, 1, 0.36, 1);
}

[data-template-id="markora"] .m-nav-link:hover,
[data-template-id="markora-preview"] .m-nav-link:hover,
[data-template-id="markora"] .m-inline-link:hover,
[data-template-id="markora-preview"] .m-inline-link:hover {
  color: var(--p);
}

[data-template-id="markora"] .m-nav-link:hover::after,
[data-template-id="markora-preview"] .m-nav-link:hover::after,
[data-template-id="markora"] .m-inline-link:hover::after,
[data-template-id="markora-preview"] .m-inline-link:hover::after {
  transform: scaleX(1);
}

[data-template-id="markora"] .m-service-row,
[data-template-id="markora-preview"] .m-service-row {
  position: relative;
  overflow: hidden;
  transition: background .3s ease, padding-inline-start .35s ease;
}

[data-template-id="markora"] .m-service-row::before,
[data-template-id="markora-preview"] .m-service-row::before {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  content: "";
  background: var(--p);
  transform: scaleY(.22);
  transform-origin: bottom center;
  transition: width .35s ease, transform .35s ease;
}

[data-template-id="markora"] .m-service-row:hover,
[data-template-id="markora-preview"] .m-service-row:hover {
  background: #101012;
  padding-inline-start: 1.5rem;
}

[data-template-id="markora"] .m-service-row:hover::before,
[data-template-id="markora-preview"] .m-service-row:hover::before {
  width: 12px;
  transform: scaleY(1);
}

[data-template-id="markora"] .m-marquee-track,
[data-template-id="markora-preview"] .m-marquee-track {
  animation: markora-marquee 18s linear infinite;
}

[data-template-id="markora"] .m-marquee-track:hover,
[data-template-id="markora-preview"] .m-marquee-track:hover {
  animation-play-state: paused;
}

[data-template-id="markora"] .m-mosaic-tile img,
[data-template-id="markora-preview"] .m-mosaic-tile img {
  filter: grayscale(.1) contrast(1.05);
  transition: transform .7s cubic-bezier(0.22, 1, 0.36, 1), filter .45s ease;
}

[data-template-id="markora"] .m-mosaic-tile:hover img,
[data-template-id="markora-preview"] .m-mosaic-tile:hover img {
  filter: grayscale(0) contrast(1.14) saturate(1.2);
  transform: scale(1.1);
}

[data-template-id="markora"] .m-step-block,
[data-template-id="markora-preview"] .m-step-block {
  transform: skewY(-3deg);
  transition: transform .35s ease, background .35s ease, border-color .35s ease;
}

[data-template-id="markora"] .m-step-block > *,
[data-template-id="markora-preview"] .m-step-block > * {
  transform: skewY(3deg);
}

[data-template-id="markora"] .m-zigzag > div:nth-child(even) .m-step-block,
[data-template-id="markora-preview"] .m-zigzag > div:nth-child(even) .m-step-block {
  margin-top: 3rem;
  transform: skewY(3deg);
}

[data-template-id="markora"] .m-zigzag > div:nth-child(even) .m-step-block > *,
[data-template-id="markora-preview"] .m-zigzag > div:nth-child(even) .m-step-block > * {
  transform: skewY(-3deg);
}

[data-template-id="markora"] .m-step-block:hover,
[data-template-id="markora-preview"] .m-step-block:hover {
  border-color: var(--p);
  background: #1B1016;
  transform: translateY(-8px) skewY(-3deg);
}

[data-template-id="markora"] .m-zigzag > div:nth-child(even) .m-step-block:hover,
[data-template-id="markora-preview"] .m-zigzag > div:nth-child(even) .m-step-block:hover {
  transform: translateY(-8px) skewY(3deg);
}

[data-template-id="markora"] .m-quote-bar,
[data-template-id="markora-preview"] .m-quote-bar {
  transition: transform .35s ease, background .35s ease;
}

[data-template-id="markora"] .m-quote-bar:hover,
[data-template-id="markora-preview"] .m-quote-bar:hover {
  background: #1A1A1D;
  transform: translateX(-8px);
}

[data-template-id="markora"] .m-contact-panel,
[data-template-id="markora-preview"] .m-contact-panel {
  background-image:
    linear-gradient(135deg, rgba(10,10,11,.16) 25%, transparent 25%),
    linear-gradient(315deg, rgba(10,10,11,.16) 25%, transparent 25%);
  background-size: 38px 38px;
}

@media (prefers-reduced-motion: reduce) {
  [data-template-id="markora"] .m-ken,
  [data-template-id="markora-preview"] .m-ken,
  [data-template-id="markora"] .m-hero-in,
  [data-template-id="markora-preview"] .m-hero-in,
  [data-template-id="markora"] .m-marquee-track,
  [data-template-id="markora-preview"] .m-marquee-track {
    animation: none;
  }
}
`;
