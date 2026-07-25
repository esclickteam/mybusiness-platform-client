export const aurayogaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

[data-template-id="aurayoga"],
[data-template-id="aurayoga-preview"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #A78BFA;
  --bg: #1C1526;
  --surface: #2A2036;
  --text: #F5F0FF;
  --muted: #B7A9C9;
  --dark: #120E18;
  font-family: "Outfit", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 10% 20%, rgba(167, 139, 250, 0.18), transparent 26rem),
    linear-gradient(180deg, #1C1526 0%, #120E18 100%);
}

[data-template-id="aurayoga"] *,
[data-template-id="aurayoga-preview"] * {
  border-radius: 0 !important;
}

[data-template-id="aurayoga"] .t-display,
[data-template-id="aurayoga-preview"] .t-display {
  font-family: "Cormorant Garamond", serif;
}

[data-template-id="aurayoga"] a,
[data-template-id="aurayoga-preview"] a,
[data-template-id="aurayoga"] button,
[data-template-id="aurayoga-preview"] button {
  transition: background .24s ease, border-color .24s ease, color .24s ease, transform .24s ease, opacity .24s ease;
}

[data-template-id="aurayoga"] a:hover,
[data-template-id="aurayoga-preview"] a:hover,
[data-template-id="aurayoga"] button:hover,
[data-template-id="aurayoga-preview"] button:hover {
  transform: translateY(-2px);
}

[data-template-id="aurayoga"] .aura-glass,
[data-template-id="aurayoga-preview"] .aura-glass {
  background: linear-gradient(135deg, rgba(28, 21, 38, .72), rgba(42, 32, 54, .38));
}

[data-template-id="aurayoga"] .aura-nav-link,
[data-template-id="aurayoga-preview"] .aura-nav-link {
  position: relative;
}

[data-template-id="aurayoga"] .aura-nav-link::after,
[data-template-id="aurayoga-preview"] .aura-nav-link::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  bottom: -8px;
  height: 1px;
  background: var(--p);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform .28s ease;
}

[data-template-id="aurayoga"] .aura-nav-link:hover::after,
[data-template-id="aurayoga-preview"] .aura-nav-link:hover::after {
  transform: scaleX(1);
}

[data-template-id="aurayoga"] .aura-ken,
[data-template-id="aurayoga-preview"] .aura-ken {
  animation: aura-kenburns 21s ease-out both;
  filter: saturate(.82) contrast(.96) brightness(.82);
  transform-origin: 48% 50%;
}

@keyframes aura-kenburns {
  from { transform: scale(1.13) translate3d(1.5%, -1.5%, 0); }
  to { transform: scale(1.02) translate3d(-1%, 1%, 0); }
}

[data-template-id="aurayoga"] .aura-brand,
[data-template-id="aurayoga-preview"] .aura-brand {
  font-style: italic;
  letter-spacing: -.055em;
  text-shadow: 0 22px 70px rgba(167, 139, 250, .24);
}

[data-template-id="aurayoga"] .aura-orb,
[data-template-id="aurayoga-preview"] .aura-orb {
  position: absolute;
  width: 24rem;
  height: 24rem;
  border: 1px solid rgba(167, 139, 250, .22);
  opacity: .7;
  pointer-events: none;
}

[data-template-id="aurayoga"] .aura-orb-one,
[data-template-id="aurayoga-preview"] .aura-orb-one {
  right: 8vw;
  top: 18vh;
  animation: aura-float 11s ease-in-out infinite;
}

[data-template-id="aurayoga"] .aura-orb-two,
[data-template-id="aurayoga-preview"] .aura-orb-two {
  left: 10vw;
  bottom: 12vh;
  width: 14rem;
  height: 14rem;
  animation: aura-float 13s ease-in-out infinite reverse;
}

@keyframes aura-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50% { transform: translate3d(0, -18px, 0) rotate(4deg); }
}

[data-template-id="aurayoga"] .aura-class-card,
[data-template-id="aurayoga-preview"] .aura-class-card,
[data-template-id="aurayoga"] .aura-teacher-card,
[data-template-id="aurayoga-preview"] .aura-teacher-card,
[data-template-id="aurayoga"] .aura-review,
[data-template-id="aurayoga-preview"] .aura-review {
  transition: transform .32s cubic-bezier(.22, 1, .36, 1), border-color .32s ease, box-shadow .32s ease;
}

