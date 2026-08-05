export const jewelisEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="jewelis"], [data-template-id="jewelis"] {
  --p: #A16207;
  --accent: #E7C873;
  --on-p: #1C1408;
  --bg: #0C0A09;
  --bg-soft: #1C1917;
  --surface: #292524;
  --text: #FAF7F0;
  --muted: #A8A29E;
  --dark: #050403;
  --line: rgba(231,200,115,0.2);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #A1620722, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #E7C87318, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="jewelis"] .store-display,
[data-template-id="jewelis"] .store-display {
  font-family: "Cormorant", "Heebo", serif;
}
[data-template-id="jewelis"] .store-card,
[data-template-id="jewelis"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="jewelis"] .store-card:hover,
[data-template-id="jewelis"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="jewelis"] .store-marquee,
[data-template-id="jewelis"] .store-marquee {
  animation: jewelis-marquee 22s linear infinite;
}
[data-template-id="jewelis"] .store-kenburns,
[data-template-id="jewelis"] .store-kenburns {
  animation: jewelis-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="jewelis"] .store-float-a,
[data-template-id="jewelis"] .store-float-a { animation: jewelis-float 7s ease-in-out infinite; }
[data-template-id="jewelis"] .store-float-b,
[data-template-id="jewelis"] .store-float-b { animation: jewelis-float 8.5s ease-in-out infinite reverse; }
[data-template-id="jewelis"] .store-float-c,
[data-template-id="jewelis"] .store-float-c { animation: jewelis-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="jewelis"] .store-logo,
[data-template-id="jewelis"] .store-logo {
  box-shadow: 0 0 0 0 #A1620766;
  animation: jewelis-pulse 2.8s ease-out infinite;
}
@keyframes jewelis-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes jewelis-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes jewelis-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes jewelis-pulse {
  0% { box-shadow: 0 0 0 0 #A1620766; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="jewelis"] .store-marquee,
  [data-template-id="jewelis"] .store-kenburns,
  [data-template-id="jewelis"] .store-float-a,
  [data-template-id="jewelis"] .store-float-b,
  [data-template-id="jewelis"] .store-float-c,
  [data-template-id="jewelis"] .store-logo,
  [data-template-id="jewelis"] .store-marquee,
  [data-template-id="jewelis"] .store-kenburns,
  [data-template-id="jewelis"] .store-float-a,
  [data-template-id="jewelis"] .store-float-b,
  [data-template-id="jewelis"] .store-float-c,
  [data-template-id="jewelis"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="jewelis"] .store-product-card,
[data-template-id="jewelis"] .store-product-card {
  animation: jewelis-gallery-glint 8.5s ease-in-out infinite;
}
[data-template-id="jewelis"] .store-product-card:nth-child(2n),
[data-template-id="jewelis"] .store-product-card:nth-child(2n) {
  animation-delay: 1.1s;
}
@keyframes jewelis-gallery-glint {
  0%, 100% { border-color: var(--line); filter: brightness(1); }
  50% { border-color: rgba(231,200,115,0.55); filter: brightness(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="jewelis"] .store-product-card,
  [data-template-id="jewelis"] .store-product-card {
    animation: none !important;
  }
}
`;
