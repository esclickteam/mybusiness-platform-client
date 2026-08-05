export const babynestEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="babynest"], [data-template-id="babynest"] {
  --p: #F472B6;
  --accent: #FBCFE8;
  --on-p: #3B0A22;
  --bg: #FFF7FB;
  --bg-soft: #FFEAF4;
  --surface: #FFFFFF;
  --text: #4A1942;
  --muted: #9D6B8A;
  --dark: #2A1024;
  --line: rgba(74,25,66,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, #F472B622, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, #FBCFE818, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="babynest"] .store-display,
[data-template-id="babynest"] .store-display {
  font-family: "Nunito", "Heebo", serif;
}
[data-template-id="babynest"] .store-card,
[data-template-id="babynest"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="babynest"] .store-card:hover,
[data-template-id="babynest"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="babynest"] .store-marquee,
[data-template-id="babynest"] .store-marquee {
  animation: babynest-marquee 22s linear infinite;
}
[data-template-id="babynest"] .store-kenburns,
[data-template-id="babynest"] .store-kenburns {
  animation: babynest-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="babynest"] .store-float-a,
[data-template-id="babynest"] .store-float-a { animation: babynest-float 7s ease-in-out infinite; }
[data-template-id="babynest"] .store-float-b,
[data-template-id="babynest"] .store-float-b { animation: babynest-float 8.5s ease-in-out infinite reverse; }
[data-template-id="babynest"] .store-float-c,
[data-template-id="babynest"] .store-float-c { animation: babynest-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="babynest"] .store-logo,
[data-template-id="babynest"] .store-logo {
  box-shadow: 0 0 0 0 #F472B666;
  animation: babynest-pulse 2.8s ease-out infinite;
}
@keyframes babynest-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes babynest-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes babynest-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes babynest-pulse {
  0% { box-shadow: 0 0 0 0 #F472B666; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="babynest"] .store-marquee,
  [data-template-id="babynest"] .store-kenburns,
  [data-template-id="babynest"] .store-float-a,
  [data-template-id="babynest"] .store-float-b,
  [data-template-id="babynest"] .store-float-c,
  [data-template-id="babynest"] .store-logo,
  [data-template-id="babynest"] .store-marquee,
  [data-template-id="babynest"] .store-kenburns,
  [data-template-id="babynest"] .store-float-a,
  [data-template-id="babynest"] .store-float-b,
  [data-template-id="babynest"] .store-float-c,
  [data-template-id="babynest"] .store-logo {
    animation: none !important;
  }
}
[data-template-id="babynest"] .store-cloud-drift,
[data-template-id="babynest"] .store-cloud-drift {
  animation: babynest-cloud-drift 9s ease-in-out infinite;
}
[data-template-id="babynest"] .store-product-card,
[data-template-id="babynest"] .store-product-card {
  animation: babynest-lullaby-bob 7.5s ease-in-out infinite;
}
@keyframes babynest-cloud-drift {
  0%, 100% { border-radius: 45% 55% 60% 40%; transform: translate3d(0,0,0); }
  50% { border-radius: 58% 42% 44% 56%; transform: translate3d(0,-12px,0); }
}
@keyframes babynest-lullaby-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="babynest"] .store-cloud-drift,
  [data-template-id="babynest"] .store-product-card,
  [data-template-id="babynest"] .store-cloud-drift,
  [data-template-id="babynest"] .store-product-card {
    animation: none !important;
  }
}
`;
