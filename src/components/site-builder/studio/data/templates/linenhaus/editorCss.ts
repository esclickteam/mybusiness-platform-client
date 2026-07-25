export const linenhausEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="linenhaus"], [data-template-id="linenhaus-preview"] {
  --p: #9A3412;
  --accent: #FDBA74;
  --on-p: #FFF7ED;
  --bg: #FFF7ED;
  --bg-soft: #FFEDD5;
  --surface: #FFFFFF;
  --text: #7C2D12;
  --muted: #9A3412;
  --dark: #431407;
  --line: rgba(124,45,18,0.14);
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, #9A341222, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, #FDBA7418, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="linenhaus"] .store-display,
[data-template-id="linenhaus-preview"] .store-display {
  font-family: "Fraunces", "Heebo", serif;
}
[data-template-id="linenhaus"] .store-card,
[data-template-id="linenhaus-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="linenhaus"] .store-card:hover,
[data-template-id="linenhaus-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="linenhaus"] .store-marquee,
[data-template-id="linenhaus-preview"] .store-marquee {
  animation: linenhaus-marquee 22s linear infinite;
}
@keyframes linenhaus-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="linenhaus"] .store-marquee,
  [data-template-id="linenhaus-preview"] .store-marquee {
    animation: none !important;
  }
}
`;
