export const bladehausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800;900&display=swap');

[data-template-id="bladehaus"],
[data-template-id="bladehaus"] {
  --p: #F3F3F3;
  --s: #111111;
  --a: #C0A060;
  --bg: #111111;
  --surface: #181818;
  --text: #F2F2F2;
  --muted: #A3A3A3;
  --dark: #000000;
  font-family: "Barlow", sans-serif;
  color: var(--text);
  background:
    linear-gradient(90deg, rgba(192,160,96,.08) 1px, transparent 1px) 0 0 / 92px 92px,
    linear-gradient(180deg, #111 0%, #050505 100%);
}

[data-template-id="bladehaus"] .t-display,
[data-template-id="bladehaus"] .t-display {
  font-family: "Bebas Neue", sans-serif;
}

[data-template-id="bladehaus"] .t-card,
[data-template-id="bladehaus"] .t-card,
[data-template-id="bladehaus"] article,
[data-template-id="bladehaus"] article,
[data-template-id="bladehaus"] input,
[data-template-id="bladehaus"] input,
[data-template-id="bladehaus"] textarea,
[data-template-id="bladehaus"] textarea,
[data-template-id="bladehaus"] button,
[data-template-id="bladehaus"] button {
  border-radius: 0;
}

@keyframes bh-hero-push {
  0% { transform: scale(1.08) translateX(1.5%); filter: grayscale(1) contrast(1.08); }
  100% { transform: scale(1) translateX(0); filter: grayscale(1) contrast(1.22); }
}

@keyframes bh-glint {
  0% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
  18% { opacity: .8; }
  48% { opacity: .4; }
  100% { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
}

@keyframes bh-marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(33.333%); }
}

@keyframes bh-crosshair-pulse {
  0%, 100% { opacity: .25; transform: scaleY(.92); }
  50% { opacity: .75; transform: scaleY(1); }
}

[data-template-id="bladehaus"] .bh-mark,
[data-template-id="bladehaus"] .bh-mark {
  border: 2px solid var(--a);
  color: var(--a);
  background: #050505;
  box-shadow: inset 0 0 0 2px #000, 0 0 0 1px rgba(255,255,255,.14);
}

[data-template-id="bladehaus"] .bh-outline,
[data-template-id="bladehaus"] .bh-outline {
  border: 1px solid var(--a);
  color: var(--a);
  background: transparent;
  transition: background .25s ease, color .25s ease, transform .25s ease;
}

[data-template-id="bladehaus"] .bh-outline:hover,
[data-template-id="bladehaus"] .bh-outline:hover {
  transform: translateY(-2px);
  background: var(--a);
  color: #000;
}

[data-template-id="bladehaus"] .bh-hero-image,
[data-template-id="bladehaus"] .bh-hero-image {
  animation: bh-hero-push 11s ease-out both;
}

[data-template-id="bladehaus"] .bh-hero-type,
[data-template-id="bladehaus"] .bh-hero-type {
  text-shadow: 7px 7px 0 rgba(192,160,96,.26), 0 26px 70px rgba(0,0,0,.65);
}

[data-template-id="bladehaus"] .bh-crosshair,
[data-template-id="bladehaus"] .bh-crosshair {
  transform-origin: center;
  animation: bh-crosshair-pulse 2.8s ease-in-out infinite;
}

[data-template-id="bladehaus"] .bh-crosshair::before,
[data-template-id="bladehaus"] .bh-crosshair::before {
  content: "";
  position: absolute;
  top: 52%;
  left: -36px;
  width: 72px;
  height: 1px;
  background: var(--a);
}

[data-template-id="bladehaus"] .bh-price-panel,
[data-template-id="bladehaus"] .bh-price-panel,
[data-template-id="bladehaus"] .bh-review,
[data-template-id="bladehaus"] .bh-review {
  position: relative;
  overflow: hidden;
  transition: transform .35s ease, border-color .35s ease, background .35s ease;
}

[data-template-id="bladehaus"] .bh-price-panel::after,
[data-template-id="bladehaus"] .bh-price-panel::after,
[data-template-id="bladehaus"] .bh-review::after,
[data-template-id="bladehaus"] .bh-review::after {
  content: "";
  position: absolute;
  inset: -40% auto -40% 70%;
  width: 35%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
  transform: translateX(140%) skewX(-18deg);
}

[data-template-id="bladehaus"] .bh-price-panel:hover,
[data-template-id="bladehaus"] .bh-price-panel:hover,
[data-template-id="bladehaus"] .bh-review:hover,
[data-template-id="bladehaus"] .bh-review:hover {
  transform: translateY(-7px);
  border-color: var(--a);
  background: #101010;
}

[data-template-id="bladehaus"] .bh-price-panel:hover::after,
[data-template-id="bladehaus"] .bh-price-panel:hover::after,
[data-template-id="bladehaus"] .bh-review:hover::after,
[data-template-id="bladehaus"] .bh-review:hover::after {
  animation: bh-glint .95s ease both;
}

[data-template-id="bladehaus"] .bh-chrome,
[data-template-id="bladehaus"] .bh-chrome {
  color: #111;
  background: linear-gradient(135deg, #fff, #777 48%, #fff 52%, #bababa);
}

[data-template-id="bladehaus"] .bh-strip,
[data-template-id="bladehaus"] .bh-strip,
[data-template-id="bladehaus"] .bh-gallery-column,
[data-template-id="bladehaus"] .bh-gallery-column {
  border-radius: 0;
  transition: transform .45s ease, border-color .35s ease;
}

[data-template-id="bladehaus"] .bh-strip:hover,
[data-template-id="bladehaus"] .bh-strip:hover,
[data-template-id="bladehaus"] .bh-gallery-column:hover,
[data-template-id="bladehaus"] .bh-gallery-column:hover {
  transform: translateY(-8px);
  border-color: var(--a);
}

[data-template-id="bladehaus"] .bh-marquee,
[data-template-id="bladehaus"] .bh-marquee {
  animation: bh-marquee-scroll 24s linear infinite;
  will-change: transform;
}

[data-template-id="bladehaus"] ::selection,
[data-template-id="bladehaus"] ::selection {
  background: var(--a);
  color: #000;
}
`;
