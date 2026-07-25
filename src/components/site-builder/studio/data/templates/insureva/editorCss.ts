export const insurevaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="insureva"], [data-template-id="insureva-preview"] {
  --p: #1D4ED8;
  --accent: #3B82F6;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #64748B;
  --dark: #020617;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="insureva"] .text-center,
[data-template-id="insureva-preview"] .text-center {
  text-align: center;
}
[data-template-id="insureva"] .ag-display,
[data-template-id="insureva-preview"] .ag-display {
  font-family: "IBM Plex Sans Hebrew", "Heebo", sans-serif;
}
[data-template-id="insureva"] .ag-card,
[data-template-id="insureva-preview"] .ag-card {
  transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}
[data-template-id="insureva"] .ag-card:hover,
[data-template-id="insureva-preview"] .ag-card:hover {
  transform: translateY(-4px);
  border-color: var(--p);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
`;
