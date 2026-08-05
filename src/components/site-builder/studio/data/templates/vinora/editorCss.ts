export const vinoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="vinora"], [data-template-id="vinora"] {
  --p: #7F1D1D;
  --accent: #F59E0B;
  --on-p: #FFFBEB;
  --bg: #FFFBF5;
  --bg-soft: #F5E6D3;
  --surface: #FFFFFF;
  --text: #3F1D12;
  --muted: #7C2D12;
  --dark: #1A0A08;
  --line: rgba(63,29,18,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #7F1D1D22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F59E0B18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="vinora"] .store-display,
[data-template-id="vinora"] .store-display {
  font-family: "Playfair Display", "Heebo", serif;
}
[data-template-id="vinora"] .store-card,
[data-template-id="vinora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="vinora"] .store-card:hover,
[data-template-id="vinora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="vinora"] .store-marquee,
[data-template-id="vinora"] .store-marquee {
  animation: vinora-marquee 22s linear infinite;
}
@keyframes vinora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="vinora"] .store-marquee,
  [data-template-id="vinora"] .store-marquee {
    animation: none !important;
  }
}
`;
