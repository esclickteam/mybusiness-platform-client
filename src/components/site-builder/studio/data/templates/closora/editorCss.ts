export const closoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="closora"], [data-template-id="closora-preview"] {
  --p: #C2410C;
  --accent: #F97316;
  --bg: #FFF7ED;
  --surface: #FFFFFF;
  --text: #431407;
  --muted: #9A3412;
  --dark: #1C1917;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="closora"] .text-center,
[data-template-id="closora-preview"] .text-center {
  text-align: center;
}
[data-template-id="closora"] .ag-display,
[data-template-id="closora-preview"] .ag-display {
  font-family: "Oswald", "Heebo", sans-serif;
}
[data-template-id="closora"] .ag-card,
[data-template-id="closora-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="closora"] .ag-card:hover,
[data-template-id="closora-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
