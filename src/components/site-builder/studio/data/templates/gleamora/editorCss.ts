export const gleamoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="gleamora"], [data-template-id="gleamora"] {
  --p: #A16207;
  --accent: #FDE68A;
  --on-p: #1C1917;
  --bg: #FFFBEB;
  --bg-soft: #FEF3C7;
  --surface: #FFFFFF;
  --text: #1C1917;
  --muted: #78716C;
  --dark: #0C0A09;
  --line: rgba(28,25,23,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #A1620722, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FDE68A18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="gleamora"] .store-display,
[data-template-id="gleamora"] .store-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}
[data-template-id="gleamora"] .store-card,
[data-template-id="gleamora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="gleamora"] .store-card:hover,
[data-template-id="gleamora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="gleamora"] .store-marquee,
[data-template-id="gleamora"] .store-marquee {
  animation: gleamora-marquee 22s linear infinite;
}
@keyframes gleamora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="gleamora"] .store-marquee,
  [data-template-id="gleamora"] .store-marquee {
    animation: none !important;
  }
}
`;
