export const brewlineEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;600;700;800&display=swap');
[data-template-id="brewline"], [data-template-id="brewline-preview"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #8B5E3C;
  --clay: #8B5E3C;
  --bg: #1A1410;
  --espresso: #1A1410;
  --surface: #241C16;
  --cream: #F6EFE6;
  --text: #F6EFE6;
  --muted: #B3A294;
  --dark: #0E0A08;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}
[data-template-id="brewline"] .t-serif,
[data-template-id="brewline-preview"] .t-serif {
  font-family: "Instrument Serif", serif;
  font-weight: 400;
}
[data-template-id="brewline"] .bl-ken,
[data-template-id="brewline-preview"] .bl-ken {
  animation: brewline-ken 18s ease-in-out infinite alternate;
  transform-origin: center;
}
[data-template-id="brewline"] .bl-bean-orbit,
[data-template-id="brewline-preview"] .bl-bean-orbit {
  animation: brewline-orbit 9s linear infinite;
  box-shadow: 0 0 80px rgba(139, 94, 60, 0.28);
}
[data-template-id="brewline"] .bl-nav-link,
[data-template-id="brewline-preview"] .bl-nav-link {
  position: relative;
}
[data-template-id="brewline"] .bl-nav-link::after,
[data-template-id="brewline-preview"] .bl-nav-link::after {
  background: var(--clay);
  bottom: -8px;
  content: "";
  height: 1px;
  left: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 280ms ease;
  width: 100%;
}
[data-template-id="brewline"] .bl-nav-link:hover::after,
[data-template-id="brewline-preview"] .bl-nav-link:hover::after {
  transform: scaleX(1);
}
[data-template-id="brewline"] .bl-menu-row,
[data-template-id="brewline-preview"] .bl-menu-row {
  transition: background 300ms ease, padding-inline 300ms ease;
}
[data-template-id="brewline"] .bl-menu-row:hover,
[data-template-id="brewline-preview"] .bl-menu-row:hover {
  background: rgba(139, 94, 60, 0.1);
  padding-inline: 1rem;
}
[data-template-id="brewline"] .bl-step-card,
[data-template-id="brewline-preview"] .bl-step-card {
  overflow: hidden;
}
[data-template-id="brewline"] .bl-step-card::before,
[data-template-id="brewline-preview"] .bl-step-card::before {
  background: linear-gradient(90deg, transparent, rgba(246, 239, 230, 0.12), transparent);
  content: "";
  height: 100%;
  position: absolute;
  right: -80%;
  top: 0;
  transform: skewX(-18deg);
  transition: right 650ms ease;
  width: 55%;
}
[data-template-id="brewline"] .bl-step-card:hover::before,
[data-template-id="brewline-preview"] .bl-step-card:hover::before {
  right: 130%;
}
[data-template-id="brewline"] .bl-count-card,
[data-template-id="brewline-preview"] .bl-count-card {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@keyframes brewline-ken {
  0% { transform: scale(1) translate3d(0, 0, 0); }
  100% { transform: scale(1.12) translate3d(2.2%, -1.6%, 0); }
}
@keyframes brewline-orbit {
  0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
}

[data-template-id="brewline"] .text-center,
[data-template-id="brewline-preview"] .text-center {
  text-align: center;
}
`;
