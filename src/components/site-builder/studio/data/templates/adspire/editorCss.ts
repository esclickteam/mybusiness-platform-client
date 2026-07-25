export const adspireEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="adspire"], [data-template-id="adspire-preview"] {
  --p: #A855F7;
  --accent: #E879F9;
  --bg: #09020F;
  --surface: #160824;
  --text: #FAF5FF;
  --muted: #D8B4FE;
  --dark: #05010A;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="adspire"] .text-center,
[data-template-id="adspire-preview"] .text-center { text-align: center; }
[data-template-id="adspire"] .ag-display,
[data-template-id="adspire-preview"] .ag-display {
  font-family: "Space Grotesk", "Heebo", sans-serif;
}
[data-template-id="adspire"] .ag-marquee,
[data-template-id="adspire-preview"] .ag-marquee {
  animation: adspireMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="adspire"] .ag-float,
[data-template-id="adspire-preview"] .ag-float {
  animation: adspireFloat 7s ease-in-out infinite;
}
[data-template-id="adspire"] .ag-pulse,
[data-template-id="adspire-preview"] .ag-pulse {
  animation: adspirePulse 2.8s ease-in-out infinite;
}
[data-template-id="adspire"] .ag-card,
[data-template-id="adspire-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="adspire"] .ag-card:hover,
[data-template-id="adspire-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="adspire"] .ag-ken,
[data-template-id="adspire-preview"] .ag-ken {
  animation: adspireKen 18s ease-in-out infinite alternate;
}
@keyframes adspireMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes adspireFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes adspirePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes adspireKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="adspire"] .ag-marquee,
  [data-template-id="adspire-preview"] .ag-marquee,
  [data-template-id="adspire"] .ag-float,
  [data-template-id="adspire-preview"] .ag-float,
  [data-template-id="adspire"] .ag-ken,
  [data-template-id="adspire-preview"] .ag-ken,
  [data-template-id="adspire"] .ag-pulse,
  [data-template-id="adspire-preview"] .ag-pulse { animation: none; }
}
`;
