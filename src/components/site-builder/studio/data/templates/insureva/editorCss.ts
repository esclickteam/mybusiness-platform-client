export const insurevaEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="insureva"], [data-template-id="insureva-preview"] {
  --p: #1D4ED8;
  --accent: #60A5FA;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #64748B;
  --dark: #0B1B3A;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="insureva"] .text-center,
[data-template-id="insureva-preview"] .text-center { text-align: center; }
[data-template-id="insureva"] .ag-display,
[data-template-id="insureva-preview"] .ag-display {
  font-family: "IBM Plex Sans Hebrew", "Heebo", sans-serif;
}
[data-template-id="insureva"] .ag-float,
[data-template-id="insureva-preview"] .ag-float {
  animation: insurevaFloat 7s ease-in-out infinite;
}
[data-template-id="insureva"] .ag-pulse,
[data-template-id="insureva-preview"] .ag-pulse {
  animation: insurevaPulse 2.8s ease-in-out infinite;
}
[data-template-id="insureva"] .ag-card,
[data-template-id="insureva-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="insureva"] .ag-card:hover,
[data-template-id="insureva-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="insureva"] .ag-ken,
[data-template-id="insureva-preview"] .ag-ken {
  animation: insurevaKen 18s ease-in-out infinite alternate;
}
  to { transform: translateX(50%); }
}
@keyframes insurevaFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes insurevaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes insurevaKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
    [data-template-id="insureva"] .ag-float,
  [data-template-id="insureva-preview"] .ag-float,
  [data-template-id="insureva"] .ag-ken,
  [data-template-id="insureva-preview"] .ag-ken,
  [data-template-id="insureva"] .ag-pulse,
  [data-template-id="insureva-preview"] .ag-pulse { animation: none; }
}
`;
