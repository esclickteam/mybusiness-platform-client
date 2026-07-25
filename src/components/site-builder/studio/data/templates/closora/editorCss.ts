export const closoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="closora"], [data-template-id="closora-preview"] {
  --p: #EA580C;
  --accent: #FB923C;
  --bg: #1C1917;
  --surface: #292524;
  --text: #FFF7ED;
  --muted: #FDBA74;
  --dark: #0C0A09;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="closora"] .text-center,
[data-template-id="closora-preview"] .text-center { text-align: center; }
[data-template-id="closora"] .ag-display,
[data-template-id="closora-preview"] .ag-display {
  font-family: "Oswald", "Heebo", sans-serif;
}
[data-template-id="closora"] .ag-marquee,
[data-template-id="closora-preview"] .ag-marquee {
  animation: closoraMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="closora"] .ag-float,
[data-template-id="closora-preview"] .ag-float {
  animation: closoraFloat 7s ease-in-out infinite;
}
[data-template-id="closora"] .ag-pulse,
[data-template-id="closora-preview"] .ag-pulse {
  animation: closoraPulse 2.8s ease-in-out infinite;
}
[data-template-id="closora"] .ag-card,
[data-template-id="closora-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="closora"] .ag-card:hover,
[data-template-id="closora-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="closora"] .ag-ken,
[data-template-id="closora-preview"] .ag-ken {
  animation: closoraKen 18s ease-in-out infinite alternate;
}
@keyframes closoraMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes closoraFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes closoraPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes closoraKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="closora"] .ag-marquee,
  [data-template-id="closora-preview"] .ag-marquee,
  [data-template-id="closora"] .ag-float,
  [data-template-id="closora-preview"] .ag-float,
  [data-template-id="closora"] .ag-ken,
  [data-template-id="closora-preview"] .ag-ken,
  [data-template-id="closora"] .ag-pulse,
  [data-template-id="closora-preview"] .ag-pulse { animation: none; }
}
`;
