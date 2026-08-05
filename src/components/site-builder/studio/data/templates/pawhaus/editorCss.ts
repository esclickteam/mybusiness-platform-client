export const pawhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Sora:wght@400;500;600;700;800&display=swap');

[data-template-id="pawhaus"],
[data-template-id="pawhaus"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #F59E0B;
  --bg: #FAF7F2;
  --surface: #FFFFFF;
  --text: #1C1917;
  --muted: #78716C;
  --dark: #0C0A09;
  font-family: "Sora", sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="pawhaus"] *,
[data-template-id="pawhaus"] * {
  scroll-behavior: smooth;
}

[data-template-id="pawhaus"] article,
[data-template-id="pawhaus"] form,
[data-template-id="pawhaus"] input,
[data-template-id="pawhaus"] textarea,
[data-template-id="pawhaus"] button,
[data-template-id="pawhaus"] img,
[data-template-id="pawhaus"] a,
[data-template-id="pawhaus"] article,
[data-template-id="pawhaus"] form,
[data-template-id="pawhaus"] input,
[data-template-id="pawhaus"] textarea,
[data-template-id="pawhaus"] button,
[data-template-id="pawhaus"] img,
[data-template-id="pawhaus"] a {
  border-radius: 0;
}

[data-template-id="pawhaus"] .t-serif,
[data-template-id="pawhaus"] .t-serif {
  font-family: "Fraunces", serif;
}

@keyframes pawhaus-brand-pop {
  from { opacity: 0; transform: translateY(26px) scale(.94); letter-spacing: .02em; }
  to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -.06em; }
}

@keyframes pawhaus-hero-photo {
  from { transform: scale(1.08) translateY(18px); }
  to { transform: scale(1) translateY(0); }
}

@keyframes pawhaus-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes pawhaus-paw-spin {
  0% { transform: rotate(10deg) scale(.96); opacity: .45; }
  50% { transform: rotate(-5deg) scale(1.04); opacity: .72; }
  100% { transform: rotate(10deg) scale(.96); opacity: .45; }
}

@keyframes pawhaus-amber-pulse {
  0%, 100% { opacity: .58; transform: scale(.95); }
  50% { opacity: .95; transform: scale(1.05); }
}

[data-template-id="pawhaus"] .pawhaus-brand-pop,
[data-template-id="pawhaus"] .pawhaus-brand-pop {
  animation: pawhaus-brand-pop .95s .08s cubic-bezier(0.22, 1, 0.36, 1) both;
}

[data-template-id="pawhaus"] .pawhaus-hero-photo,
[data-template-id="pawhaus"] .pawhaus-hero-photo {
  animation: pawhaus-hero-photo 12s ease-out both;
}

[data-template-id="pawhaus"] .pawhaus-float-card,
[data-template-id="pawhaus"] .pawhaus-float-card {
  animation: pawhaus-float 4.5s ease-in-out infinite;
}

[data-template-id="pawhaus"] .pawhaus-paw-print,
[data-template-id="pawhaus"] .pawhaus-paw-print {
  animation: pawhaus-paw-spin 9s ease-in-out infinite;
}

[data-template-id="pawhaus"] .pawhaus-amber-orb,
[data-template-id="pawhaus"] .pawhaus-amber-orb {
  animation: pawhaus-amber-pulse 5.5s ease-in-out infinite;
}

[data-template-id="pawhaus"] .pawhaus-service-card,
[data-template-id="pawhaus"] .pawhaus-team-card,
[data-template-id="pawhaus"] .pawhaus-service-card,
[data-template-id="pawhaus"] .pawhaus-team-card {
  transition: transform .45s ease, box-shadow .45s ease;
}

[data-template-id="pawhaus"] .pawhaus-service-card:hover,
[data-template-id="pawhaus"] .pawhaus-team-card:hover,
[data-template-id="pawhaus"] .pawhaus-service-card:hover,
[data-template-id="pawhaus"] .pawhaus-team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 80px rgba(69, 45, 12, .14);
}

[data-template-id="pawhaus"] .pawhaus-before-after::before,
[data-template-id="pawhaus"] .pawhaus-before-after::before {
  content: "";
  position: absolute;
  inset-block: 0;
  left: 50%;
  z-index: 2;
  width: 4px;
  background: var(--p);
  transform: translateX(-50%);
  box-shadow: 0 0 0 10px rgba(250, 247, 242, .84);
}

[data-template-id="pawhaus"] input,
[data-template-id="pawhaus"] textarea,
[data-template-id="pawhaus"] input,
[data-template-id="pawhaus"] textarea {
  font-family: "Sora", sans-serif;
}

[data-template-id="pawhaus"] .text-center,
[data-template-id="pawhaus"] .text-center {
  text-align: center;
}
`;
