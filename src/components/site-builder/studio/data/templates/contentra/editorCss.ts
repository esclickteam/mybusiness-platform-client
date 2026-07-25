export const contentraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;500;600;700;800&family=Libre+Baskerville:wght@400;500;600;700;800;900&display=swap');
[data-template-id="contentra"], [data-template-id="contentra-preview"] {
  --p: #7C2D12;
  --a: #EAB308;
  --bg: #FFF7ED;
  --surface: #FFFFFF;
  --text: #2B1608;
  --muted: #8A4B25;
  --dark: #1C0B03;
  font-family: "Noto Serif Hebrew", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="contentra"] .text-center,
[data-template-id="contentra-preview"] .text-center { text-align: center; }
[data-template-id="contentra"] .ag-display,
[data-template-id="contentra-preview"] .ag-display { font-family: "Libre Baskerville", "Noto Serif Hebrew", sans-serif; }
[data-template-id="contentra"] .ag-card,
[data-template-id="contentra-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="contentra"] .ag-card:hover,
[data-template-id="contentra-preview"] .ag-card:hover {
  transform: translateY(-10px) rotate(-0deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="contentra"] .ag-ken,
[data-template-id="contentra-preview"] .ag-ken { animation: contentraKen 20s ease-in-out infinite alternate; }
[data-template-id="contentra"] .ag-float,
[data-template-id="contentra-preview"] .ag-float { animation: contentraFloat 9s ease-in-out infinite; }
[data-template-id="contentra"] .ag-pulse,
[data-template-id="contentra-preview"] .ag-pulse { animation: contentraPulse 2.5s ease-in-out infinite; }
[data-template-id="contentra"] .ag-scan,
[data-template-id="contentra-preview"] .ag-scan { animation: contentraScan 13s linear infinite; }
[data-template-id="contentra"] .ag-drift,
[data-template-id="contentra-preview"] .ag-drift { animation: contentraDrift 14s ease-in-out infinite alternate; }
@keyframes contentraKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.086) translate3d(-8px, 6px, 0); } }
@keyframes contentraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes contentraPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes contentraScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes contentraDrift { from { transform: rotate(-2.8deg) translateY(0); } to { transform: rotate(2.8deg) translateY(-12px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="contentra"] .ag-ken,
  [data-template-id="contentra-preview"] .ag-ken,
  [data-template-id="contentra"] .ag-float,
  [data-template-id="contentra-preview"] .ag-float,
  [data-template-id="contentra"] .ag-pulse,
  [data-template-id="contentra-preview"] .ag-pulse,
  [data-template-id="contentra"] .ag-scan,
  [data-template-id="contentra-preview"] .ag-scan,
  [data-template-id="contentra"] .ag-drift,
  [data-template-id="contentra-preview"] .ag-drift { animation: none; }
}
`;
