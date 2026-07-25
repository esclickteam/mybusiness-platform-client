export const narrativaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="narrativa"], [data-template-id="narrativa-preview"] {
  --p: #BE123C;
  --accent: #FB7185;
  --bg: #FFF1F2;
  --surface: #FFFFFF;
  --text: #4C0519;
  --muted: #9F1239;
  --dark: #1F0A12;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="narrativa"] .text-center,
[data-template-id="narrativa-preview"] .text-center {
  text-align: center;
}
[data-template-id="narrativa"] .ag-display,
[data-template-id="narrativa-preview"] .ag-display {
  font-family: "Playfair Display", "Heebo", sans-serif;
}
[data-template-id="narrativa"] .ag-card,
[data-template-id="narrativa-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="narrativa"] .ag-card:hover,
[data-template-id="narrativa-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
