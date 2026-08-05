export const pharmoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="pharmora"], [data-template-id="pharmora"] {
  --p: #0369A1;
  --accent: #34D399;
  --on-p: #F0F9FF;
  --bg: #F0F9FF;
  --bg-soft: #E0F2FE;
  --surface: #FFFFFF;
  --text: #0C4A6E;
  --muted: #0369A1;
  --dark: #082F49;
  --line: rgba(12,74,110,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #0369A122, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #34D39918, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="pharmora"] .store-display,
[data-template-id="pharmora"] .store-display {
  font-family: "IBM Plex Sans", "Heebo", serif;
}
[data-template-id="pharmora"] .store-card,
[data-template-id="pharmora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="pharmora"] .store-card:hover,
[data-template-id="pharmora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="pharmora"] .store-marquee,
[data-template-id="pharmora"] .store-marquee {
  animation: pharmora-marquee 22s linear infinite;
}
@keyframes pharmora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="pharmora"] .store-marquee,
  [data-template-id="pharmora"] .store-marquee {
    animation: none !important;
  }
}
`;
