export const scentoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="scentora"], [data-template-id="scentora-preview"] {
  --p: #9D174D;
  --accent: #F9A8D4;
  --on-p: #FFF1F2;
  --bg: #FFF7F9;
  --bg-soft: #FCE7F3;
  --surface: #FFFFFF;
  --text: #500724;
  --muted: #9D174D;
  --dark: #2D0A1A;
  --line: rgba(80,7,36,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #9D174D22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F9A8D418, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="scentora"] .store-display,
[data-template-id="scentora-preview"] .store-display {
  font-family: "Cormorant Garamond", "Heebo", serif;
}
[data-template-id="scentora"] .store-card,
[data-template-id="scentora-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="scentora"] .store-card:hover,
[data-template-id="scentora-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="scentora"] .store-marquee,
[data-template-id="scentora-preview"] .store-marquee {
  animation: scentora-marquee 22s linear infinite;
}
@keyframes scentora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="scentora"] .store-marquee,
  [data-template-id="scentora-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
