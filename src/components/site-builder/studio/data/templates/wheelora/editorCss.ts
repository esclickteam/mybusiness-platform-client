export const wheeloraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="wheelora"], [data-template-id="wheelora-preview"] {
  --p: #DC2626;
  --accent: #FDE047;
  --on-p: #FFFFFF;
  --bg: #FAFAFA;
  --bg-soft: #F3F4F6;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #6B7280;
  --dark: #0F172A;
  --line: rgba(17,24,39,0.12);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #DC262622, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FDE04718, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="wheelora"] .store-display,
[data-template-id="wheelora-preview"] .store-display {
  font-family: "Barlow Condensed", "Heebo", serif;
}
[data-template-id="wheelora"] .store-card,
[data-template-id="wheelora-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="wheelora"] .store-card:hover,
[data-template-id="wheelora-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="wheelora"] .store-marquee,
[data-template-id="wheelora-preview"] .store-marquee {
  animation: wheelora-marquee 22s linear infinite;
}
@keyframes wheelora-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="wheelora"] .store-marquee,
  [data-template-id="wheelora-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
