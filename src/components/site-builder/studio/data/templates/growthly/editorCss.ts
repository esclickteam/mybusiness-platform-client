export const growthlyEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="growthly"], [data-template-id="growthly-preview"] {
  --p: #0D9488;
  --accent: #2DD4BF;
  --bg: #041F1E;
  --surface: #0A2F2D;
  --text: #ECFDF5;
  --muted: #99F6E4;
  --dark: #021412;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="growthly"] .text-center,
[data-template-id="growthly-preview"] .text-center { text-align: center; }
[data-template-id="growthly"] .ag-display,
[data-template-id="growthly-preview"] .ag-display {
  font-family: "Manrope", "Heebo", sans-serif;
}
[data-template-id="growthly"] .ag-float,
[data-template-id="growthly-preview"] .ag-float {
  animation: growthlyFloat 7s ease-in-out infinite;
}
[data-template-id="growthly"] .ag-pulse,
[data-template-id="growthly-preview"] .ag-pulse {
  animation: growthlyPulse 2.8s ease-in-out infinite;
}
[data-template-id="growthly"] .ag-card,
[data-template-id="growthly-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="growthly"] .ag-card:hover,
[data-template-id="growthly-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="growthly"] .ag-ken,
[data-template-id="growthly-preview"] .ag-ken {
  animation: growthlyKen 18s ease-in-out infinite alternate;
}
@keyframes growthlyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes growthlyPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes growthlyKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
    [data-template-id="growthly"] .ag-float,
  [data-template-id="growthly-preview"] .ag-float,
  [data-template-id="growthly"] .ag-ken,
  [data-template-id="growthly-preview"] .ag-ken,
  [data-template-id="growthly"] .ag-pulse,
  [data-template-id="growthly-preview"] .ag-pulse { animation: none; }
}
`;
