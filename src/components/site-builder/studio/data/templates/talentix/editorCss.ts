export const talentixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="talentix"], [data-template-id="talentix-preview"] {
  --p: #0891B2;
  --accent: #22D3EE;
  --bg: #ECFEFF;
  --surface: #FFFFFF;
  --text: #083344;
  --muted: #0E7490;
  --dark: #164E63;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="talentix"] .text-center,
[data-template-id="talentix-preview"] .text-center { text-align: center; }
[data-template-id="talentix"] .ag-display,
[data-template-id="talentix-preview"] .ag-display {
  font-family: "Sora", "Heebo", sans-serif;
}
[data-template-id="talentix"] .ag-marquee,
[data-template-id="talentix-preview"] .ag-marquee {
  animation: talentixMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="talentix"] .ag-float,
[data-template-id="talentix-preview"] .ag-float {
  animation: talentixFloat 7s ease-in-out infinite;
}
[data-template-id="talentix"] .ag-pulse,
[data-template-id="talentix-preview"] .ag-pulse {
  animation: talentixPulse 2.8s ease-in-out infinite;
}
[data-template-id="talentix"] .ag-card,
[data-template-id="talentix-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="talentix"] .ag-card:hover,
[data-template-id="talentix-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="talentix"] .ag-ken,
[data-template-id="talentix-preview"] .ag-ken {
  animation: talentixKen 18s ease-in-out infinite alternate;
}
@keyframes talentixMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes talentixFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes talentixPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes talentixKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="talentix"] .ag-marquee,
  [data-template-id="talentix-preview"] .ag-marquee,
  [data-template-id="talentix"] .ag-float,
  [data-template-id="talentix-preview"] .ag-float,
  [data-template-id="talentix"] .ag-ken,
  [data-template-id="talentix-preview"] .ag-ken,
  [data-template-id="talentix"] .ag-pulse,
  [data-template-id="talentix-preview"] .ag-pulse { animation: none; }
}
`;
