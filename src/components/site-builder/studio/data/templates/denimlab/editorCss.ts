export const denimlabEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="denimlab"], [data-template-id="denimlab"] {
  --p: #1E3A8A;
  --accent: #F59E0B;
  --on-p: #EFF6FF;
  --bg: #F8FAFC;
  --bg-soft: #E2E8F0;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #475569;
  --dark: #020617;
  --line: rgba(15,23,42,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #1E3A8A22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F59E0B18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="denimlab"] .store-display,
[data-template-id="denimlab"] .store-display {
  font-family: "Oswald", "Heebo", serif;
}
[data-template-id="denimlab"] .store-card,
[data-template-id="denimlab"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="denimlab"] .store-card:hover,
[data-template-id="denimlab"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="denimlab"] .store-marquee,
[data-template-id="denimlab"] .store-marquee {
  animation: denimlab-marquee 22s linear infinite;
}
@keyframes denimlab-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="denimlab"] .store-marquee,
  [data-template-id="denimlab"] .store-marquee {
    animation: none !important;
  }
}
`;
