export const watchoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="watchora"], [data-template-id="watchora"] {
  --p: #1F2937;
  --accent: #D4AF37;
  --on-p: #F9FAFB;
  --bg: #F3F4F6;
  --bg-soft: #E5E7EB;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #4B5563;
  --dark: #030712;
  --line: rgba(17,24,39,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #1F293722, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #D4AF3718, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="watchora"] .store-display,
[data-template-id="watchora"] .store-display {
  font-family: "Instrument Serif", "Heebo", serif;
}
[data-template-id="watchora"] .store-card,
[data-template-id="watchora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="watchora"] .store-card:hover,
[data-template-id="watchora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="watchora"] .store-marquee,
[data-template-id="watchora"] .store-marquee {
  animation: watchora-marquee 22s linear infinite;
}
@keyframes watchora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="watchora"] .store-marquee,
  [data-template-id="watchora"] .store-marquee {
    animation: none !important;
  }
}
`;
