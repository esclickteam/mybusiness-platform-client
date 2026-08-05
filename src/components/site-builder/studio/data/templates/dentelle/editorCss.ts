export const dentelleEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
[data-template-id="dentelle"], [data-template-id="dentelle"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #2DD4BF;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #64748B;
  --dark: #0B1220;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background: var(--bg);
  scroll-behavior: smooth;
}
[data-template-id="dentelle"] *, [data-template-id="dentelle"] * {
  border-radius: 0 !important;
}
[data-template-id="dentelle"] .de-display, [data-template-id="dentelle"] .de-display {
  font-family: "Fraunces", serif;
}
[data-template-id="dentelle"] .de-hero-image, [data-template-id="dentelle"] .de-hero-image {
  animation: dentelleSoftFloat 12s ease-in-out infinite alternate;
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-template-id="dentelle"] .de-hero-frame:hover .de-hero-image,
[data-template-id="dentelle"] .de-hero-frame:hover .de-hero-image,
[data-template-id="dentelle"] .de-image-hover:hover .de-img,
[data-template-id="dentelle"] .de-image-hover:hover .de-img {
  transform: scale(1.08);
}
[data-template-id="dentelle"] .de-underline, [data-template-id="dentelle"] .de-underline {
  transform-origin: right;
  animation: dentelleUnderlineGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 350ms both;
}
[data-template-id="dentelle"] .de-badge, [data-template-id="dentelle"] .de-badge {
  background:
    radial-gradient(circle at 18% 16%, rgba(45, 212, 191, 0.22), transparent 35%),
    #ffffff;
  transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms ease;
}
[data-template-id="dentelle"] .de-badge:hover,
[data-template-id="dentelle"] .de-badge:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
}
[data-template-id="dentelle"] .de-dot-leader, [data-template-id="dentelle"] .de-dot-leader {
  background-image: radial-gradient(circle, rgba(45, 212, 191, 0.55) 1.4px, transparent 1.6px);
  background-position: center;
  background-size: 10px 2px;
  background-repeat: repeat-x;
}
[data-template-id="dentelle"] .de-portrait-strip, [data-template-id="dentelle"] .de-portrait-strip {
  scrollbar-width: none;
}
[data-template-id="dentelle"] .de-portrait-strip::-webkit-scrollbar,
[data-template-id="dentelle"] .de-portrait-strip::-webkit-scrollbar {
  display: none;
}
[data-template-id="dentelle"] .de-doctor-card .de-img,
[data-template-id="dentelle"] .de-doctor-card .de-img,
[data-template-id="dentelle"] .de-image-hover .de-img,
[data-template-id="dentelle"] .de-image-hover .de-img {
  transition: transform 850ms cubic-bezier(0.22, 1, 0.36, 1), filter 850ms ease;
}
[data-template-id="dentelle"] .de-doctor-card:hover .de-img,
[data-template-id="dentelle"] .de-doctor-card:hover .de-img {
  transform: scale(1.09);
  filter: saturate(1.08);
}
[data-template-id="dentelle"] .de-quote, [data-template-id="dentelle"] .de-quote {
  box-shadow: 0 24px 80px rgba(45, 212, 191, 0.1);
}
[data-template-id="dentelle"] .de-field, [data-template-id="dentelle"] .de-field {
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #F8FAFC;
  color: var(--text);
}
[data-template-id="dentelle"] .de-field:focus, [data-template-id="dentelle"] .de-field:focus {
  outline: 2px solid rgba(45, 212, 191, 0.35);
  border-color: var(--p);
}
[data-template-id="dentelle"] .de-field::placeholder,
[data-template-id="dentelle"] .de-field::placeholder {
  color: rgba(100, 116, 139, 0.72);
}
[data-template-id="dentelle"] .de-teal-glow, [data-template-id="dentelle"] .de-teal-glow {
  animation: dentelleTealGlow 5s ease-in-out infinite;
}

@keyframes dentelleSoftFloat {
  0% { transform: scale(1) translate3d(0, 0, 0); }
  100% { transform: scale(1.04) translate3d(1.5%, -1.5%, 0); }
}
@keyframes dentelleUnderlineGrow {
  0% { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
}
@keyframes dentelleTealGlow {
  0%, 100% { box-shadow: 0 20px 70px rgba(45, 212, 191, 0.16); }
  50% { box-shadow: 0 28px 90px rgba(45, 212, 191, 0.28); }
}

[data-template-id="dentelle"] .text-center,
[data-template-id="dentelle"] .text-center {
  text-align: center;
}
`;
