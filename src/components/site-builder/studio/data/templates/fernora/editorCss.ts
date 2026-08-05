export const fernoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="fernora"], [data-template-id="fernora"] {
  --p: #15803D;
  --accent: #86EFAC;
  --on-p: #F0FDF4;
  --bg: #F3FAF4;
  --bg-soft: #E8F5E9;
  --surface: #FFFFFF;
  --text: #14532D;
  --muted: #4D7C5C;
  --dark: #052E16;
  --line: rgba(20,83,45,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #15803D22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #86EFAC18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="fernora"] .store-display,
[data-template-id="fernora"] .store-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}
[data-template-id="fernora"] .store-card,
[data-template-id="fernora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="fernora"] .store-card:hover,
[data-template-id="fernora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="fernora"] .store-marquee,
[data-template-id="fernora"] .store-marquee {
  animation: fernora-marquee 22s linear infinite;
}
@keyframes fernora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="fernora"] .store-marquee,
  [data-template-id="fernora"] .store-marquee {
    animation: none !important;
  }
}
`;
