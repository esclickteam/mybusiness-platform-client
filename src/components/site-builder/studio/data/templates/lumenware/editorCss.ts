export const lumenwareEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="lumenware"], [data-template-id="lumenware"] {
  --p: #0EA5E9;
  --accent: #38BDF8;
  --on-p: #041018;
  --bg: #07111A;
  --bg-soft: #0E1A26;
  --surface: #122232;
  --text: #E8F4FF;
  --muted: #8AA9C2;
  --dark: #02070C;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #0EA5E922, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #38BDF818, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="lumenware"] .store-display,
[data-template-id="lumenware"] .store-display {
  font-family: "Space Grotesk", "Heebo", serif;
}
[data-template-id="lumenware"] .store-card,
[data-template-id="lumenware"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="lumenware"] .store-card:hover,
[data-template-id="lumenware"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="lumenware"] .store-marquee,
[data-template-id="lumenware"] .store-marquee {
  animation: lumenware-marquee 22s linear infinite;
}
[data-template-id="lumenware"] .store-kenburns,
[data-template-id="lumenware"] .store-kenburns {
  animation: lumenware-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="lumenware"] .store-float-a,
[data-template-id="lumenware"] .store-float-a { animation: lumenware-float 7s ease-in-out infinite; }
[data-template-id="lumenware"] .store-float-b,
[data-template-id="lumenware"] .store-float-b { animation: lumenware-float 8.5s ease-in-out infinite reverse; }
[data-template-id="lumenware"] .store-float-c,
[data-template-id="lumenware"] .store-float-c { animation: lumenware-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="lumenware"] .store-logo,
[data-template-id="lumenware"] .store-logo {
  box-shadow: 0 0 0 0 #0EA5E966;
  animation: lumenware-pulse 2.8s ease-out infinite;
}
@keyframes lumenware-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes lumenware-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes lumenware-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes lumenware-pulse {
  0% { box-shadow: 0 0 0 0 #0EA5E966; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="lumenware"] .store-marquee,
  [data-template-id="lumenware"] .store-kenburns,
  [data-template-id="lumenware"] .store-float-a,
  [data-template-id="lumenware"] .store-float-b,
  [data-template-id="lumenware"] .store-float-c,
  [data-template-id="lumenware"] .store-logo,
  [data-template-id="lumenware"] .store-marquee,
  [data-template-id="lumenware"] .store-kenburns,
  [data-template-id="lumenware"] .store-float-a,
  [data-template-id="lumenware"] .store-float-b,
  [data-template-id="lumenware"] .store-float-c,
  [data-template-id="lumenware"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="lumenware"] .store-header-techCinema,
[data-template-id="lumenware"] .store-header-techCinema {
  box-shadow: 0 1px 0 rgba(56,189,248,0.28), 0 0 40px rgba(14,165,233,0.16);
}
[data-template-id="lumenware"] .store-product-card,
[data-template-id="lumenware"] .store-product-card {
  animation: lumenware-neon-rail 5.5s ease-in-out infinite;
}
@keyframes lumenware-neon-rail {
  0%, 100% { box-shadow: 0 0 28px rgba(14,165,233,0.08); }
  50% { box-shadow: 0 0 56px rgba(56,189,248,0.22); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="lumenware"] .store-product-card,
  [data-template-id="lumenware"] .store-product-card {
    animation: none !important;
  }
}
`;
