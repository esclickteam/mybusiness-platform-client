export const sneakhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="sneakhaus"], [data-template-id="sneakhaus"] {
  --p: #09090B;
  --accent: #22D3EE;
  --on-p: #FFFFFF;
  --bg: #FAFAFA;
  --bg-soft: #E4E4E7;
  --surface: #FFFFFF;
  --text: #09090B;
  --muted: #52525B;
  --dark: #09090B;
  --line: rgba(9,9,11,0.16);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #09090B22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #22D3EE18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="sneakhaus"] .store-display,
[data-template-id="sneakhaus"] .store-display {
  font-family: "Space Grotesk", "Heebo", serif;
}
[data-template-id="sneakhaus"] .store-card,
[data-template-id="sneakhaus"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="sneakhaus"] .store-card:hover,
[data-template-id="sneakhaus"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="sneakhaus"] .store-marquee,
[data-template-id="sneakhaus"] .store-marquee {
  animation: sneakhaus-marquee 22s linear infinite;
}
@keyframes sneakhaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="sneakhaus"] .store-marquee,
  [data-template-id="sneakhaus"] .store-marquee {
    animation: none !important;
  }
}
`;
