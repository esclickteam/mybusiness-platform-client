export const playoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="playora"], [data-template-id="playora"] {
  --p: #DB2777;
  --accent: #FDE047;
  --on-p: #FFFFFF;
  --bg: #FFF7FB;
  --bg-soft: #FCE7F3;
  --surface: #FFFFFF;
  --text: #831843;
  --muted: #9D174D;
  --dark: #500724;
  --line: rgba(131,24,67,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #DB277722, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FDE04718, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="playora"] .store-display,
[data-template-id="playora"] .store-display {
  font-family: "Fredoka", "Heebo", serif;
}
[data-template-id="playora"] .store-card,
[data-template-id="playora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="playora"] .store-card:hover,
[data-template-id="playora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="playora"] .store-marquee,
[data-template-id="playora"] .store-marquee {
  animation: playora-marquee 22s linear infinite;
}
@keyframes playora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="playora"] .store-marquee,
  [data-template-id="playora"] .store-marquee {
    animation: none !important;
  }
}
`;
