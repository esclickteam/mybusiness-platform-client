export const summitopsEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="summitops"], [data-template-id="summitops-preview"] {
  --p: #0F766E;
  --accent: #134E4A;
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
[data-template-id="summitops"] .text-center,
[data-template-id="summitops-preview"] .text-center { text-align: center; }
[data-template-id="summitops"] .ag-display,
[data-template-id="summitops-preview"] .ag-display {
  font-family: "Manrope", "Heebo", sans-serif;
}
[data-template-id="summitops"] .ag-marquee,
[data-template-id="summitops-preview"] .ag-marquee {
  animation: summitopsMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="summitops"] .ag-float,
[data-template-id="summitops-preview"] .ag-float {
  animation: summitopsFloat 7s ease-in-out infinite;
}
[data-template-id="summitops"] .ag-pulse,
[data-template-id="summitops-preview"] .ag-pulse {
  animation: summitopsPulse 2.8s ease-in-out infinite;
}
[data-template-id="summitops"] .ag-card,
[data-template-id="summitops-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="summitops"] .ag-card:hover,
[data-template-id="summitops-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="summitops"] .ag-ken,
[data-template-id="summitops-preview"] .ag-ken {
  animation: summitopsKen 18s ease-in-out infinite alternate;
}
@keyframes summitopsMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes summitopsFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes summitopsPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes summitopsKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="summitops"] .ag-marquee,
  [data-template-id="summitops-preview"] .ag-marquee,
  [data-template-id="summitops"] .ag-float,
  [data-template-id="summitops-preview"] .ag-float,
  [data-template-id="summitops"] .ag-ken,
  [data-template-id="summitops-preview"] .ag-ken,
  [data-template-id="summitops"] .ag-pulse,
  [data-template-id="summitops-preview"] .ag-pulse { animation: none; }
}
`;
