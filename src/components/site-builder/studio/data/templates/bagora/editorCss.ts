export const bagoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="bagora"], [data-template-id="bagora"] {
  --p: #7C2D12;
  --accent: #FB923C;
  --on-p: #FFF7ED;
  --bg: #FFF7ED;
  --bg-soft: #FFEDD5;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #9A3412;
  --dark: #1C1917;
  --line: rgba(67,20,7,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #7C2D1222, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FB923C18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="bagora"] .store-display,
[data-template-id="bagora"] .store-display {
  font-family: "Playfair Display", "Heebo", serif;
}
[data-template-id="bagora"] .store-card,
[data-template-id="bagora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="bagora"] .store-card:hover,
[data-template-id="bagora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="bagora"] .store-marquee,
[data-template-id="bagora"] .store-marquee {
  animation: bagora-marquee 22s linear infinite;
}
@keyframes bagora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="bagora"] .store-marquee,
  [data-template-id="bagora"] .store-marquee {
    animation: none !important;
  }
}
`;
