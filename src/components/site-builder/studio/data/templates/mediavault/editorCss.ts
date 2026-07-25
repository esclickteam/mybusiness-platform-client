export const mediavaultEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="mediavault"], [data-template-id="mediavault-preview"] {
  --p: #2563EB;
  --accent: #38BDF8;
  --bg: #0B1220;
  --surface: #111827;
  --text: #E2E8F0;
  --muted: #94A3B8;
  --dark: #020617;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="mediavault"] .text-center,
[data-template-id="mediavault-preview"] .text-center { text-align: center; }
[data-template-id="mediavault"] .ag-display,
[data-template-id="mediavault-preview"] .ag-display {
  font-family: "IBM Plex Sans Hebrew", "Heebo", sans-serif;
}
[data-template-id="mediavault"] .ag-float,
[data-template-id="mediavault-preview"] .ag-float {
  animation: mediavaultFloat 7s ease-in-out infinite;
}
[data-template-id="mediavault"] .ag-pulse,
[data-template-id="mediavault-preview"] .ag-pulse {
  animation: mediavaultPulse 2.8s ease-in-out infinite;
}
[data-template-id="mediavault"] .ag-card,
[data-template-id="mediavault-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="mediavault"] .ag-card:hover,
[data-template-id="mediavault-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="mediavault"] .ag-ken,
[data-template-id="mediavault-preview"] .ag-ken {
  animation: mediavaultKen 18s ease-in-out infinite alternate;
}
@keyframes mediavaultFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes mediavaultPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes mediavaultKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
    [data-template-id="mediavault"] .ag-float,
  [data-template-id="mediavault-preview"] .ag-float,
  [data-template-id="mediavault"] .ag-ken,
  [data-template-id="mediavault-preview"] .ag-ken,
  [data-template-id="mediavault"] .ag-pulse,
  [data-template-id="mediavault-preview"] .ag-pulse { animation: none; }
}
`;
