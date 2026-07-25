export const homecraftEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="homecraft"], [data-template-id="homecraft-preview"] {
  --p: #B45309;
  --accent: #F59E0B;
  --on-p: #FFFBEB;
  --bg: #FFFBF5;
  --bg-soft: #F7EFE3;
  --surface: #FFFFFF;
  --text: #3F2A14;
  --muted: #8B7355;
  --dark: #1C140C;
  --line: rgba(63,42,20,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #B4530922, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #F59E0B18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="homecraft"] .store-display,
[data-template-id="homecraft-preview"] .store-display {
  font-family: "Libre Baskerville", "Heebo", serif;
}
[data-template-id="homecraft"] .store-card,
[data-template-id="homecraft-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="homecraft"] .store-card:hover,
[data-template-id="homecraft-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="homecraft"] .store-marquee,
[data-template-id="homecraft-preview"] .store-marquee {
  animation: homecraft-marquee 22s linear infinite;
}
[data-template-id="homecraft"] .store-kenburns,
[data-template-id="homecraft-preview"] .store-kenburns {
  animation: homecraft-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="homecraft"] .store-float-a,
[data-template-id="homecraft-preview"] .store-float-a { animation: homecraft-float 7s ease-in-out infinite; }
[data-template-id="homecraft"] .store-float-b,
[data-template-id="homecraft-preview"] .store-float-b { animation: homecraft-float 8.5s ease-in-out infinite reverse; }
[data-template-id="homecraft"] .store-float-c,
[data-template-id="homecraft-preview"] .store-float-c { animation: homecraft-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="homecraft"] .store-logo,
[data-template-id="homecraft-preview"] .store-logo {
  box-shadow: 0 0 0 0 #B4530966;
  animation: homecraft-pulse 2.8s ease-out infinite;
}
@keyframes homecraft-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes homecraft-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes homecraft-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes homecraft-pulse {
  0% { box-shadow: 0 0 0 0 #B4530966; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="homecraft"] .store-marquee,
  [data-template-id="homecraft"] .store-kenburns,
  [data-template-id="homecraft"] .store-float-a,
  [data-template-id="homecraft"] .store-float-b,
  [data-template-id="homecraft"] .store-float-c,
  [data-template-id="homecraft"] .store-logo,
  [data-template-id="homecraft-preview"] .store-marquee,
  [data-template-id="homecraft-preview"] .store-kenburns,
  [data-template-id="homecraft-preview"] .store-float-a,
  [data-template-id="homecraft-preview"] .store-float-b,
  [data-template-id="homecraft-preview"] .store-float-c,
  [data-template-id="homecraft-preview"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="homecraft"] .store-product-card,
[data-template-id="homecraft-preview"] .store-product-card {
  animation: homecraft-page-turn 8s ease-in-out infinite;
  transform-origin: 100% 50%;
}
[data-template-id="homecraft"] .store-product-card:nth-child(3n),
[data-template-id="homecraft-preview"] .store-product-card:nth-child(3n) {
  animation-delay: 1.2s;
}
@keyframes homecraft-page-turn {
  0%, 100% { transform: perspective(1200px) rotateY(0deg); }
  50% { transform: perspective(1200px) rotateY(-2.5deg) translateY(-4px); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="homecraft"] .store-product-card,
  [data-template-id="homecraft-preview"] .store-product-card {
    animation: none !important;
  }
}
`;
