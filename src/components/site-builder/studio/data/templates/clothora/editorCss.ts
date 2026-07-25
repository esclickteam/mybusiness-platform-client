export const clothoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="clothora"], [data-template-id="clothora-preview"] {
  --p: #111827;
  --accent: #F43F5E;
  --on-p: #FFFFFF;
  --bg: #FAFAF9;
  --bg-soft: #F5F5F4;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #57534E;
  --dark: #0C0A09;
  --line: rgba(17,24,39,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #11182722, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F43F5E18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="clothora"] .store-display,
[data-template-id="clothora-preview"] .store-display {
  font-family: "Bodoni Moda", "Heebo", serif;
}
[data-template-id="clothora"] .store-card,
[data-template-id="clothora-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="clothora"] .store-card:hover,
[data-template-id="clothora-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="clothora"] .store-marquee,
[data-template-id="clothora-preview"] .store-marquee {
  animation: clothora-marquee 22s linear infinite;
}
@keyframes clothora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="clothora"] .store-marquee,
  [data-template-id="clothora-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