[data-template-id="aurayoga"] .aura-class-card:hover,
[data-template-id="aurayoga-preview"] .aura-class-card:hover,
[data-template-id="aurayoga"] .aura-teacher-card:hover,
[data-template-id="aurayoga-preview"] .aura-teacher-card:hover {
  border-color: rgba(167, 139, 250, .85);
  box-shadow: 0 28px 80px rgba(10, 7, 14, .36);
  transform: translateY(-10px);
}

[data-template-id="aurayoga"] .aura-class-card img,
[data-template-id="aurayoga-preview"] .aura-class-card img,
[data-template-id="aurayoga"] .aura-teacher-card img,
[data-template-id="aurayoga-preview"] .aura-teacher-card img,
[data-template-id="aurayoga"] .aura-retreat-image,
[data-template-id="aurayoga-preview"] .aura-retreat-image {
  filter: saturate(.86) contrast(.96);
  transition: transform .7s ease, filter .4s ease;
}

[data-template-id="aurayoga"] .aura-class-card:hover img,
[data-template-id="aurayoga-preview"] .aura-class-card:hover img,
[data-template-id="aurayoga"] .aura-teacher-card:hover img,
[data-template-id="aurayoga-preview"] .aura-teacher-card:hover img {
  filter: saturate(1.02) contrast(1.02);
  transform: scale(1.06);
}

[data-template-id="aurayoga"] .aura-soft-line,
[data-template-id="aurayoga-preview"] .aura-soft-line {
  position: absolute;
  inset-inline: -10vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, .44), transparent);
}

[data-template-id="aurayoga"] .aura-floating-band,
[data-template-id="aurayoga-preview"] .aura-floating-band {
  transition: transform .32s ease, border-color .32s ease, background .32s ease;
}

[data-template-id="aurayoga"] .aura-floating-band:hover,
[data-template-id="aurayoga-preview"] .aura-floating-band:hover,
[data-template-id="aurayoga"] .aura-count-band:hover,
[data-template-id="aurayoga-preview"] .aura-count-band:hover {
  border-color: rgba(167, 139, 250, .72);
  transform: translateX(-8px);
}

[data-template-id="aurayoga"] .aura-schedule-row,
[data-template-id="aurayoga-preview"] .aura-schedule-row {
  transition: background .28s ease, padding-inline .28s ease;
}

[data-template-id="aurayoga"] .aura-schedule-row:hover,
[data-template-id="aurayoga-preview"] .aura-schedule-row:hover {
  background: rgba(167, 139, 250, .07);
  padding-inline: 1rem;
}

[data-template-id="aurayoga"] .aura-retreat-image,
[data-template-id="aurayoga-preview"] .aura-retreat-image {
  animation: aura-retreat-pan 18s ease-in-out infinite alternate;
}

@keyframes aura-retreat-pan {
  from { transform: scale(1.06) translateX(1.5%); }
  to { transform: scale(1.12) translateX(-1.5%); }
}

[data-template-id="aurayoga"] .aura-quote-bg,
[data-template-id="aurayoga-preview"] .aura-quote-bg {
  position: absolute;
  inset-inline-start: 5vw;
  top: -6rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 28rem;
  line-height: 1;
  color: rgba(167, 139, 250, .06);
  pointer-events: none;
}

[data-template-id="aurayoga"] input,
[data-template-id="aurayoga-preview"] input,
[data-template-id="aurayoga"] textarea,
[data-template-id="aurayoga-preview"] textarea {
  font-family: "Outfit", sans-serif;
}

[data-template-id="aurayoga"] input::placeholder,
[data-template-id="aurayoga-preview"] input::placeholder,
[data-template-id="aurayoga"] textarea::placeholder,
[data-template-id="aurayoga-preview"] textarea::placeholder {
  color: rgba(245, 240, 255, .45);
}

[data-template-id="aurayoga"] .aura-footer-gradient,
[data-template-id="aurayoga-preview"] .aura-footer-gradient {
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,.18), transparent 18rem),
    linear-gradient(135deg, #3A2456 0%, #A78BFA 100%);
}

@media (max-width: 767px) {
  [data-template-id="aurayoga"] .aura-orb,
  [data-template-id="aurayoga-preview"] .aura-orb {
    display: none;
  }
}

[data-template-id="aurayoga"] .text-center,
[data-template-id="aurayoga-preview"] .text-center {
  text-align: center;
}
`;
