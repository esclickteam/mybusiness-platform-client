export const nestwareEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="nestware"], [data-template-id="nestware-preview"] {
  --p: #0F766E;
  --accent: #F59E0B;
  --on-p: #F0FDFA;
  --bg: #F0FDFA;
  --bg-soft: #CCFBF1;
  --surface: #FFFFFF;
  --text: #134E4A;
  --muted: #0F766E;
  --dark: #042F2E;
  --line: rgba(19,78,74,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #0F766E22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F59E0B18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="nestware"] .store-display,
[data-template-id="nestware-preview"] .store-display {
  font-family: "DM Serif Display", "Heebo", serif;
}
[data-template-id="nestware"] .store-card,
[data-template-id="nestware-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="nestware"] .store-card:hover,
[data-template-id="nestware-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="nestware"] .store-marquee,
[data-template-id="nestware-preview"] .store-marquee {
  animation: nestware-marquee 22s linear infinite;
}
@keyframes nestware-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="nestware"] .store-marquee,
  [data-template-id="nestware-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
