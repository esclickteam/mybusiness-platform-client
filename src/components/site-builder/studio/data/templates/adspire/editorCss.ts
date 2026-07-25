export const adspireEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="adspire"], [data-template-id="adspire-preview"] {
  --p: #7C3AED;
  --accent: #A78BFA;
  --bg: #0B0614;
  --surface: #160B24;
  --text: #F5F3FF;
  --muted: #C4B5FD;
  --dark: #050208;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="adspire"] .text-center,
[data-template-id="adspire-preview"] .text-center {
  text-align: center;
}
[data-template-id="adspire"] .ag-display,
[data-template-id="adspire-preview"] .ag-display {
  font-family: "Space Grotesk", "Heebo", sans-serif;
}
[data-template-id="adspire"] .ag-card,
[data-template-id="adspire-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="adspire"] .ag-card:hover,
[data-template-id="adspire-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
