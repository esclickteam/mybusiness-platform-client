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
[data-template-id="narrativa-preview"] .text-center { text-align: center; }
[data-template-id="narrativa"] .ag-display,
[data-template-id="narrativa-preview"] .ag-display {
  font-family: "Playfair Display", "Heebo", sans-serif;
}
[data-template-id="narrativa"] .ag-marquee,
[data-template-id="narrativa-preview"] .ag-marquee {
  animation: narrativaMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="narrativa"] .ag-float,
[data-template-id="narrativa-preview"] .ag-float {
  animation: narrativaFloat 7s ease-in-out infinite;
}
[data-template-id="narrativa"] .ag-pulse,
[data-template-id="narrativa-preview"] .ag-pulse {
  animation: narrativaPulse 2.8s ease-in-out infinite;
}
[data-template-id="narrativa"] .ag-card,
[data-template-id="narrativa-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="narrativa"] .ag-card:hover,
[data-template-id="narrativa-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="narrativa"] .ag-ken,
[data-template-id="narrativa-preview"] .ag-ken {
  animation: narrativaKen 18s ease-in-out infinite alternate;
}
@keyframes narrativaMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes narrativaFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes narrativaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes narrativaKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="narrativa"] .ag-marquee,
  [data-template-id="narrativa-preview"] .ag-marquee,
  [data-template-id="narrativa"] .ag-float,
  [data-template-id="narrativa-preview"] .ag-float,
  [data-template-id="narrativa"] .ag-ken,
  [data-template-id="narrativa-preview"] .ag-ken,
  [data-template-id="narrativa"] .ag-pulse,
  [data-template-id="narrativa-preview"] .ag-pulse { animation: none; }
}
`;
