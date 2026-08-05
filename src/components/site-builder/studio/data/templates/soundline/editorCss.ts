export const soundlineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

[data-template-id="soundline"],
[data-template-id="soundline"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #FF4D6D;
  --bg: #060609;
  --surface: #101016;
  --text: #F7F7FB;
  --muted: #B7B7C8;
  --dark: #030305;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background:
    linear-gradient(90deg, rgba(255, 77, 109, .08) 1px, transparent 1px),
    linear-gradient(180deg, #060609 0%, #101016 100%);
  background-size: 72px 72px, auto;
}

[data-template-id="soundline"] *,
[data-template-id="soundline"] * {
  border-radius: 0 !important;
}

[data-template-id="soundline"] .t-display,
[data-template-id="soundline"] .t-display {
  font-family: "Bebas Neue", sans-serif;
  letter-spacing: .02em;
}

[data-template-id="soundline"] a,
[data-template-id="soundline"] a,
[data-template-id="soundline"] button,
[data-template-id="soundline"] button {
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
}

[data-template-id="soundline"] a:hover,
[data-template-id="soundline"] a:hover,
[data-template-id="soundline"] button:hover,
[data-template-id="soundline"] button:hover {
  transform: translateY(-3px);
}

[data-template-id="soundline"] .sound-nav-link,
[data-template-id="soundline"] .sound-nav-link {
  position: relative;
}

[data-template-id="soundline"] .sound-nav-link::before,
[data-template-id="soundline"] .sound-nav-link::before {
  content: "";
  position: absolute;
  top: 50%;
  inset-inline-start: -14px;
  width: 6px;
  height: 6px;
  background: var(--p);
  opacity: 0;
  transform: translateY(-50%) scale(.4);
  transition: opacity .2s ease, transform .2s ease;
}

[data-template-id="soundline"] .sound-nav-link:hover::before,
[data-template-id="soundline"] .sound-nav-link:hover::before {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

[data-template-id="soundline"] .sound-ken,
[data-template-id="soundline"] .sound-ken {
  animation: sound-kenburns 16s ease-out both;
  filter: grayscale(.12) contrast(1.16) saturate(.88);
  transform-origin: 40% 50%;
}

@keyframes sound-kenburns {
  from { transform: scale(1.18) translate3d(2%, -2%, 0); }
  to { transform: scale(1.03) translate3d(-1%, 1%, 0); }
}

[data-template-id="soundline"] .sound-hero-title,
[data-template-id="soundline"] .sound-hero-title {
  text-shadow: 10px 10px 0 rgba(255, 77, 109, .72);
}

[data-template-id="soundline"] .sound-vinyl,
[data-template-id="soundline"] .sound-vinyl {
  border-radius: 9999px !important;
  box-shadow: inset 0 0 0 28px #050505, inset 0 0 0 34px rgba(255,255,255,.08), 0 24px 80px rgba(255, 77, 109, .25);
  animation: sound-spin 14s linear infinite;
}

[data-template-id="soundline"] .sound-vinyl::after,
[data-template-id="soundline"] .sound-vinyl::after {
  content: "";
  position: absolute;
  inset: 50%;
  width: 18px;
  height: 18px;
  background: black;
  border-radius: 9999px !important;
  transform: translate(-50%, -50%);
}

@keyframes sound-spin {
  to { transform: rotate(360deg); }
}

[data-template-id="soundline"] .sound-program-row,
[data-template-id="soundline"] .sound-program-row {
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 77, 109, .2), 0 0 34px rgba(255, 77, 109, .08);
  transition: transform .24s ease, box-shadow .24s ease, color .24s ease;
}

[data-template-id="soundline"] .sound-program-row::before,
[data-template-id="soundline"] .sound-program-row::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--p);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform .28s cubic-bezier(.22, 1, .36, 1);
  z-index: 0;
}

[data-template-id="soundline"] .sound-program-row > *,
[data-template-id="soundline"] .sound-program-row > * {
  position: relative;
  z-index: 1;
}

[data-template-id="soundline"] .sound-program-row:hover,
[data-template-id="soundline"] .sound-program-row:hover {
  box-shadow: 0 0 48px rgba(255, 77, 109, .28);
  transform: translateX(-8px);
}

