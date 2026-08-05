export const loungoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Literata:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="loungora"], [data-template-id="loungora"] {
  --p: #5B21B6;
  --accent: #C4B5FD;
  --on-p: #F5F3FF;
  --bg: #FAF5FF;
  --bg-soft: #EDE9FE;
  --surface: #FFFFFF;
  --text: #4C1D95;
  --muted: #6D28D9;
  --dark: #2E1065;
  --line: rgba(76,29,149,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #5B21B622, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #C4B5FD18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="loungora"] .store-display,
[data-template-id="loungora"] .store-display {
  font-family: "Literata", "Heebo", serif;
}
[data-template-id="loungora"] .store-card,
[data-template-id="loungora"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="loungora"] .store-card:hover,
[data-template-id="loungora"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="loungora"] .store-marquee,
[data-template-id="loungora"] .store-marquee {
  animation: loungora-marquee 22s linear infinite;
}
@keyframes loungora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="loungora"] .store-marquee,
  [data-template-id="loungora"] .store-marquee {
    animation: none !important;
  }
}
`;
