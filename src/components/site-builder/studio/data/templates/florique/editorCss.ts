export const floriqueEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@400;500;600;700;800&display=swap');
[data-template-id="florique"], [data-template-id="florique-preview"] {
  /* wow-rtl-align */
  text-align: right;

  --p: #E11D8C;
  --rose: #BE185D;
  --bg: #FFF7FB;
  --surface: #FFFFFF;
  --cream: #FFFDF7;
  --text: #3B1028;
  --muted: #9D6B85;
  --line: rgba(225, 29, 140, 0.18);
  --dark: #1F0A16;
  font-family: "Outfit", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 12% 8%, rgba(225, 29, 140, 0.12), transparent 25rem),
    radial-gradient(circle at 92% 18%, rgba(255, 214, 231, 0.85), transparent 30rem),
    var(--bg);
}
[data-template-id="florique"] .florique-script,
[data-template-id="florique-preview"] .florique-script {
  font-family: "Great Vibes", cursive;
  letter-spacing: 0;
}
[data-template-id="florique"] .florique-petal,
[data-template-id="florique-preview"] .florique-petal {
  animation: floriquePetal 10s ease-in-out infinite;
}
[data-template-id="florique"] .florique-petal:nth-child(2),
[data-template-id="florique-preview"] .florique-petal:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 12s;
}
[data-template-id="florique"] .florique-petal:nth-child(3),
[data-template-id="florique-preview"] .florique-petal:nth-child(3) {
  animation-delay: -6s;
  animation-duration: 14s;
}
[data-template-id="florique"] .florique-card,
[data-template-id="florique-preview"] .florique-card {
  box-shadow: 0 24px 70px rgba(225, 29, 140, 0.11);
}
[data-template-id="florique"] .florique-card img,
[data-template-id="florique-preview"] .florique-card img {
  transition: transform 700ms ease;
}
[data-template-id="florique"] .florique-card:hover img,
[data-template-id="florique-preview"] .florique-card:hover img {
  transform: scale(1.055);
}
[data-template-id="florique"] .florique-line,
[data-template-id="florique-preview"] .florique-line {
  background: linear-gradient(90deg, transparent, rgba(225, 29, 140, 0.45), transparent);
}
[data-template-id="florique"] .florique-soft-float,
[data-template-id="florique-preview"] .florique-soft-float {
  animation: floriqueSoftFloat 8s ease-in-out infinite;
}
@keyframes floriquePetal {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0.76; }
  45% { transform: translate3d(-18px, 22px, 0) rotate(8deg); opacity: 1; }
  72% { transform: translate3d(14px, -12px, 0) rotate(-6deg); opacity: 0.82; }
}
@keyframes floriqueSoftFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="florique"] .florique-petal,
  [data-template-id="florique-preview"] .florique-petal,
  [data-template-id="florique"] .florique-soft-float,
  [data-template-id="florique-preview"] .florique-soft-float {
    animation: none;
  }
}

[data-template-id="florique"] .text-center,
[data-template-id="florique-preview"] .text-center {
  text-align: center;
}
`;