[data-template-id="soundline"] .sound-program-row:hover::before,
[data-template-id="soundline"] .sound-program-row:hover::before {
  transform: scaleX(1);
}

[data-template-id="soundline"] .sound-program-row:hover h3,
[data-template-id="soundline"] .sound-program-row:hover h3,
[data-template-id="soundline"] .sound-program-row:hover p,
[data-template-id="soundline"] .sound-program-row:hover p {
  color: #000 !important;
}

[data-template-id="soundline"] .sound-marquee-track,
[data-template-id="soundline"] .sound-marquee-track {
  animation: sound-marquee 24s linear infinite;
}

@keyframes sound-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(33.333%); }
}

[data-template-id="soundline"] .sound-teacher-strip,
[data-template-id="soundline"] .sound-teacher-strip,
[data-template-id="soundline"] .sound-gallery-strip,
[data-template-id="soundline"] .sound-gallery-strip {
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 30px 80px rgba(0,0,0,.36);
  transition: transform .32s ease, border-color .32s ease, filter .32s ease;
}

[data-template-id="soundline"] .sound-teacher-strip::before,
[data-template-id="soundline"] .sound-teacher-strip::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, rgba(255,255,255,.22), transparent 28%, rgba(255,255,255,.09) 48%, transparent 65%);
  mix-blend-mode: screen;
  pointer-events: none;
}

[data-template-id="soundline"] .sound-teacher-strip img,
[data-template-id="soundline"] .sound-teacher-strip img,
[data-template-id="soundline"] .sound-gallery-strip img,
[data-template-id="soundline"] .sound-gallery-strip img {
  filter: grayscale(.28) contrast(1.12);
  transition: transform .72s ease, filter .32s ease;
}

[data-template-id="soundline"] .sound-teacher-strip:hover,
[data-template-id="soundline"] .sound-teacher-strip:hover,
[data-template-id="soundline"] .sound-gallery-strip:hover,
[data-template-id="soundline"] .sound-gallery-strip:hover {
  border-color: var(--p);
  transform: translateY(-10px);
}

[data-template-id="soundline"] .sound-teacher-strip:hover img,
[data-template-id="soundline"] .sound-teacher-strip:hover img,
[data-template-id="soundline"] .sound-gallery-strip:hover img,
[data-template-id="soundline"] .sound-gallery-strip:hover img {
  filter: grayscale(0) contrast(1.18);
  transform: scale(1.08);
}

[data-template-id="soundline"] .sound-event-row,
[data-template-id="soundline"] .sound-event-row {
  transition: background .24s ease, padding-inline .24s ease;
}

[data-template-id="soundline"] .sound-event-row:hover,
[data-template-id="soundline"] .sound-event-row:hover {
  background: rgba(255, 77, 109, .08);
  padding-inline: 1rem;
}

[data-template-id="soundline"] .sound-counter,
[data-template-id="soundline"] .sound-counter {
  box-shadow: 12px 12px 0 #000;
  transition: transform .24s ease, box-shadow .24s ease;
}

[data-template-id="soundline"] .sound-counter:hover,
[data-template-id="soundline"] .sound-counter:hover {
  box-shadow: 18px 18px 0 #000;
  transform: translate(-6px, -6px);
}

[data-template-id="soundline"] input,
[data-template-id="soundline"] input,
[data-template-id="soundline"] textarea,
[data-template-id="soundline"] textarea,
[data-template-id="soundline"] select,
[data-template-id="soundline"] select {
  font-family: "DM Sans", sans-serif;
}

[data-template-id="soundline"] input::placeholder,
[data-template-id="soundline"] input::placeholder,
[data-template-id="soundline"] textarea::placeholder,
[data-template-id="soundline"] textarea::placeholder {
  color: rgba(247, 247, 251, .42);
}

@media (max-width: 767px) {
  [data-template-id="soundline"] .sound-hero-title,
  [data-template-id="soundline"] .sound-hero-title {
    text-shadow: 5px 5px 0 rgba(255, 77, 109, .72);
  }
}

[data-template-id="soundline"] .text-center,
[data-template-id="soundline"] .text-center {
  text-align: center;
}
`;
