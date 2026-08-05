export const kickoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Anton:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="kickora"], [data-template-id="kickora"] {
  --p: #111827;
  --accent: #F43F5E;
  --on-p: #FFFFFF;
  --bg: #0B0B0F;
  --bg-soft: #15151C;
  --surface: #1C1C26;
  --text: #F5F5F7;
  --muted: #A1A1AA;
  --dark: #050507;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #11182722, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F43F5E18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="kickora"] .store-display,
[data-template-id="kickora"] .store-display {
  font-family: "Anton", "Heebo", serif;
}
[data-template-id="kickora"] .store-card,
[data-template-id="kickora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="kickora"] .store-card:hover,
[data-template-id="kickora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="kickora"] .store-marquee,
[data-template-id="kickora"] .store-marquee {
  animation: kickora-marquee 22s linear infinite;
}
@keyframes kickora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="kickora"] .store-marquee,
  [data-template-id="kickora"] .store-marquee {
    animation: none !important;
  }
}
`;
