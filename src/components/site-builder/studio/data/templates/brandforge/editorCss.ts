export const brandforgeEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
[data-template-id="brandforge"], [data-template-id="brandforge-preview"] {
  --p: #111827;
  --accent: #F59E0B;
  --bg: #FFFBEB;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #78716C;
  --dark: #0A0A0A;
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="brandforge"] .text-center,
[data-template-id="brandforge-preview"] .text-center { text-align: center; }
[data-template-id="brandforge"] .ag-display,
[data-template-id="brandforge-preview"] .ag-display {
  font-family: "Syne", "Heebo", sans-serif;
}
[data-template-id="brandforge"] .ag-marquee,
[data-template-id="brandforge-preview"] .ag-marquee {
  animation: brandforgeMarquee 28s linear infinite;
  width: max-content;
}
[data-template-id="brandforge"] .ag-float,
[data-template-id="brandforge-preview"] .ag-float {
  animation: brandforgeFloat 7s ease-in-out infinite;
}
[data-template-id="brandforge"] .ag-pulse,
[data-template-id="brandforge-preview"] .ag-pulse {
  animation: brandforgePulse 2.8s ease-in-out infinite;
}
[data-template-id="brandforge"] .ag-card,
[data-template-id="brandforge-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="brandforge"] .ag-card:hover,
[data-template-id="brandforge-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="brandforge"] .ag-ken,
[data-template-id="brandforge-preview"] .ag-ken {
  animation: brandforgeKen 18s ease-in-out infinite alternate;
}
@keyframes brandforgeMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes brandforgeFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes brandforgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes brandforgeKen {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="brandforge"] .ag-marquee,
  [data-template-id="brandforge-preview"] .ag-marquee,
  [data-template-id="brandforge"] .ag-float,
  [data-template-id="brandforge-preview"] .ag-float,
  [data-template-id="brandforge"] .ag-ken,
  [data-template-id="brandforge-preview"] .ag-ken,
  [data-template-id="brandforge"] .ag-pulse,
  [data-template-id="brandforge-preview"] .ag-pulse { animation: none; }
}
`;
