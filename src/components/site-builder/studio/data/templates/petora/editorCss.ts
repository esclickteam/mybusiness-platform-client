export const petoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="petora"], [data-template-id="petora-preview"] {
  --p: #EA580C;
  --accent: #FB923C;
  --on-p: #FFF7ED;
  --bg: #FFF8F1;
  --bg-soft: #FFEDD5;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #9A3412;
  --dark: #1C1917;
  --line: rgba(67,20,7,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #EA580C22, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #FB923C18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="petora"] .store-display,
[data-template-id="petora-preview"] .store-display {
  font-family: "Sora", "Heebo", serif;
}
[data-template-id="petora"] .store-card,
[data-template-id="petora-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="petora"] .store-card:hover,
[data-template-id="petora-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="petora"] .store-marquee,
[data-template-id="petora-preview"] .store-marquee {
  animation: petora-marquee 22s linear infinite;
}
[data-template-id="petora"] .store-kenburns,
[data-template-id="petora-preview"] .store-kenburns {
  animation: petora-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="petora"] .store-float-a,
[data-template-id="petora-preview"] .store-float-a { animation: petora-float 7s ease-in-out infinite; }
[data-template-id="petora"] .store-float-b,
[data-template-id="petora-preview"] .store-float-b { animation: petora-float 8.5s ease-in-out infinite reverse; }
[data-template-id="petora"] .store-float-c,
[data-template-id="petora-preview"] .store-float-c { animation: petora-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="petora"] .store-logo,
[data-template-id="petora-preview"] .store-logo {
  box-shadow: 0 0 0 0 #EA580C66;
  animation: petora-pulse 2.8s ease-out infinite;
}
@keyframes petora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes petora-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes petora-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes petora-pulse {
  0% { box-shadow: 0 0 0 0 #EA580C66; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="petora"] .store-marquee,
  [data-template-id="petora"] .store-kenburns,
  [data-template-id="petora"] .store-float-a,
  [data-template-id="petora"] .store-float-b,
  [data-template-id="petora"] .store-float-c,
  [data-template-id="petora"] .store-logo,
  [data-template-id="petora-preview"] .store-marquee,
  [data-template-id="petora-preview"] .store-kenburns,
  [data-template-id="petora-preview"] .store-float-a,
  [data-template-id="petora-preview"] .store-float-b,
  [data-template-id="petora-preview"] .store-float-c,
  [data-template-id="petora-preview"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="petora"] .store-diagonal-band,
[data-template-id="petora-preview"] .store-diagonal-band {
  transform: skewY(-2deg);
}
[data-template-id="petora"] .store-diagonal-band > *,
[data-template-id="petora-preview"] .store-diagonal-band > * {
  transform: skewY(2deg);
}
[data-template-id="petora"] .store-paw-pattern,
[data-template-id="petora-preview"] .store-paw-pattern {
  background-image: radial-gradient(circle at 20px 20px, var(--p) 0 6px, transparent 7px), radial-gradient(circle at 44px 34px, var(--accent) 0 5px, transparent 6px);
  background-size: 96px 96px;
  animation: petora-paw-parade 16s linear infinite;
}
[data-template-id="petora"] .store-wiggle,
[data-template-id="petora-preview"] .store-wiggle {
  animation: petora-tail-wag 4.5s ease-in-out infinite;
}
@keyframes petora-paw-parade {
  from { background-position: 0 0; }
  to { background-position: 96px 96px; }
}
@keyframes petora-tail-wag {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-1.2deg); }
  75% { transform: rotate(1.2deg); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="petora"] .store-paw-pattern,
  [data-template-id="petora"] .store-wiggle,
  [data-template-id="petora-preview"] .store-paw-pattern,
  [data-template-id="petora-preview"] .store-wiggle {
    animation: none !important;
  }
}
`;
