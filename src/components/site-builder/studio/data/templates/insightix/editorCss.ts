export const insightixEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Suez+One:wght@400;500;600;700;800&family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700;800;900&display=swap');
[data-template-id="insightix"], [data-template-id="insightix"] {
  --p: #0F766E;
  --a: #F59E0B;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --muted: #475569;
  --dark: #0A1F1D;
  font-family: "Suez One", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="insightix"] .text-center,
[data-template-id="insightix"] .text-center { text-align: center; }
[data-template-id="insightix"] .ag-display,
[data-template-id="insightix"] .ag-display { font-family: "IBM Plex Sans Hebrew", "Suez One", sans-serif; }
[data-template-id="insightix"] .ag-card,
[data-template-id="insightix"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="insightix"] .ag-card:hover,
[data-template-id="insightix"] .ag-card:hover {
  transform: translateY(-14px) rotate(-0deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="insightix"] .ag-ken,
[data-template-id="insightix"] .ag-ken { animation: insightixKen 24s ease-in-out infinite alternate; }
[data-template-id="insightix"] .ag-float,
[data-template-id="insightix"] .ag-float { animation: insightixFloat 8s ease-in-out infinite; }
[data-template-id="insightix"] .ag-pulse,
[data-template-id="insightix"] .ag-pulse { animation: insightixPulse 2.5s ease-in-out infinite; }
[data-template-id="insightix"] .ag-scan,
[data-template-id="insightix"] .ag-scan { animation: insightixScan 17s linear infinite; }
[data-template-id="insightix"] .ag-drift,
[data-template-id="insightix"] .ag-drift { animation: insightixDrift 18s ease-in-out infinite alternate; }
@keyframes insightixKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.102) translate3d(-12px, 5px, 0); } }
@keyframes insightixFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
@keyframes insightixPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 16px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes insightixScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes insightixDrift { from { transform: rotate(-3.6deg) translateY(0); } to { transform: rotate(3.6deg) translateY(-16px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="insightix"] .ag-ken,
  [data-template-id="insightix"] .ag-ken,
  [data-template-id="insightix"] .ag-float,
  [data-template-id="insightix"] .ag-float,
  [data-template-id="insightix"] .ag-pulse,
  [data-template-id="insightix"] .ag-pulse,
  [data-template-id="insightix"] .ag-scan,
  [data-template-id="insightix"] .ag-scan,
  [data-template-id="insightix"] .ag-drift,
  [data-template-id="insightix"] .ag-drift { animation: none; }
}
`;
