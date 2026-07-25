export const trailhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="trailhaus"], [data-template-id="trailhaus-preview"] {
  --p: #166534;
  --accent: #F59E0B;
  --on-p: #F0FDF4;
  --bg: #F4F7F0;
  --bg-soft: #E7EFE0;
  --surface: #FFFFFF;
  --text: #14532D;
  --muted: #3F6212;
  --dark: #052E16;
  --line: rgba(20,83,45,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #16653422, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #F59E0B18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="trailhaus"] .store-display,
[data-template-id="trailhaus-preview"] .store-display {
  font-family: "Oswald", "Heebo", serif;
}
[data-template-id="trailhaus"] .store-card,
[data-template-id="trailhaus-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="trailhaus"] .store-card:hover,
[data-template-id="trailhaus-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="trailhaus"] .store-marquee,
[data-template-id="trailhaus-preview"] .store-marquee {
  animation: trailhaus-marquee 22s linear infinite;
}
@keyframes trailhaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="trailhaus"] .store-marquee,
  [data-template-id="trailhaus-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
