export const panoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="panora"], [data-template-id="panora-preview"] {
  --p: #C2410C;
  --accent: #FDBA74;
  --on-p: #FFF7ED;
  --bg: #FFFAF5;
  --bg-soft: #FFF1E6;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #9A3412;
  --dark: #1C1917;
  --line: rgba(67,20,7,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #C2410C22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FDBA7418, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="panora"] .store-display,
[data-template-id="panora-preview"] .store-display {
  font-family: "Libre Baskerville", "Heebo", serif;
}
[data-template-id="panora"] .store-card,
[data-template-id="panora-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="panora"] .store-card:hover,
[data-template-id="panora-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="panora"] .store-marquee,
[data-template-id="panora-preview"] .store-marquee {
  animation: panora-marquee 22s linear infinite;
}
@keyframes panora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="panora"] .store-marquee,
  [data-template-id="panora-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
