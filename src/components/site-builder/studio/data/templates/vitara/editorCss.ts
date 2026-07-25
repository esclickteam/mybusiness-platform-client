export const vitaraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="vitara"], [data-template-id="vitara-preview"] {
  --p: #15803D;
  --accent: #A3E635;
  --on-p: #F0FDF4;
  --bg: #F7FEE7;
  --bg-soft: #ECFCCB;
  --surface: #FFFFFF;
  --text: #14532D;
  --muted: #3F6212;
  --dark: #052E16;
  --line: rgba(20,83,45,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #15803D22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #A3E63518, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="vitara"] .store-display,
[data-template-id="vitara-preview"] .store-display {
  font-family: "Manrope", "Heebo", serif;
}
[data-template-id="vitara"] .store-card,
[data-template-id="vitara-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="vitara"] .store-card:hover,
[data-template-id="vitara-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="vitara"] .store-marquee,
[data-template-id="vitara-preview"] .store-marquee {
  animation: vitara-marquee 22s linear infinite;
}
@keyframes vitara-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="vitara"] .store-marquee,
  [data-template-id="vitara-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
