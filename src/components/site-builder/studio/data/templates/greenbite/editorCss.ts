export const greenbiteEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="greenbite"], [data-template-id="greenbite-preview"] {
  --p: #15803D;
  --accent: #4ADE80;
  --on-p: #F0FDF4;
  --bg: #F7FBF4;
  --bg-soft: #EEF7E8;
  --surface: #FFFFFF;
  --text: #14532D;
  --muted: #4D7C5C;
  --dark: #052E16;
  --line: rgba(20,83,45,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #15803D22, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #4ADE8018, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="greenbite"] .store-display,
[data-template-id="greenbite-preview"] .store-display {
  font-family: "Fraunces", "Heebo", serif;
}
[data-template-id="greenbite"] .store-card,
[data-template-id="greenbite-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="greenbite"] .store-card:hover,
[data-template-id="greenbite-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="greenbite"] .store-marquee,
[data-template-id="greenbite-preview"] .store-marquee {
  animation: greenbite-marquee 22s linear infinite;
}
[data-template-id="greenbite"] .store-kenburns,
[data-template-id="greenbite-preview"] .store-kenburns {
  animation: greenbite-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="greenbite"] .store-float-a,
[data-template-id="greenbite-preview"] .store-float-a { animation: greenbite-float 7s ease-in-out infinite; }
[data-template-id="greenbite"] .store-float-b,
[data-template-id="greenbite-preview"] .store-float-b { animation: greenbite-float 8.5s ease-in-out infinite reverse; }
[data-template-id="greenbite"] .store-float-c,
[data-template-id="greenbite-preview"] .store-float-c { animation: greenbite-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="greenbite"] .store-logo,
[data-template-id="greenbite-preview"] .store-logo {
  box-shadow: 0 0 0 0 #15803D66;
  animation: greenbite-pulse 2.8s ease-out infinite;
}
@keyframes greenbite-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes greenbite-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes greenbite-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes greenbite-pulse {
  0% { box-shadow: 0 0 0 0 #15803D66; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="greenbite"] .store-marquee,
  [data-template-id="greenbite"] .store-kenburns,
  [data-template-id="greenbite"] .store-float-a,
  [data-template-id="greenbite"] .store-float-b,
  [data-template-id="greenbite"] .store-float-c,
  [data-template-id="greenbite"] .store-logo,
  [data-template-id="greenbite-preview"] .store-marquee,
  [data-template-id="greenbite-preview"] .store-kenburns,
  [data-template-id="greenbite-preview"] .store-float-a,
  [data-template-id="greenbite-preview"] .store-float-b,
  [data-template-id="greenbite-preview"] .store-float-c,
  [data-template-id="greenbite-preview"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="greenbite"] .store-product-card,
[data-template-id="greenbite-preview"] .store-product-card {
  animation: greenbite-crate-breathe 6.8s ease-in-out infinite;
  transform-origin: 50% 100%;
}
[data-template-id="greenbite"] .store-product-card:nth-child(even),
[data-template-id="greenbite-preview"] .store-product-card:nth-child(even) {
  animation-delay: 0.9s;
}
@keyframes greenbite-crate-breathe {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(-0.6deg); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="greenbite"] .store-product-card,
  [data-template-id="greenbite-preview"] .store-product-card {
    animation: none !important;
  }
}
`;
