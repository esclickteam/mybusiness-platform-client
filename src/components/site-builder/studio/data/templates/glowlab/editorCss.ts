export const glowlabEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="glowlab"], [data-template-id="glowlab"] {
  --p: #BE185D;
  --accent: #F9A8D4;
  --on-p: #FFF1F5;
  --bg: #1A0B14;
  --bg-soft: #2A1220;
  --surface: #341828;
  --text: #FFF1F5;
  --muted: #E8A0BF;
  --dark: #0C0509;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #BE185D22, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #F9A8D418, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="glowlab"] .store-display,
[data-template-id="glowlab"] .store-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}
[data-template-id="glowlab"] .store-card,
[data-template-id="glowlab"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="glowlab"] .store-card:hover,
[data-template-id="glowlab"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="glowlab"] .store-marquee,
[data-template-id="glowlab"] .store-marquee {
  animation: glowlab-marquee 22s linear infinite;
}
[data-template-id="glowlab"] .store-kenburns,
[data-template-id="glowlab"] .store-kenburns {
  animation: glowlab-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="glowlab"] .store-float-a,
[data-template-id="glowlab"] .store-float-a { animation: glowlab-float 7s ease-in-out infinite; }
[data-template-id="glowlab"] .store-float-b,
[data-template-id="glowlab"] .store-float-b { animation: glowlab-float 8.5s ease-in-out infinite reverse; }
[data-template-id="glowlab"] .store-float-c,
[data-template-id="glowlab"] .store-float-c { animation: glowlab-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="glowlab"] .store-logo,
[data-template-id="glowlab"] .store-logo {
  box-shadow: 0 0 0 0 #BE185D66;
  animation: glowlab-pulse 2.8s ease-out infinite;
}
@keyframes glowlab-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes glowlab-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes glowlab-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes glowlab-pulse {
  0% { box-shadow: 0 0 0 0 #BE185D66; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="glowlab"] .store-marquee,
  [data-template-id="glowlab"] .store-kenburns,
  [data-template-id="glowlab"] .store-float-a,
  [data-template-id="glowlab"] .store-float-b,
  [data-template-id="glowlab"] .store-float-c,
  [data-template-id="glowlab"] .store-logo,
  [data-template-id="glowlab"] .store-marquee,
  [data-template-id="glowlab"] .store-kenburns,
  [data-template-id="glowlab"] .store-float-a,
  [data-template-id="glowlab"] .store-float-b,
  [data-template-id="glowlab"] .store-float-c,
  [data-template-id="glowlab"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="glowlab"] .store-shimmer-strip,
[data-template-id="glowlab"] .store-shimmer-strip {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
  animation: glowlab-shimmer-sweep 5.8s ease-in-out infinite;
}
[data-template-id="glowlab"] .store-product-card,
[data-template-id="glowlab"] .store-product-card {
  animation: glowlab-gloss-lift 7s ease-in-out infinite;
}
@keyframes glowlab-shimmer-sweep {
  0%, 100% { transform: translateX(35%) skewX(-18deg); opacity: 0.25; }
  50% { transform: translateX(-35%) skewX(-18deg); opacity: 0.75; }
}
@keyframes glowlab-gloss-lift {
  0%, 100% { transform: translateY(0); filter: saturate(1); }
  50% { transform: translateY(-6px); filter: saturate(1.12); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="glowlab"] .store-shimmer-strip,
  [data-template-id="glowlab"] .store-product-card,
  [data-template-id="glowlab"] .store-shimmer-strip,
  [data-template-id="glowlab"] .store-product-card {
    animation: none !important;
  }
}
`;
