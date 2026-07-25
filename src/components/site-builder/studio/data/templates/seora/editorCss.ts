export const seoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap');
[data-template-id="seora"], [data-template-id="seora-preview"] {
  --p: #2DD4BF;
  --a: #A3E635;
  --bg: #071513;
  --surface: #0F2421;
  --text: #ECFDF5;
  --muted: #99F6E4;
  --dark: #03100E;
  font-family: "Frank Ruhl Libre", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="seora"] .text-center,
[data-template-id="seora-preview"] .text-center { text-align: center; }
[data-template-id="seora"] .ag-display,
[data-template-id="seora-preview"] .ag-display { font-family: "JetBrains Mono", "Frank Ruhl Libre", sans-serif; }
[data-template-id="seora"] .ag-card,
[data-template-id="seora-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="seora"] .ag-card:hover,
[data-template-id="seora-preview"] .ag-card:hover {
  transform: translateY(-9px) rotate(1.0499999999999998deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(15,23,42,0.16);
}
[data-template-id="seora"] .ag-ken,
[data-template-id="seora-preview"] .ag-ken { animation: seoraKen 19s ease-in-out infinite alternate; }
[data-template-id="seora"] .ag-float,
[data-template-id="seora-preview"] .ag-float { animation: seoraFloat 8s ease-in-out infinite; }
[data-template-id="seora"] .ag-pulse,
[data-template-id="seora-preview"] .ag-pulse { animation: seoraPulse 3.4s ease-in-out infinite; }
[data-template-id="seora"] .ag-scan,
[data-template-id="seora-preview"] .ag-scan { animation: seoraScan 12s linear infinite; }
[data-template-id="seora"] .ag-drift,
[data-template-id="seora-preview"] .ag-drift { animation: seoraDrift 13s ease-in-out infinite alternate; }
@keyframes seoraKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.082) translate3d(7px, 5px, 0); } }
@keyframes seoraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-13px); } }
@keyframes seoraPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 11px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes seoraScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes seoraDrift { from { transform: rotate(-2.6deg) translateY(0); } to { transform: rotate(2.6deg) translateY(-11px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="seora"] .ag-ken,
  [data-template-id="seora-preview"] .ag-ken,
  [data-template-id="seora"] .ag-float,
  [data-template-id="seora-preview"] .ag-float,
  [data-template-id="seora"] .ag-pulse,
  [data-template-id="seora-preview"] .ag-pulse,
  [data-template-id="seora"] .ag-scan,
  [data-template-id="seora-preview"] .ag-scan,
  [data-template-id="seora"] .ag-drift,
  [data-template-id="seora-preview"] .ag-drift { animation: none; }
}
`;
