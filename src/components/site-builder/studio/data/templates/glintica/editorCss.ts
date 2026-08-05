export const glinticaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Infant:wght@500;600;700&family=Mulish:wght@400;500;600;700;800&display=swap');

[data-template-id="glintica"],
[data-template-id="glintica"] {
  --p: #D4A0A7;
  --s: #1F1A1C;
  --a: #F0CDD2;
  --bg: #1F1A1C;
  --surface: #2A2326;
  --text: #F8F1F2;
  --muted: #C7B8BB;
  --dark: #120E10;
  font-family: "Mulish", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 86% 18%, rgba(212, 160, 167, 0.14), transparent 28rem),
    linear-gradient(180deg, #1F1A1C 0%, #171315 100%);
}

[data-template-id="glintica"] .t-display,
[data-template-id="glintica"] .t-display {
  font-family: "Cormorant Infant", serif;
}

[data-template-id="glintica"] .t-card,
[data-template-id="glintica"] .t-card,
[data-template-id="glintica"] .gl-button,
[data-template-id="glintica"] .gl-button,
[data-template-id="glintica"] input,
[data-template-id="glintica"] input,
[data-template-id="glintica"] textarea,
[data-template-id="glintica"] textarea,
[data-template-id="glintica"] button,
[data-template-id="glintica"] button {
  border-radius: 0;
}

[data-template-id="glintica"] .gl-mark,
[data-template-id="glintica"] .gl-mark {
  border: 1px solid rgba(212, 160, 167, 0.7);
  background: rgba(212, 160, 167, 0.12);
  color: var(--p);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 30px rgba(212,160,167,0.18);
}

[data-template-id="glintica"] .gl-button,
[data-template-id="glintica"] .gl-button {
  border: 1px solid var(--p);
  background: var(--p);
  color: var(--dark);
  box-shadow: 0 18px 45px rgba(212, 160, 167, 0.18);
  transition: transform .35s ease, background .35s ease, color .35s ease, box-shadow .35s ease;
}

[data-template-id="glintica"] .gl-button:hover,
[data-template-id="glintica"] .gl-button:hover {
  transform: translateY(-3px);
  background: transparent;
  color: var(--p);
  box-shadow: 0 24px 55px rgba(212, 160, 167, 0.25);
}

@keyframes gl-hero-breathe {
  0% { transform: scale(1.06) translate3d(0,0,0); filter: saturate(.88); }
  100% { transform: scale(1) translate3d(0,-1.4%,0); filter: saturate(1.04); }
}

@keyframes gl-underline {
  0% { transform: scaleX(0); opacity: .3; }
  55% { transform: scaleX(1.08); opacity: 1; }
  100% { transform: scaleX(1); opacity: 1; }
}

@keyframes gl-float {
  0%, 100% { transform: translate3d(0,0,0) rotate(0deg); opacity: .34; }
  50% { transform: translate3d(-20px,22px,0) rotate(8deg); opacity: .62; }
}

@keyframes gl-tier-sweep {
  0% { transform: translateX(120%); }
  100% { transform: translateX(-120%); }
}

[data-template-id="glintica"] .gl-hero-image,
[data-template-id="glintica"] .gl-hero-image {
  animation: gl-hero-breathe 13s ease-out both;
}

[data-template-id="glintica"] .gl-hero-title,
[data-template-id="glintica"] .gl-hero-title {
  letter-spacing: -0.07em;
  text-shadow: 0 30px 70px rgba(0,0,0,0.45);
}

[data-template-id="glintica"] .gl-rose-underline,
[data-template-id="glintica"] .gl-rose-underline {
  transform-origin: center;
  background: linear-gradient(90deg, transparent, var(--p), transparent);
  animation: gl-underline 1.25s .35s cubic-bezier(.22,1,.36,1) both;
}

[data-template-id="glintica"] .gl-petal,
[data-template-id="glintica"] .gl-petal {
  position: absolute;
  z-index: 1;
  border: 1px solid rgba(212,160,167,.24);
  background: rgba(212,160,167,.08);
  animation: gl-float 7s ease-in-out infinite;
}

[data-template-id="glintica"] .gl-petal-one,
[data-template-id="glintica"] .gl-petal-one {
  top: 23%;
  right: 11%;
  width: 9rem;
  height: 12rem;
}

[data-template-id="glintica"] .gl-petal-two,
[data-template-id="glintica"] .gl-petal-two {
  left: 8%;
  bottom: 18%;
  width: 6rem;
  height: 8rem;
  animation-delay: -2.5s;
}

[data-template-id="glintica"] .gl-price-row,
[data-template-id="glintica"] .gl-price-row {
  transition: padding .35s ease, background .35s ease;
}

[data-template-id="glintica"] .gl-price-row:hover,
[data-template-id="glintica"] .gl-price-row:hover {
  background: rgba(212,160,167,.055);
  padding-right: 1rem;
}

[data-template-id="glintica"] .gl-dots,
[data-template-id="glintica"] .gl-dots {
  height: 1px;
  margin-bottom: 1.05rem;
  background-image: radial-gradient(circle, rgba(212,160,167,.55) 1.2px, transparent 1.2px);
  background-size: 10px 1px;
}

[data-template-id="glintica"] .gl-compare,
[data-template-id="glintica"] .gl-compare {
  box-shadow: 0 35px 90px rgba(0,0,0,.28);
}

[data-template-id="glintica"] .gl-range,
[data-template-id="glintica"] .gl-range {
  accent-color: var(--p);
}

[data-template-id="glintica"] .gl-tier,
[data-template-id="glintica"] .gl-tier,
[data-template-id="glintica"] .gl-masonry,
[data-template-id="glintica"] .gl-masonry {
  border-radius: 0;
  transition: transform .45s ease, border-color .35s ease, box-shadow .35s ease;
}

[data-template-id="glintica"] .gl-tier:hover,
[data-template-id="glintica"] .gl-tier:hover {
  transform: translateY(-8px);
  border-color: rgba(212,160,167,.78);
  box-shadow: 0 28px 70px rgba(0,0,0,.28);
}

[data-template-id="glintica"] .gl-tier-bar::after,
[data-template-id="glintica"] .gl-tier-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
  animation: gl-tier-sweep 3.6s ease-in-out infinite;
}

[data-template-id="glintica"] .gl-masonry:hover,
[data-template-id="glintica"] .gl-masonry:hover {
  transform: translateY(-6px) scale(.99);
  border-color: rgba(212,160,167,.7);
}
`;
