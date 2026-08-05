export const sportifyaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="sportifya"], [data-template-id="sportifya"] {
  --p: #EF4444;
  --accent: #FCA5A5;
  --on-p: #FFFFFF;
  --bg: #0B0B0F;
  --bg-soft: #15151C;
  --surface: #1C1C26;
  --text: #F5F5F7;
  --muted: #A1A1AA;
  --dark: #050507;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #EF444422, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #FCA5A518, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="sportifya"] .store-display,
[data-template-id="sportifya"] .store-display {
  font-family: "Oswald", "Heebo", serif;
}
[data-template-id="sportifya"] .store-card,
[data-template-id="sportifya"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="sportifya"] .store-card:hover,
[data-template-id="sportifya"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="sportifya"] .store-marquee,
[data-template-id="sportifya"] .store-marquee {
  animation: sportifya-marquee 22s linear infinite;
}
[data-template-id="sportifya"] .store-kenburns,
[data-template-id="sportifya"] .store-kenburns {
  animation: sportifya-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="sportifya"] .store-float-a,
[data-template-id="sportifya"] .store-float-a { animation: sportifya-float 7s ease-in-out infinite; }
[data-template-id="sportifya"] .store-float-b,
[data-template-id="sportifya"] .store-float-b { animation: sportifya-float 8.5s ease-in-out infinite reverse; }
[data-template-id="sportifya"] .store-float-c,
[data-template-id="sportifya"] .store-float-c { animation: sportifya-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="sportifya"] .store-logo,
[data-template-id="sportifya"] .store-logo {
  box-shadow: 0 0 0 0 #EF444466;
  animation: sportifya-pulse 2.8s ease-out infinite;
}
@keyframes sportifya-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes sportifya-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes sportifya-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes sportifya-pulse {
  0% { box-shadow: 0 0 0 0 #EF444466; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="sportifya"] .store-marquee,
  [data-template-id="sportifya"] .store-kenburns,
  [data-template-id="sportifya"] .store-float-a,
  [data-template-id="sportifya"] .store-float-b,
  [data-template-id="sportifya"] .store-float-c,
  [data-template-id="sportifya"] .store-logo,
  [data-template-id="sportifya"] .store-marquee,
  [data-template-id="sportifya"] .store-kenburns,
  [data-template-id="sportifya"] .store-float-a,
  [data-template-id="sportifya"] .store-float-b,
  [data-template-id="sportifya"] .store-float-c,
  [data-template-id="sportifya"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="sportifya"] .store-athletic-panel,
[data-template-id="sportifya"] .store-athletic-panel {
  animation: sportifya-stack-hit 4.8s cubic-bezier(0.22,1,0.36,1) infinite;
  transform-origin: 100% 50%;
}
[data-template-id="sportifya"] .store-athletic-panel:nth-child(2),
[data-template-id="sportifya"] .store-athletic-panel:nth-child(2) {
  animation-delay: 0.35s;
}
@keyframes sportifya-stack-hit {
  0%, 100% { transform: translateX(0) skewY(-1deg); }
  45% { transform: translateX(-10px) skewY(-1deg); }
  55% { transform: translateX(4px) skewY(-1deg); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="sportifya"] .store-athletic-panel,
  [data-template-id="sportifya"] .store-athletic-panel {
    animation: none !important;
  }
}
`;
