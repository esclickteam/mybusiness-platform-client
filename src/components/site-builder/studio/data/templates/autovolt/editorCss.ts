export const autovoltEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;600;700&family=Oswald:wght@500;600;700&display=swap');
[data-template-id="autovolt"], [data-template-id="autovolt"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #38BDF8;
  --blue: #38BDF8;
  --bg: #0A0F14;
  --surface: #111821;
  --text: #E8F1F8;
  --muted: #8AA0B3;
  --dark: #0A0F14;
  font-family: "IBM Plex Sans Hebrew", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}
[data-template-id="autovolt"] .t-display,
[data-template-id="autovolt"] .t-display {
  font-family: "Oswald", sans-serif;
}
[data-template-id="autovolt"] .av-hero-car,
[data-template-id="autovolt"] .av-hero-car {
  animation: autovolt-drive 16s ease-in-out infinite alternate;
  transform-origin: center;
}
[data-template-id="autovolt"] .av-hero-title,
[data-template-id="autovolt"] .av-hero-title {
  text-shadow: 0 0 34px rgba(56, 189, 248, 0.16);
}
[data-template-id="autovolt"] .av-hero-title::first-line,
[data-template-id="autovolt"] .av-hero-title::first-line {
  color: var(--blue);
}
[data-template-id="autovolt"] .av-blue-scan,
[data-template-id="autovolt"] .av-blue-scan {
  animation: autovolt-scan 4.5s ease-in-out infinite;
  box-shadow: 0 0 40px rgba(56, 189, 248, 0.7);
}
[data-template-id="autovolt"] .av-logo-slash,
[data-template-id="autovolt"] .av-logo-slash {
  clip-path: polygon(16% 0, 100% 0, 84% 100%, 0 100%);
}
[data-template-id="autovolt"] .av-chrome-card,
[data-template-id="autovolt"] .av-chrome-card {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 34%, rgba(56,189,248,0.12) 52%, rgba(255,255,255,0.03)),
    #111821;
  overflow: hidden;
  position: relative;
  transition: border-color 280ms ease, transform 280ms ease;
}
[data-template-id="autovolt"] .av-chrome-card::before,
[data-template-id="autovolt"] .av-chrome-card::before,
[data-template-id="autovolt"] .av-tier::before,
[data-template-id="autovolt"] .av-tier::before {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  content: "";
  height: 130%;
  position: absolute;
  right: -70%;
  top: -15%;
  transform: rotate(18deg);
  transition: right 700ms ease;
  width: 35%;
}
[data-template-id="autovolt"] .av-chrome-card:hover,
[data-template-id="autovolt"] .av-chrome-card:hover {
  border-color: var(--blue);
  transform: translateY(-6px);
}
[data-template-id="autovolt"] .av-chrome-card:hover::before,
[data-template-id="autovolt"] .av-chrome-card:hover::before,
[data-template-id="autovolt"] .av-tier:hover::before,
[data-template-id="autovolt"] .av-tier:hover::before {
  right: 130%;
}
[data-template-id="autovolt"] .av-process-step::after,
[data-template-id="autovolt"] .av-process-step::after {
  background: var(--blue);
  box-shadow: 0 0 22px rgba(56, 189, 248, 0.72);
  content: "";
  height: 2px;
  left: -1.25rem;
  position: absolute;
  top: 3.25rem;
  width: 1.25rem;
}
[data-template-id="autovolt"] .av-process-step:last-child::after,
[data-template-id="autovolt"] .av-process-step:last-child::after {
  display: none;
}
[data-template-id="autovolt"] .av-tier,
[data-template-id="autovolt"] .av-tier,
[data-template-id="autovolt"] .av-counter,
[data-template-id="autovolt"] .av-counter {
  position: relative;
}
[data-template-id="autovolt"] .av-counter {
  color: white;
}
@media (max-width: 1023px) {
  [data-template-id="autovolt"] .av-process-step::after,
  [data-template-id="autovolt"] .av-process-step::after {
    display: none;
  }
}
@keyframes autovolt-drive {
  0% { transform: scale(1.02) translate3d(0, 0, 0); }
  100% { transform: scale(1.12) translate3d(2.4%, -1.4%, 0); }
}
@keyframes autovolt-scan {
  0%, 100% { opacity: 0.18; transform: translateY(-32vh); }
  50% { opacity: 0.82; transform: translateY(32vh); }
}

[data-template-id="autovolt"] .text-center,
[data-template-id="autovolt"] .text-center {
  text-align: center;
}
`;
