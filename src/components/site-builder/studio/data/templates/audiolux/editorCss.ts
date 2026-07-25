export const audioluxEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="audiolux"], [data-template-id="audiolux-preview"] {
  --p: #06B6D4;
  --accent: #A78BFA;
  --on-p: #041016;
  --bg: #050915;
  --bg-soft: #0B1224;
  --surface: #111827;
  --text: #E0F2FE;
  --muted: #94A3B8;
  --dark: #020617;
  --line: rgba(255,255,255,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #06B6D422, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #A78BFA18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="audiolux"] .store-display,
[data-template-id="audiolux-preview"] .store-display {
  font-family: "Space Grotesk", "Heebo", serif;
}
[data-template-id="audiolux"] .store-card,
[data-template-id="audiolux-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="audiolux"] .store-card:hover,
[data-template-id="audiolux-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="audiolux"] .store-marquee,
[data-template-id="audiolux-preview"] .store-marquee {
  animation: audiolux-marquee 22s linear infinite;
}
@keyframes audiolux-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="audiolux"] .store-marquee,
  [data-template-id="audiolux-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
