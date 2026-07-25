export const launchoraEditorCss = `
@import url('https://fonts.googleapis.com/css2?family=Varela+Round:wght@400;500;600;700;800&family=Anton:wght@400;500;600;700;800;900&display=swap');
[data-template-id="launchora"], [data-template-id="launchora-preview"] {
  --p: #EF4444;
  --a: #FBBF24;
  --bg: #170B0B;
  --surface: #261111;
  --text: #FFF7ED;
  --muted: #FDBA74;
  --dark: #090303;
  font-family: "Varela Round", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="launchora"] .text-center,
[data-template-id="launchora-preview"] .text-center { text-align: center; }
[data-template-id="launchora"] .ag-display,
[data-template-id="launchora-preview"] .ag-display { font-family: "Anton", "Varela Round", sans-serif; }
[data-template-id="launchora"] .ag-card,
[data-template-id="launchora-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="launchora"] .ag-card:hover,
[data-template-id="launchora-preview"] .ag-card:hover {
  transform: translateY(-12px) rotate(-0.7deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
}
[data-template-id="launchora"] .ag-ken,
[data-template-id="launchora-preview"] .ag-ken { animation: launchoraKen 22s ease-in-out infinite alternate; }
[data-template-id="launchora"] .ag-float,
[data-template-id="launchora-preview"] .ag-float { animation: launchoraFloat 6s ease-in-out infinite; }
[data-template-id="launchora"] .ag-pulse,
[data-template-id="launchora-preview"] .ag-pulse { animation: launchoraPulse 3.1s ease-in-out infinite; }
[data-template-id="launchora"] .ag-scan,
[data-template-id="launchora-preview"] .ag-scan { animation: launchoraScan 15s linear infinite; }
[data-template-id="launchora"] .ag-drift,
[data-template-id="launchora-preview"] .ag-drift { animation: launchoraDrift 16s ease-in-out infinite alternate; }
@keyframes launchoraKen { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.094) translate3d(-10px, 3px, 0); } }
@keyframes launchoraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes launchoraPulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 14px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes launchoraScan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes launchoraDrift { from { transform: rotate(-3.2deg) translateY(0); } to { transform: rotate(3.2deg) translateY(-14px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="launchora"] .ag-ken,
  [data-template-id="launchora-preview"] .ag-ken,
  [data-template-id="launchora"] .ag-float,
  [data-template-id="launchora-preview"] .ag-float,
  [data-template-id="launchora"] .ag-pulse,
  [data-template-id="launchora-preview"] .ag-pulse,
  [data-template-id="launchora"] .ag-scan,
  [data-template-id="launchora-preview"] .ag-scan,
  [data-template-id="launchora"] .ag-drift,
  [data-template-id="launchora-preview"] .ag-drift { animation: none; }
}
`;
