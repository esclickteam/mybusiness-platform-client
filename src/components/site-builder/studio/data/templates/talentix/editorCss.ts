export const talentixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="talentix"], [data-template-id="talentix-preview"] {
  --p: #0E7490;
  --accent: #06B6D4;
  --bg: #ECFEFF;
  --surface: #FFFFFF;
  --text: #164E63;
  --muted: #0E7490;
  --dark: #083344;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="talentix"] .text-center,
[data-template-id="talentix-preview"] .text-center {
  text-align: center;
}
[data-template-id="talentix"] .ag-display,
[data-template-id="talentix-preview"] .ag-display {
  font-family: "Sora", "Heebo", sans-serif;
}
[data-template-id="talentix"] .ag-card,
[data-template-id="talentix-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="talentix"] .ag-card:hover,
[data-template-id="talentix-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
