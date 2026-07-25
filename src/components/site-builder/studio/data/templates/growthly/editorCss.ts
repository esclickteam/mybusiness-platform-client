export const growthlyEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="growthly"], [data-template-id="growthly-preview"] {
  --p: #0F766E;
  --accent: #14B8A6;
  --bg: #F0FDFA;
  --surface: #FFFFFF;
  --text: #134E4A;
  --muted: #5F7A76;
  --dark: #042F2E;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="growthly"] .text-center,
[data-template-id="growthly-preview"] .text-center {
  text-align: center;
}
[data-template-id="growthly"] .ag-display,
[data-template-id="growthly-preview"] .ag-display {
  font-family: "Manrope", "Heebo", sans-serif;
}
[data-template-id="growthly"] .ag-card,
[data-template-id="growthly-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="growthly"] .ag-card:hover,
[data-template-id="growthly-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
