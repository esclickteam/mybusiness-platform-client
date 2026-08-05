export const soleoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="soleora"], [data-template-id="soleora"] {
  --p: #78350F;
  --accent: #CA8A04;
  --on-p: #FFFBEB;
  --bg: #FFFBEB;
  --bg-soft: #FEF3C7;
  --surface: #FFFFFF;
  --text: #451A03;
  --muted: #92400E;
  --dark: #1C1917;
  --line: rgba(69,26,3,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #78350F22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #CA8A0418, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="soleora"] .store-display,
[data-template-id="soleora"] .store-display {
  font-family: "Libre Baskerville", "Heebo", serif;
}
[data-template-id="soleora"] .store-card,
[data-template-id="soleora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="soleora"] .store-card:hover,
[data-template-id="soleora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="soleora"] .store-marquee,
[data-template-id="soleora"] .store-marquee {
  animation: soleora-marquee 22s linear infinite;
}
@keyframes soleora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="soleora"] .store-marquee,
  [data-template-id="soleora"] .store-marquee {
    animation: none !important;
  }
}
`;
